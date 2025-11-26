#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import logging
from fastapi import FastAPI , File , UploadFile , Form , HTTPException
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from dotenv import load_dotenv
from pydantic import BaseModel , EmailStr
from postgrest.exceptions import APIError
from supabase_auth.errors import AuthApiError
from Schema import ProductCreate , CategoryCreate
from Models import slugify
from fastapi.encoders import jsonable_encoder


# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Cấu hình CORS để frontend gọi API được
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cấu hình Supabase
load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


@app.get("/")
def root():
    return {"message": "FastAPI + Supabase running!"}

@app.get("/test")
def test():
    logger.info("Test endpoint called")
    return {"status": "ok", "message": "Backend is running"}


# ---------- Pydantic schema ----------
class LoginIn(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: int
    auth_id: str
    name: str
    email: str
    role: str

class RegisterIn(BaseModel):
    name: str
    email: EmailStr
    password: str
    confirm_password: str

# ===== BODY MODEL =====
class EmailCheck(BaseModel):
    email: str


# ===== API CHECK EMAIL =====
@app.post("/api/check-email")
async def check_email(payload: EmailCheck):
    email = payload.email

    try:
        # Query bảng users trong Supabase
        response = supabase.table("users").select("*").eq("email", email).execute()

        if not response.data:
            return {"exists": False}

        # Lấy user
        user = response.data[0]

        return {
            "exists": True,
            "name": user.get("name"),
            "role": user.get("role"),  # "buyer" | "seller"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
# ---------- Login endpoint ----------
@app.post("/login", response_model=UserOut)
def login(data: LoginIn):
    try:
        logger.info(f"Login attempt: {data.email}")
        
        # Đăng nhập bằng Supabase Auth (sử dụng sign_in_with_password)
        logger.info("Calling Supabase Auth sign_in_with_password...")
        auth_response = supabase.auth.sign_in_with_password({
            "email": data.email,
            "password": data.password
        })
        logger.info("Supabase Auth response received")
        
        auth_user = auth_response.user

        if not auth_user:
            logger.warning(f"Auth user not found for {data.email}")
            raise HTTPException(status_code=401, detail="Invalid credentials")

        logger.info(f"Auth successful, auth_id: {auth_user.id}")
        
        # Lấy user info từ database
        logger.info(f"Querying database for user: {data.email}")
        db_response = supabase.table("users").select("*").eq("email", data.email).execute()
        logger.info(f"Database query returned {len(db_response.data) if db_response.data else 0} results")
        
        if not db_response.data or len(db_response.data) == 0:
            logger.warning(f"User not found in database: {data.email}")
            raise HTTPException(status_code=404, detail="User not found in database")

        user = db_response.data[0]
        logger.info(f"Login successful for user: {user['email']}")

        return {
            "id": user["id"],
            "auth_id": user["auth_id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    
    except AuthApiError as e:
        logger.error(f"AuthApiError: {str(e)}")
        error_msg = str(e)
        if "Invalid login credentials" in error_msg or "invalid" in error_msg.lower():
            raise HTTPException(status_code=401, detail="Invalid email or password")
        else:
            raise HTTPException(status_code=401, detail=f"Login failed: {error_msg}")
    
    except HTTPException:
        raise
    
    except Exception as e:
        logger.error(f"Unexpected error in login: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

# ---------- Register endpoint ----------
@app.post("/register", response_model=UserOut)
def register(user_data: RegisterIn):
    # Confirm password
    if user_data.password != user_data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    try:
        # Tạo user bằng Supabase Auth
        auth_response = supabase.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password
        })
        auth_user = auth_response.user  # user.id là UUID
        if auth_response.user is None:
            raise HTTPException(status_code=400, detail="Cannot create user. Maybe email already exists.")

        # Lưu thêm thông tin vào bảng users
        db_response = supabase.table("users").insert({
            "auth_id": auth_user.id,  # id từ Supabase Auth
            "name": user_data.name,  # Lấy từ input RegisterIn
            "email": user_data.email,
            "password": "",  # Password được quản lý bởi Supabase Auth, để trống
            "role": "buyer"  # Giá trị được phép theo check constraint
        }).execute()

        # Kiểm tra nếu có dữ liệu trả về
        if not db_response.data or len(db_response.data) == 0:
            raise HTTPException(status_code=500, detail="Failed to create user in database")

        new_user = db_response.data[0]
        
        # Mark user as verified trong auth.users table
        logger.info(f"Marking email as confirmed for user: {user_data.email}")
        try:
            # Update auth.users table directly
            supabase.table("auth.users").update({
                "email_confirmed_at": "now()"
            }).eq("id", auth_user.id).execute()
            logger.info(f"Email confirmed for user: {user_data.email}")
        except Exception as e:
            logger.warning(f"Could not confirm email: {str(e)}")
        
        return {
            "id": new_user["id"],
            "auth_id": new_user["auth_id"],
            "name": new_user["name"],
            "email": new_user["email"],
            "role": new_user["role"]
        }
    
    except AuthApiError as e:
        # Handle Supabase Auth errors (rate limit, invalid credentials, etc)
        error_msg = str(e)
        if "7 seconds" in error_msg or "rate" in error_msg.lower():
            raise HTTPException(status_code=429, detail="Too many requests. Please wait 7 seconds before trying again.")
        elif "already exists" in error_msg.lower():
            raise HTTPException(status_code=400, detail="Email already registered.")
        else:
            raise HTTPException(status_code=400, detail=f"Registration failed: {error_msg}")
    
    except APIError as e:
        # Handle database errors
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
    except HTTPException:
        # Re-raise HTTPException
        raise
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
    

#================================API user==========================
@app.get("/seller/by-user/{user_id}")
async def get_seller_by_user(user_id: int):

    result = supabase.table("sellers").select("*").eq("user_id", user_id).execute()


    # Trường hợp query không có dòng nào
    if len(result.data) == 0:
        return {
            "exists": False,
            "seller_id": None
        }

    # Có seller
    return {
        "exists": True,
        "seller_id": result.data[0]["id"]
    }

@app.get("/users/{user_id}")
async def get_user_by_id(user_id: int):
    result = (
        supabase.table("users")
        .select("*")
        .eq("id", user_id)
        .maybe_single()
        .execute()
    )
    return result.data


from fastapi import HTTPException

@app.put("/user/{user_id}/role")
async def update_user_role(user_id: int):
    try:
        result = (
            supabase.table("users")
            .update({"role": "seller"})
            .eq("id", user_id)
            .execute()
        )

        # Nếu không update được
        if len(result.data) == 0:
            raise HTTPException(status_code=404, detail="User not found")

        return {
            "success": True,
            "message": "Role updated to seller",
            "data": result.data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


#==========seller==========
@app.post("/seller/create")
async def create_seller(payload: dict):
    user_id = payload.get("user_id")
    # nếu chưa tồn tại → tạo mới
    new_seller = supabase.table("sellers").insert({
        "user_id": user_id,
        "shop_name": f"Shop_{user_id}"
    }).execute()

    return {
        "exists": False,
        "seller_id": new_seller.data[0]["id"]
    }

@app.get("/orders/seller/{seller_id}")
async def get_orders_by_seller(seller_id: int):
    try:
        response = (
            supabase.table("orders")
            .select("*")
            .eq("seller_id", seller_id)
            .order("created_at", desc=True)
            .execute()
        )

        if response.data is None:
            return {
                "success": False,
                "orders": [],
                "message": "Không tìm thấy đơn hàng nào."
            }

        return {
            "success": True,
            "orders": response.data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/orders/shipping_address/{shipping_address_id}")
async def get_shipping_address_by_id(shipping_address_id: int):
    try:
        response = (
            supabase.table("shipping_addresses")
            .select("*")
            .eq("id", shipping_address_id)
            .maybe_single()
            .execute()
        )

        if response.data is None:
            return {
                "success": False,
                "message": "Không tìm thấy địa chỉ giao hàng."
            }

        return {
            "success": True,
            "shipping_address": response.data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.get("/orders/payments/{order_id}")
async def get_payment_method_by_order_id(order_id: int):
    try:
        response = (
            supabase.table("payments")
            .select("*")
            .eq("order_id", order_id)
            .maybe_single()
            .execute()
        )

        if response.data is None:
            return {
                "success": False,
                "message": "Không tìm thấy thông tin thanh toán."
            }

        return {
            "success": True,
            "payment_method": response.data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/orders/orderDetails/{order_id}")
async def get_order_details_by_order_id(order_id: int ):
    try:
        response = (
            supabase.table("orders")
            .select("""
                *,
                shipping_addresses(*),
                payments(*)
            """)
            .eq("id", order_id)
            .single()
            .execute()
        )
        if response.data is None:
            return {
                "success": False,
                "order_details": [],
                "message": "Không tìm thấy chi tiết đơn hàng."
            }

        return {
            "success": True,
            "order_details": response.data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

#===============API Product ==================
@app.post("/products/create")
async def create_product(data : ProductCreate):
    try:
        # Tạo product
        product_data = {
            "name": data.name,
            "description": data.description,
            #"category_id": data.category_id,
            "seller_id": data.seller_id
        }
        product_response = supabase.table("products").insert(product_data).execute()
        product_id = product_response.data[0]["id"]

        # Tạo options và option values
        for option in data.options:
            option_data = {
                "product_id": product_id,
                "name": option.name
            }
            option_response = supabase.table("product_options").insert(option_data).execute()
            option_id = option_response.data[0]["id"]

            for value in option.values:
                option_value_data = {
                    "option_id": option_id,
                    "value": value.value
                }
                supabase.table("product_option_values").insert(option_value_data).execute()

        # Tạo variants
        for variant in data.variants:
            variant_data = {
                "product_id": product_id,
                "option_combination": variant.option_combination,
                "price": variant.price,
                "stock": variant.stock,
                "sku": variant.sku
            }
            supabase.table("product_variants").insert(variant_data).execute()

        

        return {"message": "Product created successfully", "product_id": product_id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/upload-product-images/")
async def upload_product_images(
    product_id: int = Form(...),           # gửi kèm product_id
    files: List[UploadFile] = File(...),   # upload nhiều file
):
    saved_files = []

    for file in files:
        file_path = f"products/{product_id}/{file.filename}"
        contents = await file.read()  # đọc nội dung file

        # Upload vào bucket "product-images"
        response = supabase.storage.from_("product-images").upload(
            file_path, contents, {"upsert": True}
        )
        if response.get("error"):
            return {"error": response["error"]}

        # Lấy public URL
        public_url_response = supabase.storage.from_("product-images").get_public_url(file_path)
        if public_url_response.get("error"):
            return {"error": public_url_response["error"]}
        public_url = public_url_response["publicUrl"]

        # Lưu vào bảng product_images
        insert_response = supabase.table("product_images").insert({
            "product_id": product_id,
            "url": public_url
        }).execute()

        if insert_response.get("error"):
            return {"error": insert_response["error"]}

        saved_files.append(public_url)

    return {"uploaded": saved_files}


#=========== API Category ==============
@app.get("/categories/")
async def get_all_categories():
    try:
        response = supabase.table("categories").select("*").execute()
        return {"categories": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 
    

@app.post("/categories/create")
async def create_category(payload: CategoryCreate):
    try:
        # Tạo slug từ name (bỏ dấu tiếng Việt)
        try:
            slug = slugify(payload.name)
        except Exception as slug_err:
            print(f"Slugify error: {slug_err}, using name as slug")
            slug = payload.name.lower().replace(" ", "-")

        # Lấy level từ parent
        level = 1
        if payload.parent_id:
            parent = supabase.table("categories").select("level").eq("id", payload.parent_id).single().execute()
            if parent.data:
                level = parent.data["level"] + 1

        insert_data = {
            "name": payload.name,
            "slug": slug,
            "parent_id": payload.parent_id,
            "level": level,
            "sort_order": payload.sort_order,
            "status": payload.status,
        }

        response = supabase.table("categories").insert(insert_data).execute()
        print(response)
        return {"message": "Category created", "category": response.data}

    except Exception as e:
        print("ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/categories/tree")
async def get_category_tree():
    try:
        response = supabase.table("categories").select("*").order("sort_order").execute()
        categories = response.data

        def build_tree(parent_id=None):
            return [
                {
                    **cat,
                    "children": build_tree(cat["id"])
                }
                for cat in categories if cat["parent_id"] == parent_id
            ]

        return {"tree": build_tree(None)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




async def get_all_descendants(category_id: int):
    to_delete = [category_id]
    queue = [category_id]

    while queue:
        current = queue.pop(0)

        # Lấy các con trực tiếp
        children = (
            supabase.table("categories")
            .select("id")
            .eq("parent_id", current)
            .execute()
            .data
        )

        for child in children:
            child_id = child["id"]
            to_delete.append(child_id)
            queue.append(child_id)

    return to_delete


@app.delete("/categories/{cat_id}")
async def delete_category(cat_id: int):
    try:
        supabase.table("categories").delete().eq("id", cat_id).execute()
        return {"message": "Category deleted with cascade"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


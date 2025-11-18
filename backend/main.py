from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from dotenv import load_dotenv
import os
from pydantic import BaseModel , EmailStr
from fastapi import HTTPException
from postgrest.exceptions import APIError
from supabase_auth.errors import AuthApiError
import logging

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

@app.get("/users")
def get_users():
    response = supabase.table("users").select("*").execute()
    return response.data

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
# ---------- API Endpoints ----------
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
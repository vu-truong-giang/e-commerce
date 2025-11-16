from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from dotenv import load_dotenv
import os
app = FastAPI()

# Cấu hình Supabase
load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Cấu hình CORS để frontend gọi API được
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # sau này có thể chỉ cho phép frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "FastAPI + Supabase running!"}


@app.get("/users")
def get_users():
    res = supabase.table("users").select("*").execute()
    return res.data
@app.get("/products")
def get_products():
    res = supabase.table("products").select("*").execute()
    return res.data
@app.get("/orders")
def get_orders():
    res = supabase.table("orders").select("*").execute()
    return res.data
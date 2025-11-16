# E-Commerce Project

## 📌 Giới thiệu
Project E-Commerce gồm **frontend (React + Vite)** và **backend (FastAPI)**.  
Sử dụng **Supabase** làm cơ sở dữ liệu và lưu trữ ảnh.

- Frontend: React + Vite  
- Backend: FastAPI + Uvicorn  
- Database & Storage: Supabase

---

## ⚙️ Cài đặt

### 1. Clone project
```bash
git clone <repository-url>
cd e-commerce-1

###2. Cài đặt dependencies

Chạy 1 lệnh cài tất cả:

npm run install:all


⚠️ Yêu cầu: Python >= 3.13, Node.js >= 18

install:frontend → cài npm packages cho frontend

install:backend → cài Python packages backend từ requirements.txt

Chạy đồng thời cả frontend và backend:

npm run dev


Frontend: http://localhost:5173/

Backend: http://localhost:8000

Docs FastAPI: http://localhost:8000/docs

Vite và Uvicorn chạy cùng lúc nhờ concurrently.
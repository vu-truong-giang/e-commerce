from pydantic import BaseModel
from typing import List, Optional, Dict

class OptionValueCreate(BaseModel):
    value: str

class OptionCreate(BaseModel):
    name: str
    values: List[OptionValueCreate] = []

class VariantCreate(BaseModel):
    option_combination: Dict[str, str]
    price: float
    stock: int
    sku: Optional[str] = None

class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    #category_id: int
    seller_id: int
    options: List[OptionCreate] = []
    variants: List[VariantCreate] = []
    #images: List[str] = []


# ===================category schemas=======================
class CategoryCreate(BaseModel):
    name: str
    parent_id: Optional[int] = None
    sort_order: Optional[int] = 0
    status: Optional[str] = "active"

class Category(BaseModel):
    id : int 
    name : str 
    slug : str 
    parent_id : Optional[int]
    level : int 
    sort_order : int
    status : str

    class Config:
        orm_mode = True
# ===================category schemas=======================

# backend/schemas.py
from pydantic import BaseModel
from typing import Optional

# Esquema base con campos compartidos
class ProductBase(BaseModel):
    nombre: str
    categoria: str
    precio: float
    stock: int
    imagen_url: Optional[str] = None
    descripcion: Optional[str] = None
    proteina_g: float = 0.0
    azucar_g: float = 0.0
    es_deslactosado: bool = False
    calorias: float = 0.0

# Esquema para crear producto
class ProductCreate(ProductBase):
    pass

# Esquema para responder al frontend (incluye el ID de la base de datos)
class ProductResponse(ProductBase):
    id: int

    class Config:
        from_attributes = True
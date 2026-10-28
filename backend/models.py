# backend/models.py
from sqlalchemy import Column, Integer, String, Float, Boolean, Text
from database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_order=True, primary_key=True, index=True)
    nombre = Column(String(150), nullable=False, index=True)
    categoria = Column(String(50), nullable=False)  # Ej: Lácteos, Panadería, Frutas
    precio = Column(Float, nullable=False)
    stock = Column(Integer, default=0)
    imagen_url = Column(String(300), nullable=True)
    
    # Campos nutricionales para que la IA/Chatbot los consulte
    descripcion = Column(Text, nullable=True) # Ej: "Yogurt griego natural sin azucar"
    proteina_g = Column(Float, default=0.0)    # Ej: 11.0
    azucar_g = Column(Float, default=0.0)      # Ej: 0.0
    es_deslactosado = Column(Boolean, default=False)
    calorias = Column(Float, default=0.0)
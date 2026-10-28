from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
from database import engine, get_db

# Crear las tablas en la base de datos al iniciar
models.Base.metadata.create_all(bind=engine)
app = FastAPI(title="E-Commerce Supermercado API")

# Permitir peticiones desde el frontend de React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Puerto por defecto de Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"mensaje": "API del Supermercado funcionando correctamente"}

# Obtener todos los productos
@app.get("/products", response_model=List[schemas.ProductResponse])
def get_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()

# Endpoint conveniente para poblar tu base de datos con datos de ejemplo
@app.post("/seed-products")
def seed_products(db: Session = Depends(get_db)):
    # Si ya hay productos, no vuelve a crearlos
    if db.query(models.Product).first():
        return {"mensaje": "La base de datos ya contiene productos."}

    ejemplos = [
        models.Product(
            nombre="Yogurt Griego Vitalí",
            categoria="Lácteos",
            precio=28.50,
            stock=15,
            imagen_url="https://via.placeholder.com/150",
            descripcion="Yogurt estilo griego alto en proteína sin azúcar añadida",
            proteina_g=11.0,
            azucar_g=0.0,
            es_deslactosado=True,
            calorias = 321.5
        ),
        models.Product(
            nombre="Yogurt Fresa Tradicional",
            categoria="Lácteos",
            precio=18.00,
            stock=20,
            imagen_url="https://via.placeholder.com/150",
            descripcion="Yogurt sabor fresa endulzado con azúcar",
            proteina_g=3.5,
            azucar_g=18.0,
            es_deslactosado=False,
            calorias = 128.8
        ),
        models.Product(
            nombre="Leche Entera 1L",
            categoria="Lácteos",
            precio=26.00,
            stock=30,
            imagen_url="https://via.placeholder.com/150",
            descripcion="Leche pasteurizada entera de vaca",
            proteina_g=8.0,
            azucar_g=12.0,
            es_deslactosado=False,
            calorias = 215.5
        )
    ]

    db.add_all(ejemplos)
    db.commit()
    return {"mensaje": "Productos de prueba agregados exitosamente!"}
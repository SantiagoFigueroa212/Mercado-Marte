# backend/main.py
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

import models
import schemas
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="E-Commerce Supermercado API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"mensaje": "API de Supermercado lista"}

# 1. Obtener productos con búsqueda por nombre y filtro por categoría (opcionales)
@app.get("/products", response_model=List[schemas.ProductResponse])
def get_products(
    search: Optional[str] = None, 
    category: Optional[str] = None, 
    db: Session = Depends(get_db)
):
    query = db.query(models.Product)
    
    # Filtrar por búsqueda en el nombre si el usuario escribió algo
    if search:
        query = query.filter(models.Product.nombre.ilike(f"%{search}%"))
        
    # Filtrar por categoría si se seleccionó una
    if category and category != "Todas":
        query = query.filter(models.Product.categoria == category)
        
    return query.all()

# 2. URL Dinámica para obtener las categorías únicas existentes
@app.get("/categories", response_model=List[str])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(models.Product.categoria).distinct().all()
    return [c[0] for c in categories if c[0]]

# 3. URL Dinámica en FastAPI para un solo producto por su ID
@app.get("/products/{product_id}", response_model=schemas.ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return product

# Endpoint para sembrar productos de prueba
@app.post("/seed-products")
def seed_products(db: Session = Depends(get_db)):
    if db.query(models.Product).first():
        return {"mensaje": "La base de datos ya contiene productos."}

    ejemplos = [
        models.Product(
            nombre="Yogurt Griego Natural Vitalí",
            categoria="Lácteos",
            precio=28.50,
            stock=25,
            imagen_url="https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400",
            descripcion="Yogurt estilo griego natural alto en proteína sin azúcar añadida.",
            proteina_g=11.0,
            azucar_g=0.0,
            es_deslactosado=True,
            calorias=90.0
        ),
        models.Product(
            nombre="Yogurt Fresa Tradicional",
            categoria="Lácteos",
            precio=18.00,
            stock=30,
            imagen_url="https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=400",
            descripcion="Yogurt cremoso sabor fresa endulzado con azúcar de caña.",
            proteina_g=3.5,
            azucar_g=18.0,
            es_deslactosado=False,
            calorias=140.0
        ),
        models.Product(
            nombre="Leche Entera 1L",
            categoria="Lácteos",
            precio=26.00,
            stock=40,
            imagen_url="https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400",
            descripcion="Leche pasteurizada entera de vaca rica en calcio.",
            proteina_g=8.0,
            azucar_g=12.0,
            es_deslactosado=False,
            calorias=150.0
        ),
        models.Product(
            nombre="Leche Deslactosada Light 1L",
            categoria="Lácteos",
            precio=28.00,
            stock=35,
            imagen_url="https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400",
            descripcion="Leche de fácil digestión, baja en grasa y cero lactosa.",
            proteina_g=8.5,
            azucar_g=11.0,
            es_deslactosado=True,
            calorias=110.0
        ),
        models.Product(
            nombre="Queso Panela Fresco 400g",
            categoria="Lácteos",
            precio=58.00,
            stock=18,
            imagen_url="https://images.unsplash.com/photo-1589883661923-6476cb0ae9f2?w=400",
            descripcion="Queso panela fresco artesanal, bajo en grasa y sodio.",
            proteina_g=18.0,
            azucar_g=1.0,
            es_deslactosado=False,
            calorias=200.0
        ),
        models.Product(
            nombre="Huevo Blanco 12pzas",
            categoria="Lácteos",
            precio=44.00,
            stock=50,
            imagen_url="https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400",
            descripcion="Huevo fresco de gallina de libre pastoreo rico en proteína.",
            proteina_g=13.0,
            azucar_g=0.5,
            es_deslactosado=True,
            calorias=140.0
        ),

        # PANADERÍA Y CEREALES
        models.Product(
            nombre="Pan Integral Multigrano",
            categoria="Panadería",
            precio=42.00,
            stock=20,
            imagen_url="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400",
            descripcion="Pan de caja elaborado con granos enteros, linaza y alta fibra.",
            proteina_g=5.0,
            azucar_g=2.0,
            es_deslactosado=True,
            calorias=120.0
        ),
        models.Product(
            nombre="Avena Natural en Hojuelas 500g",
            categoria="Panadería",
            precio=25.00,
            stock=40,
            imagen_url="https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400",
            descripcion="Hojuelas de avena grano entero sin azúcares ni conservantes.",
            proteina_g=13.0,
            azucar_g=1.0,
            es_deslactosado=True,
            calorias=370.0
        ),
        models.Product(
            nombre="Cereal de Maíz Azucarado 350g",
            categoria="Panadería",
            precio=48.00,
            stock=15,
            imagen_url="https://images.unsplash.com/photo-1521483451569-e33803c0330c?w=400",
            descripcion="Hojuelas de maíz crujientes escarchadas con azúcar.",
            proteina_g=2.0,
            azucar_g=35.0,
            es_deslactosado=True,
            calorias=380.0
        ),

        # FRUTAS Y VERDURAS
        models.Product(
            nombre="Manzana Red Delicious 1kg",
            categoria="Frutas y Verduras",
            precio=39.90,
            stock=60,
            imagen_url="https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400",
            descripcion="Manzanas rojas frescas, jugosas y ricas en antioxidantes.",
            proteina_g=0.3,
            azucar_g=14.0,
            es_deslactosado=True,
            calorias=52.0
        ),
        models.Product(
            nombre="Plátano Tabasco 1kg",
            categoria="Frutas y Verduras",
            precio=22.50,
            stock=70,
            imagen_url="https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400",
            descripcion="Plátano fresco rico en potasio y energía natural.",
            proteina_g=1.1,
            azucar_g=12.0,
            es_deslactosado=True,
            calorias=89.0
        ),
        models.Product(
            nombre="Espinaca Baby Orgánica 250g",
            categoria="Frutas y Verduras",
            precio=32.00,
            stock=25,
            imagen_url="https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400",
            descripcion="Hojas de espinaca baby lavadas, desinfectadas y ricas en hierro.",
            proteina_g=2.9,
            azucar_g=0.4,
            es_deslactosado=True,
            calorias=23.0
        ),

        # CARNES Y PESCADOS
        models.Product(
            nombre="Pechuga de Pollo Deshuesada 1kg",
            categoria="Carnes",
            precio=125.00,
            stock=30,
            imagen_url="https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400",
            descripcion="Pechuga de pollo magra sin piel ni hueso, ultra alta en proteína.",
            proteina_g=31.0,
            azucar_g=0.0,
            es_deslactosado=True,
            calorias=165.0
        ),
        models.Product(
            nombre="Filete de Salmón Fresco 500g",
            categoria="Carnes",
            precio=210.00,
            stock=12,
            imagen_url="https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400",
            descripcion="Filete de salmón fresco rico en ácidos grasos Omega-3.",
            proteina_g=20.0,
            azucar_g=0.0,
            es_deslactosado=True,
            calorias=208.0
        ),
        models.Product(
            nombre="Atún en Agua en Lata 140g",
            categoria="Carnes",
            precio=21.50,
            stock=80,
            imagen_url="https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=400",
            descripcion="Lomo de atún aleta amarilla en agua, sin conservadores.",
            proteina_g=24.0,
            azucar_g=0.0,
            es_deslactosado=True,
            calorias=116.0
        ),

        # BEBIDAS Y SNACKS
        models.Product(
            nombre="Agua Mineral Natural 1.5L",
            categoria="Bebidas",
            precio=16.00,
            stock=100,
            imagen_url="https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=400",
            descripcion="Agua de manantial carbonatada cero calorías sin azúcar.",
            proteina_g=0.0,
            azucar_g=0.0,
            es_deslactosado=True,
            calorias=0.0
        ),
        models.Product(
            nombre="Jugo de Naranja 100% Natural 1L",
            categoria="Bebidas",
            precio=35.00,
            stock=22,
            imagen_url="https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400",
            descripcion="Jugo prensado en frío sin azúcar añadida rica en Vitamina C.",
            proteina_g=0.7,
            azucar_g=20.0,
            es_deslactosado=True,
            calorias=110.0
        ),
        models.Product(
            nombre="Refresco de Cola Sin Azúcar 600ml",
            categoria="Bebidas",
            precio=17.50,
            stock=65,
            imagen_url="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400",
            descripcion="Bebida refrescante sabor cola cero calorías sin azúcar.",
            proteina_g=0.0,
            azucar_g=0.0,
            es_deslactosado=True,
            calorias=0.0
        ),
        models.Product(
            nombre="Almendras Tostadas Sin Sal 200g",
            categoria="Snacks",
            precio=65.00,
            stock=40,
            imagen_url="https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=400",
            descripcion="Almendras naturales tostadas ideales para snacks saludables.",
            proteina_g=21.0,
            azucar_g=4.0,
            es_deslactosado=True,
            calorias=579.0
        ),
        models.Product(
            nombre="Barra de Proteína Chocolate 60g",
            categoria="Snacks",
            precio=38.00,
            stock=35,
            imagen_url="https://images.unsplash.com/photo-1622484210800-4b13645b40d6?w=400",
            descripcion="Barra energética con 20g de proteína de suero y baja en azúcar.",
            proteina_g=20.0,
            azucar_g=1.5,
            es_deslactosado=True,
            calorias=210.0
        )
    ]

    db.add_all(ejemplos)
    db.commit()
    return {"mensaje": "Productos de prueba agregados exitosamente!"}
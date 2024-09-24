from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import models
import schemas
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


# POST /create
@app.post("/create")
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = models.User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"success": True, "result": {"id": db_user.id}}


# GET /get
@app.get("/get")
def get_users(role: str = None, db: Session = Depends(get_db)):
    if role:
        users = db.query(models.User).filter(models.User.role == role).all()
    else:
        users = db.query(models.User).all()

    result = [{"id": user.id, "full_name": user.full_name, "role": user.role, "efficiency": user.efficiency} for user in
              users]

    return {"success": True, "result": {"users": result}}


# GET /get/{user_id}
@app.get("/get/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    result = {
        "id": user.id,
        "full_name": user.full_name,
        "role": user.role,
        "efficiency": user.efficiency
    }
    return {"success": True, "result": {"users": [result]}}


# PATCH /update/{user_id}
@app.patch("/update/{user_id}")
def update_user(user_id: int, user_update: schemas.UserUpdate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Обновляем только те поля, которые были переданы
    update_data = user_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)

    result = {
        "id": user.id,
        "full_name": user.full_name,
        "role": user.role,
        "efficiency": user.efficiency
    }

    return {"success": True, "result": result}



# DELETE /delete/{user_id}
@app.delete("/delete/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    result = {
        "id": user.id,
        "full_name": user.full_name,
        "role": user.role,
        "efficiency": user.efficiency
    }

    db.delete(user)
    db.commit()
    return {"success": True, "result": result}


# DELETE /delete
@app.delete("/delete")
def delete_all_users(db: Session = Depends(get_db)):
    db.query(models.User).delete()
    db.commit()
    return {"success": True}

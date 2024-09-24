from pydantic import BaseModel


class UserCreate(BaseModel):
    full_name: str
    role: str
    efficiency: int


class UserUpdate(BaseModel):
    full_name: str = None
    role: str = None
    efficiency: int = None


class UserResponse(BaseModel):
    id: int
    full_name: str
    role: str
    efficiency: int

    class Config:
        orm_mode = True
        from_attributes = True

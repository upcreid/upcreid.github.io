# FastAPI Cheat Sheet

## Overview

FastAPI is a modern, high-performance web framework for building APIs with Python based on standard Python type hints.

**Key Features:**
- Fast performance (comparable to NodeJS and Go)
- Easy to learn and use
- Automatic interactive API documentation (Swagger UI & ReDoc)
- Built-in data validation with Pydantic
- Async/await support
- Type hints for editor support

## Installation

### Basic Installation
```bash
pip install fastapi

# Also install ASGI server (Uvicorn)
pip install "uvicorn[standard]"
```

### With Optional Dependencies
```bash
# Complete installation with all optional dependencies
pip install "fastapi[all]"
```

### Requirements File
```txt
fastapi==0.110.0
uvicorn[standard]==0.27.0
pydantic==2.6.0
python-multipart==0.0.9  # For form data
python-jose[cryptography]==3.3.0  # For JWT
passlib[bcrypt]==1.7.4  # For password hashing
```

## Basic Application

### Minimal Example
```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello World"}
```

### Run the Application
```bash
# Development server with auto-reload
uvicorn main:app --reload

# Specify host and port
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Production
uvicorn main:app --workers 4
```

### Access Documentation
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- OpenAPI schema: http://localhost:8000/openapi.json

## Path Operations

### HTTP Methods

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/items")
def read_items():
    return {"method": "GET"}

@app.post("/items")
def create_item():
    return {"method": "POST"}

@app.put("/items/{item_id}")
def update_item(item_id: int):
    return {"method": "PUT", "item_id": item_id}

@app.patch("/items/{item_id}")
def partial_update_item(item_id: int):
    return {"method": "PATCH", "item_id": item_id}

@app.delete("/items/{item_id}")
def delete_item(item_id: int):
    return {"method": "DELETE", "item_id": item_id}

@app.options("/items")
def options_items():
    return {"method": "OPTIONS"}

@app.head("/items")
def head_items():
    return {"method": "HEAD"}
```

### Path Parameters

```python
@app.get("/items/{item_id}")
def read_item(item_id: int):
    return {"item_id": item_id}

# With type validation
@app.get("/users/{user_id}")
def read_user(user_id: int):
    return {"user_id": user_id}

# String path parameter
@app.get("/items/{item_name}")
def read_item_by_name(item_name: str):
    return {"item_name": item_name}

# Enum path parameter
from enum import Enum

class ModelName(str, Enum):
    alexnet = "alexnet"
    resnet = "resnet"
    lenet = "lenet"

@app.get("/models/{model_name}")
def get_model(model_name: ModelName):
    if model_name == ModelName.alexnet:
        return {"model_name": model_name, "message": "Deep Learning"}
    return {"model_name": model_name}

# Path parameter with path
@app.get("/files/{file_path:path}")
def read_file(file_path: str):
    return {"file_path": file_path}
```

### Query Parameters

```python
from typing import Optional

# Optional query parameter
@app.get("/items/")
def read_items(skip: int = 0, limit: int = 10):
    return {"skip": skip, "limit": limit}

# Optional with None default
@app.get("/items/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
    if q:
        return {"item_id": item_id, "q": q}
    return {"item_id": item_id}

# Required query parameter
@app.get("/items/{item_id}")
def read_item(item_id: int, q: str):
    return {"item_id": item_id, "q": q}

# Boolean query parameter
@app.get("/items/")
def read_items(skip: int = 0, limit: int = 10, short: bool = False):
    items = [{"item_id": i} for i in range(skip, skip + limit)]
    if short:
        return {"items": items}
    return {"items": items, "total": 100}

# Multiple query parameters
@app.get("/items/")
def read_items(
    skip: int = 0,
    limit: int = 10,
    q: Optional[str] = None,
    sort: Optional[str] = None
):
    return {"skip": skip, "limit": limit, "q": q, "sort": sort}
```

## Request Body

### Pydantic Models

```python
from pydantic import BaseModel, Field
from typing import Optional

class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = None

@app.post("/items/")
def create_item(item: Item):
    return {"item": item}

# With Field validation
class ItemValidated(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    description: Optional[str] = Field(None, max_length=300)
    price: float = Field(..., gt=0, description="Price must be greater than 0")
    tax: Optional[float] = Field(None, ge=0, le=100)

@app.post("/items-validated/")
def create_validated_item(item: ItemValidated):
    return {"item": item}

# Nested models
class Image(BaseModel):
    url: str
    name: str

class ItemWithImages(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    images: Optional[list[Image]] = None

@app.post("/items-with-images/")
def create_item_with_images(item: ItemWithImages):
    return {"item": item}
```

### Multiple Body Parameters

```python
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    price: float

class User(BaseModel):
    username: str
    email: str

@app.put("/items/{item_id}")
def update_item(item_id: int, item: Item, user: User):
    return {"item_id": item_id, "item": item, "user": user}

# Body with singular value
from fastapi import Body

@app.put("/items/{item_id}")
def update_item(
    item_id: int,
    item: Item,
    user: User,
    importance: int = Body(...)
):
    return {"item_id": item_id, "item": item, "user": user, "importance": importance}
```

## Validation

### Query Parameter Validation

```python
from fastapi import Query
from typing import Optional, List

# String validation
@app.get("/items/")
def read_items(
    q: Optional[str] = Query(None, min_length=3, max_length=50)
):
    return {"q": q}

# Regex validation
@app.get("/items/")
def read_items(
    q: Optional[str] = Query(None, regex="^fixedquery$")
):
    return {"q": q}

# List query parameters
@app.get("/items/")
def read_items(
    q: Optional[List[str]] = Query(None)
):
    return {"q": q}

# Required query parameter
@app.get("/items/")
def read_items(
    q: str = Query(..., min_length=3)
):
    return {"q": q}

# With metadata
@app.get("/items/")
def read_items(
    q: Optional[str] = Query(
        None,
        title="Query string",
        description="Query string for searching items",
        min_length=3,
        max_length=50,
        deprecated=False
    )
):
    return {"q": q}
```

### Path Parameter Validation

```python
from fastapi import Path

@app.get("/items/{item_id}")
def read_item(
    item_id: int = Path(..., title="The ID of the item", ge=1, le=1000)
):
    return {"item_id": item_id}

# Numeric validation
@app.get("/items/{item_id}")
def read_item(
    item_id: int = Path(..., ge=1),  # Greater than or equal
    q: Optional[str] = Query(None)
):
    return {"item_id": item_id, "q": q}

# Float validation
@app.get("/items/{item_id}")
def read_item(
    item_id: int = Path(..., ge=0, le=1000),
    size: float = Query(..., gt=0, lt=10.5)
):
    return {"item_id": item_id, "size": size}
```

### Body Validation

```python
from pydantic import BaseModel, Field, EmailStr, HttpUrl
from typing import Optional

class User(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    full_name: Optional[str] = Field(None, max_length=100)
    age: int = Field(..., ge=0, le=120)
    website: Optional[HttpUrl] = None

@app.post("/users/")
def create_user(user: User):
    return {"user": user}

# Custom validators
from pydantic import validator

class Item(BaseModel):
    name: str
    price: float
    discount_price: Optional[float] = None

    @validator('discount_price')
    def discount_must_be_lower(cls, v, values):
        if v is not None and 'price' in values and v >= values['price']:
            raise ValueError('discount_price must be lower than price')
        return v
```

## Response Models

### Basic Response Model

```python
from pydantic import BaseModel
from typing import Optional

class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = None

class ItemResponse(BaseModel):
    name: str
    price: float

@app.post("/items/", response_model=ItemResponse)
def create_item(item: Item):
    return item

# Response model excludes unset fields
@app.post("/items/", response_model=ItemResponse, response_model_exclude_unset=True)
def create_item(item: Item):
    return item
```

### Response Status Code

```python
from fastapi import status

@app.post("/items/", status_code=status.HTTP_201_CREATED)
def create_item(item: Item):
    return item

@app.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(item_id: int):
    return None
```

### Multiple Response Models

```python
from fastapi import Response
from typing import Union

class ItemBase(BaseModel):
    name: str
    price: float

class ItemCreate(ItemBase):
    pass

class ItemResponse(ItemBase):
    id: int

@app.post("/items/", response_model=ItemResponse)
def create_item(item: ItemCreate):
    # Simulate database creation
    return {**item.dict(), "id": 1}

# Union response
@app.get("/items/{item_id}", response_model=Union[ItemResponse, dict])
def read_item(item_id: int):
    if item_id == 1:
        return ItemResponse(id=1, name="Item 1", price=10.5)
    return {"error": "Item not found"}
```

## Form Data

```python
from fastapi import Form

@app.post("/login/")
def login(username: str = Form(...), password: str = Form(...)):
    return {"username": username}

# Multiple form fields
@app.post("/register/")
def register(
    username: str = Form(...),
    password: str = Form(...),
    email: str = Form(...),
    full_name: Optional[str] = Form(None)
):
    return {"username": username, "email": email}
```

## File Uploads

```python
from fastapi import File, UploadFile
from typing import List

# Upload file bytes
@app.post("/files/")
def create_file(file: bytes = File(...)):
    return {"file_size": len(file)}

# Upload file with UploadFile
@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "size": len(contents)
    }

# Multiple files
@app.post("/uploadfiles/")
async def create_upload_files(files: List[UploadFile] = File(...)):
    return {"filenames": [file.filename for file in files]}

# File with form data
@app.post("/files/")
async def create_file(
    file: UploadFile = File(...),
    token: str = Form(...)
):
    return {"filename": file.filename, "token": token}
```

## Error Handling

```python
from fastapi import HTTPException, status

@app.get("/items/{item_id}")
def read_item(item_id: int):
    if item_id not in items_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )
    return items_db[item_id]

# Custom exception
from fastapi.responses import JSONResponse

class UnicornException(Exception):
    def __init__(self, name: str):
        self.name = name

@app.exception_handler(UnicornException)
async def unicorn_exception_handler(request, exc: UnicornException):
    return JSONResponse(
        status_code=418,
        content={"message": f"Oops! {exc.name} did something wrong."}
    )

@app.get("/unicorns/{name}")
async def read_unicorn(name: str):
    if name == "yolo":
        raise UnicornException(name=name)
    return {"unicorn_name": name}
```

## Dependencies

### Basic Dependency

```python
from fastapi import Depends

def common_parameters(q: Optional[str] = None, skip: int = 0, limit: int = 100):
    return {"q": q, "skip": skip, "limit": limit}

@app.get("/items/")
def read_items(commons: dict = Depends(common_parameters)):
    return commons

@app.get("/users/")
def read_users(commons: dict = Depends(common_parameters)):
    return commons
```

### Class Dependencies

```python
class CommonQueryParams:
    def __init__(self, q: Optional[str] = None, skip: int = 0, limit: int = 100):
        self.q = q
        self.skip = skip
        self.limit = limit

@app.get("/items/")
def read_items(commons: CommonQueryParams = Depends()):
    return {"q": commons.q, "skip": commons.skip, "limit": commons.limit}
```

### Sub-dependencies

```python
def query_extractor(q: Optional[str] = None):
    return q

def query_or_cookie_extractor(
    q: str = Depends(query_extractor),
    last_query: Optional[str] = Cookie(None)
):
    if not q:
        return last_query
    return q

@app.get("/items/")
def read_query(query: str = Depends(query_or_cookie_extractor)):
    return {"query": query}
```

### Global Dependencies

```python
app = FastAPI(dependencies=[Depends(verify_token)])
```

## Authentication

### Basic HTTP Auth

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
import secrets

security = HTTPBasic()

def get_current_username(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = secrets.compare_digest(credentials.username, "admin")
    correct_password = secrets.compare_digest(credentials.password, "secret")
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username

@app.get("/users/me")
def read_current_user(username: str = Depends(get_current_username)):
    return {"username": username}
```

### OAuth2 with Password Flow

```python
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    disabled: Optional[bool] = None

class UserInDB(User):
    hashed_password: str

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    # Get user from database
    user = get_user(username)
    if user is None:
        raise credentials_exception
    return user

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me")
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
```

## Middleware

### Basic Middleware

```python
from fastapi import Request
import time

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response
```

### CORS Middleware

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Production example
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://example.com", "https://www.example.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```

### Trusted Host Middleware

```python
from fastapi.middleware.trustedhost import TrustedHostMiddleware

app.add_middleware(
    TrustedHostMiddleware, hosts=["example.com", "*.example.com"]
)
```

### GZip Middleware

```python
from fastapi.middleware.gzip import GZipMiddleware

app.add_middleware(GZipMiddleware, minimum_size=1000)
```

## Background Tasks

```python
from fastapi import BackgroundTasks

def write_log(message: str):
    with open("log.txt", "a") as log:
        log.write(message + "\n")

@app.post("/send-notification/{email}")
async def send_notification(
    email: str,
    background_tasks: BackgroundTasks
):
    background_tasks.add_task(write_log, f"Notification sent to {email}")
    return {"message": "Notification sent in the background"}

# Multiple background tasks
@app.post("/send-notifications/")
async def send_notifications(
    background_tasks: BackgroundTasks,
    emails: List[str]
):
    for email in emails:
        background_tasks.add_task(write_log, f"Notification sent to {email}")
    return {"message": f"Notifications sent to {len(emails)} emails"}
```

## WebSockets

```python
from fastapi import WebSocket
from fastapi.responses import HTMLResponse

html = """
<!DOCTYPE html>
<html>
<head><title>WebSocket Test</title></head>
<body>
    <h1>WebSocket Test</h1>
    <input id="messageText" type="text"/>
    <button onclick="sendMessage()">Send</button>
    <ul id="messages"></ul>
    <script>
        var ws = new WebSocket("ws://localhost:8000/ws");
        ws.onmessage = function(event) {
            var messages = document.getElementById('messages')
            var message = document.createElement('li')
            var content = document.createTextNode(event.data)
            message.appendChild(content)
            messages.appendChild(message)
        };
        function sendMessage() {
            var input = document.getElementById("messageText")
            ws.send(input.value)
            input.value = ''
        }
    </script>
</body>
</html>
"""

@app.get("/")
async def get():
    return HTMLResponse(html)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")
```

## Testing

```python
from fastapi.testclient import TestClient

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}

def test_create_item():
    response = client.post(
        "/items/",
        json={"name": "Test Item", "price": 10.5}
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Test Item"

# Test with authentication
def test_read_items_with_auth():
    response = client.get(
        "/items/",
        headers={"Authorization": "Bearer fake-token"}
    )
    assert response.status_code == 200
```

## Database Integration

### SQLAlchemy Example

```python
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)

Base.metadata.create_all(bind=engine)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Routes
@app.post("/users/")
def create_user(email: str, name: str, db: Session = Depends(get_db)):
    user = User(email=email, name=name)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@app.get("/users/")
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(User).offset(skip).limit(limit).all()
    return users
```

## Configuration

### Settings with Pydantic

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "FastAPI App"
    admin_email: str
    items_per_page: int = 50
    database_url: str

    class Config:
        env_file = ".env"

settings = Settings()

@app.get("/info")
async def info():
    return {
        "app_name": settings.app_name,
        "admin_email": settings.admin_email,
        "items_per_page": settings.items_per_page
    }
```

### Environment Variables (.env)
```
APP_NAME=My FastAPI App
ADMIN_EMAIL=admin@example.com
ITEMS_PER_PAGE=50
DATABASE_URL=postgresql://user:password@localhost/dbname
```

## Best Practices

### Project Structure
```
myproject/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── dependencies.py
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── items.py
│   │   └── users.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── user.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── user.py
│   └── crud/
│       ├── __init__.py
│       └── user.py
├── tests/
│   ├── __init__.py
│   └── test_main.py
├── requirements.txt
├── .env
└── README.md
```

### Use Routers

```python
# app/routers/users.py
from fastapi import APIRouter

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)

@router.get("/")
def read_users():
    return [{"username": "Rick"}, {"username": "Morty"}]

@router.get("/{user_id}")
def read_user(user_id: int):
    return {"user_id": user_id}

# app/main.py
from app.routers import users

app.include_router(users.router)
```

### Async/Await Best Practices

```python
# Use async when doing I/O operations
@app.get("/items/{item_id}")
async def read_item(item_id: int):
    result = await fetch_from_database(item_id)
    return result

# Use sync for CPU-bound operations
@app.get("/calculate/{number}")
def calculate(number: int):
    result = heavy_computation(number)
    return result
```

## Resources

- Official documentation: https://fastapi.tiangolo.com/
- Tutorial: https://fastapi.tiangolo.com/tutorial/
- Reference: https://fastapi.tiangolo.com/reference/
- GitHub: https://github.com/tiangolo/fastapi
- Community: https://github.com/tiangolo/fastapi/discussions

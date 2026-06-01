from pydantic import BaseModel, Field
from datetime import datetime
from typing import Any
import uuid


# ── Sign Schemas ──────────────────────────────────────────────────────────────

class SignBase(BaseModel):
    key: str = Field(..., description="Unique identifier, e.g. 'hello', 'thank_you'")
    label: str = Field(..., description="Human-readable display name")
    description: str | None = None
    category: str | None = None
    keyframes: list[dict[str, Any]] = Field(..., description="IK keyframe array")
    is_active: bool = True


class SignCreate(SignBase):
    pass


class SignUpdate(BaseModel):
    label: str | None = None
    description: str | None = None
    category: str | None = None
    keyframes: list[dict[str, Any]] | None = None
    is_active: bool | None = None


class SignOut(SignBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ── Synonym Schemas ───────────────────────────────────────────────────────────

class SynonymCreate(BaseModel):
    word: str
    maps_to: str


class SynonymOut(SynonymCreate):
    id: int

    class Config:
        from_attributes = True


# ── Translation Schemas ───────────────────────────────────────────────────────

class TranslateRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=500, description="English text to translate")


class TranslateResponse(BaseModel):
    tokens: list[str]
    mode: str
    notes: list[str]
    fingerspelled_count: int


# ── Translation History ───────────────────────────────────────────────────────

class TranslationOut(BaseModel):
    id: uuid.UUID
    input_text: str
    gloss_tokens: list[str]
    mode: str | None
    notes: list[str] | None
    fingerspelled_count: int
    created_at: datetime

    class Config:
        from_attributes = True

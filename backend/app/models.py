import uuid
from datetime import datetime
from sqlalchemy import String, Boolean, Integer, Text, JSON, TIMESTAMP
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from app.database import Base


class Sign(Base):
    """A PSL sign with IK keyframe data."""
    __tablename__ = "signs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    key: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    label: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    category: Mapped[str | None] = mapped_column(String(100))  # greeting, emotion, question, etc.
    keyframes: Mapped[dict] = mapped_column(JSON, nullable=False)  # the kf[] array
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class Synonym(Base):
    """Synonym mapping: word → sign key (e.g. 'hi' → 'hello')."""
    __tablename__ = "synonyms"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    word: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    maps_to: Mapped[str] = mapped_column(String(100), nullable=False)  # sign key


class StopWord(Base):
    """Words to strip during NLP preprocessing."""
    __tablename__ = "stop_words"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    word: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)


class Translation(Base):
    """Log of every translation request."""
    __tablename__ = "translations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    input_text: Mapped[str] = mapped_column(Text, nullable=False)
    gloss_tokens: Mapped[list[str]] = mapped_column(JSON, nullable=False)
    mode: Mapped[str | None] = mapped_column(String(100))  # template / lexical
    notes: Mapped[list[str] | None] = mapped_column(JSON)
    fingerspelled_count: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now())

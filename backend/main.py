"""
FastAPI application entry point.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, text

from app.config import get_settings
from app.database import engine, AsyncSessionLocal, Base
from app.models import Sign, Synonym, StopWord, Translation
from app.routes import router
from app.seed_data import SEED_SIGNS, SEED_SYNONYMS, SEED_STOP_WORDS

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create tables and seed initial data on startup."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        # Seed signs
        for sign_data in SEED_SIGNS:
            existing = await db.execute(select(Sign).where(Sign.key == sign_data["key"]))
            if not existing.scalar_one_or_none():
                db.add(Sign(**sign_data))

        # Seed synonyms
        for syn_data in SEED_SYNONYMS:
            existing = await db.execute(select(Synonym).where(Synonym.word == syn_data["word"]))
            if not existing.scalar_one_or_none():
                db.add(Synonym(**syn_data))

        # Seed stop words
        for word in SEED_STOP_WORDS:
            existing = await db.execute(select(StopWord).where(StopWord.word == word))
            if not existing.scalar_one_or_none():
                db.add(StopWord(word=word))

        await db.commit()

    yield

    await engine.dispose()


app = FastAPI(
    title="V2PSL API",
    description="Voice to Pakistani Sign Language — Backend API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")


@app.get("/health", tags=["System"])
async def health():
    return {"status": "ok", "version": "1.0.0"}

"""
API Routers — all routes in one place for now.
Split into separate files as the project grows.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.database import get_db
from app.models import Sign, Synonym, StopWord, Translation
from app.schemas import (
    SignCreate, SignUpdate, SignOut,
    SynonymCreate, SynonymOut,
    TranslateRequest, TranslateResponse,
    TranslationOut,
)
from app.nlp import NLPEngine

router = APIRouter()


# ── Helper: build a fresh NLP engine from DB ─────────────────────────────────
async def _build_nlp_engine(db: AsyncSession) -> NLPEngine:
    signs_q = await db.execute(select(Sign.key).where(Sign.is_active == True))
    known_signs = set(signs_q.scalars().all())

    syn_q = await db.execute(select(Synonym.word, Synonym.maps_to))
    synonyms = {row.word: row.maps_to for row in syn_q.all()}

    sw_q = await db.execute(select(StopWord.word))
    stop_words = set(sw_q.scalars().all())

    return NLPEngine(
        stop_words=stop_words or None,
        synonyms=synonyms or None,
        known_signs=known_signs,
    )


# ══════════════════════════════════════════════════════════════════════════════
# TRANSLATION
# ══════════════════════════════════════════════════════════════════════════════

@router.post("/translate", response_model=TranslateResponse, tags=["Translation"])
async def translate(body: TranslateRequest, db: AsyncSession = Depends(get_db)):
    """Translate English text to PSL gloss tokens."""
    engine = await _build_nlp_engine(db)
    result = engine.translate(body.text)

    # Persist to history
    record = Translation(
        input_text=body.text,
        gloss_tokens=result.tokens,
        mode=result.mode,
        notes=result.notes,
        fingerspelled_count=result.fingerspelled_count,
    )
    db.add(record)
    await db.commit()

    return TranslateResponse(**result.dict())


# ══════════════════════════════════════════════════════════════════════════════
# SIGNS
# ══════════════════════════════════════════════════════════════════════════════

@router.get("/signs", response_model=list[SignOut], tags=["Signs"])
async def list_signs(
    category: str | None = Query(None),
    active_only: bool = Query(True),
    db: AsyncSession = Depends(get_db),
):
    """List all signs, optionally filtered by category."""
    q = select(Sign)
    if active_only:
        q = q.where(Sign.is_active == True)
    if category:
        q = q.where(Sign.category == category)
    q = q.order_by(Sign.key)
    result = await db.execute(q)
    return result.scalars().all()


@router.get("/signs/{key}", response_model=SignOut, tags=["Signs"])
async def get_sign(key: str, db: AsyncSession = Depends(get_db)):
    """Get a single sign by key."""
    result = await db.execute(select(Sign).where(Sign.key == key))
    sign = result.scalar_one_or_none()
    if not sign:
        raise HTTPException(status_code=404, detail=f"Sign '{key}' not found")
    return sign


@router.post("/signs", response_model=SignOut, status_code=201, tags=["Signs"])
async def create_sign(body: SignCreate, db: AsyncSession = Depends(get_db)):
    """Create a new sign."""
    existing = await db.execute(select(Sign).where(Sign.key == body.key))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail=f"Sign '{body.key}' already exists")
    sign = Sign(**body.model_dump())
    db.add(sign)
    await db.commit()
    await db.refresh(sign)
    return sign


@router.patch("/signs/{key}", response_model=SignOut, tags=["Signs"])
async def update_sign(key: str, body: SignUpdate, db: AsyncSession = Depends(get_db)):
    """Update a sign's fields."""
    result = await db.execute(select(Sign).where(Sign.key == key))
    sign = result.scalar_one_or_none()
    if not sign:
        raise HTTPException(status_code=404, detail=f"Sign '{key}' not found")
    for field, value in body.model_dump(exclude_none=True).items():
        setattr(sign, field, value)
    await db.commit()
    await db.refresh(sign)
    return sign


@router.delete("/signs/{key}", status_code=204, tags=["Signs"])
async def delete_sign(key: str, db: AsyncSession = Depends(get_db)):
    """Delete a sign."""
    result = await db.execute(select(Sign).where(Sign.key == key))
    sign = result.scalar_one_or_none()
    if not sign:
        raise HTTPException(status_code=404, detail=f"Sign '{key}' not found")
    await db.delete(sign)
    await db.commit()


# ══════════════════════════════════════════════════════════════════════════════
# SYNONYMS
# ══════════════════════════════════════════════════════════════════════════════

@router.get("/synonyms", response_model=list[SynonymOut], tags=["Synonyms"])
async def list_synonyms(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Synonym).order_by(Synonym.word))
    return result.scalars().all()


@router.post("/synonyms", response_model=SynonymOut, status_code=201, tags=["Synonyms"])
async def create_synonym(body: SynonymCreate, db: AsyncSession = Depends(get_db)):
    existing = await db.execute(select(Synonym).where(Synonym.word == body.word))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail=f"Synonym '{body.word}' already exists")
    syn = Synonym(**body.model_dump())
    db.add(syn)
    await db.commit()
    await db.refresh(syn)
    return syn


@router.delete("/synonyms/{word}", status_code=204, tags=["Synonyms"])
async def delete_synonym(word: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Synonym).where(Synonym.word == word))
    syn = result.scalar_one_or_none()
    if not syn:
        raise HTTPException(status_code=404, detail=f"Synonym '{word}' not found")
    await db.delete(syn)
    await db.commit()


# ══════════════════════════════════════════════════════════════════════════════
# HISTORY
# ══════════════════════════════════════════════════════════════════════════════

@router.get("/history", response_model=list[TranslationOut], tags=["History"])
async def get_history(
    limit: int = Query(50, le=200),
    db: AsyncSession = Depends(get_db),
):
    """Get recent translation history."""
    result = await db.execute(
        select(Translation).order_by(Translation.created_at.desc()).limit(limit)
    )
    return result.scalars().all()

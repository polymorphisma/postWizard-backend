from fastapi import APIRouter, Depends, status
from fastapi import File, UploadFile, Form
from typing import List

from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_session
from app.services.ai import AiService
router = APIRouter(tags=["A.I"], prefix="/ai")


@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload(session = None, images: List[UploadFile] = File(...), userTitle: str = Form(...), context: str = Form(...),  socialMedia: str = Form(...)):
    return await AiService.upload(session, images, userTitle, context, socialMedia)

@router.post("/schedule", status_code=status.HTTP_201_CREATED)
async def schedule(session = None, images: List[UploadFile] = File(...), userTitle: str = Form(...), context: str = Form(...),  socialMedia: str = Form(...), scheduleDate: str = Form(...)):
    return await AiService.schedule(session, images, userTitle, context, socialMedia, scheduleDate)

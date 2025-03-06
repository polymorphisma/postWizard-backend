# from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import File, UploadFile, Form
from fastapi.responses import JSONResponse
from typing import List
from app.utilities.utils import extract_extension, generate_uuid
from app.utilities.logger import logger
import os
import shutil

from app.Social_media_handler.sm_handler import Sm_handler
from app.daos.ai import AiDao

from app.scheduler import scheduler


from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.date import DateTrigger  # Correct import for DateTrigger in APScheduler 3.x
from datetime import datetime
import asyncio

# Assuming the following:
# sm_handler_obj is an object that has an entry_point method
# scheduleDate is provided in a format like '2025-03-04 15:30:00'
# session is passed from your async framework
# images, userTitle, context are being passed as part of the request

sm_handler_obj = Sm_handler()
ROOT_DIR = os.getcwd()
logger.info(ROOT_DIR)

image_director = os.path.join(ROOT_DIR, 'image')


class AiService:
    @staticmethod
    async def upload(session: AsyncSession, images: List[UploadFile] = File(...), userTitle: str = Form(...), context: str = Form(...), socialMedia: str = Form(...)):

        # return JSONResponse([{'success': True, 'message': 'An error occurred: 429 Too Many Requests\nToo Many Requests', 'method': 'twitter', 'generated_text': '#Pokhara, the serene lakeside city, where adventure meets tranquility. Immerse yourself in the chill vibe as you explore the stunning landscapes and unwind by the peaceful waters. #Nepal #Travel #Chill', "uploaded_link": "lakfdjlaksdjflkasdjflk"}], status_code=200)
        # ai_dao = AiDao(session)
        if socialMedia == '':
            return JSONResponse({"success": False, "message": "Please choose one social media"})

        socialMedia = [x.lower() for x in socialMedia.split(",")]
        file_list = []

        for image in images:
            extension = extract_extension(image.filename)
            if extension not in ["png", "jpg", "jpeg"]:
                return JSONResponse({"success": False, "message": "File Extension Not valid."})
            uuid_val = generate_uuid()
            new_file_name = f"{uuid_val}.{extension}"
            save_file = os.path.join(image_director, new_file_name)

            try:
                with open(save_file, "wb") as buffer:
                    shutil.copyfileobj(image.file, buffer)
            except Exception as e:
                logger.info(e)
                return JSONResponse(content={"error": str(e)}, status_code=500)
            file_list.append(save_file)
        value = sm_handler_obj.entry_point(socialMedia, file_list, context, userTitle)
        print(value)
        return JSONResponse(value, status_code=200)

    # Your static schedule method
    @staticmethod
    async def schedule(session: AsyncSession, images: List[UploadFile] = File(...), userTitle: str = Form(...), context: str = Form(...), socialMedia: str = Form(...), scheduleDate: str = Form(...)):

        if socialMedia == '':
            return JSONResponse({"success": False, "message": "Please choose one social media"})

        socialMedia = [x.lower() for x in socialMedia.split(",")]
        file_list = []

        for image in images:
            extension = extract_extension(image.filename)
            if extension not in ["png", "jpg", "jpeg"]:
                return JSONResponse({"success": False, "message": "File Extension Not valid."})
            
            uuid_val = generate_uuid()
            new_file_name = f"{uuid_val}.{extension}"
            save_file = os.path.join(image_director, new_file_name)

            try:
                with open(save_file, "wb") as buffer:
                    shutil.copyfileobj(image.file, buffer)
            except Exception as e:
                logger.info(e)
                return JSONResponse(content={"error": str(e)}, status_code=500)
            file_list.append(save_file)

        # Parsing the scheduleDate into a datetime object
        print(scheduleDate)
        try:
            # schedule_time = datetime.strptime(scheduleDate, '%Y-%m-%d %H:%M:%S')
            schedule_time = datetime.fromisoformat(scheduleDate.replace("Z", "+00:00"))

        except ValueError:
            return JSONResponse({"success": False, "message": "Invalid schedule date format. Use 'YYYY-MM-DD HH:MM:SS'."}, status_code=401)

        # Scheduling the task
        def run_sm_handler():
            value = sm_handler_obj.entry_point(socialMedia, file_list, context, userTitle)
            print(value)
            # Here you can send the response to the user if needed
            return JSONResponse(value, status_code=200)

        # Using APScheduler's DateTrigger to schedule at the specified time
        scheduler.add_job(run_sm_handler, DateTrigger(run_date=schedule_time))


        # Return a response indicating the task has been scheduled
        return JSONResponse({"success": True, "message": f"Scheduled task at {schedule_time}."}, status_code=200)
# scheduler.py

from apscheduler.schedulers.asyncio import AsyncIOScheduler

# Create the scheduler instance
scheduler = AsyncIOScheduler()

# Function to start the scheduler
def start_scheduler():
    scheduler.start()

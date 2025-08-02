import time
import uuid
from typing import Dict

# Load environment variables
from dotenv import load_dotenv

load_dotenv()

# Fastapi
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Pydantic Models
from .models import GenerateRequest, JobResponse, StatusResponse

# Service
from .services.summarizer import generate_summary_for_topic
from .services.audio_generator import convert_text_to_audio


app = FastAPI(title="AI Journalist Backend")

# Allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific origins in production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# /static path is the URL path the files will be available at
# The app/static directory is where the files are actually located
app.mount("/static", StaticFiles(directory="app/static"), name="static")


# Dictionary to act as our in-memory db for jobs
# The key is the job_id, the value is a dictionary holding the job's status and result.
job_store: Dict[str, Dict] = {}


def process_report_task(job_id: str, topic: str):
    """
    The main background task for generating a report.
    """

    print(f"Starting job {job_id} for topic: {topic}")

    try:
        summary = generate_summary_for_topic(topic=topic)

        audio_url = convert_text_to_audio(text=summary, job_id=job_id)

        # Once the work is done, we update the job_store with the result
        job_store[job_id]["status"] = "complete"
        job_store[job_id]["result"] = {"summary": summary, "audio_url": audio_url}

    except Exception as e:
        print(f"Error processing job {job_id}: {e}")
        job_store[job_id]["status"] = "failed"
        job_store[job_id]["result"] = {
            "summary": "An error occurred during summarization."
        }

    print(f"Finsihed job {job_id}")


@app.post("/generate_report", response_model=JobResponse)
async def generate_report(request: GenerateRequest, background_tasks: BackgroundTasks):
    """
    This endpoint kicks off the report generation process.
    It returns a job_id immediately and runs the actual work in the bg.
    """

    # Generate a unique ID for this job
    job_id = str(uuid.uuid4())

    # Store the initial Job status
    job_store[job_id] = {"status": "processing", "result": None}

    # Add the long-running task to be executed in the background
    background_tasks.add_task(process_report_task, job_id, request.topic)

    return {"job_id": job_id}


@app.post("/report_status/{job_id}", response_model=StatusResponse)
async def get_report_status(job_id: str):
    """
    This endpoint allows the client to poll for the status of a job
    """

    # Find Job
    job = job_store.get(job_id)

    if not job:
        raise HTTPException(status_code=404, detail="Job Not Found")

    # Return the current status and result of the job
    return {"job_id": job_id, "status": job["status"], "result": job["result"]}

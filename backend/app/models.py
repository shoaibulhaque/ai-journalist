from pydantic import BaseModel
from typing import Optional, Dict, Any


# Pydantic model for the request body of the /generate endpoint
# This tells FastAPI what the client needs to send.
# It ensures 'topic' is a string. If not, FastAPI returns a clear error.
#
#  Client JSON ->  +-----------+  -> Python object
# {"topic": "..."}  |  FastAPI  |  -> GenerateRequest(topic="...")
#                  +-----------+
class GenerateRequest(BaseModel):
    topic: str


# Pydantic model for the initial response after starting a job.
# We promise the client they will get a JSON with a 'job_id'.
class JobResponse(BaseModel):
    job_id: str


# Pydantic model for the status check endpoint.
# The status can be one of a few specific strings.
# 'result' is optional because it's only present when the job is 'complete'.
class StatusResponse(BaseModel):
    job_id: str
    status: str
    result: Optional[Dict[str, Any]] = None

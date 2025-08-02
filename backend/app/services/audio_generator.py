import os
import uuid
from elevenlabs.client import ElevenLabs

# Initialize elevenlabs client
client = ElevenLabs()

# The directory where we will store the generated audio files.
AUDIO_DIR = "app/static"


def convert_text_to_audio(text: str, job_id: str) -> str:
    """
    Converts a string of text into an audio file using ElevenLabs API
    and saves it to static directory.

    Returns the URL path to the generated audio file.
    """
    print(f"-> [AudioGenerator] Starting audio generation for job {job_id}")

    # Make sure the static directory exists.
    os.makedirs(AUDIO_DIR, exist_ok=True)

    # Generate a unique filename for the audio file.
    # Using the job_id ensures it's unique.
    filename = f"{job_id}.mp3"
    filepath = os.path.join(AUDIO_DIR, filename)

    # Call the API
    response = client.text_to_speech.convert(
        voice_id="21m00Tcm4TlvDq8ikWAM",
        optimize_streaming_latency="0",
        output_format="mp3_44100_128",
        text=text,
        model_id="eleven_multilingual_v2",
    )

    with open(filepath, "wb") as f:
        for chunk in response:
            f.write(chunk)

    print(f"-> [AudioGenerator] Audio file saved to {filepath}")

    # Return the public URL path for the frontend to use.
    return f"/static/{filename}"

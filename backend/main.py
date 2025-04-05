from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import groq
import os
import json
import asyncio
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="Ticket Booking AI Backend")

# Configure CORS - Allow all origins in development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq client
groq_client = groq.Groq(api_key=os.getenv("GROQ_API_KEY", ""))

# System prompt for the AI
SYSTEM_PROMPT = """
You are a helpful ticket booking assistant that helps users book tickets for various events and appointments.
You can handle bookings for:
1. Doctor appointments
2. Amusement park tickets
3. Movie tickets
4. Concert tickets
5. Sports events
6. And other similar bookings

For each booking request:
1. Collect all necessary information (date, time, number of tickets, preferences, etc.)
2. Confirm the details with the user
3. Process the booking and provide a confirmation number

If the user doesn't specify what type of booking they want, ask them politely.
Always be helpful, friendly, and concise in your responses.

When a booking is confirmed, generate a fake confirmation number in the format: BOOK-XXXX-XXXX where X is an alphanumeric character.
"""

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

async def stream_chat_response(messages: List[Dict[str, str]]):
    """Stream the chat response from Groq API"""
    try:
        # Add system message if not present
        if messages and messages[0]["role"] != "system":
            messages.insert(0, {"role": "system", "content": SYSTEM_PROMPT})
        
        # Create the completion with streaming
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.7,
            max_tokens=1024,
            top_p=1,
            stream=True,
        )
        
        # Stream the response
        for chunk in completion:
            if chunk.choices and chunk.choices[0].delta and chunk.choices[0].delta.content:
                content = chunk.choices[0].delta.content
                # Format as SSE
                yield f"data: {json.dumps({'type': 'text', 'value': content})}\n\n"
                # Small delay to prevent overwhelming the client
                await asyncio.sleep(0.01)
        
        # End of stream marker
        yield f"data: [DONE]\n\n"
    
    except Exception as e:
        error_message = f"Error generating response: {str(e)}"
        yield f"data: {json.dumps({'type': 'error', 'value': error_message})}\n\n"
        yield f"data: [DONE]\n\n"

@app.post("/chat")
async def chat(request: Request):
    """Endpoint to handle chat requests and stream responses"""
    try:
        # Parse the request body
        body = await request.json()
        messages = body.get("messages", [])
        
        # Convert messages to the format expected by Groq
        groq_messages = [
            {"role": msg["role"], "content": msg["content"]} 
            for msg in messages
        ]
        
        # Return streaming response
        return StreamingResponse(
            stream_chat_response(groq_messages),
            media_type="text/event-stream"
        )
    
    except Exception as e:
        return Response(
            content=json.dumps({"error": str(e)}),
            status_code=500,
            media_type="application/json"
        )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


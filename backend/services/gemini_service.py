import json
import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

PROMPT = """ You are a CV/Resume parser. Extract structured data from the following resume text.

Return only valid JSON (no markdown, no code blocks, no explanation) matching this exact schema:


{
"personal_info": {
"name": "string",
"email": "string",
"phone": "string",
"address": "string",
"linkedin": "string",
"github": "string",
},
"summary": "",
"education": [
{"degree" : "", "institution": "", "year": ""}
],
"experience": [
{"company": "", "role": "", "start_date": "", "end_date": "", "description": ""}
],
"skills": [],
"languages": [
{"language": "", "proficiency": ""}
],
"certifications": [
{"name": "", "issuer": "", "date": ""}
]
}

Rules:
- If a field is not found in the resume, leave it as an empty string or empty array.
- Do not invent or assume data that is not in the resume.
- Return ONLY the JSON object, nothing else.

Resume Text:
"""

def parse_cv_with_gemini(raw_text: str) -> str:
    response = client.models.generate_content(
        model = "gemini-3-flash-preview",
        contents = PROMPT + raw_text,
    )

    # response-cleaning
    result_text = response.text.strip()
    if result_text.startswith("```"):
        result_text = result_text.split("\n", 1)[1]
        result_text = result_text.rsplit("```", 1)[0]
        result_text = result_text.strip()

    try:
        return json.loads(result_text) #json.loads() converts JSON string into python dict.
    except json.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        print(f"Raw response: {result_text}")
        raise
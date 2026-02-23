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
        model = "gemini-flash-latest",
        contents = PROMPT + raw_text,
    )

    # response-cleaning
    result_text = response.text.strip()
    if result_text.startswith("```"):
        result_text = result_text.split("\n", 1)[1]
        result_text = result_text.rsplit("```", 1)[0]
        result_text = result_text.strip()

    try:
        return json.loads(result_text) #json.loads() - for converting JSON string into python dict.
    except json.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        print(f"Raw response: {result_text}")
        raise

ATS_PROMPT = """ You are an ATS (Applicant Tracking System) expert.
Compare the provided resume text with the job description.
Provide a match score (0-100), a brief summary of the match, and 3 actionable tips to improve the resume for this specific role.

Return only valid JSON(no markdown, no code blocks, no explanation) with this schema:
{{
  "score": number,
  "match_summary": "string",
  "tips": ["string", "string", "string"]
}}

Resume Text:
{resume_text}

Job Description:
{job_description}
 """

def calculate_ats_score(cv_text: str, job_description: str) -> dict:
    prompt = ATS_PROMPT.format(resume_text=cv_text, job_description=job_description)

    response = client.models.generate_content(
        model = "gemini-2.5-flash-lite",
        contents=prompt,
    )

    result_text = response.text.strip()
    if result_text.startswith("```"):
        result_text = result_text.split("\n", 1)[1]
        result_text = result_text.rsplit("```", 1)[0]
        result_text = result_text.strip()

    try:
        return json.loads(result_text)
    except json.JSONDecodeError as e:
        print(f"JSON Decode Error in ATS: {e}")
        print(f"Raw response: {result_text}")
        raise

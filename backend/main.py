from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from services.extractor import extract_text
from services.gemini_service import parse_cv_with_gemini, calculate_ats_score
from models import CV, create_db_and_tables, SessionDep

app = FastAPI(title="CV Parser API")

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/ats-score")
async def ats_score(data: dict):
    raw_text = data.get("raw_text", "")
    job_description = data.get("job_description", "")

    if not raw_text or not job_description:
        raise HTTPException(status_code=400, detail="Both Resume text and Job Description are required.")
    
    try:
        result = calculate_ats_score(raw_text, job_description)
        return {"success": True, "data": result}
    except Exception as e:
        print(f"ATS Score Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/save-cv")
async def save_cv(data: dict, session:SessionDep):
    try:
        # We can pass lists directly because we used Column(JSON) in models.py!
        new_cv = CV(
            name=data["personal_info"].get("name", ""),
            email=data["personal_info"].get("email", ""),
            phone=data["personal_info"].get("phone", ""),
            address=data["personal_info"].get("address", ""),
            linkedin=data["personal_info"].get("linkedin", ""),
            github=data["personal_info"].get("github", ""),
            summary=data.get("summary", ""),
            education=data.get("education", []),
            experience=data.get("experience", []),
            skills=data.get("skills", []),
            languages=data.get("languages", []),
            certifications=data.get("certifications", []),
            raw_text=data.get("raw_text", "")
        )

        session.add(new_cv)
        session.commit()
        session.refresh(new_cv)

        return {"success": True, "message": "Saved to DB", "id": new_cv.id}
    except Exception as e:
        print(f"Error saving CV: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/parse-cv")
async def parse_cv(file: UploadFile = File(...)):
    #validation of file type
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")
    extension = file.filename.rsplit(".", 1)[-1].lower()
    if extension not in ["pdf", "docx"]:
        raise HTTPException(status_code=400, detail="Unsupported file type. Please uplaod a PDF or DOCX file",)

    #read file bytes
    file_bytes = await file.read()

    try:
        raw_text = extract_text(file_bytes, extension)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not extract text from the file")

    try:
        parsed_data = parse_cv_with_gemini(raw_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse CV with Gemini: {str(e)}")
        
    return {"success": True, "data": parsed_data, "raw_text": raw_text}
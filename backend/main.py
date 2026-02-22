from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from services.extractor import extract_text_from_pdf, extract_text_from_docx
from services.gemini_service import parse_cv_with_gemini

app = FastAPI(title="CV Parser API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/parse-cv")
async def parse_cv(file: UploadFile = File(...)):
    # validation of file type
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")
    extension = file.filename.rsplit(".", 1)[-1].lower()
    if extension not in ["pdf", "docx"]:
        raise HTTPException(status_code=400, detail="Unsupported file type. Please uplaod a PDF or DOCX file",)

    # Read file bytes
    file_bytes = await file.read()

    try:
        if extension == "pdf":
            raw_text = extract_text_from_pdf(file_bytes)
        else:
            raw_text = extract_text_from_docx(file_bytes)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not extract text from the file")

    try:
        parsed_data = parse_cv_with_gemini(raw_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse CV with Gemini: {str(e)}")
        
    return {"success": True, "data": parsed_data}
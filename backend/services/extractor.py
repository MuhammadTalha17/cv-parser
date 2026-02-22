import fitz #PyMuPDF
from docx import Document
import io

def extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        text = ""
        with fitz.open(stream=file_bytes, filetype="pdf") as doc:
            for page in doc:
                text += page.get_text()
        return text.strip()
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        raise

def extract_text_from_docx(file_bytes: bytes) -> str:
    try:
        doc = Document(io.BytesIO(file_bytes))
        # text = "\n".join([para.text for para in doc.paragraphs if para.text.strip()])
        # return text.strip()

        lines = []

        ["this is line 1", "this is line 2", "this is line 3"]

        "this is line 1\nthis is line 2\nthis is line 3"

        """this is line 1
        this is line 2
         """

        # Extract paragraphs
        for para in doc.paragraphs:
            if para.text.strip():
                lines.append(para.text.strip())

        # Extract tables
        for table in doc.tables:
            for row in table.rows:
                #
                seen = []
                for cell in row.cells:
                    text = cell.text.strip()
                    if text and text not in seen:
                        seen.append(text)
                if seen:
                    lines.append(" | ".join(seen))
        
        """
        this is line 1
        this is line 2
        this is line 3
        """
        return "\n".join(lines).strip()
        
    except Exception as e:
        print(f"Error extracting text from DOCX: {e}")
        raise


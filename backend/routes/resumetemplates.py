from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle
import tempfile, os, traceback

router = APIRouter(prefix="/api/resume", tags=["Resume Templates"])

class ResumeData(BaseModel):
    name: str
    email: str
    phone: str
    summary: str = ""
    skills: str = ""
    education: str = ""
    projects: str = ""
    experience: str = ""
    certifications: str = ""
    role_type: str = ""

@router.post("/generate")
async def generate_resume(data: ResumeData):
    try:
        temp_dir = tempfile.gettempdir()
        pdf_name = f"{data.name.replace(' ', '_')}_Resume_{datetime.now().strftime('%Y%m%d%H%M%S')}.pdf"
        pdf_path = os.path.join(temp_dir, pdf_name)

        doc = SimpleDocTemplate(pdf_path, pagesize=letter)
        elements = []

        styles = getSampleStyleSheet()
        elements.append(Paragraph(data.name, styles["Title"]))
        elements.append(Spacer(1, 12))
        elements.append(Paragraph(data.summary, styles["Normal"]))

        doc.build(elements)

        return FileResponse(pdf_path, media_type="application/pdf", filename=pdf_name)
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

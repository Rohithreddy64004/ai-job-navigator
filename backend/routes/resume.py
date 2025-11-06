from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle
)
from groq import Groq
import os, tempfile, traceback

router = APIRouter(prefix="/api/resume", tags=["AI Resume Generator"])

# ✅ Groq setup
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("❌ Missing GROQ_API_KEY in .env")
client = Groq(api_key=GROQ_API_KEY)


class ResumeRequest(BaseModel):
    name: str
    email: str
    phone: str
    summary: str = ""
    skills: str = ""
    experience: str = ""
    education: str = ""
    projects: str = ""
    certifications: str = ""
    role_type: str


# ✅ AI Resume Text Generation
async def generate_resume_text(data: ResumeRequest) -> str:
    prompt = f"""
You are a professional resume writer and designer.
Create a clean, modern, one-page resume for a fresher applying as a {data.role_type}.
Use a neutral tone, light color scheme (white background, soft pastel highlights), and keep it ATS-friendly (text-based).

Include these sections exactly once in this order:
1. Professional Summary
2. Technical Skills
3. Education
4. Projects
5. Certifications
6. Experience
7. Additional Highlights (if any)

Avoid repeating headers or including Name/Email/Phone in the body.

Candidate Info:
Name: {data.name}
Email: {data.email}
Phone: {data.phone}
Summary: {data.summary}
Skills: {data.skills}
Education: {data.education}
Projects: {data.projects}
Certifications: {data.certifications}
Experience: {data.experience}
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.6,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Groq Error: {e}")


# ✅ Main Route
@router.post("/generate-ai")
async def generate_ai_resume(request: ResumeRequest):
    try:
        resume_text = await generate_resume_text(request)

        # ✅ Temp PDF path
        temp_dir = tempfile.gettempdir()
        pdf_name = f"{request.name.replace(' ', '_')}_Resume_{datetime.now().strftime('%Y%m%d%H%M%S')}.pdf"
        pdf_path = os.path.join(temp_dir, pdf_name)

        # ✅ PDF setup
        doc = SimpleDocTemplate(
            pdf_path,
            pagesize=letter,
            leftMargin=0.8 * inch,
            rightMargin=0.8 * inch,
            topMargin=0.8 * inch,
            bottomMargin=0.8 * inch,
        )

        styles = getSampleStyleSheet()
        elements = []

        # 🎨 Light Canva Theme Styles
        header_bg = colors.HexColor("#E3F2FD")       # Light pastel blue
        accent_color = colors.HexColor("#1976D2")    # Medium blue for text
        soft_gray = colors.HexColor("#FAFAFA")

        name_style = ParagraphStyle(
            "NameStyle",
            fontSize=20,
            leading=24,
            textColor=accent_color,
            alignment=1,
            spaceAfter=4,
        )
        contact_style = ParagraphStyle(
            "ContactStyle",
            fontSize=10.5,
            textColor=colors.HexColor("#37474F"),
            alignment=1,
        )
        section_title = ParagraphStyle(
            "SectionTitle",
            fontSize=13,
            textColor=accent_color,
            backColor=header_bg,
            leftIndent=4,
            spaceBefore=12,
            spaceAfter=6,
            leading=15,
        )
        text_style = ParagraphStyle(
            "TextStyle",
            fontSize=10.5,
            leading=15,
            textColor=colors.HexColor("#212121"),
        )
        bullet_style = ParagraphStyle(
            "BulletStyle",
            fontSize=10.5,
            leading=15,
            leftIndent=15,
            bulletIndent=5,
            textColor=colors.HexColor("#424242"),
        )

        # 🩵 Header (Name + Contact)
        header_table = Table(
            [
                [Paragraph(f"<b>{request.name}</b>", name_style)],
                [Paragraph(f"{request.email}   |   {request.phone}", contact_style)],
            ],
            colWidths=[6.2 * inch],
        )
        header_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), header_bg),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 8),
        ]))
        elements.append(header_table)
        elements.append(Spacer(1, 14))

        # 🧩 Parse AI Resume Text (Prevent repetition)
        current_section = None
        seen_sections = set()

        skip_keywords = ["name", "email", "phone", "contact", "resume", "applying as"]
        section_keywords = {
            "summary": "🧠 PROFESSIONAL SUMMARY",
            "skill": "💻 TECHNICAL SKILLS",
            "education": "🎓 EDUCATION",
            "project": "🚀 PROJECTS",
            "certification": "🏅 CERTIFICATIONS",
            "experience": "💼 EXPERIENCE",
            "highlight": "🌟 ADDITIONAL HIGHLIGHTS",
        }

        for line in resume_text.splitlines():
            line = line.strip()
            if not line:
                continue

            lower = line.lower()
            if any(key in lower for key in skip_keywords):
                continue

            matched_section = next((k for k in section_keywords if k in lower), None)
            if matched_section and matched_section not in seen_sections:
                seen_sections.add(matched_section)
                elements.append(Paragraph(section_keywords[matched_section], section_title))
                current_section = matched_section
                continue

            if line.startswith("-"):
                elements.append(Paragraph(line[1:].strip(), bullet_style))
            else:
                elements.append(Paragraph(line, text_style))

        # ✨ Soft divider at the end
        elements.append(Spacer(1, 12))
        elements.append(HRFlowable(width="100%", thickness=0.8, color=accent_color))

        # Build PDF
        doc.build(elements)
        print(f"✅ Light Canva + ATS Resume Created: {pdf_path}")

        return FileResponse(pdf_path, media_type="application/pdf", filename=pdf_name)

    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Server Error: {e}")

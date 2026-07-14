from fastapi import APIRouter, Depends, Query, Response
from app.core.security import get_current_user
from app.core.rate_limiting import rate_limit_check
from app.services.pdf_report import ReportService

router = APIRouter()

@router.get("/export", dependencies=[Depends(rate_limit_check)])
def export_report(
    report_type: str = Query("summary"),
    format: str = Query("csv"),
    current_user: dict = Depends(get_current_user)
):
    """
    Generates and returns downloadable CSV/Excel files.
    """
    content = ReportService.generate_csv_report(report_type)
    
    media_type = "text/csv" if format == "csv" else "application/vnd.ms-excel"
    file_ext = "csv" if format == "csv" else "xls"
    filename = f"decisionpilot_report_{report_type}.{file_ext}"
    
    headers = {
        "Content-Disposition": f"attachment; filename={filename}"
    }
    return Response(content, media_type=media_type, headers=headers)

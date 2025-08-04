import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReportCard, ReportCardGenerationResponse } from '../models/report-card.model';

@Injectable({
  providedIn: 'root'
})
export class ReportCardService {
  private apiUrl = 'http://localhost:8000/api/v1/report-cards';

  constructor(private http: HttpClient) {}

  /**
   * Generate report cards for a specific class
   */
  generateReportCards(classModelId: number): Observable<ReportCardGenerationResponse> {
    return this.http.post<ReportCardGenerationResponse>(`${this.apiUrl}/generate`, {
      class_model_id: classModelId
    });
  }

  /**
   * Download a single report card PDF
   */
  downloadReportCard(reportCard: ReportCard): void {
    const link = document.createElement('a');
    link.href = reportCard.pdf_url;
    link.download = reportCard.path.split('/').pop() || `bulletin_${reportCard.student_session_id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Download all report cards as individual files
   */
  downloadAllReportCards(reportCards: ReportCard[]): void {
    reportCards.forEach((reportCard, index) => {
      setTimeout(() => {
        this.downloadReportCard(reportCard);
      }, index * 500); // Stagger downloads to avoid browser blocking
    });
  }

  /**
   * Get report cards for a specific class
   */
  getReportCardsByClass(classId: number): Observable<ReportCard[]> {
    return this.http.get<ReportCard[]>(`${this.apiUrl}/class/${classId}`);
  }

  /**
   * Create a ZIP file with all report cards (browser-based solution)
   */
  async createZipAndDownload(reportCards: ReportCard[], className: string): Promise<void> {
    try {
      const JSZip = await import('jszip');
      const zip = new JSZip.default();

     const classFolder = zip.folder(`Bulletins_${className}_${new Date().toLocaleDateString('fr-FR')}`);

      for (const reportCard of reportCards) {
        try {
          const response = await fetch(reportCard.pdf_url);
          const blob = await response.blob();
          const fileName = reportCard.path.split('/').pop() || `bulletin_${reportCard.student_session_id}.pdf`;
          classFolder?.file(fileName, blob);
        } catch (error) {
          console.error(`Failed to download ${reportCard.pdf_url}:`, error);
        }
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `Bulletins_${className}_${new Date().toLocaleDateString('fr-FR')}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error creating ZIP file:', error);
      // Fallback to individual downloads
      this.downloadAllReportCards(reportCards);
    }
  }
}

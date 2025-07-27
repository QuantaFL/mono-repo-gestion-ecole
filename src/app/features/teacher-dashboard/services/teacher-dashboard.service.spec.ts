import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TeacherDashboardService } from './teacher-dashboard.service';
import { PerformanceSummaryResponse } from '../models/performance-summary';

describe('TeacherDashboardService', () => {
  let service: TeacherDashboardService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TeacherDashboardService]
    });
    service = TestBed.inject(TeacherDashboardService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve performance summary', () => {
    const mockResponse: PerformanceSummaryResponse = {
      bestPerformingStudent: {
        studentId: 123,
        firstName: 'John',
        lastName: 'Doe',
        averageGrade: 98.2
      },
      worstPerformingStudent: {
        studentId: 456,
        firstName: 'Jane',
        lastName: 'Smith',
        averageGrade: 55.7
      }
    };

    const classId = 1;
    const subjectId = 2;

    service.getPerformanceSummary({ classId, subjectId }).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(
      `/api/teacher/dashboard/performance-summary?classId=${classId}&subjectId=${subjectId}`
    );
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
  });
});

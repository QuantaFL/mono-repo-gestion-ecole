import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { StudentService } from "../../services/student.service";
import { Router } from "@angular/router";
import { Student } from "../../models/student";
import lottie, { AnimationItem } from 'lottie-web';
@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss'
})

export class StudentListComponent implements OnInit, AfterViewInit, OnDestroy {
  students: Student[] = [];
  filteredStudents: Student[] = [];
  paginatedStudents: Student[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  totalPages: number = 1;
  totalPagesArray: number[] = [];

  @ViewChild('lottieContainer', { static: false }) lottieContainer?: ElementRef;
  private lottieInstance?: AnimationItem;

  constructor(
    private studentService: StudentService,
    private router: Router,
   ) { }

  ngOnInit(): void {
    this.studentService.getAllStudents().subscribe({
      next: (res) => {
        this.students = res || [];
        this.applySearchAndPagination();
      },
      error: () => {
        alert('Erreur lors du chargement des étudiants.');
      }
    });
  }

  ngAfterViewInit(): void {
    this.tryLoadLottie();
  }

  ngOnDestroy(): void {
    if (this.lottieInstance) {
      this.lottieInstance.destroy();
    }
  }

  private tryLoadLottie(): void {
    setTimeout(() => {
      if (this.filteredStudents.length === 0 && this.lottieContainer) {
        if (this.lottieInstance) {
          this.lottieInstance.destroy();
        }
        this.lottieInstance = lottie.loadAnimation({
          container: this.lottieContainer.nativeElement,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: 'https://assets2.lottiefiles.com/packages/lf20_4kx2q32n.json',
        });
      } else if (this.lottieInstance) {
        this.lottieInstance.destroy();
        this.lottieInstance = undefined;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.applySearchAndPagination();
    this.tryLoadLottie();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.applySearchAndPagination();
    this.tryLoadLottie();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.applySearchAndPagination();
    this.tryLoadLottie();
  }

  private applySearchAndPagination(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredStudents = this.students.filter(student => {
      const fullName = `${student.userModel.first_name} ${student.userModel.last_name}`.toLowerCase();
      const email = student.userModel.email?.toLowerCase() || '';
      const matricule = student.userModel.matricule?.toLowerCase() || '';
      return (
        !term ||
        fullName.includes(term) ||
        email.includes(term) ||
        matricule.includes(term)
      );
    });
    this.totalPages = Math.max(1, Math.ceil(this.filteredStudents.length / this.pageSize));
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedStudents = this.filteredStudents.slice(start, end);
  }

  // ngOnInit() {
  //   this.studentService.getAllStudents().subscribe(data => this.students = data);
  // }
  // SUPPRESSION SANS MODAL
  deleteStudent(student: Student) {
    // if (confirm(`Voulez-vous vraiment supprimer l'étudiant ${student.firstName} ${student.lastName} ?`)) {
    //   this.studentService.deleteStudent(student.id).subscribe({
    //     next: () => {
    //       this.students = this.students.filter(s => s.id !== student.id);
    //     },
    //     error: () => {
    //       alert('Erreur lors de la suppression de l\'étudiant.');
    //     }
    //   });
    // }
  }

}

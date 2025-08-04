# Product Requirements Document: Teacher Dashboard

## 1. Introduction
This document outlines the requirements for the Teacher Dashboard, a web-based interface designed to provide teachers with a centralized platform to manage their classes, view student information, and track academic progress within the current academic year.

## 2. Goals
*   To provide teachers with an intuitive and efficient way to access their assigned classes and student data.
*   To display relevant academic year information and teacher's profile at a glance.
*   To enable teachers to view student grades for the current term within their assigned classes.

## 3. User Roles
*   **Teacher:** The primary user of this dashboard. Teachers will have access to their specific classes and associated student data.

## 4. Features

### 4.1. Dashboard Overview
*   **Description:** The main landing page for the teacher, providing a summary of key information.
*   **Components:**
  *   **Current Academic Year Display:** Clearly shows the active academic year.
  *   **Teacher Profile Information:** Displays the teacher's name, email, and other relevant profile details.

### 4.2. My Classes (Sidebar Navigation)
*   **Description:** A navigation section in the sidebar listing all classes assigned to the teacher for the current academic year.
*   **Functionality:**
  *   Each class listed should be clickable, leading to the "Class Details" view for that specific class.

### 4.3. Class Details
*   **Description:** Upon selecting a class from the sidebar, this view displays the students enrolled in that class for the current academic year, along with their grades for the current term.
*   **Components:**
  *   **Class Name/Identifier:** Prominently displayed.
  *   **Student List:** A table or list of students enrolled in the selected class.
    *   Each student entry should include their name and other relevant identifiers.
  *   **Grades Display:** For each student, display their grades for the *current term only*.
    *   If a student has no grade recorded for the current term, an empty or "N/A" indicator should be shown.

### 4.4. Teacher Profile Display
*   **Description:** A dedicated section or page accessible from the dashboard that displays the teacher's detailed profile information.
*   **Components:**
  *   Teacher's Name
  *   Email Address
  *   Phone Number (if applicable)
  *   List of assigned subjects (as seen in `getTeacherProfile` method).

## 5. Technical Considerations

### 5.1. Resource Responses

#### AcademicYearResource
```json
{
    "id": 1,
    "label": "2024-2025",
    "start_date": "2024-09-01",
    "end_date": "2025-06-30",
    "status": "en_cours",
    "created_at": "2024-07-26T12:00:00.000000Z",
    "updated_at": "2024-07-26T12:00:00.000000Z"
}
```

#### AssignementResource
```json
{
    "id": 1,
    "created_at": "2024-07-26T12:00:00.000000Z",
    "updated_at": "2024-07-26T12:00:00.000000Z",
    "teacher_id": 1,
    "class_model_id": 1,
    "subject_id": 1,
    "term_id": 1,
    "teacher": { /* TeacherResource */ },
    "classModel": { /* ClassModelResource */ },
    "subject": { /* SubjectResource */ },
    "term": { /* AcademicYearResource (Note: This seems incorrect, should be TermResource) */ }
}
```

#### ClassModelResource
```json
{
    "id": 1,
    "name": "Grade 7A",
    "level": "Middle School",
    "current_academic_year_student_sessions": null, // or { /* StudentSession details */ }
    "created_at": "2024-07-26T12:00:00.000000Z",
    "updated_at": "2024-07-26T12:00:00.000000Z"
}
```

#### GradeResource
```json
{
    "id": 1,
    "mark": 85.5,
    "created_at": "2024-07-26T12:00:00.000000Z",
    "updated_at": "2024-07-26T12:00:00.000000Z",
    "assignement_id": 1,
    "student_session_id": 1,
    "term_id": 1,
    "assignement": { /* AssignementResource */ },
    "student_session": { /* StudentSession details */ },
    "subject": { /* SubjectResource (Note: This seems incorrect, subject is part of assignement) */ },
    "term": { /* TermResource */ }
}
```

#### ParentResource
```json
{
    "id": 1,
    "userModel": { /* UserModelResource */ },
    "children": [] // or [ { /* StudentResource */ } ]
}
```

#### ReportCardResource
```json
{
    "id": 1,
    "average_grade": 88.0,
    "honors": "Cum Laude",
    "path": "public/reports/report_card_1.pdf",
    "pdf_url": "http://localhost/storage/reports/report_card_1.pdf",
    "rank": 5,
    "created_at": "2024-07-26T12:00:00.000000Z",
    "updated_at": "2024-07-26T12:00:00.000000Z",
    "student_session_id": 1,
    "term_id": 1,
    "student": { /* StudentResource */ },
    "term": { /* TermResource */ }
}
```

#### StudentResource
```json
{
    "id": 1,
    "matricule": "STU001",
    "created_at": "2024-07-26T12:00:00.000000Z",
    "updated_at": "2024-07-26T12:00:00.000000Z",
    "parent_model_id": 1,
    "user_model_id": 1,
    "current_academic_year_student_sessions": null, // or { /* StudentSession details */ }
    "parentModel": { /* ParentResource */ },
    "userModel": { /* UserModelResource */ },
    "academic_records_url": "http://localhost/storage/academic_records/stu001.pdf"
}
```

#### SubjectResource
```json
{
    "id": 1,
    "name": "Mathematics",
    "level": "High School",
    "coefficient": 4,
    "created_at": "2024-07-26T12:00:00.000000Z",
    "updated_at": "2024-07-26T12:00:00.000000Z"
}
```

#### TeacherResource
```json
{
    "id": 1,
    "hire_date": "2020-09-01",
    "created_at": "2024-07-26T12:00:00.000000Z",
    "updated_at": "2024-07-26T12:00:00.000000Z",
    "user_model_id": 1,
    "subjects": [], // or [ { /* SubjectResource */ } ]
    "assigned_classes": [], // or [ { /* ClassModelResource */ } ]
    "userModel": { /* UserModelResource */ }
}
```

#### TermResource
```json
{
    "id": 1,
    "name": "Term 1",
    "created_at": "2024-07-26T12:00:00.000000Z",
    "updated_at": "2024-07-26T12:00:00.000000Z",
    "academic_year_id": 1,
    "academic_year": { /* AcademicYearResource */ }
}
```

#### UserModelResource
```json
{
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "birthday": "1980-01-01",
    "email": "john.doe@example.com",
    "password": "********", // Password should not be exposed in actual API responses
    "adress": "123 Main St",
    "phone": "123-456-7890",
    "role_id": 1,
    "role": {
        "id": 1,
        "name": "Teacher"
    },
    "created_at": "2024-07-26T12:00:00.000000Z",
    "updated_at": "2024-07-26T12:00:00.000000Z",
    "isFirstLogin": false
}
```

### 5.2. API Endpoints

*   `GET /api/teacher/profile`: To fetch teacher's profile details (already exists as `getTeacherProfile` in `TeacherController`).
    *   **Expected Response:** `TeacherResource`

*   `GET /api/teacher/{teacherId}/classes`: To retrieve classes assigned to the teacher for the current academic year (already exists as `getClasses` in `TeacherController`).
    *   **Expected Response:** Array of `ClassModelResource`

*   `GET /api/academic-year/current`: To determine the current academic year (can be implemented in `AcademicYearController` or a helper). The `AcademicYear::getCurrentAcademicYear()` method already exists.
    *   **Expected Response:** `AcademicYearResource`

*   `GET /api/terms/current`: **EXISTING** To retrieve the current term for the active academic year. This will likely involve using `AcademicYear::getCurrentAcademicYear()` and then finding the current term within that academic year.
    *   **Expected Response:** `TermResource`

*   `GET /api/classes/{classId}/students`: **EXISTING** To retrieve students enrolled in a specific class for the current academic year. This will likely involve querying the `student_sessions` table.
    *   **Expected Response:** Array of objects with `id`, `name`, `matricule`, `user_model_id`, `student_session_id` (derived from `StudentResource` and `UserModelResource`)
    ```json
    [
        {
            "id": 201,
            "name": "Alice Smith",
            "matricule": "STU001",
            "user_model_id": 501,
            "student_session_id": 301
        },
        {
            "id": 202,
            "name": "Bob Johnson",
            "matricule": "STU002",
            "user_model_id": 502,
            "student_session_id": 302
        }
    ]
    ```

*   `GET /api/grades/class/{classId}/term/{termId}/students/{studentId}`: **EXISTING** To retrieve all grades for a specific student within a given class and term. The existing `getGradesByTerm` in `GradeController` requires a `subject_id`, which is not suitable for displaying all grades for a student across all subjects in a class. A new or modified endpoint is needed to fetch all grades for a student in a class for the current term, regardless of subject.
    *   **Expected Response:** Array of objects with `id`, `mark`, `type`, `subject_name`, `assignement_id`, `student_session_id`, `term_id` (derived from `GradeResource` and `SubjectResource`)
    ```json
    [
        {
            "id": 1,
            "mark": 85.5,
            "type": "exam",
            "subject_name": "Mathematics",
            "assignement_id": 10,
            "student_session_id": 301,
            "term_id": 1
        },
        {
            "id": 2,
            "mark": 92.0,
            "type": "quiz",
            "subject_name": "Physics",
            "assignement_id": 11,
            "student_session_id": 301,
            "term_id": 1
        },
        {
            "id": 3,
            "mark": null,
            "type": null,
            "subject_name": "Chemistry",
            "assignement_id": 12,
            "student_session_id": 301,
            "term_id": 1
        }
    ]
    ```

*   `PUT /api/grades/update`: **EXISTING** To update student grades (exists as `updateGrades` in `GradeController`).
    *   **Expected Request Body:**
    ```json
    {
        "grades": [
            {
                "id": 1, // Optional, if updating existing grade
                "mark": 88.0,
                "type": "exam",
                "assignement_id": 10,
                "student_session_id": 301,
                "term_id": 1
            },
            {
                "mark": 75.0, // New grade
                "type": "quiz",
                "assignement_id": 13,
                "student_session_id": 301,
                "term_id": 1
            }
        ]
    }
    ```
    *   **Expected Response:**
    ```json
    {
        "message": "Grades updated successfully"
    }
    ```

*   `POST /api/grades/submit-term-notes/{class_id}`: **EXISTING** To submit grades for a term for a specific class (exists as `submitTermNotes` in `GradeController`).
    *   **Expected Request Body:**
    ```json
    {
        "term_id": 1
    }
    ```
    *   **Expected Response:**
    ```json
    {
        "message": "Notes submitted successfully for the term."
    }
    ```

## 6. Future Enhancements (Optional)
*   Ability to input/edit grades directly from the dashboard.

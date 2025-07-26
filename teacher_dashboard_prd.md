## Product Requirements Document: Teacher Dashboard

**1. Introduction**

This document outlines the functional requirements for the Teacher Dashboard module within the Portail Education API system. The primary goal of this module is to provide teachers with a centralized, intuitive interface to manage their classes, record student grades, and access relevant academic information for the current academic year and term.

**2. Target Audience**

*   Teachers using the Portail Education API system.

**3. Features and Functionality**

The Teacher Dashboard will consist of the following main sections:

**3.1. Global Navigation (Sidebar)**

The sidebar will provide quick access to the main sections of the teacher's interface:

*   **Dashboard:** Overview of key information.
*   **Mes Classes:** List of classes assigned to the teacher.
*   **Mon Profile:** Teacher's personal and professional profile.
*   **Logout:** Securely log out of the system.

**3.2. Dashboard Section**

This section will serve as the teacher's landing page, providing an at-a-glance summary of relevant academic information.

*   **Current Academic Year Display:** Clearly show the active academic year.
*   **Current Term Display:** Clearly show the active term within the current academic year.
*   **Key Metrics/Summaries (Future Consideration):** Potentially display quick summaries like upcoming assignments, unsubmitted grades, etc. (Not explicitly requested but good to note for future).

**3.3. Mes Classes Section**

This section allows teachers to manage their assigned classes.

*   **List of Assigned Classes:** Display a list of all classes currently assigned to the teacher for the *current academic year*. Each class entry should be clickable.
*   **Class Selection:** Upon clicking a specific class from the list, the system will navigate to the "Class Details" view for that selected class.

**3.4. Class Details & Note Entry Section**

This is the core functionality for grade management.

*   **Student List Display:** For the selected class, display a comprehensive list of all students enrolled in that class for the *current term*.
*   **Note Saisie (Grade Entry) Interface:**
  *   For each student, provide an input mechanism to enter their grades/notes for the *current term*.
  *   The interface should be designed for efficient data entry for all students in the class.
  *   Validation: Implement appropriate validation for grade inputs (e.g., numerical range, format).
*   **Save/Update Notes:**
  *   **"Send to Update" Action:** A button or similar control will allow the teacher to save the entered/modified notes for the current class and term. This action should update the grades in the system without necessarily finalizing them for the term. This allows for iterative saving.
*   **Submit Notes for Term:**
  *   **"Submit Notes for Term" Action:** A distinct button or control will allow the teacher to finalize and submit all notes for the *current term* for the selected class. This action should ideally lock the grades for that term, preventing further edits unless explicitly unlocked by an administrator. This action is available when the term is completed or the teacher decides to finalize.

**3.5. Mon Profile Section**

This section allows teachers to view their personal and professional information.

*   **View Profile Information:** Display the teacher's name, contact details, assigned subjects, and any other relevant profile information.
*   **Edit Profile (Future Consideration):** Ability to edit certain profile fields (e.g., contact information) if allowed by system policies. (Not explicitly requested but common).

**4. User Flow Examples**

**4.1. Viewing Class and Entering Notes**

1.  Teacher logs in and lands on the "Dashboard" section.
2.  Teacher clicks "Mes Classes" in the sidebar.
3.  System displays a list of classes assigned to the teacher for the current academic year. (Leverages existing API)
4.  Teacher clicks on "Class A - Grade 7".
5.  System displays the list of students in "Class A - Grade 7" for the current term, with input fields for notes. (Leverages existing API, potentially with enhancements)
6.  Teacher enters notes for multiple students.
7.  Teacher clicks "Send to Update" to save progress. (Leverages existing API)
8.  Teacher continues entering notes or navigates away.

**4.2. Submitting Notes for a Term**

1.  Teacher is in the "Class Details" view for "Class A - Grade 7".
2.  Teacher has completed entering all notes for the current term for all students.
3.  Teacher clicks "Submit Notes for Term".
4.  System prompts for confirmation.
5.  Upon confirmation, notes are finalized and submitted for the term. (New API)

**5. API Endpoints**

This section outlines the necessary API endpoints for the Teacher Dashboard functionality. All endpoints should be authenticated and authorized for teacher roles.

**5.1. Dashboard Data**

*   **GET /api/v1/academic-years/current**
  *   **Description:** Retrieves the current academic year. (Existing API)
  *   **Response Example:**
      ```json
      {
          "id": 1,
          "name": "2024-2025",
          "start_date": "2024-09-01",
          "end_date": "2025-06-30"
      }
      ```

*   **GET /api/v1/terms/current**
  *   **Description:** Retrieves the current active term. (Existing API)
  *   **Response Example:**
      ```json
      {
          "id": 1,
          "name": "Term 1",
          "start_date": "2024-09-01",
          "end_date": "2024-12-31"
      }
      ```

*   **GET /api/teacher/dashboard** (Proposed New Endpoint - Optional, for combined data)
  *   **Description:** Retrieves combined dashboard data including current academic year and active term. This can be an aggregation of the above two endpoints for a single frontend call.
  *   **Response Example:**
      ```json
      {
          "current_academic_year": { ... },
          "current_term": { ... }
      }
      ```

**5.2. Mes Classes (Teacher's Classes)**

*   **GET /api/v1/teachers/{teacher_id}/classes**
  *   **Description:** Retrieves a list of classes assigned to the authenticated teacher for the current academic year. The `{teacher_id}` can be obtained from the authenticated user's context.
  *   **Response Example:**
      ```json
      [
          {
              "id": 101,
              "name": "Math - Grade 7",
              "academic_year_id": 1,
              "teacher_id": 501
          },
          {
              "id": 102,
              "name": "Science - Grade 8",
              "academic_year_id": 1,
              "teacher_id": 501
          }
      ]
      ```

**5.3. Class Details & Student Notes**

*   **GET /api/v1/grades?term_id={term_id}&class_id={class_id}** (Leveraging and potentially enhancing existing API)
  *   **Description:** Retrieves the list of students for a specific class and their current notes for the specified term. This assumes the existing `/grades` endpoint can be filtered by `term_id` and `class_id`.
  *   **Parameters:**
    *   `term_id`: The ID of the current term.
    *   `class_id`: The ID of the class.
  *   **Response Example:**
      ```json
      [
          {
              "student_id": 201,
              "student_name": "Alice Smith",
              "grade_id": 1001, // Existing grade ID if applicable
              "value": 85,
              "status": "draft" // e.g., draft, submitted
          },
          {
              "student_id": 202,
              "student_name": "Bob Johnson",
              "grade_id": null,
              "value": null,
              "status": "pending"
          }
      ]
      ```

*   **POST /api/v1/grades** (Leveraging existing API)
  *   **Description:** Saves/updates notes for multiple students. This is for iterative saving. The existing `/grades` POST endpoint is assumed to handle an array of grade objects.
  *   **Request Body Example:**
      ```json
      [
          {
              "student_id": 201,
              "class_id": 101,
              "term_id": 1,
              "value": 88
          },
          {
              "student_id": 202,
              "class_id": 101,
              "term_id": 1,
              "value": 75
          }
      ]
      ```
  *   **Response Example:**
      ```json
      {
          "message": "Grades updated successfully."
      }
      ```

*   **POST /api/v1/classes/{class_id}/notes/submit** (Proposed New Endpoint)
  *   **Description:** Submits and finalizes notes for all students in a specific class for the current term. This action should update the status of all grades for the given class and term to 'submitted' and potentially lock them.
  *   **Parameters:**
    *   `class_id`: The ID of the class.
  *   **Request Body Example:**
      ```json
      {
          "term_id": 1
      }
      ```
  *   **Response Example:**
      ```json
      {
          "message": "Notes submitted successfully for the term."
      }
      ```

**5.4. Mon Profile (Teacher Profile)**

*   **GET /api/teacher/profile** (Proposed New Endpoint)
  *   **Description:** Retrieves the authenticated teacher's profile information.
  *   **Response Example:**
      ```json
      {
          "id": 501,
          "name": "John Doe",
          "email": "john.doe@example.com",
          "phone": "123-456-7890",
          "assigned_subjects": ["Math", "Physics"]
      }
      ```

**6. Non-Functional Requirements (Considerations)**

*   **Security:** All data entry and retrieval must be secure, with proper authentication and authorization checks.
*   **Performance:** The dashboard and note entry interfaces should load quickly and respond efficiently, even with large class sizes.
*   **Usability:** The interface should be intuitive and easy to navigate for teachers.
*   **Data Integrity:** Ensure that grades are accurately saved and associated with the correct student, class, and term.
*   **Error Handling:** Provide clear feedback to the user in case of errors (e.g., invalid input, network issues).

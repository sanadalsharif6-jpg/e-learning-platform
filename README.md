# E-Learning Platform

A full-stack e-learning platform connecting teachers and students, built as a software engineering internship project.

## Features

**Teachers**
- Register, log in, manage profile (bio, subject/expertise)
- Create, edit, and delete courses
- Add, edit, and delete lessons (text content, external links, file attachments)
- Create, edit, and delete assignments with due dates
- View student submissions per assignment
- Grade submissions (0–100) with written feedback
- Dashboard showing owned courses and pending grading

**Students**
- Register, log in
- Browse teachers and their courses
- Browse and enroll in courses (duplicate enrollment prevented)
- Read lessons and download attached files
- View assignments and submit answers (text and/or file)
- Automatic on-time/late detection based on due date
- Resubmit before grading is finalized
- View grades and feedback (visible only to the submitting student)
- Dashboard showing enrolled courses

**Security**
- JWT-based authentication
- Role-based access control (Teacher/Student) enforced on every endpoint
- Course, lesson, and assignment ownership enforced server-side
- Students cannot view or modify other students' submissions or grades

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, React Router, Axios
- **Backend:** Python, Django, Django REST Framework
- **Database:** PostgreSQL
- **Authentication:** JWT (djangorestframework-simplejwt)

## Project Structure

e-learning-platform/
├── backend/
│ ├── config/ # Django project settings, URLs
│ ├── accounts/ # Custom User model, auth, teacher directory
│ ├── courses/ # Course CRUD
│ ├── lessons/ # Lessons (with file uploads)
│ ├── enrollment/ # Student enrollment
│ ├── assignments/ # Assignments
│ └── submissions/ # Submissions, grading
└── frontend/
└── src/
├── pages/ # All route pages
├── components/ # Navbar
└── services/ # API calls


## Setup

### Prerequisites
- Python 3.10+
- Node.js and npm
- PostgreSQL

### Backend

```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1      # Windows
pip install -r requirements.txt
```

Create a `.env` file in `backend/` (see `.env.example`):

SECRET_KEY=your-secret-key
DEBUG=True
DB_NAME=elearning_db
DB_USER=postgres
DB_PASSWORD=your-db-password
DB_HOST=localhost
DB_PORT=5432


Create the PostgreSQL database, then run:
```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend runs at `http://127.0.0.1:8000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Test Accounts

| Role | Username | Password |
|------|----------|----------|
| Teacher | teacher1 | SecurePass123! |
| Student | student1 | SecurePass123! |

## API Overview

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/register/` | POST | Register a new user |
| `/api/auth/login/` | POST | Log in, returns JWT tokens |
| `/api/auth/me/` | GET | Current user's profile |
| `/api/auth/teachers/` | GET | List all teachers |
| `/api/courses/` | GET, POST | List / create courses |
| `/api/courses/<id>/` | GET, PUT, DELETE | Course detail / edit / delete |
| `/api/courses/mine/` | GET | Teacher's own courses |
| `/api/courses/<id>/enroll/` | POST | Enroll in a course |
| `/api/courses/<id>/lessons/` | GET, POST | List / create lessons |
| `/api/courses/<id>/assignments/` | GET, POST | List / create assignments |
| `/api/assignments/<id>/submit/` | GET, POST | View / submit your submission |
| `/api/assignments/<id>/submissions/` | GET | Teacher: view all submissions |
| `/api/submissions/<id>/grade/` | PATCH | Grade a submission |
| `/api/submissions/pending-grading/` | GET | Teacher: ungraded submissions |

## Testing

All core functionality and permission rules were manually tested end-to-end, including:
- Role-based restrictions (students cannot create courses, grade, or access other students' work)
- Ownership enforcement (a teacher cannot edit another teacher's course)
- Enrollment-gated access to lessons and assignments
- On-time/late submission detection
- Resubmission behavior (clears grade to flag for re-review)
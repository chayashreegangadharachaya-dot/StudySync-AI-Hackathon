# StudySync AI — Intelligent Study Planner & Progress Tracker

## Hackathon Problem
Students struggle to manage subjects, topics, exams, assignments, limited study time, and changing progress. A fixed timetable becomes ineffective when a student misses tasks.

## Proposed Solution
StudySync AI creates a personalized study plan using deadlines, topic difficulty, progress, and available study hours. It prioritizes urgent/weak topics, tracks completion, and automatically rebuilds the remaining plan when tasks are missed.

## Core Features
- Demo login / registration
- Add subjects and topics
- Exam and assignment deadlines
- Available study hours
- Intelligent priority scoring
- Automatic daily study plan
- Mark tasks complete / missed
- Automatic rescheduling
- Subject-wise progress
- Upcoming exams and deadlines
- Dashboard + charts
- Calendar/timetable view
- Weak-subject recommendations
- Daily/weekly summary
- AI-ready architecture (rule engine can later be connected to an LLM API)

## Run
No installation is required.

1. Open `index.html` in a browser.
2. For best results during a demo, use VS Code Live Server or:
   `python -m http.server 8000`
3. Open `http://localhost:8000`

## Demo Story
1. Login with any name/email/password.
2. Review the sample student dashboard.
3. Add a topic or use the existing sample data.
4. Complete a task and watch progress update.
5. Mark a task as missed and click **Auto Reschedule**.
6. Show the changed timetable and priority alert.
7. Open the calendar and analytics views.

## Suggested Pitch
"StudySync AI is not just a timetable. It is a dynamic study assistant. It understands what a student has to study, how difficult it is, how much time is available, and how close the deadline is. When the student falls behind, the system adapts the remaining schedule automatically."

## Tech
HTML5 + CSS3 + Vanilla JavaScript + Chart.js CDN. LocalStorage is used for the prototype so the app can run without a backend.

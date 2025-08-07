# TeamTeach Application - Assignment 2

**Students:** James Manson (s4097015), (s4089419)
**GitHub Link:** https://github.com/rmit-fsd-2025-s1/s4097015-s4089419-a2

## Project Overview

Full stack candidate/lecturer application management system built with React and a Node.js/TypeORM backend.

## Prereqs

- Node.js
- npm
- MySQL database

## Installation and Setup

### Candidate/Lecturer Backend setup

1. Navigate to backend directory

```bash
cd node-express-typeorm
```

2. Install dependencies:

```bash
npm install
```

3. Run the backend

```bash
npm run dev
```

The Candidate/Lecturer server will be running on `http://localhost:3001`

### Candidate/Lecturer Frontend Setup

1. Navigate to frontend directory

```bash
cd my-app
```

2. Install dependencies:

```bash
npm install
```

3. Run the frontend

```bash
npm run dev
```

Candidate/Lecturer front end runs on `http://localhost:3000`

### Admin Backend setup

1. Navigate to backend directory

```bash
cd Admin
```

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Run the backend

```bash
npm run dev
```

The Admin server will be running on `http://localhost:3000`, unless the Candidate/Lecturer frontend is also running in which case it will be on `http://localhost:3002`

### Admin Frontend setup

1. Navigate to backend directory

```bash
cd Admin
```

```bash
cd my-app
```

2. Install dependencies:

```bash
npm install
```

3. Run the frontend

```bash
npm run dev
```

The Admin frontend will be running on `http://localhost:3002`

## User Details:

### Login details for candidates:

| Email                          | Password            |
| ------------------------------ | ------------------- |
| `alice.johnson@student.edu`    | `Password123!`      |
| `bob.smith@student.edu`        | `SecurePass456!`    |
| `carol.davis@student.edu`      | `StrongPass789!`    |
| `david.wilson@student.edu`     | `MyPassword101!`    |
| `emma.brown@student.edu`       | `TutorPass202!`     |
| `frank.miller@student.edu`     | `CandidatePass303!` |
| `grace.taylor@student.edu`     | `StudyHelper404!`   |
| `henry.anderson@student.edu`   | `LabAssist505!`     |
| `isabel.thomas@student.edu`    | `TechTutor606!`     |
| `jack.jackson@student.edu`     | `MathHelper707!`    |
| `katie.white@student.edu`      | `CodeMentor808!`    |
| `liam.harris@student.edu`      | `PhysicsAce909!`    |
| `mia.martin@student.edu`       | `ChemHelper010!`    |
| `noah.garcia@student.edu`      | `BioTutor111!`      |
| `olivia.rodriguez@student.edu` | `EngHelper222!`     |
| `peter.kim@student.edu`        | `StudyBuddy333!`    |
| `quinn.lee@student.edu`        | `TutorHelper444!`   |
| `ruby.chen@student.edu`        | `MathWhiz555!`      |
| `sam.patel@student.edu`        | `CodeExpert666!`    |
| `tina.wu@student.edu`          | `LabPro777!`        |

### Login details for lecturers:

| Email                          | Password            |
| ------------------------------ | ------------------- |
| `prof.johnson@university.edu`  | `LecturerPass123!`  |
| `dr.smith@university.edu`      | `TeachingPro456!`   |
| `prof.davis@university.edu`    | `ProfessorPass789!` |
| `dr.wilson@university.edu`     | `EduLeader101!`     |
| `prof.brown@university.edu`    | `AcademicPro202!`   |
| `dr.taylor@university.edu`     | `UniversityPro303!` |
| `prof.anderson@university.edu` | `TeachMaster404!`   |
| `dr.garcia@university.edu`     | `EduExpert505!`     |

The final login (dr.garcia@university.edu) has access to every course in the initial database.

### Login details for admin:

| Username | Password |
| -------- | -------- |
| `admin`  | `admin`  |

## Features

### Candidates

- Create applications
- View previous applications
- Look at their profile (includes info on their rating etc)

### Lecturers

- View, accept and rank candidate applications
- Provide feedback on applications
- Look at their profile (includes info on their assigned courses etc)

### Admins

- Assign and unassign lecturers from courses
- Manage courses (create, edit, delete)
- Block and unblock candidate accounts
- Generate reports

## References:

- Course Materials
  - Labs from Weeks 1-12
  - Lectures from Weeks 1-12
- Third-party Libraries
  - Chakra UI: https://www.chakra-ui.com/
  - Chart.js: https://www.chartjs.org/
  - TypeORM: https://typeorm.io/
  - bcrypt: https://www.npmjs.com/package/bcrypt
- Other Resources
  - TypeScript and React official documentation
- AI Assistance
  - AI was used to generated dummy database data (applications, candidates, lecturers, courses)

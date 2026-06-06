# Preproute Test Management Application

## Project Overview

A responsive Test Management Application built as part of the Preproute Frontend Developer Assessment.

The application allows administrators to create, manage, preview, and publish tests. It includes authentication, test management, question management, API integration, and responsive user interfaces based on the provided Figma designs.

---

## Features Implemented

### Authentication

* User Login
* Protected Routes
* Session Management

### Dashboard

* View all available tests
* Test status display
* Easy navigation to test management pages

### Test Management

* Create new tests
* Edit existing tests
* Manage test details such as:

  * Test Name
  * Subject
  * Topics
  * Marking Scheme

### Question Management

* Add MCQ questions
* Add multiple options
* Select correct answers
* Edit question details

### Preview & Publish

* Preview complete test before publishing
* Publish test workflow
* Test status management

### API Integration

* Backend API integration using Axios
* Error handling
* Loading states
* CRUD operations support

### Responsive Design

* Mobile-friendly UI
* Tablet support
* Desktop support
* Implemented according to provided Figma designs

---

## Tech Stack

* React
* TypeScript
* Vite
* React Router
* Axios
* CSS

---

## Project Structure

```text
src/
├── components/
├── pages/
├── services/
├── types/
├── assets/
└── App.tsx
```

---

## Setup Instructions

### Clone Repository

```bash
git clone <repository-url>
```

### Navigate to Project

```bash
cd frontend
```

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

---

## Deployment URL

Vercel Deployment:

https://your-vercel-url.vercel.app

---

## Login Credentials

Username: vedant-admin

Password: vedant123

---

## Technical Decisions

* React and TypeScript were used to ensure maintainable and type-safe code.
* Axios was used for API communication and request handling.
* React Router was used for navigation and route protection.
* Component-based architecture was followed for reusability and scalability.
* Responsive layouts were implemented to support multiple screen sizes.

---

## Author

Ashvanth

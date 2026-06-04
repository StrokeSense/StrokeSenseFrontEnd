# StrokeSense Frontend

React.js frontend for **StrokeSense** — a stroke risk early-detection web application.

StrokeSense helps users estimate their stroke risk by submitting basic health information, then displaying a risk percentage, risk category, and recommendation output from the connected backend and AI prediction API.

---

## Product Development Results

The frontend has been developed and connected to the deployed backend and AI prediction API. The application is also deployed publicly using Vercel.

### Implemented Features

- Health data input form using 8 required fields:
  - Age
  - Hypertension
  - Heart disease
  - Ever married
  - Work type
  - Average glucose level
  - BMI
  - Smoking status
- 3-step form flow to make data entry easier and cleaner.
- Stroke risk prediction using deployed backend and AI API.
- Risk result display including:
  - Risk percentage
  - Risk category
  - Model source
  - Model version
- Personalized recommendation section based on prediction output.
- BMI calculator to help users calculate BMI before submitting the form.
- Prediction history page.
- Browser/local storage history so each user only sees predictions stored on their own device/browser.
- Clear browser history and delete prediction history actions.
- English and Bahasa Indonesia language toggle.
- Form validation for required health fields.
- Responsive frontend interface.
- Deployed frontend using Vercel.

---

## Deployment Links

Frontend:  
https://stroke-sense-front-end.vercel.app

Backend:  
https://strokesense-backend.vercel.app

AI API:  
https://luthfi13wa-strokesense-ai-api.hf.space

Mockup / UI Design:  
https://drive.google.com/drive/folders/1oAR3qIJwpBihKmOnB718HlBzxUbdBbYQ?usp=sharing

---

## Why This Implementation Was Chosen

The implementation was designed to make the stroke risk screening flow simple and easy to use. The health form is divided into three steps so users do not feel overwhelmed by too many inputs at once.

The BMI calculator was added because BMI is one of the required fields, but some users may not know their BMI value. This helps users complete the form without needing to calculate BMI manually outside the application.

Prediction history is stored using browser local storage to improve privacy for this MVP version. This means prediction history is only saved on the user’s own device/browser and is not shown publicly to other users.

The English and Bahasa Indonesia language toggle was added so the application can be understood by both English-speaking users and Indonesian users.

---

## Tech Stack

- React.js
- Vite
- Tailwind CSS
- React Router v6
- React Hook Form
- Zod
- Axios
- Framer Motion
- Recharts
- Lucide React
- Vercel

---

## Setup

### 1. Install dependencies

```bash
npm install
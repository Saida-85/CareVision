# CareVision

A community-driven event management and social action platform built to connect volunteers, organize impactful community initiatives, and manage events seamlessly.

🔗 **Live Site URL:** [https://care-vision-three.vercel.app/](https://care-vision-three.vercel.app/)

---

## ✨ Key Features

- **Secure Authentication System**: Robust email/password registration alongside Google OAuth authentication powered by Better Auth and MongoDB Atlas.
- **Dynamic Event Discovery**: Browse and explore upcoming community events with real-time server and client-side data synchronization.
- **Interactive Event Participation**: Seamlessly join or leave community initiatives with instant state updates and volunteer count tracking.
- **Event Management Dashboard**: Empower organizers to easily create, update, and track community initiatives through a dedicated control panel.
- **JWT & Role-Based Security**: Protected routes and API endpoints using JSON Web Tokens to safeguard organizer and user actions.
- **Responsive Modern UI**: Built with Next.js App Router, Tailwind CSS, daisyUI, and custom mobile-optimized drawer navigation for a smooth experience across all devices.
- **Dark & Light Mode Support**: Fully integrated theme toggling ensuring an accessible, comfortable viewing experience day or night.

---

## 🛠️ Technologies Used

### Frontend

- **Framework:** Next.js 15+ (App Router)
- **Styling:** Tailwind CSS, daisyUI
- **Icons & UI:** Lucide React, Framer Motion
- **Authentication:** Better Auth Client
- **Notifications:** React Hot Toast

### Backend

- **Runtime:** Node.js, Express.js
- **Database:** MongoDB Atlas (Native MongoDB Driver)
- **Security & Validation:** JSON Web Token (JWT), CORS, dotenv
- **Deployment:** Vercel (Serverless Functions)

---

## 📁 Environment Setup

To run this project locally, create a `.env.local` file in your root folder and configure the following variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=your_auth_secret
BETTER_AUTH_URL=http://localhost:3000
```

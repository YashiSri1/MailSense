# Architecture

MailSense uses a clean, modern MERN-like stack (MongoDB, Express, React, Node) with Vite for frontend tooling. 

## Frontend
- **Framework:** React with Vite.
- **State Management:** React Context API for lightweight global state (Auth).
- **Styling:** Tailwind CSS with Lucide Icons for rapid, responsive UI development.
- **Routing:** React Router DOM for SPA navigation.

## Backend
- **Environment:** Node.js + Express.js
- **Pattern:** Controller -> Service -> Route (Clean Architecture)
- **Database:** MongoDB (via Mongoose)
- **Auth:** JWT (Local) + Google OAuth (External)

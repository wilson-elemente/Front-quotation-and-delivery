# 🌐 Coordinadora Quotation & Delivery Frontend

Frontend app for Coordinadora’s shipping platform. Implements user registration, quotation, shipment creation, and real-time tracking via WebSocket.

---

## 📚 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Implemented User Stories](#implemented-user-stories)
- [Project Structure](#project-structure)

---

## ✨ Features

1. **Authentication** with JWT
2. **Quote Calculator** using volumetric or real weight
3. **Shipment Creation** with confirmation flow
4. **Real-Time Status Tracking** via WebSockets
5. **Stepper UI** and status history display
6. **Form Validation** with Yup + React Hook Form
7. **Protected Routes** based on authentication
8. **Material UI** for professional responsive design

---

## 🛠 Tech Stack

- **Framework**: React + TypeScript
- **UI Components**: Material UI
- **Routing**: React Router
- **State Management**: Context API
- **Validation**: React Hook Form + Yup
- **WebSocket**: Socket.IO Client
- **Bundler**: Vite

---

## 🚧 Prerequisites

- Node.js 16+
- Backend API running at `http://localhost:3000` (or your configured `VITE_API_URL`)

---

## 🚀 Getting Started

```bash
git clone https://github.com/your-org/frontend-quotation-and-delivery.git
cd frontend-quotation-and-delivery
npm install
npm run dev

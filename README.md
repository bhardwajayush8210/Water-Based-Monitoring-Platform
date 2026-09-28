# 💧 Water-Based Monitoring Platform

<div align="center">

<img src="https://img.shields.io/badge/Water-Monitoring-00A8E8?style=for-the-badge&logo=water&logoColor=white" alt="Water Monitoring"/>

<img src="https://img.shields.io/badge/Spring%20Boot-3.5.4-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot"/>

<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>

<img src="https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java"/>

<img src="https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"/>

<br/>

<img src="https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT"/>

<img src="https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI"/>

<img src="https://img.shields.io/badge/Vite-Frontend-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>

<img src="https://img.shields.io/badge/Maven-Build-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white" alt="Maven"/>

<br/><br/>

**A full-stack web platform for monitoring water consumption, managing billing, detecting abnormal usage, handling support tickets, and providing AI-powered assistance.**

</div>

---

## 📌 Table of Contents

- [🌊 About the Project](#-about-the-project)
- [🎯 Project Objectives](#-project-objectives)
- [✨ Key Features](#-key-features)
- [👥 User Roles](#-user-roles)
- [📊 Dashboard Modules](#-dashboard-modules)
- [💰 Billing System](#-billing-system)
- [🚨 Usage Alerts](#-usage-alerts)
- [🤖 AquaTrack AI](#-aquatrack-ai)
- [🔐 Authentication & Security](#-authentication--security)
- [🌐 Multi-Language Support](#-multi-language-support)
- [💳 Online Payments](#-online-payments)
- [🏗️ System Architecture](#️-system-architecture)
- [🛠️ Technology Stack](#️-technology-stack)
- [📁 Project Structure](#-project-structure)
- [🔄 Application Workflow](#-application-workflow)
- [🗄️ Database](#️-database)
- [⚙️ Backend Setup](#️-backend-setup)
- [🎨 Frontend Setup](#-frontend-setup)
- [🔑 Environment Variables](#-environment-variables)
- [🚀 Running the Application](#-running-the-application)
- [🔌 API Overview](#-api-overview)
- [📈 Monitoring & Reports](#-monitoring--reports)
- [🧪 Testing](#-testing)
- [📸 Screenshots](#-screenshots)
- [🔮 Future Enhancements](#-future-enhancements)
- [👨‍💻 Developer](#-developer)
- [📄 License](#-license)

---

# 🌊 About the Project

**Water-Based Monitoring Platform** is a full-stack web application designed to digitally manage and monitor water consumption for residential communities.

The platform connects **residents, community administrators, and super administrators** through a centralized system.

It provides functionality for:

- 💧 Water usage monitoring
- 📊 Consumption analytics
- 💰 Automated billing
- 🧾 Invoice generation
- 🚨 Usage alerts
- 🎫 Support ticket management
- 🤖 AI-powered assistance
- 🏢 Apartment/community management
- 👤 Resident management
- 📈 Administrative reports
- 💳 Online bill payments
- 🌐 Multi-language support

The system is designed to reduce manual water-management processes while giving residents and administrators better visibility into consumption and billing information.

---

# 🎯 Project Objectives

The main objectives of the platform are:

### 💧 1. Monitor Water Consumption

Track resident water usage and provide historical consumption information.

### 💰 2. Automate Billing

Calculate bills using configurable water-consumption tiers and billing cycles.

### 🚨 3. Detect Abnormal Usage

Identify unusually high consumption and notify relevant users.

### 📊 4. Provide Analytics

Display consumption trends, comparisons, reports, and graphical insights.

### 🎫 5. Simplify Support

Allow residents to create support tickets and track their resolution.

### 🤖 6. Provide AI Assistance

Use Gemini-powered AI assistance to help users understand water usage and billing information.

### 🔐 7. Secure User Access

Provide role-based authentication and authorization using JWT.

---

# ✨ Key Features

## 👤 Resident Features

- 🔐 Secure registration and login
- 🏠 Apartment and flat management
- 💧 View water consumption
- 📊 View consumption history
- 📈 Consumption comparison
- 💰 View current bills
- 🧾 View invoices
- 📄 Bill breakdown
- 💳 Online payment support
- 🔔 Usage and billing notifications
- 🚨 Abnormal consumption alerts
- 🎫 Create support tickets
- 📋 Track ticket status
- 🤖 AI assistant
- 🌐 Language switching
- 👤 Profile management
- ⚙️ Account settings

---

## 🏢 Community Administrator Features

Community administrators can manage their assigned residential community.

### Community Management

- 🏢 View community information
- 👥 Manage residents
- 🏠 Manage apartments
- 💧 Monitor water consumption
- 📊 View consumption analytics
- 🚨 Monitor abnormal usage
- 💰 Manage billing information
- 🎫 Manage support tickets
- 📈 Generate reports
- 🔔 View community alerts

---

## 👑 Super Administrator Features

The administrator dashboard provides centralized system-level management.

### Administration

- 🏢 Manage communities
- 👥 Manage community administrators
- 👤 Manage residents
- 🏠 Manage apartments
- 💰 Manage billing
- 📊 Monitor system reports
- 🎫 Manage support tickets
- 🚨 Monitor alerts
- 📈 View analytics
- ⚙️ Manage platform-level settings

---

# 📊 Dashboard Modules

The application provides separate dashboards based on user roles.

```text
                         💧 Water Monitoring Platform
                                   │
                  ┌────────────────┼────────────────┐
                  │                │                │
                  ▼                ▼                ▼
             👤 Resident      🏢 Community Admin   👑 Admin
                  │                │                │
          ┌───────┼───────┐   ┌────┼────┐      ┌────┼────┐
          ▼       ▼       ▼   ▼    ▼    ▼      ▼    ▼    ▼
        Usage    Bills   AI  Users Usage Tickets Communities Reports
```

---

# 💰 Billing System

The platform includes a tier-based billing system.

Water consumption is evaluated according to predefined consumption tiers.

For example:

```text
Water Consumption
        │
        ▼
┌─────────────────────┐
│ Determine Usage     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Determine Billing   │
│ Tier                │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Calculate Usage     │
│ Charges             │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Add Shared Costs    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Generate Invoice    │
└─────────────────────┘
```

### Billing Capabilities

- 📅 Billing cycles
- 💧 Usage-based calculation
- 📊 Tier-based pricing
- 🧾 Invoice generation
- 🏢 Shared-cost distribution
- 💰 Bill breakdown
- 📈 Billing history
- 🔔 Billing notifications

---

# 🚨 Usage Alerts

The platform provides automated usage monitoring.

The system can identify consumption that exceeds configured thresholds or deviates significantly from normal patterns.

### Example

```text
Normal Consumption
        │
        ▼
    Monitoring
        │
        ▼
┌───────────────────┐
│ Usage > Threshold │
│       OR          │
│ Statistical       │
│ Anomaly Detected  │
└─────────┬─────────┘
          │
          ▼
      🚨 Alert
          │
          ▼
   User Notification
```

The application supports configurable rules for detecting unusually high consumption.

---

# 🤖 AquaTrack AI

The platform integrates a Gemini-powered AI assistant called **AquaTrack AI**.

The assistant can be used to provide contextual help related to:

- 💧 Water consumption
- 💰 Billing information
- 🧾 Invoice understanding
- 📊 Usage trends
- 🌱 Water-saving suggestions
- ❓ General platform assistance

### AI Architecture

```text
User
 │
 ▼
React Frontend
 │
 ▼
AI Chat Interface
 │
 ▼
Backend / AI Service
 │
 ▼
Gemini API
 │
 ▼
AI Response
 │
 ▼
User
```

> ⚠️ **Security:** API keys must never be committed to GitHub. Store them in environment variables or another secure secret-management mechanism.

---

# 🔐 Authentication & Security

The backend uses **Spring Security** and **JWT-based authentication**.

### Authentication Flow

```text
User Login
    │
    ▼
Username / Password
    │
    ▼
Spring Security
    │
    ▼
Authentication
    │
    ▼
JWT Token
    │
    ▼
Frontend
    │
    ▼
Authenticated API Requests
```

### Security Features

- 🔐 JWT authentication
- 🛡️ Spring Security
- 👥 Role-based authorization
- 🔒 Protected API endpoints
- 🔑 Password-based authentication
- 🚫 Unauthorized request protection
- 👤 Role-specific dashboards

---

# 🌐 Multi-Language Support

The frontend includes a language-switching mechanism to improve accessibility.

The application provides a language-switching interface that can be used to translate supported UI content.

---

# 💳 Online Payments

The platform includes online payment integration support for bill payments.

Payment-related functionality is available from the resident billing interface.

Typical flow:

```text
Resident
   │
   ▼
View Bill
   │
   ▼
Pay Bill
   │
   ▼
Payment Gateway
   │
   ▼
Payment Confirmation
   │
   ▼
Updated Payment Status
```

---

# 🏗️ System Architecture

The application follows a modern full-stack architecture.

```text
                     ┌─────────────────────┐
                     │      User           │
                     │ Browser / Mobile    │
                     └──────────┬──────────┘
                                │
                                ▼
                     ┌─────────────────────┐
                     │   React Frontend    │
                     │      + Vite         │
                     └──────────┬──────────┘
                                │
                         REST API Requests
                                │
                                ▼
                     ┌─────────────────────┐
                     │  Spring Boot API    │
                     │      Backend        │
                     └──────────┬──────────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
              ▼                 ▼                 ▼
        ┌──────────┐      ┌───────────┐    ┌────────────┐
        │ MySQL    │      │ JWT /     │    │ Gemini AI  │
        │ Database │      │ Security  │    │ Service    │
        └──────────┘      └───────────┘    └────────────┘
```

---

# 🛠️ Technology Stack

## 🎨 Frontend

| Technology | Purpose |
|---|---|
| ⚛️ React | User interface |
| ⚡ Vite | Frontend build tool |
| 📜 JavaScript | Application logic |
| 🎨 CSS | Styling |
| 🧩 React Components | Modular UI |
| 📊 Recharts / Charts | Data visualization |
| 🌐 Google Translate | Language support |

### Frontend Badge

<img src="https://skillicons.dev/icons?i=react,vite,js,css,html" alt="Frontend Technologies"/>

---

## ⚙️ Backend

| Technology | Purpose |
|---|---|
| ☕ Java | Backend programming |
| 🌱 Spring Boot | REST API framework |
| 🔐 Spring Security | Authentication & authorization |
| 🔑 JWT | Token-based authentication |
| 🗄️ Spring Data JPA | Database access |
| 🛢️ MySQL | Relational database |
| 🦋 Flyway | Database migration |
| 📄 iText | PDF generation |
| 📑 OpenCSV | CSV processing |
| 🧰 Lombok | Boilerplate reduction |
| 🤖 Gemini API | AI assistance |

### Backend Badge

<img src="https://skillicons.dev/icons?i=java,spring,mysql,maven" alt="Backend Technologies"/>

---

# 📁 Project Structure

```text
Water-Based-Monitoring-Platform/
│
├── waterbilling/
│   │
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── water/
│   │   │   │           └── waterbilling/
│   │   │   │
│   │   │   └── resources/
│   │   │
│   │   └── test/
│   │
│   ├── pom.xml
│   └── ...
│
├── frontend/
│   │
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── api/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── ...
│
└── README.md
```

---

# 🔄 Application Workflow

### 👤 Resident Workflow

```text
Register
   │
   ▼
Login
   │
   ▼
Join Apartment
   │
   ▼
Resident Dashboard
   │
   ├──► 💧 View Usage
   │
   ├──► 📊 Usage History
   │
   ├──► 💰 View Bill
   │
   ├──► 🧾 View Invoice
   │
   ├──► 💳 Pay Bill
   │
   ├──► 🚨 View Alerts
   │
   ├──► 🎫 Raise Ticket
   │
   └──► 🤖 Ask AquaTrack AI
```

### 🏢 Community Admin Workflow

```text
Login
  │
  ▼
Community Dashboard
  │
  ├──► 👥 Residents
  ├──► 🏠 Apartments
  ├──► 💧 Usage
  ├──► 💰 Billing
  ├──► 🚨 Alerts
  ├──► 🎫 Tickets
  └──► 📊 Reports
```

---

# 🗄️ Database

The backend uses **MySQL** as the primary relational database.

The application uses JPA/Hibernate for object-relational mapping.

### Main Domain Areas

The database manages information related to:

- 👤 Users
- 🏢 Communities
- 🏠 Apartments
- 💧 Water usage
- 💰 Billing
- 🧾 Invoices
- 🎫 Support tickets
- 🔔 Notifications
- 🚨 Alerts
- 👥 Administrative roles

Database migrations can be managed using Flyway.

---

# ⚙️ Backend Setup

## 1️⃣ Requirements

Install the following:

- ☕ Java 17+
- 📦 Maven
- 🛢️ MySQL
- 🧠 IntelliJ IDEA or another Java IDE
- 🔧 Git

Verify Java:

```bash
java -version
```

Verify Maven:

```bash
mvn -version
```

---

## 2️⃣ Clone the Repository

```bash
git clone https://github.com/bhardwajayush8210/Water-Based-Monitoring-Platform.git
```

Navigate into the backend:

```bash
cd Water-Based-Monitoring-Platform/waterbilling
```

---

## 3️⃣ Configure MySQL

Create a database:

```sql
CREATE DATABASE waterbilling;
```

Configure your local database credentials using your local configuration.

---

## 4️⃣ Build the Backend

Using Maven:

```bash
mvn clean install
```

---

# 🎨 Frontend Setup

## 1️⃣ Navigate to Frontend

```bash
cd frontend
```

## 2️⃣ Install Dependencies

```bash
npm install
```

## 3️⃣ Start Development Server

```bash
npm run dev
```

Vite will provide a local development URL in the terminal.

---

# 🔑 Environment Variables

**Never commit API keys, passwords, JWT secrets, or database credentials to GitHub.**

For local development, configure sensitive values through environment variables or local configuration files.

Example:

```env
GEMINI_API_KEY=your_api_key_here
```

For the backend, use the appropriate Spring configuration mechanism for your local environment.

Example:

```properties
gemini.api.key=${GEMINI_API_KEY}
```

> ⚠️ Never replace `your_api_key_here` with a real secret inside this README.

---

# 🚀 Running the Application

You can run the backend and frontend independently.

### Terminal 1 — Backend

```bash
cd waterbilling
mvn spring-boot:run
```

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

The React frontend communicates with the Spring Boot backend through REST APIs.

---

# 🔌 API Overview

The backend exposes REST APIs for major application modules.

Typical API domains include:

```text
/auth
/users
/residents
/admin
/communities
/apartments
/usage
/billing
/invoices
/tickets
/notifications
/reports
/alerts
```

The exact endpoints may vary based on the current backend implementation.

---

# 📈 Monitoring & Reports

The platform provides administrative reporting and analytics.

Reports can include:

- 💧 Water consumption
- 📊 Usage trends
- 🏢 Community-level statistics
- 👤 Resident usage
- 💰 Billing information
- 🚨 Consumption alerts
- 🎫 Ticket information

Charts and dashboards help users understand consumption patterns more easily.

---

# 🧪 Testing

Backend testing can be performed using Maven:

```bash
mvn test
```

Frontend development and validation can be performed using:

```bash
npm run build
```

---

# 📸 Screenshots

> Add screenshots of your application here.

Recommended screenshots:

### 🏠 Landing Page

```text
Add screenshot here
```

### 👤 Resident Dashboard

```text
Add screenshot here
```

### 🏢 Community Admin Dashboard

```text
Add screenshot here
```

### 👑 Admin Dashboard

```text
Add screenshot here
```

### 💰 Billing Dashboard

```text
Add screenshot here
```

### 🤖 AquaTrack AI

```text
Add screenshot here
```

### 📊 Reports

```text
Add screenshot here
```

---

# 🔮 Future Enhancements

Potential future improvements include:

- 📱 Dedicated mobile application
- 📡 IoT-based smart water meters
- ☁️ Cloud deployment
- 📊 Advanced analytics
- 🤖 More intelligent consumption predictions
- 📈 Machine-learning-based anomaly detection
- 🔔 Real-time notifications
- 💳 Expanded payment integrations
- 🗺️ Community-level geographical analytics
- 📦 Automated deployment pipelines
- 🧪 Expanded automated test coverage

---

# 🌱 Why This Project?

Water is a critical resource, and inefficient consumption monitoring can lead to unnecessary waste.

This platform aims to combine:

```text
💧 Water Monitoring
       +
📊 Data Analytics
       +
💰 Automated Billing
       +
🚨 Anomaly Detection
       +
🤖 AI Assistance
       =
🌱 Smarter Water Management
```

The project demonstrates how modern web technologies can be combined to build a practical full-stack management platform.

---

# 👨‍💻 Developer

<div align="center">

## Ayush Raj

**Pre-Final Year Computer Science & Engineering Student**

### 💻 MERN Stack & Java Full-Stack Developer

Interested in:

- ☕ Java
- 🌱 Spring Boot
- ⚛️ React
- 🟢 Node.js
- 🗄️ MySQL
- 🤖 AI/ML
- 🌐 Full-Stack Development

<br/>

<a href="https://github.com/bhardwajayush8210">
<img src="https://img.shields.io/badge/GitHub-bhardwajayush8210-181717?style=for-the-badge&logo=github" alt="GitHub"/>
</a>

<a href="https://www.linkedin.com/in/ayush-raj-4a14b1244/">
<img src="https://img.shields.io/badge/LinkedIn-Ayush%20Raj-0A66C2?style=for-the-badge&logo=linkedin" alt="LinkedIn"/>
</a>

</div>

---

# 📄 License

This project is intended for educational, internship, portfolio, and demonstration purposes.

---

<div align="center">

### 💧 Water-Based Monitoring Platform

**Monitor. Analyze. Save.**

Made with ❤️ using Java, Spring Boot, React, MySQL and AI.

⭐ If you find this project useful, consider giving the repository a star!

</div>

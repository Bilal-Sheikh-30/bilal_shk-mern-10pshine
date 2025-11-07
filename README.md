# Notes Application

A full stack MERN (MongoDB, Express.js, React, Node.js) notes management application with features including soft delete, search functionality, and comprehensive testing.

## Features

### Core Functionality
- **User Authentication**: Secure signup and login with JWT
- **CRUD Operations**: Create, read, update, and delete notes
- **Soft Delete**: Notes are initially moved to bin instead of permanent deletion
- **Restore Functionality**: Recover soft deleted notes from the bin
- **Search**: Real time search on note title and content
- **Responsive Design**: Fully responsive UI for all screen sizes

### Technical Features
- **SonarQube Integration**: Code quality and security analysis
- **Unit Testing**: Comprehensive test coverage with Jest
- **Logging**: logging with Pino
- **Modern UI**: Clean and intuitive user interface
- **Secure**: JWT based authentication and authorization

## 🎥 Demo

### Application Demo

<p align="center">
  <a href="https://res.cloudinary.com/dacj8pmtm/video/upload/v1762444531/10p_notes_demo_-_Made_with_Clipchamp_zsrovh.mp4">
    <img src="https://res.cloudinary.com/dacj8pmtm/video/upload/w_600,h_340,c_fill,so_6/10p_notes_demo_-_Made_with_Clipchamp_zsrovh.jpg" alt="Watch the Demo" />
  </a>
</p>

### SonarQube Report
<p align="center">
  <img src="https://res.cloudinary.com/dacj8pmtm/image/upload/v1762443153/Screenshot_2025-11-06_201625_zfe684.png" alt="SonarQube Report" width="600">
</p>


## Tech Stack

### Frontend
- **React**
- **Vite**
- **Tailwind CSS**

### Backend
- **Node.js**
- **Express.js**
- **MongoDB**
- **JWT**
- **Pino**

### Quality
- **Jest** - Testing framework
- **SonarQube** - Code quality analysis
- **ESLint** - Code linting
- **Git** - Version control

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**
- **npm**
- **MongoDB**
- **Git**

##  Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Bilal-Sheikh-30/bilal_shk-mern-10pshine.git
   cd bilal_shk-mern-10pshine
   ```

2. **Checkout develop branch**
   ```bash
   git checkout develop
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

4. **Install backend dependencies**
   ```bash
   cd ../backend
   npm install
   ```

## Environment Variables

### Frontend (.env)

Create a `.env` file in the `frontend` directory:

```env
VITE_BACKEND_URL=http://localhost:3000
```

### Backend (.env)

Create a `.env` file in the `backend` directory:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
```

**Note**: 
- Replace `your_mongodb_connection_string` with your actual MongoDB URI
- Generate a strong random string for `JWT_SECRET`

## Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:3000`

2. **Start the frontend development server** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

3. **Access the application**
   
   Open your browser and navigate to `http://localhost:5173`

##  Testing

The application includes unit tests for critical components and routes.

### Run Tests

**Frontend tests:**
```bash
cd frontend
npm test
```

**Backend tests:**
```bash
cd backend
npm test
```

**Run tests with coverage:**
```bash
npm test -- --coverage
```

##  SonarQube Integration

The project is integrated with SonarQube for continuous code quality inspection.

### Running SonarQube Analysis

Ensure you have SonarQube scanner installed and configured.

**Run analysis:**
```bash
sonar-scanner "-Dsonar.login=<your_sonar_token>"
```

Replace `<your_sonar_token>` with your actual SonarQube token.

### Metrics Tracked
- Code Quality
- Security Vulnerabilities
- Code Smells
- Test Coverage
- Duplications

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register a new user |
| POST | `/auth/login` | Login user |

### Notes Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notes/` | Get all active notes |
| GET | `/notes/:id` | Get a single note |
| POST | `/notes/create` | Create a new note |
| PATCH | `/notes/edit/:id` | Update a note |
| PATCH | `/notes/move-to-bin/:id` | Soft delete a note (move to bin) |
| GET | `/notes/bin` | Get all soft deleted notes |
| PATCH | `/notes/recover/:id` | Restore a note from bin |
| DELETE | `/notes/delete/:id` | Permanently delete a note |

**Note**: All notes endpoints require JWT authentication via `Authorization: Bearer <token>` header.

## 📁 Project Structure

```
bilal_shk-mern-10pshine/
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service files
│   │   ├── utils/           # Utility functions
│   │   ├── App.jsx          # Main App component
│   │   └── main.jsx         # Entry point
│   ├── public/              # Static assets
│   ├── tests/               # Jest test files
│   └── package.json
│
├── backend/
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── config/          # Configuration files
│   └── utils/           # Utility functions
│   ├── tests/           # Jest test files
│   ├── package.json
│
├── sonar-project.properties # SonarQube configuration
└── README.md
```
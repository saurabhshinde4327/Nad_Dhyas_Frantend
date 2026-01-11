# Frontend-Backend Connection Setup Guide

This guide will help you set up the connection between the Frontend (Next.js) and Backend (Express.js) applications.

## 📋 Prerequisites

1. Both Frontend and Backend must be installed with dependencies
2. MySQL database must be running
3. Both servers should be running simultaneously

## 🔧 Environment Configuration

### Frontend Environment Setup

1. Create a `.env.local` file in the `Nad_Dhyas_Frantend-main` directory:
```env
BACKEND_URL=http://localhost:3001
```

**Note:** If your backend is running on a different port or URL, update this accordingly.

### Backend Environment Setup

1. Create a `.env` file in the `Nad_Dhyas_Backend-main` directory:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=Music_dept
DB_PORT=3306

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

**Important:** 
- Replace `your_password_here` with your actual MySQL password
- Ensure the `DB_NAME` matches your database name
- The `FRONTEND_URL` must match where your Next.js frontend is running

## 🚀 Starting the Servers

### Step 1: Start the Backend Server

```bash
cd Nad_Dhyas_Backend-main
npm install  # If not already installed
npm start    # or npm run dev for development with nodemon
```

The backend should start on `http://localhost:3001`

### Step 2: Start the Frontend Server

```bash
cd Nad_Dhyas_Frantend-main
npm install  # If not already installed
npm run dev  # For development
```

The frontend should start on `http://localhost:3000`

## ✅ Connection Flow

The connection works as follows:

1. **Frontend Components** → Make requests to `/api/*` (Next.js API routes)
2. **Next.js API Routes** → Forward requests to `BACKEND_URL/api/*` (Express backend)
3. **Express Backend** → Processes request and returns response
4. **Next.js API Routes** → Returns response to frontend components

### Example Flow:
```
User submits form → Frontend Component
  ↓
/api/register (Next.js route)
  ↓
http://localhost:3001/api/register (Express backend)
  ↓
MySQL Database
  ↓
Response flows back through the chain
```

## 🔍 API Endpoints Mapping

All frontend API routes forward to the backend:

| Frontend Route | Backend Route | Purpose |
|---------------|---------------|---------|
| `POST /api/register` | `POST /api/register` | Student registration |
| `POST /api/donate` | `POST /api/donate` | Donation submission |
| `GET /api/getNextFormNo` | `GET /api/getNextFormNo` | Get next form number |
| `GET /api/invoice/[id]` | `GET /api/invoice/:id` | Get invoice data |
| `POST /api/admin/login` | `POST /api/admin/login` | Admin authentication |
| `POST /api/admin/stats` | `POST /api/admin/stats` | Get admin statistics |
| `POST /api/admin/students` | `POST /api/admin/students` | Get student list |
| `DELETE /api/admin/students/[id]` | `DELETE /api/admin/students/:id` | Delete student |
| `POST /api/student/login` | `POST /api/student/login` | Student authentication |
| `GET /api/student/[id]` | `GET /api/student/:id` | Get student data |

## 🧪 Testing the Connection

### 1. Test Backend Health
Open in browser: `http://localhost:3001/health`

Expected response:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### 2. Test Backend Root
Open in browser: `http://localhost:3001/`

Expected response: API information with available endpoints

### 3. Test Frontend-Backend Connection
1. Start both servers
2. Open frontend: `http://localhost:3000`
3. Try submitting a form or making an API call
4. Check browser console and backend logs for any errors

## 🔒 CORS Configuration

The backend is configured to accept requests from the frontend URL specified in `FRONTEND_URL`. 

If you encounter CORS errors:
1. Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
2. Check that the backend server is running
3. Verify the frontend is making requests to the correct backend URL

## 🐛 Troubleshooting

### Backend not connecting to database
- Check MySQL is running
- Verify database credentials in `.env`
- Ensure database `Music_dept` exists
- Run the database initialization scripts

### Frontend can't reach backend
- Verify backend is running on port 3001
- Check `BACKEND_URL` in frontend `.env.local`
- Check browser console for CORS errors
- Verify firewall isn't blocking the connection

### CORS errors
- Ensure `FRONTEND_URL` in backend `.env` is correct
- Check that both servers are running
- Verify the URLs match exactly (including protocol and port)

## 📝 Notes

- The frontend uses Next.js API routes as a proxy layer
- All API calls from frontend components go through Next.js routes first
- Environment variables are loaded automatically by Next.js (`.env.local`) and Node.js (`.env`)
- Never commit `.env` or `.env.local` files to version control

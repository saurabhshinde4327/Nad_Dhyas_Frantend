# Migration from MongoDB to MySQL

## Changes Made

### 1. Removed MongoDB Dependencies
- ✅ Removed `mongoose` from `package.json`
- ✅ Frontend no longer directly connects to MongoDB

### 2. Updated API Routes
All frontend API routes now act as **proxies** that forward requests to the Express backend:

- `app/api/register/route.ts` → Proxies to `http://localhost:3001/api/register`
- `app/api/donate/route.ts` → Proxies to `http://localhost:3001/api/donate`
- `app/api/getNextFormNo/route.ts` → Proxies to `http://localhost:3001/api/getNextFormNo`
- `app/api/invoice/[id]/route.ts` → Proxies to `http://localhost:3001/api/invoice/:id`

### 3. Environment Variables
Create a `.env.local` file in the Frontend directory:

```env
BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Architecture

```
Frontend (Next.js)          Backend (Express)          MySQL Database
     |                            |                          |
     |  POST /api/register         |                          |
     |---------------------------> |                          |
     |                            |  INSERT INTO tables        |
     |                            |-------------------------> |
     |                            |                          |
     |  Response with studentId   |                          |
     |<---------------------------|                          |
```

## Setup Instructions

1. **Install dependencies** (mongoose will be removed):
   ```bash
   cd Frontend
   npm install
   ```

2. **Create `.env.local` file**:
   ```env
   BACKEND_URL=http://localhost:3001
   ```

3. **Start the Express backend** (in Backend folder):
   ```bash
   cd Backend
   npm install
   npm start
   ```

4. **Start the Next.js frontend**:
   ```bash
   cd Frontend
   npm run dev
   ```

## What Changed

### Before (MongoDB):
- Frontend directly connected to MongoDB using Mongoose
- Models defined in `app/models/`
- Database connection in `app/lib/db.ts`

### After (MySQL via Express):
- Frontend API routes proxy to Express backend
- Express backend handles all database operations
- MySQL database stores all data
- No MongoDB dependencies in frontend

## Files Modified

1. ✅ `package.json` - Removed mongoose
2. ✅ `app/api/register/route.ts` - Now proxies to backend
3. ✅ `app/api/donate/route.ts` - Now proxies to backend
4. ✅ `app/api/getNextFormNo/route.ts` - Now proxies to backend
5. ✅ `app/api/invoice/[id]/route.ts` - Now proxies to backend

## Files No Longer Needed (Optional to Remove)

- `app/lib/db.ts` - MongoDB connection (not used anymore)
- `app/models/Student.ts` - MongoDB model (not used anymore)
- `app/models/Donor.ts` - MongoDB model (not used anymore)
- `app/models/Counter.ts` - MongoDB model (not used anymore)

**Note:** These files can be kept for reference or removed. They won't cause errors since they're not imported anymore.

## Testing

1. Make sure Express backend is running on port 3001
2. Make sure MySQL database is running and accessible
3. Test registration form submission
4. Test donation form submission
5. Verify data is stored in MySQL database

## Troubleshooting

### Backend Connection Error
- Check if Express backend is running: `http://localhost:3001/health`
- Verify `BACKEND_URL` in `.env.local` matches backend port

### CORS Errors
- Backend CORS is configured for `http://localhost:3000`
- Update `FRONTEND_URL` in Backend `.env` if using different port

### Database Connection
- Verify MySQL credentials in Backend `.env`
- Check if `Music_dept` database exists
- Run migration scripts if needed


# VibeSocial - A Social Messaging Application

A full-stack social messaging application built with React, Express, and Socket.io.

## Features

- Real-time messaging with Socket.io
- User authentication (JWT)
- Private and group chats
- Online/offline status
- Typing indicators
- File uploads (images)
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account or local MongoDB instance
- Cloudinary account (for file uploads)

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd vibesocial
```

### 2. Set up the backend

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   - Set `MONGO_URI` to your MongoDB connection string
   - Set `JWT_SECRET` to a secure random string
   - Set Cloudinary credentials if using file uploads
   - Adjust other settings as needed

### 3. Set up the frontend

1. Navigate to the project root directory:
   ```bash
   cd ..
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Development Mode

1. Start both frontend and backend in development mode:
   ```bash
   npm run dev:fullstack
   ```
   This will start:
   - Frontend on http://localhost:5173
   - Backend on http://localhost:5000

### Production Mode

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```
   The application will be served from the backend on http://localhost:5000

## Environment Variables

### Server (.env)

- `PORT` - Port for the Express server (default: 5000)
- `NODE_ENV` - Node environment (development/production)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - JWT token expiration time
- `FRONTEND_URL` - URL of the frontend (for CORS)
- `CLOUDINARY_*` - Cloudinary configuration for file uploads

## Project Structure

```
.
├── public/              # Static files
├── server/              # Backend code
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   ├── .env            # Environment variables
│   ├── server.js       # Main server file
│   └── package.json    # Backend dependencies
├── src/                # Frontend source code
│   ├── components/     # Reusable components
│   ├── contexts/       # React contexts
│   ├── pages/          # Page components
│   ├── App.jsx         # Main App component
│   └── main.jsx        # Entry point
├── .env                # Frontend environment variables
└── package.json        # Frontend dependencies and scripts
```

## Deployment

### Heroku

1. Create a new Heroku app
2. Set up the following config vars in Heroku:
   - `NODE_ENV=production`
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Your JWT secret
   - `FRONTEND_URL` - Your frontend URL
   - Other environment variables as needed
3. Push to Heroku:
   ```bash
   git push heroku main
   ```

### Other Platforms

For other platforms (Vercel, Netlify, etc.), you'll need to:
1. Build the frontend
2. Configure the backend to serve static files (already set up in `server.js`)
3. Set up environment variables
4. Deploy the entire project

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

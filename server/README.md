# VibeSocial Messaging API

Backend server for the VibeSocial messaging application built with Express.js and MongoDB.

## Features

- User authentication (register, login, logout)
- Real-time messaging using Socket.IO
- One-on-one and group chats
- Message read/delivery status
- File attachments
- Message forwarding
- Reply to messages
- Typing indicators
- Online status

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas (Database)
- Socket.IO (Real-time communication)
- JWT (Authentication)
- Bcrypt (Password hashing)

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   cd server
   npm install
   ```
3. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```

## MongoDB Atlas Setup

1. Create a MongoDB Atlas account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Set up a database user with read/write permissions
4. Add your IP address to the allowlist
5. Get your connection string and replace `your_mongodb_atlas_connection_string` in the `.env` file

## Running the Server

```
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Users
- `POST /api/users` - Register a new user
- `POST /api/users/login` - Login user
- `POST /api/users/logout` - Logout user (protected)
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)
- `GET /api/users` - Search for users (protected)

### Chats
- `POST /api/chats` - Create or access a one-on-one chat (protected)
- `GET /api/chats` - Get all user chats (protected)
- `POST /api/chats/group` - Create a group chat (protected)
- `PUT /api/chats/group/:id` - Rename a group chat (protected)
- `PUT /api/chats/group/:id/add` - Add user to a group (protected)
- `PUT /api/chats/group/:id/remove` - Remove user from a group (protected)

### Messages
- `POST /api/messages` - Send a new message (protected)
- `GET /api/messages/:chatId` - Get all messages for a chat (protected)
- `DELETE /api/messages/:id` - Delete a message (protected)
- `PUT /api/messages/status/:chatId` - Update message status (protected)
- `POST /api/messages/forward` - Forward a message to another chat (protected)

## Socket.IO Events

### Client Events (emit)
- `join_chat` - Join a chat room
- `send_message` - Send a message
- `typing` - User is typing
- `stop_typing` - User stopped typing

### Server Events (listen)
- `receive_message` - Receive a new message
- `typing` - Someone is typing
- `stop_typing` - Someone stopped typing

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS (production only) 
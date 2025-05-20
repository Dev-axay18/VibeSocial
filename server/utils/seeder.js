import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import User from '../models/userModel.js';
import Chat from '../models/chatModel.js';
import Message from '../models/messageModel.js';
import connectDB from '../config/db.js';

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

// Sample users data
const users = [
  {
    name: 'Alex Rivera',
    username: 'alex.vibe',
    email: 'alex@example.com',
    password: '123456',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    isOnline: true
  },
  {
    name: 'Sarah Chen',
    username: 'sarah.mood',
    email: 'sarah@example.com',
    password: '123456',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    isOnline: false,
    lastSeen: new Date(Date.now() - 3600000)
  },
  {
    name: 'Mike Johnson',
    username: 'mike.chill',
    email: 'mike@example.com',
    password: '123456',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    isOnline: true
  },
  {
    name: 'Luna Martinez',
    username: 'luna.dreams',
    email: 'luna@example.com',
    password: '123456',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=luna',
    isOnline: false,
    lastSeen: new Date(Date.now() - 7200000)
  }
];

// Import data to database
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Chat.deleteMany();
    await Message.deleteMany();

    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log('Users imported!'.green.inverse);

    // Create one-on-one chats between all users
    const chats = [];
    for (let i = 0; i < createdUsers.length; i++) {
      for (let j = i + 1; j < createdUsers.length; j++) {
        const chat = await Chat.create({
          isGroupChat: false,
          users: [createdUsers[i]._id, createdUsers[j]._id]
        });
        chats.push(chat);
      }
    }
    console.log('Chats created!'.green.inverse);

    // Create group chat with all users
    const groupChat = await Chat.create({
      isGroupChat: true,
      groupName: 'Vibes Squad',
      users: createdUsers.map(user => user._id),
      groupAdmin: createdUsers[0]._id,
      groupAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vibesquad'
    });
    chats.push(groupChat);
    console.log('Group chat created!'.green.inverse);

    // Create messages for each chat
    for (const chat of chats) {
      const isGroup = chat.isGroupChat;
      const chatUsers = chat.users;
      
      // Generate random number of messages
      const numMessages = Math.floor(Math.random() * 10) + 3;
      
      for (let i = 0; i < numMessages; i++) {
        const sender = isGroup
          ? chatUsers[Math.floor(Math.random() * chatUsers.length)]
          : chatUsers[i % 2];
        
        const messageType = Math.random() > 0.7 ? 'file' : 'text';
        
        let messageData = {
          sender,
          chat: chat._id,
          type: messageType,
          status: 'read',
          readBy: chatUsers.filter(user => user.toString() !== sender.toString())
        };
        
        if (messageType === 'text') {
          messageData.content = `Sample message ${i + 1} from ${
            createdUsers.find(u => u._id.toString() === sender.toString()).name
          }`;
        } else {
          messageData.file = {
            name: `file-${i + 1}.jpg`,
            type: 'image/jpeg',
            size: 1024000,
            url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&q=80'
          };
        }
        
        // Randomly add reply
        if (i > 0 && Math.random() > 0.7) {
          const prevMessage = await Message.findOne({ chat: chat._id }).sort({ createdAt: -1 });
          if (prevMessage) {
            messageData.replyTo = {
              messageId: prevMessage._id,
              content: prevMessage.content || '',
              type: prevMessage.type,
              sender: prevMessage.sender
            };
          }
        }
        
        const message = await Message.create(messageData);
        
        // Update latest message in chat
        chat.latestMessage = message._id;
        await chat.save();
      }
    }
    console.log('Messages created!'.green.inverse);

    console.log('Data imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// Delete data from database
const destroyData = async () => {
  try {
    await User.deleteMany();
    await Chat.deleteMany();
    await Message.deleteMany();

    console.log('Data destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// Run the appropriate command based on arguments
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
} 
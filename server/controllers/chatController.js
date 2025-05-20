import Chat from '../models/chatModel.js';
import User from '../models/userModel.js';
import Message from '../models/messageModel.js';

// @desc    Create or access one-on-one chat
// @route   POST /api/chats
// @access  Private
const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400);
      throw new Error('UserId parameter not provided');
    }

    // Check if chat already exists between the two users
    let chat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate('users', '-password')
      .populate('latestMessage');
    
    // Populate the sender field in latestMessage
    chat = await User.populate(chat, {
      path: 'latestMessage.sender',
      select: 'name username avatar',
    });

    if (chat.length > 0) {
      res.json(chat[0]);
    } else {
      // Create a new chat if it doesn't exist
      const newChat = await Chat.create({
        isGroupChat: false,
        users: [req.user._id, userId],
      });

      const fullChat = await Chat.findById(newChat._id).populate(
        'users',
        '-password'
      );

      res.status(201).json(fullChat);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all chats for a user
// @route   GET /api/chats
// @access  Private
const getChats = async (req, res) => {
  try {
    // Find all chats the user is part of
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 });
    
    // Populate the sender field in latestMessage
    chats = await User.populate(chats, {
      path: 'latestMessage.sender',
      select: 'name username avatar',
    });

    res.json(chats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create a group chat
// @route   POST /api/chats/group
// @access  Private
const createGroupChat = async (req, res) => {
  try {
    const { name, users } = req.body;

    if (!name || !users) {
      res.status(400);
      throw new Error('Please provide all required fields');
    }

    // Parse users if it's a string
    let usersList = users;
    if (typeof users === 'string') {
      usersList = JSON.parse(users);
    }

    // Check if group has at least 2 users (plus the current user)
    if (usersList.length < 2) {
      res.status(400);
      throw new Error('A group chat needs at least 3 users');
    }

    // Add current user to the group
    usersList.push(req.user._id);

    // Generate a unique seed for group avatar
    const seed = Math.random().toString(36).substring(2, 8);
    const groupAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;

    // Create the group chat
    const groupChat = await Chat.create({
      isGroupChat: true,
      groupName: name,
      users: usersList,
      groupAdmin: req.user._id,
      groupAvatar,
    });

    const fullGroupChat = await Chat.findById(groupChat._id)
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(201).json(fullGroupChat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Rename a group chat
// @route   PUT /api/chats/group/:id
// @access  Private
const renameGroupChat = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    if (!name) {
      res.status(400);
      throw new Error('Please provide a name');
    }

    // Update the group name
    const updatedChat = await Chat.findByIdAndUpdate(
      id,
      { groupName: name },
      { new: true } // Return the updated document
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!updatedChat) {
      res.status(404);
      throw new Error('Chat not found');
    }

    res.json(updatedChat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Add user to a group
// @route   PUT /api/chats/group/:id/add
// @access  Private
const addToGroup = async (req, res) => {
  try {
    const { userId } = req.body;
    const { id } = req.params;

    // Check if the requester is the admin
    const chat = await Chat.findById(id);
    if (!chat) {
      res.status(404);
      throw new Error('Chat not found');
    }

    if (chat.groupAdmin.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Only the admin can add users to the group');
    }

    // Add user to the group
    const updatedChat = await Chat.findByIdAndUpdate(
      id,
      { $addToSet: { users: userId } }, // $addToSet prevents duplicate entries
      { new: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.json(updatedChat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Remove user from a group
// @route   PUT /api/chats/group/:id/remove
// @access  Private
const removeFromGroup = async (req, res) => {
  try {
    const { userId } = req.body;
    const { id } = req.params;

    // Check if the requester is the admin or the user is removing themselves
    const chat = await Chat.findById(id);
    if (!chat) {
      res.status(404);
      throw new Error('Chat not found');
    }

    if (
      chat.groupAdmin.toString() !== req.user._id.toString() && 
      userId.toString() !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error('Only the admin can remove other users from the group');
    }

    // Remove user from the group
    const updatedChat = await Chat.findByIdAndUpdate(
      id,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.json(updatedChat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export {
  accessChat,
  getChats,
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup,
}; 
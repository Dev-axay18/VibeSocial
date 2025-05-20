import Message from '../models/messageModel.js';
import User from '../models/userModel.js';
import Chat from '../models/chatModel.js';

// @desc    Send a new message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { content, chatId, type = 'text', file, replyTo } = req.body;

    if ((!content && type === 'text') || !chatId) {
      res.status(400);
      throw new Error('Please provide message content and chat ID');
    }

    // Check if the chat exists and user is a member
    const chat = await Chat.findOne({
      _id: chatId,
      users: { $elemMatch: { $eq: req.user._id } },
    });

    if (!chat) {
      res.status(404);
      throw new Error('Chat not found or you are not a member');
    }

    // Create the message
    const messageData = {
      sender: req.user._id,
      content: content || '',
      chat: chatId,
      type,
    };

    // Add file data if it's a file message
    if (type === 'file' && file) {
      messageData.file = file;
    }

    // Add reply data if it's a reply
    if (replyTo) {
      messageData.replyTo = replyTo;
    }

    let message = await Message.create(messageData);

    // Populate message with sender and chat info
    message = await Message.findById(message._id)
      .populate('sender', 'name username avatar')
      .populate('chat')
      .populate('replyTo.sender', 'name username avatar');

    // Update the latest message in the chat
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });

    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all messages for a chat
// @route   GET /api/messages/:chatId
// @access  Private
const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    // Check if chat exists and user is a member
    const chat = await Chat.findOne({
      _id: chatId,
      users: { $elemMatch: { $eq: req.user._id } },
    });

    if (!chat) {
      res.status(404);
      throw new Error('Chat not found or you are not a member');
    }

    // Get messages for the chat
    const messages = await Message.find({ chat: chatId, isDeleted: false })
      .populate('sender', 'name username avatar')
      .populate('replyTo.sender', 'name username avatar')
      .sort({ createdAt: 1 });

    // Mark messages as read by this user
    await Message.updateMany(
      {
        chat: chatId,
        sender: { $ne: req.user._id },
        readBy: { $ne: req.user._id },
      },
      {
        $push: { readBy: req.user._id },
        $set: { status: 'read' },
      }
    );

    res.json(messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the message
    const message = await Message.findById(id);

    if (!message) {
      res.status(404);
      throw new Error('Message not found');
    }

    // Check if user is the sender or admin of the group
    const chat = await Chat.findById(message.chat);
    
    if (
      message.sender.toString() !== req.user._id.toString() &&
      (!chat.isGroupChat || chat.groupAdmin.toString() !== req.user._id.toString())
    ) {
      res.status(403);
      throw new Error('You can only delete your own messages');
    }

    // Soft delete the message
    message.isDeleted = true;
    await message.save();

    // If this was the latest message in the chat, update the latest message
    if (chat.latestMessage.toString() === id) {
      const latestMessage = await Message.findOne(
        { chat: chat._id, isDeleted: false },
        {},
        { sort: { createdAt: -1 } }
      );

      if (latestMessage) {
        chat.latestMessage = latestMessage._id;
      } else {
        chat.latestMessage = null;
      }

      await chat.save();
    }

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update message status (read/delivered)
// @route   PUT /api/messages/status/:chatId
// @access  Private
const updateMessageStatus = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { status } = req.body;

    if (!['delivered', 'read'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status. Must be "delivered" or "read"');
    }

    // Check if chat exists and user is a member
    const chat = await Chat.findOne({
      _id: chatId,
      users: { $elemMatch: { $eq: req.user._id } },
    });

    if (!chat) {
      res.status(404);
      throw new Error('Chat not found or you are not a member');
    }

    // Update status for all messages in this chat not sent by current user
    const result = await Message.updateMany(
      {
        chat: chatId,
        sender: { $ne: req.user._id },
        ...(status === 'read' ? { status: { $ne: 'read' } } : { status: 'sent' }),
      },
      {
        $set: { status },
        ...(status === 'read' ? { $addToSet: { readBy: req.user._id } } : {}),
      }
    );

    res.json({ 
      message: `${result.modifiedCount} messages marked as ${status}` 
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Forward a message to another chat
// @route   POST /api/messages/forward
// @access  Private
const forwardMessage = async (req, res) => {
  try {
    const { messageId, chatIds } = req.body;

    if (!messageId || !chatIds || !chatIds.length) {
      res.status(400);
      throw new Error('Please provide message ID and at least one chat ID');
    }

    // Find the original message
    const originalMessage = await Message.findById(messageId)
      .populate('sender', 'name username avatar');

    if (!originalMessage) {
      res.status(404);
      throw new Error('Message not found');
    }

    // Check if user is a member of all the target chats
    const validChatIds = [];
    for (const chatId of chatIds) {
      const chat = await Chat.findOne({
        _id: chatId,
        users: { $elemMatch: { $eq: req.user._id } },
      });
      
      if (chat) {
        validChatIds.push(chatId);
      }
    }

    if (validChatIds.length === 0) {
      res.status(403);
      throw new Error('You are not a member of any of the provided chats');
    }

    // Create new messages in each chat
    const forwardedMessages = [];
    
    for (const chatId of validChatIds) {
      const newMessage = await Message.create({
        sender: req.user._id,
        content: originalMessage.content,
        chat: chatId,
        type: originalMessage.type,
        file: originalMessage.file,
      });

      // Populate the new message
      const populatedMessage = await Message.findById(newMessage._id)
        .populate('sender', 'name username avatar')
        .populate('chat');

      // Update latest message in chat
      await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage._id });

      forwardedMessages.push(populatedMessage);
    }

    res.status(201).json({
      message: `Message forwarded to ${forwardedMessages.length} chats`,
      forwardedMessages,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export {
  sendMessage,
  getMessages,
  deleteMessage,
  updateMessageStatus,
  forwardMessage,
}; 
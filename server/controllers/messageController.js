const Message = require("../models/Message");
const User = require("../models/User");

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const senderId = req.user._id;

    if (!receiverId || !text) {
      return res.status(400).json({ message: "Receiver ID and text are required" });
    }

    // Verify receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      text,
    });

    await message.save();

    // Populate sender name for frontend UI
    await message.populate("sender", "name organizationName role");

    // Socket.io Realtime Emission
    const io = req.app.get("io");
    if (io) {
      io.to(receiverId.toString()).emit("receive_message", message);
      
      // Also broadcast back to sender locally
      io.to(senderId.toString()).emit("receive_message", message);
    }

    res.status(201).json(message);
  } catch (error) {
    console.error("SendMessage Error:", error);
    res.status(500).json({ message: "Server expected error sending message" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params; // The person we are chatting with
    const myId = req.user._id;

    // Fetch all messages between me and the target user
    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: userId },
        { sender: userId, receiver: myId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name organizationName role")
      .populate("receiver", "name organizationName role");

    res.status(200).json(messages);
  } catch (error) {
    console.error("GetMessages Error:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const myId = req.user._id;

    // Find all distinct users we have chatted with
    const messages = await Message.find({
      $or: [{ sender: myId }, { receiver: myId }],
    })
      .sort({ createdAt: -1 })
      .populate("sender", "name organizationName role")
      .populate("receiver", "name organizationName role");

    // Deduplicate into a clean Contacts list
    const contactMap = new Map();

    messages.forEach((msg) => {
      const otherUser = msg.sender._id.toString() === myId.toString() ? msg.receiver : msg.sender;
      if (otherUser && !contactMap.has(otherUser._id.toString())) {
        contactMap.set(otherUser._id.toString(), {
          user: otherUser,
          lastMessage: msg.text,
          updatedAt: msg.createdAt,
          unread: msg.receiver._id.toString() === myId.toString() && !msg.read
        });
      }
    });

    const contacts = Array.from(contactMap.values());
    res.status(200).json(contacts);
  } catch (error) {
    console.error("GetContacts Error:", error);
    res.status(500).json({ message: "Failed to fetch contacts" });
  }
};

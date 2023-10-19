const Message = require("../models/Message");

async function getMessages(req, res) {
  try {
    const mainId = req.params.mainId;
    const secondaryId = req.params.secondaryId;

    // Retrieve messages where sender is mainId and recipient is secondaryId OR sender is secondaryId and recipient is mainId
    const messages = await Message.find({
      $or: [
        { $and: [{ sender: mainId }, { recipient: secondaryId }] },
        { $and: [{ sender: secondaryId }, { recipient: mainId }] },
      ],
    }).sort({ createdAt: 1 }); // Sort messages by createdAt in ascending order

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function sendFile(req, res) {
  try {
    const fileUrl = `${process.env.SERVER_URL}/uploads/${req.file.filename}`; // Specify the server domain and upload directory
    res.status(201).json({ fileUrl: fileUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getMessages,
  sendFile,
};

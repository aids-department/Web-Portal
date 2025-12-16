const mongoose = require("mongoose");

const QuestionPaperSchema = new mongoose.Schema({
  semester: { type: String, required: true },
  subjectCode: { type: String, required: true },
  subjectName: { type: String, required: true },
  examType: { type: String, required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  publicId: { type: String, required: true },
  
  // ✅ NEW FIELD: Link to the User model
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("QuestionPaper", QuestionPaperSchema);
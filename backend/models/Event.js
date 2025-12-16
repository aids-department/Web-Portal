const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventType: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  venue: String,
  eventMode: String,
  organizer: String,
  
  // Image fields - UPDATED FOR CLOUDINARY
  poster: String, // Cloudinary URL
  posterPublicId: String, // Cloudinary public_id for deletion
  thumbnailUrl: String, // Optional thumbnail URL
  
  description: String,
  
  // Common fields
  registrationLink: String,
  contact: String,
  eligibility: String,
  maxParticipants: String,
  fees: String,
  
  // Hackathon-specific
  hackProblemStatements: String,
  hackTechStack: String,
  hackJudgingCriteria: String,
  hackPrizes: String,
  hackMentors: String,
  hackRules: String,
  theme: String,
  teamSize: String,
  deadlines: String,
  
  // Workshop/Seminar
  guestDetails: String,
  platform: String,
  eventLink: String,
  keynote: String,
  domain: String,
  duration: String,
  companyName: String,
  
  // Literary/Sports
  litCategory: String,
  rules: String,
  sportType: String,
  maxTeams: String,
  equipment: String,
  
  // Other
  journalInfo: String,
  startTime: String,
  endTime: String,
  name: String,
  mode: String,
  type: String
}, {
  timestamps: true
});

module.exports = mongoose.model('events', eventSchema);
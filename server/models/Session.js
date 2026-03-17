const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  drafts: [{
    name: { type: String, required: true },
    content: { type: String, default: '' }
  }],
  markers: [{
    time: { type: Number, required: true },
    label: { type: String, required: true }
  }],
  beatSource: { type: String, enum: ['upload', 'youtube', 'external'] },
  beatUrl: { type: String },
  bpm: { type: Number, default: 120 },
  takes: [{
    url: { type: String, required: true },
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Session', sessionSchema);

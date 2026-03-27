const Session = require('../models/Session');

// Create Session
exports.createSession = async (req, res) => {
  try {
    const { title, drafts, beatSource, beatUrl, markers, bpm, takes } = req.body;
    const userId = req.user.userId;

    // Initialize with a default draft if none provided
    const initialDrafts = drafts && drafts.length > 0 ? drafts : [
      { name: "Main Track", content: "" }
    ];

    const session = await Session.create({
      userId,
      title,
      drafts: initialDrafts,
      beatSource,
      beatUrl,
      markers: markers || [],
      bpm: bpm || 120,
      takes: takes || []
    });

    res.status(201).json(session);
  } catch (err) {
    console.error("SESSION SAVE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get All Sessions
exports.getSessions = async (req, res) => {
  try {
    const userId = req.user.userId;
    // Find sessions belonging to this user, sorted by newest first
    const sessions = await Session.find({ userId }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Session
exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Verify ownership
    if (session.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSession = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Verify ownership
    if (session.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (req.body.title !== undefined) session.title = req.body.title;
    if (req.body.drafts !== undefined) session.drafts = req.body.drafts;
    if (req.body.beatSource !== undefined) session.beatSource = req.body.beatSource;
    if (req.body.beatUrl !== undefined) session.beatUrl = req.body.beatUrl;
    if (req.body.markers !== undefined) session.markers = req.body.markers;
    if (req.body.bpm !== undefined) session.bpm = req.body.bpm;
    if (req.body.takes !== undefined) {
      session.takes = req.body.takes;
    }

    const updatedSession = await session.save();
    console.log("SAVED SESSION takes:", updatedSession.takes);
    return res.json(updatedSession);
  } catch (err) {
    console.error("SESSION SAVE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// Delete Session
exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Verify ownership
    if (session.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await session.deleteOne();
    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

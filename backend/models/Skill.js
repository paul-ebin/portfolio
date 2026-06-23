import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String, // e.g., 'Frontend', 'Backend', 'Database', 'Tools'
    required: true,
  },
  icon: {
    type: String, // Could be an image URL or icon class
  },
  order: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

const Skill = mongoose.model('Skill', skillSchema);

export default Skill;

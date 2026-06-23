import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Cloudinary URL
    required: true,
  },
  techStack: [{
    type: String,
  }],
  githubLink: {
    type: String,
  },
  liveLink: {
    type: String,
  },
  order: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

export default Project;

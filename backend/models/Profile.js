import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String },
  heroImage: { type: String }, // Cloudinary URL
  aboutText: { type: String },
  stats: [{
    label: { type: String },
    value: { type: String }
  }],
  email: { type: String },
  github: { type: String },
  linkedin: { type: String },
  resumeUrl: { type: String }, // Cloudinary URL to PDF
}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;

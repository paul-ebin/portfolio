import Profile from '../models/Profile.js';

export const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      // Create a default if it doesn't exist
      profile = await Profile.create({
        name: 'Paul Ebineezer',
        title: 'Full Stack Developer',
        subtitle: 'Computer Science Engineer',
        description: 'I build scalable web applications and create exceptional digital experiences with modern technologies.',
        aboutText: 'I am a passionate Full Stack Developer with expertise in React, Node.js, and modern web technologies.',
        stats: [
          { label: 'Years Experience', value: '3+' },
          { label: 'Projects Completed', value: '50+' }
        ],
        email: 'paul@example.com',
        github: 'https://github.com/paulebineezer',
        linkedin: 'https://linkedin.com/in/paulebineezer'
      });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    
    if (profile) {
      profile.name = req.body.name || profile.name;
      profile.title = req.body.title || profile.title;
      profile.subtitle = req.body.subtitle || profile.subtitle;
      profile.description = req.body.description || profile.description;
      profile.aboutText = req.body.aboutText || profile.aboutText;
      if (req.body.stats) profile.stats = req.body.stats;
      profile.email = req.body.email || profile.email;
      profile.github = req.body.github || profile.github;
      profile.linkedin = req.body.linkedin || profile.linkedin;

      if (req.file) {
        // If it's a resume PDF
        if (req.file.mimetype === 'application/pdf') {
          profile.resumeUrl = req.file.path;
        } else {
          // It's a hero image
          profile.heroImage = req.file.path;
        }
      }

      const updatedProfile = await profile.save();
      res.json(updatedProfile);
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

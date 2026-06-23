import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const seedData = async () => {
  try {
    await User.deleteMany();

    const adminUser = new User({
      email: 'paulcodes07@gmail.com',
      password: 'ebi',
    });

    await adminUser.save();

    console.log('Admin user seeded!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

seedData();

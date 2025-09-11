import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Seminar from './models/Seminar.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/growix';

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected');
  await Seminar.deleteMany({});

  let user = await User.findOne();
  if (!user) {
    user = await User.create({
      email: 'demo@growix.app',
      username: 'demo',
      passwordHash: '$2b$10$WkYx3wRk0eD0kq0wYj3dQO4Xz1oKx2z3s4t5u6v7w8x9y0z1a2b3C',
      firstName: 'Demo',
      lastName: 'User',
    });
  }

  const now = new Date();
  const styles = ['salsa', 'tango', 'bachata'];
  const levels = ['beginner', 'intermediate', 'advanced'];

  const seminars = Array.from({ length: 12 }).map((_, i) => ({
    title: `Cozy ${styles[i % styles.length]} Night #${i + 1}`,
    description: 'Warm lights, wooden floors, and smooth tunes. Join us for a cozy session.',
    date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + i + 1, 19, 0, 0),
    style: styles[i % styles.length],
    level: levels[i % levels.length],
    createdBy: user._id,
  }));

  await Seminar.insertMany(seminars);
  console.log('Seeded seminars');
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});



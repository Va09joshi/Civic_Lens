require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/modules/user/user.model');
const Post = require('../src/modules/post/post.model');
const Comment = require('../src/modules/comment/comment.model');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/civiclens', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create sample users
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@civiclens.com',
        password: 'AdminPass123',
        role: 'SUPER_ADMIN',
        isVerified: true,
      },
      {
        name: 'Moderator User',
        email: 'moderator@civiclens.com',
        password: 'ModeratorPass123',
        role: 'MODERATOR',
        isVerified: true,
      },
      {
        name: 'John Doe',
        email: 'john@civiclens.com',
        password: 'UserPass123',
        role: 'USER',
        isVerified: false,
      },
      {
        name: 'Jane Smith',
        email: 'jane@civiclens.com',
        password: 'UserPass123',
        role: 'USER',
        isVerified: true,
      },
    ]);

    console.log(`✅ Created ${users.length} users`);

    // Create sample posts
    const posts = await Post.create([
      {
        title: 'Pothole on Main Street',
        description: 'There is a large pothole on Main Street near the traffic light that is causing accidents and damage to vehicles.',
        category: 'POTHOLE',
        type: 'ISSUE',
        location: {
          type: 'Point',
          coordinates: [72.8777, 19.0760],
          city: 'Mumbai',
        },
        createdBy: users[2]._id,
        aiAnalysis: {
          score: 0.85,
          label: 'Likely True',
          reason: 'Post contains specific location details and describes a real infrastructure issue',
          analyzedAt: new Date(),
        },
      },
      {
        title: 'Street light not working',
        description: 'The street light on Bandra Road between Palm Avenue and Linking Road has been non-functional for over a week.',
        category: 'STREETLIGHT',
        type: 'ISSUE',
        location: {
          type: 'Point',
          coordinates: [72.8295, 19.0596],
          city: 'Mumbai',
        },
        createdBy: users[3]._id,
        aiAnalysis: {
          score: 0.78,
          label: 'Likely True',
          reason: 'Specific street names and timeframe provided',
          analyzedAt: new Date(),
        },
      },
      {
        title: 'Community cleanup initiative successful',
        description: 'Local volunteers cleaned up Marine Drive today. Over 500 kg of waste was collected. Great initiative!',
        category: 'SANITATION',
        type: 'NEWS',
        location: {
          type: 'Point',
          coordinates: [72.8239, 18.9424],
          city: 'Mumbai',
        },
        createdBy: users[2]._id,
        aiAnalysis: {
          score: 0.72,
          label: 'Possibly Misleading',
          reason: 'Lacks specific event details and verification',
          analyzedAt: new Date(),
        },
      },
    ]);

    console.log(`✅ Created ${posts.length} posts`);

    // Create sample comments
    const comments = await Comment.create([
      {
        text: 'This is a serious issue that needs immediate attention from the municipality!',
        postId: posts[0]._id,
        userId: users[3]._id,
      },
      {
        text: 'Thanks for reporting this. I will escalate to the concerned department.',
        postId: posts[0]._id,
        userId: users[1]._id,
      },
      {
        text: 'Same issue on my street as well. Please check Raja Road too.',
        postId: posts[1]._id,
        userId: users[2]._id,
      },
    ]);

    console.log(`✅ Created ${comments.length} comments`);

    console.log('\n✨ Database seeding completed successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('   SUPER_ADMIN: admin@civiclens.com / AdminPass123');
    console.log('   MODERATOR: moderator@civiclens.com / ModeratorPass123');
    console.log('   USER: john@civiclens.com / UserPass123');
    console.log('   USER: jane@civiclens.com / UserPass123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();

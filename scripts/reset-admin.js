/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// AdminUser Schema
const AdminUserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now },
});

const AdminUser = mongoose.models.AdminUser || mongoose.model('AdminUser', AdminUserSchema);

async function resetAdmin() {
  try {
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI environment variable not set');
      process.exit(1);
    }

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // New credentials
    const newUsername = 'admin';
    const newPassword = 'NewPassword123!'; // Change this to your desired password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Find and update or create
    let admin = await AdminUser.findOne({ username: newUsername.toLowerCase() });

    if (admin) {
      admin.passwordHash = hashedPassword;
      admin.name = 'Admin User';
      admin.role = 'admin';
      await admin.save();
      console.log('✅ Admin password updated successfully!');
    } else {
      admin = await AdminUser.create({
        username: newUsername.toLowerCase(),
        passwordHash: hashedPassword,
        name: 'Admin User',
        role: 'admin',
      });
      console.log('✅ Admin user created successfully!');
    }

    console.log(`\n📝 Credentials:\nUsername: ${newUsername}\nPassword: ${newPassword}`);
    console.log('\n⚠️  IMPORTANT: Change this password after logging in!');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

resetAdmin();

import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, location, coordinates } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      address: location,
      location: {
        type: "Point",
        coordinates,
      },
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ token, user });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login user or admin
export const loginUser = async (req, res) => {
  try {
    const { email, password, isAdmin } = req.body;

    // Admin login check via .env
    if (isAdmin) { // Check if the request is specifically for admin login
      if (
        email === process.env.ADMIN_EMAIL &&
        password === process.env.ADMIN_PASSWORD
      ) {
        const token = jwt.sign({ id: 'admin_id', role: 'admin' }, process.env.JWT_SECRET, {
          expiresIn: '7d'
        });

        return res.status(200).json({
          token,
          user: {
            name: 'Admin',
            email: process.env.ADMIN_EMAIL,
            role: 'admin'
          }
        });
      } else {
        // 💡 FIX: Return a 400 error if isAdmin is true but credentials are WRONG
        return res.status(400).json({ message: 'Invalid admin email or password.' });
      }
    }

    // Normal user login
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({ token, user });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

// Registration
exports.register = async (req, res) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    mobileNumber: Joi.string().required(), // Add mobileNumber validation
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    user = await User.findOne({ mobileNumber: req.body.mobileNumber });
    if (user) return res.status(400).send('Mobile number already registered.');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      mobileNumber: req.body.mobileNumber,
    });

    await user.save();
    res.status(201).send('User registered successfully');
  } catch (err) {
    res.status(500).send('Server error');
  }
};


exports.login = async (req, res) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
  
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) return res.status(400).send('Invalid credentials');
  
      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (!validPassword) return res.status(400).send('Invalid credentials');
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } catch (err) {
      res.status(500).send('Server error');
    }
  };
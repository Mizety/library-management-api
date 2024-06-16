const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");
const { emailRegex, passwordLengthRegex } = require("../utils/regex"); // Import regex patterns
const {registerUser} = require('./../services/auth.service')

exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
   const user =   registerUser(name, email, password, role);
   return res.status(200).json(user);
  }catch(e){
     return res.status(e.statusCode).json({ error:  e.message });
  }
  
 
};
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  // Validate email presence
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Validate password presence
  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and compare passwords
    if (user) {
      const passwordsMatch = await bcrypt.compare(password, user.password);
   
      if (passwordsMatch) {
        // Passwords match, generate JWT token and send response
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        });
      } else {
        // Passwords do not match
        return res.status(401).json({ error: "Invalid email or password" });
      }
    }
  } catch (error) {
    console.log(error);
    // Error while finding user or comparing passwords
    res.status(400).json({ error: error.message });
  }
};

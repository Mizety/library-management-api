const User = require("../models/User");
exports.registerUser =  async( name, email, password, role) => {
     // Validate email format
  if (!emailRegex.test(email)) {
    throw new Error({
        message: "Invalid email format",
        statusCode: 400
    })
    // return res.status(400).json({ error: "Invalid email format" });
  }

  // Validate password length
  if (!passwordLengthRegex.test(password)) {
    throw new Error({
        message:  "Password must be at least 8 characters long",
        statusCode: 400
    })
    // return res
    //   .status(400)
    //   .json({ error: "Password must be at least 8 characters long" });
  }
  if (!role) {
    throw new Error({
        message:  "Role is required" ,
        statusCode: 400
    })
    // return res.status(400).json({ error: "Role is required" });
  }

  try {
    // Check if user already exists with the provided email
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new Error({
            message:  "User already exists",
            statusCode: 400
        })
      
    }

    // By default, regular users registering themselves will have 'member' role

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    if (role && !["ADMIN", "MEMBER"].includes(role)) {
        throw new Error({
            message: 'Invalid role. Only "ADMIN" or "MEMBER" roles are accepted.',
            statusCode: 401
        })
    //   return res
    //     .status(400)
    //     .json({
    //       error: 'Invalid role. Only "ADMIN" or "MEMBER" roles are accepted.',
    //     });
    }
    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role,
    });

    // Respond with user details and token
    return ({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    // Handle errors
    throw new Error({
        message:  error.message,
        statusCode: 400
    })
  }
}

 
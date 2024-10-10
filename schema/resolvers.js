import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Note from "../models/Note.js";
import { createToken } from "../utils/createToken.js";
import { auth } from "../utils/auth.js";
export const resolvers = {
  Query: {
    getNotes: async (_, __, { req }) => {
      const user = auth(req);
      let notes = await Note.find({ userId: user._userId });
      return notes;
    },
  },
  Mutation: {
    // Register User
    register: async (_, { name, email, password }, { res }) => {
      if (!name || !email || !password) {
        throw new Error("Name, email, and password are required");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        name,
        email,
        password: hashedPassword,
      });
      await user.save();

      return { message: "User registering is successfull." };
    },

    // Login User
    login: async (_, { email, password }, { res }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found");
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Invalid credentials");

      createToken(res, user._id);
      return { message: "Login başarılı", user };
    },

    createNote: async (_, { title, description }, { req }) => {
      if (!title || !description) throw new Error("Please fill the all inputs");
      const user = auth(req);
      if (!user) throw new Error("Invalid authanticate");

      const noteUser = await User.findById(user.userId);
      const note = await Note.create({
        userId: user,
        title,
        description,
        user: noteUser,
      });
      return note;
    },
  },

  // Note: {
  //   user: async (parent) => {
  //     const userId = parent.userId;
  //     try {
  //       const user = await User.findById(userId);
  //       return user;
  //     } catch (err) {
  //       console.error("Error getting user:", err);
  //       throw new Error("Error getting user");
  //     }
  //   },
  // },
};

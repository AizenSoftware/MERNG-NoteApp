import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Note from "../models/Note.js";
import { createToken } from "../utils/createToken.js";
import { auth } from "../utils/auth.js";
export const resolvers = {
  Query: {
    authUser: async (_, __, { req }) => {
      const userId = await auth(req);
      if (!userId) throw new Error("Auth user not found");
      const user = await User.findById(userId);
      if (!user) throw new Error("There is no user");
      return user;
    },
    user: async (_, { userId }) => {
      const user = await User.findById(userId);
      if (!user) throw new Error("There is no user");

      return user;
    },
  },
  Mutation: {
    // Register User
    register: async (_, { name, email, password }) => {
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
      if (!email || !password) throw new Error("Please fill the all inputs");
      const user = await User.findOne({ email: email.trim() });
      if (!user) throw new Error("User not found");
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Invalid credentials");

      createToken(res, user._id);
      return { message: "Login başarılı", user };
    },

    logout: async (_, __, { res, req }) => {
      if (!req.cookies.jwt) throw new Error("User already logout");
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Yalnızca prod ortamında 'secure' olsun
        sameSite: "lax",
      });
      return { message: "Logout is successfull" };
    },

    createNote: async (_, { title, description }, { req }) => {
      const userId = await auth(req);
      if (!title || !description) throw new Error("Please fill the all inputs");
      if (!userId) throw new Error("Invalid authanticate");

      const user = await User.findById(userId);
      const note = await Note.create({
        userId,
        title,
        description,
        user,
      });
      return note;
    },
  },

  User: {
    notes: async (parent) => {
      try {
        const notes = await Note.find({ userId: parent.id });
        return notes;
      } catch (error) {
        console.log("Error:", error);
        throw new Error(error.message || "Interval Server Error");
      }
    },
  },
};

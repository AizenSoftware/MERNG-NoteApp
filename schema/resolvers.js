import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Note from "../models/Note.js";

export const resolvers = {
  Query: {
    getNotes: async () => {
      const notes = await Note.find({});
      console.log(notes);
      return notes; // MongoDB'den tüm notları çeker
    },
    getUser: async (_, { id }) => {
      return await User.findById(id).populate("notes"); // Kullanıcının notlarıyla birlikte getir
    },
    getUserNotes: async (_, { userId }) => {
      return await Note.find({ user: userId }); // Kullanıcının notlarını getir
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
      const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });
      return { message: "Register is successfull.", token };
    },

    // Login User
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found");
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Invalid credentials");
      const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });
      return { message: "Kullanıcı başarıyla giriş yaptı", token };
    },

    // Create Note
    createNote: async (_, { title, description, userId }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const createdByUser = await User.findById(userId);
      const note = new Note({ title, description, user: createdByUser });
      createdByUser.notes.push(note);
      (await createdByUser.save()).populate("notes");
      await note.save();
      return note;
    },

    // Update Note
    updateNote: async (_, { id, title, description }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const createdByUser = await User.findById(user.id);
      const note = await Note.findById(id);
      if (!note) throw new Error("There is not note!");

      note.title = title;
      note.description = description;
      await note.save();
      return note;
    },
  },
};

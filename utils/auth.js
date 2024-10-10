import jwt from "jsonwebtoken";

export const auth = (req) => {
  const token = req.cookies?.jwt;

  if (!token) {
    throw new Error("Aut required");
  }

  try {
    const user = jwt.verify(token, process.env.SECRET_KEY);
    return user;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

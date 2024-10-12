import jwt from "jsonwebtoken";

export const auth = async (req) => {
  const token = req.cookies?.jwt;
  if (!token) {
    throw new Error("Aut required");
  }
  try {
    const { userId } = jwt.verify(token, process.env.SECRET_KEY);
    return userId;
  } catch (error) {
    throw new Error(error);
  }
};

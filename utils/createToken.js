import jwt from "jsonwebtoken";
export const createToken = (req) => {
  const token = req.headers.authorization || "";

  // Token yoksa boş kullanıcı dön
  if (!token) {
    return { user: null };
  }

  let user = null;
  try {
    // Token'dan "Bearer " ifadesini kaldır
    user = jwt.verify(token, process.env.SECRET_KEY);
  } catch (err) {
    console.error("Token error:", err);
    return { user: null };
  }
  // Kullanıcıyı context'e ekle
  return { user };
};

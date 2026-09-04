import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw Object.assign(new Error("JWT_SECRET is not set"), { statusCode: 500 });
  }

  return jwt.sign({ id: userId }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw Object.assign(new Error("JWT_SECRET is not set"), { statusCode: 500 });
  }
  return jwt.verify(token, secret);
};

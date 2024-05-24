import jwt from 'jsonwebtoken';
const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key';

export interface JwtPayload {
  userId: string;
}

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId}, SECRET_KEY, { expiresIn: '1h' });
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    const payload = jwt.verify(token, SECRET_KEY) as JwtPayload;
    return payload;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
};


import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../models/user.model';
import dotenv from 'dotenv';

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: UserRole;
      };
    }
  }
}

export const authenticate = (roles?: string[]) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const token = req.headers.authorization?.split(' ')[1];
  
        if (!token) {
          res.status(401).json({ message: 'No token provided' });
          return;
        }
  
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        (req as any).user = decoded;
  
        if (roles && !roles.includes((decoded as any).role)) {
          res.status(403).json({ message: 'Forbidden: insufficient role' });
          return;
        }
  
        next(); // ✅ only go forward if all checks pass
      } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
      }
    };
  };
  
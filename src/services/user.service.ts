import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { UserRole } from '../models/user.model';
import dotenv from 'dotenv';

dotenv.config();

export class UserService {
  async createUser(
    email: string,
    password: string,
    role: UserRole,
    firstName?: string,
    lastName?: string
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await User.create({
      email,
      password: hashedPassword,
      role,
      first_name: firstName,
      last_name: lastName,
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } });
  }

  async findUserById(id: number): Promise<User | null> {
    return await User.findByPk(id);
  }

  async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  generateToken(user: User): string {
    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpire = process.env.JWT_EXPIRE ?? '24h';
  
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }
  
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      jwtSecret,
      {
        expiresIn: jwtExpire as `${number}${'s' | 'm' | 'h' | 'd'}`, // Cast to valid JWT duration string
      }
    );
  }
  
  

  async getAllUsers(): Promise<User[]> {
    return await User.findAll();
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
    const user = await this.findUserById(id);
    if (!user) return null;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    await user.update(updates);
    return user;
  }

  async deleteUser(id: number): Promise<boolean> {
    const deletedCount = await User.destroy({ where: { id } });
    return deletedCount > 0;
  }
}
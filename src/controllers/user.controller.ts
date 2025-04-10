import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { UserRole } from '../models/user.model';
import User, { UserAttributes } from '../models/user.model';

// Helper type to exclude password from UserAttributes
type UserResponse = Omit<UserAttributes, 'password'>;

export class UserController {
  private userService = new UserService();

  private toUserResponse(user: User): UserResponse {
    const { password, ...userData } = user.get({ plain: true });
    return userData;
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, role, firstName, lastName } = req.body;

      if (!Object.values(UserRole).includes(role)) {
        res.status(400).json({ error: 'Invalid role' });
        return;
      }

      const existingUser = await this.userService.findUserByEmail(email);
      if (existingUser) {
        res.status(400).json({ error: 'Email already in use' });
        return;
      }

      const user = await this.userService.createUser(email, password, role, firstName, lastName);
      const token = this.userService.generateToken(user);

      res.status(201).json({ 
        user: this.toUserResponse(user),
        token 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await this.userService.findUserByEmail(email);

      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const isMatch = await this.userService.comparePasswords(password, user.password);
      if (!isMatch) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const token = this.userService.generateToken(user);
      res.json({ 
        user: this.toUserResponse(user),
        token 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Login failed' });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users.map(user => this.toUserResponse(user)));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  }

  async getUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.findUserById(req.user!.id);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json(this.toUserResponse(user));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;
      const userId = parseInt(id);

      // Only allow admins or the user themselves to update
      if (req.user!.role !== UserRole.ADMIN && req.user!.id !== userId) {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }

      // Prevent role change unless by admin
      if (updates.role && req.user!.role !== UserRole.ADMIN) {
        res.status(403).json({ error: 'Only admins can change roles' });
        return;
      }

      const updatedUser = await this.userService.updateUser(userId, updates);
      if (!updatedUser) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json(this.toUserResponse(updatedUser));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = parseInt(id);

      // Only allow admins or the user themselves to delete
      if (req.user!.role !== UserRole.ADMIN && req.user!.id !== userId) {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }

      const success = await this.userService.deleteUser(userId);
      if (!success) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  }
}

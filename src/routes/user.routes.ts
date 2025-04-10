import { Router, Request, Response, NextFunction } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { UserRole } from '../models/user.model';

export const createUserRoutes = (): Router => {
  const router: Router = Router();
  const userController = new UserController();

  // Type your route handlers explicitly
  const registerHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await userController.register(req, res);
    } catch (error) {
      next(error);
    }
  };

  const loginHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await userController.login(req, res);
    } catch (error) {
      next(error);
    }
  };

  const getAllUsersHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await userController.getAllUsers(req, res);
    } catch (error) {
      next(error);
    }
  };

  const getUserProfileHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await userController.getUserProfile(req, res);
    } catch (error) {
      next(error);
    }
  };

  const updateUserHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await userController.updateUser(req, res);
    } catch (error) {
      next(error);
    }
  };

  const deleteUserHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await userController.deleteUser(req, res);
    } catch (error) {
      next(error);
    }
  };

  // Register routes
  router.post('/register', registerHandler);
  router.post('/login', loginHandler);
  
  // Protected routes
  router.get('/', authenticate([UserRole.ADMIN]), getAllUsersHandler);
  router.get('/profile', authenticate(), getUserProfileHandler);
  router.put('/:id', authenticate(), updateUserHandler);
  router.delete('/:id', authenticate(), deleteUserHandler);

  return router;
};

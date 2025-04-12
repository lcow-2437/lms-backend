import { Router, RequestHandler } from 'express';
import { ProfileController } from '../controllers/profile.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { UserRole } from '../models/user.model';

export const createProfileRoutes = (): Router => {
  const router = Router();
  const profileController = new ProfileController();

  // Helper function to properly type async handlers
  const asyncHandler = (fn: RequestHandler): RequestHandler => {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  };

  router.post(
    '/',
    authenticate([UserRole.STUDENT, UserRole.PROFESSOR]),
    asyncHandler((req, res) => profileController.createProfile(req, res))
  );

  router.get(
    '/',
    authenticate([UserRole.STUDENT, UserRole.PROFESSOR]),
    asyncHandler((req, res) => profileController.getProfile(req, res))
  );

  router.put(
    '/',
    authenticate([UserRole.STUDENT, UserRole.PROFESSOR]),
    asyncHandler((req, res) => profileController.updateProfile(req, res))
  );

  router.get(
    '/with-user',
    authenticate([UserRole.STUDENT, UserRole.PROFESSOR]),
    asyncHandler((req, res) => profileController.getProfileWithUser(req, res))
  );

  return router;
};
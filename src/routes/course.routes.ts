import { Router } from 'express';
import { CourseController } from '../controllers/course.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { UserRole } from '../models/user.model';

export const createCourseRoutes = (): Router => {
  const router = Router();
  const courseController = new CourseController();

  // Admin-only routes
  router.post('/', 
    authenticate([UserRole.ADMIN]), 
    async (req, res, next) => {
      try {
        await courseController.createCourse(req, res);
      } catch (error) {
        next(error);
      }
    }
  );

  router.put('/:courseId/professor/:professorId', 
    authenticate([UserRole.ADMIN]), 
    async (req, res, next) => {
      try {
        await courseController.assignProfessor(req, res);
      } catch (error) {
        next(error);
      }
    }
  );

  // Professor or Admin can enroll students
  router.post('/:courseId/students/:studentId', 
    authenticate([UserRole.ADMIN, UserRole.PROFESSOR]), 
    async (req, res, next) => {
      try {
        await courseController.enrollStudent(req, res);
      } catch (error) {
        next(error);
      }
    }
  );

  // Public routes (but authenticated)
  router.get('/', 
    authenticate(), 
    async (req, res, next) => {
      try {
        await courseController.getAllCourses(req, res);
      } catch (error) {
        next(error);
      }
    }
  );

  router.get('/:id', 
    authenticate(), 
    async (req, res, next) => {
      try {
        await courseController.getCourseDetails(req, res);
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
};

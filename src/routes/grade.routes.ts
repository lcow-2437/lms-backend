import { Router } from 'express';
import { GradeController } from '../controllers/grade.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { UserRole } from '../models/user.model';

export const createGradeRoutes = (): Router => {
  const router = Router();
  const gradeController = new GradeController();

  // Professor-only routes
  router.put('/submissions/:submissionId',
    authenticate([UserRole.PROFESSOR]),
    (req, res, next) => gradeController.gradeAssignment(req, res).catch(next)
  );

  router.get('/courses/:courseId',
    authenticate([UserRole.PROFESSOR]),
    (req, res, next) => gradeController.getCourseGrades(req, res).catch(next)
  );

  // Student route
  router.get('/my-grades',
    authenticate([UserRole.STUDENT]),
    (req, res, next) => gradeController.getMyGrades(req, res).catch(next)
  );

  return router;
};
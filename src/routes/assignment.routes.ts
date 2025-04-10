import { Router } from 'express';
import { AssignmentController } from '../controllers/assignment.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { UserRole } from '../models/user.model';

export const createAssignmentRoutes = (): Router => {
  const router = Router();
  const assignmentController = new AssignmentController();

  // Professor-only routes
  router.post('/', 
    authenticate([UserRole.PROFESSOR]),
    (req, res, next) => assignmentController.createAssignment(req, res).catch(next)
  );

  router.get('/:assignmentId/submissions',
    authenticate([UserRole.PROFESSOR]),
    (req, res, next) => assignmentController.getAssignmentSubmissions(req, res).catch(next)
  );

  router.put('/submissions/:submissionId/grade',
    authenticate([UserRole.PROFESSOR]),
    (req, res, next) => assignmentController.gradeSubmission(req, res).catch(next)
  );

  // Student routes
  router.post('/:assignmentId/submit',
    authenticate([UserRole.STUDENT]),
    (req, res, next) => assignmentController.submitAssignment(req, res).catch(next)
  );

  router.get('/my-submissions',
    authenticate([UserRole.STUDENT]),
    (req, res, next) => assignmentController.getStudentSubmissions(req, res).catch(next)
  );

  // Shared routes
  router.get('/courses/:courseId',
    authenticate([UserRole.STUDENT, UserRole.PROFESSOR]),
    (req, res, next) => assignmentController.getCourseAssignments(req, res).catch(next)
  );

  return router;
};
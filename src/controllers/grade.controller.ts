import { Request, Response } from 'express';
import { GradeService } from '../services/grade.service';
import { UserRole } from '../models/user.model';

export class GradeController {
  private gradeService = new GradeService();

  async gradeAssignment(req: Request, res: Response) {
    try {
      const { submissionId } = req.params;
      const { grade, feedback } = req.body;
      
      const submission = await this.gradeService.gradeSubmission(
        parseInt(submissionId),
        req.user!.id,
        grade,
        feedback
      );
      
      res.json(submission);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'Failed to grade assignment' });
      }
    }
  }

  async getCourseGrades(req: Request, res: Response) {
    try {
      const { courseId } = req.params;
      const grades = await this.gradeService.getGradesForCourse(
        parseInt(courseId),
        req.user!.id
      );
      res.json(grades);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'Failed to fetch course grades' });
      }
    }
  }

  async getMyGrades(req: Request, res: Response) {
    try {
      const grades = await this.gradeService.getStudentGrades(req.user!.id);
      res.json(grades);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'Failed to fetch your grades' });
      }
    }
  }
}
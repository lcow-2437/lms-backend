import { Request, Response } from 'express';
import { AssignmentService } from '../services/assignment.service';
import { UserRole } from '../models/user.model';

export class AssignmentController {
  private assignmentService = new AssignmentService();

  async createAssignment(req: Request, res: Response) {
    try {
      const { title, description, dueDate, courseId } = req.body;
      const assignment = await this.assignmentService.createAssignment(
        title,
        description,
        new Date(dueDate),
        courseId,
        req.user!.id
      );
      res.status(201).json(assignment);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  }

  async submitAssignment(req: Request, res: Response) {
    try {
      const { assignmentId } = req.params;
      const { submissionText, submissionFile } = req.body;
      const submission = await this.assignmentService.submitAssignment(
        parseInt(assignmentId),
        req.user!.id,
        submissionText,
        submissionFile
      );
      res.status(201).json(submission);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  }

  async gradeSubmission(req: Request, res: Response) {
    try {
      const { submissionId } = req.params;
      const { grade, feedback } = req.body;
      const submission = await this.assignmentService.gradeSubmission(
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
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  }

  async getCourseAssignments(req: Request, res: Response) {
    try {
      const { courseId } = req.params;
      const assignments = await this.assignmentService.getCourseAssignments(
        parseInt(courseId),
        req.user!.id,
        req.user!.role
      );
      res.json(assignments);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  }

  async getAssignmentSubmissions(req: Request, res: Response) {
    try {
      const { assignmentId } = req.params;
      const submissions = await this.assignmentService.getAssignmentSubmissions(
        parseInt(assignmentId),
        req.user!.id
      );
      res.json(submissions);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  }

  async getStudentSubmissions(req: Request, res: Response) {
    try {
      const submissions = await this.assignmentService.getStudentSubmissions(req.user!.id);
      res.json(submissions);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  }
}

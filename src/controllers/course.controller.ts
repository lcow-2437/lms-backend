import { Request, Response } from 'express';
import { CourseService } from '../services/course.service';
import { UserRole } from '../models/user.model';

export class CourseController {
  private courseService = new CourseService();

  async createCourse(req: Request, res: Response) {
    try {
      const { name, code, description } = req.body;
      const course = await this.courseService.createCourse(name, code, description);
      res.status(201).json(course);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  async assignProfessor(req: Request, res: Response) {
    try {
      const { courseId, professorId } = req.params;
      const course = await this.courseService.assignProfessor(parseInt(courseId), parseInt(professorId));
      res.json(course);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  }

  async enrollStudent(req: Request, res: Response) {
    try {
      const { courseId, studentId } = req.params;
      await this.courseService.enrollStudent(parseInt(courseId), parseInt(studentId));
      res.json({ message: 'Student enrolled successfully' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  }

  async getCourseDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const course = await this.courseService.getCourseDetails(parseInt(id));
      if (!course) return res.status(404).json({ error: 'Course not found' });
      res.json(course);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  async getAllCourses(req: Request, res: Response) {
    try {
      const courses = await this.courseService.getAllCourses();
      res.json(courses);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }
}

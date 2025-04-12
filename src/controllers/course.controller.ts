import { Request, Response } from 'express';
import { CourseService } from '../services/course.service';
import { UserRole } from '../models/user.model';

export class CourseController {
  private courseService = new CourseService();

  async createCourse(req: Request, res: Response) {
    try {
      const { name, code, description, professor_id } = req.body; // Add professor_id
      const course = await this.courseService.createCourse(
        name, 
        code, 
        description,
        professor_id // Pass it to service
      );
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
      const course = await this.courseService.assignProfessor(
        parseInt(courseId),
        parseInt(professorId)
      );
      res.json(course);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          res.status(404).json({ error: error.message });
        } else {
          res.status(400).json({ error: error.message });
        }
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  async enrollStudent(req: Request, res: Response) {
    try {
      // The issue is in these two lines - ensure names match the route params exactly
      const courseId = req.params.courseId;
      const studentId = req.params.studentId;
  
      // Input validation
      const parsedCourseId = Number(courseId);
      const parsedStudentId = Number(studentId);
      
      console.log("Course ID:", parsedCourseId, "Student ID:", parsedStudentId); // Add for debugging
      
      if (!parsedCourseId || isNaN(parsedCourseId)) {
        return res.status(400).json({ 
          success: false,
          error: 'Invalid course ID',
          code: 'INVALID_COURSE_ID'
        });
      }
  
      if (!parsedStudentId || isNaN(parsedStudentId)) {
        return res.status(400).json({ 
          success: false,
          error: 'Invalid student ID',
          code: 'INVALID_STUDENT_ID'
        });
      }
  
      // Process enrollment
      const { course, student } = await this.courseService.enrollStudent(
        parsedCourseId,
        parsedStudentId
      );
  
      // Success response
      return res.status(201).json({
        success: true,
        message: `Student ${student.email} enrolled successfully`,
        data: {
          course: {
            id: course.id,
            code: course.code,
            name: course.name
          },
          student: {
            id: student.id,
            email: student.email,
            name: `${student.first_name} ${student.last_name}`
          },
          enrolledAt: new Date().toISOString()
        }
      });
  
    } catch (error: unknown) {
      // Error handling
      if (error instanceof Error) {
        console.error("Enrollment error:", error); // Add this for debugging
        
        if (error.message.includes('not found')) {
          return res.status(404).json({
            success: false,
            error: error.message,
            code: 'RESOURCE_NOT_FOUND'
          });
        }
        if (error.message.includes('already enrolled')) {
          return res.status(409).json({
            success: false,
            error: error.message,
            code: 'DUPLICATE_ENROLLMENT'
          });
        }
        return res.status(400).json({
          success: false,
          error: error.message,
          code: 'BAD_REQUEST'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR'
      });
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

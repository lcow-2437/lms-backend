import Course from '../models/course.model';
import { CourseStudent } from '../models/course.model';
import User from '../models/user.model';
import { UserRole } from '../models/user.model';
import sequelize from '../config/database';
import { QueryTypes } from 'sequelize';
export class CourseService {
  private sequelize = sequelize; // Add sequelize as a class property
  async createCourse(
    name: string, 
    code: string, 
    description?: string,
    professor_id?: number  // Add this parameter
  ): Promise<Course> {
    // Validate professor if provided
    if (professor_id) {
      const professor = await User.findByPk(professor_id);
      if (!professor || professor.role !== UserRole.PROFESSOR) {
        throw new Error('Invalid professor ID');
      }
    }
    
    return await Course.create({ 
      name, 
      code, 
      description,
      professor_id  // Include in creation
    });
  }

  async assignProfessor(courseId: number, professorId: number): Promise<Course> {
    // 1. Verify course exists (with proper null check)
    const course = await Course.findByPk(courseId);
    if (!course) {
      throw new Error('Course not found');
    }
  
    // 2. Verify professor exists and has correct role
    const professor = await User.findOne({
      where: {
        id: professorId,
        role: 'professor'
      }
    });
  
    if (!professor) {
      throw new Error('Professor not found or user is not a professor');
    }
  
    // 3. Update course and return the updated instance
    const updatedCourse = await course.update({ professor_id: professorId });
    
    // 4. Return course with professor details
    const result = await Course.findByPk(courseId, {
      include: [{
        association: 'professor',
        required: false
      }]
    });
  
    if (!result) {
      throw new Error('Course not found after update');
    }
  
    return result;
  }

  async enrollStudent(courseId: number, studentId: number): Promise<{course: Course, student: User}> {
    console.log(`Attempting to enroll student ${studentId} in course ${courseId}`);
    
    // Verify IDs are valid numbers
    if (!courseId || !studentId) {
      throw new Error('Invalid course or student ID');
    }
  
    // Verify course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      throw new Error('Course not found');
    }
    console.log(`Found course: ${course.name} (ID: ${course.id})`);
  
    // Verify student exists and has student role
    const student = await User.findOne({
      where: {
        id: studentId,
        role: UserRole.STUDENT
      }
    });
  
    if (!student) {
      throw new Error('Student not found or user is not a student');
    }
    console.log(`Found student: ${student.email} (ID: ${student.id})`);
  
    // Check if already enrolled
    const enrollment = await CourseStudent.findOne({
      where: {
        course_id: courseId,
        student_id: studentId
      }
    });
  
    if (enrollment) {
      throw new Error('Student already enrolled in this course');
    }
    console.log('No existing enrollment found, proceeding to create enrollment');
  
    // Create enrollment
    try {
      // Print the course_student model structure to debug
      console.log('course_student model structure:', 
        Object.keys(this.sequelize.models.course_student.rawAttributes));
      
      console.log('Creating enrollment with:', {
        course_id: courseId,
        student_id: studentId
      });
      
      // Try with direct SQL first to check if there's a raw DB issue
      const [results, metadata] = await this.sequelize.query(`
        INSERT INTO course_students (course_id, student_id) 
        VALUES (?, ?)
      `, {
        replacements: [courseId, studentId]
      });
      
      console.log('Raw SQL insert result:', { results, metadata });
      
      return { course, student };
    } catch (err) {
      console.error('Enrollment error details:', err);
      if (err instanceof Error) {
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
      }
      
      // Check if table exists
      try {
        const [tables] = await this.sequelize.query(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = DATABASE()
        `);
        console.log('Database tables:', tables);
        
        // Check table structure
        const [columns] = await this.sequelize.query(`
          SHOW COLUMNS FROM course_students
        `);
        console.log('course_students columns:', columns);
      } catch (schemaErr) {
        console.error('Error getting schema information:', schemaErr);
      }
      
      throw new Error('Failed to enroll student');
    }
  }

  async getCourseDetails(courseId: number): Promise<Course | null> {
    console.log(`Getting course details for course ID: ${courseId}`);
    
    // First, check if there are any enrollments
    try {
      const enrollments = await this.sequelize.query(
        'SELECT * FROM course_students WHERE course_id = ?',
        {
          replacements: [courseId],
          type: QueryTypes.SELECT
        }
      );
      console.log('Raw enrollments found in database:', enrollments);
      
      // If we found enrollments, ensure the students exist
      if (enrollments.length > 0) {
        const studentIds = enrollments.map((e: any) => e.student_id);
        console.log('Student IDs found in enrollments:', studentIds);
        
        // Check if these students exist
        const students = await User.findAll({
          where: { 
            id: studentIds 
          }
        });
        console.log('Students found by IDs:', students.map(s => ({ id: s.id, email: s.email })));
      }
    } catch (error) {
      console.error('Error checking enrollments:', error);
    }
    
    // Now fetch the course with relations
    try {
      const course = await Course.findByPk(courseId, {
        include: [
          { 
            association: 'professor',
            attributes: ['id', 'email', 'role', 'first_name', 'last_name', 'created_at', 'updated_at']
          },
          { 
            association: 'students',
            attributes: ['id', 'email', 'role', 'first_name', 'last_name', 'created_at', 'updated_at']
          }
        ]
      });
      
      console.log('Course query executed, students array length:', 
        course?.students?.length || 'No course found');
      
      return course;
    } catch (error) {
      console.error('Error in getCourseDetails:', error);
      throw error;
    }
  }

  async getAllCourses(): Promise<Course[]> {
    return await Course.findAll({
      include: [
        { association: 'professor' }
      ]
    });
  }
}
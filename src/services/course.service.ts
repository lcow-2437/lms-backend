import Course from '../models/course.model';
import User from '../models/user.model';

export class CourseService {
  async createCourse(name: string, code: string, description?: string): Promise<Course> {
    return await Course.create({ name, code, description });
  }

  async assignProfessor(courseId: number, professorId: number): Promise<Course> {
    const course = await Course.findByPk(courseId);
    if (!course) throw new Error('Course not found');
    
    const professor = await User.findByPk(professorId);
    if (!professor || professor.role !== 'professor') throw new Error('Invalid professor');
    
    await course.update({ professor_id: professorId });
    return course;
  }

  async enrollStudent(courseId: number, studentId: number): Promise<void> {
    const course = await Course.findByPk(courseId);
    if (!course) throw new Error('Course not found');
    
    const student = await User.findByPk(studentId);
    if (!student || student.role !== 'student') throw new Error('Invalid student');
    
    await (course as any).addStudent(student);
  }

  async getCourseDetails(courseId: number): Promise<Course | null> {
    return await Course.findByPk(courseId, {
      include: [
        { association: 'professor' },
        { association: 'students' }
      ]
    });
  }

  async getAllCourses(): Promise<Course[]> {
    return await Course.findAll({
      include: [
        { association: 'professor' }
      ]
    });
  }
}
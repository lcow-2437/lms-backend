import { AssignmentSubmission } from '../models/assignment.model';
import User from '../models/user.model';
import Course from '../models/course.model';

export class GradeService {
  async gradeSubmission(
    submissionId: number,
    professorId: number,
    grade: number,
    feedback?: string
  ): Promise<AssignmentSubmission> {
    // Verify the professor teaches this course
    const submission = await AssignmentSubmission.findOne({
      where: { id: submissionId },
      include: [
        {
          association: 'assignment',
          include: [
            {
              association: 'course',
              where: { professor_id: professorId }
            }
          ]
        }
      ]
    });

    if (!submission) {
      throw new Error('Submission not found or you are not authorized to grade it');
    }

    return await submission.update({
      grade,
      feedback,
      graded_at: new Date(),
      graded_by: professorId
    });
  }

  async getGradesForCourse(courseId: number, professorId: number): Promise<AssignmentSubmission[]> {
    // Verify professor teaches this course
    const course = await Course.findOne({
      where: { id: courseId, professor_id: professorId }
    });
    if (!course) throw new Error('Course not found or unauthorized');

    return await AssignmentSubmission.findAll({
      include: [
        {
          association: 'assignment',
          where: { course_id: courseId },
          include: [
            {
              association: 'course'
            }
          ]
        },
        {
          association: 'student'
        }
      ]
    });
  }

  async getStudentGrades(studentId: number): Promise<AssignmentSubmission[]> {
    return await AssignmentSubmission.findAll({
      where: { student_id: studentId },
      include: [
        {
          association: 'assignment',
          include: [
            {
              association: 'course'
            }
          ]
        }
      ]
    });
  }
}
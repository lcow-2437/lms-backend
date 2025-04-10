import { Assignment, AssignmentSubmission } from '../models/assignment.model';
import User from '../models/user.model';
import Course from '../models/course.model';
import sequelize from '../config/database';

export class AssignmentService {
  async createAssignment(
    title: string,
    description: string,
    dueDate: Date,
    courseId: number,
    professorId: number
  ): Promise<Assignment> {
    // Verify professor teaches this course
    const course = await Course.findOne({
      where: { id: courseId, professor_id: professorId }
    });
    if (!course) throw new Error('You are not teaching this course');

    return await Assignment.create({
      title,
      description,
      due_date: dueDate,
      course_id: courseId
    });
  }

  async submitAssignment(
    assignmentId: number,
    studentId: number,
    submissionText: string,
    submissionFile?: string
  ): Promise<AssignmentSubmission> {
    // Verify student is enrolled in the course
    const assignment = await Assignment.findByPk(assignmentId);
    if (!assignment) throw new Error('Assignment not found');

    const enrollment = await sequelize.models.course_student.findOne({
      where: {
        course_id: assignment.course_id,
        student_id: studentId
      }
    });
    if (!enrollment) throw new Error('You are not enrolled in this course');

    return await AssignmentSubmission.create({
      assignment_id: assignmentId,
      student_id: studentId,
      submission_text: submissionText,
      submission_file: submissionFile
    });
  }

  async gradeSubmission(
    submissionId: number,
    professorId: number,
    grade: number,
    feedback?: string
  ): Promise<AssignmentSubmission> {
    const submission = await AssignmentSubmission.findByPk(submissionId, {
      include: [{
        association: 'assignment',
        include: [{
          association: 'course'
        }]
      }]
    });

    if (!submission) throw new Error('Submission not found');
    if (submission.assignment?.course?.professor_id !== professorId) {
      throw new Error('You are not authorized to grade this submission');
    }

    await submission.update({ grade, feedback });
    return submission;
  }

  async getCourseAssignments(courseId: number, userId: number, role: string): Promise<Assignment[]> {
    // Verify access
    if (role === 'student') {
      const enrollment = await sequelize.models.course_student.findOne({
        where: {
          course_id: courseId,
          student_id: userId
        }
      });
      if (!enrollment) throw new Error('You are not enrolled in this course');
    } else if (role === 'professor') {
      const course = await Course.findOne({
        where: { id: courseId, professor_id: userId }
      });
      if (!course) throw new Error('You are not teaching this course');
    }

    return await Assignment.findAll({
      where: { course_id: courseId },
      order: [['due_date', 'ASC']]
    });
  }

  async getAssignmentSubmissions(assignmentId: number, professorId: number): Promise<AssignmentSubmission[]> {
    const assignment = await Assignment.findByPk(assignmentId, {
      include: [{
        association: 'course'
      }]
    });
    if (!assignment) throw new Error('Assignment not found');
    if (assignment.course?.professor_id !== professorId) {
      throw new Error('You are not authorized to view these submissions');
    }

    return await AssignmentSubmission.findAll({
      where: { assignment_id: assignmentId },
      include: [{
        association: 'student'
      }]
    });
  }

  async getStudentSubmissions(studentId: number): Promise<AssignmentSubmission[]> {
    return await AssignmentSubmission.findAll({
      where: { student_id: studentId },
      include: [{
        association: 'assignment',
        include: [{
          association: 'course'
        }]
      }]
    });
  }
}
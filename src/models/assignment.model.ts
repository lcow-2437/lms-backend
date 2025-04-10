import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Course from './course.model';
import User from './user.model';

interface AssignmentAttributes {
  id: number;
  title: string;
  description: string;
  due_date: Date;
  course_id: number;
  created_at?: Date;
  updated_at?: Date;
}

interface AssignmentCreationAttributes extends Optional<AssignmentAttributes, 'id' | 'created_at' | 'updated_at'> {}

class Assignment extends Model<AssignmentAttributes, AssignmentCreationAttributes> implements AssignmentAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public due_date!: Date;
  public course_id!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  public readonly course?: Course;
  public readonly submissions?: AssignmentSubmission[];
}

Assignment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Course,
        key: 'id',
      },
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'assignments',
    timestamps: true,
    underscored: true,
  }
);

// Submission Model
interface AssignmentSubmissionAttributes {
  id: number;
  assignment_id: number;
  student_id: number;
  submission_text: string;
  submission_file?: string;
  grade?: number;
  feedback?: string;
  submitted_at?: Date;
}

interface AssignmentSubmissionCreationAttributes extends Optional<AssignmentSubmissionAttributes, 'id' | 'submitted_at'> {}

class AssignmentSubmission extends Model<AssignmentSubmissionAttributes, AssignmentSubmissionCreationAttributes> 
  implements AssignmentSubmissionAttributes {
  public id!: number;
  public assignment_id!: number;
  public student_id!: number;
  public submission_text!: string;
  public submission_file?: string;
  public grade?: number;
  public feedback?: string;
  public readonly submitted_at!: Date;

  public readonly assignment?: Assignment;
  public readonly student?: User;
}

AssignmentSubmission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    assignment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Assignment,
        key: 'id',
      },
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    submission_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    submission_file: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    grade: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    submitted_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'assignment_submissions',
    timestamps: false,
  }
);

// Define associations
Assignment.belongsTo(Course, { foreignKey: 'course_id' });
Course.hasMany(Assignment, { foreignKey: 'course_id' });

AssignmentSubmission.belongsTo(Assignment, { foreignKey: 'assignment_id' });
Assignment.hasMany(AssignmentSubmission, { foreignKey: 'assignment_id' });

AssignmentSubmission.belongsTo(User, { foreignKey: 'student_id' });
User.hasMany(AssignmentSubmission, { foreignKey: 'student_id' });

export { Assignment, AssignmentSubmission };
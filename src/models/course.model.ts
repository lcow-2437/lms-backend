import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './user.model';

interface CourseAttributes {
  id: number;
  name: string;
  code: string;
  description?: string;
  professor_id?: number;
  created_at?: Date;
  updated_at?: Date;
}

interface CourseCreationAttributes extends Optional<CourseAttributes, 'id' | 'created_at' | 'updated_at'> {}

class Course extends Model<CourseAttributes, CourseCreationAttributes> implements CourseAttributes {
  public id!: number;
  public name!: string;
  public code!: string;
  public description?: string;
  public professor_id?: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  public readonly professor?: User;
  public readonly students?: User[];
}

Course.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    professor_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
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
    tableName: 'courses',
    timestamps: true,
    underscored: true,
  }
);

// Define associations
Course.belongsTo(User, { as: 'professor', foreignKey: 'professor_id' });
User.hasMany(Course, { as: 'taughtCourses', foreignKey: 'professor_id' });

// Create junction table for students
const CourseStudent = sequelize.define('course_student', {
  course_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Course,
      key: 'id',
    },
  },
  student_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: User,
      key: 'id',
    },
  },
}, {
  tableName: 'course_students',
  timestamps: false,
});

Course.belongsToMany(User, { through: CourseStudent, as: 'students' });
User.belongsToMany(Course, { through: CourseStudent, as: 'enrolledCourses' });

export default Course;
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import  User  from './user.model';

interface ProfileAttributes {
  id: number;
  user_id: number;
  first_name?: string;
  last_name?: string;
  bio?: string;
  date_of_birth?: Date;
  gender?: string;
  city?: string;
  state_province?: string;
  postal_code?: string;
  country?: string;
  avatar?: string;
  website?: string;
  created_at?: Date;
  updated_at?: Date;
}

interface ProfileCreationAttributes extends Optional<ProfileAttributes, 'id' | 'created_at' | 'updated_at'> {}

class Profile extends Model<ProfileAttributes, ProfileCreationAttributes> implements ProfileAttributes {
  public id!: number;
  public user_id!: number;
  public first_name?: string;
  public last_name?: string;
  public bio?: string;
  public date_of_birth?: Date;
  public gender?: string;
  public city?: string;
  public state_province?: string;
  public postal_code?: string;
  public country?: string;
  public avatar?: string;
  public website?: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  public readonly user?: User;
}

Profile.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: true,
        isBefore: new Date().toISOString(),
      },
    },
    gender: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        isIn: [['male', 'female', 'non-binary', 'other', 'prefer-not-to-say']],
      },
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    state_province: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    postal_code: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
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
    tableName: 'profiles',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['country'] },
      { fields: ['state_province'] },
      { fields: ['city'] },
    ],
  }
);

// Association with User
Profile.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

export { Profile };
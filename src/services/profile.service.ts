import { Profile } from '../models/profile.model';
import  User  from '../models/user.model';

export class ProfileService {
  async createProfile(
    userId: number,
    profileData: {
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
    }
  ): Promise<Profile> {
    const existingProfile = await Profile.findOne({ where: { user_id: userId } });
    if (existingProfile) {
      throw new Error('Profile already exists for this user');
    }

    return await Profile.create({
      user_id: userId,
      ...profileData,
    });
  }

  async getProfile(userId: number): Promise<Profile | null> {
    return await Profile.findOne({
      where: { user_id: userId },
      include: ['user'],
    });
  }

  async updateProfile(
    userId: number,
    updateData: {
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
    }
  ): Promise<Profile> {
    const profile = await Profile.findOne({ where: { user_id: userId } });
    if (!profile) {
      throw new Error('Profile not found');
    }

    return await profile.update(updateData);
  }

  async getUserWithProfile(userId: number): Promise<{ user: User | null; profile: Profile | null }> {
    const profile = await Profile.findOne({
      where: { user_id: userId },
      include: ['user'],
    });

    return {
      user: profile?.user || null,
      profile,
    };
  }
}
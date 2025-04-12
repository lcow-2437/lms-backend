import { Request, Response } from 'express';
import { ProfileService } from '../services/profile.service';

export class ProfileController {
  private profileService = new ProfileService();

  async createProfile(req: Request, res: Response): Promise<void> {
    try {
      const {
        first_name,
        last_name,
        bio,
        date_of_birth,
        gender,
        city,
        state_province,
        postal_code,
        country,
        avatar,
        website,
      } = req.body;

      const profile = await this.profileService.createProfile(req.user!.id, {
        first_name,
        last_name,
        bio,
        date_of_birth,
        gender,
        city,
        state_province,
        postal_code,
        country,
        avatar,
        website,
      });

      res.status(201).json(profile);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const profile = await this.profileService.getProfile(req.user!.id);
      if (!profile) {
        res.status(404).json({ message: 'Profile not found' });
        return;
      }
      res.json(profile);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const {
        first_name,
        last_name,
        bio,
        date_of_birth,
        gender,
        city,
        state_province,
        postal_code,
        country,
        avatar,
        website,
      } = req.body;

      const profile = await this.profileService.updateProfile(req.user!.id, {
        first_name,
        last_name,
        bio,
        date_of_birth,
        gender,
        city,
        state_province,
        postal_code,
        country,
        avatar,
        website,
      });

      res.json(profile);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  }

  async getProfileWithUser(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.profileService.getUserWithProfile(req.user!.id);
      res.json(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  }
}
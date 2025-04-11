import { Router, Request, Response } from 'express';
import sequelize from '../config/database';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const [results] = await sequelize.query("SELECT NOW() AS time");
    // TypeScript workaround for unknown result type
    const time = (results as any)[0]?.time;

    res.json({ success: true, serverTime: time });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Database test failed" });
  }
});

export default router;

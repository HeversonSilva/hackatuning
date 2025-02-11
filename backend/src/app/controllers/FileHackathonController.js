import { resolve } from 'path';
import * as fs from 'fs';

import File from '../models/File';
import ApiError from '../../config/ApiError';
import Hackathon from '../models/Hackathon';

class FileUserController {
  async store(req, res, next) {
    try {
      const { originalname: name, filename: path, size, mimetype } = req.file;

      if (!name || !path) {
        throw new ApiError(
          'Validations Fails',
          'You made an invalid request',
          400
        );
      }

      if (!['image/png', 'image/jpeg'].includes(mimetype)) {
        throw new ApiError(
          'Extension not allowed',
          'Only .jpg and .png file allowed',
          400
        );
      }

      if (size > 15000000) {
        throw new ApiError(
          'File too large',
          'Only files up to 15MB allowed',
          400
        );
      }

      const hackathon = await Hackathon.findOne({
        where: {
          id: req.params.id,
          organizer_id: req.userId,
        },
        include: [
          {
            model: File,
            as: 'cover',
            attributes: ['id', 'url', 'path'],
          },
        ],
      });

      if (!hackathon) {
        throw new ApiError(
          'Not Found',
          'Hackathon not found or does not belong to you',
          404
        );
      }

      const file = await File.create({
        name,
        path,
      });

      if (hackathon.cover_id) {
        const dir = resolve(
          __dirname,
          '..',
          '..',
          '..',
          'tmp',
          'uploads',
          hackathon.cover.path
        );

        const fileExists = await fs.existsSync(dir);

        if (fileExists) {
          await fs.unlinkSync(dir);
        }

        await File.destroy({ where: { id: hackathon.cover_id } });
      }

      await hackathon.update({ cover_id: file.id });

      return res.json(file);
    } catch (error) {
      return next(error);
    }
  }
}

export default new FileUserController();

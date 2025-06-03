import BaseJoi from 'joi';
import { fileListExtension } from 'joi-filelist';
export const Joi = fileListExtension(BaseJoi);
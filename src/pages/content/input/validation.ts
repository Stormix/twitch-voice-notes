import { z } from 'zod';

const validateUsername = (username: string) => /^(#)?[a-zA-Z0-9][\w]{2,24}$/.test(username);
const validateColor = (color: string) => /^#[0-9a-fA-F]{6}$/.test(color);

export const recordPayloadSchema = z.object({
  author: z.string().max(25).refine(validateUsername, 'Invalid username'),
  channel: z.string().max(25).refine(validateUsername, 'Invalid channel'),
  color: z.string().refine(validateColor, 'Invalid color'),
});

import { registerAs } from '@nestjs/config';

export const authConfig = registerAs('auth', () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: parseInt(process.env.JWT_EXPIRES_IN ?? '3600', 10),
  refreshExpiresIn: parseInt(
    process.env.JWT_REFRESH_TOKEN_EXPIRES_IN ?? '86400',
    10,
  ),
  audience: process.env.JWT_AUDIENCE,
  issuer: process.env.JWT_ISSUER,
}));

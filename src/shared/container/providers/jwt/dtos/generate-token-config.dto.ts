export type GenerateTokenConfigDTO = {
  payload?: Record<string, unknown>;
  algorithm: string;
  subject: string;
  expiresIn: string;
};

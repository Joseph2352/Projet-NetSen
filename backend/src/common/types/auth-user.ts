import { Role } from '@prisma/client';

/** Contenu signé dans le JWT. */
export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}

/** Utilisateur authentifié, attaché à `request.user` après validation du token. */
export interface AuthUser {
  id: string;
  email: string;
  role: Role;
}

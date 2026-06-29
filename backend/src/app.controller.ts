import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  /** Endpoint de santé (utile pour les sondes de déploiement). */
  @Get('health')
  health() {
    return { status: 'ok', service: 'MediRDV API' };
  }
}

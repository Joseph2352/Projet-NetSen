import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CentersModule } from './centers/centers.module';
import { SpecialtiesModule } from './specialties/specialties.module';
import { DoctorsModule } from './doctors/doctors.module';
import { AbsencesModule } from './absences/absences.module';
import { AppointmentsModule } from './appointments/appointments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    CentersModule,
    SpecialtiesModule,
    DoctorsModule,
    AbsencesModule,
    AppointmentsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from '../users/repositories/users.repository';
import { AppointmentsController } from './controllers/appointments.controller';
import { ProvidersController } from './controllers/providers.controller';
import { AppointmentsRepository } from './repositories/appointments.repository';
import { CreateAppointmentService } from './services/create-appointment.service';
import { ListProviderAppointmentsService } from './services/list-provider-appointments.service';
import { ListProviderDayAvailabilityService } from './services/list-provider-day-availability.service';
import { ListProviderMonthAvailabilityService } from './services/list-provider-month-availability.service';
import { ListProvidersService } from './services/list-providers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppointmentsRepository, UsersRepository]),
  ],
  controllers: [AppointmentsController, ProvidersController],
  providers: [
    CreateAppointmentService,
    ListProviderAppointmentsService,
    ListProviderDayAvailabilityService,
    ListProviderMonthAvailabilityService,
    ListProvidersService,
  ],
})
export class AppointmentsModule {}

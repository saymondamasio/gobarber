import { Injectable } from '@nestjs/common';
import Appointment from '../entities/appointment.entity';
import { AppointmentsRepository } from '../repositories/appointments.repository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}
@Injectable()
export class ListProviderAppointmentsService {
  constructor(private appointmentsRepository: AppointmentsRepository) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<Appointment[]> {
    const appointments =
      await this.appointmentsRepository.findAllInDayFromProvider({
        provider_id,
        day,
        month,
        year,
      });

    return appointments;
  }
}

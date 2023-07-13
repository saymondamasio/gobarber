import { AppError } from '@modules/shared/errors/AppError';
import { UsersRepository } from '@modules/users/repositories/users.repository';
import { Injectable } from '@nestjs/common';
import { getHours, isAfter } from 'date-fns';
import { AppointmentsRepository } from '../repositories/appointments.repository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;
@Injectable()
export class ListProviderDayAvailabilityService {
  constructor(
    private appointmentsRepository: AppointmentsRepository,
    private usersRepository: UsersRepository,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const provider = await this.usersRepository.findOne(provider_id);

    if (!provider) {
      throw new AppError('Provider not exists');
    }

    const appointments =
      await this.appointmentsRepository.findAllInDayFromProvider({
        provider_id,
        day,
        month,
        year,
      });

    const hourStart = 8;
    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + hourStart,
    );

    const currentDate = new Date(Date.now());

    const availability = eachHourArray.map((hour) => {
      const hasAppointmentInHour = appointments.find(
        (appointment) => getHours(appointment.date) === hour,
      );

      const compareDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        available: !hasAppointmentInHour && isAfter(compareDate, currentDate),
      };
    });

    return availability;
  }
}

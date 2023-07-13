import { EntityRepository, Raw, Repository } from 'typeorm';
import Appointment from '../entities/appointment.entity';
import { ICreateAppointmentDAO } from './dao/appointment';
import { IFindAllInDayFromProviderDAO } from './dao/find-all-in-day-from-provider.dao';
import { IFindAllInMonthFromProviderDAO } from './dao/find-all-in-month-from-provider.dao';
import { IFindByDateDAO } from './dao/find-by-date.dao';

@EntityRepository(Appointment)
export class AppointmentsRepository extends Repository<Appointment> {
  public async findByDate({
    date,
    provider_id,
  }: IFindByDateDAO): Promise<Appointment | undefined> {
    const findAppointment = await this.findOne({
      where: { date, provider_id },
    });
    return findAppointment;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDAO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.find({
      where: {
        provider_id,
        date: Raw(
          (dateFieldName) =>
            `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
        ),
      },
    });

    return appointments;
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDAO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');
    const parsedDay = String(day).padStart(2, '0');

    const appointments = await this.find({
      where: {
        provider_id,
        date: Raw(
          (dateFieldName) =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
      relations: ['user'],
    });

    return appointments;
  }

  public async createAppointment({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentDAO): Promise<Appointment> {
    const appointment = this.create({
      provider_id,
      user_id,
      date,
    });

    await this.save(appointment);

    return appointment;
  }
}

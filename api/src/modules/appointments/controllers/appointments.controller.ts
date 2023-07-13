import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { IsNumberString } from 'class-validator';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { CreateAppointmentService } from '../services/create-appointment.service';
import { ListProviderAppointmentsService } from '../services/list-provider-appointments.service';
import { CreateAppointmentDTO } from './dto/create-appointment.dto';

class DataQuery {
  @IsNumberString()
  month: number;

  @IsNumberString()
  day: number;

  @IsNumberString()
  year: number;
}

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(
    private readonly createAppointmentService: CreateAppointmentService,
    private readonly listProviderAppointments: ListProviderAppointmentsService,
  ) {}

  @Post()
  create(@Req() req, @Body() { date, provider_id }: CreateAppointmentDTO) {
    return this.createAppointmentService.execute({
      date,
      provider_id,
      user_id: req.user.id,
    });
  }

  @Get('me')
  me(@Req() req, @Query() { day, month, year }: DataQuery) {
    return this.listProviderAppointments.execute({
      provider_id: req.user.id,
      day,
      month,
      year,
    });
  }
}

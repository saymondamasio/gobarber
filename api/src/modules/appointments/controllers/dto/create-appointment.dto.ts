import { IsDateString, IsString, IsUUID } from 'class-validator';

export class CreateAppointmentDTO {
  @IsString()
  @IsUUID()
  provider_id: string;

  @IsDateString()
  date: Date;
}

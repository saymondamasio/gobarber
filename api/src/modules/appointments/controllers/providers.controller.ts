import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { IsNumberString, IsUUID } from 'class-validator';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { ListProviderDayAvailabilityService } from '../services/list-provider-day-availability.service';
import { ListProviderMonthAvailabilityService } from '../services/list-provider-month-availability.service';
import { ListProvidersService } from '../services/list-providers.service';

class DataQuery {
  @IsNumberString()
  month: number;

  @IsNumberString()
  year: number;
}

class FullDataQuery {
  @IsNumberString()
  month: number;

  @IsNumberString()
  day: number;

  @IsNumberString()
  year: number;
}

class ProviderParams {
  @IsUUID()
  provider_id: string;
}

@Controller('providers')
@UseGuards(JwtAuthGuard)
export class ProvidersController {
  constructor(
    private readonly listProvidersService: ListProvidersService,
    private readonly listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService,
    private readonly listProviderDayAvailabilityService: ListProviderDayAvailabilityService,
  ) {}

  @Get()
  findAll(@Req() req) {
    return this.listProvidersService.execute({ user_id: req.user.id });
  }

  @Get('/:provider_id/day-availability')
  findDaysAvailability(
    @Param() { provider_id }: ProviderParams,
    @Query() { month, year, day }: FullDataQuery,
  ) {
    return this.listProviderDayAvailabilityService.execute({
      provider_id,
      month,
      year,
      day,
    });
  }

  @Get('/:provider_id/month-availability')
  findMonthAvailability(
    @Param() { provider_id }: ProviderParams,
    @Query() { month, year }: DataQuery,
  ) {
    return this.listProviderMonthAvailabilityService.execute({
      provider_id,
      month,
      year,
    });
  }
}

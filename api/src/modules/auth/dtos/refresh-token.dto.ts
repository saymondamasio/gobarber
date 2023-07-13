import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDTO {
  @ApiProperty()
  token: string;
}

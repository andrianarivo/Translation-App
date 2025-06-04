import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ValidateLocale } from '../../validators/validate-locale';

export class UpdateContentDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsString()
  @ValidateLocale('locale', {
    message: 'Locale must be valid',
  })
  locale: string;
}

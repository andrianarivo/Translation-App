import { IsNotEmpty, IsString } from 'class-validator';
import { ValidateLocale } from '../../validators/validate-locale';

export class CreateContentDto {
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

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ValidateLocale } from '../../validators/validate-locale';

export class CreateContentDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsOptional()
  value?: string;

  @IsString()
  @ValidateLocale('locale', {
    message: 'Locale must be valid',
  })
  @IsOptional()
  locale: string;
}

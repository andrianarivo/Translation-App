import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ValidateLocale } from '../../validators/validate-locale';

export class UpdateContentDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  value?: string;

  @IsString()
  @ValidateLocale('locale', {
    message: 'Locale must be valid',
  })
  @IsOptional()
  locale?: string;
}

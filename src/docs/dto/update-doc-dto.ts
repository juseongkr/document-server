import { IsOptional } from 'class-validator';

export class UpdateDocDto {
  @IsOptional()
  title: string;

  @IsOptional()
  category: string;

  @IsOptional()
  description: string;
}

import { IsNotEmpty } from 'class-validator';

export class CreateDocDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  approvers: string[];
}

import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { DocStatus } from '../enum/doc-status.enum';

export class GetDocFilterDto {
  @IsOptional()
  @IsIn([DocStatus.IN_PROGRESS, DocStatus.APPROVED, DocStatus.REJECTED])
  status: DocStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;

  @IsOptional()
  @IsNotEmpty()
  category: string;
}

import { BadRequestException, PipeTransform } from '@nestjs/common';
import { DocStatus } from '../enum/doc-status.enum';

export class DocStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    DocStatus.IN_PROGRESS,
    DocStatus.APPROVED,
    DocStatus.REJECTED,
  ];

  private isStatusValid(status: any) {
    return this.allowedStatuses.indexOf(status) !== -1;
  }

  transform(value: any) {
    value = value.toUpperCase();
    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} is an invalid status`);
    }

    return value;
  }
}

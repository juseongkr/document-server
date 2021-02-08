import { BadRequestException, PipeTransform } from '@nestjs/common';
import { DocAction } from '../enum/doc-action.enum';

export class DocActionValidationPipe implements PipeTransform {
  readonly allowedActions = [DocAction.APPROVE, DocAction.REJECT];

  private isActionValid(action: any) {
    return this.allowedActions.indexOf(action) !== -1;
  }

  transform(value: any) {
    value = value.toUpperCase();
    if (!this.isActionValid(value)) {
      throw new BadRequestException(`${value} is an invalid status`);
    }

    return value;
  }
}

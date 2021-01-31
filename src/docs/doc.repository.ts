import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Approver } from '../approvers/approver.entity';
import { User } from '../auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Doc } from './doc.entity';
import { CreateDocDto } from './dto/create-doc.dto';
import { GetDocFilterDto } from './dto/get-doc-filter.dto';
import { DocAction } from './enum/doc-action.enum';
import { DocStatus } from './enum/doc-status.enum';

@EntityRepository(Doc)
export class DocRepository extends Repository<Doc> {
  private logger = new Logger('DocRepository');

  async getDocs(filterDto: GetDocFilterDto, user: User): Promise<Doc[]> {
    const { status, search, category } = filterDto;
    const query = this.createQueryBuilder('docs');

    if (status) {
      query.andWhere('docs.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(docs.title LIKE :search OR docs.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (category) {
      query.andWhere('docs.category = :category', { category });
    }

    try {
      const docs = await query.getMany();
      return docs;
    } catch (error) {
      this.logger.error(
        `Failed to get docs for user "${user.username}", Dto: ${JSON.stringify(
          filterDto,
        )}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async getOutbox(user: User): Promise<Doc[]> {
    const query = this.createQueryBuilder('docs');

    query.where('docs.status = :status and docs.userId = :userId', {
      status: DocStatus.IN_PROGRESS,
      userId: user.id,
    });

    try {
      const outboxes = await query.getMany();
      return outboxes;
    } catch (error) {
      this.logger.error(
        `Failed to get outbox for user "${user.username}"`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async getInbox(user: User): Promise<Doc[]> {
    const query = this.createQueryBuilder('docs');

    query.innerJoinAndSelect('docs.approvers', 'approvers');
    query.where('approvers.done = 0 and docs.status = :status', {
      status: DocStatus.IN_PROGRESS,
    });
    query.orderBy('approvers.priority');

    try {
      const inboxes = await query.getMany();
      return inboxes.filter(inbox => inbox.approvers[0].userId === user.id);
    } catch (error) {
      this.logger.error(
        `Failed to get inbox for user "${user.username}"`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async getArchive(user: User) {
    const query = this.createQueryBuilder('docs');

    query.leftJoinAndSelect('docs.approvers', 'approvers');
    query.where(
      'docs.status <> :status and (approvers.userId = :userId or docs.userId = :userId)',
      {
        status: DocStatus.IN_PROGRESS,
        userId: user.id,
      },
    );

    try {
      const archives = await query.getMany();
      archives.forEach(archive => delete archive.approvers);
      return archives;
    } catch (error) {
      this.logger.error(
        `Failed to get archive for user "${user.username}"`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createDoc(createDocDto: CreateDocDto, user: User): Promise<Doc> {
    const { title, description, category, approvers } = createDocDto;

    const doc = new Doc();
    doc.title = title;
    doc.category = category;
    doc.description = description;
    doc.status = DocStatus.IN_PROGRESS;
    doc.totalApprovers = approvers.length;
    doc.user = user;

    // fetch approvers parallel
    const users = approvers.map(async approver => {
      const query = User.createQueryBuilder('users');

      query.where('users.username = :username', { username: approver });
      try {
        return await query.getOneOrFail();
      } catch (error) {
        this.logger.error(
          `Failed to find approvers "${approver}"`,
          error.stack,
        );
        throw new NotFoundException(
          `Approver with username "${approver}" not found`,
        );
      }
    });

    const fetchedApprovers = [];
    for (const [pri, appUser] of users.entries()) {
      const approver = new Approver();
      approver.done = false;
      approver.priority = pri;
      approver.doc = doc;
      approver.user = await appUser;
      const found = await appUser;
      if (!found) {
        throw new NotFoundException(
          `Approver with username "${appUser}" not found`,
        );
      }
      fetchedApprovers.push(approver);
    }

    try {
      await doc.save();
      fetchedApprovers.map(async app => await app.save());
    } catch (error) {
      this.logger.error(
        `Failed to create a document for user "${
          user.username
        }", Dto: ${JSON.stringify(createDocDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

    delete doc.user;
    return doc;
  }

  async actionDocById(
    id: number,
    action: string,
    comment: string,
    user: User,
  ): Promise<Doc> {
    const inboxes = await this.getInbox(user);

    const found = inboxes.find(
      doc => doc.id === id && doc.status === DocStatus.IN_PROGRESS,
    );
    if (!found) {
      throw new NotFoundException();
    }

    if (found.approvers[0].userId !== user.id) {
      throw new UnauthorizedException();
    }

    found.approvers[0].done = true;
    found.approvers[0].comment = comment;
    if (action === DocAction.APPROVE) {
      if (found.totalApprovers === found.approvers[0].priority + 1) {
        found.status = DocStatus.APPROVED;
      }
    } else if (action === DocAction.REJECT) {
      found.status = DocStatus.REJECTED;
    }

    try {
      await found.approvers[0].save();
      delete found.approvers;
      await found.save();

      return found;
    } catch (error) {
      this.logger.error(
        `Failed to document action for user "${user.username}", Action: ${action}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}

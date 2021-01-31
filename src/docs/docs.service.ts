import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { Doc } from './doc.entity';
import { DocRepository } from './doc.repository';
import { CreateDocDto } from './dto/create-doc.dto';
import { GetDocFilterDto } from './dto/get-doc-filter.dto';
import { UpdateDocDto } from './dto/update-doc-dto';

@Injectable()
export class DocsService {
  constructor(
    @InjectRepository(DocRepository)
    private docRepository: DocRepository,
  ) {}

  async getDocs(filterDto: GetDocFilterDto, user: User): Promise<Doc[]> {
    return this.docRepository.getDocs(filterDto, user);
  }

  async getDocById(id: number, _user: User): Promise<Doc> {
    const found = await this.docRepository.findOne({
      where: { id },
    });

    if (!found) {
      throw new NotFoundException(`Doc with ID "${id}" not found`);
    }

    return found;
  }

  async getOutbox(user: User): Promise<Doc[]> {
    return this.docRepository.getOutbox(user);
  }

  async getInbox(user: User): Promise<Doc[]> {
    return this.docRepository.getInbox(user);
  }

  async getArchive(user: User): Promise<Doc[]> {
    return this.docRepository.getArchive(user);
  }

  async createDoc(createDocDto: CreateDocDto, user: User): Promise<Doc> {
    return this.docRepository.createDoc(createDocDto, user);
  }

  async deleteDocById(id: number, user: User): Promise<void> {
    const result = await this.docRepository.delete({ id, userId: user.id });

    if (result.affected === 0) {
      throw new NotFoundException(`Doc with ID "${id}" not found`);
    }
  }

  async updateDocById(
    id: number,
    updateDocDto: UpdateDocDto,
    user: User,
  ): Promise<Doc> {
    const { title, category, description } = updateDocDto;
    const doc = await this.getDocById(id, user);

    if (doc.userId !== user.id) {
      throw new UnauthorizedException(
        `unauthorized to update document ID "${id}"`,
      );
    }

    doc.title = title;
    doc.category = category;
    doc.description = description;

    await doc.save();
    return doc;
  }

  async actionDocById(
    id: number,
    action: string,
    comment: string,
    user: User,
  ): Promise<Doc> {
    return this.docRepository.actionDocById(id, action, comment, user);
  }
}

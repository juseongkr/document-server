import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { Doc } from './doc.entity';
import { DocsService } from './docs.service';
import { CreateDocDto } from './dto/create-doc.dto';
import { GetDocFilterDto } from './dto/get-doc-filter.dto';
import { UpdateDocDto } from './dto/update-doc-dto';
import { DocActionValidationPipe } from './pipes/doc-action-validation.pipe';

@Controller('docs')
@UseGuards(AuthGuard())
export class DocsController {
  private logger = new Logger('DocsController');

  constructor(private docsService: DocsService) {}

  @Get()
  getDocs(
    @Query(ValidationPipe)
    filterDto: GetDocFilterDto,
    @GetUser()
    user: User,
  ): Promise<Doc[]> {
    this.logger.verbose(
      `User "${user.username}" retrieving all docs. Filter: ${JSON.stringify(
        filterDto,
      )}`,
    );
    return this.docsService.getDocs(filterDto, user);
  }

  @Get('/outbox')
  getOutbox(
    @GetUser()
    user: User,
  ): Promise<Doc[]> {
    this.logger.verbose(`User "${user.username}" retrieving outbox.`);

    return this.docsService.getOutbox(user);
  }

  @Get('/inbox')
  getInbox(
    @GetUser()
    user: User,
  ): Promise<Doc[]> {
    this.logger.verbose(`User "${user.username}" retrieving inbox.`);
    return this.docsService.getInbox(user);
  }

  @Get('/archive')
  getArchive(
    @GetUser()
    user: User,
  ): Promise<Doc[]> {
    this.logger.verbose(`User "${user.username}" retrieving archive.`);
    return this.docsService.getArchive(user);
  }

  @Get('/id/:id')
  getDocById(
    @Param('id', ParseIntPipe)
    id: number,
    @GetUser()
    user: User,
  ): Promise<Doc> {
    return this.docsService.getDocById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createDoc(
    @Body()
    createDocDto: CreateDocDto,
    @GetUser()
    user: User,
  ): Promise<Doc> {
    this.logger.verbose(
      `User "${user.username}" creating a new document. Data: "${JSON.stringify(
        createDocDto,
      )}"`,
    );
    return this.docsService.createDoc(createDocDto, user);
  }

  @Patch('/id/:id')
  updateDocById(
    @Param('id', ParseIntPipe)
    id: number,
    @Body()
    updateDocDto: UpdateDocDto,
    @GetUser()
    user: User,
  ): Promise<Doc> {
    this.logger.verbose(
      `User "${
        user.username
      }" updating a document information. Data: "${JSON.stringify(
        updateDocDto,
      )}"`,
    );
    return this.docsService.updateDocById(id, updateDocDto, user);
  }

  @Delete('/id/:id')
  deleteDocById(
    @Param('id', ParseIntPipe)
    id: number,
    @GetUser()
    user: User,
  ): Promise<void> {
    this.logger.verbose(
      `User "${user.username}" deleting a document with ID "${id}"`,
    );
    return this.docsService.deleteDocById(id, user);
  }

  @Patch('/inbox/id/:id')
  actionDocById(
    @Param('id', ParseIntPipe)
    id: number,
    @Body('action', DocActionValidationPipe)
    action: string,
    @Body('comment')
    comment: string,
    @GetUser()
    user: User,
  ): Promise<Doc> {
    this.logger.verbose(
      `User "${user.username}" action to document with ID "${id}". Action: "${action}", Comment: "${comment}`,
    );
    return this.docsService.actionDocById(id, action, comment, user);
  }
}

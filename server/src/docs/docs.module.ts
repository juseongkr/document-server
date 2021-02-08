import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { DocRepository } from './doc.repository';
import { DocsController } from './docs.controller';
import { DocsService } from './docs.service';

@Module({
  imports: [TypeOrmModule.forFeature([DocRepository]), AuthModule],
  controllers: [DocsController],
  providers: [DocsService],
})
export class DocsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { DocsModule } from './docs/docs.module';
import { ApproversModule } from './approvers/approvers.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    DocsModule,
    ApproversModule,
  ],
})
export class AppModule {}

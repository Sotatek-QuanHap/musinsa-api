/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './database/config/database.config';
import authConfig from './auth/config/auth.config';
import appConfig from './config/app.config';
import { ConfigModule } from '@nestjs/config';
import { HomeModule } from './home/home.module';
import { SessionModule } from './session/session.module';
// import { MailerModule } from './mailer/mailer.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './database/mongoose-config.service';
import { CronModule } from './cron/cron.module';
import { ScheduleModule } from '@nestjs/schedule';
import { KafkaModule } from './kafka/kafka.module';
import { DatabaseModule } from './database/database.module';
import { OliveYoungModule } from './oliveyoung/module';
import { ConfigSynchronizerModule } from './oliveyoung/config-synchronizer/config-synchronizer.module';

const infrastructureDatabaseModule = MongooseModule.forRootAsync({
  useClass: MongooseConfigService,
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig, appConfig],
      envFilePath: ['.env'],
    }),
    ScheduleModule.forRoot(),
    infrastructureDatabaseModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    SessionModule,
    HomeModule,
    CronModule,
    KafkaModule,
    OliveYoungModule,
    ConfigSynchronizerModule,
  ],
})
export class AppModule {}

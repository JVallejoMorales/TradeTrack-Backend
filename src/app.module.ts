// src/app.module.ts
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MailerModule } from "@nestjs-modules/mailer";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./modules/users/users.module";
import { mailConfig } from "./config/mail.config";
import { TripsModule } from "./modules/trips/trips.module";
import { ProviderModule } from "./modules/providers/providers.module";
import { ProductsModule } from "./products/products.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { AuthModule } from "./modules/auth/auth.module";
import { FileUploadModule } from "./modules/file-upload/file-upload.module";
import { NotificationsGateway } from "./modules/notifications/notifications.gateway";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { SubscriptionsModule } from "./modules/subscriptions/subscriptions.module";
import databaseConfig from "./config/database.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env.development",
      load: [databaseConfig],
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get("typeorm")!,
    }),

    MailerModule.forRoot(mailConfig),

    UsersModule,
    TripsModule,
    ProviderModule,
    ProductsModule,
    AuthModule,
    PaymentsModule,
    SubscriptionsModule,
    FileUploadModule,
    FileUploadModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService, NotificationsGateway],
})
export class AppModule {}

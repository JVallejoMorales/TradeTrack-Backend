import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./modules/users/users.module";
import { databaseConfig } from "./config/database.config";
import { TripsModule } from "./modules/trips/trips.module";
import { ProviderModule } from "./modules/providers/providers.module";
import { ProductsModule } from "./products/products.module";
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    // Configuración de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.production',
    }),

    // Configuración de base de datos
    TypeOrmModule.forRoot(databaseConfig),

    // Configuración dinámica de email
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get<string>('MAIL_HOST');
        const port = configService.get<number>('MAIL_PORT');
        const secure = configService.get<string>('MAIL_SECURE') === 'true';
        const user = configService.get<string>('MAIL_USER');
        const pass = configService.get<string>('MAIL_PASS');
        const from = configService.get<string>('MAIL_FROM');

        console.log('Configuración Mailer:');
        console.log({ host, port, secure, user, pass: pass ? '****' : undefined, from });

        if (!host || !port || !user || !pass) {
          throw new Error('Faltan variables de entorno necesarias para configurar el Mailer.');
        }

        return {
          transport: {
            host,
            port,
            secure,
            auth: {
              user,
              pass,
            },
          },
          defaults: {
            from: `"No Reply" <${from}>`,
          },
          template: {
            dir: './templates/email',
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),

    // Módulos de la aplicación
    UsersModule,
    TripsModule,
    ProviderModule,
    ProductsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

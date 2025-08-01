import { registerAs } from "@nestjs/config";
import { config as dotenvconfig } from "dotenv";
import { DataSource, DataSourceOptions } from "typeorm";

dotenvconfig({ path: ".env.development" });

const config = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dropSchema: true,
  synchronize: true,
  autoLoadEntities: true,
  entities: ["dist/**/*.entity{.ts}"],
  migrations: ["dist/migrations/*{.ts,.js}"],
};

export default registerAs("typeorm", () => config);

export const connectionSource = new DataSource(config as DataSourceOptions);

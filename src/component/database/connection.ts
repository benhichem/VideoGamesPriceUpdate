import { DataSource } from "typeorm";
import { Product } from "./product"

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [Product]
})



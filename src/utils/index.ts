import { AppDataSource, Product } from "../component/database";
import { json2csv } from "json-2-csv";
import fs from "node:fs"
(async () => {
  const connection = await AppDataSource.initialize().then((datasource) => {
    return datasource
  }).catch((error) => {
    throw error
  })
  let producsts = await connection.manager.find(Product)
  let file_string = json2csv(producsts)
  fs.writeFileSync('databasePrinted.csv', file_string)
})()

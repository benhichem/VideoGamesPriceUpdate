import { DataSource } from "typeorm";
import { ScrapingVideoGames, ProductType } from "./component";
import { AppDataSource, Product } from "./component/database";


const links = [
  // {
  //   name: "nintendo",
  //   link: "https://www.argos.co.uk/search/video-game/category:50000325/"
  // },
  {
    name: "ps5",
    link: "https://www.argos.co.uk/search/video-game/category:50002574/"
  },
  // {
  //   name: "xbox_series",
  //   link: "https://www.argos.co.uk/search/video-game/category:50002569/"
  // },
  // {
  //   name: "ps4",
  //   link: "https://www.argos.co.uk/search/video-game/category:37328859/"
  // }
];
async function savetodb(products: Array<ProductType>, connection: DataSource) {
  console.log(products.length)
  const UpdatedPrices: Array<ProductType> = []
  for (let index = 0; index < products.length; index++) {
    const element = products[index];
    console.log(element)
    // we check if he is in the database 
    let product_exists = await connection.manager.findOneBy(Product, { product_url: element.product_url! })
    console.log(product_exists)
    if (product_exists === null) {
      const product = new Product()
      product.product_url = element.product_url!;
      product.product_current_price = element.product_current_price!;
      product.product_name = element.product_name!;
      product.product_rating = element.product_rating!
      product.product_old_price = "null"
      product.updated_at = Date.now()
      let x = await connection.manager.save(product)
      UpdatedPrices.push(x)
    } else if (product_exists) {
      console.log('[+] element Exists in Database checking prices ...')
      const databaseItemPrice = product_exists.product_current_price
      if (element.product_current_price !== databaseItemPrice) {
        console.log('Product Updated Price ...')
        product_exists.product_old_price = databaseItemPrice
        product_exists.product_current_price = element.product_current_price!
        product_exists.product_url = element.product_url!
        product_exists.product_rating = element.product_rating!
        const product_save_update = await connection.manager.save(Product, product_exists)
        console.log(product_save_update)
        UpdatedPrices.push(product_exists)
      }
    }

  }
  return UpdatedPrices
}
function getCurrentDateTime() {
  const now = new Date();
  
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  
  return `${day}-${month}-${year}-${hour}-${minute}`;
}
import { json2csv } from "json-2-csv"
import fs from "node:fs"
(async () => {

  const Connection = await AppDataSource.initialize()
    .then((datasource) => {
      return datasource
    }).catch((error) => {
      console.log(error)
      throw new Error('Failed To Connect to database ...')
    })

  for (let index = 0; index < links.length; index++) {
    const element = links[index];
    let products: Array<ProductType> = await ScrapingVideoGames(element)
    if (products !== null)
      console.log('Starting Database Saving')
    // products[0]
    // console.log(products[0])
    // products[0].product_current_price = "£12.99"
    // console.log(products[0])
    let updatedPrices = await savetodb(products!, Connection)
    let fileString = json2csv(updatedPrices)
    fs.writeFileSync(`updated_${element.name}_${getCurrentDateTime()}.csv`, fileString)
  }
})()


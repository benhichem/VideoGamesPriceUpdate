import puppeteer from "puppeteer-extra"
import StealthPlugin from "puppeteer-extra-plugin-stealth"


export type ProductType = {
  product_name: string | null;
  product_rating: string | null;
  product_current_price: string | null
  product_url: string | null;
}

puppeteer.use(StealthPlugin())
export async function ScrapingVideoGames(link: { name: string; link: string }): Promise<Array<ProductType>> {

  try {
    const browser = await puppeteer.launch({
      headless: false,
      userDataDir: "profile2"
    })
    const page = await browser.newPage()
    await page.setViewport({
      height: 900,
      width: 1600
    })

    await page.goto(link.link, { timeout: 0, waitUntil: "networkidle2" })
    let numOfPages = await page.evaluate(() => {
      let numofPage = (document.querySelectorAll('a[role="link"]')[document.querySelectorAll('a[role="link"]').length - 2] as HTMLAnchorElement).innerText
      return eval(numofPage)
    })

    console.log(numOfPages)
    const total_producsts:Array<ProductType> = []
    for (let index = 1; index <= numOfPages; index++) {
      try {
        await page.goto(`${link.link}/opt/page:${index}`, { timeout: 0, waitUntil: "networkidle2" })
        let products = await page.evaluate(() => {
          const items = Array.from(document.querySelectorAll('div.styles__LazyHydrateCard-sc-1rzb1sn-0')).map((item) => {
            return {
              product_name: item.querySelector('div[data-test="component-product-card-title"]') ?
                (item.querySelector('div[data-test="component-product-card-title"]') as HTMLDivElement).innerText :
                "",
              product_rating: item.querySelector('div[data-star-rating]')
                ? (item.querySelector('div[data-star-rating]') as HTMLDivElement).innerText
                : "",
              product_current_price: item.querySelector('div[data-test="component-product-card-price"]') ?
                (item.querySelector('div[data-test="component-product-card-price"]') as HTMLDivElement).innerText :
                "",
              product_url: item.querySelector('a[data-test="component-product-card-title-link"]') ?
                ((item.querySelector('a[data-test="component-product-card-title-link"]') as HTMLAnchorElement).href).split('?')[0]
                : ""
            }
          })
          return items
        })
        products.map((item) => {
          total_producsts.push(item)
        })

      } catch (error) {
        console.log(error)
        console.log(`failed to load this ${link.link}`)
        return [] as Array<ProductType>
      }
    }
    return total_producsts
  } catch (error) {
    console.log(error)
    return []
  }
}

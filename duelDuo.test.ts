
import { Builder, Capabilities, By, locateWith } from "selenium-webdriver"

require('chromedriver')

const driver = new Builder().withCapabilities(Capabilities.chrome()).build()

beforeEach(async () => {
    await driver.get('http://localhost:3000/')
   
  driver.sleep(2000)
  
})

afterAll(async () => {
    await driver.quit()
})

test('Title shows up when page loads', async () => {
    const title = await driver.findElement(By.id('title'))
    const displayed = await title.isDisplayed()
    expect(displayed).toBe(true)
})

test (`Check that clicking the Draw button displays the div with id = “choices"`, async ()=>{
    await driver.findElement(By.id("draw")).click()
    let displayed = await driver.findElement(By.id('choices')).isDisplayed()
    await driver.sleep(2000)
    expect(displayed).toBeTruthy()
})


test (`Check that clicking draw Button the bot cards appears`, async ()=>{

    
    // Get element with id choices 
    let choiceEl = await driver.findElement(By.id('choices'))
    // get the all the child elements with Div
    let choseBotCards = await choiceEl.findElements(By.xpath('//div'))

   
    // console.log(choseBotCards.length);
    
    expect(choseBotCards.length).toBeGreaterThan(0)

    await driver.sleep(2000)
})

test (`Check that clicking the See All Bots button displays the div with id = “all-bots"`, async ()=>{
    await driver.findElement(By.id("see-all")).click()
    let displayed = await driver.findElement(By.id('all-bots')).isDisplayed()
    await driver.sleep(2000)
    expect(displayed).toBeTruthy()
})
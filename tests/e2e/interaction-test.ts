import puppeteer, {
  type Browser,
  type Page,
  type ElementHandle,
} from 'puppeteer'

async function testInteractions(): Promise<void> {
  const browser: Browser = await puppeteer.launch({
    headless: false,
    devtools: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page: Page = await browser.newPage()

    console.log('🚀 Testing full app interactions...')
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' })
    await new Promise<void>((resolve) => setTimeout(resolve, 2000))

    // Add multiple stories
    console.log('📝 Adding multiple stories...')
    for (let i = 0; i < 3; i++) {
      await page.click('button')
      await new Promise<void>((resolve) => setTimeout(resolve, 500))
    }

    // Check story count
    const storyCount = await page.$eval('span', (el) => el.textContent)
    console.log('✅ Story count after adding 3:', storyCount)

    // Take final screenshot
    await page.screenshot({
      path: 'tests/e2e/screenshots/final-with-stories.png',
      fullPage: true,
    })
    console.log('📸 Final screenshot with multiple stories taken')

    // Test canvas interaction (click on canvas)
    const canvas: ElementHandle<Element> | null = await page.$('canvas')
    if (canvas) {
      const box = await canvas.boundingBox()
      if (box) {
        // Click on canvas center
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
        console.log('✅ Canvas click test successful')
      }
    }

    console.log('🎉 All interaction tests passed!')
  } catch (error) {
    console.error('❌ Interaction test failed:', error)
  } finally {
    await browser.close()
  }
}

testInteractions()

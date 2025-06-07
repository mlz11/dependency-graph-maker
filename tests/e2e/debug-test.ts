import puppeteer, {
  type Browser,
  type Page,
  type ConsoleMessage,
} from 'puppeteer'

async function debugApp(): Promise<void> {
  const browser: Browser = await puppeteer.launch({
    headless: false,
    devtools: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page: Page = await browser.newPage()

    // Listen to console logs from the page
    page.on('console', (msg: ConsoleMessage) => {
      console.log('PAGE LOG:', msg.text())
    })

    page.on('pageerror', (error: Error) => {
      console.log('PAGE ERROR:', error.message)
    })

    // Navigate to the app
    console.log('🚀 Navigating to http://localhost:5173/')
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' })

    // Wait for page to load
    await new Promise<void>((resolve) => setTimeout(resolve, 3000))

    // Get page content
    const content: string = await page.content()
    console.log('📄 Page HTML (first 500 chars):')
    console.log(content.substring(0, 500))

    // Check what's in the body
    const bodyContent = await page.evaluate((): string => {
      return document.body ? document.body.innerHTML : 'No body found'
    })
    console.log('📦 Body content (first 300 chars):')
    console.log(bodyContent.substring(0, 300))

    // Check for any elements
    const allElements = await page.evaluate((): string[] => {
      return Array.from(document.querySelectorAll('*'))
        .map((el) => el.tagName)
        .slice(0, 10)
    })
    console.log('🏷️ First 10 elements found:', allElements)

    // Take a screenshot
    await page.screenshot({
      path: 'tests/e2e/screenshots/debug.png',
      fullPage: true,
    })
    console.log('📸 Debug screenshot taken')

    // Keep browser open for manual inspection
    console.log('🔍 Browser will stay open for 30 seconds for inspection...')
    await new Promise<void>((resolve) => setTimeout(resolve, 30000))
  } catch (error) {
    console.error('❌ Debug failed:', error)
  } finally {
    await browser.close()
  }
}

debugApp()

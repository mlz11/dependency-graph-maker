import puppeteer from 'puppeteer'

async function testApp() {
  const browser = await puppeteer.launch({ 
    headless: false,
    devtools: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  
  try {
    const page = await browser.newPage()
    
    // Navigate to the app
    console.log('🚀 Navigating to http://localhost:5173/')
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' })
    
    // Wait for app to load
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Take screenshot of initial state
    await page.screenshot({ path: 'tests/e2e/screenshots/initial.png', fullPage: true })
    console.log('📸 Initial screenshot taken')
    
    // Check if title is visible
    const title = await page.$('h1')
    if (title) {
      const titleText = await page.evaluate(el => el.textContent, title)
      console.log('✅ Title found:', titleText)
    } else {
      console.log('❌ Title not found')
    }
    
    // Check for Add Sample Story button
    const button = await page.$('button')
    if (button) {
      const buttonText = await page.evaluate(el => el.textContent, button)
      console.log('✅ Button found:', buttonText)
      
      // Click the button to add a story
      await button.click()
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Take screenshot after adding story
      await page.screenshot({ path: 'tests/e2e/screenshots/after-add-story.png', fullPage: true })
      console.log('📸 Screenshot after adding story taken')
      
      // Check if story count updated
      const storyCount = await page.$eval('span', el => el.textContent)
      console.log('📊 Story count:', storyCount)
      
    } else {
      console.log('❌ Button not found')
    }
    
    // Check for canvas
    const canvas = await page.$('canvas')
    if (canvas) {
      console.log('✅ Canvas found')
    } else {
      console.log('❌ Canvas not found')
    }
    
    // Check for any console errors
    const logs = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        logs.push(`Console Error: ${msg.text()}`)
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (logs.length > 0) {
      console.log('❌ Console errors found:')
      logs.forEach(log => console.log(log))
    } else {
      console.log('✅ No console errors found')
    }
    
    console.log('🎉 Test completed')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await browser.close()
  }
}

testApp()
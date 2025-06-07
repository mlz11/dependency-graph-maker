import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function runE2ETests() {
  console.log('🎭 Running E2E tests...')

  const testFiles = [
    path.join(__dirname, 'app-test.js'),
    path.join(__dirname, 'interaction-test.js'),
  ]

  for (const testFile of testFiles) {
    console.log(`Running ${path.basename(testFile)}...`)

    try {
      await new Promise((resolve, reject) => {
        const child = spawn('node', [testFile], {
          stdio: 'inherit',
          cwd: process.cwd(),
        })

        child.on('close', (code) => {
          if (code === 0) {
            resolve()
          } else {
            reject(new Error(`Test ${testFile} failed with code ${code}`))
          }
        })

        child.on('error', reject)
      })
    } catch (error) {
      console.error(`❌ E2E test failed: ${testFile}`)
      process.exit(1)
    }
  }

  console.log('✅ All E2E tests passed!')
}

runE2ETests().catch((error) => {
  console.error('❌ E2E test runner failed:', error.message)
  process.exit(1)
})

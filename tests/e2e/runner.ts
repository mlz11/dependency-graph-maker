import { spawn, type ChildProcess } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function runE2ETests(): Promise<void> {
  console.log('🎭 Running E2E tests...')

  const testFiles: string[] = [
    path.join(__dirname, 'app-test.ts'),
    path.join(__dirname, 'interaction-test.ts'),
  ]

  for (const testFile of testFiles) {
    console.log(`Running ${path.basename(testFile)}...`)

    try {
      await new Promise<void>((resolve, reject) => {
        const child: ChildProcess = spawn('npx', ['tsx', testFile], {
          stdio: 'inherit',
          cwd: process.cwd(),
        })

        child.on('close', (code: number | null) => {
          if (code === 0) {
            resolve()
          } else {
            reject(new Error(`Test ${testFile} failed with code ${code}`))
          }
        })

        child.on('error', reject)
      })
    } catch (error) {
      console.error(`❌ E2E test failed: ${testFile}`, error)
      process.exit(1)
    }
  }

  console.log('✅ All E2E tests passed!')
}

runE2ETests().catch((error: Error) => {
  console.error('❌ E2E test runner failed:', error.message)
  process.exit(1)
})

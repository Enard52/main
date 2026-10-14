import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'

const CLI = resolve(__dirname, '../dist/cli.js')
const PKG_VERSION = JSON.parse(
  readFileSync(resolve(__dirname, '../package.json'), 'utf-8'),
).version as string

function runCli(args: string): { stdout: string; exitCode: number } {
  try {
    const stdout = execSync(`node "${CLI}" ${args}`, { encoding: 'utf-8' })
    return { stdout: stdout.trim(), exitCode: 0 }
  } catch (err: unknown) {
    const e = err as { stdout?: string; status?: number }
    return { stdout: (e.stdout ?? '').trim(), exitCode: e.status ?? 1 }
  }
}

describe('--version flag', () => {
  it('prints the semver from package.json and exits 0 with --version', () => {
    const { stdout, exitCode } = runCli('--version')
    expect(exitCode).toBe(0)
    expect(stdout).toBe(PKG_VERSION)
  })

  it('prints the semver from package.json and exits 0 with version command', () => {
    const { stdout, exitCode } = runCli('version')
    expect(exitCode).toBe(0)
    expect(stdout).toBe(PKG_VERSION)
  })

  it('prints the semver from package.json and exits 0 with -v', () => {
    const { stdout, exitCode } = runCli('-v')
    expect(exitCode).toBe(0)
    expect(stdout).toBe(PKG_VERSION)
  })

  it('help text includes --version flag', () => {
    const { stdout } = runCli('help')
    expect(stdout).toContain('--version')
  })
})

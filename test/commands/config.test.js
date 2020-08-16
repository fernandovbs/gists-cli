const {expect, test} = require('@oclif/test')
const ConfigCommand = require('../../src/commands/config')
const inquirer = require('inquirer')
const fs = require('fs')
const configInst = new ConfigCommand()

describe('It should print config file content', () => {
  test
  .stub(inquirer, 'prompt', async () => ({token: 'd4585a0g5aaa19af698fec5ec50eca25352f0d7f'}))
  .stub(fs, 'writeFile', () => configInst.log('{"token": "d4585a0g5aaa19af698fec5ec50eca25352f0d7f"}'))
  .stdout()
  .command(['config'])
  .do(ctx => {
    expect(ctx.stdout).to.contain('{"token": "d4585a0g5aaa19af698fec5ec50eca25352f0d7f"}')
  })
  .it()
})

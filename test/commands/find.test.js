const {expect, test} = require('@oclif/test')
const inquirer = require('inquirer')
const gistsData = require('../stub/gists.json')
const gistData = require('../stub/gist.json')

describe('It should search for gists', () => {
  test
  .nock('https://api.github.com', api => api
  .get('/gists')
  .query(true)
  .reply(200, gistsData)
  )
  .nock('https://api.github.com', api => api
  .get('/gists/aa5a315d61ae9438b18d')
  .query(true)
  .reply(200, gistData)
  )
  .stub(inquirer, 'prompt', async () => ({gistId: 'aa5a315d61ae9438b18d'}))
  .stdout()
  .command(['find', 'Hello'])
  .do(ctx => {
    expect(ctx.stdout).to.contain('class HelloWorld\n   def initialize(name)\n      @name = name.capitalize\n   end\n')
  })
  .it()
})

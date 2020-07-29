const {Command} = require('@oclif/command')
const inquirer = require('inquirer')
const fs = require('fs')

const homedir = require('os').homedir()

class ConfigCommand extends Command {
  async run() {

    inquirer
    .prompt([
      {
        type: 'input',
        name: 'token',
        message: `Please, go to https://github.com/settings/tokens/new and generate a Personal access token
        with gists privilege and past it here:
        `,
      }      
    ])
    .then( ({token}) => {
      fs.writeFile(`${homedir}/.gists-cli.json`,`{"token": "${token}"}`, (err) => {
        if (err) {
          throw err 
        }
        this.log(`Done!`)
      })      
    })
    .catch(error => {
      if(error.isTtyError) {
        this.error("couldn't be rendered in the current environment")
      } else {
        this.error("Something whent wrong")
      }
    })
  }
}

ConfigCommand.description = `Set auth information
...
Generates .gists-cli.json to store the access token.
`

module.exports = ConfigCommand

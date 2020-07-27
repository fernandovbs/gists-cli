const {Command, flags, args} = require('@oclif/command')
const {cli} = require('cli-ux')
const chalk = require('chalk')
const inquirer = require('inquirer')
const fs = require('fs')
const Gists = require('gists')
const homedir = require('os').homedir()

class FindCommand extends Command {
  static args = [
    {name: 'search'},
  ]
    
  async run() {
    const {args, flags} = this.parse(FindCommand)
    
    try {
      cli.action.start('Searching gists...')
      
      const gistsClient = new Gists({ token: this.getToken() });
      const {pages} = await gistsClient.all()
      const [gistsResponseBody] = pages
      const {body:gists} = gistsResponseBody

      const {search = ''} = args
      const {action = 'print'} = flags
  
      const options = gists.filter(gist => this.gistIncludes(gist, search)).map(gist => {
        return {name: gist.description, value: gist.id}
      })

      cli.action.stop()

      const {gistId} = await inquirer
      .prompt([
        {
          type: 'list',
          name: 'gistId',
          message: `What gist do you want to ${action}?`,
          choices: options
        }
      ])
      
      cli.action.start('Getting gist data...')
      
      const {body: gist} = await gistsClient.get(gistId)
      
      cli.action.stop()
      
      if (action === 'edit') {
        const {file} =  Object.keys(gist.files).length > 1 ?
          await inquirer
          .prompt([
            {
              type: 'list',
              name: 'file',
              message: `What file you want to edit?`,
              choices: Object.keys(gist.files).map(key => {
                return {name: gist.files[key].filename, value: gist.files[key]}
              })
            }
          ]) : {file: gist.files[Object.keys(gist.files)[0]]}

        const editedGist = await inquirer.prompt({
          type: 'editor',
          name: 'content',
          default:`${file.content}`,
          message: 'Edit'
        })

        this.log(editedGist)  
      
      } else {
       
        this.log(chalk`
{bgWhite.red.bold Description: }{bgWhite.black.bold ${gist.description} }
{bgWhite.red.bold Files                            }${Object.keys(gist.files).map(key => chalk`
{bgWhite.red.bold Name: }{bgWhite.black.bold ${gist.files[key].filename || 'Not provided '} }
{bgWhite.red.bold Content: 
}{bgWhite.black.bold ${gist.files[key].content}  }
{bgYellow                                                                      }`).join(' ')}
        `)
      }

      //const options = { description:'', files: { 'readme.md': { content: fs.readFileSync('README.md', 'utf8') } } };
                
    } catch (e) {
      this.error(e)
    }
  }

  getToken() {
    try {
        const data = fs.readFileSync(`${homedir}/.gists-cli.json`);
        return JSON.parse(data.toString()).token
    } catch (err) {
        this.error(err);
    }
  }
  
  gistIncludes(gist, search) {
    const files = Object.keys(gist.files)

    return (gist.description.includes(search) ||
    files.some(fileName => fileName.includes(search)))
  }
}

FindCommand.description = `List gists based on a search string
...
Prints or edits gists. Options available are print (DEFAULT) and edit.
Ex: 
gists find search_string 
gists find search_string --action=edit
When --action=edit you will be prompted to choose the file do edit (if more then one found), and the program will attemp to open the default editor 
`
FindCommand.args = {
  search: args.string({char: 'a', description: 'String to search for. Searchs for description and file names.'}),
}
FindCommand.flags = {
  action: flags.string({char: 'a', description: 'Action to take for the selected gist.'}),
}

module.exports = FindCommand

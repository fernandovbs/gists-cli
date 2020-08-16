const {Command, flags} = require('@oclif/command')
const fs = require('fs')
const {cli} = require('cli-ux')
const inquirer = require('inquirer')
const Gists = require('gists')
const chalk = require('chalk')

const homedir = require('os').homedir()

class FindCommand extends Command {
  static args = [
    {
      name: 'search',
      description: 'String to search for. Searchs for description and file names.',
    },
  ]

  async run() {
    const {args, flags} = this.parse(FindCommand)

    try {
      cli.action.start('Searching gists...')

      const gistsClient = new Gists({token: this.getToken()})

      const {pages} = await gistsClient.all()
      const [gistsResponseBody] = pages
      const {body: gists} = gistsResponseBody

      const {search = ''} = args
      const {action = 'print'} = flags

      const options = this.getListOptions(gists, search)

      if (options.length === 0) {
        cli.action.stop()
        this.log(`No gists found. You searched for "${search}"`)
        this.exit()
      }

      cli.action.stop()

      const {gistId} = await inquirer
      .prompt([
        {
          type: 'list',
          name: 'gistId',
          message: `What gist do you want to ${action}?`,
          choices: options,
        },
      ])

      cli.action.start('Getting gist data...')

      const {body: gist} = await gistsClient.get(gistId)

      cli.action.stop()

      if (action === 'edit') {
        const {description} = await inquirer
        .prompt([
          {
            type: 'input',
            name: 'description',
            message: 'New description:',
            default: gist.description,
          },
        ])

        if (Object.keys(gist.files).length === 0) {
          this.error('This gist do not contain any file!')
        }

        const {file} =  Object.keys(gist.files).length > 1 ?
          await inquirer
          .prompt([
            {
              type: 'list',
              name: 'file',
              message: 'What file you want to edit?',
              choices: Object.keys(gist.files).map(key =>
                ({name: gist.files[key].filename, value: gist.files[key]})
              ),
            },
          ]) : {file: gist.files[Object.keys(gist.files)[0]]}

        const {content} = await inquirer.prompt({
          type: 'editor',
          name: 'content',
          default: `${file.content}`,
          message: 'Edit',
        })

        if (description !== gist.description || content !== file.content) {
          cli.action.start('Updating gist...')

          await gistsClient.edit(gistId, {
            description,
            files: {...gist.files, [file.filename]: {...gist.files[file.filename], content}},
          })

          cli.action.stop()
          this.log('Done!')
        } else {
          this.log('Nothing to update!')
        }
      } else {
        this.printGist(gist)
      }

      this.exit()
    } catch (error) {
      this.error(error)
    }
  }

  getToken() {
    try {
      const data = fs.readFileSync(`${homedir}/.gists-cli.json`)
      return JSON.parse(data.toString()).token
    } catch (error) {
      this.error(error)
    }
  }

  getListOptions(gists, search) {
    return gists.filter(gist => this.gistIncludes(gist, search)).map(gist =>
      ({name: gist.description, value: gist.id})
    )
  }

  gistIncludes(gist, search) {
    const files = Object.keys(gist.files)

    return (gist.description.includes(search) ||
    files.some(fileName => fileName.includes(search)))
  }

  printGist(gist) {
    const filesList = Object.keys(gist.files).map(key => chalk`
{bgWhite.red.bold Name: }{bgWhite.black.bold ${gist.files[key].filename || 'Not provided '} }
{bgWhite.red.bold Content: 
}{bgWhite.black.bold ${gist.files[key].content}  }
{bgYellow                                                                      }`).join(' ')

    this.log(chalk`
{bgWhite.red.bold Description: }{bgWhite.black.bold ${gist.description} }
{bgWhite.red.bold Files:                            }
    ${filesList}`
    )
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

FindCommand.flags = {
  action: flags.string(
    {
      char: 'a',
      description: 'Action to take for the selected gist.',
      options: ['print', 'edit'],
    }
  ),
}

module.exports = FindCommand

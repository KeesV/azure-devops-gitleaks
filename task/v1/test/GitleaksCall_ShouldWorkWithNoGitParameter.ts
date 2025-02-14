import * as mr from 'azure-pipelines-task-lib/mock-run'
import * as mtr from 'azure-pipelines-task-lib/mock-toolrunner'
import path = require('path')
import * as helpers from './MockHelper'

const taskPath = path.join(__dirname, '..', 'index.js')
let tmr: mr.TaskMockRunner = new mr.TaskMockRunner(taskPath)

// Inputs
tmr.setInput('version', 'latest')
tmr.setInput('configType', 'default')
tmr.setInput('reportformat', 'json')
tmr.setInput('scanfolder', __dirname)

tmr.setInput('nogit', 'true')
tmr.setInput('verbose', 'false')
tmr.setInput('uploadresults', 'false')
tmr.setInput('redact', 'false')
tmr.setInput('taskfail', 'true')
tmr.setInput('taskfailonexecutionerror', 'true')

const executable = 'gitleaks-darwin-amd64'
const reportformat = 'json'

helpers.BuildWithDefaultValues()
tmr = helpers.BuildWithEmptyToolCache(tmr)
tmr = helpers.BuildWithDefaultMocks(tmr)
tmr.registerMock('azure-pipelines-task-lib/toolrunner', mtr)

tmr.setAnswers({
  exec: {
    [createToolCall(reportformat)]: {
      code: 0,
      stdout: 'Gitleaks tool console output'
    }
  }
})

tmr.run()

function createToolCall (reportFormat: string): string {
  const toolCall = `/tool/${executable} --path=${__dirname} --report=${helpers.reportFile(reportFormat)} --format=${reportFormat} --no-git`
  return toolCall
}

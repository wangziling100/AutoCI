const core = require('@actions/core');
const github = require('@actions/github');
const io = require('./lib/io')
const analyser = require('./lib/commitAnalyser');
const executor = require('./lib/executor')

// most @actions toolkit packages have async methods
async function run(testData, debug=false) {
  try{
    console.log('start...')
    let configPath, modulesDir, context
    if (testData!==undefined && testData!==null){
      configPath = testData.configPath
      modulesDir = testData.modulesDir
      context = testData.context
    }
    else {
      configPath = core.getInput('configPath')
      modulesDir = core.getInput('modulesDir')
      context = github.context

    }

    const baseInfo = io.getInfo(context)
    const commit = baseInfo.commit
    const branch = baseInfo.branch
    let [returnCommit, workspace] = analyser.analyse(commit, branch)
    if (workspace===null) workspace = 'global'
    const configInfo = io 
    .locateConfig(workspace, configPath, modulesDir)
    if(configInfo===null) {
      core.setFailed(`Sorry, can't find config file`)
      return
    }
    const config = io.getCIConfig(...configInfo)
    if(debug) console.log('config file', config)
    const succeed = executor.execute(config)
    if (succeed) {
      console.log('Succeed!')
      core.addPath(config.dir)
      core.setOutput('moduleDir', config.dir)
      if(returnCommit==='test'){
        core.setOutput('info', 'test')
      }
      else if(returnCommit==='publish'){
        core.setOutput('info', 'publish')
      }
      else{
        core.setOutput('info', 'normal')
      }
    }
    else core.setFailed('Action failed')
  }
  catch(error){
    if (debug) console.log(error, 'error message')
    core.setFailed(error.message);
  }
  
}
run(null, true)

module.exports = {
  run: run,
}

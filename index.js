const core = require('@actions/core');
const github = require('@actions/github');
const io = require('./lib/io')
const analyser = require('./lib/commitAnalyser');
const executor = require('./lib/executor')

// most @actions toolkit packages have async methods
async function run(testData, debug=false) {
  try{
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
    let workspace = analyser.analyse(commit, branch)[1]
    if (workspace===null) workspace = 'global'
    const configInfo = io 
    .locateConfig(workspace, configPath, modulesDir)
    if(configInfo===null) {
      core.setFailed(`Sorry, can't find config file`)
      return
    }
    const config = io.getCIConfig(...configInfo)
    console.log('config file', config)
    const succeed = executor.execute(config)
    if (succeed) console.log('Succeed!')
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

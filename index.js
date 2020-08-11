const core = require('@actions/core');
const github = require('@actions/github');
const io = require('./lib/io')
const analyser = require('./lib/commitAnalyser');
const { locateConfig } = require('./lib/io');

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
    let [_, workspace] = analyser.analyse(commit)
    if (workspace===null) workspace = 'global'
    const configInfo = io 
    .locateConfig(workspace, configPath, modulesDir)
    console.log(configInfo, 'config')
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

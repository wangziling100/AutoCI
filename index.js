const core = require('@actions/core');
const github = require('@actions/github');

// most @actions toolkit packages have async methods
async function run() {
  try{

  }
  catch(error){
    core.setFailed(error.message);
  }
  
}

run();
module.exports = {
  run: run,
}
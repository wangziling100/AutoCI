const cp = require('child_process');
function execute(config){
    const rootDir = config.dir
    const commands = config.actions
    if (commands===undefined || commands===null){
        console.log(`Sorry, can't find any command`)
        return false
    }
    let curr = ''
    try{
        for (let cmd of commands){
            console.log(cmd, 'cmd')
            curr = cmd
            cp.execSync(`cd ${rootDir} && ${cmd}`)
        }
    }
    catch(error){
        console.log(`Something wrong happens during executing the command: \n ${curr}`)
        console.log(error)
        return false
    }
    return true
    
}

module.exports = {
    execute: execute,
}
const cp = require('child_process');
const fs = require('fs')
const path = require('path')

function getInfo(context){
    let sha 
    if (context===undefined) sha = '';
    else sha = context.sha || '';
    let commit = cp.execSync(`git log --format=%B -n 1 ${sha}`);
    commit = buffer2String(commit);
    commit = commit.split('\n')[0]
    let branch = cp.execSync(`git branch | sed -n '/* /s///p'`)
    branch = buffer2String(branch)
    branch = branch.replace(/\n/g, '')

    let email, name;
    if (context===undefined){
        email = 'example@example.com'
        name = 'example'
    }
    else{
        const info = context.payload.pusher;
        email = info.email
        name = info.name
    }
    return{commit, branch, email, name}
}

function buffer2String(buffer, key='data'){
  let ret = JSON.stringify(buffer);
  ret = JSON.parse(ret);
  ret = ret[key];
  return String.fromCharCode(...ret);
}

function locateConfig(workspace, configPath, modulesDir){
    if (workspace === 'global'){
        workspace = '.'
        const isExist = checkPath(configPath)
        if (isExist) {
            return [
                path.join(workspace, modulesDir),
                JSON.parse(fs.readFileSync(configPath))
            ]
        }
        else return null
    }
    else if (workspace!==null && workspace!==undefined){
        let isExist = checkPath(
            path.join(workspace, 
                      modulesDir, 
                      configPath)
        )
        if (isExist) {
            return [
                path.join(workspace, modulesDir), 
                JSON.parse(fs.readFileSync(configPath))
            ]
        }
        let searchArea ='.'
        if (modulesDir!=='') searchArea = modulesDir
        const modulePath = searchFile(searchArea, workspace)
        if (modulePath!==null) {
            const newPath = path.join(modulePath, configPath)
            const isExist = checkPath(newPath)
            if (isExist){
                return [
                    modulePath, 
                    JSON.parse(fs.readFileSync(newPath))
                ]
            } 
            else return null
        }
        return null
    }
    else{
        return null
    }
    return null
}

function searchFile(filePath, target, except=['node_modules', '.git', '..']){
    if (isIn(filePath, except)) return null
    const isExist = checkPath(filePath)
    if (!isExist) return null
    if (filePath===target) return filePath
    const stat = fs.statSync(filePath)
    if (stat && !stat.isDirectory()) return null
    const dirList = fs.readdirSync(filePath)
    for (let el of dirList){
        if (isIn(el, except)) continue
        const newPath = path.join(filePath, el)
        if (el===target) return newPath
        const stat = fs.statSync(newPath)
        if (!stat.isDirectory) return null
        const result = searchFile(newPath, target, except)
        if (result!==null) return result
    }
    return null
}

function isIn(x, array){
    for (let el of array){
        if(x===el) return true
    }
    return false
}

function checkPath(path){
    return fs.existsSync(path)
}

function getCIConfig(config, dir){
    if (config===null) {
        defaultConfig['dir'] = dir
        return defaultConfig
    }
    config['dir'] = dir 
    return config
}

const defaultConfig = {
    actions: [
        'yarn lint',
        'yarn test',
        'yarn build'
    ]
}

module.exports = {
    getInfo: getInfo,
    searchFile: searchFile,
    locateConfig: locateConfig,
}
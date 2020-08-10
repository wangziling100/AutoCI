const cp = require('child_process');

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

module.exports = {
    getInfo: getInfo,
}
function analyse(commit, branch){
  let workspace = null;
  let returnCommit = null;
  const subcommits = commit.split(':');
  let head = subcommits[0]
  head = head.replace(/ /g,'');
  switch (head){
    case 'feat': returnCommit='feat'; break;
    case 'fix': returnCommit='fix'; break;
    case 'init': returnCommit='init'; break;
    case 'breakingchange': 
      returnCommit='breaking change'; break;
  }
  let rest = null;
  let content = null;
  if (returnCommit===null){
    const tmp = head.slice(0,5);
    // merge type
    if (tmp==='Merge') {
      returnCommit = 'merge';
      //rest = commit;
      content = commit
    }
    else return [ null, workspace ];
  }
  else {
    // feat, fix, init, breakingchange type
    rest = subcommits[1];
    let tmp = rest.split('@@');
    if (tmp.length>1) {
      workspace = tmp[0].replace(/ /g, '');
      content = tmp.slice(1).join('@@');
    }
    else {
      workspace = 'global';
      content = rest;
    }
  }

  if (returnCommit==='merge'){
    let re = /( |'|"|\/)+([^ '"/])+@@/
    workspace = re.exec(content);
    if (workspace===null) workspace = 'global';
    else {
      workspace = workspace[0]
      workspace = workspace.replace(/ /g, '');
      workspace = workspace.replace(/@@/g, '');
      workspace = workspace.replace(/'/g, '');
      workspace = workspace.replace(/"/g, '');
      workspace = workspace.replace(/\//g, '')
    }
    re = /([0-9])+(.(([0-9])+|x))?.x/;
    let versions = multiMatch(re, content);
    //if (!checkVersionValid(versions)) return [ null, workspace ];
    re = /master|next|alpha|beta/;
    versions = versions.concat(multiMatch(re, content));
    if (versions.length===0) return [ null, workspace ]
    let mergeBranch = findMergeBranch(versions, branch, workspace);
    if (mergeBranch===null) return [ null, workspace ]
    mergeBranch = extractVersion(mergeBranch)
    if (mergeBranch===null) return [ null, workspace ];
    switch (mergeBranch){
      case 'next': returnCommit='merge next'; break;
      case 'alpha': returnCommit='merge alpha'; break;
      case 'beta': returnCommit='merge beta'; break;
      case 'N': returnCommit='merge N'; break;
      case 'N.N': returnCommit='merge N.N'; break;
      default: returnCommit=null; break;
    }
  }
  return [ returnCommit, workspace]
}

function multiMatch(reg, string){
  let matched='';
  let result = [];
  let limit = 50;
  let cnt = 0
  while (matched!==null && cnt<limit){
    matched = reg.exec(string);
    if (matched!==null) {
      matched = matched[0]
      result.push(matched);
    }
    else break;
    string = string.replace(matched, '');
    cnt++
  }
  return result;
}

function findMergeBranch(branches, localBranch, workspace){
  if (branches.length>2) return null
  for (let branch of branches){
    let tmp = branch
    if (workspace!=='global') tmp = workspace+'@@'+branch
    if (tmp!==localBranch) return branch
  }
  return null
}

function extractVersion(version){
  const parts = version.split('.')
  try{
    if (parts[1]==='x') return 'N';
    if (parts[2]==='x') return 'N.N';
  }
  catch(err){
    console.log(err);
  }
  return version;
}

module.exports = {
    analyse: analyse
}
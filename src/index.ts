
import { fork, exec } from 'child_process';

import { isExist, gitClone, byRepo2TargetPath, gitPull } from './utils/index';
import * as path from 'path';

import * as os from 'os';
import * as ora from 'ora';

const CACHE_DIR = path.resolve(os.homedir(), '.bhc-deps');

const RUN_PATH = './node_modules/@vue/cli-service/bin/vue-cli-service.js';

const runDep = (filePath: string, cwd: string, args = ['serve']) => new Promise((resolve, reject) => {
  const child = fork(filePath, args, {
    cwd
  });
  child.on('error', (err) => {
    reject(err);
  });
  resolve();
});

const install = (cwd: string) => new Promise((resolve, reject) => {
  const child = exec('npm i', {
    cwd
  });
  child.on('exit', (code) => {
    if (code) {
      reject(code);
      return;
    }
    resolve(code);
  });
});
const run = async (repoAry: string[]) => {
  const runDepList = [];
  const runCloneList = [];
  const installList = [];
  const pullList = [];
  for (let i = 0; i < repoAry.length; i++) {
    const repo = repoAry[i];
    const tragetPath = path.join(CACHE_DIR, byRepo2TargetPath(repo));
    runDepList.push(() => runDep(RUN_PATH, tragetPath));
    installList.push(() => install(tragetPath));
    pullList.push(() => gitPull(tragetPath) );
    if (!isExist(tragetPath)) {
      runCloneList.push(gitClone(repo, tragetPath));
    }
  }
  try {
    const spinner = ora('clone projects...');
    spinner.start();
    await Promise.all(runCloneList);
    spinner.succeed('clone projects done');
    spinner.text = 'git pull ...';
    spinner.start();
    await Promise.all(pullList.map(item => item()));
    spinner.succeed('git pull done');
    spinner.text = 'npm install ...';
    spinner.start();
    await Promise.all(installList.map((item) => item()));
    spinner.succeed('npm install done');
    Promise.all(runDepList.map((item) => item()));
    return null;
  } catch (e) {
    console.log(e);
    return e;
  }
};

export {
  run,
};
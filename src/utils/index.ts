
import { exec } from 'child_process';
import * as fs from 'fs';

import * as path from 'path';

import * as os from 'os';


const gitClone = function (repository: string, target: string) {
  return new Promise((resolve, reject) => {
    exec(`git clone ${repository} ${target}`, (err) => {
      if (err) {
        console.log(err);
        reject();
      }
      resolve();
    });
  });
};


const isExist = (filePath: string): boolean => {
  try {
    fs.accessSync(filePath);
    return true;
  } catch (e) {
    return false;
  }
};

const mkdir = (dir: string): boolean => {
  try {
    fs.mkdirSync(dir);
    return true;
  } catch (e) {
    return false;
  }
};

const gitPull = (pullPath: string) => {
  const cmd = `git --git-dir=${path.join(
    pullPath,
    '.git',
  )} --work-tree=${pullPath} pull`;

  return new Promise((resolve, reject) => {
    exec(cmd, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};

const byRepo2TargetPath = (filePath: string) => {
  const dirname = path.basename(filePath);
  return dirname.replace('.git', '');
};

export {
  gitClone,
  isExist,
  mkdir,
  gitPull,
  byRepo2TargetPath
};

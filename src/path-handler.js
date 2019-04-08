const Conf = require('conf');
const path = require('path');
const { lstatSync } = require('fs');
const cli = require('./cli');

const TAG_MARKER = '@';

function pushIfDirectoryExists(dirList, dir) {
  const resolvedDir = path.resolve(path.normalize(dir.trim()));

  try {
    if (lstatSync(resolvedDir).isDirectory()) {
      if (dirList.indexOf(resolvedDir) < 0) {
        dirList.push(resolvedDir);
      }
    } else {
      cli.warningMessage(`SKIPPED: "${dir}" (${resolvedDir}) is not a directory`);
    }
  } catch (e) {
    cli.warningMessage(`SKIPPED: "${dir}" (${resolvedDir}) not available`);
  }
  return dirList;
}

function assignDirToTags(dir, tags) {
  const conf = new Conf();

  tags.forEach((tag) => {
    const dirList = conf.get(tag, []);
    pushIfDirectoryExists(dirList, dir);
    conf.set(tag, dirList);
  });
}

function assignTagToDirs(tag, dirs) {
  const conf = new Conf();

  const dirList = conf.get(tag, []);
  dirs.forEach(dir => pushIfDirectoryExists(dirList, dir));
  conf.set(tag, dirList);
}

function deleteTag(tag) {
  const conf = new Conf();
  conf.delete(tag);
}

function resolve(pathspec) {
  const conf = new Conf();
  let resolvedPaths;
  let dirList = [];

  pathspec.forEach((tagOrPath) => {
    // TODO: Update readme
    if (tagOrPath[0] === TAG_MARKER) {
      resolvedPaths = conf.get(tagOrPath.substr(1), []);
    } else {
      resolvedPaths = pushIfDirectoryExists([], tagOrPath);
    }
    dirList = dirList.concat(resolvedPaths);
  });

  return [...new Set(dirList)];
}

function parse(dir) {
  return path.parse(dir);
}

module.exports.TAG_MARKER = TAG_MARKER;
module.exports.assignDirToTags = assignDirToTags;
module.exports.assignTagToDirs = assignTagToDirs;
module.exports.resolve = resolve;
module.exports.parse = parse;
module.exports.deleteTag = deleteTag;

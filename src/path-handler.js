const Conf = require('conf');
const path = require('path');
const { lstatSync } = require('fs');
const cli = require('./cli');

const TAG_MARKER = '@';

let conf;
try {
  conf = new Conf({ clearInvalidConfig: false });
} catch (e) {
  cli.errorMessage(`Invalid tag list file, aborting:\n${e}`);
  process.exit();
}

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
    cli.warningMessage(`SKIPPED: cannot access "${dir}" (${resolvedDir})`);
  }
  return dirList;
}

function assignDirToTags(dir, tags) {
  tags.forEach((tag) => {
    conf.set(tag, pushIfDirectoryExists(conf.get(tag, []), dir));
  });
}

function assignTagToDirs(tag, dirs) {
  const dirList = conf.get(tag, []);

  dirs.forEach(dir => pushIfDirectoryExists(dirList, dir));
  conf.set(tag, dirList);
}

function deleteTag(tag) {
  conf.delete(tag);
}

function resolve(pathspec) {
  let dirList = [];

  pathspec.forEach((tagOrPath) => {
    dirList = dirList.concat(
      tagOrPath[0] === TAG_MARKER
        ? conf.get(tagOrPath.substr(1), [])
        : pushIfDirectoryExists([], tagOrPath),
    );
  });

  return [...new Set(dirList)];
}

function parse(dir) {
  return path.parse(dir);
}

function getTagFilePath() {
  return conf.path;
}

module.exports.TAG_MARKER = TAG_MARKER;
module.exports.assignDirToTags = assignDirToTags;
module.exports.assignTagToDirs = assignTagToDirs;
module.exports.resolve = resolve;
module.exports.parse = parse;
module.exports.getTagFilePath = getTagFilePath;
module.exports.deleteTag = deleteTag;

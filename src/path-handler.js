'use strict';

const
    cli = require('./cli'),
    Conf = require('conf'),
    path = require('path'),
    lstatSync = require('fs').lstatSync;

function assignDirToTags(dir, tags) {
    const
        conf = new Conf();

    tags.forEach(function assign(tag) {
        const dirList = conf.get(tag, []);
        pushIfDirectoryExists(dirList, dir);
        conf.set(tag, dirList)
    });
}

function resolve(pathspec) {
    const
        conf = new Conf(),
        dirList = [];

    pathspec.forEach(function getPath(tagOrPath) {
        const resolvedPaths = conf.has(tagOrPath) ? conf.get(tagOrPath) : pushIfDirectoryExists([], tagOrPath);
        resolvedPaths.forEach(function addIfNotExists(dir) {
            if (dirList.indexOf(dir) < 0) {
                dirList.push(dir);
            }
        });
    });

    return dirList;
}

function pushIfDirectoryExists(dirList, dir) {
    const resolvedDir = path.resolve(path.normalize(dir.trim()));

    try {
        if (lstatSync(resolvedDir).isDirectory()) {
            dirList.push(resolvedDir);
        } else {
            cli.warningMessage(`SKIPPED: "${dir}" (${resolvedDir}) is not a directory`);
        }
    } catch (e) {
        cli.warningMessage(`SKIPPED: "${dir}" (${resolvedDir}) not available`);
    }
    return dirList;
}

module.exports.assignDirToTags = assignDirToTags;
module.exports.resolve = resolve;
'use strict';

const
    Conf = require('conf'),
    path = require('path');

function assignDirToTags(dir, tags) {
    const
        conf = new Conf(),
        resolvedDir = path.resolve(dir.trim());

    tags.forEach(function assign(tag) {
        // TODO: Ellenorizze, hogy letezo utvonalrol van-e szo
        const dirList = conf.get(tag, []);
        dirList.push(resolvedDir);
        conf.set(tag, dirList)
    });
}

function resolve(pathspec) {
    const
        conf = new Conf(),
        dirList = [];

    pathspec.forEach(function getPath(tagOrPath) {
        const resolvedPaths = conf.get(tagOrPath, [path.resolve(tagOrPath)]);
        resolvedPaths.forEach(function addIfNotExists(dir) {
            if (dirList.indexOf(dir) < 0) {
                dirList.push(dir);
            }
        });
    });

    return dirList;
}

module.exports.assignDirToTags = assignDirToTags;
module.exports.resolve = resolve;
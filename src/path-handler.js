'use strict';

const
    Conf = require('conf'),
    path = require('path');

function assignDirToTags(dir, tags) {
    const
        conf = new Conf(),
        resolvedDir = path.resolve(dir.trim());

    tags.forEach(function assign(tag) {
        const dirList = conf.get(tag, []);
        dirList.push(resolvedDir);
        conf.set(tag, dirList)
    });
}

module.exports.assignDirToTags = assignDirToTags;
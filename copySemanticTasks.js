#!/usr/bin/env node

var fs = require('fs'),
	wrench = require('wrench');

console.log("\n");
console.time("Copied Semantic UI Tasks");
wrench.copyDirSyncRecursive('node_modules/semantic-ui/tasks', 'semantic/tasks', { forceDelete: true });
wrench.copyDirSyncRecursive('node_modules/semantic-ui/dist', 'semantic/dist', { forceDelete: true });
console.timeEnd("Copied Semantic UI Tasks");
console.log("\n");

'use strict';

const build = require('@microsoft/node-library-build');
const typescript = require('typescript');

build.initialize(require('gulp'));

build.TypeScriptConfiguration.setTypescriptCompiler(typescript);

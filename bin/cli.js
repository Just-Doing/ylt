#!/usr/bin/env node

console.log("hello world");

const Creator = require('../src/creator.js');
const project = new Creator();
project.init();

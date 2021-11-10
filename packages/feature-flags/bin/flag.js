#!/usr/bin/env node

const FlagEditor = require('../src/FlagEditor');
const prompts = require('../src/prompts');

const editorInstance = new FlagEditor({ prompts });

async function engage() {
    await editorInstance.init();
}

engage();

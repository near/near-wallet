const FlagEditor = require('./FlagEditor');
const prompts = require('./prompts');

const editorInstance = new FlagEditor({ prompts });

async function engage() {
    await editorInstance.init();
}

engage();

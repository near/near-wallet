const FlagEditor = require('./FlagEditor');
const prompts = require('./prompts');

module.exports = async function createEditorInstance() {
    const editorInstance = new FlagEditor({ prompts });
    await editorInstance.init();
    return editorInstance;
}

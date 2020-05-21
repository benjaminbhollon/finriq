const path = require('path');
const liora = require('liora');

// Call addModuleSource with the absolute path to a directory to make that directory a module source
// Your custom modules will go in this folder and it is possible to add multiple module sources
// Liora will still load its internal modules in addition to yours
liora.addModuleSource(path.join(__dirname, 'modules'));

// Start the bot
liora.load(() => {
	// Generate documentation for all loaded modules
	liora.generateDocs('COMMANDS.md');
});
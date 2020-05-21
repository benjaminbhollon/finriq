const path = require('path');
const liora = require('liora');

// If setConfigDirectory is not called, Liora will use the default at ~/.liora-bot/
liora.setConfigDirectory('path/to/your/config/directory');

// Call addModuleSource with the absolute path to a directory to make that directory a module source
// Your custom modules will go in this folder and it is possible to add multiple module sources
// Liora will still load its internal modules in addition to yours
liora.addModuleSource(path.join(__dirname, 'modules'));

// Start the bot
liora.load(() => {
	// Generate documentation for all loaded modules
	liora.generateDocs('COMMANDS.md');
});
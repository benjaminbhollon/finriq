const tosActions = require('../eventActions/welcomeActions');
const bookmarkActions = require ('../eventActions/bookmarkActions');

module.exports = async (client, reaction, user) => {
	// Handle reaction to the ToS message in ToS channel
	tosActions.userAcceptsTOS(reaction, user, client);

	// Bookmark messages in DMs
	bookmarkActions.bookmarkMessage(client, user, reaction);
};
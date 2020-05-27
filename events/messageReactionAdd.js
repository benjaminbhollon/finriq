const tosActions = require('../eventActions/welcomeMessage');

module.exports = async (client, reaction, user) => {
	// Handle reaction to the ToS message in ToS channel
  tosActions.userAcceptsTOS(reaction, user, client);
}
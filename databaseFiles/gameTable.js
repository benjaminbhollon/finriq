const Sequelize = require('sequelize');
const connect = require('./connect.js');

const sequelize = connect.sequelize;

module.exports = sequelize.define('Games', {
	gameName: {
		type: Sequelize.STRING,
		allowNull: false
	},
	started: {
		type: Sequelize.STRING,
		allowNull: false
	}
});
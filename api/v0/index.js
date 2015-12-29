'use strict';

const Promise  = require('bluebird');
const handlers = require('./handlers');
const Sign     = require('./lib/sign');
const ask      = require('./lib/ask');

/**
 * API client constructor
 * @param {Object} [params]
 * @param {String} [params.keyPub=test]                   Public API key
 * @param {String} [params.keyPriv=test]                  Private API key
 * @param {String} [params.api=http://api.survarium.com/] API address
 * @constructor
*/
var Api = function (params) {
	params = params || {};
	this.keyPub  = params.keyPub  || 'test';
	this.keyPriv = params.keyPriv || 'test';
	this.api     = params.api     || 'http://api.survarium.com/';

	this.__handlers = handlers;

	this._sign = new Sign({ keyPriv: this.keyPriv, keyPub: this.keyPub });
};

/**
 * Query executor
 * @param {String} method           API method name
 * @param {Object} [args]           Execution arguments
 * @param {Object} [args.0]         API query params
 * @param {Object} [args.1]         Quering options
 * @param {Object} [args.1.delay]   delay in ms before executing query
 * @returns {function(ask)}
 * @private
 */
Api.prototype.wrap = function (method, args) {
	var params  = args[0];
	var options = args[1] || {};
	var exec = function () {
		return this.__handlers[method].call(this, params).then(ask.bind(this));
	};
	if (options.delay) {
		return Promise.delay(options.delay).then(exec.bind(this));
	}
	return exec.call(this);
};

/**
 * Получить последний сыгранный в Survarium match_id.
 *
 * Return max match_id played in Survarium.
 *
 * param pid - not implemented and hasn't been ported // TODO: investigate getMaxMatchId(pid)
 * @returns {Promise}
*/
Api.prototype.getMaxMatchId = function () {
	return this.wrap.call(this, 'getMaxMatchId', arguments);
};

/**
 * Получить PID игрока по его никнейму.
 *
 * Return users public account id by nickname.
 *
 * @param   {Object}  params
 * @param   {String}  params.nickname Player nickname
 * @returns {Promise}
 */
Api.prototype.getPublicIdByNickname = function (params) {
	return this.wrap.call(this, 'getPublicIdByNickname', arguments);
};

/**
 * Получить список никнеймов по массиву PID.
 *
 * Return bunch of nicknames by array of public account ids.
 *
 * @param   {Object}       params
 * @param   {Array|String} params.pids Array of public ids or one PID
 * @returns {Promise}
 */
Api.prototype.getNicknamesByPublicIds = function (params) {
	return this.wrap.call(this, 'getNicknamesByPublicIds', arguments);
};

/**
 * Получить суммарное количество сыгранных матчей указанным PID.
 *
 * Retrieve amount of played matches by user whose public account Id equals pid.
 *
 * @param   {Object}  params
 * @param   {String}  params.pid  Public player ID
 * @returns {Promise}
 */
Api.prototype.matchesCountByPublicId = function (params) {
	return this.wrap.call(this, 'matchesCountByPublicId', arguments);
};

/**
 * Получить paginated список сыгранных матчей по PID игрока.
 *
 * Return particular amount of played matches of user with public account id = pid.
 *
 * @param   {Object}  params
 * @param   {String}  params.pid                 Public player ID
 * @param   {Number}  [params.matchAmount=10]    Amount of matches to return (limited by 25)
 * @param   {Number}  [params.offset=0]          Amount of entries to skip
 * @returns {Promise}
 */
Api.prototype.getMatchesIdByPublicId = function (params) {
	return this.wrap.call(this, 'getMatchesIdByPublicId', arguments);
};

/**
 * Получить статистику матча по его ID.
 *
 * Return statistic of particular match by match_id.
 *
 * @param   {Object}   params
 * @param   {Number}   params.id                   Match ID
 * @param   {String}   [params.language=english]   Results language
 * @returns {Promise}
 */
Api.prototype.getMatchStatistic = function (params) {
	return this.wrap.call(this, 'getMatchStatistic', arguments);
};

/**
 * Получить информацию об игроке: рейтинг, инвентарь по PID.
 *
 * Return all user data: rating, inventory.
 *
 * @param   {Object}   params
 * @param   {String}   params.pid                  Player ID
 * @param   {String}   [params.language=english]   Results language
 * @returns {Promise}
 */
Api.prototype.getUserData = function (params) {
	return this.wrap.call(this, 'getUserData', arguments);
};

/**
 * Получить количество активных кланов в Survarium.
 *
 * Return amount of active clans in Survarium.
 * @returns {Promise}
 */
Api.prototype.getClanAmounts = function () {
	return this.wrap.call(this, 'getClanAmounts', arguments);
};

/**
 * Получить paginated список кланов, сортированных по ELO рейтингу (от большего к меньшему).
 *
 * Return list of the clan ids and names ordered by elo rating (begin from the top).
 *
 * @param   {Object}   params
 * @param   {Number}   [params.amount=10]      Amount of clans to fetch (limited by 25)
 * @param   {Number}   [params.offset=0]       Amount of skipped entities
 * @returns {Promise}
 */
Api.prototype.getClans = function (params) {
	return this.wrap.call(this, 'getClans', arguments);
};

/**
 * Получить информацию о клане по его ID (название, тег, уровень, рейтинг, PID командира).
 *
 * Return name, abbr, level, elo rating and pid of clan commander.
 *
 * @param   {Object}   params
 * @param   {Number}   params.id   ID of clan
 * @returns {Promise}
 */
Api.prototype.getClanInfo = function (params) {
	return this.wrap.call(this, 'getClanInfo', arguments);
};

/**
 * Получить список участников клана с их званиями.
 *
 * Return members of given clan with their roles.
 *
 * @param   {Object}   params
 * @param   {Number}   params.id       ID of clan
 * @returns {Promise}
 */
Api.prototype.getClanMembers = function (params) {
	return this.wrap.call(this, 'getClanMembers', arguments);
};

/**
 * Получить лимитированный список матчей, прошедших с заданной даты.
 *
 * Return limited matches list after timestamp.
 *
 * @param   {Object}   params
 * @param   {Number}   params.timestamp        Timestamp to search from
 * @param   {Number}   [params.limit=50]       Amount of matches to fetch
 * @returns {Promise}
 */
Api.prototype.getNewMatches = function (params) {
	return this.wrap.call(this, 'getNewMatches', arguments);
};

/**
 * Получить словарь игровых слотов.
 *
 * Return game slots dictionary.
 *
 * @param   {Object}   [params]
 * @param   {String}   [params.language=english]   Dictionary language
 * @returns {Promise}
 */
Api.prototype.getSlotsDict = function (params) {
	return this.wrap.call(this, 'getSlotsDict', arguments);
};

/**
 * Получить словарь игровых предметов.
 *
 * Return game items dictionary.
 *
 * @param   {Object}   [params]
 * @param   {String}   [params.language=english]   Dictionary language
 * @returns {Promise}
 */
Api.prototype.getItemsDict = function (params) {
	return this.wrap.call(this, 'getItemsDict', arguments);
};

/**
 * Получить словарь карт.
 *
 * Return game maps dictionary.
 *
 * @param   {Object}   [params]
 * @param   {String}   [params.language=english]   Dictionary language
 * @returns {Promise}
 */
Api.prototype.getMapsDict = function (params) {
	return this.wrap.call(this, 'getMapsDict', arguments);
};

module.exports = Api;

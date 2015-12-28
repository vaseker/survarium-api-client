const got = require('got');
const parseJson = require('parse-json');

const utils = require('./utils');

/**
 * HTTP asker
 * @private
 */
function ask(params) {
	var url = utils.url(this.api, params);
	var method = 'GET';

	var auth = this._sign.make({
		url: url,
		method: method
	});

	return got(url, {
		method: method,
		timeout: 5 * 1000,
		headers: {
			'user-agent': 'Survarium browser',
			'encoding': 'gzip',
			'authorization': auth.header
		}
	})
		.then(function (result) {
			var body = result.body;
			try {
				return parseJson(body);
			} catch (e) {
				var error = new got.ParseError(e, {
					host: result.socket._host,
					hostname: result.socket._host,
					method: result.socket.method,
					path: result.socket.path
				});
				error.response = body;
				throw error;
			}
		})
		.catch(function (err) {
			throw err;
		});
}

module.exports = ask;

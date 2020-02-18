/* eslint-env node, es6 */
module.exports = {
	suites: ['test'],
	plugins: {
		local: {
			browsers: ['chrome', 'firefox'],
			browserOptions: {
				chrome: [
					'headless',
					'disable-gpu',
					'no-sandbox',
					'lang=sv-SE'
				],
				firefox: [
					'--headless'
				]
			}
		},
		istanbul: {
			dir: './coverage',
			reporters: ['text-summary', 'lcov'],
			include: [
				'**/paper-autocomplete*.js'
			],
			exclude: []
		},
		sauce: {
			name: 'paper-autocomplete',
			browsers: [
				{
					browserName: 'chrome',
					platform: 'Windows 7',
					version: 'latest'
				}, {
					browserName: 'firefox',
					platform: 'Windows 7',
					version: 'latest'
				}, {
					browserName: 'internet explorer',
					platform: 'Windows 7',
					version: '11.0'
				}, {
					browserName: 'microsoftedge',
					platform: 'Windows 10',
					version: ''
				}, {
					browserName: 'safari',
					platform: 'OS X 10.11',
					version: '9.0'
				}
			]
		}
	}
};

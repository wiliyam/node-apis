
const hapiSwagger = require('hapi-swagger');
const inert = require('inert');
const vision = require('vision');

const swagger = {
	register: hapiSwagger,
	options: {
		grouping: 'tags',
		payloadType: 'form'
	}
};

module.exports = { inert, vision, swagger };

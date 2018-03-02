'use strict';

[ 'harvest'
, 'haul'
, 'move'
, 'spawn'
, 'travel'
, 'upgrade'
].forEach( ( handler ) => {
	module.exports[handler] = require( `handler_${handler}` ); // eslint-disable-line global-require
} );

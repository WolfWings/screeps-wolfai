'use strict';

[ 'harvest'
, 'haul'
, 'move'
, 'recycle'
, 'spawn'
, 'tower'
, 'travel'
, 'upgrade'
].forEach( ( handler ) => {
	module.exports[handler] = require( `handler_${handler}` ); // eslint-disable-line global-require
} );

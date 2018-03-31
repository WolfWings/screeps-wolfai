'use strict';

const requests = require( 'requests' );

module.exports.process = ( item ) => {
	if ( ( item.miner === undefined )
	  || ( Game.creeps[item.miner] === undefined ) ) {
		requests.add( 'spawn', {
			'type': 'miner'
		,	'x': item.x
		,	'y': item.y
		,	'room': item.room
		,	'sourceIndex': item.sourceIndex
		} );
		return;
	}

	const miner = Game.creeps[item.miner];
	if ( miner.spawning ) {
		return;
	}

	// If we can replace both miners if needed,
	// and we're not full size already, suicide
	if ( ( miner.body.length < 6 )
	  && ( miner.room.energyAvailable >= 1100 ) ) {
		miner.suicide();
	}

	if ( miner.room.name !== item.room ) {
		if ( miner.fatigue > 0 ) {
			return;
		}

		requests.add( 'travel', {
			'creep': item.miner
		,	'x': item.x
		,	'y': item.y
		,	'room': item.room
		} );

		return;
	}

	if ( ( miner.pos.x !== item.x )
	  || ( miner.pos.y !== item.y ) ) {
		if ( miner.fatigue > 0 ) {
			return;
		}

		requests.add( 'move', {
			'creep': item.miner
		,	'x': item.x
		,	'y': item.y
		} );

		return;
	}

	// TODO: Container miner support based on RCL
	// Add construction and repair here

	//	console.log('harvest - ' + item.target + ', ' + item.miner);
	Game.creeps[item.miner].harvest( Game.getObjectById( item.id ) );
};

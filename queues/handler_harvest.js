'use strict';

const requests = require( 'requests' );

module.exports.process = function handler_harvest ( item ) {
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
		,	'options': { 'range': 1 }
		} );

		return;
	}

	if ( ( Math.abs( miner.pos.x - item.x ) > 1 )
	  || ( Math.abs( miner.pos.y - item.y ) > 1 ) ) {
		if ( miner.fatigue > 0 ) {
			return;
		}

		requests.add( 'move', {
			'creep': item.miner
		,	'x': item.x
		,	'y': item.y
		,	'options': { 'range': 1 }
		} );

		return;
	}

	// TODO: Container miner support based on RCL
	// Add construction and repair here

	// console.log('harvest - ' + item.target + ', ' + item.miner);
	Game.creeps[item.miner].harvest( Game.getObjectById( item.id ) );
};
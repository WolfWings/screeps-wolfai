'use strict';

const requests = require( 'requests' );

module.exports.process = ( item ) => {
	if ( ( item.creep === undefined )
	  || ( Game.creeps[item.creep] === undefined ) ) {
		requests.add( 'spawn', {
			'type': 'upgrader'
		,	'room': item.room
		} );
		return;
	}

	const creep = Game.creeps[item.creep];
	if ( creep.spawning ) {
		return;
	}

	// FIXME: Instead of suiciding, change allegiences to another room
	const room = Game.rooms[item.room];
	if ( room === undefined ) {
		creep.suicide();
		return;
	}

	let target;
	const csites = room.find( FIND_MY_CONSTRUCTION_SITES );
	if ( csites.length > 0 ) {
		const inprog = csites.filter( ( x ) => x.progress > 0 );
		if ( inprog.length > 0 ) {
			target = creep.pos.findClosestByRange( inprog );
		} else {
			target = creep.pos.findClosestByRange( csites );
		}
	} else {
		target = room.controller;
	}

	// If there's no controller we should never have been spawned, GTFO
	if ( target === undefined ) {
		creep.suicide();
		return;
	}

	// Do we have to head to another room?
	if ( target.room.name !== creep.room.name ) {
		requests.add( 'travel', {
			'creep': creep.name
		,	'x': target.pos.x
		,	'y': target.pos.y
		,	'room': target.room.name
		,	'options': { 'range': 1 }
		} );
		return;
	}

	// Still not there yet...
	if ( ( Math.abs( creep.pos.x - target.pos.x ) > 1 )
	 || ( Math.abs( creep.pos.y - target.pos.y ) > 1 ) ) {
		requests.add( 'move', {
			'creep': creep.name
		,	'x': target.pos.x
		,	'y': target.pos.y
		,	'options': { 'range': 1 }
		} );
		return;
	}

	// TODO: Container miner support based on RCL
	// Add construction and repair here

	let result;
	if ( target.structureType === STRUCTURE_CONTROLLER ) {
		result = creep.upgradeController( target );
	} else {
		result = creep.build( target );
	}

	if ( result === ERR_NOT_ENOUGH_RESOURCES ) {
		const res = creep.pos.findInRange( FIND_DROPPED_RESOURCES, 1 ).filter( ( x ) => x.resourceType === RESOURCE_ENERGY );
		if ( res.length > 0 ) {
			creep.pickup( res[0] );
		}
	}
};

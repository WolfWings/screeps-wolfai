'use strict';

module.exports.process = ( item ) => {
	if ( !Game.structures.hasOwnProperty( item ) ) {
		return;
	}
	const tower = Game.structures[item];
	const pos = tower.pos;

	const hostile = pos.findClosestByRange( FIND_HOSTILE_CREEPS );
	if ( hostile !== null ) {
		tower.attack( hostile );
		return;
	}

	const injured = pos.findClosestByRange( FIND_MY_CREEPS, { 'filter': x => x.hits < x.hitsMax } );
	if ( injured !== null ) {
		tower.heal( injured );
		return;
	}

	const damaged = pos.findClosestByRange( FIND_STRUCTURES, { 'filter': x => x.hits < x.hitsMax && ( x.my || x.structureType === STRUCTURE_ROAD ) } );
	if ( damaged !== null ) {
		tower.repair( damaged );
		return;
	}
};

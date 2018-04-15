'use strict';

Room.prototype.updateCosts = function updateCosts ( ) {
	// console.log( `Generating strucural CostMatrix for Room ${this.name}...` );
	const costs = new PathFinder.CostMatrix();
	const constructs = this.find( FIND_STRUCTURES );
	for ( const constructIndex in constructs ) {
		if ( !constructs.hasOwnProperty( constructIndex ) ) {
			continue;
		}
		const construct = constructs[constructIndex];
		let cost = 0xff;
		switch ( construct.structureType ) {
			case STRUCTURE_ROAD:
				cost = Math.max( 1, costs.get( construct.pos.x, construct.pos.y ) );
				break;
			case STRUCTURE_CONTAINER:
				cost = 0;
				break;
			case STRUCTURE_RAMPART:
				cost = ( construct.my || construct.isPublic ) ? 0 : cost;
				break;
			default:
				break;
		}
		if ( cost !== 0 ) {
			costs.set( construct.pos.x, construct.pos.y, cost );
		}
	}
	global._temp_.rooms = global._temp_.rooms || {};
	global._temp_.rooms[this.name] = global._temp_.rooms[this.name] || {};
	global._temp_.rooms[this.name].costs = costs.serialize();
};

Room.prototype.expandCosts = function expandCosts ( ) {
	if ( ( global._temp_.rooms === undefined )
	  || ( global._temp_.rooms[this.name] === undefined )
	  || ( global._temp_.rooms[this.name].costs === undefined ) ) {
		this.updateCosts( );
		if ( ( global._temp_.rooms === undefined )
		  || ( global._temp_.rooms[this.name] === undefined )
		  || ( global._temp_.rooms[this.name].costs === undefined ) ) {
			return;
		}
	}

	// console.log( `Generating per-tick CostMatrix for Room ${this.name}...` );
	const costs = PathFinder.CostMatrix.deserialize( global._temp_.rooms[this.name].costs );
	const creeps = this.find( FIND_CREEPS );
	for ( const creepIndex in creeps ) {
		if ( !creeps.hasOwnProperty( creepIndex ) ) {
			continue;
		}
		const creep = creeps[creepIndex];
		costs.set( creep.pos.x, creep.pos.y, 0xFF );
	}

	this.costs = costs;
};
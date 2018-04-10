'use strict';

Room.prototype.updateCosts = ( room ) => {
	if ( Game.rooms[room] === undefined ) {
		console.log( `Unable to update room structural costs for Room ${room}: No visibility.` );
		return;
	}

	// console.log( `Generating strucural CostMatrix for Room ${room}...` );
	const costs = new PathFinder.CostMatrix();
	const constructs = Game.rooms[room].find( FIND_STRUCTURES );
	for ( const constructIndex in constructs ) {
		if ( !constructs.hasOwnProperty( constructIndex ) ) {
			continue;
		}
		const construct = constructs[constructIndex];
		let cost = 0xff;
		switch ( construct.structureType ) {
			case STRUCTURE_ROAD:
				cost = 1;
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
	global._temp_.rooms[room] = global._temp_.rooms[room] || {};
	global._temp_.rooms[room].costs = costs.serialize();
};

Room.prototype.expandCosts = ( roomName ) => {
	const room = Game.rooms[roomName];
	if ( room === undefined ) {
		console.log( `Unable to expand room costs to include creeps for Room ${roomName}: No visibility.` );
		return;
	}

	if ( ( global._temp_.rooms === undefined )
	  || ( global._temp_.rooms[roomName] === undefined )
	  || ( global._temp_.rooms[roomName].costs === undefined ) ) {
		room.updateCosts( roomName );
		if ( ( global._temp_.rooms === undefined )
		  || ( global._temp_.rooms[roomName] === undefined )
		  || ( global._temp_.rooms[roomName].costs === undefined ) ) {
			return;
		}
	}

	// console.log( `Generating per-tick CostMatrix for Room ${roomName}...` );
	const costs = PathFinder.CostMatrix.deserialize( global._temp_.rooms[roomName].costs );
	const creeps = room.find( FIND_CREEPS );
	for ( const creepIndex in creeps ) {
		if ( !creeps.hasOwnProperty( creepIndex ) ) {
			continue;
		}
		const creep = creeps[creepIndex];
		costs.set( creep.pos.x, creep.pos.y, 0xFF );
	}

	room.costs = costs;
};
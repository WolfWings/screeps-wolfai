'use strict';

const memory_tidy = () => {
	if ( ( Game.time % 1500 ) === 0 ) {
		for ( const name in Memory.creeps ) {
			if ( !Memory.creeps.hasOwnProperty( name ) ) {
				continue;
			}

			if ( !Game.creeps[name] ) {
				delete Memory.creeps[name];
			}
		}
	}
	// Every 1500 cycles refresh all the cost matrixes
	// But only ever trigger one room at a time
	const roomsKnown = Object.keys( Memory.rooms ).sort();
	const phase = Math.floor( ( Game.time % 1500 ) / roomsKnown.length );
	const oldPhase = Math.floor( ( ( Game.time + 1499 ) % 1500 ) / roomsKnown.length );
	if ( phase !== oldPhase ) {
		console.log( `Refresh CostMatrix for room ${roomsKnown[phase]} on game tick ${Game.time}` );
		Memory.rooms[roomsKnown[phase]].costs = undefined;
	}
};

const choose_open_mining_point = ( source ) => {
	const positions = [];
	for ( let xo = -1; xo <= 1; xo += 1 ) {
		for ( let yo = -1; yo <= 1; yo += 1 ) {
			const pos = new RoomPosition( source.pos.x + xo, source.pos.y + yo, source.room.name );
			if ( Game.map.getTerrainAt( pos ) === 'wall' ) {
				continue;
			}
			positions.push( pos );
		}
	}
	const position = positions[Math.floor( Math.random() * positions.length )];
	return {
		'x': position.x
	,	'y': position.y
	,	'room': position.roomName
	,	'id': source.id
	,	'optimal': source.energyCapacity === 4000 ? 7 : 5
	};
};

const memory_update_rooms = () => {
	Memory.rooms = Memory.rooms || {};
	for ( const room in Game.rooms ) {
		if ( !Game.rooms.hasOwnProperty( room ) ) {
			continue;
		}

		Memory.rooms[room] = Memory.rooms[room] || {};
		if ( Memory.rooms[room].sources === undefined ) {
			Memory.rooms[room].sources = Game.rooms[room].find( FIND_SOURCES ).map( choose_open_mining_point );
		}

		if ( Memory.rooms[room].costs === undefined ) {
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
			Memory.rooms[room].costs = costs.serialize();
		}

		Memory.rooms[room].hauler = Memory.rooms[room].hauler || { 'room': room };

		Memory.rooms[room].upgrader = Memory.rooms[room].upgrader || { 'room': room };

		if ( Memory.rooms[room].towers === undefined ) {
			Memory.rooms[room].towers = Game.rooms[room]
				.find( FIND_MY_STRUCTURES )
				.filter( x => x.structureType === STRUCTURE_TOWER )
				.map( x => x.id );
		}
	}
};

module.exports.duty = () => {
	memory_tidy();

	memory_update_rooms();
};
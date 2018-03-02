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

		Memory.rooms[room].hauler = Memory.rooms[room].hauler || { 'room': room };

		Memory.rooms[room].upgrader = Memory.rooms[room].upgrader || { 'room': room };

		if ( Memory.rooms[room].towers === undefined ) {
			Memory.rooms[room].towers = Game.rooms[room].find( FIND_MY_STRUCTURES ).filter( x => x.structureType === STRUCTURE_TOWER ).map( x => x.id );
		}
	}
};

module.exports.duty = () => {
	memory_tidy();

	memory_update_rooms();
};

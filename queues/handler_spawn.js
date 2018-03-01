'use strict';

const find_minimum_spawn = ( room, spawns, required_energy ) => {
	let spawn;
	for ( ;; ) {
		spawn = undefined;
		if ( spawns[room] && spawns[room].length > 0 ) {
			spawn = spawns[room].pop();
		} else {
			const bestRoom = Object.keys( spawns ).reduce( ( best, test ) => ( Game.map.getRoomLinearDistance( room, test.room.name ) < Game.map.getRoomLinearDistance( room, best.room.name ) ) ? test : best );
			spawn = spawns[bestRoom].pop();
		}

		// Ran out of spawn points to choose, abort
		if ( spawn === undefined ) {
			return undefined;
		}

		if ( spawn.room.energyAvailable < required_energy ) {
			continue;
		}

		return spawn;
	}
};

module.exports.setup = () => {
	const rooms = {};  // Per-room StructureSpawn lists
	for ( const spawnIndex in Game.spawns ) {
		if ( !Game.spawns.hasOwnProperty( spawnIndex ) ) {
			continue;
		}
		const spawn = Game.spawns[spawnIndex];
		if ( spawn.spawning !== null ) {
			continue;
		}
		if ( spawn.room.energyAvailable !== spawn.room.energyCapacityAvailable ) {
			continue;
		}
		const room = spawn.room.name;
		rooms[room] = rooms[room] || [];
		rooms[room].push( spawn );
	}
	return rooms;
};

module.exports.process = ( item, spawns ) => {
	let spawn;
	let avail = 0;
	const needs = {};
	if ( Object.keys( spawns ).length < 1 ) {
		return;
	}
	switch ( item.type ) {
		case 'miner':
			// Parameters:
			//     x, y, room:  RoomPosition coordinates to travel to
			//     sourceIndex: Game.getObjectById of source to dropmine on arrival to (x,y,room)
			// Keep selecting a random spawn until we find one with at least 200 energy available
			/*
			while (avail < 150) {
				spawn = undefined;
				if (spawns[item.room] && spawns[item.room].length > 0) {
					spawn = spawns[item.room].pop();
				} else {
					const bestRoom = Object.keys(spawns).reduce((best, test) => (Game.map.getRoomLinearDistance(item.room, test.room.name) < Game.map.getRoomLinearDistance(item.room, best.room.name)) ? test : best );
					spawn = spawns[bestRoom].pop();
				}
				// Ran out of spawn points to choose, abort
				if (spawn === undefined) {
					return;
				}
				avail = spawn.room.energyAvailable;
			}
			/* */
			spawn = find_minimum_spawn( item.room, spawns, 150 );
			// No valid spawns, abort until next tick
			if ( spawn === undefined ) {
				return;
			}
			avail = spawn.room.energyAvailable;
			avail -= 150;
			needs[WORK] = 1;
			// needs[CARRY] = 1;
			needs[MOVE] = 1;
			while ( ( avail >= 100 )
				&& ( needs[WORK] < Memory.rooms[item.room].sources[item.sourceIndex].optimal ) ) {
				avail -= 100;
				needs[WORK] += 1;
			}
			Memory.rooms[item.room].sources[item.sourceIndex].miner = `${spawn.id}:${Game.time}`;
			break;
		case 'hauler':
			// Parameters:
			//     room:        Room we'll be in charge of filling
			// Keep selecting a random spawn until we find one with at least 100 energy available
			/*
			while (avail < 100) {
				spawn = undefined;
				if (spawns[item.room] && spawns[item.room].length > 0) {
					spawn = spawns[item.room].pop();
				} else {
					const bestRoom = Object.keys(spawns).reduce((best, test) => (Game.map.getRoomLinearDistance(item.room, test.room.name) < Game.map.getRoomLinearDistance(item.room, best.room.name)) ? test : best );
					spawn = spawns[bestRoom].pop();
				}
				// Ran out of spawn points to choose, abort
				if (spawn === undefined) {
					return;
				}
				avail = spawn.room.energyAvailable;
			}
			/* */
			spawn = find_minimum_spawn( item.room, spawns, 150 );
			// No valid spawns, abort until next tick
			if ( spawn === undefined ) {
				return;
			}
			avail = spawn.room.energyAvailable;
			avail -= 150;
			needs[CARRY] = 2;
			needs[MOVE] = 1;
			while ( ( avail >= 150 )
			    && ( needs[CARRY] < 15 ) ) {
				avail -= 150;
				needs[CARRY] += 2;
				needs[MOVE] += 1;
			}
			if ( avail >= 100 ) {
				avail -= 100;
				needs[CARRY] += 1;
				needs[MOVE] += 1;
			}
			Memory.rooms[item.room].hauler.creep = `${spawn.id}:${Game.time}`;
			break;
		case 'upgrader':
			// Parameters:
			//     room: Room to handle upgrading the controller of
			spawn = find_minimum_spawn( item.room, spawns, 200 );
			// No valid spawns, abort until next tick
			if ( spawn === undefined ) {
				return;
			}
			avail = spawn.room.energyAvailable - 200;
			needs[WORK] = 1;
			needs[CARRY] = 1;
			needs[MOVE] = 1;
			while ( ( avail >= 100 )
				&& ( needs[WORK] < 15 ) ) {
				avail -= 100;
				needs[WORK] += 1;
			}
			Memory.rooms[item.room].upgrader.creep = `${spawn.id}:${Game.time}`;
			break;
		default:
			return;
	}

	if ( spawn === undefined ) {
		return;
	}

	// Array.reduce across the Object.keys to build the body
	// Trick found at https://stackoverflow.com/a/15748853
	spawn.spawnCreep( Object.keys( needs ).reduce( ( prev, need ) => prev.concat( Array( needs[need] ).fill( need ) ), [] ), `${spawn.id}:${Game.time}` );
};

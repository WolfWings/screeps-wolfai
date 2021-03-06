// Use a Red/White flag as a 'rally point' when there's nothing to do in a room.
// Use a Yellow/Yellow flag to mark an exit row that leads TO a room to remote-mine.
// Use a Yellow/Grey flag to mark an exit leading back FROM a room to where more storage is.
// REMEMBER TO BUILD ROADS AND EXTENSIONS! This is not an automated AI, you control construction!

const repairFilter = object => ( ( object.my !== false ) && ( object.structureType !== STRUCTURE_WALL ) && ( object.structureType !== STRUCTURE_RAMPART ) && ( object.hits < object.hitsMax ) && ( object.hits < object.hitsMax - 500 ) );

module.exports.loop = () => {
	if ( ( Game.time % 100 ) === 0 ) {
		for ( const name in Memory.creeps ) {
			if ( !Game.creeps[name] ) {
				delete Memory.creeps[name];
			}
		}
	}

	const creeps = {};
	for ( const name in Game.creeps ) {
		if ( !Game.creeps.hasOwnProperty( name ) ) {
			continue;
		}
		const creep = Game.creeps[name];
		if ( !creep.my ) {
			continue;
		}
		const room = creep.memory.room || creep.room.name;
		creeps[room] = creeps[room] || [];
		creeps[room].push( creep );
	}

	for ( const roomIndex in Game.rooms ) {
		if ( !Game.rooms.hasOwnProperty( roomIndex ) ) {
			continue;
		}
		const room = Game.rooms[roomIndex];
		let spawns;
		creeps[roomIndex] = creeps[roomIndex] || [];
		creeps[roomIndex].sort( ( a, b ) => ( a.ticksToLive - b.ticksToLive ) );
		const structures = room.find( FIND_STRUCTURES );
		const my_structures = _.filter( structures, object => ( object.my === true ) );
		const towers = _.filter( my_structures, object => ( object.structureType === STRUCTURE_TOWER ) );
		let tanks;
		let repair;
		let hostile_creeps;
		let wounded_creeps;

		for ( const tower of towers ) {
			for ( ; ; ) {
				hostile_creeps = hostile_creeps || room.find( FIND_HOSTILE_CREEPS );
				if ( hostile_creeps.length > 0 ) {
					tower.attack( tower.pos.findClosestByRange( hostile_creeps ) );
					break;
				}

				wounded_creeps = wounded_creeps || _.filter( creeps[roomIndex], object => ( object.hits < object.hitsMax ) );
				if ( wounded_creeps.length > 0 ) {
					tower.heal( tower.pos.findClosestByRange( wounded_creeps ) );
					break;
				}
				break;
			}
		}

		for ( ; ; ) {
			const needs = {};
			if ( ( creeps[roomIndex].length < 3 )
				&& ( room.energyAvailable >= 250 ) ) {
				needs[WORK] = 1;
				needs[CARRY] = 1;
				needs[MOVE] = 2;
			} else if ( ( creeps[roomIndex].length < 20 )
				&& ( room.energyAvailable === room.energyCapacityAvailable ) ) {
				needs[WORK] = 1;
				needs[CARRY] = 1;
				needs[MOVE] = 2;
				if ( room.energyAvailable >= 1300 ) {
					needs[WORK] = 5;
					needs[CARRY] = 9;
					needs[MOVE] = 7;
				} else if ( room.energyAvailable >= 800 ) {
					needs[WORK] = 5;
					needs[CARRY] = 2;
					needs[MOVE] = 4;
				} else if ( room.energyAvailable >= 550 ) {
					needs[WORK] = 3;
					needs[CARRY] = 2;
					needs[MOVE] = 3;
				}
			}

			const body = Object.keys( needs ).reduce( ( prev, need ) => prev.concat( Array( needs[need] ).fill( need ) ), [] );
			if ( body.length > 0 ) {
				spawns = spawns || room.find( FIND_MY_SPAWNS, { 'filter': object => ( object.spawning === null ) } );
				if ( spawns.length > 0 ) {
					const spawn = spawns.pop();
					spawn.spawnCreep( body, `${room.name}:${Game.time}`, { 'room': spawn.room.name } );
				}
			}
			break;
		}

		for ( const creep of creeps[roomIndex] ) {
			if ( creep.memory.full ) {
				if ( creep.carry.energy === 0 ) {
					creep.memory.full = false;
				}
			} else {
				if ( creep.carry.energy === creep.carryCapacity ) {
					creep.memory.full = true;
				}
			}

			let target;
			let result;

			if ( creep.memory.full ) {
				for ( ; ; ) {
					if ( tanks === undefined ) {
						tanks = _.filter( my_structures, object => ( ( ( object.structureType === STRUCTURE_SPAWN ) || ( object.structureType === STRUCTURE_EXTENSION ) || ( object.structureType === STRUCTURE_TOWER ) ) && ( object.energy < object.energyCapacity ) ) );
					}
					if ( tanks.length > 0 ) {
						target = creep.pos.findClosestByRange( tanks );
						if ( target.energyCapacity === undefined ) {
							result = ERR_NOT_IN_RANGE;
						} else {
							result = creep.transfer( target, RESOURCE_ENERGY );
						}
						break;
					}

					target = creep.pos.findClosestByRange( room.find( FIND_MY_CONSTRUCTION_SITES ) );
					if ( ( target === null )
					    && ( creep.room.name !== roomIndex ) ) {
						target = creep.pos.findClosestByRange( creep.room.find( FIND_MY_CONSTRUCTION_SITES ) );
					}
					if ( target !== null ) {
						result = creep.build( target );
						break;
					}

					if ( repair === undefined ) {
						repair = _.filter( structures, repairFilter );
						if ( ( repair.length === 0 )
						    && ( roomIndex !== creep.room.name ) ) {
							repair = creep.room.find( FIND_STRUCTURES, { 'filter': repairFilter } );
						}
						repair.sort( ( a, b ) => ( a.id.localeCompare( b.id ) ) );
					}
					if ( repair.length > 0 ) {
						target = repair.pop();
						result = creep.repair( target );
						break;
					}

					target = creep.pos.findClosestByRange( creep.room.find( FIND_FLAGS, { 'filter': flag => flag.color === COLOR_YELLOW && flag.secondaryColor === COLOR_GREY } ) );
					if ( target !== null ) {
						result = ERR_NOT_IN_RANGE;
						break;
					}

					target = room.controller;
					result = creep.upgradeController( target );
					break;
				}
			} else {
				for ( ; ; ) {
					target = creep.pos.findClosestByRange( FIND_DROPPED_RESOURCES, { 'filter': object => ( object.resourceType === RESOURCE_ENERGY ) } );
					if ( target !== null ) {
						result = creep.pickup( target );
						break;
					}

					let sources = creep.room.find( FIND_SOURCES_ACTIVE );
					if ( sources.length === 0 ) {
						sources = creep.room.find( FIND_FLAGS, { 'filter': flag => flag.color === COLOR_YELLOW && flag.secondaryColor === COLOR_YELLOW } );
					}
					target = creep.pos.findClosestByRange( sources );
					if ( target !== null ) {
						if ( target.energy ) {
							result = creep.harvest( target );
						} else {
							result = ERR_NOT_IN_RANGE;
						}
						break;
					}

					if ( creep.carry.energy > 0 ) {
						creep.memory.full = true;
					} else {
						target = creep.room.find( FIND_FLAGS, { 'filter': object => ( ( object.color === COLOR_RED ) && ( object.secondaryColor === COLOR_WHITE ) ) } );
						if ( target.length > 0 ) {
							target = target.pop();
							result = ERR_NOT_IN_RANGE;
						}
					}
					break;
				}
			}

			if ( result === ERR_NOT_IN_RANGE ) {
				creep.moveTo( target );
			}
		}
	}
};

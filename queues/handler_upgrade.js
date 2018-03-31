'use strict';

const requests = require( 'requests' );

const barrier_levels = {};
barrier_levels[6] = 10000;
barrier_levels[7] = 100000;
barrier_levels[8] = 1000000;

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
	let action;
	let range = 1;
	for ( ; ; ) {
		const csites = room.find( FIND_MY_CONSTRUCTION_SITES );
		if ( csites.length > 0 ) {
			const inprog = csites.filter( x => x.progress > 0 );
			if ( inprog.length > 0 ) {
				target = creep.pos.findClosestByRange( inprog );
			} else {
				target = creep.pos.findClosestByRange( csites );
			}
			action = 'build';
			range = 3;
			break;
		}

		if ( room.controller.level >= 6 ) {
			const barricades = room
				.find( FIND_STRUCTURES )
				.filter( x => ( x.my && x.structureType === STRUCTURE_RAMPART ) || ( x.structureType === STRUCTURE_WALL ) )
				.filter( x => ( x.hits < barrier_levels[room.controller.level] ) )
				.sort( ( a, b ) => ( b.hits - a.hits ) );
			if ( barricades.length > 0 ) {
				target = barricades.reduce( ( a, x ) => {
					if ( a !== null ) {
						return a;
					}
					if ( Math.abs( creep.pos.x - x.pos.x ) > 3 ) {
						return null;
					}
					if ( Math.abs( creep.pos.y - x.pos.y ) > 3 ) {
						return null;
					}
					return x;
				}, null );
				if ( target === null ) {
					target = barricades[0];
				}
				action = 'repair';
				range = 3;
				break;
			}
		}

		target = room.controller;
		action = 'upgradeController';
		range = 3;
		break;
	}

	// If there's no controller we should never have been spawned, GTFO
	if ( target === undefined ) {
		creep.suicide();
		return;
	}

	// Do we have to head to another room?
	if ( target.room.name !== creep.room.name ) {
		if ( creep.fatigue > 0 ) {
			return;
		}

		requests.add( 'travel', {
			'creep': creep.name
		,	'x': target.pos.x
		,	'y': target.pos.y
		,	'room': target.room.name
		,	'options': { 'range': range }
		} );

		return;
	}

	// Still not there yet...
	if ( ( Math.abs( creep.pos.x - target.pos.x ) > range )
	  || ( Math.abs( creep.pos.y - target.pos.y ) > range ) ) {
		if ( creep.fatigue > 0 ) {
			return;
		}

		requests.add( 'move', {
			'creep': creep.name
		,	'x': target.pos.x
		,	'y': target.pos.y
		,	'options': { 'range': range }
		} );

		return;
	}

	// If we're exactly on top of a ConstructionSite, move away one
	if ( ( creep.fatigue === 0 )
	  && ( creep.pos.x === target.pos.x )
	  && ( creep.pos.y === target.pos.y )
	  && ( target instanceof ConstructionSite ) ) {
		const dirs = [
			[  0, -1 ]
		,	[  1, -1 ]
		,	[  1,  0 ]
		,	[  1,  1 ]
		,	[  0,  1 ]
		,	[ -1,  1 ]
		,	[ -1,  0 ]
		,	[ -1, -1 ]
		];
		let bestDir = 0;
		[ 1, 2, 3, 4, 5, 6, 7, 8 ].forEach( ( testDir ) => {
			if ( bestDir !== 0 ) {
				return;
			}
			const space = new RoomPosition( creep.pos.x + dirs[testDir][0], creep.pos.y + dirs[testDir[1]], creep.room.name );
			if ( Game.map.getTerrainAt( space ) === 'wall' ) {
				return;
			}
			const contents = space.look();
			for ( const entry in contents ) {
				if ( contents.hasOwnProperty( entry ) === false ) {
					continue;
				}
				if ( entry.type === 'terrain' ) {
					continue;
				}
				if ( entry.type === 'structure' ) {
					// FIXME: Does not handle Safe Mode and other newer complexities properly
					// OBSTACLE_OBJECT_TYPES is not a surefire test of being an obstacle now.
					if ( OBSTACLE_OBJECT_TYPES.includes( entry.structure.structureType ) ) {
						return;
					}
				}
			}
			bestDir = testDir;
		} );

		if ( bestDir !== 0 ) {
			requests.add( 'move', {
				'creep': creep.name
			,	'x': target.pos.x + dirs[bestDir][0]
			,	'y': target.pos.y + dirs[bestDir][1]
			} );
		}
	}

	// TODO: Container miner support based on RCL
	// Add construction and repair here

	if ( action === 'build' ) {
		creep.memory.labor = creep.memory.labor || creep.body.filter( x => x === WORK ).length;
		const labor = Math.min( creep.carry[RESOURCE_ENERGY], creep.memory.labor ) * 5;
		if ( target.progress + labor >= target.progressTotal ) {
			switch ( target.structureType ) {
				case STRUCTURE_TOWER:
					Memory.rooms[item.room].towers = undefined; // Force re-scan next tick.
					break;
				default:
					break;
			}
		}
	}

	// const result = creep[action]( target );
	creep[action]( target );

	const res = creep.pos.findInRange( FIND_DROPPED_RESOURCES, 1 ).filter( x => x.resourceType === RESOURCE_ENERGY );
	if ( res.length > 0 ) {
		creep.pickup( res.reduce( ( a, x ) => a.amount <= x.amount ? a : x ) );
	}
};
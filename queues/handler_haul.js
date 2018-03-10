'use strict';

const requests = require( 'requests' );

module.exports.process = ( item ) => {
	if ( ( item.creep === undefined )
	  || ( Game.creeps[item.creep] === undefined ) ) {
		requests.add( 'spawn', {
			'type': 'hauler'
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

	// Switch between loading and unloading as needed
	let new_loading = creep.memory.loading;
	const holding = _.sum( creep.carry );
	if ( holding < 1 ) {
		new_loading = true;
	} else if ( holding >= creep.carryCapacity ) {
		new_loading = false;
	}

	// Whenever we switch, toss out the target if any
	if ( new_loading !== creep.memory.loading ) {
		creep.memory.loading = new_loading;
		delete creep.memory.target;
	}

	let target = null;

	// Notice if our target goes away while we're en route
	if ( creep.memory.target !== undefined ) {
		target = Game.getObjectById( creep.memory.target );
		if ( target === null ) {
			delete creep.memory.target;
		}
	}

	if ( target === null ) {
		const res = [];
		const upgrader = Game.creeps[Memory.rooms[item.room].upgrader.creep];
		const upgraderPos = ( upgrader === undefined ) ? { 'x': 1000000, 'y': 1000000 } : upgrader.pos;

		if ( creep.memory.loading ) {
			const space = creep.carryCapacity - _.sum( creep.carry );
			// Flush out tombstones first and foremost
			room
				.find( FIND_TOMBSTONES )
				.filter( x => _.sum( x.carry ) > 0 )
				.forEach( x => res.push( x ) );

			// Look for resources on the ground first, but only consider piles large enough to fill us in one shot
			if ( res.length === 0 ) {
				room
					.find( FIND_DROPPED_RESOURCES )
					.filter( x => x.amount >= space && ( Math.abs( x.pos.x - upgraderPos.x ) > 1 || Math.abs( x.pos.y - upgraderPos.y ) > 1 ) )
					.forEach( x => res.push( x ) );
			}

			// Okay, check for smaller kibble now
			if ( res.length === 0 ) {
				room
					.find( FIND_DROPPED_RESOURCES )
					.filter( x => Math.abs( x.pos.x - upgraderPos.x ) > 1 || Math.abs( x.pos.y - upgraderPos.y ) > 1 )
					.forEach( x => res.push( x ) );
			}

			// Now look for containers to loot
			if ( res.length === 0 ) {
				room
					.find( FIND_STRUCTURES )
					.filter( x => ( x.structureType === STRUCTURE_CONTAINER ) && ( _.sum( x.store ) > 0 ) )
					.forEach( x => res.push( x ) );
			}

			// If we're still out of targets then search all connected rooms for both
			if ( res.length === 0 ) {
				const doors = Game.map.describeExits( item.room );
				for ( const doorIndex in doors ) {
					if ( !doors.hasOwnProperty( doorIndex ) ) {
						continue;
					}

					const searchRoom = Game.rooms[doors[doorIndex]];
					if ( searchRoom === undefined ) {
						continue;
					}

					searchRoom
						.find( FIND_DROPPED_RESOURCES )
						.forEach( x => res.push( x ) );

					searchRoom
						.find( FIND_STRUCTURES )
						.filter( x => ( x.structureType === STRUCTURE_CONTAINER ) && ( _.sum( x.store ) > 0 ) )
						.forEach( x => res.push( x ) );
				}
			}
		} else {
			if ( creep.carry.energy > 0 ) {
				const depots = room
					// Find all containers for energy
					.find( FIND_MY_STRUCTURES )
					.filter( x => ( ( ( x.structureType === STRUCTURE_EXTENSION ) || ( x.structureType === STRUCTURE_TOWER ) || ( x.structureType === STRUCTURE_SPAWN ) ) && ( x.energy < x.energyCapacity ) ) )
					// Add a property to cache this calculation now
					.map( ( x ) => {
						x.energySpace = x.energyCapacity - x.energy;
						return x;
					} )
					// Sort them with least room last
					.sort( ( a, b ) => b.energySpace - a.energySpace );

				// Now we can simply keep popping the last one off the stack as long as it has
				// a DIFFERENT space available than the first one; once those two are equal we
				// have only the ones with the same space available left to pick nearest from.
				while ( ( depots.length > 1 )
				     && ( depots[0].energySpace !== depots[depots.length - 1].energySpace ) ) {
					depots.pop();
				}

				depots.forEach( x => res.push( x ) );
			} else {
				room
					.find( FIND_MY_STRUCTURES )
					.filter( x => x.structureType === STRUCTURE_STORAGE )
					.forEach( x => res.push( x ) );
			}
		}

		// If we're still out of targets, then abort
		if ( res.length === 0 ) {
			if ( upgrader === undefined ) {
				creep.say( '‽' );
				return;
			}

			// Upgraders scavenge, so drop our load beside it and get more
			if ( ( Math.abs( creep.pos.x - upgrader.pos.x ) < 2 )
			  && ( Math.abs( creep.pos.y - upgrader.pos.y ) < 2 )
			  && ( upgrader.fatigue === 0 ) ) {
				creep.drop( RESOURCE_ENERGY );
				creep.memory.loading = true;
				return;
			}

			if ( upgrader.carry.energy >= upgrader.carryCapacity ) {
				creep.say( 'Z' );
				return;
			}

			res.push( upgrader );
		}

		target = creep.pos.findClosestByRange( res );
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

	// We reached the target, reset to find a fresh target and act on it
	delete creep.memory.target;

	if ( creep.memory.loading ) {
		if ( target.resourceType ) {
			creep.pickup( target );
		} else {
			creep.withdraw( target, Object.keys( target.store ).reduce( ( best, slot ) => best || ( target.store[slot] > 0 ) ? slot : undefined, undefined ) );
		}
	} else {
		creep.transfer( target, Object.keys( creep.carry ).reduce( ( best, slot ) => best || ( creep.carry[slot] > 0 ) ? slot : undefined, undefined ) );
	}
};

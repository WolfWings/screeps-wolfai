'use strict';

const requests = require( 'requests' );

const handlers = require( 'handlers' );

const janitorial = require( 'janitorial' );

Room.prototype.updateCosts = ( room ) => {
	if ( Game.rooms[room] === undefined ) {
		console.log( `Unable to update room structural costs for Room ${room}: No visibility.` );
		return;
	}

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
	Memory.rooms[room].costs = costs.serialize().join( ',' );
};

Room.prototype.expandCosts = ( roomName ) => {
	const room = Game.rooms[roomName];
	if ( room === undefined ) {
		console.log( `Unable to expand room costs to include creeps for Room ${roomName}: No visibility.` );
		return;
	}

	if ( room.memory.costs === undefined ) {
		room.updateCosts( roomName );
	}

	console.log( `Generating per-tick CostMatrix for Room ${roomName}...` );
	const costs = PathFinder.CostMatrix.deserialize( room.memory.costs.split( ',' ) );
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

module.exports.loop = () => {
	// console.log(Game.cpu.getUsed());
	// console.log(Memory['undef']);
	// console.log(Game.cpu.getUsed());

	const startCPU = [];
	const endCPU = [];

	startCPU['janitorial.duty'] = Game.cpu.getUsed();
	janitorial.duty();
	endCPU['janitorial.duty'] = Game.cpu.getUsed();

	// Scan through our metaverse to assemble
	// current request lists.
	startCPU['populate requests'] = Game.cpu.getUsed();
	for ( const roomName in Memory.rooms ) {
		if ( !Memory.rooms.hasOwnProperty( roomName ) ) {
			continue;
		}

		const roomMemory = Memory.rooms[roomName];
		for ( const sourceIndex in roomMemory.sources ) {
			if ( !roomMemory.sources.hasOwnProperty( sourceIndex ) ) {
				continue;
			}

			const source = roomMemory.sources[sourceIndex];
			source.sourceIndex = sourceIndex;

			// Drop harvest; later this will fill a container
			requests.add( 'harvest', source );
		}

		if ( Game.rooms[roomName] === undefined ) {
			continue;
		}

		if ( Game.rooms[roomName].controller.my ) {
			requests.add( 'haul', roomMemory.hauler );

			requests.add( 'upgrade', roomMemory.upgrader );

			for ( const towerIndex in roomMemory.towers ) {
				if ( !roomMemory.towers.hasOwnProperty( towerIndex ) ) {
					continue;
				}
				requests.add( 'tower', roomMemory.towers[towerIndex] );
			}
		}
	}
	endCPU['populate requests'] = Game.cpu.getUsed();

	// requests.debug();

	// requests.purge( 'tower' ); // FIXME: Placeholder to allow code to run

	startCPU['requests.process'] = Game.cpu.getUsed();
	// Service request queues in priority order
	[
		// Handle harvesting first to maintain the economy.
		'harvest'

		// Upgrade things (build/controller)
	,	'upgrade'

		// Haul energy to containers
	,	'haul'

		// Handle spawning requests if possible.
	,	'spawn'

		// Handle in-room movement
		// TODO: Add CostMatrix-based pathing w/ roads, etc
	,	'move'

		// Handle between-room movement
		// TODO: Add CostMatrix-based pathing w/ roads, etc
	,	'travel'

		// Handle towers for defense only
	,	'tower'
	].forEach( ( queue ) => {
		startCPU[`requests.process(${queue})`] = Game.cpu.getUsed();
		requests.process( queue, handlers[queue].setup, handlers[queue].process );
		endCPU[`requests.process(${queue})`] = Game.cpu.getUsed();
	} );

	// for (const task in startCPU) {
	// 	console.log(task + ': ' + (endCPU[task] - startCPU[task]));
	// }
	// console.log(Game.cpu.getUsed());
};

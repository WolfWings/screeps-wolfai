'use strict';

global._temp_ = global._temp_ || {};

require( 'prototypes' );

const requests = require( 'requests' );

const handlers = require( 'handlers' );

const janitorial = require( 'janitorial' );

module.exports.loop = () => {
	const startCPU = {};
	const endCPU = {};

	startCPU['_'] = Game.cpu.getUsed();

	// Force Memory to be parsed.
	startCPU['memory'] = Game.cpu.getUsed();
	Memory['undef'] = undefined;
	delete Memory['undef'];
	endCPU['memory'] = Game.cpu.getUsed();

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

	endCPU['_'] = Game.cpu.getUsed();
	const takenTotal = Math.max( Number.MIN_VALUE, endCPU['_'] - startCPU['_'] );

	const times = {};
	for ( const task in startCPU ) {
		if ( !startCPU.hasOwnProperty( task ) ) {
			continue;
		}
		times[task] = Math.round( ( ( endCPU[task] - startCPU[task] ) * 10000 ) / takenTotal );
	}
	Memory['stats'] = Memory['stats'] || [];
	Memory['stats'][Game.time % 100] = times;
};

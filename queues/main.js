'use strict';

const requests = require( 'requests' );

const handlers = require( 'handlers' );

const janitorial = require( 'janitorial' );

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
		}
	}
	endCPU['populate requests'] = Game.cpu.getUsed();

	// requests.debug();

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
	,	'towers'
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

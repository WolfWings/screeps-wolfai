'use strict';

global.request_queues = {};

module.exports.purge = ( queue ) => {
	global.request_queues[queue] = [];
	delete global.request_queues[queue];
};

module.exports.process = ( queue, setup, callback ) => {
	// Forward looking item to empty out the queue
	// In the future this could allow running BGed
	const items = global.request_queues[queue];
	module.exports.purge( queue );

	if ( ( items === undefined )
	    || ( items.length < 1 ) ) {
		return;
	}

	if ( setup instanceof Function ) {
		const persistent = setup();
		for ( const item of items ) {
			callback( item, persistent );
		}
	} else {
		for ( const item of items ) {
			callback( item );
		}
	}
};

// Add item to arbitrary queue using inside-out Fisher-Yates shuffle
// Prevents CPU starvation from strangling individual rooms
module.exports.add = ( queue, item ) => {
	global.request_queues[queue] = global.request_queues[queue] || [];
	// Fast Init if there's no items in this queue yet.
	if ( global.request_queues[queue].length === 0 ) {
		global.request_queues[queue] = [item];
		return;
	}

	// Select "j"
	const oldSlot = Math.floor( Math.random() * ( global.request_queues[queue].length + 1 ) );
	// Handle the "j == i" case.
	if ( oldSlot > global.request_queues[queue].length ) {
		global.request_queues[queue].push( item );
		return;
	}

	// Move j => i, overwrite j with the entry
	global.request_queues[queue].push( global.request_queues[queue][oldSlot] );
	global.request_queues[queue][oldSlot] = item;
};

module.exports.debug = () => {
	for ( const queue in global.request_queues ) {
		if ( !global.request_queues.hasOwnProperty( queue ) ) {
			continue;
		}
		console.log( queue );
		const items = global.request_queues[queue];
		for ( const item in items ) {
			if ( !items.hasOwnProperty( item ) ) {
				continue;
			}
			const keys = items[item];
			console.log( Object.keys( keys ).reduce( ( str, key ) => `${str} ${key}:${keys[key]}`, `${item} - ` ) );
		}
	}
};
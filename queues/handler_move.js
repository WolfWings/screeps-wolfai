'use strict';

module.exports.process = ( item ) => {
	const me = Game.creeps[item.creep];

	if ( me.fatigue > 0 ) {
		return;
	}

	const goal = new RoomPosition( item.x, item.y, me.room.name );

	// Verify we're still on the expected path.
	if ( me.memory.path !== undefined ) {
		if ( ( me.memory.path.x === item.x )
		  || ( me.memory.path.y === item.y )
		  || ( me.memory.path.room === me.room.name ) ) {
			// Skip the check when moving intra-room.
			if ( ( Math.min( 49, Math.max( 2, me.memory.path.oldx ) ) === me.memory.path.oldx )
			  && ( Math.min( 49, Math.max( 2, me.memory.path.oldy ) ) === me.memory.path.oldy ) ) {
				// Are we on the expected path?
				if ( ( me.memory.path.oldx !== me.pos.x )
				  || ( me.memory.path.oldy !== me.pos.y ) ) {
					// Nope, fell out of sync, blow away the path
					console.log( `Creep ${item.creep} fell out of sync: ${JSON.stringify( me.pos )} versus ${JSON.stringify( me.memory.path )}` );
					delete me.memory.path;
				}
			}
		} else {
			// Different end goal, blow away the path
			delete me.memory.path;
		}
	}

	if ( me.memory.path === undefined ) {
		const range = ( item.options && item.options.range ) ? item.options.range : 0;

		const ret = PathFinder.search(
			me.pos
		,	{
				'pos': goal
			,	'range': range
			}
		,	{
				'plainCost': 2
			,	'swampCost': 10
			,	'roomCallback': ( roomName ) => {
					if ( Game.rooms[roomName].costs === undefined ) {
						Game.rooms[roomName].expandCosts( roomName );
					}
					if ( Game.rooms[roomName].costs === undefined ) {
						return false;
					}
					// console.log( Game.rooms[roomName].costs.serialize( ).join( ',' ) );
					return Game.rooms[roomName].costs;
				}
			}
		);

		const savedPath = ret.path.reduce( ( memory, next ) => {
			memory[0] = `${memory[0]}${memory[1].getDirectionTo( next )}`;
			memory[1] = next;
			return memory;
		}, [ '', me.pos ] );
		// console.log( savedPath );

		me.memory.path = {
			'x': item.x
		,	'y': item.y
		,	'room': me.room.name
		,	'saved': savedPath[0]
		,	'oldx': me.pos.x
		,	'oldy': me.pos.y
		};
	}

	if ( me.memory.path.saved.length > 0 ) {
		const step = parseInt( me.memory.path.saved.slice( 0, 1 ), 10 );
		const xOff = [  0,  1,  1,  1,  0, -1, -1, -1 ];
		const yOff = [ -1, -1,  0,  1,  1,  1,  0, -1 ];
		me.move( step );
		me.memory.path.oldx = me.pos.x + xOff[step - 1];
		me.memory.path.oldy = me.pos.y + yOff[step - 1];
		console.log( `Creep ${me.name} expecting to be at ${me.memory.path.oldx},${me.memory.path.oldy} next tick.` );
		me.memory.path.saved = me.memory.path.saved.slice( 1 );
		return;
	}

	me.moveTo( goal, item.options || {} );
};
'use strict';

module.exports.process = ( item ) => {
	const me = Game.creeps[item.creep];
	const goal = new RoomPosition( item.x, item.y, me.room.name );

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

	if ( savedPath[0].length > 0 ) {
		me.move( parseInt( savedPath[0].slice( 0, 1 ), 10 ) );
		return;
	}

	me.moveTo( goal, item.options || {} );
};

'use strict';

module.exports.process = ( item ) => {
	Game.creeps[item.creep].moveTo( new RoomPosition( item.x, item.y, item.room ), item.options || {} );
};
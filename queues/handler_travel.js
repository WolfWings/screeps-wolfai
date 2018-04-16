'use strict';

module.exports.process = function handler_travel ( item ) {
	Game.creeps[item.creep].moveTo( new RoomPosition( item.x, item.y, item.room ), item.options || {} );
};
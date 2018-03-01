'use strict';

module.exports.process = ( item ) => {
	Game.creeps[item.creep].moveTo( item.x, item.y, item.options || {} );
};

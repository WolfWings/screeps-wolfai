'use strict';

module.exports.process = ( item ) => {
	if ( Game.spawns[item] === undefined ) {
		return true;
	}

	return false;
};

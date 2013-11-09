// Simplify event handling.
var Events = {
	on: function ( event, callback ) {
		return this;
	},
	trigger: function ( event, message ) {
		if ( event === 'error' && message ) throw new Error( message );
		return $(this).trigger( event );
	}
};
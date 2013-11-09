// Create a new model with the specified attributes.
var Model = X.Model = function ( data ) {
	data = data || {};

	this.restful = X.restful;

	for ( var key in data ) if (
		typeof data[ key ] === 'function' ||
		key === 'url' ||
		key === 'restful' ||
		key === 'id'
	) {
		Helper.abstract.call( this, key, data );
	}

	this.data = $.extend({}, data);

	if (this.created) Events.on.call(this, 'created');
	if (this.deleted) Events.on.call(this, 'deleted');
	if (this.fetched) Events.on.call(this, 'fetched');
	if (this.updated) Events.on.call(this, 'updated');
};

// Attach all inheritable methods to the Model prototype.
$.extend(Model.prototype, Events, {
	create: function ( callback ) {
		var model = this;

		function success ( res ) {
			if (model.format) res = model.format( res );
			if (callback) callback.call( model, res );
			model.trigger('created');
		}

		Helper.save( model, 'post' ).then( success );
	},
	destroy: function ( callback ) {
		var model = this;

		if ( !model.id ) {
			model.trigger('error', 'This model does not have an ID');
			return;
		}

		function success ( res ) {
			console.log( res );
			model.trigger('destroyed');
		}

		Helper.destroy( model ).then( success );
	},
	fetch: function ( callback ) {
		var model = this;

		function success ( res ) {
			if (res) {
				if (model.format) res = model.format( res );
				model.data = $.extend(model.data, res, true);
				if (callback) callback.call( model, res );
				model.trigger('fetched');
			} else {
				model.trigger('error', 'No response was returned');
			}
		}

		Helper.fetch( model ).then( success );
	},
	get: function ( key ) {
		return this.data[ key ];
	},
	set: function ( key, value ) {
		this.data[ key ] = value;
		return this.data[ key ];
	},
	update: function ( callback ) {
		var model = this;

		if ( !model.id ) {
			model.trigger('error', 'This model does not have an ID');
			return;
		}

		function success ( res ) {
			if (model.format) res = model.format( res );
			if (callback) callback.call( model, res );
			model.trigger('updated');
		}

		Helper.save( model, 'put' ).then( success );
	}
});
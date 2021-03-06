/**
 * X.js - 0.0.7
 * Simplify the process of working with data and client/server interaction.
 * http://github.com/rthor/x
 *
 * Licensed under the MIT license.
 * Copyright (c) 2014 Ragnar Þór Valgeirsson (rthor)
 * http://rthor.is
 */
(function() {
	// Save a reference to the global object (`window` in the browser, `exports' on the server).
	var root = this;

	// The top-level namespace. All public X classes and modules will
	// be attached to this. Exported for both the browser and the server.
	var X = typeof exports !== 'undefined' ? exports : root.X = {};

	// Current version.
	X.Version = '0.0.7';

	// Use restful routes.
	X.restful = true;

	// Create private helper object.
	var Helper = {
		abstract: function ( func, data ) {
			if ( typeof data[ func ] !== 'undefined' ) {
				this[ func ] = data[ func ];
				delete data[ func ];
			}
		},
		destroy: function ( model ) {
			return $.ajax({
				url: Helper.restfulUrl( model ),
				method: 'delete'
			}).promise();
		},
		save: function ( model, method ) {
			return $.ajax({
				url: Helper.restfulUrl( model ),
				method: method,
				data: model.data || {}
			}).promise();
		},
		fetch: function ( model ) {
			return $.ajax({
				url: Helper.restfulUrl( model )
			}).promise();
		},
		restfulUrl: function ( model ) {
			var base = model.baseURL,
				url = model.url,
				id = model.id;

			if ( /^@/.test(url) ) {
				base = base.replace(/\/$/, '') + '/';
				url = url.replace(/^@/, base);
			}

			if ( id && model.restful ) url += '/' + id;
			else if ( id ) url += '?id=' + id;

			return url;
		}
	};

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

	// Collections
	var Collection = X.Collection = function ( data ) {
		data = data || {};

		for ( var key in data ) {
			Helper.abstract.call( this, key, data );
		}

		this.list = [];
		this.model = Model;

		this.baseURL = X.baseURL || '';

		if (this.fetched) Events.on.call(this, 'fetched', 'fetched');

		Events.on.call(this, function() {
			this.count = this.count();
		});
	};

	// Attach all inheritable methods to the Collection prototype.
	$.extend(Collection.prototype, Events, {
		add: function ( item ) {
			return this.list.push(item);
		},
		count: function() {
			return this.list.length;
		},
		each: function( callback ) {
			var i = 0;
			for (; i < this.count(); i++) {
				callback( this.list[ i ], i );
			}
		},
		fetch: function ( callback ) {
			var collection = this;

			function success ( res ) {
				if (res) {
					if (collection.format) res = collection.format( res );

					for (var i = 0; i < res.length; i++) {
						res[i].url = collection.url;
						collection.add( new collection.model( res[i] ) );
					}

					if (callback) callback.call( collection, res );
					collection.trigger('fetched');
				} else {
					collection.trigger('error', 'No response was returned');
				}
			}

			Helper.fetch( collection ).then( success );
		},
		filter: function ( callback ) {
			return _.filter(this.list, callback);
		},
		getAll: function ( key ) {
			var list = _.map(this.list, function(obj) { return obj.data; });
			return key ? _.pluck(list, key) : list;
		}
	});
})();
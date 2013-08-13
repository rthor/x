(function() {
	// Save a reference to the global object (`window` in the browser, `exports' on the server).
	var root = this;

	// The top-level namespace. All public X classes and modules will
	// be attached to this. Exported for both the browser and the server.
	var X = typeof exports !== 'undefined' ? exports : root.X = {};

	// Current version.
	X.Version = 'b0.0.1';

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
		create: function ( url, data ) {
			data = data || {};
			return $.ajax({
				url: url,
				method: 'post',
				data: data
			}).promise();
		},
		fetch: function ( model ) {
			return $.ajax({
				url: Helper.restfulUrl( model )
			}).promise();
		},
		restfulUrl: function ( model ) {
			var url = model.url,
				id = model.id;

			if ( id && model.restful ) url = url + '/' + id;
			else if ( id ) url = url + '?id=' + id;

			return url;
		}
	};

	// Simplify event handling.
	var Events = {
		on: function ( event, callback ) {
			return $(this).on(event);
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

		this.fetched = this.fetched || function() {};
		this.created = this.created || function() {};

		Events.on.call(this, 'fetched');
		Events.on.call(this, 'created');
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

			Helper.create( model.url, model.data ).then( success );
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
		}
	});

	// Backbone extend method borrowed and modified.
	Model.extend = function(protoProps, staticProps) {
		var parent = this;
		var Surrogate;
		var child = (protoProps && protoProps.hasOwnProperty('constructor')) ?
			protoProps.constructor : function () {
				return parent.apply(this, arguments);
			};
		$.extend(child, parent, staticProps);
		Surrogate = function(){ this.constructor = child; };
		Surrogate.prototype = parent.prototype;
		child.prototype = new Surrogate;
		if (protoProps) $.extend(child.prototype, protoProps);
		child.__super__ = parent.prototype;
		return child;
	};
})();
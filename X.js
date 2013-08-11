(function() {
	// Save a reference to the global object (`window` in the browser, `exports' on the server).
	var root = this;

	// The top-level namespace. All public X classes and modules will
	// be attached to this. Exported for both the browser and the server.
	var X = typeof exports !== 'undefined' ? exports : root.X = {};

	// Create private helper object.
	var Helper = {
		abstract: function ( func, data ) {
			if ( data[ func ] ) {
				this[ func ] = data[ func ];
				delete data[ func ];
			}
		},
		create: function ( url, data ) {
			data = data || {};
			return $.ajax({
				url: url,
				method: 'post',
				data: data
			}).promise();
		},
		fetch: function ( url ) {
			return $.ajax({ url: url }).promise();
		}
	};

	// Simplify event handling.
	var Events = {
		on: function ( event, callback ) {
			callback = callback || function() {};
			$(this).on(event, callback);
		},
		sync: function ( callback ) {
			callback = callback || function() {};
			Events.on.call(this, 'sync', callback);
		},
		trigger: function ( event, callback ) {
			callback = callback || function() {};
			$(this).trigger( event, callback );
		}
	};

	// Create a new model with the specified attributes.
	var Model = X.Model = function ( data ) {
		data = data || {};

		for ( var key in data ) if (
			typeof data[ key ] === 'function' ||
			key === 'url'
		) {
			Helper.abstract.call( this, key, data );
		}

		this.data = $.extend({}, data);
		Events.sync.call(this, (this.updated || function() {}));
		Events.on.call(this, 'created', (this.created || function() {}));
	};

	// Attach all inheritable methods to the Model prototype.
	$.extend(Model.prototype, Events, {
		create: function ( callback ) {
			var model = this;

			function success ( res ) {
				if (!res) return;
				if (model.format) res = model.format( res );
				model.data = $.extend(model.data, res, true);
				model.trigger('created');
				if (callback) callback.call( model );
			}

			Helper.create( model.url, model.data ).then( success );
		},
		fetch: function ( callback ) {
			var model = this;

			function success ( res ) {
				if (!res) return;
				if (model.format) res = model.format( res );
				model.data = $.extend(model.data, res, true);
				model.trigger('sync');
				if (callback) callback.call( model );
			}

			Helper.fetch( model.url ).then( success );
		}
	});
})();
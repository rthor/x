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
			return $(this).on(event);
		},
		trigger: function ( event ) {
			$(this).trigger( event );
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
		fetch: function ( callback ) {
			var model = this;

			function success ( res ) {
				if (res) {
					if (model.format) res = model.format( res );
					model.data = $.extend(model.data, res, true);
					if (callback) callback.call( model, res );
					model.trigger('fetched');
				} else {
					model.trigger('error');
				}
			}

			Helper.fetch( model.url ).then( success );
		}
	});
})();
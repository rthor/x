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
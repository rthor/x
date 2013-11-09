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
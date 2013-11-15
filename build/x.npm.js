var $=require('jquery'),_=require('underscore');
!function(){var a=this,b="undefined"!=typeof exports?exports:a.X={};b.Version="0.0.3",b.restful=!0;var c={"abstract":function(a,b){"undefined"!=typeof b[a]&&(this[a]=b[a],delete b[a])},destroy:function(a){return $.ajax({url:c.restfulUrl(a),method:"delete"}).promise()},save:function(a,b){return $.ajax({url:c.restfulUrl(a),method:b,data:a.data||{}}).promise()},fetch:function(a){return $.ajax({url:c.restfulUrl(a)}).promise()},restfulUrl:function(a){var b=a.baseURL,c=a.url,d=a.id;return/^@/.test(c)&&(b=b.replace(/\/$/,"")+"/",c=c.replace(/^@/,b)),d&&a.restful?c+="/"+d:d&&(c+="?id="+d),c}},d={on:function(){return this},trigger:function(a,b){if("error"===a&&b)throw new Error(b);return $(this).trigger(a)}},e=b.Model=function(a){a=a||{},this.restful=b.restful;for(var e in a)("function"==typeof a[e]||"url"===e||"restful"===e||"id"===e)&&c.abstract.call(this,e,a);this.data=$.extend({},a),this.created&&d.on.call(this,"created"),this.deleted&&d.on.call(this,"deleted"),this.fetched&&d.on.call(this,"fetched"),this.updated&&d.on.call(this,"updated")};$.extend(e.prototype,d,{create:function(a){function b(b){d.format&&(b=d.format(b)),a&&a.call(d,b),d.trigger("created")}var d=this;c.save(d,"post").then(b)},destroy:function(){function a(a){console.log(a),b.trigger("destroyed")}var b=this;return b.id?(c.destroy(b).then(a),void 0):(b.trigger("error","This model does not have an ID"),void 0)},fetch:function(a){function b(b){b?(d.format&&(b=d.format(b)),d.data=$.extend(d.data,b,!0),a&&a.call(d,b),d.trigger("fetched")):d.trigger("error","No response was returned")}var d=this;c.fetch(d).then(b)},get:function(a){return this.data[a]},set:function(a,b){return this.data[a]=b,this.data[a]},update:function(a){function b(b){d.format&&(b=d.format(b)),a&&a.call(d,b),d.trigger("updated")}var d=this;return d.id?(c.save(d,"put").then(b),void 0):(d.trigger("error","This model does not have an ID"),void 0)}});var f=b.Collection=function(a){a=a||{};for(var f in a)c.abstract.call(this,f,a);this.list=[],this.model=e,this.baseURL=b.baseURL||"",this.fetched&&d.on.call(this,"fetched","fetched"),d.on.call(this,function(){this.count=this.count()})};$.extend(f.prototype,d,{add:function(a){return this.list.push(a)},count:function(){return this.list.length},each:function(a){for(var b=0;b<this.count();b++)a(this.list[b],b)},fetch:function(a){function b(b){if(b){d.format&&(b=d.format(b));for(var c=0;c<b.length;c++)b[c].url=d.url,d.add(new d.model(b[c]));a&&a.call(d,b),d.trigger("fetched")}else d.trigger("error","No response was returned")}var d=this;c.fetch(d).then(b)},filter:function(a){return _.filter(this.list,a)},getAll:function(a){var b=_.map(this.list,function(a){return a.data});return a?_.pluck(b,a):b}})}();
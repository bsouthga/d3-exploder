(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-geo')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3-geo'], factory) :
  (factory((global.d3 = global.d3 || {}),global.d3));
}(this, (function (exports,d3Geo) { 'use strict';

var version = '2.0.0';


/**
 * getter/setter methods for exploder object
 */
var methods = [
  "size",
  "position",
  "projection"
];


function error(message) {
  throw new Error("d3-exploder: " + message);
}


function exploder() {


  var path = d3Geo.geoPath();


  // create getters / setters
  var state = {};
  methods.forEach(function(option) {
    explode[option] = function(value) {
      if (!arguments.length) return state[option];
      if (!(value instanceof Function)) error(option + " needs to be a function.");
      state[option] = value;
      return explode;
    };
  });


  function explode(selection) {


    // check for necessary parameters
    methods.forEach(function(option) {
      if (!state[option]) error(option + " not provided to exploder.");
    });


    // local references to configuration
    var projection = state.projection,
        size = state.size,
        position = state.position,
        scale = projection.scale(),
        cache = {};


    // update projection of path function
    path.projection(projection);


    // the order of the attribute changes matters!
    // setting 'd' caches the new scale which is used
    // in the transform change
    selection
      .attr('d', function(d, i) {
        // compute size based on user functions
        var sz = size(d, i);

        // calculate new scale for projection based on desired
        // pixel size of feature
        projection.scale(scale);

        var bounds = path.bounds(d);
        var w = bounds[1][0] - bounds[0][0];
        var h = bounds[1][1] - bounds[0][1];
        var sc = cache[i] = Math.min(sz / h, sz / w);

        // scale projection to desired size
        projection.scale(scale * sc);

        // return scaled path
        return path(d);
      })
      .attr("transform", function(d, i) {
        // update projection with cached scale
        projection.scale(scale * cache[i]);

        var center = path.centroid(d);
        var desired = position(d, i);
        var translate = [desired[0] - center[0], desired[1] - center[1]];

        // return desired coordinates offset by centroid
        return "translate(" + translate + ")";
      });


    // reset scale for projection
    projection.scale(scale);
  }


  // return configurable exploder function
  return explode;
}

exports.exploder = exploder;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));

/*
  D3 Exploder! extension
  Ben Southgate

  Copyright (c) 2015 Benjamin Southgate

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/

(function(wrapper) {

function exploder() {

  // attributes / methods for explode
  var methods = ["size", "position", "projection"],
      // call d3.geo.path()
      path = this.path();

  // explode selection
  function explode(selection) {

    // check for necessary parameters
    methods.forEach(function(option) {
      if (!config[option]) {
        throw "exploder.js: " + option + " not provided to exploder.";
      }
    });

    // local references to configuration
    var projection = config.projection,
        size = config.size,
        position = config.position,
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
        // pixed size of feature
        var bounds = path.projection(projection.scale(scale)).bounds(d),
            w = bounds[1][0] - bounds[0][0],
            h = bounds[1][1] - bounds[0][1],
            sc = cache[i] = Math.min(sz / h, sz / w);
        // scale projection to desired size
        path.projection(projection.scale(scale*sc));
        // return scaled path
        return path(d);
      })
      .attr("transform", function(d, i) {
        // update projection with cached scale
        path.projection(projection.scale(scale*cache[i]));
        var C = path.centroid(d),
            A = position(d, i);
        // return desired coordinates offset by centroid
        return "translate(" + [A[0] - C[0], A[1] - C[1]] + ")";
    });

    // reset scale for projection
    projection.scale(scale);
  }

  // create getters / setters
  var config = {};
  methods.forEach(function(option) {
    config[option] = null;
    explode[option] = function(value) {
      if (!arguments.length) return config[option];
      if (!(value instanceof Function)) {
        throw "exploder.js: " + option + " needs to be a function.";
      }
      config[option] = value;
      return explode;
    };
  });

  // return configurable exploder function
  return explode;
}

// semantic version
exploder.version = "1.0.5";

// add exploder to d3 or to the module exports
wrapper(exploder);

})(function(exploder){

  if (typeof d3 !== 'undefined') {
    d3.geo.exploder = exploder;
  }

  // if requiring in nodeJS,
  // expose exploder via extending function
  // USAGE:
  //   var d3 = require('d3');
  //   require('./exploder.js')(d3);
  // OR:
  //  var d3 = require('./exploder.js')(require('d3'))
  if ((typeof module != 'undefined') && (module.exports)) {
    module.exports = function(d3) {
      d3.geo.exploder = exploder;
      return d3;
    };
  }

});
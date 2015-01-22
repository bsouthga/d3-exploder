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

;(function(d3) {

d3.geo.exploder = function exploder() {

  function explode(selection) {
    // check for necessary parameters
    ["size", "position", "projection"].forEach(function(option) {
      if (!config[option]) {
        throw "exploder.js: " + option + " not provided to exploder.";
      }
    });
    // local references to configuration
    var projection = config.projection,
        size = config.size,
        position = config.position,
        scale = projection.scale(),
        path = d3.geo.path().projection(projection),
        cache = {};
    // acount for sizes given as numbers
    size = typeof size === "function" ? size : function(){return size;};
    // move features based on configuration
    selection
      // the order of the attribute changes matters!
      // setting 'd' caches the new scale which is used
      // in the transform change
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
        // and calculate new centroid to translate to
        path.projection(projection.scale(scale*sc));
        // return scaled path
        return path(d);
      })
      // calculate new transform after finding scale
      .attr("transform", function(d, i) {
        // compute size and positionment based on user functions
        var A = position(d, i),
            δx = A[0],
            δy = A[1];
        // scale projection to desired size
        // and calculate new centroid to translate to
        path.projection(projection.scale(scale*cache[i]));
        var coords = path.centroid(d),
            cx = coords[0],
            cy = coords[1];
        // return desired coordinates offset by centroid
        return "translate(" + [δx - cx, δy - cy] + ")";
    });
    // reset scale for projection
    projection.scale(scale);
  }

  // create getters / setters
  var config = {};
  ["size", "position", "projection"].forEach(function(option) {
    config[option] = null;
    explode[option] = function(value) {
      if (!arguments.length) return config[option];
      config[option] = value;
      return explode;
    };
  });
  // return configurable exploder function
  return explode;
};

d3.geo.exploder.version = "1.0.2";
})(d3);
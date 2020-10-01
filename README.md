# `d3-exploder`

[![npm version](https://badge.fury.io/js/d3-exploder.svg)](https://badge.fury.io/js/d3-exploder)

### Make your d3 maps explode

A tiny d3 extension which lets you turn your maps into other types of charts!

[See examples here](http://bsouthga.github.io/d3-exploder/)

[Another example brought up by a user](https://jsfiddle.net/9Lpcm56n/16/)


### Installation

`d3-exploder` can be installed via `npm`

```
npm install d3-exploder
```

**Note:**

d3-exploder >= 2.0.0 supports d3 v4. For use with d3 v3, install version 1 of d3-exploder.

### Usage


```javascript
import * as d3 from 'd3';
import { exploder } from 'd3-exploder';



// Create an exploder function
var exploder = exploder()
                .projection(d3.geoAlbersUsa().scale(width))
                .size(function(d, i) {
                  // function new size of features in pixels
                })
                .position(function(d, index) {
                  // function returning array [x, y]
                  // which specifies the position of
                  // the features in the svg
                });

// Call exploder, optionally in a transition

var width = 960,
    height = 500,
    centered;

var projection = d3.geoAlbersUsa().scale(width);

var path = d3.geoPath()
    .projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var g = svg.append("g");


d3.json("us.json", function(error, us) {

  var state_features = topojson.feature(us, us.objects.states).features;

  var scale = d3.scaleLinear()
                .domain([0, state_features.length])
                .range([0, 360]);

  var states = g.append("g")
      .attr("id", "states")
    .selectAll("path")
      .data(state_features)
    .enter().append("path")
      .attr("d", path);

  var exploder = d3.exploder()
                  .projection(projection)
                  .size(function(d, i) { return 40; });

  d3.select("#shuffle").on('click', function() {
    var rand = d3.shuffle(d3.range(state_features.length));
    states.transition()
          .duration(500)
          .call(
            exploder.position(function(d, index) {
              var i = rand[index];
              return [120 + (i%10)*60, 40 + Math.floor(i/10)*60];
            })
          );
  });

});
```
Enjoy This Project :)

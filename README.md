# D3 explode

### Make your d3 maps explode

A tiny d3 extension which lets you turn your maps into other types of charts!

### Usage

Include the script

```html
<script src="explode.js"></script>
```


Create an exploder function

```javascript
var exploder = d3.geo.explode()
                .projection(d3.geo.albersUsa().scale(width))
                .size(function(d, i) { 
                  // function new size of features in pixels
                })
                .align(function(d, index) {
                  // function returning array [x, y]
                  // which specifies the position of
                  // the features in the svg
                });
```

Call the exploder, optionally in a transition

```javascript
var width = 960,
    height = 500,
    centered;

var projection = d3.geo.albersUsa().scale(width);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var g = svg.append("g");


d3.json("us.json", function(error, us) {

  var state_features = topojson.feature(us, us.objects.states).features;

  var scale = d3.scale.linear()
                .domain([0, state_features.length])
                .range([0, 360]);

  var states = g.append("g")
      .attr("id", "states")
    .selectAll("path")
      .data(state_features)
    .enter().append("path")
      .attr("d", path);

  var explode = d3.geo.explode()
                  .projection(projection)
                  .size(function(d, i) { return 40; });

  d3.select("#shuffle").on('click', function() {
    var rand = d3.shuffle(d3.range(state_features.length));
    states.transition()
          .duration(500)
          .call(
            explode.align(function(d, index) {
              var i = rand[index];
              return [120 + (i%10)*60, 40 + Math.floor(i/10)*60];
            })
          );
  });

});
```

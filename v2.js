

function chart() {

    this.CHART_WIDTH = 1000
    this.CHART_HEIGHT = 1000

    this.svg = d3.select(document.createElementNS(d3.namespace('svg').space, 'svg'))
            .attr("width", this.CHART_WIDTH)
            .attr("height", this.CHART_HEIGHT)
            .style("background-color", "lightgrey")

    this.theme = ["#5DA5DA","#FAA43A","#60BD68","#F17CB0","#B2912F","#B276B2","#DECF3F","#F15854","#4D4D4D",]

    this.line_count = 0;

    this.x_scale = d3.scaleLinear().range([0, this.CHART_WIDTH]);
    this.y_scale = d3.scaleLinear().range([this.CHART_HEIGHT, 0]);

    this.d = []

    add_line = function(data) {


      this.d.push(data)



      var line_function = d3.line()
         .x(function(d) { return d.x })
         .y(function(d) { return d.y });




        old_paths = this.svg.selectAll("path");

        old_paths.attr("stroke", "black")
              // .attr("d", function(d) {line_function(d)})





        var path = this.svg.append("path");

        path.attr("class", "update");

        path
            .attr("d", line_function(data))
            .attr("stroke", this.theme[this.line_count % 9])
            .attr("stroke-width", 2)
            .attr("fill", "none");
          // .merge(path)

        console.log(this.line_count)

        // path.data().forEach(function(d) {
           // console.log(d)
            // path.attr("stroke", "black")
                // .attr("d", line_function(d))
        // });
        


        path.merge(path);
            
            

        this.line_count = this.line_count + 1


    }


    return this

}






// add_tiles = function(data) {

//       var g = svg.selectAll("g")
//         .data(data);

//       g.attr("class", "update");

//       var a = g.enter().append("g")
//           .attr("class", "enter")
//           .attr("transform", function(d, i) { return "translate(" + i*TILE_SPACING + ", 0)"; })
//         .merge(g)
//           .text(function(d) { return d; });

//         a.append('rect')
//           .attr('height', TILE_SIZE)
//           .attr('width', TILE_SIZE)
//           .attr('class', 'tile')
//           .attr('opacity', 0.3)
//           .style("fill", "red"); 
//         a.append('text')
//           .attr("dy", "2em")
//           .attr("dx", "1em")
//           .style("fill", "white")
//           .text(function(d) {return "PID: " + d});


//       g.exit().remove();

//       return svg

// }




    // add_line = function(data) {

    //   this.x_scale.domain(d3.extent(data, function(d) { return d.x; }));
    //   this.y_scale.domain(d3.extent(data, function(d) { return d.y; }));

    //   var line_function = d3.line()
    //      .x(function(d) { return this.x_scale(d.x) })
    //      .y(function(d) { return this.y_scale(d.y) });

    //   var path = svg.append("path")
    //    .attr("d", line_function(data))
    //    .attr("stroke", this.theme[this.line_count % 9])
    //    .attr("stroke-width", 2)
    //    .attr("fill", "none");

    //   this.line_count = this.line_count + 1;

    // }
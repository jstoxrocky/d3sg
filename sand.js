$(document).ready(function(){


	var data = [4, 8, 15, 16, 23, 42, 32, 45, 32, 67, 4, 7, 56, 32];



	var margin = {top: 20, right: 30, bottom: 40, left: 40}
    var width = 960 - margin.left - margin.right
    var height = 500 - margin.top - margin.bottom;

	var bar_width = width/data.length;

	var x_scale = d3.scale.linear()
		.domain([0, data.length])
		.range([0, width]);

	var y_scale = d3.scale.linear()
		    .domain([0, d3.max(data)])
		    .range([height, 0]);

	var chart = d3.select('.chart')
					.attr('width', width + margin.left + margin.right)
					.attr('height', height + margin.top + margin.bottom)
					.style('background-color','#AEEEEE');

	var global_g = chart.append('g')
			.attr('transform', 'translate('+margin.left+','+margin.right+')')

	var line = d3.svg.line()
	    .x(function(d, i) { return x_scale(i); })
	    .y(function(d) { return y_scale(d); });

	global_g.append("path")
		.datum(data)
		.attr('class','line')
      	.attr("d", line);




	// BAR //////////////////////////////////////////////////////



	// var global_bar_group = chart.append('g')
	// 					.attr('transform', 'translate('+margin.left+','+margin.right+')');



	// var local_bar_group = global_bar_group.selectAll('g')
	// 					.data(data).enter()
	// 					.append('g');

	// var bars = local_bar_group.append('rect');

	// var bars_attributes = bars
	// 						.attr('width', bar_width - 1)
	// 						.attr('x', function(d, i) {return x_scale(i)})
	// 						.attr('y', function(d) {return y_scale(d)})
	// 						.style('fill','steelblue')
	// 						.attr('height', function(d) {return height - y_scale(d)});

	// var text = local_bar_group.append('text')
	// 				.attr('y', function(d) {return y_scale(d)})
	// 				.attr("dy", "1.25em")
	// 				.text(function(d) {return d})
	// 				.style("text-anchor", "middle")
	// 				.attr('x', function(d, i) {return bar_width/2 + x_scale(i)});


	var x_axis = d3.svg.axis()
	    .scale(x_scale)
	    .orient("bottom");

	var y_axis = d3.svg.axis()
	    .scale(y_scale)
	    .orient("left");

	global_g.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(x_axis);

	global_g.append("g")
	    .attr("class", "y axis")
	    .attr("transform", "translate(0,0)")
	    .call(y_axis);


    function draw(val){

        var p = global_g.append("text")
	        .attr('y', '100')
			.text('Joey')
			.attr('x', '100');

    }


});

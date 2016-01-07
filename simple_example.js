$(document).ready(function(){


	//------------------------------------------------------------------------------//
	// GET YOUR DATA
	//------------------------------------------------------------------------------//
	function new_random_walk_data_point(y) {
		final_val = y.slice(-1)[0]; 
		if (Math.random() < 0.5) {rand_sign = -1} else {rand_sign = 1}
		val_to_push = final_val + Math.random()*100*rand_sign
		return val_to_push
	}
	// X axis values
	x = d3.time.day.range(new Date(2013, 2, 1), new Date(2014, 2, 6))
	// Y axis values (random walk)
	y = [200]
	for (var i=0; i < x.length; i++) {
		x[i] = x[i].toISOString().substring(0, 10);
		y.push(new_random_walk_data_point(y))
	}
	y2 = [-200]
	for (var i=0; i < x.length; i++) {
		y2.push(new_random_walk_data_point(y2))
	}

	//------------------------------------------------------------------------------//
	// CREATE CHART
	//------------------------------------------------------------------------------//
	ch = new chart("#ch1");
	ch.line(x, y, 'Three Month');
	ch.line(x, y2, 'Six Month');
	ch.set_title("Three and Six Month T-Bill Prices");
	ch.set_subtitle("The price of the three and six month T-Bills appear to follow a random walk.");
	ch.set_ylabel("(USD)");

});

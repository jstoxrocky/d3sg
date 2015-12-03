$(document).ready(function(){

	function new_random_walk_data_point(y) {
		final_val = y.slice(-1)[0]; 
		if (Math.random() < 0.5) {rand_sign = -1} else {rand_sign = 1}
		val_to_push = final_val + Math.random()*100*rand_sign
		return val_to_push
	}

	// X axis values
	x = d3.time.day.range(new Date(2013, 2, 1), new Date(2013, 3, 5))


	// Y axis values (random walk)
	y = [200.0]
	for (var i=0; i < x.length; i++) {
		x[i] = x[i].toISOString().substring(0, 10);
		y.push(Math.abs(new_random_walk_data_point(y)))
	}

	y.splice(-1,1)

	ch = new chart("#ch1");
	ch.bar(x, y, 'Three Month', 25);
	ch.set_title("Three and Six Month T-Bill Prices");
	ch.set_subtitle("The price of the three and six month T-Bills appear to follow a random walk.");
	ch.set_ylabel("(USD)");

});

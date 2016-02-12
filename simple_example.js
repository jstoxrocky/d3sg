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
	x = d3.time.day.range(new Date(2013, 2, 1), new Date(2013, 4, 6))
	for (var i=0; i < x.length; i++) {
		x[i] = x[i].toISOString().substring(0, 10);
	}

	function rand_y() {
		y = [200]
		for (var i=0; i < x.length; i++) {
			y.push(new_random_walk_data_point(y))
		}
		return y
	}

	//------------------------------------------------------------------------------//
	// CREATE CHART
	//------------------------------------------------------------------------------//
	ch1 = new chart("#ch1");
	ch1.line(x, rand_y(), 'Three Month');
	ch1.line(x, rand_y(), 'Six Month');
	ch1.set_title("Three and Six Month T-Bill Prices");
	ch1.set_subtitle("The price of the three and six month T-Bills appear to follow a random walk.");
	ch1.set_ylabel("(USD)");

	ch2 = new chart("#ch2");
	ch2.line(x, rand_y(), 'Eight Month');
	ch2.line(x, rand_y(), 'Twelve Month');
	ch2.set_title("Eight and Twelve Month T-Bill Prices");
	ch2.set_subtitle("The price of the eight and twelve month T-Bills appear to follow a random walk.");
	ch2.set_ylabel("(USD)");

	ch3 = new chart("#ch3");
	ch3.line(x, rand_y(), 'Two Year');
	ch3.line(x, rand_y(), 'Three Year');
	ch3.set_title("Two and Three Year T-Bill Prices");
	ch3.set_subtitle("The price of the two and three year T-Bills appear to follow a random walk.");
	ch3.set_ylabel("(USD)");

	ch4 = new chart("#ch4");
	ch4.line(x, rand_y(), 'Five Year');
	ch4.line(x, rand_y(), 'Ten Year');
	ch4.set_title("Five and Ten Year T-Bill Prices");
	ch4.set_subtitle("The price of the five and ten year T-Bills appear to follow a random walk.");
	ch4.set_ylabel("(USD)");



});

$(document).ready(function(){

	function new_random_walk_data_point(y) {
		final_val = y.slice(-1)[0]; 
		if (Math.random() < 0.5) {rand_sign = -1} else {rand_sign = 1}
		val_to_push = final_val + Math.random()*100*rand_sign
		return val_to_push
	}

	// X axis values
	x1 = d3.time.day.range(new Date(2013, 2, 1), new Date(2013, 5, 6))

	// Y axis values (random walk)
	y1 = [25.12]
	y2 = [25.12]
	for (var i=0; i < x1.length; i++) {
		y1.push(new_random_walk_data_point(y1))
		y2.push(new_random_walk_data_point(y2))
	}

	ch = new chart("#ch1");
	ch.line(x1, y1, 'three_month');
	ch.line(x1, y2, 'six_month');
	ch.set_title("Three and Six Month T-Bill Prices");
	ch.set_subtitle("The price of the three and six month T-Bills appear to follow a random walk.");
	ch.set_ylabel("(USD)");


	i = 1;
    function moar_data() {

			x1 = d3.time.day.range(new Date(2013, 2, 1), new Date(2013, 5, 6 + i))
        	y1.push(new_random_walk_data_point(y1))
        	y2.push(new_random_walk_data_point(y2))
            ch.update_line(x1, y1, 'three_month')
            ch.update_line(x1, y2, 'six_month')
            i = i + 1
            setTimeout(moar_data, 1000)
    };

   	moar_data()



});

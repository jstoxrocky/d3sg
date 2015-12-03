$(document).ready(function(){

	function new_random_walk_data_point(y) {
		final_val = y.slice(-1)[0]; 
		if (Math.random() < 0.5) {rand_sign = -1} else {rand_sign = 1}
		val_to_push = final_val + Math.random()*100*rand_sign
		return val_to_push
	}

	// X axis values
	x = d3.time.day.range(new Date(2013, 2, 1), new Date(2013, 5, 6))

	// Y axis values (random walk)
	y1 = [200.00]
	y2 = [-200.00]
	for (var i=0; i < x.length; i++) {
		x[i] = x[i].toISOString().substring(0, 10);
		y1.push(new_random_walk_data_point(y1))
		y2.push(new_random_walk_data_point(y2))
	}

	ch = new chart("#ch1");
	ch.line(x, y1, 'Three Month');
	ch.line(x, y2, 'Six Month');
	ch.set_title("Three and Six Month T-Bill Prices");
	ch.set_subtitle("The price of the three and six month T-Bills appear to follow a random walk.");
	ch.set_ylabel("(USD)");

	i = 1;
    function moar_data() {

			x = d3.time.day.range(new Date(2013, 2, 1), new Date(2013, 5, 6 + i))



			for (var j=0; j< x.length; j++) {
				x[j] = x[j].toISOString().substring(0, 10);
			}

        	y1.push(new_random_walk_data_point(y1))
        	y2.push(new_random_walk_data_point(y2))
            ch.update_line(x, y1, 'Three Month')
            ch.update_line(x, y2, 'Six Month')
            i = i + 1
            setTimeout(moar_data, 1000)
    };

   	moar_data()



});

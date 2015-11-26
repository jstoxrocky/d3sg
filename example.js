$(document).ready(function(){

	title = "Three and Six Month T-Bill Prices"
	subtitle = "The price of the three and six month T-Bills appear to follow a random walk."
	ylabel = "(USD)"
	ch_loc = "#ch1";

	x1 = d3.time.day.range(new Date(2013, 2, 1), new Date(2013, 2, 6))
	y1 = [Math.random()*100, Math.random()*100, Math.random()*100, Math.random()*100, Math.random()*100]
	y2 = [Math.random()*100, Math.random()*100, Math.random()*100, Math.random()*100, Math.random()*100]


	ch = new chart(ch_loc);
	ch.line(x1, y1, 'three_month');
	ch.line(x1, y2, 'six_month');
	ch.set_title(title);
	ch.set_subtitle(subtitle);
	ch.set_ylabel(ylabel);
	

	function new_random_walk_data_point(y) {
		final_val = y.slice(-1)[0]; 
		if (Math.random() < 0.5) {rand_sign = -1} else {rand_sign = 1}
		val_to_push = final_val + Math.random()*100*rand_sign
		return val_to_push
	}


	i = 1;
    function moar_data() {

			x1 = d3.time.day.range(new Date(2013, 2, 1), new Date(2013, 2, 6 + i))
        	y1.push(new_random_walk_data_point(y1))
        	y2.push(new_random_walk_data_point(y2))

            ch.update_line(x1, y1, 'three_month')
            ch.update_line(x1, y2, 'six_month')

            i = i + 1
            setTimeout(moar_data, 1000)
    };

   	moar_data()



});

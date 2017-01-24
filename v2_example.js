$(document).ready(function(){

	n_obs = 3;
	n_lines = 3;

	function get_data(n) {
		data = []
		y = 500
		for (var i=0; i < n; i++) {
			if (Math.random() < 0.5) {rand_sign = -1} else {rand_sign = 1}
			data.push({'x':i*15, 'y':y});
			y = y + Math.random()*10*rand_sign
		}
		return data
	}

	

	var ch = chart()
	for (var i=0; i < n_lines; i++) {
		ch.add_line(get_data(n_obs))
	}

	$('#ch1').append(ch.svg.node())



});
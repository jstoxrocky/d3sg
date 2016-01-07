<h1>d3sg.js</h1>

Simple Example
https://jsfiddle.net/3ov5rggx/

Updating Example
https://jsfiddle.net/8wczsbru/

**(1) Create a new chart object**</br>*(id of chart location required)*

  	ch = new chart('#put_chart_here')
  	
**(2) Add lines**</br>*(x and y array-like, labels required)*

	ch.line(x1, y1, 'series_1')
	ch.line(x1, y2, 'series_2')

**(3) Add Titles, Subtitles, and Labels**
	
	ch.set_title('My Chart Title')
	ch.set_subtitle('My chart has a subtitle and this is it.')
	ch.set_ylabel('y-axis label')

**(4) Update lines in real time!**

  	ch.update_line(x1_new_data, y1_new_data, 'series_1')
  	ch.update_line(x1_new_data, y1_new_data, 'series_2')
	


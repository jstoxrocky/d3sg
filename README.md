<h1>d3sg.js</h1>


**(1) Create a new chart object**</br>*(id of chart location required)*

  	ch = new chart('#put_chart_here')
  	
**(2) Add lines**</br>*(x and y array-like, labels required)*

	ch.line(x1, y1, 'series_1')
	ch.line(x1, y2, 'series_2')

**(3) Add Titles, Subtitles, and Labels**
	
	ch.set_title('My Chart Title')
	ch.set_subtitle('My chart has a subtitle and this is it.')
	ch.set_ylabel('y-axis label')

** And thats it!! **
	
On top of this, d3sg.js can update charts in real time, unlike tsg:

  	ch.update_line(x1, y1, 'series_1')
  	ch.update_line(x1, y2, 'series_2')
	


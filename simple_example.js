$(document).ready(function(){

	var x = ["2013-02-01", "2013-02-02", "2013-02-03", "2013-02-04", "2013-02-05", "2013-02-06", "2013-02-07", "2013-02-08", "2013-02-09", "2013-02-10", "2013-02-11", "2013-02-12", "2013-02-13", "2013-02-14", "2013-02-15", "2013-02-16", "2013-02-17", "2013-02-18", "2013-02-19", "2013-02-20", "2013-02-21", "2013-02-22", "2013-02-23", "2013-02-24", "2013-02-25", "2013-02-26", "2013-02-27", "2013-02-28", "2013-03-01", "2013-03-02", "2013-03-03", "2013-03-04", "2013-03-05", "2013-03-06", "2013-03-07", "2013-03-08", "2013-03-09", "2013-03-10", "2013-03-11", "2013-03-12", "2013-03-13", "2013-03-14", "2013-03-15", "2013-03-16", "2013-03-17", "2013-03-18", "2013-03-19", "2013-03-20", "2013-03-21", "2013-03-22", "2013-03-23", "2013-03-24", "2013-03-25", "2013-03-26", "2013-03-27", "2013-03-28", "2013-03-29", "2013-03-30", "2013-03-31", "2013-04-01", "2013-04-02", "2013-04-03", "2013-04-04", "2013-04-05"]
	var y1 = [200, 185.11891409289092, 120.53642959799618, 64.42495135124773, 120.55846122093499, 120.79549795016646, 184.82741843909025, 132.85186337307096, 101.81862730532885, 137.14733482338488, 73.17061710637063, 7.173392572440207, 23.66981594823301, 75.32465897966176, 25.255394354462624, -73.00043385475874, -124.81207079254091, -96.48774128872901, -108.06824977044016, -169.76178099866956, -221.09401479829103, -279.54046523664147, -348.67748881224543, -338.2253914140165, -321.9747665338218, -386.43086964730173, -351.3460264308378, -387.63524326495826, -312.11193727795035, -409.75687864702195, -464.7154626203701, -540.9720554482192, -465.2776649687439, -466.4372757775709, -483.3361417753622, -579.9243834801018, -529.7243574168533, -603.4690885571763, -554.7670322004706, -553.4846102353185, -609.0677562169731, -575.49326592125, -610.3244620608166, -528.058459982276, -623.157001985237, -660.6100958772004, -667.5280834082514, -761.2419553101063, -771.0805564885959, -802.6618986623362, -752.9204235645011, -772.6021933602169, -681.7741323495284, -695.6146175041795, -639.8689674213529, -583.8255176553503, -492.58839967660606, -404.02558220084757, -334.3724135076627, -237.84540290944278, -215.57429807726294, -203.75531380996108, -241.05952815152705, -142.34325205907226, -182.69249312579632]
	var y2 = [200, 294.5738941198215, 371.03477439377457, 338.3208450861275, 391.75993115641177, 311.71794035471976, 239.34729385655373, 267.8898532409221, 361.14961148705333, 329.5647405553609, 282.50281591899693, 214.21779212541878, 195.26517898775637, 198.63452846184373, 110.13059096876532, 37.51244351733476, -1.3379818061366677, -33.21769912727177, 22.129954816773534, 7.442299835383892, -46.886448678560555, -69.96222727466375, 21.59100698772818, 70.55687319952995, -7.073004054836929, -60.4400958865881, -85.71870739106089, -117.06936398986727, -153.09880555141717, -129.72376488614827, -109.10184511449188, -88.89744721818715, -91.29815832711756, -84.63607428129762, -170.8381428848952, -108.38743101339787, -191.29550140351057, -179.6884253853932, -87.19571647234261, -183.2931359531358, -231.92876160610467, -224.76586492266506, -187.23773141391575, -262.0577970286831, -293.595078936778, -248.11602944973856, -170.14605950098485, -263.71212389785796, -236.22235683724284, -218.56315245386213, -229.84314169734716, -142.3011550679803, -121.1496627656743, -34.36556672677398, 18.08256332296878, 11.603865725919604, -37.87672044709325, -40.33581691328436, -125.05513534415513, -102.43947093840688, -83.30027114134282, -133.52154372259974, -92.49233773443848, -129.67048787977546, -108.80646619480103]

	ch1 = new chart();
	ch1.line(x, y1, 'Three Month');
	ch1.line(x, y2, 'Six Month');
	ch1.set_title("Three and Six Month T-Bill Prices");
	ch1.set_subtitle("The price of the three and six month T-Bills appear to follow a random walk.");
	ch1.set_ylabel("(USD)");
	$('#ch1').append(ch1.svg.node())

});
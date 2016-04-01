function chart(style_name) {


    ipython_style = {width:1000, height:400, name:'ipython', bg_color:'#f5f5f5'}
    dash_style = {width:800, height:400, name:'dash', bg_color:'#f5f5f5'}


    if (style_name == undefined) {
        this.style = dash_style
    }
    else if (style_name == 'ipython') {
        this.style = ipython_style
    }
    else {
        this.style = dash_style
    }


    this.MARGIN = {top: 80, right: 50, bottom: 50, left: 90};
    this.WIDTH = this.style.width - this.MARGIN.left - this.MARGIN.right;
    this.HEIGHT = this.style.height - this.MARGIN.top - this.MARGIN.bottom;

    format_date = d3.time.format("%Y-%m-%d")
    parseDate = format_date.parse;
    bisectDate = d3.bisector(function(d) { return d.date; }).left;
    this.DATA = []
    this.DATA_DICT = {}
    this.LINE_DICT = {}
    this.LINE_NUM = 0
    this.LEGEND_NUM = 0
    this.LABEL_DICT = {}
    this.label_colors = {}


    this._LOLLIPOP = [  {"color":"#5DA5DA","alpha":1,'linestyle':'-'},
              {"color":"#FAA43A","alpha":1,'linestyle':'-'},
              {"color":"#60BD68","alpha":1,'linestyle':'-'},
              {"color":"#F17CB0","alpha":1,'linestyle':'-'},
              {"color":"#B2912F","alpha":1,'linestyle':'-'},
              {"color":"#B276B2","alpha":1,'linestyle':'-'},
              {"color":"#DECF3F","alpha":1,'linestyle':'-'},
              {"color":"#F15854","alpha":1,'linestyle':'-'},
              {"color":"#4D4D4D","alpha":1,'linestyle':'-'},]

    // this._LOLLIPOP = shuffleArray(this._LOLLIPOP)


    this._create_canvas = function() {

        this.svg = d3.select(document.createElementNS(d3.ns.prefix.svg, 'svg'))
            .attr("width", this.WIDTH + this.MARGIN.left + this.MARGIN.right)
            .attr("height", this.HEIGHT + this.MARGIN.top + this.MARGIN.bottom)
            .attr("class","chart");

        this.svg.append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", this.style.bg_color);

        this.g = this.svg.append("g")
            .attr("transform", "translate(" + this.MARGIN.left + "," + this.MARGIN.top + ")");
    }


    this._create_data_for_d3 = function (x, y, underscore_label, label, kwargs) {
        var color_scheme = this._LOLLIPOP;
        var pct_chng = []
        $.each(y, function( index, value ) {
            try {
                prev_val = y[index-7];
            }
            catch(err) {
                prev_val = 1;
            }
            curr_pct_chng = 100*(value - prev_val) / prev_val
            pct_chng.push(curr_pct_chng)
            prev_val = value
        });


        // Put in correct format
        this.DATA = []
            for (var i = 0; i < x.length; i += 1) {
                var current_dict = {};
                current_dict['y'] = y[i];
                current_dict['x'] = x[i];
                current_dict['delta'] = pct_chng[i];
                this.DATA.push(current_dict);
            }

        


        // X scale different for line and bar charts. You can find the x_scale 
        // in the this.line and this.bar chart methods
        y_scale = d3.scale.linear().range([this.HEIGHT, 0]);

        color_num = this.LINE_NUM % 9;

        if (kwargs['color_from'] == undefined) {
            var _color = color_scheme[color_num]["color"]
        }
        else {
            var _color = this.DATA_DICT[kwargs['color_from']]["color"]
        }

        this.DATA_DICT[underscore_label] = {"label":label, "values": this.DATA, "alpha":kwargs['alpha'], "color":_color}

    }


    this._scale_data = function(underscore_label) {

        var data_dict = this.DATA_DICT

        // console.log(data_dict)
        
        var curr_max = -1000000;
        var curr_min = 1000000;
        $.each(data_dict, function( index, value ) {
            
            var new_max = d3.max(data_dict[index]["values"], function(d) { return d.y; })
            var new_min = d3.min(data_dict[index]["values"], function(d) { return d.y; })

            if (new_max >= curr_max) {
                curr_max = new_max;
            }
            if (new_min < curr_min) {
                curr_min = new_min;
            }
        });

        delta = curr_max - curr_min

        var current_data = this.DATA_DICT[underscore_label]["values"]
        x_scale.domain(d3.extent(current_data, function(d) { return d.x; }));
        // change this to legend num
        y_scale.domain([curr_min - 0.1*delta, curr_max + 0.1*delta*this.LEGEND_NUM]);


    }


    this._draw_line = function(underscore_label, label) {


        this.g.selectAll("path").remove();

        var current_g = this.g;
        var color_scheme = this._LOLLIPOP;
        var line_num = 0;
        var data_dict = this.DATA_DICT
        var line_dict= this.LINE_DICT
        var index = underscore_label
        var svg = this.svg
        var _draw_nodes = this._draw_nodes

        parent_this = this

        this.g.selectAll('.node').remove()
        // console.log(a)
        $.each(data_dict, function( index, value ) {

            // Have colors loop
            line_num = line_num % 9;

            var valueline = d3.svg.line()
                .x( function(d) { return x_scale(d.x); })
                .y( function(d) { return y_scale(d.y); });

            line_dict[index] = valueline

            current_g.append("path")
                .attr("d", valueline(data_dict[index]["values"]))
                .style("stroke",data_dict[index]["color"])
                .style("opacity", data_dict[index]["alpha"])
                .style("stroke-width", 2)
                .attr("id",index)
                .attr("class","line")
                .on("mouseover", function() {d3.select(this).transition().style("stroke-width", 4);})
                .on("mouseout", function() {d3.select(this).transition().style("stroke-width", 2);});

            _draw_nodes(parent_this, index, line_num)
            line_num = line_num + 1



        });



    }
    




    this._draw_nodes = function(parent_this, index, line_num) {

        var current_g = parent_this.g;
        var data_dict = parent_this.DATA_DICT
        var _mouseover_node = parent_this._mouseover_node
        var _mousemove_node = parent_this._mousemove_node
        var _mouseout_node = parent_this._mouseout_node

        var nodes = current_g.selectAll('circle.node')
                .data(data_dict[index]["values"])
                .enter().append('g')
                .attr('class', 'node');

        nodes.append("circle")
              .attr('cx', function(d) {return x_scale(d.x);})
              .attr('cy', function(d) {return y_scale(d.y);})
              .attr('r', 3)
              .style("fill", data_dict[index]["color"])
              .style("opacity", data_dict[index]["alpha"])
              .on("mouseover", function(d) {_mouseover_node(d3.select(this), d, data_dict[index]["label"], data_dict[index]["color"]);})
              .on("mousemove", function() {_mousemove_node(d3.select(this))})
              .on("mouseout", function() {_mouseout_node(d3.select(this))});

        }



    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .attr("class", "tip")
        .style("z-index", "10")
        .style("visibility", "hidden");
    
    var tip_head = tooltip
        .append("div")
        .attr("class", "tip_head");

    var tip_mid = tooltip
        .append("div")
        .attr("class", "tip_mid");

    var tip_foot = tooltip
        .append("div")
        .attr("class", "tip_foot");

    var tip_foot2 = tooltip
        .append("div")
        .attr("class", "tip_foot2");


    this._mouseover_node = function(node, d, label, color) {

        day_of_week_map = {0:'Sunday', 1:'Monday', 2:'Tuesday', 3:'Wednesday', 4:'Thursday', 5:'Friday', 6:'Saturday'}
        y_rounded = Math.round(d.y * 100) / 100;
        delta_rounded = Math.round(d.delta * 100) / 100;
        if (delta_rounded >= 0) {wow_color = "#458B00"} else {wow_color = "#CD2626"}
        x_date = format_date(d.x) + " (" + day_of_week_map[d.x.getDay()] + ")";
        text_to_display = y_rounded


        node.transition().attr("r", 6)

        tooltip
            .style("visibility", "visible");
        tip_head
            .text(label);
        tip_mid
            .text(x_date);
        tip_foot
            .style("color", color)
            .text("Value: " + text_to_display);
        tip_foot2
            .style("color", wow_color)
            .text("WoW: " + delta_rounded + "%");

        return tooltip
    }
    this._mouseout_node = function(node) {
        node.transition().attr("r", 3);
        return tooltip.style("visibility", "hidden");
    }
    this._mousemove_node = function(node) {
        return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
    }




    this._draw_bar = function(label, bar_width) {

        // this.g.selectAll("rect").remove();

        var current_g = this.g;
        var svg = this.svg
        var color_scheme = this._LOLLIPOP;
        var line_num = 0;
        var data_dict = this.DATA_DICT
        var line_dict= this.LINE_DICT
        var margin = this.MARGIN
        var height = this.HEIGHT
        var index = label
        var width = this.WIDTH

        n_series = Object.keys(data_dict).length
        current_g.selectAll(".bar").remove();

        $.each(data_dict, function( index, value ) {

            // Have colors loop
            line_num = line_num % 9;
            bar_width = width / (n_series*data_dict[index]["values"].length) - 0.5
            bar_width = bar_width / n_series

            var bar = current_g.selectAll("rect.bar")
                .data(data_dict[index]["values"])
              .enter().append("g")
                .attr("transform", function(d, i) {return "translate(" + (bar_width*line_num + x_scale(d.x) - bar_width/2) +  ", " + (y_scale(d.y)) + ")"; })
                .attr("class","bar");

            bar.append("rect")
                .attr("height", function(d) { return height - y_scale(d.y); })
                .attr("width", bar_width)
                .style("stroke-width",0)
                .style("fill",color_scheme[line_num]["color"])
                .on("mouseover", function(d) {d3.select(this).style("opacity", 0.5);})
                .on("mouseout", function(d) {d3.select(this).style("opacity", 1);});

            line_num = line_num + 1

        });
        
    }


    this._add_axes = function() {


        this.svg.selectAll('g.axis').remove()

        xAxis = d3.svg.axis().scale(x_scale)
            .orient("bottom").ticks(10)
            .tickFormat(format_date);;
        yAxis = d3.svg.axis().scale(y_scale)
            .orient("left").ticks(7);

        var dateTicks = this.g.append("g") // Add the X Axis
            .attr("class", "axis")
            .attr("transform", "translate(0," + this.HEIGHT + ")")
            .call(xAxis)
            .selectAll('.tick');


        // Hacky solution
        // Edit the number 2 int he future to be more responsive
        for (var j = 0; j < dateTicks[0].length; j++) {
            var c = dateTicks[0][j]
            if (j%2 != 0) {
                d3.select(c).remove();
            }
        }





        this.g.append("g") // Add the Y Axis
            .attr("class", "axis")
            .call(yAxis);
    }


    this.line = function(x, y, label, kwargs) {

        var underscore_label = label//'series_' + this.LINE_NUM;

        if (label == undefined) {label = underscore_label};
        if (kwargs == undefined) {
            kwargs = {}
            kwargs['alpha']=1;
            kwargs['add_legend']=true;
        };

        var color_scheme = this._LOLLIPOP;
        this.LABEL_DICT[label] = underscore_label;



        this._create_data_for_d3(x, y, underscore_label, label, kwargs);
        // Line
        this.DATA.forEach(function(d) {d.x = parseDate(d.x)});
        x_scale = d3.time.scale().range([0, this.WIDTH]); // Line
        this._scale_data(underscore_label);
        this._add_grid_lines();
        this._draw_line(underscore_label, label);
        this._add_axes();
        if (kwargs['add_legend']) {this._add_legend(label);}
        if (kwargs['color_from'] == undefined) {this.LINE_NUM = this.LINE_NUM + 1;}
        

    }



    this.bar = function(x, y, label, bar_width) {



        if (bar_width == undefined){
            bar_width=2
        }

        var underscore_label = 'series_' + this.LINE_NUM;
        if (label == undefined) {label = underscore_label};
        this.LABEL_DICT[label] = underscore_label;

        this._create_data_for_d3(x, y, underscore_label);
        // Bar
        this.DATA.forEach(function(d) {
            split_x = d.x.split("-")
            d.x = new Date(Date.UTC(split_x[0],split_x[1]-1,split_x[2],0,0,0));
        });
        x_scale = d3.time.scale().range([width/this.DATA.length/2, width-width/this.DATA.length/2]); // Bar

        this._scale_data(underscore_label);
        this._add_grid_lines();

        this._draw_bar(underscore_label, bar_width);
        
        this._add_axes();
        this._add_legend(label);
        this.LINE_NUM = this.LINE_NUM + 1;

    }




    this._add_default_title = function() {
        
        if (this.style.name == 'ipython') {
            this.g.append("foreignObject")
                .attr("class", "externalObject")
                .attr("x", 0)
                .attr("y", 0 - (this.MARGIN.top)/1.4)
                .html("<input type='text' id='title_input' placeholder='Click to Add a Chart Title.' class='horizontal_inputs chart_input' style='box-shadow:none;'></input>");
        }
        else {
        var title = "ch.set_title('My Title')"
            this.g.append("text")
             .attr("id","title")
             .attr("x", 0)
             .attr("y", 0 - (this.MARGIN.top / 2))
             .attr("font-family","sans-serif")
             .style("font-size", "18px")
             .style("font-weight", "bold")
             .text(title);
        }
    }


    this.set_title = function(title) {
        title_obj = this.g.select("#title");
        title_obj.html(title);
    }


    this._add_default_subtitle = function() {
        if (this.style.name == 'ipython') {
            this.g.append("foreignObject")
                .attr("class", "externalObject ")
                .attr("x", 0)
                .attr("y", 0 - (this.MARGIN.top)/2.3)
                .html("<input type='text' id='subtitle_input' placeholder='Click to add chart subtitle.' class='horizontal_inputs chart_input' style='box-shadow:none;'></input>");
        }
        else {
            var subtitle = "ch.set_subtitle('This is my default subtitle')"
            this.g.append("text")
                .attr("id","subtitle")
                .attr("x", 0)
                .attr("y", 0 - (this.MARGIN.top / 4))
                .attr("font-family","sans-serif")
                .style("font-size", "14px")
                .text(subtitle);
        }
    }


        




    
    this.set_subtitle = function(subtitle) {
        title_obj = this.g.select("#subtitle");
        title_obj.html(subtitle);
    }


    this._add_grid_lines = function(subtitle) {

        this.svg.selectAll("g.grid").remove();

        function make_x_axis() {
            return d3.svg.axis()
            .scale(this.x_scale)
            .orient("bottom")
            .ticks(15)
        }
        function make_y_axis() {
            return d3.svg.axis()
            .scale(this.y_scale)
            .orient("left")
            .ticks(8)
        }

        this.g.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0," + this.HEIGHT + ")")
            .call(make_x_axis()
            .tickSize(-this.HEIGHT, 0, 0)
            .tickFormat("")
        )
        this.g.append("g")
            .attr("class", "grid")
            .call(make_y_axis()
            .tickSize(-this.WIDTH, 0, 0)
            .tickFormat("")
        )
    }


    this._add_default_ylabel = function() {
        if (this.style.name == 'ipython') {
            this.g.append("foreignObject")
                .attr("class", "externalObject")
                .attr("y", 0 - this.MARGIN.left/1.3) // minus goes left
                .attr("x", 0 - ((this.MARGIN.top + this.MARGIN.bottom + this.HEIGHT)/2.2)) // minus goes down 
                .html("<input type='text' id='ylabel_input' placeholder='Click to add label' class='chart_input' style='box-shadow:none;'></input>")
                .attr("transform", "rotate(-90)");
        }
        else {
            this.svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 + this.MARGIN.left/4) // minus goes left
                .attr("x", 0 - ((this.MARGIN.top + this.MARGIN.bottom + this.HEIGHT)/2)) // minus goes down 
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .attr("id","ylabel")
                .text("ch.set_ylabel('My Label')");
        }
    }
    this.set_ylabel = function(ylabel) {
        label_obj = this.svg.select("#ylabel");
        label_obj.html(ylabel);
    }






    this._add_default_xlabel = function() {
        if (this.style.name == 'ipython') {
            this.g.append("foreignObject")
                .attr("class", "externalObject")
                .attr("y", (this.HEIGHT + 25))
                .attr("x", (this.WIDTH - 305 - 300))
                .html("<input type='text' id='xlabel_input' placeholder='Click to add label' class='chart_input' style='box-shadow:none;'></input>");
        }
        else {
            this.svg.append("text")
                .attr("y", (this.HEIGHT + this.MARGIN.top))
                .attr("x", (this.MARGIN.left + this.MARGIN.right + this.WIDTH) / 2)
                .attr("dy", "3em")
                .style("text-anchor", "middle")
                .attr("id","xlabel")
                .text("ch.set_xlabel('My Label')");
        }
    }
    this.set_xlabel = function(ylabel) {
        label_obj = this.svg.select("#xlabel");
        label_obj.html(ylabel);
    }













    this.update_line = function(x, y, label) {

            // var underscore_label = 'series_' + this.LINE_NUM;
            // if (label == undefined) {label = underscore_label};


            underscore_label = this.LABEL_DICT[label];

            line_dict = this.LINE_DICT
            valueline = line_dict[underscore_label]

            this._create_data_for_d3(x, y, underscore_label);
            this._scale_data(underscore_label);
            data = this.DATA_DICT[underscore_label]
            // Select the section we want to apply our changes to
            // var svg = d3.select(this.chart_location).transition();
            // Make the changes


            svg.select('#'+underscore_label)
                .duration(750)
                .attr("d", valueline(data));
            svg.select(".x.axis")
                .duration(750)
                .call(xAxis);
            svg.select(".y.axis")
                .duration(750)
                .call(yAxis);

    }


    this._add_legend = function(label) {

        var line_num = this.LINE_NUM % 9;
        
        this.svg.append("text")
            .attr("y", this.LEGEND_NUM*15 + this.MARGIN.top) // adding goes down
            .attr("x", 30 + 1.5*this.MARGIN.left) // minus goes down 
            .attr("dy", "0.3em")
            .style("text-anchor", "left")
            .attr("id","ylabel")
            .text(label);

        this.svg.append("line")
            .attr("x1", 0 + 1.5*this.MARGIN.left) // minus goes down 
            .attr("x2", 25 + 1.5*this.MARGIN.left) // minus goes down 
            .attr("y1", this.LEGEND_NUM*15 + this.MARGIN.top) // adding goes down
            .attr("y2", this.LEGEND_NUM*15 + this.MARGIN.top)
            .attr("stroke-width", 2)
            .attr("stroke", this._LOLLIPOP[line_num]["color"]); // adding goes down
        this.LEGEND_NUM = this.LEGEND_NUM+1

    }



    
    this._create_canvas();
    this._add_default_title();
    this._add_default_subtitle();
    this._add_default_ylabel();
    this._add_default_xlabel();








    
};

Date.prototype.addDays = function(days)
{
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}


function chart(style_name, gif) {


    ipython_style = {width:1000, height:400, name:'ipython', bg_color:'#f5f5f5'}
    ipython_report_style = {width:1000, height:400, name:'ipython_report', bg_color:'#f5f5f5'}
    dash_style = {width:800, height:400, name:'dash', bg_color:'#f5f5f5'}


    if (style_name == undefined) {
        this.style = dash_style
    }
    else if (style_name == 'ipython') {
        this.style = ipython_style
    }
    else if (style_name == 'ipython_report') {
        this.style = ipython_report_style
    }
    else {
        this.style = dash_style
    }


    this.MARGIN = {top: 80, right: 50, bottom: 50, left: 90};
    this.WIDTH = this.style.width - this.MARGIN.left - this.MARGIN.right;
    this.HEIGHT = this.style.height - this.MARGIN.top - this.MARGIN.bottom;

    format_date = d3.time.format("%Y-%m-%d")
    format_datetime = d3.time.format("%Y-%m-%d %H:%M:%S")
    parseDate = format_date.parse;
    parseDatetime = format_datetime.parse;
    bisectDate = d3.bisector(function(d) { return d.date; }).left;
    this.DATA = []
    this.DATA_DICT = {}
    this.LINE_DICT = {}
    this.LINE_NUM = 0
    this.LEGEND_NUM = 0
    this.LABEL_DICT = {}
    this.label_colors = {}
    this.gif = gif;
    this.setted_ymin
    this.setted_ymax



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
            .style("font", "12px 'Helvetica Neue', Helvetica, Arial, sans-serif");


        if (this.gif == undefined) {

            this.svg.append("rect")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("fill", this.style.bg_color);

        }
        else {

            this.svg.append("defs")
              .append("pattern")
                   .attr("id", "image")
                   .attr('x',"0")
                   .attr('y',"0")
                   .attr('height',"100%")
                   .attr('width',"100%")
                        .append("image")
                      .attr('x',"0")
                        .attr('y',"0")
                        .attr('height',"100%")
                      .attr('width',"100%")
                        .attr("xlink:href", this.gif);

            this.svg.append("rect")
                .attr("width", "100%")
                .attr("height", "100%")
                 .style("fill", "url(#image)");

            this.svg.append("rect")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("fill", this.style.bg_color)
                .style("opacity", 0.7);

        }

        this.g = this.svg.append("g")
                .attr("transform", "translate(" + this.MARGIN.left + "," + this.MARGIN.top + ")");

    }


    this._create_data_for_d3 = function (data_args, underscore_label, label, kwargs, is_area) {


        var x = data_args['x'];
        var y = data_args['y'];
        var y_bottom = data_args['y_bottom'];


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
                if (y_bottom != undefined) {current_dict['y_bottom'] = y_bottom[i]};
                current_dict['x'] = x[i];
                current_dict['delta'] = pct_chng[i];
                this.DATA.push(current_dict);
                if (kwargs['x_tick_labels'] != undefined) {current_dict['tick_label'] = kwargs["x_tick_labels"][i]};
            }

        


        // X scale different for line and bar charts. You can find the x_scale 
        // in the this.line and this.bar chart methods
        y_scale = d3.scale.linear().range([this.HEIGHT, 0]);


        color_num = this.LINE_NUM % 9;

        var _color = kwargs['color_from'] || kwargs['color'];


        if (!_color) {
            var _color = color_scheme[color_num]["color"]
        }

        if (is_area) {
            return {"label":label, "values": this.DATA, "alpha":kwargs['alpha'], "color":_color, "dashed":kwargs['dashed']}
        }
        this.DATA_DICT[underscore_label] = {"label":label, "values": this.DATA, "alpha":kwargs['alpha'], "color":_color, "dashed":kwargs['dashed']}
        if (kwargs['url'] != undefined) {this.DATA_DICT[underscore_label]['url'] = kwargs['url']};
    }




    this._scale_numerical_y_data = function(underscore_label) {
        var data_dict = this.DATA_DICT
        var y_curr_max = -1000000;
        var y_curr_min = 1000000;

        var bottom_line = 'y_bottom'
        $.each(data_dict, function( index, value ) {

            var y_new_max = d3.max(data_dict[index]["values"], function(d) { return d.y; })
            var y_new_min = d3.min(data_dict[index]["values"], function(d) { if (d.y_bottom != undefined) {return d.y_bottom} else {return d.y}; })
            if (y_new_max >= y_curr_max) {y_curr_max = y_new_max;}
            if (y_new_min < y_curr_min) {y_curr_min = y_new_min;}
        });

        delta = y_curr_max - y_curr_min
        
        var thing_to_control_for_homogenous_data = 0
        if (y_curr_min - 0.1*delta == y_curr_max + 0.1*delta*this.LEGEND_NUM) {
            thing_to_control_for_homogenous_data = 0.1*y_curr_min // happens a lot with median data
        }

        if (this.setted_ymin == undefined) {
            ymin = y_curr_min - 0.1*delta - thing_to_control_for_homogenous_data;
        } else {
            ymin = this.setted_ymin
        }
        if (this.setted_ymax == undefined) {
            ymax = y_curr_max + 0.1*delta*this.LEGEND_NUM + thing_to_control_for_homogenous_data;
        } else {
            ymax = this.setted_ymax
        }

        y_scale.domain([ymin, ymax]);

        this.calc_ymin = ymin;
        this.calc_ymax = ymax;

        // y_scale.domain([0, 300]); // JOEY EDIT

    }


    this._scale_numerical_x_data = function(underscore_label) {
        var data_dict = this.DATA_DICT
        var x_curr_max = -1000000;
        var x_curr_min = 1000000;
        $.each(data_dict, function( index, value ) {
            var x_new_max = d3.max(data_dict[index]["values"], function(d) { return d.x; })
            var x_new_min = d3.min(data_dict[index]["values"], function(d) { return d.x; })
            if (x_new_max >= x_curr_max) {x_curr_max = x_new_max;}
            if (x_new_min < x_curr_min) {x_curr_min = x_new_min;}
        });
        x_scale.domain([x_curr_min, x_curr_max]);
    }

    this._scale_numerical_x_data_for_bar = function(underscore_label) {
        var data_dict = this.DATA_DICT
        var x_curr_max = -1000000;
        var x_curr_min = 1000000;
        $.each(data_dict, function( index, value ) {
            var x_new_max = d3.max(data_dict[index]["values"], function(d) { return d.x; })
            var x_new_min = d3.min(data_dict[index]["values"], function(d) { return d.x; })
            if (x_new_max >= x_curr_max) {x_curr_max = x_new_max;}
            if (x_new_min < x_curr_min) {x_curr_min = x_new_min;}
        });
        x_scale.domain([x_curr_min, x_curr_max+1]);
    }

    this._scale_date_x_data = function(underscore_label) {
        var current_data = this.DATA_DICT[underscore_label]["values"]
        x_scale.domain(d3.extent(current_data, function(d) { return d.x; }));
    }

    this._scale_date_x_data_for_bar = function(underscore_label) {
        var current_data = this.DATA_DICT[underscore_label]["values"]
        var bar_dates = d3.extent(current_data, function(d) { return d.x; })
        bar_dates[1] = bar_dates[1].addDays(1)
        x_scale.domain(bar_dates);

    }


this._draw_area = function(underscore_label, label, data) {


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
        // $.each(data_dict, function( index, value ) {


            // console.log('b')
            // console.log(data["values"])

            // Have colors loop
            line_num = line_num % 9;

            var valueline = d3.svg.area()
                .defined(function(d) { return d.y != null })
                .x( function(d) { return x_scale(d.x); })
                .y0( function(d) { return y_scale(d.y_bottom); })
                .y1( function(d) { return y_scale(d.y); });

            line_dict[index] = valueline

            current_g.append("path")
                .attr("d", valueline(data["values"]))
                .style("stroke",data["color"])
                .style("opacity", data["alpha"])
                .style('fill', data["color"])
                .style("stroke-width", 2)
                .attr("id",index)
                .attr("class","line")
                .style('fill', data["color"])
                .on("mouseover", function() {d3.select(this).transition().style("stroke-width", 4);})
                .on("mouseout", function() {d3.select(this).transition().style("stroke-width", 2);});

            // _draw_nodes(parent_this, index, line_num)
            line_num = line_num + 1


// 
        // });



    }
    



    // this._draw_area = function(underscore_label, label) {


    //     this.g.selectAll("path").remove();

    //     var current_g = this.g;
    //     var color_scheme = this._LOLLIPOP;
    //     var line_num = 0;
    //     var data_dict = this.DATA_DICT
    //     var line_dict= this.LINE_DICT
    //     var index = underscore_label
    //     var svg = this.svg
    //     var _draw_nodes = this._draw_nodes

    //     parent_this = this

    //     this.g.selectAll('.node').remove()
    //     // console.log(a)
    //     $.each(data_dict, function( index, value ) {

    //         // Have colors loop
    //         line_num = line_num % 9;

    //         var valueline = d3.svg.area()
    //             .x( function(d) { return x_scale(d.x); })
    //             .y0( function(d) { return y_scale(d.y_bottom); })
    //             .y1( function(d) { return y_scale(d.y); });

    //         line_dict[index] = valueline

    //         current_g.append("path")
    //             .attr("d", valueline(data_dict[index]["values"]))
    //             .style("stroke",data_dict[index]["color"])
    //             .style("opacity", data_dict[index]["alpha"])
    //             .style('fill', data_dict[index]["color"])
    //             .style("stroke-width", 2)
    //             .attr("id",index)
    //             .attr("class","line")
    //             // .attr("fill", "none")
    //             .on("mouseover", function() {d3.select(this).transition().style("stroke-width", 4);})
    //             .on("mouseout", function() {d3.select(this).transition().style("stroke-width", 2);});

    //         line_num = line_num + 1





    //     });



    // }

    this.annotate_line = function(x, note) {

        _data = [{'x':x, 'y':this.calc_ymin}, {'x':x, 'y':this.calc_ymax}]

        if (x[0].length > 10) {
            _data.forEach(function(d) {d.x = parseDatetime(d.x)});
            x = parseDatetime(x)
        }
        else {
            _data.forEach(function(d) {d.x = parseDate(d.x)});
            x = parseDate(x)
        }

        var current_g = this.g;

        var lineFunction = d3.svg.line()
                 .x(function(d) { return x_scale(d.x); })
                 .y(function(d) { return y_scale(d.y); })
                 .interpolate("linear");


        var lineGraph = current_g.append("path")
                   .attr("d", lineFunction(_data))
                   .attr("stroke", "darkgrey")
                   .attr("stroke-width", 2)
                   .attr("stroke-dasharray","5,5")
                   .attr("fill", "none");

        var text = current_g.append('text')
                    .attr("x", x_scale(x))
                    .attr("y", y_scale(this.calc_ymax*0.99))
                    .attr("dy", "-0.5em")
                    .style("text-anchor", "end")
                    .attr("transform", "rotate(-90," + x_scale(x) + "," + y_scale(this.calc_ymax*0.99) + ")")
                    .text(note);

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
        $.each(data_dict, function( index, value ) {


            // Have colors loop
            line_num = line_num % 9;

            var valueline = d3.svg.line()
                .defined(function(d) { return d.y != null })
                .x( function(d) { return x_scale(d.x); })
                .y( function(d) { return y_scale(d.y); });

            line_dict[index] = valueline



            current_g.append("path")
                .attr("d", valueline(data_dict[index]["values"]))
                .style("stroke",data_dict[index]["color"])
                .style("opacity", data_dict[index]["alpha"])
                .style("stroke-width", 2)
                .attr("stroke-dasharray","5," + data_dict[index]["dashed"])
                .attr("id",index)
                .attr("class","line")
                .attr("fill", "none")
                .on("mouseover", function() {d3.select(this).transition().style("stroke-width", 4);})
                .on("mouseout", function() {d3.select(this).transition().style("stroke-width", 2);});

            _draw_nodes(parent_this, index, line_num)
            line_num = line_num + 1



        });



    }
    






    this.highlight = function(x1, x2, label, kwargs) {

        if (kwargs == undefined) {
            kwargs = {}
            kwargs['alpha']=0.3;
            kwargs['add_legend']=true;
        };
        if (kwargs['alpha'] == undefined) {kwargs['alpha'] = 0.3;}
        if (kwargs['color'] == undefined) {kwargs['color'] = "#31B94D";}
        if (kwargs['add_legend'] == undefined) {kwargs['add_legend'] = true;}

        if (!this.x_is_numeric &&  !this.x_is_dates) { // string labels\
            kwargs["x_tick_labels"] = x
            x = Array.apply(null, Array(x.length)).map(function (_, i) {return i;});
        }

        _data = [{'x':x1, 'y':this.calc_ymax}, {'x':x2, 'y':this.calc_ymin}]

        if (x1.length > 10) {
            _data.forEach(function(d) {d.x = parseDatetime(d.x)});
            x1 = parseDatetime(x1)
            x2 = parseDatetime(x2)
        }
        else {
            _data.forEach(function(d) {d.x = parseDate(d.x)});
            x1 = parseDate(x1)
            x2 = parseDate(x2)
        }

        var current_g = this.g;

        // var lineFunction = d3.svg.line()
        //          .x(function(d) { return x_scale(d.x); })
        //          .y(function(d) { return y_scale(d.y); })
        //          .interpolate("linear");


        var lineGraph = current_g.append("rect")
                   .attr('x', x_scale(x1))
                   .attr('y', 0)//y_scale(this.calc_ymax))
                   .attr('height', this.style.height - this.MARGIN.bottom - this.MARGIN.top)//y_scale(this.calc_ymin - this.calc_ymax) - this.MARGIN.bottom)
                   .attr('width', x_scale(x2) - x_scale(x1))
                   .attr("fill", kwargs['color'])
                   .attr("opacity", kwargs['alpha']);

        // var text = current_g.append('text')
        //             .attr("x", x_scale(x))
        //             .attr("y", y_scale(this.calc_ymax*0.99))
        //             .attr("dy", "-0.5em")
        //             .style("text-anchor", "end")
        //             .attr("transform", "rotate(-90," + x_scale(x) + "," + y_scale(this.calc_ymax*0.99) + ")")
        //             .text(note);

    if (kwargs['add_legend']) {
        this._add_legend(label, kwargs['color'], kwargs['alpha'], 10)
    }

        


    }












    this._draw_nodes = function(parent_this, index, line_num) {

        var current_g = parent_this.g;
        var data_dict = parent_this.DATA_DICT
        var _mouseover_node = parent_this._mouseover_node
        var _mousemove_node = parent_this._mousemove_node
        var _mouseout_node = parent_this._mouseout_node
        var x_is_dates = parent_this.x_is_dates

        var nodes = current_g.selectAll('circle.node')
                .data(data_dict[index]["values"].filter(function(d) { if (d.y != null) {return d} }))
                .enter().append('g')
                .attr('class', 'node');



        nodes.append("circle")
              .attr('cx', function(d) {return x_scale(d.x);})
              .attr('cy', function(d) {return y_scale(d.y);})
              .attr('r', 3)
              .style("fill", data_dict[index]["color"])
              .style("opacity", data_dict[index]["alpha"])
              .on("mouseover", function(d) {_mouseover_node(d3.select(this), d, data_dict[index]["label"], data_dict[index]["color"], x_is_dates);})
              .on("mousemove", function() {_mousemove_node(d3.select(this))})
              .on("mouseout", function() {_mouseout_node(d3.select(this))});

        }

    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .attr("class", "tip")
        .style("font","16px Arial")
        .style("background-color","#f5f5f5")
        .style("border-style","solid")
        .style("border-width","1px")
        .style("border-radius","5px")
        .style("padding","5px")
        .style("z-index", "10")
        .style("visibility", "hidden");
    
    var tip_head = tooltip
        .append("div")
        .attr("class", "tip_head")
        .style("font", "10px Arial")
        .style("color", "#8C8C8C");

    var tip_mid = tooltip
        .append("div")
        .attr("class", "tip_mid")
        .style("font", "12px Arial")
        .style("color", "#8C8C8C");

    var tip_foot = tooltip
        .append("div")
        .attr("class", "tip_foot");

    var tip_foot2 = tooltip
        .append("div")
        .attr("class", "tip_foot2");


    this._mouseover_node = function(node, d, label, color, is_x_dates) {

        if (is_x_dates) {
            day_of_week_map = {0:'Sunday', 1:'Monday', 2:'Tuesday', 3:'Wednesday', 4:'Thursday', 5:'Friday', 6:'Saturday'}
            y_rounded = Math.round(d.y * 100) / 100;
            delta_rounded = Math.round(d.delta * 100) / 100;
            if (delta_rounded >= 0) {wow_color = "#458B00"} else {wow_color = "#CD2626"}
            x_date = format_date(d.x) + " (" + day_of_week_map[d.x.getDay()] + ")";
            text_to_display = y_rounded
            tip_foot2
                .style("color", wow_color)
                .text("WoW: " + delta_rounded + "%");
        } else {
            wow_color = "#458B00"
            text_to_display = Math.round(d.y * 100) / 100;
            delta_rounded = "NaN"
            if (d.tick_label !== undefined) {
                x_date = d.tick_label
            } else {
                x_date = d.x
            }
            
        }

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
        

        return tooltip
    }
    this._mouseout_node = function(node) {
        node.transition().attr("r", 3);
        return tooltip.style("visibility", "hidden");
    }
    this._mousemove_node = function(node) {
        return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
    }








    this._draw_scatter = function(label, _label, kwargs) {


        var current_g = this.g;
        var line_num = 0;
        var data_dict = this.DATA_DICT
        var height = this.HEIGHT
        var width = this.WIDTH

        current_g.selectAll("circle").remove();
        current_g.selectAll("defs").remove();

        // console.log(data_dict)
        $.each(data_dict, function( index, value ) {

        var r = 6//kwargs['size'];
        var gif_x = r - 800*0.1*0.5
        var gif_y = r - 400*0.1*0.5

            // current_g.selectAll("defs.scatter_defs")
            //   .data(data_dict[index]["values"])
            // .enter().append("defs")
            //   .append("pattern")
            //        .attr("id", data_dict[index]['url'])
            //        .attr('x',"0")
            //        .attr('y',"0")
            //        .attr('height',"100%")
            //        .attr('width',"100%")
            //             .append("image")
            //             .attr('x',gif_x) // loc of gif
            //             .attr('y',gif_y) // loc of gif
            //             .attr('height',"10%") // height of gif
            //             .attr('width',"10%") // width of gif
            //             .attr("xlink:href", data_dict[index]['url'])

              c = current_g.selectAll("circle.scatters")
                  .data(data_dict[index]["values"])
                    .enter().append("circle")
                      .attr("cx", function(d) { return x_scale(d.x)})
                      .attr("cy", function(d) { return y_scale(d.y)})
                      .attr("r", kwargs['size'])
                      // .style("fill", function(d) { return "url(#"+data_dict[index]['url']+")"});
                      .style("fill", data_dict[index]["color"])
                      .style("opacity", kwargs['opacity'])
                      // .attr('class','scatters')

            line_num = line_num + 1

        });
        
    }










    this._add_numeric_y_axis = function() {
        this.svg.selectAll('g.y.axis').remove()

        y_axis = d3.svg.axis().scale(y_scale)
            .orient("left").ticks(7);

        this.g.append("g") // Add the Y Axis
            .attr("class", "y axis")
            .call(y_axis)
            .selectAll('.tick')
            .style("font", "12px Arial");

        this.g.selectAll('.axis line, .axis path')
            .style("fill", "none")
            .style("stroke", "grey")
            .style("shape-rendering", "crispEdges")
            .style("stroke-width", "1")

    }


    this._add_numeric_x_axis = function(labels) {
        
        this.svg.selectAll('g.x.axis').remove()
        x_axis = d3.svg.axis().scale(x_scale)

        if (labels !== undefined) {
            var n_ticks = labels.length;
            x_axis.tickFormat(function(d, i){ return labels[i]});
        } else {
            var n_ticks = 10
        }

        x_axis.orient("bottom").ticks(n_ticks);

        this.g.append("g") // Add the Y Axis
            .attr("class", "x axis")
            .attr("transform", "translate(0," + this.HEIGHT + ")")
            .call(x_axis)
            .selectAll('.tick')
            .style("font", "12px Arial");

        this.g.selectAll('.axis line, .axis path')
            .style("fill", "none")
            .style("stroke", "grey")
            .style("shape-rendering", "crispEdges")
            .style("stroke-width", "1")

    }


    this._add_date_x_axis = function() {
        this.svg.selectAll('g.x.axis').remove();
        x_axis = d3.svg.axis().scale(x_scale)
            .orient("bottom").ticks(10)
            .tickFormat(format_date);
        var dateTicks = this.g.append("g") // Add the X Axis
            .attr("class", "x axis")
            .attr("transform", "translate(0," + this.HEIGHT + ")")
            .call(x_axis)
            .selectAll('.tick')
            .style("font", "12px Arial");
        // Hacky solution
        // Edit the number 2 int he future to be more responsive
        for (var j = 0; j < dateTicks[0].length; j++) {
            var c = dateTicks[0][j]
            if (j%2 != 0) {
                d3.select(c).remove();
            }
        }

        this.g.selectAll('.axis line, .axis path')
            .style("fill", "none")
            .style("stroke", "grey")
            .style("shape-rendering", "crispEdges")
            .style("stroke-width", "1")
    }


    this.append_area = function(x, y, y_bottom, label, kwargs) {

        this._draw = this._draw_area
        this.x_is_dates = this._is_dates(x);
        this.x_is_numeric = this.isNumeric(x)

        var underscore_label = label//'series_' + this.LINE_NUM;

        if (label == undefined) {label = underscore_label};
        if (kwargs == undefined) {
            kwargs = {}
            kwargs['alpha']=1;
            kwargs['add_legend']=true;
        };
        if (kwargs['alpha'] == undefined) {kwargs['alpha'] = 1;}
        if (kwargs['add_legend'] == undefined) {kwargs['add_legend'] = true;}

        if (!this.x_is_numeric &&  !this.x_is_dates) { // string labels\
            kwargs["x_tick_labels"] = x
            x = Array.apply(null, Array(x.length)).map(function (_, i) {return i;});
        }

        var color_scheme = this._LOLLIPOP;
        this.LABEL_DICT[label] = underscore_label;

        data_args = {'x':x, 'y':y, 'y_bottom':y_bottom}

        var valueline = d3.svg.area()
                .x( function(d) { return x_scale(d.x); })
                .y0( function(d) { return y_scale(d.y_bottom); })
                .y1( function(d) { return y_scale(d.y); });


        
        var _data = []
            for (var i = 0; i < x.length; i += 1) {
                var current_dict = {};
                current_dict['y'] = y[i];
                if (y_bottom != undefined) {current_dict['y_bottom'] = y_bottom[i]};
                current_dict['x'] = x[i];
                // current_dict['delta'] = pct_chng[i];
                _data.push(current_dict);
                if (kwargs['x_tick_labels'] != undefined) {current_dict['tick_label'] = kwargs["x_tick_labels"][i]};
            }

        // console.log(_data)
        if (this.x_is_dates) {

            if (x[0].length > 10) {
                _data.forEach(function(d) {d.x = parseDatetime(d.x)});
            } else {
                _data.forEach(function(d) {d.x = parseDate(d.x)});
            }
        }
        //     x_scale = d3.time.scale().range([0, this.WIDTH]);
        //     x_scale.domain(d3.extent(_data, function(d) { return d.x; }));

        // }
        // else {
        //     x_scale = d3.scale.linear().range([0, this.WIDTH]);
        //     this._scale_numerical_x_data(underscore_label)
        // }

        // this._scale_numerical_y_data(underscore_label)

        this.g.append("path")
            .attr("d", valueline(_data))
            .style("stroke", kwargs['color'])
            .style("opacity", kwargs['alpha'])
            .style('fill', kwargs['color'])
            .style("stroke-width", null)
            // .attr("class","line")
            .on("mouseover", function() {d3.select(this).transition().style("stroke-width", 4);})
            .on("mouseout", function() {d3.select(this).transition().style("stroke-width", 0);});

        

    }

    // this.area = function(x, y, y_bottom, label, kwargs) {

    //     this._draw = this._draw_area
    //     this.x_is_dates = this._is_dates(x);
    //     this.x_is_numeric = this.isNumeric(x)

    //     var underscore_label = label//'series_' + this.LINE_NUM;

    //     if (label == undefined) {label = underscore_label};
    //     if (kwargs == undefined) {
    //         kwargs = {}
    //         kwargs['alpha']=1;
    //         kwargs['add_legend']=true;
    //     };
    //     if (kwargs['alpha'] == undefined) {kwargs['alpha'] = 1;}
    //     if (kwargs['add_legend'] == undefined) {kwargs['add_legend'] = true;}

    //     if (!this.x_is_numeric &&  !this.x_is_dates) { // string labels\
    //         kwargs["x_tick_labels"] = x
    //         x = Array.apply(null, Array(x.length)).map(function (_, i) {return i;});
    //     }

    //     var color_scheme = this._LOLLIPOP;
    //     this.LABEL_DICT[label] = underscore_label;

    //     data_args = {'x':x, 'y':y, 'y_bottom':y_bottom}

    //     this._create_data_for_d3(data_args, underscore_label, label, kwargs);


    //     if (this.x_is_dates) {

    //         if (x[0].length > 10) {
    //             this.DATA.forEach(function(d) {d.x = parseDatetime(d.x)});
    //         } else {
    //             this.DATA.forEach(function(d) {d.x = parseDate(d.x)});
    //         }

    //         x_scale = d3.time.scale().range([0, this.WIDTH]);
    //         this._scale_date_x_data(underscore_label)

    //     }
    //     else {
    //         x_scale = d3.scale.linear().range([0, this.WIDTH]);
    //         this._scale_numerical_x_data(underscore_label)
    //     }

    //     this._scale_numerical_y_data(underscore_label)
    //     this._add_grid_lines();
    //     this._draw_area(underscore_label, label);
    //     this._add_numeric_y_axis();

    //     if (this.x_is_dates) {
    //         this._add_date_x_axis();
    //     } else {
    //         this._add_numeric_x_axis(kwargs['x_tick_labels']);
    //     }


    //     var currline_color = this.DATA_DICT[underscore_label]['color'];


    //     if (kwargs['add_legend']) {this._add_legend(label, currline_color);}
    //     if (kwargs['color_from'] == undefined) {this.LINE_NUM = this.LINE_NUM + 1;}
        

    // }



    // this.area = function(x, y, y_bottom, label, kwargs) {
    //             var underscore_label = label//'series_' + this.LINE_NUM;

    //     if (label == undefined) {label = underscore_label};
    //     if (kwargs == undefined) {
    //         kwargs = {}
    //         kwargs['alpha']=1;
    //         kwargs['add_legend']=true;
    //     };
    //     if (kwargs['alpha'] == undefined) {kwargs['alpha'] = 1;}
    //     if (kwargs['add_legend'] == undefined) {kwargs['add_legend'] = true;}


    //     var color_scheme = this._LOLLIPOP;
    //     this.LABEL_DICT[label] = underscore_label;

    //     data_args = {'x':x, 'y':y, 'y_bottom':y_bottom}


    //     this._create_data_for_d3(data_args, underscore_label, label, kwargs);
    //     // Line
    //     if (x[0].length > 10) {
    //         this.DATA.forEach(function(d) {d.x = parseDatetime(d.x)});
    //     }
    //     else {
    //         this.DATA.forEach(function(d) {d.x = parseDate(d.x)});
    //     }


    //     x_scale = d3.time.scale().range([0, this.WIDTH]); // Line
    //     this._scale_numerical_y_data(underscore_label)
    //     this._scale_date_x_data(underscore_label)

    //     this._add_grid_lines();
    //     this._draw_area(underscore_label, label);
    //     this._add_numeric_y_axis();
    //     this._add_date_x_axis();



    //     var currline_color = this.DATA_DICT[underscore_label]['color'];
    //     if (kwargs['add_legend']) {this._add_legend(label, currline_color);}
    //     if (kwargs['color_from'] == undefined) {this.LINE_NUM = this.LINE_NUM + 1;}
    // }














    this.batch_add_data = function(x, y, label, kwargs) {

        this._draw = this._draw_line
        this.x_is_dates = this._is_dates(x);
        this.x_is_numeric = this.isNumeric(x)

        var underscore_label = label//'series_' + this.LINE_NUM;

        if (label == undefined) {label = underscore_label};
        if (kwargs == undefined) {
            kwargs = {}
            kwargs['alpha']=1;
            kwargs['add_legend']=true;
        };
        if (kwargs['alpha'] == undefined) {kwargs['alpha'] = 1;}
        if (kwargs['add_legend'] == undefined) {kwargs['add_legend'] = true;}

        if (!this.x_is_numeric &&  !this.x_is_dates) { // string labels\
            kwargs["x_tick_labels"] = x
            x = Array.apply(null, Array(x.length)).map(function (_, i) {return i;});
        }

        var color_scheme = this._LOLLIPOP;
        this.LABEL_DICT[label] = underscore_label;

        var data_args = {'x':x, 'y':y}

        this._create_data_for_d3(data_args, underscore_label, label, kwargs);


        if (this.x_is_dates) {

            if (x[0].length > 10) {
                this.DATA.forEach(function(d) {d.x = parseDatetime(d.x)});
            } else {
                this.DATA.forEach(function(d) {d.x = parseDate(d.x)});
            }

            x_scale = d3.time.scale().range([0, this.WIDTH]);
            this._scale_date_x_data(underscore_label)

        }
        else {
            x_scale = d3.scale.linear().range([0, this.WIDTH]);
            this._scale_numerical_x_data(underscore_label)
        }

        this._scale_numerical_y_data(underscore_label)

        if (this.x_is_dates) {
            this._add_date_x_axis();
        } else {
            this._add_numeric_x_axis(kwargs['x_tick_labels']);
        }


        var currline_color = this.DATA_DICT[underscore_label]['color'];


        if (kwargs['add_legend']) {this._add_legend(label, currline_color);}
        if (kwargs['color_from'] == undefined) {this.LINE_NUM = this.LINE_NUM + 1;}

    }


    this.batch_draw_lines = function(kwargs) {

        this._add_grid_lines();
        this._draw_line('--', '--');
        this._add_numeric_y_axis();


    }




    this.line = function(x, y, label, kwargs) {

        this._draw = this._draw_line
        this.x_is_dates = this._is_dates(x);
        this.x_is_numeric = this.isNumeric(x)

        var underscore_label = label//'series_' + this.LINE_NUM;

        if (label == undefined) {label = underscore_label};
        if (kwargs == undefined) {
            kwargs = {}
            kwargs['alpha']=1;
            kwargs['add_legend']=true;
            kwargs['dashed']=false;
        };
        if (kwargs['alpha'] == undefined) {kwargs['alpha'] = 1;}
        if (kwargs['add_legend'] == undefined) {kwargs['add_legend'] = true;}
        if (kwargs['dashed'] == undefined) {kwargs['dashed'] = false;}


        if (kwargs['dashed']) {
            kwargs['dashed'] = 5
        } else {
            kwargs['dashed'] = 0
        }

        // console.log(kwargs)

        if (!this.x_is_numeric &&  !this.x_is_dates) { // string labels\
            kwargs["x_tick_labels"] = x
            x = Array.apply(null, Array(x.length)).map(function (_, i) {return i;});
        }

        var color_scheme = this._LOLLIPOP;
        this.LABEL_DICT[label] = underscore_label;

        var data_args = {'x':x, 'y':y}

        this._create_data_for_d3(data_args, underscore_label, label, kwargs);


        if (this.x_is_dates) {

            if (x[0].length > 10) {
                this.DATA.forEach(function(d) {d.x = parseDatetime(d.x)});
            } else {
                this.DATA.forEach(function(d) {d.x = parseDate(d.x)});
            }

            x_scale = d3.time.scale().range([0, this.WIDTH]);
            this._scale_date_x_data(underscore_label)

        }
        else {
            x_scale = d3.scale.linear().range([0, this.WIDTH]);
            this._scale_numerical_x_data(underscore_label)
        }

        this._scale_numerical_y_data(underscore_label)
        this._add_grid_lines();
        this._draw_line(underscore_label, label);
        this._add_numeric_y_axis();

        if (this.x_is_dates) {
            this._add_date_x_axis();
        } else {
            this._add_numeric_x_axis(kwargs['x_tick_labels']);
        }


        var currline_color = this.DATA_DICT[underscore_label]['color'];


        if (kwargs['add_legend']) {this._add_legend(label, currline_color);}
        if (kwargs['color_from'] == undefined) {this.LINE_NUM = this.LINE_NUM + 1;}
        

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
        var x_is_dates = this.x_is_dates

        var _mouseover_node = this._mouseover_node;
        var _mousemove_node = this._mousemove_node;
        var _mouseout_node = this._mouseout_node;

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
                // .attr("transform", function(d, i) {return "translate(" + (bar_width*line_num + x_scale(d.x) - bar_width/2) +  ", " + (y_scale(d.y)) + ")"; })
                .attr("transform", function(d, i) {return "translate(" + ( x_scale(d.x)) +  ", " + (y_scale(d.y)) + ")"; })
                
                .attr("class","bar");

            bar.append("rect")
                .attr("height", function(d) { return height - y_scale(d.y); })
                .attr("width", bar_width)
                .style("stroke-width",0)
                .style("fill",color_scheme[line_num]["color"])
                .on("mouseover", function(d) {d3.select(this).style("opacity", 0.5); _mouseover_node(d3.select(this), d, data_dict[index]["label"], data_dict[index]["color"], x_is_dates);})
                .on("mousemove", function() {_mousemove_node(d3.select(this))})
                .on("mouseout", function() {d3.select(this).style("opacity", 1); _mouseout_node(d3.select(this))});

            line_num = line_num + 1

        });
        
    }

    this._is_dates = function(x) {

        var is_it = true;

        try {
            parseDate(x[0])
            is_it = is_it && true
        }
        catch(err) {
            is_it = is_it && false
            return is_it
        }

        try {
            parseDatetime(x[0])
            is_it = is_it && true
        }
        catch(err) {
            is_it = is_it && false
            return is_it
        }

        if ((parseDate(x[0]) == null) && (parseDatetime(x[0]) == null)) {
            is_it = is_it && false
        }

        return is_it

    }


    this.isNumeric = function(x) {
      return !isNaN(parseFloat(x[0])) && isFinite(x[0]);
    }

    this.bar = function(x, y, label, kwargs) {

        this._draw = this._draw_bar
        this.x_is_dates = this._is_dates(x);
        this.x_is_numeric = this.isNumeric(x)

        var underscore_label = label//'series_' + this.LINE_NUM;

        if (label == undefined) {label = underscore_label};
        if (kwargs == undefined) {
            kwargs = {}
            kwargs['alpha']=1;
            kwargs['add_legend']=true;
        };
        if (kwargs['alpha'] == undefined) {kwargs['alpha'] = 1;}
        if (kwargs['add_legend'] == undefined) {kwargs['add_legend'] = true;}

        if (!this.x_is_numeric &&  !this.x_is_dates) { // string labels\
            kwargs["x_tick_labels"] = x
            x = Array.apply(null, Array(x.length)).map(function (_, i) {return i;});
        }


        var color_scheme = this._LOLLIPOP;
        this.LABEL_DICT[label] = underscore_label;

        var data_args = {'x':x, 'y':y}

        this._create_data_for_d3(data_args, underscore_label, label, kwargs);


        if (this.x_is_dates) {

            if (x[0].length > 10) {
                this.DATA.forEach(function(d) {d.x = parseDatetime(d.x)});
            } else {
                this.DATA.forEach(function(d) {d.x = parseDate(d.x)});
            }

            x_scale = d3.time.scale().range([0, this.WIDTH]);
            this._scale_date_x_data_for_bar(underscore_label)

        }
        else {
            x_scale = d3.scale.linear().range([0, this.WIDTH]);
            this._scale_numerical_x_data_for_bar(underscore_label)
        }

        this._scale_numerical_y_data(underscore_label)
        this._add_grid_lines();
        this._draw_bar(underscore_label, label);
        this._add_numeric_y_axis();

        if (this.x_is_dates) {
            this._add_date_x_axis();
        } else {
            this._add_numeric_x_axis(kwargs["x_tick_labels"]);
        }

        var currline_color = this.DATA_DICT[underscore_label]['color'];
        if (kwargs['add_legend']) {this._add_legend(label, currline_color);}
        if (kwargs['color_from'] == undefined) {this.LINE_NUM = this.LINE_NUM + 1;}

    }


    this.scatter = function(x, y, label, kwargs) {

        // console.log('hi')
        this._draw = this._draw_scatter
        this.x_is_dates = this._is_dates(x);
        this.x_is_numeric = this.isNumeric(x)

        var underscore_label = label//'series_' + this.LINE_NUM;

        if (label == undefined) {label = underscore_label};
        if (kwargs == undefined) {
            kwargs = {}
            kwargs['alpha']=1;
            kwargs['add_legend']=true;
        };
        if (kwargs['alpha'] == undefined) {kwargs['alpha'] = 1;}
        if (kwargs['add_legend'] == undefined) {kwargs['add_legend'] = true;}

        if (!this.x_is_numeric &&  !this.x_is_dates) { // string labels\
            kwargs["x_tick_labels"] = x
            x = Array.apply(null, Array(x.length)).map(function (_, i) {return i;});
        }


        var color_scheme = this._LOLLIPOP;
        this.LABEL_DICT[label] = underscore_label;

        var data_args = {'x':x, 'y':y}

        this._create_data_for_d3(data_args, underscore_label, label, kwargs);


        if (this.x_is_dates) {

            if (x[0].length > 10) {
                this.DATA.forEach(function(d) {d.x = parseDatetime(d.x)});
            } else {
                this.DATA.forEach(function(d) {d.x = parseDate(d.x)});
            }

            x_scale = d3.time.scale().range([0, this.WIDTH]);
            this._scale_date_x_data_for_bar(underscore_label)

        }
        else {
            x_scale = d3.scale.linear().range([0, this.WIDTH]);
            this._scale_numerical_x_data_for_bar(underscore_label)
        }

        this._scale_numerical_y_data(underscore_label)
        this._add_grid_lines();
        this._draw_scatter(underscore_label, label, kwargs);
        this._add_numeric_y_axis();

        if (this.x_is_dates) {
            this._add_date_x_axis();
        } else {
            this._add_numeric_x_axis(kwargs["x_tick_labels"]);
        }

        var currline_color = this.DATA_DICT[underscore_label]['color'];
        if (kwargs['add_legend']) {this._add_legend(label, currline_color);}
        if (kwargs['color_from'] == undefined) {this.LINE_NUM = this.LINE_NUM + 1;}

    }




    this._add_default_title = function() {
        
        if (this.style.name == 'ipython') {
            this.g.append("foreignObject")
                .attr("class", "externalObject")
                .attr("x", 0)
                .attr("y", 0 - (this.MARGIN.top)/1.4)
                .html("<input type='text' id='title_input' placeholder='Click to Add a Chart Title.' class='horizontal_inputs chart_input' style='box-shadow:none;font-weight:bold;font-size:18px;width:600px;font-family:sans-serif;border: none;background: transparent;'></input>");
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
                .html("<input type='text' id='subtitle_input' placeholder='Click to add chart subtitle.' class='horizontal_inputs chart_input' style='box-shadow:none;font-size:14px;width:600px;font-family:sans-serif;border: none;background: transparent;'></input>");
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
            .attr("stroke", "lightgrey")
            .attr("opacity", 0.7)
            .attr("transform", "translate(0," + this.HEIGHT + ")")
            .call(make_x_axis()
            .tickSize(-this.HEIGHT, 0, 0)
            .tickFormat("")

        )
        this.g.append("g")
            .attr("class", "grid")
            .attr("stroke", "lightgrey")
            .attr("opacity", 0.7)
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
                .html("<input type='text' id='ylabel_input' placeholder='Click to add label' class='chart_input' style='box-shadow:none;text-align: center;font-size: 12px;font-family:sans-serif;border: none;background: transparent;'></input>")
                .attr("transform", "rotate(-90)");
        }
        else {
            this.svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 + this.MARGIN.left/4) // minus goes left
                .attr("x", 0 - ((this.MARGIN.top + this.MARGIN.bottom + this.HEIGHT)/2)) // minus goes down 
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .style("font", "12px Arial")
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
                .html("<input type='text' id='xlabel_input' placeholder='Click to add label' class='chart_input' style='box-shadow:none;text-align: center;font-size: 12px;width:300px;font-family:sans-serif;border: none;background: transparent;'></input>");
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
                .call(x_axis);
            svg.select(".y.axis")
                .duration(750)
                .call(y_axis);

    }


    this._add_legend = function(label, currline_color, currline_alpha, stroke_width) {

        var line_num = this.LINE_NUM % 9;
        var currline_color = currline_color;
        if (stroke_width == undefined) {
            stroke_width = 2
        }
        if (currline_alpha == undefined) {
            currline_alpha = 1.0
        }
        
        this.svg.append("text")
            .attr("y", this.LEGEND_NUM*15 + this.MARGIN.top) // adding goes down
            .attr("x", 30 + 1.5*this.MARGIN.left) // minus goes down 
            .attr("dy", "0.3em")
            .style("text-anchor", "left")
            .attr("id","ylabel")
            .style("font", "12px Arial")
            .text(label);

        this.svg.append("line")
            .attr("x1", 0 + 1.5*this.MARGIN.left) // minus goes down 
            .attr("x2", 25 + 1.5*this.MARGIN.left) // minus goes down 
            .attr("y1", this.LEGEND_NUM*15 + this.MARGIN.top) // adding goes down
            .attr("y2", this.LEGEND_NUM*15 + this.MARGIN.top)
            .attr("stroke-width", stroke_width)
            .attr("stroke", currline_color) // adding goes down
            .attr("opacity", currline_alpha)
            .style("fill", "none");
        this.LEGEND_NUM = this.LEGEND_NUM+1

    }




    this.set_ymin = function(ymin) {
        // CLear all data
        this.g.selectAll("path").remove()
        this.g.selectAll("circle").remove()

        // Correct scaling
        this.setted_ymin = ymin

        // Add all data back with correct new scaling
        this._scale_numerical_y_data()
        this._add_grid_lines();
        this._draw();
        this._add_numeric_y_axis();

        if (this.x_is_dates) { 
            this._add_date_x_axis();
        } else {
            this._add_numeric_x_axis();
        }

    }

    this.set_ymax = function(ymax) {
        // CLear all data
        this.g.selectAll("path").remove()
        this.g.selectAll("circle").remove()

        // Correct scaling
        this.setted_ymax = ymax

        // Add all data back with correct new scaling
        this._scale_numerical_y_data()
        this._add_grid_lines();
        this._draw();
        this._add_numeric_y_axis();
        if (this.x_is_dates) { 
            this._add_date_x_axis();
        } else {
            this._add_numeric_x_axis();
        }

    }

    
    this.set_ylim = function(ymin, ymax) {
        // CLear all data
        this.g.selectAll("path").remove()
        this.g.selectAll("circle").remove()

        // Correct scaling
        this.setted_ymax = ymax
        this.setted_ymin = ymin

        // Add all data back with correct new scaling
        this._scale_numerical_y_data()
        this._add_grid_lines();
        this._draw();
        this._add_numeric_y_axis();
        if (this.x_is_dates) { 
            this._add_date_x_axis();
        } else {
            this._add_numeric_x_axis();
        }
    }


    this.annotate_final_values = function() {

        var current_g = this.g;
        // var final_vals = this.DATA[this.DATA.length-1]
        var final_vals
        var data
        var color

        var data_dict = this.DATA_DICT

        var d3_data = []
        $.each(data_dict, function( index, value ) {

            data = data_dict[index]["values"]
            color = data_dict[index]["color"]
            final_vals = data[data.length-1]
            // x_s.push(final_vals.x)
            // y_s.push(final_vals.y)
            d3_data.push({x:final_vals.x, y:final_vals.y, color:color})



        });

        // d3_data = {x:x_s, y:y_s}

        console.log(d3_data)

        final_rects = current_g.selectAll("._end_nodes")
                .data(d3_data)
            .enter().append("g")
                .attr("class", "_end_nodes")
                .attr("transform", function(d, i) {return "translate(" + x_scale(d.x) + " ," + (y_scale(d.y) - 20) +  ")"; });

        final_rects.append("rect")
            .attr("width", "50px")
            .attr("height", "20px")
            .style('fill',function (d) {return d.color})
            .style('opacity',function (d) {return 0.3});

        final_rects.append("text")
                .style("text-anchor", "start")
                .attr("dy", "15px")
                .attr("dx", "3px")
                .style("font-size", "10px")
                .text(function(d) {return Math.round(d.y * 100) / 100});

        // var rect = current_g.append('rect')
        //         // .attr("x", x_scale(final_vals.x))
        //         // .attr("y", y_scale(final_vals.y))
        //         .attr('height','10px')
        //         .attr('width','10px')
        //         .style('fill','#fff')

        //         console.log(rect)

        //     var text = rect.append('text')
        //         .attr("x", x_scale(final_vals.x))
        //         .attr("y", y_scale(final_vals.y))
        //         .attr("dy", "-0.5em")
        //         .style("text-anchor", "start")
        //         .text(Math.round(final_vals.y * 100) / 100);



    }












    this._create_canvas();
    this._add_default_title();
    this._add_default_subtitle();
    this._add_default_ylabel();
    this._add_default_xlabel();








    
};

// d3.selectAll(".ticks").style("font", "50px Arial")



    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////// HEADER STATS /////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function createHeaderStatsVisualization(
    country_code,
    year,
    svg,
    span_id,
    width,
    height
  ) {
    property_list = ["population", "fertility_rate", "life_expectancy"];
    Promise.all([headerStats(country_code, year)]).then(function (data) {
      svg.selectAll(".value").remove();
      svg.selectAll(".header_title").remove();
  
      if (country_code == "ALL") {
        cntry_key = "World";
      } else {
        cntry_key = country_code;
      }
  
      svg
        .append("text")
        .text("Current " + property_list[0])
        .attr("class", "header")
        .attr("font-weight", "bold")
        .attr("x", width / 3 - 330)
        .attr("y", height / 2 - 80 + 25);
  
      svg
        .append("text")
        .text("Current " + property_list[1] + " %")
        .attr("class", "header")
        .attr("font-weight", "bold")
        .attr("x", (width / 3) * 2 - 340)
        .attr("y", height / 2 - 80 + 25);
  
      svg
        .append("text")
        .text("Current " + property_list[2] + " (years)")
        .attr("class", "header")
        .attr("font-weight", "bold")
        .attr("x", (width / 3) * 3 - 370)
        .attr("y", height / 2 - 80 + 25);
  
  
      svg
        .append("text")
        .attr("class", "value")
        .attr("font-size", "24px")
        .attr("x", (width / 3) * 1 - 310)
        .attr("y", height / 2 - 20 + 20)
        .transition()
        .duration(3000)
        .tween("value", function (d, i) {
          d = parseFloat(data[0]["current_" + property_list[0]].toFixed(2));
          var i = d3.interpolate(this.textContent, d),
            prec = (d + "").split("."),
            round = prec.length > 1 ? Math.pow(10, prec[1].length) : 1;
  
          return function (t) {
            this.textContent = Math.round(i(t) * round) / round;
          };
        });
  
      svg
        .append("text")
        .attr("class", "value")
        .attr("font-size", "24px")
        .attr("x", (width / 3) * 2 - 260)
        .attr("y", height / 2 - 20 + 20)
        .transition()
        .duration(3000)
        .tween("value", function (d, i) {
          d = parseFloat(data[0]["current_" + property_list[1]].toFixed(2));
          var i = d3.interpolate(this.textContent, d),
            prec = (d + "").split("."),
            round = prec.length > 1 ? Math.pow(10, prec[1].length) : 1;
  
          return function (t) {
            this.textContent = Math.round(i(t) * round) / round;
          };
        });
  
      svg
        .append("text")
        .attr("class", "value")
        .attr("font-size", "24px")
        .attr("x", (width / 3) * 3 - 260)
        .attr("y", height / 2 - 20 + 20)
        .transition()
        .duration(3000)
        .tween("value", function (d, i) {
          d = parseFloat(data[0]["current_" + property_list[2]].toFixed(2));
          var i = d3.interpolate(this.textContent, d),
            prec = (d + "").split("."),
            round = prec.length > 1 ? Math.pow(10, prec[1].length) : 1;
  
          return function (t) {
            this.textContent = Math.round(i(t) * round) / round;
          };
        });
  
    });
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////// MAP LAYOUT /////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  function createMapLayout(
    property,
    span_id,
    year,
    svg,
    Tooltip,
    width,
    height,
    chartHeader,
    controlButtons
  ) {
    Tooltip.style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")
      .style("position", "absolute");
  
    total_width = width;
    total_height = height;
  
    chartHeadrer_wd = total_width;
    chartHeadrer_ht = 20;
  
    var headerBox = chartHeader
      .append("rect")
      .attr("width", chartHeadrer_wd)
      .attr("height", chartHeadrer_ht)
      .attr("x", 0)
      .attr("y", 0)
      .attr("fill", "#69b3a2");
  
    var headerText = chartHeader
      .append("text")
      .attr("class", "buttons")
      .attr("text-anchor", "middle")
      .attr("x", chartHeadrer_wd / 2)
      .attr("y", 15)
      .style("fill", "white")
      .text("Geographical distribution of " + property);
  
    controlButton_wd = total_width / 4 - 50;
    controlButton_ht = 20;
  
    var button_ph_1 = controlButtons
      .append("rect")
      .attr("width", controlButton_wd)
      .attr("height", controlButton_ht)
      .attr("x", 0)
      .attr("y", +chartHeadrer_ht + 10)
      .attr("fill", "#69b3a2");
  
    var button_text_1 = controlButtons
      .append("text")
      .attr("class", "buttons")
      .attr("text-anchor", "middle")
      .attr("x", controlButton_wd / 2)
      .attr("y", +chartHeadrer_ht + 10 + 15)
      .style("fill", "white")
      .text("World Statistics")
      .on("click", function (event, d) {
        console.log("Clicked Circle", d);
        createHeaderStatsVisualization(
          "ALL",
          year_hs,
          svg_hs,
          span_id_hs,
          width_hs,
          height_hs
        );
  
        createAreaPointsChart(
          property_acp,
          "ALL",
          span_id_acp,
          location_x_acp,
          location_y_acp,
          svg_acp,
          Tooltip_acp,
          width_acp,
          height_acp,
          margin_acp,
          xAxis_acp,
          yAxis_acp,
          chartStats_acp,
          chartHeader_acp
        );
      });
  
    // Map and projection
    const path = d3.geoPath();
    const projection = d3
      .geoMercator()
      .scale(140)
      .center([0, 30])
      .translate([width / 2, height / 2]);
  
    // Data and color scale
    const data = new Map();
    var colorScale = d3.scaleLinear().range(["#81E381", "#1E4038"]);
  
    combinedPropertyStatsPerYear(year).then(function (d) {
      var property_data = d.map(function (d) {
        return d[property];
      });
  
      colorScale.domain([0, d3.max(property_data)]);
      console.log("d", d);
      d.forEach(function (d) {
        data.set(d.country_code, d.population);
      });
  
      console.log("map", data);
      // Load external data and boot
      Promise.all([
        d3.json(
          "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
        ),
      ]).then(function (loadData) {
        let topo = loadData[0];
        console.log("data", data);
        let mouseOver = function (d) {
          d3.selectAll(".Country")
            .transition()
            .duration(200)
            .style("opacity", 0.5)
            .style("stroke", "transparent");
  
          Tooltip.style("opacity", 1);
  
          d3.select(this)
            .transition()
            .duration(200)
            .style("opacity", 1)
            .style("stroke", "black");
        };
  
        const mousemove = function (event, d) {
          Tooltip.html(
            "<u>" +
              d.properties.name +
              " (" +
              property +
              ")" +
              "</u> : <u>" +
              d.total +
              "</u>"
          )
            .style("left", event.pageX - 70 + "px")
            .style("top", event.pageY - 190 + "px");
        };
  
        let mouseLeave = function (d) {
          d3.selectAll(".Country")
            .transition()
            .duration(200)
            .style("opacity", 1)
            .style("stroke", "#ECECEC");
          d3.select(this).transition().duration(200).style("stroke", "#ECECEC");
  
          Tooltip.style("opacity", 0);
        };
  
        var clickfunction = function (event, d) {
          console.log("d", d);
          console.log("d", d.id);
          console.log("event", event);
          createHeaderStatsVisualization(
            d.id,
            year_hs,
            svg_hs,
            span_id_hs,
            width_hs,
            height_hs
          );
  
          createAreaPointsChart(
            property_acp,
            d.id,
            span_id_acp,
            location_x_acp,
            location_y_acp,
            svg_acp,
            Tooltip_acp,
            width_acp,
            height_acp,
            margin_acp,
            xAxis_acp,
            yAxis_acp,
            chartStats_acp,
            chartHeader_acp
          );
        };
        // Draw the map
        svg.selectAll("path").remove();
        var mapSvg = svg
          .append("g")
          .selectAll("path")
          .data(topo.features)
          .enter()
          .append("path")
          // draw each country
          .attr("d", d3.geoPath().projection(projection))
          // set the color of each country
          .attr("fill", "white")
          .attr("fill-opacity", "0.7")
          .style("stroke", "transparent")
          .attr("class", function (d) {
            return "Country";
          })
          .style("opacity", 1);
  
        mapSvg
          .transition()
          .delay((d, i) => i * 10)
          .duration(1500)
          .attr("fill", function (d) {
            d.total = data.get(d.id) || 0;
            console.log("d.id", d.id, " d.total", d.total);
            return colorScale(d.total);
          })
          .style("stroke", "#ECECEC");
  
        mapSvg
          .on("mouseover", mouseOver)
          .on("mousemove", mousemove)
          .on("mouseleave", mouseLeave)
          .on("click", clickfunction);
      });
    });
  }
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////// CirularBarPlot LAYOUT /////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  
  function createCircularBarPlot(
    property,
    year,
    span_id,
    location_x,
    location_y,
    svg,
    Tooltip,
    width,
    height,
    margin,
    innerRadius,
    outerRadius,
    chartStats,
    controlButtons,
    chartHeader,
    data_order
  ) {
    Tooltip.style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")
      .style("position", "absolute");
  
    total_width = width + margin.left + margin.right;
    total_height = height + margin.top + margin.bottom;
  
    controlButton_wd = total_width / 3 - 50;
    controlButton_ht = 20;
  
    var button_ph_1 = controlButtons
      .append("rect")
      .attr("width", controlButton_wd)
      .attr("height", controlButton_ht)
      .attr("x", -1 * controlButton_wd - 10)
      .attr("y", (-1 * total_height) / 2 + 10)
      .attr("fill", "#69b3a2");
  
    var button_text_1 = controlButtons
      .append("text")
      .attr("class", "buttons")
      .attr("text-anchor", "middle")
      .attr("x", (-1 * controlButton_wd) / 2 - 10)
      .attr("y", (-1 * total_height) / 2 + 25)
      .style("fill", "white")
      .text("Highest")
      .on("click", function (event, d) {
        console.log("Clicked Circle", d);
        createCircularBarPlot(
          property,
          year,
          span_id,
          location_x,
          location_y,
          svg,
          Tooltip,
          width,
          height,
          margin,
          innerRadius,
          outerRadius,
          chartStats,
          controlButtons,
          chartHeader,
          "DESC"
        );
      });
  
    var button_ph_2 = controlButtons
      .append("rect")
      .attr("width", controlButton_wd)
      .attr("height", controlButton_ht)
      .attr("x", 10)
      .attr("y", (-1 * total_height) / 2 + 10)
      .attr("fill", "#69b3a2");
  
    var button_text_2 = controlButtons
      .append("text")
      .attr("class", "buttons")
      .attr("text-anchor", "middle")
      .attr("x", (1 * controlButton_wd) / 2 + 10)
      .attr("y", (-1 * total_height) / 2 + 25)
      .style("fill", "white")
      .text("Lowest")
      .on("click", function (event, d) {
        console.log("Clicked Circle", d);
        createCircularBarPlot(
          property,
          year,
          span_id,
          location_x,
          location_y,
          svg,
          Tooltip,
          width,
          height,
          margin,
          innerRadius,
          outerRadius,
          chartStats,
          controlButtons,
          chartHeader,
          "ASC"
        );
      });
  
    chartHeadrer_wd = total_width - 50;
    chartHeadrer_ht = "20";
    var headerBox = chartHeader
      .append("rect")
      .attr("width", chartHeadrer_wd)
      .attr("height", chartHeadrer_ht)
      .attr("x", (-1 * chartHeadrer_wd) / 2)
      .attr("y", (-1 * total_height) / 2 - 20)
      .attr("fill", "#69b3a2");
  
    if (data_order == "DESC") {
      title_key = "Top";
    } else {
      title_key = "Bottom";
    }
  
    console.log("data_order", data_order);
    console.log("title_key", title_key);
  
    var headerText = chartHeader
      .append("text")
      .attr("class", "buttons")
      .attr("text-anchor", "middle")
      .attr("x", 0)
      .attr("y", (-1 * total_height) / 2 - 5)
      .style("fill", "white")
      .text(title_key + " 50 Countries by " + property);
  
    combinedPropertyStatsPerYear(year).then(function (data) {
      data = data.filter(function (d) {
        return d[property] != 0;
      });
  
      if (data_order === "ASC") {
        data.sort(function (b, a) {
          return b[property] - a[property];
        });
      } else {
        data.sort(function (b, a) {
          return a[property] - b[property];
        });
      }
  
      var property_data_full = data.map(function (d) {
        return d[property];
      });
  
      data = data.slice(0, 50);
  
      //Find highest property Country
      highest = data.slice(0, 1)[0];
      console.log("highest", highest);
  
      chartStats.selectAll("text").remove();
  
      if (data_order === "DESC") {
        chartStats_key = "Highest";
      } else {
        chartStats_key = "Lowest";
      }
      chartStats
        .style("opacity", 0)
        .append("text")
        .style("fill", "#69b3a2")
        .text(chartStats_key + " " + property)
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("y", -20)
        .style("font-size", "8px")
        .style("stroke", "#69b3a2")
        .style("stroke-width", "0.5");
  
      chartStats
        .style("opacity", 0)
        .append("text")
        .style("fill", "#69b3a2")
        .text("Country: ")
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("y", 0)
        .style("font-size", "8px")
        .style("stroke", "#69b3a2")
        .style("stroke-width", "0.5");
  
      chartStats
        .style("opacity", 0)
        .append("text")
        .style("fill", "#69b3a2")
        .text(highest.country_name + " (" + highest[property] + ")")
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("y", +20)
        .style("font-size", "9px")
        .style("stroke", "#69b3a2")
        .style("stroke-width", "0.5");
  
      data = d3.shuffle(data);
  
      console.log("Sorted Sliced Data:", data);
  
      var property_data = data.map(function (d) {
        return d[property];
      });
  
      var colorScale = d3
        .scaleLinear()
        .range(["#69b3a2", "#90EE90"])
        .domain([d3.min(property_data), d3.max(property_data)]);
  
      // Scales
      const x = d3
        .scaleBand()
        .range([0, 2 * Math.PI]) // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
        .align(0) // This does nothing
        .domain(data.map((d) => d.country_name)); // The domain of the X axis is the list of states.
      const y = d3
        .scaleRadial()
        .range([innerRadius, outerRadius]) // Domain will be define later.
        .domain([0, d3.max(property_data)]); // Domain of Y is from 0 to the max seen in the data
  
      const mouseover = function (event, d) {
        d3.selectAll("path")
          .transition()
          .duration(200)
          .style("opacity", 0.5)
          .style("stroke", "transparent");
  
        Tooltip.style("opacity", 1);
  
        d3.select(this)
          .transition()
          .duration(200)
          .style("opacity", 1)
          .style("stroke", "black");
      };
      const mousemove = function (event, d) {
        Tooltip.html(
          "<u>" +
            d.country_name +
            " (" +
            property +
            ")" +
            "</u> : <u>" +
            +parseFloat(d[property].toFixed(2)) +
            "</u>"
        )
          .style("left", event.pageX - 70 + "px")
          //.style("left", 0 + "px")
          .style("top", event.pageY - 190 + "px");
      };
      var mouseleave = function (event, d) {
        d3.selectAll("path")
          .transition()
          .duration(200)
          .style("opacity", 0.8)
          .style("stroke", "transparent");
        d3.select(this).transition().duration(200);
  
        Tooltip.style("opacity", 0);
      };
      var clickfunction = function (event, d) {
        console.log("Clicked path", d);
  
        createAreaPointsChart(
          property_acp,
          d.country_code,
          span_id_acp,
          location_x_acp,
          location_y_acp,
          svg_acp,
          Tooltip_acp,
          width_acp,
          height_acp,
          margin_acp,
          xAxis_acp,
          yAxis_acp,
          chartStats_acp,
          chartHeader_acp
        );
  
        createHeaderStatsVisualization(
          d.country_code,
          year_hs,
          svg_hs,
          span_id_hs,
          width_hs,
          height_hs
        );
      };
  
      // Add the bars
      svg.selectAll(".cirBars").remove();
      svg
        .append("g")
        .selectAll("path")
        .data(data)
        .join("path")
        .attr("class", "cirBars")
        .attr("fill", function (d) {
          return colorScale(d[property]);
        })
        .on("mouseover", mouseover) // What to do when hovered
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .on("click", clickfunction)
        .attr(
          "d",
          d3
            .arc() // a part of a donut plot
            .innerRadius(innerRadius)
            .outerRadius(0)
            .startAngle((d) => x(d.country_name))
            .endAngle((d) => x(d.country_name) + x.bandwidth())
            .padAngle(0.01)
            .padRadius(innerRadius)
        )
        .attr("opacity", "0")
        .transition()
        .duration(3000)
        .attr(
          "d",
          d3
            .arc() // a part of a donut plot
            .innerRadius(innerRadius)
            .outerRadius((d) => y(d[property]))
            .startAngle((d) => x(d.country_name))
            .endAngle((d) => x(d.country_name) + x.bandwidth())
            .padAngle(0.01)
            .padRadius(innerRadius)
        )
        .attr("opacity", "1");
  
      // Add the labels
      svg.selectAll(".cirLabels").remove();
      svg
        .append("g")
        .selectAll("g")
        .data(data)
        .join("g")
        .attr("class", "cirLabels")
        .attr("text-anchor", function (d) {
          return (x(d.country_name) + x.bandwidth() / 2 + Math.PI) %
            (2 * Math.PI) <
            Math.PI
            ? "end"
            : "start";
        })
        .attr("transform", function (d) {
          return (
            "rotate(" +
            (((x(d.country_name) + x.bandwidth() / 2) * 180) / Math.PI - 90) +
            ")" +
            "translate(" +
            (y(d[property]) + 10) +
            ",0)"
          );
        })
        .append("text")
        .text(function (d) {
          return d.country_name;
        })
        .attr("transform", function (d) {
          return (x(d.country_name) + x.bandwidth() / 2 + Math.PI) %
            (2 * Math.PI) <
            Math.PI
            ? "rotate(180)"
            : "rotate(0)";
        })
        .style("font-size", "9px")
        .attr("alignment-baseline", "middle")
        .attr("opacity", "0")
        .transition()
        .duration(5000)
        .attr("opacity", "1");
  
      chartStats.transition().duration(3000).style("opacity", 1);
    });
  }
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////// AreaChartWithPoints LAYOUT ///////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  function createAreaPointsChart(
    property,
    country_code,
    span_id,
    location_x,
    location_y,
    svg,
    Tooltip,
    width,
    height,
    margin,
    xAxis,
    yAxis,
    chartStats,
    chartHeader
  ) {
    total_width = width + margin.left + margin.right;
    total_height = height + margin.top + margin.bottom;
  
    Tooltip.style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")
      .style("position", "absolute");
  
    chartHeadrer_wd = total_width - 30;
    chartHeadrer_ht = "20";
  
    var headerBox = chartHeader
      .append("rect")
      .attr("width", chartHeadrer_wd)
      .attr("height", chartHeadrer_ht)
      .attr("x", -1 * margin.left + (total_width - chartHeadrer_wd) / 2)
      .attr("y", -1 * margin.top + 5)
      .attr("fill", "#69b3a2");
  
    var headerText = chartHeader
      .append("text")
      .attr("class", "buttons")
      .attr("text-anchor", "middle")
      .attr(
        "x",
        -1 * margin.left +
          (total_width - chartHeadrer_wd) / 2 +
          chartHeadrer_wd / 2
      )
      .attr("y", -1 * margin.top + 20)
      .style("fill", "white")
      .text(country_code + " - " + property + " evolution over the years");
  
    //Read the data
    const parseTime = d3.timeParse("%Y");
    combinedPropertyStatsPerCountry(country_code).then(
      // Now I can use this dataset:
      function (data) {
        // Keep only the 90 first rows
        //data = data.filter((d, i) => i < 90);
  
        data = data.filter(function (d) {
          return d[property] != 0;
        });
  
        var property_data_full = data.map(function (d) {
          return d[property];
        });
  
        chartStats.selectAll("text").remove();
  
        chartStats
          .style("opacity", 0)
          .append("text")
          .style("fill", "#69b3a2")
          .text(
            "Max " +
              property +
              ": " +
              d3.max(property_data_full) +
              " | Min " +
              property +
              ": " +
              d3.min(property_data_full) +
              " | Avg " +
              property +
              ": " +
              +parseFloat(d3.mean(property_data_full).toFixed(2))
          )
          .attr("text-anchor", "left")
          .attr("x", -1 * margin.left + (total_width - chartHeadrer_wd) / 2)
          .attr("y", -1 * margin.top + 45)
          .style("font-size", "10px")
          .style("stroke", "#69b3a2")
          .style("stroke-width", "0.5");
  
        chartStats.transition().duration(1500).style("opacity", 1);
  
        // Add X axis --> it is a date format
        data.forEach(function (d) {
          d.property_year = parseTime(d.property_year);
        });
  
        var x = d3.scaleTime();
        var y = d3.scaleLinear();
  
        x.domain(d3.extent(data, (d) => d.property_year)).range([0, width]);
  
        xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(16));
        //.call((g) =>
        //  g
        //    .selectAll(".tick line")
        //    .attr("class", "axis_bar")
        //    .attr("stroke", "black")
        //    .attr("opacity", "0.3")
        //);
  
        // Add Y axis
        y.domain(d3.extent(data, (d) => +d[property])).range([height, 0]);
        yAxis
          .transition()
          .duration(1000)
          .call(d3.axisLeft(y).tickSizeOuter(0).tickSizeInner(-width))
          .call((g) =>
            g
              .selectAll(".tick line")
              .attr("class", "axis_bar")
              .attr("stroke", "black")
              .attr("opacity", "0.1")
          );
  
        // Add the area
        svg.selectAll(".myArea").remove();
        svg
          .append("path")
          .attr("class", "myArea")
          .datum(data)
          .attr("fill", "#69b3a2")
          .attr("fill-opacity", 0.3)
          .attr("stroke", "none")
          .attr(
            "d",
            d3
              .area()
              .x((d) => x(d.property_year))
              .y0(height)
              .y1(height)
          )
          .transition()
          .duration(1500)
          .attr(
            "d",
            d3
              .area()
              .x((d) => x(d.property_year))
              .y0(height)
              .y1((d) => y(d[property]))
          );
  
        // Add the line
  
        svg.selectAll(".myPath").remove();
        svg
          .append("path")
          .attr("class", "myPath")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "#81E381")
          .attr("stroke-width", 4)
          .attr(
            "d",
            d3
              .line()
              .x((d) => x(d.property_year))
              .y(height)
          )
          .transition()
          .duration(1500)
          .attr(
            "d",
            d3
              .line()
              .x((d) => x(d.property_year))
              .y((d) => y(d[property]))
          );
  
        const mouseover = function (event, d) {
          d3.selectAll("circle")
            .transition()
            .duration(200)
            .style("opacity", 0.5)
            .style("stroke", "transparent");
  
          Tooltip.style("opacity", 1);
  
          d3.select(this)
            .transition()
            .duration(200)
            .style("opacity", 1)
            .style("stroke", "black");
        };
        const mousemove = function (event, d) {
          Tooltip.html(
            "<u>" +
              d.country_name +
              " (" +
              property +
              ")" +
              "</u> : <u>" +
              parseFloat(d[property].toFixed(2)) +
              "</u>"
          )
            .style("left", event.pageX - 70 + "px")
            //.style("left", 0 + "px")
            .style("top", event.pageY - 190 + "px");
        };
        var mouseleave = function (event, d) {
          d3.selectAll("circle")
            .transition()
            .duration(200)
            .style("opacity", 0.8)
            .style("stroke", "black");
          d3.select(this).transition().duration(200);
  
          Tooltip.style("opacity", 0);
        };
        var clickfunction = function (event, d) {
          console.log("Clicked Circle", d);
          //d3.select(span_id).selectAll(".line_1").remove();
          //d3.select(span_id).selectAll(".line_2").remove();
          //createLineChart(csv_loc, d.key, d.property, span_id, color_name);
        };
  
        var property_year_list = data.map(function (d) {
          return d.property_year;
        });
  
        max_year = d3.max(property_year_list);
        min_year = d3.min(property_year_list);
        year_diff = max_year - min_year;
  
        // Add the circle
        svg.selectAll(".myCircles").remove();
        svg
          .selectAll("myCircles")
          .data(data)
          .join("circle")
          .attr("class", "myCircles")
          .attr("fill", "#3C6A5F")
          .attr("stroke", "black")
          .attr("cx", (d) => x(d.property_year))
          .attr("cy", (d) => y(d[property]))
          .attr("r", 0)
          .transition()
          .delay(1500)
          .duration(500)
          .attr("r", 5.5)
          .transition()
          .duration(300)
          .attr("r", 3);
        svg
          .selectAll(".myCircles")
          .on("mouseover", mouseover) // What to do when hovered
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave)
          .on("click", clickfunction);
      }
    );
  }
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////// MultiLineChart LAYOUT ///////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  function createMultiLineChart(
    property,
    span_id,
    location_x,
    location_y,
    svg,
    width,
    height,
    margin,
    xAxis,
    yAxis,
    chartHeader,
    chartStats,
    menu_span_id,
    parseTime
  ) {
    total_width = width + margin.left + margin.right;
    total_height = height + margin.top + margin.bottom;
  
    chartHeadrer_wd = total_width - 30;
    chartHeadrer_ht = "20";
  
    var headerBox = chartHeader
      .append("rect")
      .attr("width", chartHeadrer_wd)
      .attr("height", chartHeadrer_ht)
      .attr("x", -1 * margin.left + (total_width - chartHeadrer_wd) / 2)
      .attr("y", -1 * margin.top + 5)
      .attr("fill", "#69b3a2");
  
    var headerText = chartHeader
      .append("text")
      .attr("class", "buttons")
      .attr("text-anchor", "middle")
      .attr(
        "x",
        -1 * margin.left +
          (total_width - chartHeadrer_wd) / 2 +
          chartHeadrer_wd / 2
      )
      .attr("y", -1 * margin.top + 20)
      .style("fill", "white")
      .text("Comparison of " + property + " between multiple countries");
  
    var menu = d3.selectAll("#" + menu_span_id);
    // Define the line
  
    // A function that create / update the plot for a given variable:
    function update_1(country_list) {
      var x = d3.scaleTime().range([0, width]);
      var y = d3.scaleLinear().range([height, 0]);
  
      svg.selectAll(".multiLineLabels").remove();
  
      propertyStatsForAllYearsForAllCountries(property).then(function (data) {
        // Scale the range of the data
  
        data.forEach(function (d) {
          d.property_year = parseTime(d.property_year);
        });
  
        // Nest the entries by symbol
        var dataNest = d3.group(data, (d) => d.country_name);
        var color = d3.scaleOrdinal(d3.schemePaired);
        //var color = d3.scale.category10(); // set the colour scale
  
        menu
          .selectAll("option")
          //.remove()
          .data(dataNest.keys())
          .enter()
          .append("option")
          .attr("value", function (d) {
            return d;
          })
          .text(function (d) {
            return d;
          });
  
        legendSpace = width / dataNest.size; // spacing for legend
        console.log("legendSpace", legendSpace);
        //console.log("dataNest", dataNest);
        console.log("dataNest.keys().length", dataNest.size);
        // Loop through each symbol / key
        counter = -1;
        svg.selectAll(".line").remove();
  
        var filtered = data.filter(function (d) {
          // return d.country_name == country_list;
          return country_list.indexOf(d.country_name) !== -1;
        });
  
        var stats_data = data.filter(function (d) {
          return country_list.indexOf(d.country_name) !== -1;
        });
        //Find highest & lowest population country
        stats_data.sort(function (b, a) {
          return b.property_value - a.property_value;
        });
        lowest = stats_data.slice(0, 1)[0];
  
        stats_data.sort(function (b, a) {
          return a.property_value - b.property_value;
        });
        highest = stats_data.slice(0, 1)[0];
  
        //Find highest property Country
  
        chartStats.selectAll("text").remove();
  
        chartStats
          .style("opacity", 0)
          .append("text")
          .style("fill", "#69b3a2")
          .text("Selected Countries :   " + country_list)
          .attr("text-anchor", "left")
          .attr("x", -1 * margin.left + (total_width - chartHeadrer_wd) / 2)
          .attr("y", -1 * margin.top + 45)
          .style("font-size", "11px")
          .style("stroke", "#69b3a2")
          .style("stroke-width", "0.5");
  
        chartStats
          .style("opacity", 0)
          .append("text")
          .style("fill", "#69b3a2")
          .text(
            " Highest " +
              property +
              " Country: " +
              highest.country_name +
              " (" +
              highest.property_value +
              ") "
          )
          .attr("text-anchor", "left")
          .attr("x", -1 * margin.left + (total_width - chartHeadrer_wd) / 2)
          .attr("y", -1 * margin.top + 60)
          .style("font-size", "11px")
          .style("stroke", "#69b3a2")
          .style("stroke-width", "0.5");
  
        chartStats
          .style("opacity", 0)
          .append("text")
          .style("fill", "#69b3a2")
          .text(
            "Lowest " +
              property +
              " Country: " +
              lowest.country_name +
              " (" +
              lowest.property_value +
              ")"
          )
          .attr("text-anchor", "left")
          .attr("x", -1 * margin.left + (total_width - chartHeadrer_wd) / 2)
          .attr("y", -1 * margin.top + 75)
          .style("font-size", "11px")
          .style("stroke", "#69b3a2")
          .style("stroke-width", "0.5");
  
        chartStats.transition().duration(1500).style("opacity", 1);
  
        var dataNest_mod = d3.group(filtered, (d) => d.country_name);
        console.log("Filtered dataNest.size", dataNest_mod.size);
  
        x.domain(
          d3.extent(filtered, function (d) {
            return d.property_year;
          })
        );
        y.domain([
          0,
          d3.max(filtered, function (d) {
            return d.property_value;
          }),
        ]);
  
        dataNest_mod.forEach(function (d, i) {
          counter += 1;
          console.log("DATANEST record:", d);
          svg
            .append("path")
            .attr("class", "line")
            .attr("stroke", "steelblue")
            .attr("stroke-width", "2")
            .attr("fill", "none")
            .datum(d)
            .style("stroke", function () {
              return (d.color = color(d));
            })
            .attr(
              "d",
              d3
                .line()
                .x((d) => x(d.property_year))
                .y(height)
            )
            .transition()
            .duration(1000)
            .attr(
              "d",
              d3
                .line()
                .x((d) => x(d.property_year))
                .y((d) => y(d.property_value))
            );
  
          // Add the circle
          //svg
          //  .selectAll("myCircles")
          //  .data(d)
          //  .join("circle")
          //  .attr("class", "myCircles")
          //  .attr("fill", "#3C6A5F")
          //  .attr("stroke", "black")
          //  .attr("opacity", "0.5")
          //  .attr("cx", (d) => x(d.property_year))
          //  .attr("cy", (d) => y(d.property_value))
          //  .attr("r", 0)
          //  .transition()
          //  .delay(1500)
          //  .duration(1500)
          //  .attr("r", 5.5)
          //  .transition()
          //  .duration(1000)
          //  .attr("r", 3);
  
          filtered = d.filter(function (d) {
            var yr = +d.property_year.getUTCFullYear();
            console.log("year", yr);
            return yr === 2012;
          });
  
          console.log("filtered", filtered);
  
          svg
            .append("text")
            .attr("class", "multiLineLabels")
            .attr("dy", ".35em")
            .attr("text-anchor", "start")
            .style("font-size", "10px")
            .style("fill", "#69b3a2")
            .text(filtered[0].country_name)
            .attr("transform", "translate(" + (width + 3) + "," + height + " )")
            .transition()
            .duration(1000)
            .attr(
              "transform",
              "translate(" +
                (width + 3) +
                "," +
                y(filtered[0].property_value) +
                ")"
            );
        });
  
        xAxis
          .transition()
          .duration(1000)
          .call(d3.axisBottom(x).ticks(30))
          .selectAll("text")
          .style("text-anchor", "end")
          .style("color", "black")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-65)");
        yAxis
          .transition()
          .duration(1000)
          .call(d3.axisLeft(y).tickSizeInner(-width))
          .call((g) =>
            g
              .selectAll(".tick line")
              .attr("class", "axis_bar")
              .attr("stroke", "black")
              .attr("opacity", "0.1")
          );
      });
    }
  
    menu.on("change", function (event) {
      checklist = d3
        .select(this)
        .selectAll("option")
        .filter(function (d, i) {
          return this.selected;
        });
      final_list = checklist["_groups"][0];
  
      options = [];
      final_list.forEach(function (d) {
        options.push(d["__data__"]);
      });
  
      console.log(options);
      update_1(options);
    });
  
    // Initialize the plot with the first dataset
    country_list = ["United Arab Emirates", "Afghanistan"];
    update_1(country_list);
  }
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////// Lollipop LAYOUT LPL1////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  function createLollipopChart_lpl1(
    year,
    property,
    Tooltip,
    svg,
    margin,
    xAxis,
    yAxis,
    controlButtons,
    chartHeader,
    data_order,
    span_id,
    width,
    height
  ) {
    controlButtons
      .append("rect")
      .attr("width", width)
      .attr("height", 20)
      .attr("x", (-1 * margin.left) / 2 + 10)
      .attr("y", -1 * margin.top + 25 * 1)
      .attr("fill", "#69b3a2");
  
    controlButtons
      .append("rect")
      .attr("width", width)
      .attr("height", 20)
      .attr("x", (-1 * margin.left) / 2 + 10)
      .attr("y", -1 * margin.top + 25 * 2)
      .attr("fill", "#69b3a2");
  
    //controlButtons
    //  .append("rect")
    //  .attr("width", width + margin.left + margin.right)
    //  .attr("height", 20)
    //  .attr("x", -1 * margin.left)
    //  .attr("y", -1 * margin.top + 25 * 3)
    //  .attr("fill", "#69b3a2");
  
    controlButtons
      .append("text")
      .attr("class", "buttons")
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("x", -1 * margin.left + width / 2 + margin.right + 30)
      .attr("y", -1 * margin.top + 40 + 25 * 0)
      .style("fill", "white")
      .text("Highest")
      .on("click", function (event, d) {
        console.log("Clicked Circle", d);
        createLollipopChart_lpl1(
          "2013",
          "fertility_rate",
          Tooltip_lpl1,
          svg_lpl1,
          margin_lpl1,
          xAxis_lpl1,
          yAxis_lpl1,
          controlButtons_lpl1,
          chartHeader_lpl1,
          "DESC",
          span_id_lpl1,
          width_lpl1,
          height_lpl1
        );
      });
  
    controlButtons
      .append("text")
      .attr("class", "buttons")
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("x", -1 * margin.left + width / 2 + margin.right + 30)
      .attr("y", -1 * margin.top + 40 + 25 * 1)
      .style("fill", "white")
      .text("Lowest")
      .on("click", function (event, d) {
        console.log("Clicked Circle", d);
        createLollipopChart_lpl1(
          "2013",
          "fertility_rate",
          Tooltip_lpl1,
          svg_lpl1,
          margin_lpl1,
          xAxis_lpl1,
          yAxis_lpl1,
          controlButtons_lpl1,
          chartHeader_lpl1,
          "ASC",
          span_id_lpl1,
          width_lpl1,
          height_lpl1
        );
      });
  
    //controlButtons
    //  .append("text")
    //  .attr("class", "buttons")
    //  .attr("x", -1 * margin.left + 90)
    //  .attr("y", -1 * margin.top + 40 + 25 * 2)
    //  .style("fill", "white")
    //  .text("By Life Expectancy")
    //  .on("click", function (event, d) {
    //    console.log("Clicked Circle", d);
    //    createLollipopChart(
    //      "2013",
    //      "life_expectancy",
    //      Tooltip,
    //      svg,
    //      margin,
    //      xAxis,
    //      yAxis,
    //      controlButtons,
    //      chartHeader,
    //      data_order
    //    );
    //  });
  
    combinedPropertyStatsPerYear(year).then(function (data) {
      Tooltip.style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("position", "absolute");
  
      chartHeader
        .append("rect")
        .attr("width", width + margin.left + margin.right)
        .attr("height", 20)
        .attr("x", -1 * margin.left)
        .attr("y", -1 * margin.top)
        .attr("fill", "#69b3a2");
  
      if (data_order === "DESC") {
        chartStats_key = "Highest";
      } else {
        chartStats_key = "Lowest";
      }
  
      g_title = chartStats_key + " 30 Countries by " + property;
  
      chartHeader.selectAll(".header_title").remove();
      chartHeader
        .append("text")
        .attr("class", "header_title")
        .attr("font-size", "14px")
        .attr("text-anchor", "middle")
        .attr("x", -1 * (margin.left / 2) + width / 2 + 20)
        .attr("y", -1 * margin.top + 15)
        .style("fill", "white")
        .text(g_title);
  
      data = data.filter(function (d) {
        return d[property] != 0;
      });
  
      if (data_order === "ASC") {
        data.sort(function (b, a) {
          return b[property] - a[property];
        });
      } else {
        data.sort(function (b, a) {
          return a[property] - b[property];
        });
      }
  
      data = data.slice(0, 30);
  
      // Add X axis
      var property_data = data.map(function (d) {
        return d[property];
      });
  
      const x = d3.scaleLinear().range([0, width]);
  
      const y = d3.scaleBand().range([0, height]).padding(1);
  
      x.domain([0, d3.max(property_data)]);
      xAxis
        .transition()
        .duration(1000)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .style("color", "black")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");
  
      // Y axis
      y.domain(
        data.map(function (d) {
          return d.country_name;
        })
      );
      yAxis
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("text-anchor", "end")
        .style("color", "black")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-40)");
  
      // Lines
      svg.selectAll("line").remove();
  
      svg
        .selectAll("myline")
        .data(data)
        .join("line")
        .attr("x1", x(0))
        .attr("x2", x(0))
        .attr("y1", function (d) {
          return y(d.country_name);
        })
        .attr("y2", function (d) {
          return y(d.country_name);
        })
        .attr("stroke", "grey");
  
      const mouseover = function (event, d) {
        svg
          .selectAll("circle")
          .transition()
          .duration(200)
          .style("opacity", 0.5)
          .style("stroke", "transparent");
  
        Tooltip.style("opacity", 1);
  
        d3.select(this)
          .transition()
          .duration(200)
          .style("opacity", 1)
          .style("stroke", "black");
      };
      const mousemove = function (event, d) {
        Tooltip.html(
          "<u>" +
            d.country_name +
            " (" +
            property +
            ")" +
            "</u> : <u>" +
            parseFloat(d[property].toFixed(2)) +
            "</u>"
        )
          .style("left", event.pageX - 70 + "px")
          //.style("left", 0 + "px")
          .style("top", event.pageY - 190 + "px");
      };
      var mouseleave = function (event, d) {
        svg
          .selectAll("circle")
          .transition()
          .duration(200)
          .style("opacity", 0.8)
          .style("stroke", "black");
        d3.select(this).transition().duration(200);
  
        Tooltip.style("opacity", 0);
      };
      var clickfunction = function (event, d) {
        console.log("Clicked Circle", d);
  
        createLineChart(
          svg_lcb,
          "fertility_rate",
          span_id_lcb,
          color_name_lcb,
          chartHeader_lcb,
          d.country_code,
          x_axis_1_lcb,
          x_axis_2_lcb,
          y_axis_1_lcb,
          y_axis_2_lcb,
          width_lcb,
          height1_lcb,
          height2_lcb,
          xaxis1_height_offset_lcb
        );
      };
  
      // Circles
      svg.selectAll("circle").remove();
      svg
        .selectAll("mycircle")
        .data(data)
        .join("circle")
        .attr("cx", x(0))
        .attr("cy", function (d) {
          return y(d.country_name);
        })
        .attr("r", "0")
        .style("fill", "#69b3a2")
        .attr("stroke", "black")
        .on("mouseover", mouseover) // What to do when hovered
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .on("click", clickfunction);
  
      // Change the X coordinates of line and circle
      svg
        .selectAll("circle")
        //.transition()
        //.duration(1000)
        .attr("cx", function (d) {
          return x(d[property]);
        })
        .transition()
        .delay((d, i) => i * 50 + 550)
        .duration(500)
        .attr("r", "7");
  
      svg
        .selectAll("line")
        .transition()
        .delay((d, i) => i * 50)
        .duration(1000)
        .attr("x1", function (d) {
          return x(d[property]);
        });
    });
  }
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////// Lollipop LAYOUT LPL2////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  function createLollipopChart_lpl2(
    year,
    property,
    Tooltip,
    svg,
    margin,
    xAxis,
    yAxis,
    controlButtons,
    chartHeader,
    data_order,
    span_id,
    width,
    height
  ) {
    controlButtons
      .append("rect")
      .attr("width", width)
      .attr("height", 20)
      .attr("x", (-1 * margin.left) / 2 + 10)
      .attr("y", -1 * margin.top + 25 * 1)
      .attr("fill", "#69b3a2");
  
    controlButtons
      .append("rect")
      .attr("width", width)
      .attr("height", 20)
      .attr("x", (-1 * margin.left) / 2 + 10)
      .attr("y", -1 * margin.top + 25 * 2)
      .attr("fill", "#69b3a2");
  
    //controlButtons
    //  .append("rect")
    //  .attr("width", width + margin.left + margin.right)
    //  .attr("height", 20)
    //  .attr("x", -1 * margin.left)
    //  .attr("y", -1 * margin.top + 25 * 3)
    //  .attr("fill", "#69b3a2");
  
    controlButtons
      .append("text")
      .attr("class", "buttons")
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("x", -1 * margin.left + width / 2 + margin.right + 30)
      .attr("y", -1 * margin.top + 40 + 25 * 0)
      .style("fill", "white")
      .text("Highest")
      .on("click", function (event, d) {
        console.log("Clicked Circle", d);
        createLollipopChart_lpl2(
          "2013",
          "life_expectancy",
          Tooltip_lpl2,
          svg_lpl2,
          margin_lpl2,
          xAxis_lpl2,
          yAxis_lpl2,
          controlButtons_lpl2,
          chartHeader_lpl2,
          "DESC",
          span_id_lpl2,
          width_lpl2,
          height_lpl2
        );
      });
  
    controlButtons
      .append("text")
      .attr("class", "buttons")
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("x", -1 * margin.left + width / 2 + margin.right + 30)
      .attr("y", -1 * margin.top + 40 + 25 * 1)
      .style("fill", "white")
      .text("Lowest")
      .on("click", function (event, d) {
        console.log("Clicked Circle", d);
        createLollipopChart_lpl2(
          "2013",
          "life_expectancy",
          Tooltip_lpl2,
          svg_lpl2,
          margin_lpl2,
          xAxis_lpl2,
          yAxis_lpl2,
          controlButtons_lpl2,
          chartHeader_lpl2,
          "ASC",
          span_id_lpl2,
          width_lpl2,
          height_lpl2
        );
      });
  
    //controlButtons
    //  .append("text")
    //  .attr("class", "buttons")
    //  .attr("x", -1 * margin.left + 90)
    //  .attr("y", -1 * margin.top + 40 + 25 * 2)
    //  .style("fill", "white")
    //  .text("By Life Expectancy")
    //  .on("click", function (event, d) {
    //    console.log("Clicked Circle", d);
    //    createLollipopChart(
    //      "2013",
    //      "life_expectancy",
    //      Tooltip,
    //      svg,
    //      margin,
    //      xAxis,
    //      yAxis,
    //      controlButtons,
    //      chartHeader,
    //      data_order
    //    );
    //  });
  
    combinedPropertyStatsPerYear(year).then(function (data) {
      Tooltip.style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("position", "absolute");
  
      chartHeader
        .append("rect")
        .attr("width", width + margin.left + margin.right)
        .attr("height", 20)
        .attr("x", -1 * margin.left)
        .attr("y", -1 * margin.top)
        .attr("fill", "#69b3a2");
  
      if (data_order === "DESC") {
        chartStats_key = "Highest";
      } else {
        chartStats_key = "Lowest";
      }
  
      g_title = chartStats_key + " 30 Countries by " + property;
  
      chartHeader.selectAll(".header_title").remove();
      chartHeader
        .append("text")
        .attr("class", "header_title")
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("x", -1 * (margin.left / 2) + width / 2 + 20)
        .attr("y", -1 * margin.top + 15)
        .style("fill", "white")
        .text(g_title);
  
      data = data.filter(function (d) {
        return d[property] != 0;
      });
  
      if (data_order === "ASC") {
        data.sort(function (b, a) {
          return b[property] - a[property];
        });
      } else {
        data.sort(function (b, a) {
          return a[property] - b[property];
        });
      }
  
      data = data.slice(0, 30);
  
      // Add X axis
      var property_data = data.map(function (d) {
        return d[property];
      });
  
      const x = d3.scaleLinear().range([0, width]);
  
      const y = d3.scaleBand().range([0, height]).padding(1);
  
      x.domain([0, d3.max(property_data)]);
      xAxis
        .transition()
        .duration(1000)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .style("color", "black")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");
  
      // Y axis
      y.domain(
        data.map(function (d) {
          return d.country_name;
        })
      );
      yAxis
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("text-anchor", "end")
        .style("color", "black")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-40)");
  
      // Lines
      svg.selectAll("line").remove();
  
      svg
        .selectAll("myline")
        .data(data)
        .join("line")
        .attr("x1", x(0))
        .attr("x2", x(0))
        .attr("y1", function (d) {
          return y(d.country_name);
        })
        .attr("y2", function (d) {
          return y(d.country_name);
        })
        .attr("stroke", "grey");
  
      const mouseover = function (event, d) {
        d3.selectAll("circle")
          .transition()
          .duration(200)
          .style("opacity", 0.5)
          .style("stroke", "transparent");
  
        Tooltip.style("opacity", 1);
  
        d3.select(this)
          .transition()
          .duration(200)
          .style("opacity", 1)
          .style("stroke", "black");
      };
      const mousemove = function (event, d) {
        Tooltip.html(
          "<u>" +
            d.country_name +
            " (" +
            property +
            ")" +
            "</u> : <u>" +
            parseFloat(d[property].toFixed(2)) +
            "</u>"
        )
          .style("left", event.pageX - 70 + "px")
          //.style("left", 0 + "px")
          .style("top", event.pageY - 190 + "px");
      };
      var mouseleave = function (event, d) {
        d3.selectAll("circle")
          .transition()
          .duration(200)
          .style("opacity", 0.8)
          .style("stroke", "black");
        d3.select(this).transition().duration(200);
  
        Tooltip.style("opacity", 0);
      };
      var clickfunction = function (event, d) {
        console.log("Clicked Circle", d);
  
        createLineChart(
          svg_lcb,
          "life_expectancy",
          span_id_lcb,
          color_name_lcb,
          chartHeader_lcb,
          d.country_code,
          x_axis_1_lcb,
          x_axis_2_lcb,
          y_axis_1_lcb,
          y_axis_2_lcb,
          width_lcb,
          height1_lcb,
          height2_lcb,
          xaxis1_height_offset_lcb
        );
      };
  
      // Circles
      svg.selectAll("circle").remove();
      svg
        .selectAll("mycircle")
        .data(data)
        .join("circle")
        .attr("cx", x(0))
        .attr("cy", function (d) {
          return y(d.country_name);
        })
        .attr("r", "0")
        .style("fill", "#69b3a2")
        .attr("stroke", "black")
        .on("mouseover", mouseover) // What to do when hovered
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .on("click", clickfunction);
  
      // Change the X coordinates of line and circle
      svg
        .selectAll("circle")
        //.transition()
        //.duration(1000)
        .attr("cx", function (d) {
          return x(d[property]);
        })
        .transition()
        .delay((d, i) => i * 50 + 550)
        .duration(500)
        .attr("r", "7");
  
      svg
        .selectAll("line")
        .transition()
        .delay((d, i) => i * 50)
        .duration(1000)
        .attr("x1", function (d) {
          return x(d[property]);
        });
    });
  }
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////// LineChart with BrushZoom //////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  function createLineChart(
    svg,
    property_type,
    span_id,
    color_name,
    chartHeader,
    country_code,
    x_axis_1,
    x_axis_2,
    y_axis_1,
    y_axis_2,
    width,
    height1,
    height2,
    xaxis1_height_offset
  ) {
    //color_name = "lightblue";
  
    chartHeader
      .append("rect")
      .attr("width", width)
      .attr("height", 20)
      .attr("x", -10)
      .attr("y", -25)
      .attr("fill", "#69b3a2");
  
    chartHeader
      .append("text")
      .attr("class", "linechart_title")
      .attr("font-size", "14px")
      .attr("x", width / 2 - 100)
      .attr("y", -10)
      .style("fill", "white")
      .text(country_code + " : " + property_type + " per year");
  
    chartHeader
      .append("rect")
      .attr("width", 400)
      .attr("height", 20)
      .attr("x", width / 2 - 140 - 50)
      .attr("y", height1 + 150 - 30)
      .attr("fill", "green");
  
    chartHeader
      .append("text")
      .attr("class", "brush_to_zoom")
      .attr("font-size", "14px")
      .attr("x", width / 2 - 130)
      .attr("y", height1 + 165 - 30)
      .style("fill", "white")
      .text("Brush Above To View Zoom In Range Below");
  
    var format = d3.timeFormat("%Y-%m-%d");
  
    const parseTime = d3.timeParse("%Y");
  
    propertyStatsPerCountry(property_type, country_code).then(function (data) {
      svg.selectAll("path").remove();
  
      // Add X axis --> it is a date format
      data.forEach(function (d) {
        d.property_year = parseTime(d.property_year);
      });
  
      svg
        .select(".linechart_title")
        .text(country_code + " : " + property_type + " per year");
  
      console.log(data);
  
      var x1 = d3.scaleTime().range([0, width]);
      var y1 = d3.scaleLinear().range([height1, 0]);
      var x2 = d3.scaleTime().range([0, width]);
      var y2 = d3.scaleLinear().range([height2, 0]);
  
      x1.domain(
        d3.extent(data, function (d) {
          return d.property_year;
        })
      );
      y1.domain([
        d3.min(data, function (d) {
          return d.property_value;
        }),
        d3.max(data, function (d) {
          return d.property_value;
        }),
      ]);
  
      x2.domain(
        d3.extent(data, function (d) {
          return d.property_year;
        })
      );
      y2.domain([
        d3.min(data, function (d) {
          return d.property_value;
        }),
        d3.max(data, function (d) {
          return d.property_value;
        }),
      ]);
      x_axis_1
        .transition()
        .duration(1000)
        .call(d3.axisBottom(x1).ticks(10).tickFormat(d3.timeFormat("%Y")))
        .selectAll("text")
        .style("text-anchor", "end")
        .style("color", "black")
        .attr("dx", "1em")
        .attr("dy", ".80em");
      //.attr("transform", "rotate(-65)");
      y_axis_1
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y1).ticks(5).tickSizeInner(-width))
        .call((g) =>
          g
            .selectAll(".tick line")
            .attr("class", "axis_bar")
            .attr("stroke", "black")
            .attr("opacity", "0.1")
        );
  
      x_axis_2
        .transition()
        .duration(1000)
        .call(d3.axisBottom(x2).ticks(10).tickFormat(d3.timeFormat("%Y")))
        .selectAll("text")
        .style("text-anchor", "end")
        .style("color", "black")
        .attr("dx", "1em")
        .attr("dy", ".80em");
      // .attr("transform", "rotate(-65)");
      y_axis_2
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y2).ticks(5).tickSizeInner(-width))
        .call((g) =>
          g
            .selectAll(".tick line")
            .attr("class", "axis_bar")
            .attr("stroke", "black")
            .attr("opacity", "0.1")
        );
  
      // Add a clipPath: everything out of this area won't be drawn.
      const clip = svg
        .append("defs")
        .append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width)
        .attr("height", height1)
        .attr("x", 0)
        .attr("y", xaxis1_height_offset);
  
      const clip2 = svg
        .append("defs")
        .append("svg:clipPath")
        .attr("id", "clip2")
        .append("svg:rect")
        .attr("width", width)
        .attr("height", height2)
        .attr("x", 0)
        .attr("y", height2);
  
      // Add brushing
      const brush = d3
        .brushX() // Add the brush feature using the d3.brush function
        .extent([
          [0, xaxis1_height_offset],
          [width, height1 + xaxis1_height_offset],
        ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("end", updateChart); // Each time the brush selection changes, trigger the 'updateChart' function
  
      // Create the line variable: where both the line and the brush take place
      const line_1 = svg.append("g").attr("clip-path", "url(#clip)");
  
      // Add the line
      line_1
        .append("path")
        .datum(data)
        .attr("class", "line_1") // I add the class line to be able to modify this line later on.
        .attr("fill", "none")
        .attr("stroke", color_name)
        .attr("stroke-width", 1.5)
        .attr(
          "d",
          d3
            .line()
            .x(function (d) {
              return x1(d.property_year);
            })
            .y(height1 * 2)
        )
        .transition()
        .duration(1000)
        .attr(
          "d",
          d3
            .line()
            .x(function (d) {
              return x1(d.property_year);
            })
            .y(function (d) {
              return y1(d.property_value) + xaxis1_height_offset;
            })
        );
  
      // Add the brushing
      line_1.append("g").attr("class", "brush").call(brush);
  
      //const line_2 = svg.append("g").attr("clip-path", "url(#clip)");
  
      const line_2 = svg.append("g").attr("clip-path", "url(#clip2)");
  
      // Add the line
      line_2
        .append("path")
        .datum(data)
        .attr("class", "line_2") // I add the class line to be able to modify this line later on.
        .attr("fill", "none")
        .attr("stroke", "lightblue")
        .attr("stroke-width", 1.5)
        .attr(
          "d",
          d3
            .line()
            .x(function (d) {
              return x2(d.property_year);
            })
            .y(+height2 * 2)
        )
        .transition()
        .duration(1000)
        .attr(
          "d",
          d3
            .line()
            .x(function (d) {
              return x2(d.property_year);
            })
            .y(function (d) {
              return y2(d.property_value) + height2;
            })
        );
  
      // Add the brushing
      //line_2.append("g").attr("class", "brush").call(brush);
  
      // A function that set idleTimeOut to null
      let idleTimeout;
      function idled() {
        idleTimeout = null;
      }
  
      function updateChart(event, d) {
        // What are the selected boundaries?
        extent = event.selection;
  
        // If no selection, back to initial coordinate. Otherwise, update X axis domain
        if (!extent) {
          if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350)); // This allows to wait a little bit
          x.domain([4, 8]);
        } else {
          console.log("d", d);
          console.log("extent", extent);
          console.log("x2.invert(extent[0])", x2.invert(extent[0]));
          console.log("x2.invert(extent[1])", x2.invert(extent[1]));
          console.log("x2.invert(0)", x2.invert(0));
          console.log("x2.invert(width)", x2.invert(width));
  
          x2.domain(
            d3.extent(data, function (d) {
              return d.property_year;
            })
          );
          //x.domain([x.invert(0), x.invert(width)]);
          x2.domain([x2.invert(extent[0]), x2.invert(extent[1])]);
          line_1.select(".brush").call(brush.move, null); // This remove the grey brush area as soon as the selection has been done
        }
  
        // Update axis and line position
        x_axis_2.transition().duration(1000).call(d3.axisBottom(x2));
        line_2
          .select(".line_2")
          .transition()
          .duration(1000)
          .attr(
            "d",
            d3
              .line()
              .x(function (d) {
                return x2(d.property_year);
              })
              .y(function (d) {
                return y2(d.property_value) + height2;
              })
          );
      }
    });
  }
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////// Grouped Scatter Plot //////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  function createGroupedScatterPlot(
    year,
    svg,
    margin,
    width,
    height,
    xAxis,
    yAxis,
    Tooltip,
    chartHeader,
    chartLegend
  ) {
    // set the dimensions and margins of the graph
  
    //Read the data
    combinedPropertyStatsPerYearWithMetadataLookup(year).then(function (data) {
      total_width = width + margin.left + margin.right;
      total_height = height + margin.top + margin.bottom;
  
      Tooltip.style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("position", "absolute");
  
      chartHeadrer_wd = total_width - 20;
      chartHeadrer_ht = "20";
  
      var headerBox = chartHeader
        .append("rect")
        .attr("width", chartHeadrer_wd)
        .attr("height", chartHeadrer_ht)
        .attr("x", -1 * margin.left + 10)
        .attr("y", -1 * margin.top)
        .attr("fill", "#69b3a2");
  
      var headerText = chartHeader
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", -1 * margin.left + chartHeadrer_wd / 2 + 10)
        .attr("y", -1 * margin.top + 15)
        .style("fill", "white")
        .text(
          "Correlation Between Fertility Rate - Life Expectancy - Income Group"
        );
  
      //Set Legendd
  
      legend_width = 15;
      legend_height = 15;
  
      //.domain(["LI", "LMI", "UMI", "HI"])
      //  .range(["#c4e1db", "#5cac9a", "#52a290", "#1e3a34"]);
  
      var xAxisLabel = chartLegend
        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(270)")
        .attr("x", -150)
        .attr("y", 20 + legend_height / 2 - 70)
        .style("fill", "#1e3a34")
        .text("Life Expectancy")
        .style("opacity", "0")
        .transition()
        .delay(200 * 1)
        .duration(1000)
        .style("opacity", "1");
  
      var yAxisLabel = chartLegend
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .style("fill", "#1e3a34")
        .text("Fertility Rate")
        .style("opacity", "0")
        .transition()
        .delay(200 * 1)
        .duration(1000)
        .style("opacity", "1");
  
      var legend_ph_1 = chartLegend
        .append("rect")
        .attr("width", legend_width)
        .attr("height", legend_height)
        .attr("x", width + 30)
        .attr("y", 20)
        .attr("fill", "#1e3a34")
        .style("opacity", "0")
        .transition()
        .delay(200 * 1)
        .duration(1000)
        .style("opacity", "1");
  
      var legend_ph_2 = chartLegend
        .append("rect")
        .attr("width", legend_width)
        .attr("height", legend_height)
        .attr("x", width + 30)
        .attr("y", 60)
        .attr("fill", "#52a290")
        .style("opacity", "0")
        .transition()
        .delay(200 * 2)
        .duration(1000)
        .style("opacity", "1");
  
      var legend_ph_3 = chartLegend
        .append("rect")
        .attr("width", legend_width)
        .attr("height", legend_height)
        .attr("x", width + 30)
        .attr("y", 100)
        .attr("fill", "#5cac9a")
        .style("opacity", "0")
        .transition()
        .delay(200 * 3)
        .duration(1000)
        .style("opacity", "1");
  
      var legend_ph_4 = chartLegend
        .append("rect")
        .attr("width", legend_width)
        .attr("height", legend_height)
        .attr("x", width + 30)
        .attr("y", 140)
        .attr("fill", "#c4e1db")
        .style("opacity", "0")
        .transition()
        .delay(200 * 4)
        .duration(1000)
        .style("opacity", "1");
  
      var legend_tx_1 = chartLegend
        .append("text")
        .attr("x", width + 30 + legend_width + 10)
        .attr("y", 20 + legend_height / 2 + 5)
        .style("fill", "#1e3a34")
        .text("High Income")
        .style("opacity", "0")
        .transition()
        .delay(200 * 1)
        .duration(1000)
        .style("opacity", "1");
  
      var legend_tx_2 = chartLegend
        .append("text")
        .attr("x", width + 30 + legend_width + 10)
        .attr("y", 20 + legend_height / 2 + 5 + 40)
        .style("fill", "#52a290")
        .text("Upper Middle Income")
        .style("opacity", "0")
        .transition()
        .delay(200 * 2)
        .duration(1000)
        .style("opacity", "1");
  
      var legend_tx_3 = chartLegend
        .append("text")
        .attr("x", width + 30 + legend_width + 10)
        .attr("y", 20 + legend_height / 2 + 5 + 80)
        .style("fill", "#5cac9a")
        .text("Lower Middle Income")
        .style("opacity", "0")
        .transition()
        .delay(200 * 3)
        .duration(1000)
        .style("opacity", "1");
  
      var legend_tx_4 = chartLegend
        .append("text")
        .attr("x", width + 30 + legend_width + 10)
        .attr("y", 20 + legend_height / 2 + 5 + 120)
        .style("fill", "#c4e1db")
        .text("Low Income")
        .style("opacity", "0")
        .transition()
        .delay(200 * 4)
        .duration(1000)
        .style("opacity", "1");
  
      console.log("data inside function call", data);
  
      data = data.filter(function (d) {
        return d.fertility_rate != 0 && d.life_expectancy != 0;
      });
  
      var fertilty_rate_data = data.map(function (d) {
        return d.fertility_rate;
      });
  
      var life_expectancy_data = data.map(function (d) {
        return d.life_expectancy;
      });
  
      // Add X axis
      const x = d3
        .scaleLinear()
        .domain([d3.min(fertilty_rate_data), d3.max(fertilty_rate_data)])
        .range([0, width]);
  
      xAxis
        .transition()
        .duration(1000)
        .call(d3.axisBottom(x).tickSizeInner(-height))
        .call((g) =>
          g
            .selectAll(".tick line")
            .attr("class", "axis_bar")
            .attr("stroke", "black")
            .attr("opacity", "0.1")
        );
  
      // Add Y axis
      const y = d3
        .scaleLinear()
        .domain([d3.min(life_expectancy_data), d3.max(life_expectancy_data)])
        .range([height, 0]);
      yAxis
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y).tickSizeInner(-width))
        .call((g) =>
          g
            .selectAll(".tick line")
            .attr("class", "axis_bar")
            .attr("stroke", "black")
            .attr("opacity", "0.1")
        );
  
      // Color scale: give me a specie name, I return a color
      const color = d3
        .scaleOrdinal()
        .domain(["LI", "LMI", "UMI", "HI"])
        .range(["#c4e1db", "#5cac9a", "#52a290", "#1e3a34"]);
  
      // Highlight the specie that is hovered
      const highlight = function (event, d) {
        selected_specie = d.income_grp_key;
  
        d3.selectAll(".dot")
          .transition()
          .duration(200)
          .style("fill", "lightgrey")
          .attr("r", 3);
  
        d3.selectAll("." + selected_specie)
          .transition()
          .duration(200)
          .style("fill", color(selected_specie))
          .attr("r", 7);
  
        Tooltip.style("opacity", 1);
      };
  
      // Highlight the specie that is hovered
      const doNotHighlight = function (event, d) {
        d3.selectAll(".dot")
          .transition()
          .duration(200)
          .style("fill", (d) => color(d.income_grp_key))
          .attr("r", 5);
        Tooltip.style("opacity", 0);
      };
  
      const mousemove = function (event, d) {
        Tooltip.html(
          "<u>" +
            d.country_name +
            "</br> Population:" +
            "</u> : <u>" +
            +parseFloat(d.population.toFixed(2)) +
            "</u>" +
            "</br> Fertility Rate:" +
            "</u> : <u>" +
            +parseFloat(d.fertility_rate.toFixed(2)) +
            "</u>" +
            "</br> Life Expectancy:" +
            "</u> : <u>" +
            +parseFloat(d.life_expectancy.toFixed(2)) +
            "</u>" +
            "</br> Income Group:" +
            "</u> : <u>" +
            d.income_grp_name +
            "</u>"
        )
          .style("left", event.pageX - 70 + "px")
          //.style("left", 0 + "px")
          .style("top", event.pageY - 190 + "px");
      };
  
      // Add dots
      dots = svg
        .append("g")
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", function (d) {
          return "dot " + d.income_grp_key;
        })
        .attr("cx", function (d) {
          return x(d.fertility_rate);
        })
        .attr("cy", function (d) {
          return y(d.life_expectancy);
        })
        .attr("r", 0)
        .style("fill", function (d) {
          return color(d.income_grp_key);
        });
  
      dots
        .transition()
        .delay((d, i) => i * 10)
        .duration(500)
        .attr("r", 5);
  
      dots
        .on("mouseover", highlight)
        .on("mousemove", mousemove)
        .on("mouseleave", doNotHighlight);
    });
  }
  
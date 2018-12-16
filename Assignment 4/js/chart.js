/*Globale variabelen*/

//Variabelen voor breedte en hoogte chart.
var width = 1400;
var height = 500;

//Variables for the axes
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

//Interval for animation.
var interval = 4000;

//Variables for margin, a counter to loop through data, lookup keys for the data and one for the area chart.
var margin = 50;
var counter = 1;
var keys = [];
var area;

//Colorarray.
var colors = ["#4770B6", "#EE7E32", "#7C0A02", "#FCC00D", "#274479", "#72AE47", "#9E4A16", "#9A7414", "#5C9BD4", "#646464"];

//Parse the year. source: https://stackoverflow.com/questions/41581284/parsing-dates-with-d3-js-v-4
var parseDate = d3.timeParse("%Y");

//create svg, append it to the body and set attributes.
var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height + (margin * 2))
  .append("g").attr("transform", "translate(" + margin + "," + margin + ")");


//Call the main function to draw the chart and animate it.
drawLinearAreaChart();


//Function that call a method to draw a chart and animate it.
function drawLinearAreaChart() {

  var numberOfColumns;

  //Get the keys/column names of the data to loop through the data later and get the number of columns.
  d3.csv("data.csv").get(function (data) {
    keys = Object.keys(data[0]);
    numberOfColumns = data.columns.length;
  });

  //Call function to draw the initial chart.
  drawInitialChart(counter);
  counter += 1;

  //Set interval to draw the updated chart;
  window.setInterval(function () {
    updateChart(counter);
    counter++;
    if (counter == numberOfColumns) {
      counter = 1;
    }
  }, interval);
}


//Function that draws initial chart.
function drawInitialChart(country) {
  //Call function to update area.
  area = updateArea(country);

  //Get the data.
  d3.csv("data.csv", function (error, data) {
    //Update text.
    document.getElementById("country").innerHTML = "Tourisme in " + data.columns[country];

    try {
      //Format date
      data.forEach(function (d) {
        d.year = parseDate(d.year);
      });

      //Set range of x- and y-axis.
      x.domain(d3.extent(data, function (d) {
        return d.year;
      }));

      y.domain([0, d3.max(data, function (d) {
        //Source: https://groups.google.com/forum/#!topic/d3-js/dAfM2Mk_NWY
        return d[keys[country]];
      })]);

      //Add area to svg.
      svg.append("path").data([data])
        .attr("class", "area")
        .attr("id", data.columns[country])
        .attr("d", area)
        .style("fill", colors[country - 1]);

      //Add axes
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      svg.append("g")
        .call(d3.axisLeft(y));

    } catch (error) {
      console.log(error);
    }
  });
}

//function to update the chart.
function updateChart(country) {
  //Get svg element
  svg = d3.select("body");

  // Get data
  d3.csv("data.csv", function (error, data) {
    //Update text.
    document.getElementById("country").innerHTML = "Tourisme in " + data.columns[country];

    try {

      //Format column "Year" of the data.
      data.forEach(function (d) {
        d.year = parseDate(d.year);
      });

      //Update the area.
      area = updateArea(country);

      //Get area chart and update.
      svg.selectAll('.area')
        .data([data])
        .transition()
        .duration(750)
        .style("fill", colors[country - 1])
        .attr("d", area);

    } catch (error) {
      console.log(error);
    }
  });
}

//Function to update area.
function updateArea(country) {
  return d3.area()
    .x(function (d) {
      return x(d.year);
    })
    .y0(height)
    .y1(function (d) {
      return y(d[keys[country]]);
    });
}

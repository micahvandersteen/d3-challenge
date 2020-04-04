// =============================================
// ========= MAIN ASSIGNMENT START ===========
// ==============================================

// ======== Setting Up Chart Area ===========
// Defining SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Defining chart margin object
var chartMargin = 
    {
        top: 20,
        right: 40,
        bottom: 60,
        left: 100
    };

// Defining Dimensions of Chart Area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// selecting div of 'index.html' with id 'scatter' to place chart, 
// appending SVG area to it, and setting dimensions
var svg = d3.select("#scatter")
            .append("svg")
            .attr("width", svgWidth)            
            .attr("height", svgHeight);


// appending chart group to svg area to translate the margins set in the
// chartMargin object
var chartGroup = svg.append("g")
                    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// ======== Beginning Data Retrieval ==========

// defining file path of 'data.csv' file
var filePath = "assets/data/data.csv"; 

// read in data promise from 'data.csv' using 'd3.csv'
// then => execute code within {}
d3.csv(filePath).then((data) => {

    // ====== Parsing Data =======
    // casting desired variable values to numbers
    data.forEach((d) => {
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;
    });

    //// create function to update scales on clicks =========
    // ====== Creating x and y scales ========
    var xLinearScale = d3.scaleLinear()
                         .domain([d3.min(data, d => d.poverty)-1, d3.max(data, d => d.poverty)+1])
                         .range([0, chartWidth]);

    var yLinearScale = d3.scaleLinear()
                         .domain([d3.min(data, d => d.healthcare)-2, d3.max(data, d => d.healthcare)+2])
                         .range([chartHeight, 0]);
    
    //// create function to axes scales on clicks =========
    // ======== creating x and y axes ===========
    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);

    // appending axes
    // x
    chartGroup.append("g")
              .attr("transform", `translate(0, ${chartHeight})`)
              .call(xAxis);

    // y
    chartGroup.append("g")
              .call(yAxis);

    // ===== Appending circles for data ==========
    var circlesGroup = chartGroup.selectAll("circle")
                                 .data(data)
                                 .enter()
                                 .append("circle")
                                 .attr("cx", d => xLinearScale(d.poverty))
                                 .attr("cy", d => yLinearScale(d.healthcare))
                                 .attr("r", "10")
                                 .attr("class", "stateCircle")

    // Appending state abbreviations within each circle
    var circleLabels = chartGroup.selectAll(null)
                                 .data(data)
                                 .enter()
                                 .append("text")
                                 .attr("x", d => xLinearScale(d.poverty))
                                 .attr("y", d => yLinearScale(d.healthcare) + 4)
                                 .text((d) => d.abbr)
                                 .attr("class", "stateText");

                                 
    ////// ========= Adding tool tips ========= /////////
    // initializing tool tip
    var toolTip = d3.tip()
                    .attr("class", "d3-tip")
                    .offset([0, 5])
                    .html(function(d) {
                    return `${d.state}<br>Poverty Rate: ${d.poverty}%<br>Lacking Healthcare: ${d.healthcare}%`
                    });
    
    // creating tooltip within chart
    chartGroup.call(toolTip);

    // creating event listener to display and hide tooltip
    // shows tooltip on mouseover
    circlesGroup.on("mouseover", (data) => {
        toolTip.show(data, this);
    });

    // removing tooltip on mouseout
    circlesGroup.on("mouseout", (data, index) => {
        toolTip.hide(data);
    });

    // create axes labels
    chartGroup.append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 0 - chartMargin.left + 50)
              .attr("x", 0 - (chartHeight / 2))
              .attr("dy", "1em")
              .attr("class", "aText")
              .text("Lacks Healthcare (%)");

    chartGroup.append("text")
              .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top + 25})`)
              .attr("class", "aText")
              .text("Poverty (%)");

    // Appending chart title
    chartGroup.append("text")
              .attr("y", 0)
              .attr("x", chartWidth/2 - 200)
              .attr("class", "chartTitle")
              .text("United States Healthcare vs. Poverty");
}).catch((error) => console.log(error));
// =============================================
// ========= MAIN ASSIGNMENT ENDS ===========
// ==============================================

// ===================================================================================================


// // =============================================
// // ========= BONUS ASSIGNMENT START ===========
// // ==============================================
// // note that the svg area and chart specs are already set up
// // everything referenced with 'B' on end of variables to refer to bonus

//     // creating svg wrapper in space with id 'bonusPlot'
//     var svgB = d3.select("#scatter")
//                      .append("svg")
//                      .attr("width", svgWidth)
//                      .attr("height", svgHeight)

//     var chartGroupB = svgB.append("g")
//                                   .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

//     // setting initial parameters
//     var chosenXAxis = "poverty";

//     // function to update x-scale upon clicking on axis label
//     function xScale(data, chosenXAxis) 
//     {
//         var xLinearScaleB = d3.scaleLinear()
//                              .domain([d3.min(data, d => d[chosenXAxis]),
//                                       d3.max(data, d => d[chosenXAxis])
//                                     ])
//                              .range([0, chartWidth]);
//         return xLinearScaleB;
//     }

//     // function to update xAxis on click of label
//     function renderAxes(newXScale, xAxis) 
//     {
//         var bottomAxisB = d3.axisBottom(newXScale);

//         xAxis.transition()
//              .duration(1000)
//              .call(bottomAxisB);

//         return xAxis;
//     }

//     // function to update circle group with transition to new circles
//     function renderCircles(circlesGroupB, newXScale, chosenXAxis) 
//     {
//         circlesGroupB.transition()
//                      .duration(1000)
//                      .attr("cx", d => newXScale(d[chosenXAxis]));

//         return circlesGroupB;
//     }

//     // function to update circles group with new tooltip
//     function updateToolTip(chosenXAxis, circlesGroupB) 
//     {
//         var label;

//         if (chosenXAxis === "poverty") {
//             label = "Poverty (%)";
//         }
//         else if (chosenXAxis === "age") {
//             label = "Age (Median)";
//         }
//         else {
//             label = "Household Income (Median)";
//         }

//         var toolTipB = d3.tip()
//                          .attr("class", "d3-tip")
//                          .offset([80,60])
//                          .html(function(d) {
//                              return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
//                          });
        
//         circlesGroupB.call(toolTipB);

//         circlesGroupB.on("mouseover", d => toolTipB.show(d));

//         circlesGroupB.on("mouseout", (d,index) => toolTipB.hide(d));

//         return circlesGroupB;
//     }

// var filePath = "assets/data/data.csv";

// // setting up framework to get data
// d3.csv(filePath).then((data) => {

//     // ====== Parsing Data =======
//     // casting desired variable values to numbers
//     data.forEach((d) => {
//         d.poverty = +d.poverty;
//         d.healthcare = +d.healthcare;
//         d.income = +d.income;
//         d.age = +d.age;
//         d.smokes = +d.smokes;
//         d.obesity = +d.obesity;
//     });

//     // creating axes scales
//     var xLinearScaleB = xScale(data, chosenXAxis);
//     var yLinearScaleB = d3.scaleLinear()
//                             .domain([d3.min(data, d => d.healthcare)-2, d3.max(data, d => d.healthcare)+2])
//                             .range([chartHeight, 0])

//     // creating initial axes functions
//     var bottomAxisB = d3.axisBottom(xLinearScaleB);
//     var leftAxisB = d3.axisLeft(yLinearScaleB);

//     // appending x axis
//     var xAxis = chartGroupB.append("g")
//                            .attr("transform", `translate(0, ${chartHeight})`)
//                            .call(bottomAxisB);

//     // appending y axis
//    chartGroupB.append("text")
//             .attr("transform", "rotate(-90)")
//             .attr("y", 0 - chartMargin.left)
//             .attr("x", 0 - (chartHeight / 2))
//             .attr("dy", "1em")
//             .classed("axis-text", true)
//             .text("Lacks Healthcare (%)");


//     // appending circles for selected data
//     var circlesGroupB = chartGroupB.selectAll("circle")
//                                    .data(data)
//                                    .enter()
//                                    .append("circle")
//                                    .attr("cx", d => xLinearScaleB(d[chosenXAxis]))
//                                    .attr("cy", d => yLinearScaleB(d.healthcare))
//                                    .attr("class", "stateCircle");
                                
//     // creating group for x axis labels
//     var xlabelsGroup = chartGroupB.append("g")
//                                   .attr("transform", `translate(${chartWidth / 2}, ${chartHeight})`);
    
//     // defining the different x axis labels                            
//     var povertyLabel = xlabelsGroup.append("text")
//                                    .attr("x", 0)
//                                    .attr("y", 20)
//                                    .attr("value", "poverty")
//                                    .classed("active", true)
//                                    .text("Poverty (%)");

//     var ageLabel = xlabelsGroup.append("text")
//                                 .attr("x", 0)
//                                 .attr("y", 40)
//                                 .attr("value", "age")
//                                 .classed("inactive", true)
//                                 .text("Age (Median)");

//     var houseIncomeLabel = xlabelsGroup.append("text")
//                                         .attr("x", 0)
//                                         .attr("y", 60)
//                                         .attr("value", "income")
//                                         .classed("inactive", true)
//                                         .text("Household Income (Median)");

//     // creating group for y axis labels

//     // defining the different y axis labels

//     // x axis labels event listener
//     xlabelsGroup.selectAll("text").on("click", function() {
//             var value = d3.select(this).attr("value");
//             if (value !== chosenXAxis) {
//                 chosenXaxis = value;
//                 xLinearScaleB = xScale(data, chosenXAxis);
//                 xAxis = renderAxes(xLinearScaleB, xAxis);
//                 circlesGroupB = renderCircles(circlesGroupB, xLinearScaleB, chosenXAxis);
//                 circlesGroupB = updateToolTip(chosenXAxis, circlesGroupB);
//                 if (chosenXAxis === "age") {
//                     povertyLabel.classed("active", false)
//                                 .classed("inactive", true);
//                     ageLabel.classeed("active", true)
//                             .classed("inactive", false);
//                     houseIncomeLabel.classeed("active", false)
//                                     .classed("inactive", true);
//                 }

//                 else if (chosenXAxis === "income") {
//                 povertyLabel.classed("active", false)
//                             .classed("inactive", true);
//                 ageLabel.classeed("active", false)
//                         .classed("inactive", true);
//                 houseIncomeLabel.classeed("active", true)
//                                 .classed("inactive", false);
//                 }

//                 else {
//                 povertyLabel.classed("active", true)
//                             .classed("inactive", false);
//                 ageLabel.classeed("active", false)
//                         .classed("inactive", true);
//                 houseIncomeLabel.classeed("active", false)
//                                 .classed("inactive", true);
//                 }
//     }
// }).catch((error) => console.log(error));

// });
// // ======================================
// // ======= BONUS ASSIGNMENT ENDS =======
// // ======================================
d3.csv("deaths_age_sex.csv", function (error, newData) {
    let labels = ['0-10', '11-20', '21-40', '41-60', '61-80', '>80'];
    let series = [{ label: 'Male', values: [] }, { label: 'Female', values: [] }];
    let tempMale = [];
    let tempFemale = [];
    labels.forEach((lab, index) => {
        let filterMale = newData.filter((d) => { return +d.age == index && d.gender == 0; })
        let filterFemale = newData.filter((d) => { return +d.age == index && d.gender == 1; })
        tempMale.push(filterMale.length);
        tempFemale.push(filterFemale.length);
    })
    series[0].values = tempMale;
    series[1].values = tempFemale;
    var data = {};
    data.labels = labels;
    data.series = series;

    var chartWidth = 300,
        barHeight = 20,
        groupHeight = barHeight * data.series.length,
        gapBetweenGroups = 10,
        spaceForLabels = 0,
        spaceForLegend = 150;


    var chartData = [];
    for (var i = 0; i < data.labels.length; i++) {
        for (var j = 0; j < data.series.length; j++) {
            let obj = {};
            obj["label"] = data.series[j].label;
            obj["value"] = data.series[j].values[i];
            obj["age"] = i;
            chartData.push(obj);
        }
    }


    var color = d3.scaleOrdinal()
        .range(["#16A085", "#33435C"]);
    var chartHeight = barHeight * chartData.length + gapBetweenGroups * data.labels.length;

    var x = d3.scaleLinear()
        .domain([0, d3.max(chartData, function (d) { return +d.value; })])
        .range([0, chartWidth]);

    var y = d3.scaleLinear()
        .range([chartHeight + gapBetweenGroups, 0]);

    var yAxis = d3.axisLeft()
        .scale(y)
        .tickFormat('')
        .tickSize(0);

    var xAxis = d3.axisBottom(x).tickFormat(function (d) {
        return d;
    });


    var chart = d3.select("#barPlot").append("svg")
        .attr("width", spaceForLabels + chartWidth + spaceForLegend)
        .style("overflow", "visible")
        .attr("height", chartHeight + 30);


    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    var bar = chart.selectAll("g")
        .data(chartData)
        .enter().append("g")
        .attr("transform", function (d, i) {
            console.log(d)
            return "translate(" + spaceForLabels + "," + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i / data.series.length))) + ")";
        })
        .on("mouseover", function (d, index) {
            d3.selectAll('circle').style('opacity', 0);
            d3.selectAll('.dots').style('opacity', 1);
            div.transition()
                .duration(200)
                .style("opacity", 1);

            let age = d.age == 0 ? '0-10' : d.age == 1 ? '11-20' : d.age == 2 ? '21-40' : d.age == 3 ? '41-60' : d.age == 4 ? '61-80' : '>80';
            if (d.label == 'Male') {
                div.html("Age: " + age + "<br/>" + "Gender: Male" + "<br/>" + "Deaths: " + d.value)
                    .style("left", (d3.event.pageX + 30) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
                d3.selectAll('.c' + d.age + '0').style('opacity', 1);
            }
            else {
                d3.selectAll('.c' + d.age + '1').style('opacity', 1);
                div.html("Age: " + age + "<br/>" + "Gender: Female" + "<br/>" + "Deaths: " + d.value)
                    .style("left", (d3.event.pageX + 30) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            }

        }).on("mouseout", function (d) {
            d3.selectAll('circle').style('opacity', 1);
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })


    bar.append("rect")
        .attr("fill", function (d, i) { return color(i % data.series.length); })
        .attr("class", "bar")
        .attr("width", function (d) { return x(+d.value); })
        .attr("height", barHeight - 1)



    bar.append("text")
        .attr("x", function (d) { return x(+d.value) - 20; })
        .attr("y", barHeight / 2)
        .attr("fill", "white")
        .attr("dy", ".35em")
        .text(function (d) { return d.value; });


    bar.append("text")
        .attr("class", "label")
        .attr("x", function (d) { return - 10; })
        .attr("y", groupHeight / 2)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d, i) {
            if (i % data.series.length === 0)
                return data.labels[Math.floor(i / data.series.length)];
            else
                return ""
        });



    chart.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + spaceForLabels + ", " + -gapBetweenGroups / 2 + ")")
        .call(yAxis)

    chart.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .attr("x", chartWidth)
        .attr("y", chartHeight + 30)
        .text("Deaths");

    chart.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .style("font-size", "12px")
        .attr("y", 0)
        .attr("x", 0)
        .text("Age");

    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + spaceForLabels + "," + chartHeight + ")")
        .call(xAxis);


    var legendRectSize = 18,
        legendSpacing = 4;

    var legend = chart.selectAll('.legend')
        .data(data.series)
        .enter()
        .append('g')
        .attr('transform', function (d, i) {
            var height = legendRectSize + legendSpacing;
            var offset = -gapBetweenGroups / 2;
            var horz = spaceForLabels + chartWidth + 40 - legendRectSize;
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
        });

    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', function (d, i) { return color(i); })
        .style('stroke', function (d, i) { return color(i); });

    legend.append('text')
        .attr('class', 'legend')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function (d) { return d.label; });
})
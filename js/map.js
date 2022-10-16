let pre = 1;
let lastk = 35;
var zoom = d3.zoom().on("zoom", function () {

    let trans = d3.event.transform;
    let k = +lastk;

    let transk = +trans.k;
    if (transk == pre) {
        g.attr("transform", d3.zoomIdentity.translate(trans.x, trans.y).scale(k));
    }
});

var svg = d3.select("#map")
    .append("svg")
    .attr("width", 600)
    .attr("height", 600)
    .on("dblclick", function () {
        if (lastk < 50) {
            lastk = lastk + 1;
            d3.select('#myRange').attr("value", lastk);
            g.attr("transform", d3.zoomIdentity.translate(-99, -100).scale(lastk));
        }
    }, false)
    .call(zoom)


let g = svg.append("g")
    .attr("transform", "translate(-99,-100) scale(35) rotate(-1)")


d3.select('#myRange').on('input', function () {
    let k = +this.value;
    lastk = k;
    g.attr("transform", d3.zoomIdentity.translate(-99, -100).scale(k));
})

d3.json("streets.json", function (error, data) {

    var lineFunc = d3.line()
        .x(function (d) { return d.x })
        .y(function (d) { return d.y })
        .curve(d3.curveLinear)


    data.forEach((d1, i1) => {
        path = g.append("g")
            .attr("class", "path")
            .selectAll("path")
            .data(d1)
            .enter().append("path")
            .attr("stroke", "black")
            .attr("stroke-width", "0.01px")
            .attr("fill", "none");

        path.attr("d", lineFunc(d1));


    });

});

d3.csv("deaths_age_sex.csv", function (error, data) {

    var street = [{ name: 'CEORCE STREET', x: 145, y: 417, rotate: -72 }, { name: 'BREWER STREET', x: 400, y: 225, rotate: 42 },
    { name: 'RECENT STREET', x: 280, y: 380, rotate: -60 }, { name: 'OXFORD STREET', x: 298, y: 585, rotate: 10 },
    { name: 'DEAN STREET', x: 580, y: 550, rotate: -65 }, { name: 'WORK', x: 330.5, y: 470, rotate: 20 },
    { name: 'HOUSE', x: 325, y: 480, rotate: 20 }, { name: 'Bre.', x: 490, y: 412, rotate: -60 }]

    var workHouse = [{ x: 330, y: 452, w: 45, h: 38, rotate: 20 }]

    var brewery = [{ x: 480, y: 408.5, w: 20, h: 13, rotate: -60 }]

    let location = g.selectAll("circle")
        .attr("class", "loc")
        .data(data)
        .enter().append("circle").attr("class", function (d) { return "c" + d.age + d.gender; })
        .attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; })
        .attr("r", 0.2)
        .style("fill", "lightgrey")
        .attr("stroke", 'black')
        .attr("stroke-width", 0.04)


    location.append('title').html(function (d) {
        let gender = d.gender == 0 ? 'Male' : 'Female';
        let age = '';
        if (d.age == 0) {
            age = '0-10';
        }
        else if (d.age == 1) {
            age = '11-20';
        }
        else if (d.age == 2) {
            age = '21-40';
        }
        else if (d.age == 3) {
            age = '41-60';
        }
        else if (d.age == 4) {
            age = '61-80';
        }
        else {
            age = '>80';
        }
        return "Age: " + age + "\n" + "Sex: " + gender;
    })

    let wh = g.selectAll(".wh")

        .data(workHouse)
        .enter().append("rect").attr("class", "wh")
        .attr("transform", function (d) { return "rotate(" + d.rotate + " " + d.x / 35 + "," + d.y / 35 + ")"; })
        .attr("x", function (d) { return d.x / 35; })
        .attr("y", function (d) { return d.y / 35; })
        .attr("width", function (d) { return d.w / 35; })
        .attr("height", function (d) { return d.h / 35; })
        .style("fill", "skyblue")
        .attr("stroke", 'black')
        .attr("stroke-width", 0.04)
        .style('zIndex', '-1');

    let bre = g.selectAll(".br")

        .data(brewery)
        .enter().append("rect").attr("class", "br")
        .attr("transform", function (d) { return "rotate(" + d.rotate + " " + d.x / 35 + "," + d.y / 35 + ")"; })
        .attr("x", function (d) { return d.x / 35; })
        .attr("y", function (d) { return d.y / 35; })
        .attr("width", function (d) { return d.w / 35; })
        .attr("height", function (d) { return d.h / 35; })
        .style("fill", "orange")
        .attr("stroke", 'black')
        .attr("stroke-width", 0.04)
        .style('zIndex', '-1');

    let streets = g.selectAll(".place-label")
        .attr("class", "place-label")
        .data(street)
        .enter().append("text")
        .attr("transform", function (d) { return "rotate(" + d.rotate + " " + d.x / 35 + "," + d.y / 35 + ")"; })
        .attr("x", function (d) { return d.x / 35; })
        .attr("y", function (d) { return d.y / 35; })
        .style("font-size", "0.3px")
        .text(function (d) { return d.name; });

    d3.select('#deaths').on("change", function () {
        let val = this.value;
        if (val == 'gender') {
            d3.select("#genders").style('display', 'inline');
            d3.select("#locations").style('display', 'none');
            d3.select("#ages").style('display', 'none');
            location.style("fill", function (d) {
                if (d.gender == 0) {
                    return "skyblue";
                }
                else {
                    return "blue";
                }
            })
        }
        else if (val == 'age') {
            d3.select("#genders").style('display', 'none');
            d3.select("#locations").style('display', 'none');
            d3.select("#ages").style('display', 'inline');
            location.style("fill", function (d) {
                let age = '';
                if (d.age == 0) {
                    age = '#fce703';
                }
                else if (d.age == 1) {
                    age = '#fcba03';
                }
                else if (d.age == 2) {
                    age = '#fc8803';
                }
                else if (d.age == 3) {
                    age = '#03fc98';
                }
                else if (d.age == 4) {
                    age = '#03fce3';
                }
                else {
                    age = '#03d3fc';
                }
                return age;
            })
        }
        else {
            d3.select("#genders").style('display', 'none');
            d3.select("#locations").style('display', 'inline');
            d3.select("#ages").style('display', 'none');
            location.style("fill", "lightgrey")
        }
    })
})

d3.csv("pumps.csv", function (error, data) {
    data.forEach(d => {
        let pump = g.append("rect")
            .attr("x", +d.x)
            .attr("y", +d.y)
            .attr("width", 0.2)
            .attr("height", 0.2)
            .style("fill", "red")
            .attr("stroke", 'black')
            .attr("stroke-width", 0.04);

    });
})
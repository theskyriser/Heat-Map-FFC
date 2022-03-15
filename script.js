const loadGraph = () => {
    d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
    .then ((data) => {
        const months = [ "January", "February", "March", "April", "May", "June", 
           "July", "August", "September", "October", "November", "December"];
        const baseTemp = data['baseTemperature']
        const legendTemps = [2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8]
        const legendColors = ['#E8F8F5', '#D1F2EB', '#A3E4D7', '#76D7C4', '#48C9B0', '#1ABC9C', '#17A589', '#148F77', '#117864', '#0E6251'] 
        const parseTemp = (base, variable) => {
            let temp = base + variable 
            if (temp <= 2.8) {
                return '#E8F8F5'
            }
            if (temp > 2.8 && temp <= 3.9) {
                return '#D1F2EB'
            }
            if (temp > 3.9 && temp <= 5.0) {
                return '#A3E4D7'
            }
            if (temp > 5.0 && temp <= 6.1) {
                return '#76D7C4'
            }
            if (temp > 6.1 && temp <= 7.2) {
                return '#48C9B0'
            }
            if (temp > 7.2 && temp <= 8.3) {
                return '#1ABC9C'
            }
            if (temp > 8.3 && temp <= 9.5) {
                return '#17A589'
            }
            if (temp > 9.5 && temp <= 10.6) {
                return '#148F77'
            }
            if (temp > 10.6 && temp <= 11.7) {
                return '#117864'
            }
            if (temp > 11.7 && temp <= 12.8) {
                return '#0E6251'
            }
        }
        const monthlyTemp = data['monthlyVariance']
        const w = 1500
        const h = 750
        const legendw = 400
        const legendh = 30
        const padding = 80
        const legendPadding = 20
    
        const xScale = d3.scaleBand().domain(monthlyTemp.map((d) => d['year'])).range([padding, w - padding])
        const xAxis = d3.axisBottom(xScale).tickValues(xScale.domain().filter((d) => d % 10 === 0))

       const yScale = d3.scaleBand().domain(months).range([h - padding, 0])
       const yAxis = d3.axisLeft(yScale)

       const tooltip = d3.select("body")
       .append("div")
       .attr("id", "tooltip")
       .style('opacity', 0)
       
       const svg = d3.select(".container")
       .append("svg")
       .attr("width", w)
       .attr("height", h)

       svg.append("g")
       .attr("transform", "translate(0, " + (h - padding) + " )")
       .attr("id", "x-axis")
       .call(xAxis)
       
       svg.append("g")
       .attr("transform", "translate(" + (padding) + ",0)")
       .attr("id", "y-axis")
       .call(yAxis)

        svg.selectAll("rect")
        .data(monthlyTemp)
        .enter()
        .append("rect")
        .attr("x", (d) => xScale(d['year']))
        .attr("y", (d) => yScale(months[d.month - 1]))
        .attr("fill", (d) => parseTemp(baseTemp, d['variance']))
        .attr("width", (w - padding) / 262)
        .attr("height", (h - padding) / 12)
        .attr("data-year", (d) => d['year'])
        .attr("data-month", (d) => d['month'] - 1)
        .attr("data-temp", (d) => d['variance'])
        .attr("class", "cell")
        .on("mouseover", (event, d) => {
            tooltip
            .style('opacity', 0.9)
            .html(
                "Year: " + d['year'] + "<br> Temp: " + (baseTemp + d['variance']).toFixed(2) + "<br> Variance: " + d['variance'] + "C"  
            )
                .style("top", `${event.pageY - 20}px`)
                .style("left", `${event.pageX + 20}px`)
                .attr("data-year", d['year']);
        })
        .on("mouseout", function(event, d) {
            tooltip
              
              .style("opacity", 0);
          });

        const legendThreshold = d3.scaleThreshold().domain(legendTemps).range(legendColors)
        const legendScale = d3.scaleLinear().domain([1.68, 13.8]).range([0, legendw])
        const legendAxis = d3.axisBottom(legendScale).tickSize(10, 0).tickValues(legendThreshold.domain()).tickFormat(d3.format('.1f'));

        const legend = d3.select('.container')
        .append("svg")
        .attr("width", legendw + legendPadding)
        .attr("height", legendh + legendPadding)

        const legendBox = legend
        .append('g')
        .classed('legend', true)
        .attr('id', 'legend')
        .attr(
        'transform',
        'translate(0, 0)'
        );

        legendBox
        .selectAll("rect")
        .data(
            legendThreshold.range().map(function (color) {
              var d = legendThreshold.invertExtent(color);
              if (d[0] === null) {
                d[0] = legendScale.domain()[0];
              }
              if (d[1] === null) {
                d[1] = legendScale.domain()[1];
              }
              return d;
            })
          )
          .enter()
    .append('rect')
    .style('fill', function (d) {
      return legendThreshold(d[0]);
    })

    .attr('x', (d) => legendScale(d[0]))
    .attr('y', 0)
    .attr('width', (d) =>
      d[0] && d[1] ? legendScale(d[1]) - legendScale(d[0]) : legendScale(null)
    )
    .attr('height', legendh);

    legendBox
    .append('g')
    .attr('transform', 'translate(' + 0 + ',' + legendh + ')')
    .call(legendAxis)

    svg.append("text")      // text label for the x axis
          .attr("x", w / 2)
          .attr("y", h - 30)
          .style("text-anchor", "middle")
          .text("Year");

    svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", padding - 45)
          .attr("x", 0 - (h / 2))
          .style("text-anchor", "middle")
          .text("Month");
    
    })
    .catch((e) => console.log(e))
}
document.addEventListener("DOMContentLoaded", loadGraph())
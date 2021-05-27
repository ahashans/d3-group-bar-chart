async function drawLineChart() {
  // write your code here
  const dataset = await d3.json("./../../my_weather_data.json");
  const data = [161276452, 35568417, 5400169];
  const xTickValues = ["max", "avg", "min"];
  const roundMin = (number) => {
    let digitCount = number.toString().length;
    return Math.pow(10, digitCount - 1);
  };
  const roundMax = (number) => {
    let digitCount = number.toString().length;
    return (parseInt(number.toString()[0]) + 1) * Math.pow(10, digitCount - 1);
  };
  const dimensions = {
    height: 400,
    width: 700,
    margins: {
      top: 50,
      left: 50,
      bottom: 50,
      right: 50,
    },
    textMargin: {
      top: 5,
      left: 5,
    },
  };
  dimensions.boundedHeight =
    dimensions.height - dimensions.margins.top - dimensions.margins.bottom;
  dimensions.boundedWidth =
    dimensions.width - dimensions.margins.left - dimensions.margins.right;
  const svg = d3
    .select("#wrapper")
    .append("svg")
    .attr("height", dimensions.height)
    .attr("width", dimensions.width)
    .style("border", "1px solid black");
  const bounds = svg
    .append("g")
    .attr("height", dimensions.boundedHeight)
    .attr("width", dimensions.boundedWidth)
    .style(
      "transform",
      "translate(" +
        dimensions.margins.left +
        "px, " +
        dimensions.margins.top +
        "px)"
    );

  const yScale = d3
    .scaleLinear()
    .domain([0, roundMax(d3.max(data))])
    .range([dimensions.boundedHeight, dimensions.margins.bottom]);

  const xScale = d3
    .scaleBand()
    .domain(xTickValues)
    .range([0, dimensions.boundedWidth])
    .paddingInner(0.2)
    .paddingOuter(0.4);

  const formatYAxisValue = d3.format(".2s");

  const xAxisGenerator = d3.axisBottom().scale(xScale);

  const yAxisGenerator = d3.axisLeft().scale(yScale);

  const xAxis = bounds
    .append("g")
    .call(xAxisGenerator.tickSizeOuter(0))
    .attr("transform", `translate(0 ${dimensions.boundedHeight} )`);

  const yAxis = bounds.append("g").call(
    yAxisGenerator
      .ticks(2)
      .tickFormat((d, i) => {
        console.log(d, i);
        return d === 0 ? "0M" : formatYAxisValue(d);
      })
      .tickSizeOuter(0)
  );

  //Drawing Grid Lines

  bounds
    .append("g")
    .attr("class", "grid-line")
    .call(
      yAxisGenerator
        .ticks(8)
        .tickSize(-dimensions.boundedWidth)
        .tickFormat("")
        .tickSizeOuter(0)
    );

  //Drawing Bars

  bounds
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (_, i) => {
      return xScale(xTickValues[i]);
    })
    .attr("y", (d) => yScale(d))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => {
      return dimensions.boundedHeight - yScale(d);
    })
    .attr("fill", (_, i) => {
      const current = xTickValues[i];
      switch (current) {
        case "min": {
          return "#379DB5";
        }
        case "avg": {
          return "#FCAE7A";
        }
        case "max": {
          return "#9773C6";
        }
        default: {
          return "#000";
        }
      }
    });

  //Drawing Bar Labels

  bounds
    .selectAll(".bar-label")
    .data(data)
    .enter()
    .append("text")
    .attr("y", (d) => yScale(d) - dimensions.textMargin.top)
    .attr("x", (_, i) => {
      return xScale(xTickValues[i]) + xScale.bandwidth() / 4;
    })
    .attr("width", xScale.bandwidth())
    // .style("text-anchor", "end")
    .text((d) => d.toLocaleString());

  bounds
    .append("text")
    .attr("x", xScale(xTickValues[1]) + xScale.bandwidth() / 4)
    .attr("y", 20)
    .text("2020/08");
}

drawLineChart();

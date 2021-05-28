async function drawLineChart() {
  // write your code here
  // const dataset = await d3.json("./../../my_weather_data.json");
  const data = [
    [161276452, 35568417, 5400169],
    [163541563, 36321919, 4858858],
    [163541563, 36321919, 4858858],
  ];
  const xTickValues = ["max", "avg", "min"];

  //Roundup Helper Functions
  const roundMin = (number) => {
    let digitCount = number.toString().length;
    return Math.pow(10, digitCount - 1);
  };
  const roundMax = (number) => {
    let digitCount = number.toString().length;
    return (parseInt(number.toString()[0]) + 1) * Math.pow(10, digitCount - 1);
  };

  //SVG dimention Markup
  const dimensions = {
    height: 400,
    width: 1000,
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

  //Root SVG obj
  const svg = d3
    .select("#wrapper")
    .append("svg")
    .attr("height", dimensions.height)
    .attr("width", dimensions.width)
    .style("border", "1px solid black");

  //Chart Container
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

  //Scale for bar groups
  const rootXScale = d3
    .scaleBand()
    .domain(d3.range(data.length))
    .range([0, dimensions.boundedWidth])
    .paddingInner(0.1)
    .paddingOuter(0.2);

  //Scale for individual bars
  const xScale = d3
    .scaleBand()
    .domain(xTickValues)
    .range([0, rootXScale.bandwidth()])
    .paddingInner(0.1)
    .paddingOuter(0.2);

  //Scale for Left Axis
  const yScale = d3
    .scaleLinear()
    .domain([0, roundMax(d3.max(data[0]))])
    .range([dimensions.boundedHeight, dimensions.margins.bottom]);

  //Helper function for formatting Y-Axis Tick value
  const formatYAxisValue = d3.format(".2s");
  //Generates Axis in bottom with any given scale
  const xAxisGenerator = (scale) => d3.axisBottom().scale(scale);

  //Generates Axis in left with any given scale
  const yAxisGenerator = d3.axisLeft().scale(yScale);

  //Generates Axis in right with any given scale
  const rightYAxisGenerator = d3.axisRight().scale(yScale);

  //Axis for plotting bar group
  const rootXAxis = bounds
    .selectAll("g")
    .data(d3.range(data.length))
    .enter()
    .append("g")
    .call(xAxisGenerator(xScale).tickSizeOuter(0).tickSize(0).tickPadding(10))
    .attr(
      "transform",
      (d, i) => `translate(${rootXScale(i)}, ${dimensions.boundedHeight} )`
    );

  //Axis for plotting individual bars
  const xAxis = bounds
    .append("g")
    .call(
      xAxisGenerator(rootXScale)
        .tickSizeInner(0)
        .tickSizeOuter(0)
        .tickFormat("")
    )
    .attr("transform", `translate(0 ${dimensions.boundedHeight} )`);

  //Axis for plotting main data.
  const yAxis = bounds.append("g").call(
    yAxisGenerator
      .ticks(2)
      .tickFormat((d, i) => {
        return d === 0 ? "0" : formatYAxisValue(d);
      })
      .tickSizeOuter(0)
      .tickSize(0)
      .tickPadding(7)
  );
  const rightYAxis = bounds
    .append("g")
    .attr("transform", `translate(${dimensions.boundedWidth},0)`)
    .call(rightYAxisGenerator.ticks(0).tickSize(0));

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
    .append("g")
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("transform", (_, i) => {
      return `translate(${rootXScale(i)},0)`;
    })
    .selectAll("rect")
    .data((d) => {
      return d;
    })
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
    .append("g")
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("transform", (_, i) => {
      return `translate(${rootXScale(i)},0)`;
    })
    .selectAll("text")
    .data((d) => d)
    .enter()
    .append("text")
    .attr("y", (d) => yScale(d) - dimensions.textMargin.top)
    .attr("x", (_, i) => {
      return xScale(xTickValues[i]);
    })
    .attr("width", xScale.bandwidth())
    .text((d) => d.toLocaleString())
    .style("font-size", "0.75rem");

  //Drawing Bar Group Titles
  bounds
    .append("g")
    .selectAll("text")
    .data(["2020/08", "2021/02"])
    .enter()
    .append("text")
    .attr("x", (d, i) => rootXScale(i) + rootXScale.bandwidth() / 3)
    .attr("y", dimensions.margins.top / 2)
    .text((d) => d);

  //Drawing Bar Group Separator Line
  bounds
    .append("g")
    .selectAll("line")
    .data(d3.range(data.length - 1))
    .enter()
    .append("line")
    .style("stroke", "black")
    .style("stroke-width", 1)
    .attr(
      "x1",
      (d, i) =>
        rootXScale(i) + rootXScale.bandwidth() + rootXScale.bandwidth() / 16
    )
    .attr("y1", dimensions.margins.top)
    .attr(
      "x2",
      (d, i) =>
        rootXScale(i) + rootXScale.bandwidth() + rootXScale.bandwidth() / 16
    )
    .attr("y2", dimensions.boundedHeight);
}

drawLineChart();

var svgWidth = 960;
var svgHeight = 500;

var margin = {top: 20, right: 40, bottom: 60, left: 100};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select('.chart')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var chart = svg.append('g');

d3.csv('data/data.csv', function(err, Data) {
  if (err) throw err;

  Data.forEach(function(data) {
    data.WorkFromHome = +data.WorkFromHome;
    data.ExercisePastMonth = +data.ExercisePastMonth;
  });

  // Create scale functions
  var yLinearScale = d3.scaleLinear().range([height, 0]);

  var xLinearScale = d3.scaleLinear().range([0, width]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Scale the domain
  xLinearScale.domain([
    1,
    d3.max(Data, function(data) {
      return +data.WorkFromHome+1;
    }),
  ]);
  yLinearScale.domain([
    50,
    d3.max(Data, function(data) {
      return +data.ExercisePastMonth+5;
    }),
  ]);

  //Define node and use it to append text
  var node = svg.selectAll('g')
                .data(Data)
                .enter()
                .append('g');

  node.append('circle')
    .attr ('class', 'dot')
    .attr ('cx', function(data, d3) {
        return xLinearScale(data.WorkFromHome);
    })
    .attr ('cy', function(data, d3) {
        return yLinearScale(data.ExercisePastMonth);
    })
    .attr('fill', 'lightblue')
    .attr('r', '12')

  node.append('text')
    .attr('x', function(data,d3) {
        return xLinearScale(data.WorkFromHome);
    })
    .attr('y', function(data,d3) {
        return yLinearScale(data.ExercisePastMonth);
    })
    // .attr('text-anchor', 'middle')
    .attr('dx', '-.70em')
    .attr('dy', '.35em')
    .attr('font-size', '11px')
    .text(function(data,d3) {return data.abbr;});

  chart
    .append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(bottomAxis);

  chart.append('g').call(leftAxis);

  chart
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left + 40)
    .attr('x', 0 - height / 2)
    .attr('dy', '1em')
    .attr('class', 'axisText')
    .text('% Population that Exercised in the Past Month');

  // Append x-axis labels
  chart
    .append('text')
    .attr(
      'transform',
      'translate(' + width / 2 + ' ,' + (height + margin.top + 30) + ')',
    )
    .attr('class', 'axisText')
    .text('% Population that Works from Home');
});

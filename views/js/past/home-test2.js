$(document).ready(function () {
  
  $("ul li").on("click", function() {
    $("li").removeClass("active");
    $(this).addClass("active");
  });

  // decodeEntities($('#ta').val());
  $.getJSONuncached = function (url) {

    // $("#transcripted").empty();

    return $.ajax(
      {
        url: url,
        type: 'GET',
        cache: false,
        success: function (data) {
          $("#transcripted").append(data);
          decodeEntities($('#ta').val());
          // decodeEntities($('#transcripted #results #ta').val());
          d3_wordcloud();
        }
      });
  };

  $.getJSONuncached("/hello");
  
});

//https://stackoverflow.com/questions/5796718/html-entity-decode
//https://stackoverflow.com/questions/1147359/how-to-decode-html-entities-using-jquery
function decodeEntities(encodedString) {
  var textArea = document.createElement('textarea');
  textArea.innerHTML = encodedString;
  $('#title').html(textArea.value);
  // return textArea.value;
}


function d3_wordcloud() {

  let pargraph = "", mywords = [];
  pargraph = $('#transcripted #results div p:eq(2)').text(); //or p:nth-child(2)
  mywords = pargraph.split(" ");
  




  let width = 960, height = 600;
  // let fontScale = d3.scaleLinear().range([20, 120]);
  // var fill = d3.scale.category10();
  var fill = d3.scale.category20();
  // let size = d3.scaleLinear().range([0, 13]).domain([0, d3.max(data, d => d.count)]);
  // let wordScale = d3.scale.linear().domain([0, 100]).range([0, 150]).clamp(true);
  
  // let minSize = d3.min(mywords, d => d.size);
  // let maxSize = d3.max(mywords, d => d.size)
  // fontScale.domain([minSize, maxSize]);

  // d3.tsv("stats.tsv", function (data) {
  //   var leaders = data
  //   .filter(function (d) { return +d.G > 0; })
  //   .map(function (d) { return { text: d.Name, size: +d.G }; })
  //   .sort(function (a, b) { return d3.descending(a.size, b.size); })
  //   .slice (0, 100);

  var sizeScale = d3.scale.linear()
      .domain([0, d3.max(frequency_list, function(d) { return d.freq} )])
      .range([10, 95]); 

    d3.layout.cloud().size([width, height])
        // .words(mywords
        //   .filter(function (d) { return +d.G > 0; })
        //   .map(function (d) { return { text: d.Name, size: +d.G }; })
        //   .sort(function (a, b) { return d3.descending(a.size, b.size); })/*.slice (0, 100)*/
        // )

        // .words(mywords.filter(function (d) { return +d.G > 0; }))
        // .words(mywords.map(function(d) {
        //   return {text: d.Name, size: +d.G + Math.random() * 90};
        // }))
        // .words(mywords.sort(function (a, b) { return d3.descending(a.size, b.size); }))

        .words(mywords.map(function(d) {
          return {text: d, size: 10 + Math.random() * 90};
        }))
        .padding(2)
        .rotate(function() 
          // { return ~~(Math.random() * 2) * 90; }
          { return ~~(Math.random() * 2) * 45;}  
        )
        .font("Impact")
        // .fontSize(function(d) { return d.size; })
        .fontSize(function(d) { return sizeScale(d.frequency) })
        // .spiral("rectangular")
        // .spiral("archimedean")
        .on("end", draw)
        // .on("end", drawCloud)
        .start();

  // });

  function draw(words) {
  // function drawCloud(words) {
    d3.select("#wc").append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate("+(width/2)+","+(height/2)+")")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .style("fill", function(d, i) { return fill(i); })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
        // .text(function(d) { return d.text; }).spiral("archimedean");
  }
}


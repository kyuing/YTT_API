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

  pargraph = "", mywords = [];
  pargraph = $('#transcripted #results div p:eq(2)').text(); //or p:nth-child(2)
  mywords = pargraph.split(" ");
  // alert(mywords);

  // var fill = d3.scale.category20();
    var layout = cloud()
      .size([500, 500])
      .words(mywords.map(function(d) {
        return {text: d, size: 10 + Math.random() * 90, test: "haha"};
      }))
      .padding(5)
      .rotate(function() { return ~~(Math.random() * 2) * 90; })
      .font("Impact")
      .fontSize(function(d) { return d.size; })
      .on("end", draw);

  layout.start();

  function draw(words) {
    d3.select("#wc").append("svg")
        .attr("width", layout.size()[0])
        .attr("height", layout.size()[1])
      .append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
  }
}


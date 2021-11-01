$(document).ready(function () {
  $("ul li").on("click", function () {
    $("li").removeClass("active");
    $(this).addClass("active");
  });

  $.getJSONuncached = function (url) {
    // $("#transcripted").empty();

    return $.ajax({
      url: url,
      type: "GET",
      cache: false,
      success: function (data) {

        $("#transcripted").append(data);
        decodeEntities($("#ta").val());
        // decodeEntities($('#transcripted #results #ta').val());
        // scroll_manager();

      },
    });
  };

  $.getJSONuncached("/hello");
});

//https://stackoverflow.com/questions/5796718/html-entity-decode
//https://stackoverflow.com/questions/1147359/how-to-decode-html-entities-using-jquery
function decodeEntities(encodedString) {
  var textArea = document.createElement("textarea");
  textArea.innerHTML = encodedString;
  $("#title").html(textArea.value);
  // return textArea.value;
}


function manageScript() {
  
  $(document).on("click", '#transcripted #results div .tr_accordion .card:nth-child(1) #tr_collapseOne button', function(e) { 
  // $("#transcripted #results div .tr_accordion .card:nth-child(1) #tr_collapseOne button").click(function (e) {
    // e.persist();
    e.preventDefault();
    e.stopImmediatePropagation();

    let toShow = $('#script_' + $(this).attr('id'));
    
    if(toShow.hasClass('showScript')) { // if(toShow.attr('class') === 'showScript') {
      // toShow.toggle(); //works but this touches on CSS logic.
      toShow.removeClass("showScript");
      toShow.addClass("hideScript");

      //alt
      // $(".showScript").addClass("hideScript");
      // $(".showScript").removeClass("showScript");

    }else {

      $(".showScript").addClass("hideScript");
      $(".showScript").removeClass("showScript");
      toShow.removeClass("hideScript");
      toShow.addClass("showScript mt-3");
      // toshow.fadeIn('slow');
    }

  });

}

let currWcBtnId;
function manageWrodcloud() {
  
  $(document).on("click", '#transcripted #results div .tr_accordion .card:nth-child(2) #tr_collapseTwo button', function(e) { 
    // e.persist();
    e.preventDefault();
    e.stopImmediatePropagation();

    currWcBtnId = $(this).attr('id');
    let toShow = $('#wc_' + $(this).attr('id'));
    
    if(toShow.hasClass('showWordcloud')) {  // if(toShow.attr('class') === 'showWordcloud') {
      // alert("DSFdsfdas");  
      // toShow.toggle(); //works but this touches on CSS logic.
      
      $(".svg-container").empty();
      // $(".svg-container").removeClass('pt-3 pb-3');

      toShow.removeClass("showWordcloud mt-5 mb-5");
      toShow.addClass("hideWordcloud");

      //alt
      // $(".showScript").addClass("hideScript");
      // $(".showScript").removeClass("showScript mt-3");

    }else {
      $('#lds-dual-ring_' + $(this).attr('id')).show();
      $(".showWordcloud").addClass("hideWordcloud");
      $(".showWordcloud").removeClass("showWordcloud mt-5 mb-5");
      toShow.removeClass("hideWordcloud");
      toShow.addClass("showWordcloud mt-5 mb-5");
      // toshow.fadeIn('slow');
      wordcloud_manager();
    }

  });

}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function wordcloud_manager() {
  
    let className = $('#transcripted #results div .tr_accordion .card:nth-child(2) div:nth-child(2)').attr('class');
    // alert(className);
    let id = $('.showWordcloud').attr('id');
    // alert(id);
    // alert("id.hasClass('showWordcloud'): " + $('#' + id).hasClass('showWordcloud'));


    if(className === "collapse show" && $('#' + id).hasClass('showWordcloud')) {
      (async () => {
        try {          

          $(".svg-container").empty();
          // $(".svg-container").addClass('pt-3 pb-3');
          // setTimeout(d3_wordcloud(), 1000);
          await sleep(500).then(() => {
            d3_wordcloud();
            $('.lds-dual-ring').fadeOut();
          });        
        } catch (error) {
          console.log(error);
        }
      })();
    }

    // if(className === "collapse show") { 
    if(className === "collapse"  && $('#' + id).hasClass('hideWordcloud')) { 
      $('.lds-dual-ring').hide();  
      $(".svg-container").empty();
      // $(".svg-container").removeClass('pt-3 pb-3');
    }
     
}

//let container = "svg";
let w;
let h;
let wordSize;
//https://stackoverflow.com/questions/7715124/do-something-if-screen-width-is-less-than-960-px
//https://stackoverflow.com/questions/49077801/why-does-window-screen-not-work-on-macos-safari
if ($(window).innerWidth() /*$(window).width()*/ > 1051) {
   w = 700; h = 550;
}
if ($(window).innerWidth() /*$(window).width()*/ < 1051) {
 w = 500; h = 350;
}
if ($(window).innerWidth() /*$(window).width()*/ < 801) {
  w = 450; h = 350;
 }
if ($(window).innerWidth() /*$(window).width()*/ < 501) {
 w = 270; h = 300;
}
/**********************************************************************************************************************************
//alt
// device detection at https://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device
let isMobile = false; 
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
   isMobile = true; }else { isMobile = false; }
if(isMobile) { w = 300; h = 300; } else { w = 700; h = 600; }
***********************************************************************************************************************************/



/** ref
* https://www.jasondavies.com/
* https://www.jasondavies.com/wordcloud/
* https://github.com/jasondavies/d3-cloud
* https://youtu.be/1KEiTIu0k44
* http://plnkr.co/edit/gNtHZ0lMRTP98mptm3W8?p=preview&preview
* https://stackoverflow.com/questions/5667888/counting-the-occurrences-frequency-of-array-elements
* https://www.datavis.fr/index.php?page=word-cloud
* https://stackoverflow.com/questions/26471497/d3-js-word-missing-from-word-cloud
* https://stackoverflow.com/questions/52194553/d3-word-cloud-layout-circle-and-rectangular
*/
//http://plnkr.co/edit/gNtHZ0lMRTP98mptm3W8?p=preview&preview
function d3_wordcloud() {

  wordSize = 12;
  let pargraph = "", mywords = [];
  
  // alert(currWcBtnId);
  pargraph = $('#script_' + currWcBtnId).text(); 
  mywords = pargraph.split(/[\s.,]+/);  // mywords = pargraph.split(" ");

  //# of frequency of word each in mywords
  let result = {};
  for (i = 0; i < mywords.length; ++i) {
    if (!result[mywords[i]]) result[mywords[i]] = 0;
    ++result[mywords[i]];
  }

  var newList = _.uniq(mywords);
  var frequency_list = [];
  var len = newList.length;
  for (var i = 0; i < len; i++) {
    var temp = newList[i];
    frequency_list.push({
      text: temp,
      freq: result[newList[i]],
      time: 0
    });
  }
  frequency_list.sort(function (a, b) {
    return parseFloat(b.freq) - parseFloat(a.freq);
  });

  // alert(len);

  for (var t = 0; t < len; t++) {
    if(len > 165) {
      var addTime = t + 1; //may need to faster and faster..
    }else {
      var addTime = 5 * t + 3; //may need to faster and faster..
    }
    // var addTime = 7 * t + 3; //may need to faster and faster..
    frequency_list[t].time = addTime;
  }

  for (i in frequency_list) {
    if (frequency_list[i].freq * wordSize > 160) wordSize = 3;
  }

  var sizeScale = d3.scale
    .linear()
    .domain([
      0,
      d3.max(frequency_list, function (d) {
        return d.freq;
      }),
    ])
    .range([10, 95]); 

    d3.layout.cloud().size([w, h])
    .words(frequency_list)
    .padding(5)
    .rotate(function () {
      return ~~(Math.random() * 2) * 90;
    })
    .font("Impact")
    .fontSize(function (d) {
      return sizeScale(d.freq);
    })
    .on("end", drawCloud)
    .start();

}

// function draw(words) {
function drawCloud(words) {

  // svg.remove();

 var fill = d3.scale.category20();
 let id = $('.showWordcloud').attr('id');

//you may get index of .svg-container
//  d3.select(".svg-container").append("svg")
// d3.select("#transcripted #results div .tr_accordion .card:nth-child(2) .svg-container").append("svg")
d3.select('#' + id).append("svg")
   .attr("width", w)
   .attr("height", h)
   .append("g")
   .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")")
   .selectAll("text")
   .data(words)
   .enter()
   .append("text")
   .transition()
   .duration(function(d) { return d.time}  )
   .attr('opacity', 1)
   .style("font-size", function (d) {
     return d.size + "px";
     // return d.size/3 + "vh";
   })
   .style("font-family", "Impact")
  //  .style("padding-top", "10")
   .style("fill", function (d, i) {
     return fill(i);
   })
   .attr("text-anchor", "middle")
   .attr("transform", function (d) {
     return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
   })
   .text(function (d) {
     return d.text;
   });

 }


// function scroll_manager() {
//   let counter = 0;
//   $(window).scroll(function() {

//     //https://stackoverflow.com/questions/2768264/how-to-show-div-when-user-reach-bottom-of-the-page
//     // if ($(document).height() <= ($(window).height() + $(window).scrollTop())) {
//     // (selector).offsetTop + $(selector).outerHeight
//     if ($(document).height() - 90 <= ($(window).height() + $(window).scrollTop())) {            
//       counter++;
//       if(counter === 1) {
//         // alert('Bottom reached! counter = ' + counter);
//         $(".svg-container").empty();
//         $('.svg-container').insertAfter('#transcripted #results div p:eq(2)');
//         $(".svg-container").addClass('pt-5 mt-5');
//         d3_wordcloud();
//       }
      
//     }
//   });
// }

//  //let container = "svg";
//  let w;
//  let h;
//  let wordSize;
// //https://stackoverflow.com/questions/7715124/do-something-if-screen-width-is-less-than-960-px
// //https://stackoverflow.com/questions/49077801/why-does-window-screen-not-work-on-macos-safari
// if ($(window).innerWidth() /*$(window).width()*/ > 1051) {
//     w = 700; h = 600;
//  }
// if ($(window).innerWidth() /*$(window).width()*/ < 1051) {
//   w = 500; h = 350;
// }
// if ($(window).innerWidth() /*$(window).width()*/ < 801) {
//   w = 300; h = 300;
// }
// /**********************************************************************************************************************************
// //alt
// // device detection at https://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device
// let isMobile = false; 
// if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
//      || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
//     isMobile = true; }else { isMobile = false; }
// if(isMobile) { w = 300; h = 300; } else { w = 700; h = 600; }
// ***********************************************************************************************************************************/



// /** ref
//  * https://www.jasondavies.com/
//  * https://www.jasondavies.com/wordcloud/
//  * https://github.com/jasondavies/d3-cloud
//  * https://youtu.be/1KEiTIu0k44
//  * http://plnkr.co/edit/gNtHZ0lMRTP98mptm3W8?p=preview&preview
//  * https://stackoverflow.com/questions/5667888/counting-the-occurrences-frequency-of-array-elements
//  * https://www.datavis.fr/index.php?page=word-cloud
//  * https://stackoverflow.com/questions/26471497/d3-js-word-missing-from-word-cloud
//  * https://stackoverflow.com/questions/52194553/d3-word-cloud-layout-circle-and-rectangular
//  */
// //http://plnkr.co/edit/gNtHZ0lMRTP98mptm3W8?p=preview&preview
// function d3_wordcloud() {
//   wordSize = 12;
//   let pargraph = "", mywords = [];
//   pargraph = $("#transcripted #results div p:eq(2)").text(); //or p:nth-child(2)
//   mywords = pargraph.split(/[\s.,]+/);  // mywords = pargraph.split(" ");

//   //# of frequency of word each in mywords
//   let result = {};
//   for (i = 0; i < mywords.length; ++i) {
//     if (!result[mywords[i]]) result[mywords[i]] = 0;
//     ++result[mywords[i]];
//   }

//   var newList = _.uniq(mywords);
//   var frequency_list = [];
//   var len = newList.length;
//   for (var i = 0; i < len; i++) {
//     var temp = newList[i];
//     frequency_list.push({
//       text: temp,
//       freq: result[newList[i]],
//       time: 0
//     });
//   }
//   frequency_list.sort(function (a, b) {
//     return parseFloat(b.freq) - parseFloat(a.freq);
//   });

//   for (var t = 0; t < len; t++) {
//     var addTime = 70 * t + 200;
//     frequency_list[t].time = addTime;
//   }

//   for (i in frequency_list) {
//     if (frequency_list[i].freq * wordSize > 160) wordSize = 5;
//   }

//   var sizeScale = d3.scale
//     .linear()
//     .domain([
//       0,
//       d3.max(frequency_list, function (d) {
//         return d.freq;
//       }),
//     ])
//     .range([10, 95]); 

//     d3.layout.cloud().size([w, h])
//     .words(frequency_list)
//     .padding(5)
//     .rotate(function () {
//       return ~~(Math.random() * 2) * 90;
//     })
//     .font("Impact")
//     .fontSize(function (d) {
//       return sizeScale(d.freq);
//     })
//     // .on("end", draw)
//     .on("end", drawCloud)
//     .start();

// }

// // function draw(words) {
// function drawCloud(words) {
//   // svg.remove();

//   var fill = d3.scale.category20();
//   // var fill = d3.scaleOrdinal(d3.schemeCategory20);
// 	// d3.select(container).remove();
//   // d3.select("#wc").append(container)
//   d3.select(".svg-container").append("svg")
//     // .attr("preserveAspectRatio", "xMinYMin meet")
//     // .attr("viewBox", "0 0 300 300")
//     // .classed("svg-content", true)
//     .attr("width", w)
//     .attr("height", h)
//     .append("g")
//     .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")")
//     .selectAll("text")
//     .data(words)
//     .enter()
//     .append("text")
//     .transition()
// 		.duration(function(d) { return d.time}  )
// 		.attr('opacity', 1)
//     .style("font-size", function (d) {
//       return d.size + "px";
//       // return d.size/3 + "vh";
//     })
//     .style("font-family", "Impact")
//     .style("fill", function (d, i) {
//       return fill(i);
//     })
//     .attr("text-anchor", "middle")
//     .attr("transform", function (d) {
//       return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
//     })
//     .text(function (d) {
//       return d.text;
//     });

//   }


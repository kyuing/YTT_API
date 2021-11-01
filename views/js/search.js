$(document).ready(function () {

  $("a.nav-link")[1].click();

  $("ul li").on("click", function () {
    $("li").removeClass("active");
    $(this).addClass("active");
  });

  //works but better to be lazy-loadded
  decodeEntities();  
 
});


//https://stackoverflow.com/questions/5796718/html-entity-decode
//https://stackoverflow.com/questions/1147359/how-to-decode-html-entities-using-jquery
// https://stackoverflow.com/questions/38024631/finding-all-class-names-used-in-html-dom
// https://www.w3schools.com/jsref/met_document_getelementbyid.asp
function decodeEntities() {

  let decoded = [];
  $(".ta").each(function(){
    var textArea = document.createElement('textarea');
    textArea.innerHTML = $(this).text();
    decoded.push(textArea.value)
  });
  // $("#textarea_test").html(arr.join(" [] "));

  var title = $(".title");
  // alert(title.length);
  for(var i = 0; i < title.length; i++){
    $(title[i]).html(decoded[i]);
  }
  
}

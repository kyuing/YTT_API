$(document).ready(function () {
  // draw_results();
  getVideos();
});


//https://youtu.be/EAyo3_zJj5c
function getVideos() {

  const API_KEY = "AIzaSyDolx3J9RfOcsd3S2I8tE6xouTzCYzOU0U";
  // $(document.forms[1]).submit(function (event) {
  $("#search-form").submit(function (event) {
    event.preventDefault()
    var search = $('#search').val();
    // alert(search)

    searchVideos(API_KEY, search, 10);
  })
}

function searchVideos(key, search, maxResults) {

  $('#videos').empty();

  $.get("https://www.googleapis.com/youtube/v3/search?key=" + key 
  + "&type=video&part=snippet&maxResults=" + maxResults 
  + "&q=" + search, function(data){
    console.log(data)

    data.items.forEach(item => {
      // <iframe width="560" height="315" src="https://www.youtube.com/embed/${item.id.videoId}"  frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      //<iframe width="560" height="315" src="https://www.youtube.com/embed/${item.id.videoId}"  frameborder="0" allowfullscreen></iframe>
      let video = `
      <iframe width="420" height="315" src="https://www.youtube.com/embed/${item.id.videoId}"  frameborder="0"></iframe>
      `

      $('#videos').append(video);
      
    });
  })
}


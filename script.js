

$(document).ready(function() {

  var history = [];
  $("#search-button").on("click", function() {
    var searchValue = $("#search-value").val();

    console.log(searchValue)

    // clear input box
    $("#search-value").val("");

    searchWeather(searchValue);
  });

  $(".history").on("click", "li", function() {
    searchWeather($(this).text());
  });

  function makeRow(text) {
    var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
    $(".history").append(li);
  }

  function searchWeather(searchValue) {
    $.ajax({
      type: "GET",
      url: "https://api.openweathermap.org/data/2.5/weather?q="+ searchValue +  "&APPID=5e50cd24efc1f36694e35036bc0371fa",
      dataType: "json",
      success: function(data) {

        var aref = "https://api.openweathermap.org/data/2.5/weather?q="+ searchValue +  "&APPID=5e50cd24efc1f36694e35036bc0371fa";
        console.log(aref)
        // create history link for this search
        console.log(history)
        if (history.indexOf(searchValue) === -1) {
          history.push(searchValue);
          window.localStorage.setItem("history", JSON.stringify(history));
          makeRow(searchValue);
        }
        
        // clear any old content
        $("#today").empty();

        // create html content for current weather
        var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
        var card = $("<div>").addClass("card");
        var wind = $("<p>").addClass("card-text").text("Wind Speed: " + (data.wind.speed * 2.23).toFixed(1) + " MPH");
        var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
        var temp = $("<p>").addClass("card-text").text("Temperature: " + (data.main.temp * 9/5 - 459.67).toFixed(1) + " °F");
        var cardBody = $("<div>").addClass("card-body");
        var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png").attr("id","img2");
        //$("#img2").css({height: 500 + "px", width: 500 + "px"});

        // merge and add to page
        title.append(img);
        cardBody.append(title, temp, humid, wind);
        card.append(cardBody);
        $("#today").append(card);
        // background: rgba(238, 235, 234, 0.219); 

        $('.card').css('background-color', 'rgba(238, 235, 234, 0)');
        $('#today').css('border', 'none' );
        // $("#today").css('background-color', 'grey');
        $(".card-text").css('color', 'white');

        // $("#img2").css({height: 500 + "px", width: 500 + "px"});
        // $('.card').css('background-image', 'url(' + "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png" + ')');
        // $('.card').css({height: 500 + "px", width: 500 + "px"});
        // $("#img2").css({height: 500 + "px", width: 500 + "px"});

        // call follow-up api endpoints
        getForecast(searchValue);
        //getUVIndex(data.coord.lat, data.coord.lon);
      }
    });
  }
  
//Get Started 

function getForecast(searchValue) {
  $.ajax({
    type: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q="+ searchValue +  "&APPID=5e50cd24efc1f36694e35036bc0371fa",
    dataType: "json",
    success: function(data) {

      var aref = "https://api.openweathermap.org/data/2.5/forecast?q="+ searchValue +  "&APPID=5e50cd24efc1f36694e35036bc0371fa";
      console.log(aref)

      $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");

      for(var i = 0; i < data.list.length; i++){

        if(data.list[i].dt_txt.indexOf("15:00:00") !== -1){

          var col = $("<div>").addClass("col-md-2");
          var card = $("<div>").addClass("card bg-primary text-white");
          var body = $("<div>").addClass("card-body p-2");

          var title = $("<h5>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());

          var img = data.list[i].weather[0].icon;

          var imgELEMENT = $("<img>").attr("src", "http://openweathermap.org/img/w/" + img + ".png");

          var tempTxt = "Temp: " + (data.list[i].main.temp_max * 9/5 - 459.67).toFixed(1);  + " F";
           
          var humidityText = "Humidity: " + data.list[i].main.humidity + "%";

          var p1 = $("<p>").addClass("card-text").text(tempTxt);
          var p2 = $("<p>").addClass("card-text").text(humidityText);
          
          body.append(title, imgELEMENT, p1, p2)
          card.append(body)
          col.append(card);

          $("#forecast .row").append(col);
          

        }
      }
    }
  });
}

});

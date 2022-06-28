var citiesListArr = [];
var numOfCities = 9;
//Api Key
var personalAPIKey = "appid=264dbcaa3899de05eeadc78d68ba06dc";
var unit = "units=imperial";
var dailyWeatherApiStarts =
  "https://api.openweathermap.org/data/2.5/weather?q=";
var dailyUVIndexApiStarts = "https://api.openweathermap.org/data/2.5/uvi?";
var forecastWeatherApiStarts =
  "https://api.openweathermap.org/data/2.5/onecall?";
//Select items from the HTML
var searchCityForm = $("#searchCityForm");
var searchedCities = $("#searchedCityLi");
//Gets eather info from open weather
var getCityWeather = function (searchCityName) {
  // formate the OpenWeather api url
  var apiUrl =
    dailyWeatherApiStarts + searchCityName + "&" + personalAPIKey + "&" + unit;
  // make a request to url
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      return response.json().then(function (response) {
        $("#cityName").html(response.name);
        // display date
        var unixTime = response.dt;
        var date = moment.unix(unixTime).format("MM/DD/YY");
        $("#currentdate").html(date);
        // display weather icon
        var weatherIncoUrl =
          "http://openweathermap.org/img/wn/" +
          response.weather[0].icon +
          "@2x.png";
        $("#weatherIconToday").attr("src", weatherIncoUrl);
        $("#tempToday").html(response.main.temp + " \u00B0F");
        $("#humidityToday").html(response.main.humidity + " %");
        $("#windSpeedToday").html(response.wind.speed + " MPH");
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        getUVIndex(lat, lon);
        getForecast(lat, lon);
      });
    } else {
      alert("Please provide a valid city name.");
    }
  });
};
var getUVIndex = function (lat, lon) {
  //Open weather api URL
  var apiUrl =
    dailyUVIndexApiStarts +
    personalAPIKey +
    "&lat=" +
    lat +
    "&lon=" +
    lon +
    "&" +
    unit;
  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      $("#UVIndexToday").removeClass();
      $("#UVIndexToday").html(response.value);
      if (response.value < 3) {
        $("#UVIndexToday").addClass("p-1 rounded bg-success text-white");
      } else if (response.value < 8) {
        $("#UVIndexToday").addClass("p-1 rounded bg-warning text-white");
      } else {
        $("#UVIndexToday").addClass("p-1 rounded bg-danger text-white");
      }
    });
};
//Format OpenWeather API
var getForecast = function (lat, lon) {
  var apiUrl =
    forecastWeatherApiStarts +
    "lat=" +
    lat +
    "&lon=" +
    lon +
    "&exclude=current,minutely,hourly" +
    "&" +
    personalAPIKey +
    "&" +
    unit;
  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      for (var i = 1; i < 6; i++) {
        //Date
        var unixTime = response.daily[i].dt;
        var date = moment.unix(unixTime).format("MM/DD/YY");
        $("#Date" + i).html(date);
        //Weather Icons
        var weatherIncoUrl =
          "http://openweathermap.org/img/wn/" +
          response.daily[i].weather[0].icon +
          "@2x.png";
        $("#weatherIconDay" + i).attr("src", weatherIncoUrl);
        //Temp
        var temp = response.daily[i].temp.day + " \u00B0F";
        $("#tempDay" + i).html(temp);
        //Humidity
        var humidity = response.daily[i].humidity;
        $("#humidityDay" + i).html(humidity + " %");
      }
    });
};
var creatBtn = function (btnText) {
  var btn = $("<button>")
    .text(btnText)
    .addClass("list-group-item list-group-item-action")
    .attr("type", "submit");
  return btn;
};

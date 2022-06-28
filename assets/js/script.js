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
//Local storage saved city load
var loadSavedCity = function () {
  citiesListArr = JSON.parse(localStorage.getItem("weatherInfo"));
  if (citiesListArr == null) {
    citiesListArr = [];
  }
  for (var i = 0; i < citiesListArr.length; i++) {
    var cityNameBtn = creatBtn(citiesListArr[i]);
    searchedCities.append(cityNameBtn);
  }
};
//Saves the searched city
var saveCityName = function (searchCityName) {
  var newcity = 0;
  citiesListArr = JSON.parse(localStorage.getItem("weatherInfo"));
  if (citiesListArr == null) {
    citiesListArr = [];
    citiesListArr.unshift(searchCityName);
  } else {
    for (var i = 0; i < citiesListArr.length; i++) {
      if (searchCityName.toLowerCase() == citiesListArr[i].toLowerCase()) {
        return newcity;
      }
    }
    if (citiesListArr.length < numOfCities) {
      citiesListArr.unshift(searchCityName);
    } else {
      //Keeps saved array under 10 saved cities
      citiesListArr.pop();
      citiesListArr.unshift(searchCityName);
    }
  }
  localStorage.setItem("weatherInfo", JSON.stringify(citiesListArr));
  newcity = 1;
  return newcity;
};
//Populates previous searched cities, with button
var createCityNameBtn = function (searchCityName) {
  var saveCities = JSON.parse(localStorage.getItem("weatherInfo"));
  if (saveCities.length == 1) {
    var cityNameBtn = creatBtn(searchCityName);
    searchedCities.prepend(cityNameBtn);
  } else {
    for (var i = 1; i < saveCities.length; i++) {
      if (searchCityName.toLowerCase() == saveCities[i].toLowerCase()) {
        return;
      }
    }
    if (searchedCities[0].childElementCount < numOfCities) {
      var cityNameBtn = creatBtn(searchCityName);
    } else {
      searchedCities[0].removeChild(searchedCities[0].lastChild);
      var cityNameBtn = creatBtn(searchCityName);
    }
    searchedCities.prepend(cityNameBtn);
    $(":button.list-group-item-action").on("click", function () {
      BtnClickHandler(event);
    });
  }
};
//Function call
loadSavedCity();
//Create button with searched city event handleer
var formSubmitHandler = function (event) {
  event.preventDefault();
  var searchCityName = $("#searchCity").val().trim();
  var newcity = saveCityName(searchCityName);
  getCityWeather(searchCityName);
  if (newcity == 1) {
    createCityNameBtn(searchCityName);
  }
};
var BtnClickHandler = function (event) {
  event.preventDefault();
  //City Name
  var searchCityName = event.target.textContent.trim();
  getCityWeather(searchCityName);
};
//Call functions
$("#searchCityForm").on("submit", function () {
  formSubmitHandler(event);
});
$(":button.list-group-item-action").on("click", function () {
  BtnClickHandler(event);
});

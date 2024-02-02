$(document).ready(function () {
  // Initialize Date Range Picker
  // https://github.com/dangrossman/daterangepicker
  $("#dateRange").daterangepicker({
    opens: "left",
    drops: "down",
    autoApply: true,
    autoUpdateInput: false,
    locale: {
      format: "DD-MM-YYYY", // Set the date format
      separator: " - ", // Set the separator between dates
      daysOfWeek: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"], // Set the abbreviated days of the week
      monthNames: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ], // Set the month names
    },
  });
  // Retrieve saved dates from local storage, if any
  var savedDates = localStorage.getItem("selectedDates");
  if (savedDates) {
    $("#dateRange").val(savedDates);
  }
  // Handle the 'apply' event when a date range is selected
  $("#dateRange").on("apply.daterangepicker", function (ev, picker) {
    // Update the input value with the selected date range
    var selectedDates =
      picker.startDate.format("MM/DD/YYYY") +
      " - " +
      picker.endDate.format("MM/DD/YYYY");
    $(this).val(selectedDates);

    // Save the selected dates to local storage
    localStorage.setItem("selectedDates", selectedDates);
  });
});
$(".search-button").on("click", function () {
  var city = $(".destination").val();
  $(".destination").val("");
  // Save the city to local storage
  console.log(city);
  var cities = JSON.parse(localStorage.getItem("cities")) || [];

  // Trim the cities array to a maximum length of 5
  if (cities.length >= 5) {
    cities = cities.slice(-4); // Keep the last 4 elements
  }

  // Push the new city to the end of the array
  cities.push(city);
  localStorage.setItem("cities", JSON.stringify(cities));

  // Fetch weather data and update UI
  fetchWeather(city);
});

function fetchWeather(city) {
  var geocodeURL =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=7&appid=5a06ce152c88fa8a790870e5beea3c6f";

  fetch(geocodeURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var lat = data[0].lat;
      var lon = data[0].lon;

      // createHistory(city);

      var queryURL =
        "https://api.openweathermap.org/data/2.5/forecast?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=5a06ce152c88fa8a790870e5beea3c6f";

      fetch(queryURL)
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
          var weatherData = result;
          console.log(weatherData);

          // Update the UI with weather data
          updateUI(weatherData);
        })
        .catch(function (error) {
          console.log("Error fetching weather data:", error);
        });
    })
    .catch(function (error) {
      console.log("Error fetching geocoding data:", error);
    });
}

function updateUI(weatherData) {
  for (var i = 0; i < weatherData.list.length; i += 8) {
    var date = new Date(weatherData.list[i].dt * 1000);
    var date1 = new Date(weatherData.list[1].dt * 1000);
    var date6 = new Date(weatherData.list[39].dt * 1000);
    var cardTitleSelector = ".card-title-" + (i / 8 + 1);
    var tempSelector = ".temp-" + (i / 8 + 1);
    var windSelector = ".wind-" + (i / 8 + 1);
    var humiditySelector = ".humidity-" + (i / 8 + 1);
    var iconsEl = ".icon-" + (i / 8 + 1);
    var iconNum = weatherData.list[i].weather[0].icon;
    var iconNum1 = weatherData.list[0].weather[0].icon;
    var iconNum6 = weatherData.list[39].weather[0].icon;
    var icon = "http://openweathermap.org/img/w/" + iconNum + ".png";
    var icon1 = "http://openweathermap.org/img/w/" + iconNum1 + ".png";
    var icon6 = "http://openweathermap.org/img/w/" + iconNum6 + ".png";
    $(".icon-1").attr("src", icon1);
    $(".icon-6").attr("src", icon6);
    $(iconsEl).attr("src", icon);
    $(".city").text(weatherData.city.name + " " + date1.toLocaleDateString());
    $(".humidity-6").text(
      "Humidity: " + weatherData.list[39].main.humidity + "%"
    );
    $(".wind-6").text("Wind: " + weatherData.list[39].wind.speed + " KPH");
    $(".temp-6").text("Temperature: " + tempCelsius6 + "°C");
    // Convert temperature from Kelvin to Celsius
    var tempCelsius = (weatherData.list[i].main.temp - 273.15).toFixed(2);
    $(".card-title-6").text(date6.toLocaleDateString());
    var tempCelsius6 = (weatherData.list[39].main.temp - 273.15).toFixed(2);
    // Update the UI elements with weather data
    $(cardTitleSelector).text(date.toLocaleDateString());
    $(tempSelector).text("Temperature: " + tempCelsius + "°C");
    $(windSelector).text("Wind: " + weatherData.list[i].wind.speed + " KPH");
    $(humiditySelector).text(
      "Humidity: " + weatherData.list[i].main.humidity + "%"
    );
  }
}

$(document).ready(function () {
  // Initialize Date Range Picker
  // https://github.com/dangrossman/daterangepicker
  $("#dateRange").daterangepicker({
    opens: "left",
    drops: "down",
    autoApply: true,
    autoUpdateInput: false,
    maxSpan: {
      days: 4, // Limit the date range to 7 days
    },
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

  // Function to initialize Autocomplete for a given input element
  function initializeAutocomplete(inputSelector, cities) {
    // Initialize Autocomplete
    $(inputSelector).autocomplete({
      source: function (request, response) {
        var term = $.ui.autocomplete.escapeRegex(request.term);
        var startsWithMatcher = new RegExp("^" + term, "i");
        var containsMatcher = new RegExp(term, "i");

        // Filter the list of cities
        var filteredCities = $.grep(cities, function (value) {
          return startsWithMatcher.test(value) || containsMatcher.test(value);
        });

        response(
          filteredCities.length ? filteredCities : ["No matching cities"]
        );
      },
      select: function (event, ui) {
        var city = ui.item.value;

        // Handle selection, e.g., show places and weather for the selected city after click on the Search button
        console.log("Selected city: " + city);
      },
    });
  }

  // Load cities from JSON file (Randomly generated by AI)
  $.getJSON("./models/data/cities.json", function (data) {
    // Check if the data is not empty and is an array
    if (Array.isArray(data) && data.length > 0) {
      // Call the function to initialize Autocomplete
      initializeAutocomplete("#destination", data);
      console.log("City data loaded successfully.");
    } else {
      // Handle the case when the JSON file is empty or not an array
      console.error(
        "Error: Unable to load valid city data from the JSON file."
      );
    }
  });
});
$(".search-button").on("click", function () {
  var city = $(".destination").val();
  $(".destination").val("");
  // Fetch the selected start date from the date range picker
  var startDate = $("#dateRange").data("daterangepicker").startDate;
  var endDate = $("#dateRange").data("daterangepicker").endDate;

  // Calculate the number of days selected
  var numberOfDays = endDate.diff(startDate, "days") + 1; // Add 1 to include both start and end dates

  // Clear existing weather forecast cards
  $("#weatherForecastContainer").empty();

  // Generate weather forecast cards
  for (var i = 0; i < numberOfDays; i++) {
    var forecastDate = startDate.clone().add(i, "days");
    var cardHtml = `
      <div class="col">
        <div class="card card-forecast" style="width: 12rem">
          <ul class="list-group list-group-flush fs-5-card">
            <h3 class="card-title-${i + 1} fs-5-card">${forecastDate.format(
      "MMM DD"
    )}</h3>
            <p class="list-group-item fs-5-card"><img class="icon-${
              i + 1
            }" src=""></p>
            <p class="list-group-item fs-5-card temp-${i + 1}">Temperature:</p>
            <p class="list-group-item fs-5-card wind-${i + 1}">Wind:</p>
            <p class="list-group-item fs-5-card humidity-${i + 1}">Humidity:</p>
          </ul>
        </div>
      </div>
    `;
    $("#weatherForecastContainer").append(cardHtml);
  }

  // Fetch weather data and update UI
  fetchWeather(city, startDate, numberOfDays, numberOfDays);
});
function fetchWeather(city, startDate) {
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

          var startDateString = moment(startDate).format("MM/DD/YYYY");

          for (var i = 0; i < weatherData.list.length; i++) {
            var weatherDateString = moment
              .unix(weatherData.list[i].dt)
              .format("MM/DD/YYYY");

            if (weatherDateString === startDateString) {
              startIndex = i;
              break;
            }
          }

          if (startIndex !== -1) {
            // If start date index is found
            updateUI(weatherData, startIndex);
          } else {
            console.log("Start date not found in weather data.");
          }
        })
        .catch(function (error) {
          console.log("Error fetching weather data:", error);
        });
    })
    .catch(function (error) {
      console.log("Error fetching geocoding data:", error);
    });
}

function updateUI(weatherData, startIndex) {
  for (var i = startIndex; i < startIndex + 6 * 8; i += 8) {
    var indexOffset = Math.floor((i - startIndex) / 8); // Calculate the index offset
    var date = new Date(weatherData.list[i].dt * 1000);
    var cardTitleSelector = ".card-title-" + (indexOffset + 1);
    var tempSelector = ".temp-" + (indexOffset + 1);
    var windSelector = ".wind-" + (indexOffset + 1);
    var humiditySelector = ".humidity-" + (indexOffset + 1);
    var iconsEl = ".icon-" + (indexOffset + 1);
    var iconNum = weatherData.list[i].weather[0].icon;
    var icon = "http://openweathermap.org/img/w/" + iconNum + ".png";

    $(iconsEl).attr("src", icon);
    $(cardTitleSelector).text(date.toLocaleDateString());
    $(tempSelector).text(
      "Temperature: " +
        (weatherData.list[i].main.temp - 273.15).toFixed(2) +
        "°C"
    );
    $(windSelector).text("Wind: " + weatherData.list[i].wind.speed + " KPH");
    $(humiditySelector).text(
      "Humidity: " + weatherData.list[i].main.humidity + "%"
    );
  }
}

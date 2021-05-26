var input = document.querySelector(".form-control");
var userInputStorage;

// saves user search history to loacal storage
var saveSearchHistory = function() {
    localStorage.setItem("search", JSON.stringify(userInputStorage));
};

// displays weather condition for future 5days 
var futureForecast = function(userInput){
    fetch("https://api.openweathermap.org/data/2.5/forecast?q="+ userInput+ "&appid=34a53d9037f69833f5d3bd462bcecce3")
    .then( function(response){
        return response.json();
    })
    .then(function(data){
        $(".forecast-5day").empty();
        var futureForecastTitle = $("<h3>")
        .addClass("col-12")
        .text("5-day Forecast");
        $(".forecast-5day").append(futureForecastTitle);
        
        // loop through data to get weather condition for 5days
        for (var j = 0; j < data.list.length; j++) {
            var futuredate = data.list[j].dt_txt.split(" ");
            // check condition and display weather condition of 12 noon
            if (futuredate[1] === "12:00:00") {
                var dayForecastHolder = $("<div>").addClass(
                "day-forecast col-2 p-3"
                );
                var date = $("<h5>").text(
                moment(futuredate[0]).format("M/DD/YYYY")
                );
                var span = $("<img>")
                .addClass("icon")
                .attr(
                    "src",
                    "http://openweathermap.org/img/w/" +
                    data.list[j].weather[0].icon +
                    ".png"
                );
                var temp = $("<h5>").text(
                "Temp: " +
                    Math.round(
                    (parseFloat(data.list[j].main.temp) - 273.15) * 1.8 + 32
                    ) +
                    " °F"
                );
                var wind = $("<h5>").text(
                "Wind: " + data.list[j].wind.speed + " MPH"
                );
                var humidity = $("<h5>").text(
                "Humidity: " + data.list[j].main.humidity + "%"
                );
                dayForecastHolder.append(date, span, temp, wind, humidity);
                $(".forecast-5day").append(dayForecastHolder);
            }
        }  
    });
};

// change backgound color of uv-index holder according to its value for low, moderate, high, very high and extreme
var changeBgcolor = function(uviValue){
    if(uviValue>0 && uviValue<3){
        $("#uv-index").css("background", "green");
    }
    else if(uviValue>3 && uviValue<6){
        $("#uv-index").css("background", "#dbdb04");
    }
    else if(uviValue>6 && uviValue<8){
        $("#uv-index").css("background", "orange");
    }
    else if(uviValue>8 && uviValue<11){
        $("#uv-index").css("background", "red");
    }
    else{
        $("#uv-index").css("background", "violet");
    }
};

// dispaly result based on user input
var displayResult= function(data, userInput){
    // convert temperature value in fahrenheit
    var fahrenheit = Math.round(((parseFloat(data.current.temp)-273.15)*1.8)+32); 
    var uviValue = data.current.uvi;
    $("#city-name").text(userInput);
    $("#date").text("(" + moment().format("l") + ")");
    $("#weather-icon").attr("src","http://openweathermap.org/img/w/"+data.current.weather[0].icon+".png");
    $("#temp").text(fahrenheit + " °F");
    $("#wind").text(data.current.wind_speed + " MPH");
    $("#humidity").text(data.current.humidity + "%");
    $("#uv-index").text(uviValue);
    // call function to change color of uv-index container based on uv-index value
    changeBgcolor(uviValue);
    // call funtion to display weather condition of future 5 days
    futureForecast(userInput);
};

// display search history
var displaySearchHistory = function(){
    // get data saved from local storage
    userInputStorage= JSON.parse(localStorage.getItem("search")) || [];
    // remove redundancy in an array
    userInputStorage= [...new Set(userInputStorage)];
    $("#search-history-holder").empty();
    for(var i=userInputStorage.length-1; i>=0; i--){
        $("#search-history-holder").append('<li class="city-search-history p-2 text-center">'+ userInputStorage[i] +'</li>');
    }
    // eventlistener when clicked on city from search history
    $(".city-search-history").on("click", citySearchHistoryClick);  
};

// display weather condition when clicked on city from search history
var citySearchHistoryClick = function(event){
    var userInput = $(event.target).text();
    fetchData(userInput);
};
   
// fetch data and display result
var fetchData = function(userInput){
    // fetch data from server side api on wether forecast
    fetch("https://api.openweathermap.org/data/2.5/weather?q="+ userInput +"&appid=34a53d9037f69833f5d3bd462bcecce3")
    .then( function(response){
        return response.json();
    })
    .then(function(data){
        var lon= data.coord.lon;
        var lat= data.coord.lat;
        // fetch data from another server side api which includes data for uv-index as well
        fetch("https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude=minutely,hourly,daily&appid=34a53d9037f69833f5d3bd462bcecce3")
        .then( function(result){
            return result.json();
        })
        .then(function(data){
            displayResult(data, userInput);
            // unhide display result container
            $(".result").removeClass("hide");
        })
    });
}

// search funtion when user clicks search button
var searchFun = function(event){
    event.preventDefault();
    
    var userInput=input.value.trim();
    // validate city name which should not be empty or not a number
    if(userInput==="" || !isNaN(userInput)){
        alert("Please enter valid city name.");
        return;
    }

    userInput = userInput.charAt(0).toUpperCase() + userInput.substr(1).toLowerCase();
    userInputStorage.push(userInput);
    // call function to save data at local storage
    saveSearchHistory();
    // call function to display updated search history
    displaySearchHistory();
    // call function to fetch data and display result
    fetchData(userInput)
};

// display search history at first 
displaySearchHistory();
// event listener for clicking search button
$(".btn").on("click", searchFun);
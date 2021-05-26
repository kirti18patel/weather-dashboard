var input = document.querySelector(".form-control");
var userInputStorage;


var saveSearchHistory = function() {
    localStorage.setItem("search", JSON.stringify(userInputStorage));
};


var futureForecast = function(userInput){
    fetch("http://api.openweathermap.org/data/2.5/forecast?q="+ userInput+ "&appid=34a53d9037f69833f5d3bd462bcecce3")
    .then( function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data.list);
        $(".forecast-5day").empty();
        var futureForecastTitle = $("<h3>")
        .addClass("col-12")
        .text("5-day Forecast");
        $(".forecast-5day").append(futureForecastTitle);
        
        for (var j = 0; j < data.list.length; j++) {
            var futuredate = data.list[j].dt_txt.split(" ");
            if (futuredate[1] === "12:00:00") {
                console.log(futuredate[1]);
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


var changeBgcolor = function(uviValue){
    console.log(uviValue);
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

var displayResult= function(data, userInput){
    var fahrenheit = Math.round(((parseFloat(data.current.temp)-273.15)*1.8)+32); 
    var uviValue = data.current.uvi;
    $("#city-name").text(userInput);
    $("#date").text("(" + moment().format("l") + ")");
    $("#weather-icon").attr("src","http://openweathermap.org/img/w/"+data.current.weather[0].icon+".png");
    $("#temp").text(fahrenheit + " °F");
    $("#wind").text(data.current.wind_speed + " MPH");
    $("#humidity").text(data.current.humidity + "%");
    $("#uv-index").text(uviValue);
    changeBgcolor(uviValue);
    futureForecast(userInput);
};


var displaySearchHistory = function(){
    userInputStorage= JSON.parse(localStorage.getItem("search")) || [];
    userInputStorage= [...new Set(userInputStorage)];
    $("#search-history-holder").empty();
    for(var i=userInputStorage.length-1; i>=0; i--){
        $("#search-history-holder").append('<li class="city-search-history p-2 text-center">'+ userInputStorage[i] +'</li>');
    }    
};


var searchFun = function(event){
    event.preventDefault();
    
    var userInput=input.value.trim();
    if(userInput==="" || !isNaN(userInput)){
        alert("Please enter valid city name.");
        return;
    }

    userInput = userInput.charAt(0).toUpperCase() + userInput.substr(1).toLowerCase();
    userInputStorage.push(userInput);
    saveSearchHistory();
    displaySearchHistory();
    fetch("https://api.openweathermap.org/data/2.5/weather?q="+ userInput +"&appid=34a53d9037f69833f5d3bd462bcecce3")
    .then( function(response){
        return response.json();
    })
    .then(function(data){
        var lon= data.coord.lon;
        var lat= data.coord.lat;
        fetch("https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude=minutely,hourly,daily&appid=34a53d9037f69833f5d3bd462bcecce3")
        .then( function(result){
            return result.json();
        })
        .then(function(data){
            displayResult(data, userInput);
            $(".result").removeClass("hide");
        })
    });
};


displaySearchHistory();
$(".btn").on("click", searchFun);
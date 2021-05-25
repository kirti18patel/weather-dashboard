var input = document.querySelector(".form-control");

var displayResult= function(data, userInput){
    console.log(data);
    var fahrenheit = Math.round(((parseFloat(data.current.temp)-273.15)*1.8)+32); 
    $("#city-name").text(userInput);
    $("#date").text("(" + moment().format("l") + ")");
    $("#weather-icon").attr("src","http://openweathermap.org/img/w/"+data.current.weather[0].icon+".png");
    $("#temp").text(fahrenheit + " °F");
    $("#wind").text(data.current.wind_speed + " MPH");
    $("#humidity").text(data.current.humidity + " %");
    $("#uv-index").text(data.current.uvi);
};
var searchFun = function(event){
    event.preventDefault();
    var userInput=input.value;
    if(userInput==="" || !isNaN(userInput)){
        alert("Please enter valid city name.");
        return;
    }
    userInput = userInput.charAt(0).toUpperCase() + userInput.substr(1).toLowerCase();
    fetch("https://api.openweathermap.org/data/2.5/weather?q="+ userInput +"&appid=34a53d9037f69833f5d3bd462bcecce3")
    .then( function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data);
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
$(".btn").on("click", searchFun);
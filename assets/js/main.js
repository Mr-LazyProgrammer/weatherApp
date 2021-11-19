let getLocationBtn = document.querySelector('.getLocation')
let cityInput = document.querySelector('.input')
let searchDiv = document.querySelector('.search')
let stat = document.createElement('div')
let apiKey = 'b5d297909dbfe3afb046e269336cc950';
let backButton = document.querySelector('.fas')

//Where to put the data
let photo = document.querySelector('.photo')
let tempLabel = document.querySelector('.temp')
let weatherLabel = document.querySelector('.weather')
let cityLabel = document.querySelector('.city')
let tempFeelLabel = document.querySelector('.tempFeel')
let humidityLabel = document.querySelector('.humidityLabel')

backButton.addEventListener("click", ()=>{
    document.querySelector('.inputInfo').classList.remove('hide')
    document.querySelector('.weatherInfo').classList.add('hide')
    stat.innerText = ""
    stat.classList.remove('pending', 'alert')
})

const kelvin = 273;

getLocationBtn.addEventListener("click", ()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError)
    } else {
        alert("Your Browser doesn't support GeoLocation API")
    }
})

function onSuccess(position){
    searchDiv.insertBefore(stat, searchDiv.children[0])
    stat.innerText = "Getting the data!"
    stat.classList.add('pending')

    lon = position.coords.longitude;
    lat = position.coords.latitude;
    fetchfromCoords()
}

function onError(error){
    searchDiv.insertBefore(stat, searchDiv.children[0])
    stat.innerText = error.message
    stat.classList.add('alert')
}

cityInput.addEventListener("keyup", (e)=>{
    if( e.key == "Enter" && cityInput.key != ""){
        requestApi(cityInput.value)
    }
})

function requestApi(city){
    let api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    fetchingInfo(api)
}


function fetchfromCoords(){
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
    fetchingInfo(api)
}

function fetchingInfo(api){
    searchDiv.insertBefore(stat, searchDiv.children[0])
    stat.innerText = "Getting the data!";
    stat.classList.add('pending')
    fetch(api).then((response) => {
            return response.json()
        }).then((data) => {
            console.log(data)
            weather(data)
        })
}

function weather(result){
    if(result.cod == "404"){
        stat.classList.remove('pending')
        searchDiv.insertBefore(stat, searchDiv.children[0])
        stat.innerText = `${cityInput.value} is not a valid city`
        stat.classList.add('alert')
    } else {
        document.querySelector('.inputInfo').classList.add('hide')
        document.querySelector('.weatherInfo').classList.remove('hide')
    }

    let humidity = result.main.humidity
    let temp = Math.floor(result.main.temp) - kelvin
    let feelsLike = Math.floor(result.main.feels_like) - kelvin
    let description = result.weather[0].description

    tempLabel.innerHTML = `<p class="tempFeel">${temp} <span><sup>o</sup>C</span></p>`
    if(cityInput.value === "") cityLabel.innerText = result.name
    else cityLabel.innerText = `${cityInput.value}`
    humidityLabel.innerHTML = `<p class="humidity">${humidity} <span>%</span></p>`
    weatherLabel.innerText = description
    tempFeelLabel.innerHTML = `<p class="tempFeel">${feelsLike} <span><sup>o</sup>C</span></p>`

    let code = result.weather[0].id
    if( code >= 200 && code <= 232 ) photo.src = 'assets/img/storm.svg'
    else if( code >= 300 && code <= 321 ) photo.src = 'assets/img/storm.svg'
    else if( code >= 500 && code <= 531 ) photo.src = 'assets/img/rain.svg'
    else if( code >= 600 && code <= 622 ) photo.src = 'assets/img/snow.svg'
    else if( code >= 701 && code <= 781 ) photo.src = 'assets/img/haze.svg'
    else if( code >= 801 && code <= 804 ) photo.src = 'assets/img/cloud.svg'
    else if(code === 800 ) photo.src = 'assets/img/clear.svg'
}

const searchInput = document.getElementById("city");
const submitBtn = document.getElementById("submit");
const displayElement = document.getElementById("display");
displayElement.classList.add("hidden");
const handleSubmit = (e) => {
  e.preventDefault();
  const location = searchInput.value.trim();
  if (!location) {
    alert("Please enter a location");
  } else {
    fetchData(location);
    searchInput.value = "";
  }
};

const formatDate = (date) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString("vi-VN", options);
};

const formatTime = (time) => {
  const options = { hour: "2-digit", minute: "2-digit" };
  return new Date(time).toLocaleTimeString("vi-VN", options);
};

const formatWeekday = (date) => {
  const options = { weekday: "long" };
  return new Date(date).toLocaleDateString("vi-VN", options);
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const createHourlyForecastHTML = (forecastData) => {
  return forecastData
    .map(({ dt_txt, weather, main, wind }) => {
      return `
        <div class="flex flex-col items-center justify-center text-white">
          <span>${formatTime(dt_txt)}</span>
          <img src="http://openweathermap.org/img/w/${
            weather[0].icon
          }.png" alt="weather icon" class="w-[50px] h-[50px] object-cover" />
          <span>${main.temp}°C</span>
          <span>${(wind.speed * 3.6).toFixed(1)} km/h</span>
        </div>
      `;
    })
    .join("");
};

const createWeeklyForecastHTML = (forecastData) => {
  const dailyForecast = forecastData.filter((item) =>
    item.dt_txt.includes("12:00:00")
  );

  return dailyForecast
    .map(({ dt_txt, weather, main, wind }) => {
      return `
          <div class="flex flex-col items-center justify-center text-white">
            <span>${formatWeekday(dt_txt)}</span>  <!-- Display the weekday -->
            <img src="http://openweathermap.org/img/w/${
              weather[0].icon
            }.png" alt="weather icon" class="w-[50px] h-[50px] object-cover" />
            <span>${main.temp}°C</span>
            <span>${(wind.speed * 3.6).toFixed(1)} km/h</span>
          </div>
        `;
    })
    .join("");
};

const updateDisplay = (data) => {
  const { name: cityName } = data.city;
  const { temp: temperature, humidity } = data.list[0].main;
  const { speed: windSpeed } = data.list[0].wind;
  const { description, icon } = data.list[0].weather[0];
  const date = formatDate(data.list[0].dt_txt);
  const iconURL = `http://openweathermap.org/img/w/${icon}.png`;
  const hourlyForecastHTML = createHourlyForecastHTML(data.list.slice(0, 8));
  const weeklyForecastHTML = createWeeklyForecastHTML(data.list);
  displayElement.classList.remove("hidden");
  displayElement.innerHTML = `
    <h1 class="text-center text-white text-5xl font-bold mt-10">Weather Details</h1>
    <div class="flex justify-around my-10 items-center w-full">
      <div class="flex flex-col text-3xl text-[#EAEAEA] gap-y-2">
        <h2 class="font-bold text-4xl text-white">${cityName} - ${date}</h2>
        <span>${capitalize(description)}</span>
        <span>Nhiệt độ: ${temperature}°C</span>
        <span>Độ ẩm: ${humidity}%</span>
        <span>Sức gió: ${(windSpeed * 3.6).toFixed(1)} km/h</span>
      </div>
      <img src="${iconURL}" alt="weather icon" class="w-[250px] h-[250px] translate-y-[-50px] object-cover" />
    </div>
    <div class="grid bg-purple-600 w-[75%] h-[350px] grid-cols-4 gap-x-4 text-center rounded-lg my-5 text-lg ">
      ${hourlyForecastHTML}
    </div>
    <div class="grid bg-purple-600 w-[75%] h-[250px] grid-cols-5 gap-x-4 text-center rounded-lg my-5 text-lg ">
      ${weeklyForecastHTML}
    </div>
  `;
};

const fetchData = async (location) => {
  const API_KEY = "0d0f1e506f66f06b2dd7d7584871fca8";
  const URL = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${API_KEY}&lang=vi`;

  try {
    const response = await fetch(URL);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    updateDisplay(data);
  } catch (error) {
    console.error(error);
    alert("Failed to fetch weather data. Please try again.");
  }
};

submitBtn.addEventListener("click", handleSubmit);

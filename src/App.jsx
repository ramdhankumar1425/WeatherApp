import { useEffect } from "react";
import { useState } from "react";

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [locationField, setLocationField] = useState("London");

  async function getCoordinates(location) {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=f771b503808c4bca52da54b525a504ec`
    );
    let obj = await response.json();
    return obj[0];
  }
  useEffect(() => {
    async function getData(event) {
      if (event.key === "Enter" && event.target.value !== "") {
        setLocationField(location);
        const coordinate = await getCoordinates(location);
        if (coordinate) {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${coordinate.lat}&lon=${coordinate.lon}&appid=f771b503808c4bca52da54b525a504ec`
          );
          const weatherData = await response.json();
          setData(weatherData);
        }
      }
    }

    document.addEventListener("keydown", getData);

    return () => {
      document.removeEventListener("keydown", getData);
    };
  }, [location]);

  // for first time load
  useEffect(() => {
    async function getFirstData() {
      const coordinate = await getCoordinates(locationField);
      if (coordinate) {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${coordinate.lat}&lon=${coordinate.lon}&appid=f771b503808c4bca52da54b525a504ec`
        );
        const weatherData = await response.json();
        setData(weatherData);
      }
    }

    getFirstData();
  }, []);

  return (
    <div
      className="h-screen
      w-screen
      text-white 
      font-sans"
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/2114014/pexels-photo-2114014.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`,
        backgroundSize: "cover",
      }}
    >
      <div className="fixed top-[7%] w-[60%] left-[50%] -translate-x-2/4 md:w-[30vw]">
        <input
          className="rounded-3xl w-full px-5 py-[7px] bg-gray-600 outline-none font-serif"
          type="text"
          placeholder="Search for location"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
        />
      </div>
      <div className="fixed top-[20%] md:top-[30%] left-[50%] -translate-x-2/4 md:w-[420px] md:h-[20%] w-[60%] h-[25%] flex flex-col sm:flex-row justify-center items-center md:gap-12 gap-7 rounded-3xl bg-gray-500">
        <div className="text-center">{locationField.toUpperCase()}</div>
        <div className="text-5xl md:text-6xl font-semibold">
          {data.main ? <h1>{Math.floor(data.main.temp - 273.15)}°C</h1> : null}
        </div>
      </div>
      <div className="fixed top-[55%] md:top-[70%] left-[50%] -translate-x-2/4 w-[60%] md:w-[420px] md:h-[20%] h-[30%] flex flex-col md:flex-row items-center justify-around rounded-3xl bg-gray-500">
        <div className="feelsLike flex flex-row gap-3 md:gap-1 justify-evenly md:flex-col">
          <p>Feels Like</p>
          {data.main ? (
            <p className="font-bold ">
              {Math.floor(data.main.feels_like - 273.15)}°C
            </p>
          ) : null}
        </div>
        <div className="humidity flex flex-row gap-3 md:gap-1 justify-evenly md:flex-col">
          <p>Humidity</p>
          {data.main ? (
            <h1 className="font-bold">{Math.floor(data.main.humidity)} %</h1>
          ) : null}
        </div>
        <div className="wind flex flex-row gap-3 md:gap-1 justify-evenly md:flex-col">
          <p>Wind Speed</p>
          {data.main ? (
            <h1 className="font-bold">
              {Math.floor(data.wind.speed * 1.60934)} KM/H
            </h1>
          ) : null}
        </div>
        <div className="visibility flex flex-row gap-3 md:gap-1 justify-evenly md:flex-col">
          <p>Visibility</p>
          {data.main ? (
            <h1 className="font-bold">
              {Math.floor(data.visibility / 1000)} KM
            </h1>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default App;

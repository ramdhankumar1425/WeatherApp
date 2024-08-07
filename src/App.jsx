import { useEffect } from "react";
import { useState } from "react";

function App() {
  // const url = `https://api.openweathermap.org/data/2.5/weather?lat=26.115103&lon=91.703239&appid=f771b503808c4bca52da54b525a504ec`

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
      if (event.key === "Enter") {
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
      w-full
      flex 
      flex-col
      justify-between
      text-white 
      font-sans"
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/2114014/pexels-photo-2114014.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`,
        backgroundSize: "cover",
      }}
    >
      <div className="search text-center mt-5">
        <input
          className="rounded-3xl w-[350px] px-5 py-[7px] bg-gray-600 outline-none  font-serif"
          type="text"
          placeholder="Search for location"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
        />
      </div>
      <div className="ml-20 bg-gray-500 w-[15rem] h-[17rem] rounded-3xl flex flex-col justify-center items-center">
        <div className="location text-center overflow-hidden w-[13rem]">
          {locationField.toUpperCase()}
        </div>

        <div className="temp m-5">
          {data.main ? (
            <h1 className="text-7xl font-semibold">
              {Math.floor(data.main.temp - 273.15)}°C
            </h1>
          ) : null}
        </div>
      </div>
      <div className="text-center flex justify-center mb-10">
        <div className="flex items-center justify-evenly rounded-3xl bg-gray-500 w-[28rem] h-28">
          <div className="feelsLike">
            {data.main ? (
              <h1 className="font-bold">
                {Math.floor(data.main.feels_like - 273.15)}°C
              </h1>
            ) : null}
            <p>Feels Like</p>
          </div>
          <div className="humidity">
            {data.main ? (
              <h1 className="font-bold">{Math.floor(data.main.humidity)} %</h1>
            ) : null}
            <p>Humidity</p>
          </div>
          <div className="wind">
            {data.main ? (
              <h1 className="font-bold">
                {Math.floor(data.wind.speed * 1.60934)} KM/H
              </h1>
            ) : null}
            <p>Wind Speed</p>
          </div>
          <div className="visibility">
            {data.main ? (
              <h1 className="font-bold">
                {Math.floor(data.visibility / 1000)} KM
              </h1>
            ) : null}
            <p>Visibility</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

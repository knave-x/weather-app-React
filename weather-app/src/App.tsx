import logo from "./logo.svg";
import React from "react";
import "./App.css";
import { useEffect, useState } from "react";

import axios from "axios";

import { Button, ButtonGroup, Navbar } from "react-bootstrap";

import weatherlogo from "./assets/images/weatherlogo.jpg";
//import {geolocated} from "react-native-geolocation-service";
import { getSunrise, getSunset } from "sunrise-sunset-js";
import { strictEqual } from "assert";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

function App() {
  const [temperature, setTemperature] = useState("");
  const [lat, setLat] = useState("52.2297");
  const [lon, setLon] = useState("21.0122");
  const [data, setData] = useState<any>(null);
  const [weatherName, setWeatherName] = useState("");

  const [Latitude, setLatitude] = useState("");
  const [Longitude, setLongitude] = useState("");

  const [items, setItems] = useState([]);

  const [type, setType] = useState<string>("F");

  const [icon, setIcon] = useState("02d");

  const getWeatherData = (lat: string, lon: string) => {
    const dataString = localStorage.getItem("batu");
    if (dataString) {
      const data = JSON.parse(dataString);
      setData(data);
    } else {
      axios({
        method: "GET",
        url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=cd9b8b22e3d2107dd66b235df271bdf1`,
      })
        .then((Response) => {
          console.log(Response.data);
          setData(Response.data);
          localStorage.setItem("batu", JSON.stringify(Response.data));
        })

        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    getWeatherData(lat, lon);
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
      setLat(position.coords.latitude.toString());
      setLon(position.coords.longitude.toString());
      getWeatherData(
        position.coords.latitude.toString(),
        position.coords.longitude.toString()
      );
    });
  }, []);

  useEffect(() => {
    console.log("lat değişti  çalıştım");
  }, [lat]);

  function cToF() {
    if (type === "F") {
      setType("C");
    } else {
      setType("F");
    }

    console.log("new calculation : ", (data.main.temp - 273).toFixed(2));
  }

  // Initialize and add the map
  // function initMap(): void {
  //   // The location of Uluru
  //   const uluru = { lat: -25.344, lng: 131.031 };
  //   // The map, centered at Uluru
  //   const map = new google.maps.Map(
  //     document.getElementById("map") as HTMLElement,
  //     {
  //       zoom: 4,
  //       center: uluru,
  //     }
  //   );

  //   // The marker, positioned at Uluru
  //   const marker = new google.maps.Marker({
  //     position: uluru,
  //     map: map,
  //   });
  // }

  // declare global {
  //   interface Window {
  //     initMap: () => void;
  //   }
  // }
  // window = initMap;

  return (
    <div>
      <h1>Weather APP</h1>
      {/* <Navbar fixed="top" expand="xxl" variant="dark" bg="MyRed">
        <Navbar.Brand>
          <img src={weatherlogo} width="40px" height="40px" />
          Weather APP
        </Navbar.Brand>
      </Navbar> */}
      <div className="wrapper">
        <div>
          <form>
            <input
              className="searchbar transparent"
              type="text"
              placeholder="enter latitude"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
            />
            <input
              className="searchbar transparent"
              type="text"
              placeholder="enter longitude"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
            />

            <input
              className="searchbar transparent"
              id="search"
              type="text"
              placeholder="enter city, country"
            />
            <ButtonGroup>
              <button
                type="button"
                className="button button-cold"
                onClick={() => {
                  localStorage.clear();
                  getWeatherData(lat, lon);
                  console.log("button aktif  mi");
                }}
              >
                FIND
              </button>
              <button
                type="button"
                className="button button-cold"
                onClick={() => {
                  cToF();
                  console.log("button aktif");
                }}
              >
                C TO F
              </button>
            </ButtonGroup>
          </form>
        </div>
        <div className="panel">
          <h2>
            {data && data.name} ,{data && data.sys.country}
          </h2>
          <div className="weather" id="weather">
            <div className="group secondary">
              <h3 style={{ textTransform: "capitalize" }}>
                {data && data.weather[0].description}
              </h3>
            </div>
            <div className="group secondary">
              <h3>Wind: {data && data.wind.speed} mph </h3>
              <h3>Humidtiy:{data && data.main.humidity}%</h3>
            </div>
            <div className="temperature" id="temperature">
              <h1></h1>
              <h1 className="temp" id="temp">
                <i>
                  <img
                    src={
                      data &&
                      `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
                    }
                    alt=""
                  />
                </i>
                <a>
                  {data && data.main && data.main.temp && type === "F" ? (
                    <p>{data && data.main.temp} &deg;F </p>
                  ) : (
                    <p>{data && (data.main.temp - 273).toFixed(2)} &deg;C</p>
                  )}
                </a>
              </h1>
            </div>
            <div className="forecast" id="forecast"></div>
          </div>
        </div>
      </div>
      <div
        style={{ height: "5px", width: "100%", backgroundColor: "#226ba3" }}
      ></div>
      <div style={{ marginTop: "150px" }}></div>
      {/* <div
        style={{
          height: "200px",
          width: "450px",
          backgroundColor: "#94e5ff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "25px",
        }}
      >
        */}
      Location : {data && data.name}
      <br />
      {data && data.main && data.main.temp && type === "F" ? (
        <p>{data && data.main.temp}</p>
      ) : (
        <p>{data && (data.main.temp - 273).toFixed(2)}</p>
      )}
      {/*
         {type}
        <br />
        <br />
        <br />
        Country :{data && data.sys.country}
        <br />
        Saat: {data && Date}
        <br />
        <h1>sicaklik: {data && data.main.temp}</h1>
      </div> */}
      <br />
      {/* <Navbar fixed="top" expand="xxl" variant="dark" bg="MyRed">
        <Navbar.Brand>
          <img src={weatherlogo} width="40px" height="40px" />
          Weather APP
        </Navbar.Brand>
      </Navbar>
      <br />
      <br />
      <input type="text" value={lat} onChange={(e) => setLat(e.target.value)} />
      <input type="text" value={lon} onChange={(e) => setLon(e.target.value)} />
      <Button
        variant="success"
        size="sm"
        onClick={() => {
          localStorage.clear();
          getWeatherData(lat, lon);
        }}
      >
        GET
      </Button>
      <Button
        onClick={() => {
          cToF();
        }}
      >
        C TO F
      </Button>


      */}
    </div>
  );
}

export default App;

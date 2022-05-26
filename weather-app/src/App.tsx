import logo from "./logo.svg";
import React from "react";
import "./App.css";
import { useEffect, useState } from "react";
import translationEN from "./locales/en/translationEN.json";
import translationTR from "./locales/tr/translationTR.json";
import { initReactI18next } from "react-i18next";
import axios from "axios";
import i16n from "./i18n";

import {
  Button,
  ButtonGroup,
  Container,
  Nav,
  Navbar,
  NavDropdown,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
//import {geolocated} from "react-native-geolocation-service";
import { getSunrise, getSunset } from "sunrise-sunset-js";
import { strictEqual } from "assert";
//import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import GoogleMap from "./GoogleMap";
import { Wrapper, Status } from "@googlemaps/react-wrapper";

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
  const [t, i18n] = useTranslation();

  // const [ln, changeLanguage] = useState("");

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

  // useEffect(() => {
  //   i18n.changeLanguage();

  //   console.log("language change");
  // }, []);

  const changeLanguage = (ln: any) => {
    return () => {
      i18n.changeLanguage(ln);
    };
  };

  function cToF() {
    if (type === "F") {
      setType("C");
    } else {
      setType("F");
    }

    console.log("new calculation : ", (data.main.temp - 273).toFixed(2));
  }

  useEffect(() => {
    console.log("lat değişti  çalıştım");
  }, [lat]);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          i18n.changeLanguage("tr");
          console.log("language change ");
        }}
      >
        tr
      </button>
      <button
        type="button"
        onClick={() => {
          i18n.changeLanguage("en");
        }}
      >
        en
      </button>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">{t("appname")}</Navbar.Brand>

          <Nav className="me-auto">
            <NavDropdown title="Languages" id="basic-nav-dropdown">
              <NavDropdown.Item
                //type="button"
                onClick={() => {
                  i18n.changeLanguage("tr");
                }}
              >
                Turkish
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Turkey.svg"
                  width={10}
                  height={10}
                />
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                onClick={() => {
                  i18n.changeLanguage("en");
                }}
              >
                English
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>
      {/* <h1>{t("appname")}</h1> */}
      {/* <Navbar fixed="top" expand="xxl" variant="dark" bg="MyRed">
        <Navbar.Brand>
          <img src={weatherlogo} width="40px" height="40px" />
          Weather APP
        </Navbar.Brand>
      </Navbar> */}
      <div className="wrapper">
        <div>
          <GoogleMap lat={lat} lon={lon}></GoogleMap>
          <form>
            <input
              className="searchbar transparent"
              type="text"
              placeholder={t("Llatitude")}
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
            {data && data.name} {data && ","}
            {data && data.sys.country}
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
                    width="80px"
                    height="80px"
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
    </div>
  );
}

export default App;

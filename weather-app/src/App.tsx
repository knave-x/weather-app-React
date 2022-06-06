import logo from "./logo.svg";
import React from "react";
import "./App.css";
import { useEffect, useState } from "react";
import translationEN from "./locales/en/translationEN.json";
import translationTR from "./locales/tr/translationTR.json";
import { initReactI18next } from "react-i18next";
import axios from "axios";
import i16n from "./i18n";
import ProductsFeed from "./ProdutcsFeed";

import {
  Button,
  ButtonGroup,
  Card,
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
import { getCLS } from "web-vitals";
import RssFeed from "./rssfeed";

function App() {
  const [temperature, setTemperature] = useState("");
  const [lat, setLat] = useState("39.9272");
  const [lon, setLon] = useState("32.8644");
  const [data, setData] = useState<any>(null);
  const [weatherName, setWeatherName] = useState("");

  const [lang, setLang] = useState();

  const [Latitude, setLatitude] = useState("");
  const [Longitude, setLongitude] = useState("");

  const [items, setItems] = useState([]);

  const [type, setType] = useState<string>("F");

  const [icon, setIcon] = useState("02d");
  const [t, i18n] = useTranslation();
  const [number, setNumber] = useState("");
  const [clicks, setClicks] = useState([]);

  const LathandleChange = (e: any) => {
    const result = e.target.value.replace(/\D/g, "");

    setLat(result);
  };

  const LonghandleChange = (e: any) => {
    const result = e.target.value.replace(/\D/g, "");

    setLon(result);
  };

  const getWeatherData = (lat: string, lon: string) => {
    const dataString = localStorage.getItem("batu");
    if (dataString) {
      const data = JSON.parse(dataString);
      setData(data);
    } else {
      axios({
        method: "GET",
        url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=cd9b8b22e3d2107dd66b235df271bdf1&lang=${i16n.language}`,
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
      setLat(position.coords.latitude.toString());
      setLon(position.coords.longitude.toString());
      getWeatherData(
        position.coords.latitude.toString(),
        position.coords.longitude.toString()
      );
    });
  }, []);

  function cToF() {
    if (type === "F") {
      setType("C");
    } else {
      setType("F");
    }
  }

  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand>{t("appname")}</Navbar.Brand>

          <Nav className="me-auto">
            <NavDropdown
              text-align="rigth"
              title={t("Languages")}
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item
                onClick={() => {
                  i18n.changeLanguage("tr");
                }}
              >
                Turkish
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Turkey.svg"
                  width={22}
                  height={22}
                />
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                onClick={() => {
                  i18n.changeLanguage("en");
                }}
              >
                English
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/a/ae/Flag_of_the_United_Kingdom.svg"
                  width={25}
                  height={25}
                />
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>
      <div className="wrapper">
        <div>
          <GoogleMap
            lat={lat}
            lon={lon}
            setLat={setLat}
            setLon={setLon}
            updateData={getWeatherData}
            clicks={clicks}
            setClicks={setClicks}
            data={data}
          ></GoogleMap>
        </div>
        <div className="panel">
          <div className=" yazivebuton">
            <form>
              <input
                className="searchbar transparent"
                type="text"
                placeholder={t("Llatitude")}
                value={lat}
                onChange={(e) => LathandleChange(e)}
              />

              <input
                className="searchbar transparent"
                type="text"
                placeholder="enter longitude"
                value={lon}
                onChange={(e) => LonghandleChange(e)}
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
                  {t("find")}
                </button>
                <button
                  type="button"
                  className="button button-cold"
                  onClick={() => {
                    //setClicks([])
                    cToF();
                    console.log("button aktif");
                  }}
                >
                  C TO F
                </button>

                <button
                  type="button"
                  className="button button-cold"
                  onClick={() => {
                    setClicks([]);
                  }}
                >
                  {t("clear")}
                </button>
              </ButtonGroup>
            </form>
          </div>
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
              <h3>
                {t("Wind")} {data && data.wind.speed} mph{" "}
              </h3>
              <h3>
                {t("Humidity")}
                {data && data.main.humidity}%
              </h3>
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

        <div className=" logtextare">
          {clicks.map((click: any) => (
            <div>
              <Card style={{ width: "12rem" }}>
                <Card.Body>
                  <Card.Title>
                    {click.location1},{click.location}
                  </Card.Title>
                  {/* <Card.Text> {`lat: ${click.lat().toFixed(3)}`}</Card.Text> */}
                  <Card.Text>Lon: {click.latLng.lng().toFixed(3)}</Card.Text>
                  <Card.Text> lon: {click.latLng.lat().toFixed(3)}</Card.Text>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
        <div className="rss">
          <h2>Rss FeeD</h2>
          <RssFeed></RssFeed>
        </div>
      </div>
      <div className="w-100">
        Product Feeds
        <ProductsFeed />
        <div></div>
      </div>

      {<div></div>}
      {/* <div style={{ marginTop: "150px" }}></div> */}
    </div>
  );
}

export default App;

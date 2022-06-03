import { AnySrvRecord } from "dns";
import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { isTemplateSpan } from "typescript";
import axios from "axios";

const { parse } = require("rss-to-json");
export default function ProductsFeed() {
  const [pfeed, setPfeed] = useState<any>([]);

  const getData = async () => {
    // let rss = await axios.get('https://fakestoreapi.com/products')
    // .then(res => {
    //   setPfeed(rss);
    // })
    // .catch(err => {
    //   console.log(err)
    // });
    // axios({
    //   method: "GET",
    //   url: `https://fakestoreapi.com/products`,
    // })
    //   .then((Response) => {
    //     console.log(Response.data);
    //     setPfeed(Response.data);
    //     //localStorage.setItem("batu", JSON.stringify(Response.data));
    //   })

    //   .catch((error) => {
    //     console.log(error);
    //   });

  axios.get('https://fakestoreapi.com/products')
  .then(function (response) {
    setPfeed(response.data);
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  };
  useEffect(() => {
    //   setInterval(() => {
    //     getData();
    //   }, 60000)
    // }, []);
    getData();
    console.log(pfeed);
  }, []);
  if (!pfeed) {
    return <div></div>;
  }

  return (
    <div className="App">
      {pfeed && pfeed.map((x:any) => <p>{x.title}</p>)}
      {pfeed.id}
      {/* {rsss.image&& (<img src= {rsss.image}></img>)} */}
      {/* {pfeed.id.map((item: any, i:number) => {
      return (
        <div key={i}>
          <Card >
            <Card.Body>
              <Card.Title>{item.id}</Card.Title>
              <Card.Text></Card.Text>
              
            </Card.Body>
          </Card>
        </div>
      );
    })} */}
    </div>
  );
}

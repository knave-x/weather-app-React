import { AnySrvRecord } from "dns";
import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { isTemplateSpan } from "typescript";
const { parse } = require("rss-to-json");
export default function RssFeed() {
  const [rssUrl, setRssUrl] = useState("");
  const [rsss, setRsss] = useState<any>(null);

  // const getData = async () => {
  //   let rss = await parse("https://rss.art19.com/apology-line");
  //   console.log("rss : ", rss);
  //   setItems(rss.items);
  //   console.log(JSON.stringify(rss, null, 3));
  // };
  // useEffect(() => {
  //   getData();
  // }, []);

  // return (
  //   <div className="App">
  //     {items.map((item: any) => {
  //       return (
  //         <div>
  //           <a>{item.title}</a>

  //           <br />
  //           <a>{item.itunes_duration}</a>
  //           <p>{item.author}</p>
  //           <a href={item.link}>{item.link}</a>
  //           <div></div>
  //         </div>
  //       );
  //     })}
  //   </div>
  // );

  const getData = async () => {
    let rss = await parse(
      "https://cors-anywhere.herokuapp.com/https://www.nhc.noaa.gov/gtwo.xml"
    );
    console.log("rss : ", rss);
    setRsss(rss);
    console.log(JSON.stringify(rss, null, 3));
  };
  useEffect(() => {
    getData();
  }, []);
  if (!rsss) {
    return <div></div>;
  }
  return (
    <div className="App" style={{marginRight:"20px" }}>
      {rsss.title}
      {/* {rsss.image&& (<img src= {rsss.image}></img>)} */}
      {rsss.items.map((item: any, i:number) => {
        return (
          <div key={i}>
            <Card style={{ width: "18rem" }}>
              
              <Card.Body>
                <Card.Title>{item.title}</Card.Title>
                <Card.Text></Card.Text>
                <Button href={item.link} target="blank" variant="primary">
                  View News
                </Button>
              </Card.Body>
            </Card>
          </div>
        );
      })}
    </div>
  );
}

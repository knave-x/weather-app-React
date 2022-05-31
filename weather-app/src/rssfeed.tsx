import { AnySrvRecord } from "dns";
import React, { useEffect, useState } from "react";
const { parse } = require("rss-to-json");
export default function RssFeed() {
  const [rssUrl, setRssUrl] = useState("");
  const [items, setItems] = useState([]);

  const getData = async () => {
    let rss = await parse("https://rss.art19.com/apology-line");
    console.log("rss : ", rss);
    setItems(rss.items);
    console.log(JSON.stringify(rss, null, 3));
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="App">
      {items.map((item: any) => {
        return (
          <div>
            <a>{item.title}</a>

            <br />
            <a>{item.itunes_duration}</a>
            <p>{item.author}</p>
            <a href={item.link}>{item.link}</a>
            <div></div>
          </div>
        );
      })}
    </div>
  );
}

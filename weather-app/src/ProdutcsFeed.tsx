import { AnySrvRecord } from "dns";
import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { isTemplateSpan } from "typescript";
import axios from "axios";

const { parse } = require("rss-to-json");
export default function ProductsFeed() {
  const [pfeed, setPfeed] = useState<any>([]);

  const getData = async () => {
    axios
      .get("https://fakestoreapi.com/products")
      .then(function(response) {
        setPfeed(response.data);
        console.log(response);
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      });
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

  //   return (
  //     <div className="App">
  //       {pfeed && pfeed.map((x: any) => {
  //         return(
  //           <div key={i}>

  //       <p>{x.title}</p>)}
  //       {x.title}
  //       <Card style={{ width: "18rem" }}>
  //         <Card.Img variant="top" src="holder.js/100px180" />
  //         <Card.Body>
  //           <Card.Title>{x.title}</Card.Title>
  //           <Card.Text>
  //             Some quick example text to build on the card title and make up the
  //             bulk of the card's content.
  //           </Card.Text>
  //           <Button variant="primary">Go somewhere</Button>
  //         </Card.Body>
  //       </Card>
  //     </div>
  //   );
  //         })}
  // </div>
  // );
  // }

  return (
    <div className="App">
      {pfeed.map((product: any, i: number) => {
        return (
          <div key={i}>
            <Card style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title>{product.title}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <Button variant="primary" target="blank">
                  {product.price}$
                </Button>
              </Card.Body>
            </Card>
          </div>
        );
      })}
    </div>
  );
}

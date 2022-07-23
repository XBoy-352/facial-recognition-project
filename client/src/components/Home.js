import React from "react";
import "../App.css";
import image from "./images/home.jpg";

function Home() {
  return (
    <div style={{ backgroundColor: "rgb(13, 9, 65)", margin: "auto" }}>
      <div
        style={{
          backgroundImage: `url(${image})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          width: "100%",
          margin: "auto",
          height: "100em",
          color: "white",
          opacity: "0.9",
          backgroundColor: "rgb(13, 9, 65)",
        }}
      >
        <br />
        <h1 style={{ margin: "auto", height: "100vh" }}>
          Facial Investigator{" "}
        </h1>
        <br />
      </div>
    </div>
  );
}

export default Home;

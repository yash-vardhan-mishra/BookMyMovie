import React, { useEffect, useState } from "react";
import Header from "../../common/header/Header";

const Details = (props) => {
  const [data, setData] = useState({});
  useEffect(() => {
    console.log("the id obtained from previous screen", props.location.id);
    const fetchMovies = async () => {
      try {
        const rawResponse = await fetch(
          `${props.baseUrl}movies/${props.location.id}`
        );
        const response = await rawResponse.json();
        if (rawResponse.status === 200) {
          setData(response);
        } else {
          alert(response.message);
        }
      } catch (error) {
        console.log("error is, ", error);
      }
    };
    fetch(`${props.baseUrl}movies/${props.location.id}`)
      .then((rawResponse) => {
        if (rawResponse.status === 200) return rawResponse.json();
        else {
          console.log("the rawResponse is, ", rawResponse);
        }
      })
      .then((res) => {
        console.log("the details are, ", res);
      })
      .catch((err) => alert("something went wrong"));
    fetchMovies();
  }, []);
  console.log("the data is, ", data);

  return (
    <div className="container">
      <Header {...props} isReleased={props.location.isReleased}/>
      <div className="innerContainer">

      </div>
    </div>
  );
};

export default Details;

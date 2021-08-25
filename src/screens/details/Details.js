import React, { useEffect, useState } from "react";
import Header from "../../common/header/Header";

const Details = (props) => {
  const [data, setData] = useState({});
  useEffect(() => {
    console.log("the id obtained from previous screen", props.match.params.id);
    const fetchMovies = async () => {
      try {
        const rawResponse = await fetch(
          `${props.baseUrl}movies/${props.match.params.id}`
        );
        const response = await rawResponse.json();
        if (rawResponse.status === 200) {
          setData(response);
          console.log("the response obtained is, ", response);
        } else {
          alert(response.message);
        }
      } catch (error) {
        console.log("error is, ", error);
      }
    };
    fetchMovies();
  }, []);
  console.log("the data is, ", data);

  return (
    <div className="container">
      <Header
        {...props}
        isReleased={props.location.isReleased}
        onBookShow={() =>
          props.history.push({
            pathname: `/bookshow/${data.id}`,
            id: data.id,
          })
        }
      />
      <div className="innerContainer"></div>
    </div>
  );
};

export default Details;

import React from "react";
import Header from "../../common/header/Header";

const Home = (props) => {
  return (
    <div className="container">
      <Header {...props} />
    </div>
  );
};

export default Home;

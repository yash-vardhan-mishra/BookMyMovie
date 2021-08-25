import React, { useEffect, useState } from "react";
import {
  Typography,
  withStyles,
  GridListTile,
  GridListTileBar,
  GridList,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import YouTube from "react-youtube";
import StarBorderIcon from "@material-ui/icons/StarBorder";

import Header from "../../common/header/Header";
import "./Details.css";
const styles = (theme) => ({
  backButton: {
    marginTop: 8,
    marginLeft: 24,
  },
});
const Details = (props) => {
  const [data, setData] = useState({});
  const [rating, setRating] = useState(0);
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

  const renderRating = () => (
    <div style={{ flexDirection: "row", alignItems: "center" }}>
      {[...Array(5)].map((item, index) => (
        <StarBorderIcon
          nativeColor={index < rating ? "yellow" : "black"}
          onClick={() => setRating(index + 1)}
        />
      ))}
    </div>
  );

  console.log("the data is, ", data);
  const { classes } = props;
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
      <div className="innerContainer">
        <Typography classes={{ root: classes.backButton }}>
          <Link to={"/"}>&#60; Back to Home</Link>
        </Typography>
        <div className="detailsContainer">
          <div className="leftPane">
            <img src={data.poster_url} alt={data.title} />
          </div>
          <div className="middlePane">
            <Typography component="h2" variant="headline">
              {data.title}
            </Typography>
            <Typography>
              <span className="bold">Genre: </span>
              {Array.isArray(data.genres) ? data.genres.join(", ") : null}
            </Typography>
            <Typography>
              <span className="bold">Duration: </span>
              {data.duration}
            </Typography>
            <Typography>
              <span className="bold">Release Date: </span>
              {new Date(data.release_date).toDateString()}
            </Typography>
            <Typography>
              <span className="bold">Rating: </span>
              {data.rating}
            </Typography>
            <Typography>
              <span className="bold">Plot: </span>
              <a href={data.wiki_url}>(Wiki Link)</a>
              {` ${data.storyline}`}
            </Typography>
            <div className="trailer">
              <Typography>
                <span className="bold">Trailer: </span>
              </Typography>
              {data.trailer_url ? (
                <YouTube
                  videoId={data.trailer_url.split("v=")[1]}
                  opts={{
                    playerVars: {
                      autoplay: 0,
                    },
                  }}
                />
              ) : null}
            </div>
          </div>
          <div className="rightPane">
            <Typography>
              <div className="bold">Rate This Movie: </div>
            </Typography>
            {renderRating()}
            <div className="artists">
              <Typography>
                <span className="bold">Artists: </span>
              </Typography>

              <GridList
                // style={{ flexWrap: "nowrap" }}
                spacing={12}
                cellHeight={250}
                cols={2}
              >
                {Array.isArray(data.artists)
                  ? data.artists.map((item) => (
                      <GridListTile
                        // onClick={() => {
                        //   props.history.push({
                        //     pathname: `/movie/${item.id}`,
                        //     id: item.id,
                        //     isReleased: false,
                        //   });
                        // }}
                        cols={1}
                        key={item.id}
                      >
                        <img
                          src={item.profile_url}
                          alt={`${item.first_name} ${item.last_name}`}
                        />
                        <GridListTileBar
                          title={`${item.first_name} ${item.last_name}`}
                        />
                      </GridListTile>
                    ))
                  : null}
              </GridList>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withStyles(styles)(Details);

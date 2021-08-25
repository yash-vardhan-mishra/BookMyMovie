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
    // fetching a movie data by sending its id to api
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

  // rendering the 5 star rating component by mapping an array of size 5 into icons
  const renderRating = () => (
    <div className="ratingContainer">
      {[...Array(5)].map((item, index) => (
        <StarBorderIcon
          key={`rating${index + 1}`}
          nativeColor={index < rating ? "yellow" : "black"}
          onClick={() => setRating(index + 1)}
        />
      ))}
    </div>
  );

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
              {/* showing array in comma separated form */}
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
              <a target={"_blank"} href={data.wiki_url}>
                (Wiki Link)
              </a>
              {` ${data.storyline}`}
            </Typography>
            <div className="trailer">
              <Typography>
                <span className="bold">Trailer: </span>
              </Typography>
              {data.trailer_url ? (
                <YouTube
                  // extracted videoId
                  videoId={data.trailer_url.split("v=")[1]}
                  opts={{
                    playerVars: {
                      // disabled autoplay
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
            </div>
            {Array.isArray(data.artists) ? (
              <GridList
                // style={{ flexWrap: "nowrap" }}
                spacing={12}
                cellHeight={250}
                cols={2}
              >
                {data.artists.map((item) => (
                  <GridListTile cols={1} key={item.id}>
                    <img
                      src={item.profile_url}
                      alt={`${item.first_name} ${item.last_name}`}
                    />
                    <GridListTileBar
                      title={`${item.first_name} ${item.last_name}`}
                    />
                  </GridListTile>
                ))}
              </GridList>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withStyles(styles)(Details);

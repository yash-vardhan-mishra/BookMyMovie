import React, { useEffect, useState } from "react";

import Header from "../../common/header/Header";
import "./Home.css";
import {
  GridListTile,
  GridList,
  GridListTileBar,
  Card,
  withStyles,
  CardContent,
  Select,
  MenuItem,
  Checkbox,
  InputLabel,
  FormControl,
  TextField,
  Button,
} from "@material-ui/core";
import FormInput from "../../common/formInput/FormInput";

const styles = (theme) => ({
  cardComponent: {
    margin: theme.spacing.unit,
    minWidth: 240,
    maxWidth: 240,
  },
  title: {
    color: theme.palette.primary.light,
  },
});

const Home = (props) => {
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [releasedMovies, setReleasedMovies] = useState([]);
  const [artists, setArtists] = useState([]);
  const [genre, setGenres] = useState([]);
  const [filterData, setFilterData] = useState({
    title: "",
    genre: [],
    artists: [],
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    const fetchUpcomingMovies = () =>
      fetch(`${props.baseUrl}movies?status=published`)
        .then((rawResponse) => rawResponse.json())
        .then((res) => {
          console.log("the movies are, ", res);
          setUpcomingMovies(res.movies);
        })
        .catch((err) => alert("something went wrong"));

    const fetchReleasedMovies = () =>
      fetch(`${props.baseUrl}movies?status=released`)
        .then((rawResponse) => rawResponse.json())
        .then((res) => {
          console.log("the movies are, ", res);
          setReleasedMovies(res.movies);
        })
        .catch((err) => alert("something went wrong"));

    const fetchArtists = () =>
      fetch(`${props.baseUrl}artists`)
        .then((rawResponse) => rawResponse.json())
        .then((res) => {
          console.log("the artists are, ", res);
          setArtists(res.artists);
        })
        .catch((err) => alert("something went wrong"));

    const fetchGenres = () =>
      fetch(`${props.baseUrl}genres`)
        .then((rawResponse) => rawResponse.json())
        .then((res) => {
          console.log("the genres are, ", res);
          setGenres(res.genres);
        })
        .catch((err) => alert("something went wrong"));

    fetchArtists();
    fetchGenres();
    fetchUpcomingMovies();
    fetchReleasedMovies();
  }, []);

  const handleFilterDataChange = (name, value) => {
    if (name !== "genre" && name !== "artists") {
      setFilterData((val) => ({ ...val, [name]: value }));
    } else {
      setFilterData((val) => {
        const newArr = [...val[name]];
        let filteredArr = newArr;
        if (val[name].includes(value)) {
          filteredArr = newArr.filter((element) => element !== value);
        } else {
          filteredArr.push(value);
        }
        return { ...val, [name]: filteredArr };
      });
    }
  };

  const applyFilters = () => {
    let params = "";
    Object.keys(filterData).map((item) => {
      if (item === "genre" || item === "artists") {
        if (filterData[item].length) {
          filterData[item].forEach((element) => {
            if (!params) {
              params += `${item}=${element}`;
            } else {
              params += `&${item}=${element}`;
            }
          });
        }
      } else {
        if (filterData[item]) {
          if (!params) {
            params += `${item}=${filterData[item]}`;
          } else {
            params += `&${item}=${filterData[item]}`;
          }
        }
      }
    });
    let endPoint = `${props.baseUrl}movies`;
    if (params) {
      endPoint += `?${params}`;
    }
    console.log("the endPoint became, ", endPoint);
    fetch(endPoint)
      .then((rawResponse) => rawResponse.json())
      .then((res) => {
        console.log("the movies are, ", res);
        setReleasedMovies(res.movies);
      })
      .catch((err) => alert("something went wrong"));
  };

  const renderArtistPicker = () => (
    <FormControl className={classes.cardComponent}>
      <InputLabel htmlFor="artists">Artists</InputLabel>
      <Select
        value={filterData.artists}
        onChange={(e) => {
          handleFilterDataChange(e.target.name, e.target.value);
        }}
        inputProps={{
          name: "artists",
          id: "artists",
        }}
      >
        {artists &&
          artists.length &&
          artists.map((item, index) => {
            const artistName = `${item.first_name} ${item.last_name}`;
            return (
              <MenuItem value={artistName} key={item.id}>
                <div
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Checkbox
                    checked={
                      filterData.artists &&
                      filterData.artists.length &&
                      filterData.artists.includes(artistName)
                    }
                  />
                  {artistName}
                </div>
              </MenuItem>
            );
          })}
      </Select>
    </FormControl>
  );

  const renderGenrePicker = () => (
    <FormControl className={classes.cardComponent}>
      <InputLabel htmlFor="genre">Genre</InputLabel>
      <Select
        value={filterData.genre}
        onChange={(e) => {
          handleFilterDataChange(e.target.name, e.target.value);
        }}
        inputProps={{
          name: "genre",
          id: "genre",
        }}
      >
        {genre &&
          genre.length &&
          genre.map((item, index) => (
            <MenuItem value={item.genre} key={item.id}>
              <div
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Checkbox
                  checked={
                    filterData.genre &&
                    filterData.genre.length &&
                    filterData.genre.includes(item.genre)
                  }
                />
                {item.genre}
              </div>
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );

  const { classes } = props;
  console.log("the filterData is, ", filterData);
  return (
    <div className="container">
      <Header {...props} />
      <div className="innerContainer">
        <div className="upcomingMovies">Upcoming Movies</div>
        {upcomingMovies && upcomingMovies.length ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-around",
              overflow: "hidden",
            }}
          >
            <GridList
              style={{ flexWrap: "nowrap" }}
              spacing={12}
              cellHeight={250}
              cols={6}
            >
              {upcomingMovies &&
                upcomingMovies.length &&
                upcomingMovies.map((item, index) => (
                  <GridListTile
                    onClick={() => {
                      props.history.push({
                        pathname: `/movie/${item.id}`,
                        id: item.id,
                        isReleased: false,
                      });
                    }}
                    cellHeight={250}
                    cols={1}
                    key={item.id}
                  >
                    <img src={item.poster_url} alt={item.title} />
                    <GridListTileBar title={item.title} />
                  </GridListTile>
                ))}
            </GridList>
            <div className="middleContainer">
              <div className="releasedMoviesContainer">
                <GridList spacing={12} cellHeight={350} cols={4}>
                  {releasedMovies &&
                    releasedMovies.length &&
                    releasedMovies.map((item, index) => (
                      <GridListTile
                        onClick={() => {
                          props.history.push({
                            pathname: `/movie/${item.id}`,
                            id: item.id,
                            isReleased: true,
                          });
                        }}
                        key={item.id}
                        cols={1}
                      >
                        <img src={item.poster_url} alt={item.title} />
                        <GridListTileBar
                          title={item.title}
                          subtitle={item.release_date}
                        />
                      </GridListTile>
                    ))}
                </GridList>
              </div>
              <div className="filterPane">
                <Card>
                  <CardContent>
                    <div
                      className={`${classes.cardComponent} ${classes.title}`}
                    >
                      FIND MOVIES BY:
                    </div>

                    <FormInput
                      id="title"
                      value={filterData.title}
                      label="Movie Name"
                      onChange={handleFilterDataChange}
                    />

                    {renderGenrePicker()}
                    {renderArtistPicker()}
                    <FormControl className={classes.cardComponent}>
                      <TextField
                        id="start_date"
                        name="start_date"
                        label="Release Date Start"
                        type="date"
                        value={filterData.start_date}
                        onChange={(e) =>
                          handleFilterDataChange(e.target.name, e.target.value)
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </FormControl>
                    <FormControl className={classes.cardComponent}>
                      <TextField
                        id="end_date"
                        name="end_date"
                        label="Release Date End"
                        type="date"
                        value={filterData.end_date}
                        onChange={(e) =>
                          handleFilterDataChange(e.target.name, e.target.value)
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </FormControl>
                    <Button
                      className={classes.cardComponent}
                      onClick={applyFilters}
                      color="primary"
                      variant="contained"
                    >
                      APPLY
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default withStyles(styles)(Home);

import React, { useState } from "react";
import Modal from "react-modal";
import { Button, Tab, Tabs } from "@material-ui/core";
import HeaderLogo from "../../assets/logo.svg";
import "./Header.css";
import FormInput from "../formInput/FormInput";
import { useEffect } from "react";
const registrationSuccessfulMessage = "Registration Successful. Please Login!";
Modal.setAppElement("#root");
const Header = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tabVal, setTabVal] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);
  const handleChange = (event, newValue) => {
    setTabVal(newValue);
  };
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [emptyDataSubmittedToLogin, setEmptyDataSubmittedToLogin] =
    useState(false);
  const [signUpData, setSignUpData] = useState({
    email_address: "",
    first_name: "",
    last_name: "",
    mobile_number: "",
    password: "",
  });
  const [emptyDataSubmittedToSignUp, setEmptyDataSubmittedToSignUp] =
    useState(false);

  useEffect(() => {
    const accessToken = sessionStorage.getItem("access-token");
    if (accessToken) {
      setIsLoggedIn(true);
    }
  }, []);

  const changeLoginData = (name, value) =>
    setLoginData((val) => ({ ...val, [name]: value }));

  const changeSignUpData = (name, value) =>
    setSignUpData((val) => ({ ...val, [name]: value }));

  const register = () => {
    const { email_address, first_name, last_name, mobile_number, password } =
      signUpData;
    if (
      !email_address ||
      !first_name ||
      !last_name ||
      !mobile_number ||
      !password
    ) {
      setEmptyDataSubmittedToSignUp(true);
    } else {
      if (emptyDataSubmittedToSignUp) {
        setEmptyDataSubmittedToSignUp(false);
      }
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signUpData),
      };
      fetch(`${props.baseUrl}signup`, requestOptions)
        .then((response) => response.json())
        .then((res) => {
          if (res.id) {
            setIsRegistered(true);
          } else if (res.message) {
            alert(res.message);
          }
        })
        .catch((err) => {
          alert("Something went wrong");
          console.log("the error is, ", err);
        });
    }
  };

  const login = async () => {
    if (!loginData.username || !loginData.password) {
      setEmptyDataSubmittedToLogin(true);
    } else {
      if (emptyDataSubmittedToLogin) {
        setEmptyDataSubmittedToLogin(false);
      }
      const param = window.btoa(`${loginData.username}:${loginData.password}`);
      const requestData = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;charset=UTF-8",
          authorization: `Basic ${param}`,
        },
      };
      try {
        const rawResponse = await fetch(
          `${props.baseUrl}auth/login`,
          requestData
        );
        console.log("rawResponse is, ", rawResponse);
        if (rawResponse.status === 200) {
          const response = await rawResponse.json();
          sessionStorage.setItem("user-details", JSON.stringify(response));
          sessionStorage.setItem(
            "access-token",
            rawResponse.headers.get("access-token")
          );
          setModalVisible(false);
          setIsLoggedIn(true);
          console.log("the response is, ", response);
        } else {
          const response = await rawResponse.json();
          alert(response.message);
          console.log("the response is, ", response);
        }
      } catch (error) {
        alert("Something went wrong");
        console.log("the error is, ", error);
      }
    }
  };

  const logout = () =>
    fetch(`${props.baseUrl}auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Authorization: "Bearer " + sessionStorage.getItem("access-token"),
      },
    }).then((response) => {
      if (response.status === 200) {
        sessionStorage.clear();
        setIsLoggedIn(false);
        alert("Logged Out Successfully");
      }
    });

  return (
    <div className="headerContainer">
      <img className="headerLogo" alt="Header Logo" src={HeaderLogo} />
      <div className="buttonContaner">
        {props.isReleased ? (
          <div style={{ marginRight: 12 }}>
            <Button color="primary" variant="contained">
              Book Show
            </Button>
          </div>
        ) : null}
        <Button
          onClick={isLoggedIn ? () => logout() : () => setModalVisible(true)}
          color="default"
          variant="contained"
        >
          {isLoggedIn ? "Log Out" : "Login"}
        </Button>
      </div>
      <Modal
        isOpen={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        style={{
          content: {
            width: "40%",
            position: "absolute",
            left: "30%",
            right: "30%",
          },
        }}
      >
        <Tabs
          variant="fullWidth"
          value={tabVal}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>
        <TabPanel value={tabVal} index={0}>
          <FormInput
            id="username"
            onChange={changeLoginData}
            value={loginData.username}
            label="Username *"
            required
            showError={emptyDataSubmittedToLogin}
          />
          <FormInput
            id="password"
            onChange={changeLoginData}
            value={loginData.password}
            label="Password *"
            type="password"
            required
            showError={emptyDataSubmittedToLogin}
          />
          <div className="bottomButton">
            <Button onClick={login} color="primary" variant="contained">
              Login
            </Button>
          </div>
        </TabPanel>
        <TabPanel value={tabVal} index={1}>
          <FormInput
            id="first_name"
            onChange={changeSignUpData}
            value={signUpData.first_name}
            label="First name *"
            required
            showError={emptyDataSubmittedToSignUp}
          />
          <FormInput
            id="last_name"
            onChange={changeSignUpData}
            value={signUpData.last_name}
            label="Last Name *"
            required
            showError={emptyDataSubmittedToSignUp}
          />
          <FormInput
            id="email_address"
            onChange={changeSignUpData}
            value={signUpData.email_address}
            label="Email *"
            required
            showError={emptyDataSubmittedToSignUp}
          />
          <FormInput
            id="password"
            onChange={changeSignUpData}
            value={signUpData.password}
            label="Password *"
            type="password"
            required
            showError={emptyDataSubmittedToSignUp}
          />
          <FormInput
            id="mobile_number"
            onChange={changeSignUpData}
            value={signUpData.mobile_number}
            label="Contact Number *"
            type="tel"
            required
            showError={emptyDataSubmittedToSignUp}
          />
          {isRegistered ? (
            <div className="promptText">{registrationSuccessfulMessage}</div>
          ) : null}
          <div className="bottomButton">
            <Button onClick={register} color="primary" variant="contained">
              Register
            </Button>
          </div>
        </TabPanel>
      </Modal>
    </div>
  );
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <div className="tabPanel">{children}</div>}
    </div>
  );
};

export default Header;

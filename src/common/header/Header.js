import React, { useState } from "react";
import Modal from "react-modal";
import {
  Button,
  Tab,
  Tabs,
  FormControl,
  InputLabel,
  Input,
} from "@material-ui/core";
import HeaderLogo from "../../assets/logo.svg";
import "./Header.css";
const registrationSuccessfulMessage = "Registration Successful. Please Login!";

const Header = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tabVal, setTabVal] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);
  const handleChange = (event, newValue) => {
    setTabVal(newValue);
  };
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [signUpData, setSignUpData] = useState({
    email_address: "",
    first_name: "",
    last_name: "",
    mobile_number: "",
    password: "",
  });

  const changeLoginData = (name, value) =>
    setLoginData((val) => ({ ...val, [name]: value }));

  const changeSignUpData = (name, value) =>
    setSignUpData((val) => ({ ...val, [name]: value }));

  const register = () => {
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
        console.log(
          "the response is, ",
          res,
          "while request is, ",
          JSON.stringify(signUpData)
        );
      })
      .catch((err) => console.log("the error is, ", err));
  };

  return (
    <div className="headerContainer">
      <img className="headerLogo" alt="Header Logo" src={HeaderLogo} />
      <div className="buttonContaner">
        <div style={{ marginRight: 12 }}>
          <Button color="primary" variant="contained">
            Book Show
          </Button>
        </div>
        <Button
          onClick={() => setModalVisible(true)}
          color="default"
          variant="contained"
        >
          Login
        </Button>
      </div>
      <Modal
        isOpen={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        style={{
          content: {
            width: "30%",
            position: "absolute",
            left: "35%",
            right: "35%",
          },
        }}
      >
        <Tabs
          fullWidth
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
          />
          <FormInput
            id="password"
            onChange={changeLoginData}
            value={loginData.password}
            label="Password *"
            type="password"
          />
          <div className="bottomButton">
            <Button
              // onClick={() => setModalVisible(true)}
              color="primary"
              variant="contained"
            >
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
          />
          <FormInput
            id="last_name"
            onChange={changeSignUpData}
            value={signUpData.last_name}
            label="Last Name *"
          />
          <FormInput
            id="email_address"
            onChange={changeSignUpData}
            value={signUpData.email_address}
            label="Email *"
          />
          <FormInput
            id="password"
            onChange={changeSignUpData}
            value={signUpData.password}
            label="Password *"
            type="password"
          />
          <FormInput
            id="mobile_number"
            onChange={changeSignUpData}
            value={signUpData.mobile_number}
            label="Contact Number *"
            type="tel"
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

const FormInput = ({ label, value, onChange, required, id, type }) => (
  <div className="formInput">
    <FormControl>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Input
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        required={required}
        id={id}
        type={type}
        aria-describedby={id}
      />
    </FormControl>
  </div>
);
FormInput.defaultProps = {
  type: "text",
};
export default Header;

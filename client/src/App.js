import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useLocation } from "react-router-dom";
import axios from "axios";
import "./App.css";

const getToken = () => {
  return localStorage.getItem("token");
};

const getUser = () => {
  return axios.get("http://localhost:8081/api/auth/getUser", { headers: { Authorization: `Basic ${getToken()}` } });
};
const getCities = () => {
  return axios.get("http://localhost:8081/api/cities/", { headers: { Authorization: `Basic ${getToken()}` } });
};
const Authenticator = () => {
  return (
    <Redirect
      to={{
        pathname: getToken() ? "/home" : "/login",
      }}
    />
  );
};

const Home = () => {
  const [fullname, setFullname] = useState("");
  const [cities, setCities] = useState([]);
  useEffect(() => {
    getUser()
      .then(({ data }) => {
        setFullname(data.user.fullname);
      })
      .catch((err) => {
        console.log(">>> userinfo: err", err);
      });
    getCities()
      .then(({ data }) => {
        setCities(data.cities);
      })
      .catch((err) => {
        console.log(">>> cities: err", err);
      });
  }, []);

  return getToken() ? (
    <div className="Home">
      <div className="Header">
        <h2>Hello {fullname}</h2>
        <div
          onClick={() => {
            localStorage.removeItem("token");
            setFullname("");
          }}
        >
          Sign Out
        </div>
      </div>
      <div className="HomeBody">
        {fullname &&
          cities &&
          cities.map((city) => (
            <div className="CityCard" key={city.id}>
              <h3>{city.name}</h3>
              <p>{city.state}</p>
            </div>
          ))}
      </div>
    </div>
  ) : (
    <Redirect
      to={{
        pathname: "/",
      }}
    />
  );
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Username and Password are required");
    }
    try {
      const response = await axios.post("http://localhost:8081/api/auth/login", { username, password });
      localStorage.setItem("token", response.data.accessToken);
      setFullname(response.data.fullname);
    } catch (err) {
      err = err.response ? err.response.data.error : err;
      console.log(err);

      alert(err.message);
    }
  };

  return getToken() ? (
    <Redirect
      to={{
        pathname: "/home",
      }}
    />
  ) : (
    <div className="Login">
      <div className="LoginCard">
        <h2>LOGIN</h2>
        <div>
          <h3>Username:</h3>
          <input type="text" key="username" placeholder="Enter here" onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <h3>Password:</h3>
          <input type="text" key="password" placeholder="Enter here" onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="ButtonContainer">
          <input type="submit" value="Login" onClick={handleLogin} />
        </div>
        <Link to="/register">Register here</Link>
      </div>
    </div>
  );
};

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");

  const handleRegister = async () => {
    try {
      if (!username || !email || !fullname || !password) {
        alert("All fields are required");
      }
      await axios.post("http://localhost:8081/api/auth/register", {
        username,
        password,
        fullname,
        email,
      });
      alert("Registration Successful. Please redirect to Login");
    } catch (err) {
      err = err.response ? err.response.data.error : err;
      alert(err.message);
    }
  };
  return (
    <div className="Login">
      <div className="LoginCard">
        <h2>SIGNUP</h2>
        <div>
          <h3>Fullname:</h3>
          <input type="text" key="fullname" placeholder="Enter here" onChange={(e) => setFullname(e.target.value)} />
        </div>
        <div>
          <h3>E-mail:</h3>
          <input type="text" key="email" placeholder="Enter here" onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <h3>Username:</h3>
          <input type="text" key="username" placeholder="Enter here" onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <h3>Password:</h3>
          <input type="text" key="password" placeholder="Enter here" onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="ButtonContainer">
          <input type="submit" value="Register" onClick={handleRegister} />
        </div>
        <Link to="/login">LogIn here</Link>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Authenticator />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/home">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

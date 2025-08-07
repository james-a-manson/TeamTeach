import React from "react";
import { useState } from "react";

import Login from "./Components/Login";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Dashboard from "./Components/Dashboard";

export default function Home() {
  // useState to track if the admin is logged in
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const toggleLogin = () => {
    setLoggedIn(!loggedIn);
  };

  return (
    <div>
      {!loggedIn ? (
        <>
          <Login toggleLogin={toggleLogin}></Login>
        </>
      ) : (
        <>
          <Header toggleLogin={toggleLogin} />
          <Dashboard />
          <Footer />
        </>
      )}
    </div>
  );
}

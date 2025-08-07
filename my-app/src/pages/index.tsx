import React from "react";
import { useState, useEffect } from "react";
import Header from "./Components/Header";
import Login from "./Components/Login";
import Footer from "./Components/Footer";
import { useAuth } from "../contexts/UserContext";
import TutorApplication from "./Components/TutorApplication";
import Lecturer from "./Components/Lecturer";
import { useDisclosure } from "@chakra-ui/react";

export default function Home() {
  // Grabbing user context
  const { user } = useAuth();

  // useState for userType
  const [userType, setUserType] = useState<string | undefined>("");

  // useDisclosure for Drawer navigation system.
  // Was easier to pass this down to other components than to use a context
  const { isOpen, onOpen, onClose } = useDisclosure();

  // useEffect to set the userType whenever the user is changed
  useEffect(() => {
    console.log("User changed to: ", user);
    if (user) {
      setUserType(user.role);
      //console.log(userType);
    } else {
      setUserType(undefined);
      //console.log(userType);
    }
  }, [user]);

  // ok so apparently its cos of how React bundles updates
  // it actually works fine but it just doesn't change the state immediately inside the above useEffect
  useEffect(() => {
    console.log("UserType changed to: ", userType);
  }, [userType]);

  return (
    <>
      {user ? (
        <>
          <Header onOpen={onOpen} />
          {userType === "candidate" && (
            <TutorApplication isOpen={isOpen} onClose={onClose} />
          )}

          {userType === "lecturer" && (
            <Lecturer isOpen={isOpen} onClose={onClose} />
          )}
          <Footer />
        </>
      ) : (
        <Login />
      )}
    </>
  );
}

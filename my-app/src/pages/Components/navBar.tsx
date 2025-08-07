import React from "react";
import { useAuth } from "../../contexts/UserContext";
import {
  Box,
  Flex,
  Spacer,
  Button,
  Image,
  useToast,
  Avatar,
  IconButton,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

interface NavBarProps {
  onOpen: () => void;
}

export default function NavBar({ onOpen }: NavBarProps) {
  const { user } = useAuth();
  const { logout } = useAuth();

  const toast = useToast();

  // All logout does is clear the current user from local storage
  // This causes the Home component to re-render and show the login page again
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  return (
    <div>
      <Box bg="#8ecae6" w="100%" p={4} color="#023047">
        <Flex alignItems="center">
          <IconButton
            variant="solid"
            backgroundColor="white"
            aria-label="Open menu"
            icon={<HamburgerIcon />}
            marginRight="10px"
            bg="clear"
            onClick={onOpen}
          />
          <Image src={"/teamteach.png"} alt="TeamTeach" maxWidth="200px" />
          <Spacer />
          <Button colorScheme="blue" variant="solid" onClick={handleLogout}>
            Log Out
          </Button>
          <Avatar
            bg="blue.500"
            name={user?.firstName + " " + user?.lastName}
            src="https://bit.ly/broken-link"
            marginLeft={4}
          />
        </Flex>
      </Box>
    </div>
  );
}

import React, { useState } from "react";
import {
  Box,
  Heading,
  Stack,
  VStack,
  FormControl,
  FormLabel,
  Card,
  Input,
  Button,
  Center,
  InputGroup,
  InputRightElement,
  Text,
  Image,
  useToast,
} from "@chakra-ui/react";

interface LoginProps {
  toggleLogin: () => void;
}

export default function Login({ toggleLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  // Toast for error/success messages
  const toast = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (username == "") {
      toast({
        title: "Login failed",
        description: "Username field empty",
        status: "error",
        colorScheme: "red",
        duration: 9000,
        isClosable: true,
      });
      setError("Username field cannot be empty");
      return;
    } else if (password == "") {
      toast({
        title: "Login failed",
        description: "Password field empty",
        status: "error",
        colorScheme: "red",
        duration: 9000,
        isClosable: true,
      });
      setError("Password field cannot be empty");
      return;
    }

    if (username == "admin" && password == "admin") {
      toggleLogin();
    } else {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        status: "error",
        colorScheme: "red",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <VStack as="header" spacing={6} marginTop={50} marginBottom={25}>
        <Image
          src="/teamteach.png"
          maxWidth="325px"
          alt="TeamTeach logo"
        ></Image>
        <Heading as="h1" size="xl">
          Admin Dashboard
        </Heading>
      </VStack>
      <Center>
        <Stack spacing={3}>
          <Card variant="unstyled" maxWidth={400} bg="#f7f7f7">
            <form onSubmit={handleLogin}>
              <Stack spacing={3} padding={3}>
                <Card
                  bg="#f7f7f7"
                  variant="unstyled"
                  borderColor="#e8e8e8"
                  padding={4}
                  maxWidth={400}
                >
                  <FormControl isInvalid={username == ""}>
                    <FormLabel htmlFor="email" fontSize="lg" fontWeight={600}>
                      Username
                    </FormLabel>
                    <Input
                      onChange={(e) => setUsername(e.target.value)}
                      bg="white"
                      type="text"
                      placeholder="Enter username"
                    />
                  </FormControl>
                </Card>
                <Card
                  bg="#f7f7f7"
                  variant="unstyled"
                  borderColor="#e8e8e8"
                  padding={4}
                  maxWidth={400}
                >
                  <FormControl isInvalid={password == ""}>
                    <FormLabel
                      htmlFor="password"
                      fontSize="lg"
                      fontWeight={600}
                    >
                      Password
                    </FormLabel>
                    <InputGroup size="md">
                      <Input
                        onChange={(e) => setPassword(e.target.value)}
                        bg="white"
                        type={show ? "text" : "password"}
                        placeholder="Enter your password"
                      />
                      <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                          {show ? "Hide" : "Show"}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                </Card>
              </Stack>
              <Box paddingLeft={2} paddingRight={2} paddingBottom={2}>
                {error && (
                  <Text color="red.500" fontSize="sm">
                    {error}
                  </Text>
                )}
                <Button type="submit" colorScheme="blue" width="stretch">
                  Log in
                </Button>
              </Box>
            </form>
          </Card>
        </Stack>
      </Center>
    </Box>
  );
}

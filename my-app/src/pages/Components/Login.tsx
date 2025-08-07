import React, { useState } from "react";
import { useAuth } from "../../contexts/UserContext";
import {
  Box,
  Heading,
  Stack,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Card,
  CardBody,
  Input,
  Button,
  Center,
  InputGroup,
  InputRightElement,
  Text,
  Image,
  useToast,
  Radio,
  RadioGroup,
  Spinner,
} from "@chakra-ui/react";

export default function Login() {
  // useState and function to show password field text
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  // useState and function to toggle between login and sign up
  const [signUp, setSignUp] = useState(false);
  const handleSignUp = () => setSignUp(!signUp);

  // useStates and fuctions for login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { login, register } = useAuth();
  const [error, setError] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [role, setRole] = useState("candidate");

  const [isLoading, setIsLoading] = useState(false);

  // Email validation
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Password validation
  const validatePassword = (password: string) => {
    // This is the Microsoft standard for passwords
    // <= 1 uppercase
    const hasUpperCase = /[A-Z]/.test(password);
    // <= 1 lowercase
    const hasLowerCase = /[a-z]/.test(password);
    // <= 1 number
    const hasNumber = /\d/.test(password);
    // >= 8 characters
    const isLongEnough = password.length >= 8;
    // <= 1 symbol
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      hasUpperCase && hasLowerCase && hasNumber && isLongEnough && hasSymbol
    );
  };

  // Toast for error/success messages
  const toast = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // If the email isn't valid, there's no point trying to login
    try {
      if (!validateEmail(email)) {
        setError("Input valid email.");
      }

      // success will become a boolean which we can then use to display toasts to the user
      // setting the user etc. is all handled in the context
      const success = await login(email, password);

      if (success) {
        // If the login is successful, we know the context has set the current user to the logged in user
        // We can then grab the user data from localStorage and display a success toast
        const userData = JSON.parse(
          localStorage.getItem("currentUser") || "{}"
        );
        const user = userData as { firstName: string; lastName: string };
        toast({
          title: "Login successful",
          description: `Welcome back to TeamTeach, ${user?.firstName} ${user?.lastName}!`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          status: "error",
          colorScheme: "red",
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.";
      toast({
        title: "Login failed",
        description: errorMessage,
        status: "error",
        colorScheme: "red",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // First, if the inputted passwords don't match, we want to display an error toast
      if (password != confirmPassword) {
        toast({
          title: "Sign up failed",
          description: "Passwords must match",
          status: "error",
          colorScheme: "red",
          duration: 9000,
          isClosable: true,
        });
        return;
      }
      // If the password doesn't meet the requirements, we want to display an error toast
      if (!validatePassword(password)) {
        toast({
          title: "Sign up failed",
          description: "Use a stronger password",
          status: "error",
          colorScheme: "red",
          duration: 9000,
          isClosable: true,
        });
        return;
      }

      // If the email isn't valid, we want to display an error toast
      if (!validateEmail(email)) {
        toast({
          title: "Sign up failed",
          description: "Input valid email.",
          status: "error",
          colorScheme: "red",
          duration: 9000,
          isClosable: true,
        });
        return;
      }

      // Now that we have done all validation, we can put the user data together in the format expected by backend
      const userData = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password,
        role: role as "candidate" | "lecturer",
      };
      // success will become a boolean which we can then use to display toasts to the user
      const success = await register(userData);

      // If the registration is successful, we know the context has set the current user to the logged in user
      if (success) {
        const userData = JSON.parse(
          localStorage.getItem("currentUser") || "{}"
        );
        const user = userData as { firstName: string; lastName: string };
        toast({
          title: "Sign up successful",
          description: `Welcome to TeamTeach, ${user?.firstName} ${user?.lastName}!`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Sign up failed",
          description: "Invalid email or password",
          status: "error",
          colorScheme: "red",
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.";
      toast({
        title: "Sign up failed",
        description: errorMessage,
        status: "error",
        colorScheme: "red",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If the backend is working on logging in/registering user then we want to let the user know
  if (isLoading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box>
      <VStack as="header" spacing={6} marginTop={50} marginBottom={25}>
        <Image
          src="/teamteach.png"
          maxWidth="325px"
          alt="TeamTeach logo"
        ></Image>
        <Heading as="h1" size="xl">
          {signUp ? "Sign up to TeachTeam" : "Sign in to TeachTeam"}
        </Heading>
      </VStack>
      <Center>
        {!signUp ? (
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
                    <FormControl
                      isInvalid={!validateEmail(email) && email != ""}
                    >
                      <FormLabel htmlFor="email" fontSize="lg" fontWeight={600}>
                        Email address
                      </FormLabel>
                      <Input
                        onChange={(e) => setEmail(e.target.value)}
                        bg="white"
                        type="text"
                        placeholder="Enter your email"
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
                    <FormControl
                      isInvalid={!validatePassword(password) && password != ""}
                    >
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
            <Card variant="unstyled" maxWidth={400}>
              <CardBody>
                <Stack spacing={3}>
                  <HStack>
                    <Text fontWeight={650}>Don&apos;t have an account?</Text>
                    <Button
                      colorScheme="blue"
                      variant="outline"
                      width="150px"
                      onClick={handleSignUp}
                    >
                      Sign up
                    </Button>
                  </HStack>
                </Stack>
              </CardBody>
            </Card>
          </Stack>
        ) : (
          <Stack spacing={3}>
            <Card variant="unstyled" maxWidth={400} bg="#f7f7f7">
              <form onSubmit={handleRegister}>
                <Stack spacing={3} padding={3}>
                  <Card
                    bg="#f7f7f7"
                    variant="unstyled"
                    borderColor="#e8e8e8"
                    padding={4}
                    maxWidth={400}
                  >
                    <FormControl isRequired>
                      <FormLabel htmlFor="role" fontSize="lg" fontWeight={600}>
                        I am a:
                      </FormLabel>
                      <HStack spacing={4}>
                        <RadioGroup onChange={setRole} value={role}>
                          <Stack direction="row">
                            <Radio value="candidate">Candidate</Radio>
                            <Radio value="lecturer">Lecturer</Radio>
                          </Stack>
                        </RadioGroup>
                      </HStack>
                    </FormControl>
                  </Card>
                  <Card
                    bg="#f7f7f7"
                    variant="unstyled"
                    borderColor="#e8e8e8"
                    padding={4}
                    maxWidth={400}
                  >
                    <FormControl isRequired>
                      <FormLabel htmlFor="name" fontSize="lg" fontWeight={600}>
                        First name
                      </FormLabel>
                      <Input
                        onChange={(e) => setFirstName(e.target.value)}
                        bg="white"
                        type="text"
                        placeholder="Enter your first name"
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
                    <FormControl isRequired>
                      <FormLabel htmlFor="name" fontSize="lg" fontWeight={600}>
                        Last name
                      </FormLabel>
                      <Input
                        onChange={(e) => setLastName(e.target.value)}
                        bg="white"
                        type="text"
                        placeholder="Enter your last name"
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
                    <FormControl
                      isRequired
                      isInvalid={!validateEmail(email) && email != ""}
                    >
                      <FormLabel htmlFor="email" fontSize="lg" fontWeight={600}>
                        Email address
                      </FormLabel>
                      <Input
                        onChange={(e) => setEmail(e.target.value)}
                        bg="white"
                        type="text"
                        placeholder="Enter your email"
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
                    <FormControl isRequired>
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
                  <Card
                    bg="#f7f7f7"
                    variant="unstyled"
                    borderColor="#e8e8e8"
                    padding={4}
                    maxWidth={400}
                  >
                    <FormControl isRequired>
                      <FormLabel
                        htmlFor="confirmpassword"
                        fontSize="lg"
                        fontWeight={600}
                      >
                        Confirm Password
                      </FormLabel>
                      <InputGroup size="md">
                        <Input
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          bg="white"
                          type={show ? "text" : "password"}
                          placeholder="Confirm your password"
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
                  <Button type="submit" colorScheme="blue" width="stretch">
                    Sign Up
                  </Button>
                </Box>
              </form>
            </Card>
            <Card variant="unstyled" maxWidth={400}>
              <CardBody>
                <Stack spacing={3}>
                  <HStack>
                    <Text fontWeight={650}>Already have an account?</Text>
                    <Button
                      colorScheme="blue"
                      variant="outline"
                      width="150px"
                      onClick={handleSignUp}
                    >
                      Sign in
                    </Button>
                  </HStack>
                </Stack>
              </CardBody>
            </Card>
          </Stack>
        )}
      </Center>
    </Box>
  );
}

import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/UserContext";
import {
  candidateAPI,
  CandidateResponse,
  lecturerAPI,
  LecturerResponse,
} from "@/services/api";
import {
  Box,
  Center,
  Text,
  useToast,
  VStack,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Badge,
  Spinner,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from "@chakra-ui/react";

export default function Profile() {
  // Grabbing user context
  const { user } = useAuth();

  // useState for userType and profileData
  const [userType, setUserType] = useState("");
  const [profileData, setProfileData] = useState<
    CandidateResponse | LecturerResponse
  >();

  // useState for loading state
  const [loading, setLoading] = useState(true);

  // Toast for user feedback
  const toast = useToast();

  // useEffect to fetch profile data based on user role on mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        // If the user is a candidate, we want to fetch the candidate data
        if (user?.role === "candidate") {
          setUserType("candidate");
          const data = await candidateAPI.getCandidate(user.email);
          setProfileData(data);
          // If the user is a lecturer, we want to fetch the lecturer data
        } else if (user?.role === "lecturer") {
          setUserType("lecturer");
          const data = await lecturerAPI.getLecturer(user.email);
          setProfileData(data);
        }
        setLoading(false);
      } catch (error: unknown) {
        setLoading(false);
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to fetch profile data",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };
    fetchProfileData();
    // We only want to re-run this effect if the user changes
  }, [user, toast]);

  // This is just a fallback to ensure that nothing weird happens if the user is not logged in (they shouldn't be able to access this page anyway)
  const displayUser = profileData || user;

  if (loading) {
    return (
      <Box textAlign="center" marginTop="50px">
        <Spinner size="xl" color="blue.500" />
        <Text fontSize="xl" marginTop="20px">
          Loading profile...
        </Text>
      </Box>
    );
  }

  if (!displayUser) {
    return (
      <Box textAlign="center" marginTop="50px">
        <Heading as="h2" size="lg" color="red.500">
          Profile not found
        </Heading>
        <Text color="gray.600">Please check your login credentials.</Text>
      </Box>
    );
  }

  return (
    <>
      <Box
        marginTop="40px"
        marginLeft="40px"
        marginRight="40px"
        marginBottom="150px"
      >
        <VStack spacing={6} align="stretch">
          <Center>
            <Card width="50%" variant="outline" bg="#f7f7f7">
              <CardBody>
                <VStack spacing={2}>
                  <Text fontSize="2xl" fontWeight="bold">
                    {displayUser.firstName} {displayUser.lastName}
                  </Text>
                  <Badge
                    colorScheme={userType === "candidate" ? "green" : "blue"}
                    fontSize="md"
                    px={3}
                    py={1}
                    borderRadius="full"
                    textTransform="capitalize"
                  >
                    {userType}
                  </Badge>
                </VStack>
              </CardBody>
            </Card>
          </Center>

          <Card variant="outline" bg="#f7f7f7">
            <CardHeader>
              <Heading as="h3" size="md">
                Personal Information
              </Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <VStack align="start" spacing={3}>
                  <Box>
                    <Text fontWeight="semibold" color="gray.600">
                      Email Address
                    </Text>
                    <Text fontSize="lg">{displayUser.email}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="semibold" color="gray.600">
                      First Name
                    </Text>
                    <Text fontSize="lg">{displayUser.firstName}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="semibold" color="gray.600">
                      Last Name
                    </Text>
                    <Text fontSize="lg">{displayUser.lastName}</Text>
                  </Box>
                </VStack>
                <VStack align="start" spacing={3}>
                  <Box>
                    <Text fontWeight="semibold" color="gray.600">
                      Account Type
                    </Text>
                    <Text fontSize="lg" textTransform="capitalize">
                      {userType}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontWeight="semibold" color="gray.600">
                      Date Joined
                    </Text>
                    <Text fontSize="lg">
                      {new Date(displayUser.dateCreated).toLocaleDateString(
                        "en-AU",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontWeight="semibold" color="gray.600">
                      Member Since
                    </Text>
                    <Text fontSize="lg">
                      {Math.floor(
                        (new Date().getTime() -
                          new Date(displayUser.dateCreated).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days
                    </Text>
                  </Box>
                </VStack>
              </SimpleGrid>
            </CardBody>
          </Card>

          {userType === "candidate" && "timesAccepted" in displayUser && (
            <Card variant="outline" bg="#f7f7f7">
              <CardHeader>
                <Heading as="h3" size="md">
                  Application Statistics
                </Heading>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                  <Stat>
                    <StatLabel>Times Accepted</StatLabel>
                    <StatNumber>{displayUser.timesAccepted}</StatNumber>
                    <StatHelpText>Total applications accepted</StatHelpText>
                  </Stat>
                  <Stat>
                    <StatLabel>Current Rating</StatLabel>
                    <StatNumber>
                      {displayUser.rating && displayUser.rating > 0
                        ? displayUser.rating.toFixed(2)
                        : "Not rated"}
                    </StatNumber>
                    <StatHelpText>
                      {displayUser.rating && displayUser.rating > 0
                        ? "Average performance rating (lower is better)"
                        : "No ratings yet"}
                    </StatHelpText>
                  </Stat>
                  <Stat>
                    <StatLabel>Account Status</StatLabel>
                    <StatNumber>
                      <Badge
                        colorScheme={displayUser.isBlocked ? "red" : "green"}
                      >
                        {displayUser.isBlocked ? "Blocked" : "Active"}
                      </Badge>
                    </StatNumber>
                    <StatHelpText>Current account status</StatHelpText>
                  </Stat>
                </SimpleGrid>
              </CardBody>
            </Card>
          )}

          {userType === "lecturer" && "assignedCourseCodes" in displayUser && (
            <Card variant="outline" bg="#f7f7f7">
              <CardHeader>
                <Heading as="h3" size="md">
                  Teaching Information
                </Heading>
              </CardHeader>
              <CardBody>
                <VStack align="start" spacing={3}>
                  <Box>
                    <Text fontWeight="semibold" color="gray.600">
                      Assigned Courses
                    </Text>
                    {displayUser.assignedCourseCodes ? (
                      <Box display="flex" flexWrap="wrap" gap={2}>
                        {displayUser.assignedCourseCodes
                          .split(",")
                          .map((course, index) => (
                            <Badge
                              key={index}
                              colorScheme="blue"
                              variant="solid"
                              px={3}
                              py={2}
                              borderRadius="md"
                              textAlign="center"
                              whiteSpace="nowrap"
                            >
                              {course.trim()}
                            </Badge>
                          ))}
                      </Box>
                    ) : (
                      <Text fontSize="lg" color="gray.500" fontStyle="italic">
                        No courses assigned
                      </Text>
                    )}
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          )}
        </VStack>
      </Box>
    </>
  );
}

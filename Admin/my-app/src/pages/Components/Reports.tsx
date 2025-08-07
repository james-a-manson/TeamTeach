import React, { useState, useEffect } from "react";
import {
  VStack,
  Heading,
  Text,
  Card,
  CardHeader,
  CardBody,
  HStack,
  Button,
  SimpleGrid,
  Badge,
} from "@chakra-ui/react";

import {
  applicationService,
  candidateService,
  courseService,
} from "@/services/api";
import { ApplicationResponse, CandidateResponse } from "@/services/api-types";

interface Course {
  courseCode: string;
  courseName: string;
}

export default function Reports() {
  // Toggle between report tabs
  const [currentTab, setCurrentTab] = useState<string>("chosen");

  const tabs = [
    {
      label: "Candidates chosen for each course",
      id: "chosen",
      color: "blue",
    },
    {
      label: "Candidates chosen for more than three courses",
      id: "chosen-three",
      color: "blue",
    },
    {
      label: "Candidates that have not been chosen",
      id: "not-chosen",
      color: "blue",
    },
  ];

  // Toast for notifications

  // Data states
  const [courses, setCourses] = useState<Course[]>([]);
  const [candidates, setCandidates] = useState<CandidateResponse[]>([]);
  const [applications, setApplications] = useState<ApplicationResponse[]>([]);

  useEffect(() => {
    // Dummy code until backend starts working
    fetchApplications();
    fetchCandidates();
    fetchCourses();
  }, []);

  // function to fetch all the applications
  const fetchApplications = async () => {
    try {
      const apps = await applicationService.getAllApplications();

      if (!apps) {
        console.log("Applications not found in Reports.tsx");
        return;
      }

      setApplications(apps);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCandidates = async () => {
    try {
      const foundCandidates = await candidateService.getAllCandidates();

      if (!foundCandidates) {
        console.log("No candidates found in fetchCandidates");
        return;
      }

      setCandidates(foundCandidates);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCourses = async () => {
    try {
      const foundCourses = await courseService.getAllCourses();
      if (!foundCourses) {
        console.log("No courses found in fetchCourses");
        return;
      }
      setCourses(foundCourses);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("applications: ", applications);
  }, [applications]);

  useEffect(() => {
    console.log("candidates: ", candidates);
  }, [candidates]);

  // function to sort the accepted applications into a map
  const getAcceptedCandidatedPerCourse = () => {
    if (!applications) {
      console.log("There are no applications to map");
      return {};
    }

    // make a map to store the course and emails of who was accepted
    const courseMap: { [courseCode: string]: string[] } = {};

    applications.forEach((app) => {
      // if accepted, save to the map
      if (app.status === "accepted") {
        const code = app.courseCode;
        const email = app.candidateEmail;

        if (!courseMap[code]) {
          courseMap[code] = [];
        }
        // only add the email if it isn't already there
        if (!courseMap[code].includes(email)) {
          courseMap[code].push(email);
        }
      }
    });

    return courseMap;
  };

  const getCandidatesWithThreeOrMoreAccepted = () => {
    const acceptedApplications: { [email: string]: number } = {};

    applications.forEach((app) => {
      if (app.status === "accepted") {
        const email = app.candidateEmail;
        // add one to the stored number, and if there is no stored number, make it zero
        acceptedApplications[email] = (acceptedApplications[email] || 0) + 1;
      }
    });

    return candidates.filter(
      (candidate) => (acceptedApplications[candidate.email] || 0) >= 3
    );
  };

  const getNotAcceptedCandidates = () => {
    const acceptedApplications: { [email: string]: number } = {};

    applications.forEach((app) => {
      if (app.status === "accepted") {
        const email = app.candidateEmail;
        // add one to the stored number, and if there is no stored number, make it zero
        acceptedApplications[email] = (acceptedApplications[email] || 0) + 1;
      }
    });

    return candidates.filter(
      (candidate) => (acceptedApplications[candidate.email] || 0) == 0
    );
  };

  return (
    <VStack spacing={4} marginBottom="10">
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} padding={4}>
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            colorScheme={currentTab === tab.id ? tab.color : "gray"}
            variant={currentTab === tab.id ? "solid" : "outline"}
            size="md"
            width="100%"
            onClick={() => setCurrentTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </SimpleGrid>

      <Card variant="outline" padding={4}>
        <CardHeader bg="f7f7f7">
          <Heading size="md" color="gray.700">
            {currentTab === "chosen"
              ? "Candidates chosen for each course"
              : currentTab === "chosen-three"
              ? "Candidates chosen for more than three courses"
              : "Candidates that have not been chosen"}
          </Heading>
        </CardHeader>
        <CardBody>
          {currentTab === "chosen" && (
            <>
              {Object.entries(getAcceptedCandidatedPerCourse()).map(
                ([courseCode, emails]) => (
                  <Card
                    key={courseCode}
                    variant="outline"
                    bg="blue.50"
                    marginBottom={4}
                    _hover={{
                      boxShadow: "lg",
                      transform: "scale(1.02)",
                    }}
                    transition="all 0.2s"
                  >
                    <CardHeader padding={2}>
                      <HStack justify="space-between" align="center">
                        <VStack align="start">
                          <Heading size="md" color="blue.700">
                            {courseCode}
                          </Heading>
                          <Text fontSize="sm" color="gray.600">
                            {courses.find((c) => c.courseCode === courseCode)
                              ?.courseName || "Unknown Course"}
                          </Text>
                        </VStack>
                        <Badge colorScheme="blue" fontSize="md" variant="solid">
                          {emails.length} Candidate
                          {emails.length !== 1 ? "s" : ""}
                        </Badge>
                      </HStack>
                    </CardHeader>
                    <CardBody>
                      <VStack align="start">
                        {emails.map((email) => (
                          <Text key={email} fontSize="sm" color="gray.700">
                            {candidates.find((c) => c.email === email)
                              ? `${
                                  candidates.find((c) => c.email === email)
                                    ?.firstName
                                } ${
                                  candidates.find((c) => c.email === email)
                                    ?.lastName
                                }`
                              : "Unknown Candidate"}
                          </Text>
                        ))}
                      </VStack>
                    </CardBody>
                  </Card>
                )
              )}
            </>
          )}
          {currentTab === "chosen-three" && (
            <VStack align="center" spacing={1} width="100%">
              {getCandidatesWithThreeOrMoreAccepted().length > 0 ? (
                getCandidatesWithThreeOrMoreAccepted().map((candidate) => (
                  <Card
                    key={candidate.email}
                    variant="outline"
                    bg="blue.50"
                    width="100%"
                    marginBottom={4}
                    _hover={{
                      boxShadow: "lg",
                      transform: "scale(1.02)",
                    }}
                    transition="all 0.2s"
                  >
                    <CardHeader padding={2}>
                      <VStack align="start">
                        <Heading size="md" color="blue.700">
                          {candidate.firstName} {candidate.lastName}
                        </Heading>
                        <Text fontSize="sm" color="gray.600">
                          {candidate.email}
                        </Text>
                      </VStack>
                    </CardHeader>
                    <CardBody>
                      <VStack align="start" justifyContent="space-between">
                        <Badge colorScheme="blue" fontSize="md" variant="solid">
                          {candidate.timesAccepted} Course
                          {candidate.timesAccepted !== 1 ? "s" : ""}
                        </Badge>
                      </VStack>
                    </CardBody>
                  </Card>
                ))
              ) : (
                <Text color="gray.500">
                  No candidates have been chosen for more than three courses.
                </Text>
              )}
            </VStack>
          )}
          {currentTab === "not-chosen" && (
            <VStack align="start" spacing={1}>
              {getNotAcceptedCandidates().length > 0 ? (
                getNotAcceptedCandidates().map((candidate) => (
                  <Card
                    key={candidate.email}
                    variant="outline"
                    bg="blue.50"
                    width="100%"
                    marginBottom={4}
                    _hover={{
                      boxShadow: "lg",
                      transform: "scale(1.02)",
                    }}
                    transition="all 0.2s"
                  >
                    <CardHeader padding={2}>
                      <VStack align="start">
                        <Heading size="md" color="blue.700">
                          {candidate.firstName} {candidate.lastName}
                        </Heading>
                      </VStack>
                    </CardHeader>
                    <CardBody>
                      <VStack align="start" justifyContent="space-between">
                        <Text fontSize="sm" color="gray.600">
                          {candidate.email}
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                ))
              ) : (
                <Text color="gray.500">
                  All candidates have been accepted for at least one course
                </Text>
              )}
            </VStack>
          )}
        </CardBody>
      </Card>
    </VStack>
  );
}

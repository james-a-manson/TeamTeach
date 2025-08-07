import React from "react";
import { useState, useEffect } from "react";
import { candidateAPI, CandidateResponse } from "@/services/api";
import {
  Box,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Spinner,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from "@chakra-ui/react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
// Chart.js needs us to register the chart elements before they can be used
ChartJS.register(ArcElement, Tooltip, Legend);
import { useToast } from "@chakra-ui/react";

interface StatisticsData {
  mostChosen: CandidateResponse | null;
  leastChosen: CandidateResponse | null;
  notChosen: CandidateResponse[];
  allCandidates: CandidateResponse[];
}

export default function LecturerStatistics() {
  // Statistics data
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);

  // Loading state
  const [loading, setLoading] = useState<boolean>(true);

  // Toast for user feedback
  const toast = useToast();

  // On mount, we want to fetch the statistics data
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        // Set loading to true while fetching data
        setLoading(true);
        // Fetch statistics from the API
        const data = await candidateAPI.getStatistics();
        // Set the statistics data
        setStatistics(data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
        toast({
          title: "Error",
          description: "Failed to fetch statistics. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [toast]);

  // If the statistics are still loading, we show a spinner
  if (loading) {
    return (
      <Box textAlign="center">
        <Spinner size="xl" />
        <Text marginTop="20px">Loading statistics...</Text>
      </Box>
    );
  }

  // If there are no statistics or no chosen candidates, we show a message
  if (!statistics || statistics.allCandidates.length === 0) {
    return (
      <Box textAlign="center" marginTop="40px">
        <Heading as="h1">No Statistics Available</Heading>
        <Text marginTop="20px">
          No applicants have been chosen yet or there are no candidates in the
          system.
        </Text>
      </Box>
    );
  }

  // Destructure the statistics data
  const { mostChosen, leastChosen, notChosen, allCandidates } = statistics;
  const chosenCount = allCandidates.filter(
    (candidate) => candidate.timesAccepted > 0
  ).length;

  return (
    <Box padding="8" maxWidth="1400px" mx="auto" paddingBottom="150px">
      <VStack spacing={4} marginBottom={4}>
        <Heading as="h1" size="xl" textAlign="center">
          Lecturer Statistics Dashboard
        </Heading>
        <Text fontSize="lg" textAlign="center" marginBottom={4}>
          Overview of candidate selection statistics
        </Text>
      </VStack>
      <SimpleGrid
        columns={{ base: 1, lg: 2 }}
        spacing={8}
        width="100%"
        marginBottom="8"
      >
        <Card
          borderRadius="xl"
          boxShadow="xl"
          bgGradient="linear(to-br, yellow.50, orange.100)"
          border="2px solid"
          borderColor="yellow.200"
        >
          <CardHeader>
            <Heading size="md" color="yellow.900">
              Most Chosen Candidate
            </Heading>
          </CardHeader>
          <CardBody>
            {mostChosen && mostChosen.timesAccepted > 0 ? (
              <VStack align="start" spacing={2}>
                <Text fontSize="xl" fontWeight="bold" color="yellow.900">
                  {mostChosen.firstName} {mostChosen.lastName}
                </Text>
                <HStack width="100%">
                  <Text fontSize="md" color="yellow.800">
                    Times Chosen
                  </Text>
                  <Badge colorScheme="yellow">{mostChosen.timesAccepted}</Badge>
                </HStack>
              </VStack>
            ) : (
              <Text color="yellow.800">
                No candidates have been chosen yet.
              </Text>
            )}
          </CardBody>
        </Card>
        <Card
          borderRadius="xl"
          boxShadow="xl"
          bgGradient="linear(to-br, blue.50, blue.100)"
          border="2px solid"
          borderColor="blue.100"
        >
          <CardHeader>
            <Heading size="md" color="blue.800">
              Least Chosen Candidate
            </Heading>
          </CardHeader>
          <CardBody>
            {leastChosen ? (
              <VStack align="start" spacing={2}>
                <Text fontSize="xl" fontWeight="bold" color="blue.900">
                  {leastChosen.firstName} {leastChosen.lastName}
                </Text>
                <HStack width="100%">
                  <Text fontSize="md" color="blue.800">
                    Times Chosen
                  </Text>
                  <Badge colorScheme="blue">{leastChosen.timesAccepted}</Badge>
                </HStack>
              </VStack>
            ) : (
              <Text color="blue.800">
                All candidates have an equal number of selections.
              </Text>
            )}
          </CardBody>
        </Card>
      </SimpleGrid>
      <Card
        borderRadius="xl"
        boxShadow="xl"
        bgGradient="linear(to-br, gray.50, gray.100)"
        border="2px solid"
        borderColor="gray.200"
        marginBottom="8"
      >
        <CardHeader>
          <HStack justify="space-between" align="center">
            <Heading size="md" color="gray.800">
              Candidates Not Chosen
            </Heading>
            <Badge colorScheme="gray" fontSize="md">
              {notChosen.length} candidates
            </Badge>
          </HStack>
        </CardHeader>
        <CardBody>
          {notChosen.length > 0 ? (
            <VStack spacing="3" align="stretch">
              <Box
                maxHeight="250px"
                overflowY="auto"
                border="1px solid"
                borderColor="gray.200"
                background="white"
                padding="2"
              >
                <VStack spacing="2" align="stretch">
                  {notChosen.map((candidate) => (
                    <HStack
                      key={candidate.email}
                      justify="space-between"
                      padding="2"
                      borderRadius="md"
                      _hover={{ backgroundColor: "gray.100" }}
                    >
                      <Text fontSize="sm">
                        {candidate.firstName} {candidate.lastName}
                      </Text>
                      <Badge colorScheme="gray">
                        {candidate.timesAccepted} times
                      </Badge>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            </VStack>
          ) : (
            <Text fontSize="lg" fontWeight="bold">
              All candidates have been chosen at least once.
            </Text>
          )}
        </CardBody>
      </Card>
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} width="100%">
        <Stat padding={6} borderRadius="xl" boxShadow="lg">
          <StatLabel fontSize="sm">Total Candidates</StatLabel>
          <StatNumber fontSize="2xl">{allCandidates.length}</StatNumber>
          <StatHelpText>Total number of candidates in the system.</StatHelpText>
        </Stat>
        <Stat padding={6} borderRadius="xl" boxShadow="lg">
          <StatLabel fontSize="sm">Chosen Candidates</StatLabel>
          <StatNumber fontSize="2xl">{chosenCount}</StatNumber>
          <StatHelpText>
            Total number of candidates that have been chosen.
          </StatHelpText>
        </Stat>
        <Stat padding={6} borderRadius="xl" boxShadow="lg">
          <StatLabel fontSize="sm">Candidates Not Chosen</StatLabel>
          <StatNumber fontSize="2xl">{notChosen.length}</StatNumber>
          <StatHelpText>
            Total number of candidates that have not been chosen.
          </StatHelpText>
        </Stat>
        <Stat padding={6} borderRadius="xl" boxShadow="lg">
          <StatLabel fontSize="sm">Percentage candidates chosen</StatLabel>
          <StatNumber fontSize="2xl">
            {((chosenCount / allCandidates.length) * 100).toFixed(2)}%
          </StatNumber>
          <StatHelpText>
            Percentage of candidates that have been chosen.
          </StatHelpText>
        </Stat>
      </SimpleGrid>
      <Box marginTop="8" width="100%" textAlign="center">
        <Heading size="lg" color="gray.800" marginBottom="6">
          Candidate Selection Distribution
        </Heading>
        <Box
          height="400px"
          maxWidth="500px"
          marginLeft="auto"
          marginRight="auto"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {allCandidates.length > 0 ? (
            <Doughnut
              data={{
                labels: ["Chosen Candidates", "Not Chosen"],
                datasets: [
                  {
                    // This is the actual data that we want to display, which is chosen vs not chosen
                    data: [chosenCount, notChosen.length],
                    // Colors for the chart
                    backgroundColor: [
                      "rgba(72, 187, 120, 0.8)",
                      "rgba(237, 137, 54, 0.8)",
                    ],
                    // Border colors for the chart
                    borderColor: [
                      "rgba(56, 161, 105, 1)",
                      "rgba(221, 107, 32, 1)",
                    ],
                    borderWidth: 3,
                    // Hover effects for the chart
                    hoverBackgroundColor: [
                      "rgba(72, 187, 120, 1)",
                      "rgba(237, 137, 54, 1)",
                    ],
                  },
                ],
              }}
              // This is all the chart config settings
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  // Legend config which will show the labels at the bottom of the chart with size 16 font and padding
                  legend: {
                    position: "bottom",
                    labels: {
                      padding: 20,
                      usePointStyle: true,
                      font: {
                        size: 16,
                      },
                    },
                  },
                  // Tooltips config which will show the label and percentage of each section when hovered over
                  tooltip: {
                    callbacks: {
                      // These labels will show both the count and percentage of each section
                      label: function (context) {
                        const total = context.dataset.data.reduce(
                          (a, b) => a + b,
                          0
                        );
                        // Just calculating the percentage and rounding
                        const percentage = (
                          (context.parsed / total) *
                          100
                        ).toFixed(1);
                        // Formatting the tooltip
                        return `${context.label}: ${context.parsed} candidates (${percentage}%)`;
                      },
                    },
                  },
                },
              }}
            />
          ) : (
            <Box paddingY="10">
              <Text fontSize="lg" color="gray.500">
                No data available for visualization
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

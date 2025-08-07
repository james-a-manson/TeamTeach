import React, { useState, useEffect, useCallback } from "react";
import {
  VStack,
  Heading,
  Card,
  CardHeader,
  CardBody,
  HStack,
  Button,
  SimpleGrid,
  FormControl,
  FormLabel,
  Select,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { CandidateResponse } from "@/services/api-types";
import { candidateService } from "@/services/api";

export default function CandidateEdit() {
  // Toast for notifications
  const toast = useToast();

  // Form states
  const [selectedCandidate, setSelectedCandidate] =
    useState<CandidateResponse>();
  const [isBlocked, setIsBlocked] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);

  const [candidates, setCandidates] = useState<CandidateResponse[]>([]);

  useEffect(() => {
    if (selectedCandidate) {
      setIsBlocked(!selectedCandidate.isBlocked);
    }
  }, [selectedCandidate]);

  // Form handling
  const handleEditCandidate = async () => {
    if (!selectedCandidate) {
      toast({
        title: "Missing fields",
        description: "Please select a candidate to edit.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    try {
      setLoading(true);
      const updatedCandidate = await candidateService.toggleCandidateBlocked(
        selectedCandidate.email,
        isBlocked
      );
      setSelectedCandidate(updatedCandidate);
      toast({
        title: "Success",
        description: `Candidate ${
          isBlocked ? "blocked" : "unblocked"
        } successfully.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to update candidate status.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    try {
      const data = await candidateService.getAllCandidates();
      setCandidates(data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast({
        title: "Error",
        description: "Failed to fetch candidates.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  return (
    <VStack spacing={4}>
      <SimpleGrid columns={{ base: 1 }} spacing={4} padding={4}>
        <Button colorScheme="blue" variant="solid" size="md">
          Manage candidates
        </Button>
      </SimpleGrid>

      <Card variant="outline">
        <CardHeader bg="f7f7f7">
          <Heading size="md" color="gray.700">
            Block/unblock candidates
          </Heading>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} padding={5}>
            <FormControl isRequired gridColumn={{ md: "span 2" }}>
              <FormLabel fontWeight="bold" color="gray.700">
                Candidate Email
              </FormLabel>
              <Select
                placeholder="Select candidate"
                onChange={(e) => {
                  const candidate = candidates.find(
                    (c) => c.email === e.target.value
                  );
                  setSelectedCandidate(candidate);
                }}
              >
                {candidates.map((candidate) => (
                  <option key={candidate.email} value={candidate.email}>
                    {candidate.firstName} {candidate.lastName} -{" "}
                    {candidate.email}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontWeight="bold" color="gray.700">
                Update Candidate Status
              </FormLabel>
              <RadioGroup
                onChange={(value) => setIsBlocked(value === "true")}
                value={isBlocked ? "true" : "false"}
              >
                <HStack spacing={4}>
                  {selectedCandidate?.isBlocked ? (
                    <Radio value="false" colorScheme="green">
                      Unblock
                    </Radio>
                  ) : (
                    <Radio value="true" colorScheme="red">
                      Block
                    </Radio>
                  )}
                </HStack>
              </RadioGroup>
            </FormControl>

            <Button
              colorScheme="blue"
              size="md"
              width="100%"
              onClick={handleEditCandidate}
              isLoading={loading}
            >
              Edit Candidate
            </Button>
          </SimpleGrid>
        </CardBody>
      </Card>
    </VStack>
  );
}

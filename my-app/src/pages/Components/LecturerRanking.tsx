import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/UserContext";
import {
  Text,
  Input,
  VStack,
  Card,
  Select,
  Button,
  useToast,
  InputLeftAddon,
  InputGroup,
  Box,
  Heading,
  Center,
} from "@chakra-ui/react";

import {
  applicationAPI,
  ApplicationResponse,
  candidateAPI,
  CandidateResponse,
} from "@/services/api";

type LecturerRankingProps = {
  applications: ApplicationResponse[];
};

export default function LecturerRanking({
  applications,
}: LecturerRankingProps) {
  const { user } = useAuth();
  const [selectedApplications, setSelectedApplications] = useState<
    ApplicationResponse[]
  >([]);

  // useState to manage the rankings of applications
  // the typing is a dictionary to associate the courseID with the rating
  const [rankings, setrankings] = useState<{ [applicationID: number]: number }>(
    {}
  );

  // dictionary for comments
  const [comments, setComments] = useState<{ [applicationID: number]: string }>(
    {}
  );

  const toast = useToast();

  // goes through all the applications and sets selectedApplications
  useEffect(() => {
    // Safe guard against null applications
    if (!applications || !Array.isArray(applications)) {
      setSelectedApplications([]);
      return;
    }
    const selectedApplications: ApplicationResponse[] = [];
    applications.forEach((application) => {
      // if the application is accepted and hasn't already been ranked by the logged in lecturer
      if (application.status == "accepted") {
        if (user !== null && !application.rankedBy.includes(user?.email)) {
          selectedApplications.push(application);
        } else {
          console.log("APPLICATION ALREADY RANKED:", application.applicationId);
        }
      }
    });

    console.log("SELECTED APPLICATIONS: ", selectedApplications);
    setSelectedApplications(selectedApplications);
  }, [user, applications]);

  // const [candidates, setCandidates] = useState<CandidateResponse[]>([]);
  // // use effect to grab all users
  // useEffect(() => {

  //   const fetchCandidates = async () => {
  //     try {
  //       const foundUsers = await candidateAPI.getAllCandidates();
  //       setCandidates(foundUsers)

  //     } catch (error) {
  //       console.log(`Error fetching all candidates`)
  //     }
  //   }

  //   fetchCandidates();

  // }, [])

  // function to generate the ranking numbers for the applications
  const generateNumbering = () => {
    const options = [];

    for (let i = 1; i <= selectedApplications.length; i++) {
      options.push(
        <option value={i} key={i}>
          {i}
        </option>
      );
    }

    return options;
  };

  // updates the rankings dictionary with the application id and the ranking it receives
  const handleRankingChange = (applicationID: number, ranking: number) => {
    setrankings((prev) => ({
      ...prev,
      [applicationID]: ranking,
    }));
  };

  // updates the comments dictionary with the applicationID and comment left by the lecturer
  const handleCommentChange = (applicationID: number, comment: string) => {
    setComments((prev) => ({
      ...prev,
      [applicationID]: comment,
    }));
  };

  // DEBUG useEffect for handleRankingChange
  useEffect(() => {
    console.log("RANKINGS: ", rankings);
  }, [rankings]);

  const handleFormSubmit = (e: React.FormEvent) => {
    // if there is nothing to rank
    if (selectedApplications.length === 0) {
      toast({
        title: "There is nothing to rank",
        description: "Please accept an application on the previous page.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    e.preventDefault();

    console.log("SELECTED APPLICATIONS: ", selectedApplications);

    // convert the dictionary to a set
    // because sets dont allow duplicates, we can see if there are duplicate ranks
    const temp = Object.values(rankings);
    const uniqueApplications = new Set(temp);

    if (uniqueApplications.size !== temp.length) {
      console.log("DUPLICATE RANKS FOUND!!!");

      toast({
        title: "Duplicate rankings",
        description: "Please ensure that each number is used only ONCE.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });

      return;
    }

    const foundCandidates = new Set<CandidateResponse>();

    try {
      for (const app of selectedApplications) {
        if (foundCandidates.has(app.candidate)) {
          console.log("Duplicate user found");

          candidateAPI.updateCandidateRating(
            app.candidate.email,
            rankings[app.applicationId]
          );
          if (user?.email) {
            applicationAPI.updateApplicationFeedback(
              app.applicationId,
              user?.email,
              comments[app.applicationId]
            );
          } else {
            toast({
              title: "User email missing",
              description: "Cannot update ranking without a valid user email.",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }

          // GET THE COMMENTS AND UDPATE CANDIDATE
        } else {
          // use api to edit user and then add to set

          candidateAPI.updateCandidateRating(
            app.candidate.email,
            rankings[app.applicationId]
          );
          foundCandidates.add(app.candidate);
          if (user?.email) {
            applicationAPI.updateApplicationFeedback(
              app.applicationId,
              user?.email,
              comments[app.applicationId]
            );
          } else {
            toast({
              title: "User email missing",
              description: "Cannot update ranking without a valid user email.",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
          // GET THE COMMENTS AND UPDATE CANDIDATE
        }
      }
    } catch (error) {
      console.log(error);
    }

    // // go through every user and do the calculations if there is a matching applicant for them
    // const updatedUsers: CandidateResponse[] = candidates.map((applicant) => {
    //   // filter the selected applications to match with a user
    //   const currentUserApplications = selectedApplications.filter(
    //     (application) => {
    //       //console.log("Checking Application user id:", application.user.id, "against Applicant:", applicant.id);
    //       return application.candidate.email === applicant.email;
    //     }
    //   );

    //   // if there are no matching applications, then do nothing and return the user unchanged
    //   if (currentUserApplications.length > 0) {
    //     console.log("MATCHING APPLICANT FOUND");
    //     // .reduce calls a function on the dictionary and adds the sums then returns the result
    //     // the 0 at the end is the initial value for sum
    //     const totalRank = currentUserApplications.reduce((sum, app) => {
    //       if (app.applicationId !== undefined && rankings[app.applicationId]) {
    //         return sum + rankings[app.applicationId];
    //       }

    //       return sum;
    //     }, 0);

    //     console.log("TOTAL RANK:", totalRank);
    //     // update the user with the times accepted and rating
    //     // for some reason the users' timesaccepted keeps getting subtracted by 1 and we have no idea why
    //     // so we add one to it to make it the actual value
    //     return {
    //       ...applicant,
    //       timesAccepted: applicant.timesAccepted + 1,
    //       ratingSum: applicant.ratingSum + totalRank,
    //       rating:
    //         (applicant.ratingSum + totalRank) /
    //         (applicant.timesAccepted + currentUserApplications.length),
    //     };
    //   } else {
    //     return applicant;
    //   }
    // });

    // // update the context and localStorage with user data
    // setCandidates(updatedUsers);
    // localStorage.setItem("users", JSON.stringify(updatedUsers));

    // // this is using all applications, NOT THE SELECTED ONES

    // // add comment to application
    // const updatedApplications = applications.map((currentApp) => {
    //   // match selected applications against stored applications
    //   const currentSelectedApplications = selectedApplications.filter(
    //     (storedApplication) => {
    //       console.log(
    //         "Checking application id:",
    //         currentApp.applicationId,
    //         "against ",
    //         storedApplication.applicationId
    //       );
    //       return currentApp.applicationId === storedApplication.applicationId;
    //     }
    //   );

    //   if (currentSelectedApplications.length > 0) {
    //     // get the comment from the dictionary and add it to the application
    //     if (currentApp.applicationId !== undefined) {
    //       const currentComment: string = comments[currentApp.applicationId];
    //       console.log("ADDING COMMENT:", currentComment);
    //       console.log("RANKED BY ", user?.email);
    //       return {
    //         ...currentApp,
    //         lecturerComment: [...currentApp.lecturerComment, currentComment],
    //         rankedBy: [...currentApp.rankedBy, user?.username],
    //       };
    //     }
    //   } else {
    //     return currentApp;
    //   }
    // });

    // // update the tutorApplications in localStorage
    // localStorage.setItem(
    //   "tutorApplications",
    //   JSON.stringify(updatedApplications)
    // );

    toast({
      title: "Successfully Submitted Rankings",
      description: "Returning.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });

    // reload the window for the rankings page to update properly
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <>
      <Box
        marginTop="40px"
        marginLeft="40px"
        marginRight="40px"
        marginBottom="150px"
      >
        <Heading as="h1" textAlign="center" margin="40px">
          Rank Tutor Applications
        </Heading>
        {selectedApplications.length === 0 ? (
          <>
            <Center>
              <Text
                as="h2"
                fontSize="2xl"
                fontWeight="medium"
                textAlign="center"
                color="gray.600"
              >
                No applications have been accepted
              </Text>
            </Center>
            <Center>
              <Text
                as="h2"
                fontSize="2xl"
                fontWeight="medium"
                textAlign="center"
                color="gray.600"
              >
                Navigate back to the view tutor applications page and accept an
                application to proceed.
              </Text>
            </Center>
          </>
        ) : (
          <VStack spacing="5px">
            <Text
              as="h2"
              fontSize="2xl"
              fontWeight="medium"
              textAlign="center"
              color="gray.600"
            >
              Here are your selected applications
            </Text>
            <br />
            <form onSubmit={handleFormSubmit}>
              {selectedApplications.map((application) => (
                <Card
                  bg="#f7f7f7"
                  variant="unstyled"
                  borderColor="#e8e8e8"
                  padding={4}
                  width={400}
                  _hover={{ bg: "#e8e8e8" }}
                  key={application.applicationId}
                >
                  <Text fontWeight="550">
                    {application.course.courseCode} - {application.roleType} -{" "}
                    {application.availability} |{" "}
                    {application.candidate.lastName},{" "}
                    {application.candidate.firstName}
                  </Text>
                  <Select
                    placeholder="Application Ranking"
                    isRequired
                    variant="filled"
                    value={
                      application.applicationId !== undefined
                        ? rankings[application.applicationId] || ""
                        : ""
                    }
                    onChange={(e) => {
                      if (application.applicationId !== undefined) {
                        handleRankingChange(
                          application.applicationId,
                          parseInt(e.target.value)
                        );
                      }
                    }}
                  >
                    {generateNumbering()}
                  </Select>
                  <br />
                  <InputGroup>
                    <InputLeftAddon>Comment: </InputLeftAddon>
                    <Input
                      placeholder="Enter a comment if any"
                      size="md"
                      variant="filled"
                      onChange={(e) => {
                        if (application.applicationId !== undefined) {
                          handleCommentChange(
                            application.applicationId,
                            e.target.value
                          );
                        }
                      }}
                      value={
                        application.applicationId !== undefined
                          ? comments[application.applicationId] || ""
                          : ""
                      }
                    />
                  </InputGroup>
                </Card>
              ))}
              <Card
                bg="#f7f7f7"
                variant="unstyled"
                borderColor="#e8e8e8"
                padding={4}
                maxWidth={400}
              >
                <Button type="submit" colorScheme="blue" width="stretch">
                  Submit Ranking
                </Button>
              </Card>
            </form>
          </VStack>
        )}
      </Box>
    </>
  );
}

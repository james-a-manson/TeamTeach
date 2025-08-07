import gql from "graphql-tag";

export const typeDefs = gql`
  

type Lecturer {
  email: String!
  firstName: String!
  lastName: String!
  assignedCourseCodes: String
  dateCreated: String
}

type Candidate {
  email: String!
  firstName: String!
  lastName: String!
  timesAccepted: Int!
  ratingSum: Int!
  rating: Int!
  isBlocked: Boolean!
  applications: [Application!]

}

type Application {
  applicationId: Int!
  roleType: String!
  status: String!
  availability: String!
  skills: String!
  previousRoles: String!
  academicCredentials: String!
  lecturerComments: String!
  rankedBy: String!
  candidateEmail: String!
  courseCode: String!
  candidate: Candidate!
  course: Course!
}


type Course {
  courseCode: String!
  courseName: String!
}

type Query {
  lecturers: [Lecturer!]!
  courses: [Course!]!
  candidates: [Candidate!]!
  applications: [Application!]!
  candidatesByCourse(courseCode: String!): [Candidate!]!

}

type Mutation {
  updateLecturerCourses(
    email: String!
    assignedCourseCodes: String!
  ): Lecturer!


  createCourse(
    courseCode: String!
    courseName: String!
  ): Course

  deleteCourse(
    courseCode: String!
  ): Boolean

  updateCourseName(
    courseCode: String!
    courseName: String!
  ): Course

  toggleCandidateBlocked(
    email: String!
  ): Candidate
}




 
`;

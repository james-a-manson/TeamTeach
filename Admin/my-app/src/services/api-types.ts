// Interface for candidate response
export interface CandidateResponse {
    email: string;
    firstName: string;
    lastName: string;
    dateCreated: Date;
    timesAccepted: number;
    ratingSum: number;
    rating: number;
    isBlocked: boolean;
    role: "candidate";
    applications?: ApplicationResponse[];
}

// Interface for lecturer response
export interface LecturerResponse {
    email: string;
    firstName: string;
    lastName: string;
    dateCreated: Date;
    assignedCourseCodes: string;
    role: "lecturer";
    courses?: CourseResponse[];
}

// Interface for course response
export interface CourseResponse {
    courseCode: string;
    courseName: string;
}

// Interface for application response
export interface ApplicationResponse {
    applicationId: number;
    roleType: "Tutor" | "Lab Assistant";
    status: "pending" | "accepted" | "rejected";
    applicationDate: Date;
    availability: "Part Time" | "Full Time";
    skills: string;
    previousRoles?: string;
    academicCredentials: string;
    lecturerComments: string;
    rankedBy: string;
    candidate: CandidateResponse;
    course: CourseResponse;
    courseCode: string;
    candidateEmail: string;
}

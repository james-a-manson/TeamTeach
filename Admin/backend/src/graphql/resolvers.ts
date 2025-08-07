import { AppDataSource } from "../data-source";
import { Application } from "../entity/Application";
import { Candidate } from "../entity/Candidate";
import { Course } from "../entity/Course";
import { Lecturer } from "../entity/Lecturer";

const applicationRepository = AppDataSource.getRepository(Application);
const candidateRepository = AppDataSource.getRepository(Candidate);
const courseRepository = AppDataSource.getRepository(Course);
const lecturerRepository = AppDataSource.getRepository(Lecturer);


export const resolvers = {
  Query: {
    lecturers: async () => {
      return await lecturerRepository.find();
    },

    courses: async () => {
      return await courseRepository.find();
    },

    candidates: async () => {
      return await candidateRepository.find({
        relations: ["applications"]
      });
    },

    applications: async () => {
      return await applicationRepository.find({
        relations: ["candidate"]
      })
    },

    candidatesByCourse: async (_: any, { courseCode }: { courseCode: string }) => {
      const applications = await applicationRepository.find({
        where: { courseCode },
        relations: ["candidate"]
      });

      // add all the candidates to a map
      const candidatesMap = new Map();
      for (const app of applications) {
        if (app.candidate) {
          candidatesMap.set(app.candidate.email, app.candidate);
        }
      }

      if (candidatesMap.size === 0) {
        throw new Error("No candidates found!")
      }

      return Array.from(candidatesMap.values());
    }
  },



  Mutation: {
    updateLecturerCourses: async (_: any, { email, assignedCourseCodes }: { email: string, assignedCourseCodes: string }) => {
      const lecturer = await lecturerRepository.findOneBy({ email });

      if (!lecturer) {
        throw new Error("No lecturer found")
      }

      lecturer.assignedCourseCodes = assignedCourseCodes;

      const savedLecturer = await lecturerRepository.save(lecturer)
      return savedLecturer
    },

    createCourse: async (_: any, { courseCode, courseName }: { courseCode: string, courseName: string }) => {
      const existing = await courseRepository.findOneBy({ courseCode })

      if (existing) {
        throw new Error("Course already exists")
      }

      const course = courseRepository.create({ courseCode, courseName });
      await courseRepository.save(course);

      return course;
    },

    deleteCourse: async (_: any, { courseCode }: { courseCode: string }) => {
      // first we delete all applications corresponding to that course
      const deletedApplications = await applicationRepository.delete({ courseCode });
      console.log("deleted applications: ", deletedApplications.affected)

      // secondly we remove the course from any lecturers that have it
      const lecturers = await lecturerRepository.find()


      for (const lec of lecturers) {
        // check if they have courses as well as if they are assigned to that course
        if (lec.assignedCourseCodes && lec.assignedCourseCodes.includes(courseCode)) {
          console.log("Related lecturers:", lec)
          // then split the course codes, trim them, filter all the ones that arent the one we are deleting
          // then join them back together to form the new list of codes
          lec.assignedCourseCodes = lec.assignedCourseCodes.split(",")
            .map(code => code.trim())
            .filter(code => code !== courseCode)
            .join(",")

          const savedLecturer = await lecturerRepository.save(lec)
          console.log(savedLecturer)
        }
      }

      // lastly delete the course
      const result = await courseRepository.delete(courseCode);

      return result.affected !== 0;
    },

    updateCourseName: async (_: any, { courseCode, courseName }: { courseCode: string, courseName: string }) => {
      const course = await courseRepository.findOneBy({ courseCode });
      if (!course) {
        throw new Error("Course not found");
      }
      course.courseName = courseName;
      const savedCourse = await courseRepository.save(course);
      return savedCourse;
    },

    toggleCandidateBlocked: async (_: any, { email }: { email: string }) => {
      const candidate = await candidateRepository.findOneBy({ email });

      if (!candidate) {
        throw new Error("No candidate found");
      }

      candidate.isBlocked = !candidate.isBlocked;

      const savedCandidate = await candidateRepository.save(candidate);
      return savedCandidate;
    }

  },
};

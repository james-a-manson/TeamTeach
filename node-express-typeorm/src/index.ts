import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import applicationRoutes from "./routes/application.routes";
import authenticationRoutes from "./routes/authentication.routes";
import candidateRoutes from "./routes/candidate.routes";
import courseRoutes from "./routes/course.routes";
import lecturerRoutes from "./routes/lecturer.routes";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use("/api", lecturerRoutes);
app.use("/api", applicationRoutes);
app.use("/api", candidateRoutes);
app.use("/api", courseRoutes);
app.use("/api", authenticationRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) =>
    console.log("Error during Data Source initialization:", error)
  );

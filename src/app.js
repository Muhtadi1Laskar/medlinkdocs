import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import router from "./index.routes.js";
import { errorHandler } from "./middleware/error-handler.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api/v1", router);
app.use(errorHandler);

export default app;
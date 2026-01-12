import express from "express";
import cors from "cors";
import contactRoutes from "./routes/contact.routes.js";
import demoRoutes from "./routes/demo.routes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", contactRoutes);
app.use("/api", demoRoutes);

app.use(notFound);
app.use(errorHandler);



app.get("/", (req, res) => {
  res.send("RaaziMarzi Backend is running 🚀");
});

export default app;

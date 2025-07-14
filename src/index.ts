import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT

// Security middleware - should be first
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// Parse JSON bodies
app.use(express.json());

// Health check
// app.get("/", (_req, res) => {
//   res.send("Hello, TypeScript + Express!");
// });

// Mount API routes


// Mount Bull Board dashboard

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Bull Dashboard available at http://localhost:${PORT}/admin/queues`);
});

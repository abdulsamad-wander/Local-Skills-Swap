import "dotenv/config";
import app from "./api/index.js";
import { connectDB } from "./lib/db.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    
    // Start the Express server locally
    app.listen(PORT, () => {
      console.log(`Server is running locally at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
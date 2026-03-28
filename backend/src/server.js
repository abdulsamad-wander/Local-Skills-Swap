import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./lib/db.js";

const PORT = process.env.PORT || 5000;

async function main() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

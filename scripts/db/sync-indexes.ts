import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { Category, Product, Customer, Order, NewsletterSubscriber, DiscountCode } from "@/lib/models";

// MongoDB has no "push the schema" step (it's schemaless) - the closest
// equivalent is syncing each model's declared indexes to Atlas, which is
// what this replaces Prisma's `db push` with.
const MODELS = { Category, Product, Customer, Order, NewsletterSubscriber, DiscountCode };

async function main() {
  await connectToDatabase();
  console.log("Syncing indexes for:", Object.keys(MODELS).join(", "));

  for (const [name, model] of Object.entries(MODELS)) {
    const result = await model.syncIndexes();
    console.log(`  ${name}: ${result.length ? result.join(", ") : "no changes"}`);
  }

  console.log("\nDone.");
}

main()
  .catch((err) => {
    console.error("Fatal error syncing indexes:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });

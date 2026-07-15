import mongoose from "mongoose";

// Cached across Next.js hot-reloads (dev) and serverless invocations (prod)
// so we don't open a fresh connection - and burn Atlas's connection limit -
// on every request. Same problem lib/prisma.ts solved for Prisma.
declare global {
  // eslint-disable-next-line no-var
  var _mongooseConnection: Promise<typeof mongoose> | undefined;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Add it to .env.local before connecting.");
  }

  if (!global._mongooseConnection) {
    mongoose.set("strictQuery", true);
    global._mongooseConnection = mongoose.connect(uri);
  }

  return global._mongooseConnection;
}

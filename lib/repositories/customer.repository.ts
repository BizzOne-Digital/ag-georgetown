import { connectToDatabase } from "@/lib/db/connect";
import { Customer, type ICustomer } from "@/lib/models/Customer";

// Guest checkout and logged-in checkout share this: every order needs a
// Customer row, but a guest never sets a password - isGuest just tracks
// whether they've claimed the account yet.
export async function findOrCreateGuestCustomer(email: string, fields: Partial<Pick<ICustomer, "firstName" | "lastName" | "phone">> = {}) {
  await connectToDatabase();
  const normalizedEmail = email.trim().toLowerCase();
  return Customer.findOneAndUpdate(
    { email: normalizedEmail },
    { $setOnInsert: { email: normalizedEmail, isGuest: true }, $set: fields },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

export async function getCustomerByEmail(email: string) {
  await connectToDatabase();
  return Customer.findOne({ email: email.trim().toLowerCase() }).lean<ICustomer | null>();
}

export async function getCustomerByAuthUserId(authUserId: string) {
  await connectToDatabase();
  return Customer.findOne({ authUserId }).lean<ICustomer | null>();
}

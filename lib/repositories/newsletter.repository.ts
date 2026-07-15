import { connectToDatabase } from "@/lib/db/connect";
import { NewsletterSubscriber } from "@/lib/models/NewsletterSubscriber";

export async function subscribeToNewsletter(email: string, source?: string) {
  await connectToDatabase();
  const normalizedEmail = email.trim().toLowerCase();
  return NewsletterSubscriber.findOneAndUpdate(
    { email: normalizedEmail },
    { $set: { unsubscribedAt: null }, $setOnInsert: { email: normalizedEmail, source: source ?? null, subscribedAt: new Date() } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

export async function unsubscribeFromNewsletter(email: string) {
  await connectToDatabase();
  return NewsletterSubscriber.updateOne(
    { email: email.trim().toLowerCase() },
    { $set: { unsubscribedAt: new Date() } }
  );
}

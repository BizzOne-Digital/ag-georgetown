import { Schema, model, models, Types } from "mongoose";

export interface INewsletterSubscriber {
  _id: Types.ObjectId;
  email: string;
  source: string | null;
  subscribedAt: Date;
  unsubscribedAt: Date | null;
}

const NewsletterSubscriberSchema = new Schema<INewsletterSubscriber>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  source: { type: String, default: null },
  subscribedAt: { type: Date, default: Date.now },
  unsubscribedAt: { type: Date, default: null },
});

export const NewsletterSubscriber =
  models.NewsletterSubscriber || model<INewsletterSubscriber>("NewsletterSubscriber", NewsletterSubscriberSchema);

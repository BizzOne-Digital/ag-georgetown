import { connectToDatabase } from "@/lib/db/connect";
import { DiscountCode } from "@/lib/models/DiscountCode";

export async function getActiveDiscountByCode(code: string) {
  await connectToDatabase();
  const now = new Date();
  return DiscountCode.findOne({
    code: code.trim().toUpperCase(),
    isActive: true,
    $and: [
      { $or: [{ startsAt: null }, { startsAt: { $lte: now } }] },
      { $or: [{ endsAt: null }, { endsAt: { $gte: now } }] },
    ],
  }).lean();
}

export async function incrementDiscountUsage(code: string) {
  await connectToDatabase();
  return DiscountCode.updateOne({ code: code.trim().toUpperCase() }, { $inc: { usageCount: 1 } });
}

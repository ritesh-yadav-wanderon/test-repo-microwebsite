// Shared MongoDB connection for the serverless product/booking/payment API.
//
// Serverless functions get a fresh module scope on a cold start but reuse it
// across warm invocations, so the client (and its connection pool) is cached
// on `global` — without this every request would open a new TCP/TLS
// connection to Atlas and quickly exhaust the connection limit.

import "server-only";

import { MongoClient, type Db, type Document } from "mongodb";

const DB_NAME = "test-trip-data";
export const PRODUCTS_COLLECTION = "new-trip-data";
export const BOOKINGS_COLLECTION = "bookings";
export const PAYMENTS_COLLECTION = "payments";

declare global {
  // eslint-disable-next-line no-var
  var __mongoClientPromise: Promise<MongoClient> | undefined;
  // eslint-disable-next-line no-var
  var __mongoIndexesPromise: Promise<void> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGO_CHAT_UX_DB_URI;
  if (!uri) {
    throw new Error("MONGO_CHAT_UX_DB_URI is not set");
  }
  if (!global.__mongoClientPromise) {
    const client = new MongoClient(uri);
    global.__mongoClientPromise = client.connect().catch((err) => {
      // Don't cache a failed connect — otherwise one Atlas blip (or a
      // network-access-list miss) poisons every request until a cold start.
      global.__mongoClientPromise = undefined;
      throw err;
    });
  }
  return global.__mongoClientPromise;
}

async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(DB_NAME);
}

/** One-time (per warm instance) index setup: `orderId` is the shared key
 *  between a booking and its payments, and a Razorpay payment id must only
 *  ever be recorded once. Best-effort — a failure here must not take the
 *  booking/payment request down with it. */
function ensureIndexes(db: Db): Promise<void> {
  if (!global.__mongoIndexesPromise) {
    global.__mongoIndexesPromise = Promise.all([
      db.collection(BOOKINGS_COLLECTION).createIndex({ orderId: 1 }, { unique: true }),
      db.collection(BOOKINGS_COLLECTION).createIndex({ phone: 1, email: 1 }),
      db.collection(PAYMENTS_COLLECTION).createIndex({ paymentId: 1 }, { unique: true }),
      db.collection(PAYMENTS_COLLECTION).createIndex({ orderId: 1 }),
    ])
      .then(() => undefined)
      .catch((err) => {
        console.error("[mongo] ensureIndexes failed:", err);
        global.__mongoIndexesPromise = undefined;
      });
  }
  return global.__mongoIndexesPromise;
}

export async function getProductsCollection() {
  const db = await getDb();
  return db.collection(PRODUCTS_COLLECTION);
}

export async function getBookingsCollection<T extends Document = Document>() {
  const db = await getDb();
  await ensureIndexes(db);
  return db.collection<T>(BOOKINGS_COLLECTION);
}

export async function getPaymentsCollection<T extends Document = Document>() {
  const db = await getDb();
  await ensureIndexes(db);
  return db.collection<T>(PAYMENTS_COLLECTION);
}

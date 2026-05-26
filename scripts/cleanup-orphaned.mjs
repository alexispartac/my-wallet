/**
 * One-time cleanup: removes transactions and budgets that have no userId
 * (created before auth was added). Run once, then delete this file.
 *
 * Usage: node scripts/cleanup-orphaned.mjs
 */
import { MongoClient } from 'mongodb';
import 'dotenv/config';

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI not set in .env.local');

const client = new MongoClient(uri);
await client.connect();
const db = client.db();

const txResult  = await db.collection('transactions').deleteMany({ userId: { $exists: false } });
const budResult = await db.collection('budgets').deleteMany({ userId: { $exists: false } });

console.log(`Deleted ${txResult.deletedCount} orphaned transactions`);
console.log(`Deleted ${budResult.deletedCount} orphaned budgets`);

await client.close();

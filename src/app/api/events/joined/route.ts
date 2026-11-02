import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ message: "User email parameter is required" }, { status: 400 });
    }

    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("carevision");
    const joinedCollection = db.collection("joined_events");

    // Fetch joined events for this user email sorted by date
    const joinedRecords = await joinedCollection
      .find({ userEmail: email })
      .sort({ eventDate: 1 })
      .toArray();

    await client.close();

    return NextResponse.json(joinedRecords, { status: 200 });
  } catch (error: any) {
    console.error("Joined Events GET Error:", error);
    return NextResponse.json({ message: "Failed to fetch joined events", error: error.message }, { status: 500 });
  }
}
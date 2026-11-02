import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventId, userEmail } = body;

    if (!eventId || !userEmail) {
      return NextResponse.json(
        { message: "Event ID and User Email are required" },
        { status: 400 }
      );
    }

    if (!uri) {
      return NextResponse.json(
        { message: "MongoDB connection string missing" },
        { status: 500 }
      );
    }

    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("carevision");
    const joinedCollection = db.collection("joined_events");
    const eventsCollection = db.collection("events");

    // Remove the user's join record
    const deleteResult = await joinedCollection.deleteOne({
      eventId,
      userEmail,
    });

    if (deleteResult.deletedCount === 0) {
      await client.close();
      return NextResponse.json(
        { message: "You have not joined this event or already left." },
        { status: 404 }
      );
    }

    // Decrement the volunteer count on the main event document (ensure it doesn't drop below 0)
    await eventsCollection.updateOne(
      { _id: new ObjectId(eventId) },
      { $inc: { volunteerCount: -1 } }
    );

    await client.close();

    return NextResponse.json(
      { message: "Successfully left the event." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Leave Event POST Error:", error);
    return NextResponse.json(
      { message: "Failed to leave event", error: error.message },
      { status: 500 }
    );
  }
}
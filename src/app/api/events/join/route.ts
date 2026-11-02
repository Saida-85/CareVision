import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventId, userEmail, userName, title, description, eventType, thumbnail, location, eventDate } = body;

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

    // Check if user already joined
    const existingJoin = await joinedCollection.findOne({
      eventId,
      userEmail,
    });

    if (existingJoin) {
      await client.close();
      return NextResponse.json(
        { message: "You have already joined this event!" },
        { status: 400 }
      );
    }

    // Insert join record
    const joinDocument = {
      eventId,
      userEmail,
      userName,
      title,
      description,
      eventType,
      thumbnail,
      location,
      eventDate,
      joinedAt: new Date().toISOString(),
    };

    await joinedCollection.insertOne(joinDocument);

    // Increment volunteer count
    await eventsCollection.updateOne(
      { _id: new ObjectId(eventId) },
      { $inc: { volunteerCount: 1 } }
    );

    await client.close();

    return NextResponse.json(
      { message: "Successfully joined event!" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Join Event POST Error:", error);
    return NextResponse.json(
      { message: "Failed to update event status", error: error.message },
      { status: 500 }
    );
  }
}
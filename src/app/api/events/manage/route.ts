import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI || "";

// 1. GET: Fetch events created by a specific user email
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { message: "User email is required" },
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
    const eventsCollection = db.collection("events");

    // Find all events created by this user
    const userEvents = await eventsCollection
      .find({ userEmail: email })
      .sort({ eventDate: 1 })
      .toArray();

    await client.close();

    return NextResponse.json(userEvents, { status: 200 });
  } catch (error: any) {
    console.error("GET Manage Events Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch events", error: error.message },
      { status: 500 }
    );
  }
}

// 2. POST: Create a new event
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, eventType, eventDate, location, thumbnail, imageUrl, description, userEmail } = body;

    if (!title || !eventType || !eventDate || !location || !userEmail) {
      return NextResponse.json(
        { message: "All required fields must be filled out." },
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
    const eventsCollection = db.collection("events");

    const newEvent = {
      title,
      eventType,
      eventDate,
      location,
      thumbnail: thumbnail || imageUrl || "",
      imageUrl: imageUrl || thumbnail || "",
      description,
      userEmail,
      volunteerCount: 0,
      createdAt: new Date().toISOString(),
    };

    const result = await eventsCollection.insertOne(newEvent);
    await client.close();

    return NextResponse.json(
      { message: "Event created successfully!", eventId: result.insertedId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create Event API Error:", error);
    return NextResponse.json(
      { message: "Failed to create event. " + error.message },
      { status: 500 }
    );
  }
}

// 3. DELETE: Delete an event by ID
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Event ID is required" },
        { status: 400 }
      );
    }

    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("carevision");
    const eventsCollection = db.collection("events");
    const joinedCollection = db.collection("joined_events");

    // Delete event and any related join records
    await eventsCollection.deleteOne({ _id: new ObjectId(id) });
    await joinedCollection.deleteMany({ eventId: id });

    await client.close();

    return NextResponse.json(
      { message: "Event deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Delete Event Error:", error);
    return NextResponse.json(
      { message: "Failed to delete event", error: error.message },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, eventType, eventDate, location, imageUrl, thumbnail, description, userEmail } = body;

    if (!title || !eventType || !eventDate || !location || !userEmail) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    if (!uri) {
      return NextResponse.json(
        { message: "MongoDB connection string missing in environment variables." },
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
      imageUrl: imageUrl || thumbnail || "",
      thumbnail: thumbnail || imageUrl || "",
      description,
      userEmail,
      volunteerCount: 0,
      createdAt: new Date().toISOString(),
    };

    const result = await eventsCollection.insertOne(newEvent);
    await client.close();

    return NextResponse.json(
      { message: "Event added successfully!", eventId: result.insertedId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create Event API Error:", error);
    return NextResponse.json(
      { message: error.message || "Server error while creating event." },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI || "";

// GET /api/events/[id] - Fetch single event details
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid Event ID format" },
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
    const event = await db.collection("events").findOne({ _id: new ObjectId(id) });

    await client.close();

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error: any) {
    console.error("Fetch Single Event Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch event", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id] - Delete user created event
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { userEmail } = body;

    if (!id || !userEmail) {
      return NextResponse.json(
        { message: "Event ID and user email are required" },
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

    // Verify event ownership before deleting
    const event = await eventsCollection.findOne({ _id: new ObjectId(id) });

    if (!event) {
      await client.close();
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    if (event.userEmail !== userEmail) {
      await client.close();
      return NextResponse.json(
        { message: "Unauthorized: You can only delete your own created events" },
        { status: 403 }
      );
    }

    // Delete the event document
    await eventsCollection.deleteOne({ _id: new ObjectId(id) });
    await client.close();

    return NextResponse.json({ message: "Event deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Delete Event Error:", error);
    return NextResponse.json(
      { message: "Failed to delete event", error: error.message },
      { status: 500 }
    );
  }
}
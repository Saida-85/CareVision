import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI || "";

// ==================== GET /api/events/[id] - Fetch single event details ====================
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

// ==================== PUT /api/events/[id] - Update event details ====================
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, eventType, eventDate, location, imageUrl, thumbnail, description } = body;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid event ID" }, { status: 400 });
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

    const finalImage = imageUrl || thumbnail || "";

    const updateResult = await eventsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          eventType,
          eventDate,
          location,
          imageUrl: finalImage,
          thumbnail: finalImage,
          description,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    await client.close();

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Event updated successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("PUT Event Error:", error);
    return NextResponse.json(
      { message: "Failed to update event", error: error.message },
      { status: 500 }
    );
  }
}

// ==================== DELETE /api/events/[id] - Delete user created event ====================
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Safely parse body if sent, otherwise fallback to standard ID deletion
    let userEmail = "";
    try {
      const body = await req.json();
      userEmail = body?.userEmail;
    } catch {
      // Body might be empty if hitting direct ID delete
    }

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
    const eventsCollection = db.collection("events");

    const event = await eventsCollection.findOne({ _id: new ObjectId(id) });

    if (!event) {
      await client.close();
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    // Optional ownership check if email is provided in request body
    if (userEmail && event.userEmail && event.userEmail !== userEmail) {
      await client.close();
      return NextResponse.json(
        { message: "Unauthorized: You can only delete your own created events" },
        { status: 403 }
      );
    }

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
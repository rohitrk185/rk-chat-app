import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "../lib/db";
import { Request, Response } from "express";

export async function clerkAuthWebhook(req: Request, res: Response) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers from the request
  const svix_id = req.header("svix-id");
  const svix_timestamp = req.header("svix-timestamp");
  const svix_signature = req.header("svix-signature");

  console.log("req headers: ", {
    svix_id,
    svix_timestamp,
    svix_signature,
  });

  if (!svix_id || !svix_timestamp || !svix_signature) {
    res.status(400).json({ error: "Error occured -- no svix headers" });
    return;
  }

  // Get the body
  const payload = req.body;
  const body = JSON.stringify(payload);

  console.log("req payload: ", payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err: any) {
    console.error("Error verifying webhook:", err);
    console.error("stack trace:", err.stack);

    res.status(400).json({ Error: err });
    return;
  }

  const eventType = evt.type;

  // Handle the 'user.created' event
  if (eventType === "user.created") {
    const { id, email_addresses, image_url, username } = evt.data;

    if (!email_addresses || email_addresses.length === 0) {
      res.status(400).json({ error: "No email address provided" });
      return;
    }

    try {
      await db.user.create({
        data: {
          clerkId: id,
          email: email_addresses[0].email_address,
          username: username,
          imageUrl: image_url,
        },
      });
      console.log(`Successfully created user in DB with Clerk ID: ${id}`);
      res.status(201).json({ message: "User created successfully" });
      return;
    } catch (dbError) {
      console.error("Database error creating user:", dbError);
      res.status(500).json({ error: "Failed to create user in database" });
      return;
    }
  }

  // You can add handlers for other events like 'user.updated' or 'user.deleted' here.

  res.status(200).send("Webhook processed");
  return;
}

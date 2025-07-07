import { Request } from "express";

// This interface extends the default Express Request type
// to include the 'auth' property that Clerk's middleware adds.
export interface AuthenticatedRequest extends Request {
  auth?: {
    userId: string;
  };
}

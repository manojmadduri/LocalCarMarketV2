import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from "express";
import { registerRoutes } from "../server/routes";

const app = express();

// Initialize routes
registerRoutes(app);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return new Promise((resolve) => {
    app(req as any, res as any, (result: any) => {
      if (result instanceof Error) {
        return resolve(result);
      }
      return resolve(result);
    });
  });
}
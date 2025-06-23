import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from "express";
import { carFiltersSchema } from "../shared/schema";

const app = express();

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Initialize storage dynamically to avoid import issues
let storage: any = null;

async function getStorage() {
  if (!storage) {
    try {
      const { storage: dbStorage } = await import("../server/storage");
      storage = dbStorage;
    } catch (error) {
      console.error('Failed to initialize storage:', error);
      throw new Error('Database connection failed');
    }
  }
  return storage;
}

// Cars routes
app.get('/api/cars', async (req, res) => {
  try {
    const storageInstance = await getStorage();
    const filters = carFiltersSchema.parse(req.query);
    const result = await storageInstance.getCars(filters);
    res.json(result);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
});

app.get('/api/cars/:id', async (req, res) => {
  try {
    const storageInstance = await getStorage();
    const id = parseInt(req.params.id);
    const car = await storageInstance.getCar(id);
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.json(car);
  } catch (error) {
    console.error('Error fetching car:', error);
    res.status(500).json({ error: 'Failed to fetch car' });
  }
});

// Services routes
app.get('/api/services', async (req, res) => {
  try {
    const storageInstance = await getStorage();
    const services = await storageInstance.getServices();
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Testimonials routes
app.get('/api/testimonials', async (req, res) => {
  try {
    const storageInstance = await getStorage();
    const approved = req.query.approved === 'true';
    const testimonials = await storageInstance.getTestimonials(approved);
    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

// Analytics routes
app.get('/api/analytics/:carId', async (req, res) => {
  try {
    const storageInstance = await getStorage();
    const carId = parseInt(req.params.carId);
    const analytics = await storageInstance.getCarAnalytics(carId);
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return app(req as any, res as any);
}

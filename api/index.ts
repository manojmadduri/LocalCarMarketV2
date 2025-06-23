import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from "express";
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "../shared/schema";
import { eq, and, gte, lte, ilike, inArray, desc, asc } from "drizzle-orm";
import { carFiltersSchema, cars, services, testimonials, carAnalytics } from "../shared/schema";
import type { CarFilters } from "../shared/schema";

// Initialize database connection for Vercel
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : {
    rejectUnauthorized: false
  }
});

const db = drizzle(pool, { schema });

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

// Cars routes
app.get('/api/cars', async (req, res) => {
  try {
    const filters = carFiltersSchema.parse(req.query);
    const conditions = [];
    
    // Handle make filter
    if (filters.make) {
      if (Array.isArray(filters.make) && filters.make.length > 0) {
        conditions.push(inArray(cars.make, filters.make));
      } else if (typeof filters.make === 'string' && filters.make.trim() && filters.make !== 'any') {
        conditions.push(eq(cars.make, filters.make));
      }
    }
    
    if (filters.model) {
      conditions.push(ilike(cars.model, `%${filters.model}%`));
    }
    
    if (filters.minYear) {
      conditions.push(gte(cars.year, filters.minYear));
    }
    
    if (filters.maxYear) {
      conditions.push(lte(cars.year, filters.maxYear));
    }
    
    if (filters.minPrice) {
      conditions.push(gte(cars.price, filters.minPrice));
    }
    
    if (filters.maxPrice) {
      conditions.push(lte(cars.price, filters.maxPrice));
    }
    
    if (filters.minMileage) {
      conditions.push(gte(cars.mileage, filters.minMileage));
    }
    
    if (filters.maxMileage) {
      conditions.push(lte(cars.mileage, filters.maxMileage));
    }
    
    if (filters.fuelType && filters.fuelType !== 'any') {
      conditions.push(eq(cars.fuelType, filters.fuelType));
    }
    
    if (filters.transmission && filters.transmission !== 'any') {
      conditions.push(eq(cars.transmission, filters.transmission));
    }
    
    if (filters.condition && filters.condition !== 'any') {
      conditions.push(eq(cars.condition, filters.condition));
    }

    let query = db.select().from(cars);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price_asc':
          query = query.orderBy(asc(cars.price));
          break;
        case 'price_desc':
          query = query.orderBy(desc(cars.price));
          break;
        case 'year_asc':
          query = query.orderBy(asc(cars.year));
          break;
        case 'year_desc':
          query = query.orderBy(desc(cars.year));
          break;
        case 'mileage_asc':
          query = query.orderBy(asc(cars.mileage));
          break;
        case 'mileage_desc':
          query = query.orderBy(desc(cars.mileage));
          break;
        default:
          query = query.orderBy(desc(cars.id));
      }
    } else {
      query = query.orderBy(desc(cars.id));
    }
    
    // Apply pagination
    const limit = Math.min(filters.limit || 50, 100);
    const offset = (filters.page - 1) * limit;
    
    const carsResult = await query.limit(limit).offset(offset);
    
    // Get total count
    const totalQuery = db.select().from(cars);
    const totalResult = conditions.length > 0 
      ? await totalQuery.where(and(...conditions))
      : await totalQuery;
    
    res.json({
      cars: carsResult,
      total: totalResult.length
    });
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
});

app.get('/api/cars/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [car] = await db.select().from(cars).where(eq(cars.id, id));
    
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
    const servicesResult = await db.select().from(services).orderBy(asc(services.id));
    res.json(servicesResult);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Testimonials routes
app.get('/api/testimonials', async (req, res) => {
  try {
    const approved = req.query.approved === 'true';
    let query = db.select().from(testimonials);
    
    if (approved) {
      query = query.where(eq(testimonials.approved, true));
    }
    
    const testimonialsResult = await query.orderBy(desc(testimonials.id));
    res.json(testimonialsResult);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

// Analytics routes
app.get('/api/analytics/:carId', async (req, res) => {
  try {
    const carId = parseInt(req.params.carId);
    const [analytics] = await db.select().from(carAnalytics).where(eq(carAnalytics.carId, carId));
    
    if (!analytics) {
      // Return default analytics if none exist
      res.json({
        carId,
        totalViews: 0,
        dailyViews: 0,
        contactClicks: 0,
        phoneClicks: 0,
        shareCount: 0,
        averageTimeSpent: 0
      });
    } else {
      res.json(analytics);
    }
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

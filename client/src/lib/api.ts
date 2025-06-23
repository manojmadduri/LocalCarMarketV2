import { queryClient, apiRequest } from "./queryClient";
import type { 
  Car, 
  InsertCar, 
  Service, 
  InsertService,
  Testimonial,
  InsertTestimonial,
  ServiceBooking,
  InsertServiceBooking,
  ContactMessage,
  InsertContactMessage,
  CarFilters
} from "@shared/schema";

// Cars API
export const carsApi = {
  getCars: async (filters: Partial<CarFilters> = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(item => params.append(key, item.toString()));
        } else {
          params.append(key, value.toString());
        }
      }
    });
    
    const response = await fetch(`/api/cars?${params.toString()}`, {
      credentials: "include",
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch cars: ${response.statusText}`);
    }
    
    return response.json();
  },

  getCar: async (id: number): Promise<Car> => {
    const response = await fetch(`/api/cars/${id}`, {
      credentials: "include",
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch car: ${response.statusText}`);
    }
    
    return response.json();
  },

  createCar: async (car: InsertCar): Promise<Car> => {
    const response = await apiRequest("POST", "/api/cars", car);
    return response.json();
  },

  updateCar: async (id: number, car: Partial<InsertCar>): Promise<Car> => {
    const response = await apiRequest("PUT", `/api/cars/${id}`, car);
    return response.json();
  },

  deleteCar: async (id: number): Promise<void> => {
    await apiRequest("DELETE", `/api/cars/${id}`);
  },

  updateCarStatus: async (id: number, status: string): Promise<Car> => {
    const response = await apiRequest("PUT", `/api/cars/${id}/status`, { status });
    return response.json();
  },
};

// Services API
export const servicesApi = {
  getServices: async (): Promise<Service[]> => {
    const response = await fetch("/api/services", {
      credentials: "include",
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch services: ${response.statusText}`);
    }
    
    return response.json();
  },

  getService: async (id: number): Promise<Service> => {
    const response = await fetch(`/api/services/${id}`, {
      credentials: "include",
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch service: ${response.statusText}`);
    }
    
    return response.json();
  },

  createService: async (service: InsertService): Promise<Service> => {
    const response = await apiRequest("POST", "/api/services", service);
    return response.json();
  },

  updateService: async (id: number, service: Partial<InsertService>): Promise<Service> => {
    const response = await apiRequest("PUT", `/api/services/${id}`, service);
    return response.json();
  },

  deleteService: async (id: number): Promise<void> => {
    await apiRequest("DELETE", `/api/services/${id}`);
  },
};

// Testimonials API
export const testimonialsApi = {
  getTestimonials: async (approved?: boolean): Promise<Testimonial[]> => {
    const params = new URLSearchParams();
    if (approved !== undefined) {
      params.append("approved", approved.toString());
    }
    
    const response = await fetch(`/api/testimonials?${params.toString()}`, {
      credentials: "include",
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch testimonials: ${response.statusText}`);
    }
    
    return response.json();
  },

  createTestimonial: async (testimonial: InsertTestimonial): Promise<Testimonial> => {
    const response = await apiRequest("POST", "/api/testimonials", testimonial);
    return response.json();
  },

  updateTestimonial: async (id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial> => {
    const response = await apiRequest("PUT", `/api/testimonials/${id}`, testimonial);
    return response.json();
  },

  deleteTestimonial: async (id: number): Promise<void> => {
    await apiRequest("DELETE", `/api/testimonials/${id}`);
  },
};

// Service Bookings API
export const serviceBookingsApi = {
  getServiceBookings: async (): Promise<ServiceBooking[]> => {
    const response = await fetch("/api/service-bookings", {
      credentials: "include",
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch service bookings: ${response.statusText}`);
    }
    
    return response.json();
  },

  createServiceBooking: async (booking: InsertServiceBooking): Promise<ServiceBooking> => {
    const response = await apiRequest("POST", "/api/service-bookings", booking);
    return response.json();
  },

  updateServiceBookingStatus: async (id: number, status: string): Promise<ServiceBooking> => {
    const response = await apiRequest("PUT", `/api/service-bookings/${id}/status`, { status });
    return response.json();
  },
};

// Contact Messages API
export const contactMessagesApi = {
  getContactMessages: async (): Promise<ContactMessage[]> => {
    const response = await fetch("/api/contact-messages", {
      credentials: "include",
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch contact messages: ${response.statusText}`);
    }
    
    return response.json();
  },

  createContactMessage: async (message: InsertContactMessage): Promise<ContactMessage> => {
    const response = await apiRequest("POST", "/api/contact-messages", message);
    return response.json();
  },

  updateContactMessageStatus: async (id: number, status: string): Promise<ContactMessage> => {
    const response = await apiRequest("PUT", `/api/contact-messages/${id}/status`, { status });
    return response.json();
  },
};

// Helper function to invalidate related queries
export const invalidateQueries = {
  cars: () => queryClient.invalidateQueries({ queryKey: ["/api/cars"] }),
  services: () => queryClient.invalidateQueries({ queryKey: ["/api/services"] }),
  testimonials: () => queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] }),
  serviceBookings: () => queryClient.invalidateQueries({ queryKey: ["/api/service-bookings"] }),
  contactMessages: () => queryClient.invalidateQueries({ queryKey: ["/api/contact-messages"] }),
};

// Utility functions
export const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice);
};

export const formatMileage = (mileage: number): string => {
  return new Intl.NumberFormat('en-US').format(mileage);
};

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj);
};

export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "available":
    case "confirmed":
    case "approved":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "sold":
    case "completed":
    case "read":
      return "bg-blue-100 text-blue-800";
    case "cancelled":
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import ImageUpload from "@/components/image-upload";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Car as CarIcon, 
  Wrench, 
  MessageSquare, 
  Users,
  Calendar,
  Mail,
  BarChart3,
  Eye,
  CheckCircle,
  XCircle
} from "lucide-react";
import type { 
  Car as CarType, 
  InsertCar, 
  Service, 
  InsertService,
  Testimonial,
  InsertTestimonial,
  ServiceBooking,
  ContactMessage
} from "@shared/schema";

export default function Admin() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("cars");

  // Car form state
  const [carForm, setCarForm] = useState<Partial<InsertCar>>({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    price: "",
    mileage: 0,
    color: "",
    fuelType: "Gasoline",
    transmission: "Automatic",
    condition: "used",
    status: "available",
    images: [],
    description: "",
    vin: "",
    features: [],
    // Performance & Safety fields
    mpgCity: undefined,
    mpgHighway: undefined,
    safetyRating: undefined,
    // Additional specification fields
    engine: "",
    drivetrain: "",
    bodyStyle: "",
    numberOfSeats: undefined,
    numberOfDoors: undefined,
    interiorColor: "",
    trim: "",
  });

  // Service form state
  const [serviceForm, setServiceForm] = useState<Partial<InsertService>>({
    name: "",
    description: "",
    startingPrice: "",
    category: "maintenance",
    icon: "fas fa-wrench",
    image: "",
    features: [],
    duration: "",
    isActive: true,
  });

  // Editing states
  const [editingCar, setEditingCar] = useState<CarType | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isCarDialogOpen, setIsCarDialogOpen] = useState(false);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  
  // Features management
  const [newFeature, setNewFeature] = useState("");
  const [carFeatures, setCarFeatures] = useState<string[]>([]);

  // VIN auto-population
  const handleVinChange = async (vin: string) => {
    setCarForm({ ...carForm, vin });
    
    if (vin.length === 17) {
      try {
        const response = await fetch(`/api/vin/${vin}`);
        if (response.ok) {
          const vinData = await response.json();
          
          // Auto-populate fields from VIN decode including Performance & Safety
          setCarForm(prev => ({
            ...prev,
            vin,
            make: vinData.make || prev.make,
            model: vinData.model || prev.model,
            year: vinData.year ? parseInt(vinData.year) : prev.year,
            bodyStyle: vinData.bodyStyle || prev.bodyStyle,
            engine: vinData.engine || prev.engine,
            fuelType: vinData.fuelType || prev.fuelType,
            transmission: vinData.transmission || prev.transmission,
            drivetrain: vinData.drivetrain || prev.drivetrain,
            trim: vinData.trim || prev.trim,
            // Auto-populate estimated Performance & Safety based on vehicle type
            mpgCity: vinData.fuelType === 'Electric' ? 120 : 
                     vinData.fuelType === 'Hybrid' ? 45 : 
                     vinData.bodyStyle === 'Truck' ? 18 :
                     vinData.bodyStyle === 'SUV' ? 22 : 28,
            mpgHighway: vinData.fuelType === 'Electric' ? 100 : 
                        vinData.fuelType === 'Hybrid' ? 40 : 
                        vinData.bodyStyle === 'Truck' ? 24 :
                        vinData.bodyStyle === 'SUV' ? 28 : 35,
            safetyRating: "4.5", // Default high safety rating, can be manually adjusted
          }));
          
          toast({ 
            title: "VIN decoded successfully!", 
            description: `Auto-populated data for ${vinData.year} ${vinData.make} ${vinData.model}` 
          });
        }
      } catch (error) {
        console.error('VIN decode error:', error);
      }
    }
  };

  // Feature management functions
  const addFeature = () => {
    if (newFeature.trim() && !carFeatures.includes(newFeature.trim())) {
      const updatedFeatures = [...carFeatures, newFeature.trim()];
      setCarFeatures(updatedFeatures);
      setCarForm({ ...carForm, features: updatedFeatures });
      setNewFeature("");
    }
  };

  const removeFeature = (featureToRemove: string) => {
    const updatedFeatures = carFeatures.filter(feature => feature !== featureToRemove);
    setCarFeatures(updatedFeatures);
    setCarForm({ ...carForm, features: updatedFeatures });
  };

  // Queries
  const { data: carsData, isLoading: carsLoading } = useQuery({
    queryKey: ["/api/cars", { limit: 100 }],
  });

  const { data: services, isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const { data: testimonials, isLoading: testimonialsLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  const { data: serviceBookings, isLoading: bookingsLoading } = useQuery<ServiceBooking[]>({
    queryKey: ["/api/service-bookings"],
  });

  const { data: contactMessages, isLoading: messagesLoading } = useQuery<ContactMessage[]>({
    queryKey: ["/api/contact-messages"],
  });

  // Mutations
  const createCarMutation = useMutation({
    mutationFn: async (carData: InsertCar) => {
      const response = await apiRequest("POST", "/api/cars", carData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] });
      resetCarForm();
      setIsCarDialogOpen(false);
      toast({ title: "Car added successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to add car", description: error.message, variant: "destructive" });
    },
  });

  const updateCarMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertCar> }) => {
      const response = await apiRequest("PUT", `/api/cars/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] });
      setEditingCar(null);
      setIsCarDialogOpen(false);
      toast({ title: "Car updated successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to update car", description: error.message, variant: "destructive" });
    },
  });

  const deleteCarMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/cars/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] });
      toast({ title: "Car deleted successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to delete car", description: error.message, variant: "destructive" });
    },
  });

  const updateCarStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest("PUT", `/api/cars/${id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] });
      toast({ title: "Car status updated!" });
    },
  });

  const createServiceMutation = useMutation({
    mutationFn: async (serviceData: InsertService) => {
      const response = await apiRequest("POST", "/api/services", serviceData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      setServiceForm({
        name: "",
        description: "",
        startingPrice: "",
        category: "maintenance",
        icon: "fas fa-wrench",
        image: "",
        features: [],
        duration: "",
        isActive: true,
      });
      setIsServiceDialogOpen(false);
      toast({ title: "Service added successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to add service", description: error.message, variant: "destructive" });
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertService> }) => {
      const response = await apiRequest("PUT", `/api/services/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      setEditingService(null);
      setIsServiceDialogOpen(false);
      toast({ title: "Service updated successfully!" });
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/services/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({ title: "Service deleted successfully!" });
    },
  });

  const updateTestimonialMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertTestimonial> }) => {
      const response = await apiRequest("PUT", `/api/testimonials/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({ title: "Testimonial updated successfully!" });
    },
  });

  const deleteTestimonialMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/testimonials/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({ title: "Testimonial deleted successfully!" });
    },
  });

  const updateBookingStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest("PUT", `/api/service-bookings/${id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/service-bookings"] });
      toast({ title: "Booking status updated!" });
    },
  });

  const updateMessageStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest("PUT", `/api/contact-messages/${id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact-messages"] });
      toast({ title: "Message status updated!" });
    },
  });

  // Handlers
  const handleEditCar = (car: CarType) => {
    setEditingCar(car);
    setCarFeatures(car.features || []);
    setCarForm({
      make: car.make,
      model: car.model,
      year: car.year,
      price: car.price,
      mileage: car.mileage,
      color: car.color,
      fuelType: car.fuelType,
      transmission: car.transmission,
      condition: car.condition,
      status: car.status,
      images: car.images,
      description: car.description,
      vin: car.vin,
      features: car.features || [],
      // Performance & Safety fields
      mpgCity: car.mpgCity,
      mpgHighway: car.mpgHighway,
      safetyRating: car.safetyRating || undefined,
      // Additional specification fields
      engine: car.engine || "",
      drivetrain: car.drivetrain || "",
      bodyStyle: car.bodyStyle || "",
      numberOfSeats: car.numberOfSeats,
      numberOfDoors: car.numberOfDoors,
      interiorColor: car.interiorColor || "",
      trim: car.trim || "",
    });
    setIsCarDialogOpen(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      description: service.description,
      startingPrice: service.startingPrice,
      category: service.category,
      icon: service.icon,
      image: service.image,
      features: service.features,
      duration: service.duration,
      isActive: service.isActive,
    });
    setIsServiceDialogOpen(true);
  };

  const handleCarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const carData = { ...carForm, features: carFeatures };
    if (editingCar) {
      updateCarMutation.mutate({ id: editingCar.id, data: carData as InsertCar });
    } else {
      createCarMutation.mutate(carData as InsertCar);
    }
  };

  const resetCarForm = () => {
    setCarForm({
      make: "",
      model: "",
      year: new Date().getFullYear(),
      price: "",
      mileage: 0,
      color: "",
      fuelType: "Gasoline",
      transmission: "Automatic",
      condition: "used",
      status: "available",
      images: [],
      description: "",
      vin: "",
      features: [],
      // Performance & Safety fields
      mpgCity: undefined,
      mpgHighway: undefined,
      safetyRating: undefined,
      // Additional specification fields
      engine: "",
      drivetrain: "",
      bodyStyle: "",
      numberOfSeats: undefined,
      numberOfDoors: undefined,
      interiorColor: "",
      trim: "",
    });
    setCarFeatures([]);
    setEditingCar(null);
  };

  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      updateServiceMutation.mutate({ id: editingService.id, data: serviceForm as InsertService });
    } else {
      createServiceMutation.mutate(serviceForm as InsertService);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
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
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(parseFloat(price));
  };

  const cars = (carsData as { cars: CarType[] })?.cars || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your automotive business</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <CarIcon className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Cars</p>
                  <p className="text-2xl font-bold text-gray-900">{cars.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Wrench className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Services</p>
                  <p className="text-2xl font-bold text-gray-900">{services?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{serviceBookings?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Mail className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Messages</p>
                  <p className="text-2xl font-bold text-gray-900">{contactMessages?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex flex-wrap gap-1 h-auto w-full justify-start p-2 bg-muted rounded-md">
            <TabsTrigger value="cars" className="flex-1 min-w-[80px] text-xs sm:text-sm px-2 sm:px-3 py-2">Cars</TabsTrigger>
            <TabsTrigger value="services" className="flex-1 min-w-[80px] text-xs sm:text-sm px-2 sm:px-3 py-2">Services</TabsTrigger>
            <TabsTrigger value="testimonials" className="flex-1 min-w-[80px] text-xs sm:text-sm px-2 sm:px-3 py-2">Reviews</TabsTrigger>
            <TabsTrigger value="bookings" className="flex-1 min-w-[80px] text-xs sm:text-sm px-2 sm:px-3 py-2">Bookings</TabsTrigger>
            <TabsTrigger value="messages" className="flex-1 min-w-[80px] text-xs sm:text-sm px-2 sm:px-3 py-2">Messages</TabsTrigger>
          </TabsList>

          {/* Cars Tab */}
          <TabsContent value="cars">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Manage Cars</CardTitle>
                  <Dialog open={isCarDialogOpen} onOpenChange={setIsCarDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        onClick={() => {
                          setEditingCar(null);
                          setCarForm({
                            make: "",
                            model: "",
                            year: new Date().getFullYear(),
                            price: "",
                            mileage: 0,
                            color: "",
                            fuelType: "Gasoline",
                            transmission: "Automatic",
                            condition: "used",
                            status: "available",
                            images: [],
                            description: "",
                            vin: "",
                            features: [],
                            // Performance & Safety fields
                            mpgCity: undefined,
                            mpgHighway: undefined,
                            safetyRating: undefined,
                            // Additional specification fields
                            engine: "",
                            drivetrain: "",
                            bodyStyle: "",
                            numberOfSeats: undefined,
                            numberOfDoors: undefined,
                            interiorColor: "",
                            trim: "",
                          });
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Car
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{editingCar ? "Edit Car" : "Add New Car"}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleCarSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="make">Make</Label>
                            <Input
                              id="make"
                              value={carForm.make}
                              onChange={(e) => setCarForm(prev => ({ ...prev, make: e.target.value }))}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="model">Model</Label>
                            <Input
                              id="model"
                              value={carForm.model}
                              onChange={(e) => setCarForm(prev => ({ ...prev, model: e.target.value }))}
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="year">Year</Label>
                            <Input
                              id="year"
                              type="number"
                              value={carForm.year}
                              onChange={(e) => setCarForm(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="price">Price</Label>
                            <Input
                              id="price"
                              type="number"
                              step="0.01"
                              value={carForm.price}
                              onChange={(e) => setCarForm(prev => ({ ...prev, price: e.target.value }))}
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="mileage">Mileage</Label>
                            <Input
                              id="mileage"
                              type="number"
                              value={carForm.mileage}
                              onChange={(e) => setCarForm(prev => ({ ...prev, mileage: parseInt(e.target.value) }))}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="color">Color</Label>
                            <Input
                              id="color"
                              value={carForm.color}
                              onChange={(e) => setCarForm(prev => ({ ...prev, color: e.target.value }))}
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="fuelType">Fuel Type</Label>
                            <Select value={carForm.fuelType} onValueChange={(value) => setCarForm(prev => ({ ...prev, fuelType: value }))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Gasoline">Gasoline</SelectItem>
                                <SelectItem value="Hybrid">Hybrid</SelectItem>
                                <SelectItem value="Electric">Electric</SelectItem>
                                <SelectItem value="Diesel">Diesel</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="transmission">Transmission</Label>
                            <Select value={carForm.transmission} onValueChange={(value) => setCarForm(prev => ({ ...prev, transmission: value }))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Automatic">Automatic</SelectItem>
                                <SelectItem value="Manual">Manual</SelectItem>
                                <SelectItem value="CVT">CVT</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        {/* Performance & Safety Fields */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900">Performance & Safety</h3>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="mpgCity">City MPG</Label>
                              <Input
                                id="mpgCity"
                                type="number"
                                value={carForm.mpgCity || ""}
                                onChange={(e) => setCarForm(prev => ({ ...prev, mpgCity: e.target.value ? parseInt(e.target.value) : undefined }))}
                                placeholder="25"
                              />
                            </div>
                            <div>
                              <Label htmlFor="mpgHighway">Highway MPG</Label>
                              <Input
                                id="mpgHighway"
                                type="number"
                                value={carForm.mpgHighway || ""}
                                onChange={(e) => setCarForm(prev => ({ ...prev, mpgHighway: e.target.value ? parseInt(e.target.value) : undefined }))}
                                placeholder="32"
                              />
                            </div>
                            <div>
                              <Label htmlFor="safetyRating">Safety Rating (1-5)</Label>
                              <Input
                                id="safetyRating"
                                type="number"
                                min="1"
                                max="5"
                                step="0.1"
                                value={carForm.safetyRating || ""}
                                onChange={(e) => setCarForm(prev => ({ ...prev, safetyRating: e.target.value || "" }))}
                                placeholder="4.5"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Additional Key Specifications */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900">Additional Specifications</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="engine">Engine</Label>
                              <Input
                                id="engine"
                                value={carForm.engine || ""}
                                onChange={(e) => setCarForm(prev => ({ ...prev, engine: e.target.value }))}
                                placeholder="3.6L V6"
                              />
                            </div>
                            <div>
                              <Label htmlFor="drivetrain">Drivetrain</Label>
                              <Select value={carForm.drivetrain || ""} onValueChange={(value) => setCarForm(prev => ({ ...prev, drivetrain: value }))}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select drivetrain" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="FWD">Front-Wheel Drive (FWD)</SelectItem>
                                  <SelectItem value="RWD">Rear-Wheel Drive (RWD)</SelectItem>
                                  <SelectItem value="AWD">All-Wheel Drive (AWD)</SelectItem>
                                  <SelectItem value="4WD">Four-Wheel Drive (4WD)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="bodyStyle">Body Style</Label>
                              <Select value={carForm.bodyStyle || ""} onValueChange={(value) => setCarForm(prev => ({ ...prev, bodyStyle: value }))}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select body style" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Sedan">Sedan</SelectItem>
                                  <SelectItem value="SUV">SUV</SelectItem>
                                  <SelectItem value="Hatchback">Hatchback</SelectItem>
                                  <SelectItem value="Coupe">Coupe</SelectItem>
                                  <SelectItem value="Convertible">Convertible</SelectItem>
                                  <SelectItem value="Wagon">Wagon</SelectItem>
                                  <SelectItem value="Truck">Truck</SelectItem>
                                  <SelectItem value="Van">Van</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="numberOfSeats">Number of Seats</Label>
                              <Input
                                id="numberOfSeats"
                                type="number"
                                min="2"
                                max="8"
                                value={carForm.numberOfSeats || ""}
                                onChange={(e) => setCarForm(prev => ({ ...prev, numberOfSeats: e.target.value ? parseInt(e.target.value) : undefined }))}
                                placeholder="5"
                              />
                            </div>
                            <div>
                              <Label htmlFor="numberOfDoors">Number of Doors</Label>
                              <Input
                                id="numberOfDoors"
                                type="number"
                                min="2"
                                max="5"
                                value={carForm.numberOfDoors || ""}
                                onChange={(e) => setCarForm(prev => ({ ...prev, numberOfDoors: e.target.value ? parseInt(e.target.value) : undefined }))}
                                placeholder="4"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="interiorColor">Interior Color</Label>
                              <Input
                                id="interiorColor"
                                value={carForm.interiorColor || ""}
                                onChange={(e) => setCarForm(prev => ({ ...prev, interiorColor: e.target.value }))}
                                placeholder="Black"
                              />
                            </div>
                            <div>
                              <Label htmlFor="trim">Trim Level</Label>
                              <Input
                                id="trim"
                                value={carForm.trim || ""}
                                onChange={(e) => setCarForm(prev => ({ ...prev, trim: e.target.value }))}
                                placeholder="LT, EX, Premium, etc."
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="vin">VIN (Auto-populates car details)</Label>
                          <Input
                            id="vin"
                            value={carForm.vin || ""}
                            onChange={(e) => handleVinChange(e.target.value)}
                            placeholder="Enter 17-character VIN"
                            maxLength={17}
                            className="font-mono"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Enter VIN to automatically populate make, model, year and other details
                          </p>
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={carForm.description || ""}
                            onChange={(e) => setCarForm(prev => ({ ...prev, description: e.target.value }))}
                          />
                        </div>
                        
                        <div>
                          <Label>Car Images</Label>
                          <ImageUpload
                            images={carForm.images || []}
                            onImagesChange={(images) => setCarForm(prev => ({ ...prev, images }))}
                            carId={editingCar?.id?.toString() || "new"}
                            maxImages={10}
                          />
                        </div>

                        {/* Features & Equipment Management */}
                        <div>
                          <Label>Features & Equipment</Label>
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <Input
                                placeholder="Add new feature (e.g., Bluetooth, Backup Camera)"
                                value={newFeature}
                                onChange={(e) => setNewFeature(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                              />
                              <Button type="button" onClick={addFeature} variant="outline">
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md bg-gray-50">
                              {carFeatures.length === 0 ? (
                                <span className="text-gray-500 text-sm">No features added yet</span>
                              ) : (
                                carFeatures.map((feature, index) => (
                                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                    {feature}
                                    <button
                                      type="button"
                                      onClick={() => removeFeature(feature)}
                                      className="ml-1 text-gray-500 hover:text-red-500"
                                    >
                                      ×
                                    </button>
                                  </Badge>
                                ))
                              )}
                            </div>
                            <p className="text-xs text-gray-500">
                              Common features: Bluetooth, Backup Camera, Navigation System, Leather Seats, Sunroof, 
                              Heated Seats, Remote Start, Keyless Entry, Apple CarPlay, Android Auto
                            </p>
                          </div>
                        </div>
                        
                        <Button type="submit" disabled={createCarMutation.isPending || updateCarMutation.isPending}>
                          {editingCar ? "Update Car" : "Add Car"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {carsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Car</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Mileage</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cars.map((car: CarType) => (
                        <TableRow key={car.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{car.year} {car.make} {car.model}</p>
                              <p className="text-sm text-gray-500">{car.color} • {car.fuelType}</p>
                            </div>
                          </TableCell>
                          <TableCell>{formatPrice(car.price)}</TableCell>
                          <TableCell>{car.mileage.toLocaleString()} mi</TableCell>
                          <TableCell>
                            <Select 
                              value={car.status} 
                              onValueChange={(status) => updateCarStatusMutation.mutate({ id: car.id, status })}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="available">Available</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="sold">Sold</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" onClick={() => handleEditCar(car)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Car</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this car? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteCarMutation.mutate(car.id)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Manage Services</CardTitle>
                  <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        onClick={() => {
                          setEditingService(null);
                          setServiceForm({
                            name: "",
                            description: "",
                            startingPrice: "",
                            category: "maintenance",
                            icon: "fas fa-wrench",
                            image: "",
                            features: [],
                            duration: "",
                            isActive: true,
                          });
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Service
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleServiceSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="serviceName">Service Name</Label>
                          <Input
                            id="serviceName"
                            value={serviceForm.name}
                            onChange={(e) => setServiceForm(prev => ({ ...prev, name: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="serviceDescription">Description</Label>
                          <Textarea
                            id="serviceDescription"
                            value={serviceForm.description}
                            onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="startingPrice">Starting Price</Label>
                            <Input
                              id="startingPrice"
                              type="number"
                              step="0.01"
                              value={serviceForm.startingPrice}
                              onChange={(e) => setServiceForm(prev => ({ ...prev, startingPrice: e.target.value }))}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="duration">Duration</Label>
                            <Input
                              id="duration"
                              value={serviceForm.duration || ""}
                              onChange={(e) => setServiceForm(prev => ({ ...prev, duration: e.target.value }))}
                              placeholder="e.g., 1-2 hours"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select value={serviceForm.category} onValueChange={(value) => setServiceForm(prev => ({ ...prev, category: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="maintenance">Maintenance</SelectItem>
                              <SelectItem value="repair">Repair</SelectItem>
                              <SelectItem value="diagnostic">Diagnostic</SelectItem>
                              <SelectItem value="cosmetic">Cosmetic</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button type="submit" disabled={createServiceMutation.isPending || updateServiceMutation.isPending}>
                          {editingService ? "Update Service" : "Add Service"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {servicesLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Starting Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {services?.map((service) => (
                        <TableRow key={service.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{service.name}</p>
                              <p className="text-sm text-gray-500 truncate max-w-xs">{service.description}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">{service.category}</Badge>
                          </TableCell>
                          <TableCell>{formatPrice(service.startingPrice)}</TableCell>
                          <TableCell>
                            <Badge className={service.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                              {service.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" onClick={() => handleEditService(service)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Service</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this service? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteServiceMutation.mutate(service.id)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials">
            <Card>
              <CardHeader>
                <CardTitle>Manage Testimonials</CardTitle>
              </CardHeader>
              <CardContent>
                {testimonialsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Comment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testimonials?.map((testimonial) => (
                        <TableRow key={testimonial.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{testimonial.name}</p>
                              <p className="text-sm text-gray-500">{testimonial.role}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className={`text-yellow-400 ${i < testimonial.rating ? '' : 'opacity-30'}`}>
                                  ★
                                </span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm truncate max-w-xs">{testimonial.comment}</p>
                          </TableCell>
                          <TableCell>
                            <Badge className={testimonial.isApproved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                              {testimonial.isApproved ? "Approved" : "Pending"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant={testimonial.isApproved ? "outline" : "default"}
                                onClick={() => updateTestimonialMutation.mutate({ 
                                  id: testimonial.id, 
                                  data: { isApproved: !testimonial.isApproved }
                                })}
                              >
                                {testimonial.isApproved ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this testimonial? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteTestimonialMutation.mutate(testimonial.id)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Service Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Service Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {bookingsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {serviceBookings?.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{booking.fullName}</p>
                              <p className="text-sm text-gray-500">{booking.phone}</p>
                            </div>
                          </TableCell>
                          <TableCell>{booking.serviceType}</TableCell>
                          <TableCell>{booking.vehicleInfo}</TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{booking.preferredDate}</p>
                              <p className="text-sm text-gray-500">{booking.preferredTime}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select 
                              value={booking.status} 
                              onValueChange={(status) => updateBookingStatusMutation.mutate({ id: booking.id, status })}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Messages Tab */}
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Contact Messages</CardTitle>
              </CardHeader>
              <CardContent>
                {messagesLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contactMessages?.map((message) => (
                        <TableRow key={message.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{message.name}</p>
                              <p className="text-sm text-gray-500">{message.email}</p>
                              {message.phone && <p className="text-xs text-gray-400">{message.phone}</p>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {message.subject || 'General Inquiry'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm truncate max-w-xs">{message.message}</p>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">
                              {new Date(message.createdAt!).toLocaleDateString()}
                            </p>
                          </TableCell>
                          <TableCell>
                            <Select 
                              value={message.status} 
                              onValueChange={(status) => updateMessageStatusMutation.mutate({ id: message.id, status })}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="unread">Unread</SelectItem>
                                <SelectItem value="read">Read</SelectItem>
                                <SelectItem value="responded">Responded</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { X, Plus, Scale, Car as CarIcon, DollarSign, Gauge, Calendar, Fuel, Settings, Palette } from "lucide-react";
import { formatPrice, formatMileage } from "@/lib/api";
import type { Car } from "@shared/schema";

interface CarComparisonProps {
  initialCars?: Car[];
  maxComparisons?: number;
}

export default function CarComparison({ initialCars = [], maxComparisons = 3 }: CarComparisonProps) {
  const [selectedCars, setSelectedCars] = useState<Car[]>(initialCars);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: carsData } = useQuery<{ cars: Car[], total: number }>({
    queryKey: ["/api/cars", { limit: 100, status: "available" }],
  });
  
  const availableCars = carsData?.cars || [];

  const addCarToComparison = (car: Car) => {
    if (selectedCars.length < maxComparisons && !selectedCars.find(c => c.id === car.id)) {
      setSelectedCars([...selectedCars, car]);
    }
  };

  const removeCarFromComparison = (carId: number) => {
    setSelectedCars(selectedCars.filter(car => car.id !== carId));
  };

  const clearComparison = () => {
    setSelectedCars([]);
  };

  const getComparisonData = () => {
    return [
      {
        label: "Price",
        icon: <DollarSign className="h-4 w-4" />,
        getValue: (car: Car) => formatPrice(car.price),
        isNumeric: true,
        rawValue: (car: Car) => parseFloat(car.price.replace(/[^0-9.-]+/g, ""))
      },
      {
        label: "Year",
        icon: <Calendar className="h-4 w-4" />,
        getValue: (car: Car) => car.year.toString(),
        isNumeric: true,
        rawValue: (car: Car) => car.year
      },
      {
        label: "Mileage",
        icon: <Gauge className="h-4 w-4" />,
        getValue: (car: Car) => formatMileage(car.mileage),
        isNumeric: true,
        rawValue: (car: Car) => car.mileage
      },
      {
        label: "MPG City",
        icon: <Fuel className="h-4 w-4" />,
        getValue: (car: Car) => car.mpgCity ? `${car.mpgCity} mpg` : "N/A",
        isNumeric: true,
        rawValue: (car: Car) => car.mpgCity || 0
      },
      {
        label: "MPG Highway",
        icon: <Fuel className="h-4 w-4" />,
        getValue: (car: Car) => car.mpgHighway ? `${car.mpgHighway} mpg` : "N/A",
        isNumeric: true,
        rawValue: (car: Car) => car.mpgHighway || 0
      },
      {
        label: "Safety Rating",
        icon: <CarIcon className="h-4 w-4" />,
        getValue: (car: Car) => car.safetyRating ? `${car.safetyRating}/5 stars` : "N/A",
        isNumeric: true,
        rawValue: (car: Car) => parseFloat(car.safetyRating) || 0
      },
      {
        label: "Engine",
        icon: <Settings className="h-4 w-4" />,
        getValue: (car: Car) => car.engine || "N/A",
        isNumeric: false
      },
      {
        label: "Drivetrain",
        icon: <Settings className="h-4 w-4" />,
        getValue: (car: Car) => car.drivetrain || "N/A",
        isNumeric: false
      },
      {
        label: "Fuel Type",
        icon: <Fuel className="h-4 w-4" />,
        getValue: (car: Car) => car.fuelType,
        isNumeric: false
      },
      {
        label: "Transmission",
        icon: <Settings className="h-4 w-4" />,
        getValue: (car: Car) => car.transmission,
        isNumeric: false
      },
      {
        label: "Body Style",
        icon: <CarIcon className="h-4 w-4" />,
        getValue: (car: Car) => car.bodyStyle || "N/A",
        isNumeric: false
      },
      {
        label: "Condition",
        icon: <CarIcon className="h-4 w-4" />,
        getValue: (car: Car) => car.condition,
        isNumeric: false
      },
      {
        label: "Color",
        icon: <Palette className="h-4 w-4" />,
        getValue: (car: Car) => car.color,
        isNumeric: false
      },
      {
        label: "Interior Color",
        icon: <Palette className="h-4 w-4" />,
        getValue: (car: Car) => car.interiorColor || "N/A",
        isNumeric: false
      },
      {
        label: "Doors",
        icon: <CarIcon className="h-4 w-4" />,
        getValue: (car: Car) => car.numberOfDoors ? `${car.numberOfDoors} doors` : "N/A",
        isNumeric: true,
        rawValue: (car: Car) => car.numberOfDoors || 0
      },
      {
        label: "Seats",
        icon: <CarIcon className="h-4 w-4" />,
        getValue: (car: Car) => car.numberOfSeats ? `${car.numberOfSeats} seats` : "N/A",
        isNumeric: true,
        rawValue: (car: Car) => car.numberOfSeats || 0
      },
    ];
  };

  const getBestValue = (attribute: any) => {
    if (!attribute.isNumeric || selectedCars.length === 0) return null;
    
    const values = selectedCars.map(car => attribute.rawValue(car));
    
    // For price and mileage, lower is better
    if (attribute.label === "Price" || attribute.label === "Mileage") {
      return Math.min(...values);
    }
    // For year, MPG, safety rating, doors, seats - higher is better
    if (attribute.label === "Year" || attribute.label === "MPG City" || 
        attribute.label === "MPG Highway" || attribute.label === "Safety Rating" ||
        attribute.label === "Doors" || attribute.label === "Seats") {
      return Math.max(...values);
    }
    
    return null;
  };

  const isBestValue = (car: Car, attribute: any) => {
    const bestValue = getBestValue(attribute);
    return bestValue !== null && attribute.rawValue(car) === bestValue;
  };

  if (selectedCars.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-blue-600" />
            Car Comparison Tool
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Compare Cars Side by Side</h3>
            <p className="text-gray-500 mb-4">Select up to {maxComparisons} cars to compare their features and specifications.</p>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Cars to Compare
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Select Cars to Compare</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {availableCars.map((car) => (
                    <Card 
                      key={car.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => {
                        addCarToComparison(car);
                        if (selectedCars.length + 1 >= maxComparisons) {
                          setIsDialogOpen(false);
                        }
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="aspect-video bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                          {car.images && car.images.length > 0 ? (
                            <img 
                              src={car.images[0]} 
                              alt={`${car.year} ${car.make} ${car.model}`}
                              className="w-full h-full object-cover rounded-md"
                            />
                          ) : (
                            <CarIcon className="h-8 w-8 text-gray-400" />
                          )}
                        </div>
                        <h4 className="font-semibold text-sm">{car.year} {car.make} {car.model}</h4>
                        <p className="text-blue-600 font-bold text-sm">{formatPrice(car.price)}</p>
                        <p className="text-gray-500 text-xs">{formatMileage(car.mileage)}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-blue-600" />
            Car Comparison ({selectedCars.length}/{maxComparisons})
          </CardTitle>
          <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={selectedCars.length >= maxComparisons}>
                  <Plus className="mr-1 h-3 w-3" />
                  Add Car
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Add Car to Comparison</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {availableCars
                    .filter((car) => !selectedCars.find(c => c.id === car.id))
                    .map((car) => (
                    <Card 
                      key={car.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => {
                        addCarToComparison(car);
                        setIsDialogOpen(false);
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="aspect-video bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                          {car.images && car.images.length > 0 ? (
                            <img 
                              src={car.images[0]} 
                              alt={`${car.year} ${car.make} ${car.model}`}
                              className="w-full h-full object-cover rounded-md"
                            />
                          ) : (
                            <CarIcon className="h-8 w-8 text-gray-400" />
                          )}
                        </div>
                        <h4 className="font-semibold text-sm">{car.year} {car.make} {car.model}</h4>
                        <p className="text-blue-600 font-bold text-sm">{formatPrice(car.price)}</p>
                        <p className="text-gray-500 text-xs">{formatMileage(car.mileage)}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm" onClick={clearComparison}>
              Clear All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Mobile Layout */}
        <div className="block md:hidden">
          {selectedCars.map((car, carIndex) => (
            <Card key={car.id} className="mb-6">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="aspect-video bg-gray-100 rounded-md mb-3 flex items-center justify-center w-full max-w-xs mx-auto">
                      {car.images && car.images.length > 0 ? (
                        <img 
                          src={car.images[0]} 
                          alt={`${car.year} ${car.make} ${car.model}`}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <CarIcon className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <h4 className="font-semibold text-center">{car.year} {car.make} {car.model}</h4>
                    <p className="text-blue-600 font-bold text-center text-lg">{formatPrice(car.price)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-red-100 ml-2"
                    onClick={() => removeCarFromComparison(car.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {getComparisonData().map((attribute) => (
                    <div key={attribute.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-2 font-medium text-gray-700 flex-1">
                        {attribute.icon}
                        <span className="text-sm">{attribute.label}</span>
                      </div>
                      <div className={`px-3 py-1 rounded-md text-sm font-medium ${
                        isBestValue(car, attribute) 
                          ? 'bg-green-50 border border-green-200 text-green-800' 
                          : 'bg-gray-50 text-gray-700'
                      }`}>
                        {attribute.getValue(car)}
                        {isBestValue(car, attribute) && (
                          <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 text-xs">
                            Best
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block overflow-x-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-w-max">
            {/* Attribute Column */}
            <div className="space-y-4 min-w-48">
              <div className="h-48 flex items-end pb-4">
                <h3 className="font-semibold text-lg">Specifications</h3>
              </div>
              {getComparisonData().map((attribute) => (
                <div key={attribute.label} className="h-12 flex items-center gap-2 font-medium">
                  {attribute.icon}
                  {attribute.label}
                </div>
              ))}
            </div>

            {/* Car Columns */}
            {selectedCars.map((car) => (
              <div key={car.id} className="space-y-4 min-w-64">
                {/* Car Header */}
                <Card className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-red-100"
                    onClick={() => removeCarFromComparison(car.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <CardContent className="p-4">
                    <div className="aspect-video bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                      {car.images && car.images.length > 0 ? (
                        <img 
                          src={car.images[0]} 
                          alt={`${car.year} ${car.make} ${car.model}`}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <CarIcon className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <h4 className="font-semibold text-sm">{car.year} {car.make} {car.model}</h4>
                    <p className="text-blue-600 font-bold">{formatPrice(car.price)}</p>
                  </CardContent>
                </Card>

                {/* Car Attributes */}
                {getComparisonData().map((attribute) => (
                  <div key={attribute.label} className="h-12 flex items-center">
                    <div className={`px-3 py-2 rounded-md w-full text-center text-sm ${
                      isBestValue(car, attribute) 
                        ? 'bg-green-50 border border-green-200 text-green-800 font-semibold' 
                        : 'bg-gray-50'
                    }`}>
                      {attribute.getValue(car)}
                      {isBestValue(car, attribute) && (
                        <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 text-xs">
                          Best
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
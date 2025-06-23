import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { X, Filter } from "lucide-react";
import type { CarFilters, Car } from "@shared/schema";

interface CarFiltersProps {
  filters: Partial<CarFilters>;
  onFiltersChange: (filters: Partial<CarFilters>) => void;
}

export default function CarFilters({ filters, onFiltersChange }: CarFiltersProps) {
  const [localFilters, setLocalFilters] = useState<Partial<CarFilters>>(filters);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Get all cars for dynamic filtering
  const { data: allCarsData } = useQuery<{ cars: Car[], total: number }>({
    queryKey: ["/api/cars", { limit: 1000 }], // Get all cars for filtering
  });

  // Generate dynamic make list from database
  const availableMakes = (() => {
    if (!allCarsData?.cars) return [];
    const makes = new Set<string>();
    allCarsData.cars.forEach(car => {
      if (car.make?.trim()) {
        makes.add(car.make.trim());
      }
    });
    return Array.from(makes).sort();
  })();

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof CarFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleFuelTypeChange = (fuelType: string, checked: boolean) => {
    const currentFuelTypes = localFilters.fuelType || [];
    let newFuelTypes;
    
    if (checked) {
      newFuelTypes = [...currentFuelTypes, fuelType];
    } else {
      newFuelTypes = currentFuelTypes.filter(type => type !== fuelType);
    }
    
    handleFilterChange("fuelType", newFuelTypes.length > 0 ? newFuelTypes : undefined);
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    setShowMobileFilters(false);
    // Scroll to top when filters are applied
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    const clearedFilters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    return Object.values(localFilters).filter(value => 
      value !== undefined && value !== "" && 
      (Array.isArray(value) ? value.length > 0 : true)
    ).length;
  };

  const removeFilter = (key: keyof CarFilters) => {
    const newFilters = { ...localFilters };
    delete newFilters[key];
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const fuelTypes = ["Gasoline", "Hybrid", "Electric", "Diesel"];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentYear - i);

  const filterContent = (
    <>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filter Results
          </CardTitle>
          {getActiveFilterCount() > 0 && (
            <Badge variant="secondary">{getActiveFilterCount()}</Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Active Filters */}
        {getActiveFilterCount() > 0 && (
          <div>
            <Label className="text-sm font-medium">Active Filters</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {localFilters.make && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => removeFilter("make")}>
                  Make: {localFilters.make} <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
              {localFilters.model && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => removeFilter("model")}>
                  Model: {localFilters.model} <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
              {(localFilters.minPrice || localFilters.maxPrice) && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => {
                  removeFilter("minPrice");
                  removeFilter("maxPrice");
                }}>
                  Price Range <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
              {localFilters.fuelType && localFilters.fuelType.length > 0 && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => removeFilter("fuelType")}>
                  Fuel Types ({localFilters.fuelType.length}) <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
            </div>
            <Separator className="mt-4" />
          </div>
        )}

        {/* Make */}
        <div>
          <Label htmlFor="make" className="text-sm font-medium">Make</Label>
          <Select 
            value={Array.isArray(localFilters.make) ? localFilters.make[0] || "any" : localFilters.make || "any"} 
            onValueChange={(value) => handleFilterChange("make", value === "any" ? undefined : value)}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Any Make" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Make</SelectItem>
              {availableMakes.map(make => (
                <SelectItem key={make} value={make}>{make}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Model */}
        <div>
          <Label htmlFor="model" className="text-sm font-medium">Model</Label>
          <Input
            id="model"
            placeholder="Enter model"
            value={localFilters.model || ""}
            onChange={(e) => handleFilterChange("model", e.target.value || undefined)}
            className="mt-2"
          />
        </div>

        {/* Price Range */}
        <div>
          <Label className="text-sm font-medium">Price Range</Label>
          <div className="flex items-center space-x-2 mt-2">
            <Input
              type="number"
              placeholder="Min"
              value={localFilters.minPrice || ""}
              onChange={(e) => handleFilterChange("minPrice", e.target.value ? Number(e.target.value) : undefined)}
            />
            <span className="text-gray-500">-</span>
            <Input
              type="number"
              placeholder="Max"
              value={localFilters.maxPrice || ""}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </div>

        {/* Year Range */}
        <div>
          <Label className="text-sm font-medium">Year</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Select 
              value={localFilters.minYear?.toString() || "any"} 
              onValueChange={(value) => handleFilterChange("minYear", value === "any" ? undefined : Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Min Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Year</SelectItem>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select 
              value={localFilters.maxYear?.toString() || "any"} 
              onValueChange={(value) => handleFilterChange("maxYear", value === "any" ? undefined : Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Max Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Year</SelectItem>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Max Mileage */}
        <div>
          <Label htmlFor="maxMileage" className="text-sm font-medium">Max Mileage</Label>
          <Select 
            value={localFilters.maxMileage?.toString() || "any"} 
            onValueChange={(value) => handleFilterChange("maxMileage", value === "any" ? undefined : Number(value))}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Any Mileage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Mileage</SelectItem>
              <SelectItem value="30000">Under 30,000</SelectItem>
              <SelectItem value="50000">Under 50,000</SelectItem>
              <SelectItem value="75000">Under 75,000</SelectItem>
              <SelectItem value="100000">Under 100,000</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Fuel Type */}
        <div>
          <Label className="text-sm font-medium">Fuel Type</Label>
          <div className="space-y-2 mt-2">
            {fuelTypes.map((fuelType) => (
              <div key={fuelType} className="flex items-center space-x-2">
                <Checkbox
                  id={`fuel-${fuelType}`}
                  checked={localFilters.fuelType?.includes(fuelType) || false}
                  onCheckedChange={(checked) => handleFuelTypeChange(fuelType, checked as boolean)}
                />
                <label
                  htmlFor={`fuel-${fuelType}`}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {fuelType}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-4">
          <Button onClick={applyFilters} className="w-full form-button-primary">
            Apply Filters
          </Button>
          {getActiveFilterCount() > 0 && (
            <Button variant="outline" onClick={clearFilters} className="w-full">
              Clear All Filters
            </Button>
          )}
        </div>
      </CardContent>
    </>
  );

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <Card className="sticky top-24">
          {filterContent}
        </Card>
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setShowMobileFilters(true)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
        </Button>
      </div>

      {/* Mobile Filter Overlay */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="bg-white h-full overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-4 py-3 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowMobileFilters(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-4">
              <div className="space-y-6">
                {filterContent}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

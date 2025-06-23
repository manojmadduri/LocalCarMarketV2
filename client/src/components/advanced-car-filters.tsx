import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, ChevronUp, X, Search } from "lucide-react";
import type { CarFilters } from "@shared/schema";

interface AdvancedCarFiltersProps {
  filters: Partial<CarFilters>;
  onFiltersChange: (filters: Partial<CarFilters>) => void;
  onApplyFilters: (filters: Partial<CarFilters>) => void;
  onReset: () => void;
}

export default function AdvancedCarFilters({ filters, onFiltersChange, onApplyFilters, onReset }: AdvancedCarFiltersProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    basic: true,
    price: true,
    specs: false,
    features: false,
    history: false,
  });

  const [tempFilters, setTempFilters] = useState<Partial<CarFilters>>(filters);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleArrayFilter = (key: keyof CarFilters, value: string, checked: boolean) => {
    const currentArray = (tempFilters[key] as string[]) || [];
    const newArray = checked 
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value);
    const newFilters = { ...tempFilters, [key]: newArray.length > 0 ? newArray : undefined };
    setTempFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleRangeFilter = (key: string, values: number[]) => {
    let newFilters = { ...tempFilters };
    
    if (key === 'price') {
      newFilters = { 
        ...newFilters,
        minPrice: values[0] > 0 ? values[0] : undefined,
        maxPrice: values[1] < 100000 ? values[1] : undefined
      };
    } else if (key === 'year') {
      newFilters = { 
        ...newFilters,
        minYear: values[0] > 2000 ? values[0] : undefined,
        maxYear: values[1] < new Date().getFullYear() ? values[1] : undefined
      };
    } else if (key === 'mileage') {
      newFilters = { 
        ...newFilters,
        minMileage: values[0] > 0 ? values[0] : undefined,
        maxMileage: values[1] < 200000 ? values[1] : undefined
      };
    }
    
    setTempFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleApply = () => {
    onApplyFilters(tempFilters);
  };

  const handleReset = () => {
    setTempFilters({});
    onReset();
  };

  const makeOptions = ["Toyota", "Honda", "Ford", "Chevrolet", "BMW", "Mercedes", "Audi", "Nissan", "Hyundai", "Kia", "Mazda", "Subaru"];
  const fuelTypes = ["Gasoline", "Hybrid", "Electric", "Diesel"];
  const transmissions = ["Automatic", "Manual", "CVT"];
  const drivetrains = ["FWD", "RWD", "AWD", "4WD"];
  const bodyStyles = ["Sedan", "SUV", "Truck", "Coupe", "Hatchback", "Convertible", "Wagon"];
  const colors = ["Black", "White", "Silver", "Gray", "Red", "Blue", "Green", "Brown", "Gold", "Orange"];
  const conditions = ["New", "Used", "Certified Pre-Owned"];
  const vehicleHistories = ["Clean", "Accident Reported", "Single Owner", "Multiple Owners"];
  const features = ["Backup Camera", "Bluetooth", "Navigation", "Sunroof", "Leather Seats", "Heated Seats", "Premium Audio", "Lane Assist", "Adaptive Cruise Control"];

  return (
    <Card className="w-full filter-card shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">Filters</CardTitle>
        <Button variant="outline" size="sm" onClick={onReset} className="btn-automotive">
          <X className="h-4 w-4 mr-2" />
          Reset all filters
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Filters */}
        <Collapsible open={openSections.basic} onOpenChange={() => toggleSection('basic')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded">
            <span className="font-medium">Basic</span>
            {openSections.basic ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4">
            <div>
              <Label>Make</Label>
              <Select value={Array.isArray(tempFilters.make) ? tempFilters.make[0] : tempFilters.make || "any"} onValueChange={(value) => {
                const newFilters = { ...tempFilters, make: value === "any" ? undefined : value };
                setTempFilters(newFilters);
                onFiltersChange(newFilters);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Make" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Make</SelectItem>
                  {makeOptions.map(make => (
                    <SelectItem key={make} value={make}>{make}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Model</Label>
              <Input 
                placeholder="Enter model"
                value={filters.model || ""}
                onChange={(e) => onFiltersChange({ model: e.target.value || undefined })}
              />
            </div>

            <div>
              <Label>Condition</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {conditions.map(condition => (
                  <label key={condition} className="flex items-center space-x-2">
                    <Checkbox 
                      checked={(filters.condition || []).includes(condition)}
                      onCheckedChange={(checked) => handleArrayFilter('condition', condition, checked as boolean)}
                    />
                    <span className="text-sm">{condition}</span>
                  </label>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Price & Payment */}
        <Collapsible open={openSections.price} onOpenChange={() => toggleSection('price')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded">
            <span className="font-medium">Price & Payment</span>
            {openSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4">
            <div>
              <Label>Price Range</Label>
              <div className="px-4 py-6">
                <Slider
                  min={0}
                  max={100000}
                  step={500}
                  value={[filters.minPrice || 0, filters.maxPrice || 100000]}
                  onValueChange={(values) => handleRangeFilter('price', values)}
                  className="w-full touch-manipulation"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-3">
                  <span>${(filters.minPrice || 0).toLocaleString()}</span>
                  <span>${(filters.maxPrice || 100000).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <Label>Year Range</Label>
              <div className="px-4 py-6">
                <Slider
                  min={2000}
                  max={new Date().getFullYear()}
                  step={1}
                  value={[filters.minYear || 2000, filters.maxYear || new Date().getFullYear()]}
                  onValueChange={(values) => handleRangeFilter('year', values)}
                  className="w-full touch-manipulation"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-3">
                  <span>{filters.minYear || 2000}</span>
                  <span>{filters.maxYear || new Date().getFullYear()}</span>
                </div>
              </div>
            </div>

            <div>
              <Label>Mileage Range</Label>
              <div className="px-4 py-6">
                <Slider
                  min={0}
                  max={200000}
                  step={2500}
                  value={[filters.minMileage || 0, filters.maxMileage || 200000]}
                  onValueChange={(values) => handleRangeFilter('mileage', values)}
                  className="w-full touch-manipulation"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-3">
                  <span>{(filters.minMileage || 0).toLocaleString()} mi</span>
                  <span>{(filters.maxMileage || 200000).toLocaleString()} mi</span>
                </div>
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <Checkbox 
                  checked={filters.financing === true}
                  onCheckedChange={(checked) => onFiltersChange({ financing: checked ? true : undefined })}
                />
                <span className="text-sm">Financing Available</span>
              </label>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Specifications */}
        <Collapsible open={openSections.specs} onOpenChange={() => toggleSection('specs')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded">
            <span className="font-medium">Specifications</span>
            {openSections.specs ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4">
            <div>
              <Label>Fuel Type</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {fuelTypes.map(fuel => (
                  <label key={fuel} className="flex items-center space-x-2">
                    <Checkbox 
                      checked={(filters.fuelType || []).includes(fuel)}
                      onCheckedChange={(checked) => handleArrayFilter('fuelType', fuel, checked as boolean)}
                    />
                    <span className="text-sm">{fuel}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label>Transmission</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {transmissions.map(trans => (
                  <label key={trans} className="flex items-center space-x-2">
                    <Checkbox 
                      checked={(filters.transmission || []).includes(trans)}
                      onCheckedChange={(checked) => handleArrayFilter('transmission', trans, checked as boolean)}
                    />
                    <span className="text-sm">{trans}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label>Drivetrain</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {drivetrains.map(drive => (
                  <label key={drive} className="flex items-center space-x-2">
                    <Checkbox 
                      checked={(filters.drivetrain || []).includes(drive)}
                      onCheckedChange={(checked) => handleArrayFilter('drivetrain', drive, checked as boolean)}
                    />
                    <span className="text-sm">{drive}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label>Body Style</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {bodyStyles.map(body => (
                  <label key={body} className="flex items-center space-x-2">
                    <Checkbox 
                      checked={(filters.bodyStyle || []).includes(body)}
                      onCheckedChange={(checked) => handleArrayFilter('bodyStyle', body, checked as boolean)}
                    />
                    <span className="text-sm">{body}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label>Exterior Color</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {colors.map(color => (
                  <label key={color} className="flex items-center space-x-2">
                    <Checkbox 
                      checked={(filters.color || []).includes(color)}
                      onCheckedChange={(checked) => handleArrayFilter('color', color, checked as boolean)}
                    />
                    <span className="text-sm">{color}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label>Interior Color</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {colors.map(color => (
                  <label key={color} className="flex items-center space-x-2">
                    <Checkbox 
                      checked={(filters.interiorColor || []).includes(color)}
                      onCheckedChange={(checked) => handleArrayFilter('interiorColor', color, checked as boolean)}
                    />
                    <span className="text-sm">{color}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Number of Seats</Label>
                <Select 
                  value={filters.numberOfSeats?.toString() || ""} 
                  onValueChange={(value) => onFiltersChange({ numberOfSeats: value ? parseInt(value) : undefined })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any seats" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any seats</SelectItem>
                    {[2, 4, 5, 6, 7, 8].map(seats => (
                      <SelectItem key={seats} value={seats.toString()}>{seats} seats</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Number of Doors</Label>
                <Select 
                  value={filters.numberOfDoors?.toString() || ""} 
                  onValueChange={(value) => onFiltersChange({ numberOfDoors: value ? parseInt(value) : undefined })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any doors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any doors</SelectItem>
                    {[2, 4, 5].map(doors => (
                      <SelectItem key={doors} value={doors.toString()}>{doors} doors</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Features */}
        <Collapsible open={openSections.features} onOpenChange={() => toggleSection('features')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded">
            <span className="font-medium">Features</span>
            {openSections.features ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4">
            <div>
              <Label>Desired Features</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {features.map(feature => (
                  <label key={feature} className="flex items-center space-x-2">
                    <Checkbox 
                      checked={(filters.features || []).includes(feature)}
                      onCheckedChange={(checked) => handleArrayFilter('features', feature, checked as boolean)}
                    />
                    <span className="text-sm">{feature}</span>
                  </label>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Vehicle History & Ratings */}
        <Collapsible open={openSections.history} onOpenChange={() => toggleSection('history')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded">
            <span className="font-medium">Vehicle History & Ratings</span>
            {openSections.history ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4">
            <div>
              <Label>Vehicle History</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {vehicleHistories.map(history => (
                  <label key={history} className="flex items-center space-x-2">
                    <Checkbox 
                      checked={(filters.vehicleHistory || []).includes(history)}
                      onCheckedChange={(checked) => handleArrayFilter('vehicleHistory', history, checked as boolean)}
                    />
                    <span className="text-sm">{history}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label>Minimum Safety Rating</Label>
              <Select 
                value={filters.minSafetyRating?.toString() || "any"} 
                onValueChange={(value) => onFiltersChange({ minSafetyRating: value === "any" ? undefined : parseFloat(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Rating</SelectItem>
                  <SelectItem value="3.0">3+ Stars</SelectItem>
                  <SelectItem value="4.0">4+ Stars</SelectItem>
                  <SelectItem value="5.0">5 Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Minimum Dealer Rating</Label>
              <Select 
                value={filters.minDealerRating?.toString() || "any"} 
                onValueChange={(value) => onFiltersChange({ minDealerRating: value === "any" ? undefined : parseFloat(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Rating</SelectItem>
                  <SelectItem value="3.0">3+ Stars</SelectItem>
                  <SelectItem value="4.0">4+ Stars</SelectItem>
                  <SelectItem value="5.0">5 Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Maximum Days on Market</Label>
              <Input 
                type="number"
                placeholder="Any"
                value={filters.maxDaysOnMarket || ""}
                onChange={(e) => onFiltersChange({ maxDaysOnMarket: e.target.value ? parseInt(e.target.value) : undefined })}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
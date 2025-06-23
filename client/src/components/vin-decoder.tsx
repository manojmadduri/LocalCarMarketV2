import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, AlertCircle, CheckCircle, Car } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface VinData {
  vin: string;
  make: string;
  model: string;
  year: string;
  bodyStyle: string;
  engine: string;
  fuelType: string;
  transmission: string;
  drivetrain: string;
  vehicleType: string;
  manufacturer: string;
  plantCountry: string;
  series: string;
  trim: string;
  errorCode: string;
  errorText: string;
}

interface VinDecoderProps {
  onVinDecoded?: (data: VinData) => void;
  initialVin?: string;
}

export default function VinDecoder({ onVinDecoded, initialVin = "" }: VinDecoderProps) {
  const [vin, setVin] = useState(initialVin);
  const [result, setResult] = useState<VinData | null>(null);

  const vinDecodeMutation = useMutation({
    mutationFn: async (vinNumber: string) => {
      const response = await fetch(`/api/vin/${vinNumber}`);
      if (!response.ok) {
        throw new Error("Failed to decode VIN");
      }
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
      if (onVinDecoded) {
        onVinDecoded(data);
      }
    },
    onError: (error) => {
      console.error("VIN decode error:", error);
      setResult(null);
    }
  });

  const handleDecode = () => {
    const cleanVin = vin.trim().toUpperCase();
    if (cleanVin.length !== 17) {
      return;
    }
    vinDecodeMutation.mutate(cleanVin);
  };

  const isValidVin = (vinNumber: string) => {
    const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
    return vinRegex.test(vinNumber.toUpperCase());
  };

  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '');
    if (value.length <= 17) {
      setVin(value);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-blue-600" />
          VIN Decoder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="vin">Vehicle Identification Number (VIN)</Label>
          <div className="flex gap-2">
            <Input
              id="vin"
              value={vin}
              onChange={handleVinChange}
              placeholder="Enter 17-character VIN"
              maxLength={17}
              className={`font-mono ${!isValidVin(vin) && vin.length > 0 ? 'border-red-500' : ''}`}
            />
            <Button 
              onClick={handleDecode}
              disabled={!isValidVin(vin) || vinDecodeMutation.isPending}
            >
              {vinDecodeMutation.isPending ? "Decoding..." : "Decode"}
            </Button>
          </div>
          {vin.length > 0 && !isValidVin(vin) && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              VIN must be exactly 17 characters (A-Z, 0-9, excluding I, O, Q)
            </div>
          )}
          <div className="text-xs text-gray-500">
            Character count: {vin.length}/17
          </div>
        </div>

        {vinDecodeMutation.isError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Unable to decode VIN</span>
            </div>
            <p className="text-sm text-red-600 mt-1">
              Please check the VIN number and try again.
            </p>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">VIN Successfully Decoded</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.make && (
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Make</Label>
                  <Badge variant="secondary" className="w-full justify-start">
                    {result.make}
                  </Badge>
                </div>
              )}

              {result.model && (
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Model</Label>
                  <Badge variant="secondary" className="w-full justify-start">
                    {result.model}
                  </Badge>
                </div>
              )}

              {result.year && (
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Year</Label>
                  <Badge variant="secondary" className="w-full justify-start">
                    {result.year}
                  </Badge>
                </div>
              )}

              {result.bodyStyle && (
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Body Style</Label>
                  <Badge variant="secondary" className="w-full justify-start">
                    {result.bodyStyle}
                  </Badge>
                </div>
              )}

              {result.engine && (
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Engine</Label>
                  <Badge variant="secondary" className="w-full justify-start">
                    {result.engine}
                  </Badge>
                </div>
              )}

              {result.fuelType && (
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Fuel Type</Label>
                  <Badge variant="secondary" className="w-full justify-start">
                    {result.fuelType}
                  </Badge>
                </div>
              )}

              {result.transmission && (
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Transmission</Label>
                  <Badge variant="secondary" className="w-full justify-start">
                    {result.transmission}
                  </Badge>
                </div>
              )}

              {result.drivetrain && (
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Drivetrain</Label>
                  <Badge variant="secondary" className="w-full justify-start">
                    {result.drivetrain}
                  </Badge>
                </div>
              )}

              {result.manufacturer && (
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Manufacturer</Label>
                  <Badge variant="secondary" className="w-full justify-start">
                    {result.manufacturer}
                  </Badge>
                </div>
              )}

              {result.plantCountry && (
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Manufacturing Country</Label>
                  <Badge variant="secondary" className="w-full justify-start">
                    {result.plantCountry}
                  </Badge>
                </div>
              )}

              {result.series && (
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Series</Label>
                  <Badge variant="secondary" className="w-full justify-start">
                    {result.series}
                  </Badge>
                </div>
              )}

              {result.trim && (
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Trim</Label>
                  <Badge variant="secondary" className="w-full justify-start">
                    {result.trim}
                  </Badge>
                </div>
              )}
            </div>

            <div className="pt-3 border-t">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Car className="h-3 w-3" />
                <span>Data provided by NHTSA Vehicle API</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
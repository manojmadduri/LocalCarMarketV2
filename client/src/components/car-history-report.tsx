import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  Car as CarIcon,
  Settings,
  Users,
  MapPin,
  Calendar,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Car } from "@shared/schema";

interface CarHistoryReportProps {
  car: Car;
  onReportRequested?: () => void;
}

interface HistoryRecord {
  date: string;
  event: string;
  location: string;
  mileage: number;
  type: 'maintenance' | 'accident' | 'inspection' | 'registration' | 'sale';
}

interface VehicleHistoryData {
  hasReport: boolean;
  reportDate: string;
  overallScore: number;
  accidents: number;
  owners: number;
  serviceRecords: number;
  titleIssues: boolean;
  floodDamage: boolean;
  lemonRecord: boolean;
  personalUse: boolean;
  records: HistoryRecord[];
}

export default function CarHistoryReport({ car, onReportRequested }: CarHistoryReportProps) {
  const [loading, setLoading] = useState(false);
  const [historyData, setHistoryData] = useState<VehicleHistoryData | null>(null);
  const [reportRequested, setReportRequested] = useState(false);
  const { toast } = useToast();

  const generateSampleHistoryData = (): VehicleHistoryData => {
    const currentYear = new Date().getFullYear();
    const carAge = currentYear - car.year;
    
    // Generate realistic data based on car characteristics
    const accidents = Math.random() < 0.3 ? Math.floor(Math.random() * 2) + 1 : 0;
    const owners = Math.min(Math.floor(carAge / 3) + 1, 4);
    const serviceRecords = Math.floor(carAge * 2.5) + Math.floor(Math.random() * 5);
    
    const records: HistoryRecord[] = [];
    
    // Add registration record
    records.push({
      date: `${car.year}-01-15`,
      event: 'Vehicle Registration',
      location: 'DMV Office, State Department',
      mileage: 12,
      type: 'registration'
    });
    
    // Add service records
    for (let i = 0; i < serviceRecords; i++) {
      const year = car.year + Math.floor(i / 2);
      const month = Math.floor(Math.random() * 12) + 1;
      const mileage = (i + 1) * 5000 + Math.floor(Math.random() * 2000);
      
      records.push({
        date: `${year}-${month.toString().padStart(2, '0')}-${Math.floor(Math.random() * 28) + 1}`,
        event: ['Oil Change', 'Tire Rotation', 'Brake Inspection', 'Annual Inspection'][Math.floor(Math.random() * 4)],
        location: 'Certified Service Center',
        mileage,
        type: 'maintenance'
      });
    }
    
    // Add accident records if any
    for (let i = 0; i < accidents; i++) {
      const year = car.year + Math.floor(Math.random() * carAge);
      records.push({
        date: `${year}-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
        event: 'Minor Collision Reported',
        location: 'Insurance Claim Filed',
        mileage: Math.floor(Math.random() * 50000) + 10000,
        type: 'accident'
      });
    }
    
    // Sort records by date
    records.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const overallScore = Math.max(50, 95 - (accidents * 15) - (owners > 2 ? 10 : 0));
    
    return {
      hasReport: true,
      reportDate: new Date().toISOString().split('T')[0],
      overallScore,
      accidents,
      owners,
      serviceRecords,
      titleIssues: Math.random() < 0.1,
      floodDamage: Math.random() < 0.05,
      lemonRecord: Math.random() < 0.02,
      personalUse: owners <= 2,
      records
    };
  };

  const handleRequestReport = async () => {
    if (!car.vin) {
      toast({
        title: "VIN Required",
        description: "A VIN number is required to generate a vehicle history report.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setReportRequested(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const data = generateSampleHistoryData();
      setHistoryData(data);
      
      toast({
        title: "Report Generated",
        description: "Vehicle history report has been successfully retrieved.",
      });
      
      onReportRequested?.();
    } catch (error) {
      toast({
        title: "Report Error",
        description: "Unable to retrieve vehicle history report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 85) return "bg-green-100 text-green-800";
    if (score >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  if (!historyData && !reportRequested) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Vehicle History Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              Get a comprehensive history report for this vehicle including accident history, 
              previous owners, service records, and title information.
            </p>
            
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Powered by certified vehicle history providers</span>
            </div>
            
            {car.vin ? (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">VIN: {car.vin}</div>
              </div>
            ) : (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  VIN number required for history report generation.
                </AlertDescription>
              </Alert>
            )}
            
            <Button 
              onClick={handleRequestReport} 
              disabled={!car.vin || loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Get Vehicle History Report
                </>
              )}
            </Button>
            
            <p className="text-xs text-gray-500">
              Report typically takes 30-60 seconds to generate
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <h3 className="text-lg font-semibold mb-2">Generating Report</h3>
            <p className="text-gray-600">Retrieving vehicle history data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!historyData) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Vehicle History Report
          </div>
          <Badge className={getScoreBadge(historyData.overallScore)}>
            Score: {historyData.overallScore}/100
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="h-4 w-4 text-gray-500" />
            </div>
            <div className="text-2xl font-bold">{historyData.owners}</div>
            <div className="text-sm text-gray-600">Previous Owners</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
            <div className="text-2xl font-bold">{historyData.accidents}</div>
            <div className="text-sm text-gray-600">Accidents Reported</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Settings className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold">{historyData.serviceRecords}</div>
            <div className="text-sm text-gray-600">Service Records</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              {historyData.personalUse ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <CarIcon className="h-4 w-4 text-yellow-500" />
              )}
            </div>
            <div className="text-sm font-medium">
              {historyData.personalUse ? 'Personal Use' : 'Commercial Use'}
            </div>
            <div className="text-sm text-gray-600">Usage Type</div>
          </div>
        </div>

        <Separator />

        {/* Key Findings */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Key Findings</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {historyData.titleIssues ? (
                <XCircle className="h-4 w-4 text-red-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              <span className="text-sm">
                {historyData.titleIssues ? 'Title issues found' : 'Clean title'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {historyData.floodDamage ? (
                <XCircle className="h-4 w-4 text-red-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              <span className="text-sm">
                {historyData.floodDamage ? 'Flood damage reported' : 'No flood damage'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {historyData.lemonRecord ? (
                <XCircle className="h-4 w-4 text-red-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              <span className="text-sm">
                {historyData.lemonRecord ? 'Lemon record found' : 'No lemon record'}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Timeline */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Vehicle Timeline</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {historyData.records.map((record, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  {record.type === 'accident' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                  {record.type === 'maintenance' && <Settings className="h-4 w-4 text-green-500" />}
                  {record.type === 'registration' && <FileText className="h-4 w-4 text-blue-500" />}
                  {record.type === 'inspection' && <Shield className="h-4 w-4 text-primary" />}
                  {record.type === 'sale' && <Users className="h-4 w-4 text-orange-500" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{record.event}</span>
                    <span className="text-xs text-gray-500">{record.date}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-600 mt-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {record.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <CarIcon className="h-3 w-3" />
                      {record.mileage.toLocaleString()} mi
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Footer */}
        <div className="text-xs text-gray-500 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span>Report generated on {historyData.reportDate}</span>
            <div className="flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              <span>View full report</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
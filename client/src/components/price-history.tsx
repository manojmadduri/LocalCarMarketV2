import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Minus, Calendar, DollarSign, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatPrice, formatDate } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface PriceHistoryEntry {
  date: string;
  price: number;
  change?: number;
  changePercent?: number;
  reason?: string;
}

interface PriceHistoryProps {
  carId: number;
  currentPrice: string;
  showChart?: boolean;
}

export default function PriceHistory({ carId, currentPrice, showChart = true }: PriceHistoryProps) {
  const [timeRange, setTimeRange] = useState("6months");

  // Fetch real price history from database
  const { data: priceHistoryData, isLoading } = useQuery({
    queryKey: ['/api/cars', carId, 'price-history'],
    queryFn: () => fetch(`/api/cars/${carId}/price-history`).then(res => res.json())
  });

  const currentPriceNum = parseFloat(currentPrice.replace(/[^0-9.-]+/g, ""));

  // Convert database records to chart format
  const convertToChartData = (dbHistory: any[]): PriceHistoryEntry[] => {
    if (!dbHistory || dbHistory.length === 0) {
      return [];
    }

    const history: PriceHistoryEntry[] = [];
    
    // Sort by date ascending to calculate changes properly
    const sortedHistory = [...dbHistory].sort((a, b) => 
      new Date(a.changedAt).getTime() - new Date(b.changedAt).getTime()
    );
    
    for (let i = 0; i < sortedHistory.length; i++) {
      const record = sortedHistory[i];
      const price = parseFloat(record.newPrice.replace(/[^0-9.-]+/g, ""));
      
      let change = 0;
      let changePercent = 0;
      
      if (i > 0) {
        const previousPrice = parseFloat(sortedHistory[i-1].newPrice.replace(/[^0-9.-]+/g, ""));
        change = price - previousPrice;
        changePercent = previousPrice > 0 ? ((change / previousPrice) * 100) : 0;
      }
      
      history.push({
        date: new Date(record.changedAt).toISOString().split('T')[0],
        price,
        change,
        changePercent,
        reason: record.reason || "Price update"
      });
    }
    
    return history;
  };

  const priceHistory = convertToChartData(priceHistoryData || []);
  
  const latestChange = priceHistory.length > 0 ? priceHistory[priceHistory.length - 1] : null;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Price History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-muted-foreground">Loading price history...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If no price history, show simple message
  if (priceHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Price Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-2">This is a new listing.</p>
            <p className="text-muted-foreground">Price history and trends will be displayed here as the listing ages and market conditions change.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-green-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return "text-red-500";
    if (change < 0) return "text-green-500";
    return "text-gray-500";
  };



  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Price History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Price Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {formatPrice(currentPrice)}
            </div>
            <div className="text-sm text-blue-600">Current Price</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              {getTrendIcon(latestChange?.change || 0)}
            </div>
            <div className={`text-2xl font-bold ${getTrendColor(latestChange?.change || 0)}`}>
              {!latestChange || (latestChange.change || 0) === 0 ? "New Listing" : formatPrice(Math.abs(latestChange.change || 0).toString())}
            </div>
            <div className="text-sm text-gray-600">Price Change</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-900">
              {latestChange ? formatDate(latestChange.date) : formatDate(new Date().toISOString().split('T')[0])}
            </div>
            <div className="text-sm text-green-600">Last Updated</div>
          </div>
        </div>



        {/* Price History Chart */}
        {showChart && priceHistory.length > 1 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Price Trend</h3>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">1 Month</SelectItem>
                  <SelectItem value="3months">3 Months</SelectItem>
                  <SelectItem value="6months">6 Months</SelectItem>
                  <SelectItem value="1year">1 Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    domain={['dataMin - 1000', 'dataMax + 1000']}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value: any) => [formatPrice(value.toString()), "Price"]}
                    labelFormatter={(label) => `Date: ${formatDate(label)}`}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Price History Timeline */}
        <div>
          <h3 className="font-semibold mb-4">Price Timeline</h3>
          <div className="space-y-3">
            {priceHistory.map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getTrendIcon(entry.change || 0)}
                    <span className="font-medium">{formatPrice(entry.price.toString())}</span>
                  </div>
                  {entry.reason && (
                    <Badge variant="outline" className="text-xs">
                      {entry.reason}
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(entry.date)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
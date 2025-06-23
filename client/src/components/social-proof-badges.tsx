import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Eye, Clock, TrendingUp, Users, Star } from "lucide-react";
import type { Car } from "@shared/schema";

interface SocialProofBadgesProps {
  car: Car;
  className?: string;
}

interface AnalyticsData {
  carId: number;
  totalViews: number;
  viewsToday: number;
  viewsThisWeek: number;
  contactInquiries: number;
  phoneClicks: number;
  shareCount: number;
  lastViewedAt: string | null;
}

interface SocialProofData {
  viewCount: number;
  recentViews: number;
  timeOnMarket: number;
  interestLevel: 'high' | 'medium' | 'low';
  priceChange: 'decreased' | 'increased' | 'stable';
  isPopular: boolean;
}

export default function SocialProofBadges({ car, className = "" }: SocialProofBadgesProps) {
  const [socialProof, setSocialProof] = useState<SocialProofData | null>(null);

  // Fetch real analytics data from the database
  const { data: analytics } = useQuery<AnalyticsData>({
    queryKey: [`/api/analytics/${car.id}`],
    staleTime: 30000, // Refresh every 30 seconds
  });

  useEffect(() => {
    if (!analytics) return;

    // Calculate social proof data from real analytics
    const generateSocialProofFromAnalytics = (data: AnalyticsData): SocialProofData => {
      // Calculate days on market (estimate based on car year and current date)
      const currentYear = new Date().getFullYear();
      const estimatedListingDate = new Date(currentYear, 0, 1); // Estimate listing at start of year
      const daysOnMarket = Math.floor((Date.now() - estimatedListingDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Determine popularity based on car characteristics and real data
      const isNewish = car.year >= 2020;
      const isLowMileage = car.mileage < 50000;
      const priceNum = parseFloat(car.price.replace(/[^0-9.-]+/g, ""));
      const isReasonablyPriced = priceNum < 40000;
      const hasHighEngagement = data.contactInquiries > 0 || data.phoneClicks > 0;
      
      const popularityScore = (isNewish ? 1 : 0) + (isLowMileage ? 1 : 0) + (isReasonablyPriced ? 1 : 0) + (hasHighEngagement ? 1 : 0);
      const isPopular = popularityScore >= 2;
      
      // Determine interest level based on real metrics
      let interestLevel: 'high' | 'medium' | 'low' = 'medium';
      if (data.viewsToday > 10 && (data.contactInquiries > 0 || data.phoneClicks > 0)) {
        interestLevel = 'high';
      } else if (data.viewsToday < 3 && data.totalViews < 20) {
        interestLevel = 'low';
      }
      
      // Price change is stable for now (could be enhanced with price history)
      const priceChange: 'decreased' | 'increased' | 'stable' = 'stable';
      
      return {
        viewCount: data.totalViews,
        recentViews: data.viewsToday,
        timeOnMarket: Math.min(daysOnMarket, 60), // Cap at 60 days
        interestLevel,
        priceChange,
        isPopular
      };
    };

    setSocialProof(generateSocialProofFromAnalytics(analytics));
  }, [analytics, car]);

  if (!socialProof) return null;

  const badges = [];

  // Recent views badge
  if (socialProof.recentViews > 10) {
    badges.push(
      <Badge key="views" variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
        <Eye className="h-3 w-3 mr-1" />
        {socialProof.recentViews} viewed today
      </Badge>
    );
  }

  // High interest badge
  if (socialProof.interestLevel === 'high') {
    badges.push(
      <Badge key="interest" variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200">
        <TrendingUp className="h-3 w-3 mr-1" />
        High interest
      </Badge>
    );
  }

  // Popular car badge
  if (socialProof.isPopular) {
    badges.push(
      <Badge key="popular" variant="secondary" className="bg-green-50 text-green-700 border-green-200">
        <Star className="h-3 w-3 mr-1" />
        Popular choice
      </Badge>
    );
  }

  // Recently listed badge
  if (socialProof.timeOnMarket <= 7) {
    badges.push(
      <Badge key="new" variant="secondary" className="bg-primary/10 text-primary border-primary/20">
        <Clock className="h-3 w-3 mr-1" />
        Just listed
      </Badge>
    );
  }

  // Price reduced badge
  if (socialProof.priceChange === 'decreased') {
    badges.push(
      <Badge key="price-drop" variant="secondary" className="bg-red-50 text-red-700 border-red-200">
        <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
        Price reduced
      </Badge>
    );
  }

  // Multiple inquiries badge
  if (socialProof.viewCount > 100) {
    badges.push(
      <Badge key="inquiries" variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-200">
        <Users className="h-3 w-3 mr-1" />
        {socialProof.viewCount}+ views
      </Badge>
    );
  }

  // Show max 3 badges to avoid clutter
  const displayBadges = badges.slice(0, 3);

  if (displayBadges.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {displayBadges}
    </div>
  );
}
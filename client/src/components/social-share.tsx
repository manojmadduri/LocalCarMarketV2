import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Share2, Facebook, Twitter, Linkedin, MessageCircle, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Car } from "@shared/schema";

interface SocialShareProps {
  car: Car;
  trigger?: React.ReactNode;
  onShare?: () => void;
}

export default function SocialShare({ car, trigger, onShare }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Generate the car listing URL
  const currentUrl = window.location.origin;
  const carUrl = `${currentUrl}/cars/${car.id}`;
  
  // Create share content
  const shareTitle = `${car.year} ${car.make} ${car.model}`;
  const shareDescription = `Check out this ${car.condition.toLowerCase()} ${car.year} ${car.make} ${car.model} for ${car.price}! ${car.mileage.toLocaleString()} miles, ${car.fuelType} engine. View more details at The Integrity Auto and Body.`;
  const hashtags = `#UsedCars #${car.make}${car.model.replace(/\s+/g, '')} #TheIntegrityAuto #CarDeals`;

  // Social media share URLs
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(carUrl)}&quote=${encodeURIComponent(`${shareTitle} - ${shareDescription}`)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(carUrl)}&text=${encodeURIComponent(`${shareTitle} - ${shareDescription} ${hashtags}`)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(carUrl)}&title=${encodeURIComponent(shareTitle)}&summary=${encodeURIComponent(shareDescription)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareTitle}\n\n${shareDescription}\n\n${carUrl}`)}`
  };

  const handleShare = (platform: string) => {
    const url = shareUrls[platform as keyof typeof shareUrls];
    if (url) {
      window.open(url, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
      onShare?.(); // Track the share action
      toast({
        title: "Opening share dialog",
        description: `Sharing on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`,
      });
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(carUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Car listing URL has been copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please manually copy the URL",
        variant: "destructive",
      });
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDescription,
          url: carUrl,
        });
        toast({
          title: "Shared successfully",
          description: "Car listing has been shared",
        });
      } catch (err) {
        // User cancelled sharing, no need to show error
      }
    }
  };

  const isNativeShareAvailable = typeof navigator !== 'undefined' && 'share' in navigator;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this car</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Car preview */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              {car.images && car.images.length > 0 && (
                <img 
                  src={car.images[0]} 
                  alt={shareTitle}
                  className="w-16 h-12 object-cover rounded"
                />
              )}
              <div>
                <h3 className="font-semibold text-sm">{shareTitle}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{car.price}</p>
              </div>
            </div>
          </div>

          {/* Social media buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => handleShare('facebook')}
              className="justify-start"
            >
              <Facebook className="h-4 w-4 mr-2 text-blue-600" />
              Facebook
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleShare('twitter')}
              className="justify-start"
            >
              <Twitter className="h-4 w-4 mr-2 text-blue-400" />
              Twitter
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleShare('linkedin')}
              className="justify-start"
            >
              <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
              LinkedIn
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleShare('whatsapp')}
              className="justify-start"
            >
              <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
              WhatsApp
            </Button>
          </div>

          {/* Native share (mobile) and copy link */}
          <div className="space-y-2">
            {isNativeShareAvailable && (
              <Button
                variant="outline"
                onClick={handleNativeShare}
                className="w-full justify-start"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share via device
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={handleCopyLink}
              className="w-full justify-start"
            >
              {copied ? (
                <Check className="h-4 w-4 mr-2 text-green-600" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              {copied ? "Copied!" : "Copy link"}
            </Button>
          </div>

          {/* URL display */}
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm font-mono text-gray-600 dark:text-gray-400 break-all">
            {carUrl}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
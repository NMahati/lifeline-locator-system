
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, Globe, ExternalLink } from "lucide-react";
import { BloodBank } from "@/context/BloodBankContext";
import { Badge } from "@/components/ui/badge";

interface BloodBankCardProps {
  bloodBank: BloodBank;
  onViewDetails?: () => void;
}

const BloodBankCard: React.FC<BloodBankCardProps> = ({ bloodBank, onViewDetails }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{bloodBank.name}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {bloodBank.address}
            </CardDescription>
          </div>
          {bloodBank.distance !== undefined && (
            <Badge variant="outline" className="font-normal">
              {bloodBank.distance.toFixed(1)} km away
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-3 space-y-2">
        <div className="flex items-center text-sm">
          <Phone className="h-4 w-4 mr-1 text-gray-500" />
          {bloodBank.contactPhone}
        </div>
        <div className="flex items-center text-sm">
          <Clock className="h-4 w-4 mr-1 text-gray-500" />
          {bloodBank.hoursOfOperation}
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {bloodBank.services.map((service, index) => (
            <Badge key={index} variant="secondary" className="font-normal">
              {service}
            </Badge>
          ))}
        </div>
        <div className="mt-1">
          {bloodBank.acceptsWalkIns ? (
            <Badge className="bg-green-500 hover:bg-green-500">Accepts Walk-ins</Badge>
          ) : (
            <Badge variant="outline">Appointment Required</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        {bloodBank.website && (
          <a 
            href={bloodBank.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-blue-500 hover:underline text-sm"
          >
            <Globe className="h-4 w-4 mr-1" />
            Visit Website
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        )}
        <Button 
          onClick={onViewDetails} 
          variant="outline"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BloodBankCard;

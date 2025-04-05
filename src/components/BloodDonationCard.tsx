
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Phone, Mail, AlertCircle } from "lucide-react";
import { BloodRequest } from "@/context/BloodRequestContext";
import { formatDistanceToNow } from "date-fns";

interface BloodDonationCardProps {
  request: BloodRequest;
  onRespond?: () => void;
}

const BloodDonationCard: React.FC<BloodDonationCardProps> = ({ request, onRespond }) => {
  const getUrgencyColor = (urgency: BloodRequest['urgency']) => {
    switch (urgency) {
      case 'critical': return 'bg-red-600';
      case 'urgent': return 'bg-amber-500';
      case 'normal': return 'bg-green-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <Card className="border-l-4 overflow-hidden" style={{ borderLeftColor: getUrgencyColor(request.urgency).replace('bg-', '') }}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              <span className="text-lg font-bold">
                Blood Group {request.bloodGroup}
              </span>
              <Badge 
                className={`ml-2 ${getUrgencyColor(request.urgency)} text-white`}
              >
                {request.urgency.toUpperCase()}
              </Badge>
            </CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {request.location.address}
            </CardDescription>
          </div>
          <div className="text-sm text-gray-500 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {formatDistanceToNow(new Date(request.requestDate), { addSuffix: true })}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Required Units:</span> {request.quantity}
          </div>
          <div className="text-sm">
            <span className="font-medium">Requested by:</span> {request.requesterInfo.name}
          </div>
          {request.additionalNotes && (
            <div className="text-sm mt-2 bg-gray-50 p-2 rounded-md flex items-start">
              <AlertCircle className="h-4 w-4 mr-1 text-amber-500 mt-0.5" />
              <span>{request.additionalNotes}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex items-center justify-between">
        <div className="flex flex-col text-sm text-gray-500">
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-1" />
            {request.contactPhone}
          </div>
          {request.contactEmail && (
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              {request.contactEmail}
            </div>
          )}
        </div>
        {onRespond && (
          <Button 
            onClick={onRespond}
            className="bg-blood-500 hover:bg-blood-600"
          >
            Respond
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default BloodDonationCard;

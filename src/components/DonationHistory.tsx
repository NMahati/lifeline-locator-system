import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import { format, addMonths, isBefore } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { Progress } from "@/components/ui/progress";
import { api } from "@/services/api";

interface Donation {
  date: string;
  location: string;
  recipient?: string;
}

const DonationHistory: React.FC = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchDonations = async () => {
      if (!user) return;
      try {
        const data = await api.getDonationHistory(user.id);
        setDonations(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch donation history");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [user]);

  if (loading) {
    return <p>Loading donation history...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!donations.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Donation History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No donation history available.</p>
        </CardContent>
      </Card>
    );
  }

  // Sort donations by date (newest first)
  const sortedDonations = [...donations].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Check eligibility status
  const lastDonation = sortedDonations[0].date;
  const eligibleDate = addMonths(new Date(lastDonation), 3); // Typically 3 months between donations
  const isEligible = isBefore(eligibleDate, new Date());
  const daysUntilEligible = isEligible
    ? 0
    : Math.ceil((eligibleDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  // Calculate eligibility progress percentage (0-100%)
  const totalDays = 90; // Approximately 3 months
  const daysPassed = totalDays - daysUntilEligible;
  const progressPercentage = Math.min(100, Math.max(0, Math.round((daysPassed / totalDays) * 100)));

  // Limit displayed donations unless "Show All" is clicked
  const displayedDonations = showAll ? sortedDonations : sortedDonations.slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Donation History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Eligibility Status */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Eligibility Status</span>
            <Badge className={isEligible ? "bg-green-500" : "bg-amber-500"}>
              {isEligible ? "Eligible Now" : `Eligible in ${daysUntilEligible} days`}
            </Badge>
          </div>
          <Progress value={progressPercentage} className="h-2" />

          {!isEligible && (
            <p className="text-xs text-gray-500 mt-1">
              You'll be eligible to donate again on {format(eligibleDate, "MMMM d, yyyy")}
            </p>
          )}
        </div>

        {/* Donation Timeline */}
        <div className="space-y-3">
          {displayedDonations.map((donation, index) => (
            <div key={index} className="flex items-start border-l-2 border-gray-200 pl-4 pb-4 relative">
              <div
                className="absolute left-[-8px] top-0 w-4 h-4 rounded-full border-2 border-blood-500 bg-white"
                aria-hidden="true"
              />
              <div className="flex-1">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="font-medium">
                    {format(new Date(donation.date), "MMMM d, yyyy")}
                  </span>
                </div>
                <div className="mt-1 text-sm text-gray-600 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {donation.location}
                </div>
                {donation.recipient && (
                  <div className="mt-1 text-sm">
                    <span className="text-gray-500">Recipient:</span> {donation.recipient}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {sortedDonations.length > 3 && (
        <CardFooter>
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="w-full"
          >
            {showAll ? "Show Less" : `Show All (${sortedDonations.length})`}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default DonationHistory;

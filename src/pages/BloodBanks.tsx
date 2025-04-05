
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useBloodBanks, BloodBank } from '@/context/BloodBankContext';
import BloodBankCard from '@/components/BloodBankCard';
import { MapPin, Search, CircleX, Clock, Phone, Mail, Globe, CheckCircle2, AlertCircle } from 'lucide-react';

const BloodBanks = () => {
  const { bloodBanks, nearbyBloodBanks, findNearbyBanks } = useBloodBanks();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [walkInFilter, setWalkInFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [selectedBloodBank, setSelectedBloodBank] = useState<BloodBank | null>(null);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);

  useEffect(() => {
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          findNearbyBanks(latitude, longitude, 20);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Use default location as fallback
          findNearbyBanks(40.7128, -74.0060, 20);
        }
      );
    }
  }, [findNearbyBanks]);

  // Filter blood banks
  const filteredBloodBanks = bloodBanks.filter(bank => {
    // Search by name or address
    const searchMatch = 
      bank.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      bank.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by walk-ins
    const walkInMatch = walkInFilter === 'all' || 
      (walkInFilter === 'yes' && bank.acceptsWalkIns) ||
      (walkInFilter === 'no' && !bank.acceptsWalkIns);
    
    // Filter by service
    const serviceMatch = serviceFilter === 'all' || 
      bank.services.some(service => service.toLowerCase().includes(serviceFilter.toLowerCase()));
    
    return searchMatch && walkInMatch && serviceMatch;
  });

  const handleViewDetails = (bank: BloodBank) => {
    setSelectedBloodBank(bank);
  };

  // Get all unique services
  const allServices = Array.from(
    new Set(
      bloodBanks.flatMap(bank => bank.services)
    )
  );

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blood Banks & Donation Centers</h1>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              type="search" 
              placeholder="Search by name or location" 
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <CircleX className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="w-40">
            <Select 
              value={walkInFilter}
              onValueChange={setWalkInFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Walk-ins" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="yes">Accepts Walk-ins</SelectItem>
                <SelectItem value="no">Appointment Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-40">
            <Select 
              value={serviceFilter}
              onValueChange={setServiceFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Services" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {allServices.map((service, index) => (
                  <SelectItem key={index} value={service}>{service}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {(searchTerm || walkInFilter !== 'all' || serviceFilter !== 'all') && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setWalkInFilter('all');
                setServiceFilter('all');
              }}
              className="text-sm"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="nearby">
        <TabsList>
          <TabsTrigger value="nearby">Nearby</TabsTrigger>
          <TabsTrigger value="all">All Blood Banks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="nearby" className="mt-4">
          {nearbyBloodBanks.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {nearbyBloodBanks.map((bank) => (
                <BloodBankCard 
                  key={bank.id} 
                  bloodBank={bank}
                  onViewDetails={() => handleViewDetails(bank)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="font-medium mb-1">No nearby blood banks found</h3>
                  {userLocation ? (
                    <p className="text-gray-500">Try adjusting the search radius or viewing all blood banks.</p>
                  ) : (
                    <p className="text-gray-500">Please enable location services to find nearby blood banks.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="all" className="mt-4">
          {filteredBloodBanks.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredBloodBanks.map((bank) => (
                <BloodBankCard 
                  key={bank.id} 
                  bloodBank={bank}
                  onViewDetails={() => handleViewDetails(bank)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-8">
              <p className="text-gray-500">No blood banks found matching your criteria.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Blood Bank Details Dialog */}
      <Dialog open={!!selectedBloodBank} onOpenChange={(open) => !open && setSelectedBloodBank(null)}>
        <DialogContent className="sm:max-w-xl">
          {selectedBloodBank && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedBloodBank.name}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Address</div>
                    <div className="text-gray-700">{selectedBloodBank.address}</div>
                    {selectedBloodBank.distance !== undefined && (
                      <Badge variant="outline" className="mt-1">
                        {selectedBloodBank.distance.toFixed(1)} km away
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Hours of Operation</div>
                    <div className="text-gray-700 whitespace-pre-line">{selectedBloodBank.hoursOfOperation}</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Contact</div>
                    <div className="text-gray-700">{selectedBloodBank.contactPhone}</div>
                    {selectedBloodBank.contactEmail && (
                      <div className="flex items-center mt-1">
                        <Mail className="h-4 w-4 mr-1 text-gray-400" />
                        <a href={`mailto:${selectedBloodBank.contactEmail}`} className="text-blue-600 hover:underline">
                          {selectedBloodBank.contactEmail}
                        </a>
                      </div>
                    )}
                    {selectedBloodBank.website && (
                      <div className="flex items-center mt-1">
                        <Globe className="h-4 w-4 mr-1 text-gray-400" />
                        <a 
                          href={selectedBloodBank.website} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  {selectedBloodBank.acceptsWalkIns ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                  )}
                  <div>
                    <div className="font-medium">Walk-in Policy</div>
                    <div className="text-gray-700">
                      {selectedBloodBank.acceptsWalkIns 
                        ? "Accepts walk-in donations" 
                        : "Appointment required for donations"
                      }
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="h-5 w-5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Services</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedBloodBank.services.map((service, index) => (
                        <Badge key={index} variant="secondary" className="font-normal">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                {selectedBloodBank.inventory && (
                  <div className="flex items-start space-x-3">
                    <div className="h-5 w-5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Blood Inventory</div>
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {Object.entries(selectedBloodBank.inventory).map(([type, data]) => (
                          <div key={type} className="p-2 border rounded-md text-center">
                            <div className="font-bold">{type}</div>
                            <div className={`text-sm ${data.quantity > 5 ? 'text-green-600' : 'text-red-600'}`}>
                              {data.quantity} units
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button 
                  onClick={() => setSelectedBloodBank(null)}
                  variant="outline"
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default BloodBanks;

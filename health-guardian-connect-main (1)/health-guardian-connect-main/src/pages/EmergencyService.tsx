
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/Navigation/NavBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import EmergencyButton from '@/components/EmergencyButton/EmergencyButton';
import { MapPin, Phone, Clock, Ambulance, Hospital } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EmergencyService = () => {
  const [nearbyHospitals, setNearbyHospitals] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Get user's current location when the page loads
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          // In a real app, this would call a maps API to get nearby hospitals
          generateMockNearbyHospitals(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  // Mock function to generate nearby hospitals
  const generateMockNearbyHospitals = (lat: number, lng: number) => {
    // Generate random offsets in coordinates to simulate nearby hospitals
    const mockHospitals = [
      {
        id: 1,
        name: 'City General Hospital',
        distance: '1.2 miles',
        address: '123 Medical Center Blvd',
        phone: '(555) 123-4567',
        emergency: true,
        waitTime: '10 mins'
      },
      {
        id: 2,
        name: 'Memorial Medical Center',
        distance: '2.5 miles',
        address: '456 Health Way',
        phone: '(555) 234-5678',
        emergency: true,
        waitTime: '25 mins'
      },
      {
        id: 3,
        name: "St. Mary's Hospital",
        distance: '3.8 miles',
        address: '789 Care Street',
        phone: '(555) 345-6789',
        emergency: true,
        waitTime: '15 mins'
      },
      {
        id: 4,
        name: 'University Medical Center',
        distance: '4.3 miles',
        address: '101 Research Drive',
        phone: '(555) 456-7890',
        emergency: true,
        waitTime: '30 mins'
      },
    ];
    
    setNearbyHospitals(mockHospitals);
  };

  const handleCallHospital = (phone: string) => {
    // In a real app, this would use the device's calling capability
    window.location.href = `tel:${phone.replace(/\D/g, '')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Emergency Services</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Emergency Assistance</h2>
                <p className="text-gray-600 mb-6">
                  In case of a medical emergency, press the button below to alert emergency services
                  and nearby hospitals. Your location will be shared with responders.
                </p>
                
                <EmergencyButton />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Emergency Contacts</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-emergency-600 mt-0.5 mr-3" />
                    <div>
                      <div className="font-medium">Emergency Services</div>
                      <div className="text-lg font-bold">911</div>
                      <div className="text-sm text-gray-500">For life-threatening emergencies</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-health-600 mt-0.5 mr-3" />
                    <div>
                      <div className="font-medium">Health Guardian Hotline</div>
                      <div className="text-lg font-bold">(555) 987-6543</div>
                      <div className="text-sm text-gray-500">24/7 medical advice</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-health-600 mt-0.5 mr-3" />
                    <div>
                      <div className="font-medium">Poison Control Center</div>
                      <div className="text-lg font-bold">(800) 222-1222</div>
                      <div className="text-sm text-gray-500">For poisoning emergencies</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Hospital className="h-5 w-5 mr-2" />
                  Nearby Hospitals
                </CardTitle>
                <CardDescription>
                  {userLocation 
                    ? `Based on your location (${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)})`
                    : 'Enable location services to see nearby hospitals'}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {nearbyHospitals.length > 0 ? (
                  <div className="space-y-4">
                    {nearbyHospitals.map((hospital) => (
                      <div key={hospital.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-lg">{hospital.name}</h3>
                          <div className="text-sm text-gray-600">
                            {hospital.distance}
                          </div>
                        </div>
                        
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                            {hospital.address}
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2 text-gray-400" />
                            Estimated Wait: {hospital.waitTime}
                          </div>
                          
                          {hospital.emergency && (
                            <div className="flex items-center text-sm text-emergency-600">
                              <Ambulance className="h-4 w-4 mr-2" />
                              24/7 Emergency Services Available
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-4 flex gap-3">
                          <Button 
                            onClick={() => handleCallHospital(hospital.phone)}
                            className="flex items-center"
                            size="sm"
                          >
                            <Phone className="h-4 w-4 mr-1" />
                            Call: {hospital.phone}
                          </Button>
                          
                          <Button 
                            variant="outline"
                            size="sm"
                          >
                            <MapPin className="h-4 w-4 mr-1" />
                            Directions
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : userLocation ? (
                  <div className="text-center py-12">
                    <Hospital className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="font-medium text-lg">Loading nearby hospitals...</h3>
                    <p className="text-gray-500">Please wait while we find healthcare facilities near you.</p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="font-medium text-lg">Location Access Required</h3>
                    <p className="text-gray-500 mb-4">Please enable location services to see nearby hospitals.</p>
                    <Button onClick={() => window.location.reload()}>
                      Refresh Location
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="bg-health-50 border border-health-100 rounded-lg p-4 mt-6">
              <h3 className="font-medium text-health-700 mb-2">Know When to Call Emergency Services</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p>Call emergency services immediately for:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Difficulty breathing or shortness of breath</li>
                  <li>Chest or upper abdominal pain or pressure</li>
                  <li>Fainting, sudden dizziness, weakness</li>
                  <li>Sudden changes in vision</li>
                  <li>Confusion or changes in mental status</li>
                  <li>Any sudden or severe pain</li>
                  <li>Uncontrolled bleeding</li>
                  <li>Severe burns or wounds</li>
                  <li>Poisoning</li>
                  <li>Seizures</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyService;

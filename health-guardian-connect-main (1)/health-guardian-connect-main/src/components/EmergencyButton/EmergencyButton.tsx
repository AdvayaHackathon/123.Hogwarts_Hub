
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Ambulance } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const EmergencyButton = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyHospital, setNearbyHospital] = useState<string | null>(null);

  const handleEmergencyPress = () => {
    setIsDialogOpen(true);
  };

  const confirmEmergency = () => {
    setIsPressed(true);
    
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          
          // Mock finding nearby hospital
          findNearbyHospital(latitude, longitude);
          
          toast.success('Emergency services alerted. Help is on the way!', {
            duration: 10000,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Could not access your location. Please try again.');
          setIsPressed(false);
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser.');
      setIsPressed(false);
    }
    
    setIsDialogOpen(false);
  };

  const cancelEmergency = () => {
    setIsDialogOpen(false);
  };

  // Mock function to find nearby hospital
  const findNearbyHospital = (lat: number, lng: number) => {
    // In a real app, this would call a maps API
    setTimeout(() => {
      const hospitals = [
        'City General Hospital',
        'Memorial Medical Center',
        'St. Mary\'s Hospital',
        'University Medical Center'
      ];
      
      const randomHospital = hospitals[Math.floor(Math.random() * hospitals.length)];
      setNearbyHospital(randomHospital);
      
      toast.info(`${randomHospital} has been notified and is sending an ambulance`);
    }, 2000);
  };

  const resetEmergency = () => {
    setIsPressed(false);
    setLocation(null);
    setNearbyHospital(null);
    toast.info('Emergency request cancelled');
  };

  return (
    <>
      {!isPressed ? (
        <Button
          onClick={handleEmergencyPress}
          size="lg"
          className="bg-emergency-600 hover:bg-emergency-700 text-white w-full py-8 text-xl emergency-button animate-pulse-emergency"
        >
          <Ambulance className="mr-2 h-6 w-6" />
          Emergency Assistance
        </Button>
      ) : (
        <div className="space-y-4">
          <div className="bg-emergency-50 border border-emergency-200 rounded-lg p-4 text-emergency-700">
            <h3 className="font-bold flex items-center">
              <Ambulance className="mr-2 h-5 w-5" />
              Emergency Request Active
            </h3>
            
            <div className="mt-2 space-y-1 text-sm">
              {location && (
                <p>
                  Your location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </p>
              )}
              
              {nearbyHospital ? (
                <p>Nearest hospital: {nearbyHospital}</p>
              ) : (
                <p>Finding nearest hospital...</p>
              )}
              
              <p className="font-semibold mt-2">Help is on the way!</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            className="w-full border-emergency-200 text-emergency-700"
            onClick={resetEmergency}
          >
            Cancel Emergency Request
          </Button>
        </div>
      )}

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Emergency Request</AlertDialogTitle>
            <AlertDialogDescription>
              This will alert emergency services and share your location with nearby hospitals.
              Only use this in case of a genuine medical emergency.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelEmergency}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmEmergency}
              className="bg-emergency-600 hover:bg-emergency-700"
            >
              Confirm Emergency
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EmergencyButton;

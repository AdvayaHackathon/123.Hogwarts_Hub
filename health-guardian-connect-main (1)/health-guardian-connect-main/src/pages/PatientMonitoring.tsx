
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/Navigation/NavBar';
import { Card, CardContent } from '@/components/ui/card';
import DoctorVerification from '@/components/Auth/DoctorVerification';
import { Button } from '@/components/ui/button';
import { mockMonitoringFeeds } from '@/utils/mockData';
import { AlertCircle, Check, ChevronRight, RefreshCw, Video, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const PatientMonitoring = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [feeds, setFeeds] = useState<any[]>([]);
  const [selectedFeed, setSelectedFeed] = useState<any | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    // Load mock monitoring feeds
    setFeeds(mockMonitoringFeeds);
    
    // Set alerts for the demo
    setAlerts([
      'Movement detected in Room 103 - ICU',
      'Patient P003 vital signs fluctuating'
    ]);
    
    // Set up periodic alert simulation
    const alertInterval = setInterval(() => {
      const randomAlert = generateRandomAlert();
      setAlerts(prev => [...prev, randomAlert].slice(-5));
      
      if (Math.random() > 0.7) {
        toast.warning('New patient monitoring alert', {
          description: randomAlert
        });
      }
    }, 45000);
    
    return () => clearInterval(alertInterval);
  }, []);

  const generateRandomAlert = () => {
    const alertTypes = [
      'Movement detected in',
      'Potential fall detected in',
      'Patient unresponsive in',
      'Vital signs irregular in',
      'Patient attempting to leave bed in'
    ];
    
    const rooms = [
      'Room 101 - ICU',
      'Room 102 - ICU',
      'Room 103 - ICU',
      'Emergency Room'
    ];
    
    const randomType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const randomRoom = rooms[Math.floor(Math.random() * rooms.length)];
    
    return `${randomType} ${randomRoom}`;
  };

  const handleVerification = (verified: boolean) => {
    setIsVerified(verified);
    if (verified) {
      toast.success('Doctor verification successful. You now have access to patient monitoring.');
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate refreshing data
    setTimeout(() => {
      // Update mock data with some changes
      const updatedFeeds = feeds.map(feed => {
        if (Math.random() > 0.7) {
          // Randomly update status of some feeds
          const statuses = ['stable', 'normal', 'warning', 'critical'];
          const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
          
          return {
            ...feed,
            status: randomStatus,
            alerts: randomStatus === 'warning' || randomStatus === 'critical' 
              ? [...feed.alerts, 'Activity detected'] 
              : feed.alerts
          };
        }
        return feed;
      });
      
      setFeeds(updatedFeeds);
      setIsRefreshing(false);
      
      toast.success('Monitoring data refreshed');
    }, 1500);
  };

  const handleSelectFeed = (feed: any) => {
    setSelectedFeed(feed);
  };

  // Mock function to simulate video frames
  const getVideoUrl = (feedId: string) => {
    // In a real app, this would connect to actual CCTV/monitoring cameras
    // For the demo, we'll use placeholder color frames
    const colors = ['#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280'];
    const colorIndex = feedId.charCodeAt(0) % colors.length;
    
    return `https://via.placeholder.com/640x480/${colors[colorIndex].substring(1)}?text=Patient+Monitor+${feedId}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Patient Monitoring System</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <DoctorVerification onVerified={handleVerification} />
              </CardContent>
            </Card>
            
            {isVerified && (
              <>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold">Monitoring Feeds</h2>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="h-8 w-8 p-0"
                      >
                        <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {feeds.map(feed => (
                        <button
                          key={feed.id}
                          onClick={() => handleSelectFeed(feed)}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between",
                            selectedFeed?.id === feed.id 
                              ? "bg-health-100 text-health-700" 
                              : "hover:bg-gray-100",
                            feed.status === 'critical' && "border-l-4 border-emergency-500"
                          )}
                        >
                          <div className="flex items-center">
                            <div
                              className={cn(
                                "w-2 h-2 rounded-full mr-2",
                                feed.status === 'stable' && "bg-green-500",
                                feed.status === 'normal' && "bg-blue-500",
                                feed.status === 'warning' && "bg-yellow-500",
                                feed.status === 'critical' && "bg-emergency-500"
                              )}
                            />
                            <span>{feed.name}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-lg font-semibold mb-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 text-emergency-500" />
                      Recent Alerts
                    </h2>
                    
                    <div className="space-y-2 mt-4">
                      {alerts.length > 0 ? (
                        alerts.map((alert, index) => (
                          <div 
                            key={index} 
                            className={cn(
                              "text-sm p-2 rounded-md",
                              index === 0 ? "bg-emergency-50 text-emergency-700 border border-emergency-100" : "bg-gray-50"
                            )}
                          >
                            {alert}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-gray-500 text-sm">
                          <Check className="h-10 w-10 mx-auto stroke-1 mb-2" />
                          No alerts at this time
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
          
          <div className="lg:col-span-3">
            {!isVerified ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <Video className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Doctor Verification Required</h3>
                <p className="text-gray-600 mb-4">
                  Please verify your doctor credentials to access patient monitoring.
                </p>
              </div>
            ) : selectedFeed ? (
              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-semibold">{selectedFeed.name}</h2>
                        <p className="text-sm text-gray-500">
                          {selectedFeed.patientId ? `Patient ID: ${selectedFeed.patientId}` : 'No patient assigned'}
                        </p>
                      </div>
                      
                      <Badge
                        className={cn(
                          selectedFeed.status === 'stable' && "bg-green-100 text-green-800 hover:bg-green-100",
                          selectedFeed.status === 'normal' && "bg-blue-100 text-blue-800 hover:bg-blue-100",
                          selectedFeed.status === 'warning' && "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
                          selectedFeed.status === 'critical' && "bg-emergency-100 text-emergency-800 hover:bg-emergency-100"
                        )}
                      >
                        Status: {selectedFeed.status.charAt(0).toUpperCase() + selectedFeed.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                      <img
                        src={getVideoUrl(selectedFeed.id)}
                        alt={selectedFeed.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        {selectedFeed.alerts.length > 0 && (
                          <div className="text-sm text-emergency-600">
                            <AlertCircle className="inline-block h-4 w-4 mr-1" />
                            {selectedFeed.alerts.join(', ')}
                          </div>
                        )}
                      </div>
                      
                      <Button variant="outline" size="sm">
                        View Patient Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <h3 className="text-lg font-semibold mt-6">All Monitoring Feeds</h3>
                <div className="video-grid">
                  {feeds.map(feed => (
                    <Card 
                      key={feed.id} 
                      className={cn(
                        "cursor-pointer hover:shadow-md transition-shadow overflow-hidden",
                        selectedFeed.id === feed.id && "ring-2 ring-health-500"
                      )}
                      onClick={() => handleSelectFeed(feed)}
                    >
                      <CardContent className="p-0">
                        <div className="aspect-video bg-gray-100">
                          <img
                            src={getVideoUrl(feed.id)}
                            alt={feed.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-sm">{feed.name}</span>
                            <div
                              className={cn(
                                "w-2 h-2 rounded-full",
                                feed.status === 'stable' && "bg-green-500",
                                feed.status === 'normal' && "bg-blue-500",
                                feed.status === 'warning' && "bg-yellow-500",
                                feed.status === 'critical' && "bg-emergency-500"
                              )}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a Monitoring Feed</h3>
                <p className="text-gray-600 mb-4">
                  Choose a room from the list to view patient monitoring.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientMonitoring;

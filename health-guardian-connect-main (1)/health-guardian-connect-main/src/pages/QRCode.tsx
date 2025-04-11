
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NavBar from '@/components/Navigation/NavBar';
import QRCodeGenerator from '@/components/QRCode/QRCodeGenerator';
import { QrCode, Scan } from 'lucide-react';
import { toast } from 'sonner';

const QRCode = () => {
  const [scannedData, setScannedData] = React.useState<string | null>(null);
  const [parsedData, setParsedData] = React.useState<any>(null);
  const [scannerActive, setScannerActive] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const scanIntervalRef = React.useRef<number | null>(null);

  const handleQrGenerated = (data: string) => {
    console.log('QR Code generated with data:', data);
  };

  const startScanner = async () => {
    try {
      setScannerActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // In a real app, this would use a QR code scanning library like jsQR
        
        // For demo purposes, we'll simulate a scan after 3 seconds
        toast.info('Scanner active. Point camera at a QR code.');
        
        setTimeout(() => {
          // Simulating a scan result
          const mockScanData = JSON.stringify({
            id: 'P001',
            name: 'John Doe',
            timestamp: new Date().toISOString()
          });
          
          handleScanResult(mockScanData);
          stopScanner();
        }, 3000);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Could not access camera. Please check permissions.');
      setScannerActive(false);
    }
  };

  const stopScanner = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    
    setScannerActive(false);
  };

  const handleScanResult = (data: string) => {
    setScannedData(data);
    
    try {
      const parsed = JSON.parse(data);
      setParsedData(parsed);
      toast.success('QR Code scanned successfully!');
    } catch (error) {
      console.error('Error parsing QR data:', error);
      toast.error('Invalid QR code format');
    }
  };

  React.useEffect(() => {
    return () => {
      // Clean up when component unmounts
      stopScanner();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Patient QR Code Management</h1>
        
        <Tabs defaultValue="generate">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="generate" className="flex items-center">
              <QrCode className="h-4 w-4 mr-2" />
              Generate QR Code
            </TabsTrigger>
            <TabsTrigger value="scan" className="flex items-center">
              <Scan className="h-4 w-4 mr-2" />
              Scan QR Code
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate" className="border border-gray-200 bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Generate Patient QR Code</h2>
            <p className="text-gray-600 mb-6">
              Create a unique QR code containing essential patient information that can be
              scanned by medical staff for quick access to patient records.
            </p>
            
            <QRCodeGenerator onGenerated={handleQrGenerated} />
          </TabsContent>
          
          <TabsContent value="scan" className="border border-gray-200 bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Scan Patient QR Code</h2>
            <p className="text-gray-600 mb-6">
              Scan a patient QR code to quickly access their information. Make sure the QR code 
              is well-lit and positioned within the camera frame.
            </p>
            
            <div className="space-y-6">
              {!scannerActive && !scannedData && (
                <button 
                  onClick={startScanner}
                  className="w-full py-3 bg-health-600 text-white rounded-md hover:bg-health-700 flex items-center justify-center"
                >
                  <Scan className="h-5 w-5 mr-2" />
                  Start Scanner
                </button>
              )}
              
              {scannerActive && (
                <div className="space-y-4">
                  <div className="qr-scanner-container border-2 border-health-400 rounded-lg overflow-hidden">
                    <video 
                      ref={videoRef}
                      autoPlay 
                      playsInline
                      style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  
                  <button 
                    onClick={stopScanner}
                    className="w-full py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Cancel Scanning
                  </button>
                </div>
              )}
              
              {scannedData && parsedData && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-700 mb-2">QR Code Scanned Successfully</h3>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between border-b border-green-100 pb-1">
                        <span className="font-medium">Patient ID:</span>
                        <span>{parsedData.id}</span>
                      </div>
                      <div className="flex justify-between border-b border-green-100 pb-1">
                        <span className="font-medium">Name:</span>
                        <span>{parsedData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Timestamp:</span>
                        <span>{new Date(parsedData.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setScannedData(null);
                      setParsedData(null);
                    }}
                    className="w-full py-2 bg-health-100 text-health-700 rounded-md hover:bg-health-200"
                  >
                    Scan Another QR Code
                  </button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default QRCode;

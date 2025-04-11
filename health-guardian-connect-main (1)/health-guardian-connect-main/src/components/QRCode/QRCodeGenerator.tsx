
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type QRCodeGeneratorProps = {
  onGenerated?: (qrData: string) => void;
};

const QRCodeGenerator = ({ onGenerated }: QRCodeGeneratorProps) => {
  const [patientName, setPatientName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [patientData, setPatientData] = useState('');
  const [qrSize, setQrSize] = useState(256);

  const generateQRCode = () => {
    if (!patientId || !patientName) {
      toast.error('Please fill in patient name and ID');
      return;
    }

    // In a real app, this would include more secure patient data
    const data = {
      id: patientId,
      name: patientName,
      timestamp: new Date().toISOString(),
    };

    const qrData = JSON.stringify(data);
    setPatientData(qrData);
    
    if (onGenerated) {
      onGenerated(qrData);
    }
    
    toast.success('QR Code generated successfully');
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById('qr-code-canvas');
    if (canvas) {
      const pngUrl = (canvas as HTMLCanvasElement)
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
      
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `patient-${patientId}-qr.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      toast.success('QR Code downloaded successfully');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="patientId">Patient ID</Label>
          <Input
            id="patientId"
            placeholder="Enter patient ID"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="patientName">Patient Name</Label>
          <Input
            id="patientName"
            placeholder="Enter patient name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="qrSize">QR Code Size</Label>
          <Select
            value={qrSize.toString()}
            onValueChange={(value) => setQrSize(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="128">Small (128px)</SelectItem>
              <SelectItem value="256">Medium (256px)</SelectItem>
              <SelectItem value="384">Large (384px)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button className="w-full" onClick={generateQRCode}>
          Generate QR Code
        </Button>
      </div>

      {patientData && (
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <CardContent className="flex justify-center p-6">
              <QRCodeSVG
                id="qr-code-canvas"
                value={patientData}
                size={qrSize}
                level="H"
                includeMargin
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </CardContent>
          </Card>
          
          <Button variant="outline" className="w-full" onClick={downloadQRCode}>
            Download QR Code
          </Button>
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;

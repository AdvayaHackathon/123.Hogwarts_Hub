import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type QRCodeGeneratorProps = {
  onGenerated?: (qrData: string) => void;
};

const QRCodeGenerator = ({ onGenerated }: QRCodeGeneratorProps) => {
  const [patientName, setPatientName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [patientData, setPatientData] = useState('');
  const [qrSize, setQrSize] = useState(256);

  const generateQRCode = async () => {
    if (!patientId || !patientName || !phoneNumber) {
      toast.error('Please fill in patient name, ID, and phone number');
      return;
    }

    const data = {
      id: patientId,
      name: patientName,
      phone: phoneNumber,
      timestamp: new Date().toISOString(),
    };

    const qrData = JSON.stringify(data);
    setPatientData(qrData);

    try {
      const response = await fetch('http://localhost:5000/api/qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success('QR Code generated and data stored');
      } else {
        toast.error(result.error || 'Failed to store QR data');
      }
    } catch (error) {
      toast.error('Error connecting to backend');
      console.error('Fetch error:', error);
    }

    if (onGenerated) {
      onGenerated(qrData);
    }
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
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
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

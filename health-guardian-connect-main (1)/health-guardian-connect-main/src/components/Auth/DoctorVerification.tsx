
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, ShieldX } from 'lucide-react';
import { toast } from 'sonner';

type DoctorVerificationProps = {
  onVerified: (verified: boolean) => void;
};

const DoctorVerification = ({ onVerified }: DoctorVerificationProps) => {
  const [doctorId, setDoctorId] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Mock verification data (in a real app, this would be server-side)
  const validDoctors = {
    'DR12345': 'access123',
    'DR67890': 'access456',
  };

  const handleVerification = () => {
    setIsVerifying(true);

    // Simulate API request with timeout
    setTimeout(() => {
      // Check if the doctor ID and access code match
      const isValid = validDoctors[doctorId as keyof typeof validDoctors] === accessCode;
      
      setIsVerified(isValid);
      onVerified(isValid);
      
      if (isValid) {
        toast.success('Doctor verification successful');
      } else {
        toast.error('Verification failed. Please check your credentials.');
      }
      
      setIsVerifying(false);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Doctor Verification</h3>
        {isVerified ? (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 flex items-center gap-1">
            <ShieldX className="h-3.5 w-3.5" />
            Not Verified
          </Badge>
        )}
      </div>
      
      {!isVerified && (
        <>
          <div className="space-y-2">
            <Label htmlFor="doctorId">Doctor ID</Label>
            <Input
              id="doctorId"
              placeholder="Enter your doctor ID"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              disabled={isVerifying}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="accessCode">Access Code</Label>
            <Input
              id="accessCode"
              type="password"
              placeholder="Enter your access code"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              disabled={isVerifying}
            />
          </div>
          
          <Button 
            className="w-full"
            onClick={handleVerification}
            disabled={!doctorId || !accessCode || isVerifying}
          >
            {isVerifying ? 'Verifying...' : 'Verify Credentials'}
          </Button>
        </>
      )}
      
      {isVerified && (
        <div className="bg-green-50 p-3 rounded-md text-green-700 text-sm">
          You have been verified and can now access and modify patient data.
        </div>
      )}
    </div>
  );
};

export default DoctorVerification;

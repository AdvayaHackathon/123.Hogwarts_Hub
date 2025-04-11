
import React from 'react';
import { Button } from '@/components/ui/button';
import { Hospital, QrCode, Activity, Ambulance, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import NavBar from '@/components/Navigation/NavBar';

const Index = () => {
  const features = [
    {
      title: 'QR Code Patient Management',
      description: 'Generate QR codes for patients to securely access and share their medical information.',
      icon: <QrCode className="h-12 w-12 text-health-600" />,
      path: '/qr-code',
      color: 'bg-health-50 text-health-600',
    },
    {
      title: 'Secure Patient Records',
      description: 'View and modify patient records with doctor verification to ensure data privacy.',
      icon: <Shield className="h-12 w-12 text-indigo-600" />,
      path: '/patient-data',
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      title: 'Disease Prediction',
      description: 'Analyze symptoms and predict potential diseases using ML models.',
      icon: <Activity className="h-12 w-12 text-green-600" />,
      path: '/disease-prediction',
      color: 'bg-green-50 text-green-600',
    },
    {
      title: 'Emergency Assistance',
      description: 'One-tap emergency button that detects your location and alerts nearby hospitals.',
      icon: <Ambulance className="h-12 w-12 text-emergency-600" />,
      path: '/emergency-service',
      color: 'bg-emergency-50 text-emergency-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="bg-gradient-to-b from-health-700 to-health-900 text-white py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Health Guardian Connect
              </h1>
              <p className="text-xl mb-6 text-health-100">
                Advanced healthcare management with QR code integration, 
                disease prediction, and real-time monitoring for better patient care.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button 
                  asChild
                  size="lg" 
                  className="bg-white text-health-700 hover:bg-health-50"
                >
                  <Link to="/qr-code">Generate Patient QR Code</Link>
                </Button>
                <Button 
                  asChild
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-white hover:text-health-700"
                >
                  <Link to="/emergency-service">Emergency Services</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <Hospital className="w-64 h-64 text-white/20" />
            </div>
          </div>
        </div>
      </div>

      <section className="py-16 container max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Link 
              to={feature.path} 
              key={index}
              className="block group"
            >
              <div className="h-full border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className={`inline-flex p-4 rounded-lg mb-4 ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-health-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-health-50 py-16">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Enhanced Patient Security</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
            Our platform ensures patient data is secure, accessible only to authorized medical professionals,
            and provides real-time monitoring for improved patient care and safety.
          </p>
          <Button 
            asChild
            size="lg"
            className="bg-health-600 hover:bg-health-700"
          >
            <Link to="/patient-monitoring">View Patient Monitoring</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;

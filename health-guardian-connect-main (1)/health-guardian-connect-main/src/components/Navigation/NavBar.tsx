
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Hospital, QrCode, Activity, Ambulance, ShieldCheck, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const NavBar = () => {
  const navItems = [
    { name: 'Home', path: '/', icon: <Hospital className="h-5 w-5 mr-2" /> },
    { name: 'QR Code', path: '/qr-code', icon: <QrCode className="h-5 w-5 mr-2" /> },
    { name: 'Patient Data', path: '/patient-data', icon: <User className="h-5 w-5 mr-2" /> },
    { name: 'Disease Prediction', path: '/disease-prediction', icon: <Activity className="h-5 w-5 mr-2" /> },
    { name: 'Emergency', path: '/emergency-service', icon: <Ambulance className="h-5 w-5 mr-2" /> },
    { name: 'Patient Monitoring', path: '/patient-monitoring', icon: <ShieldCheck className="h-5 w-5 mr-2" /> },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container flex justify-between items-center h-16">
        <div className="flex items-center space-x-2">
          <Hospital className="h-8 w-8 text-health-600" />
          <h1 className="text-xl font-bold text-health-700 hidden sm:block">Health Guardian Connect</h1>
        </div>

        <nav className="hidden md:flex space-x-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 rounded-md flex items-center text-sm font-medium",
                  isActive
                    ? "bg-health-100 text-health-700"
                    : "text-gray-600 hover:bg-health-50 hover:text-health-600"
                )
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>
        
        <div className="md:hidden">
          <Button variant="outline" size="sm">Menu</Button>
        </div>
      </div>
    </header>
  );
};

export default NavBar;

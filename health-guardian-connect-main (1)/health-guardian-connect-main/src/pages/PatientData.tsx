
import React, { useState } from 'react';
import NavBar from '@/components/Navigation/NavBar';
import DoctorVerification from '@/components/Auth/DoctorVerification';
import { mockPatients, Patient, Report } from '@/utils/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Edit, Save, FileText, PlusCircle, X, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const PatientData = () => {
  const [isDoctorVerified, setIsDoctorVerified] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedPatient, setEditedPatient] = useState<Patient | null>(null);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [newReport, setNewReport] = useState<Partial<Report>>({
    id: `R${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
    type: '',
    date: new Date().toISOString().split('T')[0],
    result: '',
    details: '',
    critical: false
  });

  const handleDoctorVerified = (verified: boolean) => {
    setIsDoctorVerified(verified);
    if (verified) {
      toast.success('Doctor verification successful. You can now view and edit patient data.');
    }
  };

  const handleSearch = () => {
    const query = searchQuery.trim().toUpperCase();
    const foundPatient = Object.values(mockPatients).find(
      p => p.id.toUpperCase() === query || p.name.toUpperCase().includes(query)
    );
    
    if (foundPatient) {
      setSelectedPatient(foundPatient);
      setEditedPatient(JSON.parse(JSON.stringify(foundPatient))); // Create a deep copy
      toast.success('Patient found');
    } else {
      toast.error('No patient found with the provided ID or name');
      setSelectedPatient(null);
      setEditedPatient(null);
    }
    
    setEditMode(false);
  };

  const handleEdit = () => {
    if (!isDoctorVerified) {
      toast.error('You must be verified as a doctor to edit patient data');
      return;
    }
    
    setEditMode(true);
  };

  const handleSave = () => {
    if (!editedPatient) return;
    
    // In a real app, this would send data to a server
    setSelectedPatient(editedPatient);
    setEditMode(false);
    toast.success('Patient data updated successfully');
  };

  const handleAddReport = () => {
    if (!editedPatient) return;
    
    // Validate required fields
    if (!newReport.type || !newReport.result || !newReport.details) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const fullReport = {
      ...newReport,
      id: newReport.id || `R${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
      date: newReport.date || new Date().toISOString().split('T')[0],
      critical: newReport.critical || false,
    } as Report;
    
    const updatedPatient = {
      ...editedPatient,
      reports: [...editedPatient.reports, fullReport]
    };
    
    setEditedPatient(updatedPatient);
    setSelectedPatient(updatedPatient);
    setShowReportDialog(false);
    setNewReport({
      id: `R${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
      type: '',
      date: new Date().toISOString().split('T')[0],
      result: '',
      details: '',
      critical: false
    });
    
    toast.success('New report added successfully');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editedPatient) return;
    
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setEditedPatient({
        ...editedPatient,
        [parent]: {
          ...(editedPatient[parent as keyof Patient] as any),
          [child]: value
        }
      });
    } else {
      setEditedPatient({ ...editedPatient, [name]: value });
    }
  };

  const handleArrayInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, field: keyof Patient) => {
    if (!editedPatient) return;
    
    const updatedArray = [...(editedPatient[field] as string[])];
    updatedArray[index] = e.target.value;
    
    setEditedPatient({
      ...editedPatient,
      [field]: updatedArray
    });
  };

  const addArrayItem = (field: keyof Patient) => {
    if (!editedPatient) return;
    
    setEditedPatient({
      ...editedPatient,
      [field]: [...(editedPatient[field] as string[]), '']
    });
  };

  const removeArrayItem = (index: number, field: keyof Patient) => {
    if (!editedPatient) return;
    
    const updatedArray = [...(editedPatient[field] as string[])];
    updatedArray.splice(index, 1);
    
    setEditedPatient({
      ...editedPatient,
      [field]: updatedArray
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Patient Data Management</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <DoctorVerification onVerified={handleDoctorVerified} />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-medium mb-4">Patient Search</h2>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter patient ID or name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleSearch}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="mt-4 text-sm text-gray-500">
                  Example patient IDs: P001, P002, P003
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            {selectedPatient ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold">Patient Information</h2>
                    
                    {isDoctorVerified && (
                      <div>
                        {!editMode ? (
                          <Button onClick={handleEdit} size="sm" variant="outline" className="flex items-center">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        ) : (
                          <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700 flex items-center">
                            <Save className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                        {editMode ? (
                          <Input
                            name="id"
                            value={editedPatient?.id || ''}
                            onChange={handleInputChange}
                            disabled
                          />
                        ) : (
                          <div className="text-gray-900 font-medium">{selectedPatient.id}</div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        {editMode ? (
                          <Input
                            name="name"
                            value={editedPatient?.name || ''}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <div className="text-gray-900 font-medium">{selectedPatient.name}</div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                        {editMode ? (
                          <Input
                            name="age"
                            type="number"
                            value={editedPatient?.age || ''}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <div className="text-gray-900">{selectedPatient.age}</div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        {editMode ? (
                          <Input
                            name="gender"
                            value={editedPatient?.gender || ''}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <div className="text-gray-900">{selectedPatient.gender}</div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                        {editMode ? (
                          <Input
                            name="bloodType"
                            value={editedPatient?.bloodType || ''}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <div className="text-gray-900">{selectedPatient.bloodType}</div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Visit</label>
                        {editMode ? (
                          <Input
                            name="lastVisit"
                            type="date"
                            value={editedPatient?.lastVisit || ''}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <div className="text-gray-900">{new Date(selectedPatient.lastVisit).toLocaleDateString()}</div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions</label>
                      {editMode ? (
                        <div className="space-y-2">
                          {editedPatient?.conditions.map((condition, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Input
                                value={condition}
                                onChange={(e) => handleArrayInputChange(e, index, 'conditions')}
                              />
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => removeArrayItem(index, 'conditions')}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => addArrayItem('conditions')}
                            className="flex items-center"
                          >
                            <PlusCircle className="h-4 w-4 mr-1" /> 
                            Add Condition
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {selectedPatient.conditions.map((condition, index) => (
                            <Badge key={index} variant="secondary">{condition}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Medications</label>
                      {editMode ? (
                        <div className="space-y-2">
                          {editedPatient?.medications.map((medication, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Input
                                value={medication}
                                onChange={(e) => handleArrayInputChange(e, index, 'medications')}
                              />
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => removeArrayItem(index, 'medications')}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => addArrayItem('medications')}
                            className="flex items-center"
                          >
                            <PlusCircle className="h-4 w-4 mr-1" /> 
                            Add Medication
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {selectedPatient.medications.map((medication, index) => (
                            <Badge key={index} variant="outline">{medication}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                      {editMode ? (
                        <div className="space-y-2">
                          {editedPatient?.allergies.map((allergy, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Input
                                value={allergy}
                                onChange={(e) => handleArrayInputChange(e, index, 'allergies')}
                              />
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => removeArrayItem(index, 'allergies')}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => addArrayItem('allergies')}
                            className="flex items-center"
                          >
                            <PlusCircle className="h-4 w-4 mr-1" /> 
                            Add Allergy
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {selectedPatient.allergies.length > 0 ? (
                            selectedPatient.allergies.map((allergy, index) => (
                              <Badge key={index} variant="destructive">{allergy}</Badge>
                            ))
                          ) : (
                            <span className="text-gray-500">No known allergies</span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Doctor's Notes</label>
                      </div>
                      {editMode ? (
                        <Textarea
                          name="doctorNotes"
                          value={editedPatient?.doctorNotes || ''}
                          onChange={handleInputChange}
                          rows={3}
                        />
                      ) : (
                        <div className="text-gray-700 bg-gray-50 p-3 rounded-md">
                          {selectedPatient.doctorNotes}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Medical Reports</label>
                        {editMode && isDoctorVerified && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setShowReportDialog(true)}
                            className="flex items-center"
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Add Report
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        {selectedPatient.reports.map((report, index) => (
                          <div 
                            key={index} 
                            className={cn(
                              "border rounded-md p-3",
                              report.critical ? "border-red-200 bg-red-50" : "border-gray-200 bg-gray-50"
                            )}
                          >
                            <div className="flex justify-between items-start">
                              <div className="font-medium">{report.type}</div>
                              <div className="flex items-center">
                                <Badge variant={report.result === "Normal" ? "outline" : "secondary"}>
                                  {report.result}
                                </Badge>
                                {report.critical && (
                                  <Badge variant="destructive" className="ml-2 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    Critical
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="text-sm text-gray-500 mt-1">
                              Date: {new Date(report.date).toLocaleDateString()}
                            </div>
                            
                            <div className="mt-2 text-sm">{report.details}</div>
                          </div>
                        ))}
                        
                        {selectedPatient.reports.length === 0 && (
                          <div className="text-center py-4 text-gray-500">
                            No reports available
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Patient Selected</h3>
                <p className="text-gray-600 mb-4">
                  Please search for a patient using the search form.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Medical Report</DialogTitle>
            <DialogDescription>
              Add a new medical report for this patient. Critical reports will be highlighted.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Report Type</label>
                <Input
                  value={newReport.type}
                  onChange={(e) => setNewReport({ ...newReport, type: e.target.value })}
                  placeholder="E.g., Blood Test, X-Ray"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <Input
                  type="date"
                  value={newReport.date}
                  onChange={(e) => setNewReport({ ...newReport, date: e.target.value })}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Result</label>
              <Input
                value={newReport.result}
                onChange={(e) => setNewReport({ ...newReport, result: e.target.value })}
                placeholder="E.g., Normal, Abnormal"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Details</label>
              <Textarea
                value={newReport.details}
                onChange={(e) => setNewReport({ ...newReport, details: e.target.value })}
                placeholder="Enter detailed report information"
                rows={3}
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="critical"
                checked={newReport.critical}
                onChange={(e) => setNewReport({ ...newReport, critical: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="critical" className="text-sm font-medium">
                Mark as critical
              </label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddReport}>
              Add Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientData;

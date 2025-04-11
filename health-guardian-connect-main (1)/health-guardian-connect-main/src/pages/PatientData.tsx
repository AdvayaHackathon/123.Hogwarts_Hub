import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import DoctorVerification from '@/components/Auth/DoctorVerification';

const PatientData = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [patient, setPatient] = useState<any>(null);
  const [editedPatient, setEditedPatient] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [isDoctorVerified, setIsDoctorVerified] = useState(false);
  const [newReport, setNewReport] = useState({
    type: '',
    result: '',
    details: '',
    critical: false,
    date: new Date().toISOString().split('T')[0],
  });
  const [reportFile, setReportFile] = useState<File | null>(null);

  const handleSearch = async () => {
    try {
      const res = await fetch(http://localhost:5000/api/patients/search?query=${searchQuery});
      const data = await res.json();
      if (res.ok) {
        setPatient(data.patient);
        setEditedPatient(data.patient);
        toast.success('Patient found');
      } else {
        toast.error(data.error || 'Patient not found');
      }
    } catch (err) {
      toast.error('Failed to search patient');
    }
  };

  const handleSave = async () => {
    if (!isDoctorVerified) {
      toast.error('Only verified doctors can save data');
      return;
    }

    try {
      if (!editedPatient) return;

      const res = await fetch('http://localhost:5000/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedPatient),
      });

      if (uploadedFile) {
        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('patientId', editedPatient.id);

        const fileUploadRes = await fetch('http://localhost:5000/upload', {
          method: 'POST',
          body: formData,
        });

        const fileData = await fileUploadRes.json();
        toast.success('File uploaded');
        console.log('File URL:', fileData.fileUrl);
      }

      if (res.ok) {
        toast.success('Patient data saved');
        setPatient(editedPatient);
        setEditMode(false);
      } else {
        toast.error('Failed to save patient');
      }
    } catch (err) {
      toast.error('Error saving patient');
    }
  };

  const handleAddReport = async () => {
    if (!isDoctorVerified) {
      toast.error('Only verified doctors can add reports');
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(newReport).forEach(([key, val]) =>
        formData.append(key, val.toString())
      );
      if (reportFile) {
        formData.append('reportFile', reportFile);
      }

      const res = await fetch(http://localhost:5000/api/patients/${editedPatient.id}/reports, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Report added');
        setShowReportDialog(false);
        setEditedPatient((prev: any) => ({
          ...prev,
          reports: [...(prev.reports || []), data.report],
        }));
        setNewReport({
          type: '',
          result: '',
          details: '',
          critical: false,
          date: new Date().toISOString().split('T')[0],
        });
        setReportFile(null);
      } else {
        toast.error('Failed to add report');
      }
    } catch (err) {
      toast.error('Error adding report');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Patient Data</h1>

      {/* Doctor Verification */}
      <div className="mb-6">
        <DoctorVerification onVerified={setIsDoctorVerified} />
      </div>

      {/* Search Patient */}
      <div className="flex gap-2 mb-4">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter patient ID or name"
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {/* Patient Data */}
      {editedPatient && (
        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">Patient Info</h2>
              {isDoctorVerified && (
                <Button onClick={() => setEditMode(!editMode)}>
                  {editMode ? 'Cancel' : 'Edit'}
                </Button>
              )}
            </div>

            <Input
              placeholder="Patient Name"
              value={editedPatient.name}
              onChange={(e) =>
                setEditedPatient({ ...editedPatient, name: e.target.value })
              }
              disabled={!editMode}
            />
            <Input
              placeholder="Patient Age"
              type="number"
              value={editedPatient.age || ''}
              onChange={(e) =>
                setEditedPatient({ ...editedPatient, age: e.target.value })
              }
              disabled={!editMode}
            />

            <Textarea
              placeholder="Doctor Notes"
              value={editedPatient.doctorNotes || ''}
              onChange={(e) =>
                setEditedPatient({ ...editedPatient, doctorNotes: e.target.value })
              }
              disabled={!editMode}
            />

            {editMode && isDoctorVerified && (
              <div>
                <label className="block text-sm mb-1">Upload File</label>
                <Input
                  type="file"
                  onChange={(e) =>
                    e.target.files && setUploadedFile(e.target.files[0])
                  }
                />
              </div>
            )}

            {editMode && isDoctorVerified && (
              <Button className="mt-4" onClick={handleSave}>
                Save Patient
              </Button>
            )}

            {isDoctorVerified && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setShowReportDialog(true)}
              >
                Add Report
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Display Patient Reports */}
      {editedPatient?.reports?.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold">Patient Reports</h3>

          {editedPatient.reports.map((report: any, index: number) => (
            <div key={index} className="bg-white border p-4 rounded-lg shadow-sm">
              <div className="flex justify-between mb-1">
                <div className="font-medium">{report.type}</div>
                <div className="text-sm text-gray-500">{new Date(report.date).toLocaleDateString()}</div>
              </div>
              <div className="text-sm text-gray-700"><strong>Result:</strong> {report.result}</div>
              <div className="text-sm text-gray-700"><strong>Details:</strong> {report.details}</div>
              {report.critical && (
                <div className="text-red-500 font-semibold mt-1 text-sm">⚠ Critical Report</div>
              )}
              {report.fileUrl && (
                <a
                  href={report.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                >
                  📎 View/Download Report File
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Report</DialogTitle>
            <DialogDescription>
              Fill in the details of the new medical report.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Input
              placeholder="Report Type"
              value={newReport.type}
              onChange={(e) =>
                setNewReport({ ...newReport, type: e.target.value })
              }
            />
            <Input
              placeholder="Result"
              value={newReport.result}
              onChange={(e) =>
                setNewReport({ ...newReport, result: e.target.value })
              }
            />
            <Textarea
              placeholder="Details"
              value={newReport.details}
              onChange={(e) =>
                setNewReport({ ...newReport, details: e.target.value })
              }
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newReport.critical}
                onChange={(e) =>
                  setNewReport({ ...newReport, critical: e.target.checked })
                }
              />
              Critical
            </label>
            <div>
              <label className="block text-sm mb-1">Attach Report File</label>
              <Input type="file" onChange={(e) => e.target.files && setReportFile(e.target.files[0])} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddReport}>Add Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientData;

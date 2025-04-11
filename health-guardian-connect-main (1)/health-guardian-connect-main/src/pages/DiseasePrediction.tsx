
import React, { useState } from 'react';
import NavBar from '@/components/Navigation/NavBar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Activity, Brain, Loader2 } from 'lucide-react';
import { mockPredictions, symptomGroups } from '@/utils/mockData';

const DiseasePrediction = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [predictions, setPredictions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasResults, setHasResults] = useState(false);

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms(prev => {
      if (prev.includes(symptom)) {
        return prev.filter(s => s !== symptom);
      } else {
        return [...prev, symptom];
      }
    });
  };

  const handlePrediction = () => {
    if (selectedSymptoms.length < 2) {
      toast.error('Please select at least 2 symptoms for an accurate prediction');
      return;
    }
    
    setIsLoading(true);
    setPredictions([]);
    
    // Simulate API call to ML model
    setTimeout(() => {
      const sortedSymptoms = [...selectedSymptoms].sort().join(',');
      
      // Find exact match in mock data
      let predictedDiseases = mockPredictions[sortedSymptoms];
      
      // If no exact match, use some mock logic
      if (!predictedDiseases) {
        if (selectedSymptoms.includes('Fever') && selectedSymptoms.includes('Cough')) {
          predictedDiseases = ['Common Cold', 'Influenza', 'COVID-19'];
        } else if (selectedSymptoms.includes('Headache') && selectedSymptoms.includes('Nausea')) {
          predictedDiseases = ['Migraine', 'Stress Headache'];
        } else if (selectedSymptoms.includes('Chest pain')) {
          predictedDiseases = ['Coronary Artery Disease', 'Anxiety', 'GERD'];
        } else if (selectedSymptoms.includes('Abdominal pain')) {
          predictedDiseases = ['Gastritis', 'Appendicitis', 'Food Poisoning'];
        } else {
          // Generate random predictions for demo
          const allPossibleDiseases = [
            'Common Cold', 'Influenza', 'Migraine', 'Gastritis', 
            'Anxiety Disorder', 'Hypertension', 'Bronchitis', 
            'Acid Reflux', 'Sinusitis', 'Allergic Rhinitis'
          ];
          
          predictedDiseases = [];
          const numPredictions = Math.min(3, Math.floor(Math.random() * 3) + 1);
          
          for (let i = 0; i < numPredictions; i++) {
            const randomIndex = Math.floor(Math.random() * allPossibleDiseases.length);
            const disease = allPossibleDiseases[randomIndex];
            
            if (!predictedDiseases.includes(disease)) {
              predictedDiseases.push(disease);
            }
          }
        }
      }
      
      setPredictions(predictedDiseases);
      setIsLoading(false);
      setHasResults(true);
      
      // Notify doctor in a real app
      toast.info('Results are ready. In a real environment, these would be shared with your doctor.');
    }, 3000);
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setPredictions([]);
    setHasResults(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Disease Prediction</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-health-600" />
                  Symptom Selection
                </h2>
                
                <p className="text-gray-600 mb-6">
                  Select the symptoms you're experiencing. Our ML model will analyze the combination
                  to predict possible conditions. For a more accurate diagnosis, please select all
                  relevant symptoms.
                </p>
                
                <div className="space-y-6">
                  {symptomGroups.map((group, groupIndex) => (
                    <div key={groupIndex}>
                      <h3 className="font-medium mb-2 text-gray-700">{group.name} Symptoms</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {group.symptoms.map((symptom, symptomIndex) => (
                          <div key={symptomIndex} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${group.name}-${symptomIndex}`}
                              checked={selectedSymptoms.includes(symptom)}
                              onCheckedChange={() => handleSymptomToggle(symptom)}
                            />
                            <Label
                              htmlFor={`${group.name}-${symptomIndex}`}
                              className="text-sm cursor-pointer"
                            >
                              {symptom}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={handlePrediction} 
                    disabled={selectedSymptoms.length === 0 || isLoading}
                    className="bg-health-600 hover:bg-health-700 flex-1"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing Symptoms...
                      </>
                    ) : (
                      'Analyze Symptoms'
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleReset}
                    disabled={selectedSymptoms.length === 0 && !hasResults}
                    className="flex-1"
                  >
                    Reset Selection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-health-600" />
                  Prediction Results
                </h2>
                
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                    <Loader2 className="h-8 w-8 animate-spin mb-4" />
                    <p>Analyzing symptom patterns...</p>
                    <p className="text-sm mt-2">
                      Our ML model is processing your data
                    </p>
                  </div>
                ) : hasResults ? (
                  <>
                    <div className="mb-2 text-sm text-gray-600">
                      Based on your symptoms:
                    </div>
                    <div className="mb-4">
                      {selectedSymptoms.map((symptom, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 mr-2 mb-2 rounded-full text-xs bg-health-100 text-health-700">
                          {symptom}
                        </span>
                      ))}
                    </div>
                    
                    <h3 className="font-medium text-gray-700 mb-2">Possible Conditions:</h3>
                    <div className="space-y-2">
                      {predictions.map((disease, index) => (
                        <div 
                          key={index} 
                          className="p-3 rounded-md border border-health-200 bg-health-50 text-health-700"
                        >
                          {disease}
                        </div>
                      ))}
                      
                      <div className="pt-2 text-sm text-gray-600">
                        <p className="font-medium">Important Note:</p>
                        <p>These predictions are not a diagnosis. Please consult with a healthcare professional.</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto stroke-1 mb-3" />
                    <p className="font-medium">No Results Yet</p>
                    <p className="text-sm mt-2">
                      Select symptoms and analyze to see predictions
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardContent className="pt-6">
                <h3 className="font-medium mb-2 text-gray-700">How it works</h3>
                <p className="text-sm text-gray-600">
                  Our disease prediction system uses machine learning algorithms trained on medical data
                  to identify patterns in symptoms that may indicate specific conditions.
                </p>
                
                <div className="mt-4 text-sm text-gray-500">
                  <p className="font-medium text-health-700">Remember:</p>
                  <ul className="list-disc list-inside space-y-1 mt-1">
                    <li>Select all symptoms you're experiencing</li>
                    <li>Results are suggestions, not diagnoses</li>
                    <li>Always consult with healthcare professionals</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseasePrediction;

import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import {
  ArrowLeft,
  Info,
  CheckCircle,
  SendHorizontal,
  FileCheck,
  HelpCircle,
  Users,
  Brain,
  Settings
} from 'lucide-react';

interface SolutionArchitect {
  id: string;
  name: string;
  email: string;
  specialization: string;
  experience: string;
}

interface SubmissionData {
  submissionType: 'send_to_bd' | 'submit_feasibility' | '';
  selectedSolutionArchitect?: SolutionArchitect | null;
}

const defaultData: SubmissionData = {
  submissionType: '',
  selectedSolutionArchitect: null
};

// Solution Architect team members
const solutionArchitects: SolutionArchitect[] = [
  { 
    id: 'sa-1', 
    name: 'Alex Chen', 
    email: 'alex.chen@company.com', 
    specialization: 'Data Center Infrastructure',
    experience: '8+ years in DC design and colocation solutions'
  },
  { 
    id: 'sa-2', 
    name: 'Sarah Martinez', 
    email: 'sarah.martinez@company.com', 
    specialization: 'Cloud & Hybrid Architecture',
    experience: '10+ years in enterprise cloud solutions'
  },
  { 
    id: 'sa-3', 
    name: 'Michael Zhang', 
    email: 'michael.zhang@company.com', 
    specialization: 'Network Infrastructure',
    experience: '7+ years in network design and connectivity'
  },
  { 
    id: 'sa-4', 
    name: 'Jennifer Williams', 
    email: 'jennifer.williams@company.com', 
    specialization: 'Security & Compliance',
    experience: '9+ years in enterprise security architecture'
  },
  { 
    id: 'sa-5', 
    name: 'Robert Kim', 
    email: 'robert.kim@company.com', 
    specialization: 'Power & Cooling Systems',
    experience: '12+ years in critical infrastructure design'
  }
];

export function ProjectStep3() {
  const navigate = useNavigate();
  const [data, setData] = useState<SubmissionData>(defaultData);
  const [isSADialogOpen, setIsSADialogOpen] = useState(false);

  const updateData = (field: keyof SubmissionData, value: any) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSASelection = (selectedSA: SolutionArchitect, comment: string) => {
    updateData('selectedSolutionArchitect', { ...selectedSA, comment });
    setIsSADialogOpen(false);
    toast.success('Solution Architect assigned successfully', {
      description: `${selectedSA.name} has been assigned to your project`,
      duration: 3000
    });
  };

  const openSADialog = () => {
    setIsSADialogOpen(true);
  };

  const handleSubmit = () => {
    if (data.submissionType === 'send_to_bd') {
      toast.success("Project Sent to Business Development Team", {
        description: `Your project has been shared with the assigned BD representatives for assistance in completing missing details. They will review and enhance the project before submitting for feasibility check.`,
        duration: 6000,
        icon: <SendHorizontal className="w-4 h-4" />,
        style: {
          background: "#f0f9ff",
          color: "#0c4a6e",
          border: "1px solid #7dd3fc",
          fontSize: "14px",
          fontWeight: "500"
        }
      });
    } else if (data.submissionType === 'submit_feasibility') {
      toast.success("Project Submitted for Feasibility Check", {
        description: "Your project has been submitted to the Operations team for feasibility analysis. The assigned BD representatives have been informed and will stay updated on the project progress.",
        duration: 6000,
        icon: <CheckCircle className="w-4 h-4" />,
        style: {
          background: "#f0f9ff",
          color: "#0c4a6e",
          border: "1px solid #7dd3fc",
          fontSize: "14px",
          fontWeight: "500"
        }
      });
    }
    
    // Redirect to dashboard after a short delay to allow toast to be seen
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  const handleBack = () => {
    navigate('/new-project/step2');
  };

  const isSubmissionValid = () => {
    return !!data.submissionType;
  };

  const getSubmissionButtonText = () => {
    if (data.submissionType === 'send_to_bd') {
      return 'Send to BD Team';
    } else if (data.submissionType === 'submit_feasibility') {
      return 'Submit for Feasibility';
    }
    return 'Submit Project';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={handleBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Step 2</span>
            </Button>
            <div>
              <h1>New Colocation Project</h1>
              <p className="text-muted-foreground mt-1">Step 3 of 3: Project Submission</p>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 border-2 border-green-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-green-700">✓</span>
              </div>
              <span className="text-sm font-medium text-green-700">Project Info</span>
            </div>
            <div className="w-8 h-0.5 bg-green-200"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 border-2 border-green-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-green-700">✓</span>
              </div>
              <span className="text-sm font-medium text-green-700">Product Selection</span>
            </div>
            <div className="w-8 h-0.5 bg-blue-200"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 border-2 border-blue-600 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-white">3</span>
              </div>
              <span className="text-sm font-medium text-blue-600">Project Submission</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Information Alert */}
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="w-4 h-4" />
            <AlertDescription>
              <strong>Ready to Submit Your Project</strong>
              <br />
              Your project details and requirements have been captured. Choose how you'd like to proceed with your submission.
            </AlertDescription>
          </Alert>

          {/* Submission Decision Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                <span>Choose Your Submission Path</span>
              </CardTitle>
              <div className="text-sm text-gray-600 mt-2">
                Select how you'd like to proceed with your colocation project
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup 
                value={data.submissionType} 
                onValueChange={(value) => updateData('submissionType', value)}
                className="space-y-4"
              >
                {/* Option 1: Send to BD Team */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
                    <RadioGroupItem value="send_to_bd" id="send_to_bd" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="send_to_bd" className="cursor-pointer">
                        <div className="flex items-center space-x-2 mb-2">
                          <SendHorizontal className="w-5 h-5 text-blue-600" />
                          <span className="font-medium text-gray-900">Send to Business Development Team</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Share your project with the assigned BD representatives for assistance in completing missing details, 
                          optimizing requirements, and enhancing the project scope before feasibility analysis.
                        </p>
                      </Label>
                      <div className="mt-3 space-y-2">
                        <div className="text-xs text-gray-500">
                          <strong>Best for:</strong> Complex projects, incomplete requirements, need expert guidance
                        </div>
                        <div className="text-xs text-blue-600">
                          <strong>Next Steps:</strong> BD team will review → enhance details → submit for feasibility
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Option 2: Submit Directly */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all">
                    <RadioGroupItem value="submit_feasibility" id="submit_feasibility" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="submit_feasibility" className="cursor-pointer">
                        <div className="flex items-center space-x-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-gray-900">Submit for Feasibility Check</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Submit your project directly to the Operations team for immediate feasibility analysis. 
                          All assigned BD representatives will be notified and kept updated on progress.
                        </p>
                      </Label>
                      <div className="mt-3 space-y-2">
                        <div className="text-xs text-gray-500">
                          <strong>Best for:</strong> Complete requirements, standard configurations, time-sensitive projects
                        </div>
                        <div className="text-xs text-green-600">
                          <strong>Next Steps:</strong> Operations team begins feasibility analysis immediately
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </RadioGroup>

              {/* Help Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <HelpCircle className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Need Help Deciding?</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>
                        <strong>Choose BD Team</strong> if you have incomplete requirements, complex configurations, 
                        or need expert guidance to optimize your project scope.
                      </p>
                      <p>
                        <strong>Submit Directly</strong> if you have all necessary details, standard requirements, 
                        and want to proceed immediately to feasibility analysis.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Solution Architect Assignment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span>Solution Architect Assignment</span>
              </CardTitle>
              <div className="text-sm text-gray-600 mt-2">
                Assign a solution architect to oversee technical aspects and ensure optimal solution design
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-purple-900 mb-2">Why Assign a Solution Architect?</h4>
                    <p className="text-sm text-purple-800">
                      A solution architect will be kept informed of project progress and can provide technical guidance 
                      throughout the feasibility analysis and implementation phases.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Select Solution Architect</Label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:bg-purple-50 transition-all">
                  {data.selectedSolutionArchitect ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{data.selectedSolutionArchitect.name}</div>
                          <div className="text-sm text-gray-600">{data.selectedSolutionArchitect.email}</div>
                          <div className="text-xs text-purple-600">{data.selectedSolutionArchitect.specialization}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={openSADialog}
                          className="text-purple-600 border-purple-300 hover:bg-purple-50"
                        >
                          Change
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateData('selectedSolutionArchitect', null)}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Users className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-3">No solution architect assigned</p>
                      <Button
                        variant="outline"
                        onClick={openSADialog}
                        className="text-purple-600 border-purple-300 hover:bg-purple-50"
                      >
                        Assign Solution Architect
                      </Button>
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-500">
                  <strong>Optional:</strong> Solution architect assignment is not required but recommended for complex projects
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Product Selection
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!isSubmissionValid()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {getSubmissionButtonText()}
            </Button>
          </div>
        </div>

        {/* SA Selection Dialog */}
        <Dialog open={isSADialogOpen} onOpenChange={setIsSADialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <span>Assign Solution Architect</span>
              </DialogTitle>
              <DialogDescription>
                Select a solution architect to provide technical guidance and oversight for your colocation project.
              </DialogDescription>
            </DialogHeader>
            
            <SASelectionDialog 
              solutionArchitects={solutionArchitects}
              currentAssignment={data.selectedSolutionArchitect}
              onSelect={handleSASelection}
              onClose={() => setIsSADialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// SA Selection Dialog Component
interface SASelectionDialogProps {
  solutionArchitects: SolutionArchitect[];
  currentAssignment?: SolutionArchitect | null;
  onSelect: (sa: SolutionArchitect, comment: string) => void;
  onClose: () => void;
}

function SASelectionDialog({ 
  solutionArchitects, 
  currentAssignment, 
  onSelect, 
  onClose 
}: SASelectionDialogProps) {
  const [selectedSA, setSelectedSA] = useState(currentAssignment?.id || '');
  const [comment, setComment] = useState(currentAssignment?.comment || '');

  const handleSubmit = () => {
    if (selectedSA) {
      const architect = solutionArchitects.find(sa => sa.id === selectedSA);
      if (architect) {
        onSelect(architect, comment);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
        <Settings className="w-6 h-6 text-purple-600" />
        <div>
          <h3 className="font-medium text-gray-900">Solution Architect Assignment</h3>
          <p className="text-sm text-gray-600">Choose an expert to guide your project's technical implementation</p>
        </div>
      </div>

      {/* SA Team Members */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Select Solution Architect</Label>
        <div className="grid gap-3 max-h-80 overflow-y-auto">
          {solutionArchitects.map((architect) => (
            <Card 
              key={architect.id}
              className={`cursor-pointer transition-all ${
                selectedSA === architect.id 
                  ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-500 ring-opacity-20' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedSA(architect.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <input
                      type="radio"
                      name="sa-member"
                      value={architect.id}
                      checked={selectedSA === architect.id}
                      onChange={() => setSelectedSA(architect.id)}
                      className="w-4 h-4 text-purple-600 mt-1"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{architect.name}</h4>
                        <p className="text-sm text-purple-600 mt-1 font-medium">{architect.specialization}</p>
                        <p className="text-xs text-gray-500 mt-1">{architect.email}</p>
                        <p className="text-xs text-gray-600 mt-2">{architect.experience}</p>
                      </div>
                      <Brain className="w-5 h-5 text-purple-400" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Comments Section */}
      <div className="space-y-3">
        <Label htmlFor="sa-comment" className="text-base font-medium">
          Project Context & Requirements
        </Label>
        <Textarea
          id="sa-comment"
          placeholder="Add any specific technical requirements, project context, or instructions for the solution architect..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="resize-none"
        />
        <p className="text-xs text-gray-500">
          These details will help the solution architect understand the project scope and technical requirements.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!selectedSA}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Assign Solution Architect
        </Button>
      </div>
    </div>
  );
}
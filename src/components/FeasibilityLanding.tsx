import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Building, Network } from 'lucide-react';

export function FeasibilityLanding() {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState<string>('');

  // Mock data for companies
  const companies = [
    'TechCorp Solutions',
    'Global Enterprises',
    'CloudNext Pvt Ltd',
    'DataFlow Systems'
  ];

  const handleProceed = () => {
    if (selectedCompany) {
      navigate('/feasibility-management', {
        state: {
          company: selectedCompany
        }
      });
    }
  };

  const isFormValid = selectedCompany;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-gray-900">Network Services Management</h1>
              <p className="text-sm text-gray-500">Select company to continue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Please select a company to manage feasibility checks, proposals, and orders.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Company Selection */}
              <div className="space-y-2">
                <Label htmlFor="company" className="text-gray-900">
                  Select Company <span className="text-red-500">*</span>
                </Label>
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger id="company" className="w-full">
                    <div className="flex items-center">
                      <Building className="w-4 h-4 mr-2 text-gray-400" />
                      <SelectValue placeholder="Choose a company" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company} value={company}>
                        {company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Select the company you want to manage feasibility for
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleProceed}
                  disabled={!isFormValid}
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Network className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-2">What can you do in Management?</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• View and manage active links inventory</li>
                    <li>• Track feasibility checks and their status</li>
                    <li>• Create and manage proposals</li>
                    <li>• Monitor orders and their progress</li>
                    <li>• Access saved drafts for service requests</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
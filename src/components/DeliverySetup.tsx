import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Badge } from './ui/badge';
import { ArrowLeft, FileText, CheckCircle, User, Plus, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// Mock Solution Architects data
const solutionArchitects = [
  { id: 'SA001', name: 'Arun K', email: 'arun.k@onesify.com', phone: '+91 90002 22222', status: 'Available' },
  { id: 'SA002', name: 'Priya Sharma', email: 'priya.sharma@onesify.com', phone: '+91 90002 33333', status: 'Available' },
  { id: 'SA003', name: 'Rajesh Kumar', email: 'rajesh.kumar@onesify.com', phone: '+91 90002 44444', status: 'Busy' },
  { id: 'SA004', name: 'Anita Desai', email: 'anita.desai@onesify.com', phone: '+91 90002 55555', status: 'Available' }
];

export function DeliverySetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { proposalId, company, customerId, opportunityId } = location.state || {};
  
  const [accordionValue, setAccordionValue] = useState<string[]>(['requirement-details', 'delivery-config']);
  
  // Delivery Configuration State
  const [deliveryConfig, setDeliveryConfig] = useState({
    jumboFrameRequired: 'No',
    mtu: '1500',
    macTransparency: 'Yes',
    macsec: 'Yes',
    macCount: '2',
    vlanCount: '2',
    vlanTransparency: 'Yes',
    l2cpTransparency: 'Yes',
    handoff: '10G-LR'
  });

  // Solution Architect State
  const [selectedSA, setSelectedSA] = useState<string>('');
  const [assignedSA, setAssignedSA] = useState<typeof solutionArchitects[0] | null>(null);

  const handleAssignSA = () => {
    if (!selectedSA) {
      toast.error('Please select a Solution Architect');
      return;
    }
    const sa = solutionArchitects.find(s => s.id === selectedSA);
    if (sa) {
      setAssignedSA(sa);
      toast.success(`Solution Architect ${sa.name} has been assigned`);
    }
  };

  const handleRemoveSA = () => {
    setAssignedSA(null);
    setSelectedSA('');
    toast.info('Solution Architect removed');
  };

  const handleGenerateDocument = () => {
    if (!assignedSA) {
      toast.error('Please assign a Solution Architect before generating the document');
      return;
    }
    
    toast.success('Solution Document generation initiated');
    // Navigate to solution document editor after a short delay
    setTimeout(() => {
      navigate(`/solution-document-editor/${proposalId || 'NW00035'}`, {
        state: {
          proposalId: proposalId || 'NW00035',
          company: company || 'TechCorp Solutions',
          deliveryConfig,
          assignedSA
        }
      });
    }, 1500);
  };

  const handleSaveAndContinue = () => {
    if (!assignedSA) {
      toast.error('Please assign a Solution Architect before continuing');
      return;
    }
    
    toast.success('Delivery setup saved successfully');
    navigate('/feasibility-management', {
      state: { proposalId: proposalId || 'NW00035' }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/feasibility-management', { state: { proposalId } })}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-gray-900">Delivery Setup</h1>
                <p className="text-sm text-gray-600">Configure delivery parameters and assign solution architect</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={handleGenerateDocument}
                disabled={!assignedSA}
              >
                <FileText className="w-4 h-4 mr-2" />
                Auto Generate Solution Document
              </Button>
              <Button onClick={handleSaveAndContinue}>
                Save & Continue
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-6">
        <div className="max-w-6xl space-y-6">
          {/* Requirement Details Accordion */}
          <Accordion type="multiple" value={accordionValue} onValueChange={setAccordionValue}>
            <AccordionItem value="requirement-details" className="border rounded-lg bg-white">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center space-x-2">
                  <span className="text-base">Requirement Details</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <Label className="text-gray-600 text-sm">Req ID</Label>
                    <p className="text-gray-900 mt-1">{proposalId || 'NW00035'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Product Type</Label>
                    <p className="text-gray-900 mt-1">P2P - GCC (Global Cloud Connect)</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Status</Label>
                    <div className="mt-1">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Proposal Accepted
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Company</Label>
                    <p className="text-gray-900 mt-1">{company || 'TechCorp Solutions'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Customer ID</Label>
                    <p className="text-gray-900 mt-1">{customerId || 'CL000001'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Location</Label>
                    <p className="text-gray-900 mt-1">Mumbai - AWS Mumbai</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Contract Term</Label>
                    <p className="text-gray-900 mt-1">3 Years (36 months)</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Total FIDs</Label>
                    <p className="text-gray-900 mt-1">2 (1 Pair)</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Created On</Label>
                    <p className="text-gray-900 mt-1">2025-01-17</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Delivery Configuration */}
            <AccordionItem value="delivery-config" className="border rounded-lg bg-white mt-4">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center space-x-2">
                  <span className="text-base">Delivery Configuration</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  {/* Jumbo Frame Required */}
                  <div className="space-y-2">
                    <Label>Jumbo Frame Required <span className="text-red-500">*</span></Label>
                    <RadioGroup 
                      value={deliveryConfig.jumboFrameRequired} 
                      onValueChange={(value) => setDeliveryConfig(prev => ({ ...prev, jumboFrameRequired: value }))}
                      className="flex gap-6 h-10 items-center"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="jumbo-no" />
                        <Label htmlFor="jumbo-no" className="font-normal">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="jumbo-yes" />
                        <Label htmlFor="jumbo-yes" className="font-normal">Yes</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* MTU */}
                  <div className="space-y-2">
                    <Label>MTU <span className="text-red-500">*</span></Label>
                    <Select 
                      value={deliveryConfig.mtu}
                      onValueChange={(value) => setDeliveryConfig(prev => ({ ...prev, mtu: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1500">1500 Bytes</SelectItem>
                        <SelectItem value="9000">9000 Bytes</SelectItem>
                        <SelectItem value="1518">1518 Bytes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* MAC Transparency */}
                  <div className="space-y-2">
                    <Label>MAC Transparency <span className="text-red-500">*</span></Label>
                    <RadioGroup 
                      value={deliveryConfig.macTransparency} 
                      onValueChange={(value) => setDeliveryConfig(prev => ({ ...prev, macTransparency: value }))}
                      className="flex gap-6 h-10 items-center"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="mac-trans-yes" />
                        <Label htmlFor="mac-trans-yes" className="font-normal">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="mac-trans-no" />
                        <Label htmlFor="mac-trans-no" className="font-normal">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* MACsec */}
                  <div className="space-y-2">
                    <Label>MACsec <span className="text-red-500">*</span></Label>
                    <RadioGroup 
                      value={deliveryConfig.macsec} 
                      onValueChange={(value) => setDeliveryConfig(prev => ({ ...prev, macsec: value }))}
                      className="flex gap-6 h-10 items-center"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="macsec-yes" />
                        <Label htmlFor="macsec-yes" className="font-normal">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="macsec-no" />
                        <Label htmlFor="macsec-no" className="font-normal">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* MAC Count */}
                  <div className="space-y-2">
                    <Label>MAC Count <span className="text-red-500">*</span></Label>
                    <Input 
                      type="number"
                      value={deliveryConfig.macCount}
                      onChange={(e) => setDeliveryConfig(prev => ({ ...prev, macCount: e.target.value }))}
                      placeholder="Enter MAC count"
                    />
                  </div>

                  {/* VLAN Count */}
                  <div className="space-y-2">
                    <Label>VLAN Count <span className="text-red-500">*</span></Label>
                    <Input 
                      type="number"
                      value={deliveryConfig.vlanCount}
                      onChange={(e) => setDeliveryConfig(prev => ({ ...prev, vlanCount: e.target.value }))}
                      placeholder="Enter VLAN count"
                    />
                  </div>

                  {/* VLAN Transparency */}
                  <div className="space-y-2">
                    <Label>VLAN Transparency <span className="text-red-500">*</span></Label>
                    <RadioGroup 
                      value={deliveryConfig.vlanTransparency} 
                      onValueChange={(value) => setDeliveryConfig(prev => ({ ...prev, vlanTransparency: value }))}
                      className="flex gap-6 h-10 items-center"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="vlan-trans-yes" />
                        <Label htmlFor="vlan-trans-yes" className="font-normal">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="vlan-trans-no" />
                        <Label htmlFor="vlan-trans-no" className="font-normal">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* L2CP Transparency */}
                  <div className="space-y-2">
                    <Label>L2CP Transparency <span className="text-red-500">*</span></Label>
                    <RadioGroup 
                      value={deliveryConfig.l2cpTransparency} 
                      onValueChange={(value) => setDeliveryConfig(prev => ({ ...prev, l2cpTransparency: value }))}
                      className="flex gap-6 h-10 items-center"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="l2cp-trans-yes" />
                        <Label htmlFor="l2cp-trans-yes" className="font-normal">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="l2cp-trans-no" />
                        <Label htmlFor="l2cp-trans-no" className="font-normal">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Handoff */}
                  <div className="space-y-2">
                    <Label>Handoff <span className="text-red-500">*</span></Label>
                    <Select 
                      value={deliveryConfig.handoff}
                      onValueChange={(value) => setDeliveryConfig(prev => ({ ...prev, handoff: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10G-LR">10G-LR</SelectItem>
                        <SelectItem value="10G-SR">10G-SR</SelectItem>
                        <SelectItem value="1G-SX">1G-SX</SelectItem>
                        <SelectItem value="1G-LX">1G-LX</SelectItem>
                        <SelectItem value="100G-LR4">100G-LR4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Solution Architect Assignment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Solution Architect Assignment</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!assignedSA ? (
                <>
                  <div className="space-y-2">
                    <Label>Select Solution Architect <span className="text-red-500">*</span></Label>
                    <Select value={selectedSA} onValueChange={setSelectedSA}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Solution Architect" />
                      </SelectTrigger>
                      <SelectContent>
                        {solutionArchitects.map((sa) => (
                          <SelectItem key={sa.id} value={sa.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{sa.name} - {sa.email}</span>
                              <Badge 
                                variant="outline" 
                                className={`ml-2 ${sa.status === 'Available' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}
                              >
                                {sa.status}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAssignSA} disabled={!selectedSA}>
                    <Plus className="w-4 h-4 mr-2" />
                    Assign Solution Architect
                  </Button>
                </>
              ) : (
                <div className="border rounded-lg p-4 bg-blue-50/30">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-gray-900">{assignedSA.name}</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Assigned
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1 ml-7">
                        <p>Email: {assignedSA.email}</p>
                        <p>Phone: {assignedSA.phone}</p>
                        <p>ID: {assignedSA.id}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleRemoveSA}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/feasibility-management', { state: { proposalId } })}
            >
              Cancel
            </Button>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleGenerateDocument}
                disabled={!assignedSA}
              >
                <FileText className="w-4 h-4 mr-2" />
                Auto Generate Solution Document
              </Button>
              <Button onClick={handleSaveAndContinue}>
                Save & Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
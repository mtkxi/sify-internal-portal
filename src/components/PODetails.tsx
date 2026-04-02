import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { ArrowLeft, Info, Upload } from 'lucide-react';

export function PODetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { proposalId, company, customerId, opportunityId } = location.state || {};
  
  const [hasPO, setHasPO] = useState('no');
  const [accordionValue, setAccordionValue] = useState<string[]>([]);
  const [poReferenceNumber, setPoReferenceNumber] = useState('');
  const [poDate, setPoDate] = useState('');
  const [poDocument, setPoDocument] = useState<File | null>(null);
  const [cafDocument, setCafDocument] = useState<File | null>(null);

  const handleNext = () => {
    navigate('/share-order', {
      state: {
        proposalId,
        company,
        customerId,
        opportunityId
      }
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
                onClick={() => navigate('/add-billing-address', { 
                  state: { proposalId, company, customerId, opportunityId } 
                })}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-gray-900">Add PO Details</h1>
                <p className="text-sm text-gray-600">Configure purchase order and CAF document details</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-6">
        <div className="w-full space-y-6">
          {/* Basic Details Accordion */}
          <Accordion type="multiple" value={accordionValue} onValueChange={setAccordionValue}>
            <AccordionItem value="basic-details" className="border rounded-lg bg-white">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center space-x-2">
                  <span className="text-base">Requirement Details</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <Label className="text-gray-600 text-sm">Req ID</Label>
                    <p className="text-gray-900 mt-1">{proposalId || 'PROP-2025-001'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Product Type</Label>
                    <p className="text-gray-900 mt-1">Express Connect (Dedicated Internet Access)</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Total FIDs</Label>
                    <p className="text-gray-900 mt-1">3</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Contract Term</Label>
                    <p className="text-gray-900 mt-1">2 year</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Created On</Label>
                    <p className="text-gray-900 mt-1">2025-02-04</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="customer-details" className="border rounded-lg bg-white mt-4">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center space-x-2">
                  <span className="text-base">Customer Details</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <Label className="text-gray-600 text-sm">Company Name</Label>
                    <p className="text-gray-900 mt-1">{company || 'Cloud Innovations Pvt'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Customer ID</Label>
                    <p className="text-gray-900 mt-1">{customerId || 'CL000002'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Business Type</Label>
                    <p className="text-gray-900 mt-1">Private Limited</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">PAN Number</Label>
                    <p className="text-gray-900 mt-1">AAACT1234F</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">GST Number</Label>
                    <p className="text-gray-900 mt-1">27AAACT1234F1Z5</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Primary Contact</Label>
                    <p className="text-gray-900 mt-1">Rajesh Kumar</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>PO Details</span>
                <Info className="w-4 h-4 text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Radio Button Question */}
              <div className="space-y-3">
                <Label className="text-blue-600">Do you want to provide PO details?</Label>
                <RadioGroup value={hasPO} onValueChange={setHasPO}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="yes" />
                    <Label htmlFor="yes" className="font-normal">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no" />
                    <Label htmlFor="no" className="font-normal">No</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* PO Details Form - Show when Yes is selected */}
              {hasPO === 'yes' && (
                <div className="space-y-6 pt-4">
                  <div className="grid grid-cols-2 gap-6">
                    {/* PO Reference Number */}
                    <div className="space-y-2">
                      <Label>
                        PO Reference Number<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={poReferenceNumber}
                        onChange={(e) => setPoReferenceNumber(e.target.value)}
                        placeholder="Enter PO Reference Number"
                      />
                    </div>

                    {/* PO Date */}
                    <div className="space-y-2">
                      <Label>
                        PO Date<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="date"
                        value={poDate}
                        onChange={(e) => setPoDate(e.target.value)}
                        placeholder="dd/mm/yyyy"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {/* PO Document Upload */}
                    <div className="space-y-2">
                      <Label>
                        PO Document<span className="text-red-500">*</span>
                      </Label>
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                        onClick={() => document.getElementById('po-document')?.click()}
                      >
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-1">
                          {poDocument ? poDocument.name : 'Drag & Drop or Click to choose file'}
                        </p>
                        <p className="text-xs text-gray-400">
                          Files Supported - JPG, JPEG, PNG and PDF; Max. File Size - 5 mb
                        </p>
                      </div>
                      <input
                        id="po-document"
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => setPoDocument(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                    </div>

                    {/* CAF Document Upload */}
                    <div className="space-y-2">
                      <Label>
                        CAF Document<span className="text-red-500">*</span>
                      </Label>
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                        onClick={() => document.getElementById('caf-document')?.click()}
                      >
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-1">
                          {cafDocument ? cafDocument.name : 'Drag & Drop or Click to choose file'}
                        </p>
                        <p className="text-xs text-gray-400">
                          Files Supported - JPG, JPEG, PNG and PDF; Max. File Size - 5 mb
                        </p>
                      </div>
                      <input
                        id="caf-document"
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => setCafDocument(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/add-billing-address', { 
                state: { proposalId, company, customerId, opportunityId } 
              })}
            >
              Back
            </Button>
            <Button onClick={handleNext}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
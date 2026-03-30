import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { ArrowLeft, Info, Upload, FileText, CheckCircle, Download } from 'lucide-react';

// Mock data for states and cities
const states = ['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Delhi', 'Gujarat'];
const cities: Record<string, string[]> = {
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Trichy'],
  'Karnataka': ['Bangalore', 'Mysore', 'Mangalore', 'Hubli'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
  'Delhi': ['New Delhi', 'Central Delhi', 'South Delhi', 'North Delhi'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot']
};

// Mock existing addresses
const existingAddresses = [
  {
    id: 'addr-001',
    label: 'Corporate Office - Chennai',
    addressLine1: '67, Mathiravelu Street',
    addressLine2: 'Poonamallee High Road',
    addressLine3: 'Porur',
    state: 'Tamil Nadu',
    city: 'Chennai',
    pincode: '600077',
    gst: '33AABCU9603R1ZX'
  },
  {
    id: 'addr-002',
    label: 'Branch Office - Mumbai',
    addressLine1: 'Bandra Kurla Complex',
    addressLine2: 'G Block, 5th Floor',
    addressLine3: '',
    state: 'Maharashtra',
    city: 'Mumbai',
    pincode: '400051',
    gst: '27AAACT1234F1Z5'
  },
  {
    id: 'addr-003',
    label: 'Regional Office - Bangalore',
    addressLine1: 'MG Road',
    addressLine2: 'Brigade Towers',
    addressLine3: 'Suite 302',
    state: 'Karnataka',
    city: 'Bangalore',
    pincode: '560001',
    gst: '29OGGG61314R926'
  }
];

// Mock FID data grouped by pairs for P2P
const mockFIDsByPair = [
  {
    pairNumber: 1,
    pairName: 'Pair 1',
    fids: [
      { 
        fid: 'FID-2025-142', 
        location: 'Chandigarh, Punjab', 
        address: 'Industrial Area Phase I, Chandigarh, Punjab 160002',
        state: 'Punjab'
      },
      { 
        fid: 'FID-2025-143', 
        location: 'Amritsar, Punjab', 
        address: 'Ranjit Avenue, Amritsar, Punjab 143001',
        state: 'Punjab'
      }
    ]
  }
];

interface FIDGSTData {
  fid: string;
  gst: string;
  hasGST: boolean;
  noGSTDocument: File | null;
}

export function AddBillingShippingAddress() {
  const navigate = useNavigate();
  const location = useLocation();
  const { proposalId, company, customerId, opportunityId } = location.state || {};
  
  const [commonBillingAddress, setCommonBillingAddress] = useState('yes');
  const [accordionValue, setAccordionValue] = useState<string[]>([]);
  
  // Common billing address data
  const [commonBilling, setCommonBilling] = useState({
    addressType: 'existing',
    state: 'Tamil Nadu',
    city: 'Chennai',
    selectAddress: '',
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    pincode: '',
    gst: '29OGGG61314R926',
    noGST: false
  });

  // Individual FID billing addresses
  const [fidBillingAddresses, setFidBillingAddresses] = useState<Record<string, any>>({
    selectedFid: '',
    'FID-2025-001': { addressType: 'new', selectedAddress: '', addressLine1: '', addressLine2: '', addressLine3: '', state: '', city: '', pincode: '', gst: '', noGST: false },
    'FID-2025-002': { addressType: 'new', selectedAddress: '', addressLine1: '', addressLine2: '', addressLine3: '', state: '', city: '', pincode: '', gst: '', noGST: false },
    'FID-2025-003': { addressType: 'new', selectedAddress: '', addressLine1: '', addressLine2: '', addressLine3: '', state: '', city: '', pincode: '', gst: '', noGST: false }
  });

  // Shipping GST data by state
  const [shippingGSTByState, setShippingGSTByState] = useState<Record<string, { gst: string; hasGST: boolean; noGSTDocument: File | null }>>({
    'Tamil Nadu': { gst: '33AABCU9603R1ZX', hasGST: true, noGSTDocument: null },
    'Maharashtra': { gst: '', hasGST: false, noGSTDocument: null }
  });

  const handleStateGSTChange = (state: string, gst: string) => {
    setShippingGSTByState(prev => ({
      ...prev,
      [state]: { ...prev[state], gst }
    }));
  };

  const handleStateHasGSTChange = (state: string, hasGST: boolean) => {
    setShippingGSTByState(prev => ({
      ...prev,
      [state]: { ...prev[state], hasGST, gst: hasGST ? prev[state]?.gst || '' : '' }
    }));
  };

  const handleFileUpload = (state: string, file: File | null) => {
    setShippingGSTByState(prev => ({
      ...prev,
      [state]: { ...prev[state], noGSTDocument: file }
    }));
  };

  const handleNext = () => {
    navigate('/po-details', {
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
                onClick={() => navigate('/feasibility-management', { state: { proposalId } })}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-gray-900">Add Billing and Shipping Details</h1>
                <p className="text-sm text-gray-600">Configure billing and shipping addresses for order setup</p>
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
                    <p className="text-gray-900 mt-1">{proposalId || 'NW00065'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Product Type</Label>
                    <p className="text-gray-900 mt-1">P2P - EPL (Ethernet Private Line)</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Total FIDs</Label>
                    <p className="text-gray-900 mt-1">2 (1 Pair)</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Contract Term</Label>
                    <p className="text-gray-900 mt-1">3 Years (36 months)</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Created On</Label>
                    <p className="text-gray-900 mt-1">2025-01-17</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Location</Label>
                    <p className="text-gray-900 mt-1">Chandigarh - Amritsar</p>
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
                    <p className="text-gray-900 mt-1">{company || 'TechCorp Solutions'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Customer ID</Label>
                    <p className="text-gray-900 mt-1">{customerId || 'CL000001'}</p>
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
                    <p className="text-gray-900 mt-1">Sarah Johnson</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Shipping Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Shipping Details</span>
                <Info className="w-4 h-4 text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>State</TableHead>
                      <TableHead>FID</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Shipping Address</TableHead>
                      <TableHead>GST</TableHead>
                      <TableHead>No GST Declaration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockFIDsByPair.map((pair) => (
                      pair.fids.map((fid, index) => (
                        <TableRow key={fid.fid}>
                          {index === 0 && (
                            <TableCell rowSpan={pair.fids.length} className="align-top bg-gray-50/50">
                              <span className="text-sm">{fid.state}</span>
                            </TableCell>
                          )}
                          <TableCell className="text-sm">{fid.fid}</TableCell>
                          <TableCell className="text-sm">{fid.location}</TableCell>
                          <TableCell className="text-sm max-w-xs">
                            <p className="truncate">{fid.address}</p>
                          </TableCell>
                          {index === 0 && (
                            <>
                              <TableCell rowSpan={pair.fids.length} className="align-top">
                                <Input
                                  value={shippingGSTByState[fid.state]?.gst || ''}
                                  onChange={(e) => handleStateGSTChange(fid.state, e.target.value)}
                                  placeholder="Enter GST"
                                  disabled={!shippingGSTByState[fid.state]?.hasGST}
                                  className="h-9"
                                />
                                <div className="flex items-center space-x-2 mt-2">
                                  <Checkbox
                                    id={`no-gst-${fid.state}`}
                                    checked={!shippingGSTByState[fid.state]?.hasGST}
                                    onCheckedChange={(checked) => handleStateHasGSTChange(fid.state, !checked)}
                                  />
                                  <Label htmlFor={`no-gst-${fid.state}`} className="text-xs font-normal">
                                    No GST
                                  </Label>
                                </div>
                              </TableCell>
                              <TableCell rowSpan={pair.fids.length} className="align-top">
                                {!shippingGSTByState[fid.state]?.hasGST && (
                                  <div className="space-y-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => document.getElementById(`file-${fid.state}`)?.click()}
                                      className="h-9"
                                    >
                                      <Upload className="w-3 h-3 mr-2" />
                                      Upload
                                    </Button>
                                    <input
                                      id={`file-${fid.state}`}
                                      type="file"
                                      accept=".pdf,.doc,.docx"
                                      onChange={(e) => handleFileUpload(fid.state, e.target.files?.[0] || null)}
                                      className="hidden"
                                    />
                                    <a 
                                      href="#" 
                                      className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        // Handle template download
                                      }}
                                    >
                                      <Download className="w-3 h-3" />
                                      <span className="underline">No GST Declaration template</span>
                                    </a>
                                    {shippingGSTByState[fid.state]?.noGSTDocument && (
                                      <div className="flex items-center space-x-1 text-xs text-green-600">
                                        <CheckCircle className="w-3 h-3" />
                                        <span className="truncate max-w-[100px]">
                                          {shippingGSTByState[fid.state]?.noGSTDocument?.name}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </TableCell>
                            </>
                          )}
                        </TableRow>
                      ))
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Billing Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Billing Details</span>
                <Info className="w-4 h-4 text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Common Billing Address Question */}
              <div className="space-y-3">
                <Label>Would you like to apply a common billing address to all locations?</Label>
                <RadioGroup value={commonBillingAddress} onValueChange={setCommonBillingAddress}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="common-yes" />
                    <Label htmlFor="common-yes" className="font-normal">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="common-no" />
                    <Label htmlFor="common-no" className="font-normal">No, I want to provide different billing addresses for each FID</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Common Billing Address Fields */}
              {commonBillingAddress === 'yes' && (
                <div className="space-y-4 p-4 border rounded-lg bg-blue-50/30">
                  <h3 className="text-sm text-gray-900">Common Billing Address</h3>
                  
                  <div className="space-y-2">
                    <Label>Address Type*</Label>
                    <Select 
                      value={commonBilling.addressType} 
                      onValueChange={(value) => setCommonBilling(prev => ({ ...prev, addressType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="existing">Existing Address - STL</SelectItem>
                        <SelectItem value="new">New Address</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Existing Address Selection */}
                  {commonBilling.addressType === 'existing' && (
                    <>
                      <div className="space-y-2">
                        <Label>Select Address*</Label>
                        <Select 
                          value={commonBilling.selectAddress} 
                          onValueChange={(value) => setCommonBilling(prev => ({ ...prev, selectAddress: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an address" />
                          </SelectTrigger>
                          <SelectContent>
                            {existingAddresses.map((addr) => (
                              <SelectItem key={addr.id} value={addr.id}>{addr.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Show selected address details as read-only */}
                      {commonBilling.selectAddress && (() => {
                        const selectedAddr = existingAddresses.find(addr => addr.id === commonBilling.selectAddress);
                        if (!selectedAddr) return null;

                        return (
                          <div className="mt-4 p-4 bg-gray-50 border rounded-lg space-y-3">
                            <h4 className="text-sm text-gray-900">Address Details</h4>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <Label className="text-xs text-gray-600">Address Line 1</Label>
                                <p className="text-sm text-gray-900 mt-1">{selectedAddr.addressLine1}</p>
                              </div>
                              <div>
                                <Label className="text-xs text-gray-600">Address Line 2</Label>
                                <p className="text-sm text-gray-900 mt-1">{selectedAddr.addressLine2}</p>
                              </div>
                              {selectedAddr.addressLine3 && (
                                <div>
                                  <Label className="text-xs text-gray-600">Address Line 3</Label>
                                  <p className="text-sm text-gray-900 mt-1">{selectedAddr.addressLine3}</p>
                                </div>
                              )}
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <Label className="text-xs text-gray-600">State</Label>
                                <p className="text-sm text-gray-900 mt-1">{selectedAddr.state}</p>
                              </div>
                              <div>
                                <Label className="text-xs text-gray-600">City</Label>
                                <p className="text-sm text-gray-900 mt-1">{selectedAddr.city}</p>
                              </div>
                              <div>
                                <Label className="text-xs text-gray-600">Pincode</Label>
                                <p className="text-sm text-gray-900 mt-1">{selectedAddr.pincode}</p>
                              </div>
                            </div>
                            <div>
                              <Label className="text-xs text-gray-600">GST Number</Label>
                              <p className="text-sm text-gray-900 mt-1">{selectedAddr.gst}</p>
                            </div>
                          </div>
                        );
                      })()}
                    </>
                  )}

                  {/* New Address Entry Form */}
                  {commonBilling.addressType === 'new' && (
                    <>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>First Line of Address <span className="text-red-500">*</span></Label>
                          <Input 
                            placeholder="Enter address line 1"
                            value={commonBilling.addressLine1}
                            onChange={(e) => setCommonBilling(prev => ({ ...prev, addressLine1: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Second Line of Address <span className="text-red-500">*</span></Label>
                          <Input 
                            placeholder="Enter address line 2"
                            value={commonBilling.addressLine2}
                            onChange={(e) => setCommonBilling(prev => ({ ...prev, addressLine2: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Third Line of Address</Label>
                          <Input 
                            placeholder="Enter address line 3"
                            value={commonBilling.addressLine3}
                            onChange={(e) => setCommonBilling(prev => ({ ...prev, addressLine3: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>State <span className="text-red-500">*</span></Label>
                          <Select 
                            value={commonBilling.state} 
                            onValueChange={(value) => setCommonBilling(prev => ({ ...prev, state: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              {states.map((state) => (
                                <SelectItem key={state} value={state}>{state}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>City <span className="text-red-500">*</span></Label>
                          <Select 
                            value={commonBilling.city} 
                            onValueChange={(value) => setCommonBilling(prev => ({ ...prev, city: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select city" />
                            </SelectTrigger>
                            <SelectContent>
                              {cities[commonBilling.state]?.map((city) => (
                                <SelectItem key={city} value={city}>{city}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Pincode <span className="text-red-500">*</span></Label>
                          <Input 
                            placeholder="Enter pincode"
                            value={commonBilling.pincode}
                            onChange={(e) => setCommonBilling(prev => ({ ...prev, pincode: e.target.value }))}
                          />
                        </div>
                      </div>

                      {/* GST field only for new addresses */}
                      <div className="space-y-2">
                        <Label>GST*</Label>
                        <Input 
                          value={commonBilling.gst} 
                          onChange={(e) => setCommonBilling(prev => ({ ...prev, gst: e.target.value }))}
                          disabled={commonBilling.noGST}
                          placeholder="Enter GST number"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="common-noGST" 
                          checked={commonBilling.noGST}
                          onCheckedChange={(checked) => setCommonBilling(prev => ({ ...prev, noGST: checked as boolean }))}
                        />
                        <Label htmlFor="common-noGST" className="text-sm font-normal">
                          I don't have GST for this address
                        </Label>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Individual FID Billing Addresses */}
              {commonBillingAddress === 'no' && (
                <div className="flex gap-4 h-[600px]">
                  {/* Left Sidebar - FID List */}
                  <div className="w-48 border rounded-lg bg-white overflow-y-auto">
                    <div className="p-3 border-b bg-gray-50">
                      <Label className="text-sm">FID</Label>
                    </div>
                    <div className="p-2 space-y-1">
                      {mockFIDsByPair.flatMap(group => group.fids).map((fid, index) => (
                        <button
                          key={fid.fid}
                          onClick={() => setFidBillingAddresses(prev => ({ ...prev, selectedFid: fid.fid }))}
                          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center justify-between ${
                            (fidBillingAddresses.selectedFid || mockFIDsByPair[0].fids[0].fid) === fid.fid
                              ? 'bg-blue-50 text-blue-600 border border-blue-200'
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <span>{fid.fid}</span>
                          {index === 0 && !fidBillingAddresses.selectedFid && (
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Right Content - Form for Selected FID */}
                  <div className="flex-1 border rounded-lg bg-white p-6 overflow-y-auto">
                    {(() => {
                      const selectedFid = mockFIDsByPair.flatMap(group => group.fids).find(
                        fid => fid.fid === (fidBillingAddresses.selectedFid || mockFIDsByPair[0].fids[0].fid)
                      ) || mockFIDsByPair[0].fids[0];
                      
                      const currentFidData = fidBillingAddresses[selectedFid.fid] || fidBillingAddresses['FID-2025-001'];
                      
                      return (
                        <div className="space-y-6">
                          {/* FID Header */}
                          <div className="pb-4 border-b">
                            <h3 className="text-lg text-gray-900">FID: {selectedFid.fid}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Rabale | Fiber | 100 Mbps
                            </p>
                          </div>

                          {/* Address Type Radio Buttons */}
                          <div className="space-y-3">
                            <Label>Choose the address type <span className="text-red-500">*</span></Label>
                            <RadioGroup 
                              value={currentFidData.addressType}
                              onValueChange={(value) => setFidBillingAddresses(prev => ({
                                ...prev,
                                [selectedFid.fid]: { ...currentFidData, addressType: value }
                              }))}
                            >
                              <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="existing" id={`existing-${selectedFid.fid}`} />
                                  <Label htmlFor={`existing-${selectedFid.fid}`} className="font-normal">
                                    Existing Address
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="new" id={`new-${selectedFid.fid}`} />
                                  <Label htmlFor={`new-${selectedFid.fid}`} className="font-normal">
                                    New Address
                                  </Label>
                                </div>
                              </div>
                            </RadioGroup>
                          </div>

                          {/* Existing Address Selection */}
                          {currentFidData.addressType === 'existing' && (
                            <>
                              <div className="space-y-2">
                                <Label>Select Address*</Label>
                                <Select 
                                  value={currentFidData.selectedAddress} 
                                  onValueChange={(value) => setFidBillingAddresses(prev => ({
                                    ...prev,
                                    [selectedFid.fid]: { ...currentFidData, selectedAddress: value }
                                  }))}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select an address" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {existingAddresses.map((addr) => (
                                      <SelectItem key={addr.id} value={addr.id}>{addr.label}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Show selected address details as read-only */}
                              {currentFidData.selectedAddress && (() => {
                                const selectedAddr = existingAddresses.find(addr => addr.id === currentFidData.selectedAddress);
                                if (!selectedAddr) return null;

                                return (
                                  <div className="mt-4 p-4 bg-gray-50 border rounded-lg space-y-3">
                                    <h4 className="text-sm text-gray-900">Address Details</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                      <div>
                                        <Label className="text-xs text-gray-600">Address Line 1</Label>
                                        <p className="text-sm text-gray-900 mt-1">{selectedAddr.addressLine1}</p>
                                      </div>
                                      <div>
                                        <Label className="text-xs text-gray-600">Address Line 2</Label>
                                        <p className="text-sm text-gray-900 mt-1">{selectedAddr.addressLine2}</p>
                                      </div>
                                      {selectedAddr.addressLine3 && (
                                        <div>
                                          <Label className="text-xs text-gray-600">Address Line 3</Label>
                                          <p className="text-sm text-gray-900 mt-1">{selectedAddr.addressLine3}</p>
                                        </div>
                                      )}
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                      <div>
                                        <Label className="text-xs text-gray-600">State</Label>
                                        <p className="text-sm text-gray-900 mt-1">{selectedAddr.state}</p>
                                      </div>
                                      <div>
                                        <Label className="text-xs text-gray-600">City</Label>
                                        <p className="text-sm text-gray-900 mt-1">{selectedAddr.city}</p>
                                      </div>
                                      <div>
                                        <Label className="text-xs text-gray-600">Pincode</Label>
                                        <p className="text-sm text-gray-900 mt-1">{selectedAddr.pincode}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-xs text-gray-600">GST Number</Label>
                                      <p className="text-sm text-gray-900 mt-1">{selectedAddr.gst}</p>
                                    </div>
                                  </div>
                                );
                              })()}
                            </>
                          )}

                          {/* New Address Entry Form */}
                          {currentFidData.addressType === 'new' && (
                            <>
                              {/* Address Lines */}
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label>First Line of Address <span className="text-red-500">*</span></Label>
                                  <Input 
                                    placeholder="Enter address line 1"
                                    value={currentFidData.addressLine1}
                                    onChange={(e) => setFidBillingAddresses(prev => ({
                                      ...prev,
                                      [selectedFid.fid]: { ...currentFidData, addressLine1: e.target.value }
                                    }))}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Second Line of Address <span className="text-red-500">*</span></Label>
                                  <Input 
                                    placeholder="Enter address line 2"
                                    value={currentFidData.addressLine2}
                                    onChange={(e) => setFidBillingAddresses(prev => ({
                                      ...prev,
                                      [selectedFid.fid]: { ...currentFidData, addressLine2: e.target.value }
                                    }))}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Third Line of Address</Label>
                                  <Input 
                                    placeholder="Enter address line 3"
                                    value={currentFidData.addressLine3}
                                    onChange={(e) => setFidBillingAddresses(prev => ({
                                      ...prev,
                                      [selectedFid.fid]: { ...currentFidData, addressLine3: e.target.value }
                                    }))}
                                  />
                                </div>
                              </div>

                              {/* State, City, Pincode */}
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label>State <span className="text-red-500">*</span></Label>
                                  <Select 
                                    value={currentFidData.state}
                                    onValueChange={(value) => setFidBillingAddresses(prev => ({
                                      ...prev,
                                      [selectedFid.fid]: { ...currentFidData, state: value, city: '' }
                                    }))}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select state" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {states.map((state) => (
                                        <SelectItem key={state} value={state}>{state}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>City <span className="text-red-500">*</span></Label>
                                  <Select 
                                    value={currentFidData.city}
                                    onValueChange={(value) => setFidBillingAddresses(prev => ({
                                      ...prev,
                                      [selectedFid.fid]: { ...currentFidData, city: value }
                                    }))}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select city" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {currentFidData.state && cities[currentFidData.state]?.map((city) => (
                                        <SelectItem key={city} value={city}>{city}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Pincode <span className="text-red-500">*</span></Label>
                                  <Input 
                                    placeholder="Enter pincode"
                                    value={currentFidData.pincode}
                                    onChange={(e) => setFidBillingAddresses(prev => ({
                                      ...prev,
                                      [selectedFid.fid]: { ...currentFidData, pincode: e.target.value }
                                    }))}
                                  />
                                </div>
                              </div>

                              {/* GST */}
                              <div className="space-y-2">
                                <Label>GST <span className="text-red-500">*</span></Label>
                                <Input 
                                  placeholder="Enter GST"
                                  value={currentFidData.gst}
                                  onChange={(e) => setFidBillingAddresses(prev => ({
                                    ...prev,
                                    [selectedFid.fid]: { ...currentFidData, gst: e.target.value }
                                  }))}
                                  disabled={currentFidData.noGST}
                                />
                              </div>

                              {/* No GST Checkbox */}
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`no-gst-${selectedFid.fid}`}
                                  checked={currentFidData.noGST}
                                  onCheckedChange={(checked) => setFidBillingAddresses(prev => ({
                                    ...prev,
                                    [selectedFid.fid]: { ...currentFidData, noGST: checked as boolean }
                                  }))}
                                />
                                <Label htmlFor={`no-gst-${selectedFid.fid}`} className="font-normal text-sm">
                                  I don't have GST for the current address
                                </Label>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/proposal-details', { state: { proposalId } })}
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
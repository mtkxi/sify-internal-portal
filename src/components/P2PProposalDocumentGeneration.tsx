import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ArrowLeft, FileText, Download, Share2, ChevronDown, ChevronRight, Eye, Check, IndianRupee, Link2, MapPin, Package } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

interface FIDPair {
  id: string;
  pairNumber: number;
  fid1: string;
  fid2: string;
  fid1Location: string;
  fid2Location: string;
  fid1LocationCategory?: string;
  fid2LocationCategory?: string;
  linkType?: string;
  portType?: string;
  portBandwidth?: string;
  bandwidth: string;
  connectionType: string;
  otc: number;
  arc: number;
}

interface VASConfig {
  fid: string;
  deviceOwnership: 'own' | 'buy' | '';
  serviceVariant?: 'bundled' | 'select-model';
  devices?: Array<{ type: string; count: number; productCode?: string }>;
  managedService?: boolean;
  deviceManagement?: 'configuration' | 'configuration-hardware';
}

export function P2PProposalDocumentGeneration() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get data from navigation state
  const { 
    proposalId, 
    company, 
    product = 'P2P',
    subProduct = 'GCC',
    opportunityId,
    fidPairs = [],
    vasConfigs = {},
    nidMake = {},
    nidModel = {}
  } = location.state || {};
  
  const [customerDetailsOpen, setCustomerDetailsOpen] = useState(false);
  const [requirementDetailsOpen, setRequirementDetailsOpen] = useState(false);
  const [bomDetailsOpen, setBomDetailsOpen] = useState(true);
  const [outputFormat, setOutputFormat] = useState("PDF Document");
  const [templateStyle, setTemplateStyle] = useState("Corporate");
  const [deliveryOption, setDeliveryOption] = useState("email");
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [solutionArchitect, setSolutionArchitect] = useState("");
  
  const [contentOptions, setContentOptions] = useState({
    technicalAppendix: true,
    detailedPricing: false,
    implementationTimeline: true,
    teamProfiles: false,
    caseStudies: false,
    customerTestimonials: false,
    complianceCertificates: true,
    warrantyInfo: true
  });

  // Mock solution architects
  const solutionArchitects = [
    "Amit Sharma - Senior Solutions Architect",
    "Priya Desai - Cloud Solutions Architect",
    "Rajesh Kumar - Enterprise Solutions Architect",
    "Neha Patel - Network Solutions Architect"
  ];

  // Generate mock BOM data for each pair
  const generateFIDPricing = (pair: FIDPair, fidNumber: 1 | 2): { otc: number; arc: number } => {
    const fid = fidNumber === 1 ? pair.fid1 : pair.fid2;
    let otc = 0;
    let arc = 0;
    
    // Core connectivity split between both FIDs
    const coreOTC = subProduct === 'GCC' ? 45000 : subProduct === 'EVPL' ? 30000 : subProduct === 'EPL' ? 20000 : 50000;
    const coreARC = subProduct === 'GCC' ? 35000 : subProduct === 'EVPL' ? 25000 : subProduct === 'EPL' ? 15000 : 40000;
    otc += coreOTC / 2;
    arc += coreARC / 2;
    
    // Port configuration
    if (pair.portType) {
      otc += 15000;
      arc += 5000;
    }
    
    // Link Type split
    if (pair.linkType) {
      otc += 5000;
      arc += 2500;
    }
    
    // VAS for this FID
    if (vasConfigs[fid]) {
      const vas = vasConfigs[fid];
      if (vas.devices && vas.devices.length > 0) {
        vas.devices.forEach(device => {
          const devicePrice = vas.deviceOwnership === 'buy' ? 25000 : 0;
          const managedPrice = vas.deviceOwnership === 'own' ? 8000 : (vas.managedService ? 8000 : 0);
          otc += devicePrice * device.count;
          arc += managedPrice * device.count;
        });
      }
    }
    
    // NID for EPL
    if (subProduct === 'EPL' && nidMake[fid] && nidModel[fid]) {
      otc += 18000;
      arc += 3000;
    }
    
    return { otc, arc };
  };

  // Calculate totals for each pair
  const pairTotals = fidPairs.map((pair: FIDPair) => {
    const fid1Pricing = generateFIDPricing(pair, 1);
    const fid2Pricing = generateFIDPricing(pair, 2);
    const totalOTC = fid1Pricing.otc + fid2Pricing.otc;
    const totalARC = fid1Pricing.arc + fid2Pricing.arc;
    return { 
      pairNumber: pair.pairNumber, 
      totalOTC, 
      totalARC,
      fid1Pricing,
      fid2Pricing
    };
  });

  // Grand totals
  const grandTotalOTC = pairTotals.reduce((sum, pt) => sum + pt.totalOTC, 0);
  const grandTotalARC = pairTotals.reduce((sum, pt) => sum + pt.totalARC, 0);
  const grandTotalSolution = grandTotalOTC + (grandTotalARC * 3); // 3 year contract

  const handleShare = () => {
    if (deliveryOption === 'email') {
      toast.success('Proposal shared via email to customer');
    } else if (deliveryOption === 'portal') {
      toast.success('Proposal uploaded to customer portal');
    } else {
      toast.success('Proposal shared via email and uploaded to portal');
    }
  };

  const handleDownload = () => {
    toast.success('Downloading proposal document...');
    setTimeout(() => {
      toast.success('Proposal downloaded successfully');
    }, 1000);
  };

  const handleFinalize = () => {
    toast.success('Proposal finalized successfully!');
    setTimeout(() => {
      navigate('/requirements');
    }, 1500);
  };

  // Get badge color based on sub product
  const getProductBadgeColor = () => {
    switch (subProduct) {
      case 'GCC': return 'bg-green-100 text-green-700';
      case 'EVPL': return 'bg-blue-100 text-blue-700';
      case 'EPL': return 'bg-orange-100 text-orange-700';
      case 'DEPL': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-gray-900">Proposal Document Generation</h1>
                <p className="text-sm text-gray-600">
                  {proposalId || 'PROP-P2P-001'} - {company || 'TechCorp Solutions'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">In Progress</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* Customer Details - Collapsible */}
        <Card>
          <Collapsible open={customerDetailsOpen} onOpenChange={setCustomerDetailsOpen}>
            <CollapsibleTrigger className="w-full">
              <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Customer Details</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">{company || 'TechCorp Solutions'}</p>
                  </div>
                  {customerDetailsOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Customer Name</p>
                  <p className="text-gray-900">{company || 'TechCorp Solutions Pvt Ltd'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact Person</p>
                  <p className="text-gray-900">Rajesh Kumar</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-gray-900">rajesh.kumar@techcorp.com</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="text-gray-900">+91 98765 43210</p>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Requirement Details - Collapsible */}
        <Card>
          <Collapsible open={requirementDetailsOpen} onOpenChange={setRequirementDetailsOpen}>
            <CollapsibleTrigger className="w-full">
              <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Requirement Details</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">New - 3 years Contract • {fidPairs.length} P2P Pair{fidPairs.length !== 1 ? 's' : ''}</p>
                  </div>
                  {requirementDetailsOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Product</p>
                  <Badge className="bg-indigo-100 text-indigo-700 mt-1">P2P</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sub Product</p>
                  <Badge className={`${getProductBadgeColor()} mt-1`}>P2P - {subProduct}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Pairs</p>
                  <p className="text-gray-900 mt-1">{fidPairs.length} Pair{fidPairs.length !== 1 ? 's' : ''}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contract Term</p>
                  <p className="text-gray-900 mt-1">36 Months</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Opportunity ID</p>
                  <p className="text-gray-900 mt-1">{opportunityId || 'OPP-2025-020'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Version</p>
                  <p className="text-gray-900 mt-1">v1.0</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Generated On</p>
                  <p className="text-gray-900 mt-1">
                    {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* BOM List - Collapsible */}
        <Card>
          <Collapsible open={bomDetailsOpen} onOpenChange={setBomDetailsOpen}>
            <CollapsibleTrigger className="w-full">
              <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Package className="w-5 h-5" />
                      <span>Bill of Materials (BOM)</span>
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">{fidPairs.length} P2P Pair{fidPairs.length !== 1 ? 's' : ''} configured</p>
                  </div>
                  {bomDetailsOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="p-6 space-y-8">
                {fidPairs.map((pair: FIDPair, index: number) => {
                  const pairTotal = pairTotals[index];
                  return (
                    <div key={pair.id}>
                      {/* Pair Header */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <Badge className="bg-blue-600 text-white">
                                Pair {pair.pairNumber}
                              </Badge>
                              <Badge className={getProductBadgeColor()}>
                                {subProduct}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* FID Details Table */}
                      <div className="border rounded-lg overflow-hidden mb-4">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-100">
                              <TableHead className="font-semibold">FID</TableHead>
                              <TableHead className="font-semibold">Location</TableHead>
                              <TableHead className="font-semibold">Bandwidth</TableHead>
                              <TableHead className="font-semibold">Last Mile Type</TableHead>
                              <TableHead className="font-semibold">Port Details</TableHead>
                              <TableHead className="font-semibold text-right">OTC (₹)</TableHead>
                              <TableHead className="font-semibold text-right">ARC (₹)</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {/* FID 1 */}
                            <TableRow>
                              <TableCell className="font-medium">
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">A</Badge>
                                  <span>{pair.fid1}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-start space-x-2">
                                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="text-sm">{pair.fid1Location}</p>
                                    {pair.fid1LocationCategory && (
                                      <Badge 
                                        variant="outline" 
                                        className={`text-xs mt-1 ${
                                          pair.fid1LocationCategory === 'Cloud Provider' 
                                            ? 'bg-sky-50 text-sky-700 border-sky-300' 
                                            : 'bg-gray-50 text-gray-600 border-gray-300'
                                        }`}
                                      >
                                        {pair.fid1LocationCategory}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-green-100 text-green-700 border-green-300">
                                  {pair.bandwidth}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm">{pair.connectionType || 'Fiber Optic'}</span>
                              </TableCell>
                              <TableCell>
                                {pair.portType && pair.portBandwidth ? (
                                  <div className="text-sm">
                                    <p className="font-medium">{pair.portType}</p>
                                    <p className="text-gray-600 text-xs">{pair.portBandwidth}</p>
                                  </div>
                                ) : (
                                  <span className="text-sm text-gray-500">-</span>
                                )}
                              </TableCell>
                              <TableCell className="text-right font-semibold">
                                ₹{pairTotal.fid1Pricing.otc.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-right font-semibold">
                                ₹{pairTotal.fid1Pricing.arc.toLocaleString()}
                              </TableCell>
                            </TableRow>
                            {/* Link Indicator */}
                            <TableRow className="bg-blue-50">
                              <TableCell colSpan={7} className="py-2 text-center">
                                <div className="flex items-center justify-center space-x-2">
                                  <div className="h-px w-full bg-blue-300"></div>
                                  <Link2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                  <div className="h-px w-full bg-blue-300"></div>
                                </div>
                              </TableCell>
                            </TableRow>
                            {/* FID 2 */}
                            <TableRow>
                              <TableCell className="font-medium">
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-300">B</Badge>
                                  <span>{pair.fid2}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-start space-x-2">
                                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="text-sm">{pair.fid2Location}</p>
                                    {pair.fid2LocationCategory && (
                                      <Badge 
                                        variant="outline" 
                                        className={`text-xs mt-1 ${
                                          pair.fid2LocationCategory === 'Cloud Provider' 
                                            ? 'bg-sky-50 text-sky-700 border-sky-300' 
                                            : 'bg-gray-50 text-gray-600 border-gray-300'
                                        }`}
                                      >
                                        {pair.fid2LocationCategory}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-green-100 text-green-700 border-green-300">
                                  {pair.bandwidth}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm">{pair.connectionType || 'Fiber Optic'}</span>
                              </TableCell>
                              <TableCell>
                                {pair.portType && pair.portBandwidth ? (
                                  <div className="text-sm">
                                    <p className="font-medium">{pair.portType}</p>
                                    <p className="text-gray-600 text-xs">{pair.portBandwidth}</p>
                                  </div>
                                ) : (
                                  <span className="text-sm text-gray-500">-</span>
                                )}
                              </TableCell>
                              <TableCell className="text-right font-semibold">
                                ₹{pairTotal.fid2Pricing.otc.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-right font-semibold">
                                ₹{pairTotal.fid2Pricing.arc.toLocaleString()}
                              </TableCell>
                            </TableRow>
                            {/* Pair Total Row */}
                            <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-50 font-semibold">
                              <TableCell colSpan={5} className="text-right">
                                Pair {pair.pairNumber} Total:
                              </TableCell>
                              <TableCell className="text-right text-blue-700">
                                ₹{pairTotal.totalOTC.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-right text-blue-700">
                                ₹{pairTotal.totalARC.toLocaleString()}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                      
                      {index < fidPairs.length - 1 && <Separator className="my-6" />}
                    </div>
                  );
                })}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Proposal Summary */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="flex items-center space-x-2">
              <IndianRupee className="w-5 h-5" />
              <span>Proposal Summary</span>
            </CardTitle>
            <CardDescription>Financial overview for {fidPairs.length} P2P pair{fidPairs.length !== 1 ? 's' : ''}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-700">One-Time Cost (OTC)</span>
                <span className="text-xl font-semibold text-gray-900">₹{grandTotalOTC.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-700">Annual Recurring Cost (ARC)</span>
                <span className="text-xl font-semibold text-gray-900">₹{grandTotalARC.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg px-4 mt-4">
                <span className="font-semibold text-gray-900">Total Solution Value (3 Years)</span>
                <span className="text-2xl font-bold text-blue-700">₹{grandTotalSolution.toLocaleString()}</span>
              </div>
            </div>

            {/* Billing Terms */}
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-semibold text-gray-900 mb-4">Billing Terms</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Payment terms: Net 30 days from invoice date</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>One-time costs due within 30 days of service activation</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Recurring charges billed monthly in advance</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>90-day notice required for service termination</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>All services covered under standard SLA with response time guarantee</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>12-month warranty on all hardware components</span>
                </li>
              </ul>
            </div>

            {/* Preview Button */}
            <div className="mt-6 pt-6 border-t flex justify-end">
              <Button
                variant="outline"
                onClick={() => setPreviewDialogOpen(true)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Document Configuration */}
        <div className="grid grid-cols-2 gap-6">
          {/* Output Options */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-base">Output Format</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label className="text-sm font-medium">Document Format</Label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF Document">PDF Document</SelectItem>
                    <SelectItem value="Word Document">Word Document</SelectItem>
                    <SelectItem value="PowerPoint">PowerPoint Presentation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Template Style</Label>
                <Select value={templateStyle} onValueChange={setTemplateStyle}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Corporate">Corporate</SelectItem>
                    <SelectItem value="Modern">Modern</SelectItem>
                    <SelectItem value="Minimalist">Minimalist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Options */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-base">Delivery Options</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <RadioGroup value={deliveryOption} onValueChange={setDeliveryOption}>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <RadioGroupItem value="email" id="email" />
                    <Label htmlFor="email" className="cursor-pointer flex-1">
                      <span className="text-sm font-medium">Email to Customer</span>
                      <p className="text-xs text-gray-500 mt-0.5">Send via email notification</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <RadioGroupItem value="portal" id="portal" />
                    <Label htmlFor="portal" className="cursor-pointer flex-1">
                      <span className="text-sm font-medium">Upload to Portal</span>
                      <p className="text-xs text-gray-500 mt-0.5">Share via customer portal</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <RadioGroupItem value="both" id="both" />
                    <Label htmlFor="both" className="cursor-pointer flex-1">
                      <span className="text-sm font-medium">Both Email & Portal</span>
                      <p className="text-xs text-gray-500 mt-0.5">Maximum visibility</p>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Content Options */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-base">Additional Content</CardTitle>
            <CardDescription>Select optional sections to include in the proposal</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(contentOptions).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <Checkbox
                    id={key}
                    checked={value}
                    onCheckedChange={(checked) => 
                      setContentOptions({ ...contentOptions, [key]: checked as boolean })
                    }
                  />
                  <Label htmlFor={key} className="cursor-pointer flex-1 text-sm">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Configuration
          </Button>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              className="bg-slate-800 hover:bg-slate-900"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Proposal Preview</DialogTitle>
            <DialogDescription>
              Preview of the proposal document for {company || 'TechCorp Solutions'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 p-6 bg-white border rounded-lg">
            <div className="text-center border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-900">OneSify Colocation</h2>
              <p className="text-gray-600 mt-2">Point-to-Point Connectivity Proposal</p>
              <Badge className={`${getProductBadgeColor()} mt-2`}>P2P - {subProduct}</Badge>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
                <p className="text-sm text-gray-600">{company || 'TechCorp Solutions Pvt Ltd'}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Configured Pairs</h3>
                <div className="space-y-2">
                  {fidPairs.map((pair: FIDPair) => (
                    <div key={pair.id} className="text-sm border-l-2 border-blue-500 pl-3 py-1">
                      <p className="font-medium">Pair {pair.pairNumber}: {pair.fid1} ↔ {pair.fid2}</p>
                      <p className="text-xs text-gray-600">{pair.fid1Location} → {pair.fid2Location}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Financial Summary</h3>
                <div className="bg-gray-50 p-4 rounded space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>One-Time Cost:</span>
                    <span className="font-medium">₹{grandTotalOTC.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Annual Recurring Cost:</span>
                    <span className="font-medium">₹{grandTotalARC.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold pt-2 border-t">
                    <span>Total (3 Years):</span>
                    <span className="text-blue-700">₹{grandTotalSolution.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
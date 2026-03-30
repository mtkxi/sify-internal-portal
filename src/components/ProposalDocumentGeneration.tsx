import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ArrowLeft, FileText, Download, Share2, ChevronDown, ChevronRight, Sparkles, Eye, Check, IndianRupee, UserPlus, X, MapPin, Building2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

export function ProposalDocumentGeneration() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get data from navigation state
  const { proposalId, company, networkProduct, opportunityId, pricingData, totals } = location.state || {};
  
  const [customerDetailsOpen, setCustomerDetailsOpen] = useState(false);
  const [requirementDetailsOpen, setRequirementDetailsOpen] = useState(false);
  const [outputFormat, setOutputFormat] = useState("PDF Document");
  const [templateStyle, setTemplateStyle] = useState("Corporate");
  const [deliveryOption, setDeliveryOption] = useState("email");
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [solutionArchitect, setSolutionArchitect] = useState("");
  const [bomGroupBy, setBomGroupBy] = useState<"connection" | "company">("connection");
  
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

  const [generateSolutionDoc, setGenerateSolutionDoc] = useState(false);
  const [solutionDocGenerating, setSolutionDocGenerating] = useState(false);
  const [solutionDocGenerated, setSolutionDocGenerated] = useState(false);

  // Mock solution architects
  const solutionArchitects = [
    "Amit Sharma - Senior Solutions Architect",
    "Priya Desai - Cloud Solutions Architect",
    "Rajesh Kumar - Enterprise Solutions Architect",
    "Neha Patel - Network Solutions Architect"
  ];

  // Watch for checkbox changes
  useEffect(() => {
    if (generateSolutionDoc && !solutionDocGenerated && !solutionDocGenerating) {
      handleGenerateSolutionDoc();
    }
  }, [generateSolutionDoc]);

  const handleGenerateSolutionDoc = () => {
    setSolutionDocGenerating(true);
    toast.info('AI is generating your solution document...');
    
    setTimeout(() => {
      setSolutionDocGenerating(false);
      setSolutionDocGenerated(true);
      toast.success('Solution document generated successfully!');
    }, 3000);
  };

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

  // Mock pricing summary based on passed data
  const pricingSummary = [
    { item: 'TechCorp Solutions', description: 'One-time Cost', amount: totals?.totalPropOTC || 95000 },
    { item: '', description: 'Annual Recurring Cost', amount: totals?.totalPropARC || 165000 },
    { item: '', description: 'Total Solution Value', amount: (totals?.totalPropOTC || 95000) + ((totals?.totalPropARC || 165000) * 1), total: true }
  ];

  // Transform pricingData into BOM items structure
  const transformToBOMItems = (data: any[]) => {
    const bomRows: any[] = [];
    
    data.forEach((fid: any) => {
      // Add Core row
      bomRows.push({
        fid: fid.fid,
        linkId: fid.linkId, // Add linkId field
        type: fid.type || 'New',
        connectionType: fid.connectionType,
        bandwidth: fid.bandwidth,
        linkType: fid.linkType,
        category: 'Core',
        company: 'STL',
        otc: fid.otc || 0,
        arc: fid.arc || 0,
        location: fid.location
      });
      
      // Add Tower row if wireless
      if (fid.connectionType?.toLowerCase().includes('wireless')) {
        bomRows.push({
          fid: fid.fid,
          linkId: fid.linkId, // Add linkId field
          type: fid.type || 'New',
          connectionType: fid.connectionType,
          bandwidth: fid.bandwidth,
          linkType: fid.linkType,
          category: 'Tower',
          company: 'STL',
          otc: 15000,
          arc: 8000,
          location: fid.location
        });
      }
      
      // Add VAS items as separate rows
      if (fid.vas && Array.isArray(fid.vas)) {
        fid.vas.forEach((vasItem: string) => {
          // Determine pricing based on VAS type
          let vasOTC = 5000;
          let vasARC = 1000;
          let vasCompany = 'SDSL';
          
          if (vasItem.includes('Catalyst') || vasItem.includes('Switch')) {
            vasOTC = 15000;
            vasARC = 3000;
          } else if (vasItem.includes('DDoS')) {
            vasOTC = 10000;
            vasARC = 5000;
          } else if (vasItem.includes('IPv4') || vasItem.includes('IPv6')) {
            vasOTC = 5000;
            vasARC = 1000;
          }
          
          bomRows.push({
            fid: fid.fid,
            linkId: fid.linkId, // Add linkId field
            type: fid.type || 'New',
            connectionType: fid.connectionType,
            bandwidth: fid.bandwidth,
            linkType: fid.linkType,
            category: vasItem,
            company: vasCompany,
            otc: vasOTC,
            arc: vasARC,
            location: fid.location
          });
        });
      }
    });
    
    return bomRows;
  };

  // Mock BOM Items - use transformed pricingData or fallback to mock data
  const bomItems = pricingData && Array.isArray(pricingData) && pricingData.length > 0
    ? transformToBOMItems(pricingData)
    : [
    // Bandra Kurla Complex, Mumbai - FID-2025-001
    {
      fid: 'FID-2025-001',
      linkId: 'LINK-2025-001',
      type: 'New',
      connectionType: 'Wireless',
      bandwidth: '100 Mbps',
      linkType: 'Primary',
      category: 'Core',
      company: 'STL',
      otc: 50000,
      arc: 25000,
      location: 'Bandra Kurla Complex, Mumbai'
    },
    {
      fid: 'FID-2025-001',
      linkId: 'LINK-2025-001',
      type: 'New',
      connectionType: 'Wireless',
      bandwidth: '100 Mbps',
      linkType: 'Primary',
      category: 'Tower',
      company: 'STL',
      otc: 15000,
      arc: 8000,
      location: 'Bandra Kurla Complex, Mumbai'
    },
    {
      fid: 'FID-2025-001',
      linkId: 'LINK-2025-001',
      type: 'New',
      connectionType: 'Wireless',
      bandwidth: '100 Mbps',
      linkType: 'Primary',
      category: 'Static IPv4/32',
      company: 'SDSL',
      otc: 5000,
      arc: 1000,
      location: 'Bandra Kurla Complex, Mumbai'
    },
    {
      fid: 'FID-2025-001',
      linkId: 'LINK-2025-001',
      type: 'New',
      connectionType: 'Wireless',
      bandwidth: '100 Mbps',
      linkType: 'Primary',
      category: 'Catalyst 9400 Series',
      company: 'SDSL',
      otc: 15000,
      arc: 3000,
      location: 'Bandra Kurla Complex, Mumbai'
    },
    // Andheri East, Mumbai - FID-2025-002
    {
      fid: 'FID-2025-002',
      linkId: 'LINK-2025-002',
      type: 'New',
      connectionType: 'Fiber',
      bandwidth: '22 Mbps',
      linkType: 'Secondary',
      category: 'Core',
      company: 'STL',
      otc: 0,
      arc: 0,
      location: 'Andheri East, Mumbai'
    },
    {
      fid: 'FID-2025-002',
      linkId: 'LINK-2025-002',
      type: 'New',
      connectionType: 'Fiber',
      bandwidth: '22 Mbps',
      linkType: 'Secondary',
      category: 'DDoS 10 Gbps',
      company: 'SDSL',
      otc: 10000,
      arc: 5000,
      location: 'Andheri East, Mumbai'
    }
  ];

  // Debug log to check what data is being received
  console.log('Pricing Data received:', pricingData);
  console.log('Transformed BOM Items:', bomItems);

  // Helper function to calculate LM charges (assumed to be 30% of Core OTC/ARC for Fiber)
  const calculateLMCharges = (coreOTC: number, coreARC: number) => {
    return {
      otc: Math.round(coreOTC * 0.3),
      arc: Math.round(coreARC * 0.3)
    };
  };

  // Helper function to group items
  const getGroupedBOMItems = () => {
    if (bomGroupBy === 'connection') {
      // Group by Connection (FID) - current default behavior
      return bomItems;
    } else {
      // Group by Company (STL vs SDSL)
      const stlItems = bomItems.filter((item: any) => item.company === 'STL');
      const sdslItems = bomItems.filter((item: any) => item.company === 'SDSL');
      return [...stlItems, ...sdslItems];
    }
  };

  // Render BOM table rows
  const renderBOMRows = () => {
    const groupedItems = getGroupedBOMItems();
    const rows: JSX.Element[] = [];
    
    if (bomGroupBy === 'connection') {
      // Group by Connection (FID)
      let currentFID: string | null = null;
      
      groupedItems.forEach((item: any, idx: number) => {
        const isCoreOrTower = item.category === 'Core' || item.category === 'Tower';
        const isCore = item.category === 'Core';
        const isFiber = item.connectionType?.toLowerCase().includes('fiber');
        
        // Add FID header if FID changes
        if (currentFID !== item.fid) {
          currentFID = item.fid;
          rows.push(
            <TableRow key={`fid-header-${item.fid}-${idx}`} className="bg-gray-100">
              <TableCell colSpan={7} className="text-xs font-semibold text-gray-900 py-2">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-700">{item.location}</span>
                  </div>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-700">{item.bandwidth}</span>
                </div>
              </TableCell>
            </TableRow>
          );
        }
        
        // Main row - Show all column details
        rows.push(
          <TableRow 
            key={`bom-${item.fid}-${item.category}-${idx}`}
            className={isCoreOrTower ? 'bg-white' : 'bg-purple-50'}
          >
            <TableCell className="text-xs">
              <span className="text-blue-600 font-medium">{item.fid}</span>
            </TableCell>
            <TableCell className="text-xs">
              {item.linkId && (
                <span className="text-gray-900">{item.linkId}</span>
              )}
            </TableCell>
            <TableCell className="text-xs">
              <Badge
                variant="outline"
                className={`text-xs font-medium ${
                  item.company === 'STL'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-purple-50 text-purple-700 border-purple-200'
                }`}
              >
                {item.company || 'STL'}
              </Badge>
            </TableCell>
            <TableCell className="text-xs">
              <div className="flex items-center space-x-1 max-w-[180px]">
                <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                <span className="text-gray-900 truncate">{item.location}</span>
              </div>
            </TableCell>
            <TableCell className="text-xs">
              {isCore ? (
                <div>
                  <div className="flex items-center space-x-1">
                    <Building2 className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-700 font-medium">
                      Core / {item.connectionType} / {item.bandwidth} / {item.linkType}
                    </span>
                  </div>
                  {isFiber && (
                    <div className="text-[10px] text-gray-500 italic mt-0.5">
                      Inclusive of LM charges
                    </div>
                  )}
                </div>
              ) : isCoreOrTower ? (
                <div className="flex items-center space-x-1">
                  <Building2 className="w-3 h-3 text-gray-500" />
                  <span className="text-gray-700 font-medium">{item.category}</span>
                </div>
              ) : (
                <span className="text-gray-700">{item.category}</span>
              )}
            </TableCell>
            <TableCell className="text-xs text-right">
              <span className="text-gray-900 font-medium">
                {item.otc ? item.otc.toLocaleString() : '0'}
              </span>
            </TableCell>
            <TableCell className="text-xs text-right">
              <span className="text-gray-900 font-medium">
                {item.arc ? item.arc.toLocaleString() : '0'}
              </span>
            </TableCell>
          </TableRow>
        );
        
        // Add LM Charges sub-row for Core items with Fiber
        if (isCore && isFiber) {
          const lmCharges = calculateLMCharges(item.otc || 0, item.arc || 0);
          rows.push(
            <TableRow 
              key={`bom-lm-${item.fid}-${idx}`}
              className="bg-gray-50"
            >
              <TableCell className="text-xs" colSpan={2}></TableCell>
              <TableCell className="text-xs">
                <Badge
                  variant="outline"
                  className="text-xs font-medium bg-blue-50 text-blue-700 border-blue-200"
                >
                  STL
                </Badge>
              </TableCell>
              <TableCell className="text-xs" colSpan={1}></TableCell>
              <TableCell className="text-xs pl-8">
                <span className="text-gray-600 italic text-[10px]">↳ Last Mile Charges (included)</span>
              </TableCell>
              <TableCell className="text-xs text-right">
                <span className="text-gray-600 italic">
                  {lmCharges.otc.toLocaleString()}
                </span>
              </TableCell>
              <TableCell className="text-xs text-right">
                <span className="text-gray-600 italic">
                  {lmCharges.arc.toLocaleString()}
                </span>
              </TableCell>
            </TableRow>
          );
        }
      });
    } else {
      // Group by Company (STL vs SDSL)
      let currentCompany: string | null = null;
      
      groupedItems.forEach((item: any, idx: number) => {
        const isCoreOrTower = item.category === 'Core' || item.category === 'Tower';
        const isCore = item.category === 'Core';
        const isFiber = item.connectionType?.toLowerCase().includes('fiber');
        
        // Add company header if company changes
        if (currentCompany !== item.company) {
          currentCompany = item.company;
          rows.push(
            <TableRow key={`company-header-${item.company}-${idx}`} className="bg-gray-100">
              <TableCell colSpan={7} className="text-xs font-semibold text-gray-900 py-2">
                {item.company === 'STL' ? 'STL (Sify Technologies Limited)' : 'SDSL (Sify Digital Services Limited)'}
              </TableCell>
            </TableRow>
          );
        }
        
        // Main row
        rows.push(
          <TableRow 
            key={`bom-company-${item.fid}-${item.category}-${idx}`}
            className={isCoreOrTower ? 'bg-white' : 'bg-purple-50'}
          >
            <TableCell className="text-xs">
              <span className="text-blue-600 font-medium">{item.fid}</span>
            </TableCell>
            <TableCell className="text-xs">
              {item.linkId && (
                <span className="text-gray-900">{item.linkId}</span>
              )}
            </TableCell>
            <TableCell className="text-xs">
              <Badge
                variant="outline"
                className={`text-xs font-medium ${
                  item.company === 'STL'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-purple-50 text-purple-700 border-purple-200'
                }`}
              >
                {item.company || 'STL'}
              </Badge>
            </TableCell>
            <TableCell className="text-xs">
              <div className="flex items-center space-x-1 max-w-[180px]">
                <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                <span className="text-gray-900 truncate">{item.location}</span>
              </div>
            </TableCell>
            <TableCell className="text-xs">
              {isCore ? (
                <div>
                  <div className="flex items-center space-x-1">
                    <Building2 className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-700 font-medium">
                      Core / {item.connectionType} / {item.bandwidth} / {item.linkType}
                    </span>
                  </div>
                  {isFiber && (
                    <div className="text-[10px] text-gray-500 italic mt-0.5">
                      Inclusive of LM charges
                    </div>
                  )}
                </div>
              ) : isCoreOrTower ? (
                <div className="flex items-center space-x-1">
                  <Building2 className="w-3 h-3 text-gray-500" />
                  <span className="text-gray-700 font-medium">{item.category}</span>
                </div>
              ) : (
                <span className="text-gray-700">{item.category}</span>
              )}
            </TableCell>
            <TableCell className="text-xs text-right">
              <span className="text-gray-900 font-medium">
                {item.otc ? item.otc.toLocaleString() : '0'}
              </span>
            </TableCell>
            <TableCell className="text-xs text-right">
              <span className="text-gray-900 font-medium">
                {item.arc ? item.arc.toLocaleString() : '0'}
              </span>
            </TableCell>
          </TableRow>
        );
        
        // Add LM Charges sub-row for Core items with Fiber
        if (isCore && isFiber) {
          const lmCharges = calculateLMCharges(item.otc || 0, item.arc || 0);
          rows.push(
            <TableRow 
              key={`bom-lm-company-${item.fid}-${idx}`}
              className="bg-gray-50"
            >
              <TableCell className="text-xs" colSpan={2}></TableCell>
              <TableCell className="text-xs">
                <Badge
                  variant="outline"
                  className="text-xs font-medium bg-blue-50 text-blue-700 border-blue-200"
                >
                  STL
                </Badge>
              </TableCell>
              <TableCell className="text-xs" colSpan={1}></TableCell>
              <TableCell className="text-xs pl-8">
                <span className="text-gray-600 italic text-[10px]">↳ Last Mile Charges (included)</span>
              </TableCell>
              <TableCell className="text-xs text-right">
                <span className="text-gray-600 italic">
                  {lmCharges.otc.toLocaleString()}
                </span>
              </TableCell>
              <TableCell className="text-xs text-right">
                <span className="text-gray-600 italic">
                  {lmCharges.arc.toLocaleString()}
                </span>
              </TableCell>
            </TableRow>
          );
        }
      });
    }
    
    return rows;
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
                  {proposalId || 'REQ-FID001/01'} - Generate and finalize an encase
                </p>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">In Progress</Badge>
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
                    <p className="text-sm text-gray-500 mt-1">{company || 'TechCorp Solutions Pvt Ltd'}</p>
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
                    <p className="text-sm text-gray-500 mt-1">New - 3 years Contract</p>
                  </div>
                  {requirementDetailsOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Req Id</p>
                  <p className="text-gray-900">NW00005</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="text-gray-900">New</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Version</p>
                  <p className="text-gray-900">v1.0</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">FIDs</p>
                  <p className="text-gray-900">5</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Created Date</p>
                  <p className="text-gray-900">2025-02-04</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contract term</p>
                  <p className="text-gray-900">3 years</p>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* AI-Powered Solution Document */}
        <Card className={generateSolutionDoc ? 'border-blue-300 shadow-md' : ''}>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <CardTitle>AI-Powered Solution Document</CardTitle>
            </div>
            <p className="text-sm text-gray-600">
              Generate a detailed technical solution document with architecture diagrams and implementation plans
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Solution Architect Assignment */}
            <div>
              <Label className="text-sm text-gray-900 mb-2 block">Assign Solution Architect</Label>
              <div className="flex items-center space-x-2">
                <Select value={solutionArchitect} onValueChange={setSolutionArchitect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select solution architect" />
                  </SelectTrigger>
                  <SelectContent>
                    {solutionArchitects.map((architect, idx) => (
                      <SelectItem key={idx} value={architect}>
                        {architect}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {solutionArchitect && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSolutionArchitect("")}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              {solutionArchitect && (
                <p className="text-xs text-green-600 mt-2 flex items-center">
                  <Check className="w-3 h-3 mr-1" />
                  Solution architect assigned
                </p>
              )}
            </div>

            {/* Generate Solution Document Checkbox */}
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <Checkbox
                id="generate-solution"
                checked={generateSolutionDoc}
                onCheckedChange={(checked) => setGenerateSolutionDoc(checked as boolean)}
                disabled={solutionDocGenerated}
              />
              <div className="flex-1">
                <Label
                  htmlFor="generate-solution"
                  className="text-sm text-gray-900 cursor-pointer"
                >
                  Generate Solution Document
                </Label>
                <p className="text-xs text-gray-600 mt-1">
                  Include network topology, implementation phases, and technical specifications
                </p>
                {solutionDocGenerating && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center space-x-2 text-xs text-blue-700">
                      <Sparkles className="w-3 h-3 animate-pulse" />
                      <span>AI is analyzing your requirements and generating the document...</span>
                    </div>
                    <Progress value={66} className="h-2" />
                  </div>
                )}
                {solutionDocGenerated && (
                  <div className="mt-3 flex items-center space-x-2 text-xs text-green-700">
                    <Check className="w-4 h-4" />
                    <span>Solution document generated successfully!</span>
                  </div>
                )}
              </div>
            </div>


          </CardContent>
        </Card>

        {/* Proposal Generation */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Proposal Generation</CardTitle>
                <p className="text-sm text-gray-600">Solution and pricing summary for your cloud solution</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setPreviewDialogOpen(true)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary Grid */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs text-gray-600">Container</p>
                <p className="text-sm text-gray-900">{company || 'TechCorp Solutions'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Requirement</p>
                <p className="text-sm text-gray-900">{networkProduct || 'DIA Service'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Cloud Term</p>
                <p className="text-sm text-gray-900">36 days</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Payment Model</p>
                <p className="text-sm text-gray-900">Managed Services</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Timeline</p>
                <p className="text-sm text-gray-900">30 days</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Location</p>
                <p className="text-sm text-gray-900">Mumbai, Bangalore</p>
              </div>
            </div>

            {/* Billing Terms */}
            <div>
              <h3 className="text-sm text-gray-900 mb-3">Billing Terms</h3>
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

            {/* Pricing Summary */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm text-gray-900">Pricing Summary</h3>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left text-xs text-gray-600 px-4 py-3">Item</th>
                      <th className="text-right text-xs text-gray-600 px-4 py-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {pricingSummary.map((item, idx) => (
                      <tr key={idx} className={item.total ? 'bg-blue-50' : ''}>
                        <td className="px-4 py-3">
                          {item.item && <p className="text-sm text-gray-900">{item.item}</p>}
                          <p className={`text-sm ${item.total ? 'text-gray-900' : 'text-gray-600'}`}>
                            {item.description}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end">
                            <IndianRupee className="w-4 h-4 mr-1 text-gray-600" />
                            <span className={`text-sm ${item.total ? 'text-gray-900' : 'text-gray-900'}`}>
                              {item.amount.toLocaleString()}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* BOM Items */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm text-gray-900">BOM Items</h3>
                <div className="flex items-center space-x-2">
                  <Label className="text-xs text-gray-600">Group By:</Label>
                  <Select value={bomGroupBy} onValueChange={(value: "connection" | "company") => setBomGroupBy(value)}>
                    <SelectTrigger className="w-[140px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="connection">Connection</SelectItem>
                      <SelectItem value="company">Company</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-xs text-gray-600">FID</TableHead>
                      <TableHead className="text-xs text-gray-600">Link ID</TableHead>
                      <TableHead className="text-xs text-gray-600">Company</TableHead>
                      <TableHead className="text-xs text-gray-600">Location</TableHead>
                      <TableHead className="text-xs text-gray-600">Service Details</TableHead>
                      <TableHead className="text-xs text-gray-600 text-right">OTC</TableHead>
                      <TableHead className="text-xs text-gray-600 text-right">ARC</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {renderBOMRows()}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Document Configuration</CardTitle>
            <p className="text-sm text-gray-600">Customize document format, content, and delivery options</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Output Format & Template Style */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-sm text-gray-900 mb-2 block">Output Format</Label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF Document">PDF Document</SelectItem>
                    <SelectItem value="Word Document">Word Document</SelectItem>
                    <SelectItem value="PowerPoint">PowerPoint</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm text-gray-900 mb-2 block">Template Style</Label>
                <Select value={templateStyle} onValueChange={setTemplateStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Corporate">Corporate</SelectItem>
                    <SelectItem value="Modern">Modern</SelectItem>
                    <SelectItem value="Minimal">Minimal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Content Options */}
            <div>
              <Label className="text-sm text-gray-900 mb-3 block">Content Options</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="technical-appendix-2"
                    checked={contentOptions.technicalAppendix}
                    onCheckedChange={(checked) =>
                      setContentOptions({ ...contentOptions, technicalAppendix: checked as boolean })
                    }
                  />
                  <Label htmlFor="technical-appendix-2" className="text-sm cursor-pointer">
                    Technical appendix
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="case-studies-2"
                    checked={contentOptions.caseStudies}
                    onCheckedChange={(checked) =>
                      setContentOptions({ ...contentOptions, caseStudies: checked as boolean })
                    }
                  />
                  <Label htmlFor="case-studies-2" className="text-sm cursor-pointer">
                    Case studies
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="detailed-pricing-2"
                    checked={contentOptions.detailedPricing}
                    onCheckedChange={(checked) =>
                      setContentOptions({ ...contentOptions, detailedPricing: checked as boolean })
                    }
                  />
                  <Label htmlFor="detailed-pricing-2" className="text-sm cursor-pointer">
                    Detailed pricing breakdown
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="customer-testimonials-2"
                    checked={contentOptions.customerTestimonials}
                    onCheckedChange={(checked) =>
                      setContentOptions({ ...contentOptions, customerTestimonials: checked as boolean })
                    }
                  />
                  <Label htmlFor="customer-testimonials-2" className="text-sm cursor-pointer">
                    Customer testimonials
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="implementation-timeline-2"
                    checked={contentOptions.implementationTimeline}
                    onCheckedChange={(checked) =>
                      setContentOptions({ ...contentOptions, implementationTimeline: checked as boolean })
                    }
                  />
                  <Label htmlFor="implementation-timeline-2" className="text-sm cursor-pointer">
                    Implementation timeline
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="compliance-certificates-2"
                    checked={contentOptions.complianceCertificates}
                    onCheckedChange={(checked) =>
                      setContentOptions({ ...contentOptions, complianceCertificates: checked as boolean })
                    }
                  />
                  <Label htmlFor="compliance-certificates-2" className="text-sm cursor-pointer">
                    Compliance certificates
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="team-profiles-2"
                    checked={contentOptions.teamProfiles}
                    onCheckedChange={(checked) =>
                      setContentOptions({ ...contentOptions, teamProfiles: checked as boolean })
                    }
                  />
                  <Label htmlFor="team-profiles-2" className="text-sm cursor-pointer">
                    Team profiles
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="warranty-info-2"
                    checked={contentOptions.warrantyInfo}
                    onCheckedChange={(checked) =>
                      setContentOptions({ ...contentOptions, warrantyInfo: checked as boolean })
                    }
                  />
                  <Label htmlFor="warranty-info-2" className="text-sm cursor-pointer">
                    Warranty information
                  </Label>
                </div>
              </div>
            </div>

            {/* Delivery Options */}
            <div>
              <Label className="text-sm text-gray-900 mb-3 block">Delivery Options</Label>
              <RadioGroup value={deliveryOption} onValueChange={setDeliveryOption}>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="email-2" />
                    <Label htmlFor="email-2" className="text-sm cursor-pointer">
                      Upload to customer portal
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="portal" id="portal-2" />
                    <Label htmlFor="portal-2" className="text-sm cursor-pointer">
                      Both email and portal
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Document Out - Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button onClick={handleShare} className="bg-blue-600 hover:bg-blue-700">
            <Share2 className="w-4 h-4 mr-2" />
            Share Proposal
          </Button>
        </div>
      </div>

      {/* Proposal Document Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Proposal Document Preview</DialogTitle>
            <DialogDescription>
              Preview the generated proposal document before finalizing
            </DialogDescription>
          </DialogHeader>
          
          {/* Mock Proposal Preview */}
          <div className="border rounded-lg p-8 bg-white shadow-sm">
            <div className="text-center mb-8">
              <h2 className="text-2xl text-gray-900 mb-2">Cloud Solution Proposal</h2>
              <p className="text-sm text-gray-600">Proposed by: {company || 'TechCorp Solutions Pvt Ltd'}</p>
              <p className="text-sm text-gray-600">Date: November 4, 2025</p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-base text-gray-900 mb-3">Executive Summary</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  We are pleased to present this comprehensive proposal for Dedicated Internet Access (DIA) services for {company || 'TechCorp Solutions'}. 
                  This solution includes high-performance secure access across multiple locations, designed to meet your organization's 
                  growing connectivity needs while ensuring enterprise-grade reliability and performance.
                </p>
              </div>

              <div>
                <h3 className="text-base text-gray-900 mb-3">Solution Overview</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between py-2 border-b">
                    <span>Service</span>
                    <span className="text-gray-900">{networkProduct || 'DIA - Dedicated Internet Access'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Total Circuits</span>
                    <span className="text-gray-900">{pricingData?.length || 3} FIDs</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Contract Duration</span>
                    <span className="text-gray-900">1 Year</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Implementation Timeline</span>
                    <span className="text-gray-900">30 days</span>
                  </div>
                  {solutionArchitect && (
                    <div className="flex justify-between py-2 border-b">
                      <span>Solution Architect</span>
                      <span className="text-gray-900">{solutionArchitect}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-base text-gray-900 mb-3">Pricing Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Item</span>
                    <span className="text-gray-700">Amount</span>
                  </div>
                  <div className="flex justify-between text-sm border-b pb-2">
                    <span className="text-gray-900">One-time Setup Cost</span>
                    <span className="text-gray-900">₹{(totals?.totalPropOTC || 95000).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm border-b pb-2">
                    <span className="text-gray-900">Annual Recurring Cost</span>
                    <span className="text-gray-900">₹{(totals?.totalPropARC || 165000).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2">
                    <span className="text-gray-900">Total Solution Value</span>
                    <span className="text-gray-900">₹{((totals?.totalPropOTC || 95000) + (totals?.totalPropARC || 165000)).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base text-gray-900 mb-3">Terms & Conditions</h3>
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
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
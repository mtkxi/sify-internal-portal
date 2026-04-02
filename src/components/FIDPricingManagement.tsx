import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ArrowLeft, Calculator, CheckCircle, AlertCircle, Save, Info } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface VASItem {
  category: 'Additional IP' | 'Managed Services' | 'Devices' | 'DDOS';
  value: string;
  description?: string;
}

interface FIDPricing {
  fid: string;
  type: string;
  location: string;
  connType: string;
  bandwidth: string;
  linkType: string;
  company: 'STL' | 'SDSL';
  vas: VASItem[];
  referenceOTC: number;
  referenceARC: number;
  proposedOTC: number;
  proposedARC: number;
  otcMargin: number;
  arcMargin: number;
  // QoS configuration for MPLS
  qosMode?: 'single' | 'split';
  qosSingle?: 'Bronze' | 'Gold' | 'Diamond';
  qosSplit?: {
    bronze: number;
    gold: number;
    diamond: number;
  };
  qosSplitUnit?: 'mbps' | 'percent';
  // QoS pricing breakdown
  qosReferenceARC?: {
    bronze?: number;
    gold?: number;
    diamond?: number;
  };
  qosProposedARC?: {
    bronze?: number;
    gold?: number;
    diamond?: number;
  };
}

const mockFIDPricing: FIDPricing[] = [
  {
    fid: "FID001",
    type: "New",
    location: "Mumbai DC-1",
    connType: "Wireless",
    bandwidth: "22 Mbps",
    linkType: "Primary",
    company: "STL",
    vas: [
      { category: "Additional IP", value: "Static IPV4/32" },
      { category: "Managed Services", value: "Managed Router", description: "24/7 monitoring and configuration" }
    ],
    referenceOTC: 50000,
    referenceARC: 25000,
    proposedOTC: 50000,
    proposedARC: 25000,
    otcMargin: 0,
    arcMargin: 0,
    // MPLS with Uniform QoS example
    qosMode: 'single',
    qosSingle: 'Gold',
    qosReferenceARC: {
      gold: 25000
    },
    qosProposedARC: {
      gold: 25000
    }
  },
  {
    fid: "FID002",
    type: "New",
    location: "Mumbai DC-1",
    connType: "Fibre",
    bandwidth: "55 Mbps",
    linkType: "Secondary",
    company: "SDSL",
    vas: [
      { category: "Devices", value: "Catalyst 9400 Series" }
    ],
    referenceOTC: 75000,
    referenceARC: 35000,
    proposedOTC: 75000,
    proposedARC: 35000,
    otcMargin: 0,
    arcMargin: 0,
    // MPLS with Distributed QoS example
    qosMode: 'split',
    qosSplit: {
      bronze: 20,
      gold: 25,
      diamond: 10
    },
    qosSplitUnit: 'mbps',
    qosReferenceARC: {
      bronze: 12000,
      gold: 15000,
      diamond: 8000
    },
    qosProposedARC: {
      bronze: 12000,
      gold: 15000,
      diamond: 8000
    }
  },
  {
    fid: "FID003",
    type: "Modify Bandwidth",
    location: "Bangalore DC-2",
    connType: "Fibre",
    bandwidth: "100 Mbps",
    linkType: "Primary",
    company: "STL",
    vas: [
      { category: "DDOS", value: "10 Gbps" }
    ],
    referenceOTC: 100000,
    referenceARC: 50000,
    proposedOTC: 100000,
    proposedARC: 50000,
    otcMargin: 0,
    arcMargin: 0,
    // MPLS with Distributed QoS example (different split)
    qosMode: 'split',
    qosSplit: {
      bronze: 40,
      gold: 40,
      diamond: 20
    },
    qosSplitUnit: 'mbps',
    qosReferenceARC: {
      bronze: 20000,
      gold: 20000,
      diamond: 10000
    },
    qosProposedARC: {
      bronze: 20000,
      gold: 20000,
      diamond: 10000
    }
  }
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export function FIDPricingManagement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [pricingStrategy, setPricingStrategy] = useState<'individual' | 'total'>('individual');
  const [fidPricing, setFidPricing] = useState<FIDPricing[]>(mockFIDPricing);
  const [totalTargetOTC, setTotalTargetOTC] = useState('');
  const [totalTargetARC, setTotalTargetARC] = useState('');

  // Get networkProduct from location state to determine network type
  const { networkProduct, networkType: receivedNetworkType, fidConfigurations } = location.state || {};
  const networkType = receivedNetworkType || (networkProduct?.includes('Site Connect') ? 'Site Connect' : 'Express Connect');

  // Margin threshold configuration
  const MARGIN_THRESHOLD = {
    GOOD: 10, // Above 10% is good (green)
    WARNING: 5, // Between 5-10% needs review (yellow)
    CRITICAL: 0 // Below 5% is critical (red)
  };

  const calculateMargin = (reference: number, proposed: number) => {
    if (reference === 0) return 0;
    return ((reference - proposed) / reference) * 100;
  };

  const getMarginColor = (margin: number) => {
    if (margin >= MARGIN_THRESHOLD.GOOD) return 'text-green-600';
    if (margin >= MARGIN_THRESHOLD.WARNING) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMarginBgColor = (margin: number) => {
    if (margin >= MARGIN_THRESHOLD.GOOD) return 'bg-green-100 text-green-700';
    if (margin >= MARGIN_THRESHOLD.WARNING) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const getMarginIcon = (margin: number) => {
    if (margin >= MARGIN_THRESHOLD.GOOD) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (margin >= MARGIN_THRESHOLD.WARNING) return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    return <AlertCircle className="w-4 h-4 text-red-600" />;
  };

  const updateIndividualPricing = (fid: string, field: 'proposedOTC' | 'proposedARC', value: number) => {
    setFidPricing(items => items.map(item => {
      if (item.fid === fid) {
        const updated = { ...item, [field]: value };
        updated.otcMargin = calculateMargin(updated.referenceOTC, updated.proposedOTC);
        updated.arcMargin = calculateMargin(updated.referenceARC, updated.proposedARC);
        return updated;
      }
      return item;
    }));
  };

  const getTotalOTC = () => {
    return fidPricing.reduce((total, item) => total + item.proposedOTC, 0);
  };

  const getTotalARC = () => {
    return fidPricing.reduce((total, item) => total + item.proposedARC, 0);
  };

  const getTotalReferenceOTC = () => {
    return fidPricing.reduce((total, item) => total + item.referenceOTC, 0);
  };

  const getTotalReferenceARC = () => {
    return fidPricing.reduce((total, item) => total + item.referenceARC, 0);
  };

  const getOverallOTCMargin = () => {
    return calculateMargin(getTotalReferenceOTC(), getTotalOTC());
  };

  const getOverallARCMargin = () => {
    return calculateMargin(getTotalReferenceARC(), getTotalARC());
  };

  const distributeValues = () => {
    if (!totalTargetOTC || !totalTargetARC) {
      toast.error('Please enter both Target Total OTC and Target Total ARC');
      return;
    }

    const targetOTC = parseFloat(totalTargetOTC);
    const targetARC = parseFloat(totalTargetARC);
    const currentOTC = getTotalOTC();
    const currentARC = getTotalARC();

    const otcRatio = targetOTC / currentOTC;
    const arcRatio = targetARC / currentARC;

    setFidPricing(items => items.map(item => {
      const updated = {
        ...item,
        proposedOTC: Math.round(item.proposedOTC * otcRatio),
        proposedARC: Math.round(item.proposedARC * arcRatio)
      };
      updated.otcMargin = calculateMargin(updated.referenceOTC, updated.proposedOTC);
      updated.arcMargin = calculateMargin(updated.referenceARC, updated.proposedARC);
      return updated;
    }));

    toast.success('Pricing distributed across all FIDs');
  };

  const handleSavePricing = () => {
    // Validate margins
    const hasInvalidMargins = fidPricing.some(item => 
      item.otcMargin < MARGIN_THRESHOLD.WARNING || 
      item.arcMargin < MARGIN_THRESHOLD.WARNING
    );

    if (hasInvalidMargins) {
      const confirm = window.confirm(
        'Some FIDs have margins below the threshold. This may require additional approval. Do you want to continue?'
      );
      if (!confirm) return;
    }

    toast.success('Pricing saved successfully');
    setTimeout(() => {
      navigate(`/configure-proposal/${id}`);
    }, 1000);
  };

  // Helper to render ARC cell with QoS breakdown for MPLS
  const renderARCCell = (item: FIDPricing, type: 'reference' | 'proposed') => {
    const arc = type === 'reference' ? item.referenceARC : item.proposedARC;
    const qosBreakdown = type === 'reference' ? item.qosReferenceARC : item.qosProposedARC;

    // Only show QoS breakdown for MPLS
    if (networkType !== 'MPLS' || !item.qosMode) {
      return <div className="text-center">{formatCurrency(arc)}</div>;
    }

    // Uniform QoS (single tier)
    if (item.qosMode === 'single' && item.qosSingle) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-center flex items-center justify-center gap-1 cursor-help">
                <span>{formatCurrency(arc)}</span>
                <Info className="w-3 h-3 text-gray-400" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-white border border-gray-200 shadow-lg p-3">
              <div className="space-y-1">
                <div className="font-medium text-xs text-gray-700 mb-2">Uniform QoS</div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-gray-600">{item.qosSingle}:</span>
                  <span className="text-xs font-medium text-gray-900">{formatCurrency(arc)}</span>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    // Distributed QoS (split across tiers)
    if (item.qosMode === 'split' && item.qosSplit && qosBreakdown) {
      const hasBronze = (item.qosSplit.bronze || 0) > 0;
      const hasGold = (item.qosSplit.gold || 0) > 0;
      const hasDiamond = (item.qosSplit.diamond || 0) > 0;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-center flex items-center justify-center gap-1 cursor-help">
                <span>{formatCurrency(arc)}</span>
                <Info className="w-3 h-3 text-gray-400" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-white border border-gray-200 shadow-lg p-3">
              <div className="space-y-1">
                <div className="font-medium text-xs text-gray-700 mb-2">Distributed QoS</div>
                {hasBronze && (
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-gray-600">Bronze:</span>
                    <span className="text-xs font-medium text-gray-900">{formatCurrency(qosBreakdown.bronze || 0)}</span>
                  </div>
                )}
                {hasGold && (
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-gray-600">Gold:</span>
                    <span className="text-xs font-medium text-gray-900">{formatCurrency(qosBreakdown.gold || 0)}</span>
                  </div>
                )}
                {hasDiamond && (
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-gray-600">Diamond:</span>
                    <span className="text-xs font-medium text-gray-900">{formatCurrency(qosBreakdown.diamond || 0)}</span>
                  </div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return <div className="text-center">{formatCurrency(arc)}</div>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1600px] mx-auto p-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(`/configure-proposal/${id}`)}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-gray-900">Pricing Management</h1>
            <Badge 
              variant="outline" 
              className={`text-sm px-3 py-1 ${
                networkType === 'MPLS' 
                  ? 'bg-purple-100 text-purple-700 border-purple-300' 
                  : 'bg-blue-100 text-blue-700 border-blue-300'
              }`}
            >
              {networkType} Network
            </Badge>
          </div>
          <p className="text-sm text-gray-600">Adjust pricing and manage margin analysis</p>
        </div>

        {/* Pricing Strategy Selection */}
        <Card className="mb-6">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center">
              <Calculator className="w-5 h-5 mr-2" />
              Pricing Strategy
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">Choose how you want to update the pricing for this proposal</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div 
                className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  pricingStrategy === 'individual' 
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setPricingStrategy('individual')}
              >
                {pricingStrategy === 'individual' && (
                  <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-blue-600" />
                )}
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`p-2 rounded-full ${
                    pricingStrategy === 'individual' ? 'bg-blue-600' : 'bg-gray-400'
                  }`}>
                    <Calculator className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-medium">Individual Line Items</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Edit pricing for each BOM item individually in the table. Best for precise control over specific items.
                </p>
              </div>

              <div 
                className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  pricingStrategy === 'total' 
                    ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setPricingStrategy('total')}
              >
                {pricingStrategy === 'total' && (
                  <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-purple-600" />
                )}
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`p-2 rounded-full ${
                    pricingStrategy === 'total' ? 'bg-purple-600' : 'bg-gray-400'
                  }`}>
                    <Calculator className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-medium">Total Value Override</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Set target total values and automatically distribute across line items. Perfect for budget-based pricing.
                </p>
              </div>
            </div>

            {pricingStrategy === 'total' && (
              <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-medium text-sm mb-3 text-purple-800">Total Value Override</h4>
                <div className="grid grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="text-xs text-purple-700 mb-1 block">Target Total OTC (₹)</label>
                    <Input
                      type="number"
                      value={totalTargetOTC}
                      onChange={(e) => setTotalTargetOTC(e.target.value)}
                      className="border-purple-300 focus:border-purple-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-purple-700 mb-1 block">Target Total ARC (₹)</label>
                    <Input
                      type="number"
                      value={totalTargetARC}
                      onChange={(e) => setTotalTargetARC(e.target.value)}
                      className="border-purple-300 focus:border-purple-500"
                      placeholder="0"
                    />
                  </div>
                  <Button 
                    onClick={distributeValues} 
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Distribute Values
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* FID Pricing Table */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>BOM Items - Pricing & Margin Analysis</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Real-time margin calculations with approval workflow</p>
              </div>
              <Button 
                size="sm"
                className="bg-slate-800 hover:bg-slate-900"
                onClick={handleSavePricing}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Pricing
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>FID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Conn Type</TableHead>
                    <TableHead>Bandwidth</TableHead>
                    <TableHead>Link Type</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>VAS</TableHead>
                    <TableHead className="text-center">Reference OTC</TableHead>
                    <TableHead className="text-center">Reference ARC</TableHead>
                    <TableHead className="text-center">Proposed OTC</TableHead>
                    <TableHead className="text-center">Proposed ARC</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fidPricing.map((item) => (
                    <TableRow key={item.fid}>
                      <TableCell className="font-medium">{item.fid}</TableCell>
                      <TableCell>
                        <Badge className={item.type === "New" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}>
                          {item.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-700">{item.location}</TableCell>
                      <TableCell className="text-sm text-gray-700">{item.connType}</TableCell>
                      <TableCell className="text-sm text-gray-700">{item.bandwidth}</TableCell>
                      <TableCell className="text-sm text-gray-700">{item.linkType}</TableCell>
                      <TableCell>
                        <Badge className={item.company === "STL" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}>
                          {item.company}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {item.vas.map((vasItem, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {vasItem.category}: {vasItem.value}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {formatCurrency(item.referenceOTC)}
                      </TableCell>
                      <TableCell className="text-center">
                        {renderARCCell(item, 'reference')}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="space-y-2">
                          {pricingStrategy === 'individual' ? (
                            <Input 
                              type="number"
                              value={item.proposedOTC}
                              onChange={(e) => updateIndividualPricing(item.fid, 'proposedOTC', parseInt(e.target.value) || 0)}
                              className="w-32 mx-auto"
                            />
                          ) : (
                            <div className="font-medium">{formatCurrency(item.proposedOTC)}</div>
                          )}
                          <div className="flex items-center justify-center space-x-1">
                            {getMarginIcon(item.otcMargin)}
                            <span className={`text-xs px-2 py-1 rounded-full ${getMarginBgColor(item.otcMargin)}`}>
                              {item.otcMargin.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="space-y-2">
                          {pricingStrategy === 'individual' ? (
                            <Input 
                              type="number"
                              value={item.proposedARC}
                              onChange={(e) => updateIndividualPricing(item.fid, 'proposedARC', parseInt(e.target.value) || 0)}
                              className="w-32 mx-auto"
                            />
                          ) : (
                            <div className="font-medium">{renderARCCell(item, 'proposed')}</div>
                          )}
                          <div className="flex items-center justify-center space-x-1">
                            {getMarginIcon(item.arcMargin)}
                            <span className={`text-xs px-2 py-1 rounded-full ${getMarginBgColor(item.arcMargin)}`}>
                              {item.arcMargin.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {/* Totals Row */}
                  <TableRow className="bg-gray-50 border-t-2">
                    <TableCell colSpan={8} className="font-medium">Total</TableCell>
                    <TableCell className="text-center font-medium">
                      {formatCurrency(getTotalReferenceOTC())}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {formatCurrency(getTotalReferenceARC())}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-2">
                        <div className="font-medium">{formatCurrency(getTotalOTC())}</div>
                        <div className="flex items-center justify-center space-x-1">
                          {getMarginIcon(getOverallOTCMargin())}
                          <span className={`text-xs px-2 py-1 rounded-full ${getMarginBgColor(getOverallOTCMargin())}`}>
                            {getOverallOTCMargin().toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-2">
                        <div className="font-medium">{formatCurrency(getTotalARC())}</div>
                        <div className="flex items-center justify-center space-x-1">
                          {getMarginIcon(getOverallARCMargin())}
                          <span className={`text-xs px-2 py-1 rounded-full ${getMarginBgColor(getOverallARCMargin())}`}>
                            {getOverallARCMargin().toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <p>Total Solution Value: <span className="font-medium text-lg text-gray-900">{formatCurrency(getTotalOTC() + getTotalARC())}</span></p>
                <p className="text-xs mt-1">Review pricing and generate proposal document</p>
              </div>
              <Button 
                onClick={() => navigate(`/proposal-generation/${id}`)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Generate Proposal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
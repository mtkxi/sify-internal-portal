import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  ArrowLeft,
  MapPin,
  IndianRupee,
  Calculator,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Building2,
  Info,
  FileText,
  Settings,
  FileEdit,
  DollarSign,
  ChevronDown,
  X
} from 'lucide-react';

// Interfaces
interface FIDLineItem {
  fid: string;
  type: 'New' | 'Modify Bandwidth' | 'MDAC';
  serviceChangeType?: 'Address Change' | 'LM Change' | 'Bandwidth Change' | 'Add Secondary/Tertiary Link';
  linkId?: string; // For MDAC - the current link ID
  location: string;
  connectionType: string;
  serviceProvider?: string; // For "Other ISP" connections
  bandwidth: string;
  linkType: 'Primary' | 'Secondary';
  vas: string[];
  billedTo: 'STL' | 'SDSL';
  itemType: 'Main' | 'VAS';
  category?: 'Core' | 'Tower'; // Added category field
  referenceOTC: number;
  referenceARC: number;
  proposedOTC: number;
  proposedARC: number;
  minOTC: number;
  minARC: number;
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

interface LocationGroup {
  location: string;
  items: FIDLineItem[];
}

export function ProposalPricingManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { proposalId, company, networkProduct, networkType: receivedNetworkType, opportunityId, fidConfigurations } = location.state || {};
  
  // Determine network type from state or networkProduct
  const networkType = receivedNetworkType || (networkProduct?.includes('MPLS') ? 'MPLS' : 'DIA');

  const MIN_MARGIN_PERCENTAGE = 15;
  const REFERENCE_PRICING = {
    'Premium': { otc: 50000, arc: 25000 },
    'Basic': { otc: 30000, arc: 15000 },
    'Enterprise': { otc: 75000, arc: 35000 },
    'Business': { otc: 40000, arc: 20000 }
  };

  const VAS_PRICING: Record<string, { otc: number; arc: number }> = {
    'Static IPv4/32': { otc: 5000, arc: 1000 },
    'Managed Router': { otc: 8000, arc: 2000 },
    'Managed Firewall': { otc: 12000, arc: 3500 },
    'Catalyst 9400 Series': { otc: 15000, arc: 3000 },
    'Catalyst 9500 Series': { otc: 20000, arc: 4000 },
    'Aruba CX 6300 Series': { otc: 12000, arc: 2500 },
    'Aruba CX 6400 Series': { otc: 18000, arc: 3500 },
    'DDoS 10 Gbps': { otc: 10000, arc: 5000 },
    'DDoS 20 Gbps': { otc: 18000, arc: 8000 }
  };

  const calculateMinPrice = (referencePrice: number): number => {
    return Math.floor(referencePrice * (1 - MIN_MARGIN_PERCENTAGE / 100));
  };

  const calculateMargin = (proposed: number, reference: number): number => {
    if (reference === 0) return 0;
    return ((reference - proposed) / reference) * 100;
  };

  const initializePricingData = (): FIDLineItem[] => {
    const items: FIDLineItem[] = [];
    
    const configs = fidConfigurations || [
      {
        fid: 'FID-2025-001',
        type: 'New',
        location: 'Bandra Kurla Complex, Mumbai',
        connectionType: 'Fiber',
        bandwidth: '100 Mbps',
        linkType: 'Primary',
        vas: ['Static IPv4/32', 'Catalyst 9400 Series', 'DDoS 10 Gbps'],
        plan: 'Premium',
        otc: 50000,
        arc: 25000
      },
      {
        fid: 'FID-2025-002',
        type: 'New',
        location: 'Andheri East, Mumbai',
        connectionType: 'Wireless',
        bandwidth: '22 Mbps',
        linkType: 'Primary',
        vas: ['Managed Router'],
        plan: 'Basic',
        otc: 30000,
        arc: 15000
      },
      {
        fid: 'FID-2025-003',
        type: 'Modify Bandwidth',
        location: 'Bandra Kurla Complex, Mumbai',
        connectionType: 'Fiber',
        bandwidth: '55 Mbps',
        linkType: 'Primary',
        vas: ['Managed Firewall', 'Aruba CX 6300 Series'],
        plan: 'Business',
        otc: 40000,
        arc: 20000
      },
      {
        fid: 'FID-2025-004',
        type: 'New',
        location: 'Andheri East, Mumbai',
        connectionType: 'Other ISP',
        serviceProvider: 'Airtel',
        bandwidth: '50 Mbps',
        linkType: 'Primary',
        vas: [],
        plan: 'Business',
        otc: 35000,
        arc: 18000
      }
    ];

    configs.forEach(config => {
      const mainRefOTC = config.otc;
      const mainRefARC = config.arc;
      
      // Generate random prices for Core items
      const coreRefOTC = Math.floor(Math.random() * 30000) + 45000; // 45000-75000
      const coreRefARC = Math.floor(Math.random() * 15000) + 20000; // 20000-35000
      const corePropOTC = Math.floor(Math.random() * 30000) + 45000; // 45000-75000
      const corePropARC = Math.floor(Math.random() * 15000) + 20000; // 20000-35000
      
      const refOTC = config.connectionType === 'Fiber' ? coreRefOTC : mainRefOTC;
      const refARC = config.connectionType === 'Fiber' ? coreRefARC : mainRefARC;
      const propOTC = config.connectionType === 'Fiber' ? corePropOTC : mainRefOTC;
      const propARC = config.connectionType === 'Fiber' ? corePropARC : mainRefARC;
      
      // For MPLS networks, add QoS pricing breakdown
      let qosConfig = {};
      if (networkType === 'MPLS' && config.itemType !== 'VAS') {
        // Alternate between uniform and distributed QoS for demo
        if (config.fid === 'FID-2025-001') {
          // Uniform QoS (single tier)
          qosConfig = {
            qosMode: 'single' as const,
            qosSingle: 'Gold' as const,
            qosReferenceARC: {
              gold: refARC
            },
            qosProposedARC: {
              gold: propARC
            }
          };
        } else {
          // Distributed QoS (split across tiers)
          const bronzeRef = Math.floor(refARC * 0.3);
          const goldRef = Math.floor(refARC * 0.5);
          const diamondRef = refARC - bronzeRef - goldRef;
          
          const bronzeProp = Math.floor(propARC * 0.3);
          const goldProp = Math.floor(propARC * 0.5);
          const diamondProp = propARC - bronzeProp - goldProp;
          
          qosConfig = {
            qosMode: 'split' as const,
            qosSplit: {
              bronze: 30,
              gold: 50,
              diamond: 20
            },
            qosSplitUnit: 'percent' as const,
            qosReferenceARC: {
              bronze: bronzeRef,
              gold: goldRef,
              diamond: diamondRef
            },
            qosProposedARC: {
              bronze: bronzeProp,
              gold: goldProp,
              diamond: diamondProp
            }
          };
        }
      }
      
      items.push({
        fid: config.fid,
        type: config.type,
        serviceChangeType: config.serviceChangeType,
        linkId: config.linkId,
        location: config.location,
        connectionType: config.connectionType,
        serviceProvider: config.serviceProvider,
        bandwidth: config.bandwidth,
        linkType: config.linkType,
        vas: [],
        billedTo: 'STL',
        itemType: 'Main',
        category: config.connectionType === 'Fiber' ? 'Core' : (config.connectionType === 'Wireless' ? 'Core' : undefined),
        referenceOTC: refOTC,
        referenceARC: refARC,
        proposedOTC: propOTC,
        proposedARC: propARC,
        minOTC: calculateMinPrice(refOTC),
        minARC: calculateMinPrice(refARC),
        otcMargin: 0,
        arcMargin: 0,
        ...qosConfig
      });

      // Add Tower row only for Wireless connections
      if (config.connectionType === 'Wireless') {
        items.push({
          fid: config.fid,
          type: config.type,
          location: config.location,
          connectionType: config.connectionType,
          bandwidth: config.bandwidth,
          linkType: config.linkType,
          vas: [],
          billedTo: 'STL',
          itemType: 'Main',
          category: 'Tower',
          referenceOTC: 15000,
          referenceARC: 8000,
          proposedOTC: 15000,
          proposedARC: 8000,
          minOTC: calculateMinPrice(15000),
          minARC: calculateMinPrice(8000),
          otcMargin: 0,
          arcMargin: 0
        });
      }

      if (config.vas && config.vas.length > 0) {
        config.vas.forEach(vasName => {
          const vasOTC = VAS_PRICING[vasName]?.otc || 0;
          const vasARC = VAS_PRICING[vasName]?.arc || 0;
          
          items.push({
            fid: config.fid,
            type: config.type,
            location: config.location,
            connectionType: config.connectionType,
            bandwidth: config.bandwidth,
            linkType: config.linkType,
            vas: [vasName],
            billedTo: 'SDSL',
            itemType: 'VAS',
            referenceOTC: vasOTC,
            referenceARC: vasARC,
            proposedOTC: vasOTC,
            proposedARC: vasARC,
            minOTC: calculateMinPrice(vasOTC),
            minARC: calculateMinPrice(vasARC),
            otcMargin: 0,
            arcMargin: 0
          });
        });
      }
    });

    return items;
  };

  const [pricingData, setPricingData] = useState<FIDLineItem[]>(initializePricingData());
  const [pricingStrategy, setPricingStrategy] = useState<'individual' | 'total'>('individual');
  const [totalOverrideOTC, setTotalOverrideOTC] = useState('');
  const [totalOverrideARC, setTotalOverrideARC] = useState('');
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [pricingJustification, setPricingJustification] = useState('');
  const [bomGroupBy, setBomGroupBy] = useState<'connection' | 'company'>('connection');

  // Helper function to calculate LM charges (assumed to be 30% of Core OTC/ARC for Fiber)
  const calculateLMCharges = (coreOTC: number, coreARC: number) => {
    return {
      otc: Math.round(coreOTC * 0.3),
      arc: Math.round(coreARC * 0.3)
    };
  };

  // Check if there are any MDAC with Link ID
  const hasServiceChanges = useMemo(() => {
    return pricingData.some(item => item.type === 'MDAC' && item.linkId);
  }, [pricingData]);

  const locationGroups = useMemo((): LocationGroup[] => {
    const groups: { [key: string]: FIDLineItem[] } = {};
    
    pricingData.forEach(item => {
      if (!groups[item.location]) {
        groups[item.location] = [];
      }
      groups[item.location].push(item);
    });

    return Object.keys(groups).map(location => ({
      location,
      items: groups[location]
    }));
  }, [pricingData]);

  const totals = useMemo(() => {
    const totalRefOTC = pricingData.reduce((sum, item) => sum + item.referenceOTC, 0);
    const totalRefARC = pricingData.reduce((sum, item) => sum + item.referenceARC, 0);
    const totalPropOTC = pricingData.reduce((sum, item) => sum + item.proposedOTC, 0);
    const totalPropARC = pricingData.reduce((sum, item) => sum + item.proposedARC, 0);
    const totalMinOTC = pricingData.reduce((sum, item) => sum + item.minOTC, 0);
    const totalMinARC = pricingData.reduce((sum, item) => sum + item.minARC, 0);

    return {
      totalRefOTC,
      totalRefARC,
      totalPropOTC,
      totalPropARC,
      totalMinOTC,
      totalMinARC,
      totalOTCMargin: calculateMargin(totalPropOTC, totalRefOTC),
      totalARCMargin: calculateMargin(totalPropARC, totalRefARC)
    };
  }, [pricingData]);

  const validationIssues = useMemo(() => {
    const issues: string[] = [];
    
    pricingData.forEach(item => {
      if (item.proposedOTC < item.minOTC) {
        issues.push(`${item.fid} (${item.itemType}): OTC below minimum margin threshold`);
      }
      if (item.proposedARC < item.minARC) {
        issues.push(`${item.fid} (${item.itemType}): ARC below minimum margin threshold`);
      }
    });

    return issues;
  }, [pricingData]);

  const updateItemPricing = (fid: string, itemType: 'Main' | 'VAS', field: 'proposedOTC' | 'proposedARC', value: string, vasName?: string, category?: 'Core' | 'Tower') => {
    const numValue = parseFloat(value) || 0;
    
    setPricingData(prev =>
      prev.map(item => {
        // For Main items, match by category if provided; for VAS, match by vasName
        const isMatch = item.fid === fid && item.itemType === itemType && 
          (itemType === 'Main' ? (category ? item.category === category : !item.category) : (item.vas[0] === vasName));
        
        if (isMatch) {
          const updated = { ...item, [field]: numValue };
          
          updated.otcMargin = calculateMargin(updated.proposedOTC, updated.referenceOTC);
          updated.arcMargin = calculateMargin(updated.proposedARC, updated.referenceARC);
          
          return updated;
        }
        return item;
      })
    );
  };

  const applyTotalOverride = () => {
    const overrideOTC = parseFloat(totalOverrideOTC) || 0;
    const overrideARC = parseFloat(totalOverrideARC) || 0;

    if (overrideOTC === 0 && overrideARC === 0) {
      toast.error('Please enter override values');
      return;
    }

    if (overrideOTC > 0 && overrideOTC < totals.totalMinOTC) {
      toast.error(`Override OTC must be at least ₹${totals.totalMinOTC.toLocaleString()} to maintain minimum margin`);
      return;
    }

    if (overrideARC > 0 && overrideARC < totals.totalMinARC) {
      toast.error(`Override ARC must be at least ₹${totals.totalMinARC.toLocaleString()} to maintain minimum margin`);
      return;
    }

    setPricingData(prev => {
      const refOTCTotal = totals.totalRefOTC;
      const refARCTotal = totals.totalRefARC;

      return prev.map(item => {
        const updated = { ...item };
        
        if (overrideOTC > 0) {
          const otcProportion = item.referenceOTC / refOTCTotal;
          updated.proposedOTC = Math.round(overrideOTC * otcProportion);
        }
        
        if (overrideARC > 0) {
          const arcProportion = item.referenceARC / refARCTotal;
          updated.proposedARC = Math.round(overrideARC * arcProportion);
        }

        updated.otcMargin = calculateMargin(updated.proposedOTC, updated.referenceOTC);
        updated.arcMargin = calculateMargin(updated.proposedARC, updated.referenceARC);
        
        return updated;
      });
    });

    toast.success('Total override applied successfully');
    setTotalOverrideOTC('');
    setTotalOverrideARC('');
  };

  const handleSavePricing = () => {
    if (validationIssues.length > 0) {
      toast.error('Please fix all margin validation issues before submitting for approval');
      return;
    }

    // Open confirmation dialog instead of navigating directly
    setConfirmationDialogOpen(true);
  };

  const handleConfirmSubmission = () => {
    setConfirmationDialogOpen(false);
    toast.success('Proposal sent for pricing approval');
    
    // Redirect to dashboard after short delay
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  // Helper function to render ARC cells with QoS breakdown for MPLS
  const renderARCCell = (item: FIDLineItem, type: 'reference' | 'proposed') => {
    const arc = type === 'reference' ? item.referenceARC : item.proposedARC;
    const qosBreakdown = type === 'reference' ? item.qosReferenceARC : item.qosProposedARC;

    // For DIA networks or VAS items, just show the value
    if (networkType !== 'MPLS' || !qosBreakdown || item.itemType === 'VAS') {
      return <span className="text-gray-900">{arc.toLocaleString()}</span>;
    }

    // For MPLS networks with QoS, show tooltip with breakdown
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center justify-center gap-1 cursor-help">
              <span className="text-gray-900">{arc.toLocaleString()}</span>
              <Info className="w-3.5 h-3.5 text-purple-600" />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-white border-2 border-purple-200 shadow-lg p-3">
            <div className="space-y-2">
              <div className="font-semibold text-sm text-purple-900 border-b border-purple-200 pb-1">
                QoS Pricing Breakdown
              </div>
              {item.qosMode === 'single' ? (
                // Uniform QoS (single tier)
                <div className="space-y-1">
                  <div className="text-xs text-purple-700">Uniform QoS</div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-medium text-gray-700">{item.qosSingle}:</span>
                    <span className="text-xs text-gray-900">₹{arc.toLocaleString()}</span>
                  </div>
                </div>
              ) : (
                // Distributed QoS (multiple tiers)
                <div className="space-y-1">
                  <div className="text-xs text-purple-700 mb-1">Distributed QoS</div>
                  {qosBreakdown.bronze !== undefined && (
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs font-medium text-orange-700">Bronze:</span>
                      <span className="text-xs text-gray-900">₹{qosBreakdown.bronze.toLocaleString()}</span>
                    </div>
                  )}
                  {qosBreakdown.gold !== undefined && (
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs font-medium text-yellow-700">Gold:</span>
                      <span className="text-xs text-gray-900">₹{qosBreakdown.gold.toLocaleString()}</span>
                    </div>
                  )}
                  {qosBreakdown.diamond !== undefined && (
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs font-medium text-blue-700">Diamond:</span>
                      <span className="text-xs text-gray-900">₹{qosBreakdown.diamond.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-purple-200 pt-1 mt-1">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs font-semibold text-gray-900">Total:</span>
                      <span className="text-xs font-semibold text-gray-900">₹{arc.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  // Restore complete state from localStorage
                  const storedState = localStorage.getItem('proposalNavigationState');
                  let fullState = { proposalId, company, networkProduct, opportunityId, networkType };
                  
                  if (storedState) {
                    fullState = { ...fullState, ...JSON.parse(storedState) };
                    console.log('📤 Restoring complete state from localStorage:', fullState);
                  }
                  
                  navigate('/configure-proposal', { state: fullState });
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Configuration
              </Button>
              <div>
                <div className="flex items-center gap-3">
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
                <p className="text-sm text-gray-500 mt-1">
                  Update proposed pricing and validate margins
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={handleSavePricing} disabled={validationIssues.length > 0}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Submit for Approval
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-6 space-y-6">
        {/* Validation Issues */}
        {validationIssues.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="mb-2">Margin validation issues detected:</p>
              <ul className="list-disc list-inside space-y-1">
                {validationIssues.map((issue, idx) => (
                  <li key={idx} className="text-sm">{issue}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Pricing Strategy */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-gray-700" />
              <CardTitle>Pricing Strategy</CardTitle>
            </div>
            <CardDescription>
              Choose how you want to update the pricing for this proposal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {/* Individual Line Items */}
              <div 
                className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  pricingStrategy === 'individual' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPricingStrategy('individual')}
              >
                {pricingStrategy === 'individual' && (
                  <div className="absolute top-3 right-3">
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                  </div>
                )}
                <div className="flex items-start space-x-3">
                  <div className={`p-2.5 rounded-full ${
                    pricingStrategy === 'individual' ? 'bg-blue-500' : 'bg-gray-200'
                  }`}>
                    <FileEdit className={`w-5 h-5 ${
                      pricingStrategy === 'individual' ? 'text-white' : 'text-gray-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">Individual Line Items</h4>
                    <p className="text-sm text-gray-600">
                      Edit pricing for each BOM item individually in the table. Best for precise control over specific items.
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Value Override */}
              <div 
                className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  pricingStrategy === 'total' 
                    ? 'border-gray-500 bg-gray-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPricingStrategy('total')}
              >
                {pricingStrategy === 'total' && (
                  <div className="absolute top-3 right-3">
                    <div className="w-5 h-5 rounded-full bg-gray-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                  </div>
                )}
                <div className="flex items-start space-x-3">
                  <div className={`p-2.5 rounded-full ${
                    pricingStrategy === 'total' ? 'bg-gray-500' : 'bg-gray-200'
                  }`}>
                    <IndianRupee className={`w-5 h-5 ${
                      pricingStrategy === 'total' ? 'text-white' : 'text-gray-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">Total Value Override</h4>
                    <p className="text-sm text-gray-600">
                      Set target total values and automatically distribute across line items. Perfect for budget-based pricing.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {pricingStrategy === 'total' && (
              <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-medium text-sm mb-3 text-purple-800">Total Value Override</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <Label className="text-xs text-purple-700">Target Total OTC (₹)</Label>
                    <Input
                      type="number"
                      value={totalOverrideOTC}
                      onChange={(e) => setTotalOverrideOTC(e.target.value)}
                      className="mt-1 border-purple-300 focus:border-purple-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-purple-700">Target Total ARC (₹)</Label>
                    <Input
                      type="number"
                      value={totalOverrideARC}
                      onChange={(e) => setTotalOverrideARC(e.target.value)}
                      className="mt-1 border-purple-300 focus:border-purple-500"
                      placeholder="0"
                    />
                  </div>
                  <Button 
                    onClick={applyTotalOverride} 
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={!totalOverrideOTC && !totalOverrideARC}
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Distribute Values
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Unified Pricing Table with Accordion Location Groups */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <div>
                <CardTitle>BOM Items - Pricing & Margin Analysis</CardTitle>
                <CardDescription>Real-time margin calculations with approval workflow</CardDescription>
              </div>
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
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              {bomGroupBy === 'connection' ? (
                // Group by Connection (Location → FIDs)
                <>
                  <div className="overflow-x-auto">
                    <table className="table-fixed border-collapse" style={{ width: '980px', minWidth: '980px' }}>
                      <colgroup>
                        <col style={{ width: '120px' }} />
                        <col style={{ width: '100px' }} />
                        <col style={{ width: '260px' }} />
                        <col style={{ width: '110px' }} />
                        <col style={{ width: '110px' }} />
                        <col style={{ width: '130px' }} />
                        <col style={{ width: '130px' }} />
                      </colgroup>
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="h-12 px-4 text-left align-middle font-medium text-gray-700 text-sm">FID{hasServiceChanges ? ' / Link ID' : ''}</th>
                          <th className="h-12 px-4 text-center align-middle font-medium text-gray-700 text-sm">Company</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-gray-700 text-sm">Service Details</th>
                          <th className="h-12 px-4 text-center align-middle font-medium text-gray-700 text-sm">Ref. OTC</th>
                          <th className="h-12 px-4 text-center align-middle font-medium text-gray-700 text-sm">Ref. ARC</th>
                          <th className="h-12 px-4 text-center align-middle font-medium text-gray-700 text-sm">Proposed OTC</th>
                          <th className="h-12 px-4 text-center align-middle font-medium text-gray-700 text-sm">Proposed ARC</th>
                        </tr>
                      </thead>
                    </table>
                  </div>

                  {locationGroups.map((group, groupIdx) => (
                    <Collapsible 
                      key={groupIdx}
                      defaultOpen={true}
                      className="border-b last:border-b-0"
                    >
                      <CollapsibleTrigger className="w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-blue-900">{group.location}</span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-blue-600 transition-transform duration-200" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="overflow-x-auto">
                          <table className="table-fixed border-collapse" style={{ width: '980px', minWidth: '980px' }}>
                            <colgroup>
                              <col style={{ width: '120px' }} />
                              <col style={{ width: '100px' }} />
                              <col style={{ width: '260px' }} />
                              <col style={{ width: '110px' }} />
                              <col style={{ width: '110px' }} />
                              <col style={{ width: '130px' }} />
                              <col style={{ width: '130px' }} />
                            </colgroup>
                            <tbody>
                            {(() => {
                              const fidGroups: { [key: string]: FIDLineItem[] } = {};
                              group.items.forEach(item => {
                                if (!fidGroups[item.fid]) {
                                  fidGroups[item.fid] = [];
                                }
                                fidGroups[item.fid].push(item);
                              });

                              return Object.entries(fidGroups).flatMap(([fid, items]) => {
                                const coreItem = items.find(i => i.category === 'Core');
                                const towerItem = items.find(i => i.category === 'Tower');
                                const vasItems = items.filter(i => i.itemType === 'VAS');

                                const rows = [];
                                
                                // Core Item Row
                                if (coreItem) {
                                  rows.push(
                                      <tr key={`${fid}-core`} className="border-b hover:bg-muted/50 transition-colors">
                                          <td className="p-2 align-middle font-medium">
                                            <div className="flex flex-col">
                                              <span className="text-blue-600">{coreItem.fid}</span>
                                              {hasServiceChanges && coreItem.linkId && (
                                                <span className="text-xs text-gray-500">{coreItem.linkId}</span>
                                              )}
                                            </div>
                                          </td>
                                          <td className="p-2 align-middle text-center">
                                            <Badge
                                              variant="outline"
                                              className={`text-xs ${
                                                coreItem.billedTo === 'STL'
                                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                  : 'bg-purple-50 text-purple-700 border-purple-200'
                                              }`}
                                            >
                                              {coreItem.billedTo}
                                            </Badge>
                                          </td>
                                          <td className="p-2 align-middle">
                                            <div className="flex items-center space-x-2">
                                              <Building2 className="w-4 h-4 text-gray-500" />
                                              <span className="text-sm">
                                                Core / {coreItem.connectionType} / {coreItem.bandwidth} / {coreItem.linkType}
                                              </span>
                                            </div>
                                          </td>
                                          <td className="p-2 align-middle text-center">
                                            <span className="text-gray-900">{coreItem.referenceOTC.toLocaleString()}</span>
                                          </td>
                                          <td className="p-2 align-middle text-center">
                                            {renderARCCell(coreItem, 'reference')}
                                          </td>
                                          <td className="p-2 align-middle text-center">
                                            <div className="space-y-2">
                                              {pricingStrategy === 'individual' ? (
                                                <Input 
                                                  type="number"
                                                  value={coreItem.proposedOTC}
                                                  onChange={(e) => updateItemPricing(coreItem.fid, coreItem.itemType, 'proposedOTC', e.target.value, undefined, 'Core')}
                                                  className="w-full text-center text-sm h-8"
                                                />
                                              ) : (
                                                <div className="text-center py-1 px-2">
                                                  {coreItem.proposedOTC.toLocaleString()}
                                                </div>
                                              )}
                                              <div className="flex items-center justify-center space-x-1">
                                                <X className={`w-3 h-3 ${
                                                  coreItem.otcMargin >= 20 ? 'text-yellow-600' : 'text-red-600'
                                                }`} />
                                                <span className={`text-xs px-2 py-0.5 rounded ${
                                                  coreItem.otcMargin >= 20 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                  {coreItem.otcMargin.toFixed(1)}%
                                                </span>
                                              </div>
                                            </div>
                                          </td>
                                          <td className="p-2 align-middle text-center">
                                            <div className="space-y-2">
                                              {pricingStrategy === 'individual' ? (
                                                <Input 
                                                  type="number"
                                                  value={coreItem.proposedARC}
                                                  onChange={(e) => updateItemPricing(coreItem.fid, coreItem.itemType, 'proposedARC', e.target.value, undefined, 'Core')}
                                                  className="w-full text-center text-sm h-8"
                                                />
                                              ) : (
                                                <div className="flex items-center justify-center">
                                                  {renderARCCell(coreItem, 'proposed')}
                                                </div>
                                              )}
                                              <div className="flex items-center justify-center space-x-1">
                                                <X className={`w-3 h-3 ${
                                                  coreItem.arcMargin >= 20 ? 'text-yellow-600' : 'text-red-600'
                                                }`} />
                                                <span className={`text-xs px-2 py-0.5 rounded ${
                                                  coreItem.arcMargin >= 20 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                  {coreItem.arcMargin.toFixed(1)}%
                                                </span>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                  );
                                  
                                  // LM Charges Sub-row for Fiber Core
                                  if (coreItem.connectionType === 'Fiber') {
                                    rows.push(
                                      <tr key={`${fid}-lm`} className="bg-gray-50 border-b">
                                            <td className="p-2 align-middle"></td>
                                            <td className="p-2 align-middle text-center">
                                              <Badge
                                                variant="outline"
                                                className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                              >
                                                STL
                                              </Badge>
                                            </td>
                                            <td className="p-2 align-middle">
                                              <div className="flex items-center space-x-2 pl-4">
                                                <span className="text-gray-400">├─</span>
                                                <span className="text-sm text-gray-700">LM Charges</span>
                                              </div>
                                            </td>
                                            <td className="p-2 align-middle text-center">
                                              <span className="text-gray-900">{calculateLMCharges(coreItem.referenceOTC, coreItem.referenceARC).otc.toLocaleString()}</span>
                                            </td>
                                            <td className="p-2 align-middle text-center">
                                              <span className="text-gray-900">{calculateLMCharges(coreItem.referenceOTC, coreItem.referenceARC).arc.toLocaleString()}</span>
                                            </td>
                                            <td className="p-2 align-middle text-center">
                                              <span className="text-gray-900">{calculateLMCharges(coreItem.proposedOTC, coreItem.proposedARC).otc.toLocaleString()}</span>
                                            </td>
                                            <td className="p-2 align-middle text-center">
                                              <span className="text-gray-900">{calculateLMCharges(coreItem.proposedOTC, coreItem.proposedARC).arc.toLocaleString()}</span>
                                            </td>
                                          </tr>
                                    );
                                  }
                                }

                                // Tower Item Row
                                if (towerItem) {
                                  rows.push(
                                      <tr key={`${fid}-tower`} className="border-b hover:bg-muted/50 transition-colors">
                                        <td className="p-2 align-middle">
                                          {!coreItem && (
                                            <div className="flex flex-col">
                                              <span className="text-blue-600">{towerItem.fid}</span>
                                              {hasServiceChanges && towerItem.linkId && (
                                                <span className="text-xs text-gray-500">{towerItem.linkId}</span>
                                              )}
                                            </div>
                                          )}
                                        </td>
                                        <td className="p-2 align-middle text-center">
                                          <Badge
                                            variant="outline"
                                            className={`text-xs ${
                                              towerItem.billedTo === 'STL'
                                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                : 'bg-purple-50 text-purple-700 border-purple-200'
                                            }`}
                                          >
                                            {towerItem.billedTo}
                                          </Badge>
                                        </td>
                                        <td className="p-2 align-middle">
                                          <div className="flex items-center space-x-2">
                                            <Building2 className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm">Tower</span>
                                          </div>
                                        </td>
                                        <td className="p-2 align-middle text-center">
                                          <span className="text-gray-900">{towerItem.referenceOTC.toLocaleString()}</span>
                                        </td>
                                        <td className="p-2 align-middle text-center">
                                          {renderARCCell(towerItem, 'reference')}
                                        </td>
                                        <td className="p-2 align-middle text-center">
                                          <div className="space-y-2">
                                            {pricingStrategy === 'individual' ? (
                                              <Input 
                                                type="number"
                                                value={towerItem.proposedOTC}
                                                onChange={(e) => updateItemPricing(towerItem.fid, towerItem.itemType, 'proposedOTC', e.target.value, undefined)}
                                                className="w-full text-center text-sm h-8"
                                              />
                                            ) : (
                                              <div className="text-center py-1 px-2">
                                                {towerItem.proposedOTC.toLocaleString()}
                                              </div>
                                            )}
                                            <div className="flex items-center justify-center space-x-1">
                                              <X className={`w-3 h-3 ${
                                                towerItem.otcMargin >= 20 ? 'text-yellow-600' : 'text-red-600'
                                              }`} />
                                              <span className={`text-xs px-2 py-0.5 rounded ${
                                                towerItem.otcMargin >= 20 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                              }`}>
                                                {towerItem.otcMargin.toFixed(1)}%
                                              </span>
                                            </div>
                                          </div>
                                        </td>
                                        <td className="p-2 align-middle text-center">
                                          <div className="space-y-2">
                                            {pricingStrategy === 'individual' ? (
                                              <Input 
                                                type="number"
                                                value={towerItem.proposedARC}
                                                onChange={(e) => updateItemPricing(towerItem.fid, towerItem.itemType, 'proposedARC', e.target.value, undefined)}
                                                className="w-full text-center text-sm h-8"
                                              />
                                            ) : (
                                              <div className="flex items-center justify-center">
                                                {renderARCCell(towerItem, 'proposed')}
                                              </div>
                                            )}
                                            <div className="flex items-center justify-center space-x-1">
                                              <X className={`w-3 h-3 ${
                                                towerItem.arcMargin >= 20 ? 'text-yellow-600' : 'text-red-600'
                                              }`} />
                                              <span className={`text-xs px-2 py-0.5 rounded ${
                                                towerItem.arcMargin >= 20 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                              }`}>
                                                {towerItem.arcMargin.toFixed(1)}%
                                              </span>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                  );
                                }

                                // VAS Items
                                vasItems.forEach((vasItem, vasIdx) => {
                                  rows.push(
                                      <tr key={`${fid}-vas-${vasIdx}`} className="bg-purple-50 border-b">
                                        <td className="p-2 align-middle">
                                          {!coreItem && !towerItem && vasIdx === 0 && (
                                            <div className="flex flex-col">
                                              <span className="text-blue-600">{vasItem.fid}</span>
                                              {hasServiceChanges && vasItem.linkId && (
                                                <span className="text-xs text-gray-500">{vasItem.linkId}</span>
                                              )}
                                            </div>
                                          )}
                                        </td>
                                        <td className="p-2 align-middle text-center">
                                          <Badge
                                            variant="outline"
                                            className={`text-xs ${
                                              vasItem.billedTo === 'STL'
                                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                : 'bg-purple-50 text-purple-700 border-purple-200'
                                            }`}
                                          >
                                            {vasItem.billedTo}
                                          </Badge>
                                        </td>
                                        <td className="p-2 align-middle">
                                          <div className="flex items-center space-x-2">
                                            <Badge variant="secondary" className="text-xs">
                                              {vasItem.vas[0]}
                                            </Badge>
                                          </div>
                                        </td>
                                        <td className="p-2 align-middle text-center">
                                          <span className="text-gray-900">{vasItem.referenceOTC.toLocaleString()}</span>
                                        </td>
                                        <td className="p-2 align-middle text-center">
                                          {renderARCCell(vasItem, 'reference')}
                                        </td>
                                        <td className="p-2 align-middle text-center">
                                          <div className="space-y-2">
                                            {pricingStrategy === 'individual' ? (
                                              <Input 
                                                type="number"
                                                value={vasItem.proposedOTC}
                                                onChange={(e) => updateItemPricing(vasItem.fid, vasItem.itemType, 'proposedOTC', e.target.value, vasItem.vas[0])}
                                                className="w-full text-center text-sm h-8"
                                              />
                                            ) : (
                                              <div className="text-center py-1 px-2">
                                                {vasItem.proposedOTC.toLocaleString()}
                                              </div>
                                            )}
                                            <div className="flex items-center justify-center space-x-1">
                                              <X className={`w-3 h-3 ${
                                                vasItem.otcMargin >= 20 ? 'text-yellow-600' : 'text-red-600'
                                              }`} />
                                              <span className={`text-xs px-2 py-0.5 rounded ${
                                                vasItem.otcMargin >= 20 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                              }`}>
                                                {vasItem.otcMargin.toFixed(1)}%
                                              </span>
                                            </div>
                                          </div>
                                        </td>
                                        <td className="p-2 align-middle text-center">
                                          <div className="space-y-2">
                                            {pricingStrategy === 'individual' ? (
                                              <Input 
                                                type="number"
                                                value={vasItem.proposedARC}
                                                onChange={(e) => updateItemPricing(vasItem.fid, vasItem.itemType, 'proposedARC', e.target.value, vasItem.vas[0])}
                                                className="w-full text-center text-sm h-8"
                                              />
                                            ) : (
                                              <div className="flex items-center justify-center">
                                                {renderARCCell(vasItem, 'proposed')}
                                              </div>
                                            )}
                                            <div className="flex items-center justify-center space-x-1">
                                              <X className={`w-3 h-3 ${
                                                vasItem.arcMargin >= 20 ? 'text-yellow-600' : 'text-red-600'
                                              }`} />
                                              <span className={`text-xs px-2 py-0.5 rounded ${
                                                vasItem.arcMargin >= 20 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                              }`}>
                                                {vasItem.arcMargin.toFixed(1)}%
                                              </span>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                  );
                                });

                                return rows;
                              });
                            })()}
                            </tbody>
                          </table>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </>
              ) : (
                // Group by Company (STL / SDSL)
                <>
                  <div className="overflow-x-auto">
                    <table className="table-fixed border-collapse" style={{ width: '980px', minWidth: '980px' }}>
                      <colgroup>
                        <col style={{ width: '120px' }} />
                        <col style={{ width: '100px' }} />
                        <col style={{ width: '260px' }} />
                        <col style={{ width: '110px' }} />
                        <col style={{ width: '110px' }} />
                        <col style={{ width: '130px' }} />
                        <col style={{ width: '130px' }} />
                      </colgroup>
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="h-12 px-4 text-left align-middle font-medium text-gray-700 text-sm">FID{hasServiceChanges ? ' / Link ID' : ''}</th>
                          <th className="h-12 px-4 text-center align-middle font-medium text-gray-700 text-sm">Company</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-gray-700 text-sm">Service Details</th>
                          <th className="h-12 px-4 text-center align-middle font-medium text-gray-700 text-sm">Ref. OTC</th>
                          <th className="h-12 px-4 text-center align-middle font-medium text-gray-700 text-sm">Ref. ARC</th>
                          <th className="h-12 px-4 text-center align-middle font-medium text-gray-700 text-sm">Proposed OTC</th>
                          <th className="h-12 px-4 text-center align-middle font-medium text-gray-700 text-sm">Proposed ARC</th>
                        </tr>
                      </thead>
                    </table>
                  </div>

                  {['STL', 'SDSL'].map(companyType => {
                    const companyItems = pricingData.filter(item => item.billedTo === companyType);
                    if (companyItems.length === 0) return null;

                    return (
                      <Collapsible 
                        key={companyType}
                        defaultOpen={true}
                        className="border-b last:border-b-0"
                      >
                        <CollapsibleTrigger className="w-full px-4 py-3 bg-purple-50 hover:bg-purple-100 transition-colors flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Building2 className="w-4 h-4 text-purple-600" />
                            <span className="font-medium text-purple-900">{companyType}</span>
                          </div>
                          <ChevronDown className="w-4 h-4 text-purple-600 transition-transform duration-200" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="overflow-x-auto">
                            <table className="table-fixed border-collapse" style={{ width: '980px', minWidth: '980px' }}>
                              <colgroup>
                                <col style={{ width: '120px' }} />
                                <col style={{ width: '100px' }} />
                                <col style={{ width: '260px' }} />
                                <col style={{ width: '110px' }} />
                                <col style={{ width: '110px' }} />
                                <col style={{ width: '130px' }} />
                                <col style={{ width: '130px' }} />
                              </colgroup>
                              <tbody>
                              {(() => {
                                const fidGroups: { [key: string]: FIDLineItem[] } = {};
                                companyItems.forEach(item => {
                                  if (!fidGroups[item.fid]) {
                                    fidGroups[item.fid] = [];
                                  }
                                  fidGroups[item.fid].push(item);
                                });

                                return Object.entries(fidGroups).flatMap(([fid, items]) => {
                                  const coreItem = items.find(i => i.category === 'Core');
                                  const towerItem = items.find(i => i.category === 'Tower');
                                  const vasItems = items.filter(i => i.itemType === 'VAS');
                                  const locationName = items[0]?.location;

                                  const rows = [];
                                  
                                  // Core Item Row
                                  if (coreItem) {
                                    rows.push(
                                        <TableRow key={`${companyType}-${fid}-core`} className="border-b">
                                            <TableCell className="font-medium">
                                              <div className="flex flex-col">
                                                <span className="text-blue-600">{coreItem.fid}</span>
                                                {hasServiceChanges && coreItem.linkId && (
                                                  <span className="text-xs text-gray-500">{coreItem.linkId}</span>
                                                )}
                                              </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                              <Badge
                                                variant="outline"
                                                className={`text-xs ${
                                                  coreItem.billedTo === 'STL'
                                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                    : 'bg-purple-50 text-purple-700 border-purple-200'
                                                }`}
                                              >
                                                {coreItem.billedTo}
                                              </Badge>
                                            </TableCell>
                                            <TableCell>
                                              <div className="flex flex-col space-y-1">
                                                <div className="flex items-center space-x-2">
                                                  <MapPin className="w-3 h-3 text-gray-500" />
                                                  <span className="text-xs text-gray-600">{locationName}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                  <Building2 className="w-4 h-4 text-gray-500" />
                                                  <span className="text-sm">
                                                    Core / {coreItem.connectionType} / {coreItem.bandwidth} / {coreItem.linkType}
                                                  </span>
                                                </div>
                                              </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                              <span className="text-gray-900">{coreItem.referenceOTC.toLocaleString()}</span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                              {renderARCCell(coreItem, 'reference')}
                                            </TableCell>
                                            <TableCell className="text-center">
                                              <div className="space-y-2">
                                                {pricingStrategy === 'individual' ? (
                                                  <Input 
                                                    type="number"
                                                    value={coreItem.proposedOTC}
                                                    onChange={(e) => updateItemPricing(coreItem.fid, coreItem.itemType, 'proposedOTC', e.target.value, undefined)}
                                                    className="w-full text-center text-sm h-8"
                                                  />
                                                ) : (
                                                  <div className="text-center py-1 px-2">
                                                    {coreItem.proposedOTC.toLocaleString()}
                                                  </div>
                                                )}
                                                <div className="flex items-center justify-center space-x-1">
                                                  <X className={`w-3 h-3 ${
                                                    coreItem.otcMargin >= 20 ? 'text-yellow-600' : 'text-red-600'
                                                  }`} />
                                                  <span className={`text-xs px-2 py-0.5 rounded ${
                                                    coreItem.otcMargin >= 20 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                  }`}>
                                                    {coreItem.otcMargin.toFixed(1)}%
                                                  </span>
                                                </div>
                                              </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                              <div className="space-y-2">
                                                {pricingStrategy === 'individual' ? (
                                                  <Input 
                                                    type="number"
                                                    value={coreItem.proposedARC}
                                                    onChange={(e) => updateItemPricing(coreItem.fid, coreItem.itemType, 'proposedARC', e.target.value, undefined)}
                                                    className="w-full text-center text-sm h-8"
                                                  />
                                                ) : (
                                                  <div className="flex items-center justify-center">
                                                    {renderARCCell(coreItem, 'proposed')}
                                                  </div>
                                                )}
                                                <div className="flex items-center justify-center space-x-1">
                                                  <X className={`w-3 h-3 ${
                                                    coreItem.arcMargin >= 20 ? 'text-yellow-600' : 'text-red-600'
                                                  }`} />
                                                  <span className={`text-xs px-2 py-0.5 rounded ${
                                                    coreItem.arcMargin >= 20 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                  }`}>
                                                    {coreItem.arcMargin.toFixed(1)}%
                                                  </span>
                                                </div>
                                              </div>
                                            </TableCell>
                                          </TableRow>
                                    );
                                    
                                    // LM Charges Sub-row for Fiber Core
                                    if (coreItem.connectionType === 'Fiber') {
                                      rows.push(
                                        <TableRow key={`${companyType}-${fid}-lm`} className="bg-gray-50 border-b">
                                              <TableCell></TableCell>
                                              <TableCell className="text-center">
                                                <Badge
                                                  variant="outline"
                                                  className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                                >
                                                  STL
                                                </Badge>
                                              </TableCell>
                                              <TableCell>
                                                <div className="flex items-center space-x-2 pl-4">
                                                  <span className="text-gray-400">├─</span>
                                                  <span className="text-sm text-gray-700">LM Charges</span>
                                                </div>
                                              </TableCell>
                                              <TableCell className="text-center">
                                                <span className="text-gray-900">{calculateLMCharges(coreItem.referenceOTC, coreItem.referenceARC).otc.toLocaleString()}</span>
                                              </TableCell>
                                              <TableCell className="text-center">
                                                <span className="text-gray-900">{calculateLMCharges(coreItem.referenceOTC, coreItem.referenceARC).arc.toLocaleString()}</span>
                                              </TableCell>
                                              <TableCell className="text-center">
                                                <span className="text-gray-900">{calculateLMCharges(coreItem.proposedOTC, coreItem.proposedARC).otc.toLocaleString()}</span>
                                              </TableCell>
                                              <TableCell className="text-center">
                                                <span className="text-gray-900">{calculateLMCharges(coreItem.proposedOTC, coreItem.proposedARC).arc.toLocaleString()}</span>
                                              </TableCell>
                                            </TableRow>
                                      );
                                    }
                                  }

                                  // Tower Item Row
                                  if (towerItem) {
                                    rows.push(
                                        <TableRow key={`${companyType}-${fid}-tower`} className="border-b">
                                          <TableCell>
                                            {!coreItem && (
                                              <div className="flex flex-col">
                                                <span className="text-blue-600">{towerItem.fid}</span>
                                                {hasServiceChanges && towerItem.linkId && (
                                                  <span className="text-xs text-gray-500">{towerItem.linkId}</span>
                                                )}
                                              </div>
                                            )}
                                          </TableCell>
                                          <TableCell className="text-center">
                                            <Badge
                                              variant="outline"
                                              className={`text-xs ${
                                                towerItem.billedTo === 'STL'
                                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                  : 'bg-purple-50 text-purple-700 border-purple-200'
                                              }`}
                                            >
                                              {towerItem.billedTo}
                                            </Badge>
                                          </TableCell>
                                          <TableCell>
                                            <div className="flex flex-col space-y-1">
                                              {!coreItem && (
                                                <div className="flex items-center space-x-2">
                                                  <MapPin className="w-3 h-3 text-gray-500" />
                                                  <span className="text-xs text-gray-600">{locationName}</span>
                                                </div>
                                              )}
                                              <div className="flex items-center space-x-2">
                                                <Building2 className="w-4 h-4 text-gray-500" />
                                                <span className="text-sm">Tower</span>
                                              </div>
                                            </div>
                                          </TableCell>
                                          <TableCell className="text-center">
                                            <span className="text-gray-900">{towerItem.referenceOTC.toLocaleString()}</span>
                                          </TableCell>
                                          <TableCell className="text-center">
                                            {renderARCCell(towerItem, 'reference')}
                                          </TableCell>
                                          <TableCell className="text-center">
                                            <div className="space-y-2">
                                              {pricingStrategy === 'individual' ? (
                                                <Input 
                                                  type="number"
                                                  value={towerItem.proposedOTC}
                                                  onChange={(e) => updateItemPricing(towerItem.fid, towerItem.itemType, 'proposedOTC', e.target.value, undefined, 'Tower')}
                                                  className="w-full text-center text-sm h-8"
                                                />
                                              ) : (
                                                <div className="text-center py-1 px-2">
                                                  {towerItem.proposedOTC.toLocaleString()}
                                                </div>
                                              )}
                                              <div className="flex items-center justify-center space-x-1">
                                                <X className={`w-3 h-3 ${
                                                  towerItem.otcMargin >= 20 ? 'text-yellow-600' : 'text-red-600'
                                                }`} />
                                                <span className={`text-xs px-2 py-0.5 rounded ${
                                                  towerItem.otcMargin >= 20 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                  {towerItem.otcMargin.toFixed(1)}%
                                                </span>
                                              </div>
                                            </div>
                                          </TableCell>
                                          <TableCell className="text-center">
                                            <div className="space-y-2">
                                              {pricingStrategy === 'individual' ? (
                                                <Input 
                                                  type="number"
                                                  value={towerItem.proposedARC}
                                                  onChange={(e) => updateItemPricing(towerItem.fid, towerItem.itemType, 'proposedARC', e.target.value, undefined, 'Tower')}
                                                  className="w-full text-center text-sm h-8"
                                                />
                                              ) : (
                                                <div className="flex items-center justify-center">
                                                  {renderARCCell(towerItem, 'proposed')}
                                                </div>
                                              )}
                                              <div className="flex items-center justify-center space-x-1">
                                                <X className={`w-3 h-3 ${
                                                  towerItem.arcMargin >= 20 ? 'text-yellow-600' : 'text-red-600'
                                                }`} />
                                                <span className={`text-xs px-2 py-0.5 rounded ${
                                                  towerItem.arcMargin >= 20 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                  {towerItem.arcMargin.toFixed(1)}%
                                                </span>
                                              </div>
                                            </div>
                                          </TableCell>
                                        </TableRow>
                                    );
                                  }

                                  // VAS Items
                                  vasItems.forEach((vasItem, vasIdx) => {
                                    rows.push(
                                        <TableRow key={`${companyType}-${fid}-vas-${vasIdx}`} className="bg-purple-50 border-b">
                                          <TableCell>
                                            {!coreItem && !towerItem && vasIdx === 0 && (
                                              <div className="flex flex-col">
                                                <span className="text-blue-600">{vasItem.fid}</span>
                                                {hasServiceChanges && vasItem.linkId && (
                                                  <span className="text-xs text-gray-500">{vasItem.linkId}</span>
                                                )}
                                              </div>
                                            )}
                                          </TableCell>
                                          <TableCell className="text-center">
                                            <Badge
                                              variant="outline"
                                              className={`text-xs ${
                                                vasItem.billedTo === 'STL'
                                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                  : 'bg-purple-50 text-purple-700 border-purple-200'
                                              }`}
                                            >
                                              {vasItem.billedTo}
                                            </Badge>
                                          </TableCell>
                                          <TableCell>
                                            <div className="flex flex-col space-y-1">
                                              {!coreItem && !towerItem && vasIdx === 0 && (
                                                <div className="flex items-center space-x-2">
                                                  <MapPin className="w-3 h-3 text-gray-500" />
                                                  <span className="text-xs text-gray-600">{locationName}</span>
                                                </div>
                                              )}
                                              <div className="flex items-center space-x-2">
                                                <Badge variant="secondary" className="text-xs">
                                                  {vasItem.vas[0]}
                                                </Badge>
                                              </div>
                                            </div>
                                          </TableCell>
                                          <TableCell className="text-center">
                                            <span className="text-gray-900">{vasItem.referenceOTC.toLocaleString()}</span>
                                          </TableCell>
                                          <TableCell className="text-center">
                                            {renderARCCell(vasItem, 'reference')}
                                          </TableCell>
                                          <TableCell className="text-center">
                                            <div className="space-y-2">
                                              {pricingStrategy === 'individual' ? (
                                                <Input 
                                                  type="number"
                                                  value={vasItem.proposedOTC}
                                                  onChange={(e) => updateItemPricing(vasItem.fid, vasItem.itemType, 'proposedOTC', e.target.value, vasItem.vas[0])}
                                                  className="w-full text-center text-sm h-8"
                                                />
                                              ) : (
                                                <div className="text-center py-1 px-2">
                                                  {vasItem.proposedOTC.toLocaleString()}
                                                </div>
                                              )}
                                              <div className="flex items-center justify-center space-x-1">
                                                <X className={`w-3 h-3 ${
                                                  vasItem.otcMargin >= 20 ? 'text-yellow-600' : 'text-red-600'
                                                }`} />
                                                <span className={`text-xs px-2 py-0.5 rounded ${
                                                  vasItem.otcMargin >= 20 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                  {vasItem.otcMargin.toFixed(1)}%
                                                </span>
                                              </div>
                                            </div>
                                          </TableCell>
                                          <TableCell className="text-center">
                                            <div className="space-y-2">
                                              {pricingStrategy === 'individual' ? (
                                                <Input 
                                                  type="number"
                                                  value={vasItem.proposedARC}
                                                  onChange={(e) => updateItemPricing(vasItem.fid, vasItem.itemType, 'proposedARC', e.target.value, vasItem.vas[0])}
                                                  className="w-full text-center text-sm h-8"
                                                />
                                              ) : (
                                                <div className="flex items-center justify-center">
                                                  {renderARCCell(vasItem, 'proposed')}
                                                </div>
                                              )}
                                              <div className="flex items-center justify-center space-x-1">
                                                <X className={`w-3 h-3 ${
                                                  vasItem.arcMargin >= 20 ? 'text-yellow-600' : 'text-red-600'
                                                }`} />
                                                <span className={`text-xs px-2 py-0.5 rounded ${
                                                  vasItem.arcMargin >= 20 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                  {vasItem.arcMargin.toFixed(1)}%
                                                </span>
                                              </div>
                                            </div>
                                          </TableCell>
                                        </TableRow>
                                    );
                                  });

                                  return rows;
                                });
                              })()}
                              </tbody>
                            </table>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Total Summary */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">Total Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              {/* OTC Summary */}
              <div className="space-y-3">
                <h3 className="text-sm text-blue-800">One-Time Charges (OTC)</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">Reference Total:</span>
                    <div className="flex items-center text-blue-900">
                      <IndianRupee className="w-4 h-4 mr-1" />
                      <span>{totals.totalRefOTC.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">Proposed Total:</span>
                    <div className="flex items-center text-blue-900">
                      <IndianRupee className="w-4 h-4 mr-1" />
                      <span>{totals.totalPropOTC.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ARC Summary */}
              <div className="space-y-3">
                <h3 className="text-sm text-blue-800">Annual Recurring Charges (ARC)</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">Reference Total:</span>
                    <div className="flex items-center text-blue-900">
                      <IndianRupee className="w-4 h-4 mr-1" />
                      <span>{totals.totalRefARC.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">Proposed Total:</span>
                    <div className="flex items-center text-blue-900">
                      <IndianRupee className="w-4 h-4 mr-1" />
                      <span>{totals.totalPropARC.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-4 bg-blue-200" />

            <div className="flex items-start space-x-2 text-xs text-blue-700">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>
                Main bandwidth charges are billed to STL, while VAS charges are billed to SDSL.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Justification */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing Justification</CardTitle>
            <CardDescription>Provide reasoning for pricing adjustments</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Explain the reason behind the pricing adjustments, competitive factors, strategic importance, etc."
              value={pricingJustification}
              onChange={(e) => setPricingJustification(e.target.value)}
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmationDialogOpen} onOpenChange={setConfirmationDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Pricing Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit this proposal for pricing approval? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter any additional pricing justification (optional)"
              value={pricingJustification}
              onChange={(e) => setPricingJustification(e.target.value)}
              className="h-20"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setConfirmationDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmSubmission}
            >
              Submit for Approval
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
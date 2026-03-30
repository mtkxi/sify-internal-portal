import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { ArrowLeft, Calculator, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Settings, Edit, Percent, X, Send, Clock, Monitor, HardDrive, Network, Shield, Database, FileEdit, DollarSign, ChevronDown, ChevronRight } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

interface PricingItem {
  id: string;
  category: 'Compute' | 'Network' | 'PaaS' | 'Storage' | 'Security';
  sku: string;
  name: string;
  quantity: number;
  location: string;
  referenceOTC: number;
  referenceARC: number;
  proposedOTC: number;
  proposedARC: number;
  margin: number;
  otcMargin: number;
  arcMargin: number;
  approvalStatus: 'auto' | 'review' | 'escalation';
  configuration: {
    cpu?: string;
    memory?: string;
    storage?: string;
    bandwidth?: string;
    tier?: string;
    protocol?: string;
    encryption?: string;
  };
}

const mockPricingItems: PricingItem[] = [
  {
    id: '1',
    category: 'Compute',
    sku: 'VM-STANDARD-D4',
    name: 'Virtual Machine - Standard D4',
    quantity: 10,
    location: 'Mumbai DC1',
    referenceOTC: 5000,
    referenceARC: 12000,
    proposedOTC: 4500,
    proposedARC: 11000,
    margin: 22.5,
    otcMargin: 10.0,
    arcMargin: 8.3,
    approvalStatus: 'review',
    configuration: {
      cpu: '4 vCPUs',
      memory: '16 GB RAM',
      storage: '100 GB SSD',
      bandwidth: '10 Gbps'
    }
  },
  {
    id: '2',
    category: 'Storage',
    sku: 'BLOCK-STORAGE-SSD',
    name: 'Block Storage SSD',
    quantity: 200,
    location: 'Mumbai DC1',
    referenceOTC: 0,
    referenceARC: 400,
    proposedOTC: 0,
    proposedARC: 380,
    margin: 18.2,
    otcMargin: 0,
    arcMargin: 5.0,
    approvalStatus: 'review',
    configuration: {
      storage: '1TB per unit',
      tier: 'Premium SSD',
      encryption: 'AES-256'
    }
  },
  {
    id: '3',
    category: 'Network',
    sku: 'LOAD-BALANCER-APP',
    name: 'Application Load Balancer',
    quantity: 2,
    location: 'Delhi DC2',
    referenceOTC: 2000,
    referenceARC: 8000,
    proposedOTC: 1800,
    proposedARC: 7500,
    margin: 26.8,
    otcMargin: 10.0,
    arcMargin: 6.25,
    approvalStatus: 'auto',
    configuration: {
      bandwidth: '1 Gbps',
      protocol: 'HTTP/HTTPS',
      tier: 'Application Layer 7'
    }
  },
  {
    id: '4',
    category: 'Security',
    sku: 'WAF-ENTERPRISE',
    name: 'Web Application Firewall',
    quantity: 1,
    location: 'Delhi DC2',
    referenceOTC: 3000,
    referenceARC: 5000,
    proposedOTC: 2700,
    proposedARC: 4800,
    margin: 12.5,
    otcMargin: 10.0,
    arcMargin: 4.0,
    approvalStatus: 'escalation',
    configuration: {
      bandwidth: '500 Mbps',
      tier: 'Enterprise',
      encryption: 'SSL/TLS'
    }
  },
  {
    id: '5',
    category: 'PaaS',
    sku: 'DB-MYSQL-HA',
    name: 'MySQL High Availability',
    quantity: 1,
    location: 'Bangalore DC3',
    referenceOTC: 1500,
    referenceARC: 15000,
    proposedOTC: 1200,
    proposedARC: 13500,
    margin: 28.1,
    otcMargin: 20.0,
    arcMargin: 10.0,
    approvalStatus: 'auto',
    configuration: {
      cpu: '8 vCPUs',
      memory: '32 GB RAM',
      storage: '500 GB SSD',
      tier: 'High Availability'
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

export function PricingManagement() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [pricingItems, setPricingItems] = useState<PricingItem[]>(mockPricingItems);
  const [updateMethod, setUpdateMethod] = useState<'lineitem' | 'total'>('lineitem');
  const [totalOTC, setTotalOTC] = useState('');
  const [totalARC, setTotalARC] = useState('');
  const [justification, setJustification] = useState('');
  const [pricingUpdateMethod, setPricingUpdateMethod] = useState<'line-item' | 'percentage' | 'total'>('line-item');
  const [percentageChange, setPercentageChange] = useState({ otc: 0, arc: 0 });
  const [totalTargets, setTotalTargets] = useState({ otc: 0, arc: 0 });
  const [expandedLocations, setExpandedLocations] = useState<Record<string, boolean>>({});
  
  // Group items by location
  const itemsByLocation = pricingItems.reduce((acc, item) => {
    if (!acc[item.location]) {
      acc[item.location] = [];
    }
    acc[item.location].push(item);
    return acc;
  }, {} as Record<string, PricingItem[]>);

  const toggleLocation = (location: string) => {
    setExpandedLocations(prev => ({
      ...prev,
      [location]: !prev[location]
    }));
  };
  
  // Helper functions for margin calculations
  const calculateOTCMargin = (reference: number, proposed: number) => {
    if (reference === 0) return 0;
    return ((reference - proposed) / reference) * 100;
  };

  const calculateARCMargin = (reference: number, proposed: number) => {
    if (reference === 0) return 0;
    return ((reference - proposed) / reference) * 100;
  };

  const getMarginStatus = (margin: number): 'auto' | 'review' | 'escalation' => {
    if (margin >= 25) return 'auto';
    if (margin >= 15) return 'review';
    return 'escalation';
  };

  const getMarginIcon = (margin: number) => {
    if (margin >= 25) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (margin >= 15) return <Clock className="w-4 h-4 text-yellow-600" />;
    return <X className="w-4 h-4 text-red-600" />;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Compute': return <Monitor className="w-4 h-4" />;
      case 'Storage': return <HardDrive className="w-4 h-4" />;
      case 'Network': return <Network className="w-4 h-4" />;
      case 'Security': return <Shield className="w-4 h-4" />;
      case 'PaaS': return <Database className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  const sendForReview = (itemId: string, type: 'finance' | 'escalation') => {
    // Here you would normally send to backend
    const item = pricingItems.find(i => i.id === itemId);
    if (type === 'finance') {
      alert(`Sent ${item?.name} for Finance Team review`);
    } else {
      alert(`Escalated ${item?.name} for Senior Approval`);
    }
  };

  const updateLineItemPricing = (itemId: string, field: 'proposedOTC' | 'proposedARC', value: number) => {
    setPricingItems(items => items.map(item => {
      if (item.id === itemId) {
        const updated = { ...item, [field]: value };
        
        // Recalculate individual margins
        updated.otcMargin = calculateOTCMargin(updated.referenceOTC, updated.proposedOTC);
        updated.arcMargin = calculateARCMargin(updated.referenceARC, updated.proposedARC);
        
        // Recalculate overall item margin
        const totalCost = (updated.proposedOTC + updated.proposedARC * 12) * updated.quantity;
        const totalRevenue = (updated.referenceOTC + updated.referenceARC * 12) * updated.quantity;
        updated.margin = totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0;
        
        // Update approval status based on margin
        updated.approvalStatus = getMarginStatus(updated.margin);
        
        return updated;
      }
      return item;
    }));
  };

  const updateByTotalValue = () => {
    if (!totalOTC || !totalARC) return;
    
    const targetOTC = parseFloat(totalOTC);
    const targetARC = parseFloat(totalARC);
    const currentOTC = getTotalOTC();
    const currentARC = getTotalARC();
    
    const otcRatio = targetOTC / currentOTC;
    const arcRatio = targetARC / currentARC;
    
    setPricingItems(items => items.map(item => ({
      ...item,
      proposedOTC: Math.round(item.proposedOTC * otcRatio),
      proposedARC: Math.round(item.proposedARC * arcRatio)
    })));
  };

  const updateByPercentage = (percentage: number) => {
    const multiplier = 1 - (percentage / 100);
    setPricingItems(items => items.map(item => ({
      ...item,
      proposedOTC: Math.round(item.referenceOTC * multiplier),
      proposedARC: Math.round(item.referenceARC * multiplier)
    })));
  };

  const getTotalOTC = () => {
    return pricingItems.reduce((total, item) => total + (item.proposedOTC * item.quantity), 0);
  };

  const getTotalARC = () => {
    return pricingItems.reduce((total, item) => total + (item.proposedARC * item.quantity), 0);
  };

  const getOverallMargin = () => {
    const totalProposed = getTotalOTC() + getTotalARC() * 12;
    const totalReference = pricingItems.reduce((total, item) => 
      total + (item.referenceOTC + item.referenceARC * 12) * item.quantity, 0);
    return totalReference > 0 ? ((totalReference - totalProposed) / totalReference) * 100 : 0;
  };

  const getApprovalStatus = () => {
    const margin = getOverallMargin();
    if (margin >= 25) return { status: 'auto', color: 'green', text: 'Auto-Approved' };
    if (margin >= 15) return { status: 'review', color: 'yellow', text: 'Finance Review Required' };
    return { status: 'escalation', color: 'red', text: 'Senior Approval Required' };
  };

  const applyPercentageChanges = () => {
    setPricingItems(items => items.map(item => ({
      ...item,
      proposedOTC: Math.round(item.referenceOTC * (1 + percentageChange.otc / 100)),
      proposedARC: Math.round(item.referenceARC * (1 + percentageChange.arc / 100))
    })));
  };

  const applyTotalOverride = () => {
    const currentOTC = getTotalOTC();
    const currentARC = getTotalARC();
    
    const otcRatio = totalTargets.otc / currentOTC;
    const arcRatio = totalTargets.arc / currentARC;
    
    setPricingItems(items => items.map(item => ({
      ...item,
      proposedOTC: Math.round(item.proposedOTC * otcRatio),
      proposedARC: Math.round(item.proposedARC * arcRatio)
    })));
  };

  const submitForApproval = () => {
    const approval = getApprovalStatus();
    if (approval.status === 'auto') {
      alert('Pricing automatically approved! Proceeding to proposal generation...');
      navigate(`/proposal/${id}`);
    } else {
      alert(`Pricing submitted for ${approval.text.toLowerCase()}. You will be notified once reviewed.`);
    }
  };

  const approvalStatus = getApprovalStatus();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate(`/`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1>Pricing Management</h1>
            <p className="text-gray-600">Adjust pricing and manage margin analysis</p>
          </div>
        </div>
      </div>

      {/* Pricing Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Total OTC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(getTotalOTC())}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Monthly ARC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(getTotalARC())}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Overall Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              getOverallMargin() >= 25 ? 'text-green-600' : 
              getOverallMargin() >= 15 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {getOverallMargin().toFixed(1)}%
            </div>
          </CardContent>
        </Card>
        
      </div>

      {/* Pricing Update Method */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Pricing Strategy</span>
          </CardTitle>
          <CardDescription>Choose how you want to update the pricing for this proposal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Individual Line Items */}
            <div 
              className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                pricingUpdateMethod === 'line-item' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setPricingUpdateMethod('line-item')}
            >
              {pricingUpdateMethod === 'line-item' && (
                <div className="absolute top-3 right-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                </div>
              )}
              <div className="flex items-start space-x-3">
                <div className={`p-2.5 rounded-full ${
                  pricingUpdateMethod === 'line-item' ? 'bg-blue-500' : 'bg-gray-200'
                }`}>
                  <FileEdit className={`w-5 h-5 ${
                    pricingUpdateMethod === 'line-item' ? 'text-white' : 'text-gray-500'
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
                pricingUpdateMethod === 'total' 
                  ? 'border-gray-500 bg-gray-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setPricingUpdateMethod('total')}
            >
              {pricingUpdateMethod === 'total' && (
                <div className="absolute top-3 right-3">
                  <div className="w-5 h-5 rounded-full bg-gray-500 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                </div>
              )}
              <div className="flex items-start space-x-3">
                <div className={`p-2.5 rounded-full ${
                  pricingUpdateMethod === 'total' ? 'bg-gray-500' : 'bg-gray-200'
                }`}>
                  <DollarSign className={`w-5 h-5 ${
                    pricingUpdateMethod === 'total' ? 'text-white' : 'text-gray-500'
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

          {pricingUpdateMethod === 'total' && (
            <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-medium text-sm mb-3 text-purple-800">Total Value Override</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <Label className="text-xs text-purple-700">Target Total OTC (₹)</Label>
                  <Input
                    type="number"
                    value={totalTargets.otc}
                    onChange={(e) => setTotalTargets(prev => ({ ...prev, otc: parseFloat(e.target.value) || 0 }))}
                    className="mt-1 border-purple-300 focus:border-purple-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label className="text-xs text-purple-700">Target Total ARC (₹)</Label>
                  <Input
                    type="number"
                    value={totalTargets.arc}
                    onChange={(e) => setTotalTargets(prev => ({ ...prev, arc: parseFloat(e.target.value) || 0 }))}
                    className="mt-1 border-purple-300 focus:border-purple-500"
                    placeholder="0"
                  />
                </div>
                <Button 
                  onClick={applyTotalOverride} 
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

      {/* Enhanced BOM Items Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>BOM Items - Pricing & Margin Analysis</CardTitle>
          <CardDescription>Real-time margin calculations with approval workflow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            {/* Common Table Header */}
            <div className="bg-gray-50 border-b">
              <div className="grid grid-cols-9 gap-4 px-4 py-3 text-sm font-medium text-gray-700">
                <div className="col-span-2">Product Name</div>
                <div className="text-center">Category</div>
                <div className="text-center">SKU ID</div>
                <div className="text-center">Qty</div>
                <div className="text-center">Ref. OTC</div>
                <div className="text-center">Ref. ARC</div>
                <div className="text-center">Proposed OTC</div>
                <div className="text-center">Proposed ARC</div>
              </div>
            </div>

            {/* Location Groups with Accordion */}
            {Object.keys(itemsByLocation).map(location => (
              <Collapsible 
                key={location}
                defaultOpen={true}
                className="border-b last:border-b-0"
              >
                <CollapsibleTrigger className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-white">
                        {location}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        ({itemsByLocation[location].length} items)
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div>
                    {itemsByLocation[location].map((item, index) => (
                      <div 
                        key={item.id}
                        className={`grid grid-cols-9 gap-4 px-4 py-4 text-sm ${
                          index !== itemsByLocation[location].length - 1 ? 'border-b' : ''
                        }`}
                      >
                        {/* Product Name */}
                        <div className="col-span-2">
                          <div className="font-medium">{item.name}</div>
                          <div className="mt-1 space-y-0.5">
                            {item.configuration.cpu && (
                              <div className="text-xs text-gray-600">
                                <span className="font-medium">CPU:</span> {item.configuration.cpu}
                              </div>
                            )}
                            {item.configuration.memory && (
                              <div className="text-xs text-gray-600">
                                <span className="font-medium">Memory:</span> {item.configuration.memory}
                              </div>
                            )}
                            {item.configuration.storage && (
                              <div className="text-xs text-gray-600">
                                <span className="font-medium">Storage:</span> {item.configuration.storage}
                              </div>
                            )}
                            {item.configuration.bandwidth && (
                              <div className="text-xs text-gray-600">
                                <span className="font-medium">Bandwidth:</span> {item.configuration.bandwidth}
                              </div>
                            )}
                            {item.configuration.tier && (
                              <div className="text-xs text-gray-600">
                                <span className="font-medium">Tier:</span> {item.configuration.tier}
                              </div>
                            )}
                            {item.configuration.protocol && (
                              <div className="text-xs text-gray-600">
                                <span className="font-medium">Protocol:</span> {item.configuration.protocol}
                              </div>
                            )}
                            {item.configuration.encryption && (
                              <div className="text-xs text-gray-600">
                                <span className="font-medium">Encryption:</span> {item.configuration.encryption}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Category */}
                        <div className="flex items-center justify-center">
                          <div className="flex flex-col items-center space-y-1">
                            <div className={`p-1.5 rounded-lg ${
                              item.category === 'Compute' ? 'bg-blue-100 text-blue-600' :
                              item.category === 'Storage' ? 'bg-purple-100 text-purple-600' :
                              item.category === 'Network' ? 'bg-green-100 text-green-600' :
                              item.category === 'Security' ? 'bg-red-100 text-red-600' :
                              'bg-orange-100 text-orange-600'
                            }`}>
                              {getCategoryIcon(item.category)}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                          </div>
                        </div>
                        
                        {/* SKU ID */}
                        <div className="flex items-center justify-center">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                            {item.sku}
                          </code>
                        </div>
                        
                        {/* Quantity */}
                        <div className="flex items-center justify-center font-medium">
                          {item.quantity}
                        </div>
                        
                        {/* Reference OTC */}
                        <div className="flex items-center justify-center">
                          <div className="text-center">
                            <div className="font-medium">{item.referenceOTC}</div>
                          </div>
                        </div>
                        
                        {/* Reference ARC */}
                        <div className="flex items-center justify-center">
                          <div className="text-center">
                            <div className="font-medium">{item.referenceARC}</div>
                          </div>
                        </div>
                        
                        {/* Proposed OTC */}
                        <div className="flex items-center justify-center">
                          <div className="space-y-2 w-full max-w-[180px]">
                            {pricingUpdateMethod === 'line-item' ? (
                              <Input 
                                type="number"
                                value={item.proposedOTC}
                                onChange={(e) => updateLineItemPricing(item.id, 'proposedOTC', parseInt(e.target.value) || 0)}
                                className="w-full text-center border-gray-300"
                              />
                            ) : (
                              <div className="font-medium text-center py-2 px-3 border border-gray-200 rounded-md bg-white">
                                {item.proposedOTC}
                              </div>
                            )}
                            <div className="flex items-center justify-center space-x-1">
                              <X className={`w-4 h-4 ${
                                item.otcMargin >= 20 ? 'text-yellow-600' : 'text-red-600'
                              }`} />
                              <span className={`text-xs px-2 py-1 rounded ${
                                item.otcMargin >= 20 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {item.otcMargin.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Proposed ARC */}
                        <div className="flex items-center justify-center">
                          <div className="space-y-2 w-full max-w-[180px]">
                            {pricingUpdateMethod === 'line-item' ? (
                              <Input 
                                type="number"
                                value={item.proposedARC}
                                onChange={(e) => updateLineItemPricing(item.id, 'proposedARC', parseInt(e.target.value) || 0)}
                                className="w-full text-center border-gray-300"
                              />
                            ) : (
                              <div className="font-medium text-center py-2 px-3 border border-gray-200 rounded-md bg-white">
                                {item.proposedARC}
                              </div>
                            )}
                            <div className="flex items-center justify-center space-x-1">
                              <X className={`w-4 h-4 ${
                                item.arcMargin >= 20 ? 'text-yellow-600' : 'text-red-600'
                              }`} />
                              <span className={`text-xs px-2 py-1 rounded ${
                                item.arcMargin >= 20 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {item.arcMargin.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </CardContent>
      </Card>



      {/* Justification */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Pricing Justification</CardTitle>
          <CardDescription>Provide reasoning for pricing adjustments</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea 
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            placeholder="Explain the reasoning behind pricing adjustments, competitive factors, strategic importance, etc."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Approval Information */}


      <div className="flex justify-between">
        <Button onClick={submitForApproval}>
          Submit for Approval
        </Button>
      </div>
    </div>
  );
}
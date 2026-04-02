import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from './ui/sheet';
import { Input } from './ui/input';
import { ArrowLeft, FileText, Check, DollarSign, Pencil, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { toast } from 'sonner';

interface VASItem {
  category: 'Additional IP' | 'Managed Services' | 'Devices' | 'DDOS';
  value: string;
  description?: string;
}

interface FIDConfiguration {
  fid: string;
  type: string;
  location: string;
  connType: string;
  bandwidth: string;
  linkType: string;
  vas: VASItem[];
  plan: string;
  otc: string;
  arc: string;
  configured: boolean;
}

const mockFIDConfigurations: FIDConfiguration[] = [
  {
    fid: "FID001",
    type: "New",
    location: "Mumbai DC-1",
    connType: "Wireless",
    bandwidth: "22 Mbps",
    linkType: "Primary",
    vas: [
      { category: "Additional IP", value: "Static IPV4/32" },
      { category: "Managed Services", value: "Managed Router", description: "24/7 monitoring and configuration" }
    ],
    plan: "Premium",
    otc: "₹50,000",
    arc: "₹25,000",
    configured: true
  },
  {
    fid: "FID002",
    type: "New",
    location: "Mumbai DC-1",
    connType: "Fibre",
    bandwidth: "55 Mbps",
    linkType: "Secondary",
    vas: [
      { category: "Devices", value: "Catalyst 9400 Series" }
    ],
    plan: "",
    otc: "-",
    arc: "-",
    configured: false
  },
  {
    fid: "FID003",
    type: "Modify Bandwidth",
    location: "Bangalore DC-2",
    connType: "Fibre",
    bandwidth: "100 Mbps",
    linkType: "Primary",
    vas: [
      { category: "DDOS", value: "10 Gbps" }
    ],
    plan: "",
    otc: "-",
    arc: "-",
    configured: false
  }
];

const VASOptions = {
  "Additional IP": [
    "Static IPV4/32"
  ],
  "Managed Services": [
    { value: "Managed Router", description: "24/7 monitoring and configuration management" },
    { value: "Managed Firewall", description: "Security policy management and monitoring" }
  ],
  "Devices": [
    "Catalyst 9400 Series",
    "Catalyst 9500 Series",
    "Aruba CX 6300 Series",
    "Aruba CX 6400 Series"
  ],
  "DDOS": [
    "10 Gbps",
    "20 Gbps"
  ]
};

const getBandwidthOptions = (currentBandwidth: string) => {
  const bandwidthValues = [
    { label: "4 Mbps", value: 4 },
    { label: "5 Mbps", value: 5 },
    { label: "10 Mbps", value: 10 },
    { label: "15 Mbps", value: 15 },
    { label: "20 Mbps", value: 20 },
    { label: "21 Mbps", value: 21 },
    { label: "22 Mbps", value: 22 },
    { label: "30 Mbps", value: 30 },
    { label: "40 Mbps", value: 40 },
    { label: "50 Mbps", value: 50 },
    { label: "55 Mbps", value: 55 },
    { label: "75 Mbps", value: 75 },
    { label: "100 Mbps", value: 100 },
    { label: "150 Mbps", value: 150 },
    { label: "200 Mbps", value: 200 },
    { label: "250 Mbps", value: 250 },
    { label: "500 Mbps", value: 500 }
  ];
  
  const currentValue = parseInt(currentBandwidth);
  return bandwidthValues.filter(bw => bw.value <= currentValue);
};

// Helper function to extract numeric bandwidth value
const getBandwidthValue = (bandwidth: string): number => {
  const match = bandwidth.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
};

export function ConfigureProposal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract product lock information from navigation state
  const lockedProduct = location.state?.lockedProduct || null; // 'Express Connect' or 'Site Connect' or null
  const isServiceChanges = location.state?.isServiceChanges || false;
  
  const [selectedFIDs, setSelectedFIDs] = useState<string[]>([]);
  // If product is locked, use the locked product; otherwise default to "Express Connect"
  const [networkType, setNetworkType] = useState<"Express Connect" | "Site Connect">(
    lockedProduct === 'Site Connect' ? 'Site Connect' : 'Express Connect'
  );
  const [mplsType, setMplsType] = useState<"Mesh" | "Hub & Spoke">("Mesh");
  const [configurations, setConfigurations] = useState<FIDConfiguration[]>(mockFIDConfigurations);
  const [bulkConfigOpen, setBulkConfigOpen] = useState(false);
  const [bulkConfig, setBulkConfig] = useState({
    linkType: ""
  });
  const [bulkVASItems, setBulkVASItems] = useState<VASItem[]>([]);
  const [vasDialogOpen, setVasDialogOpen] = useState(false);
  const [editingFID, setEditingFID] = useState<string | null>(null);

  const configuredCount = configurations.filter(c => c.configured).length;
  const totalCount = configurations.length;
  const configurationProgress = (configuredCount / totalCount) * 100;

  const handleBandwidthChange = (fid: string, value: string) => {
    setConfigurations(configurations.map(config => 
      config.fid === fid ? { ...config, bandwidth: value } : config
    ));
  };

  const handleLinkTypeChange = (fid: string, value: string) => {
    setConfigurations(configurations.map(config => 
      config.fid === fid ? { ...config, linkType: value } : config
    ));
  };

  const handleVASChange = (fid: string, newVas: VASItem[]) => {
    setConfigurations(configurations.map(config => 
      config.fid === fid ? { ...config, vas: newVas } : config
    ));
  };

  const addVASItem = (fid: string, category: string, value: string, description?: string) => {
    const config = configurations.find(c => c.fid === fid);
    if (!config) return;
    
    const newVasItem: VASItem = { 
      category: category as any, 
      value,
      ...(description && { description })
    };
    
    // For Devices and DDOS, replace existing item of same category (single-select)
    let updatedVas = [...config.vas];
    if (category === 'Devices' || category === 'DDOS') {
      updatedVas = updatedVas.filter(v => v.category !== category);
    }
    
    handleVASChange(fid, [...updatedVas, newVasItem]);
  };

  const removeVASItem = (fid: string, index: number) => {
    const config = configurations.find(c => c.fid === fid);
    if (!config) return;
    
    const newVas = config.vas.filter((_, i) => i !== index);
    handleVASChange(fid, newVas);
  };

  const handlePlanChange = (fid: string, value: string) => {
    // When plan is selected, populate OTC and ARC
    const otc = value === "Premium" ? "₹50,000" : "₹30,000";
    const arc = value === "Premium" ? "₹25,000" : "₹15,000";
    
    setConfigurations(configurations.map(config => 
      config.fid === fid 
        ? { ...config, plan: value, otc, arc, configured: true } 
        : config
    ));
  };

  const handleGenerateProposal = () => {
    const unconfigured = configurations.filter(c => !c.configured);
    if (unconfigured.length > 0) {
      toast.error(`Please configure all FIDs. ${unconfigured.length} remaining.`);
      return;
    }
    
    toast.success('Proposal generated successfully');
    setTimeout(() => {
      navigate(`/requirement-details/${id}`);
    }, 1000);
  };

  const handleBulkConfigure = () => {
    if (selectedFIDs.length === 0) {
      toast.error('Please select FIDs for bulk configuration');
      return;
    }
    
    setBulkConfigOpen(true);
  };

  const applyBulkConfiguration = () => {
    if (!bulkConfig.linkType) {
      toast.error('Please select a link type for bulk configuration');
      return;
    }

    setConfigurations(configurations.map(config => {
      if (selectedFIDs.includes(config.fid)) {
        // Merge bulk VAS items with existing VAS items
        let updatedVas = [...config.vas];
        
        // Add bulk VAS items
        bulkVASItems.forEach(bulkVas => {
          // For Devices and DDOS, replace existing item of same category
          if (bulkVas.category === 'Devices' || bulkVas.category === 'DDOS') {
            updatedVas = updatedVas.filter(v => v.category !== bulkVas.category);
          }
          updatedVas.push(bulkVas);
        });
        
        return {
          ...config,
          linkType: bulkConfig.linkType,
          vas: updatedVas
        };
      }
      return config;
    }));

    setBulkConfigOpen(false);
    setBulkConfig({ linkType: "" });
    setBulkVASItems([]);
    setSelectedFIDs([]);
    toast.success(`Bulk configuration applied to ${selectedFIDs.length} FID(s)`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1600px] mx-auto p-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(`/requirement-details/${id}`)}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Requirement Details
        </Button>

        {/* Product Lock Info Banner - at the top */}
        {lockedProduct && isServiceChanges && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-blue-900 font-medium mb-1">
                🔒 Product Locked to {lockedProduct}
              </p>
              <p className="text-sm text-blue-800">
                This requirement contains MDAC FIDs for <strong>{lockedProduct}</strong> product. 
                The network type has been automatically set and cannot be changed to maintain consistency across all MDAC requirements.
              </p>
            </div>
          </div>
        )}

        {/* Basic Details Card */}
        <Card className="mb-6">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle>Proposal Configuration</CardTitle>
              {lockedProduct && isServiceChanges && (
                <Badge className="bg-orange-100 text-orange-700 border border-orange-300">
                  🔒 Product Locked: {lockedProduct}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-4 gap-x-12 gap-y-6">
              <div>
                <label className="text-xs text-gray-500">Proposal ID</label>
                <p className="text-sm text-gray-900 mt-1">PROP-2024-001</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Type</label>
                <Badge className="bg-blue-100 text-blue-700 mt-1">New</Badge>
              </div>
              <div>
                <label className="text-xs text-gray-500">Customer</label>
                <p className="text-sm text-gray-900 mt-1">Tech Innovations Ltd</p>
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-500">Customer Details</label>
                <p className="text-sm text-gray-900 mt-1">
                  Rajesh Kumar • rajesh@techinnovations.com • +91 98765 43210
                </p>
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-500">Requirement</label>
                <p className="text-sm text-gray-900 mt-1">
                  Express Connect connectivity requirement for Mumbai office with 100 Mbps bandwidth
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Network Selection */}
        <Card className="mb-6">
          <CardHeader className="border-b">
            <CardTitle>Network Selection</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Product Lock Alert */}
            {lockedProduct && isServiceChanges && (
              <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-md flex items-start space-x-2">
                <Info className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-orange-800">
                  <strong>Product Locked:</strong> This requirement contains MDAC FIDs for <strong>{lockedProduct}</strong>. 
                  The network type cannot be changed.
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-700 mb-2 block">
                  Network Type
                  {lockedProduct && isServiceChanges && (
                    <Badge variant="outline" className="ml-2 bg-orange-50 text-orange-700 border-orange-200 text-xs">
                      🔒 Locked
                    </Badge>
                  )}
                </label>
                <Select 
                  value={networkType} 
                  onValueChange={(value: "Express Connect" | "Site Connect") => setNetworkType(value)}
                  disabled={lockedProduct !== null && isServiceChanges}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Express Connect">Express Connect</SelectItem>
                    <SelectItem value="Site Connect">Site Connect</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {networkType === "Site Connect" && (
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">MPLS Type</label>
                  <Select value={mplsType} onValueChange={(value: "Mesh" | "Hub & Spoke") => setMplsType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mesh">Mesh</SelectItem>
                      <SelectItem value="Hub & Spoke">Hub & Spoke</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Configure FIDs */}
        <Card>
          <CardHeader className="border-b">
            <div>
              <CardTitle className="mb-3">Configure FIDs</CardTitle>
              <div className="flex items-center space-x-3 text-sm">
                <div className="flex items-center space-x-1">
                  <span className="text-gray-600">Configured:</span>
                  <span className="font-medium text-green-600">{configuredCount}</span>
                </div>
                <div className="w-px h-4 bg-gray-300" />
                <div className="flex items-center space-x-1">
                  <span className="text-gray-600">Yet to Configure:</span>
                  <span className="font-medium text-orange-600">{totalCount - configuredCount}</span>
                </div>
                <div className="w-px h-4 bg-gray-300" />
                <div className="flex items-center space-x-1">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-medium text-gray-900">{totalCount}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 absolute top-6 right-6">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/add-fids/${id}`)}
              >
                Add
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/pricing-management/${id}`)}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Update Pricing
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleBulkConfigure}
                disabled={selectedFIDs.length === 0}
              >
                Bulk Configure ({selectedFIDs.length})
              </Button>
              <Button 
                size="sm"
                className="bg-slate-800 hover:bg-slate-900"
                onClick={() => navigate(`/proposal-generation/${id}`)}
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate Proposal
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedFIDs.length === configurations.length}
                        onCheckedChange={(checked: boolean) => {
                          if (checked) {
                            setSelectedFIDs(configurations.map(c => c.fid));
                          } else {
                            setSelectedFIDs([]);
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>FID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Conn Type</TableHead>
                    <TableHead>Bandwidth</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1.5">
                        Link Type
                        {networkType === "Site Connect" && mplsType === "Hub & Spoke" && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-3.5 h-3.5 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-[280px]">
                                <p className="text-xs">
                                  <strong>Hub Requirement:</strong> The Hub location must have the highest bandwidth among all FIDs. If the location you want to set as Hub doesn't meet this requirement, you can either add a new FID with higher bandwidth from the pool or reduce the bandwidth values of other FIDs.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableHead>
                    <TableHead>VAS</TableHead>
                    <TableHead>{networkType === "Site Connect" ? "QOS" : "Plan"}</TableHead>
                    <TableHead>OTC</TableHead>
                    <TableHead>ARC</TableHead>
                    <TableHead className="w-12">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {configurations.map((config) => (
                    <TableRow key={config.fid}>
                      <TableCell>
                        <Checkbox
                          checked={selectedFIDs.includes(config.fid)}
                          onCheckedChange={(checked: boolean) => {
                            if (checked) {
                              setSelectedFIDs([...selectedFIDs, config.fid]);
                            } else {
                              setSelectedFIDs(selectedFIDs.filter(id => id !== config.fid));
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{config.fid}</TableCell>
                      <TableCell>
                        <Badge className={config.type === "New" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}>
                          {config.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-900">{config.location}</TableCell>
                      <TableCell className="text-sm text-gray-700">{config.connType}</TableCell>
                      <TableCell>
                        <Select 
                          value={config.bandwidth} 
                          onValueChange={(value: string) => handleBandwidthChange(config.fid, value)}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {getBandwidthOptions(config.bandwidth).map(bw => (
                              <SelectItem key={bw.value} value={bw.label}>{bw.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={config.linkType} 
                          onValueChange={(value: string) => {
                            // Validate bandwidth requirement for Hub & Spoke MPLS
                            if (networkType === "Site Connect" && mplsType === "Hub & Spoke" && value === "Hub") {
                              const currentBandwidth = getBandwidthValue(config.bandwidth);
                              const maxBandwidthOfOthers = Math.max(
                                ...configurations
                                  .filter(c => c.fid !== config.fid)
                                  .map(c => getBandwidthValue(c.bandwidth))
                              );
                              
                              if (currentBandwidth <= maxBandwidthOfOthers) {
                                toast.error(
                                  `Hub bandwidth (${config.bandwidth}) must be higher than all other FIDs. Please increase this FID's bandwidth or reduce other FIDs' bandwidth values.`,
                                  { duration: 5000 }
                                );
                                return;
                              }
                              
                              // Set others to Spoke if validation passes
                              configurations.forEach(c => {
                                if (c.fid !== config.fid && c.linkType === "Hub") {
                                  handleLinkTypeChange(c.fid, "Spoke");
                                }
                              });
                            }
                            
                            handleLinkTypeChange(config.fid, value);
                          }}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {networkType === "Site Connect" && mplsType === "Hub & Spoke" ? (
                              <>
                                <SelectItem value="Hub">Hub</SelectItem>
                                <SelectItem value="Spoke">Spoke</SelectItem>
                              </>
                            ) : (
                              <>
                                <SelectItem value="Primary">Primary</SelectItem>
                                <SelectItem value="Secondary">Secondary</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1.5 max-w-[220px] min-h-[32px]">
                            {config.vas.length === 0 ? (
                              <div className="text-xs text-gray-400 italic py-1">No VAS configured</div>
                            ) : (
                              config.vas.map((vasItem, idx) => {
                                const categoryColors = {
                                  'Additional IP': 'bg-blue-100 text-blue-700',
                                  'Managed Services': 'bg-green-100 text-green-700',
                                  'Devices': 'bg-purple-100 text-purple-700',
                                  'DDOS': 'bg-orange-100 text-orange-700'
                                };
                                const colorClass = categoryColors[vasItem.category] || 'bg-gray-100 text-gray-700';
                                
                                return (
                                  <div
                                    key={idx}
                                    className={`group relative text-xs flex items-center gap-1 px-2 py-1 rounded-md transition-all hover:shadow-sm ${colorClass}`}
                                    title={vasItem.description ? `${vasItem.category}: ${vasItem.value}\n${vasItem.description}` : `${vasItem.category}: ${vasItem.value}`}
                                  >
                                    <span className="max-w-[140px] truncate">
                                      <span className="font-medium">{vasItem.category}:</span> {vasItem.value}
                                    </span>
                                    <button
                                      onClick={() => removeVASItem(config.fid, idx)}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 w-4 h-4 rounded-full hover:bg-red-500 hover:text-white flex items-center justify-center text-xs"
                                      aria-label="Remove VAS"
                                    >
                                      ×
                                    </button>
                                  </div>
                                );
                              })
                            )}
                          </div>
                          <button 
                            className="h-7 w-7 flex items-center justify-center hover:bg-blue-50 transition-colors rounded"
                            onClick={() => {
                              setEditingFID(config.fid);
                              setVasDialogOpen(true);
                            }}
                          >
                            <Pencil className="w-3.5 h-3.5 text-gray-600" />
                          </button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={config.plan} 
                          onValueChange={(value: string) => handlePlanChange(config.fid, value)}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder={`Select ${networkType === "Site Connect" ? "QOS" : "plan"}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {networkType === "Site Connect" ? (
                              <>
                                <SelectItem value="Bronze">Bronze</SelectItem>
                                <SelectItem value="Silver">Silver</SelectItem>
                                <SelectItem value="Gold">Gold</SelectItem>
                              </>
                            ) : (
                              <>
                                <SelectItem value="Standard">Standard</SelectItem>
                                <SelectItem value="Value">Value</SelectItem>
                                <SelectItem value="Premium">Premium</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-sm text-gray-900">{config.otc}</TableCell>
                      <TableCell className="text-sm text-gray-900">
                        {config.arc !== '-' ? config.arc.replace('/month', '').replace('/mo', '') : config.arc}
                      </TableCell>
                      <TableCell>
                        {config.configured && (
                          <Check className="w-5 h-5 text-green-600" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Configuration Sheet */}
        <Sheet open={bulkConfigOpen} onOpenChange={setBulkConfigOpen}>
          <SheetContent className="w-[500px] sm:max-w-[500px] overflow-y-auto">
            <SheetHeader className="pb-4 border-b">
              <SheetTitle>Bulk Configuration</SheetTitle>
              <SheetDescription>
                Configure {selectedFIDs.length} selected FID(s)
              </SheetDescription>
            </SheetHeader>
            
            <div className="space-y-6 py-6">
              <div>
                <label className="text-sm text-gray-700 mb-2 block">Link Type (Required) *</label>
                <Select value={bulkConfig.linkType} onValueChange={(value: string) => setBulkConfig({...bulkConfig, linkType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select link type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Primary">Primary</SelectItem>
                    <SelectItem value="Secondary">Secondary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border-t pt-6">
                <label className="text-sm text-gray-700 mb-4 block">VAS Configuration (Optional)</label>
                <BulkVASConfiguration 
                  vasItems={bulkVASItems}
                  onAddVAS={(category, value, description) => {
                    const newVasItem: VASItem = { 
                      category: category as any, 
                      value,
                      ...(description && { description })
                    };
                    
                    // For Devices and DDOS, replace existing item of same category
                    let updatedVas = [...bulkVASItems];
                    if (category === 'Devices' || category === 'DDOS') {
                      updatedVas = updatedVas.filter(v => v.category !== category);
                    }
                    
                    setBulkVASItems([...updatedVas, newVasItem]);
                  }}
                  onRemoveVAS={(index) => {
                    setBulkVASItems(bulkVASItems.filter((_, i) => i !== index));
                  }}
                />
              </div>

              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
                <strong>Note:</strong> Bandwidth must be configured individually for each FID
              </div>
            </div>

            <SheetFooter className="border-t pt-4">
              <Button variant="outline" onClick={() => setBulkConfigOpen(false)}>
                Cancel
              </Button>
              <Button onClick={applyBulkConfiguration} className="bg-slate-800 hover:bg-slate-900">
                Apply Configuration
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        {/* VAS Configuration Dialog */}
        <VASConfigDialog 
          open={vasDialogOpen}
          onOpenChange={setVasDialogOpen}
          fid={editingFID}
          onAddVAS={addVASItem}
        />
      </div>
    </div>
  );
}

// VAS Configuration Dialog Component
function VASConfigDialog({ 
  open, 
  onOpenChange, 
  fid,
  onAddVAS 
}: { 
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fid: string | null;
  onAddVAS: (fid: string, category: string, value: string, description?: string) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleAdd = () => {
    if (!fid || !selectedCategory || !selectedValue) {
      toast.error('Please select a category and value');
      return;
    }

    onAddVAS(fid, selectedCategory, selectedValue, description || undefined);
    
    // Reset
    setSelectedCategory("");
    setSelectedValue("");
    setDescription("");
    onOpenChange(false);
    toast.success('VAS added successfully');
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedValue("");
    setDescription("");
  };

  const getValueOptions = () => {
    if (!selectedCategory) return [];
    return VASOptions[selectedCategory as keyof typeof VASOptions] || [];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" aria-describedby="vas-config-description">
        <DialogHeader>
          <DialogTitle>Add VAS Configuration</DialogTitle>
          <DialogDescription id="vas-config-description">
            Configure value-added services for the selected FID
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm text-gray-700 mb-2 block">VAS Category *</label>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Additional IP">Additional IP</SelectItem>
                <SelectItem value="Managed Services">Managed Services</SelectItem>
                <SelectItem value="Devices">Devices</SelectItem>
                <SelectItem value="DDOS">DDOS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedCategory && (
            <div>
              <label className="text-sm text-gray-700 mb-2 block">
                {selectedCategory === "Additional IP" && "IP Type"}
                {selectedCategory === "Managed Services" && "Service"}
                {selectedCategory === "Devices" && "Switch Model"}
                {selectedCategory === "DDOS" && "Mitigation Capacity"}
                {" *"}
              </label>
              <Select value={selectedValue} onValueChange={(value: string) => {
                setSelectedValue(value);
                // Auto-fill description for Managed Services
                if (selectedCategory === "Managed Services") {
                  const option = VASOptions["Managed Services"].find((opt: any) => opt.value === value);
                  if (option && typeof option === 'object') {
                    setDescription(option.description);
                  }
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  {getValueOptions().map((option: any) => {
                    const value = typeof option === 'string' ? option : option.value;
                    return (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedCategory === "Managed Services" && selectedValue && (
            <div>
              <label className="text-sm text-gray-700 mb-2 block">Description</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter service description"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd} className="bg-slate-800 hover:bg-slate-900">
            Add VAS
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Bulk VAS Configuration Component
function BulkVASConfiguration({ 
  vasItems,
  onAddVAS,
  onRemoveVAS
}: { 
  vasItems: VASItem[];
  onAddVAS: (category: string, value: string, description?: string) => void;
  onRemoveVAS: (index: number) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleAdd = () => {
    if (!selectedCategory || !selectedValue) {
      toast.error('Please select a category and value');
      return;
    }

    onAddVAS(selectedCategory, selectedValue, description || undefined);
    
    // Reset
    setSelectedCategory("");
    setSelectedValue("");
    setDescription("");
    toast.success('VAS added successfully');
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedValue("");
    setDescription("");
  };

  const getValueOptions = () => {
    if (!selectedCategory) return [];
    return VASOptions[selectedCategory as keyof typeof VASOptions] || [];
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-gray-700 mb-2 block">VAS Category *</label>
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Additional IP">Additional IP</SelectItem>
            <SelectItem value="Managed Services">Managed Services</SelectItem>
            <SelectItem value="Devices">Devices</SelectItem>
            <SelectItem value="DDOS">DDOS</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedCategory && (
        <div>
          <label className="text-sm text-gray-700 mb-2 block">
            {selectedCategory === "Additional IP" && "IP Type"}
            {selectedCategory === "Managed Services" && "Service"}
            {selectedCategory === "Devices" && "Switch Model"}
            {selectedCategory === "DDOS" && "Mitigation Capacity"}
            {" *"}
          </label>
          <Select value={selectedValue} onValueChange={(value: string) => {
            setSelectedValue(value);
            // Auto-fill description for Managed Services
            if (selectedCategory === "Managed Services") {
              const option = VASOptions["Managed Services"].find((opt: any) => opt.value === value);
              if (option && typeof option === 'object') {
                setDescription(option.description);
              }
            }
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              {getValueOptions().map((option: any) => {
                const value = typeof option === 'string' ? option : option.value;
                return (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      )}

      {selectedCategory === "Managed Services" && selectedValue && (
        <div>
          <label className="text-sm text-gray-700 mb-2 block">Description</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter service description"
          />
        </div>
      )}

      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5 max-w-[220px] min-h-[32px]">
          {vasItems.length === 0 ? (
            <div className="text-xs text-gray-400 italic py-1">No VAS configured</div>
          ) : (
            vasItems.map((vasItem, idx) => {
              const categoryColors = {
                'Additional IP': 'bg-blue-100 text-blue-700',
                'Managed Services': 'bg-green-100 text-green-700',
                'Devices': 'bg-purple-100 text-purple-700',
                'DDOS': 'bg-orange-100 text-orange-700'
              };
              const colorClass = categoryColors[vasItem.category] || 'bg-gray-100 text-gray-700';
              
              return (
                <div
                  key={idx}
                  className={`group relative text-xs flex items-center gap-1 px-2 py-1 rounded-md transition-all hover:shadow-sm ${colorClass}`}
                  title={vasItem.description ? `${vasItem.category}: ${vasItem.value}\n${vasItem.description}` : `${vasItem.category}: ${vasItem.value}`}
                >
                  <span className="max-w-[140px] truncate">
                    <span className="font-medium">{vasItem.category}:</span> {vasItem.value}
                  </span>
                  <button
                    onClick={() => onRemoveVAS(idx)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 w-4 h-4 rounded-full hover:bg-red-500 hover:text-white flex items-center justify-center text-xs"
                    aria-label="Remove VAS"
                  >
                    ×
                  </button>
                </div>
              );
            })
          )}
        </div>
        <button 
          className="h-7 w-7 flex items-center justify-center hover:bg-blue-50 transition-colors rounded"
          onClick={handleAdd}
        >
          <Pencil className="w-3.5 h-3.5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
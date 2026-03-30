import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { ArrowLeft, Plus, AlertCircle, Filter, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Alert, AlertDescription } from './ui/alert';

// Mock data for feasibility pool with product types
const feasibilityPoolData = [
  // DIA and MPLS entries (existing data)
  {
    id: "FID-2025-001",
    product: "DIA",
    type: "New",
    location: "Mumbai DC-1",
    locationDetail: "Powai Data Center, Building A, Floor 3, Rack 15\\nLat: 19.1176, Long: 72.9060",
    connType: "Wireless",
    bandwidth: "22 Mbps",
    orderStatus: "",
    endPoint: "A end" // Add endpoint for DIA/MPLS
  },
  {
    id: "FID-2025-002",
    product: "MPLS",
    type: "New",
    location: "Mumbai DC-1",
    locationDetail: "Powai Data Center, Building A, Floor 3, Rack 16\\nLat: 19.1176, Long: 72.9060",
    connType: "Other ISP - Airtel",
    bandwidth: "55 Mbps",
    orderStatus: "",
    endPoint: "A end"
  },
  {
    id: "FID-2025-003",
    product: "DIA",
    type: "Modify Bandwidth",
    location: "Bangalore DC-2",
    locationDetail: "Whitefield Data Center, Building B, Floor 2, Rack 8\\nLat: 12.9698, Long: 77.7499",
    connType: "Fibre",
    bandwidth: "100 Mbps",
    orderStatus: "Proposal Generated",
    endPoint: "A end"
  },
  {
    id: "FID-2025-004",
    product: "MPLS",
    type: "New",
    location: "Delhi DC-3",
    locationDetail: "Connaught Place Data Center, Building C, Floor 1, Rack 22\\nLat: 28.6139, Long: 77.2090",
    connType: "Fibre",
    bandwidth: "200 Mbps",
    orderStatus: "",
    endPoint: "B end"
  },
  {
    id: "FID-2025-005",
    product: "DIA",
    type: "Modify Bandwidth",
    location: "Mumbai DC-1",
    locationDetail: "Powai Data Center, Building A, Floor 2, Rack 10\\nLat: 19.1176, Long: 72.9060",
    connType: "Other ISP - Jio",
    bandwidth: "150 Mbps",
    orderStatus: "Proposal Generated",
    endPoint: "A end"
  },
  
  // P2P - GCC entries
  {
    id: "FID-2025-006",
    product: "P2P - GCC",
    type: "New",
    location: "Mumbai - AWS",
    locationDetail: "AWS Mumbai Region\\nConnecting Node: Mumbai\\nLat: 19.0760, Long: 72.8777",
    connType: "Cloud Provider - AWS",
    bandwidth: "500 Mbps",
    orderStatus: "",
    endPoint: "A end"
  },
  {
    id: "FID-2025-007",
    product: "P2P - GCC",
    type: "New",
    location: "Bangalore - Azure",
    locationDetail: "Azure Bangalore Region\\nConnecting Node: Bangalore\\nLat: 12.9716, Long: 77.5946",
    connType: "Cloud Provider - Azure",
    bandwidth: "1 Gbps",
    orderStatus: "",
    endPoint: "B end"
  },
  {
    id: "FID-2025-008",
    product: "P2P - GCC",
    type: "Modify Bandwidth",
    location: "Delhi - GCP",
    locationDetail: "GCP Delhi Region\\nConnecting Node: Delhi\\nLat: 28.7041, Long: 77.1025",
    connType: "Cloud Provider - GCP",
    bandwidth: "750 Mbps",
    orderStatus: "Proposal Generated",
    endPoint: "A end"
  },
  
  // P2P - EVPL entries
  {
    id: "FID-2025-009",
    product: "P2P - EVPL",
    type: "New",
    location: "Pune - Chennai",
    locationDetail: "Point-to-Point EVPL Connection\\nPune IT Park to Chennai DC\\nLat: 18.5204, Long: 73.8567",
    connType: "Ethernet Virtual Private Line",
    bandwidth: "200 Mbps",
    orderStatus: "",
    endPoint: "A end"
  },
  {
    id: "FID-2025-010",
    product: "P2P - EVPL",
    type: "New",
    location: "Mumbai - Delhi",
    locationDetail: "Point-to-Point EVPL Connection\\nMumbai DC to Delhi DC\\nLat: 19.0760, Long: 72.8777",
    connType: "Ethernet Virtual Private Line",
    bandwidth: "500 Mbps",
    orderStatus: "",
    endPoint: "A end"
  },
  {
    id: "FID-2025-011",
    product: "P2P - EVPL",
    type: "Modify Bandwidth",
    location: "Bangalore - Hyderabad",
    locationDetail: "Point-to-Point EVPL Connection\\nBangalore Tech Park to Hyderabad DC\\nLat: 12.9716, Long: 77.5946",
    connType: "Ethernet Virtual Private Line",
    bandwidth: "1 Gbps",
    orderStatus: "",
    endPoint: "B end"
  },
  
  // P2P - EPL entries
  {
    id: "FID-2025-012",
    product: "P2P - EPL",
    type: "New",
    location: "Chennai - Coimbatore",
    locationDetail: "Point-to-Point EPL Connection\\nChennai DC to Coimbatore Branch\\nLat: 13.0827, Long: 80.2707",
    connType: "Ethernet Private Line",
    bandwidth: "100 Mbps",
    orderStatus: "",
    endPoint: "A end"
  },
  {
    id: "FID-2025-013",
    product: "P2P - EPL",
    type: "New",
    location: "Kolkata - Guwahati",
    locationDetail: "Point-to-Point EPL Connection\\nKolkata Office to Guwahati Branch\\nLat: 22.5726, Long: 88.3639",
    connType: "Ethernet Private Line",
    bandwidth: "200 Mbps",
    orderStatus: "",
    endPoint: "B end"
  },
  
  // P2P - DEPL entries
  {
    id: "FID-2025-014",
    product: "P2P - DEPL",
    type: "New",
    location: "Jaipur - Ahmedabad",
    locationDetail: "Point-to-Point DEPL Connection\\nJaipur Office to Ahmedabad Branch\\nLat: 26.9124, Long: 75.7873",
    connType: "Dark Fiber Ethernet Private Line",
    bandwidth: "10 Gbps",
    orderStatus: "",
    endPoint: "A end"
  },
  {
    id: "FID-2025-015",
    product: "P2P - DEPL",
    type: "New",
    location: "Indore - Bhopal",
    locationDetail: "Point-to-Point DEPL Connection\\nIndore DC to Bhopal Office\\nLat: 22.7196, Long: 75.8577",
    connType: "Dark Fiber Ethernet Private Line",
    bandwidth: "10 Gbps",
    orderStatus: "",
    endPoint: "B end"
  },
  
  // DEMO: Same FID with multiple LM types (New Logic)
  // FID-2025-016 has 3 LM types, so it appears 3 times
  {
    id: "FID-2025-016",
    product: "DIA",
    type: "New",
    location: "Navi Mumbai, Vashi",
    locationDetail: "Vashi Tech Park, Tower B, Floor 5\\nLat: 19.0688, Long: 72.9989",
    connType: "Fiber",
    bandwidth: "100 Mbps",
    orderStatus: "",
    endPoint: "A end"
  },
  {
    id: "FID-2025-016", // Same FID
    product: "DIA",
    type: "New",
    location: "Navi Mumbai, Vashi", // Same location
    locationDetail: "Vashi Tech Park, Tower B, Floor 5\\nLat: 19.0688, Long: 72.9989", // Same details
    connType: "Wireless", // Different LM type
    bandwidth: "100 Mbps", // Same bandwidth
    orderStatus: "", // Can have different status
    endPoint: "A end" // Same endpoint
  },
  {
    id: "FID-2025-016", // Same FID again
    product: "DIA",
    type: "New",
    location: "Navi Mumbai, Vashi", // Same location
    locationDetail: "Vashi Tech Park, Tower B, Floor 5\\nLat: 19.0688, Long: 72.9989", // Same details
    connType: "Other ISP - Airtel", // Another different LM type
    bandwidth: "100 Mbps", // Same bandwidth
    orderStatus: "", // Can have different status
    endPoint: "A end" // Same endpoint
  },
  
  // FID-2025-017 has 2 LM types
  {
    id: "FID-2025-017",
    product: "MPLS",
    type: "New",
    location: "Chennai, OMR",
    locationDetail: "OMR Tech Park, Building A, Floor 3\\nLat: 12.9121, Long: 80.2275",
    connType: "Fiber",
    bandwidth: "500 Mbps",
    orderStatus: "Proposal Generated",
    endPoint: "A end"
  },
  {
    id: "FID-2025-017", // Same FID
    product: "MPLS",
    type: "New",
    location: "Chennai, OMR", // Same location
    locationDetail: "OMR Tech Park, Building A, Floor 3\\nLat: 12.9121, Long: 80.2275", // Same details
    connType: "Wireless", // Different LM type
    bandwidth: "500 Mbps", // Same bandwidth
    orderStatus: "", // Different status - showing independent status capability
    endPoint: "A end" // Same endpoint
  },
  
  // MDAC (formerly Service Changes) entries
  {
    id: "FID-2025-SC001",
    product: "DIA",
    type: "MDAC",
    changeType: "Address Change",
    location: "Mumbai, Andheri",
    locationDetail: "Andheri East Office Complex, Floor 4\\nLat: 19.1136, Long: 72.8697",
    connType: "Fiber",
    bandwidth: "200 Mbps",
    orderStatus: "",
    endPoint: "A end"
  },
  {
    id: "FID-2025-SC002",
    product: "DIA",
    type: "MDAC",
    changeType: "Bandwidth Change",
    location: "Pune, Hinjewadi",
    locationDetail: "Hinjewadi IT Park, Phase 2\\nLat: 18.5912, Long: 73.7389",
    connType: "Wireless",
    bandwidth: "100 Mbps",
    orderStatus: "",
    endPoint: "A end"
  },
  {
    id: "FID-2025-SC003",
    product: "DIA",
    type: "MDAC",
    changeType: "LM Change",
    location: "Delhi, Connaught Place",
    locationDetail: "Connaught Place Business Center\\nLat: 28.6304, Long: 77.2177",
    connType: "Fiber",
    bandwidth: "300 Mbps",
    orderStatus: "",
    endPoint: "A end"
  },
  {
    id: "FID-2025-SC004",
    product: "MPLS",
    type: "MDAC",
    changeType: "Address Change",
    location: "Bangalore, Koramangala",
    locationDetail: "Koramangala Business District\\nLat: 12.9352, Long: 77.6245",
    connType: "Fiber",
    bandwidth: "500 Mbps",
    orderStatus: "",
    endPoint: "A end"
  },
  {
    id: "FID-2025-SC005",
    product: "MPLS",
    type: "MDAC",
    changeType: "Add Secondary/Tertiary Link",
    location: "Delhi, Nehru Place",
    locationDetail: "Nehru Place Business Hub\\nLat: 28.5494, Long: 77.2501",
    connType: "Other ISP - Airtel",
    bandwidth: "1 Gbps",
    orderStatus: "",
    endPoint: "B end"
  },
  
  // FID-2025-018 has 2 LM types (Fiber and Jio)
  {
    id: "FID-2025-018",
    product: "DIA",
    type: "Modify Bandwidth",
    location: "Pune, Hinjewadi",
    locationDetail: "Hinjewadi IT Park, Phase 2, Building D\\nLat: 18.5912, Long: 73.7389",
    connType: "Fiber",
    bandwidth: "200 Mbps",
    orderStatus: "Proposal Generated",
    endPoint: "A end"
  },
  {
    id: "FID-2025-018", // Same FID
    product: "DIA",
    type: "Modify Bandwidth",
    location: "Pune, Hinjewadi", // Same location
    locationDetail: "Hinjewadi IT Park, Phase 2, Building D\\nLat: 18.5912, Long: 73.7389", // Same details
    connType: "Other ISP - Jio", // Different LM type
    bandwidth: "200 Mbps", // Same bandwidth
    orderStatus: "", // Different status - Fiber is in Proposal but Jio is still pending
    endPoint: "A end" // Same endpoint
  }
];

export function FeasibilityPool() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedFIDs, setSelectedFIDs] = useState<string[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  // Track if any selected FID is of type "MDAC"
  const hasServiceChangesFID = useMemo(() => {
    return selectedFIDs.some(fidId => {
      const fidData = feasibilityPoolData.find(f => f.id === fidId);
      return fidData?.type === 'MDAC';
    });
  }, [selectedFIDs]);
  
  // Track the product type of selected MDAC FIDs (to ensure same product selection)
  const selectedProduct = useMemo(() => {
    if (selectedFIDs.length === 0 || !hasServiceChangesFID) return null;
    
    // Find the first MDAC FID
    const firstServiceChangeFID = selectedFIDs.find(fidId => {
      const fidData = feasibilityPoolData.find(f => f.id === fidId);
      return fidData?.type === 'MDAC';
    });
    
    if (!firstServiceChangeFID) return null;
    
    const fidData = feasibilityPoolData.find(f => f.id === firstServiceChangeFID);
    return fidData?.product || null;
  }, [selectedFIDs, hasServiceChangesFID]);
  
  // Filter states
  const [filters, setFilters] = useState({
    products: [] as string[],
    types: [] as string[],
    locations: [] as string[],
    connectionTypes: [] as string[],
    endPoints: [] as string[],
    orderStatus: [] as string[]
  });

  // Extract unique values for filter options
  const filterOptions = useMemo(() => {
    return {
      products: Array.from(new Set(feasibilityPoolData.map(f => f.product))),
      types: Array.from(new Set(feasibilityPoolData.map(f => f.type))),
      locations: Array.from(new Set(feasibilityPoolData.map(f => f.location))),
      connectionTypes: Array.from(new Set(feasibilityPoolData.map(f => f.connType))),
      endPoints: Array.from(new Set(feasibilityPoolData.map(f => f.endPoint))),
      orderStatus: ['Proposal Generated', 'No Status']
    };
  }, []);

  // Apply filters to data
  const filteredData = useMemo(() => {
    let data = feasibilityPoolData;

    if (filters.products.length > 0) {
      data = data.filter(f => filters.products.includes(f.product));
    }
    if (filters.types.length > 0) {
      data = data.filter(f => filters.types.includes(f.type));
    }
    if (filters.locations.length > 0) {
      data = data.filter(f => filters.locations.includes(f.location));
    }
    if (filters.connectionTypes.length > 0) {
      data = data.filter(f => filters.connectionTypes.includes(f.connType));
    }
    if (filters.endPoints.length > 0) {
      data = data.filter(f => filters.endPoints.includes(f.endPoint));
    }
    if (filters.orderStatus.length > 0) {
      data = data.filter(f => {
        if (filters.orderStatus.includes('No Status')) {
          return !f.orderStatus || filters.orderStatus.includes(f.orderStatus);
        }
        return filters.orderStatus.includes(f.orderStatus);
      });
    }

    return data;
  }, [filters]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).reduce((sum, arr) => sum + arr.length, 0);
  }, [filters]);

  const handleFilterChange = (filterType: keyof typeof filters, value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: checked
        ? [...prev[filterType], value]
        : prev[filterType].filter(v => v !== value)
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      products: [],
      types: [],
      locations: [],
      connectionTypes: [],
      endPoints: [],
      orderStatus: []
    });
  };

  const handleApplyFilters = () => {
    setIsFilterModalOpen(false);
    toast.success('Filters applied successfully');
  };

  const handleAddToRequirement = () => {
    if (selectedFIDs.length === 0) {
      toast.error('Please select at least one FID');
      return;
    }
    
    const lockMessage = hasServiceChangesFID 
      ? `Added ${selectedFIDs.length} FID(s) to requirement with ${selectedProduct} product lock (MDAC detected)` 
      : `Added ${selectedFIDs.length} FID(s) to requirement (No product lock)`;
    
    toast.success(lockMessage);
    
    console.log('FeasibilityPool - Navigating with state:', {
      lockedProduct: hasServiceChangesFID ? selectedProduct : null,
      isServiceChanges: hasServiceChangesFID
    });
    
    setTimeout(() => {
      navigate(`/requirement-details/${id}`, {
        state: {
          lockedProduct: hasServiceChangesFID ? selectedProduct : null,
          isServiceChanges: hasServiceChangesFID
        }
      });
    }, 1000);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Select all FIDs of the currently selected product type, or all if none selected
      if (selectedProduct) {
        const fidsToSelect = feasibilityPoolData
          .filter(f => f.product === selectedProduct)
          .map(f => f.id);
        setSelectedFIDs(fidsToSelect);
      } else {
        setSelectedFIDs(feasibilityPoolData.map(f => f.id));
      }
    } else {
      setSelectedFIDs([]);
    }
  };

  const handleSelectFID = (fid: string, checked: boolean) => {
    const fidData = feasibilityPoolData.find(f => f.id === fid);
    if (!fidData) return;

    if (checked) {
      // NEW LOGIC: Product restriction only applies when selecting MDAC FIDs
      if (hasServiceChangesFID || fidData.type === 'MDAC') {
        // If MDAC FIDs are selected or being selected, enforce product restriction
        if (selectedFIDs.length === 0 || fidData.product === selectedProduct) {
          setSelectedFIDs([...selectedFIDs, fid]);
        } else {
          toast.error(`MDAC FIDs require same product type. Currently selected: ${selectedProduct}`);
        }
      } else {
        // No MDAC FIDs selected - allow any selection
        setSelectedFIDs([...selectedFIDs, fid]);
      }
    } else {
      setSelectedFIDs(selectedFIDs.filter(id => id !== fid));
    }
  };

  const getTypeBadgeColor = (type: string) => {
    return type === 'New' 
      ? 'bg-blue-100 text-blue-700' 
      : 'bg-purple-100 text-purple-700';
  };

  const getProductBadgeColor = (product: string) => {
    switch(product) {
      case 'DIA':
        return 'bg-slate-100 text-slate-700';
      case 'MPLS':
        return 'bg-indigo-100 text-indigo-700';
      case 'P2P - GCC':
        return 'bg-green-100 text-green-700';
      case 'P2P - EVPL':
        return 'bg-blue-100 text-blue-700';
      case 'P2P - EPL':
        return 'bg-orange-100 text-orange-700';
      case 'P2P - DEPL':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Check if checkbox should be disabled (different product type after selection)
  const isCheckboxDisabled = (product: string) => {
    return selectedProduct !== null && product !== selectedProduct;
  };

  // Count of FIDs by product type
  const productCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    feasibilityPoolData.forEach(f => {
      counts[f.product] = (counts[f.product] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto p-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(`/requirement-details/${id}`)}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Requirement Details
        </Button>

        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Feasibility Pool</CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Select FIDs to add to your requirement
                </p>
              </div>
              <Button 
                size="sm"
                className="bg-slate-800 hover:bg-slate-900"
                onClick={handleAddToRequirement}
                disabled={selectedFIDs.length === 0}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Proposal ({selectedFIDs.length})
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Demo Info Alert */}
            <Alert className="mb-4 border-blue-200 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>New FID Logic Demo:</strong> FIDs <span className="font-mono bg-blue-100 px-1 rounded">FID-2025-016</span> (3 LM types), <span className="font-mono bg-blue-100 px-1 rounded">FID-2025-017</span> (2 LM types), and <span className="font-mono bg-blue-100 px-1 rounded">FID-2025-018</span> (2 LM types) demonstrate same FID appearing multiple times with different LM types. Notice how all fields are identical except Connection Type.
              </AlertDescription>
            </Alert>

            {/* Filter button and active filter badges */}
            <div className="flex items-center justify-between mb-4">
              <Button
                size="sm"
                variant="outline"
                className="border-gray-300"
                onClick={() => setIsFilterModalOpen(true)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </Button>
              {activeFilterCount > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleClearFilters}
                  className="text-gray-600"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear All Filters
                </Button>
              )}
            </div>

            {/* Info alert about product selection */}
            {selectedProduct && hasServiceChangesFID && (
              <Alert className="mb-4 border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  <strong>Product Restriction Active:</strong> You have selected MDAC FIDs for <span className="font-semibold">{selectedProduct}</span>. 
                  Only {selectedProduct} FIDs can now be selected for this requirement.
                </AlertDescription>
              </Alert>
            )}

            <TooltipProvider>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedProduct 
                          ? selectedFIDs.length === feasibilityPoolData.filter(f => f.product === selectedProduct).length
                          : selectedFIDs.length === feasibilityPoolData.length
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>FID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Connection Type / Bandwidth</TableHead>
                    <TableHead>Order Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((fid) => {
                    const isDisabled = isCheckboxDisabled(fid.product);
                    const isSelected = selectedFIDs.includes(fid.id);
                    
                    return (
                      <TableRow 
                        key={fid.id}
                        className={isDisabled ? 'opacity-50' : ''}
                      >
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            disabled={isDisabled}
                            onCheckedChange={(checked) => handleSelectFID(fid.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{fid.id}</TableCell>
                        <TableCell>
                          <Badge className={getProductBadgeColor(fid.product)}>
                            {fid.product}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge className={getTypeBadgeColor(fid.type)}>
                              {fid.type}
                            </Badge>
                            {fid.type === 'MDAC' && fid.changeType && (
                              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
                                {fid.changeType}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex flex-col gap-1">
                                <span className="cursor-help underline decoration-dotted">
                                  {fid.location}
                                </span>
                                <Badge 
                                  variant="outline" 
                                  className={
                                    fid.endPoint === 'A end' 
                                      ? 'bg-blue-50 text-blue-700 border-blue-200 w-fit text-xs' 
                                      : 'bg-amber-50 text-amber-700 border-amber-200 w-fit text-xs'
                                  }
                                >
                                  {fid.endPoint}
                                </Badge>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-xs whitespace-pre-line max-w-xs">
                                {fid.locationDetail}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <span className="text-gray-900">{fid.connType}</span>
                            <span className="text-gray-500"> - {fid.bandwidth}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {fid.orderStatus ? (
                            <Badge className="bg-green-100 text-green-700">
                              {fid.orderStatus}
                            </Badge>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TooltipProvider>
          </CardContent>
        </Card>

        {/* Filter Modal */}
        <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Filter Feasibility Pool</DialogTitle>
              <DialogDescription>
                Apply filters to narrow down the FIDs in the feasibility pool.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {/* Product Type Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Product Type</Label>
                <div className="space-y-2">
                  {filterOptions.products.map(product => (
                    <div key={product} className="flex items-center space-x-2">
                      <Checkbox
                        id={`product-${product}`}
                        checked={filters.products.includes(product)}
                        onCheckedChange={(checked) => handleFilterChange('products', product, checked as boolean)}
                      />
                      <label 
                        htmlFor={`product-${product}`}
                        className="text-sm cursor-pointer"
                      >
                        {product}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Type</Label>
                <div className="space-y-2">
                  {filterOptions.types.map(type => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type}`}
                        checked={filters.types.includes(type)}
                        onCheckedChange={(checked) => handleFilterChange('types', type, checked as boolean)}
                      />
                      <label 
                        htmlFor={`type-${type}`}
                        className="text-sm cursor-pointer"
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Location</Label>
                <div className="space-y-2">
                  {filterOptions.locations.map(location => (
                    <div key={location} className="flex items-center space-x-2">
                      <Checkbox
                        id={`location-${location}`}
                        checked={filters.locations.includes(location)}
                        onCheckedChange={(checked) => handleFilterChange('locations', location, checked as boolean)}
                      />
                      <label 
                        htmlFor={`location-${location}`}
                        className="text-sm cursor-pointer"
                      >
                        {location}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connection Type Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Connection Type</Label>
                <div className="space-y-2">
                  {filterOptions.connectionTypes.map(connType => (
                    <div key={connType} className="flex items-center space-x-2">
                      <Checkbox
                        id={`connType-${connType}`}
                        checked={filters.connectionTypes.includes(connType)}
                        onCheckedChange={(checked) => handleFilterChange('connectionTypes', connType, checked as boolean)}
                      />
                      <label 
                        htmlFor={`connType-${connType}`}
                        className="text-sm cursor-pointer"
                      >
                        {connType}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* End Point Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">End Point</Label>
                <div className="space-y-2">
                  {filterOptions.endPoints.map(endPoint => (
                    <div key={endPoint} className="flex items-center space-x-2">
                      <Checkbox
                        id={`endPoint-${endPoint}`}
                        checked={filters.endPoints.includes(endPoint)}
                        onCheckedChange={(checked) => handleFilterChange('endPoints', endPoint, checked as boolean)}
                      />
                      <label 
                        htmlFor={`endPoint-${endPoint}`}
                        className="text-sm cursor-pointer"
                      >
                        {endPoint}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Status Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Order Status</Label>
                <div className="space-y-2">
                  {filterOptions.orderStatus.map(status => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={filters.orderStatus.includes(status)}
                        onCheckedChange={(checked) => handleFilterChange('orderStatus', status, checked as boolean)}
                      />
                      <label 
                        htmlFor={`status-${status}`}
                        className="text-sm cursor-pointer"
                      >
                        {status}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                size="sm"
                className="bg-gray-100 hover:bg-gray-200 text-gray-900"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
              <Button
                size="sm"
                className="bg-slate-800 hover:bg-slate-900"
                onClick={handleApplyFilters}
              >
                Apply Filters
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
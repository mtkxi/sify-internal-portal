import React, { useState } from 'react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ArrowLeft, Search, Network, MapPin, Zap, Info, Filter, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';

// Mock active links data
const mockActiveLinks = [
  {
    id: 'LINK-001',
    linkId: 'LINK-001',
    customerId: 'TC001',
    customerName: 'Tech Corp India',
    productType: 'DIA',
    linkType: 'Primary',
    bandwidth: '100 Mbps',
    lmType: 'Fiber',
    addressType: 'Sify DC',
    address: 'DC Mumbai 1 - Rabale, Navi Mumbai, Maharashtra, 400701',
    city: 'Mumbai',
    state: 'Maharashtra',
    pinCode: '400701',
    status: 'Active',
    activationDate: '2024-01-15',
    expiryDate: '2026-01-15',
    otc: '₹50,000',
    arc: '₹1,20,000',
    contactName: 'Rajesh Kumar',
    contactEmail: 'rajesh.k@techcorp.com',
    contactPhone: '+91 9876543210',
    portType: 'Electrical Ethernet',
    portBandwidth: '1 Gbps'
  },
  {
    id: 'LINK-002',
    linkId: 'LINK-002',
    customerId: 'TC001',
    customerName: 'Tech Corp India',
    productType: 'DIA',
    linkType: 'Secondary',
    bandwidth: '50 Mbps',
    lmType: 'Wireless',
    addressType: 'Custom Location',
    address: '123 Business Park, Andheri East, Mumbai, Maharashtra, 400069',
    city: 'Mumbai',
    state: 'Maharashtra',
    pinCode: '400069',
    status: 'Active',
    activationDate: '2024-02-20',
    expiryDate: '2026-02-20',
    otc: '₹30,000',
    arc: '₹60,000',
    contactName: 'Priya Sharma',
    contactEmail: 'priya.s@techcorp.com',
    contactPhone: '+91 9876543211',
    portType: 'Electrical Ethernet',
    portBandwidth: '1 Gbps'
  },
  {
    id: 'LINK-003',
    linkId: 'LINK-003',
    customerId: 'TC001',
    customerName: 'Tech Corp India',
    productType: 'MPLS',
    linkType: 'Primary',
    mplsTopology: 'Hub & Spoke',
    nodeType: 'Hub',
    bandwidth: '200 Mbps',
    lmType: 'Fiber',
    addressType: 'Connected Building',
    address: 'Manyata Tech Park, Bangalore, Karnataka, 560045',
    city: 'Bangalore',
    state: 'Karnataka',
    pinCode: '560045',
    status: 'Active',
    activationDate: '2024-03-10',
    expiryDate: '2026-03-10',
    otc: '₹75,000',
    arc: '₹2,40,000',
    contactName: 'Amit Patel',
    contactEmail: 'amit.p@techcorp.com',
    contactPhone: '+91 9876543212',
    portType: 'Optical Ethernet',
    portBandwidth: '1 Gbps'
  },
  {
    id: 'LINK-004',
    linkId: 'LINK-004',
    customerId: 'TC001',
    customerName: 'Tech Corp India',
    productType: 'DIA',
    linkType: 'Primary',
    bandwidth: '500 Mbps',
    lmType: 'Fiber',
    addressType: 'Connected DC',
    address: 'NetMagic DC - Mumbai, Maharashtra, 400059',
    city: 'Mumbai',
    state: 'Maharashtra',
    pinCode: '400059',
    status: 'Active',
    activationDate: '2024-04-05',
    expiryDate: '2026-04-05',
    otc: '₹1,00,000',
    arc: '₹6,00,000',
    contactName: 'Sneha Reddy',
    contactEmail: 'sneha.r@techcorp.com',
    contactPhone: '+91 9876543213',
    portType: 'Optical Ethernet',
    portBandwidth: '10 Gbps'
  },
  {
    id: 'LINK-005',
    linkId: 'LINK-005',
    customerId: 'TC001',
    customerName: 'Tech Corp India',
    productType: 'MPLS',
    linkType: 'Primary',
    mplsTopology: 'Hub & Spoke',
    nodeType: 'Spoke',
    bandwidth: '1 Gbps',
    lmType: 'Fiber',
    addressType: 'Sify DC',
    address: 'DC Bangalore 1 - Whitefield, Bangalore, Karnataka, 560066',
    city: 'Bangalore',
    state: 'Karnataka',
    pinCode: '560066',
    status: 'Active',
    activationDate: '2024-05-12',
    expiryDate: '2026-05-12',
    otc: '₹1,50,000',
    arc: '₹12,00,000',
    contactName: 'Vikram Singh',
    contactEmail: 'vikram.s@techcorp.com',
    contactPhone: '+91 9876543214',
    portType: 'Optical Ethernet',
    portBandwidth: '10 Gbps'
  },
  {
    id: 'LINK-006',
    linkId: 'LINK-006',
    customerId: 'TC001',
    customerName: 'Tech Corp India',
    productType: 'DIA',
    linkType: 'Tertiary',
    bandwidth: '25 Mbps',
    lmType: 'Wireless',
    addressType: 'Custom Location',
    address: '45 Innovation Hub, Hinjewadi, Pune, Maharashtra, 411057',
    city: 'Pune',
    state: 'Maharashtra',
    pinCode: '411057',
    status: 'Active',
    activationDate: '2024-06-18',
    expiryDate: '2026-06-18',
    otc: '₹20,000',
    arc: '₹30,000',
    contactName: 'Neha Agarwal',
    contactEmail: 'neha.a@techcorp.com',
    contactPhone: '+91 9876543215',
    portType: 'Electrical Ethernet',
    portBandwidth: '1 Gbps'
  },
  {
    id: 'LINK-007',
    linkId: 'LINK-007',
    customerId: 'TC001',
    customerName: 'Tech Corp India',
    productType: 'MPLS',
    linkType: 'Secondary',
    mplsTopology: 'Hub & Spoke',
    nodeType: 'Spoke',
    bandwidth: '300 Mbps',
    lmType: 'Fiber',
    addressType: 'Sify DC',
    address: 'DC Chennai 1 - Ambattur, Chennai, Tamil Nadu, 600053',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pinCode: '600053',
    status: 'Active',
    activationDate: '2024-07-22',
    expiryDate: '2026-07-22',
    otc: '₹80,000',
    arc: '₹3,60,000',
    contactName: 'Arjun Menon',
    contactEmail: 'arjun.m@techcorp.com',
    contactPhone: '+91 9876543216',
    portType: 'Optical Ethernet',
    portBandwidth: '1 Gbps'
  },
  {
    id: 'LINK-008',
    linkId: 'LINK-008',
    customerId: 'TC001',
    customerName: 'Tech Corp India',
    productType: 'DIA',
    linkType: 'Primary',
    bandwidth: '150 Mbps',
    lmType: 'Fiber',
    addressType: 'Connected Building',
    address: 'DLF Cyber City, Gurgaon, Haryana, 122002',
    city: 'Gurgaon',
    state: 'Haryana',
    pinCode: '122002',
    status: 'Active',
    activationDate: '2024-08-30',
    expiryDate: '2026-08-30',
    otc: '₹60,000',
    arc: '₹1,80,000',
    contactName: 'Kavita Joshi',
    contactEmail: 'kavita.j@techcorp.com',
    contactPhone: '+91 9876543217',
    portType: 'Electrical Ethernet',
    portBandwidth: '1 Gbps'
  },
  {
    id: 'LINK-009',
    linkId: 'LINK-009',
    customerId: 'TC001',
    customerName: 'Tech Corp India',
    productType: 'MPLS',
    linkType: 'Primary',
    mplsTopology: 'Mesh',
    bandwidth: '50 Mbps',
    lmType: 'Wireless',
    addressType: 'Custom Location',
    address: '78 Tech Park, Electronic City, Bangalore, Karnataka, 560100',
    city: 'Bangalore',
    state: 'Karnataka',
    pinCode: '560100',
    status: 'Active',
    activationDate: '2024-09-14',
    expiryDate: '2026-09-14',
    otc: '₹35,000',
    arc: '₹60,000',
    contactName: 'Rohan Gupta',
    contactEmail: 'rohan.g@techcorp.com',
    contactPhone: '+91 9876543218',
    portType: 'Electrical Ethernet',
    portBandwidth: '1 Gbps'
  },
  {
    id: 'LINK-010',
    linkId: 'LINK-010',
    customerId: 'TC001',
    customerName: 'Tech Corp India',
    productType: 'DIA',
    linkType: 'Secondary',
    bandwidth: '750 Mbps',
    lmType: 'Fiber',
    addressType: 'Connected DC',
    address: 'CtrlS DC - Hyderabad, Telangana, 500084',
    city: 'Hyderabad',
    state: 'Telangana',
    pinCode: '500084',
    status: 'Active',
    activationDate: '2024-10-25',
    expiryDate: '2026-10-25',
    otc: '₹1,20,000',
    arc: '₹9,00,000',
    contactName: 'Meera Iyer',
    contactEmail: 'meera.i@techcorp.com',
    contactPhone: '+91 9876543219',
    portType: 'Optical Ethernet',
    portBandwidth: '10 Gbps'
  },
  {
    id: 'LINK-011',
    linkId: 'LINK-011',
    customerId: 'TC001',
    customerName: 'Tech Corp India',
    productType: 'MPLS',
    linkType: 'Primary',
    mplsTopology: 'Hub & Spoke',
    nodeType: 'Spoke',
    bandwidth: '100 Mbps',
    lmType: 'Fiber',
    addressType: 'Sify DC',
    address: 'DC Hyderabad 1 - Gachibowli, Hyderabad, Telangana, 500032',
    city: 'Hyderabad',
    state: 'Telangana',
    pinCode: '500032',
    status: 'Active',
    activationDate: '2024-11-08',
    expiryDate: '2026-11-08',
    otc: '₹55,000',
    arc: '₹1,20,000',
    contactName: 'Sanjay Desai',
    contactEmail: 'sanjay.d@techcorp.com',
    contactPhone: '+91 9876543220',
    portType: 'Electrical Ethernet',
    portBandwidth: '1 Gbps'
  },
  {
    id: 'LINK-012',
    linkId: 'LINK-012',
    customerId: 'TC001',
    customerName: 'Tech Corp India',
    productType: 'DIA',
    linkType: 'Primary',
    bandwidth: '250 Mbps',
    lmType: 'Fiber',
    addressType: 'Custom Location',
    address: '90 Cyber Hub, Sector 18, Gurugram, Haryana, 122015',
    city: 'Gurugram',
    state: 'Haryana',
    pinCode: '122015',
    status: 'Active',
    activationDate: '2024-12-02',
    expiryDate: '2026-12-02',
    otc: '₹70,000',
    arc: '₹3,00,000',
    contactName: 'Divya Nair',
    contactEmail: 'divya.n@techcorp.com',
    contactPhone: '+91 9876543221',
    portType: 'Optical Ethernet',
    portBandwidth: '1 Gbps'
  }
];

interface LinkInventoryPageProps {
  maxSelection: number;
  productType?: string;
  onBack: () => void;
  onProceed: (selectedLinks: any[]) => void;
}

export function LinkInventoryPage({ maxSelection, productType, onBack, onProceed }: LinkInventoryPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLinkIds, setSelectedLinkIds] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filterBuildingType, setFilterBuildingType] = useState('All');
  const [filterLMType, setFilterLMType] = useState('All');
  const [filterState, setFilterState] = useState('All');
  const [filterCity, setFilterCity] = useState('All');
  const [filterBandwidthRange, setFilterBandwidthRange] = useState('All');
  
  // Get unique values for filter dropdowns
  const uniqueStates = Array.from(new Set(mockActiveLinks.map(link => link.state))).sort();
  const uniqueCities = Array.from(new Set(mockActiveLinks
    .filter(link => filterState === 'All' || link.state === filterState)
    .map(link => link.city)
  )).sort();
  
  // Determine MPLS topology if product is MPLS
  const mplsTopology = productType === 'MPLS' 
    ? mockActiveLinks.find(link => link.productType === 'MPLS' && link.mplsTopology)?.mplsTopology 
    : null;
  const isHubAndSpoke = mplsTopology === 'Hub & Spoke';
  
  // Helper function to convert bandwidth to numeric value for comparison
  const getBandwidthValue = (bandwidth: string): number => {
    const match = bandwidth.match(/(\d+)\s*(Mbps|Gbps)/i);
    if (!match) return 0;
    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    return unit === 'gbps' ? value * 1000 : value;
  };
  
  // Filter links based on all criteria
  const filteredLinks = mockActiveLinks.filter(link => {
    // Search filter
    const matchesSearch = 
      link.linkId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.bandwidth.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Product type filter (from parent or dropdown)
    const matchesProduct = !productType || link.productType === productType;
    
    // Building type filter
    const matchesBuildingType = filterBuildingType === 'All' || link.addressType === filterBuildingType;
    
    // LM Type filter
    const matchesLMType = filterLMType === 'All' || link.lmType === filterLMType;
    
    // State filter
    const matchesState = filterState === 'All' || link.state === filterState;
    
    // City filter
    const matchesCity = filterCity === 'All' || link.city === filterCity;
    
    // Bandwidth range filter
    let matchesBandwidth = true;
    if (filterBandwidthRange !== 'All') {
      const bwValue = getBandwidthValue(link.bandwidth);
      switch (filterBandwidthRange) {
        case '0-50':
          matchesBandwidth = bwValue <= 50;
          break;
        case '51-100':
          matchesBandwidth = bwValue > 50 && bwValue <= 100;
          break;
        case '101-500':
          matchesBandwidth = bwValue > 100 && bwValue <= 500;
          break;
        case '501-1000':
          matchesBandwidth = bwValue > 500 && bwValue <= 1000;
          break;
        case '1000+':
          matchesBandwidth = bwValue > 1000;
          break;
      }
    }
    
    return matchesSearch && matchesProduct && matchesBuildingType && matchesLMType && 
           matchesState && matchesCity && matchesBandwidth;
  });
  
  // Check if any filters are active
  const hasActiveFilters = filterBuildingType !== 'All' || filterLMType !== 'All' || 
                          filterState !== 'All' || filterCity !== 'All' || 
                          filterBandwidthRange !== 'All';
  
  // Clear all filters
  const clearAllFilters = () => {
    setFilterBuildingType('All');
    setFilterLMType('All');
    setFilterState('All');
    setFilterCity('All');
    setFilterBandwidthRange('All');
    setSearchQuery('');
  };
  
  const handleToggleLink = (linkId: string) => {
    if (selectedLinkIds.includes(linkId)) {
      setSelectedLinkIds(selectedLinkIds.filter(id => id !== linkId));
    } else {
      if (selectedLinkIds.length >= maxSelection) {
        toast.error(`Maximum ${maxSelection} links can be selected`);
        return;
      }
      setSelectedLinkIds([...selectedLinkIds, linkId]);
    }
  };

  const handleProceed = () => {
    if (selectedLinkIds.length === 0) {
      toast.error('Please select at least one link');
      return;
    }
    
    const selectedLinksData = mockActiveLinks.filter(link => 
      selectedLinkIds.includes(link.linkId)
    );
    
    onProceed(selectedLinksData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl text-gray-900">
                  Select {productType || 'Network'} Links for Modification
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Select up to {maxSelection} active {productType || 'network'} links to modify
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium text-blue-600">{selectedLinkIds.length}</span> / {maxSelection} selected
              </div>
              <Button
                onClick={handleProceed}
                disabled={selectedLinkIds.length === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Proceed with Selected Links
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Search and Filter Controls */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by Link ID, Address, City, or Bandwidth..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center space-x-2 ${hasActiveFilters ? 'border-blue-500 text-blue-600' : ''}`}
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                  {hasActiveFilters && (
                    <Badge className="ml-2 bg-blue-600 text-white text-xs px-2 py-0.5">
                      {[filterBuildingType, filterLMType, filterState, filterCity, filterBandwidthRange].filter(f => f !== 'All').length}
                    </Badge>
                  )}
                </Button>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-gray-600"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Filter Panel */}
          {showFilters && (
            <Card className="border-blue-200 bg-blue-50/30">
              <CardContent className="p-4">
                <div className="grid grid-cols-5 gap-4">
                  {/* Building Type Filter */}
                  <div>
                    <Label className="text-xs text-gray-700 mb-2 block">Building Type</Label>
                    <Select value={filterBuildingType} onValueChange={setFilterBuildingType}>
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Types</SelectItem>
                        <SelectItem value="Sify DC">Sify DC</SelectItem>
                        <SelectItem value="Connected DC">Connected DC</SelectItem>
                        <SelectItem value="Connected Building">Connected Building</SelectItem>
                        <SelectItem value="Custom Location">Custom Location</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* LM Type Filter */}
                  <div>
                    <Label className="text-xs text-gray-700 mb-2 block">LM Type</Label>
                    <Select value={filterLMType} onValueChange={setFilterLMType}>
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Types</SelectItem>
                        <SelectItem value="Fiber">Fiber</SelectItem>
                        <SelectItem value="Wireless">Wireless</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* State Filter */}
                  <div>
                    <Label className="text-xs text-gray-700 mb-2 block">State</Label>
                    <Select value={filterState} onValueChange={(value) => {
                      setFilterState(value);
                      setFilterCity('All'); // Reset city when state changes
                    }}>
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All States</SelectItem>
                        {uniqueStates.map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* City Filter */}
                  <div>
                    <Label className="text-xs text-gray-700 mb-2 block">City</Label>
                    <Select value={filterCity} onValueChange={setFilterCity} disabled={filterState === 'All'}>
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Cities</SelectItem>
                        {uniqueCities.map(city => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Bandwidth Range Filter */}
                  <div>
                    <Label className="text-xs text-gray-700 mb-2 block">Bandwidth Range</Label>
                    <Select value={filterBandwidthRange} onValueChange={setFilterBandwidthRange}>
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Ranges</SelectItem>
                        <SelectItem value="0-50">0 - 50 Mbps</SelectItem>
                        <SelectItem value="51-100">51 - 100 Mbps</SelectItem>
                        <SelectItem value="101-500">101 - 500 Mbps</SelectItem>
                        <SelectItem value="501-1000">501 Mbps - 1 Gbps</SelectItem>
                        <SelectItem value="1000+">1 Gbps+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="text-xs text-gray-600 font-medium">Active Filters:</span>
                      {filterBuildingType !== 'All' && (
                        <Badge variant="outline" className="bg-white text-xs">
                          Building: {filterBuildingType}
                          <X 
                            className="w-3 h-3 ml-1 cursor-pointer" 
                            onClick={() => setFilterBuildingType('All')}
                          />
                        </Badge>
                      )}
                      {filterLMType !== 'All' && (
                        <Badge variant="outline" className="bg-white text-xs">
                          LM: {filterLMType}
                          <X 
                            className="w-3 h-3 ml-1 cursor-pointer" 
                            onClick={() => setFilterLMType('All')}
                          />
                        </Badge>
                      )}
                      {filterState !== 'All' && (
                        <Badge variant="outline" className="bg-white text-xs">
                          State: {filterState}
                          <X 
                            className="w-3 h-3 ml-1 cursor-pointer" 
                            onClick={() => setFilterState('All')}
                          />
                        </Badge>
                      )}
                      {filterCity !== 'All' && (
                        <Badge variant="outline" className="bg-white text-xs">
                          City: {filterCity}
                          <X 
                            className="w-3 h-3 ml-1 cursor-pointer" 
                            onClick={() => setFilterCity('All')}
                          />
                        </Badge>
                      )}
                      {filterBandwidthRange !== 'All' && (
                        <Badge variant="outline" className="bg-white text-xs">
                          Bandwidth: {filterBandwidthRange === '1000+' ? '1 Gbps+' : `${filterBandwidthRange} Mbps`}
                          <X 
                            className="w-3 h-3 ml-1 cursor-pointer" 
                            onClick={() => setFilterBandwidthRange('All')}
                          />
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Results Summary */}
          <div className="flex justify-between items-center px-1">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium text-gray-900">{filteredLinks.length}</span> of{' '}
              <span className="font-medium text-gray-900">{mockActiveLinks.length}</span> links
            </p>
          </div>
        </div>

        {/* MPLS Topology Info Banner */}
        {productType === 'MPLS' && mplsTopology && (
          <Card className="mb-6 border-purple-200 bg-purple-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Network className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">MPLS Network Topology</p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    <span className="font-medium text-purple-700">{mplsTopology}</span>
                    {isHubAndSpoke && <span className="text-gray-500 ml-2">• Select Hub and Spoke links</span>}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Links List */}
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedLinkIds.length === filteredLinks.length && filteredLinks.length > 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          const newSelections = filteredLinks.slice(0, maxSelection).map(link => link.linkId);
                          setSelectedLinkIds(newSelections);
                        } else {
                          setSelectedLinkIds([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Link ID</TableHead>
                  <TableHead>Link Type</TableHead>
                  {isHubAndSpoke && <TableHead>Node Type</TableHead>}
                  <TableHead>Address</TableHead>
                  <TableHead>Building Type</TableHead>
                  <TableHead>Bandwidth</TableHead>
                  <TableHead>LM Type</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead className="text-right">OTC</TableHead>
                  <TableHead className="text-right">ARC</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLinks.map((link) => {
                  const isSelected = selectedLinkIds.includes(link.linkId);
                  const isDisabled = !isSelected && selectedLinkIds.length >= maxSelection;
                  
                  return (
                    <TableRow 
                      key={link.id}
                      className={`cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-blue-50 hover:bg-blue-100' 
                          : isDisabled
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => !isDisabled && handleToggleLink(link.linkId)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isSelected}
                          disabled={isDisabled}
                          onCheckedChange={() => handleToggleLink(link.linkId)}
                        />
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">{link.linkId}</TableCell>
                      <TableCell className="text-sm text-gray-600">{link.linkType}</TableCell>
                      {isHubAndSpoke && <TableCell className="text-sm text-gray-600">{link.nodeType}</TableCell>}
                      <TableCell className="max-w-xs">
                        <div className="text-sm text-gray-900 truncate">{link.address}</div>
                        <div className="text-xs text-gray-500">{link.city}, {link.state}</div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{link.addressType}</TableCell>
                      <TableCell className="text-sm font-medium text-gray-900">{link.bandwidth}</TableCell>
                      <TableCell className="text-sm text-gray-600">{link.lmType}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(link.expiryDate).toLocaleDateString('en-GB')}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 text-right">{link.otc}</TableCell>
                      <TableCell className="text-sm text-gray-600 text-right">{link.arc}</TableCell>
                    </TableRow>
                  );
                })}

                {filteredLinks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={isHubAndSpoke ? 11 : 10} className="text-center py-12">
                      <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No links found matching your search criteria</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
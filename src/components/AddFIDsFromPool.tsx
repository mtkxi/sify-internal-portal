import React, { useState, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ArrowLeft, Plus, MapPin, Filter } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface FeasibilityItem {
  id: string;
  fid: string;
  opportunityId: string;
  type: string;
  serviceChangeType?: string; // For MDAC: "Address Change", "LM Change", "Bandwidth Change", "Add Secondary/Tertiary Link"
  location: string;
  fullAddress: string;
  company: string;
  connectionType: string;
  bandwidth: string;
  feasibilityStatus: string;
  orderStatus: string;
  expiresOn: string;
}

export function AddFIDsFromPool() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  
  // Get company from location state
  const { company, proposalId, networkProduct, opportunityId, isSecureSiteConnect } = location.state || {};
  
  console.log('=== AddFIDsFromPool Debug ===');
  console.log('company:', company);
  console.log('isSecureSiteConnect:', isSecureSiteConnect);
  
  const [selectedFIDs, setSelectedFIDs] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [serviceChangeFilter, setServiceChangeFilter] = useState<string>('all');
  
  // Reset filters when in SSC mode - SSC only works with 'New' type FIDs
  React.useEffect(() => {
    if (isSecureSiteConnect) {
      setTypeFilter('all');
      setServiceChangeFilter('all');
    }
  }, [isSecureSiteConnect]);
  
  // Mock feasibility pool data - filtered by company
  const mockFeasibilityPoolRaw: FeasibilityItem[] = [
    {
      id: '1',
      fid: 'FID-2025-010',
      opportunityId: 'OPP-2025-001',
      type: 'New',
      location: 'Pune, Maharashtra',
      fullAddress: 'Hinjewadi IT Park, Pune, Maharashtra 411057',
      company: company || 'TechCorp Solutions',
      connectionType: 'Fiber',
      bandwidth: '150 Mbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-04-15'
    },
    {
      id: '2',
      fid: 'FID-2025-011',
      opportunityId: 'OPP-2025-001',
      type: 'New',
      location: 'Hyderabad, Telangana',
      fullAddress: 'HITEC City, Hyderabad, Telangana 500081',
      company: company || 'TechCorp Solutions',
      connectionType: 'Wireless',
      bandwidth: '100 Mbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-04-20'
    },
    {
      id: '3',
      fid: 'FID-2025-012',
      opportunityId: 'OPP-2025-002',
      type: 'New',
      location: 'Chennai, Tamil Nadu',
      fullAddress: 'OMR Road, Chennai, Tamil Nadu 600096',
      company: company || 'TechCorp Solutions',
      connectionType: 'Fiber',
      bandwidth: '200 Mbps',
      feasibilityStatus: 'Checking Feasibility',
      orderStatus: '',
      expiresOn: '2025-04-25'
    },
    {
      id: '4',
      fid: 'FID-2025-013',
      opportunityId: 'OPP-2025-003',
      type: 'New',
      location: 'Bangalore, Karnataka',
      fullAddress: 'Whitefield, Bangalore, Karnataka 560066',
      company: company || 'TechCorp Solutions',
      connectionType: 'Wireless',
      bandwidth: '50 Mbps',
      feasibilityStatus: 'Not Feasible',
      orderStatus: '',
      expiresOn: '2025-04-30'
    },
    {
      id: '5',
      fid: 'FID-2025-014',
      opportunityId: 'OPP-2025-003',
      type: 'New',
      location: 'Kolkata, West Bengal',
      fullAddress: 'Salt Lake, Kolkata, West Bengal 700091',
      company: company || 'TechCorp Solutions',
      connectionType: 'Fiber',
      bandwidth: '100 Mbps',
      feasibilityStatus: 'Not Feasible',
      orderStatus: '',
      expiresOn: '2025-05-05'
    },
    // Additional New FIDs for TechCorp Solutions (for SSC)
    {
      id: '14',
      fid: 'FID-2025-023',
      opportunityId: 'OPP-2025-001',
      type: 'New',
      location: 'Thane, Maharashtra',
      fullAddress: 'Ghodbunder Road, Thane, Maharashtra 400607',
      company: company || 'TechCorp Solutions',
      connectionType: 'Fiber',
      bandwidth: '100 Mbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-06-01'
    },
    {
      id: '15',
      fid: 'FID-2025-024',
      opportunityId: 'OPP-2025-002',
      type: 'New',
      location: 'Noida, Uttar Pradesh',
      fullAddress: 'Sector 62, Noida, Uttar Pradesh 201301',
      company: company || 'TechCorp Solutions',
      connectionType: 'Wireless',
      bandwidth: '50 Mbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-06-05'
    },
    {
      id: '16',
      fid: 'FID-2025-025',
      opportunityId: 'OPP-2025-001',
      type: 'New',
      location: 'Mumbai, Maharashtra',
      fullAddress: 'Lower Parel, Mumbai, Maharashtra 400013',
      company: company || 'TechCorp Solutions',
      connectionType: 'Fiber',
      bandwidth: '200 Mbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-06-10'
    },
    {
      id: '17',
      fid: 'FID-2025-026',
      opportunityId: 'OPP-2025-003',
      type: 'New',
      location: 'Bangalore, Karnataka',
      fullAddress: 'Koramangala, Bangalore, Karnataka 560095',
      company: company || 'TechCorp Solutions',
      connectionType: 'Fiber',
      bandwidth: '500 Mbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-06-15'
    },
    {
      id: '18',
      fid: 'FID-2025-027',
      opportunityId: 'OPP-2025-002',
      type: 'New',
      location: 'Pune, Maharashtra',
      fullAddress: 'Kharadi, Pune, Maharashtra 411014',
      company: company || 'TechCorp Solutions',
      connectionType: 'Wireless',
      bandwidth: '100 Mbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-06-20'
    },
    {
      id: '19',
      fid: 'FID-2025-028',
      opportunityId: 'OPP-2025-001',
      type: 'New',
      location: 'Chennai, Tamil Nadu',
      fullAddress: 'Perungudi, Chennai, Tamil Nadu 600096',
      company: company || 'TechCorp Solutions',
      connectionType: 'Fiber',
      bandwidth: '1 Gbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-06-25'
    },
    // MDAC for TechCorp Solutions
    {
      id: '6',
      fid: 'FID-2025-015',
      opportunityId: 'OPP-2025-001',
      type: 'MDAC',
      serviceChangeType: 'Address Change',
      location: 'Mumbai, Maharashtra',
      fullAddress: 'BKC, Mumbai, Maharashtra 400051',
      company: 'TechCorp Solutions',
      connectionType: 'Fiber',
      bandwidth: '500 Mbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-05-10'
    },
    {
      id: '7',
      fid: 'FID-2025-016',
      opportunityId: 'OPP-2025-002',
      type: 'MDAC',
      serviceChangeType: 'LM Change',
      location: 'Delhi, NCR',
      fullAddress: 'Connaught Place, Delhi 110001',
      company: 'TechCorp Solutions',
      connectionType: 'Wireless',
      bandwidth: '250 Mbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-05-12'
    },
    {
      id: '8',
      fid: 'FID-2025-017',
      opportunityId: 'OPP-2025-003',
      type: 'MDAC',
      serviceChangeType: 'Bandwidth Change',
      location: 'Pune, Maharashtra',
      fullAddress: 'Viman Nagar, Pune, Maharashtra 411014',
      company: 'TechCorp Solutions',
      connectionType: 'Fiber',
      bandwidth: '300 Mbps',
      feasibilityStatus: 'Checking Feasibility',
      orderStatus: '',
      expiresOn: '2025-05-15'
    },
    {
      id: '13',
      fid: 'FID-2025-022',
      opportunityId: 'OPP-2025-001',
      type: 'MDAC',
      serviceChangeType: 'Add Secondary/Tertiary Link',
      location: 'Pune, Maharashtra',
      fullAddress: 'Baner, Pune, Maharashtra 411045',
      company: 'TechCorp Solutions',
      connectionType: 'Fiber',
      bandwidth: '1 Gbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-05-18'
    },
    // MDAC for Global Solutions Ltd
    {
      id: '9',
      fid: 'FID-2025-018',
      opportunityId: 'OPP-2025-004',
      type: 'MDAC',
      serviceChangeType: 'Add Secondary/Tertiary Link',
      location: 'Bangalore, Karnataka',
      fullAddress: 'Electronic City, Bangalore, Karnataka 560100',
      company: 'Global Solutions Ltd',
      connectionType: 'Fiber',
      bandwidth: '1 Gbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-05-18'
    },
    {
      id: '10',
      fid: 'FID-2025-019',
      opportunityId: 'OPP-2025-004',
      type: 'MDAC',
      serviceChangeType: 'Address Change',
      location: 'Mumbai, Maharashtra',
      fullAddress: 'Andheri East, Mumbai, Maharashtra 400069',
      company: 'Global Solutions Ltd',
      connectionType: 'Fiber',
      bandwidth: '750 Mbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-05-20'
    },
    // MDAC for FinTech Innovations
    {
      id: '11',
      fid: 'FID-2025-020',
      opportunityId: 'OPP-2025-005',
      type: 'MDAC',
      serviceChangeType: 'LM Change',
      location: 'Gurgaon, Haryana',
      fullAddress: 'Cyber City, Gurgaon, Haryana 122002',
      company: 'FinTech Innovations',
      connectionType: 'Fiber',
      bandwidth: '500 Mbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-05-22'
    },
    // MDAC for Enterprise Networks Inc
    {
      id: '12',
      fid: 'FID-2025-021',
      opportunityId: 'OPP-2025-006',
      type: 'MDAC',
      serviceChangeType: 'Bandwidth Change',
      location: 'Hyderabad, Telangana',
      fullAddress: 'Madhapur, Hyderabad, Telangana 500081',
      company: 'Enterprise Networks Inc',
      connectionType: 'Fiber',
      bandwidth: '2 Gbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-05-25'
    }
  ];

  // Filter to show only Feasible status (or all items for Secure Site Connect) and apply type/service change filters
  const filteredFeasibilityPool = useMemo(() => {
    let filtered = isSecureSiteConnect 
      ? mockFeasibilityPoolRaw.filter(item => 
          item.company === company && 
          item.type === 'New' && 
          item.feasibilityStatus === 'Feasible'
        ) // For SSC, show only New and Feasible FIDs
      : mockFeasibilityPoolRaw.filter(item => 
          item.feasibilityStatus === 'Feasible' && item.company === company
        ); // Filter by both feasibility status and company
    
    console.log('Filtered FIDs count:', filtered.length);
    console.log('Sample filtered items:', filtered.slice(0, 2));
    
    // Only apply type/service change filters when NOT in SSC mode
    if (!isSecureSiteConnect) {
      // Apply type filter
      if (typeFilter !== 'all') {
        filtered = filtered.filter(item => item.type === typeFilter);
      }
      
      // Apply service change type filter (only when MDAC is selected)
      if (typeFilter === 'MDAC' && serviceChangeFilter !== 'all') {
        filtered = filtered.filter(item => item.serviceChangeType === serviceChangeFilter);
      }
    }
    
    return filtered;
  }, [mockFeasibilityPoolRaw, company, isSecureSiteConnect, typeFilter, serviceChangeFilter]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFIDs(filteredFeasibilityPool.map(item => item.fid));
    } else {
      setSelectedFIDs([]);
    }
  };

  const handleSelectFID = (fid: string, checked: boolean) => {
    if (checked) {
      setSelectedFIDs([...selectedFIDs, fid]);
    } else {
      setSelectedFIDs(selectedFIDs.filter(id => id !== fid));
    }
  };

  const handleAddToProposal = () => {
    if (selectedFIDs.length === 0) {
      toast.error('Please select at least one FID');
      return;
    }
    
    toast.success(`${selectedFIDs.length} FID(s) added to proposal`);
    
    // Navigate back with selected FIDs
    navigate(-1, { 
      state: { 
        selectedFIDsFromPool: selectedFIDs,
        company,
        proposalId,
        networkProduct,
        opportunityId,
        isSecureSiteConnect
      }
    });
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
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-gray-900">
                  {isSecureSiteConnect ? 'Add Secure Site Connect FIDs' : 'Add FIDs from Feasibility Pool'}
                </h1>
                <p className="text-sm text-gray-500">
                  {company} • {isSecureSiteConnect ? 'Select FIDs for Secure Site Connect' : `Select FIDs to add to proposal ${proposalId || id}`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/new-dia-service', {
                  state: { company, returnTo: `/add-fids/${id}` }
                })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New
              </Button>
              <Button
                size="sm"
                className="bg-slate-800 hover:bg-slate-900"
                onClick={handleAddToProposal}
                disabled={selectedFIDs.length === 0}
              >
                Add to Proposal ({selectedFIDs.length})
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Feasibility Pool</CardTitle>
            <CardDescription>
              {filteredFeasibilityPool.length} FID(s) available • {selectedFIDs.length} selected
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters - Only show when NOT in SSC mode */}
            {!isSecureSiteConnect && (
            <div className="mb-4 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Filters:</span>
              </div>
              
              {/* Type Filter */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Type:</label>
                <select
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    // Reset service change filter when type changes
                    if (e.target.value !== 'MDAC') {
                      setServiceChangeFilter('all');
                    }
                  }}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="New">New</option>
                  <option value="MDAC">MDAC</option>
                </select>
              </div>
              
              {/* Service Change Type Filter - Only show when MDAC is selected */}
              {typeFilter === 'MDAC' && (
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Change Type:</label>
                  <select
                    value={serviceChangeFilter}
                    onChange={(e) => setServiceChangeFilter(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All</option>
                    <option value="Address Change">Address Change</option>
                    <option value="LM Change">LM Change</option>
                    <option value="Bandwidth Change">Bandwidth Change</option>
                    <option value="Add Secondary/Tertiary Link">Add Secondary/Tertiary Link</option>
                  </select>
                </div>
              )}
              
              {/* Active Filter Count */}
              {(typeFilter !== 'all' || serviceChangeFilter !== 'all') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setTypeFilter('all');
                    setServiceChangeFilter('all');
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear Filters
                </Button>
              )}
            </div>
            )}

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedFIDs.length === filteredFeasibilityPool.length && filteredFeasibilityPool.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>FID</TableHead>
                    <TableHead>Opportunity ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Connection Type</TableHead>
                    <TableHead>Bandwidth</TableHead>
                    {isSecureSiteConnect && <TableHead>Feasibility Status</TableHead>}
                    <TableHead>Expires On</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFeasibilityPool.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        No FIDs available in feasibility pool for {company}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredFeasibilityPool.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedFIDs.includes(item.fid)}
                            onCheckedChange={(checked) => handleSelectFID(item.fid, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>
                          <span className="text-blue-600">{item.fid}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-900">{item.opportunityId}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-900">{item.location}</p>
                              <p className="text-xs text-gray-500">{item.fullAddress}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-900">{item.connectionType}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-900">{item.bandwidth}</span>
                        </TableCell>
                        {isSecureSiteConnect && <TableCell>
                          <Badge
                            variant={
                              item.feasibilityStatus === 'Feasible' ? 'default' : 
                              item.feasibilityStatus === 'Not Feasible' ? 'destructive' : 
                              'secondary'
                            }
                            className={
                              item.feasibilityStatus === 'Feasible' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 
                              item.feasibilityStatus === 'Not Feasible' ? '' : 
                              'bg-amber-100 text-amber-800 hover:bg-amber-100'
                            }
                          >
                            {item.feasibilityStatus}
                          </Badge>
                        </TableCell>}
                        <TableCell>
                          <span className="text-sm text-gray-900">{item.expiresOn}</span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
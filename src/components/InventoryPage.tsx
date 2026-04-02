import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  ArrowLeft,
  Package,
  Server,
  Cloud,
  Network,
  Building,
  TrendingUp,
  Activity,
  IndianRupee,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

// Mock customer data
const customers = [
  { id: 'CUST-001', name: 'TechCorp Solutions', industry: 'Technology' },
  { id: 'CUST-002', name: 'Global Finance Ltd', industry: 'Finance' },
  { id: 'CUST-003', name: 'HealthCare Systems', industry: 'Healthcare' },
  { id: 'CUST-004', name: 'Retail Networks Inc', industry: 'Retail' },
  { id: 'CUST-005', name: 'Manufacturing Pro', industry: 'Manufacturing' },
];

// Mock inventory data
const mockInventoryData = {
  'CUST-001': {
    overview: {
      totalServices: 15,
      activeServices: 13,
      pendingActivation: 2,
      monthlySpend: 450000,
    },
    network: {
      expressConnect: [
        {
          linkId: 'LINK-EXPRESS-CONNECT-001',
          location: 'Mumbai Office, Maharashtra',
          bandwidth: '100 Mbps',
          lmType: 'Fiber',
          status: 'Active',
          expiryDate: '2025-01-15',
          plan: 'Standard',
        },
        {
          linkId: 'LINK-EXPRESS-CONNECT-002',
          location: 'Pune Branch, Maharashtra',
          bandwidth: '50 Mbps',
          lmType: 'Wireless',
          status: 'Active',
          expiryDate: '2025-02-20',
          plan: 'Standard',
        },
        {
          linkId: 'LINK-EXPRESS-CONNECT-003',
          location: 'Bangalore Office, Karnataka',
          bandwidth: '200 Mbps',
          lmType: 'Fiber',
          status: 'Pending Activation',
          expiryDate: '2026-03-01',
          plan: 'Premium',
        },
      ],
      siteConnect: [
        {
          linkId: 'LINK-SITE-CONNECT-001',
          location: 'Mumbai HQ, Maharashtra',
          bandwidth: '1 Gbps',
          lmType: 'Fiber',
          linkType: 'Primary',
          status: 'Active',
          expiryDate: '2025-03-10',
        },
        {
          linkId: 'LINK-SITE-CONNECT-002',
          location: 'Delhi Office, Delhi',
          bandwidth: '500 Mbps',
          lmType: 'Fiber',
          linkType: 'Secondary',
          status: 'Active',
          expiryDate: '2025-03-15',
        },
      ],
    },
    dcColo: [
      {
        rackId: 'RACK-001',
        location: 'Sify DC - Mumbai',
        rackType: 'Full Rack (42U)',
        power: '5 KW',
        status: 'Active',
        expiryDate: '2025-01-01',
      },
      {
        rackId: 'RACK-002',
        location: 'Sify DC - Bangalore',
        rackType: 'Half Rack (21U)',
        power: '3 KW',
        status: 'Active',
        expiryDate: '2025-02-01',
      },
    ],
    cloud: [
      {
        instanceId: 'CLOUD-001',
        serviceName: 'Production Server',
        instanceType: 'Virtual Machine',
        specs: '8 vCPU, 32GB RAM, 500GB SSD',
        status: 'Active',
        expiryDate: '2025-01-10',
      },
      {
        instanceId: 'CLOUD-002',
        serviceName: 'Development Environment',
        instanceType: 'Virtual Machine',
        specs: '4 vCPU, 16GB RAM, 250GB SSD',
        status: 'Active',
        expiryDate: '2025-02-15',
      },
    ],
  },
  'CUST-002': {
    overview: {
      totalServices: 8,
      activeServices: 8,
      pendingActivation: 0,
      monthlySpend: 320000,
    },
    network: {
      expressConnect: [
        {
          linkId: 'LINK-EXPRESS-CONNECT-101',
          location: 'Mumbai Branch, Maharashtra',
          bandwidth: '200 Mbps',
          lmType: 'Fiber',
          status: 'Active',
          expiryDate: '2025-01-20',
          plan: 'Premium',
        },
      ],
      siteConnect: [
        {
          linkId: 'LINK-SITE-CONNECT-101',
          location: 'Mumbai HQ, Maharashtra',
          bandwidth: '1 Gbps',
          lmType: 'Fiber',
          linkType: 'Primary',
          status: 'Active',
          expiryDate: '2025-02-01',
        },
      ],
    },
    dcColo: [
      {
        rackId: 'RACK-101',
        location: 'Sify DC - Mumbai',
        rackType: 'Full Rack (42U)',
        power: '10 KW',
        status: 'Active',
        expiryDate: '2025-01-15',
      },
    ],
    cloud: [],
  },
};

export function InventoryPage() {
  const navigate = useNavigate();
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [selectedDomain, setSelectedDomain] = useState<'network' | 'dcColo' | 'cloud'>('network');

  const customerData = selectedCustomer ? mockInventoryData[selectedCustomer as keyof typeof mockInventoryData] : null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case 'Pending Activation':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'Inactive':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-gray-900">Customer Inventory</h1>
                  <p className="text-sm text-gray-600">View and manage customer services</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        {/* Customer Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Customer</CardTitle>
            <CardDescription>Choose a customer to view their service inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-md">
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer..." />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{customer.name}</span>
                        <span className="text-xs text-gray-500 ml-4">({customer.id})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Customer Overview */}
        {customerData && (
          <>
            <Card className="mb-6 border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="text-purple-900">Service Overview</CardTitle>
                <CardDescription>Summary of all services for {customers.find(c => c.id === selectedCustomer)?.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">Total Services</p>
                      <Package className="w-4 h-4 text-purple-600" />
                    </div>
                    <p className="text-2xl text-gray-900">{customerData.overview.totalServices}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">Active Services</p>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-2xl text-gray-900">{customerData.overview.activeServices}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">Pending Activation</p>
                      <Clock className="w-4 h-4 text-yellow-600" />
                    </div>
                    <p className="text-2xl text-gray-900">{customerData.overview.pendingActivation}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">Monthly Spend</p>
                      <IndianRupee className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-2xl text-gray-900">₹{customerData.overview.monthlySpend.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Domain Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Product Domains</CardTitle>
                <CardDescription>Select a product domain to view services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <button
                    onClick={() => setSelectedDomain('network')}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedDomain === 'network'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedDomain === 'network' ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <Network className={`w-5 h-5 ${selectedDomain === 'network' ? 'text-blue-600' : 'text-gray-600'}`} />
                      </div>
                      <h3 className="text-gray-900 font-medium">Sify Network</h3>
                    </div>
                    <p className="text-sm text-gray-600">Express Connect, Site Connect, P2P connections</p>
                    <div className="mt-3 flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {(customerData.network.expressConnect?.length || 0) + (customerData.network.siteConnect?.length || 0)} Services
                      </Badge>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedDomain('dcColo')}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedDomain === 'dcColo'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedDomain === 'dcColo' ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <Server className={`w-5 h-5 ${selectedDomain === 'dcColo' ? 'text-green-600' : 'text-gray-600'}`} />
                      </div>
                      <h3 className="text-gray-900 font-medium">DC Colocation</h3>
                    </div>
                    <p className="text-sm text-gray-600">Rackspace, power, cooling</p>
                    <div className="mt-3 flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {customerData.dcColo?.length || 0} Services
                      </Badge>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedDomain('cloud')}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedDomain === 'cloud'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 bg-white hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedDomain === 'cloud' ? 'bg-purple-100' : 'bg-gray-100'
                      }`}>
                        <Cloud className={`w-5 h-5 ${selectedDomain === 'cloud' ? 'text-purple-600' : 'text-gray-600'}`} />
                      </div>
                      <h3 className="text-gray-900 font-medium">Sify Core Cloud</h3>
                    </div>
                    <p className="text-sm text-gray-600">VMs, storage, computing</p>
                    <div className="mt-3 flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {customerData.cloud?.length || 0} Services
                      </Badge>
                    </div>
                  </button>
                </div>

                {/* Network Services */}
                {selectedDomain === 'network' && (
                  <Tabs defaultValue="expressConnect" className="mt-6">
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                      <TabsTrigger value="expressConnect">Express Connect</TabsTrigger>
                      <TabsTrigger value="siteConnect">Site Connect</TabsTrigger>
                    </TabsList>

                    <TabsContent value="expressConnect" className="mt-4">
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50">
                              <TableHead>Link ID</TableHead>
                              <TableHead>Location</TableHead>
                              <TableHead>Bandwidth</TableHead>
                              <TableHead>LM Type</TableHead>
                              <TableHead>Plan</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Expiry Date</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {customerData.network.expressConnect?.map((link) => (
                              <TableRow key={link.linkId}>
                                <TableCell className="font-medium">{link.linkId}</TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                    <span className="text-sm">{link.location}</span>
                                  </div>
                                </TableCell>
                                <TableCell>{link.bandwidth}</TableCell>
                                <TableCell>
                                  <Badge variant="secondary">{link.lmType}</Badge>
                                </TableCell>
                                <TableCell>{link.plan}</TableCell>
                                <TableCell>{getStatusBadge(link.status)}</TableCell>
                                <TableCell>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {link.expiryDate}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>

                    <TabsContent value="siteConnect" className="mt-4">
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50">
                              <TableHead>Link ID</TableHead>
                              <TableHead>Location</TableHead>
                              <TableHead>Bandwidth</TableHead>
                              <TableHead>LM Type</TableHead>
                              <TableHead>Link Type</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Expiry Date</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {customerData.network.siteConnect?.map((link) => (
                              <TableRow key={link.linkId}>
                                <TableCell className="font-medium">{link.linkId}</TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                    <span className="text-sm">{link.location}</span>
                                  </div>
                                </TableCell>
                                <TableCell>{link.bandwidth}</TableCell>
                                <TableCell>
                                  <Badge variant="secondary">{link.lmType}</Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge className={link.linkType === 'Primary' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                                    {link.linkType}
                                  </Badge>
                                </TableCell>
                                <TableCell>{getStatusBadge(link.status)}</TableCell>
                                <TableCell>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {link.expiryDate}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>
                  </Tabs>
                )}

                {/* DC Colocation Services */}
                {selectedDomain === 'dcColo' && (
                  <div className="mt-6">
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead>Rack ID</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Rack Type</TableHead>
                            <TableHead>Power</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Expiry Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {customerData.dcColo?.map((rack) => (
                            <TableRow key={rack.rackId}>
                              <TableCell className="font-medium">{rack.rackId}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Building className="w-4 h-4 mr-2 text-gray-400" />
                                  <span className="text-sm">{rack.location}</span>
                                </div>
                              </TableCell>
                              <TableCell>{rack.rackType}</TableCell>
                              <TableCell>
                                <Badge variant="secondary">{rack.power}</Badge>
                              </TableCell>
                              <TableCell>{getStatusBadge(rack.status)}</TableCell>
                              <TableCell>
                                <div className="flex items-center text-sm text-gray-600">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  {rack.expiryDate}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {/* Cloud Services */}
                {selectedDomain === 'cloud' && (
                  <div className="mt-6">
                    {customerData.cloud && customerData.cloud.length > 0 ? (
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50">
                              <TableHead>Instance ID</TableHead>
                              <TableHead>Service Name</TableHead>
                              <TableHead>Instance Type</TableHead>
                              <TableHead>Specifications</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Expiry Date</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {customerData.cloud.map((instance) => (
                              <TableRow key={instance.instanceId}>
                                <TableCell className="font-medium">{instance.instanceId}</TableCell>
                                <TableCell>{instance.serviceName}</TableCell>
                                <TableCell>
                                  <Badge variant="secondary">{instance.instanceType}</Badge>
                                </TableCell>
                                <TableCell className="text-sm text-gray-600">{instance.specs}</TableCell>
                                <TableCell>{getStatusBadge(instance.status)}</TableCell>
                                <TableCell>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {instance.expiryDate}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <Cloud className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">No cloud services found for this customer</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Empty State */}
        {!selectedCustomer && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-gray-900 mb-2">Select a Customer</h3>
            <p className="text-gray-600">Choose a customer from the dropdown above to view their service inventory</p>
          </div>
        )}
      </div>
    </div>
  );
}
import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Textarea } from './ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from './ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { toast } from 'sonner@2.0.3';
import {
  ArrowLeft,
  FileText,
  MapPin,
  Building,
  Calendar,
  Users,
  IndianRupee,
  Download,
  Eye,
  Mail,
  Edit,
  XCircle,
  CheckCircle,
  AlertCircle,
  Settings,
  Package,
  Info,
  Clock,
  ChevronRight,
  MoreVertical,
  ThumbsDown
} from 'lucide-react';

// Interfaces
interface FIDItem {
  fid: string;
  location: string;
  fullAddress: string;
  connectionType: string;
  bandwidth: string;
  expiresOn: string;
  plan: string;
  vas: string[];
  linkId?: string;
  orderStatus?: string;
}

interface ProposalVersion {
  id: string;
  version: string;
  createdOn: string;
  totalArc: number;
  totalOtc: number;
  status: 'Awaiting Customer Acceptance' | 'Customer Rejected' | 'Generated' | 'Voided' | 'Customer Accepted';
  voidedBy?: string;
  voidedOn?: string;
  voidReason?: string;
}

interface OrderDetails {
  orderId: string;
  connectionType: string;
  proposalId: string;
  orderType: string;
  contractTerm: string;
  orderGeneratedOn: string;
  signedOn: string;
  fids: string[];
  accountName: string;
  customerId: string;
  otc: number;
  arc: number;
}

interface RelatedDocument {
  id: string;
  type: 'Order Document' | 'Proposal Document';
  filename: string;
  version: string;
  generatedOn: string;
  size: string;
}

export function ProposalDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [selectedVersion, setSelectedVersion] = useState<ProposalVersion | null>(null);
  const [isEditingContractTerm, setIsEditingContractTerm] = useState(false);
  const [contractTerm, setContractTerm] = useState('36 months');

  // Get data from location state
  const { proposalId, fids, company, networkProduct, opportunityId } = location.state || {};

  // Mock proposal data
  const proposalData = {
    proposalId: proposalId || 'PROP-2025-001',
    type: 'New',
    productType: networkProduct || 'DIA (Dedicated Internet Access)',
    totalFids: fids?.length || 3,
    createdOn: '2025-02-04',
    contractTerm: '36 months',
    opportunityId: opportunityId || 'OPP-2025-001',
    companyName: company || 'TechCorp Solutions',
    customerId: 'TC001',
    businessType: 'Private Limited',
    address: 'Tower A, Tech Park, Bandra Kurla Complex, Mumbai, Maharashtra 400051',
    panNumber: 'AAACT1234F',
    gstNumber: '27AAACT1234F1Z5',
    primaryContactName: 'Rajesh Kumar',
    primaryContactEmail: 'rajesh.kumar@techcorp.com',
    leadBuType: 'Direct Sales',
    opportunityStatus: 'Active',
    salesStage: 'Qualification'
  };

  // State for selected FIDs
  const [selectedFids, setSelectedFids] = useState<string[]>([]);

  // Mock FID data
  const mockFids: FIDItem[] = [
    {
      fid: 'FID-2025-001',
      location: 'Mumbai, Maharashtra',
      fullAddress: 'Bandra Kurla Complex, Mumbai, Maharashtra 400051',
      connectionType: 'Wireless',
      bandwidth: '100 Mbps',
      expiresOn: '2025-03-15',
      plan: '',
      vas: ['Static IP', 'Managed Router'],
      linkId: '',
      orderStatus: 'Pending Configuration'
    },
    {
      fid: 'FID-2025-002',
      location: 'Andheri East, Maharashtra',
      fullAddress: 'Andheri East, Mumbai, Maharashtra 400069',
      connectionType: 'Fiber',
      bandwidth: '200 Mbps',
      expiresOn: '2025-03-15',
      plan: '',
      vas: ['DDoS Protection', 'Priority Support'],
      linkId: '',
      orderStatus: 'Configured'
    },
    {
      fid: 'FID-2025-003',
      location: 'Navi Mumbai, Maharashtra',
      fullAddress: 'Vashi, Navi Mumbai, Maharashtra 400703',
      connectionType: 'Other ISP - Airtel',
      bandwidth: '150 Mbps',
      expiresOn: '2025-03-15',
      plan: '',
      vas: ['Firewall', 'Load Balancer'],
      linkId: '',
      orderStatus: 'Yet to Configure'
    }
  ];

  // Mock proposal versions
  const mockVersions: ProposalVersion[] = [
    {
      id: '1',
      version: 'v1.3',
      createdOn: '2025-02-06',
      totalArc: 78000,
      totalOtc: 155000,
      status: 'Customer Accepted'
    },
    {
      id: '2',
      version: 'v1.2',
      createdOn: '2025-02-05',
      totalArc: 78000,
      totalOtc: 155000,
      status: 'Awaiting Customer Acceptance'
    },
    {
      id: '3',
      version: 'v1.0',
      createdOn: '2025-02-04',
      totalArc: 75000,
      totalOtc: 150000,
      status: 'Generated'
    },
    {
      id: '4',
      version: 'v1.1',
      createdOn: '2025-02-03',
      totalArc: 80000,
      totalOtc: 160000,
      status: 'Customer Rejected'
    },
    {
      id: '5',
      version: 'v0.9',
      createdOn: '2025-02-01',
      totalArc: 85000,
      totalOtc: 170000,
      status: 'Voided',
      voidedBy: 'John Doe',
      voidedOn: '2025-02-02',
      voidReason: 'Customer requested significant changes to pricing structure'
    }
  ];

  // Mock order details
  const mockOrderDetails: OrderDetails = {
    orderId: 'ORD-2025-001',
    connectionType: 'DIA',
    proposalId: proposalData.proposalId,
    orderType: 'New Connection',
    contractTerm: '36 months',
    orderGeneratedOn: '2025-02-10',
    signedOn: '2025-02-08',
    fids: ['FID-2025-001', 'FID-2025-002', 'FID-2025-003'],
    accountName: proposalData.companyName,
    customerId: proposalData.customerId,
    otc: 155000,
    arc: 78000
  };

  // Mock related documents
  const mockDocuments: RelatedDocument[] = [
    {
      id: '1',
      type: 'Order Document',
      filename: 'ORD-2025-001_Final.pdf',
      version: 'v1.0',
      generatedOn: '2025-02-10',
      size: '3.1 MB'
    },
    {
      id: '2',
      type: 'Proposal Document',
      filename: 'PROP-2025-001_v1.2.pdf',
      version: 'v1.2',
      generatedOn: '2025-02-05',
      size: '2.5 MB'
    },
    {
      id: '3',
      type: 'Proposal Document',
      filename: 'PROP-2025-001_v1.0.pdf',
      version: 'v1.0',
      generatedOn: '2025-02-04',
      size: '2.4 MB'
    },
    {
      id: '4',
      type: 'Proposal Document',
      filename: 'PROP-2025-001_v1.1.pdf',
      version: 'v1.1',
      generatedOn: '2025-02-03',
      size: '2.3 MB'
    }
  ];

  // Configuration status - determines which nudge card to show
  const configurationStatus = 'pending'; // 'pending', 'completed', 'awaiting_acceptance', 'accepted'

  const handleCancelProposal = (version: ProposalVersion) => {
    setSelectedVersion(version);
    setCancelDialogOpen(true);
  };

  const confirmCancelProposal = () => {
    if (cancelReason.trim()) {
      toast.success(`Proposal ${selectedVersion?.version} has been cancelled`);
      setCancelDialogOpen(false);
      setCancelReason('');
      setSelectedVersion(null);
    } else {
      toast.error('Please provide a reason for cancellation');
    }
  };

  const getStatusBadge = (status: ProposalVersion['status']) => {
    const statusConfig = {
      'Generated': { variant: 'default' as const, className: 'bg-blue-100 text-blue-700 hover:bg-blue-100' },
      'Awaiting Customer Acceptance': { variant: 'default' as const, className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' },
      'Customer Accepted': { variant: 'default' as const, className: 'bg-green-100 text-green-700 hover:bg-green-100' },
      'Customer Rejected': { variant: 'destructive' as const, className: '' },
      'Voided': { variant: 'secondary' as const, className: 'bg-gray-200 text-gray-700 hover:bg-gray-200' }
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant} className={config.className}>{status}</Badge>;
  };

  const renderNudgeCard = () => {
    if (configurationStatus === 'pending') {
      return (
        <Card className="border-l-4 border-l-orange-500 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Settings className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-1">Configuration Required</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Configure pricing and technical details for all FIDs before generating the proposal document.
                  </p>
                  <Button 
                    size="sm" 
                    className="bg-orange-600 hover:bg-orange-700"
                    onClick={() => navigate('/configure-proposal', {
                      state: {
                        proposalId: proposalData.proposalId,
                        company: proposalData.companyName,
                        networkProduct: proposalData.productType,
                        opportunityId: proposalData.opportunityId
                      }
                    })}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Configure Now
                  </Button>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    } else if (configurationStatus === 'accepted') {
      return (
        <Card className="border-l-4 border-l-green-500 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-1">Proposal Accepted - Order Setup Required</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Customer has accepted the proposal. Proceed with order setup and documentation.
                  </p>
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => navigate('/add-billing-address')}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Setup Order
                  </Button>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }
    return null;
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
                onClick={() => navigate('/feasibility-management', {
                  state: { company, networkProduct }
                })}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-gray-900">{proposalData.proposalId}</h1>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {proposalData.type}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  {proposalData.companyName} • {proposalData.productType}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Tabs */}
          <div className="col-span-3">
            <Card>
              <CardContent className="p-0">
                <nav className="space-y-1 p-2">
                  {[
                    { id: 'overview', label: 'Overview', icon: FileText },
                    { id: 'fids', label: 'FIDs', icon: Package },
                    { id: 'proposal-version', label: 'Proposal Version', icon: Clock },
                    { id: 'order-details', label: 'Order Details', icon: CheckCircle }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          if (tab.id === 'order-details') {
                            navigate(`/requirement-details/${proposalData.opportunityId}`, {
                              state: { activeTab: 'order-details' }
                            });
                          } else {
                            setActiveTab(tab.id);
                          }
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{tab.label}</span>
                        {activeTab === tab.id && (
                          <ChevronRight className="w-4 h-4 ml-auto" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Content */}
          <div className="col-span-9 space-y-6">
            {/* Nudge Card */}
            {renderNudgeCard()}

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Requirement Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Proposal Overview</CardTitle>
                    <CardDescription>Key details about this proposal</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-sm text-gray-700 mb-4">Requirement Details</h3>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                          <Label className="text-gray-600">Proposal ID</Label>
                          <p className="text-gray-900 mt-1">{proposalData.proposalId}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Type</Label>
                          <p className="text-gray-900 mt-1">{proposalData.type}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Product Type</Label>
                          <p className="text-gray-900 mt-1">{proposalData.productType}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Total FID</Label>
                          <p className="text-gray-900 mt-1">{proposalData.totalFids}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Created On</Label>
                          <p className="text-gray-900 mt-1">{proposalData.createdOn}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Contract Term</Label>
                          {isEditingContractTerm ? (
                            <div className="flex items-center gap-2 mt-1">
                              <Input 
                                value={contractTerm}
                                onChange={(e) => setContractTerm(e.target.value)}
                                className="w-32"
                              />
                              <Button 
                                size="sm" 
                                onClick={() => {
                                  setIsEditingContractTerm(false);
                                  toast.success('Contract term updated');
                                }}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-gray-900">{contractTerm}</p>
                              <button 
                                onClick={() => setIsEditingContractTerm(true)}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                <Edit className="w-4 h-4 text-gray-500" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-sm text-gray-700 mb-4">Customer Details</h3>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                          <Label className="text-gray-600">Opportunity ID</Label>
                          <p className="text-gray-900 mt-1">{proposalData.opportunityId}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Company Name</Label>
                          <p className="text-gray-900 mt-1">{proposalData.companyName}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Customer ID</Label>
                          <p className="text-gray-900 mt-1">{proposalData.customerId}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Business Type</Label>
                          <p className="text-gray-900 mt-1">{proposalData.businessType}</p>
                        </div>
                        <div className="col-span-2">
                          <Label className="text-gray-600">Address</Label>
                          <p className="text-gray-900 mt-1">{proposalData.address}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">PAN Number</Label>
                          <p className="text-gray-900 mt-1">{proposalData.panNumber}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">GST Number</Label>
                          <p className="text-gray-900 mt-1">{proposalData.gstNumber}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Primary Contact Name</Label>
                          <p className="text-gray-900 mt-1">{proposalData.primaryContactName}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Primary Contact Email</Label>
                          <p className="text-gray-900 mt-1">{proposalData.primaryContactEmail}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Lead BU Type</Label>
                          <p className="text-gray-900 mt-1">{proposalData.leadBuType}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Opportunity Status</Label>
                          <p className="text-gray-900 mt-1">{proposalData.opportunityStatus}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Sales Stage</Label>
                          <p className="text-gray-900 mt-1">{proposalData.salesStage}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* FIDs Tab */}
            {activeTab === 'fids' && (
              <Card>
                <CardHeader>
                  <CardTitle>FID Details</CardTitle>
                  <CardDescription>
                    {mockFids.length} FIDs in this proposal • {selectedFids.length} selected
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="w-12">
                            <input
                              type="checkbox"
                              checked={selectedFids.length === mockFids.length}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedFids(mockFids.map(f => f.fid));
                                } else {
                                  setSelectedFids([]);
                                }
                              }}
                              className="w-4 h-4 rounded border-gray-300"
                            />
                          </TableHead>
                          <TableHead>FID</TableHead>
                          {proposalData.productType.includes('MPLS') && (
                            <TableHead>Type</TableHead>
                          )}
                          <TableHead>Location</TableHead>
                          <TableHead>Connection Type / Bandwidth</TableHead>
                          <TableHead>Expires On</TableHead>
                          <TableHead>Plan</TableHead>
                          <TableHead>VAS</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockFids.map((fid, index) => (
                          <TableRow key={fid.fid}>
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={selectedFids.includes(fid.fid)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedFids([...selectedFids, fid.fid]);
                                  } else {
                                    setSelectedFids(selectedFids.filter(id => id !== fid.fid));
                                  }
                                }}
                                className="w-4 h-4 rounded border-gray-300"
                              />
                            </TableCell>
                            <TableCell>
                              <span className="text-blue-600">{fid.fid}</span>
                            </TableCell>
                            {proposalData.productType.includes('MPLS') && (
                              <TableCell>
                                <Badge 
                                  variant="outline" 
                                  className={index === 0 
                                    ? "bg-purple-50 text-purple-700 border-purple-200" 
                                    : "bg-green-50 text-green-700 border-green-200"
                                  }
                                >
                                  {index === 0 ? 'HUB' : 'SPOKE'}
                                </Badge>
                              </TableCell>
                            )}
                            <TableCell>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-center cursor-pointer">
                                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                      <span className="text-sm text-gray-900">{fid.location}</span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">{fid.fullAddress}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-gray-900">
                                {fid.connectionType} | {fid.bandwidth}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-gray-900">{fid.expiresOn}</span>
                            </TableCell>
                            <TableCell>
                              {fid.plan ? (
                                <Badge variant="outline">{fid.plan}</Badge>
                              ) : (
                                <span className="text-xs text-gray-400">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {fid.vas.map((vas, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {vas}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={
                                  fid.orderStatus === 'Configured'
                                    ? 'bg-green-50 text-green-700 border-green-200'
                                    : fid.orderStatus === 'Pending Configuration'
                                    ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                    : 'bg-orange-50 text-orange-700 border-orange-200'
                                }
                              >
                                {fid.orderStatus || 'Yet to Configure'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Proposal Version Tab */}
            {activeTab === 'proposal-version' && (
              <Card>
                <CardHeader>
                  <CardTitle>Proposal Versions</CardTitle>
                  <CardDescription>Version history and status of proposals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead>Version</TableHead>
                          <TableHead>Created On</TableHead>
                          <TableHead>Total OTC</TableHead>
                          <TableHead>Total ARC</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockVersions.map((version) => (
                          <TableRow key={version.id}>
                            <TableCell>
                              <span className="text-blue-600">{version.version}</span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-gray-900">{version.createdOn}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <IndianRupee className="w-3 h-3 mr-1 text-gray-500" />
                                <span className="text-sm text-gray-900">{version.totalOtc.toLocaleString()}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <IndianRupee className="w-3 h-3 mr-1 text-gray-500" />
                                <span className="text-sm text-gray-900">{version.totalArc.toLocaleString()}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {getStatusBadge(version.status)}
                                {version.status === 'Voided' && version.voidedBy && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <Info className="w-4 h-4 text-gray-400" />
                                      </TooltipTrigger>
                                      <TooltipContent className="max-w-xs">
                                        <div className="space-y-1">
                                          <p className="text-xs"><strong>Voided By:</strong> {version.voidedBy}</p>
                                          <p className="text-xs"><strong>When:</strong> {version.voidedOn}</p>
                                          <p className="text-xs"><strong>Reason:</strong> {version.voidReason}</p>
                                        </div>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="sm" variant="ghost">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                  {version.status === 'Generated' && (
                                    <>
                                      <DropdownMenuItem onClick={() => toast.success('Moving to order...')}>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Move to Order
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                    </>
                                  )}
                                  {version.status === 'Awaiting Customer Acceptance' && (
                                    <>
                                      <DropdownMenuItem onClick={() => navigate('/add-billing-address', {
                                        state: {
                                          proposalId: proposalData.proposalId,
                                          company: proposalData.companyName,
                                          customerId: proposalData.customerId,
                                          opportunityId: proposalData.opportunityId
                                        }
                                      })}>
                                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                                        Move to Order
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => toast.info('Marking as rejected...')}>
                                        <ThumbsDown className="w-4 h-4 mr-2 text-red-600" />
                                        Mark as Rejected
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                    </>
                                  )}
                                  {version.status === 'Customer Accepted' && (
                                    <>
                                      <DropdownMenuItem onClick={() => navigate('/add-billing-address', {
                                        state: {
                                          proposalId: proposalData.proposalId,
                                          company: proposalData.companyName,
                                          customerId: proposalData.customerId,
                                          opportunityId: proposalData.opportunityId
                                        }
                                      })}>
                                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                                        Move to Order
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => toast.info('Marking as rejected...')}>
                                        <ThumbsDown className="w-4 h-4 mr-2 text-red-600" />
                                        Mark as Rejected
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                    </>
                                  )}
                                  <DropdownMenuItem onClick={() => toast.info('Opening preview...')}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Proposal
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => toast.success('Download started')}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => toast.success('Email sent')}>
                                    <Mail className="w-4 h-4 mr-2" />
                                    Send via Email
                                  </DropdownMenuItem>
                                  {version.status !== 'Voided' && (
                                    <>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem onClick={() => toast.info('Opening editor...')}>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Version
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleCancelProposal(version)}
                                        className="text-red-600 focus:text-red-600"
                                      >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Void Proposal
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Order Details Tab */}
            {activeTab === 'order-details' && (
              <div className="space-y-6">
                {mockOrderDetails ? (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                        <CardDescription>Complete order information</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                          <div>
                            <Label className="text-gray-600">Order ID</Label>
                            <p className="text-gray-900 mt-1">{mockOrderDetails.orderId}</p>
                          </div>
                          <div>
                            <Label className="text-gray-600">Connection Type</Label>
                            <p className="text-gray-900 mt-1">{mockOrderDetails.connectionType}</p>
                          </div>
                          <div>
                            <Label className="text-gray-600">Proposal ID</Label>
                            <p className="text-gray-900 mt-1">{mockOrderDetails.proposalId}</p>
                          </div>
                          <div>
                            <Label className="text-gray-600">Order Type</Label>
                            <p className="text-gray-900 mt-1">{mockOrderDetails.orderType}</p>
                          </div>
                          <div>
                            <Label className="text-gray-600">Contract Term</Label>
                            <p className="text-gray-900 mt-1">{mockOrderDetails.contractTerm}</p>
                          </div>
                          <div>
                            <Label className="text-gray-600">Order Generated On</Label>
                            <p className="text-gray-900 mt-1">{mockOrderDetails.orderGeneratedOn}</p>
                          </div>
                          <div>
                            <Label className="text-gray-600">Signed On</Label>
                            <p className="text-gray-900 mt-1">{mockOrderDetails.signedOn}</p>
                          </div>
                          <div>
                            <Label className="text-gray-600">Account Name</Label>
                            <p className="text-gray-900 mt-1">{mockOrderDetails.accountName}</p>
                          </div>
                          <div>
                            <Label className="text-gray-600">Customer ID</Label>
                            <p className="text-gray-900 mt-1">{mockOrderDetails.customerId}</p>
                          </div>
                          <div>
                            <Label className="text-gray-600">FIDs</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {mockOrderDetails.fids.map((fid, index) => (
                                <Badge key={index} variant="secondary">
                                  {fid}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="border-t pt-6">
                          <h3 className="text-sm text-gray-700 mb-4">Charges</h3>
                          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                            <div>
                              <Label className="text-gray-600">One-Time Charges (OTC)</Label>
                              <div className="flex items-center mt-1">
                                <IndianRupee className="w-4 h-4 mr-1 text-gray-500" />
                                <span className="text-gray-900">{mockOrderDetails.otc.toLocaleString()}</span>
                              </div>
                            </div>
                            <div>
                              <Label className="text-gray-600">Annual Recurring Charges (ARC)</Label>
                              <div className="flex items-center mt-1">
                                <IndianRupee className="w-4 h-4 mr-1 text-gray-500" />
                                <span className="text-gray-900">{mockOrderDetails.arc.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Related Documents</CardTitle>
                        <CardDescription>Proposal and order documents</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="border rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-gray-50">
                                <TableHead>Type</TableHead>
                                <TableHead>Filename</TableHead>
                                <TableHead>Version</TableHead>
                                <TableHead>Generated On</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {mockDocuments.map((doc) => (
                                <TableRow key={doc.id}>
                                  <TableCell>
                                    <Badge variant="outline">{doc.type}</Badge>
                                  </TableCell>
                                  <TableCell>
                                    <span className="text-sm text-gray-900">{doc.filename}</span>
                                  </TableCell>
                                  <TableCell>
                                    <span className="text-sm text-gray-700">{doc.version}</span>
                                  </TableCell>
                                  <TableCell>
                                    <span className="text-sm text-gray-700">{doc.generatedOn}</span>
                                  </TableCell>
                                  <TableCell>
                                    <span className="text-sm text-gray-700">{doc.size}</span>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center space-x-2">
                                      <Button size="sm" variant="ghost">
                                        <Eye className="w-4 h-4" />
                                      </Button>
                                      <Button size="sm" variant="ghost">
                                        <Download className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card>
                    <CardContent className="py-16">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-gray-900 mb-2">No Order Created Yet</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          An order will be created once the proposal is accepted by the customer.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Proposal Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Cancel Proposal {selectedVersion?.version}</DialogTitle>
            <DialogDescription>
              Review the proposal details before cancelling. This action will void the proposal.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600 text-xs">Version</Label>
                  <p className="text-gray-900">{selectedVersion?.version}</p>
                </div>
                <div>
                  <Label className="text-gray-600 text-xs">Created On</Label>
                  <p className="text-gray-900">{selectedVersion?.createdOn}</p>
                </div>
                <div>
                  <Label className="text-gray-600 text-xs">Total ARC</Label>
                  <div className="flex items-center">
                    <IndianRupee className="w-3 h-3 mr-1 text-gray-500" />
                    <span className="text-gray-900">{selectedVersion?.totalArc.toLocaleString()}/mo</span>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-600 text-xs">Total OTC</Label>
                  <div className="flex items-center">
                    <IndianRupee className="w-3 h-3 mr-1 text-gray-500" />
                    <span className="text-gray-900">{selectedVersion?.totalOtc.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cancel-reason">
                Reason for Cancellation <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="cancel-reason"
                placeholder="Please provide a detailed reason for cancelling this proposal..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Keep Proposal
            </Button>
            <Button variant="destructive" onClick={confirmCancelProposal}>
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import {
  ArrowLeft,
  Edit,
  Eye,
  FileText,
  Upload,
  Download,
  Settings,
  IndianRupee,
  MapPin,
  User,
  Building,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Package,
  FileCheck,
  Users,
  Mail,
  Phone,
  History,
  Plus,
  ChevronDown,
  ChevronRight,
  GitBranch,
  Activity,
  ClipboardList,
  Briefcase
} from 'lucide-react';

// Mock requirements data - same as in Dashboard.tsx
const mockRequirements = [
  {
    id: "CL000001",
    customerName: "Tech Corp India",
    customerId: "TC00001",
    version: "v1.2",
    versionHistory: [
      { 
        version: "v1.2", 
        date: "2024-12-28", 
        time: "14:30", 
        changes: "Updated technical specifications", 
        status: "Draft", 
        author: "John Doe",
        proposalVersions: [
          { version: "P1.2.1", date: "2024-12-28", time: "15:45", changes: "Updated proposal with new technical specs", status: "Draft", author: "John Doe" },
          { version: "P1.2.0", date: "2024-12-28", time: "15:00", changes: "Initial proposal for v1.2 requirements", status: "Draft", author: "John Doe" }
        ]
      },
      { 
        version: "v1.1", 
        date: "2024-12-20", 
        time: "09:15", 
        changes: "Added compliance requirements", 
        status: "Draft", 
        author: "John Doe",
        proposalVersions: [
          { version: "P1.1.0", date: "2024-12-20", time: "11:30", changes: "Proposal with compliance requirements", status: "Draft", author: "John Doe" }
        ]
      },
      { 
        version: "v1.0", 
        date: "2024-12-15", 
        time: "16:45", 
        changes: "Initial requirement", 
        status: "Draft", 
        author: "John Doe",
        proposalVersions: [
          { version: "P1.0.0", date: "2024-12-15", time: "17:30", changes: "Initial proposal draft", status: "Draft", author: "John Doe" }
        ]
      }
    ],
    addedDate: "2024-12-28",
    createdDate: "2024-12-15",
    status: "Draft",
    opportunityId: "OPP000001",
    opportunityStatus: "Qualified Lead",
    assignedBy: "John Doe",
    location: "Mumbai",
    contractTerm: "3 Years",
    margin: 28.5,
    revenue: 12500000,
    title: "Enterprise Cloud Migration",
    priority: "High",
    probability: 75,
    stage: "Proposal"
  },
  {
    id: "CL000005",
    customerName: "Digital Solutions Ltd",
    customerId: "DS002",
    version: "v1.2",
    versionHistory: [
      { 
        version: "v1.2", 
        date: "2024-12-28", 
        time: "10:20", 
        changes: "Revised network architecture", 
        status: "In Progress", 
        author: "John Doe",
        proposalVersions: [
          { version: "P1.2.1", date: "2024-12-28", time: "16:15", changes: "Updated network design proposal", status: "In Progress", author: "John Doe" },
          { version: "P1.2.0", date: "2024-12-28", time: "11:00", changes: "Initial proposal for revised architecture", status: "Draft", author: "John Doe" }
        ]
      },
      { 
        version: "v1.1", 
        date: "2024-12-23", 
        time: "14:45", 
        changes: "Added security requirements", 
        status: "In Progress", 
        author: "John Doe",
        proposalVersions: [
          { version: "P1.1.0", date: "2024-12-24", time: "13:20", changes: "Initial network proposal", status: "Draft", author: "John Doe" }
        ]
      },
      { 
        version: "v1.0", 
        date: "2024-12-20", 
        time: "08:30", 
        changes: "Initial requirement", 
        status: "Draft", 
        author: "John Doe",
        proposalVersions: []
      }
    ],
    addedDate: "2024-12-28",
    createdDate: "2024-12-20",
    status: "In Progress",
    opportunityId: "OPP000002",
    opportunityStatus: "Captured SOW",
    assignedBy: "John Doe",
    location: "Mumbai",
    contractTerm: "3 Years",
    margin: 28.5,
    revenue: 4500000,
    title: "Network Infrastructure Upgrade",
    priority: "Medium",
    probability: 60,
    stage: "Qualification"
  },
  {
    id: "CL000002",
    customerName: "Cloud Innovations Pvt",
    customerId: "CI003",
    version: "v2.0",
    versionHistory: [
      { 
        version: "v2.0", 
        date: "2024-12-27", 
        time: "11:45", 
        changes: "Major feature enhancement", 
        status: "Proposal Accepted", 
        author: "Sarah Wilson",
        proposalVersions: [
          { version: "P2.0.1", date: "2024-12-27", time: "17:30", changes: "Final proposal with accepted terms", status: "Proposal Accepted", author: "Sarah Wilson" },
          { version: "P2.0.0", date: "2024-12-27", time: "13:15", changes: "Enhanced proposal for v2.0", status: "Awaiting Acceptance", author: "Sarah Wilson" }
        ]
      },
      { 
        version: "v1.3", 
        date: "2024-12-18", 
        time: "15:30", 
        changes: "Performance optimization", 
        status: "Awaiting Acceptance", 
        author: "Sarah Wilson",
        proposalVersions: [
          { version: "P1.3.0", date: "2024-12-25", time: "12:45", changes: "Comprehensive solution proposal", status: "Awaiting Acceptance", author: "Sarah Wilson" }
        ]
      },
      { 
        version: "v1.2", 
        date: "2024-12-12", 
        time: "09:00", 
        changes: "Security updates", 
        status: "Solutioning", 
        author: "Sarah Wilson",
        proposalVersions: [
          { version: "P1.2.0", date: "2024-12-20", time: "10:15", changes: "Revised pricing structure", status: "Pricing Rejected", author: "Sarah Wilson" }
        ]
      },
      { 
        version: "v1.0", 
        date: "2024-12-10", 
        time: "14:15", 
        changes: "Initial requirement", 
        status: "Draft", 
        author: "Sarah Wilson",
        proposalVersions: [
          { version: "P1.0.0", date: "2024-12-15", time: "16:00", changes: "Initial proposal draft", status: "Draft", author: "Sarah Wilson" }
        ]
      }
    ],
    addedDate: "2024-12-27",
    createdDate: "2024-12-10",
    status: "Proposal Accepted",
    opportunityId: "OPP000003",
    opportunityStatus: "PO In Hand",
    assignedBy: "Sarah Wilson",
    location: "Bangalore",
    contractTerm: "5 Years",
    margin: 22.3,
    revenue: 8900000,
    title: "Digital Transformation Suite",
    priority: "High",
    probability: 95,
    stage: "Negotiation"
  },
  {
    id: "CL000003",
    customerName: "StartUp Dynamics",
    customerId: "SD004",
    version: "v1.0",
    versionHistory: [
      { 
        version: "v1.0", 
        date: "2024-12-18", 
        time: "13:20", 
        changes: "Initial requirement", 
        status: "Solutioning", 
        author: "Mike Johnson",
        proposalVersions: [
          { version: "P1.0.0", date: "2024-12-19", time: "15:45", changes: "Serverless architecture proposal", status: "Solutioning", author: "Mike Johnson" }
        ]
      }
    ],
    addedDate: "2024-12-26",
    createdDate: "2024-12-18",
    status: "Solutioning",
    opportunityId: "OPP000004",
    opportunityStatus: "Qualified Lead",
    assignedBy: "Mike Johnson",
    location: "Delhi",
    contractTerm: "2 Years",
    margin: 15.8,
    revenue: 5600000,
    title: "Serverless Application Platform",
    priority: "Medium",
    probability: 50,
    stage: "Qualification"
  },
  {
    id: "CL000043",
    customerName: "Global Enterprises Ltd",
    customerId: "GE005",
    version: "v1.2",
    versionHistory: [
      { 
        version: "v1.2", 
        date: "2024-12-28", 
        time: "12:00", 
        changes: "Updated implementation timeline", 
        status: "Awaiting Acceptance", 
        author: "John Doe",
        proposalVersions: [
          { version: "P1.2.0", date: "2024-12-28", time: "14:20", changes: "Multi-cloud proposal with timeline updates", status: "Awaiting Acceptance", author: "John Doe" }
        ]
      },
      { 
        version: "v1.1", 
        date: "2024-12-18", 
        time: "14:30", 
        changes: "Added additional cloud providers", 
        status: "Solutioning", 
        author: "John Doe",
        proposalVersions: [
          { version: "P1.1.0", date: "2024-12-22", time: "16:10", changes: "Enhanced cloud strategy", status: "Pending Approval", author: "John Doe" }
        ]
      },
      { 
        version: "v1.0", 
        date: "2024-12-12", 
        time: "10:45", 
        changes: "Initial requirement", 
        status: "Draft", 
        author: "John Doe",
        proposalVersions: [
          { version: "P1.0.0", date: "2024-12-18", time: "09:30", changes: "Initial multi-cloud proposal", status: "Draft", author: "John Doe" }
        ]
      }
    ],
    addedDate: "2024-12-28",
    createdDate: "2024-12-12",
    status: "Awaiting Acceptance",
    opportunityId: "OPP000005",
    opportunityStatus: "Proposal Submitted",
    assignedBy: "John Doe",
    location: "Mumbai",
    contractTerm: "3 Years",
    margin: 28.5,
    revenue: 52400000,
    title: "Multi-Cloud Strategy Implementation",
    priority: "Critical",
    probability: 85,
    stage: "Negotiation"
  },
  {
    id: "CL000009",
    customerName: "Future Tech Solutions",
    customerId: "FT009",
    version: "v1.0",
    versionHistory: [
      { 
        version: "v1.0", 
        date: "2024-12-15", 
        time: "11:15", 
        changes: "Initial requirement", 
        status: "Pricing Rejected", 
        author: "John Doe",
        proposalVersions: [
          { version: "P1.0.1", date: "2024-12-20", time: "14:00", changes: "Revised IoT proposal after pricing feedback", status: "Pricing Rejected", author: "John Doe" },
          { version: "P1.0.0", date: "2024-12-16", time: "10:30", changes: "Initial IoT infrastructure proposal", status: "Pricing Rejected", author: "John Doe" }
        ]
      }
    ],
    addedDate: "2024-12-20",
    createdDate: "2024-12-15",
    status: "Pricing Rejected",
    opportunityId: "OPP000009",
    opportunityStatus: "Qualified Lead",
    assignedBy: "John Doe",
    location: "Mumbai",
    contractTerm: "2 Years",
    margin: 18.5,
    revenue: 6200000,
    title: "IoT Infrastructure Platform",
    priority: "Medium",
    probability: 40,
    stage: "Qualification",
    rejectionComments: "Pricing exceeds budget constraints. Customer requested 25% reduction in overall cost structure. Finance team suggests revisiting service tiers and implementation timeline to optimize pricing."
  }
];

// Updated BOM Items with specific data provided
const getBOMItems = () => [
  {
    id: 1,
    category: "Compute",
    productName: "VPI High Availability",
    sku: "VPI-HA-1vCPU-1GBvRAM",
    specifications: "1 vCPUs, 1 GB RAM",
    quantity: 10,
    otc: 50000, // One Time Cost
    arc: 25000  // Annual Recurring Cost
  },
  {
    id: 2,
    category: "Storage",
    productName: "Standard Storage",
    sku: "OBJ-STR-STANDARD-SINGLE-REGION-PER-GB",
    specifications: "50 GB",
    quantity: 1,
    otc: 15000,
    arc: 8000
  },
  {
    id: 3,
    category: "Network",
    productName: "Load Balancer",
    sku: "LB-25MBPS-1VIP",
    specifications: "Layer 7, SSL termination, Health checks",
    quantity: 2,
    otc: 30000,
    arc: 18000
  },
  {
    id: 4,
    category: "Security",
    productName: "GeoTrust",
    sku: "GEOTRUST-SSLCERT-4SAN-1DOMAIN",
    specifications: "DDoS protection",
    quantity: 1,
    otc: 12000,
    arc: 6000
  }
];

// Extended mock data for requirement details
const getRequirementDetails = (baseReq: any) => ({
  ...baseReq,
  customerDetails: {
    contactPerson: "Rajesh Kumar",
    email: "rajesh.k@techcorp.com",
    phone: "+91 98765 43210",
    company: baseReq.customerName,
    address: "123 Business Street, " + baseReq.location + ", India",
    industry: "Information Technology"
  },
  solutionArchitect: {
    name: "Sarah Wilson",
    email: "sarah.w@onesify.com",
    phone: "+91 98765 54321",
    status: "Assigned",
    assignedDate: "2024-12-20"
  },
  bomItems: getBOMItems(),
  proposalDocument: {
    version: "v2.0",
    date: "2024-12-25",
    filename: `Proposal_${baseReq.customerName.replace(/\s+/g, '')}_v2.0.pdf`,
    size: "2.5 MB"
  },
  financeComments: baseReq.rejectionComments || "Pricing exceeds budget constraints. Customer requested 25% reduction in overall cost structure. Finance team suggests revisiting service tiers and implementation timeline to optimize pricing.",
  // Additional fields for the new requirements
  paymentModel: "Annual Subscription",
  drEnabled: "Yes",
  budgetRange: "₹10L - ₹15L",
  requirementDescription: "Comprehensive cloud migration solution with high availability and disaster recovery capabilities for enterprise-grade applications.",
  opportunityName: "Enterprise Digital Transformation Initiative",
  requestType: "Upload Requirement",
  lastUpdated: "2024-12-28 16:30"
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Draft': return 'bg-gray-100 text-gray-800';
    case 'In Progress': return 'bg-blue-100 text-blue-800';
    case 'Proposal Accepted': return 'bg-emerald-100 text-emerald-800';
    case 'Solutioning': return 'bg-yellow-100 text-yellow-800';
    case 'Awaiting Acceptance': return 'bg-orange-100 text-orange-800';
    case 'Pending Approval': return 'bg-red-100 text-red-800';
    case 'Solution Updated': return 'bg-purple-100 text-purple-800';
    case 'Pricing Approved': return 'bg-teal-100 text-teal-800';
    case 'Pricing Rejected': return 'bg-rose-100 text-rose-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function RequirementDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedVersionHistory, setSelectedVersionHistory] = useState<boolean>(false);
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set());
  
  // Find the requirement based on ID from URL
  const baseRequirement = mockRequirements.find(req => req.id === id);
  
  if (!baseRequirement) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Requirement Not Found</h2>
            <p className="text-gray-600 mb-4">The requirement with ID "{id}" could not be found.</p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get full requirement details
  const requirement = getRequirementDetails(baseRequirement);

  const toggleVersionExpansion = (version: string) => {
    const newExpanded = new Set(expandedVersions);
    if (newExpanded.has(version)) {
      newExpanded.delete(version);
    } else {
      newExpanded.add(version);
    }
    setExpandedVersions(newExpanded);
  };

  const getPrimaryAction = (status: string) => {
    switch (status) {
      case 'Draft':
      case 'In Progress':
      case 'Solutioning':
      case 'Pending Approval':
      case 'Solution Updated':
        return { label: 'Edit Requirement', icon: Edit, action: () => navigate(`/edit-requirement/${id}`) };
      case 'Proposal Accepted':
        return { label: 'Add Billing & Shipping Address', icon: MapPin, action: () => navigate(`/address/${id}`) };
      case 'Awaiting Acceptance':
      case 'Pricing Rejected':
        return { label: 'Manage Pricing', icon: IndianRupee, action: () => navigate(`/pricing/${id}`) };
      case 'Pricing Approved':
        return { label: 'Edit Requirement', icon: Edit, action: () => navigate(`/edit-requirement/${id}`) };
      default:
        return { label: 'Edit Requirement', icon: Edit, action: () => navigate(`/bom/${id}`) };
    }
  };

  const getSecondaryActions = (status: string) => {
    const commonActions = [
      { label: 'View BOM', icon: Package, action: () => navigate(`/bom/${id}`) },
      { label: 'Requirement Document', icon: FileText, action: () => {} },
      { label: 'Solution Document', icon: Settings, action: () => navigate(`/solution-editor/${id}`) }
    ];

    switch (status) {
      case 'Proposal Accepted':
        return [
          ...commonActions,
          { label: 'Download Proposal', icon: Download, action: () => {} }
        ];
      case 'Pricing Rejected':
        return [
          ...commonActions,
          { label: 'Edit Requirement', icon: Edit, action: () => navigate(`/edit-requirement/${id}`) }
        ];
      default:
        return commonActions;
    }
  };

  const shouldShowBOM = (status: string) => {
    return ['Proposal Accepted', 'Awaiting Acceptance', 'Pending Approval', 'Solution Updated', 'Pricing Approved', 'Pricing Rejected'].includes(status);
  };

  const shouldShowSolutionArchitect = (status: string) => {
    return status === 'Solutioning';
  };

  const shouldShowProposal = (status: string) => {
    return status === 'Proposal Accepted';
  };

  const shouldShowFinanceComments = (status: string) => {
    return status === 'Pricing Rejected';
  };

  const isUploadDisabled = (status: string) => {
    return status === 'Proposal Accepted';
  };

  const primaryAction = getPrimaryAction(requirement.status);
  const secondaryActions = getSecondaryActions(requirement.status);
  
  // Calculate totals for BOM
  const totalOTC = requirement.bomItems.reduce((sum, item) => sum + (item.otc * item.quantity), 0);
  const totalARC = requirement.bomItems.reduce((sum, item) => sum + (item.arc * item.quantity), 0);
  const grandTotal = totalOTC + totalARC;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Requirement Details - {requirement.id}
            </h1>
            <p className="text-gray-600 mt-1">
              {requirement.title} • {requirement.customerName}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedVersionHistory(true)}
          >
            <History className="w-4 h-4 mr-2" />
            Version Tracker
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            disabled={isUploadDisabled(requirement.status)}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Requirement
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Accordion for main sections */}
          <Accordion type="multiple" defaultValue={["requirement-overview"]} className="space-y-4">
            {/* Requirement Overview */}
            <AccordionItem value="requirement-overview">
              <Card>
                <CardHeader className="py-[8px] px-[21px]">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center space-x-2">
                        <ClipboardList className="w-5 h-5" />
                        <h3 className="text-[16px]" className="text-[14px]">Requirement Overview</h3>
                      </div>
                      <Badge className={`${getStatusColor(requirement.status)}`}>
                        {requirement.status}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                </CardHeader>
                <AccordionContent>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Basic Information */}
                      <div>
                        <label className="text-sm font-medium text-gray-500">Requirement ID</label>
                        <p className="font-medium">{requirement.id}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Version</label>
                        <p className="font-medium">{requirement.version}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Priority</label>
                        <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700">
                          {requirement.priority}
                        </Badge>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Contract Term</label>
                        <p className="font-medium">{requirement.contractTerm}</p>
                      </div>
                      
                      {/* Location & Technical Details */}
                      <div>
                        <label className="text-sm font-medium text-gray-500">Location</label>
                        <p className="font-medium">{requirement.location}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Payment Model</label>
                        <p className="font-medium">{requirement.paymentModel}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">DR Enabled</label>
                        <p className="font-medium">{requirement.drEnabled}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Budget Range</label>
                        <p className="font-medium">{requirement.budgetRange}</p>
                      </div>
                      
                      {/* Dates & Creator */}
                      <div>
                        <label className="text-sm font-medium text-gray-500">Created By</label>
                        <p className="font-medium">{requirement.assignedBy}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Added Date</label>
                        <p className="font-medium">{requirement.addedDate}</p>
                      </div>
                      
                      {/* Description - Full Width */}
                      <div className="col-span-2">
                        <label className="text-sm font-medium text-gray-500">Requirement Description</label>
                        <p className="font-medium text-gray-700 mt-1">{requirement.requirementDescription}</p>
                      </div>
                    </div>
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>

            {/* Request Details */}
            <AccordionItem value="request-details">
              <Card>
                <CardHeader className="py-[8px] px-[21px]">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-5 h-5" />
                      <h3 className="text-[16px]">Request Details</h3>
                    </div>
                  </AccordionTrigger>
                </CardHeader>
                <AccordionContent>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Opportunity Information */}
                      <div>
                        <label className="text-sm font-medium text-gray-500">Opportunity ID</label>
                        <p className="font-medium">{requirement.opportunityId}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Opportunity Name</label>
                        <p className="font-medium">{requirement.opportunityName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Opportunity Status</label>
                        <p className="font-medium">{requirement.opportunityStatus}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Probability</label>
                        <p className="font-medium">{requirement.probability}%</p>
                      </div>
                      
                      {/* Request Information */}
                      <div>
                        <label className="text-sm font-medium text-gray-500">Request Type</label>
                        <p className="font-medium">{requirement.requestType}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Created Date</label>
                        <p className="font-medium">{requirement.createdDate}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Last Updated</label>
                        <p className="font-medium">{requirement.lastUpdated}</p>
                      </div>
                    </div>
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>

            {/* Customer Details */}
            <AccordionItem value="customer-details">
              <Card>
                <CardHeader className="py-[8px] px-[21px]">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center space-x-2">
                      <Building className="w-5 h-5" />
                      <h3 className="text-[16px]">Customer Details</h3>
                    </div>
                  </AccordionTrigger>
                </CardHeader>
                <AccordionContent>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Company</label>
                        <p className="font-medium">{requirement.customerDetails.company}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Customer ID</label>
                        <p className="font-medium">{requirement.customerId}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Contact Person</label>
                        <p className="font-medium">{requirement.customerDetails.contactPerson}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Industry</label>
                        <p className="font-medium">{requirement.customerDetails.industry}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="font-medium">{requirement.customerDetails.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone</label>
                        <p className="font-medium">{requirement.customerDetails.phone}</p>
                      </div>
                      <div className="col-span-2">
                        <label className="text-sm font-medium text-gray-500">Address</label>
                        <p className="font-medium">{requirement.customerDetails.address}</p>
                      </div>
                    </div>
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          </Accordion>

          {/* Solution Architect Information - Only for Solutioning status */}
          {shouldShowSolutionArchitect(requirement.status) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Assigned Solution Architect</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="font-medium">{requirement.solutionArchitect.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <Badge className="bg-green-100 text-green-800">
                      {requirement.solutionArchitect.status}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="font-medium">{requirement.solutionArchitect.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="font-medium">{requirement.solutionArchitect.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-500">Assigned Date</label>
                    <p className="font-medium">{requirement.solutionArchitect.assignedDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Latest Proposal Document - Only for Proposal Accepted status */}
          {shouldShowProposal(requirement.status) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Latest Proposal Document</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{requirement.proposalDocument.filename}</p>
                      <p className="text-sm text-gray-500">
                        Version {requirement.proposalDocument.version} • {requirement.proposalDocument.date} • {requirement.proposalDocument.size}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* BOM List - For specific statuses */}
          {shouldShowBOM(requirement.status) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>Bill of Materials (BOM)</span>
                </CardTitle>
                <CardDescription>
                  Total items: {requirement.bomItems.length} • Total OTC: {formatCurrency(totalOTC)} • Total ARC: {formatCurrency(totalARC)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Specifications</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>OTC</TableHead>
                      <TableHead>ARC</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requirement.bomItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell className="text-sm font-mono text-gray-600">{item.sku}</TableCell>
                        <TableCell className="text-sm text-gray-600">{item.specifications}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(item.otc * item.quantity)}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(item.arc * item.quantity)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {/* BOM Summary */}
                <div className="mt-6 pt-4 border-t space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total One Time Cost (OTC):</span>
                    <span className="text-lg font-bold text-blue-600">{formatCurrency(totalOTC)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Annual Recurring Cost (ARC):</span>
                    <span className="text-lg font-bold text-green-600">{formatCurrency(totalARC)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Grand Total:</span>
                    <span className="text-xl font-bold text-gray-900">{formatCurrency(grandTotal)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Finance Comments - Only for Pricing Rejected status */}
          {shouldShowFinanceComments(requirement.status) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span>Note by Finance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800">{requirement.financeComments}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-[16px]">Actions</CardTitle>
              <CardDescription>
                Available actions for this requirement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Primary Action */}
              <Button 
                className="w-full" 
                onClick={primaryAction.action}
              >
                <primaryAction.icon className="w-4 h-4 mr-2" />
                {primaryAction.label}
              </Button>

              <Separator />

              {/* Secondary Actions */}
              <div className="space-y-2">
                {secondaryActions.map((action, index) => (
                  <Button 
                    key={index}
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={action.action}
                  >
                    <action.icon className="w-4 h-4 mr-2" />
                    {action.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Focused Version History Dialog */}
      <Dialog open={selectedVersionHistory} onOpenChange={setSelectedVersionHistory}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <GitBranch className="w-5 h-5" />
              <span>Version History - {requirement.id}</span>
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Track requirement versions and their associated proposal versions for {requirement.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <strong>How it works:</strong> Each time you update a requirement, a new requirement version is created. 
              Within each requirement version, you can generate multiple proposal versions as you refine your proposals.
            </div>
            
            {requirement.versionHistory.map((reqVersion, index) => (
              <Card key={reqVersion.version} className="border border-gray-200">
                <Collapsible
                  open={expandedVersions.has(reqVersion.version)}
                  onOpenChange={() => toggleVersionExpansion(reqVersion.version)}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {expandedVersions.has(reqVersion.version) ? (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                          )}
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {reqVersion.version}
                              </span>
                            </div>
                            <div>
                              <CardTitle className="text-base">Requirement {reqVersion.version}</CardTitle>
                              <CardDescription className="text-sm">
                                {reqVersion.changes}
                              </CardDescription>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={`${getStatusColor(reqVersion.status)}`}>
                            {reqVersion.status}
                          </Badge>
                          <div className="text-right text-sm text-gray-500">
                            <div>{reqVersion.date} at {reqVersion.time}</div>
                            <div>by {reqVersion.author}</div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="ml-6 pl-6 border-l-2 border-gray-200">
                        <h4 className="font-medium mb-3 flex items-center space-x-2">
                          <FileCheck className="w-4 h-4 text-green-600" />
                          <span>Proposal Versions for {reqVersion.version}</span>
                          <Badge variant="outline" className="text-xs">
                            {reqVersion.proposalVersions?.length || 0} versions
                          </Badge>
                        </h4>
                        
                        {reqVersion.proposalVersions && reqVersion.proposalVersions.length > 0 ? (
                          <div className="space-y-3">
                            {reqVersion.proposalVersions.map((proposal, pIndex) => (
                              <div key={proposal.version} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex-shrink-0">
                                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-medium text-green-600">
                                      {proposal.version}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-sm">Proposal {proposal.version}</span>
                                    <Badge className={`${getStatusColor(proposal.status)} text-xs`}>
                                      {proposal.status}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{proposal.changes}</p>
                                  <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>By {proposal.author}</span>
                                    <span>{proposal.date} at {proposal.time}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-gray-500">
                            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No proposals generated for this requirement version</p>
                            <p className="text-xs mt-1">Proposals will appear here when created</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-medium mb-2 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>Version Summary</span>
            </h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>• <strong>Current Version:</strong> {requirement.version}</div>
              <div>• <strong>Total Requirement Versions:</strong> {requirement.versionHistory.length}</div>
              <div>• <strong>Total Proposal Versions:</strong> {requirement.versionHistory.reduce((sum, rv) => sum + (rv.proposalVersions?.length || 0), 0)}</div>
              <div>• <strong>Current Status:</strong> {requirement.status}</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
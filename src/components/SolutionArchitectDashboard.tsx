import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  TrendingUp,
  Clock,
  Star,
  FileText,
  Search,
  Filter,
  MoreVertical,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Target,
  Zap,
  BookOpen,
  HelpCircle,
  AlertTriangle,
  FileCheck,
  BarChart3,
  Activity,
  ClipboardList,
  ArrowRight,
  Edit,
  Eye,
  Server,
  Package,
  Database,
  Network,
  PieChart
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data
const assignedRequirements = [
  {
    reqId: "NW000034",
    customerName: "TechFlow Solutions",
    status: "new",
    solutionStatus: "Needs Review",
    opportunityId: "OPP000001",
    opportunityDetail: "Qualified Lead",
    revenue: "₹36,00,000",
    priority: "High",
    assignedDate: "Dec 28, 2024",
    location: "Mumbai",
    product: "Network",
    dueDate: "Jan 15, 2025"
  },
  {
    reqId: "NW000035",
    customerName: "Digital Dynamics Inc",
    status: "proposal generated",
    solutionStatus: "Needs Review",
    opportunityId: "OPP000002",
    opportunityDetail: "Captured SOW",
    revenue: "₹29,50,000",
    priority: "Medium",
    assignedDate: "Dec 25, 2024",
    location: "Delhi",
    product: "Network",
    dueDate: "Jan 10, 2025"
  },
  {
    reqId: "NW000036",
    customerName: "InnovaTech Pvt Ltd",
    status: "Proposal Accepted",
    solutionStatus: "Completed",
    opportunityId: "OPP000004",
    opportunityDetail: "Qualified Lead",
    revenue: "₹87,25,000",
    priority: "High",
    assignedDate: "Dec 18, 2024",
    location: "Bangalore",
    product: "Network",
    dueDate: "Dec 30, 2024"
  },
  {
    reqId: "NW000037",
    customerName: "CloudFirst Enterprise",
    status: "new",
    solutionStatus: "WIP",
    opportunityId: "OPP000003",
    opportunityDetail: "PO In Hand",
    revenue: "₹18,90,000",
    priority: "Low",
    assignedDate: "Dec 20, 2024",
    location: "Chennai",
    product: "Network",
    dueDate: "Jan 25, 2025"
  },
  {
    reqId: "CL000038",
    customerName: "DataCore Systems",
    status: "proposal generated",
    solutionStatus: "New",
    opportunityId: "OPP000005",
    opportunityDetail: "Proposal Submitted",
    revenue: "₹52,00,000",
    priority: "High",
    assignedDate: "Dec 22, 2024",
    location: "Pune",
    product: "Cloud",
    dueDate: "Jan 18, 2025"
  },
  {
    reqId: "CL000039",
    customerName: "SmartNet Solutions",
    status: "new",
    solutionStatus: "Needs Review",
    opportunityId: "OPP000001",
    opportunityDetail: "Qualified Lead",
    revenue: "₹41,25,000",
    priority: "Medium",
    assignedDate: "Dec 19, 2024",
    location: "Hyderabad",
    product: "Cloud",
    dueDate: "Jan 12, 2025"
  },
  {
    reqId: "CL000040",
    customerName: "GlobalTech Industries",
    status: "Proposal Accepted",
    solutionStatus: "WIP",
    opportunityId: "OPP000002",
    opportunityDetail: "Captured SOW",
    revenue: "₹63,75,000",
    priority: "High",
    assignedDate: "Dec 15, 2024",
    location: "Kolkata",
    product: "Cloud",
    dueDate: "Jan 08, 2025"
  },
  {
    reqId: "CL000041",
    customerName: "NextGen Enterprises",
    status: "proposal generated",
    solutionStatus: "Completed",
    opportunityId: "OPP000004",
    opportunityDetail: "Qualified Lead",
    revenue: "₹33,50,000",
    priority: "Low",
    assignedDate: "Dec 12, 2024",
    location: "Ahmedabad",
    product: "Cloud",
    dueDate: "Jan 05, 2025"
  }
];

const recentUpdates = [
  {
    id: 1,
    title: "New requirement assigned, NW000004",
    time: "3 hours ago",
    company: "CloudFin Solutions",
    status: "new",
    action: "View Solution",
    dotColor: "bg-orange-500"
  },
  {
    id: 2,
    title: "Solution creation, NW000003",
    time: "6 hours ago",
    company: "TechCorp",
    status: "ongoing",
    action: "Start Solution",
    dotColor: "bg-blue-500"
  },
  {
    id: 3,
    title: "New requirement assigned, CL000002",
    time: "1 day ago",
    company: "Digital Dynamics",
    status: "urgent",
    action: "View Solution",
    dotColor: "bg-orange-500"
  }
];

const performanceMetrics = [
  {
    name: "Solution Completion Rate",
    value: 86,
    target: "Target: 95%",
    icon: "target",
    progressColor: "bg-green-600"
  },
  {
    name: "On-time Delivery",
    value: 92,
    target: "Target: 85%",
    icon: "clock",
    progressColor: "bg-green-600"
  },
  {
    name: "Satisfaction",
    value: 96,
    displayValue: "4.8/5",
    target: "Based on feedback",
    icon: "star",
    progressColor: "bg-purple-600"
  }
];

const productTrends = [
  {
    id: "PRJT-001",
    icon: "cloud",
    name: "Cloud Infra",
    type: "High-end fibre-level cloud services",
    complexity: "Complex, Network, Storage, High, Backup, Security",
    updated: "Updated: Dec 20, 2024",
    projectManager: "Rajesh Khanna",
    contact: "+91 98765 43210"
  },
  {
    id: "PRJT-002",
    icon: "services",
    name: "Managed Services",
    type: "Enterprise-grade network managed services",
    complexity: "Infrastructure Management, Telecom and Security Services, Monitoring and Support Services",
    updated: "Updated: Dec 16, 2024",
    projectManager: "Priya Sharma",
    contact: "+91 98765 43211"
  },
  {
    id: "PRJT-003",
    icon: "network",
    name: "Network",
    type: "Comprehensive network connectivity solutions",
    complexity: "DIA, MPLS, GCC, P2P",
    updated: "Updated: Dec 01, 2024",
    projectManager: "Amit Verma",
    contact: "+91 98765 43212"
  }
];

const trendData = [
  { month: 'Jan', value: 65 },
  { month: 'Feb', value: 75 },
  { month: 'Mar', value: 70 },
  { month: 'Apr', value: 85 },
  { month: 'May', value: 80 },
  { month: 'Jun', value: 90 }
];

const documentSections = [
  {
    title: "Terms & Conditions",
    count: "12",
    updated: "Updated: Dec 28, 2024",
    items: [
      "Cloud Contract No: TNC-001",
      "Data Center SLA Terms",
      "Network Service TNC-014"
    ]
  },
  {
    title: "SLA Agreements",
    count: "5",
    updated: "Updated: Dec 16, 2024",
    items: [
      "MPLS Service-Level Agreement",
      "Cloud Infrastructure SLA",
      "Support Service SLA"
    ]
  },
  {
    title: "Templates & Frameworks",
    count: "15",
    updated: "Updated: Dec 22, 2024",
    items: [
      "Requirement Document Template",
      "Solution Architecture Template",
      "Review System Assessment Template"
    ]
  },
  {
    title: "Knowledge Base",
    count: "35",
    updated: "Updated: Dec 24, 2024",
    items: [
      "Network Architecture Guides",
      "CRM Documentation",
      "User Guides & Best Practices"
    ]
  },
  {
    title: "Business Process",
    count: "View Map",
    updated: "Updated: Dec 19, 2024",
    items: [
      "End-to-end workflow visualization",
      "Multiple Stakeholders",
      "As-Is model integration"
    ]
  },
  {
    title: "Process Documentation",
    count: "28",
    updated: "Updated: Dec 18, 2024",
    items: [
      "Deployment Processes",
      "Business Process Guidelines",
      "Turnaround Time Policies"
    ]
  }
];

export function SolutionArchitectDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('catalogue');
  const [productFilter, setProductFilter] = useState('All Products');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  const itemsPerPage = 4;

  const toggleSection = (title: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const filteredRequirements = assignedRequirements.filter(req => {
    if (productFilter === 'All Products') return true;
    if (productFilter === 'Cloud Services') return req.product === 'Cloud';
    if (productFilter === 'Network Services') return req.product === 'Network';
    return true;
  });

  const totalPages = Math.ceil(filteredRequirements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRequirements = filteredRequirements.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'needs review':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'wip':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-gray-900 mb-1">Solution Architect Dashboard</h1>
            <p className="text-sm text-gray-600">Design and architect technical solutions for enterprise requirements</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Current Week</span>
            <Button variant="outline" size="sm" className="text-sm">
              Jan 1 - Dec 28, 2025
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-sm">
                  {productFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => setProductFilter('All Products')} className="cursor-pointer">
                  All Products
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setProductFilter('Cloud Services')} className="cursor-pointer">
                  Cloud Services
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setProductFilter('Network Services')} className="cursor-pointer">
                  Network Services
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Top Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <p className="text-sm text-gray-600">Assigned Requirements</p>
                  </div>
                  <p className="text-2xl text-gray-900 mb-1">8</p>
                  <p className="text-xs text-green-600">In Progress</p>
                </div>
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <p className="text-sm text-gray-600">Completed Solutions</p>
                  </div>
                  <p className="text-2xl text-gray-900 mb-1">24</p>
                  <p className="text-xs text-blue-600">This month</p>
                </div>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-4 h-4 text-orange-600" />
                    <p className="text-sm text-gray-600">Pending Reviews</p>
                  </div>
                  <p className="text-2xl text-gray-900 mb-1">3</p>
                  <p className="text-xs text-orange-600">Last 30 days</p>
                </div>
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <p className="text-sm text-gray-600">Avg Response Time</p>
                  </div>
                  <p className="text-2xl text-gray-900 mb-1">2.4h</p>
                  <p className="text-xs text-purple-600">Last 30 days</p>
                </div>
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Updates and Performance Metrics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Updates */}
          <Card className="border border-gray-200 shadow-sm bg-white flex flex-col">
            <CardHeader className="pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <CardTitle className="text-sm font-medium text-gray-900">Recent Updates</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-[0px] space-y-3 flex-1 flex flex-col pr-[21px] pb-[21px] pl-[21px]">
              {recentUpdates.map((update) => (
                <div key={update.id} className="flex-1 rounded-lg border border-gray-200 p-4 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${update.dotColor}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 font-normal leading-tight mb-0.5">{update.title}</p>
                      <p className="text-xs text-gray-500 leading-tight">{update.time} • {update.company}</p>
                    </div>
                  </div>
                  <Button variant="link" className="text-xs text-gray-400 p-0 h-auto whitespace-nowrap flex-shrink-0 hover:text-purple-600">
                    {update.action}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader className="pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-600" />
                <CardTitle className="text-sm font-medium text-gray-900">Performance Metrics</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-[0px] space-y-3 pr-[21px] pb-[21px] pl-[21px]">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="rounded-lg border border-gray-200 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 ${
                        metric.icon === 'target' ? 'bg-blue-50 border-blue-200' :
                        metric.icon === 'clock' ? 'bg-green-50 border-green-200' :
                        'bg-purple-50 border-purple-200'
                      }`}>
                        {metric.icon === 'target' && <Target className="w-4 h-4 text-blue-600" />}
                        {metric.icon === 'clock' && <Clock className="w-4 h-4 text-green-600" />}
                        {metric.icon === 'star' && <Star className="w-4 h-4 text-purple-600" />}
                      </div>
                      <div>
                        <p className="text-sm text-gray-900 font-medium leading-tight">{metric.name}</p>
                        <p className="text-xs text-gray-500 leading-tight mt-1">{metric.target}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-xl font-semibold ${
                        metric.icon === 'clock' ? 'text-green-600' : 
                        metric.icon === 'star' ? 'text-purple-600' : 
                        'text-green-600'
                      }`}>
                        {metric.displayValue || `${metric.value}%`}
                      </span>
                      <div className="relative w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="absolute top-0 left-0 h-full rounded-full transition-all bg-slate-800"
                          style={{ width: `${metric.value}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Assigned Requirements Tracker */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-purple-600" />
                <CardTitle className="text-base">Assigned Requirements Tracker</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-48 h-9 text-sm"
                  />
                </div>
                <Button variant="outline" size="sm" className="h-9 text-sm">
                  <Filter className="w-4 h-4 mr-2" />
                  All Status
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200">
                    <TableHead className="text-xs font-medium text-gray-700">Req ID</TableHead>
                    <TableHead className="text-xs font-medium text-gray-700">Product</TableHead>
                    <TableHead className="text-xs font-medium text-gray-700">Customer Name</TableHead>
                    <TableHead className="text-xs font-medium text-gray-700">Opportunity</TableHead>
                    <TableHead className="text-xs font-medium text-gray-700">Revenue</TableHead>
                    <TableHead className="text-xs font-medium text-gray-700">Priority</TableHead>
                    <TableHead className="text-xs font-medium text-gray-700">Assigned Date</TableHead>
                    <TableHead className="text-xs font-medium text-gray-700">Location</TableHead>
                    <TableHead className="text-xs font-medium text-gray-700">Solution Status</TableHead>
                    <TableHead className="text-xs font-medium text-gray-700">Due Date</TableHead>
                    <TableHead className="text-xs font-medium text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRequirements.map((req) => (
                    <TableRow key={req.reqId} className="border-gray-100">
                      <TableCell className="text-sm font-medium text-gray-900">{req.reqId}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs font-normal ${
                          req.product === 'Network' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-purple-50 text-purple-700 border-purple-200'
                        }`}>
                          {req.product}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-900">{req.customerName}</TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="text-sm font-medium text-gray-900">{req.opportunityId}</div>
                        <div className="text-xs text-gray-500">{req.opportunityDetail}</div>
                      </TableCell>
                      <TableCell className="text-sm font-medium text-gray-900">{req.revenue}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs font-normal ${getPriorityColor(req.priority)}`}>
                          {req.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{req.assignedDate}</TableCell>
                      <TableCell className="text-sm text-gray-900">{req.location}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs font-normal ${getStatusColor(req.solutionStatus)}`}>
                          {req.solutionStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{req.dueDate}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="w-4 h-4 text-gray-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            {req.solutionStatus.toLowerCase() !== 'completed' && (
                              <DropdownMenuItem 
                                className="cursor-pointer"
                                onClick={() => navigate(`/solution-document-editor/${req.reqId}`)}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => navigate(`/sa-requirement-details/${req.reqId}`)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Product Trends */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-600" />
              <div>
                <CardTitle className="text-base">Product Trends</CardTitle>
                <CardDescription className="text-xs mt-1">Product catalogue with detailed solutions and customer scope insights</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="catalogue" className="text-sm">Product Catalogue</TabsTrigger>
                <TabsTrigger value="inventory" className="text-sm">Cloud Inventory</TabsTrigger>
              </TabsList>
              <TabsContent value="catalogue" className="space-y-4 mt-0">
                {productTrends.map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg p-5 bg-white">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            product.icon === 'cloud' ? 'bg-blue-50' : 'bg-purple-50'
                          }`}>
                            {product.icon === 'cloud' ? (
                              <Zap className="w-5 h-5 text-blue-600" />
                            ) : (
                              <Target className="w-5 h-5 text-purple-600" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                            <p className="text-xs text-gray-500">{product.id}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{product.type}</p>
                        <p className="text-xs text-gray-500 mb-2">Category: {product.complexity}</p>
                        <p className="text-xs text-gray-400">{product.updated}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">Project Manager</p>
                        <p className="text-sm font-medium text-gray-900">{product.projectManager}</p>
                        <p className="text-xs text-gray-500 mt-1">{product.contact}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="inventory" className="mt-0">
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Side - Cloud Resource Inventory */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Server className="w-4 h-4 text-blue-600" />
                      <h3 className="text-sm font-medium text-gray-900">Cloud Resource Inventory</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
                            <Server className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-sm text-gray-900">VMs/Instances</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">1,247</span>
                      </div>
                      <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-green-100 flex items-center justify-center">
                            <Package className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="text-sm text-gray-900">Containers/Pods</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">3,456</span>
                      </div>
                      <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-yellow-100 flex items-center justify-center">
                            <Database className="w-4 h-4 text-yellow-600" />
                          </div>
                          <span className="text-sm text-gray-900">Storage Volumes</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">892</span>
                      </div>
                      <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-orange-100 flex items-center justify-center">
                            <Database className="w-4 h-4 text-orange-600" />
                          </div>
                          <span className="text-sm text-gray-900">Database Nodes</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">156</span>
                      </div>
                      <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-purple-100 flex items-center justify-center">
                            <Network className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="text-sm text-gray-900">Network Components</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">234</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Resource Distribution */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <PieChart className="w-4 h-4 text-purple-600" />
                      <h3 className="text-sm font-medium text-gray-900">Resource Distribution</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                            <span className="text-sm text-gray-700">Compute</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">35%</span>
                            <span className="text-sm font-medium text-gray-900">₹14.2L</span>
                          </div>
                        </div>
                        <Progress value={35} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                            <span className="text-sm text-gray-700">Storage</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">25%</span>
                            <span className="text-sm font-medium text-gray-900">₹10.1L</span>
                          </div>
                        </div>
                        <Progress value={25} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-600"></div>
                            <span className="text-sm text-gray-700">Network</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">18%</span>
                            <span className="text-sm font-medium text-gray-900">₹7.3L</span>
                          </div>
                        </div>
                        <Progress value={18} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                            <span className="text-sm text-gray-700">Security</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">12%</span>
                            <span className="text-sm font-medium text-gray-900">₹4.9L</span>
                          </div>
                        </div>
                        <Progress value={12} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                            <span className="text-sm text-gray-700">Other</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">10%</span>
                            <span className="text-sm font-medium text-gray-900">₹4.1L</span>
                          </div>
                        </div>
                        <Progress value={10} className="h-2" />
                      </div>
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">Total Resource Cost:</span>
                          <span className="text-sm font-medium text-gray-900">₹40.6L</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scaling & Auto-Provisioning Metrics */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-600" />
                <CardTitle className="text-base">Scaling & Auto-Provisioning Metrics</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">Avg.CPU Use</span>
                  <span className="text-sm font-medium text-gray-900">72%</span>
                </div>
                <Progress value={72} className="h-2 mb-2" />
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Min Threshold: 30%</span>
                  <span className="text-xs text-gray-500">Scaling Threshold</span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">Avg.Memory Use</span>
                  <span className="text-sm font-medium text-gray-900">68%</span>
                </div>
                <Progress value={68} className="h-2 mb-2" />
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">CPU: 65%, Memory: 60%</span>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-700 mb-2">Scaling Thresholds:</p>
                    <p className="text-xs text-gray-600">CPU: 65%, Memory: 60%</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">CPUs Diff:</span>
                    <span className="text-gray-900 font-medium">2 units</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Scaling Event Count:</span>
                    <span className="text-gray-900 font-medium">7 times</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trends & Comparative Views */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <CardTitle className="text-base">Trends & Comparative Views</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-3">Usage Trend</p>
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <p className="text-sm text-gray-700 mb-3">Regional Usage Heatmap</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Mumbai:</span>
                    <span className="text-gray-900 font-medium">68 services</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Bangalore:</span>
                    <span className="text-gray-900 font-medium">52 services</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Node Number - Status:</span>
                    <span className="text-gray-900 font-medium">12 services</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Resource Sharing:</span>
                    <span className="text-green-600 font-medium">+33%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Resource Quality:</span>
                    <span className="text-gray-900 font-medium">Above Average</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documentation & Knowledge Management */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-600" />
              <div>
                <CardTitle className="text-base">Documentation & Knowledge Management</CardTitle>
                <CardDescription className="text-xs mt-1">Centralized Access to all technical documents, templates, and knowledge resources</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documentSections.map((section) => (
                <div key={section.title} className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-600" />
                      <h3 className="text-sm font-medium text-gray-900">{section.title}</h3>
                    </div>
                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                      {section.count}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{section.updated}</p>
                  {expandedSections[section.title] && (
                    <ul className="space-y-2 mb-3">
                      {section.items.map((item, idx) => (
                        <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                          <span className="text-purple-500 mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <Button
                    variant="link"
                    size="sm"
                    className="text-xs text-purple-600 p-0 h-auto hover:text-purple-700"
                    onClick={() => toggleSection(section.title)}
                  >
                    <ChevronRight className={`w-3 h-3 mr-1 transition-transform ${expandedSections[section.title] ? 'rotate-90' : ''}`} />
                    {expandedSections[section.title] ? 'Show Less' : 'Access Documents'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bottom Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <HelpCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Q&A Database</h3>
                <p className="text-xs text-gray-600 mb-4">400+ frequently asked questions</p>
                <Button variant="outline" size="sm" className="text-xs">
                  Browse FAQ
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Escalation Matrix</h3>
                <p className="text-xs text-gray-600 mb-4">Issue escalation procedures</p>
                <Button variant="outline" size="sm" className="text-xs">
                  View Matrix
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <FileCheck className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Template Procedures</h3>
                <p className="text-xs text-gray-600 mb-4">Product-wise templates library</p>
                <Button variant="outline" size="sm" className="text-xs">
                  View Templates
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
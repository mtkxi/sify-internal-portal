import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Textarea } from './ui/textarea';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Circle,
  FileText,
  Brain,
  Package,
  Send,
  User,
  Building,
  MapPin,
  Plus,
  Trash2,
  Edit,
  Download
} from 'lucide-react';

// Mock requirements data - same as in RequirementDetails
const mockRequirements = [
  {
    id: "CL000001",
    customerName: "Tech Corp India",
    customerId: "TC00001",
    status: "Draft",
    requestType: "Upload Requirement",
    title: "Enterprise Cloud Migration",
    priority: "High",
    location: "Mumbai",
    contractTerm: "3 Years",
    currentStage: 1 // Customer & Requirement Details
  },
  {
    id: "CL000002",
    customerName: "Cloud Innovations Pvt",
    customerId: "CI003",
    status: "Proposal Accepted",
    requestType: "Upload Requirement", 
    title: "Digital Transformation Suite",
    priority: "High",
    location: "Bangalore",
    contractTerm: "5 Years",
    currentStage: 5 // Completed all stages
  },
  {
    id: "CL000003",
    customerName: "StartUp Dynamics",
    customerId: "SD004",
    status: "Solutioning",
    requestType: "Upload Requirement",
    title: "Serverless Application Platform",
    priority: "Medium",
    location: "Delhi",
    contractTerm: "2 Years",
    currentStage: 3 // Solution Document Editor
  },
  {
    id: "CL000005",
    customerName: "Digital Solutions Ltd",
    customerId: "DS002",
    status: "In Progress",
    requestType: "Upload Requirement",
    title: "Network Infrastructure Upgrade",
    priority: "Medium",
    location: "Mumbai",
    contractTerm: "3 Years",
    currentStage: 2 // AI Solution Analysis
  }
];

interface StepperStep {
  id: number;
  title: string;
  description: string;
  icon: any;
  completed: boolean;
  current: boolean;
}

interface BOMItem {
  id: string;
  category: 'Network' | 'Compute' | 'PAAS' | 'Storage' | 'Security';
  sku: string;
  name: string;
  specifications: string;
  quantity: number;
  otc: number;
  arc: number;
  billingPattern: string;
  warrantyClause: string;
  noticePeriod: string;
}

const mockBOMItems: BOMItem[] = [
  {
    id: '1',
    category: 'Compute',
    sku: 'VM-STANDARD-D4',
    name: 'Virtual Machine - Standard D4',
    specifications: '4 vCPUs, 16GB RAM, 100GB SSD',
    quantity: 10,
    otc: 5000,
    arc: 12000,
    billingPattern: 'Monthly',
    warrantyClause: '99.9% SLA',
    noticePeriod: '30 days'
  },
  {
    id: '2',
    category: 'Storage',
    sku: 'BLOCK-STORAGE-SSD',
    name: 'Block Storage SSD',
    specifications: '1TB SSD, 10000 IOPS',
    quantity: 200,
    otc: 0,
    arc: 400,
    billingPattern: 'Monthly',
    warrantyClause: '99.99% availability',
    noticePeriod: '7 days'
  },
  {
    id: '3',
    category: 'Network',
    sku: 'LOAD-BALANCER-APP',
    name: 'Application Load Balancer',
    specifications: 'Layer 7, SSL termination, Health checks',
    quantity: 2,
    otc: 2000,
    arc: 8000,
    billingPattern: 'Monthly',
    warrantyClause: '99.95% uptime',
    noticePeriod: '30 days'
  },
  {
    id: '4',
    category: 'Security',
    sku: 'WAF-ENTERPRISE',
    name: 'Web Application Firewall',
    specifications: 'DDoS protection, Custom rules, 24/7 monitoring',
    quantity: 1,
    otc: 5000,
    arc: 25000,
    billingPattern: 'Monthly',
    warrantyClause: 'Enterprise support',
    noticePeriod: '60 days'
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

export function EditRequirement() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find the requirement
  const requirement = mockRequirements.find(req => req.id === id);
  
  // BOM Management states
  const [bomItems, setBomItems] = useState<BOMItem[]>(mockBOMItems);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [billingTerms, setBillingTerms] = useState({
    general: 'Standard billing terms apply',
    network: 'Network services billed monthly in advance',
    compute: 'Compute resources billed monthly in arrears',
    storage: 'Storage billed based on actual usage',
    security: 'Security services billed quarterly in advance'
  });
  
  if (!requirement) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <Card>
          <CardContent className="p-6 text-center">
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

  const [currentStage, setCurrentStage] = useState(4); // Set to BOM Management stage

  // Define the steps for Upload Requirement workflow
  const steps: StepperStep[] = [
    {
      id: 1,
      title: "Customer & Requirement Details",
      description: "Basic customer information and requirement specifications",
      icon: User,
      completed: true,
      current: false
    },
    {
      id: 2,
      title: "AI Solution Analysis",
      description: "AI-powered analysis of requirements and solution matching",
      icon: Brain,
      completed: true,
      current: false
    },
    {
      id: 3,
      title: "Solution Document Editor",
      description: "Create and edit technical solution documentation",
      icon: FileText,
      completed: true,
      current: false
    },
    {
      id: 4,
      title: "BOM Management",
      description: "Bill of Materials configuration and pricing",
      icon: Package,
      completed: false,
      current: true
    },
    {
      id: 5,
      title: "Proposal Generation",
      description: "Generate and finalize customer proposals",
      icon: Send,
      completed: false,
      current: false
    }
  ];

  const handleStageNavigation = (stageId: number) => {
    // Only allow navigation to current stage or completed stages
    if (stageId <= currentStage) {
      switch (stageId) {
        case 1:
          navigate(`/requirement/${id}`);
          break;
        case 2:
          navigate(`/requirement/${id}`);
          break;
        case 3:
          navigate(`/solution-editor/${id}`);
          break;
        case 4:
          navigate(`/bom/${id}`);
          break;
        case 5:
          navigate(`/proposal/${id}`);
          break;
        default:
          navigate(`/requirement/${id}`);
      }
    }
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

  // BOM Management functions
  const updateQuantity = (itemId: string, quantity: number) => {
    setBomItems(bomItems.map(item => 
      item.id === itemId ? { ...item, quantity: Math.max(0, quantity) } : item
    ));
  };

  const updatePricing = (itemId: string, field: 'otc' | 'arc', value: number) => {
    setBomItems(bomItems.map(item => 
      item.id === itemId ? { ...item, [field]: Math.max(0, value) } : item
    ));
  };

  const removeItem = (itemId: string) => {
    setBomItems(bomItems.filter(item => item.id !== itemId));
  };

  const getTotalOTC = () => {
    return bomItems.reduce((total, item) => total + (item.otc * item.quantity), 0);
  };

  const getTotalARC = () => {
    return bomItems.reduce((total, item) => total + (item.arc * item.quantity), 0);
  };

  const getCategoryTotal = (category: string) => {
    const categoryItems = bomItems.filter(item => item.category === category);
    return {
      otc: categoryItems.reduce((total, item) => total + (item.otc * item.quantity), 0),
      arc: categoryItems.reduce((total, item) => total + (item.arc * item.quantity), 0)
    };
  };

  const categories = ['Network', 'Compute', 'PAAS', 'Storage', 'Security'];

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
              Edit Requirement - {requirement.id}
            </h1>
            <p className="text-gray-600 mt-1">
              {requirement.title} • {requirement.customerName}
            </p>
          </div>
        </div>
        <Badge className={`${getStatusColor(requirement.status)}`}>
          {requirement.status}
        </Badge>
      </div>

      {/* Requirement Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="w-5 h-5" />
            <span>Requirement Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Customer</label>
              <p className="font-medium">{requirement.customerName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Customer ID</label>
              <p className="font-medium">{requirement.customerId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Priority</label>
              <Badge variant="outline" className="text-xs">
                {requirement.priority}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Contract Term</label>
              <p className="font-medium">{requirement.contractTerm}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Location</label>
              <p className="font-medium flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {requirement.location}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Request Type</label>
              <p className="font-medium">{requirement.requestType}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Current Status</label>
              <Badge className={`${getStatusColor(requirement.status)}`}>
                {requirement.status}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Current Stage</label>
              <p className="font-medium">{steps.find(s => s.id === currentStage)?.title}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stepper */}
      <Card>
        <CardHeader>
          <CardTitle>Requirement Workflow Steps</CardTitle>
          <CardDescription>
            Click on any accessible step to navigate and continue editing
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    {/* Step Circle */}
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors cursor-pointer ${
                        step.completed 
                          ? 'bg-green-500 border-green-500 text-white hover:bg-green-600' 
                          : step.current 
                          ? 'bg-blue-500 border-blue-500 text-white' 
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}
                      onClick={() => handleStageNavigation(step.id)}
                    >
                      {step.completed ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        React.createElement(step.icon, { className: "w-5 h-5" })
                      )}
                    </div>
                    
                    {/* Step Info */}
                    <div className="mt-3 text-center">
                      <p className={`text-sm font-medium ${
                        step.current ? 'text-blue-600' : step.completed ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </p>
                      {step.current && (
                        <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 mt-1">
                          Current
                        </Badge>
                      )}
                      {step.completed && (
                        <Badge variant="outline" className="text-xs bg-green-100 text-green-700 mt-1">
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="flex-1 mx-4">
                      <div className={`h-0.5 transition-colors ${
                        step.completed ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>


        </CardContent>
      </Card>

      {/* BOM Management Content */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div>
            <h2 className="text-xl font-semibold">BOM Management</h2>
            <p className="text-gray-600">Manage Bill of Materials and configure pricing</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setShowAddProduct(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product from catalogue
          </Button>
          <Button variant="outline" onClick={() => {
            // Mock download functionality
            const link = document.createElement('a');
            link.href = '#';
            link.download = 'product-catalogues.pdf';
            link.click();
          }}>
            <Download className="w-4 h-4 mr-2" />
            Download Product Catalogues
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Total OTC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(getTotalOTC())}</div>
            <p className="text-sm text-gray-600">One-time costs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Monthly ARC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(getTotalARC())}</div>
            <p className="text-sm text-gray-600">Recurring monthly costs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Annual Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(getTotalOTC() + getTotalARC() * 12)}</div>
            <p className="text-sm text-gray-600">Total cost year 1</p>
          </CardContent>
        </Card>
      </div>

      {/* BOM Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Bill of Materials</CardTitle>
          <CardDescription>Configure products, quantities, and pricing</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Specifications</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>OTC (₹)</TableHead>
                <TableHead>ARC (₹)</TableHead>
                <TableHead>Total (₹)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bomItems.map(item => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-sm text-gray-600">{item.specifications}</TableCell>
                  <TableCell>
                    {editingItem === item.id ? (
                      <Input 
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                        className="w-20"
                      />
                    ) : (
                      <span>{item.quantity}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingItem === item.id ? (
                      <Input 
                        type="number"
                        value={item.otc}
                        onChange={(e) => updatePricing(item.id, 'otc', parseInt(e.target.value) || 0)}
                        className="w-24"
                      />
                    ) : (
                      formatCurrency(item.otc)
                    )}
                  </TableCell>
                  <TableCell>
                    {editingItem === item.id ? (
                      <Input 
                        type="number"
                        value={item.arc}
                        onChange={(e) => updatePricing(item.id, 'arc', parseInt(e.target.value) || 0)}
                        className="w-24"
                      />
                    ) : (
                      formatCurrency(item.arc)
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency((item.otc + item.arc * 12) * item.quantity)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setEditingItem(editingItem === item.id ? null : item.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Category Totals */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Category-wise Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {categories.map(category => {
              const total = getCategoryTotal(category);
              return (
                <div key={category} className="p-3 border rounded-lg">
                  <div className="font-medium text-sm mb-1">{category}</div>
                  <div className="text-xs text-gray-600">
                    OTC: {formatCurrency(total.otc)}
                  </div>
                  <div className="text-xs text-gray-600">
                    ARC: {formatCurrency(total.arc)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Billing Terms */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Terms & Conditions</CardTitle>
          <CardDescription>Configure billing terms by category and organization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">General Terms</label>
            <Textarea 
              value={billingTerms.general}
              onChange={(e) => setBillingTerms({...billingTerms, general: e.target.value})}
              className="mt-1"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(billingTerms).filter(([key]) => key !== 'general').map(([category, terms]) => (
              <div key={category}>
                <label className="text-sm font-medium capitalize">{category}</label>
                <Textarea 
                  value={terms}
                  onChange={(e) => setBillingTerms({...billingTerms, [category]: e.target.value})}
                  className="mt-1"
                  rows={2}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button onClick={() => navigate(`/pricing/${id}`)}>
         Next
        </Button>
      </div>
    </div>
  );
}
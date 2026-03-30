import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Upload, Search, ArrowLeft, ArrowRight, Bot, FileText, Loader2, AlertCircle, Check, CheckCircle, Eye, Plus, Building2, ChevronDown, ChevronUp, Edit3, Save, Trash2, Download, Send, DollarSign, Users, X, Star, MapPin, Bold, Italic, Underline, Strikethrough, Link, Image, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, Indent, Outdent, Type, Palette, Copy, Filter, Minus, Activity, Calendar, User, Building, History, FileDown, BookOpen, Brain, Zap, Clock, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import svgPaths from '../imports/svg-hjqzlsq1sd';
import importedSvgPaths from '../imports/svg-p567pv2j4g';
import { toast } from "sonner";

interface CustomerInfo {
  type: 'existing' | 'new-prospect' | 'existing-prospect';
  name: string;
  id: string;
  businessType: string;
  address: string;
  gst: string;
  pan: string;
  contactPersonName: string;
  contactEmail: string;
}

interface RequirementInfo {
  name: string;
  contractTerms: string;
  priority: 'high' | 'medium' | 'low';
  location: string;
  drRequired: boolean;
  paymentModel: 'payg' | 'reserved';
  timeline: string;
  budgetRange: string;
  description: string;
  document?: File;
}

interface AIAnalysisResult {
  architecture: string;
  resourcePlanning: string;
  security: string;
  costOptimization: string;
  solutionDocument: string;
  billOfMaterials: any[];
  processingSuccess: boolean;
  requiresManualQualification: boolean;
}

interface AnalysisStep {
  id: string;
  title: string;
  completed: boolean;
  inProgress: boolean;
  estimatedTime?: string;
}

interface NewProspectForm {
  companyName: string;
  businessType: string;
  contactPersonName: string;
  contactEmail: string;
  contactPhone: string;
  city: string;
}

interface BOMItem {
  id: string;
  category: string;
  sku: string;
  specification: string;
  quantity: number;
  otc: number;
  arc: number;
  editable: boolean;
}

interface SolutionSection {
  id: string;
  number: number;
  title: string;
  content: string;
  lastModified: string;
  author: string;
  preview: string;
  version: number;
  wordCount: number;
}

interface SolutionArchitect {
  id: string;
  name: string;
  email: string;
  rating: number;
  expertise: string[];
  location: string;
  experience: string;
  initials: string;
  workload: number;
  availability: 'available' | 'busy' | 'overloaded';
  complexityScore: number;
  locationMatch: boolean;
}

interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  type: 'standard' | 'industry';
  complexity: 'low' | 'medium' | 'high';
  sections: number;
  uses: number;
  rating: number;
  tags: string[];
  featured: boolean;
}

interface DocumentVersion {
  id: string;
  version: number;
  timestamp: string;
  author: string;
  changes: string;
  content: SolutionSection[];
}

interface FormData {
  panNumber: string;
  customerName: string;
  businessType: string;
  registeredAddress: string;
  gstNumber: string;
  industry: string;
  contactPerson: string;
  contactEmail: string;
  projectName: string;
  priority: string;
  contractTerm: string;
  projectTimeline: string;
  location: string;
  budget: string;
  description: string;
  uploadedFiles: any[];
  solutionDocument: string;
  bomItems: any[];
  pricingData: any;
  proposalData: any;
  billingTerms: any;
  contractConditions: any;
  approvalWorkflow: any;
}

interface ProcessingStage {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  processing: boolean;
  icon: any;
}

const mockCustomers = [
  { id: 'TC001', name: 'Tech Corp India', type: 'customer' },
  { id: 'DS002', name: 'Digital Solutions Ltd', type: 'customer' },
  { id: 'CI003', name: 'Cloud Innovations Pvt', type: 'customer' },
  { id: 'FS004', name: 'FinServ Technologies', type: 'customer' },
  { id: 'MS005', name: 'MedSoft Systems', type: 'customer' }
];

const mockProspects = [
  { id: 'P001', name: 'NextGen Startups', type: 'prospect' },
  { id: 'P002', name: 'Digital Transform Co', type: 'prospect' },
  { id: 'P003', name: 'Future AI Solutions', type: 'prospect' },
  { id: 'P004', name: 'Smart Manufacturing Inc', type: 'prospect' },
  { id: 'P005', name: 'CloudFirst Enterprises', type: 'prospect' }
];

const mockBOMItems: BOMItem[] = [
  {
    id: '1',
    category: 'Compute',
    sku: 'VM-STANDARD-D4',
    specification: 'Standard D4v3 (4 vcpus, 16 GiB memory)',
    quantity: 10,
    otc: 50000,
    arc: 120000,
    editable: true
  },
  {
    id: '2',
    category: 'Storage',
    sku: 'BLOCK-STORAGE-SSD',
    specification: 'Premium SSD Storage - 1TB',
    quantity: 200,
    otc: 0,
    arc: 80000,
    editable: true
  },
  {
    id: '3',
    category: 'Network',
    sku: 'LOAD-BALANCER',
    specification: 'Application Load Balancer',
    quantity: 2,
    otc: 10000,
    arc: 25000,
    editable: true
  },
  {
    id: '4',
    category: 'Security',
    sku: 'FIREWALL-BASIC',
    specification: 'Basic Firewall Protection',
    quantity: 1,
    otc: 15000,
    arc: 30000,
    editable: true
  }
];

const mockTemplates: DocumentTemplate[] = [
  {
    id: '1',
    name: 'Enterprise Cloud Migration',
    description: 'Comprehensive template for large-scale enterprise cloud migration projects',
    category: 'Cloud Infrastructure',
    type: 'standard',
    complexity: 'high',
    sections: 7,
    uses: 45,
    rating: 4.8,
    tags: ['enterprise', 'migration', 'cloud'],
    featured: true
  },
  {
    id: '2',
    name: 'Financial Services Cloud',
    description: 'Specialized template for financial services with compliance focus',
    category: 'Financial Services',
    type: 'industry',
    complexity: 'high',
    sections: 7,
    uses: 23,
    rating: 4.9,
    tags: ['financial', 'compliance', 'security'],
    featured: true
  },
  {
    id: '3',
    name: 'Startup Cloud Foundation',
    description: 'Quick-start template for small to medium businesses',
    category: 'Small Business',
    type: 'standard',
    complexity: 'low',
    sections: 5,
    uses: 78,
    rating: 4.6,
    tags: ['startup', 'foundation', 'basic'],
    featured: false
  }
];

const mockArchitects: SolutionArchitect[] = [
  {
    id: '1',
    name: 'Alex Rodriguez',
    email: 'alex.rodriguez@onesify.com',
    rating: 4.8,
    expertise: ['Cloud Architecture', 'AWS', 'Kubernetes'],
    location: 'Mumbai',
    experience: '8 years',
    initials: 'AR',
    workload: 65,
    availability: 'available',
    complexityScore: 9.2,
    locationMatch: true
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya.sharma@onesify.com',
    rating: 4.9,
    expertise: ['Azure', 'DevOps', 'Microservices'],
    location: 'Bangalore',
    experience: '6 years',
    initials: 'PS',
    workload: 45,
    availability: 'available',
    complexityScore: 8.7,
    locationMatch: false
  },
  {
    id: '3',
    name: 'Raj Patel',
    email: 'raj.patel@onesify.com',
    rating: 4.7,
    expertise: ['GCP', 'Data Engineering', 'ML'],
    location: 'Delhi',
    experience: '7 years',
    initials: 'RP',
    workload: 85,
    availability: 'busy',
    complexityScore: 8.9,
    locationMatch: false
  }
];

// Predefined standard sections as per requirements
const defaultSections: SolutionSection[] = [
  {
    id: '1',
    number: 1,
    title: 'Executive Summary',
    content: 'This comprehensive cloud solution addresses the technical requirements outlined in the customer\'s RFP. Our proposed architecture leverages modern cloud-native technologies to deliver a scalable, secure, and cost-effective infrastructure solution that meets your organization\'s current needs while providing the flexibility to grow with your business.',
    lastModified: '2024-12-28 10:30',
    author: 'AI System',
    preview: 'This comprehensive cloud solution addresses the technical requirements outlined in the customer\'s RFP...',
    version: 1,
    wordCount: 47
  },
  {
    id: '2',
    number: 2, 
    title: 'Proposed Solution Architecture & Key Components',
    content: 'This section outlines the strategic architectural blueprint for delivering a robust, scalable, and secure cloud solution tailored to your organization\'s evolving requirements. Our proposed architecture leverages industry best practices and leading cloud technologies to ensure optimal performance, cost-efficiency, and future adaptability.\n\nAt the core of this solution lies a modular design approach, enabling seamless integration with your existing systems while providing the flexibility to incorporate new functionalities as your needs grow. The architecture is envisioned as a series of interconnected layers, each responsible for a specific set of services, from data ingestion and processing to application delivery and security.\n\nKey Architectural Principles Guiding Our Design:\n• Scalability & Elasticity: Designed to automatically adjust resources based on demand, ensuring consistent performance during peak loads and cost optimization during quieter periods.\n• Security & Compliance: Built with a security-first mindset, incorporating robust encryption, access controls, and adherence to relevant industry compliance standards.\n• High Availability & Disaster Recovery: Engineered for resilience, minimizing downtime and ensuring business continuity through redundant infrastructure and comprehensive disaster recovery protocols.',
    lastModified: '2024-12-28 10:30',
    author: 'Current User',
    preview: 'This section outlines the strategic architectural blueprint for delivering a robust, scalable...',
    version: 2,
    wordCount: 156
  },
  {
    id: '3',
    number: 3,
    title: 'Implementation Plan',
    content: 'Phase 1: Infrastructure Setup (Weeks 1-2)\n- Deploy core networking and security components\n- Set up monitoring and logging infrastructure\n- Configure identity and access management\n\nPhase 2: Application Deployment (Weeks 3-4)\n- Deploy containerized applications\n- Configure load balancing and auto-scaling\n- Implement CI/CD pipelines\n\nPhase 3: Testing & Go-Live (Weeks 5-6)\n- Performance testing and optimization\n- User acceptance testing\n- Production deployment and cutover',
    lastModified: '2024-12-28 10:30',
    author: 'AI System',
    preview: 'Phase 1: Infrastructure Setup (Weeks 1-2) Deploy core networking and security components...',
    version: 1,
    wordCount: 82
  },
  {
    id: '4',
    number: 4,
    title: 'Proposed Solution on Product Compute',
    content: 'Our compute solution leverages scalable virtual machines and containerized services to provide optimal performance for your workloads. The architecture includes auto-scaling groups, load balancers, and high-performance computing instances tailored to your application requirements.\n\nKey Features:\n• Auto-scaling based on demand\n• Multiple instance types for different workloads\n• Container orchestration with Kubernetes\n• GPU instances for AI/ML workloads',
    lastModified: '2024-12-28 10:30',
    author: 'AI System',
    preview: 'Our compute solution leverages scalable virtual machines and containerized services...',
    version: 1,
    wordCount: 65
  },
  {
    id: '5',
    number: 5,
    title: 'Network Architecture',
    content: 'The network architecture provides secure, high-performance connectivity with redundant paths and intelligent traffic routing. Our design includes VPC isolation, private subnets, and dedicated network connections for critical applications.\n\nComponents:\n• Virtual Private Cloud (VPC) with multiple availability zones\n• Content Delivery Network (CDN) for global performance\n• VPN and Direct Connect options\n• Network security groups and NACLs',
    lastModified: '2024-12-28 10:30',
    author: 'AI System',
    preview: 'The network architecture provides secure, high-performance connectivity with redundant paths...',
    version: 1,
    wordCount: 58
  },
  {
    id: '6',
    number: 6,
    title: 'Platform as a Service (PaaS)',
    content: 'Our PaaS offerings provide managed services that reduce operational overhead while maintaining high availability and performance. These services include managed databases, application hosting platforms, and development tools.\n\nPaaS Services:\n• Managed database services (SQL, NoSQL)\n• Application hosting and serverless functions\n• API management and integration services\n• Development and deployment tools',
    lastModified: '2024-12-28 10:30',
    author: 'AI System',
    preview: 'Our PaaS offerings provide managed services that reduce operational overhead...',
    version: 1,
    wordCount: 52
  },
  {
    id: '7',
    number: 7,
    title: 'Storage Solution',
    content: 'The storage architecture provides scalable, secure, and cost-effective data storage across multiple tiers. Our solution includes block storage, object storage, and archival options to meet diverse data requirements.\n\nStorage Components:\n• High-performance SSD block storage\n• Scalable object storage with lifecycle policies\n• Cold storage for archival and backup\n• Data encryption at rest and in transit',
    lastModified: '2024-12-28 10:30',
    author: 'AI System',
    preview: 'The storage architecture provides scalable, secure, and cost-effective data storage...',
    version: 1,
    wordCount: 48
  },
  {
    id: '8',
    number: 8,
    title: 'Security Framework',
    content: 'Comprehensive security controls and compliance framework including identity management, data protection, network security, and monitoring capabilities. Our security-first approach ensures protection against modern threats while maintaining compliance with industry standards.\n\nSecurity Features:\n• Multi-factor authentication and SSO\n• End-to-end encryption\n• Security monitoring and SIEM\n• Compliance with SOC2, ISO 27001, GDPR',
    lastModified: '2024-12-28 10:30',
    author: 'AI System',
    preview: 'Comprehensive security controls and compliance framework including identity management...',
    version: 1,
    wordCount: 62
  }
];

const mockPricingData = {
  subtotal: 63500,
  volumeDiscount: 5100,
  partnerDiscount: 1270,
  totalDiscount: 6370,
  beforeTax: 57130,
  cgst: 5142,
  sgst: 5142,
  igst: 0,
  totalTax: 10284,
  total: 67414,
  margin: 28,
  marginAmount: 18876,
  customerPrice: 86290,
  profitMargin: 18876,
  currency: 'INR'
};

const defaultBillingTerms = {
  paymentTerms: '30-days',
  billingFrequency: 'monthly',
  paymentMethods: ['bank-transfer', 'cheque'],
  lateFeePercent: 2,
  lateFeeGracePeriod: 7,
  advancePayment: false,
  advancePaymentPercent: 0,
  creditLimit: 0,
  autoRenewal: true,
  renewalNoticePeriod: 30,
  priceChangeNotice: 60,
  currency: 'INR',
  billingAddress: '',
  invoiceDeliveryMethod: 'email',
  taxCompliance: 'gst-inclusive',
  disputeResolution: 'arbitration'
};

const processingStages: ProcessingStage[] = [
  {
    id: 'requirement-analysis',
    title: 'Requirement Analysis',
    description: 'Analyzing uploaded documents and project requirements',
    completed: false,
    processing: false,
    icon: FileText
  },
  {
    id: 'solution-matching',
    title: 'Solution Matching', 
    description: 'Matching requirements with available cloud services',
    completed: false,
    processing: false,
    icon: Search
  },
  {
    id: 'architecture-design',
    title: 'Architecture Design',
    description: 'Creating optimal cloud architecture blueprint',
    completed: false,
    processing: false,
    icon: Brain
  },
  {
    id: 'pricing-calculation',
    title: 'Pricing Calculation',
    description: 'Calculating costs and generating pricing models',
    completed: false,
    processing: false,
    icon: DollarSign
  },
  {
    id: 'document-generation',
    title: 'Document Generation',
    description: 'Creating technical documentation and proposals',
    completed: false,
    processing: false,
    icon: BookOpen
  }
];

export function NewRequirement() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStage, setCurrentStage] = useState(1);
  
  // Check if we're in edit mode (re-uploading requirements)
  const isEditMode = location.state?.editMode || false;
  const requirementId = location.state?.requirementId || null;
  const [customerDetailsOpen, setCustomerDetailsOpen] = useState(false);
  const [requirementDetailsOpen, setRequirementDetailsOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    type: 'existing',
    name: '',
    id: '',
    businessType: '',
    address: '',
    gst: '',
    pan: '',
    contactPersonName: '',
    contactEmail: ''
  });
  const [newProspectForm, setNewProspectForm] = useState<NewProspectForm>({
    companyName: '',
    businessType: '',
    contactPersonName: '',
    contactEmail: '',
    contactPhone: '',
    city: ''
  });
  const [requirementInfo, setRequirementInfo] = useState<RequirementInfo>({
    name: '',
    contractTerms: '',
    priority: 'medium',
    location: '',
    drRequired: false,
    paymentModel: 'payg',
    timeline: '',
    budgetRange: '',
    description: '',
    document: undefined
  });
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [bomItems, setBomItems] = useState<BOMItem[]>(mockBOMItems);
  
  // Solution Editor States
  const [sections, setSections] = useState<SolutionSection[]>(defaultSections);
  const [activeSection, setActiveSection] = useState('2');
  const [assignSA, setAssignSA] = useState(false);
  const [showAssignmentDialog, setShowAssignmentDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showRequirementDetails, setShowRequirementDetails] = useState(false);
  const [selectedArchitects, setSelectedArchitects] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState('all');
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [templateSearch, setTemplateSearch] = useState('');
  const [templateCategory, setTemplateCategory] = useState('all');
  const [activeTemplateTab, setActiveTemplateTab] = useState('browse');
  const [documentVersion, setDocumentVersion] = useState(1);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState(new Date());
  const [aiAssignmentScore, setAiAssignmentScore] = useState<any>(null);
  const [formData, setFormData] = useState<FormData>({
    panNumber: '',
    customerName: '',
    businessType: '',
    registeredAddress: '',
    gstNumber: '',
    industry: '',
    contactPerson: '',
    contactEmail: '',
    projectName: '',
    priority: '',
    contractTerm: '',
    projectTimeline: '',
    location: '',
    budget: '',
    description: '',
    uploadedFiles: [],
    solutionDocument: '',
    bomItems: [],
    pricingData: mockPricingData,
    proposalData: {},
    billingTerms: defaultBillingTerms,
    contractConditions: {},
    approvalWorkflow: {}
  });

   const handlePANChange = (pan: string) => {
    const cleanPAN = pan.replace(/[^A-Z0-9]/g, '');
    setFormData(prev => ({ ...prev, panNumber: cleanPAN }));
    
    if (cleanPAN.length === 10) {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (panRegex.test(cleanPAN)) {
        setFormData(prev => ({
          ...prev,
          customerName: 'TechCorp Solutions Pvt Ltd',
          businessType: 'Private Limited Company',
          registeredAddress: '123 Business District, Tech Park, Mumbai 400001',
          gstNumber: '27' + cleanPAN + '1ZD'
        }));
        toast.success("Company details auto-populated from PAN database");
      } else {
        toast.error("Invalid PAN format");
      }
    }
  };
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>([
    { id: 'processing', title: 'Processing Requirements', completed: false, inProgress: false },
    { id: 'analyzing', title: 'Analyzing Infrastructure Needs', completed: false, inProgress: false },
    { id: 'generating', title: 'Generating Solution Architecture', completed: false, inProgress: false },
    { id: 'creating', title: 'Creating BOM', completed: false, inProgress: false },
    { id: 'finalizing', title: 'Finalizing Solution Document', completed: false, inProgress: false, estimatedTime: '1 min' }
  ]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      let filtered: any[] = [];
      
      if (customerInfo.type === 'existing') {
        filtered = mockCustomers.filter(customer => 
          customer.name.toLowerCase().includes(query.toLowerCase())
        );
      } else if (customerInfo.type === 'existing-prospect') {
        filtered = mockProspects.filter(prospect => 
          prospect.name.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      setFilteredResults(filtered);
      setShowSearchResults(true);
    } else {
      setFilteredResults([]);
      setShowSearchResults(false);
    }
  };

  const selectEntity = (entity: any) => {
    setCustomerInfo({
      ...customerInfo,
      name: entity.name,
      id: entity.id,
      // Mock additional data based on type
      businessType: entity.type === 'customer' ? 'Enterprise' : 'Technology',
      address: 'Mumbai, Maharashtra',
      gst: entity.type === 'customer' ? '27AABCU9603R1Z1' : '',
      pan: entity.type === 'customer' ? 'AABCU9603R' : '',
      contactPersonName: 'John Smith',
      contactEmail: 'john.smith@' + entity.name.toLowerCase().replace(/\s+/g, '') + '.com'
    });
    setSearchQuery(entity.name);
    setShowSearchResults(false);
  };

  const addNewProspect = () => {
    // Validate required fields
    if (!newProspectForm.companyName || !newProspectForm.contactPersonName || !newProspectForm.contactEmail) {
      alert('Please fill in all required fields');
      return;
    }

    // Create new prospect with form data
    const newProspectId = `P${String(mockProspects.length + 1).padStart(3, '0')}`;
    setCustomerInfo({
      type: 'new-prospect',
      name: newProspectForm.companyName,
      id: newProspectId,
      businessType: newProspectForm.businessType,
      address: newProspectForm.city,
      gst: '',
      pan: '',
      contactPersonName: newProspectForm.contactPersonName,
      contactEmail: newProspectForm.contactEmail
    });
    
    // Reset the form
    setNewProspectForm({
      companyName: '',
      businessType: '',
      contactPersonName: '',
      contactEmail: '',
      contactPhone: '',
      city: ''
    });
  };

  const handleCustomerTypeChange = (value: 'existing' | 'new-prospect' | 'existing-prospect') => {
    setCustomerInfo({
      type: value,
      name: '',
      id: '',
      businessType: '',
      address: '',
      gst: '',
      pan: '',
      contactPersonName: '',
      contactEmail: ''
    });
    setSearchQuery('');
    setShowSearchResults(false);
    // Reset new prospect form when changing types
    setNewProspectForm({
      companyName: '',
      businessType: '',
      contactPersonName: '',
      contactEmail: '',
      contactPhone: '',
      city: ''
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
      setRequirementInfo({ ...requirementInfo, document: file });
    } else {
      alert('Please upload only Excel files (.xls or .xlsx)');
    }
  };

  const updateBOMItem = (id: string, field: string, value: number) => {
    setBomItems(items => 
      items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const calculateTotals = () => {
    const totalOTC = bomItems.reduce((sum, item) => sum + item.otc, 0);
    const totalARC = bomItems.reduce((sum, item) => sum + item.arc, 0);
    return { totalOTC, totalARC };
  };

  const getCategoryTotals = () => {
    const categories = [...new Set(bomItems.map(item => item.category))];
    return categories.map(category => {
      const categoryItems = bomItems.filter(item => item.category === category);
      const otc = categoryItems.reduce((sum, item) => sum + item.otc, 0);
      const arc = categoryItems.reduce((sum, item) => sum + item.arc, 0);
      return { category, otc, arc };
    });
  };

  // Solution Editor Functions
  const getCurrentSection = () => {
    return sections.find(s => s.id === activeSection) || sections[0];
  };

  const updateSection = (sectionId: string, content: string) => {
    const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            content, 
            lastModified: new Date().toLocaleString(),
            author: 'Current User',
            preview: content.substring(0, 80) + '...',
            version: section.version + 1,
            wordCount
          }
        : section
    ));
    
    // Auto-save functionality
    if (autoSaveEnabled) {
      setLastSaved(new Date());
    }
  };

  const addNewSection = () => {
    const newSection: SolutionSection = {
      id: Date.now().toString(),
      number: sections.length + 1,
      title: `Section ${sections.length + 1}`,
      content: '',
      lastModified: new Date().toLocaleString(),
      author: 'Current User',
      preview: 'Preview of the first few lines of the description will be displayed here for re',
      version: 1,
      wordCount: 0
    };
    setSections([...sections, newSection]);
  };



  const deleteSection = (sectionId: string) => {
    if (sections.length <= 1) return; // Don't delete if only one section left
    setSections(sections.filter(s => s.id !== sectionId));
  };

  const toggleArchitect = (architectId: string) => {
    setSelectedArchitects(prev => 
      prev.includes(architectId) 
        ? prev.filter(id => id !== architectId)
        : [...prev, architectId]
    );
  };

  const filteredArchitects = locationFilter === 'all' 
    ? mockArchitects 
    : mockArchitects.filter(architect => architect.location.toLowerCase() === locationFilter);

  // AI-powered SA assignment logic
  const calculateAIAssignmentScore = () => {
    const requirement = requirementInfo;
    const customer = customerInfo;
    
    // Calculate complexity factors
    const complexityFactors = {
      budgetComplexity: requirement.budgetRange.includes('₹75L') ? 'high' : requirement.budgetRange.includes('₹50L') ? 'medium' : 'low',
      timelineComplexity: requirement.timeline.includes('6 months') ? 'medium' : requirement.timeline.includes('12 months') ? 'low' : 'high',
      drComplexity: requirement.drRequired ? 'high' : 'low',
      priorityComplexity: requirement.priority
    };
    
    // Score architects based on complexity and location match
    const scoredArchitects = mockArchitects.map(architect => {
      let score = architect.rating * 20; // Base score from rating
      
      // Location match bonus
      if (architect.location.toLowerCase() === requirement.location.toLowerCase()) {
        score += 15;
        architect.locationMatch = true;
      }
      
      // Availability penalty
      if (architect.availability === 'busy') score -= 10;
      if (architect.availability === 'overloaded') score -= 20;
      
      // Workload penalty
      score -= (architect.workload / 100) * 10;
      
      // Complexity match bonus
      if (complexityFactors.budgetComplexity === 'high' && architect.expertise.includes('Enterprise')) score += 10;
      if (complexityFactors.drComplexity === 'high' && architect.expertise.includes('Cloud Architecture')) score += 10;
      
      architect.complexityScore = Math.round(score * 10) / 10;
      return architect;
    });
    
    return {
      recommended: scoredArchitects.sort((a, b) => b.complexityScore - a.complexityScore)[0],
      allScored: scoredArchitects,
      complexityFactors,
      needsAssignment: complexityFactors.budgetComplexity === 'high' || complexityFactors.priorityComplexity === 'high'
    };
  };

  const assignArchitects = () => {
    if (selectedArchitects.length === 0) {
      alert('Please select at least one Solution Architect');
      return;
    }
    setAssignSA(true);
    setShowAssignmentDialog(false);
    const assignedNames = selectedArchitects.map(id => {
      const architect = mockArchitects.find(a => a.id === id);
      return architect?.name;
    }).join(', ');
    alert(`Successfully assigned Solution Architect(s): ${assignedNames}`);
  };

  const applyTemplate = (templateId: string) => {
    const template = mockTemplates.find(t => t.id === templateId);
    if (template) {
      // Here you would load template content into sections
      alert(`Applied template: ${template.name}`);
      setShowTemplateDialog(false);
      setDocumentVersion(prev => prev + 1);
    }
  };

  const exportDocument = () => {
    // Mock export functionality with format selection
    const content = sections.map(s => `${s.title}\n${s.content}`).join('\n\n');
    const formats = ['PDF', 'Word', 'HTML'];
    const selectedFormat = prompt(`Select export format:\n${formats.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\nEnter number (1-3):`);
    
    if (selectedFormat && ['1', '2', '3'].includes(selectedFormat)) {
      const format = formats[parseInt(selectedFormat) - 1];
      alert(`Exporting document as ${format}...\n\nContent preview:\n${content.substring(0, 200)}...`);
    }
  };

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
                         template.description.toLowerCase().includes(templateSearch.toLowerCase());
    const matchesCategory = templateCategory === 'all' || template.category === templateCategory;
    return matchesSearch && matchesCategory;
  });

  const getWorkloadColor = (workload: number) => {
    if (workload <= 50) return 'text-green-600';
    if (workload <= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getWorkloadBadgeColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'overloaded': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'standard': return 'bg-blue-100 text-blue-800';
      case 'industry': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Auto-start AI analysis when entering stage 2
  useEffect(() => {
    if (currentStage === 2 && !isProcessing && !aiAnalysis) {
      processAIAnalysis();
    }
  }, [currentStage, isProcessing, aiAnalysis]);

  // Progressive step completion animation
  useEffect(() => {
    if (isProcessing) {
      const stepTimings = [1500, 3000, 4500, 6000, 7500]; // Timing for each step
      
      stepTimings.forEach((timing, index) => {
        setTimeout(() => {
          setProcessingStagesList(prev => prev.map((stage, stageIndex) => ({
            ...stage,
            completed: stageIndex <= index,
            processing: stageIndex === index
          })));
          
          // Stop processing for the current stage when moving to next
          if (index > 0) {
            setTimeout(() => {
              setProcessingStagesList(prev => prev.map((stage, stageIndex) => ({
                ...stage,
                processing: stageIndex === index && index < stepTimings.length - 1
              })));
            }, 1000);
          }
        }, timing);
      });
      
      // Complete all processing after final step
      setTimeout(() => {
        setProcessingStagesList(prev => prev.map(stage => ({
          ...stage,
          completed: true,
          processing: false
        })));
        setIsProcessing(false);
      }, stepTimings[stepTimings.length - 1] + 1000);
    }
  }, [isProcessing]);

  // Auto-save effect
  useEffect(() => {
    if (autoSaveEnabled) {
      const interval = setInterval(() => {
        setLastSaved(new Date());
      }, 30000); // Auto-save every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [autoSaveEnabled]);

  const processAIAnalysis = async () => {
    setIsProcessing(true);
    
    // Reset processing stages
    setProcessingStagesList(prev => prev.map(stage => ({
      ...stage,
      completed: false,
      processing: false
    })));
    
    // Start first stage
    setTimeout(() => {
      setProcessingStagesList(prev => prev.map((stage, index) => ({
        ...stage,
        processing: index === 0
      })));
    }, 500);
    
    // Mock AI analysis result will be set when processing completes
    setTimeout(async () => {
      const mockAnalysis: AIAnalysisResult = {
        architecture: 'Multi-tier cloud architecture with load balancing and auto-scaling capabilities',
        resourcePlanning: 'Estimated 50 virtual machines, 200TB storage, high-availability setup',
        security: 'End-to-end encryption, VPN gateway, firewall rules, compliance with ISO 27001',
        costOptimization: 'Reserved instances recommended for 70% cost savings, spot instances for development',
        solutionDocument: 'Comprehensive solution document generated with technical specifications',
        billOfMaterials: [
          { category: 'Compute', sku: 'VM-STANDARD-D4', quantity: 10, otc: 50000, arc: 120000 },
          { category: 'Storage', sku: 'BLOCK-STORAGE-SSD', quantity: 200, otc: 0, arc: 80000 },
          { category: 'Network', sku: 'LOAD-BALANCER', quantity: 2, otc: 10000, arc: 25000 }
        ],
        processingSuccess: true,
        requiresManualQualification: false
      };
      
      setAiAnalysis(mockAnalysis);
      
      // Auto-advance to next stage after completion message shows
      setTimeout(() => {
        setCurrentStage(3);
      }, 3000);
    }, 8500); // Total time for all stages to complete
  };

  const stages = [
    { number: 1, title: 'Customer & Requirement Details', completed: currentStage > 1 },
    { number: 2, title: 'AI Solution Analysis', completed: currentStage > 2 },
    { number: 3, title: 'Solution Document Editor', completed: currentStage > 3 },
    { number: 4, title: 'BOM Management', completed: currentStage > 4 },
    { number: 5, title: 'Proposal Generation', completed: false }
  ];

  const CheckIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
      <path
        d={svgPaths.p20681140}
        stroke="#22C55E"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M9 11L12 14L22 4"
        stroke="#22C55E"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );

  const DocumentIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
      <path
        d={svgPaths.pb47f400}
        stroke="#2563EB"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d={svgPaths.p17a13100}
        stroke="#2563EB"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M10 9H8"
        stroke="#2563EB"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M16 13H8"
        stroke="#2563EB"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M16 17H8"
        stroke="#2563EB"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );

  const LoadingIcon = () => (
    <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
      <path
        d={svgPaths.p302f9c98}
        stroke="#2563EB"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );

  const getPlaceholderText = () => {
    switch (customerInfo.type) {
      case 'existing':
        return 'Search existing customers...';
      case 'existing-prospect':
        return 'Search existing prospects...';
      case 'new-prospect':
        return 'Enter new prospect company name...';
      default:
        return 'Enter company name...';
    }
  };

  const getBackgroundColor = () => {
    switch (customerInfo.type) {
      case 'existing':
        return 'bg-green-50 border-green-200';
      case 'existing-prospect':
        return 'bg-blue-50 border-blue-200';
      case 'new-prospect':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50';
    }
  };

  const getBadgeVariant = () => {
    switch (customerInfo.type) {
      case 'existing':
        return { className: 'bg-green-100 text-green-800', text: 'Customer' };
      case 'existing-prospect':
        return { className: 'bg-blue-100 text-blue-800', text: 'Existing Prospect' };
      case 'new-prospect':
        return { className: 'bg-purple-100 text-purple-800', text: 'New Prospect' };
      default:
        return { className: 'bg-gray-100 text-gray-800', text: 'Unknown' };
    }
  };

  const isNewProspectFormValid = () => {
    return newProspectForm.companyName && 
           newProspectForm.contactPersonName && 
           newProspectForm.contactEmail &&
           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newProspectForm.contactEmail);
  };

  const { totalOTC, totalARC } = calculateTotals();
  const categoryTotals = getCategoryTotals();
  const [processingStagesList, setProcessingStagesList] = useState<ProcessingStage[]>(processingStages);
  const completedStagesCount = processingStagesList.filter(stage => stage.completed).length;
  const currentProcessingStage = processingStagesList.find(stage => stage.processing); 
  const calculatedProgress = (completedStagesCount / processingStagesList.length) * 100;
  const aiProcessingComplete = processingStagesList.every(stage => stage.completed) && !isProcessing;
  
  // Mock data for success message
  const solutionDocumentPages = sections.length;
  const bomConfiguredCount = bomItems.length;
  // Rich Text Toolbar Component matching Figma design
  const RichTextToolbar = () => (
    <div className={`border-b border-gray-200 p-3 bg-white ${isPreviewMode ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex items-center gap-3 flex-wrap">
        {/* Font Family */}
        <Select value={fontFamily} onValueChange={setFontFamily} disabled={isPreviewMode}>
          <SelectTrigger className="w-20 h-6 text-xs bg-gray-100 border-gray-300">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Arial">Arial</SelectItem>
            <SelectItem value="Georgia">Georgia</SelectItem>
            <SelectItem value="Times">Times</SelectItem>
            <SelectItem value="Courier">Courier</SelectItem>
          </SelectContent>
        </Select>

        {/* Font Size */}
        <div className="flex items-center border border-gray-300 rounded h-6 bg-white">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 hover:bg-gray-100" 
            onClick={() => setFontSize(Math.max(8, fontSize - 1))}
            disabled={isPreviewMode}
          >
            <Minus className="w-3 h-3 text-gray-600" />
          </Button>
          <span className="px-2 text-xs min-w-[20px] text-center font-medium">{fontSize}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 hover:bg-gray-100" 
            onClick={() => setFontSize(Math.min(72, fontSize + 1))}
            disabled={isPreviewMode}
          >
            <Plus className="w-3 h-3 text-gray-600" />
          </Button>
        </div>

        {/* Formatting */}
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100" disabled={isPreviewMode}>
          <Bold className="w-4 h-4 text-gray-700" />
        </Button>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100" disabled={isPreviewMode}>
          <Italic className="w-4 h-4 text-gray-700" />
        </Button>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100" disabled={isPreviewMode}>
          <Underline className="w-4 h-4 text-gray-700" />
        </Button>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100" disabled={isPreviewMode}>
          <Strikethrough className="w-4 h-4 text-gray-700" />
        </Button>

        <div className="w-px h-5 bg-gray-300" />

        {/* Background Color */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100" disabled={isPreviewMode}>
            <div className="w-4 h-4 bg-blue-500 rounded border-2 border-gray-300" />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100" disabled={isPreviewMode}>
            <ChevronDown className="w-3 h-3 text-gray-600" />
          </Button>
        </div>

        {/* Text Color */}
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100" disabled={isPreviewMode}>
          <Palette className="w-4 h-4 text-gray-700" />
        </Button>

        <div className="w-px h-5 bg-gray-300" />

        {/* Insert */}
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100" disabled={isPreviewMode}>
          <Link className="w-4 h-4 text-gray-700" />
        </Button>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100" disabled={isPreviewMode}>
          <Image className="w-4 h-4 text-gray-700" />
        </Button>

        <div className="w-px h-5 bg-gray-300" />

        {/* Lists */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100" disabled={isPreviewMode}>
            <List className="w-4 h-4 text-gray-700" />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100" disabled={isPreviewMode}>
            <ListOrdered className="w-4 h-4 text-gray-700" />
          </Button>
        </div>

        <div className="w-px h-5 bg-gray-300" />

        {/* Alignment */}
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100" disabled={isPreviewMode}>
          <AlignLeft className="w-4 h-4 text-gray-700" />
        </Button>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100" disabled={isPreviewMode}>
          <AlignCenter className="w-4 h-4 text-gray-700" />
        </Button>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100" disabled={isPreviewMode}>
          <AlignRight className="w-4 h-4 text-gray-700" />
        </Button>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100" disabled={isPreviewMode}>
          <AlignJustify className="w-4 h-4 text-gray-700" />
        </Button>

        <div className="w-px h-5 bg-gray-300" />

        {/* Indent */}
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100" disabled={isPreviewMode}>
          <Indent className="w-4 h-4 text-gray-700" />
        </Button>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100" disabled={isPreviewMode}>
          <Outdent className="w-4 h-4 text-gray-700" />
        </Button>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100" disabled={isPreviewMode}>
          <Type className="w-4 h-4 text-gray-700" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1>New Cloud Requirement</h1>
            <p className="text-gray-600">Create intelligent cloud solutions with AI assistance</p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {stages.map((stage, index) => (
            <div key={stage.number} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                stage.completed ? 'bg-green-500 text-white' : 
                currentStage === stage.number ? 'bg-blue-500 text-white' : 
                'bg-gray-200 text-gray-600'
              }`}>
                {stage.completed ? '✓' : stage.number}
              </div>
              <div className="ml-2 text-sm">
                <div className={stage.completed || currentStage === stage.number ? 'font-medium' : 'text-gray-500'}>
                  {stage.title}
                </div>
              </div>
              {index < stages.length - 1 && (
                <div className={`w-12 h-px mx-4 ${stage.completed ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Customer & Requirement Details Cards for Stages 3, 4, 5 */}
      {currentStage > 2 && (
        <div className="space-y-4 mb-6">
          {/* Customer Details Card */}
          <Collapsible open={customerDetailsOpen} onOpenChange={setCustomerDetailsOpen}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Customer Details</CardTitle>
                      <CardDescription>
                        {customerInfo.name} ({customerInfo.id})
                      </CardDescription>
                    </div>
                    {customerDetailsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Business Type:</span>
                      <div>{customerInfo.businessType}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">GST:</span>
                      <div>{customerInfo.gst || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Contact:</span>
                      <div>{customerInfo.contactPersonName}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <div>{customerInfo.contactEmail}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Address:</span>
                      <div>{customerInfo.address}</div>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Requirement Details Card */}
          <Collapsible open={requirementDetailsOpen} onOpenChange={setRequirementDetailsOpen}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Requirement Details</CardTitle>
                      <CardDescription>
                        {requirementInfo.name} - {requirementInfo.contractTerms} Contract
                      </CardDescription>
                    </div>
                    {requirementDetailsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Priority:</span>
                      <div>
                        <Badge variant={requirementInfo.priority === 'high' ? 'destructive' : requirementInfo.priority === 'medium' ? 'default' : 'secondary'}>
                          {requirementInfo.priority.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Location:</span>
                      <div>{requirementInfo.location}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Timeline:</span>
                      <div>{requirementInfo.timeline}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Budget:</span>
                      <div>{requirementInfo.budgetRange}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Payment Model:</span>
                      <div>{requirementInfo.paymentModel === 'payg' ? 'Pay as You Go' : 'Reserved Instance'}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">DR Required:</span>
                      <div>{requirementInfo.drRequired ? 'Yes' : 'No'}</div>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </div>
      )}

      {/* Stage 1: Customer & Requirement Details */}
      {currentStage === 1 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <CardDescription>Select customer type and provide details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup 
                value={customerInfo.type} 
                onValueChange={handleCustomerTypeChange}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="existing" id="existing" />
                  <Label htmlFor="existing">Existing Customer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new-prospect" id="new-prospect" />
                  <Label htmlFor="new-prospect">New Prospect</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="existing-prospect" id="existing-prospect" />
                  <Label htmlFor="existing-prospect">Existing Prospect</Label>
                </div>
              </RadioGroup>

              {/* New Prospect Form */}
              {customerInfo.type === 'new-prospect' && !customerInfo.name && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <Label htmlFor="panNumber">PAN Number *</Label>
                    <Input
                      id="panNumber"
                      value={formData.panNumber}
                      onChange={(e) => handlePANChange(e.target.value.toUpperCase())}
                      placeholder="Enter PAN number (e.g., ABCTY1234D)"
                      maxLength={10}
                      className="uppercase"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Company details will be auto-populated after entering valid PAN
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="gstNumber">GST Number *</Label>
                    <Input
                      id="gstNumber"
                      value={formData.gstNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, gstNumber: e.target.value }))}
                      placeholder="Auto-populated if available"
                      disabled={formData.panNumber.length !== 10}
                    />
                  </div>

                  <div>
                    <Label htmlFor="customerName">Company Name *</Label>
                    <Input
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                      placeholder="Auto-populated from PAN"
                      disabled={formData.panNumber.length !== 10}
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessType">Business Type *</Label>
                    <Input
                      id="businessType"
                      value={formData.businessType}
                      onChange={(e) => setFormData(prev => ({ ...prev, businessType: e.target.value }))}
                      placeholder="Auto-populated from PAN"
                      disabled={formData.panNumber.length !== 10}
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="registeredAddress">Registered Address *</Label>
                    <Textarea
                      id="registeredAddress"
                      value={formData.registeredAddress}
                      onChange={(e) => setFormData(prev => ({ ...prev, registeredAddress: e.target.value }))}
                      placeholder="Auto-populated from PAN"
                      disabled={formData.panNumber.length !== 10}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPerson">Contact Person *</Label>
                    <Input
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                      placeholder="Primary contact name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail">Contact Email *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                      placeholder="contact@company.com"
                    />
                  </div>
                </div>
              )}

              {/* Search for Existing Customer/Prospect */}
              {(customerInfo.type === 'existing' || customerInfo.type === 'existing-prospect') && (
                <div className="relative">
                  <Label>Company Name</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      className="pl-10"
                      placeholder={getPlaceholderText()}
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                  
                  {/* Search Results */}
                  {showSearchResults && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto">
                      {filteredResults.length > 0 ? (
                        filteredResults.map(entity => (
                          <div 
                            key={entity.id}
                            className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                            onClick={() => selectEntity(entity)}
                          >
                            <div className="font-medium">{entity.name}</div>
                            <div className="text-sm text-gray-500">{entity.id}</div>
                          </div>
                        ))
                      ) : searchQuery.length >= 2 ? (
                        <div className="p-4 text-center text-gray-500">
                          No {customerInfo.type === 'existing' ? 'customers' : 'prospects'} found for "{searchQuery}"
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              )}

              {/* Selected Customer/Prospect Details */}
              {customerInfo.name && (
                <div className={`grid grid-cols-2 gap-4 p-4 rounded-lg border ${getBackgroundColor()}`}>
                  <div className="col-span-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={getBadgeVariant().className}>
                        {getBadgeVariant().text}
                      </Badge>
                      <span className="text-sm font-medium">{customerInfo.name}</span>
                    </div>
                  </div>
                  <div>
                    <Label>{customerInfo.type === 'existing' ? 'Customer' : 'Prospect'} ID</Label>
                    <Input value={customerInfo.id} disabled className="bg-white" />
                  </div>
                  <div>
                    <Label>Business Type</Label>
                    <Input 
                      value={customerInfo.businessType} 
                      onChange={(e) => setCustomerInfo({ ...customerInfo, businessType: e.target.value })}
                      placeholder="e.g., Technology, Healthcare"
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <Label>Address</Label>
                    <Input 
                      value={customerInfo.address} 
                      onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                      placeholder="Company address"
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <Label>GST Number {customerInfo.type !== 'existing' && '(Optional)'}</Label>
                    <Input 
                      value={customerInfo.gst} 
                      onChange={(e) => setCustomerInfo({ ...customerInfo, gst: e.target.value })}
                      placeholder={customerInfo.type === 'existing' ? 'GST Number' : 'Enter GST No'}
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <Label>PAN Number {customerInfo.type === 'new-prospect' && '(Optional)'}</Label>
                    <Input 
                      value={customerInfo.pan} 
                      onChange={(e) => setCustomerInfo({ ...customerInfo, pan: e.target.value })}
                      pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                      placeholder={customerInfo.type === 'existing' ? 'PAN Number' : 'Enter PAN No'}
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <Label>Contact Person Name</Label>
                    <Input 
                      value={customerInfo.contactPersonName} 
                      onChange={(e) => setCustomerInfo({ ...customerInfo, contactPersonName: e.target.value })}
                      placeholder="Primary contact person"
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <Label>Contact Email</Label>
                    <Input 
                      type="email"
                      value={customerInfo.contactEmail} 
                      onChange={(e) => setCustomerInfo({ ...customerInfo, contactEmail: e.target.value })}
                      placeholder="contact@company.com"
                      className="bg-white"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Requirement Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Requirement Name *</Label>
                  <Input 
                    value={requirementInfo.name}
                    onChange={(e) => setRequirementInfo({ ...requirementInfo, name: e.target.value })}
                    placeholder="Enter requirement name"
                  />
                </div>
                <div>
                  <Label>Contract Terms *</Label>
                  <Select value={requirementInfo.contractTerms} onValueChange={(value) => setRequirementInfo({ ...requirementInfo, contractTerms: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select contract terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1year">1 Year</SelectItem>
                      <SelectItem value="2years">2 Years</SelectItem>
                      <SelectItem value="3years">3 Years</SelectItem>
                      <SelectItem value="5years">5 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority *</Label>
                  <Select value={requirementInfo.priority} onValueChange={(value: 'high' | 'medium' | 'low') => setRequirementInfo({ ...requirementInfo, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Location *</Label>
                  <Select value={requirementInfo.location} onValueChange={(value) => setRequirementInfo({ ...requirementInfo, location: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="bangalore">Bangalore</SelectItem>
                      <SelectItem value="hyderabad">Hyderabad</SelectItem>
                      <SelectItem value="pune">Pune</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2 px-[0px] py-[24px]">
                <Checkbox 
                  id="dr-required"
                  checked={requirementInfo.drRequired}
                  onCheckedChange={(checked) => setRequirementInfo({ ...requirementInfo, drRequired: checked as boolean })}
                />
                <Label htmlFor="dr-required">Disaster Recovery Required</Label>
              </div>

              <div>
                <Label>Payment Model *</Label>
                <RadioGroup 
                  value={requirementInfo.paymentModel} 
                  onValueChange={(value: 'payg' | 'reserved') => setRequirementInfo({ ...requirementInfo, paymentModel: value })}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2 pt-[21px] pr-[0px] pb-[0px] pl-[0px]">
                    <RadioGroupItem value="payg" id="payg" />
                    <Label htmlFor="payg">Pay as You Go</Label>
                  </div>
                  <div className="flex items-center space-x-2 py-[21px] px-[0px] pt-[30px] pr-[0px] pb-[0px] pl-[0px]">
                    <RadioGroupItem value="reserved" id="reserved" />
                    <Label htmlFor="reserved">Reserved Instance</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Timeline *</Label>
                  <Input 
                    value={requirementInfo.timeline}
                    onChange={(e) => setRequirementInfo({ ...requirementInfo, timeline: e.target.value })}
                    placeholder="e.g., 3 months"
                  />
                </div>
                <div>
                  <Label>Budget Range</Label>
                  <Input 
                    value={requirementInfo.budgetRange}
                    onChange={(e) => setRequirementInfo({ ...requirementInfo, budgetRange: e.target.value })}
                    placeholder="e.g., ₹10L - ₹20L"
                  />
                </div>
              </div>

              <div>
                <Label>Requirement Description</Label>
                <Textarea 
                  value={requirementInfo.description}
                  onChange={(e) => setRequirementInfo({ ...requirementInfo, description: e.target.value })}
                  placeholder="Describe the cloud solution requirements..."
                  rows={4}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Upload Requirement Document</Label>
                  <button 
                    className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    onClick={() => {
                      // Create a mock download for template
                      const link = document.createElement('a');
                      link.href = '#';
                      link.download = 'Template Download.xls';
                      link.click();
                      toast("Template download started");
                    }}
                  >
                    <Download className="w-4 h-4" />
                    <span>Template Download.xls</span>
                  </button>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-600 mb-2">
                    Drop your Excel file here or click to browse
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    id="file-upload"
                    accept=".xls,.xlsx"
                    onChange={handleFileUpload}
                  />
                  <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                    Select File
                  </Button>
                  {requirementInfo.document && (
                    <div className="mt-2 text-sm text-green-600">
                      ✓ {requirementInfo.document.name}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button 
              onClick={() => setCurrentStage(2)}
            >
              Continue to AI Analysis
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Stage 2: AI Analysis */}
      {currentStage === 2 && (
        <div className="space-y-6">
          {/* Uploaded Requirements Section */}
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6">
                    <CheckIcon />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900">
                      Infrastructure_Requirements_Template.xlsx
                    </div>
                    <div className="text-xs text-gray-500">
                      Uploaded 5 minutes ago • 2.4 MB
                    </div>
                  </div>
                  <div className="w-6 h-6">
                    <Eye className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis Section */}
          <Card>
            <div className="space-y-6 m-[24px]">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">AI-Powered Solution Generation</h3>
                <p className="text-gray-600 mb-6">
                  Our AI is analyzing your requirements and generating a comprehensive cloud solution
                </p>
              </div>

              {/* Overall Progress */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-gray-600">{completedStagesCount}/{processingStagesList.length} stages completed</span>
                </div>
                <Progress value={calculatedProgress} className="h-3" />
              </div>

              {/* Processing Stages */}
              <div className="space-y-3">
                {processingStagesList.map((stage, index) => {
                  const IconComponent = stage.icon;
                  return (
                    <div 
                      key={stage.id}
                      className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-300 ${
                        stage.completed 
                          ? 'bg-green-50' 
                          : stage.processing 
                            ? 'bg-blue-50' 
                            : 'bg-gray-50'
                      }`}
                    >
                      <div className={`p-2 rounded-full ${
                        stage.completed 
                          ? 'bg-green-500' 
                          : stage.processing 
                            ? 'bg-blue-500' 
                            : 'bg-gray-400'
                      }`}>
                        {stage.processing ? (
                          <Loader2 className="w-5 h-5 text-white animate-spin" />
                        ) : stage.completed ? (
                          <Check className="w-5 h-5 text-white" />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gray-300"></div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className={`font-medium ${
                          stage.completed ? 'text-green-800' : stage.processing ? 'text-blue-800' : 'text-gray-600'
                        }`}>
                          {stage.title}
                        </h4>
                        <p className={`text-sm ${
                          stage.completed ? 'text-green-600' : stage.processing ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                          {stage.description}
                        </p>
                      </div>
                      
                      <div>
                        {stage.completed && (
                          <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>
                        )}
                        {stage.processing && (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">Processing...</Badge>
                        )}
                        {!stage.completed && !stage.processing && (
                          <Badge variant="outline" className="text-gray-500">Pending</Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Current Processing Stage Display */}
              {currentProcessingStage && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    <div>
                      <p className="font-medium text-blue-800">Currently Processing:</p>
                      <p className="text-sm text-blue-600">{currentProcessingStage.title}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Completion Message */}
              {aiProcessingComplete && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Check className="w-6 h-6 text-green-600" />
                    <div className="flex-1">
                      <p className="font-medium text-green-800">Processing Complete!</p>
                      <p className="text-sm text-green-600 mt-1">
                        Your cloud solution has been successfully generated. You can now proceed to review and refine the solution.
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-[rgba(16,41,25,1)]">
                        <span>Solution document: {solutionDocumentPages} pages</span>
                        <span>•</span>
                        <span>BOM: {bomConfiguredCount} items configured</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Navigation */}
          {aiAnalysis && aiAnalysis.processingSuccess && (
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStage(1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={() => setCurrentStage(3)}>
                Continue to Solution Editor
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Stage 3: Enhanced Solution Document Editor */}
      {currentStage === 3 && (
        <div className="space-y-6">
          {/* Header Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold">Solution Document Editor</h2>
              <div className="flex items-center space-x-2">
                <Badge variant={assignSA ? "default" : "secondary"}>
                  {assignSA ? "SA Assigned" : "Unassigned"}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  v{documentVersion}
                </Badge>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  Last saved: {lastSaved.toLocaleTimeString()}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Template Selection */}
              <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Templates
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                  <DialogHeader>
                    <DialogTitle>Document Templates</DialogTitle>
                    <DialogDescription>
                      Choose from predefined templates to jumpstart your solution document
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="flex gap-4 mb-6">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input 
                          placeholder="Search templates..."
                          value={templateSearch}
                          onChange={(e) => setTemplateSearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Select value={templateCategory} onValueChange={setTemplateCategory}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="Cloud Infrastructure">Cloud Infrastructure</SelectItem>
                          <SelectItem value="Financial Services">Financial Services</SelectItem>
                          <SelectItem value="Small Business">Small Business</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredTemplates.map(template => (
                        <Card key={template.id} className="relative cursor-pointer hover:shadow-md transition-shadow">
                          {template.featured && (
                            <div className="absolute top-2 right-2">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            </div>
                          )}
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">{template.name}</CardTitle>
                            <p className="text-sm text-gray-600">{template.description}</p>
                            <div className="flex gap-2 mt-2">
                              <Badge className={`text-xs ${getTypeColor(template.type)}`}>
                                {template.type}
                              </Badge>
                              <Badge className={`text-xs ${getComplexityColor(template.complexity)}`}>
                                {template.complexity}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                              <span>{template.sections} sections</span>
                              <span>{template.uses} uses</span>
                              <span>★ {template.rating}</span>
                            </div>
                            <Button 
                              size="sm" 
                              className="w-full"
                              onClick={() => applyTemplate(template.id)}
                            >
                              Use Template
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* AI-Powered SA Assignment */}
              <Dialog open={showAssignmentDialog} onOpenChange={setShowAssignmentDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Brain className="w-4 h-4 mr-2" />
                    Assign SA
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl max-h-[80vh] overflow-hidden flex flex-col">
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-blue-500" />
                      AI-Powered Solution Architect Assignment
                    </DialogTitle>
                    <DialogDescription>
                      Our AI analyzes project complexity and matches optimal Solution Architects
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="flex-1 overflow-y-auto p-6">
                    {/* AI Analysis Summary */}
                    <Card className="mb-6 bg-blue-50 border-blue-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base text-blue-800">Assignment Recommendation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div><span className="font-medium">Project Complexity:</span> High (Budget: {requirementInfo.budgetRange}, Priority: {requirementInfo.priority.toUpperCase()})</div>
                          <div><span className="font-medium">Recommended Assignment:</span> Yes - High complexity project requires SA oversight</div>
                          <div><span className="font-medium">Location Match Priority:</span> {requirementInfo.location.charAt(0).toUpperCase() + requirementInfo.location.slice(1)}</div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex gap-4 mb-6">
                      <Select value={locationFilter} onValueChange={setLocationFilter}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Filter by location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Locations</SelectItem>
                          <SelectItem value="mumbai">Mumbai</SelectItem>
                          <SelectItem value="bangalore">Bangalore</SelectItem>
                          <SelectItem value="delhi">Delhi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredArchitects.map(architect => (
                        <Card key={architect.id} className={`relative transition-all ${selectedArchitects.includes(architect.id) ? 'border-blue-500 bg-blue-50' : ''}`}>
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-3">
                                <Avatar>
                                  <AvatarFallback>{architect.initials}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-medium flex items-center">
                                    {architect.name}
                                    {architect.locationMatch && <MapPin className="w-3 h-3 ml-1 text-green-600" />}
                                  </h4>
                                  <p className="text-sm text-gray-600">{architect.email}</p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-xs text-gray-500">{architect.location}</span>
                                    <span className="text-xs">•</span>
                                    <span className="text-xs text-gray-500">{architect.experience}</span>
                                  </div>
                                </div>
                              </div>
                              <Checkbox
                                checked={selectedArchitects.includes(architect.id)}
                                onCheckedChange={() => toggleArchitect(architect.id)}
                              />
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>AI Match Score:</span>
                                <div className="flex items-center">
                                  <span className="font-medium text-blue-600">{architect.complexityScore}/10</span>
                                  <Activity className="w-3 h-3 ml-1 text-blue-500" />
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span>Rating:</span>
                                <span className="flex items-center">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                                  {architect.rating}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span>Workload:</span>
                                <span className={getWorkloadColor(architect.workload)}>
                                  {architect.workload}%
                                </span>
                              </div>
                              <div className="mt-2">
                                <Badge className={`text-xs ${getWorkloadBadgeColor(architect.availability)}`}>
                                  {architect.availability}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {architect.expertise.slice(0, 3).map(skill => (
                                  <Badge key={skill} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
                      <Button variant="outline" onClick={() => setShowAssignmentDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={assignArchitects}>
                        Assign Selected ({selectedArchitects.length})
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Version History */}
              <Button variant="outline" size="sm" onClick={() => setShowVersionHistory(true)}>
                <History className="w-4 h-4 mr-2" />
                Versions
              </Button>

              {/* Export Button */}
              <Button variant="outline" size="sm" onClick={exportDocument}>
                <FileDown className="w-4 h-4 mr-2" />
                Share
              </Button>

              {/* Save */}
              <Button size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>

          {/* Main Editor Layout - Matching Figma Design */}
          <div className="flex gap-4 h-[600px]">
            {/* Sections Sidebar - Exactly as shown in Figma */}
            <div className="w-72 border border-gray-200 rounded-lg bg-white">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-700">Sections</h3>
                    <span className="text-sm text-gray-500">({sections.length})</span>
                  </div>
                  <Button size="sm" variant="ghost" onClick={addNewSection} className="h-6 w-6 p-0">
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <div className="h-[500px] overflow-y-auto">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    className={`flex items-start p-3 cursor-pointer border-b border-gray-100 hover:bg-gray-50 ${
                      activeSection === section.id ? "bg-gray-900 text-white" : ""
                    }`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium mr-3 ${
                      activeSection === section.id ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-700"
                    }`}>
                      {section.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold text-sm mb-1 ${activeSection === section.id ? "text-white" : "text-gray-900"}`}>
                        {section.title}
                      </div>
                      <div className={`text-xs mb-2 line-clamp-2 ${activeSection === section.id ? "text-gray-300" : "text-gray-600"}`}>
                        {section.preview}
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className={activeSection === section.id ? "text-gray-400" : "text-gray-500"}>
                          {section.wordCount} words
                        </span>
                        {sections.length > 1 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className={`h-4 w-4 p-0 ${activeSection === section.id ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSection(section.id);
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 border border-gray-200 rounded-lg bg-white overflow-hidden">
              {/* Section Title with Preview Toggle */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <Input
                    value={getCurrentSection().title}
                    onChange={(e) => {
                      const currentSection = getCurrentSection();
                      setSections(sections.map(s => 
                        s.id === currentSection.id 
                          ? { ...s, title: e.target.value }
                          : s
                      ));
                    }}
                    className="text-lg font-semibold border-none bg-transparent p-0 h-auto focus:ring-0 focus:outline-none flex-1 mr-4"
                    placeholder="Section Title"
                  />
                  
                  {/* Preview Toggle in Section Title Area */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={!isPreviewMode ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsPreviewMode(false)}
                    >
                      <Edit3 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant={isPreviewMode ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsPreviewMode(true)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                  </div>
                </div>
              </div>

              {/* Rich Text Toolbar - Disabled in Preview Mode */}
              <RichTextToolbar />

              {/* Content Area */}
              <div className="h-[400px] relative">
                {!isPreviewMode ? (
                  <Textarea
                    value={getCurrentSection().content}
                    onChange={(e) => updateSection(getCurrentSection().id, e.target.value)}
                    className="h-full border-none rounded-none resize-none focus:ring-0 p-4"
                    style={{ 
                      fontFamily: fontFamily, 
                      fontSize: `${fontSize}px` 
                    }}
                    placeholder="Editable section of the solution document"
                  />
                ) : (
                  <div className="h-full overflow-y-auto p-4" style={{ fontFamily: fontFamily, fontSize: `${fontSize}px` }}>
                    <div className="prose max-w-none">
                      {getCurrentSection().content.split('\n').map((paragraph, index) => {
                        if (paragraph.startsWith('•')) {
                          return <li key={index} className="ml-4 mb-1">{paragraph.substring(1).trim()}</li>;
                        }
                        if (paragraph.startsWith('Phase') || paragraph.startsWith('-')) {
                          return <p key={index} className="font-medium mb-2">{paragraph}</p>;
                        }
                        return <p key={index} className="mb-3">{paragraph}</p>;
                      })}
                    </div>
                  </div>
                )}
                
                {/* Mode indicator */}
                <div className="absolute bottom-4 right-4 text-xs text-gray-400 bg-white px-2 py-1 rounded shadow">
                  {isPreviewMode ? 'Preview Mode' : 'Edit Mode'}
                </div>
              </div>
            </div>
          </div>

          {/* Auto-save indicator */}
          {autoSaveEnabled && (
            <div className="flex items-center justify-center text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Auto-save enabled • Last saved {lastSaved.toLocaleTimeString()}</span>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStage(2)}>
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 21 21">
                <path d={importedSvgPaths.p7647180} stroke="#414547" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.0141" />
              </svg>
              Previous
            </Button>
            <Button onClick={() => setCurrentStage(4)}>
              Next
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 21 21">
                <path d={importedSvgPaths.p1c3d3ec0} stroke="#414547" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.0141" />
              </svg>
            </Button>
          </div>
        </div>
      )}

      {/* Stage 4: BOM Management */}
      {currentStage === 4 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle>Bill of Materials (BOM)</CardTitle>
                  <CardDescription>Manage resource specifications and quantities. Only SKU, Specification, and Quantity are editable.</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-4 shrink-0"
                  onClick={() => {
                    // TODO: Open catalogue dialog or navigate to catalogue
                    toast.success("Catalogue integration coming soon!");
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Items from Catalogue
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 p-3 text-left">Category</th>
                      <th className="border border-gray-200 p-3 text-left">SKU</th>
                      <th className="border border-gray-200 p-3 text-left">Specification</th>
                      <th className="border border-gray-200 p-3 text-left">Quantity</th>
                      <th className="border border-gray-200 p-3 text-left">OTC (₹)</th>
                      <th className="border border-gray-200 p-3 text-left">ARC (₹)</th>
                      <th className="border border-gray-200 p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bomItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="border border-gray-200 p-3">{item.category}</td>
                        <td className="border border-gray-200 p-3">
                          <Input 
                            value={item.sku}
                            onChange={(e) => updateBOMItem(item.id, 'sku', e.target.value)}
                            className="w-full"
                          />
                        </td>
                        <td className="border border-gray-200 p-3">
                          <Input 
                            value={item.specification}
                            onChange={(e) => updateBOMItem(item.id, 'specification', e.target.value)}
                            className="w-full"
                          />
                        </td>
                        <td className="border border-gray-200 p-3">
                          <Input 
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateBOMItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                            className="w-20"
                          />
                        </td>
                        <td className="border border-gray-200 p-3 bg-gray-50 text-right">
                          <span className="text-gray-600">₹{item.otc.toLocaleString()}</span>
                        </td>
                        <td className="border border-gray-200 p-3 bg-gray-50 text-right">
                          <span className="text-gray-600">₹{item.arc.toLocaleString()}</span>
                        </td>
                        <td className="border border-gray-200 p-3">
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Category-wise Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Category-wise Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Category Totals</h4>
                  <div className="space-y-2">
                    {categoryTotals.map((category) => (
                      <div key={category.category} className="flex justify-between text-sm">
                        <span>{category.category}:</span>
                        <span>OTC: ₹{category.otc.toLocaleString()} | ARC: ₹{category.arc.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Total Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between font-medium">
                      <span>Total OTC:</span>
                      <span>₹{totalOTC.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total ARC:</span>
                      <span>₹{totalARC.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Grand Total:</span>
                        <span>₹{(totalOTC + totalARC).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
<Card>
        <CardHeader>
          <CardTitle>Billing Terms & Conditions</CardTitle>
          <CardDescription>Configure billing terms by category and organization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">General Terms</label>
            <Textarea 
              value={formData.billingTerms.general || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                billingTerms: { ...prev.billingTerms, general: e.target.value } 
              }))}
              placeholder="standard billing terms apply"
              className="mt-1"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Network</label>
              <Textarea 
                value={formData.billingTerms.network || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  billingTerms: { ...prev.billingTerms, network: e.target.value } 
                }))}
                placeholder="network services billed monthly in advance"
                className="mt-1"
                rows={2}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Compute</label>
              <Textarea 
                value={formData.billingTerms.compute || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  billingTerms: { ...prev.billingTerms, compute: e.target.value } 
                }))}
                placeholder="compute resource billed monthly in arrears"
                className="mt-1"
                rows={2}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Storage</label>
              <Textarea 
                value={formData.billingTerms.storage || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  billingTerms: { ...prev.billingTerms, storage: e.target.value } 
                }))}
                placeholder="Storage billed based on actual usage"
                className="mt-1"
                rows={2}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Security</label>
              <Textarea 
                value={formData.billingTerms.security || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  billingTerms: { ...prev.billingTerms, security: e.target.value } 
                }))}
                placeholder="security service billed quarterly in advance"
                className="mt-1"
                rows={2}
              />
            </div>
          </div>
        </CardContent>
      </Card>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStage(3)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={() => setCurrentStage(5)}>
              Continue to Proposal Generation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Stage 5: Proposal Generation */}
      {currentStage === 5 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Proposal Generation</CardTitle>
              <CardDescription>Generate and finalize the proposal for your cloud solution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Proposal Summary */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Solution Summary</h4>
                  <div className="text-sm space-y-2">
                    <p><span className="font-medium">Customer:</span> {customerInfo.name}</p>
                    <p><span className="font-medium">Requirement:</span> {requirementInfo.name}</p>
                    <p><span className="font-medium">Contract Term:</span> {requirementInfo.contractTerms}</p>
                    <p><span className="font-medium">Timeline:</span> {requirementInfo.timeline}</p>
                    <p><span className="font-medium">Location:</span> {requirementInfo.location}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Pricing Summary</h4>
                  <div className="text-sm space-y-2">
                    <p><span className="font-medium">One-time Cost:</span> ₹{totalOTC.toLocaleString()}</p>
                    <p><span className="font-medium">Annual Recurring Cost:</span> ₹{totalARC.toLocaleString()}</p>
                    <p><span className="font-medium">Total Solution Value:</span> ₹{(totalOTC + totalARC).toLocaleString()}</p>
                    <p><span className="font-medium">Payment Model:</span> {requirementInfo.paymentModel === 'payg' ? 'Pay as You Go' : 'Reserved Instance'}</p>
                  </div>
                </div>
              </div>

              {/* Billing Terms */}
              <div>
                <h4 className="font-medium mb-3">Billing Terms</h4>
                <div className="bg-gray-50 p-4 rounded-lg text-sm">
                  <ul className="space-y-1">
                    <li>• Payment terms: Net 30 days from invoice date</li>
                    <li>• One-time costs due within 30 days of service activation</li>
                    <li>• Recurring costs billed monthly in advance</li>
                    <li>• 90-day notice required for service termination</li>
                    <li>• All services covered under standard SLA with 99.9% uptime guarantee</li>
                    <li>• 12-month warranty on all hardware components</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generation Options */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-400 rounded-sm flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-xs"></div>
                </div>
                <CardTitle className="text-base">Generation Options</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Output Format and Template Style */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium">Output Format</Label>
                  <Select defaultValue="pdf">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="word">Word Document</SelectItem>
                      <SelectItem value="html">HTML Document</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Template Style</Label>
                  <Select defaultValue="corporate">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="corporate">Corporate</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Content Options */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Content Options</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="technical-appendix" defaultChecked />
                      <Label htmlFor="technical-appendix" className="text-sm">Technical appendix</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="pricing-breakdown" defaultChecked />
                      <Label htmlFor="pricing-breakdown" className="text-sm">Detailed pricing breakdown</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="implementation-timeline" defaultChecked />
                      <Label htmlFor="implementation-timeline" className="text-sm">Implementation timeline</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="team-profiles" defaultChecked />
                      <Label htmlFor="team-profiles" className="text-sm">Team profiles</Label>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="case-studies" />
                      <Label htmlFor="case-studies" className="text-sm">Case studies</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="customer-testimonials" />
                      <Label htmlFor="customer-testimonials" className="text-sm">Customer testimonials</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="compliance-certificates" defaultChecked />
                      <Label htmlFor="compliance-certificates" className="text-sm">Compliance certificates</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="warranty-information" defaultChecked />
                      <Label htmlFor="warranty-information" className="text-sm">Warranty information</Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Options */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Delivery Options</Label>
                <RadioGroup defaultValue="email" className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="email-customer" />
                    <Label htmlFor="email-customer" className="text-sm">Email to customer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="portal" id="customer-portal" />
                    <Label htmlFor="customer-portal" className="text-sm">Upload to customer portal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="both-options" />
                    <Label htmlFor="both-options" className="text-sm">Both email and portal</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button size="lg" className="bg-black text-white hover:bg-gray-800 px-8">
                  <Download className="w-4 h-4 mr-2" />
                  Generate Proposal
                </Button>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    <Send className="w-4 h-4 mr-2" />
                    Send to Customer
                  </Button>
                  <Button variant="outline" size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              <strong>Next Steps:</strong> Once the proposal is generated, it will be available for pricing negotiations and approvals as a separate workflow.
            </AlertDescription>
          </Alert>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStage(4)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={() => navigate('/')}>
              Complete & Return to Dashboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
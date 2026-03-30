import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Circle,
  FileText,
  Brain,
  Settings,
  Package,
  Send,
  User,
  Plus,
  Minus,
  ShoppingCart,
  Building,
  MapPin,
  Calendar,
  Network,
  Server,
  Shield,
  Database,
  HardDrive,
  Cloud,
  LifeBuoy,
  X,
  Edit3,
  ChevronRight,
  Check,
  ChevronDown,
  ChevronUp,
  Trash2,
  Folder,
  FolderOpen,
  Save,
  Search,
  Upload,
  Bot,
  Loader2,
  Building2,
  DollarSign,
  Zap,
  Eye,
  Download,
  History,
  Activity
} from 'lucide-react';

interface StepperStep {
  id: number;
  title: string;
  description: string;
  icon: any;
  completed: boolean;
  current: boolean;
}

interface SelectedAddOn {
  name: string;
  quantity: number;
}

interface PlanRow {
  id: string;
  selectedPlan: string;
  quantity?: number;
  bandwidth?: number;
  publicIpQuantity?: number;
  selectedAddOns?: SelectedAddOn[];
  selectedOSType?: 'linux' | 'windows';
  selectedOS?: string;
  selectedDatabase?: string;
  selectedAntivirus?: string;
  showAddOns?: boolean;
  selectedRAM32?: number;
  selectedRAM64?: number;
}

interface RecommendedService {
  type: 'security';
  selectedService?: string;
  expanded: boolean;
}

interface ProductConfig {
  id: string;
  category: string;
  product: string;
  subProduct?: string;
  planRows: PlanRow[];
  recommendedServices: RecommendedService[];
}

interface CustomerDetails {
  customerName: string;
  customerId: string;
  location: string;
  priority: 'High' | 'Medium' | 'Low';
  contractTerm: string;
  orderType: 'New' | 'Modify' | 'Renew' | 'Shift';
  requirementDescription: string;
  budgetRange: string;
  drEnabled: boolean;
  paymentModel: string;
}

interface ProductSelectionState {
  selectedProduct: string | null;
  selectedCategory: string | null;
  selectedSubProduct: string | null;
  configuring: boolean;
}

interface ProductTreeState {
  [key: string]: {
    expanded: boolean;
  };
}

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
  orderType?: 'new' | 'modify' | 'shift' | 'renewal';
}

interface BOMItem {
  id: string;
  category: string;
  productName: string;
  sku: string;
  specifications: string;
  quantity: number;
  otc: number;
  arc: number;
}

interface ProcessingStage {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  processing: boolean;
  icon: any;
}

const bandwidthOptions = [20, 50, 100, 200, 300, 500, 1000];

const productCatalog = {
  Network: {
    icon: Network,
    products: {
      VPDC: {
        description: "Virtual Private Data Center with firewall capabilities",
        subProducts: {
          'Standard Firewall': {
            plans: ['VPDC-FLEX-1GBPS-3LN-10U-2T'],
            addOns: [
              { name: 'VPDC-FLEX-1-ADD-1LN', maxQuantity: 9 },
              { name: 'VPDC-FLEX-1-ADD-10SSL-USER', maxQuantity: 3 },
              { name: 'VPDC-FLEX-ADD-10IPSEC-TUNNEL', maxQuantity: 1 }
            ]
          },
          'NFV Firewall': {
            plans: [
              'NFV-FW-2G-FG',
              'NFV-FW-4G-FG', 
              'NFV-FW-IPS-2G-FG',
              'NFV-FW-IPS-4G-FG',
              'NFV-FW-UTM-2G-FG',
              'NFV-FW-UTM-4G-FG',
              'NFV-BYOL-1vCPU-6GBvRAM'
            ]
          }
        }
      },
      Internet: {
        description: "Internet bandwidth and connectivity services",
        plans: ['BW-CAPPED', 'BW-BURSTABLE-2X', 'BW-BURSTABLE-4X'],
        useBandwidth: true,
        publicIpQuantity: true
      }
    },
    recommendations: ['Load-balancer', 'GSLB', 'DNS', 'Cloud Connect Port', 'Colo Connect']
  },
  Compute: {
    icon: Server,
    products: {
      'VPI HA': {
        description: "Virtual Private Instance with High Availability",
        plans: ['VPI-HA-1vCPU-1GBvRAM'],
        addOns: [
          { name: 'vCPU', type: 'number' },
          { name: 'vRAM', type: 'number' }
        ],
        osOptions: {
          linux: [
            'Oracle Enterprise Linux per VPI',
            'CENTOS-PER-OS',
            'UBUNTU-PER-OS', 
            'OPEN-SOURCE-LINUX-OS'
          ],
          windows: ['WINSTD-VPI-PER-2vCPU']
        },
        suggestedAddOns: {
          database: ['MYSQL-VPI-MDS-VPE-PER-DB'],
          security: [
            'NGAV-PER-HOST',
            'NGAV-EDR-PER HOST',
            'NGAV-EDR-TH-PER HOST',
            'NGAV-BYOL-PER-HOST'
          ]
        }
      },
      GPU: {
        description: "GPU-accelerated compute instances for AI/ML workloads",
        plans: [
          'GPU-VPI-1xH100-94GB-24vCPU-256GBvRAM',
          'GPU-VPI-2xH100-188GB-48vCPU-512GBvRAM',
          'GPU-VPI-4xH100-376GB-96vCPU-1TBvRAM',
          'GPU-VPI-1xL40S-48GB-16vCPU-128GBvRAM',
          'GPU-VPI-2xL40S-96GB-32vCPU-256GBvRAM',
          'GPU-VPI-4xL40S-192GB-64vCPU-512GBvRAM'
        ]
      },
      VPE: {
        description: "Virtual Private Environment for enterprise workloads",
        plans: [
          'VPE-56 Core-2x28 CPU-1.5TB-FC-SHM',
          'VPE-64 Core-2x32 CPU-1TB-FC-SHM',
          'VPE-32 Core-2x16 CPU-384GB-FC-SHM'
        ],
        addOns: [
          { name: 'MDS-VPE-ADD-32GB-pRAM', type: 'button', ramSize: 32 },
          { name: 'MDS-VPE-ADD-64GB-pRAM', type: 'button', ramSize: 64 }
        ]
      },
      MDS: {
        description: "Managed Database Service with multiple configurations",
        plans: [
          'MDS-2CPU-08CORE-64GB-SHM',
          'MDS-2CPU-12CORE-256GB-SHM',
          'MDS-2CPU-16CORE-384GB-SHM'
        ]
      },
      SAP: {
        description: "SAP-certified infrastructure for enterprise applications",
        plans: ['SAP-VPI'],
        addOns: [
          { name: 'SAP-VPI-ADD-vCPU', type: 'number' },
          { name: 'SAP-VPI-ADD-vRAM', type: 'number' }
        ]
      },
      'SAP-vHana': {
        description: "Virtual SAP HANA database platform",
        plans: ['SAP-vHANA'],
        addOns: [
          { name: 'SAP-vHANA-ADD-1vCPU', type: 'number' },
          { name: 'SAP-vHANA-ADD-1vRAM', type: 'number' }
        ]
      },
      'SAP-pHana': {
        description: "Physical SAP HANA enterprise database",
        plans: ['SAP-pHANA-ENTERPRISE'],
        addOns: [
          { name: 'SUSE-VPE-ULTD-GOS', type: 'number' }
        ]
      }
    }
  },
  Security: {
    icon: Shield,
    products: {
      GeoTrust: {
        description: "SSL certificates for secure communications",
        plans: ['GEOTRUST-SSLCERT-4SAN-1DOMAIN'],
        addOns: [{ name: 'GEOTRUST-SSLCERT-ADDON-SAN', type: 'number' }]
      },
      'NFV WAF': {
        description: "Network Function Virtualization Web Application Firewall",
        plans: [
          'WAF-25MBPS-PER-UNIT',
          'WAF-200MBPS-PER-UNIT', 
          'WAF-1GBPS-PER-UNIT'
        ]
      },
      'NGAV EDR': {
        description: "Next-Generation Antivirus and Endpoint Detection Response",
        plans: [
          'NGAV-PER-HOST (Mandatory for windows)',
          'NGAV-EDR-PER HOST',
          'NGAV-EDR-TH-PER HOST'
        ]
      }
    }
  },
  PaaS: {
    icon: Cloud,
    products: {
      RDS: {
        description: "Relational Database Service for managed databases",
        plans: [
          'VPI, PAAS-RDS-MS-VPI-MDS-VPE-PER-CAL',
          'VPE, PAAS-RDS-MS-VPI-MDS-VPE-PER-CAL',
          'MDS, PAAS-RDS-MS-VPI-MDS-VPE-PER-CAL'
        ]
      },
      'VMWARE-VCF': {
        description: "VMware Cloud Foundation platform services",
        plans: [
          'VCF-PER-CORE-COMMITTED',
          'VCF-PER-CORE'
        ]
      },
      'Windows VDA': {
        description: "Windows Virtual Desktop Access licensing",
        plans: ['WIN-VDA-PER-VDI']
      }
    }
  },
  Storage: {
    icon: HardDrive,
    products: {
      'Standard Storage': {
        description: "Standard performance storage for general workloads",
        plans: ['STANDARD-STR-PER-GB']
      },
      'AllFlash Storage': {
        description: "High-performance all-flash storage arrays",
        plans: ['ALLFLASH-STR-PER-GB']
      },
      'NAS Storage': {
        description: "Network Attached Storage for shared access",
        plans: ['NAS-STR-STANDARD-PER-GB']
      }
    }
  },
  'DR Tool': {
    icon: LifeBuoy,
    products: {
      'DR-CORBONITE': {
        description: "Disaster recovery solution with automated failover",
        plans: [
          'DR-CORBONITE-PER-VM',
          'DR-CORBONITE-PER-PHY-SERVER'
        ]
      },
      'DR-SRM': {
        description: "Site Recovery Manager for VMware environments",
        plans: ['DR-SRM-PER-VM']
      }
    }
  },
  Backup: {
    icon: Database,
    products: {
      'Backup Front-End Capacity': {
        description: "Front-end backup capacity for data protection",
        plans: ['BKP-FE-PER-GB']
      },
      'Backup Storage': {
        description: "Backup storage with multiple retention options",
        plans: [
          'BKP-STORAGE-PER-GB',
          'BKP-STORAGE-VAULT-COPY-PER-GB'
        ]
      }
    }
  }
};

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
    productName: 'VPI High Availability compute instance',
    sku: 'VPI-HA-1vCPU-1GBvRAM',
    specifications: 'Virtual Private Instance with 1 vCPU and 1GB vRAM, high availability enabled',
    quantity: 10,
    otc: 50000,
    arc: 120000
  },
  {
    id: '2',
    category: 'Storage',
    productName: 'Standard Storage',
    sku: 'STANDARD-STR-PER-GB',
    specifications: 'Standard performance storage for general workloads, 1TB capacity',
    quantity: 200,
    otc: 0,
    arc: 80000
  },
  {
    id: '3',
    category: 'Network',
    productName: 'Load Balancer',
    sku: 'LOAD-BALANCER-BASIC',
    specifications: 'Application Load Balancer with SSL termination and health checks',
    quantity: 2,
    otc: 10000,
    arc: 25000
  },
  {
    id: '4',
    category: 'Security',
    productName: 'GeoTrust security certificate',
    sku: 'GEOTRUST-SSLCERT-4SAN-1DOMAIN',
    specifications: 'SSL certificate with 4 SAN domains, 1-year validity',
    quantity: 1,
    otc: 15000,
    arc: 30000
  }
];

const processingStages: ProcessingStage[] = [
  {
    id: 'requirement-analysis',
    title: 'Requirement Analysis',
    description: 'Analyzing product configurations and requirements',
    completed: false,
    processing: false,
    icon: FileText
  },
  {
    id: 'solution-matching',
    title: 'Solution Matching', 
    description: 'Matching products with optimal cloud services',
    completed: false,
    processing: false,
    icon: Search
  },
  {
    id: 'architecture-design',
    title: 'Architecture Design',
    description: 'Creating integrated solution architecture',
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
    icon: Send
  }
];

export function ProductCatalog() {
  const navigate = useNavigate();
  const configureRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('Network');
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
    document: undefined,
    orderType: 'new'
  });
  
  const [selectedProducts, setSelectedProducts] = useState<ProductConfig[]>([]);
  const [productSelection, setProductSelection] = useState<ProductSelectionState>({
    selectedProduct: null,
    selectedCategory: null,
    selectedSubProduct: null,
    configuring: false
  });

  const [productTreeState, setProductTreeState] = useState<ProductTreeState>(() => {
    const initialState: ProductTreeState = {};
    // Initialize tree state for all categories
    Object.keys(productCatalog).forEach(category => {
      Object.keys(productCatalog[category as keyof typeof productCatalog].products).forEach(product => {
        const categoryData = productCatalog[category as keyof typeof productCatalog];
        const productData = categoryData?.products[product as keyof typeof categoryData.products];
        // Set expanded to true by default if the product has sub-products
        initialState[`${category}-${product}`] = {
          expanded: !!productData?.subProducts
        };
      });
    });
    return initialState;
  });

  const [currentConfig, setCurrentConfig] = useState<ProductConfig>({
    id: '',
    category: '',
    product: '',
    subProduct: '',
    planRows: [{ id: 'row-1', selectedPlan: '', quantity: 1 }],
    recommendedServices: []
  });

  const [savedSelections, setSavedSelections] = useState<ProductConfig[]>([]);
  const [bomItems, setBomItems] = useState<BOMItem[]>(mockBOMItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showGenerationDialog, setShowGenerationDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStages, setGenerationStages] = useState<ProcessingStage[]>(processingStages);
  const [solutionGenerated, setSolutionGenerated] = useState(false);

  const steps: StepperStep[] = [
    {
      id: 1,
      title: "Customer & Requirement Details",
      description: "Customer information and requirement specifications",
      icon: User,
      completed: currentStep > 1,
      current: currentStep === 1
    },
    {
      id: 2,
      title: "Product Selection",
      description: "Browse and select products from catalog",
      icon: Package,
      completed: currentStep > 2,
      current: currentStep === 2
    },
    {
      id: 3,
      title: "BOM Management",
      description: "Bill of Materials configuration and pricing",
      icon: FileText,
      completed: currentStep > 3,
      current: currentStep === 3
    },
    {
      id: 4,
      title: "AI Solution Document",
      description: "AI-powered solution document generation",
      icon: Brain,
      completed: currentStep > 4,
      current: currentStep === 4
    },
    {
      id: 5,
      title: "Proposal Generation",
      description: "Generate and finalize customer proposals",
      icon: Send,
      completed: currentStep >= 5,
      current: currentStep === 5
    }
  ];

  const categoryOrder = ['Network', 'Compute', 'Security', 'PaaS', 'Storage', 'DR Tool', 'Backup'];

  const getNavigationButtonText = (direction: 'prev' | 'next') => {
    const currentIndex = categoryOrder.indexOf(selectedCategory);
    let targetIndex;
    
    if (direction === 'prev') {
      targetIndex = currentIndex > 0 ? currentIndex - 1 : categoryOrder.length - 1;
    } else {
      targetIndex = currentIndex < categoryOrder.length - 1 ? currentIndex + 1 : 0;
    }
    
    const targetCategory = categoryOrder[targetIndex];
    return `Go to ${targetCategory}`;
  };

  const navigateToCategory = (direction: 'prev' | 'next') => {
    const currentIndex = categoryOrder.indexOf(selectedCategory);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : categoryOrder.length - 1;
    } else {
      newIndex = currentIndex < categoryOrder.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedCategory(categoryOrder[newIndex]);
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

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
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
      setRequirementInfo({ ...requirementInfo, document: file });
    } else {
      alert('Please upload only Excel files (.xls or .xlsx)');
    }
  };

  const toggleProduct = (category: string, product: string) => {
    const key = `${category}-${product}`;
    setProductTreeState(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        expanded: !prev[key]?.expanded
      }
    }));
  };

  const selectProduct = (category: string, productName: string, subProductName?: string) => {
    setProductSelection({
      selectedProduct: productName,
      selectedCategory: category,
      selectedSubProduct: subProductName || null,
      configuring: true
    });

    // Initialize recommended services for products that have them (excluding database which is now in OS)
    const categoryData = productCatalog[category as keyof typeof productCatalog];
    const productData = categoryData?.products[productName as keyof typeof categoryData.products];
    
    let recommendedServices: RecommendedService[] = [];
    if (productData?.suggestedAddOns?.security) {
      recommendedServices.push({ type: 'security', expanded: false });
    }

    setCurrentConfig({
      id: `${category}-${productName}${subProductName ? `-${subProductName}` : ''}-${Date.now()}`,
      category,
      product: productName,
      subProduct: subProductName,
      planRows: [{ id: 'row-1', selectedPlan: '', quantity: 1 }],
      recommendedServices
    });

    // Auto-scroll to configure section
    setTimeout(() => {
      configureRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const cancelProductSelection = () => {
    setProductSelection({
      selectedProduct: null,
      selectedCategory: null,
      selectedSubProduct: null,
      configuring: false
    });
    setCurrentConfig({
      id: '',
      category: '',
      product: '',
      subProduct: '',
      planRows: [{ id: 'row-1', selectedPlan: '', quantity: 1 }],
      recommendedServices: []
    });
  };

  const saveSelection = () => {
    if (!productSelection.selectedProduct || !productSelection.selectedCategory) return;

    // Validate that at least one plan is selected
    const hasValidPlan = currentConfig.planRows.some(row => row.selectedPlan);
    if (!hasValidPlan) {
      toast.error('Please select at least one plan');
      return;
    }

    setSavedSelections([...savedSelections, currentConfig]);
    setSelectedProducts([...selectedProducts, currentConfig]);
    cancelProductSelection();
    
    // Show success toast
    toast.success('Selection saved successfully!');
  };

  const editSavedSelection = (config: ProductConfig) => {
    setProductSelection({
      selectedProduct: config.product,
      selectedCategory: config.category,
      selectedSubProduct: config.subProduct || null,
      configuring: true
    });
    setCurrentConfig(config);
    
    // Remove from saved selections temporarily while editing
    setSavedSelections(savedSelections.filter(s => s.id !== config.id));
    setSelectedProducts(selectedProducts.filter(s => s.id !== config.id));

    // Auto-scroll to configure section
    setTimeout(() => {
      configureRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const removeSavedSelection = (configId: string) => {
    setSavedSelections(savedSelections.filter(s => s.id !== configId));
    setSelectedProducts(selectedProducts.filter(s => s.id !== configId));
  };

  const isProductConfigured = (category: string, product: string, subProduct?: string) => {
    return savedSelections.some(config => 
      config.category === category && 
      config.product === product && 
      (subProduct ? config.subProduct === subProduct : !config.subProduct)
    );
  };

  const getConfiguredCount = (category: string, product?: string) => {
    if (product) {
      return savedSelections.filter(config => 
        config.category === category && config.product === product
      ).length;
    }
    return savedSelections.filter(config => config.category === category).length;
  };

  const addPlanRow = () => {
    const newRow: PlanRow = {
      id: `row-${Date.now()}`,
      selectedPlan: '',
      quantity: 1
    };
    setCurrentConfig({
      ...currentConfig,
      planRows: [...currentConfig.planRows, newRow]
    });
  };

  const removePlanRow = (rowId: string) => {
    if (currentConfig.planRows.length === 1) return; // Keep at least one row
    setCurrentConfig({
      ...currentConfig,
      planRows: currentConfig.planRows.filter(row => row.id !== rowId)
    });
  };

  const updatePlanRow = (rowId: string, updates: Partial<PlanRow>) => {
    setCurrentConfig({
      ...currentConfig,
      planRows: currentConfig.planRows.map(row => 
        row.id === rowId ? { ...row, ...updates } : row
      )
    });
  };

  const toggleAddOns = (rowId: string) => {
    updatePlanRow(rowId, { showAddOns: !currentConfig.planRows.find(row => row.id === rowId)?.showAddOns });
  };

  const addAddOn = (rowId: string, addonName: string) => {
    const row = currentConfig.planRows.find(r => r.id === rowId);
    const existingAddOns = row?.selectedAddOns || [];
    
    if (!existingAddOns.find(addon => addon.name === addonName)) {
      updatePlanRow(rowId, {
        selectedAddOns: [...existingAddOns, { name: addonName, quantity: 1 }]
      });
    }
  };

  const updateAddOnQuantity = (rowId: string, addonName: string, quantity: number) => {
    const row = currentConfig.planRows.find(r => r.id === rowId);
    const updatedAddOns = row?.selectedAddOns?.map(addon =>
      addon.name === addonName ? { ...addon, quantity: Math.max(1, quantity) } : addon
    ) || [];
    
    updatePlanRow(rowId, { selectedAddOns: updatedAddOns });
  };

  const removeAddOn = (rowId: string, addonName: string) => {
    const row = currentConfig.planRows.find(r => r.id === rowId);
    const updatedAddOns = row?.selectedAddOns?.filter(addon => addon.name !== addonName) || [];
    
    updatePlanRow(rowId, { selectedAddOns: updatedAddOns });
  };

  const toggleRecommendedService = (type: 'security') => {
    setCurrentConfig({
      ...currentConfig,
      recommendedServices: currentConfig.recommendedServices.map(service =>
        service.type === type ? { ...service, expanded: !service.expanded } : service
      )
    });
  };

  const updateRecommendedService = (type: 'security', selectedService: string) => {
    setCurrentConfig({
      ...currentConfig,
      recommendedServices: currentConfig.recommendedServices.map(service =>
        service.type === type ? { ...service, selectedService } : service
      )
    });
  };

  const getAvailablePlans = () => {
    if (!productSelection.selectedCategory || !productSelection.selectedProduct) return [];
    
    const categoryData = productCatalog[productSelection.selectedCategory as keyof typeof productCatalog];
    const productData = categoryData?.products[productSelection.selectedProduct as keyof typeof categoryData.products];
    
    if (!productData) return [];

    let allPlans: string[] = [];
    
    // If a sub-product is selected, get its plans
    if (productSelection.selectedSubProduct && productData.subProducts) {
      const subProductData = productData.subProducts[productSelection.selectedSubProduct];
      if (subProductData?.plans) {
        allPlans = [...subProductData.plans];
      }
    } else {
      // Get main product plans
      if (productData.plans) {
        allPlans = [...productData.plans];
      }
    }
    
    return allPlans;
  };

  const getAddOnsForPlan = (planName: string) => {
    if (!productSelection.selectedCategory || !productSelection.selectedProduct) return [];
    
    const categoryData = productCatalog[productSelection.selectedCategory as keyof typeof productCatalog];
    const productData = categoryData?.products[productSelection.selectedProduct as keyof typeof categoryData.products];
    
    if (!productData) return [];

    let addOns: any[] = [];
    
    // If a sub-product is selected, get its add-ons
    if (productSelection.selectedSubProduct && productData.subProducts) {
      const subProductData = productData.subProducts[productSelection.selectedSubProduct];
      if (subProductData?.addOns) {
        addOns = [...subProductData.addOns];
      }
    } else {
      // Get main product add-ons
      if (productData.addOns) {
        addOns = [...productData.addOns];
      }
    }
    
    return addOns;
  };

  const isOSRequired = () => {
    if (!productSelection.selectedCategory || !productSelection.selectedProduct) return false;
    
    const categoryData = productCatalog[productSelection.selectedCategory as keyof typeof productCatalog];
    const productData = categoryData?.products[productSelection.selectedProduct as keyof typeof categoryData.products];
    
    return !!productData?.osOptions;
  };

  const useBandwidth = () => {
    if (!productSelection.selectedCategory || !productSelection.selectedProduct) return false;
    
    const categoryData = productCatalog[productSelection.selectedCategory as keyof typeof productCatalog];
    const productData = categoryData?.products[productSelection.selectedProduct as keyof typeof categoryData.products];
    
    return !!productData?.useBandwidth;
  };

  const getOSOptions = (osType: 'linux' | 'windows') => {
    if (!productSelection.selectedCategory || !productSelection.selectedProduct) return [];
    
    const categoryData = productCatalog[productSelection.selectedCategory as keyof typeof productCatalog];
    const productData = categoryData?.products[productSelection.selectedProduct as keyof typeof categoryData.products];
    
    return productData?.osOptions?.[osType] || [];
  };

  const getRecommendedServices = (type: 'database' | 'security') => {
    if (!productSelection.selectedCategory || !productSelection.selectedProduct) return [];
    
    const categoryData = productCatalog[productSelection.selectedCategory as keyof typeof productCatalog];
    const productData = categoryData?.products[productSelection.selectedProduct as keyof typeof categoryData.products];
    
    return productData?.suggestedAddOns?.[type] || [];
  };

  const startSolutionGeneration = () => {
    setIsGenerating(true);
    setGenerationStages(stages => stages.map(stage => ({ ...stage, completed: false, processing: false })));
    
    // Simulate AI processing stages
    const processStages = async () => {
      for (let i = 0; i < generationStages.length; i++) {
        setGenerationStages(stages => 
          stages.map((stage, index) => ({
            ...stage,
            processing: index === i,
            completed: index < i
          }))
        );
        
        // Wait for each stage
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Complete all stages
      setGenerationStages(stages => stages.map(stage => ({ ...stage, completed: true, processing: false })));
      setIsGenerating(false);
      setSolutionGenerated(true);
      
      setTimeout(() => {
        setShowGenerationDialog(false);
        toast.success('Solution document generated successfully!');
      }, 1000);
    };
    
    processStages();
  };

  const updateBOMItem = (id: string, field: string, value: number) => {
    setBomItems(items => 
      items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const deleteBOMItem = (id: string) => {
    setBomItems(items => items.filter(item => item.id !== id));
    toast.success('BOM item deleted successfully');
  };

  const editBOMItem = (id: string) => {
    toast.info('Edit functionality to be implemented');
  };

  const addNewFromCatalogue = () => {
    setCurrentStep(2); // Navigate to Product Selection step
    toast.info('Navigate to Product Selection to add new items');
  };

  const calculateTotals = () => {
    const totalOTC = bomItems.reduce((sum, item) => sum + item.otc, 0);
    const totalARC = bomItems.reduce((sum, item) => sum + item.arc, 0);
    return { totalOTC, totalARC };
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Customer Information Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  Customer Information
                </CardTitle>
                <CardDescription>Select or add customer details for this requirement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Customer Type</Label>
                  <RadioGroup 
                    value={customerInfo.type} 
                    onValueChange={handleCustomerTypeChange}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="existing" id="existing" />
                      <Label htmlFor="existing">Existing Customer</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="existing-prospect" id="existing-prospect" />
                      <Label htmlFor="existing-prospect">Existing Prospect</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="new-prospect" id="new-prospect" />
                      <Label htmlFor="new-prospect">New Prospect</Label>
                    </div>
                  </RadioGroup>
                </div>

                {(customerInfo.type === 'existing' || customerInfo.type === 'existing-prospect') && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="search">
                        Search {customerInfo.type === 'existing' ? 'Customer' : 'Prospect'}
                      </Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="search"
                          placeholder={`Search for ${customerInfo.type === 'existing' ? 'customers' : 'prospects'}...`}
                          value={searchQuery}
                          onChange={(e) => handleSearch(e.target.value)}
                          className="pl-10"
                        />
                        {showSearchResults && filteredResults.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                            {filteredResults.map((entity) => (
                              <div
                                key={entity.id}
                                className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                                onClick={() => selectEntity(entity)}
                              >
                                <div className="font-medium">{entity.name}</div>
                                <div className="text-sm text-gray-500">{entity.id}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {customerInfo.name && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-green-800">Selected {customerInfo.type === 'existing' ? 'Customer' : 'Prospect'}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Name:</span> {customerInfo.name}
                          </div>
                          <div>
                            <span className="font-medium">ID:</span> {customerInfo.id}
                          </div>
                          <div>
                            <span className="font-medium">Business Type:</span> {customerInfo.businessType}
                          </div>
                          <div>
                            <span className="font-medium">Location:</span> {customerInfo.address}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {customerInfo.type === 'new-prospect' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name *</Label>
                        <Input
                          id="companyName"
                          placeholder="Enter company name"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="businessType">Business Type</Label>
                        <Input
                          id="businessType"
                          placeholder="e.g., Technology, Healthcare"
                          value={customerInfo.businessType}
                          onChange={(e) => setCustomerInfo({...customerInfo, businessType: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactPerson">Contact Person *</Label>
                        <Input
                          id="contactPerson"
                          placeholder="Enter contact person name"
                          value={customerInfo.contactPersonName}
                          onChange={(e) => setCustomerInfo({...customerInfo, contactPersonName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactEmail">Contact Email *</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          placeholder="Enter contact email"
                          value={customerInfo.contactEmail}
                          onChange={(e) => setCustomerInfo({...customerInfo, contactEmail: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="Enter city"
                          value={customerInfo.address}
                          onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Requirement Information Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Requirement Information
                </CardTitle>
                <CardDescription>Provide details about the project requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="requirementName">Requirement Name *</Label>
                    <Input
                      id="requirementName"
                      placeholder="Enter requirement name"
                      value={requirementInfo.name}
                      onChange={(e) => setRequirementInfo({...requirementInfo, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={requirementInfo.priority} onValueChange={(value: any) => setRequirementInfo({...requirementInfo, priority: value})}>
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
                  <div className="space-y-2">
                    <Label htmlFor="contractTerms">Contract Terms</Label>
                    <Select value={requirementInfo.contractTerms} onValueChange={(value) => setRequirementInfo({...requirementInfo, contractTerms: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select contract terms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1 Year">1 Year</SelectItem>
                        <SelectItem value="2 Years">2 Years</SelectItem>
                        <SelectItem value="3 Years">3 Years</SelectItem>
                        <SelectItem value="4 Years">4 Years</SelectItem>
                        <SelectItem value="5 Years">5 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Select value={requirementInfo.location} onValueChange={(value) => setRequirementInfo({...requirementInfo, location: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mumbai">Mumbai</SelectItem>
                        <SelectItem value="Bengaluru">Bengaluru</SelectItem>
                        <SelectItem value="Rabale">Rabale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orderType">Order Type</Label>
                    <Select value={requirementInfo.orderType || 'new'} onValueChange={(value: any) => setRequirementInfo({...requirementInfo, orderType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select order type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="modify">Modify</SelectItem>
                        <SelectItem value="shift">Shift</SelectItem>
                        <SelectItem value="renewal">Renewal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeline">Timeline</Label>
                    <Select value={requirementInfo.timeline} onValueChange={(value) => setRequirementInfo({...requirementInfo, timeline: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1 Month">1 Month</SelectItem>
                        <SelectItem value="2 Months">2 Months</SelectItem>
                        <SelectItem value="3 Months">3 Months</SelectItem>
                        <SelectItem value="6 Months">6 Months</SelectItem>
                        <SelectItem value="9 Months">9 Months</SelectItem>
                        <SelectItem value="12 Months">12 Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budgetRange">Budget Range</Label>
                    <Select value={requirementInfo.budgetRange} onValueChange={(value) => setRequirementInfo({...requirementInfo, budgetRange: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Under ₹1 Lakh">Under ₹1 Lakh</SelectItem>
                        <SelectItem value="₹1-5 Lakhs">₹1-5 Lakhs</SelectItem>
                        <SelectItem value="₹5-10 Lakhs">₹5-10 Lakhs</SelectItem>
                        <SelectItem value="₹10-25 Lakhs">₹10-25 Lakhs</SelectItem>
                        <SelectItem value="₹25-50 Lakhs">₹25-50 Lakhs</SelectItem>
                        <SelectItem value="₹50 Lakhs - 1 Crore">₹50 Lakhs - 1 Crore</SelectItem>
                        <SelectItem value="Above ₹1 Crore">Above ₹1 Crore</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Payment Model</Label>
                  <RadioGroup 
                    value={requirementInfo.paymentModel} 
                    onValueChange={(value: any) => setRequirementInfo({...requirementInfo, paymentModel: value})}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="payg" id="payg" />
                      <Label htmlFor="payg">Pay as you go</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="reserved" id="reserved" />
                      <Label htmlFor="reserved">Reserved Instance</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="drRequired" 
                    checked={requirementInfo.drRequired}
                    onCheckedChange={(checked) => setRequirementInfo({...requirementInfo, drRequired: !!checked})}
                  />
                  <Label htmlFor="drRequired">Disaster Recovery Required</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Requirement Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the project requirements in detail..."
                    value={requirementInfo.description}
                    onChange={(e) => setRequirementInfo({...requirementInfo, description: e.target.value})}
                    rows={4}
                  />
                </div>

                {/* <div className="space-y-2">
                  <Label htmlFor="document">Upload Requirement Document (Optional)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id="document"
                      className="hidden"
                      accept=".xls,.xlsx"
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="document" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <div className="text-sm text-gray-600">
                        <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Excel files only (.xls, .xlsx)</div>
                    </label>
                    {requirementInfo.document && (
                      <div className="mt-3 text-sm text-green-600">
                        ✓ {requirementInfo.document.name}
                      </div>
                    )}
                  </div>
                </div> */}
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Selection</CardTitle>
                <CardDescription>
                  Browse and select products from our catalogue
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Category Tabs */}
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
                  <div className="flex justify-start">
                    <TabsList className="grid grid-cols-4 lg:grid-cols-7">
                      {Object.keys(productCatalog).map((category) => {
                        const categoryData = productCatalog[category as keyof typeof productCatalog];
                        const Icon = categoryData.icon;
                        const count = getConfiguredCount(category);
                        
                        return (
                          <TabsTrigger key={category} value={category} className="flex items-center space-x-2">
                            <Icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{category}</span>
                            {count > 0 && (
                              <Badge variant="secondary" className="ml-1 text-xs">
                                {count}
                              </Badge>
                            )}
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>
                  </div>

                  {Object.keys(productCatalog).map((category) => (
                    <TabsContent key={category} value={category} className="mt-0">
                      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        {/* Left Panel - Product Tree (smaller space) */}
                        <div className="lg:col-span-1">
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center">
                                <Package className="w-5 h-5 mr-2" />
                                {category} Catalogue
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              {Object.entries(productCatalog[category as keyof typeof productCatalog].products).map(([productName, productData]) => {
                                const key = `${category}-${productName}`;
                                const isExpanded = productTreeState[key]?.expanded;
                                const hasSubProducts = productData.subProducts;
                                const productCount = getConfiguredCount(category, productName);

                                return (
                                  <div key={productName} className="border rounded-lg">
                                    <div className="p-2">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2 flex-1">
                                          {hasSubProducts ? (
                                            <FolderOpen className="w-4 h-4 text-muted-foreground" />
                                          ) : (
                                            <Package className="w-4 h-4 text-muted-foreground" />
                                          )}
                                          <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                              <span className="text-sm font-medium">{productName}</span>
                                              {isProductConfigured(category, productName) && (
                                                <Check className="w-4 h-4 text-green-600" />
                                              )}
                                              {productCount > 0 && (
                                                <Badge variant="secondary" className="text-xs">
                                                  {productCount}
                                                </Badge>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        
                                        {!hasSubProducts && !isProductConfigured(category, productName) && (
                                          <Button 
                                            size="sm" 
                                            variant="default"
                                            onClick={() => selectProduct(category, productName)}
                                          >
                                            Add
                                          </Button>
                                        )}
                                      </div>

                                      {hasSubProducts && (
                                        <div className="mt-2 pl-4 space-y-1">
                                          {Object.entries(productData.subProducts).map(([subProductName, subProductData]) => {
                                            const isSubConfigured = isProductConfigured(category, productName, subProductName);
                                            
                                            return (
                                              <div key={subProductName} className="flex items-center justify-between p-1 bg-muted/30 rounded text-sm">
                                                <div className="flex items-center space-x-2 flex-1">
                                                  <div className="w-2 h-2 bg-muted-foreground/40 rounded-full"></div>
                                                  <span>{subProductName}</span>
                                                  {isSubConfigured && (
                                                    <Check className="w-3 h-3 text-green-600" />
                                                  )}
                                                </div>
                                                {!isSubConfigured && (
                                                  <Button 
                                                    size="sm" 
                                                    variant="default"
                                                    onClick={() => selectProduct(category, productName, subProductName)}
                                                    className="text-xs px-2 py-1 h-auto"
                                                  >
                                                    Add
                                                  </Button>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </CardContent>
                          </Card>
                        </div>

                        {/* Right Panel - Saved Selections and Configure (larger space) */}
                        <div className="lg:col-span-4 space-y-6">
                          {/* Saved Selections */}
                          {savedSelections.filter(s => s.category === category).length > 0 && (
                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <ShoppingCart className="w-5 h-5 mr-2" />
                                    Saved Selections
                                  </div>
                                  <Badge variant="secondary">
                                    {savedSelections.filter(s => s.category === category).length}
                                  </Badge>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                {savedSelections
                                  .filter(s => s.category === category)
                                  .map((selection) => (
                                    <div 
                                      key={selection.id}
                                      className="p-3 border rounded-lg bg-muted/30"
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                          <div className="font-medium text-sm">{selection.product}</div>
                                          {selection.subProduct && (
                                            <div className="text-xs text-muted-foreground">
                                              → {selection.subProduct}
                                            </div>
                                          )}
                                          <div className="text-xs text-muted-foreground mt-1">
                                            {selection.planRows.filter(row => row.selectedPlan).length} plan{selection.planRows.filter(row => row.selectedPlan).length !== 1 ? 's' : ''} configured
                                          </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => editSavedSelection(selection)}
                                          >
                                            <Edit3 className="w-4 h-4" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeSavedSelection(selection.id)}
                                          >
                                            <X className="w-4 h-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </CardContent>
                            </Card>
                          )}

                          {/* Configure Section */}
                          <div ref={configureRef}>
                            {productSelection.configuring && productSelection.selectedCategory === category ? (
                              <Card>
                                <CardHeader>
                                  <div>
                                    <CardTitle className="flex items-center">
                                      <Settings className="w-5 h-5 mr-2" />
                                      Add {productSelection.selectedProduct}
                                      {productSelection.selectedSubProduct && (
                                        <span className="text-blue-600 ml-2">
                                          → {productSelection.selectedSubProduct}
                                        </span>
                                      )}
                                    </CardTitle>
                                    <CardDescription>
                                      Category: {productSelection.selectedCategory} • Select product plans
                                    </CardDescription>
                                  </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                  {/* Plan Configuration */}
                                  <div>
                                    <div className="flex justify-end mb-4">
                                      <Button variant="outline" size="sm" onClick={addPlanRow}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add More
                                      </Button>
                                    </div>

                                    <div className="space-y-4">
                                      {currentConfig.planRows.map((row, index) => (
                                        <div key={row.id} className="p-4 border rounded-lg space-y-4">
                                          <div className="flex items-center justify-between">
                                            <Label className="text-sm font-medium">
                                              Plan {index + 1}
                                            </Label>
                                            {currentConfig.planRows.length > 1 && (
                                              <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => removePlanRow(row.id)}
                                              >
                                                <Trash2 className="w-4 h-4" />
                                              </Button>
                                            )}
                                          </div>
                                          
                                          <div className="grid grid-cols-1 gap-4">
                                            <div className="space-y-2">
                                              <Label className="text-sm">Plan</Label>
                                              <Select 
                                                value={row.selectedPlan} 
                                                onValueChange={(value) => updatePlanRow(row.id, { selectedPlan: value })}
                                              >
                                                <SelectTrigger>
                                                  <SelectValue placeholder="Select plan" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  {getAvailablePlans().map((plan) => (
                                                    <SelectItem key={plan} value={plan}>
                                                      {plan}
                                                    </SelectItem>
                                                  ))}
                                                </SelectContent>
                                              </Select>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                              <div className="space-y-2">
                                                <Label className="text-sm">Quantity</Label>
                                                <Input
                                                  type="number"
                                                  min="1"
                                                  value={row.quantity || 1}
                                                  onChange={(e) => updatePlanRow(row.id, { quantity: parseInt(e.target.value) || 1 })}
                                                  className="w-20 h-9"
                                                />
                                              </div>

                                              {useBandwidth() && (
                                                <div className="space-y-2">
                                                  <Label className="text-sm">Bandwidth (Mbps)</Label>
                                                  <Select 
                                                    value={row.bandwidth?.toString() || ''} 
                                                    onValueChange={(value) => updatePlanRow(row.id, { bandwidth: parseInt(value) })}
                                                  >
                                                    <SelectTrigger>
                                                      <SelectValue placeholder="Select bandwidth" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      {bandwidthOptions.map((bw) => (
                                                        <SelectItem key={bw} value={bw.toString()}>
                                                          {bw} Mbps
                                                        </SelectItem>
                                                      ))}
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                              )}
                                            </div>

                                            {/* OS Selection */}
                                            {isOSRequired() && (
                                              <div className="space-y-4">
                                                <div className="space-y-2">
                                                  <Label className="text-sm">Operating System Type</Label>
                                                  <Select 
                                                    value={row.selectedOSType || ''} 
                                                    onValueChange={(value: 'linux' | 'windows') => updatePlanRow(row.id, { selectedOSType: value, selectedOS: '' })}
                                                  >
                                                    <SelectTrigger>
                                                      <SelectValue placeholder="Select OS type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="linux">Linux</SelectItem>
                                                      <SelectItem value="windows">Windows</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                </div>

                                                {row.selectedOSType && (
                                                  <div className="space-y-2">
                                                    <Label className="text-sm">Operating System</Label>
                                                    <Select 
                                                      value={row.selectedOS || ''} 
                                                      onValueChange={(value) => updatePlanRow(row.id, { selectedOS: value })}
                                                    >
                                                      <SelectTrigger>
                                                        <SelectValue placeholder="Select OS" />
                                                      </SelectTrigger>
                                                      <SelectContent>
                                                        {getOSOptions(row.selectedOSType).map((os) => (
                                                          <SelectItem key={os} value={os}>
                                                            {os}
                                                          </SelectItem>
                                                        ))}
                                                      </SelectContent>
                                                    </Select>
                                                  </div>
                                                )}

                                                {/* Database Services */}
                                                {row.selectedOSType && getRecommendedServices('database').length > 0 && (
                                                  <div className="space-y-2">
                                                    <Label className="text-sm">Database Service (Optional)</Label>
                                                    <Select 
                                                      value={row.selectedDatabase || 'none'} 
                                                      onValueChange={(value) => updatePlanRow(row.id, { selectedDatabase: value === 'none' ? '' : value })}
                                                    >
                                                      <SelectTrigger>
                                                        <SelectValue placeholder="Select database service" />
                                                      </SelectTrigger>
                                                      <SelectContent>
                                                        <SelectItem value="none">None</SelectItem>
                                                        {getRecommendedServices('database').map((db) => (
                                                          <SelectItem key={db} value={db}>
                                                            {db}
                                                          </SelectItem>
                                                        ))}
                                                      </SelectContent>
                                                    </Select>
                                                  </div>
                                                )}
                                              </div>
                                            )}

                                            {/* VPE RAM Selection */}
                                            {productSelection.selectedProduct === 'VPE' && (
                                              <div className="space-y-4">
                                                <Label className="text-sm font-medium">RAM Add-ons</Label>
                                                <div className="grid grid-cols-2 gap-4">
                                                  <div className="space-y-2">
                                                    <Button
                                                      variant="outline"
                                                      className="w-full justify-start"
                                                      onClick={() => {
                                                        const current32 = row.selectedRAM32 || 0;
                                                        updatePlanRow(row.id, { selectedRAM32: current32 + 1 });
                                                      }}
                                                    >
                                                      <Plus className="w-4 h-4 mr-2" />
                                                      32GB RAM
                                                    </Button>
                                                    {row.selectedRAM32 && row.selectedRAM32 > 0 && (
                                                      <div className="flex items-center space-x-2">
                                                        <Input
                                                          type="number"
                                                          min="0"
                                                          value={row.selectedRAM32}
                                                          onChange={(e) => updatePlanRow(row.id, { selectedRAM32: parseInt(e.target.value) || 0 })}
                                                          className="w-20 h-8"
                                                        />
                                                        <span className="text-sm text-muted-foreground">units</span>
                                                      </div>
                                                    )}
                                                  </div>
                                                  <div className="space-y-2">
                                                    <Button
                                                      variant="outline"
                                                      className="w-full justify-start"
                                                      onClick={() => {
                                                        const current64 = row.selectedRAM64 || 0;
                                                        updatePlanRow(row.id, { selectedRAM64: current64 + 1 });
                                                      }}
                                                    >
                                                      <Plus className="w-4 h-4 mr-2" />
                                                      64GB RAM
                                                    </Button>
                                                    {row.selectedRAM64 && row.selectedRAM64 > 0 && (
                                                      <div className="flex items-center space-x-2">
                                                        <Input
                                                          type="number"
                                                          min="0"
                                                          value={row.selectedRAM64}
                                                          onChange={(e) => updatePlanRow(row.id, { selectedRAM64: parseInt(e.target.value) || 0 })}
                                                          className="w-20 h-8"
                                                        />
                                                        <span className="text-sm text-muted-foreground">units</span>
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            )}

                                            {/* Public IP Quantity for Internet products */}
                                            {currentConfig.product === 'Internet' && (
                                              <div className="space-y-2">
                                                <Label className="text-sm">Public IP Quantity</Label>
                                                <Input
                                                  type="number"
                                                  min="0"
                                                  value={row.publicIpQuantity || 0}
                                                  onChange={(e) => updatePlanRow(row.id, { publicIpQuantity: parseInt(e.target.value) || 0 })}
                                                  className="w-20"
                                                />
                                              </div>
                                            )}

                                            {/* Other Addons for non-VPE and non-Internet products */}
                                            {productSelection.selectedProduct !== 'VPE' && currentConfig.product !== 'Internet' && getAddOnsForPlan(row.selectedPlan).length > 0 && (
                                              <div className="space-y-2">
                                                <Button
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() => toggleAddOns(row.id)}
                                                  className="text-sm"
                                                >
                                                  <Plus className="w-4 h-4 mr-2" />
                                                  Addons
                                                  {row.showAddOns ? (
                                                    <ChevronUp className="w-4 h-4 ml-2" />
                                                  ) : (
                                                    <ChevronDown className="w-4 h-4 ml-2" />
                                                  )}
                                                </Button>

                                                {row.showAddOns && (
                                                  <div className="space-y-3 bg-muted/30 p-3 rounded-lg">
                                                    <Label className="text-sm font-medium">Add-ons</Label>
                                                    
                                                    {/* vCPU and vRAM Direct Inputs */}
                                                    {getAddOnsForPlan(row.selectedPlan).filter(addon => addon.type === 'number').map((addon) => (
                                                      <div key={addon.name} className="flex items-center justify-between">
                                                        <span className="text-sm">{addon.name}</span>
                                                        <div className="flex items-center space-x-2">
                                                          <Input
                                                            type="number"
                                                            min="0"
                                                            placeholder="Qty"
                                                            value={row.selectedAddOns?.find(a => a.name === addon.name)?.quantity || ''}
                                                            onChange={(e) => {
                                                              const qty = parseInt(e.target.value) || 0;
                                                              if (qty > 0) {
                                                                addAddOn(row.id, addon.name);
                                                                updateAddOnQuantity(row.id, addon.name, qty);
                                                              } else {
                                                                removeAddOn(row.id, addon.name);
                                                              }
                                                            }}
                                                            className="w-20 h-8"
                                                          />
                                                        </div>
                                                      </div>
                                                    ))}

                                                    {/* Other Addons Dropdown */}
                                                    {getAddOnsForPlan(row.selectedPlan).filter(addon => addon.type !== 'number').map((addon) => (
                                                      <div key={addon.name} className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                          <span className="text-sm">{addon.name}</span>
                                                          <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => addAddOn(row.id, addon.name)}
                                                            className="text-xs px-2 py-1 h-auto"
                                                          >
                                                            <Plus className="w-3 h-3 mr-1" />
                                                            Add
                                                          </Button>
                                                        </div>
                                                        
                                                        {/* Selected Add-ons */}
                                                        {row.selectedAddOns?.filter(a => a.name === addon.name).map((selectedAddon, idx) => (
                                                          <div key={idx} className="flex items-center justify-between pl-4 py-1 bg-background rounded">
                                                            <span className="text-xs">{selectedAddon.name}</span>
                                                            <div className="flex items-center space-x-2">
                                                              <Input
                                                                type="number"
                                                                min="1"
                                                                value={selectedAddon.quantity}
                                                                onChange={(e) => updateAddOnQuantity(row.id, selectedAddon.name, parseInt(e.target.value) || 1)}
                                                                className="w-16 h-6 text-xs"
                                                              />
                                                              <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeAddOn(row.id, selectedAddon.name)}
                                                                className="h-6 w-6 p-0"
                                                              >
                                                                <X className="w-3 h-3" />
                                                              </Button>
                                                            </div>
                                                          </div>
                                                        ))}
                                                      </div>
                                                    ))}
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Recommended Services */}
                                  {currentConfig.recommendedServices.map((service) => (
                                    <div key={service.type} className="space-y-3">
                                      <Button
                                        variant="outline"
                                        onClick={() => toggleRecommendedService(service.type)}
                                        className="w-full justify-between"
                                      >
                                        <span className="flex items-center">
                                          <Shield className="w-4 h-4 mr-2" />
                                          Recommended {service.type.charAt(0).toUpperCase() + service.type.slice(1)} Services
                                        </span>
                                        {service.expanded ? (
                                          <ChevronUp className="w-4 h-4" />
                                        ) : (
                                          <ChevronDown className="w-4 h-4" />
                                        )}
                                      </Button>

                                      {service.expanded && (
                                        <div className="space-y-2 bg-muted/30 p-3 rounded-lg">
                                          <Label className="text-sm">Select {service.type} service</Label>
                                          <Select 
                                            value={service.selectedService || 'none'} 
                                            onValueChange={(value) => updateRecommendedService(service.type, value === 'none' ? '' : value)}
                                          >
                                            <SelectTrigger>
                                              <SelectValue placeholder={`Select ${service.type} service`} />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="none">None</SelectItem>
                                              {getRecommendedServices(service.type).map((serviceOption) => (
                                                <SelectItem key={serviceOption} value={serviceOption}>
                                                  {serviceOption}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      )}
                                    </div>
                                  ))}

                                  {/* Save Selection Button */}
                                  <div className="pt-4 border-t">
                                    <Button onClick={saveSelection} className="w-full">
                                      <Save className="w-4 h-4 mr-2" />
                                      Save Selection
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ) : (
                              <Card>
                                <CardContent className="flex items-center justify-center py-12">
                                  <div className="text-center">
                                    <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">Select a product to configure</p>
                                    <p className="text-sm text-muted-foreground">Choose from the product list on the left</p>
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>

                {/* Category Navigation */}
                <div className="flex items-center justify-between mt-6 pt-6 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateToCategory('prev')}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {getNavigationButtonText('prev')}
                  </Button>
                  
                  <div className="text-sm text-muted-foreground">
                    {selectedCategory} Category
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateToCategory('next')}
                  >
                    {getNavigationButtonText('next')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                BOM Management
              </CardTitle>
              <CardDescription>Review and configure Bill of Materials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">Bill of Materials</h3>
                    <p className="text-sm text-muted-foreground">Manage your product configurations and pricing</p>
                  </div>
                  <Button onClick={addNewFromCatalogue} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New from Catalogue
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Product Name</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">SKU</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Specifications</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Quantity</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">OTC (₹)</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">ARC (₹)</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bomItems.map((item) => (
                        <tr key={item.id}>
                          <td className="border border-gray-300 px-4 py-2">{item.category}</td>
                          <td className="border border-gray-300 px-4 py-2">{item.productName}</td>
                          <td className="border border-gray-300 px-4 py-2">{item.sku}</td>
                          <td className="border border-gray-300 px-4 py-2">{item.specifications}</td>
                          <td className="border border-gray-300 px-4 py-2">
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateBOMItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                              className="w-20"
                            />
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            <Input
                              type="number"
                              min="0"
                              value={item.otc}
                              onChange={(e) => updateBOMItem(item.id, 'otc', parseInt(e.target.value) || 0)}
                              className="w-28"
                            />
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            <Input
                              type="number"
                              min="0"
                              value={item.arc}
                              onChange={(e) => updateBOMItem(item.id, 'arc', parseInt(e.target.value) || 0)}
                              className="w-28"
                            />
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => editBOMItem(item.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit3 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteBOMItem(item.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-blue-50 font-semibold">
                        <td colSpan={6} className="border border-gray-300 px-4 py-2 text-right">Total:</td>
                        <td className="border border-gray-300 px-4 py-2">₹{calculateTotals().totalOTC.toLocaleString()}</td>
                        <td className="border border-gray-300 px-4 py-2">₹{calculateTotals().totalARC.toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export BOM
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                AI Solution Document Generation
              </CardTitle>
              <CardDescription>Generate AI-powered solution documents based on your product selections</CardDescription>
            </CardHeader>
            <CardContent>
              {!solutionGenerated ? (
                <div className="text-center py-12">
                  <Bot className="w-16 h-16 text-blue-600 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold mb-4">Ready to Generate Solution Document</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Our AI will analyze your product selections and customer requirements to generate a comprehensive solution document.
                  </p>
                  <Button 
                    onClick={() => setShowGenerationDialog(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Solution Document
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Solution Document Generated</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <History className="w-4 h-4 mr-2" />
                        Version History
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Document
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-6 bg-gray-50">
                    <h4 className="font-semibold mb-3">Solution Overview</h4>
                    <p className="text-sm text-muted-foreground">
                      A comprehensive cloud solution document has been generated based on your product selections and customer requirements. 
                      The document includes technical specifications, architecture diagrams, implementation timeline, and pricing details.
                    </p>
                  </div>
                </div>
              )}

              {/* Generation Dialog */}
              <Dialog open={showGenerationDialog} onOpenChange={setShowGenerationDialog}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Generate Solution Document</DialogTitle>
                    <DialogDescription>
                      Confirm to start AI-powered solution document generation. This process will analyze your product selections and create a comprehensive technical document.
                    </DialogDescription>
                  </DialogHeader>
                  
                  {!isGenerating ? (
                    <div className="flex justify-end space-x-3">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowGenerationDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={startSolutionGeneration}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Generate Document
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
                        <p className="font-medium">Generating Solution Document</p>
                        <p className="text-sm text-muted-foreground">This may take a few moments...</p>
                      </div>
                      
                      <div className="space-y-3">
                        {generationStages.map((stage) => {
                          const IconComponent = stage.icon;
                          return (
                            <div key={stage.id} className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                stage.completed 
                                  ? 'bg-green-100 text-green-600' 
                                  : stage.processing 
                                    ? 'bg-blue-100 text-blue-600' 
                                    : 'bg-gray-100 text-gray-400'
                              }`}>
                                {stage.completed ? (
                                  <CheckCircle className="w-4 h-4" />
                                ) : stage.processing ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <IconComponent className="w-4 h-4" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className={`text-sm font-medium ${
                                  stage.completed ? 'text-green-700' : stage.processing ? 'text-blue-700' : 'text-gray-500'
                                }`}>
                                  {stage.title}
                                </div>
                                <div className="text-xs text-gray-500">{stage.description}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Send className="w-5 h-5 mr-2" />
                Proposal Generation
              </CardTitle>
              <CardDescription>Generate and finalize customer proposals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Ready to Generate Proposal</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  All components are ready. Generate the final proposal document for customer review and approval.
                </p>
                <div className="flex justify-center space-x-3">
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Proposal
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Send className="w-4 h-4 mr-2" />
                    Generate Proposal
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quick Proposal Creation</h1>
              <p className="text-gray-600">Create comprehensive proposals with our streamlined workflow</p>
            </div>
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Progress Stepper */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors
                      ${step.completed 
                        ? 'bg-green-100 border-green-500 text-green-700' 
                        : step.current 
                          ? 'bg-blue-100 border-blue-500 text-blue-700' 
                          : 'bg-gray-100 border-gray-300 text-gray-500'
                      }
                    `}>
                      {step.completed ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <step.icon className="w-6 h-6" />
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <div className={`
                        text-sm font-medium
                        ${step.current ? 'text-blue-700' : step.completed ? 'text-green-700' : 'text-gray-500'}
                      `}>
                        {step.title}
                      </div>
                      <div className="text-xs text-gray-500 max-w-32">
                        {step.description}
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`
                      w-24 h-0.5 mx-4 transition-colors
                      ${step.completed ? 'bg-green-500' : 'bg-gray-300'}
                    `} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <div className="mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button 
                onClick={handleNext}
                disabled={currentStep === 5}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
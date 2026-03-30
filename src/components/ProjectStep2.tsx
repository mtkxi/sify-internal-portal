import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Checkbox } from './ui/checkbox';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import {
  ArrowLeft,
  ArrowRight,
  Server,
  Zap,
  Building2,
  Plus,
  Trash2,
  Info,
  Eye,
  Snowflake,
  Plug,
  Network,
  Cable,
  Users,
  Shield,
  Archive,
  Settings,
  Truck,
  Wifi,
  Phone,
  Monitor,
  Coffee,
  Lock,
  HardDrive,
  Wrench,
  Camera,
  Scan,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Clock,
  Cloud,
  Globe,
  Database,
  Cpu,
  BarChart3,
  ShieldCheck,
  Router,
  CloudLightning
} from 'lucide-react';

// Infrastructure Requirements interfaces
interface RackGroup {
  id: string;
  quantity: string;
  rackType: 'full_rack' | 'unit_space';
  size: string;
  customSize?: string;
  type: 'standard' | 'custom';
  wxd: string;
}

interface CrossConnect {
  id: string;
  pointA: string;
  pointB: string;
  pointBType: 'carrier_partner' | 'customer_rack' | 'cloud_exchange' | 'other' | '';
  carrierPartnerName: string;
  carrierPortReference: string;
  lengthValue: string;
  lengthUnit: 'm' | 'km';
  shielding: boolean;
  conduitSecureInstall: boolean;
  abPathRedundancy: boolean;
  expeditedDelivery: boolean;
}

interface CrossConnectTypeData {
  type: 'ethernet_copper' | 'fiber_single_mode' | 'fiber_multi_mode' | 'inter_rack_cabling' | 'zero_manhole';
  count: number;
  connections: CrossConnect[];
  notes: string;
}

// New interfaces for rack-by-rack power configuration
interface RackPowerConfiguration {
  id: string;
  size: string;
  dimensions: string;
  powerModel: 'rated_power' | 'consumed_metered' | 'consumed_subscribed';
  committedPower: string;
  powerCircuit: string;
  pduType: string;
  pduSocket: string;
}

interface ColocationConfiguration {
  racks: RackPowerConfiguration[];
}

interface ProjectStep2Data {
  // Infrastructure Requirements - New Unified Structure
  colocationConfigurations: {
  };
  
  // Legacy fields for compatibility
  colocationModel: 'dedicated_rack' | 'caged_suite' | 'shared_rackspace' | 'private_suite';
  rackGroups: RackGroup[];
  powerModel: 'rated_power' | 'consumed_metered' | 'consumed_subscribed';
  averagePowerPerRackU: string;
  highDensityRackCount: string;
  highDensityMaxPower: string;
  powerCircuits: string;
  pduType: string;
  pduSocketOption: string;
  scalabilityRequirement: string;
  exclusivityRequirement: string;
  coolingRedundancy: string;
  coolingType: string;
  environmentalMonitoring: string;
  coolingExclusivity: string;

  // Cross Connect
  crossConnectTypes: CrossConnectTypeData[];
  
  // Office & Storage Space
  basicSeats: string;
  premiumSeats: string;
  seatsWithWifiAP: string;
  seatsWith32APower: string;
  sharedSpaceAmenities: string[];
  minimumCabins: string;
  additionalWorkstations: string;
  has100GBreakout: boolean;
  hasTelecomPackage: boolean;
  secureSpaceAmenities: string[];
  cat6CableRuns: string;
  om4FiberRuns: string;
  os2FiberRuns: string;
  secureConduitInstall: boolean;
  abPathRedundancy: boolean;
  storageAreaSqFt: string;
  storageType: 'temporary' | 'permanent' | '';
  otherStorageRequirements: string;
  
  // Value Added Services
  remoteHands: boolean;
  remoteHandsQuantity: number;
  smartHands: boolean;
  smartHandsQuantity: number;
  physicalMigration: boolean;
  tapeRotation: boolean;
  tapeRotationFrequency: 'standard' | 'daily' | 'weekly' | 'monthly';
  tapeRotationQuantity: number;
  fireVaultStorage: boolean;
  fireVaultUSize: '1U' | '4U' | '8U' | '42U';
  fireVaultQuantity: number;
  dedicatedStorage: boolean;
  storageLocation: string;
  storageSize: string;
  storageDuration: string;
  storageSecurityLevel: string;
  hardwareInstallation: boolean;
  osInstallation: boolean;
  configurationServices: boolean;
  monitoringServices: boolean;
  backupServices: boolean;
  securityAssessment: boolean;
  complianceAuditing: boolean;
  incidentResponse: boolean;
  disasterRecovery: boolean;
  biometricAccess: boolean;
  escortedAccess: boolean;
  securityClearanceLevel: string;
  videoSurveillance: boolean;
  accessLogging: boolean;
  assetTagging: boolean;
  inventoryTracking: string;
  assetDisposal: boolean;
  customRequirements: string;
}

// Constants
const colocationModels = [
  {
    value: 'dedicated_rack',
    label: 'Dedicated Rack Space',
    description: 'Individual racks for dedicated use with full control over rack configuration and access.'
  },
  {
    value: 'caged_suite',
    label: 'Caged Suite',
    description: 'Enclosed mesh cage with multiple racks for enhanced security and private space.'
  },
  {
    value: 'shared_rackspace',
    label: 'Shared Rackspace',
    description: 'Cost-effective option sharing rack space with other customers (1U-8U increments).'
  },
  {
    value: 'private_suite',
    label: 'Private Suite',
    description: 'Dedicated room with multiple racks and custom configurations for maximum privacy and control.'
  }
];

const powerModels = [
  {
    value: 'rated_power',
    label: 'Rated Power (kVA)',
    description: 'Fixed fee, bundled pricing model perfect for predictable workloads with consistent power requirements.'
  },
  {
    value: 'consumed_metered',
    label: 'Consumed Metered (kW)',
    description: 'Pay-per-use model charged by actual power consumption × PUE, ideal for variable or fluctuating loads.'
  },
  {
    value: 'consumed_subscribed',
    label: 'Consumed Subscribed (kW)',
    description: 'Hybrid model with base subscription + burst fees, perfect for seasonal or bursty workload patterns.'
  }
];

const rackSizes = {
  full_rack: ['42U', '45U', '47U', '52U'],
  unit_space: ['1U', '2U', '4U', '8U']
};

const standardDimensions = [
  '600x1000mm',
  '600x1200mm',
  '800x1000mm',
  '800x1200mm'
];

const powerCircuitOptions = [
  { value: 'a_plus_b', label: 'A+B (Dual Feed)' },
  { value: 'a_only', label: 'A Only (Single Feed)' }
];

const pduTypeOptions = [
  { value: 'smart', label: 'Smart PDU' },
  { value: 'standard', label: 'Standard (Normal) PDU' }
];

const pduSocketOptions = [
  { value: '1ph_16a_24c13', label: '1Ph, 16A, 24xC13' },
  { value: '1ph_32a_20c13_4c19', label: '1Ph, 32A, 20xC13, 4xC19' },
  { value: '3ph_32a_18c13_6c19', label: '3Ph, 32A, 18xC13, 6xC19' },
  { value: '3ph_32a_hd_c19', label: '3Ph, 32A, High-Density C19' },
  { value: '3ph_63a_12c13_12c19', label: '3Ph, 63A, 12xC13, 12xC19' },
  { value: '3ph_63a_max_c19', label: '3Ph, 63A, Max-Density C19' }
];

const coolingRedundancyOptions = [
  { value: 'n_plus_1', label: 'N+1' },
  { value: '2n', label: '2N' }
];

const coolingTypeOptions = [
  { value: 'any', label: 'Any' },
  { value: 'rdhx', label: 'Rear Door Heat Exchanger (RDHX)' },
  { value: 'air_cooling', label: 'Air Cooling' },
  { value: 'lc_d2c', label: 'Liquid Cooling Direct-to-Chip (LC-D2C)' }
];

const connectionTypes = [
  { 
    value: 'ethernet_copper', 
    label: 'Ethernet Copper', 
    icon: Cable,
    description: 'Traditional copper-based Ethernet connections for standard networking needs',
    color: 'blue'
  },
  { 
    value: 'fiber_single_mode', 
    label: 'Fiber Single Mode', 
    icon: Cable,
    description: 'High-performance single-mode fiber for long-distance, high-speed connections',
    color: 'green'
  },
  { 
    value: 'fiber_multi_mode', 
    label: 'Fiber Multi Mode', 
    icon: Cable,
    description: 'Multi-mode fiber for shorter distances with multiple light path transmission',
    color: 'purple'
  },
  { 
    value: 'inter_rack_cabling', 
    label: 'Inter-Rack Cabling', 
    icon: Network,
    description: 'Direct connections between customer racks within the same facility',
    color: 'orange'
  },
  { 
    value: 'zero_manhole', 
    label: 'Zero Manhole', 
    icon: Plug,
    description: 'Direct facility entry without requiring street-level manholes',
    color: 'red'
  }
];

const carrierPartnerOptions = [
  'Airtel',
  'BSNL',
  'Jio',
  'Vodafone Idea',
  'Tata Communications',
  'Bharti Airtel',
  'MTNL',
  'Railtel',
  'PowerGrid',
  'PGCIL',
  'Other'
];

const sharedSpaceAmenities = [
  'Privacy Screens',
  'Noise Cancelling Booths',
  'Breakout Area',
  'Meeting Room Access',
  'Coffee Station',
  'Storage Lockers'
];

const secureSpaceAmenities = [
  'WiFi Network',
  'Meeting Room',
  'Breakout Area',
  'Printing Facilities',
  'Reception Services',
  'Storage Cabinet'
];

const tapeRotationFrequencies = [
  { value: 'standard', label: 'Standard' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' }
];

const fireVaultSizes = [
  { value: '1U', label: '1U' },
  { value: '4U', label: '4U' },
  { value: '8U', label: '8U' },
  { value: '42U', label: '42U' }
];

// Domain and Product Structure
const domains = [
  {
    id: 'dc',
    name: 'Data Center',
    description: 'Core colocation infrastructure and services',
    icon: Building2,
    color: 'blue',
    isPrimary: true,
    bdRequired: true,
    tabs: [
      { id: 'infrastructure', name: 'Infrastructure', icon: Server },
      { id: 'cross-connect', name: 'Cross Connect', icon: Cable },
      { id: 'office-storage', name: 'Office & Storage', icon: Archive },
      { id: 'value-added', name: 'Value Added Services', icon: Settings },
      { id: 'security-compliance', name: 'Security & Compliance', icon: Shield }
    ]
  },
  {
    id: 'cloud',
    name: 'Cloud Services',
    description: 'Hybrid and multi-cloud solutions',
    icon: Cloud,
    color: 'green',
    isPrimary: false,
    bdRequired: false,
    tabs: [
      { id: 'compute', name: 'Compute Services', icon: Cpu },
      { id: 'storage', name: 'Storage Solutions', icon: Database },
      { id: 'networking', name: 'Cloud Networking', icon: CloudLightning },
      { id: 'analytics', name: 'Analytics & AI', icon: BarChart3 },
      { id: 'security', name: 'Cloud Security', icon: ShieldCheck }
    ]
  },
  {
    id: 'network',
    name: 'Network Solutions',
    description: 'Connectivity and network infrastructure',
    icon: Network,
    color: 'purple',
    isPrimary: false,
    bdRequired: false,
    tabs: [
      { id: 'connectivity', name: 'Connectivity', icon: Wifi },
      { id: 'wan', name: 'WAN Services', icon: Globe },
      { id: 'security', name: 'Network Security', icon: Shield },
      { id: 'optimization', name: 'Optimization', icon: Router }
    ]
  }
];

// Sample BD team members for assignment
const bdTeamMembers = {
  dc: [
    { id: 'dc-bd-1', name: 'Sarah Johnson', role: 'Senior DC Architect', email: 'sarah.johnson@company.com' },
    { id: 'dc-bd-2', name: 'Mike Chen', role: 'DC Solutions Engineer', email: 'mike.chen@company.com' },
    { id: 'dc-bd-3', name: 'Alex Rodriguez', role: 'Infrastructure Specialist', email: 'alex.rodriguez@company.com' }
  ],
  cloud: [
    { id: 'cloud-bd-1', name: 'Emma Wilson', role: 'Cloud Solutions Architect', email: 'emma.wilson@company.com' },
    { id: 'cloud-bd-2', name: 'David Kumar', role: 'Cloud Engineer', email: 'david.kumar@company.com' }
  ],
  network: [
    { id: 'net-bd-1', name: 'James Liu', role: 'Network Solutions Engineer', email: 'james.liu@company.com' },
    { id: 'net-bd-2', name: 'Lisa Thompson', role: 'Connectivity Specialist', email: 'lisa.thompson@company.com' }
  ]
};

export function ProjectStep2() {
  const navigate = useNavigate();
  const [selectedDomain, setSelectedDomain] = useState('dc');
  const [selectedTab, setSelectedTab] = useState('infrastructure');
  const [selectedConnectionType, setSelectedConnectionType] = useState<string | null>(null);
  const [selectedInfrastructureCategory, setSelectedInfrastructureCategory] = useState<string | null>('colocation-rack-power');
  const [selectedColocationModel, setSelectedColocationModel] = useState<string | null>(null);
  const [bulkApplyDialogOpen, setBulkApplyDialogOpen] = useState(false);
  const [selectedOfficeCategory, setSelectedOfficeCategory] = useState<string | null>('shared-seating');
  const [selectedServicesCategory, setSelectedServicesCategory] = useState<string | null>('technical-support');
  const [assignedBD, setAssignedBD] = useState<{[key: string]: string}>({ dc: '' });
  const [showBDSection, setShowBDSection] = useState<{[key: string]: boolean}>({ dc: true });
  const [bdComments, setBdComments] = useState<{[key: string]: string}>({});
  const [isBDDialogOpen, setIsBDDialogOpen] = useState(false);
  const [currentBDDomain, setCurrentBDDomain] = useState<string>('');
  const [domainConfigStatus, setDomainConfigStatus] = useState<{[key: string]: boolean}>({
    dc: false,
    cloud: false,
    network: false
  });
  
  // Batch configuration state
  const [selectedRackIds, setSelectedRackIds] = useState<string[]>([]);
  const [templateRackId, setTemplateRackId] = useState<string>('');
  
  const [formData, setFormData] = useState<ProjectStep2Data>({
    // Infrastructure - New Structure
    colocationConfigurations: {
      dedicated_rack: { racks: [] },
      caged_suite: { racks: [] },
      shared_rackspace: { racks: [] },
      private_suite: { racks: [] }
    },
    
    // Legacy fields for compatibility
    colocationModel: 'dedicated_rack',
    rackGroups: [{
      id: '1',
      quantity: '',
      rackType: 'full_rack',
      size: '',
      type: 'standard',
      wxd: ''
    }],
    powerModel: 'rated_power',
    averagePowerPerRackU: '',
    highDensityRackCount: '',
    highDensityMaxPower: '',
    powerCircuits: '',
    pduType: 'standard',
    pduSocketOption: '1ph_16a_24c13',
    scalabilityRequirement: '',
    exclusivityRequirement: '',
    coolingRedundancy: 'n_plus_1',
    coolingType: 'any',
    environmentalMonitoring: '',
    coolingExclusivity: '',

    // Cross Connect
    crossConnectTypes: [
      {
        type: 'ethernet_copper',
        count: 0,
        connections: [],
        notes: ''
      },
      {
        type: 'fiber_single_mode',
        count: 0,
        connections: [],
        notes: ''
      },
      {
        type: 'fiber_multi_mode',
        count: 0,
        connections: [],
        notes: ''
      },
      {
        type: 'inter_rack_cabling',
        count: 0,
        connections: [],
        notes: ''
      },
      {
        type: 'zero_manhole',
        count: 0,
        connections: [],
        notes: ''
      }
    ],

    // Office & Storage
    basicSeats: '',
    premiumSeats: '',
    seatsWithWifiAP: '',
    seatsWith32APower: '',
    sharedSpaceAmenities: [],
    minimumCabins: '',
    additionalWorkstations: '',
    has100GBreakout: false,
    hasTelecomPackage: false,
    secureSpaceAmenities: [],
    cat6CableRuns: '',
    om4FiberRuns: '',
    os2FiberRuns: '',
    secureConduitInstall: false,
    abPathRedundancy: false,
    storageAreaSqFt: '',
    storageType: '',
    otherStorageRequirements: '',

    // Value Added Services
    remoteHands: false,
    remoteHandsQuantity: 0,
    smartHands: false,
    smartHandsQuantity: 0,
    physicalMigration: false,
    tapeRotation: false,
    tapeRotationFrequency: 'standard',
    tapeRotationQuantity: 0,
    fireVaultStorage: false,
    fireVaultUSize: '1U',
    fireVaultQuantity: 0,
    dedicatedStorage: false,
    storageLocation: '',
    storageSize: '',
    storageDuration: '',
    storageSecurityLevel: '',
    hardwareInstallation: false,
    osInstallation: false,
    configurationServices: false,
    monitoringServices: false,
    backupServices: false,
    securityAssessment: false,
    complianceAuditing: false,
    incidentResponse: false,
    disasterRecovery: false,
    biometricAccess: false,
    escortedAccess: false,
    securityClearanceLevel: '',
    videoSurveillance: false,
    accessLogging: false,
    assetTagging: false,
    inventoryTracking: '',
    assetDisposal: false,
    customRequirements: ''
  });

  const currentDomain = domains.find(d => d.id === selectedDomain);

  const handleDomainChange = (domainId: string) => {
    setSelectedDomain(domainId);
    const domain = domains.find(d => d.id === domainId);
    if (domain?.tabs?.[0]) {
      setSelectedTab(domain.tabs[0].id);
    }
    
    // Initialize BD section for this domain if not already present
    if (!showBDSection[domainId]) {
      setShowBDSection(prev => ({ ...prev, [domainId]: domain?.bdRequired || false }));
    }
  };

  const handleTabChange = (tabId: string) => {
    setSelectedTab(tabId);
  };

  const handleInputChange = (field: keyof ProjectStep2Data, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Handle colocation model changes
      if (field === 'colocationModel' && value === 'shared_rackspace') {
        updated.powerCircuits = 'redundant_ab_low';
        updated.rackGroups = prev.rackGroups.map(group => ({
          ...group,
          rackType: 'unit_space',
          size: '',
          wxd: ''
        }));
      } else if (field === 'colocationModel' && prev.colocationModel === 'shared_rackspace') {
        updated.powerCircuits = '';
        updated.rackGroups = prev.rackGroups.map(group => ({
          ...group,
          rackType: 'full_rack',
          size: '',
          wxd: ''
        }));
      }
      
      return updated;
    });
  };

  const handleRackGroupChange = (id: string, field: keyof RackGroup, value: any) => {
    setFormData(prev => ({
      ...prev,
      rackGroups: prev.rackGroups.map(group => 
        group.id === id ? { ...group, [field]: value } : group
      )
    }));
  };

  const addRackGroup = () => {
    const newGroup: RackGroup = {
      id: Date.now().toString(),
      quantity: '',
      rackType: formData.colocationModel === 'shared_rackspace' ? 'unit_space' : 'full_rack',
      size: '',
      type: 'standard',
      wxd: ''
    };
    setFormData(prev => ({
      ...prev,
      rackGroups: [...prev.rackGroups, newGroup]
    }));
  };

  const removeRackGroup = (id: string) => {
    if (formData.rackGroups.length > 1) {
      setFormData(prev => ({
        ...prev,
        rackGroups: prev.rackGroups.filter(group => group.id !== id)
      }));
    }
  };

  // New functions for colocation rack & power management
  const addColocationConfiguration = (modelType: string) => {
    // Initialize configuration if it doesn't exist
    if (!formData.colocationConfigurations[modelType]) {
      setFormData(prev => ({
        ...prev,
        colocationConfigurations: {
          ...prev.colocationConfigurations,
          [modelType]: { racks: [] }
        }
      }));
    }
  };

  const addRackToColocation = (modelType: string) => {
    const newRack: RackPowerConfiguration = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      size: '',
      dimensions: '600x1000mm',
      powerModel: 'rated_power',
      committedPower: '',
      powerCircuit: 'a_plus_b',
      pduType: 'smart',
      pduSocket: '1ph_16a_24c13'
    };

    setFormData(prev => ({
      ...prev,
      colocationConfigurations: {
        ...prev.colocationConfigurations,
        [modelType]: {
          ...prev.colocationConfigurations[modelType],
          racks: [...(prev.colocationConfigurations[modelType]?.racks || []), newRack]
        }
      }
    }));
  };

  const removeRackFromColocation = (modelType: string, rackId: string) => {
    setFormData(prev => ({
      ...prev,
      colocationConfigurations: {
        ...prev.colocationConfigurations,
        [modelType]: {
          ...prev.colocationConfigurations[modelType],
          racks: prev.colocationConfigurations[modelType]?.racks.filter(rack => rack.id !== rackId) || []
        }
      }
    }));
  };

  const updateRackInColocation = (modelType: string, rackId: string, field: keyof RackPowerConfiguration, value: any) => {
    setFormData(prev => ({
      ...prev,
      colocationConfigurations: {
        ...prev.colocationConfigurations,
        [modelType]: {
          ...prev.colocationConfigurations[modelType],
          racks: prev.colocationConfigurations[modelType]?.racks.map(rack =>
            rack.id === rackId ? { ...rack, [field]: value } : rack
          ) || []
        }
      }
    }));
  };

  const handleConnectionTypeCountChange = (type: string, count: number) => {
    setFormData(prev => ({
      ...prev,
      crossConnectTypes: prev.crossConnectTypes.map(ct => {
        if (ct.type === type) {
          const currentConnections = ct.connections;
          const newConnections = [];
          
          // Keep existing connections up to the new count
          for (let i = 0; i < count; i++) {
            if (i < currentConnections.length) {
              newConnections.push(currentConnections[i]);
            } else {
              // Create new connection
              newConnections.push({
                id: `${type}-${i + 1}`,
                pointA: '',
                pointB: '',
                pointBType: '',
                carrierPartnerName: '',
                carrierPortReference: '',
                lengthValue: '',
                lengthUnit: 'm',
                shielding: false,
                conduitSecureInstall: false,
                abPathRedundancy: false,
                expeditedDelivery: false
              });
            }
          }
          
          return { ...ct, count, connections: newConnections };
        }
        return ct;
      })
    }));
  };

  const handleCrossConnectChange = (type: string, connectionId: string, field: keyof CrossConnect, value: any) => {
    setFormData(prev => ({
      ...prev,
      crossConnectTypes: prev.crossConnectTypes.map(ct => {
        if (ct.type === type) {
          return {
            ...ct,
            connections: ct.connections.map(conn => 
              conn.id === connectionId ? { ...conn, [field]: value } : conn
            )
          };
        }
        return ct;
      })
    }));
  };

  const handleConnectionTypeNotesChange = (type: string, notes: string) => {
    setFormData(prev => ({
      ...prev,
      crossConnectTypes: prev.crossConnectTypes.map(ct => {
        if (ct.type === type) {
          return { ...ct, notes };
        }
        return ct;
      })
    }));
  };

  const handleAmenityToggle = (amenity: string, type: 'shared' | 'secure') => {
    const field = type === 'shared' ? 'sharedSpaceAmenities' : 'secureSpaceAmenities';
    setFormData(prev => {
      const currentAmenities = prev[field] as string[];
      const isSelected = currentAmenities.includes(amenity);
      return {
        ...prev,
        [field]: isSelected 
          ? currentAmenities.filter(a => a !== amenity)
          : [...currentAmenities, amenity]
      };
    });
  };

  const handleBDAssignment = (domainId: string, bdId: string, comment?: string) => {
    setAssignedBD(prev => ({ ...prev, [domainId]: bdId }));
    if (comment !== undefined) {
      setBdComments(prev => ({ ...prev, [domainId]: comment }));
    }
  };

  const openBDDialog = (domainId: string) => {
    setCurrentBDDomain(domainId);
    setIsBDDialogOpen(true);
  };

  const handleBDSelection = (bdId: string, comment: string) => {
    handleBDAssignment(currentBDDomain, bdId, comment);
    setIsBDDialogOpen(false);
    setCurrentBDDomain('');
  };

  const toggleBDSection = (domainId: string) => {
    setShowBDSection(prev => ({ ...prev, [domainId]: !prev[domainId] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/new-project/step3');
  };

  const handleBack = () => {
    navigate('/new-project');
  };

  const isSharedRackspace = formData.colocationModel === 'shared_rackspace';

  const getAvailableRackSizes = (rackType: string, isSharedRackspace: boolean = false) => {
    if (isSharedRackspace || rackType === 'unit_space') {
      return [...rackSizes.unit_space, 'other'];
    }
    return rackSizes.full_rack;
  };

  const infrastructureCategories = [
    {
      value: 'colocation-model',
      label: 'Colocation Model',
      icon: Building2,
      description: 'Space configuration and model selection',
      color: 'blue'
    },
    {
      value: 'rack-configuration',
      label: 'Rack Configuration',
      icon: Server,
      description: 'Rack specifications and setup',
      color: 'green'
    },
    {
      value: 'power-requirements',
      label: 'Power Requirements',
      icon: Zap,
      description: 'Power model, circuits and PDU configuration',
      color: 'yellow'
    },
    {
      value: 'cooling-environment',
      label: 'Cooling & Environment',
      icon: Snowflake,
      description: 'Cooling specifications and environmental controls',
      color: 'purple'
    }
  ];

  const officeCategories = [
    {
      value: 'shared-seating',
      label: 'Shared Seating',
      icon: Users,
      description: 'Co-working space and shared amenities',
      color: 'blue'
    },
    {
      value: 'secure-office',
      label: 'Secure Office',
      icon: Shield,
      description: 'Private workspace and dedicated facilities',
      color: 'green'
    },
    {
      value: 'lan-cabling',
      label: 'LAN Cabling',
      icon: Cable,
      description: 'Network infrastructure and cabling requirements',
      color: 'yellow'
    },
    {
      value: 'storage-space',
      label: 'Storage Space',
      icon: Archive,
      description: 'Storage area requirements and specifications',
      color: 'purple'
    }
  ];

  const servicesCategories = [
    {
      value: 'technical-support',
      label: 'Technical Support',
      icon: Wrench,
      description: 'Remote hands, smart hands, and technical assistance',
      color: 'blue'
    },
    {
      value: 'migration-services',
      label: 'Migration Services',
      icon: Truck,
      description: 'Physical migration and equipment relocation',
      color: 'green'
    },
    {
      value: 'storage-security',
      label: 'Storage & Security',
      icon: Archive,
      description: 'Tape rotation, storage, and security services',
      color: 'yellow'
    },
    {
      value: 'additional-services',
      label: 'Additional Services',
      icon: Settings,
      description: 'Racking, PDU, CCTV, and access control systems',
      color: 'purple'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: { bg: string; border: string; text: string; accent: string } } = {
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', accent: 'bg-blue-600' },
      green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', accent: 'bg-green-600' },
      yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', accent: 'bg-yellow-600' },
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', accent: 'bg-purple-600' },
      orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', accent: 'bg-orange-600' },
      red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', accent: 'bg-red-600' }
    };
    return colorMap[color] || colorMap.blue;
  };

  // Helper function to check if DC domain has products configured
  const isDCConfigured = () => {
    const hasRackGroups = formData.rackGroups.some(group => 
      group.quantity || group.size || group.wxd
    );
    const hasCrossConnects = formData.crossConnectTypes.some(type => type.count > 0);
    const hasOfficeSpace = formData.basicSeats || formData.premiumSeats || 
      formData.minimumCabins || formData.storageAreaSqFt;
    const hasValueAddedServices = formData.remoteHands || formData.smartHands || 
      formData.physicalMigration || formData.tapeRotation || formData.fireVaultStorage;
    const hasSecurityServices = formData.biometricAccess || formData.escortedAccess || 
      formData.videoSurveillance || formData.accessLogging;
    
    return hasRackGroups || hasCrossConnects || hasOfficeSpace || hasValueAddedServices || hasSecurityServices;
  };

  // Helper function to check if Cloud domain has products configured
  const isCloudConfigured = () => {
    // Placeholder - would check cloud-specific services when implemented
    return false;
  };

  // Helper function to check if Network domain has products configured
  const isNetworkConfigured = () => {
    // Placeholder - would check network-specific services when implemented
    return false;
  };

  // Batch configuration helper functions
  const applyConfigToSelected = () => {
    if (!selectedColocationModel) return;
    const racks = formData.colocationConfigurations[selectedColocationModel].racks;
    const templateRack = racks.find(r => r.id === templateRackId);
    if (!templateRack) return;

    selectedRackIds.forEach(rackId => {
      if (rackId !== templateRackId) { // Don't apply to template itself
        updateRackInColocation(selectedColocationModel, rackId, 'size', templateRack.size);
        updateRackInColocation(selectedColocationModel, rackId, 'dimensions', templateRack.dimensions);
        updateRackInColocation(selectedColocationModel, rackId, 'powerModel', templateRack.powerModel);
        updateRackInColocation(selectedColocationModel, rackId, 'committedPower', templateRack.committedPower);
        updateRackInColocation(selectedColocationModel, rackId, 'powerCircuit', templateRack.powerCircuit);
        updateRackInColocation(selectedColocationModel, rackId, 'pduType', templateRack.pduType);
        updateRackInColocation(selectedColocationModel, rackId, 'pduSocket', templateRack.pduSocket);
        if (templateRack.customDimensions) {
          updateRackInColocation(selectedColocationModel, rackId, 'customDimensions', templateRack.customDimensions);
        }
      }
    });
    setSelectedRackIds([]);
    setTemplateRackId('');
  };

  const selectRange = (start: number, end: number) => {
    if (!selectedColocationModel) return;
    const racks = formData.colocationConfigurations[selectedColocationModel].racks;
    const rangeIds = racks.slice(start - 1, end).map(r => r.id);
    setSelectedRackIds(rangeIds);
  };

  const selectAll = () => {
    if (!selectedColocationModel) return;
    const racks = formData.colocationConfigurations[selectedColocationModel].racks;
    setSelectedRackIds(racks.map(r => r.id));
  };

  const clearSelection = () => {
    setSelectedRackIds([]);
    setTemplateRackId('');
  };

  // Update domain configuration status
  useEffect(() => {
    setDomainConfigStatus({
      dc: isDCConfigured(),
      cloud: isCloudConfigured(),
      network: isNetworkConfigured()
    });
  }, [
    formData.rackGroups,
    formData.crossConnectTypes,
    formData.basicSeats,
    formData.premiumSeats,
    formData.minimumCabins,
    formData.storageAreaSqFt,
    formData.remoteHands,
    formData.smartHands,
    formData.physicalMigration,
    formData.tapeRotation,
    formData.fireVaultStorage,
    formData.biometricAccess,
    formData.escortedAccess,
    formData.videoSurveillance,
    formData.accessLogging
  ]);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Step 1</span>
              </Button>
              <div>
                <h1>New Colocation Project</h1>
                <p className="text-muted-foreground mt-1">Step 2 of 3: Product Selection</p>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 border-2 border-green-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-green-700">✓</span>
                </div>
                <span className="text-sm font-medium text-green-700">Project Info</span>
              </div>
              <div className="w-8 h-0.5 bg-green-200"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 border-2 border-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-white">2</span>
                </div>
                <span className="text-sm font-medium text-blue-600">Product Selection</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-200"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-100 border-2 border-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-500">3</span>
                </div>
                <span className="text-sm font-medium text-gray-500">Project Submission</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Alert Info */}
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="w-4 h-4" />
              <AlertDescription>
                <strong>Multi-Domain Product Selection</strong>
                <br />
                Configure your colocation requirements across Data Center, Cloud Services, and Network Solutions. 
                BD team assignments are made for each domain you select.
              </AlertDescription>
            </Alert>

            <div className="flex gap-6">
              {/* Left Panel - Domain Selection */}
              <div className="w-80 flex-shrink-0 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Selection</h1>
                  <p className="text-gray-600">Configure your colocation services and select additional products from other domains</p>
                </div>
              </div>
            </div>

            {/* Domain Selection */}
            <div className="mb-6">
              <div className="grid grid-cols-3 gap-4">
                {domains.map(domain => {
                  const isSelected = selectedDomain === domain.id;
                  const colorClasses = getColorClasses(domain.color);
                  const hasProducts = domainConfigStatus[domain.id];
                  
                  return (
                    <Card 
                      key={domain.id}
                      className={`cursor-pointer transition-all ${
                        isSelected 
                          ? `${colorClasses.bg} ${colorClasses.border} ring-2 ring-${domain.color}-500 ring-opacity-50` 
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleDomainChange(domain.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg relative ${isSelected ? colorClasses.accent : 'bg-gray-100'}`}>
                              <domain.icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                              {hasProducts && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white">
                                  <CheckCircle className="w-full h-full text-white" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className={`font-medium ${isSelected ? colorClasses.text : 'text-gray-900'}`}>
                                  {domain.name}
                                </h3>
                                {domain.isPrimary && <Badge variant="secondary" className="text-xs">Primary</Badge>}
                                {hasProducts && (
                                  <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                                    Configured
                                  </Badge>
                                )}
                              </div>
                              <p className={`text-sm ${isSelected ? colorClasses.text : 'text-gray-600'}`}>
                                {domain.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Main Content */}
            <Card>
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {currentDomain && <currentDomain.icon className={`w-6 h-6 text-${currentDomain.color}-600`} />}
                    <div>
                      <CardTitle>{currentDomain?.name} Configuration</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">Configure products and services from this domain</p>
                    </div>
                  </div>
                  {currentDomain?.isPrimary && (
                    <Badge className="bg-blue-100 text-blue-700">Primary Domain</Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {/* BD Assignment Section */}
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Business Development Assignment</h3>
                    {currentDomain?.bdRequired && <span className="text-red-500 text-sm">Required</span>}
                  </div>
                  <div className="max-w-md">
                    {currentDomain && (() => {
                      const showSection = currentDomain.bdRequired || showBDSection[currentDomain.id];
                      const selectedBD = assignedBD[currentDomain.id] ? 
                        bdTeamMembers[currentDomain.id as keyof typeof bdTeamMembers]?.find(member => member.id === assignedBD[currentDomain.id]) : 
                        null;
                      
                      return (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <currentDomain.icon className={`w-4 h-4 text-${currentDomain.color}-600`} />
                              <span className="text-sm font-medium">{currentDomain.name} BD Assignment</span>
                              {currentDomain.bdRequired && <span className="text-red-500 text-xs">*</span>}
                            </div>
                            {!currentDomain.bdRequired && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleBDSection(currentDomain.id)}
                                className="text-xs"
                              >
                                {showSection ? 'Remove' : 'Add BD'}
                              </Button>
                            )}
                          </div>
                          
                          {showSection && (
                            <div className="space-y-3">
                              {selectedBD ? (
                                <div className="p-4 border border-gray-200 rounded-lg bg-white">
                                  <div className="flex items-center justify-between mb-2">
                                    <div>
                                      <p className="font-medium text-gray-900">{selectedBD.name}</p>
                                      <p className="text-sm text-gray-600">{selectedBD.role}</p>
                                      <p className="text-xs text-gray-500">{selectedBD.email}</p>
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => openBDDialog(currentDomain.id)}
                                    >
                                      Change
                                    </Button>
                                  </div>
                                  {/* Comments section */}
                                  {bdComments[currentDomain.id] && (
                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                      <p className="text-xs text-gray-500 mb-1">Comments:</p>
                                      <p className="text-xs text-gray-600">{bdComments[currentDomain.id]}</p>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <Button
                                  variant="outline"
                                  className="w-full justify-center"
                                  onClick={() => openBDDialog(currentDomain.id)}
                                >
                                  <Users className="w-4 h-4 mr-2" />
                                  Select BD Member
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Domain Tabs */}
                <Tabs value={selectedTab} onValueChange={handleTabChange} className="h-full">
                  <div className="border-b border-gray-200 px-6 pt-4">
                    <TabsList className="h-auto p-0 bg-transparent">
                      {currentDomain?.tabs.map(tab => (
                        <TabsTrigger 
                          key={tab.id} 
                          value={tab.id}
                          className="flex items-center space-x-2 px-4 py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
                        >
                          <tab.icon className="w-4 h-4" />
                          <span>{tab.name}</span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>

                  {/* DC Domain Tab Contents */}
                  {selectedDomain === 'dc' && (
                    <>
                      {/* Infrastructure Tab */}
                      <TabsContent value="infrastructure" className="mt-0 p-6">
                        <div className="flex gap-6 h-full">
                          {/* Left Sidebar - Categories */}
                          <div className="w-1/5 space-y-2">
                            <div className="mb-4">
                              <h3 className="font-medium text-gray-900 mb-2">Infrastructure Categories</h3>
                              <p className="text-sm text-gray-600">Select a category to configure</p>
                            </div>
                            
                            {/* Colocation Rack & Power Main Category */}
                            <div className="space-y-2">
                              <div className={`p-3 rounded-lg border transition-all ${
                                selectedInfrastructureCategory === 'colocation-rack-power' 
                                  ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-500 ring-opacity-50' 
                                  : 'bg-white border-gray-200 hover:border-gray-300'
                              }`}>
                                <div className="flex items-center space-x-2">
                                  <Building2 className={`w-4 h-4 ${selectedInfrastructureCategory === 'colocation-rack-power' ? 'text-blue-600' : 'text-gray-600'}`} />
                                  <span className={`text-sm font-medium ${selectedInfrastructureCategory === 'colocation-rack-power' ? 'text-blue-600' : 'text-gray-900'}`}>
                                    Colocation Rack & Power
                                  </span>
                                </div>
                                
                                {/* Colocation Model Sub-categories */}
                                <div className="mt-3 ml-6 space-y-2">
                                  {colocationModels.map((model) => {
                                    const isSelected = selectedColocationModel === model.value;
                                    const hasConfiguration = formData.colocationConfigurations[model.value]?.racks?.length > 0;
                                    
                                    return (
                                      <div key={model.value} className={`p-2 rounded border transition-all ${
                                        isSelected 
                                          ? 'bg-blue-100 border-blue-400' 
                                          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                                      }`}>
                                        <div className="flex items-center justify-between">
                                          <div 
                                            className="flex items-center space-x-2 cursor-pointer flex-1"
                                            onClick={() => {
                                              setSelectedInfrastructureCategory('colocation-rack-power');
                                              setSelectedColocationModel(model.value);
                                            }}
                                          >
                                            <span className={`text-xs font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                                              {model.label}
                                            </span>
                                            {hasConfiguration && (
                                              <CheckCircle className="w-3 h-3 text-green-600" />
                                            )}
                                          </div>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 px-2 text-xs bg-blue-600 text-white hover:bg-blue-700"
                                            onClick={() => {
                                              setSelectedInfrastructureCategory('colocation-rack-power');
                                              setSelectedColocationModel(model.value);
                                              addColocationConfiguration(model.value);
                                            }}
                                          >
                                            Add
                                          </Button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            {/* Cooling & Environment Category */}
                            <div className={`p-3 rounded-lg border cursor-pointer transition-all ${
                              selectedInfrastructureCategory === 'cooling-environment' 
                                ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-500 ring-opacity-50' 
                                : 'bg-white border-gray-200 hover:border-gray-300'
                            }`} onClick={() => setSelectedInfrastructureCategory('cooling-environment')}>
                              <div className="flex items-center space-x-2">
                                <Snowflake className={`w-4 h-4 ${selectedInfrastructureCategory === 'cooling-environment' ? 'text-purple-600' : 'text-gray-600'}`} />
                                <span className={`text-sm font-medium ${selectedInfrastructureCategory === 'cooling-environment' ? 'text-purple-600' : 'text-gray-900'}`}>
                                  Cooling & Environment
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right Content Area */}
                          <div className="flex-1 space-y-6 overflow-y-auto">
                            {!selectedInfrastructureCategory ? (
                              <Card>
                                <CardContent className="p-8 text-center">
                                  <Server className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                  <h3 className="font-medium text-gray-900 mb-2">Select Infrastructure Category</h3>
                                  <p className="text-gray-600">Choose a category from the left panel to configure infrastructure requirements.</p>
                                </CardContent>
                              </Card>
                            ) : (
                              <>
                                {selectedInfrastructureCategory === 'colocation-rack-power' && (
                                  <div className="space-y-6">
                                    {!selectedColocationModel ? (
                                      <Card>
                                        <CardContent className="p-8 text-center">
                                          <Building2 className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                                          <h3 className="font-medium text-gray-900 mb-2">Select Colocation Model</h3>
                                          <p className="text-gray-600">Choose a colocation model from the left panel to configure rack and power requirements.</p>
                                        </CardContent>
                                      </Card>
                                    ) : (
                                      <>
                                        {/* Model Overview */}
                                        <Card>
                                          <CardHeader>
                                            <CardTitle className="flex items-center space-x-2">
                                              <Building2 className="w-5 h-5 text-blue-600" />
                                              <span>{colocationModels.find(m => m.value === selectedColocationModel)?.label} Configuration</span>
                                            </CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            <p className="text-sm text-gray-600 mb-4">
                                              {colocationModels.find(m => m.value === selectedColocationModel)?.description}
                                            </p>
                                            
                                            {/* Rack Configuration Summary */}
                                            {formData.colocationConfigurations[selectedColocationModel]?.racks?.length > 0 && (
                                              <div className="bg-gray-50 p-4 rounded-lg">
                                                <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                                                  <BarChart3 className="w-4 h-4" />
                                                  <span>Current Configuration</span>
                                                </h4>
                                                <div className="space-y-3">
                                                  {/* Total Racks */}
                                                  <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600">Total Racks:</span>
                                                    <Badge variant="outline" className="text-blue-700 bg-blue-100">
                                                      {formData.colocationConfigurations[selectedColocationModel].racks.length}
                                                    </Badge>
                                                  </div>
                                                  
                                                  {/* Power Model Breakdown */}
                                                  {(() => {
                                                    const powerModelCounts = formData.colocationConfigurations[selectedColocationModel].racks.reduce((acc, rack) => {
                                                      if (rack.powerModel) {
                                                        acc[rack.powerModel] = (acc[rack.powerModel] || 0) + 1;
                                                      }
                                                      return acc;
                                                    }, {} as Record<string, number>);
                                                    
                                                    const totalConfiguredRacks = Object.values(powerModelCounts).reduce((sum, count) => sum + count, 0);
                                                    const unconfiguredRacks = formData.colocationConfigurations[selectedColocationModel].racks.length - totalConfiguredRacks;
                                                    
                                                    return (
                                                      <div>
                                                        <span className="text-sm text-gray-600 mb-2 block">Power Model Distribution:</span>
                                                        <div className="space-y-2">
                                                          {Object.entries(powerModelCounts).map(([model, count]) => {
                                                            const modelLabel = powerModels.find(pm => pm.value === model)?.label || model;
                                                            return (
                                                              <div key={model} className="flex items-center justify-between text-xs">
                                                                <span className="text-gray-600">{modelLabel}</span>
                                                                <Badge variant="outline" className="text-green-700 bg-green-100 text-xs">
                                                                  {count} rack{count !== 1 ? 's' : ''}
                                                                </Badge>
                                                              </div>
                                                            );
                                                          })}
                                                          {unconfiguredRacks > 0 && (
                                                            <div className="flex items-center justify-between text-xs">
                                                              <span className="text-gray-600">Unconfigured</span>
                                                              <Badge variant="outline" className="text-orange-700 bg-orange-100 text-xs">
                                                                {unconfiguredRacks} rack{unconfiguredRacks !== 1 ? 's' : ''}
                                                              </Badge>
                                                            </div>
                                                          )}
                                                          {Object.keys(powerModelCounts).length === 0 && unconfiguredRacks === 0 && (
                                                            <div className="text-xs text-gray-500 italic">
                                                              No power models configured yet
                                                            </div>
                                                          )}
                                                        </div>
                                                      </div>
                                                    );
                                                  })()}
                                                </div>
                                              </div>
                                            )}
                                          </CardContent>
                                        </Card>

                                        {/* Rack Configuration */}
                                        <Card>
                                          <CardHeader>
                                            <CardTitle className="flex items-center space-x-2">
                                              <Server className="w-5 h-5 text-green-600" />
                                              <span>Rack & Power Configuration</span>
                                            </CardTitle>
                                            <CardDescription>
                                              Configure your racks with specific power requirements. Start by selecting the number of racks you need.
                                            </CardDescription>
                                          </CardHeader>
                                          <CardContent>
                                            {/* Rack Count Selection */}
                                            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                              <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center space-x-2">
                                                  <BarChart3 className="w-4 h-4 text-blue-600" />
                                                  <Label className="text-blue-900 font-medium">Number of Racks</Label>
                                                </div>
                                                <Badge variant="outline" className="text-blue-700 bg-blue-100">
                                                  Total: {formData.colocationConfigurations[selectedColocationModel]?.racks?.length || 0}
                                                </Badge>
                                              </div>
                                              <div className="flex items-center space-x-4">
                                                <Input
                                                  type="number"
                                                  min="1"
                                                  max="50"
                                                  placeholder="e.g., 3"
                                                  className="w-32"
                                                  onChange={(e) => {
                                                    const targetCount = parseInt(e.target.value) || 0;
                                                    const currentCount = formData.colocationConfigurations[selectedColocationModel]?.racks?.length || 0;
                                                    
                                                    if (targetCount > currentCount) {
                                                      // Add racks
                                                      for (let i = currentCount; i < targetCount; i++) {
                                                        addRackToColocation(selectedColocationModel);
                                                      }
                                                    } else if (targetCount < currentCount && targetCount >= 0) {
                                                      // Remove racks from the end
                                                      const racks = formData.colocationConfigurations[selectedColocationModel]?.racks || [];
                                                      const racksToRemove = racks.slice(targetCount);
                                                      racksToRemove.forEach(rack => {
                                                        removeRackFromColocation(selectedColocationModel, rack.id);
                                                      });
                                                    }
                                                  }}
                                                  value={formData.colocationConfigurations[selectedColocationModel]?.racks?.length || ''}
                                                />
                                                <Button
                                                  type="button"
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() => addRackToColocation(selectedColocationModel)}
                                                  className="flex items-center space-x-2"
                                                >
                                                  <Plus className="w-4 h-4" />
                                                  <span>Add One</span>
                                                </Button>
                                              </div>
                                            </div>

                                            {formData.colocationConfigurations[selectedColocationModel]?.racks?.length === 0 ? (
                                              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                                                <Server className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-600 mb-4">No racks configured yet</p>
                                                <Button
                                                  type="button"
                                                  onClick={() => addRackToColocation(selectedColocationModel)}
                                                  className="flex items-center space-x-2"
                                                >
                                                  <Plus className="w-4 h-4" />
                                                  <span>Add First Rack</span>
                                                </Button>
                                              </div>
                                            ) : (
                                              <div className="space-y-4">
                                                {/* Rack Configuration Table */}
                                                {(() => {
                                                  const racks = formData.colocationConfigurations[selectedColocationModel].racks;
                                                  return (
                                                <div className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                          <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                                                            <Settings className="w-4 h-4" />
                                                            <span>Rack Configuration</span>
                                                          </h4>
                                                          <div className="flex items-center space-x-2">
                                                            {racks.length > 1 && (
                                                              <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                  const firstRack = racks[0];
                                                                  racks.forEach((rack, index) => {
                                                                    if (index > 0) { // Skip the first rack
                                                                      updateRackInColocation(selectedColocationModel, rack.id, 'size', firstRack.size);
                                                                      updateRackInColocation(selectedColocationModel, rack.id, 'dimensions', firstRack.dimensions);
                                                                      updateRackInColocation(selectedColocationModel, rack.id, 'powerModel', firstRack.powerModel);
                                                                      updateRackInColocation(selectedColocationModel, rack.id, 'committedPower', firstRack.committedPower);
                                                                      updateRackInColocation(selectedColocationModel, rack.id, 'powerCircuit', firstRack.powerCircuit);
                                                                      updateRackInColocation(selectedColocationModel, rack.id, 'pduType', firstRack.pduType);
                                                                      updateRackInColocation(selectedColocationModel, rack.id, 'pduSocket', firstRack.pduSocket);
                                                                      if (firstRack.customDimensions) {
                                                                        updateRackInColocation(selectedColocationModel, rack.id, 'customDimensions', firstRack.customDimensions);
                                                                      }
                                                                    }
                                                                  });
                                                                }}
                                                                className="flex items-center space-x-2 text-green-700 border-green-300 hover:bg-green-50"
                                                              >
                                                                <CheckCircle className="w-4 h-4" />
                                                                <span>Apply Row 1 to All</span>
                                                              </Button>
                                                            )}
                                                            <Badge variant="outline" className="text-gray-600">
                                                              Select racks for batch config
                                                            </Badge>
                                                          </div>
                                                        </div>

                                                        {/* Batch Configuration Controls */}
                                                        {selectedRackIds.length > 0 && (
                                                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                                            <div className="flex items-start justify-between gap-4">
                                                              <div className="flex-1">
                                                                <div className="flex items-center space-x-2 mb-2">
                                                                  <CheckCircle className="w-4 h-4 text-purple-600" />
                                                                  <span className="font-medium text-purple-900">Batch Configuration</span>
                                                                  <Badge variant="outline" className="text-purple-700 bg-purple-100">
                                                                    {selectedRackIds.length} racks selected
                                                                  </Badge>
                                                                </div>
                                                                <div className="flex items-center gap-4">
                                                                  <div className="flex items-center space-x-2">
                                                                    <Label className="text-sm text-purple-800">Template:</Label>
                                                                    <Select value={templateRackId} onValueChange={setTemplateRackId}>
                                                                      <SelectTrigger className="w-32 h-8 text-xs">
                                                                        <SelectValue placeholder="Choose rack" />
                                                                      </SelectTrigger>
                                                                      <SelectContent>
                                                                        {racks.map((rack, index) => (
                                                                          <SelectItem key={rack.id} value={rack.id}>
                                                                            Rack #{index + 1}
                                                                          </SelectItem>
                                                                        ))}
                                                                      </SelectContent>
                                                                    </Select>
                                                                  </div>
                                                                  <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    onClick={applyConfigToSelected}
                                                                    disabled={!templateRackId}
                                                                    className="bg-purple-600 hover:bg-purple-700 text-white"
                                                                  >
                                                                    Apply to Selected
                                                                  </Button>
                                                                  <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={clearSelection}
                                                                    className="text-purple-700 border-purple-300"
                                                                  >
                                                                    Clear Selection
                                                                  </Button>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        )}

                                                        {/* Quick Selection Helpers */}
                                                        {racks.length > 3 && (
                                                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                                            <div className="flex items-center justify-between">
                                                              <div className="flex items-center space-x-2">
                                                                <Lightbulb className="w-4 h-4 text-gray-600" />
                                                                <span className="text-sm font-medium text-gray-800">Quick Selection:</span>
                                                              </div>
                                                              <div className="flex items-center gap-2">
                                                                <Button
                                                                  type="button"
                                                                  variant="outline"
                                                                  size="sm"
                                                                  onClick={() => selectRange(1, Math.ceil(racks.length / 2))}
                                                                  className="text-xs h-7 px-2"
                                                                >
                                                                  First Half (1-{Math.ceil(racks.length / 2)})
                                                                </Button>
                                                                <Button
                                                                  type="button"
                                                                  variant="outline"
                                                                  size="sm"
                                                                  onClick={() => selectRange(Math.ceil(racks.length / 2) + 1, racks.length)}
                                                                  className="text-xs h-7 px-2"
                                                                >
                                                                  Second Half ({Math.ceil(racks.length / 2) + 1}-{racks.length})
                                                                </Button>
                                                                <Button
                                                                  type="button"
                                                                  variant="outline"
                                                                  size="sm"
                                                                  onClick={selectAll}
                                                                  className="text-xs h-7 px-2"
                                                                >
                                                                  Select All
                                                                </Button>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        )}
                                                        
                                                        <div className="border rounded-lg overflow-hidden">
                                                          <Table>
                                                            <TableHeader>
                                                              <TableRow className="bg-gray-50">
                                                                <TableHead className="w-12">
                                                                  <Checkbox
                                                                    checked={selectedRackIds.length === racks.length}
                                                                    onCheckedChange={(checked) => {
                                                                      if (checked) {
                                                                        setSelectedRackIds(racks.map(r => r.id));
                                                                      } else {
                                                                        setSelectedRackIds([]);
                                                                      }
                                                                    }}
                                                                  />
                                                                </TableHead>
                                                                <TableHead className="w-20">Rack</TableHead>
                                                                <TableHead className="w-32">Size *</TableHead>
                                                                {selectedColocationModel !== 'shared_rackspace' && (
                                                                  <TableHead className="w-32">Dimensions</TableHead>
                                                                )}
                                                                <TableHead className="w-36">Power Model *</TableHead>
                                                                <TableHead className="w-32">Power (kW) *</TableHead>
                                                                <TableHead className="w-32">Circuit *</TableHead>
                                                                <TableHead className="w-28">PDU Type *</TableHead>
                                                                <TableHead className="w-36">PDU Socket *</TableHead>
                                                                <TableHead className="w-20">Status</TableHead>
                                                                <TableHead className="w-16">Action</TableHead>
                                                              </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                              {racks.map((rack, index) => {
                                                                const isSharedRackspace = selectedColocationModel === 'shared_rackspace';
                                                                const isCompletelyConfigured = rack.size && rack.powerModel && rack.committedPower && rack.powerCircuit && rack.pduType && rack.pduSocket;
                                                                const isSelected = selectedRackIds.includes(rack.id);
                                                                const isTemplate = templateRackId === rack.id;
                                                                
                                                                return (
                                                                  <TableRow 
                                                                    key={rack.id} 
                                                                    className={`hover:bg-gray-50 ${isSelected ? 'bg-purple-50 border-l-4 border-l-purple-500' : ''} ${isTemplate ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                                                                  >
                                                                    <TableCell>
                                                                      <Checkbox
                                                                        checked={isSelected}
                                                                        onCheckedChange={(checked) => {
                                                                          if (checked) {
                                                                            setSelectedRackIds([...selectedRackIds, rack.id]);
                                                                          } else {
                                                                            setSelectedRackIds(selectedRackIds.filter(id => id !== rack.id));
                                                                            if (templateRackId === rack.id) {
                                                                              setTemplateRackId('');
                                                                            }
                                                                          }
                                                                        }}
                                                                      />
                                                                    </TableCell>
                                                                    
                                                                    <TableCell className="font-medium">
                                                                      <div className="flex items-center space-x-2">
                                                                        <span>#{index + 1}</span>
                                                                        {isTemplate && (
                                                                          <Badge variant="outline" className="text-xs text-blue-700 bg-blue-100 border-blue-300">
                                                                            Template
                                                                          </Badge>
                                                                        )}
                                                                        {isSelected && !isTemplate && (
                                                                          <Badge variant="outline" className="text-xs text-purple-700 bg-purple-100 border-purple-300">
                                                                            Selected
                                                                          </Badge>
                                                                        )}
                                                                      </div>
                                                                    </TableCell>
                                                                    
                                                                    <TableCell>
                                                                      <Select
                                                                        value={rack.size}
                                                                        onValueChange={(value) => updateRackInColocation(selectedColocationModel, rack.id, 'size', value)}
                                                                      >
                                                                        <SelectTrigger className="h-8 text-xs">
                                                                          <SelectValue placeholder="Size" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                          {getAvailableRackSizes(isSharedRackspace ? 'unit_space' : 'full_rack', isSharedRackspace).map((size) => (
                                                                            <SelectItem key={size} value={size}>
                                                                              {size}
                                                                            </SelectItem>
                                                                          ))}
                                                                        </SelectContent>
                                                                      </Select>
                                                                    </TableCell>

                                                                    {!isSharedRackspace && (
                                                                      <TableCell>
                                                                        {rack.dimensions === 'custom' ? (
                                                                          <div className="space-y-1">
                                                                            <Select
                                                                              value="custom"
                                                                              onValueChange={(value) => {
                                                                                if (value !== 'custom') {
                                                                                  updateRackInColocation(selectedColocationModel, rack.id, 'dimensions', value);
                                                                                }
                                                                              }}
                                                                            >
                                                                              <SelectTrigger className="h-8 text-xs">
                                                                                <SelectValue placeholder="Custom" />
                                                                              </SelectTrigger>
                                                                              <SelectContent>
                                                                                {standardDimensions.map((dim) => (
                                                                                  <SelectItem key={dim} value={dim}>
                                                                                    {dim}
                                                                                  </SelectItem>
                                                                                ))}
                                                                                <SelectItem value="custom">Custom</SelectItem>
                                                                              </SelectContent>
                                                                            </Select>
                                                                            <Input
                                                                              type="text"
                                                                              placeholder="e.g., 800x1200mm"
                                                                              className="h-8 text-xs"
                                                                              value={rack.customDimensions || ''}
                                                                              onChange={(e) => updateRackInColocation(selectedColocationModel, rack.id, 'customDimensions', e.target.value)}
                                                                            />
                                                                          </div>
                                                                        ) : (
                                                                          <Select
                                                                            value={rack.dimensions}
                                                                            onValueChange={(value) => updateRackInColocation(selectedColocationModel, rack.id, 'dimensions', value)}
                                                                          >
                                                                            <SelectTrigger className="h-8 text-xs">
                                                                              <SelectValue placeholder="Dimensions" />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                              {standardDimensions.map((dim) => (
                                                                                <SelectItem key={dim} value={dim}>
                                                                                  {dim}
                                                                                </SelectItem>
                                                                              ))}
                                                                              <SelectItem value="custom">Custom</SelectItem>
                                                                            </SelectContent>
                                                                          </Select>
                                                                        )}
                                                                      </TableCell>
                                                                    )}

                                                                    <TableCell>
                                                                      <Select
                                                                        value={rack.powerModel}
                                                                        onValueChange={(value) => updateRackInColocation(selectedColocationModel, rack.id, 'powerModel', value)}
                                                                      >
                                                                        <SelectTrigger className="h-8 text-xs">
                                                                          <SelectValue placeholder="Power Model" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                          {powerModels.map((model) => (
                                                                            <SelectItem key={model.value} value={model.value}>
                                                                              {model.label}
                                                                            </SelectItem>
                                                                          ))}
                                                                        </SelectContent>
                                                                      </Select>
                                                                    </TableCell>

                                                                    <TableCell>
                                                                      <Input
                                                                        type="number"
                                                                        step="0.1"
                                                                        placeholder="7.0"
                                                                        className="h-8 text-xs"
                                                                        value={rack.committedPower}
                                                                        onChange={(e) => updateRackInColocation(selectedColocationModel, rack.id, 'committedPower', e.target.value)}
                                                                      />
                                                                    </TableCell>

                                                                    <TableCell>
                                                                      <Select
                                                                        value={rack.powerCircuit}
                                                                        onValueChange={(value) => updateRackInColocation(selectedColocationModel, rack.id, 'powerCircuit', value)}
                                                                      >
                                                                        <SelectTrigger className="h-8 text-xs">
                                                                          <SelectValue placeholder="Circuit" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                          {powerCircuitOptions.map((option) => (
                                                                            <SelectItem key={option.value} value={option.value}>
                                                                              {option.label}
                                                                            </SelectItem>
                                                                          ))}
                                                                        </SelectContent>
                                                                      </Select>
                                                                    </TableCell>

                                                                    <TableCell>
                                                                      <Select
                                                                        value={rack.pduType}
                                                                        onValueChange={(value) => updateRackInColocation(selectedColocationModel, rack.id, 'pduType', value)}
                                                                      >
                                                                        <SelectTrigger className="h-8 text-xs">
                                                                          <SelectValue placeholder="PDU" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                          {pduTypeOptions.map((option) => (
                                                                            <SelectItem key={option.value} value={option.value}>
                                                                              {option.label}
                                                                            </SelectItem>
                                                                          ))}
                                                                        </SelectContent>
                                                                      </Select>
                                                                    </TableCell>

                                                                    <TableCell>
                                                                      <Select
                                                                        value={rack.pduSocket}
                                                                        onValueChange={(value) => updateRackInColocation(selectedColocationModel, rack.id, 'pduSocket', value)}
                                                                      >
                                                                        <SelectTrigger className="h-8 text-xs">
                                                                          <SelectValue placeholder="Socket" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                          {pduSocketOptions.map((option) => (
                                                                            <SelectItem key={option.value} value={option.value}>
                                                                              {option.label}
                                                                            </SelectItem>
                                                                          ))}
                                                                        </SelectContent>
                                                                      </Select>
                                                                    </TableCell>

                                                                    <TableCell>
                                                                      {isCompletelyConfigured ? (
                                                                        <Badge variant="outline" className="text-green-700 bg-green-100 border-green-300 text-xs">
                                                                          <CheckCircle className="w-3 h-3 mr-1" />
                                                                          Done
                                                                        </Badge>
                                                                      ) : (
                                                                        <Badge variant="outline" className="text-orange-700 bg-orange-100 border-orange-300 text-xs">
                                                                          <AlertTriangle className="w-3 h-3 mr-1" />
                                                                          Pending
                                                                        </Badge>
                                                                      )}
                                                                    </TableCell>

                                                                    <TableCell>
                                                                      <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => removeRackFromColocation(selectedColocationModel, rack.id)}
                                                                        className="h-8 w-8 p-0 text-red-600 border-red-300 hover:bg-red-50"
                                                                      >
                                                                        <Trash2 className="w-3 h-3" />
                                                                      </Button>
                                                                    </TableCell>
                                                                  </TableRow>
                                                                );
                                                              })}
                                                            </TableBody>
                                                          </Table>
                                                        </div>
                                                        
                                                        {/* Summary Stats */}
                                                        <div className="flex items-center justify-between pt-2 text-sm text-gray-600">
                                                          <div className="flex items-center space-x-4">
                                                            <span>💡 Select racks and choose a template to batch configure multiple racks at once</span>
                                                          </div>
                                                          <div className="flex items-center space-x-2">
                                                            <Badge variant="outline" className="text-green-700 bg-green-100">
                                                              <CheckCircle className="w-3 h-3 mr-1" />
                                                              {racks.filter(rack => 
                                                                rack.size && rack.powerModel && rack.committedPower && rack.powerCircuit && rack.pduType && rack.pduSocket
                                                              ).length} Complete
                                                            </Badge>
                                                            <Badge variant="outline" className="text-orange-700 bg-orange-100">
                                                              <AlertTriangle className="w-3 h-3 mr-1" />
                                                              {racks.filter(rack => 
                                                                !(rack.size && rack.powerModel && rack.committedPower && rack.powerCircuit && rack.pduType && rack.pduSocket)
                                                              ).length} Pending
                                                            </Badge>
                                                          </div>
                                                        </div>
                                                      </div>
                                                ); // Close the return statement
                                                })()}
                                              </div>
                                            )}
                                          </CardContent>
                                        </Card>

                                        {/* Additional Requirements */}
                                        <Card>
                                          <CardHeader>
                                            <CardTitle>Additional Requirements</CardTitle>
                                          </CardHeader>
                                          <CardContent className="space-y-4">
                                            {/* Expedited Delivery Option - Only for Dedicated and Shared Rackspace */}
                                            {(selectedColocationModel === 'dedicated_rackspace' || selectedColocationModel === 'shared_rackspace') && (
                                              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                                                <div className="flex items-start space-x-3">
                                                  <Checkbox
                                                    id="expedited-delivery"
                                                    checked={formData.colocationConfigurations[selectedColocationModel]?.expeditedDelivery || false}
                                                    onCheckedChange={(checked) => {
                                                      const currentConfig = formData.colocationConfigurations[selectedColocationModel] || {};
                                                      handleInputChange('colocationConfigurations', {
                                                        ...formData.colocationConfigurations,
                                                        [selectedColocationModel]: {
                                                          ...currentConfig,
                                                          expeditedDelivery: checked
                                                        }
                                                      });
                                                    }}
                                                    className="mt-1"
                                                  />
                                                  <div className="flex-1">
                                                    <Label htmlFor="expedited-delivery" className="flex items-center space-x-2 cursor-pointer">
                                                      <Clock className="w-4 h-4 text-orange-600" />
                                                      <span className="font-medium text-orange-900">Expedited Rack Provisioning</span>
                                                      <Badge variant="outline" className="text-orange-700 bg-orange-100 border-orange-300 text-xs">
                                                        Optional Service
                                                      </Badge>
                                                    </Label>
                                                    <p className="text-sm text-orange-700 mt-1">
                                                      Fast-track rack deployment and configuration for reduced time-to-deployment. Additional charges may apply.
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                            )}

                                            <div className="space-y-2">
                                              <Label>Scalability Requirements</Label>
                                              <Textarea
                                                placeholder="Describe future scalability needs, expansion plans, or growth projections..."
                                                value={formData.scalabilityRequirement}
                                                onChange={(e) => handleInputChange('scalabilityRequirement', e.target.value)}
                                                rows={3}
                                              />
                                            </div>
                                            <div className="space-y-2">
                                              <Label>Exclusivity Requirements</Label>
                                              <Textarea
                                                placeholder="Specify any exclusivity needs, dedicated resources, or isolation requirements..."
                                                value={formData.exclusivityRequirement}
                                                onChange={(e) => handleInputChange('exclusivityRequirement', e.target.value)}
                                                rows={3}
                                              />
                                            </div>
                                          </CardContent>
                                        </Card>
                                      </>
                                    )}
                                  </div>
                                )}

                                {selectedInfrastructureCategory === 'cooling-environment' && (
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center space-x-2">
                                        <Snowflake className="w-5 h-5 text-purple-600" />
                                        <span>Cooling & Environmental Controls</span>
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                      <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                          <Label>Cooling Redundancy</Label>
                                          <Select
                                            value={formData.coolingRedundancy}
                                            onValueChange={(value) => handleInputChange('coolingRedundancy', value)}
                                          >
                                            <SelectTrigger>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {coolingRedundancyOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                  {option.label}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>

                                        <div className="space-y-2">
                                          <Label>Cooling Type</Label>
                                          <Select
                                            value={formData.coolingType}
                                            onValueChange={(value) => handleInputChange('coolingType', value)}
                                          >
                                            <SelectTrigger>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {coolingTypeOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                  {option.label}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>

                                      <div className="space-y-4">
                                        <div className="space-y-2">
                                          <Label>Environmental Monitoring Requirements</Label>
                                          <Textarea
                                            placeholder="Specify temperature, humidity, or other environmental monitoring needs..."
                                            value={formData.environmentalMonitoring}
                                            onChange={(e) => handleInputChange('environmentalMonitoring', e.target.value)}
                                            rows={3}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Cooling Exclusivity Requirements</Label>
                                          <Textarea
                                            placeholder="Describe any dedicated cooling or exclusive environmental requirements..."
                                            value={formData.coolingExclusivity}
                                            onChange={(e) => handleInputChange('coolingExclusivity', e.target.value)}
                                            rows={3}
                                          />
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </TabsContent>

                      {/* Cross Connect Tab */}
                      <TabsContent value="cross-connect" className="mt-0 p-6">
                        <div className="space-y-6">
                          <div className="mb-6">
                            <h3 className="font-medium text-gray-900 mb-2">Cross Connect Configuration</h3>
                            <p className="text-sm text-gray-600">Configure cross-connect requirements for network connectivity between different points in the facility.</p>
                          </div>

                          <div className="grid gap-6">
                            {connectionTypes.map((connectionType) => {
                              const connectionData = formData.crossConnectTypes.find(ct => ct.type === connectionType.value);
                              const isExpanded = selectedConnectionType === connectionType.value;
                              const colorClasses = getColorClasses(connectionType.color);

                              return (
                                <Card key={connectionType.value} className="overflow-hidden">
                                  <CardHeader 
                                    className={`cursor-pointer transition-all ${
                                      isExpanded ? `${colorClasses.bg} ${colorClasses.border}` : 'hover:bg-gray-50'
                                    }`}
                                    onClick={() => setSelectedConnectionType(isExpanded ? null : connectionType.value)}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-3">
                                        <connectionType.icon className={`w-5 h-5 ${isExpanded ? colorClasses.text : 'text-gray-600'}`} />
                                        <div>
                                          <CardTitle className={`text-base ${isExpanded ? colorClasses.text : 'text-gray-900'}`}>
                                            {connectionType.label}
                                          </CardTitle>
                                          <CardDescription className={`text-sm ${isExpanded ? colorClasses.text : 'text-gray-600'}`}>
                                            {connectionType.description}
                                          </CardDescription>
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-2">
                                          <Label className="text-sm">Count:</Label>
                                          <Input
                                            type="number"
                                            min="0"
                                            value={connectionData?.count || 0}
                                            onChange={(e) => handleConnectionTypeCountChange(connectionType.value, parseInt(e.target.value) || 0)}
                                            className="w-20"
                                            onClick={(e) => e.stopPropagation()}
                                          />
                                        </div>
                                        <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                                          <Eye className="w-4 h-4 text-gray-400" />
                                        </div>
                                      </div>
                                    </div>
                                  </CardHeader>

                                  {isExpanded && (
                                    <CardContent className="space-y-4">
                                      {/* Connection Details */}
                                      {connectionData && connectionData.connections.length > 0 && (
                                        <div className="space-y-4">
                                          <h4 className="font-medium text-gray-900">Connection Details</h4>
                                          {connectionData.connections.map((connection, index) => (
                                            <Card key={connection.id} className="p-4 bg-gray-50">
                                              <h5 className="font-medium text-gray-900 mb-3">Connection {index + 1}</h5>
                                              <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div className="space-y-2">
                                                  <Label>Point A</Label>
                                                  <Input
                                                    placeholder="Enter Point A location"
                                                    value={connection.pointA}
                                                    onChange={(e) => handleCrossConnectChange(connectionType.value, connection.id, 'pointA', e.target.value)}
                                                  />
                                                </div>
                                                <div className="space-y-2">
                                                  <Label>Point B</Label>
                                                  <Input
                                                    placeholder="Enter Point B location"
                                                    value={connection.pointB}
                                                    onChange={(e) => handleCrossConnectChange(connectionType.value, connection.id, 'pointB', e.target.value)}
                                                  />
                                                </div>
                                              </div>

                                              <div className="grid grid-cols-3 gap-4 mb-4">
                                                <div className="space-y-2">
                                                  <Label>Point B Type</Label>
                                                  <Select
                                                    value={connection.pointBType}
                                                    onValueChange={(value) => handleCrossConnectChange(connectionType.value, connection.id, 'pointBType', value)}
                                                  >
                                                    <SelectTrigger>
                                                      <SelectValue placeholder="Select Type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="carrier_partner">Carrier Partner</SelectItem>
                                                      <SelectItem value="customer_rack">Customer Rack</SelectItem>
                                                      <SelectItem value="cloud_exchange">Cloud Exchange</SelectItem>
                                                      <SelectItem value="other">Other</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                </div>

                                                {connection.pointBType === 'carrier_partner' && (
                                                  <>
                                                    <div className="space-y-2">
                                                      <Label>Carrier Partner</Label>
                                                      <Select
                                                        value={connection.carrierPartnerName}
                                                        onValueChange={(value) => handleCrossConnectChange(connectionType.value, connection.id, 'carrierPartnerName', value)}
                                                      >
                                                        <SelectTrigger>
                                                          <SelectValue placeholder="Select Carrier" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                          {carrierPartnerOptions.map((carrier) => (
                                                            <SelectItem key={carrier} value={carrier}>
                                                              {carrier}
                                                            </SelectItem>
                                                          ))}
                                                        </SelectContent>
                                                      </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                      <Label>Port Reference</Label>
                                                      <Input
                                                        placeholder="Carrier port reference"
                                                        value={connection.carrierPortReference}
                                                        onChange={(e) => handleCrossConnectChange(connectionType.value, connection.id, 'carrierPortReference', e.target.value)}
                                                      />
                                                    </div>
                                                  </>
                                                )}
                                              </div>

                                              <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div className="space-y-2">
                                                  <Label>Length</Label>
                                                  <div className="flex space-x-2">
                                                    <Input
                                                      type="number"
                                                      placeholder="Length"
                                                      value={connection.lengthValue}
                                                      onChange={(e) => handleCrossConnectChange(connectionType.value, connection.id, 'lengthValue', e.target.value)}
                                                    />
                                                    <Select
                                                      value={connection.lengthUnit}
                                                      onValueChange={(value) => handleCrossConnectChange(connectionType.value, connection.id, 'lengthUnit', value)}
                                                    >
                                                      <SelectTrigger className="w-20">
                                                        <SelectValue />
                                                      </SelectTrigger>
                                                      <SelectContent>
                                                        <SelectItem value="m">m</SelectItem>
                                                        <SelectItem value="km">km</SelectItem>
                                                      </SelectContent>
                                                    </Select>
                                                  </div>
                                                </div>
                                              </div>

                                              {/* Additional Options */}
                                              <div className="grid grid-cols-2 gap-4">
                                                <div className="flex items-center space-x-2">
                                                  <Checkbox
                                                    id={`shielding-${connection.id}`}
                                                    checked={connection.shielding}
                                                    onCheckedChange={(checked) => handleCrossConnectChange(connectionType.value, connection.id, 'shielding', checked)}
                                                  />
                                                  <Label htmlFor={`shielding-${connection.id}`} className="text-sm">Shielding Required</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                  <Checkbox
                                                    id={`secure-${connection.id}`}
                                                    checked={connection.conduitSecureInstall}
                                                    onCheckedChange={(checked) => handleCrossConnectChange(connectionType.value, connection.id, 'conduitSecureInstall', checked)}
                                                  />
                                                  <Label htmlFor={`secure-${connection.id}`} className="text-sm">Conduit/Secure Install</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                  <Checkbox
                                                    id={`redundancy-${connection.id}`}
                                                    checked={connection.abPathRedundancy}
                                                    onCheckedChange={(checked) => handleCrossConnectChange(connectionType.value, connection.id, 'abPathRedundancy', checked)}
                                                  />
                                                  <Label htmlFor={`redundancy-${connection.id}`} className="text-sm">A/B Path Redundancy</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                  <Checkbox
                                                    id={`expedited-${connection.id}`}
                                                    checked={connection.expeditedDelivery}
                                                    onCheckedChange={(checked) => handleCrossConnectChange(connectionType.value, connection.id, 'expeditedDelivery', checked)}
                                                  />
                                                  <Label htmlFor={`expedited-${connection.id}`} className="text-sm">Expedited Delivery</Label>
                                                </div>
                                              </div>
                                            </Card>
                                          ))}
                                        </div>
                                      )}

                                      {/* Notes Section */}
                                      <div className="space-y-2">
                                        <Label>Additional Notes</Label>
                                        <Textarea
                                          placeholder={`Additional requirements or notes for ${connectionType.label}...`}
                                          value={connectionData?.notes || ''}
                                          onChange={(e) => handleConnectionTypeNotesChange(connectionType.value, e.target.value)}
                                          rows={3}
                                        />
                                      </div>
                                    </CardContent>
                                  )}
                                </Card>
                              );
                            })}
                          </div>
                        </div>
                      </TabsContent>

                      {/* Office & Storage Tab */}
                      <TabsContent value="office-storage" className="mt-0 p-6">
                        <div className="flex gap-6 h-full">
                          {/* Left Sidebar - Categories */}
                          <div className="w-1/5 space-y-2">
                            <div className="mb-4">
                              <h3 className="font-medium text-gray-900 mb-2">Office & Storage Categories</h3>
                              <p className="text-sm text-gray-600">Select a category to configure</p>
                            </div>
                            
                            {officeCategories.map((category) => {
                              const isSelected = selectedOfficeCategory === category.value;
                              const colorClasses = getColorClasses(category.color);
                              
                              return (
                                <div
                                  key={category.value}
                                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                    isSelected 
                                      ? `${colorClasses.bg} ${colorClasses.border} ring-2 ring-blue-500 ring-opacity-50` 
                                      : 'bg-white border-gray-200 hover:border-gray-300'
                                  }`}
                                  onClick={() => setSelectedOfficeCategory(category.value)}
                                >
                                  <div className="flex items-center space-x-2">
                                    <category.icon className={`w-4 h-4 ${isSelected ? colorClasses.text : 'text-gray-600'}`} />
                                    <span className={`text-sm font-medium ${isSelected ? colorClasses.text : 'text-gray-900'}`}>
                                      {category.label}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Right Content Area */}
                          <div className="flex-1 space-y-6 overflow-y-auto">
                            {selectedOfficeCategory === 'shared-seating' && (
                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center space-x-2">
                                    <Users className="w-5 h-5 text-blue-600" />
                                    <span>Shared Seating Configuration</span>
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                  <div className="grid grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                      <Label>Basic Seats</Label>
                                      <Input
                                        type="number"
                                        placeholder="Number of basic seats"
                                        value={formData.basicSeats}
                                        onChange={(e) => handleInputChange('basicSeats', e.target.value)}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Premium Seats</Label>
                                      <Input
                                        type="number"
                                        placeholder="Number of premium seats"
                                        value={formData.premiumSeats}
                                        onChange={(e) => handleInputChange('premiumSeats', e.target.value)}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Seats with WiFi AP</Label>
                                      <Input
                                        type="number"
                                        placeholder="Seats with WiFi access point"
                                        value={formData.seatsWithWifiAP}
                                        onChange={(e) => handleInputChange('seatsWithWifiAP', e.target.value)}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Seats with 32A Power</Label>
                                      <Input
                                        type="number"
                                        placeholder="Seats with 32A power"
                                        value={formData.seatsWith32APower}
                                        onChange={(e) => handleInputChange('seatsWith32APower', e.target.value)}
                                      />
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                    <Label>Shared Space Amenities</Label>
                                    <div className="grid grid-cols-3 gap-3">
                                      {sharedSpaceAmenities.map((amenity) => (
                                        <div key={amenity} className="flex items-center space-x-2">
                                          <Checkbox
                                            id={`shared-${amenity}`}
                                            checked={formData.sharedSpaceAmenities.includes(amenity)}
                                            onCheckedChange={() => handleAmenityToggle(amenity, 'shared')}
                                          />
                                          <Label htmlFor={`shared-${amenity}`} className="text-sm">{amenity}</Label>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                            {selectedOfficeCategory === 'secure-office' && (
                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center space-x-2">
                                    <Shield className="w-5 h-5 text-green-600" />
                                    <span>Secure Office Configuration</span>
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Minimum Cabins Required</Label>
                                      <Input
                                        type="number"
                                        placeholder="Number of secure cabins"
                                        value={formData.minimumCabins}
                                        onChange={(e) => handleInputChange('minimumCabins', e.target.value)}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Additional Workstations</Label>
                                      <Input
                                        type="number"
                                        placeholder="Extra workstations needed"
                                        value={formData.additionalWorkstations}
                                        onChange={(e) => handleInputChange('additionalWorkstations', e.target.value)}
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-6">
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id="100g-breakout"
                                        checked={formData.has100GBreakout}
                                        onCheckedChange={(checked) => handleInputChange('has100GBreakout', checked)}
                                      />
                                      <Label htmlFor="100g-breakout">100G Breakout Required</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id="telecom-package"
                                        checked={formData.hasTelecomPackage}
                                        onCheckedChange={(checked) => handleInputChange('hasTelecomPackage', checked)}
                                      />
                                      <Label htmlFor="telecom-package">Telecom Package Required</Label>
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                    <Label>Secure Space Amenities</Label>
                                    <div className="grid grid-cols-3 gap-3">
                                      {secureSpaceAmenities.map((amenity) => (
                                        <div key={amenity} className="flex items-center space-x-2">
                                          <Checkbox
                                            id={`secure-${amenity}`}
                                            checked={formData.secureSpaceAmenities.includes(amenity)}
                                            onCheckedChange={() => handleAmenityToggle(amenity, 'secure')}
                                          />
                                          <Label htmlFor={`secure-${amenity}`} className="text-sm">{amenity}</Label>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                            {selectedOfficeCategory === 'lan-cabling' && (
                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center space-x-2">
                                    <Cable className="w-5 h-5 text-yellow-600" />
                                    <span>LAN Cabling Requirements</span>
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                  <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                      <Label>CAT6 Cable Runs</Label>
                                      <Input
                                        type="number"
                                        placeholder="Number of CAT6 runs"
                                        value={formData.cat6CableRuns}
                                        onChange={(e) => handleInputChange('cat6CableRuns', e.target.value)}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>OM4 Fiber Runs</Label>
                                      <Input
                                        type="number"
                                        placeholder="Number of OM4 fiber runs"
                                        value={formData.om4FiberRuns}
                                        onChange={(e) => handleInputChange('om4FiberRuns', e.target.value)}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>OS2 Fiber Runs</Label>
                                      <Input
                                        type="number"
                                        placeholder="Number of OS2 fiber runs"
                                        value={formData.os2FiberRuns}
                                        onChange={(e) => handleInputChange('os2FiberRuns', e.target.value)}
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-6">
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id="secure-conduit"
                                        checked={formData.secureConduitInstall}
                                        onCheckedChange={(checked) => handleInputChange('secureConduitInstall', checked)}
                                      />
                                      <Label htmlFor="secure-conduit">Secure Conduit Installation</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id="ab-path"
                                        checked={formData.abPathRedundancy}
                                        onCheckedChange={(checked) => handleInputChange('abPathRedundancy', checked)}
                                      />
                                      <Label htmlFor="ab-path">A/B Path Redundancy</Label>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                            {selectedOfficeCategory === 'storage-space' && (
                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center space-x-2">
                                    <Archive className="w-5 h-5 text-purple-600" />
                                    <span>Storage Space Requirements</span>
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Storage Area (sq ft)</Label>
                                      <Input
                                        type="number"
                                        placeholder="Required storage area"
                                        value={formData.storageAreaSqFt}
                                        onChange={(e) => handleInputChange('storageAreaSqFt', e.target.value)}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Storage Type</Label>
                                      <Select
                                        value={formData.storageType}
                                        onValueChange={(value) => handleInputChange('storageType', value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select storage type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="temporary">Temporary</SelectItem>
                                          <SelectItem value="permanent">Permanent</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <Label>Other Storage Requirements</Label>
                                    <Textarea
                                      placeholder="Describe any additional storage requirements, security needs, or special conditions..."
                                      value={formData.otherStorageRequirements}
                                      onChange={(e) => handleInputChange('otherStorageRequirements', e.target.value)}
                                      rows={4}
                                    />
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </div>
                        </div>
                      </TabsContent>

                      {/* Value Added Services Tab */}
                      <TabsContent value="value-added" className="mt-0 p-6">
                        <div className="flex gap-6 h-full">
                          {/* Left Sidebar - Categories */}
                          <div className="w-1/5 space-y-2">
                            <div className="mb-4">
                              <h3 className="font-medium text-gray-900 mb-2">Service Categories</h3>
                              <p className="text-sm text-gray-600">Select a category to configure</p>
                            </div>
                            
                            {servicesCategories.map((category) => {
                              const isSelected = selectedServicesCategory === category.value;
                              const colorClasses = getColorClasses(category.color);
                              
                              return (
                                <div
                                  key={category.value}
                                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                    isSelected 
                                      ? `${colorClasses.bg} ${colorClasses.border} ring-2 ring-blue-500 ring-opacity-50` 
                                      : 'bg-white border-gray-200 hover:border-gray-300'
                                  }`}
                                  onClick={() => setSelectedServicesCategory(category.value)}
                                >
                                  <div className="flex items-center space-x-2">
                                    <category.icon className={`w-4 h-4 ${isSelected ? colorClasses.text : 'text-gray-600'}`} />
                                    <span className={`text-sm font-medium ${isSelected ? colorClasses.text : 'text-gray-900'}`}>
                                      {category.label}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Right Content Area */}
                          <div className="flex-1 space-y-6 overflow-y-auto">
                            {selectedServicesCategory === 'technical-support' && (
                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center space-x-2">
                                    <Wrench className="w-5 h-5 text-blue-600" />
                                    <span>Technical Support Services</span>
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                  {/* Remote Hands */}
                                  <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                      <Switch
                                        id="remote-hands"
                                        checked={formData.remoteHands}
                                        onCheckedChange={(checked) => handleInputChange('remoteHands', checked)}
                                      />
                                      <Label htmlFor="remote-hands" className="font-medium">Remote Hands Service</Label>
                                    </div>
                                    {formData.remoteHands && (
                                      <div className="ml-6 space-y-2">
                                        <Label>Monthly Hours Required</Label>
                                        <Input
                                          type="number"
                                          placeholder="Hours per month"
                                          value={formData.remoteHandsQuantity}
                                          onChange={(e) => handleInputChange('remoteHandsQuantity', parseInt(e.target.value) || 0)}
                                        />
                                      </div>
                                    )}
                                  </div>

                                  {/* Smart Hands */}
                                  <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                      <Switch
                                        id="smart-hands"
                                        checked={formData.smartHands}
                                        onCheckedChange={(checked) => handleInputChange('smartHands', checked)}
                                      />
                                      <Label htmlFor="smart-hands" className="font-medium">Smart Hands Service</Label>
                                    </div>
                                    {formData.smartHands && (
                                      <div className="ml-6 space-y-2">
                                        <Label>Monthly Hours Required</Label>
                                        <Input
                                          type="number"
                                          placeholder="Hours per month"
                                          value={formData.smartHandsQuantity}
                                          onChange={(e) => handleInputChange('smartHandsQuantity', parseInt(e.target.value) || 0)}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                            {selectedServicesCategory === 'migration-services' && (
                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center space-x-2">
                                    <Truck className="w-5 h-5 text-green-600" />
                                    <span>Migration Services</span>
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      id="physical-migration"
                                      checked={formData.physicalMigration}
                                      onCheckedChange={(checked) => handleInputChange('physicalMigration', checked)}
                                    />
                                    <Label htmlFor="physical-migration" className="font-medium">Physical Migration Service</Label>
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                            {selectedServicesCategory === 'storage-security' && (
                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center space-x-2">
                                    <Archive className="w-5 h-5 text-yellow-600" />
                                    <span>Storage & Security Services</span>
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                  {/* Tape Rotation */}
                                  <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                      <Switch
                                        id="tape-rotation"
                                        checked={formData.tapeRotation}
                                        onCheckedChange={(checked) => handleInputChange('tapeRotation', checked)}
                                      />
                                      <Label htmlFor="tape-rotation" className="font-medium">Tape Rotation Service</Label>
                                    </div>
                                    {formData.tapeRotation && (
                                      <div className="ml-6 grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <Label>Rotation Frequency</Label>
                                          <Select
                                            value={formData.tapeRotationFrequency}
                                            onValueChange={(value) => handleInputChange('tapeRotationFrequency', value)}
                                          >
                                            <SelectTrigger>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {tapeRotationFrequencies.map((freq) => (
                                                <SelectItem key={freq.value} value={freq.value}>
                                                  {freq.label}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Number of Tapes</Label>
                                          <Input
                                            type="number"
                                            placeholder="Tape quantity"
                                            value={formData.tapeRotationQuantity}
                                            onChange={(e) => handleInputChange('tapeRotationQuantity', parseInt(e.target.value) || 0)}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Fire Vault Storage */}
                                  <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                      <Switch
                                        id="fire-vault"
                                        checked={formData.fireVaultStorage}
                                        onCheckedChange={(checked) => handleInputChange('fireVaultStorage', checked)}
                                      />
                                      <Label htmlFor="fire-vault" className="font-medium">Fire Vault Storage</Label>
                                    </div>
                                    {formData.fireVaultStorage && (
                                      <div className="ml-6 grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <Label>Vault Size</Label>
                                          <Select
                                            value={formData.fireVaultUSize}
                                            onValueChange={(value) => handleInputChange('fireVaultUSize', value)}
                                          >
                                            <SelectTrigger>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {fireVaultSizes.map((size) => (
                                                <SelectItem key={size.value} value={size.value}>
                                                  {size.label}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Quantity</Label>
                                          <Input
                                            type="number"
                                            placeholder="Number of vaults"
                                            value={formData.fireVaultQuantity}
                                            onChange={(e) => handleInputChange('fireVaultQuantity', parseInt(e.target.value) || 0)}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Dedicated Storage */}
                                  <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                      <Switch
                                        id="dedicated-storage"
                                        checked={formData.dedicatedStorage}
                                        onCheckedChange={(checked) => handleInputChange('dedicatedStorage', checked)}
                                      />
                                      <Label htmlFor="dedicated-storage" className="font-medium">Dedicated Storage Service</Label>
                                    </div>
                                    {formData.dedicatedStorage && (
                                      <div className="ml-6 grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <Label>Storage Location</Label>
                                          <Input
                                            placeholder="Storage location details"
                                            value={formData.storageLocation}
                                            onChange={(e) => handleInputChange('storageLocation', e.target.value)}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Storage Size</Label>
                                          <Input
                                            placeholder="Size requirements"
                                            value={formData.storageSize}
                                            onChange={(e) => handleInputChange('storageSize', e.target.value)}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Storage Duration</Label>
                                          <Input
                                            placeholder="Duration requirements"
                                            value={formData.storageDuration}
                                            onChange={(e) => handleInputChange('storageDuration', e.target.value)}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Security Level</Label>
                                          <Input
                                            placeholder="Security level requirements"
                                            value={formData.storageSecurityLevel}
                                            onChange={(e) => handleInputChange('storageSecurityLevel', e.target.value)}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                            {selectedServicesCategory === 'additional-services' && (
                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center space-x-2">
                                    <Settings className="w-5 h-5 text-purple-600" />
                                    <span>Additional Services</span>
                                  </CardTitle>
                                  <CardDescription>
                                    Optional professional services to enhance your colocation deployment
                                  </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                  {/* Professional Installation Services */}
                                  <div className="space-y-4">
                                    <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                                      <Wrench className="w-4 h-4 text-blue-600" />
                                      <span>Professional Installation Services</span>
                                    </h4>
                                    <div className="grid grid-cols-2 gap-6">
                                      <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                          <div className="flex items-center space-x-3">
                                            <Checkbox
                                              id="racking-stacking"
                                              checked={formData.rackingStacking || false}
                                              onCheckedChange={(checked) => handleInputChange('rackingStacking', checked)}
                                            />
                                            <div>
                                              <Label htmlFor="racking-stacking" className="font-medium cursor-pointer">Racking & Stacking</Label>
                                              <p className="text-xs text-gray-600">Professional equipment installation in racks</p>
                                            </div>
                                          </div>
                                          <Server className="w-4 h-4 text-gray-400" />
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                          <div className="flex items-center space-x-3">
                                            <Checkbox
                                              id="intelligent-pdu"
                                              checked={formData.intelligentPDU || false}
                                              onCheckedChange={(checked) => handleInputChange('intelligentPDU', checked)}
                                            />
                                            <div>
                                              <Label htmlFor="intelligent-pdu" className="font-medium cursor-pointer">Intelligent PDU (Single Phase)</Label>
                                              <p className="text-xs text-gray-600">Smart power distribution with monitoring</p>
                                            </div>
                                          </div>
                                          <Zap className="w-4 h-4 text-gray-400" />
                                        </div>

                                        <div className="flex items-center space-x-2">
                                          <Switch
                                            id="hardware-install"
                                            checked={formData.hardwareInstallation}
                                            onCheckedChange={(checked) => handleInputChange('hardwareInstallation', checked)}
                                          />
                                          <Label htmlFor="hardware-install">Hardware Installation</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <Switch
                                            id="os-install"
                                            checked={formData.osInstallation}
                                            onCheckedChange={(checked) => handleInputChange('osInstallation', checked)}
                                          />
                                          <Label htmlFor="os-install">OS Installation</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <Switch
                                            id="config-services"
                                            checked={formData.configurationServices}
                                            onCheckedChange={(checked) => handleInputChange('configurationServices', checked)}
                                          />
                                          <Label htmlFor="config-services">Configuration Services</Label>
                                        </div>
                                      </div>

                                      <div className="space-y-3">
                                        <h5 className="font-medium text-gray-900">Managed Services</h5>
                                        <div className="flex items-center space-x-2">
                                          <Switch
                                            id="monitoring"
                                            checked={formData.monitoringServices}
                                            onCheckedChange={(checked) => handleInputChange('monitoringServices', checked)}
                                          />
                                          <Label htmlFor="monitoring">Monitoring Services</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <Switch
                                            id="backup"
                                            checked={formData.backupServices}
                                            onCheckedChange={(checked) => handleInputChange('backupServices', checked)}
                                          />
                                          <Label htmlFor="backup">Backup Services</Label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Dedicated Access Services */}
                                  {(() => {
                                    // Collect items that might need dedicated access
                                    const accessItems = [];
                                    
                                    // Check for private/caged suites from form data
                                    if (formData.privateSuite) {
                                      accessItems.push({ id: 'private-suite', name: 'Private Suite', type: 'suite' });
                                    }
                                    if (formData.cagedSuite) {
                                      accessItems.push({ id: 'caged-suite', name: 'Caged Suite', type: 'suite' });
                                    }
                                    if (formData.storageSpace) {
                                      accessItems.push({ id: 'storage-space', name: 'Storage Space', type: 'storage' });
                                    }
                                    
                                    // Check colocation configurations for additional access areas
                                    Object.entries(formData.colocationConfigurations || {}).forEach(([model, config]) => {
                                      if (config?.racks?.length > 0) {
                                        const modelLabel = colocationModels.find(m => m.value === model)?.label || model;
                                        accessItems.push({ 
                                          id: `colocation-${model}`, 
                                          name: `${modelLabel} Area`, 
                                          type: 'colocation',
                                          rackCount: config.racks.length 
                                        });
                                      }
                                    });

                                    if (accessItems.length === 0) {
                                      return null;
                                    }

                                    return (
                                      <div className="space-y-4">
                                        <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                                          <Lock className="w-4 h-4 text-green-600" />
                                          <span>Dedicated Access Services</span>
                                        </h4>
                                        <div className="border rounded-lg p-4">
                                          <p className="text-sm text-gray-600 mb-4">
                                            Configure dedicated security and access controls for your selected areas
                                          </p>
                                          
                                          <div className="space-y-3">
                                            {accessItems.map((item) => (
                                              <div key={item.id} className="border rounded p-3">
                                                <div className="flex items-center space-x-2 mb-3">
                                                  {item.type === 'suite' && <Building2 className="w-4 h-4" />}
                                                  {item.type === 'storage' && <Archive className="w-4 h-4" />}
                                                  {item.type === 'colocation' && <Server className="w-4 h-4" />}
                                                  <span className="font-medium">{item.name}</span>
                                                  {item.rackCount && (
                                                    <Badge variant="outline" className="text-xs">
                                                      {item.rackCount} rack{item.rackCount !== 1 ? 's' : ''}
                                                    </Badge>
                                                  )}
                                                </div>
                                                
                                                <div className="space-y-3">
                                                  {/* CCTV Option */}
                                                  <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                      id={`cctv-${item.id}`}
                                                      checked={formData.dedicatedAccess?.[item.id]?.cctv || false}
                                                      onCheckedChange={(checked) => {
                                                        const currentAccess = formData.dedicatedAccess || {};
                                                        const itemAccess = currentAccess[item.id] || {};
                                                        handleInputChange('dedicatedAccess', {
                                                          ...currentAccess,
                                                          [item.id]: {
                                                            ...itemAccess,
                                                            cctv: checked
                                                          }
                                                        });
                                                      }}
                                                    />
                                                    <Camera className="w-4 h-4 text-gray-400" />
                                                    <Label htmlFor={`cctv-${item.id}`} className="cursor-pointer">
                                                      Dedicated CCTV (24/7 surveillance)
                                                    </Label>
                                                  </div>

                                                  {/* Access Control Option */}
                                                  <div className="space-y-2">
                                                    <div className="flex items-center space-x-2">
                                                      <Checkbox
                                                        id={`access-${item.id}`}
                                                        checked={formData.dedicatedAccess?.[item.id]?.accessControl || false}
                                                        onCheckedChange={(checked) => {
                                                          const currentAccess = formData.dedicatedAccess || {};
                                                          const itemAccess = currentAccess[item.id] || {};
                                                          handleInputChange('dedicatedAccess', {
                                                            ...currentAccess,
                                                            [item.id]: {
                                                              ...itemAccess,
                                                              accessControl: checked
                                                            }
                                                          });
                                                        }}
                                                      />
                                                      <Scan className="w-4 h-4 text-gray-400" />
                                                      <Label htmlFor={`access-${item.id}`} className="cursor-pointer">
                                                        Dedicated Access Control
                                                      </Label>
                                                    </div>
                                                    
                                                    {formData.dedicatedAccess?.[item.id]?.accessControl && (
                                                      <div className="ml-6">
                                                        <Select
                                                          value={formData.dedicatedAccess?.[item.id]?.accessMethod || ''}
                                                          onValueChange={(value) => {
                                                            const currentAccess = formData.dedicatedAccess || {};
                                                            const itemAccess = currentAccess[item.id] || {};
                                                            handleInputChange('dedicatedAccess', {
                                                              ...currentAccess,
                                                              [item.id]: {
                                                                ...itemAccess,
                                                                accessMethod: value
                                                              }
                                                            });
                                                          }}
                                                        >
                                                          <SelectTrigger className="w-48">
                                                            <SelectValue placeholder="Select access method" />
                                                          </SelectTrigger>
                                                          <SelectContent>
                                                            <SelectItem value="biometric">Biometric</SelectItem>
                                                            <SelectItem value="card">Card Access</SelectItem>
                                                            <SelectItem value="rfid">RFID</SelectItem>
                                                            <SelectItem value="pin">PIN Access</SelectItem>
                                                            <SelectItem value="multi-factor">Multi-Factor (Card + PIN)</SelectItem>
                                                          </SelectContent>
                                                        </Select>
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })()}

                                  <div className="space-y-2">
                                    <Label>Custom Requirements</Label>
                                    <Textarea
                                      placeholder="Describe any additional custom requirements or special services needed..."
                                      value={formData.customRequirements}
                                      onChange={(e) => handleInputChange('customRequirements', e.target.value)}
                                      rows={4}
                                    />
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </div>
                        </div>
                      </TabsContent>

                      {/* Security & Compliance Tab */}
                      <TabsContent value="security-compliance" className="mt-0 p-6">
                        <div className="space-y-6">
                          <div className="mb-6">
                            <h3 className="font-medium text-gray-900 mb-2">Security & Compliance Configuration</h3>
                            <p className="text-sm text-gray-600">Configure security, compliance, and access control requirements.</p>
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                  <Lock className="w-5 h-5 text-red-600" />
                                  <span>Access Control</span>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="space-y-3">
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      id="biometric"
                                      checked={formData.biometricAccess}
                                      onCheckedChange={(checked) => handleInputChange('biometricAccess', checked)}
                                    />
                                    <Label htmlFor="biometric">Biometric Access Control</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      id="escorted"
                                      checked={formData.escortedAccess}
                                      onCheckedChange={(checked) => handleInputChange('escortedAccess', checked)}
                                    />
                                    <Label htmlFor="escorted">Escorted Access Required</Label>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label>Security Clearance Level</Label>
                                  <Input
                                    placeholder="Required security clearance level"
                                    value={formData.securityClearanceLevel}
                                    onChange={(e) => handleInputChange('securityClearanceLevel', e.target.value)}
                                  />
                                </div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                  <Camera className="w-5 h-5 text-blue-600" />
                                  <span>Monitoring & Tracking</span>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="space-y-3">
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      id="surveillance"
                                      checked={formData.videoSurveillance}
                                      onCheckedChange={(checked) => handleInputChange('videoSurveillance', checked)}
                                    />
                                    <Label htmlFor="surveillance">Video Surveillance</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      id="access-logging"
                                      checked={formData.accessLogging}
                                      onCheckedChange={(checked) => handleInputChange('accessLogging', checked)}
                                    />
                                    <Label htmlFor="access-logging">Access Logging</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      id="asset-tagging"
                                      checked={formData.assetTagging}
                                      onCheckedChange={(checked) => handleInputChange('assetTagging', checked)}
                                    />
                                    <Label htmlFor="asset-tagging">Asset Tagging</Label>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label>Inventory Tracking Requirements</Label>
                                  <Input
                                    placeholder="Inventory tracking specifications"
                                    value={formData.inventoryTracking}
                                    onChange={(e) => handleInputChange('inventoryTracking', e.target.value)}
                                  />
                                </div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                  <ShieldCheck className="w-5 h-5 text-green-600" />
                                  <span>Security Assessments</span>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="space-y-3">
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      id="security-assessment"
                                      checked={formData.securityAssessment}
                                      onCheckedChange={(checked) => handleInputChange('securityAssessment', checked)}
                                    />
                                    <Label htmlFor="security-assessment">Security Assessment</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      id="compliance-audit"
                                      checked={formData.complianceAuditing}
                                      onCheckedChange={(checked) => handleInputChange('complianceAuditing', checked)}
                                    />
                                    <Label htmlFor="compliance-audit">Compliance Auditing</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      id="incident-response"
                                      checked={formData.incidentResponse}
                                      onCheckedChange={(checked) => handleInputChange('incidentResponse', checked)}
                                    />
                                    <Label htmlFor="incident-response">Incident Response</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      id="disaster-recovery"
                                      checked={formData.disasterRecovery}
                                      onCheckedChange={(checked) => handleInputChange('disasterRecovery', checked)}
                                    />
                                    <Label htmlFor="disaster-recovery">Disaster Recovery</Label>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                  <Trash2 className="w-5 h-5 text-red-600" />
                                  <span>Asset Management</span>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    id="asset-disposal"
                                    checked={formData.assetDisposal}
                                    onCheckedChange={(checked) => handleInputChange('assetDisposal', checked)}
                                  />
                                  <Label htmlFor="asset-disposal">Secure Asset Disposal</Label>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </TabsContent>
                    </>
                  )}

                  {/* Cloud Domain Placeholder Tabs */}
                  {selectedDomain === 'cloud' && (
                    <>
                      <TabsContent value="compute" className="mt-0 p-6">
                        <div className="text-center py-12">
                          <Cpu className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="font-medium text-gray-900 mb-2">Cloud Compute Services</h3>
                          <p className="text-gray-600">Cloud compute configuration will be available here.</p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="storage" className="mt-0 p-6">
                        <div className="text-center py-12">
                          <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="font-medium text-gray-900 mb-2">Cloud Storage Solutions</h3>
                          <p className="text-gray-600">Cloud storage configuration will be available here.</p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="networking" className="mt-0 p-6">
                        <div className="text-center py-12">
                          <CloudLightning className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="font-medium text-gray-900 mb-2">Cloud Networking</h3>
                          <p className="text-gray-600">Cloud networking configuration will be available here.</p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="analytics" className="mt-0 p-6">
                        <div className="text-center py-12">
                          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="font-medium text-gray-900 mb-2">Analytics & AI</h3>
                          <p className="text-gray-600">Analytics and AI configuration will be available here.</p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="security" className="mt-0 p-6">
                        <div className="text-center py-12">
                          <ShieldCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="font-medium text-gray-900 mb-2">Cloud Security</h3>
                          <p className="text-gray-600">Cloud security configuration will be available here.</p>
                        </div>
                      </TabsContent>
                    </>
                  )}

                  {/* Network Domain Placeholder Tabs */}
                  {selectedDomain === 'network' && (
                    <>
                      <TabsContent value="connectivity" className="mt-0 p-6">
                        <div className="text-center py-12">
                          <Wifi className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="font-medium text-gray-900 mb-2">Network Connectivity</h3>
                          <p className="text-gray-600">Network connectivity configuration will be available here.</p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="wan" className="mt-0 p-6">
                        <div className="text-center py-12">
                          <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="font-medium text-gray-900 mb-2">WAN Services</h3>
                          <p className="text-gray-600">WAN services configuration will be available here.</p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="security" className="mt-0 p-6">
                        <div className="text-center py-12">
                          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="font-medium text-gray-900 mb-2">Network Security</h3>
                          <p className="text-gray-600">Network security configuration will be available here.</p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="optimization" className="mt-0 p-6">
                        <div className="text-center py-12">
                          <Router className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="font-medium text-gray-900 mb-2">Network Optimization</h3>
                          <p className="text-gray-600">Network optimization configuration will be available here.</p>
                        </div>
                      </TabsContent>
                    </>
                  )}
                </Tabs>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-8 border-t border-gray-200">
              <Button variant="outline" onClick={handleBack} className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Project Details</span>
              </Button>
              
              <div className="flex items-center space-x-4">
                <Alert className="w-auto border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    DC BD assignment is required before proceeding
                  </AlertDescription>
                </Alert>
                
                <Button 
                  onClick={handleSubmit}
                  disabled={!assignedBD.dc}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
                >
                  <span>Continue to BD Review</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* BD Selection Dialog */}
        <Dialog open={isBDDialogOpen} onOpenChange={setIsBDDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Assign Business Development Team</span>
              </DialogTitle>
              <DialogDescription>
                Select a BD team member and provide project context to ensure proper support for your colocation requirements.
              </DialogDescription>
            </DialogHeader>
            
            <BDSelectionDialog 
              domainId={currentBDDomain}
              domains={domains}
              bdTeamMembers={bdTeamMembers}
              currentAssignment={assignedBD[currentBDDomain]}
              currentComment={bdComments[currentBDDomain] || ''}
              onSelect={handleBDSelection}
              onClose={() => setIsBDDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}

// BD Selection Dialog Component
interface BDSelectionDialogProps {
  domainId: string;
  domains: typeof domains;
  bdTeamMembers: typeof bdTeamMembers;
  currentAssignment: string;
  currentComment: string;
  onSelect: (bdId: string, comment: string) => void;
  onClose: () => void;
}

function BDSelectionDialog({ 
  domainId, 
  domains, 
  bdTeamMembers, 
  currentAssignment, 
  currentComment, 
  onSelect, 
  onClose 
}: BDSelectionDialogProps) {
  const [selectedBD, setSelectedBD] = useState(currentAssignment || '');
  const [comment, setComment] = useState(currentComment || '');
  
  const currentDomain = domains.find(d => d.id === domainId);
  const teamMembers = bdTeamMembers[domainId as keyof typeof bdTeamMembers] || [];

  const handleSubmit = () => {
    if (selectedBD) {
      onSelect(selectedBD, comment);
    }
  };

  return (
    <div className="space-y-6">
      {/* Domain Header */}
      {currentDomain && (
        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
          <currentDomain.icon className={`w-6 h-6 text-${currentDomain.color}-600`} />
          <div>
            <h3 className="font-medium text-gray-900">{currentDomain.name}</h3>
            <p className="text-sm text-gray-600">{currentDomain.description}</p>
          </div>
        </div>
      )}

      {/* BD Team Members */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Select BD Team Member</Label>
        <div className="grid gap-3">
          {teamMembers.map((member) => (
            <Card 
              key={member.id}
              className={`cursor-pointer transition-all ${
                selectedBD === member.id 
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-opacity-20' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedBD(member.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <input
                      type="radio"
                      name="bd-member"
                      value={member.id}
                      checked={selectedBD === member.id}
                      onChange={() => setSelectedBD(member.id)}
                      className="w-4 h-4 text-blue-600 mt-1"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{member.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{member.role}</p>
                        <p className="text-xs text-gray-500 mt-1">{member.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Comments Section */}
      <div className="space-y-3">
        <Label htmlFor="bd-comment" className="text-base font-medium">
          Comments & Requirements
        </Label>
        <Textarea
          id="bd-comment"
          placeholder="Add any specific requirements, project details, or instructions for the BD team..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="resize-none"
        />
        <p className="text-xs text-gray-500">
          These comments will help the BD team understand the project context and requirements.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!selectedBD}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Assign BD Member
        </Button>
      </div>
    </div>
  );
}
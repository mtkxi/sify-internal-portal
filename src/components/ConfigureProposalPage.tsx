import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from './ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from './ui/dialog';
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
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { toast } from 'sonner@2.0.3';
import {
  ArrowLeft,
  MapPin,
  CheckCircle,
  Clock,
  Save,
  X,
  IndianRupee,
  Sparkles,
  XCircle,
  AlertCircle,
  FileText,
  Pencil,
  ChevronDown,
  ChevronUp,
  Eye,
  Trash2,
  Plus,
  Info,
  Lock
} from 'lucide-react';

// Interfaces
interface FIDConfiguration {
  fid: string;
  type: 'New' | 'MDAC';
  serviceChangeType?: 'Address Change' | 'LM Change' | 'Bandwidth Change' | 'Add Secondary/Tertiary Link';
  linkId?: string; // For MDAC
  location: string;
  connectionType: 'Wireless' | 'Fiber' | 'Fiber - Ethernet Drop' | 'Other ISP - Wireless' | 'Other ISP - Fiber' | 'Broadband - Internet' | 'Broadband - MPLS' | '4G LTE';
  serviceProvider?: string; // For "Other ISP" connections
  bandwidth: string;
  currentBandwidthValue: number; // numerical value for comparison
  linkType: 'Primary' | 'Secondary' | 'Tertiary' | 'Hub' | 'Spoke';
  vas: string[];
  plan: string;
  otc: number;
  arc: number;
  isConfigured: boolean;
  isHub?: boolean;
  contractPeriod?: string; // For Add Secondary/Tertiary Link only
  // QoS configuration for MPLS
  qosMode?: 'single' | 'split';
  qosSingle?: 'Bronze' | 'Gold' | 'Diamond' | '';
  qosSplit?: {
    bronze: number;
    gold: number;
    diamond: number;
  };
  qosSplitUnit?: 'mbps' | 'percent';
  // Secure Site Connect (SSC) fields for MPLS
  isSecureSiteConnect?: boolean;
  lteLinkVariant?: 'ATM Single' | 'ATM Dual' | 'Branch Single' | 'Branch Dual';
  // Current link configuration (for MDAC only)
  currentLinkId?: string;
  currentAddress?: string;
  currentBandwidth?: string;
  currentConnectionType?: string;
  currentPlan?: string;
  currentVAS?: string[];
  currentLinkExpiry?: string; // ISO date string for MDAC links
  // Port Details (for MDAC - per link)
  portDetails?: {
    portClassification?: string; // Primary, Secondary, Tertiary
    handoffType?: string; // Electrical Ethernet, Optical Ethernet - Single mode, etc.
    portBandwidth?: string; // 100 Mbps, 1 Gbps, etc.
    bandwidthType?: 'fixed' | 'burstable';
    burstOption?: string; // burst-2x, burst-4x, burst-5x
    portType?: string; // 1G, 10G
    sifyDnsCache?: boolean;
    portRedundancy?: boolean;
    ipType?: string; // IPv4, IPv6, Dual
  };
}

interface BandwidthOption {
  label: string;
  value: number; // in Mbps
}

export function ConfigureProposalPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  console.log('=== ConfigureProposalPage MOUNTED ===');
  console.log('location:', location);
  console.log('location.state:', location.state);
  console.log('location.state stringified:', JSON.stringify(location.state, null, 2));
  
  // CRITICAL: Store the recovered state in a ref so it persists across re-renders
  const recoveredStateRef = React.useRef<any>(null);
  
  if (!recoveredStateRef.current) {
    // First render: Get data from location state OR localStorage as fallback
    let stateData = location.state;
    
    if (!stateData || Object.keys(stateData).length === 0) {
      console.log('⚠️ location.state is empty, checking localStorage...');
      const storedState = localStorage.getItem('proposalNavigationState');
      if (storedState) {
        stateData = JSON.parse(storedState);
        console.log('✅ Recovered state from localStorage:', stateData);
        // DON'T clear it yet - keep it for navigation back/forth
        // localStorage.removeItem('proposalNavigationState');
      } else {
        console.log('❌ No state found in localStorage either');
      }
    } else {
      // If we got state from location.state, also store it in localStorage for future navigations
      console.log('📝 Storing location.state to localStorage for future use');
      localStorage.setItem('proposalNavigationState', JSON.stringify(stateData));
    }
    
    // Store in ref so it survives re-renders
    recoveredStateRef.current = stateData || {};
    console.log('🔒 Stored state in ref:', recoveredStateRef.current);
  } else {
    console.log('✅ Using cached state from ref:', recoveredStateRef.current);
  }
  
  // Always use the ref value
  const stateData = recoveredStateRef.current;
  const { proposalId, company, networkProduct, opportunityId, fidsData, lockedProduct, isServiceChanges: isServiceChangesFromState } = stateData || {};
  
  console.log('=== ConfigureProposalPage Location State ===');
  console.log('Full location.state:', location.state);
  console.log('proposalId:', proposalId);
  console.log('company:', company);
  console.log('networkProduct:', networkProduct);
  console.log('lockedProduct:', lockedProduct);
  console.log('isServiceChangesFromState:', isServiceChangesFromState);
  console.log('fidsData:', fidsData);

  // State
  const [contractTerm, setContractTerm] = useState('3 years');
  const [networkType, setNetworkType] = useState<'DIA' | 'MPLS'>(() => {
    // First check if there's a saved networkType in stateData
    if (stateData?.networkType) {
      console.log('💾 Restoring networkType from saved state:', stateData.networkType);
      return stateData.networkType;
    }
    // Initialize from lockedProduct if it exists, otherwise from networkProduct, otherwise default to MPLS
    if (lockedProduct === 'DIA' || lockedProduct === 'MPLS') {
      console.log('🔒 Setting networkType from lockedProduct:', lockedProduct);
      return lockedProduct;
    }
    if (networkProduct === 'DIA' || networkProduct === 'MPLS') {
      console.log('📦 Setting networkType from networkProduct:', networkProduct);
      return networkProduct;
    }
    console.log('⚠️ Using default networkType: MPLS');
    return 'MPLS';
  });
  const [mplsType, setMplsType] = useState<'Mesh' | 'Hub & Spoke'>('Mesh');
  const [globalPlan, setGlobalPlan] = useState(() => {
    if (stateData?.globalPlan) {
      console.log('💾 Restoring globalPlan from saved state:', stateData.globalPlan);
      return stateData.globalPlan;
    }
    return 'Bronze'; // Set to Bronze for MPLS by default
  });
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [bulkConfigOpen, setBulkConfigOpen] = useState(false);
  const [bulkLinkType, setBulkLinkType] = useState('');
  const [bulkVAS, setBulkVAS] = useState<string[]>([]);
  const [expandedVasCategories, setExpandedVasCategories] = useState<string[]>(['Additional IP']);
  const [vasEditOpen, setVasEditOpen] = useState(false);
  const [editingFID, setEditingFID] = useState<string | null>(null);
  const [expandedVasEditCategories, setExpandedVasEditCategories] = useState<string[]>(['Additional IP']);
  const [isEditingContractTerm, setIsEditingContractTerm] = useState(false);
  const [qosEditOpen, setQosEditOpen] = useState(false);
  const [editingQosFID, setEditingQosFID] = useState<string | null>(null);
  
  // New MPLS QoS Configuration States
  const [qosDistributionMode, setQosDistributionMode] = useState<'uniform' | 'distributed'>(() => {
    if (stateData?.qosDistributionMode) {
      console.log('💾 Restoring qosDistributionMode from saved state:', stateData.qosDistributionMode);
      return stateData.qosDistributionMode;
    }
    return 'uniform';
  });
  const [uniformQoS, setUniformQoS] = useState<'Bronze' | 'Gold' | 'Diamond' | ''>(() => {
    if (stateData?.uniformQoS) {
      console.log('💾 Restoring uniformQoS from saved state:', stateData.uniformQoS);
      return stateData.uniformQoS;
    }
    return '';
  });
  const [distributedQosUnit, setDistributedQosUnit] = useState<'mbps' | 'percent'>('mbps');
  const [qosConfigDialogOpen, setQosConfigDialogOpen] = useState(false);
  const [qosSelectedFIDs, setQosSelectedFIDs] = useState<string[]>([]);
  const [showModeChangeConfirm, setShowModeChangeConfirm] = useState(false);
  const [pendingMode, setPendingMode] = useState<'uniform' | 'distributed' | null>(null);
  
  // Temporary QoS split config while in dialog (distributed mode only)
  const [tempQosSplit, setTempQosSplit] = useState<{ bronze: number; gold: number; diamond: 0 }>({ bronze: 0, gold: 0, diamond: 0 });
  
  // Bulk QoS states
  const [bulkQosMode, setBulkQosMode] = useState<'single' | 'split'>('single');
  const [bulkQosSingle, setBulkQosSingle] = useState<'Bronze' | 'Gold' | 'Diamond' | ''>('');
  const [bulkQosSplit, setBulkQosSplit] = useState<{ bronze: number; gold: number; diamond: number }>({ bronze: 0, gold: 0, diamond: 0 });
  const [bulkQosSplitUnit, setBulkQosSplitUnit] = useState<'mbps' | 'percentage'>('mbps');
  
  // VAS Collapsible sections states
  const [ipSectionOpen, setIpSectionOpen] = useState(false);
  const [devicesSectionOpen, setDevicesSectionOpen] = useState(false);
  const [ddosSectionOpen, setDdosSectionOpen] = useState(false);
  
  // VAS Selection states
  const [selectedIP, setSelectedIP] = useState<string>('');
  const [selectedManagedServices, setSelectedManagedServices] = useState<string[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [selectedDDoS, setSelectedDDoS] = useState<string>('');
  const [deviceOption, setDeviceOption] = useState<'own' | 'buy' | null>(null);
  const [selectedDeviceTypes, setSelectedDeviceTypes] = useState<string[]>([]);
  const [deviceCounts, setDeviceCounts] = useState<{ [key: string]: number }>({});
  const [deviceModels, setDeviceModels] = useState<{ [key: string]: string }>({});
  const [deviceModelsByCount, setDeviceModelsByCount] = useState<{ [key: string]: string[] }>({})
  const [enableManagedService, setEnableManagedService] = useState(false);
  const [deviceManagedService, setDeviceManagedService] = useState<{ [key: string]: boolean }>({});
  const [deviceManagement, setDeviceManagement] = useState<{ [key: string]: { configuration: boolean, hardware: boolean } }>({});
  const [managedServiceType, setManagedServiceType] = useState<'configuration' | 'configuration_hardware' | null>(null);
  const [serviceVariant, setServiceVariant] = useState<'bundled' | 'specific' | null>(null);
  
  // Additional IP states (LAN and WAN)
  const [lanIpOwner, setLanIpOwner] = useState<'sify' | 'customer' | ''>('');
  const [lanIpType, setLanIpType] = useState<'ipv4' | 'ipv6' | 'dual' | ''>('');
  const [lanIpv4Pool, setLanIpv4Pool] = useState<string>('');
  const [lanIpv6Pool, setLanIpv6Pool] = useState<string>('');
  const [wanIpOwner, setWanIpOwner] = useState<'sify' | 'customer' | ''>('');
  const [wanIpType, setWanIpType] = useState<'ipv4' | 'ipv6' | 'dual' | ''>('');
  const [wanIpv4Pool, setWanIpv4Pool] = useState<string>('');
  const [wanIpv6Pool, setWanIpv6Pool] = useState<string>('');

  // Port Details state
  const [portLinkType, setPortLinkType] = useState('Primary');
  const [portType, setPortType] = useState('Electrical Ethernet');
  const [portBandwidth, setPortBandwidth] = useState('1 Gbps');
  // DIA-specific port details
  const [bandwidthType, setBandwidthType] = useState<'fixed' | 'burstable'>('fixed');
  const [burstOption, setBurstOption] = useState('');
  const [portTypeSize, setPortTypeSize] = useState('1G');
  const [sifyDnsCache, setSifyDnsCache] = useState(false);
  const [portRedundancy, setPortRedundancy] = useState(false);
  // MPLS-specific port details
  const [ipType, setIpType] = useState('IPv4');

  // Fiber-specific Port Details
  const [fiberPortLinkType, setFiberPortLinkType] = useState('Primary');
  const [fiberPortType, setFiberPortType] = useState('Electrical Ethernet');
  const [fiberPortBandwidth, setFiberPortBandwidth] = useState('1 Gbps');
  const [fiberBandwidthType, setFiberBandwidthType] = useState<'fixed' | 'burstable'>('fixed');
  const [fiberBurstOption, setFiberBurstOption] = useState('');
  const [fiberPortTypeSize, setFiberPortTypeSize] = useState('1G');
  const [fiberSifyDnsCache, setFiberSifyDnsCache] = useState(false);
  const [fiberPortRedundancy, setFiberPortRedundancy] = useState(false);
  const [fiberIpType, setFiberIpType] = useState('IPv4');

  // Wireless-specific Port Details
  const [wirelessPortLinkType, setWirelessPortLinkType] = useState('Primary');
  const [wirelessPortType, setWirelessPortType] = useState('Electrical Ethernet');
  const [wirelessPortBandwidth, setWirelessPortBandwidth] = useState('1 Gbps');
  const [wirelessBandwidthType, setWirelessBandwidthType] = useState<'fixed' | 'burstable'>('fixed');
  const [wirelessBurstOption, setWirelessBurstOption] = useState('');
  const [wirelessPortTypeSize, setWirelessPortTypeSize] = useState('1G');
  const [wirelessSifyDnsCache, setWirelessSifyDnsCache] = useState(false);
  const [wirelessPortRedundancy, setWirelessPortRedundancy] = useState(false);
  const [wirelessIpType, setWirelessIpType] = useState('IPv4');

  // Secure Site Connect (SSC) Port Details for MPLS
  const [sscPortClassification, setSscPortClassification] = useState('Primary');
  const [sscPortBandwidth, setSscPortBandwidth] = useState('10');
  const [sscPortDetailsDialogOpen, setSscPortDetailsDialogOpen] = useState(false);
  const [selectedSscFids, setSelectedSscFids] = useState<string[]>([]);
  const [hasSscPortDetails, setHasSscPortDetails] = useState(true); // Track if SSC port details have been set (true for mock data)

  // MDAC Port Details Dialog
  const [portDetailsDialogOpen, setPortDetailsDialogOpen] = useState(false);
  const [editingPortFID, setEditingPortFID] = useState<string>('');

  // Configuration options
  const bandwidthOptions: BandwidthOption[] = [
    { label: '4 Mbps', value: 4 },
    { label: '10 Mbps', value: 10 },
    { label: '20 Mbps', value: 20 },
    { label: '21 Mbps', value: 21 },
    { label: '22 Mbps', value: 22 },
    { label: '50 Mbps', value: 50 },
    { label: '55 Mbps', value: 55 },
    { label: '100 Mbps', value: 100 },
    { label: '150 Mbps', value: 150 },
    { label: '200 Mbps', value: 200 },
    { label: '300 Mbps', value: 300 },
    { label: '500 Mbps', value: 500 },
    { label: '1 Gbps', value: 1000 },
    { label: '10 Gbps', value: 10000 }
  ];

  const linkTypeOptions = ['Primary', 'Secondary'];
  
  // Device model options
  const deviceModelOptions = {
    Router: [
      { value: 'Cisco ISR 4321', label: 'Cisco ISR 4321' },
      { value: 'Cisco ISR 4331', label: 'Cisco ISR 4331' },
      { value: 'HPE FlexNetwork MSR3000', label: 'HPE FlexNetwork MSR3000' },
      { value: 'HPE FlexNetwork MSR4000', label: 'HPE FlexNetwork MSR4000' },
      { value: 'Juniper SRX300', label: 'Juniper SRX300' },
      { value: 'Juniper SRX320', label: 'Juniper SRX320' }
    ],
    Switch: [
      { value: 'Aruba 2930F 48G', label: 'Aruba 2930F 48G' },
      { value: 'Aruba 2930M 48G', label: 'Aruba 2930M 48G' },
      { value: 'Cisco Catalyst 9300-48P', label: 'Cisco Catalyst 9300-48P' },
      { value: 'Cisco Catalyst 9300-24P', label: 'Cisco Catalyst 9300-24P' },
      { value: 'Fortinet FortiSwitch 448E', label: 'Fortinet FortiSwitch 448E' },
      { value: 'Fortinet FortiSwitch 224E', label: 'Fortinet FortiSwitch 224E' }
    ],
    Firewall: [
      { value: 'FortiGate 60F', label: 'FortiGate 60F (FortiCare Essential)' },
      { value: 'FortiGate 80F', label: 'FortiGate 80F (FortiCare Premium)' },
      { value: 'FortiGate 100F', label: 'FortiGate 100F (FortiCare Enterprise)' },
      { value: 'FortiGate 200F', label: 'FortiGate 200F (FortiCare Elite)' },
      { value: 'Palo Alto PA-220', label: 'Palo Alto PA-220' },
      { value: 'Palo Alto PA-850', label: 'Palo Alto PA-850' }
    ]
  };
  
  // VAS structured by categories with proper grouping
  const vasCategories = {
    'Additional IP': {
      label: 'Additional IP',
      type: 'multi' as const,
      options: [
        { value: 'Static IPv4/32', label: 'Static IPv4/32' }
      ]
    },
    'Devices': {
      label: 'Devices',
      type: 'multi' as const,
      options: [
        { 
          value: 'Router', 
          label: 'Router',
          description: 'Network routing equipment'
        },
        { 
          value: 'Firewall', 
          label: 'Firewall',
          description: 'Network security device'
        },
        { 
          value: 'Switch', 
          label: 'Switch',
          description: 'Network switching equipment'
        }
      ]
    },
    'Managed Services': {
      label: 'Managed Services',
      type: 'multi' as const,
      options: [
        { 
          value: 'Managed Router', 
          label: 'Managed Router',
          description: '24/7 monitoring and configuration management'
        },
        { 
          value: 'Managed Firewall', 
          label: 'Managed Firewall',
          description: 'Enterprise-grade security with 24/7 monitoring'
        }
      ]
    },
    'DDoS': {
      label: 'DDoS Protection',
      type: 'single' as const,
      options: [
        { value: 'DDoS 10 Gbps', label: '10 Gbps Mitigation' },
        { value: 'DDoS 20 Gbps', label: '20 Gbps Mitigation' }
      ]
    }
  };
  
  const planOptions = ['Basic', 'Premium'];
  const contractTermOptions = ['1 year', '2 years', '3 years', '4 years', '5 years'];

  // Pricing based on plan
  const pricingMatrix: Record<string, { otc: number; arc: number }> = {
    // DIA Plans
    'Standard': { otc: 30000, arc: 15000 },
    'Value': { otc: 40000, arc: 20000 },
    'Premium': { otc: 50000, arc: 25000 },
    // MPLS QOS
    'Bronze': { otc: 35000, arc: 18000 },
    'Silver': { otc: 45000, arc: 22000 },
    'Gold': { otc: 55000, arc: 28000 },
    // Legacy plans
    'Basic': { otc: 30000, arc: 15000 },
    'Enterprise': { otc: 75000, arc: 35000 },
    'Business': { otc: 40000, arc: 20000 }
  };

  // Helper function to get bandwidth value from label
  const getBandwidthValue = (label: string): number => {
    const option = bandwidthOptions.find(opt => opt.label === label);
    return option ? option.value : 0;
  };

  // Helper function to get allowed bandwidth options (only lower than current for Bandwidth Change)
  const getAllowedBandwidthOptions = (currentBandwidth: string, serviceChangeType?: string): BandwidthOption[] => {
    const currentValue = getBandwidthValue(currentBandwidth);
    
    // For "Bandwidth Change" service type, only allow reduction (values <= current)
    if (serviceChangeType === 'Bandwidth Change' && currentValue > 0) {
      return bandwidthOptions.filter(opt => opt.value <= currentValue);
    }
    
    // For "Add Secondary/Tertiary Link" or New FIDs, show all options
    return bandwidthOptions;
  };

  // Helper function to check if link expiry is within 12 months
  const isLinkExpiryWithin12Months = (expiryDate?: string): boolean => {
    if (!expiryDate) return false;
    
    const today = new Date('2026-03-09'); // Current date
    const expiry = new Date(expiryDate);
    const monthsUntilExpiry = (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30.44); // Average days per month
    
    return monthsUntilExpiry <= 12;
  };

  // Helper function to get pricing based on global plan
  const getPricing = () => {
    return pricingMatrix[globalPlan] || { otc: 0, arc: 0 };
  };

  // Helper function to check if FID is configured based on network type
  const isFIDConfigured = (fid: FIDConfiguration): boolean => {
    const hasBasicConfig = fid.isConfigured || fid.plan || (fid.vas && fid.vas.length > 0);
    
    if (networkType === 'MPLS') {
      // For MPLS, also check if QoS is configured
      // In uniform mode, QoS is applied if uniformQoS is set
      // In distributed mode, check individual FID QoS
      const hasQoS = qosDistributionMode === 'uniform' 
        ? uniformQoS !== ''
        : ((fid.qosMode === 'single' && fid.qosSingle) || 
           (fid.qosMode === 'split' && fid.qosSplit && 
            ((fid.qosSplit.bronze || 0) + (fid.qosSplit.gold || 0) + (fid.qosSplit.diamond || 0)) > 0));
      return hasBasicConfig && hasQoS;
    }
    
    return hasBasicConfig;
  };

  // Helper function to initialize FID configurations from fidsData
  const initializeFIDConfigurations = (): FIDConfiguration[] => {
    console.log('=== Initializing FID Configurations ===');
    console.log('fidsData:', fidsData);
    console.log('fidsData length:', fidsData?.length);
    
    if (fidsData && fidsData.length > 0) {
      // Initialize from passed FID data
      console.log('Using fidsData to initialize configurations');
      const configs = fidsData.map((fidData: any, index: number) => {
        console.log(`Processing FID ${index}:`, fidData);
        return {
          fid: fidData.fid,
          type: fidData.type as 'New' | 'MDAC',
          serviceChangeType: fidData.serviceChangeType,
          linkId: fidData.type === 'MDAC' ? (fidData.currentLinkId || `LINK-2025-${String(index + 1).padStart(3, '0')}`) : undefined, // Only for MDAC
          location: fidData.location,
          connectionType: fidData.connectionType as any,
          // For MDAC, use currentBandwidth if bandwidth is not set
          bandwidth: fidData.bandwidth || fidData.currentBandwidth || '',
          currentBandwidthValue: getBandwidthValue(fidData.bandwidth || fidData.currentBandwidth || ''),
          linkType: 'Primary' as const,
          vas: [],
          plan: '',
          otc: 0,
          arc: 0,
          isConfigured: false,
          isHub: false,
          contractPeriod: fidData.serviceChangeType === 'Add Secondary/Tertiary Link' ? '3 years' : undefined,
          currentLinkId: fidData.currentLinkId,
          currentAddress: fidData.currentAddress,
          currentBandwidth: fidData.currentBandwidth,
          currentConnectionType: fidData.currentConnectionType,
          currentPlan: fidData.currentPlan,
          currentVAS: fidData.currentVAS,
          currentLinkExpiry: fidData.currentLinkExpiry,
        };
      });
      
      // Deduplicate configs by FID
      const uniqueConfigs = configs.filter((config, index, self) => 
        index === self.findIndex((c) => c.fid === config.fid)
      );
      
      console.log('Initialized configs:', uniqueConfigs);
      return uniqueConfigs;
    }
    
    // Return mock data if no fidsData
    console.log('No fidsData, using mock data');
    return [
      {
        fid: 'FID-2025-001',
        type: 'MDAC',
        serviceChangeType: 'Add Secondary/Tertiary Link',
        linkId: 'LINK-2025-001',
        location: 'Bandra Kurla Complex, Mumbai',
        connectionType: 'Fiber',
        bandwidth: '100 Mbps',
        currentBandwidthValue: 100,
        linkType: 'Primary',
        vas: [],
        plan: '',
        otc: 0,
        arc: 0,
        isConfigured: false,
        isHub: false,
        contractPeriod: '3 years',
        currentLinkId: 'LINK-2024-789',
        currentAddress: 'Bandra Kurla Complex, Mumbai',
        currentBandwidth: '100 Mbps',
        currentConnectionType: 'Fiber',
        currentPlan: 'Premium',
        currentVAS: ['Static IPv4/32'],
        currentLinkExpiry: '2026-11-15', // 8 months away (within 12 months)
        portDetails: {
          portClassification: 'Primary',
          handoffType: 'Electrical Ethernet',
          portBandwidth: '1 Gbps',
          bandwidthType: 'fixed',
          portType: '1G',
          sifyDnsCache: true,
          portRedundancy: false,
          ipType: 'IPv4'
        }
      },
      {
        fid: 'FID-2025-002',
        type: 'MDAC',
        serviceChangeType: 'Add Secondary/Tertiary Link',
        linkId: 'LINK-2025-002',
        location: 'Andheri East, Mumbai',
        connectionType: 'Fiber',
        bandwidth: '500 Mbps',
        currentBandwidthValue: 500,
        linkType: 'Secondary',
        vas: [],
        plan: '',
        otc: 0,
        arc: 0,
        isConfigured: false,
        isHub: false,
        contractPeriod: '3 years',
        currentLinkId: 'LINK-2024-456',
        currentAddress: 'Andheri East, Mumbai',
        currentBandwidth: '500 Mbps',
        currentConnectionType: 'Fiber',
        currentPlan: 'Gold',
        currentVAS: ['DDoS 10 Gbps', 'Managed Router'],
        currentLinkExpiry: '2028-06-30' // 2 years 3 months away (more than 12 months)
      },
      {
        fid: 'FID-2025-003',
        type: 'New',
        location: 'Vashi, Navi Mumbai',
        connectionType: 'Fiber',
        bandwidth: '55 Mbps',
        currentBandwidthValue: 55,
        linkType: 'Primary',
        vas: ['Managed Firewall', 'Managed Router'],
        plan: '',
        otc: 0,
        arc: 0,
        isConfigured: true,
        isHub: false
      },
      {
        fid: 'FID-2025-004',
        type: 'New',
        location: 'Powai, Mumbai',
        connectionType: 'Fiber - Ethernet Drop',
        bandwidth: '1 Gbps',
        currentBandwidthValue: 1000,
        linkType: 'Primary',
        vas: ['Static IPv4/29', 'DDoS 5 Gbps'],
        plan: '',
        otc: 0,
        arc: 0,
        isConfigured: false,
        isHub: false
      }
    ];
  };

  // Mock FID configurations
  const [fidConfigurations, setFidConfigurations] = useState<FIDConfiguration[]>(() => {
    // Check if we have saved fidConfigurations in stateData (from localStorage)
    if (stateData?.fidConfigurations && Array.isArray(stateData.fidConfigurations) && stateData.fidConfigurations.length > 0) {
      console.log('✅ Restoring fidConfigurations from saved state:', stateData.fidConfigurations);
      
      // Deduplicate in case localStorage has duplicates
      const uniqueConfigs = stateData.fidConfigurations.filter((config: FIDConfiguration, index: number, self: FIDConfiguration[]) => 
        index === self.findIndex((c: FIDConfiguration) => c.fid === config.fid)
      );
      
      return uniqueConfigs;
    }
    
    // Otherwise initialize fresh
    console.log('🆕 Initializing fresh fidConfigurations');
    return initializeFIDConfigurations();
  });

  // Check if this is a MDAC proposal (based on fidConfigurations state)
  const isServiceChanges = useMemo(() => {
    const result = fidConfigurations.length > 0 && fidConfigurations[0].type === 'MDAC';
    console.log('isServiceChanges calculated from fidConfigurations:', result);
    return result;
  }, [fidConfigurations]);

  // Check if any selected FID has Sify DC or Connected DC location
  const hasBurstableEligibleLocation = useMemo(() => {
    return fidConfigurations.some(fid => 
      fid.location.includes('Sify DC') || fid.location.includes('Connected DC')
    );
  }, [fidConfigurations]);

  // Auto-set bandwidth type to Fixed if no eligible locations for Burstable
  React.useEffect(() => {
    if (!hasBurstableEligibleLocation) {
      setBandwidthType('fixed');
      setBurstOption('');
      setFiberBandwidthType('fixed');
      setFiberBurstOption('');
      setWirelessBandwidthType('fixed');
      setWirelessBurstOption('');
    }
  }, [hasBurstableEligibleLocation]);

  // Save state to localStorage whenever fidConfigurations or other critical state changes
  React.useEffect(() => {
    // Deduplicate fidConfigurations before saving to prevent accumulation of duplicates
    const uniqueFidConfigurations = fidConfigurations.filter((config, index, self) => 
      index === self.findIndex((c) => c.fid === config.fid)
    );
    
    const stateToSave = {
      proposalId,
      company,
      networkProduct,
      opportunityId,
      fidsData,
      lockedProduct,
      isServiceChanges: isServiceChangesFromState,
      fidConfigurations: uniqueFidConfigurations, // Save the deduplicated fidConfigurations
      networkType, // Save network type
      globalPlan, // Save global plan
      qosDistributionMode, // Save QoS distribution mode
      uniformQoS // Save uniform QoS selection
    };
    
    console.log('💾 Updating localStorage with current state:', stateToSave);
    localStorage.setItem('proposalNavigationState', JSON.stringify(stateToSave));
  }, [fidConfigurations, proposalId, company, networkProduct, opportunityId, fidsData, lockedProduct, isServiceChangesFromState, networkType, globalPlan, qosDistributionMode, uniformQoS]);

  // Handle returned FIDs from AddFIDsFromPool - for SSC
  React.useEffect(() => {
    if (location.state?.selectedFIDsFromPool && location.state?.isSecureSiteConnect) {
      const selectedFids = location.state.selectedFIDsFromPool;
      setSelectedSscFids(selectedFids);
      setSscPortDetailsDialogOpen(true);
      
      // Clear the state to prevent dialog from reopening on refresh
      window.history.replaceState({
        ...location.state,
        selectedFIDsFromPool: undefined,
        isSecureSiteConnect: undefined
      }, '');
    }
  }, [location.state]);

  // Cleanup localStorage when user navigates away from this page (except to Add FIDs)
  React.useEffect(() => {
    return () => {
      // Only clean up if we're navigating away (not just re-rendering)
      // We'll check if we're going to /add-fids, and if not, clean up
      const currentPath = window.location.pathname;
      console.log('Component unmounting, current path:', currentPath);
      
      // Don't clean up if staying on configure-proposal or going to add-fids or pricing-management
      if (!currentPath.includes('/configure-proposal') && !currentPath.includes('/add-fids') && !currentPath.includes('/pricing-management')) {
        console.log('🧹 Cleaning up proposalNavigationState on unmount');
        localStorage.removeItem('proposalNavigationState');
      } else {
        console.log('✋ Keeping proposalNavigationState (still in proposal flow)');
      }
    };
  }, []);

  // Handler for SSC Port Details submission
  const handleSscPortDetailsSubmit = () => {
    if (!sscPortClassification || !sscPortBandwidth) {
      toast.error('Please fill in all port details');
      return;
    }

    // Add SSC FIDs to configurations
    const newSscFids = selectedSscFids.map((fid: string) => {
      // Find FID details from feasibility pool (mock for now)
      return {
        fid,
        type: 'New' as const,
        location: 'Mumbai', // This will come from actual FID data
        connectionType: 'Broadband - Internet' as const, // Default, user will select
        bandwidth: `${sscPortBandwidth} Mbps`,
        currentBandwidthValue: parseInt(sscPortBandwidth),
        linkType: sscPortClassification as 'Primary' | 'Secondary' | 'Tertiary',
        vas: [],
        plan: '',
        otc: 0,
        arc: 0,
        isConfigured: false,
        isHub: false,
        isSecureSiteConnect: true
      };
    });

    setFidConfigurations(prev => [...prev, ...newSscFids]);
    setSscPortDetailsDialogOpen(false);
    setHasSscPortDetails(true); // Mark that SSC port details have been configured
    toast.success(`${selectedSscFids.length} Secure Site Connect FID(s) added`);
    
    // Reset SSC selection
    setSelectedSscFids([]);
  };

  // Mock basic details
  const basicDetails = useMemo(() => ({
    proposalId: proposalId || 'PROP-2025-001',
    type: isServiceChanges ? 'MDAC' : 'New',
    product: networkProduct || 'DIA (Dedicated Internet Access)',
    companyName: company || 'TechCorp Solutions',
    customerId: 'TC001',
    totalFids: fidConfigurations.length,
    version: 'v1.0',
    generatedOn: '2025-02-04'
  }), [proposalId, networkProduct, company, fidConfigurations.length, isServiceChanges]);

  // Get current editing FID's port details
  const currentEditingPortDetails = useMemo(() => {
    const fid = fidConfigurations.find(f => f.fid === editingPortFID);
    return fid?.portDetails || {};
  }, [editingPortFID, fidConfigurations]);

  // Calculate configuration status
  const configurationStatus = useMemo(() => {
    const configured = fidConfigurations.filter(f => f.isConfigured).length;
    const total = fidConfigurations.length;
    const yetToConfigure = total - configured;
    return { configured, total, yetToConfigure };
  }, [fidConfigurations]);

  // Calculate total pricing
  const totalPricing = useMemo(() => {
    const pricing = getPricing();
    const totalOtc = fidConfigurations.length * pricing.otc;
    const totalArc = fidConfigurations.length * pricing.arc;
    return { totalOtc, totalArc };
  }, [fidConfigurations.length, globalPlan]);

  // Check if at least one FID has Primary link type
  const hasPrimaryLink = useMemo(() => {
    return fidConfigurations.some(f => f.linkType === 'Primary');
  }, [fidConfigurations]);

  // Check if a FID can be set as Hub (must have highest bandwidth)
  const canBeHub = (fidToCheck: FIDConfiguration): boolean => {
    const maxBandwidth = Math.max(...fidConfigurations.map(f => f.currentBandwidthValue));
    return fidToCheck.currentBandwidthValue >= maxBandwidth;
  };

  // Get the current Hub FID
  const hubFid = useMemo(() => {
    return fidConfigurations.find(f => f.isHub === true);
  }, [fidConfigurations]);

  // Get missing fields for a FID
  const getMissingFields = (fid: FIDConfiguration): string[] => {
    const missing: string[] = [];
    // For DIA network type, no fields are mandatory for saving
    // Users can configure fields as needed
    // Plan/QOS is now global, so we don't check it per FID
    return missing;
  };

  // Check if FIDs have both Fiber and Wireless LM types
  const hasMixedLMTypes = useMemo(() => {
    const hasFiber = fidConfigurations.some(f => 
      f.connectionType === 'Fiber' || f.connectionType === 'Fiber - Ethernet Drop'
    );
    const hasWireless = fidConfigurations.some(f => 
      f.connectionType === 'Wireless'
    );
    return hasFiber && hasWireless;
  }, [fidConfigurations]);

  // Handlers
  const handleRowSelection = (fid: string, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, fid]);
    } else {
      setSelectedRows(selectedRows.filter(id => id !== fid));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(fidConfigurations.map(f => f.fid));
    } else {
      setSelectedRows([]);
    }
  };

  const updateFIDField = <K extends keyof FIDConfiguration>(
    fid: string,
    field: K,
    value: FIDConfiguration[K]
  ) => {
    setFidConfigurations(prev => {
      const newConfigs = prev.map(config => {
        if (config.fid === fid) {
          const updated = { ...config, [field]: value };
          
          // Update bandwidth value when bandwidth changes
          if (field === 'bandwidth' && typeof value === 'string') {
            updated.currentBandwidthValue = getBandwidthValue(value);
          }
          
          // Auto-calculate OTC and ARC when plan is selected
          if (field === 'plan' && value && typeof value === 'string') {
            const pricing = pricingMatrix[value];
            if (pricing) {
              updated.otc = pricing.otc;
              updated.arc = pricing.arc;
              // Mark as configured if plan is selected
              if (updated.plan) {
                updated.isConfigured = true;
              }
            }
          }
          
          return updated;
        }
        return config;
      });

      // Check if bandwidth change affects Hub validity
      if (field === 'bandwidth') {
        const currentHub = newConfigs.find(f => f.isHub === true);
        if (currentHub) {
          const maxBandwidth = Math.max(...newConfigs.map(f => f.currentBandwidthValue));
          
          // If the Hub no longer has the highest bandwidth, unset it
          if (currentHub.currentBandwidthValue < maxBandwidth) {
            toast.warning(`Hub unset from ${currentHub.location} as it no longer has the highest bandwidth`);
            return newConfigs.map(config => ({
              ...config,
              isHub: false,
              linkType: config.isHub ? 'Spoke' : config.linkType
            }));
          }
        }
      }

      return newConfigs;
    });
  };

  const handleHubSelection = (fid: string, checked: boolean) => {
    const fidToUpdate = fidConfigurations.find(f => f.fid === fid);
    
    if (!fidToUpdate) return;
    
    if (checked && !canBeHub(fidToUpdate)) {
      toast.error('Hub must have the highest bandwidth among all FIDs. Please increase the bandwidth or add a new FID with higher bandwidth.');
      return;
    }
    
    setFidConfigurations(prev =>
      prev.map(config => ({
        ...config,
        isHub: config.fid === fid ? checked : false,
        linkType: config.fid === fid && checked ? 'Hub' : (config.isHub ? 'Spoke' : config.linkType)
      }))
    );
    
    if (checked) {
      toast.success(`${fidToUpdate.location} set as Hub`);
    }
  };

  const handleDeleteFID = (fid: string) => {
    if (fidConfigurations.length === 1) {
      toast.error('Cannot delete the last FID. At least one FID is required.');
      return;
    }

    const fidToDelete = fidConfigurations.find(f => f.fid === fid);
    if (!fidToDelete) return;

    setFidConfigurations(prev => prev.filter(config => config.fid !== fid));
    setSelectedRows(prev => prev.filter(id => id !== fid));
    
    if (fidToDelete.isHub) {
      toast.success(`FID ${fid} deleted successfully. Please select a new Hub.`);
    } else {
      toast.success(`FID ${fid} deleted successfully`);
    }
  };

  const handleBulkConfiguration = () => {
    if (selectedRows.length === 0) {
      toast.error('Please select at least one FID to configure');
      return;
    }

    // QoS validation for MPLS
    if (networkType === 'MPLS') {
      if (bulkQosMode === 'split') {
        const total = (bulkQosSplit.bronze || 0) + (bulkQosSplit.gold || 0) + (bulkQosSplit.diamond || 0);
        
        if (total === 0) {
          toast.error('Please configure at least one QoS tier for Distributed QoS');
          return;
        }
        
        if (bulkQosSplitUnit === 'percentage' && total !== 100) {
          toast.error('QoS split percentages must total exactly 100%');
          return;
        }
        
        if (bulkQosSplitUnit === 'mbps') {
          // Validate that split matches each selected FID's bandwidth
          const selectedFIDs = fidConfigurations.filter(f => selectedRows.includes(f.fid));
          const invalidFIDs = selectedFIDs.filter(fid => {
            const bandwidth = fid.currentBandwidthValue || 0;
            return total !== bandwidth;
          });
          
          if (invalidFIDs.length > 0) {
            const bandwidths = [...new Set(selectedFIDs.map(f => f.currentBandwidthValue))];
            if (bandwidths.length > 1) {
              toast.error('Selected FIDs have different bandwidths. QoS split in Mbps requires all FIDs to have the same bandwidth, or use percentage distribution.');
              return;
            } else {
              toast.error(`QoS split must total ${bandwidths[0]} Mbps to match the selected FIDs' bandwidth`);
              return;
            }
          }
        }
      }
    }

    // Collect VAS selections
    const updatedVAS: string[] = [];
    
    if (selectedIP) {
      updatedVAS.push(`IP: ${selectedIP}`);
    }
    
    if (deviceOption === 'own' && selectedDeviceTypes.length > 0 && managedServiceType) {
      const deviceDetails = selectedDeviceTypes.map(d => `${d} (${deviceCounts[d] || 1})`).join(', ');
      const managementType = managedServiceType === 'configuration' ? 'Configuration Management' : 'Configuration & Hardware Management';
      updatedVAS.push(`Managed Services (Own Device) - ${deviceDetails} - ${managementType}`);
    }
    
    if (deviceOption === 'buy' && selectedDeviceTypes.length > 0 && serviceVariant) {
      const deviceDetails = selectedDeviceTypes.map(d => {
        const model = serviceVariant === 'specific' && deviceModels[d] ? ` ${deviceModels[d]}` : '';
        return `${d}${model} (${deviceCounts[d] || 1})`;
      }).join(', ');
      const variantType = serviceVariant === 'bundled' ? 'Bundled Package' : 'Specific Model';
      const managedText = enableManagedService ? ' + Managed Service' : '';
      updatedVAS.push(`Device Purchase - ${deviceDetails}${managedText} - ${variantType}`);
    }
    
    if (selectedDDoS) {
      updatedVAS.push(`DDoS: ${selectedDDoS}`);
    }

    setFidConfigurations(prev =>
      prev.map(config => {
        if (selectedRows.includes(config.fid)) {
          const updated = { ...config };
          
          if (updatedVAS.length > 0) {
            updated.vas = updatedVAS;
            updated.isConfigured = true;
          }
          
          // Apply QoS configuration for MPLS
          if (networkType === 'MPLS') {
            if (bulkQosMode === 'single' && bulkQosSingle) {
              updated.qosMode = 'single';
              updated.qosSingle = bulkQosSingle;
              updated.qosSplit = undefined;
              updated.qosSplitUnit = undefined;
            } else if (bulkQosMode === 'split' && (bulkQosSplit.bronze > 0 || bulkQosSplit.gold > 0 || bulkQosSplit.diamond > 0)) {
              updated.qosMode = 'split';
              
              // If percentage, convert to Mbps based on FID's bandwidth
              if (bulkQosSplitUnit === 'percentage') {
                const bandwidth = config.currentBandwidthValue || 0;
                updated.qosSplit = {
                  bronze: Math.round((bulkQosSplit.bronze / 100) * bandwidth),
                  gold: Math.round((bulkQosSplit.gold / 100) * bandwidth),
                  diamond: Math.round((bulkQosSplit.diamond / 100) * bandwidth)
                };
                updated.qosSplitUnit = 'mbps';
              } else {
                // Already in Mbps
                updated.qosSplit = bulkQosSplit;
                updated.qosSplitUnit = bulkQosSplitUnit;
              }
              
              updated.qosSingle = undefined;
            }
          }
          
          return updated;
        }
        return config;
      })
    );

    toast.success(`Bulk configuration applied to ${selectedRows.length} FID(s)`);
    setBulkConfigOpen(false);
    setSelectedRows([]);
    setBulkVAS([]);
    // Reset VAS selections
    setSelectedIP('');
    setDeviceOption(null);
    setSelectedDeviceTypes([]);
    setDeviceCounts({});
    setDeviceModels({});
    setEnableManagedService(false);
    setManagedServiceType(null);
    setServiceVariant(null);
    setSelectedDDoS('');
    // Reset QoS selections
    setBulkQosMode('single');
    setBulkQosSingle('');
    setBulkQosSplit({ bronze: 0, gold: 0, diamond: 0 });
    setBulkQosSplitUnit('mbps');
    // Reset collapsible states
    setIpSectionOpen(false);
    setDevicesSectionOpen(false);
    setDdosSectionOpen(false);
  };

  const handleSaveConfiguration = () => {
    // For DIA, no mandatory fields check - users can save with any configuration state
    
    if (!hasPrimaryLink && networkType !== 'MPLS') {
      toast.error(`At least one FID must have "Primary" ${networkType === 'DIA' ? 'port classification' : 'link type'} selected.`);
      return;
    }

    toast.success('Configuration saved successfully');
    navigate('/proposal-details', {
      state: {
        proposalId: basicDetails.proposalId,
        company,
        networkProduct,
        opportunityId
      }
    });
  };

  const handleGenerateProposal = () => {
    toast.success('Proceeding to proposal generation...');
    
    // Navigate to proposal document generation page
    navigate('/proposal-document-generation', {
      state: {
        proposalId: basicDetails.proposalId,
        company: basicDetails.companyName,
        networkProduct: basicDetails.product,
        opportunityId,
        pricingData: fidConfigurations,
        totals: totalPricing
      }
    });
  };

  // VAS management functions
  const toggleVAS = (fidId: string, vasValue: string) => {
    setFidConfigurations(prev =>
      prev.map(config => {
        if (config.fid === fidId) {
          const hasVAS = config.vas.includes(vasValue);
          
          // Determine category of the new VAS
          let category = '';
          let categoryType: 'multi' | 'single' = 'multi';
          for (const [key, categoryData] of Object.entries(vasCategories)) {
            if (categoryData.options.some(opt => opt.value === vasValue)) {
              category = key;
              categoryType = categoryData.type;
              break;
            }
          }
          
          // For single-select categories (Devices and DDoS), replace existing item from same category
          if (categoryType === 'single') {
            // Remove any existing VAS from the same category
            const filteredVas = config.vas.filter(v => {
              // Check if this VAS belongs to the same category
              for (const [key, categoryData] of Object.entries(vasCategories)) {
                if (key === category && categoryData.options.some(opt => opt.value === v)) {
                  return false; // Remove it
                }
              }
              return true; // Keep it
            });
            return {
              ...config,
              vas: [...filteredVas, vasValue]
            };
          }
          
          // For multi-select categories, use normal toggle
          return {
            ...config,
            vas: hasVAS
              ? config.vas.filter(v => v !== vasValue)
              : [...config.vas, vasValue]
          };
        }
        return config;
      })
    );
  };

  const removeVASFromFID = (fidId: string, vasValue: string) => {
    setFidConfigurations(prev =>
      prev.map(config => {
        if (config.fid === fidId) {
          return {
            ...config,
            vas: config.vas.filter(v => v !== vasValue)
          };
        }
        return config;
      })
    );
  };

  const toggleBulkVAS = (vasValue: string) => {
    setBulkVAS(prev => {
      const hasVAS = prev.includes(vasValue);
      
      // Determine category of the new VAS
      let category = '';
      let categoryType: 'multi' | 'single' = 'multi';
      for (const [key, categoryData] of Object.entries(vasCategories)) {
        if (categoryData.options.some(opt => opt.value === vasValue)) {
          category = key;
          categoryType = categoryData.type;
          break;
        }
      }
      
      // For single-select categories, replace existing item
      if (categoryType === 'single') {
        // Remove any existing VAS from the same category
        const filteredVas = prev.filter(v => {
          for (const [key, categoryData] of Object.entries(vasCategories)) {
            if (key === category && categoryData.options.some(opt => opt.value === v)) {
              return false; // Remove it
            }
          }
          return true; // Keep it
        });
        return [...filteredVas, vasValue];
      }
      
      // For multi-select categories, use normal toggle
      return hasVAS
        ? prev.filter(v => v !== vasValue)
        : [...prev, vasValue];
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
                onClick={() => navigate('/feasibility-management')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-gray-900">Configure Requirement</h1>
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    Configuration in Progress
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">Configure pricing and technical details</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => navigate('/proposal-details', {
                state: { proposalId: basicDetails.proposalId, company, networkProduct, opportunityId }
              })}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button variant="outline" onClick={handleSaveConfiguration}>
                <Save className="w-4 h-4 mr-2" />
                Save Configuration
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  // Save complete state to localStorage before navigating
                  const stateToSave = {
                    proposalId: basicDetails.proposalId,
                    company,
                    networkProduct,
                    networkType,
                    opportunityId,
                    fidConfigurations,
                    fidsData,
                    lockedProduct,
                    isServiceChanges: isServiceChangesFromState,
                    globalPlan,
                    qosDistributionMode,
                    uniformQoS
                  };
                  localStorage.setItem('proposalNavigationState', JSON.stringify(stateToSave));
                  console.log('📤 Navigating to pricing management with state saved to localStorage:', stateToSave);
                  
                  navigate('/pricing-management', {
                    state: stateToSave
                  });
                }}
              >
                <IndianRupee className="w-4 h-4 mr-2" />
                Update Pricing
              </Button>
              <Button 
                onClick={handleGenerateProposal}
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate Proposal
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-6 space-y-6">
        {/* Basic Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Requirement Details</CardTitle>
            <CardDescription>Basic information about this proposal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-6">
              <div>
                <Label className="text-gray-600 text-xs">Req ID</Label>
                <p className="text-gray-900 mt-1">NW00005</p>
              </div>
              <div>
                <Label className="text-gray-600 text-xs">Type</Label>
                <p className="text-gray-900 mt-1">{basicDetails.type}</p>
              </div>
              <div>
                <Label className="text-gray-600 text-xs">Version</Label>
                <p className="text-gray-900 mt-1">{basicDetails.version}</p>
              </div>
              <div>
                <Label className="text-gray-600 text-xs">Customer</Label>
                <p className="text-gray-900 mt-1">{basicDetails.companyName}</p>
              </div>
              <div>
                <Label className="text-gray-600 text-xs">Customer ID</Label>
                <p className="text-gray-900 mt-1">{basicDetails.customerId}</p>
              </div>
              <div>
                <Label className="text-gray-600 text-xs">Total FIDs</Label>
                <p className="text-gray-900 mt-1">{basicDetails.totalFids}</p>
              </div>
              <div>
                <Label className="text-gray-600 text-xs">Generated On</Label>
                <p className="text-gray-900 mt-1">{basicDetails.generatedOn}</p>
              </div>
              {!isServiceChanges && (
                <div>
                  <Label className="text-gray-600 text-xs">Contract Term</Label>
                  {isEditingContractTerm ? (
                    <div className="mt-1 flex items-center gap-2">
                      <Select value={contractTerm} onValueChange={setContractTerm}>
                        <SelectTrigger className="h-8 w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1 year">1 year</SelectItem>
                          <SelectItem value="2 years">2 years</SelectItem>
                          <SelectItem value="3 years">3 years</SelectItem>
                          <SelectItem value="4 years">4 years</SelectItem>
                          <SelectItem value="5 years">5 years</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => setIsEditingContractTerm(false)}
                      >
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-gray-900">{contractTerm}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={() => setIsEditingContractTerm(true)}
                      >
                        <Pencil className="w-3 h-3 text-gray-400 hover:text-gray-600" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Network Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Network Selection</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <div className="max-w-xs">
                <Label htmlFor="network-type" className="text-gray-900 mb-2 block flex items-center gap-2">
                  Product Type <span className="text-red-500">*</span>
                  {lockedProduct && isServiceChanges && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium border border-indigo-200 cursor-help">
                            <Lock className="w-3 h-3" />
                            <span>LOCKED</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <p className="text-xs">
                            Product type is locked to <span className="font-semibold">{lockedProduct}</span> because all selected FIDs are {lockedProduct} MDAC. The network type cannot be changed.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </Label>
                <Select 
                  value={networkType} 
                  onValueChange={(value: 'DIA' | 'MPLS') => {
                    setNetworkType(value);
                    // Reset plan to default when network type changes
                    setGlobalPlan(value === 'MPLS' ? 'Bronze' : 'Value');
                  }}
                  disabled={lockedProduct && isServiceChanges}
                >
                  <SelectTrigger 
                    id="network-type" 
                    className={lockedProduct && isServiceChanges ? 'bg-indigo-50/50 border-indigo-200 cursor-not-allowed text-indigo-900' : ''}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DIA">DIA</SelectItem>
                    <SelectItem value="MPLS">MPLS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {networkType === "MPLS" && !isServiceChanges && (
                <div className="max-w-xs">
                  <Label htmlFor="mpls-type" className="text-gray-900 mb-2 block">
                    MPLS Type <span className="text-red-500">*</span>
                  </Label>
                  <Select value={mplsType} onValueChange={(value: 'Mesh' | 'Hub & Spoke') => setMplsType(value)}>
                    <SelectTrigger id="mpls-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mesh">Mesh</SelectItem>
                      <SelectItem value="Hub & Spoke">Hub & Spoke</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {networkType === 'DIA' && !isServiceChanges && (
                <div className="max-w-xs">
                  <Label htmlFor="global-plan" className="text-gray-900 mb-2 block">
                    Class of Service <span className="text-red-500">*</span>
                  </Label>
                  <Select value={globalPlan} onValueChange={setGlobalPlan}>
                    <SelectTrigger id="global-plan">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Value">Value</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Port Details Section - Only shown for New FIDs, not for MDAC */}
            {!isServiceChanges && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              {!hasMixedLMTypes ? (
                <>
                  <h4 className="text-sm text-gray-900 mb-4">Port Details</h4>
                  
                  {networkType === 'DIA' ? (
                <>
                  {/* First Row - DIA Port Details */}
                  <div className="flex items-start gap-6 flex-wrap">
                    <div className="max-w-xs">
                      <Label htmlFor="port-classification" className="text-gray-900 mb-2 block">
                        Port Classification
                      </Label>
                      <Select value={portLinkType} onValueChange={setPortLinkType}>
                        <SelectTrigger id="port-classification">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Primary">Primary</SelectItem>
                          <SelectItem value="Secondary">Secondary</SelectItem>
                          <SelectItem value="Tertiary">Tertiary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="max-w-xs">
                      <Label htmlFor="handoff-type" className="text-gray-900 mb-2 block">
                        Hand off Type
                      </Label>
                      <Select value={portType} onValueChange={setPortType}>
                        <SelectTrigger id="handoff-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Electrical Ethernet">Electrical Ethernet</SelectItem>
                          <SelectItem value="Optical Ethernet - Single mode">Optical Ethernet - Single mode</SelectItem>
                          <SelectItem value="Optical Ethernet - Multi mode">Optical Ethernet - Multi mode</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="max-w-xs">
                      <Label htmlFor="port-bandwidth" className="text-gray-900 mb-2 block">
                        Port Bandwidth <span className="text-red-500">*</span>
                      </Label>
                      <Select value={portBandwidth} onValueChange={setPortBandwidth}>
                        <SelectTrigger id="port-bandwidth">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="100 Mbps">100 Mbps</SelectItem>
                          <SelectItem value="1 Gbps">1 Gbps</SelectItem>
                          <SelectItem value="10 Gbps">10 Gbps</SelectItem>
                          <SelectItem value="40 Gbps">40 Gbps</SelectItem>
                          <SelectItem value="100 Gbps">100 Gbps</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="max-w-xs">
                      <Label htmlFor="bandwidth-type" className="text-gray-900 mb-2 block">
                        Bandwidth Type
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-4 h-4 inline-block ml-1 text-gray-500 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>Burstable type is applicable only if the location is Sify DC or Connected DC. For all other locations, only Fixed bandwidth is applicable.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Select value={bandwidthType} onValueChange={(value: 'fixed' | 'burstable') => {
                        setBandwidthType(value);
                        if (value === 'fixed') {
                          setBurstOption('');
                        }
                      }}>
                        <SelectTrigger id="bandwidth-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">Fixed</SelectItem>
                          <SelectItem value="burstable" disabled={!hasBurstableEligibleLocation}>Burstable</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {bandwidthType === 'burstable' && (
                      <div className="max-w-xs">
                        <Label htmlFor="burst-option" className="text-gray-900 mb-2 block">
                          Burst Option
                        </Label>
                        <Select value={burstOption} onValueChange={setBurstOption}>
                          <SelectTrigger id="burst-option">
                            <SelectValue placeholder="Select burst" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="burst-2x">Burst 2x</SelectItem>
                            <SelectItem value="burst-4x">Burst 4x</SelectItem>
                            <SelectItem value="burst-5x">Burst 5x</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="max-w-xs">
                      <Label htmlFor="port-type-size" className="text-gray-900 mb-2 block">
                        Port Type
                      </Label>
                      <Select value={portTypeSize} onValueChange={setPortTypeSize}>
                        <SelectTrigger id="port-type-size">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1G">1G</SelectItem>
                          <SelectItem value="10G">10G</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Second Row - Checkboxes */}
                  <div className="flex items-center gap-8 mt-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sify-dns-cache"
                        checked={sifyDnsCache}
                        onCheckedChange={(checked) => setSifyDnsCache(checked as boolean)}
                      />
                      <Label
                        htmlFor="sify-dns-cache"
                        className="text-sm text-gray-900 cursor-pointer"
                      >
                        Sify DNS cache services
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="port-redundancy"
                        checked={portRedundancy}
                        onCheckedChange={(checked) => setPortRedundancy(checked as boolean)}
                      />
                      <Label
                        htmlFor="port-redundancy"
                        className="text-sm text-gray-900 cursor-pointer"
                      >
                        Port redundancy required
                      </Label>
                    </div>
                  </div>
                </>
              ) : (
                // MPLS Port Details
                <div className="flex items-start gap-6 flex-wrap">
                  <div className="max-w-xs">
                    <Label htmlFor="port-classification-mpls" className="text-gray-900 mb-2 block">
                      Port Classification
                    </Label>
                    <Select value={portLinkType} onValueChange={setPortLinkType}>
                      <SelectTrigger id="port-classification-mpls">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Primary">Primary</SelectItem>
                        <SelectItem value="Secondary">Secondary</SelectItem>
                        <SelectItem value="Tertiary">Tertiary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="max-w-xs">
                    <Label htmlFor="handoff-type-mpls" className="text-gray-900 mb-2 block">
                      Hand off Type
                    </Label>
                    <Select value={portType} onValueChange={setPortType}>
                      <SelectTrigger id="handoff-type-mpls">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electrical Ethernet">Electrical Ethernet</SelectItem>
                        <SelectItem value="Optical Ethernet - Single mode">Optical Ethernet - Single mode</SelectItem>
                        <SelectItem value="Optical Ethernet - Multi mode">Optical Ethernet - Multi mode</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="max-w-xs">
                    <Label htmlFor="port-bandwidth-mpls" className="text-gray-900 mb-2 block">
                      Port Bandwidth <span className="text-red-500">*</span>
                    </Label>
                    <Select value={portBandwidth} onValueChange={setPortBandwidth}>
                      <SelectTrigger id="port-bandwidth-mpls">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100 Mbps">100 Mbps</SelectItem>
                        <SelectItem value="1 Gbps">1 Gbps</SelectItem>
                        <SelectItem value="10 Gbps">10 Gbps</SelectItem>
                        <SelectItem value="40 Gbps">40 Gbps</SelectItem>
                        <SelectItem value="100 Gbps">100 Gbps</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="max-w-xs">
                    <Label htmlFor="port-type-mpls" className="text-gray-900 mb-2 block">
                      Port Type
                    </Label>
                    <Select value={portTypeSize} onValueChange={setPortTypeSize}>
                      <SelectTrigger id="port-type-mpls">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1G">1G</SelectItem>
                        <SelectItem value="10G">10G</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="max-w-xs">
                    <Label htmlFor="ip-type" className="text-gray-900 mb-2 block">
                      IP Type
                    </Label>
                    <Select value={ipType} onValueChange={setIpType}>
                      <SelectTrigger id="ip-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IPv4">IPv4</SelectItem>
                        <SelectItem value="IPv6">IPv6</SelectItem>
                        <SelectItem value="Dual">Dual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
                </>
              ) : (
                <>
                  {/* Mixed LM Types - Separate Port Details for Fiber and Wireless */}
                  <div className="space-y-6">
                    {/* Fiber Port Details */}
                    <div>
                      <h4 className="text-sm text-gray-900 mb-4 flex items-center gap-2">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">Fiber</Badge>
                        Port Details
                      </h4>
                      
                      {networkType === 'DIA' ? (
                        <>
                          <div className="flex items-start gap-6 flex-wrap">
                            <div className="max-w-xs">
                              <Label htmlFor="fiber-port-classification" className="text-gray-900 mb-2 block">
                                Port Classification
                              </Label>
                              <Select value={fiberPortLinkType} onValueChange={setFiberPortLinkType}>
                                <SelectTrigger id="fiber-port-classification">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Primary">Primary</SelectItem>
                                  <SelectItem value="Secondary">Secondary</SelectItem>
                                  <SelectItem value="Tertiary">Tertiary</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="max-w-xs">
                              <Label htmlFor="fiber-handoff-type" className="text-gray-900 mb-2 block">
                                Hand off Type
                              </Label>
                              <Select value={fiberPortType} onValueChange={setFiberPortType}>
                                <SelectTrigger id="fiber-handoff-type">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Electrical Ethernet">Electrical Ethernet</SelectItem>
                                  <SelectItem value="Optical Ethernet - Single mode">Optical Ethernet - Single mode</SelectItem>
                                  <SelectItem value="Optical Ethernet - Multi mode">Optical Ethernet - Multi mode</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="max-w-xs">
                              <Label htmlFor="fiber-port-bandwidth" className="text-gray-900 mb-2 block">
                                Port Bandwidth <span className="text-red-500">*</span>
                              </Label>
                              <Select value={fiberPortBandwidth} onValueChange={setFiberPortBandwidth}>
                                <SelectTrigger id="fiber-port-bandwidth">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="100 Mbps">100 Mbps</SelectItem>
                                  <SelectItem value="1 Gbps">1 Gbps</SelectItem>
                                  <SelectItem value="10 Gbps">10 Gbps</SelectItem>
                                  <SelectItem value="40 Gbps">40 Gbps</SelectItem>
                                  <SelectItem value="100 Gbps">100 Gbps</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="max-w-xs">
                              <Label htmlFor="fiber-bandwidth-type" className="text-gray-900 mb-2 block">
                                Bandwidth Type
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Info className="w-4 h-4 inline-block ml-1 text-gray-500 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                      <p>Burstable type is applicable only if the location is Sify DC or Connected DC. For all other locations, only Fixed bandwidth is applicable.</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </Label>
                              <Select value={fiberBandwidthType} onValueChange={(value: 'fixed' | 'burstable') => {
                                setFiberBandwidthType(value);
                                if (value === 'fixed') {
                                  setFiberBurstOption('');
                                }
                              }}>
                                <SelectTrigger id="fiber-bandwidth-type">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="fixed">Fixed</SelectItem>
                                  <SelectItem value="burstable" disabled={!hasBurstableEligibleLocation}>Burstable</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {fiberBandwidthType === 'burstable' && (
                              <div className="max-w-xs">
                                <Label htmlFor="fiber-burst-option" className="text-gray-900 mb-2 block">
                                  Burst Option
                                </Label>
                                <Select value={fiberBurstOption} onValueChange={setFiberBurstOption}>
                                  <SelectTrigger id="fiber-burst-option">
                                    <SelectValue placeholder="Select burst" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="burst-2x">Burst 2x</SelectItem>
                                    <SelectItem value="burst-4x">Burst 4x</SelectItem>
                                    <SelectItem value="burst-5x">Burst 5x</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}

                            <div className="max-w-xs">
                              <Label htmlFor="fiber-port-type-size" className="text-gray-900 mb-2 block">
                                Port Type
                              </Label>
                              <Select value={fiberPortTypeSize} onValueChange={setFiberPortTypeSize}>
                                <SelectTrigger id="fiber-port-type-size">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1G">1G</SelectItem>
                                  <SelectItem value="10G">10G</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="flex items-center gap-8 mt-6">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="fiber-sify-dns-cache"
                                checked={fiberSifyDnsCache}
                                onCheckedChange={(checked) => setFiberSifyDnsCache(checked as boolean)}
                              />
                              <Label
                                htmlFor="fiber-sify-dns-cache"
                                className="text-sm text-gray-900 cursor-pointer"
                              >
                                Sify DNS cache services
                              </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="fiber-port-redundancy"
                                checked={fiberPortRedundancy}
                                onCheckedChange={(checked) => setFiberPortRedundancy(checked as boolean)}
                              />
                              <Label
                                htmlFor="fiber-port-redundancy"
                                className="text-sm text-gray-900 cursor-pointer"
                              >
                                Port redundancy required
                              </Label>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-start gap-6 flex-wrap">
                          <div className="max-w-xs">
                            <Label htmlFor="fiber-port-classification-mpls" className="text-gray-900 mb-2 block">
                              Port Classification
                            </Label>
                            <Select value={fiberPortLinkType} onValueChange={setFiberPortLinkType}>
                              <SelectTrigger id="fiber-port-classification-mpls">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Primary">Primary</SelectItem>
                                <SelectItem value="Secondary">Secondary</SelectItem>
                                <SelectItem value="Tertiary">Tertiary</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="max-w-xs">
                            <Label htmlFor="fiber-handoff-type-mpls" className="text-gray-900 mb-2 block">
                              Hand off Type
                            </Label>
                            <Select value={fiberPortType} onValueChange={setFiberPortType}>
                              <SelectTrigger id="fiber-handoff-type-mpls">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Electrical Ethernet">Electrical Ethernet</SelectItem>
                                <SelectItem value="Optical Ethernet - Single mode">Optical Ethernet - Single mode</SelectItem>
                                <SelectItem value="Optical Ethernet - Multi mode">Optical Ethernet - Multi mode</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="max-w-xs">
                            <Label htmlFor="fiber-port-bandwidth-mpls" className="text-gray-900 mb-2 block">
                              Port Bandwidth <span className="text-red-500">*</span>
                            </Label>
                            <Select value={fiberPortBandwidth} onValueChange={setFiberPortBandwidth}>
                              <SelectTrigger id="fiber-port-bandwidth-mpls">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="100 Mbps">100 Mbps</SelectItem>
                                <SelectItem value="1 Gbps">1 Gbps</SelectItem>
                                <SelectItem value="10 Gbps">10 Gbps</SelectItem>
                                <SelectItem value="40 Gbps">40 Gbps</SelectItem>
                                <SelectItem value="100 Gbps">100 Gbps</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="max-w-xs">
                            <Label htmlFor="fiber-port-type-mpls" className="text-gray-900 mb-2 block">
                              Port Type
                            </Label>
                            <Select value={fiberPortTypeSize} onValueChange={setFiberPortTypeSize}>
                              <SelectTrigger id="fiber-port-type-mpls">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1G">1G</SelectItem>
                                <SelectItem value="10G">10G</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="max-w-xs">
                            <Label htmlFor="fiber-ip-type" className="text-gray-900 mb-2 block">
                              IP Type
                            </Label>
                            <Select value={fiberIpType} onValueChange={setFiberIpType}>
                              <SelectTrigger id="fiber-ip-type">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="IPv4">IPv4</SelectItem>
                                <SelectItem value="IPv6">IPv6</SelectItem>
                                <SelectItem value="Dual">Dual</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Wireless Port Details */}
                    <div className="pt-6 border-t border-gray-200">
                      <h4 className="text-sm text-gray-900 mb-4 flex items-center gap-2">
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700">Wireless</Badge>
                        Port Details
                      </h4>
                      
                      {networkType === 'DIA' ? (
                        <>
                          <div className="flex items-start gap-6 flex-wrap">
                            <div className="max-w-xs">
                              <Label htmlFor="wireless-port-classification" className="text-gray-900 mb-2 block">
                                Port Classification
                              </Label>
                              <Select value={wirelessPortLinkType} onValueChange={setWirelessPortLinkType}>
                                <SelectTrigger id="wireless-port-classification">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Primary">Primary</SelectItem>
                                  <SelectItem value="Secondary">Secondary</SelectItem>
                                  <SelectItem value="Tertiary">Tertiary</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="max-w-xs">
                              <Label htmlFor="wireless-handoff-type" className="text-gray-900 mb-2 block">
                                Hand off Type
                              </Label>
                              <Select value={wirelessPortType} onValueChange={setWirelessPortType}>
                                <SelectTrigger id="wireless-handoff-type">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Electrical Ethernet">Electrical Ethernet</SelectItem>
                                  <SelectItem value="Optical Ethernet - Single mode">Optical Ethernet - Single mode</SelectItem>
                                  <SelectItem value="Optical Ethernet - Multi mode">Optical Ethernet - Multi mode</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="max-w-xs">
                              <Label htmlFor="wireless-port-bandwidth" className="text-gray-900 mb-2 block">
                                Port Bandwidth <span className="text-red-500">*</span>
                              </Label>
                              <Select value={wirelessPortBandwidth} onValueChange={setWirelessPortBandwidth}>
                                <SelectTrigger id="wireless-port-bandwidth">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="100 Mbps">100 Mbps</SelectItem>
                                  <SelectItem value="1 Gbps">1 Gbps</SelectItem>
                                  <SelectItem value="10 Gbps">10 Gbps</SelectItem>
                                  <SelectItem value="40 Gbps">40 Gbps</SelectItem>
                                  <SelectItem value="100 Gbps">100 Gbps</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="max-w-xs">
                              <Label htmlFor="wireless-bandwidth-type" className="text-gray-900 mb-2 block">
                                Bandwidth Type
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Info className="w-4 h-4 inline-block ml-1 text-gray-500 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                      <p>Burstable type is applicable only if the location is Sify DC or Connected DC. For all other locations, only Fixed bandwidth is applicable.</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </Label>
                              <Select value={wirelessBandwidthType} onValueChange={(value: 'fixed' | 'burstable') => {
                                setWirelessBandwidthType(value);
                                if (value === 'fixed') {
                                  setWirelessBurstOption('');
                                }
                              }}>
                                <SelectTrigger id="wireless-bandwidth-type">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="fixed">Fixed</SelectItem>
                                  <SelectItem value="burstable" disabled={!hasBurstableEligibleLocation}>Burstable</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {wirelessBandwidthType === 'burstable' && (
                              <div className="max-w-xs">
                                <Label htmlFor="wireless-burst-option" className="text-gray-900 mb-2 block">
                                  Burst Option
                                </Label>
                                <Select value={wirelessBurstOption} onValueChange={setWirelessBurstOption}>
                                  <SelectTrigger id="wireless-burst-option">
                                    <SelectValue placeholder="Select burst" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="burst-2x">Burst 2x</SelectItem>
                                    <SelectItem value="burst-4x">Burst 4x</SelectItem>
                                    <SelectItem value="burst-5x">Burst 5x</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}

                            <div className="max-w-xs">
                              <Label htmlFor="wireless-port-type-size" className="text-gray-900 mb-2 block">
                                Port Type
                              </Label>
                              <Select value={wirelessPortTypeSize} onValueChange={setWirelessPortTypeSize}>
                                <SelectTrigger id="wireless-port-type-size">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1G">1G</SelectItem>
                                  <SelectItem value="10G">10G</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="flex items-center gap-8 mt-6">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="wireless-sify-dns-cache"
                                checked={wirelessSifyDnsCache}
                                onCheckedChange={(checked) => setWirelessSifyDnsCache(checked as boolean)}
                              />
                              <Label
                                htmlFor="wireless-sify-dns-cache"
                                className="text-sm text-gray-900 cursor-pointer"
                              >
                                Sify DNS cache services
                              </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="wireless-port-redundancy"
                                checked={wirelessPortRedundancy}
                                onCheckedChange={(checked) => setWirelessPortRedundancy(checked as boolean)}
                              />
                              <Label
                                htmlFor="wireless-port-redundancy"
                                className="text-sm text-gray-900 cursor-pointer"
                              >
                                Port redundancy required
                              </Label>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-start gap-6 flex-wrap">
                          <div className="max-w-xs">
                            <Label htmlFor="wireless-port-classification-mpls" className="text-gray-900 mb-2 block">
                              Port Classification
                            </Label>
                            <Select value={wirelessPortLinkType} onValueChange={setWirelessPortLinkType}>
                              <SelectTrigger id="wireless-port-classification-mpls">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Primary">Primary</SelectItem>
                                <SelectItem value="Secondary">Secondary</SelectItem>
                                <SelectItem value="Tertiary">Tertiary</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="max-w-xs">
                            <Label htmlFor="wireless-handoff-type-mpls" className="text-gray-900 mb-2 block">
                              Hand off Type
                            </Label>
                            <Select value={wirelessPortType} onValueChange={setWirelessPortType}>
                              <SelectTrigger id="wireless-handoff-type-mpls">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Electrical Ethernet">Electrical Ethernet</SelectItem>
                                <SelectItem value="Optical Ethernet - Single mode">Optical Ethernet - Single mode</SelectItem>
                                <SelectItem value="Optical Ethernet - Multi mode">Optical Ethernet - Multi mode</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="max-w-xs">
                            <Label htmlFor="wireless-port-bandwidth-mpls" className="text-gray-900 mb-2 block">
                              Port Bandwidth <span className="text-red-500">*</span>
                            </Label>
                            <Select value={wirelessPortBandwidth} onValueChange={setWirelessPortBandwidth}>
                              <SelectTrigger id="wireless-port-bandwidth-mpls">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="100 Mbps">100 Mbps</SelectItem>
                                <SelectItem value="1 Gbps">1 Gbps</SelectItem>
                                <SelectItem value="10 Gbps">10 Gbps</SelectItem>
                                <SelectItem value="40 Gbps">40 Gbps</SelectItem>
                                <SelectItem value="100 Gbps">100 Gbps</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="max-w-xs">
                            <Label htmlFor="wireless-port-type-mpls" className="text-gray-900 mb-2 block">
                              Port Type
                            </Label>
                            <Select value={wirelessPortTypeSize} onValueChange={setWirelessPortTypeSize}>
                              <SelectTrigger id="wireless-port-type-mpls">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1G">1G</SelectItem>
                                <SelectItem value="10G">10G</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="max-w-xs">
                            <Label htmlFor="wireless-ip-type" className="text-gray-900 mb-2 block">
                              IP Type
                            </Label>
                            <Select value={wirelessIpType} onValueChange={setWirelessIpType}>
                              <SelectTrigger id="wireless-ip-type">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="IPv4">IPv4</SelectItem>
                                <SelectItem value="IPv6">IPv6</SelectItem>
                                <SelectItem value="Dual">Dual</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Secure Site Connect Port Details - Only for MPLS with SSC FIDs and configured port details */}
                    {networkType === 'MPLS' && fidConfigurations.some(f => f.isSecureSiteConnect) && hasSscPortDetails && (
                      <div className="pt-6 border-t border-gray-200">
                        <h4 className="text-sm text-gray-900 mb-4 flex items-center gap-2">
                          <Badge variant="secondary" className="bg-amber-100 text-amber-700">Secure Site Connect</Badge>
                          Port Details
                        </h4>
                        
                        <div className="flex items-start gap-6 flex-wrap">
                          <div className="max-w-xs">
                            <Label className="text-gray-900 mb-2 block">
                              Port Classification
                            </Label>
                            <Select 
                              value={sscPortClassification} 
                              onValueChange={setSscPortClassification}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Primary">Primary</SelectItem>
                                <SelectItem value="Secondary">Secondary</SelectItem>
                                <SelectItem value="Tertiary">Tertiary</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="max-w-xs">
                            <Label className="text-gray-900 mb-2 block">
                              Port Bandwidth (Mbps) <span className="text-red-500">*</span>
                            </Label>
                            <Select 
                              value={sscPortBandwidth} 
                              onValueChange={setSscPortBandwidth}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="10">10 Mbps</SelectItem>
                                <SelectItem value="20">20 Mbps</SelectItem>
                                <SelectItem value="50">50 Mbps</SelectItem>
                                <SelectItem value="100">100 Mbps</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <p className="text-xs text-gray-600 mt-3">
                          These port details apply to all Secure Site Connect FIDs
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            )}
          </CardContent>
        </Card>

        {/* Warning if no primary link or no hub */}
        {networkType === 'MPLS' && mplsType === 'Hub & Spoke' && !hubFid && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <p className="text-sm text-orange-800">
                  <strong>Action Required:</strong> Please select one FID as Hub. The Hub must have the highest bandwidth among all FIDs.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        {networkType !== 'MPLS' && !hasPrimaryLink && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <p className="text-sm text-orange-800">
                  <strong>Action Required:</strong> At least one FID must have "Primary" {networkType === 'DIA' ? 'port classification' : 'link type'} selected.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Configure FIDs */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="mb-1">Configure FIDs</CardTitle>
                <CardDescription className="mb-3">
                  Configure bandwidth, plans, and pricing for each FID
                </CardDescription>
                <div className="flex items-center space-x-3 text-sm mb-2">
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-600">Configured:</span>
                    <span className="font-medium text-green-600">{configurationStatus.configured}</span>
                  </div>
                  <div className="w-px h-4 bg-gray-300" />
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-600">Yet to Configure:</span>
                    <span className="font-medium text-orange-600">{configurationStatus.yetToConfigure}</span>
                  </div>
                  <div className="w-px h-4 bg-gray-300" />
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-medium text-gray-900">{configurationStatus.total}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                    <span>Configured</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-orange-500" />
                    <span>Yet to Configure</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {selectedRows.length > 0 && (
                  <Badge variant="secondary" className="mr-2">
                    {selectedRows.length} selected
                  </Badge>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigate(`/add-fids/${proposalId || 'new'}`, {
                      state: {
                        proposalId: basicDetails.proposalId,
                        company,
                        networkProduct,
                        opportunityId
                      }
                    });
                  }}
                >
                  Add FID
                </Button>
                {networkType === 'MPLS' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigate(`/add-fids/${proposalId || 'new'}`, {
                        state: {
                          proposalId: basicDetails.proposalId,
                          company,
                          networkProduct,
                          opportunityId,
                          isSecureSiteConnect: true
                        }
                      });
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Secure Site Connect
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBulkConfigOpen(true)}
                  disabled={selectedRows.length === 0}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Bulk Configure
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {networkType === 'MPLS' && mplsType === 'Hub & Spoke' && !hubFid && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-amber-900">
                    <span className="font-medium">Hub not assigned.</span> Please select one FID as Hub. The Hub must have the highest bandwidth among all FIDs.
                  </p>
                </div>
              </div>
            )}
            {networkType === 'MPLS' && mplsType === 'Hub & Spoke' && hubFid && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-green-900">
                    <span className="font-medium">Hub assigned:</span> {hubFid.location} ({hubFid.bandwidth})
                  </p>
                </div>
              </div>
            )}
            
            {/* QoS Configuration Section - MPLS only */}
            {networkType === 'MPLS' && (
              <Card className="mb-4 border-purple-200 bg-purple-50/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">QoS Configuration</CardTitle>
                  <CardDescription>Configure Quality of Service for all FIDs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Uniform/Distributed Selection */}
                  <div>
                    <Label className="text-sm text-gray-900 mb-3 block">Distribution Mode</Label>
                    <RadioGroup
                      value={qosDistributionMode}
                      onValueChange={(value: 'uniform' | 'distributed') => {
                        // Check if there's existing configuration
                        const hasUniformConfig = uniformQoS !== '';
                        const hasDistributedConfig = fidConfigurations.some(f => f.qosMode === 'split' && f.qosSplit && ((f.qosSplit.bronze || 0) + (f.qosSplit.gold || 0) + (f.qosSplit.diamond || 0)) > 0);
                        
                        if ((hasUniformConfig || hasDistributedConfig) && value !== qosDistributionMode) {
                          setPendingMode(value);
                          setShowModeChangeConfirm(true);
                        } else {
                          setQosDistributionMode(value);
                        }
                      }}
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          qosDistributionMode === 'uniform' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-white hover:border-purple-200'
                        }`}>
                          <RadioGroupItem value="uniform" id="qos-uniform" className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor="qos-uniform" className="cursor-pointer">
                              <span className="text-sm text-gray-900">Uniform QoS</span>
                              <p className="text-xs text-gray-500 mt-1">
                                Single QoS level applied to all FIDs
                              </p>
                            </Label>
                          </div>
                        </div>
                        
                        <div className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          qosDistributionMode === 'distributed' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-white hover:border-purple-200'
                        }`}>
                          <RadioGroupItem value="distributed" id="qos-distributed" className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor="qos-distributed" className="cursor-pointer">
                              <span className="text-sm text-gray-900">Distributed QoS</span>
                              <p className="text-xs text-gray-500 mt-1">
                                Configure QoS individually for FID groups
                              </p>
                            </Label>
                          </div>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Uniform QoS Configuration */}
                  {qosDistributionMode === 'uniform' && (
                    <div className="p-4 border border-purple-200 rounded-lg bg-white">
                      <Label htmlFor="uniform-qos" className="text-sm text-gray-900 mb-2 block">
                        QoS Level for All FIDs <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={uniformQoS}
                        onValueChange={(value: 'Bronze' | 'Gold' | 'Diamond') => {
                          setUniformQoS(value);
                          // Apply to all FIDs
                          setFidConfigurations(prev =>
                            prev.map(fid => ({
                              ...fid,
                              qosMode: 'single',
                              qosSingle: value
                            }))
                          );
                          toast.success(`Uniform QoS (${value}) applied to all FIDs`);
                        }}
                      >
                        <SelectTrigger id="uniform-qos" className="w-full max-w-xs">
                          <SelectValue placeholder="Select QoS level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bronze">Bronze</SelectItem>
                          <SelectItem value="Gold">Gold</SelectItem>
                          <SelectItem value="Diamond">Diamond</SelectItem>
                        </SelectContent>
                      </Select>
                      {uniformQoS && (
                        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-900">
                            {uniformQoS} QoS applied to all {fidConfigurations.length} FID(s)
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Distributed QoS Configuration */}
                  {qosDistributionMode === 'distributed' && (
                    <div className="p-4 border border-purple-200 rounded-lg bg-white space-y-3">
                      <div>
                        <Label className="text-sm text-gray-900 mb-2 block">QoS Split Unit</Label>
                        <RadioGroup
                          value={distributedQosUnit}
                          onValueChange={(value: 'mbps' | 'percent') => {
                            const configuredCount = fidConfigurations.filter(f => f.qosMode === 'split' && f.qosSplit && ((f.qosSplit.bronze || 0) + (f.qosSplit.gold || 0) + (f.qosSplit.diamond || 0)) > 0).length;
                            if (configuredCount > 0) {
                              toast.error('Please clear existing configurations before changing unit');
                              return;
                            }
                            setDistributedQosUnit(value);
                          }}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="mbps" id="dist-unit-mbps" />
                            <Label htmlFor="dist-unit-mbps" className="cursor-pointer text-sm">
                              Mbps <span className="text-xs text-gray-500">(Same bandwidth only)</span>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="percent" id="dist-unit-percent" />
                            <Label htmlFor="dist-unit-percent" className="cursor-pointer text-sm">
                              Percentage (%) <span className="text-xs text-gray-500">(Any FIDs)</span>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-900 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>Select FIDs from the table below, then click "Configure QoS" button that appears</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-700">
                            Configured: <span className="font-medium text-purple-600">
                              {fidConfigurations.filter(f => f.qosMode === 'split' && f.qosSplit && ((f.qosSplit.bronze || 0) + (f.qosSplit.gold || 0) + (f.qosSplit.diamond || 0)) > 0).length}
                            </span> / <span className="font-medium">{fidConfigurations.length}</span> FID(s)
                          </p>
                        </div>
                        {fidConfigurations.filter(f => f.qosMode === 'split' && f.qosSplit && ((f.qosSplit.bronze || 0) + (f.qosSplit.gold || 0) + (f.qosSplit.diamond || 0)) > 0).length > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (confirm('Are you sure you want to clear all QoS configurations?')) {
                                setFidConfigurations(prev =>
                                  prev.map(fid => ({
                                    ...fid,
                                    qosMode: undefined,
                                    qosSingle: '',
                                    qosSplit: { bronze: 0, gold: 0, diamond: 0 },
                                    qosSplitUnit: 'mbps'
                                  }))
                                );
                                setQosSelectedFIDs([]);
                                toast.success('All QoS configurations cleared');
                              }
                            }}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Clear All QoS
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedRows.length === fidConfigurations.length}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>FID</TableHead>
                      {isServiceChanges && <TableHead>Link ID</TableHead>}
                      {isServiceChanges && <TableHead>Change Type</TableHead>}
                      {networkType === 'MPLS' && mplsType === 'Hub & Spoke' && !isServiceChanges && (
                        <TableHead>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-1 cursor-help">
                                  Hub
                                  <AlertCircle className="w-3 h-3 text-gray-400" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">Select one FID as Hub. Hub must have the highest bandwidth.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableHead>
                      )}
                      <TableHead>Location</TableHead>
                      <TableHead>LM Type</TableHead>
                      <TableHead>Bandwidth</TableHead>
                      {isServiceChanges && <TableHead>Contract Period</TableHead>}
                      {isServiceChanges && <TableHead>Port Details</TableHead>}
                      <TableHead>VAS</TableHead>
                      <TableHead className="w-16">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fidConfigurations.map((fid) => (
                      <TableRow key={fid.fid}>
                        <TableCell>
                          <Checkbox
                            checked={selectedRows.includes(fid.fid)}
                            onCheckedChange={(checked) => handleRowSelection(fid.fid, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-blue-600">{fid.fid}</span>
                            {/* SSC Badge */}
                            {networkType === 'MPLS' && fid.isSecureSiteConnect && (
                              <Badge variant="secondary" className="h-5 px-1.5 text-xs bg-amber-100 text-amber-700 border-amber-200">
                                SSC
                              </Badge>
                            )}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  {isFIDConfigured(fid) ? (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <Clock className="w-4 h-4 text-orange-500" />
                                  )}
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">{isFIDConfigured(fid) ? 'Configured' : 'Yet to Configure'}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            {/* QoS Indicator for Distributed Mode */}
                            {networkType === 'MPLS' && qosDistributionMode === 'distributed' && fid.qosMode === 'split' && fid.qosSplit && ((fid.qosSplit.bronze || 0) + (fid.qosSplit.gold || 0) + (fid.qosSplit.diamond || 0)) > 0 && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Badge variant="secondary" className="h-5 px-1.5 text-xs bg-purple-100 text-purple-700 border-purple-200">
                                      Split
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">QoS: Split Distribution</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </TableCell>
                        {isServiceChanges && (
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-700">{fid.linkId}</span>
                              {fid.currentLinkId && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Info className="w-4 h-4 text-blue-500 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="max-w-xs">
                                      <div className="text-xs space-y-2">
                                        <p className="font-bold text-white text-sm border-b border-gray-600 pb-1.5 mb-2">Current Link Details</p>
                                        <div className="space-y-1.5">
                                          <p><span className="font-medium text-gray-300">Address:</span> <span className="text-white">{fid.currentAddress || 'N/A'}</span></p>
                                          <p><span className="font-medium text-gray-300">Bandwidth:</span> <span className="text-white">{fid.currentBandwidth || 'N/A'}</span></p>
                                          <p><span className="font-medium text-gray-300">LM Type:</span> <span className="text-white">{fid.currentConnectionType || 'N/A'}</span></p>
                                          <p><span className="font-medium text-gray-300">Plan:</span> <span className="text-white">{fid.currentPlan || 'N/A'}</span></p>
                                          {/* Show MPLS Type and Hub/Spoke role for MPLS MDAC */}
                                          {networkType === 'MPLS' && mplsType && (
                                            <>
                                              <p><span className="font-medium text-gray-300">MPLS Type:</span> <span className="text-white">{mplsType}</span></p>
                                              {mplsType === 'Hub & Spoke' && (
                                                <p><span className="font-medium text-gray-300">Link Role:</span> <span className="text-white">{fid.isHub ? 'Hub' : 'Spoke'}</span></p>
                                              )}
                                            </>
                                          )}
                                          {fid.currentVAS && fid.currentVAS.length > 0 && (
                                            <p><span className="font-medium text-gray-300">VAS:</span> <span className="text-white">{fid.currentVAS.join(', ')}</span></p>
                                          )}
                                          {(!fid.currentVAS || fid.currentVAS.length === 0) && (
                                            <p><span className="font-medium text-gray-300">VAS:</span> <span className="text-white">None</span></p>
                                          )}
                                          <p><span className="font-medium text-gray-300">Expires on:</span> <span className="text-white">{fid.currentLinkExpiry ? new Date(fid.currentLinkExpiry).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</span></p>
                                        </div>
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                          </TableCell>
                        )}
                        {isServiceChanges && (
                          <TableCell>
                            <Badge variant="secondary" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                              {fid.serviceChangeType}
                            </Badge>
                          </TableCell>
                        )}
                        {networkType === 'MPLS' && mplsType === 'Hub & Spoke' && !isServiceChanges && (
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center">
                                    <Checkbox
                                      checked={fid.isHub === true}
                                      onCheckedChange={(checked) => handleHubSelection(fid.fid, checked as boolean)}
                                      disabled={!canBeHub(fid) && !fid.isHub}
                                    />
                                  </div>
                                </TooltipTrigger>
                                {!canBeHub(fid) && !fid.isHub && (
                                  <TooltipContent>
                                    <p className="text-xs">Hub must have the highest bandwidth</p>
                                  </TooltipContent>
                                )}
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        )}
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                    <span className="text-sm text-gray-900 max-w-[200px] truncate">
                                      {fid.location}
                                    </span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <div className="space-y-1">
                                    <p className="font-medium">{fid.location}</p>
                                    <p className="text-xs">Latitude: 19.0760° N</p>
                                    <p className="text-xs">Longitude: 72.8777° E</p>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            {/* Show "No changes" for Address when it's NOT the changing field */}
                            {isServiceChanges && fid.serviceChangeType !== 'Address Change' && fid.serviceChangeType !== 'Add Secondary/Tertiary Link' && fid.currentAddress && fid.location === fid.currentAddress && (
                              <span className="text-xs text-gray-500 italic">No changes</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1">
                              {networkType === 'MPLS' && fid.isSecureSiteConnect ? (
                                <>
                                  <Select
                                    value={fid.connectionType}
                                    onValueChange={(value) => updateFIDField(fid.fid, 'connectionType', value as any)}
                                  >
                                    <SelectTrigger className="w-[140px]">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Broadband - Internet">Broadband - Internet</SelectItem>
                                      <SelectItem value="Broadband - MPLS">Broadband - MPLS</SelectItem>
                                      <SelectItem value="4G LTE">4G LTE</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  {/* 4G LTE Variant Selector */}
                                  {fid.connectionType === '4G LTE' && (
                                    <Select
                                      value={fid.lteLinkVariant || ''}
                                      onValueChange={(value) => updateFIDField(fid.fid, 'lteLinkVariant', value as any)}
                                    >
                                      <SelectTrigger className="w-[120px]">
                                        <SelectValue placeholder="Select variant" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="ATM Single">ATM Single</SelectItem>
                                        <SelectItem value="ATM Dual">ATM Dual</SelectItem>
                                        <SelectItem value="Branch Single">Branch Single</SelectItem>
                                        <SelectItem value="Branch Dual">Branch Dual</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  )}
                                </>
                              ) : (
                                <>
                                  <Badge variant="secondary">{fid.connectionType}</Badge>
                                  {(fid.connectionType === 'Other ISP - Wireless' || fid.connectionType === 'Other ISP - Fiber') && fid.serviceProvider && (
                                    <span className="text-xs text-gray-600">({fid.serviceProvider})</span>
                                  )}
                                </>
                              )}
                            </div>
                            {/* Show "No changes" for MDAC if LM Type hasn't changed */}
                            {/* Show "No changes" for LM Type when it's NOT the changing field */}
                            {isServiceChanges && fid.serviceChangeType !== 'LM Change' && fid.serviceChangeType !== 'Add Secondary/Tertiary Link' && fid.currentConnectionType && fid.connectionType === fid.currentConnectionType && (
                              <span className="text-xs text-gray-500 italic">No changes</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {/* Show static text if NOT Bandwidth Change and NOT Add Secondary/Tertiary Link and NOT New */}
                            {isServiceChanges && fid.serviceChangeType !== 'Bandwidth Change' && fid.serviceChangeType !== 'Add Secondary/Tertiary Link' ? (
                              <>
                                <span className="text-sm text-gray-900">{fid.bandwidth || fid.currentBandwidth}</span>
                                <span className="text-xs text-gray-500 italic">No changes</span>
                              </>
                            ) : (
                              <>
                                <Select
                                  value={fid.bandwidth || fid.currentBandwidth || ''}
                                  onValueChange={(value) => updateFIDField(fid.fid, 'bandwidth', value)}
                                >
                                  <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Select bandwidth" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {getAllowedBandwidthOptions(fid.bandwidth || fid.currentBandwidth || '', fid.serviceChangeType).map((bw) => (
                                      <SelectItem key={bw.label} value={bw.label}>
                                        {bw.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                {/* Show "No changes" for Bandwidth when it's NOT the changing field */}
                                {isServiceChanges && fid.serviceChangeType !== 'Bandwidth Change' && fid.serviceChangeType !== 'Add Secondary/Tertiary Link' && fid.currentBandwidth && fid.bandwidth === fid.currentBandwidth && (
                                  <span className="text-xs text-gray-500 italic">No changes</span>
                                )}
                              </>
                            )}
                          </div>
                        </TableCell>
                        {isServiceChanges && (
                          <TableCell>
                            {fid.serviceChangeType === 'Add Secondary/Tertiary Link' ? (
                              <Select
                                value={fid.contractPeriod || '3 years'}
                                onValueChange={(value) => updateFIDField(fid.fid, 'contractPeriod', value)}
                              >
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Select period" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1 year">1 year</SelectItem>
                                  <SelectItem value="2 years">2 years</SelectItem>
                                  <SelectItem value="3 years">3 years</SelectItem>
                                  <SelectItem value="4 years">4 years</SelectItem>
                                  <SelectItem value="5 years">5 years</SelectItem>
                                  {!isLinkExpiryWithin12Months(fid.currentLinkExpiry) && (
                                    <SelectItem value="align_with_primary">Align with Primary Link</SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                            ) : (
                              <span className="text-sm text-gray-500">—</span>
                            )}
                          </TableCell>
                        )}
                        {isServiceChanges && (
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="text-xs text-gray-700 cursor-help">
                                      <div className="flex flex-col">
                                        <span className="font-medium">{fid.portDetails?.portBandwidth || 'N/A'}</span>
                                        <span className="text-gray-500">{fid.portDetails?.handoffType || 'N/A'}</span>
                                      </div>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="left" className="max-w-xs">
                                    <div className="text-xs space-y-1.5">
                                      <p className="font-bold text-white text-sm border-b border-gray-600 pb-1.5 mb-2">Port Details</p>
                                      <p><span className="font-medium text-gray-300">Classification:</span> <span className="text-white">{fid.portDetails?.portClassification || 'N/A'}</span></p>
                                      <p><span className="font-medium text-gray-300">Hand off Type:</span> <span className="text-white">{fid.portDetails?.handoffType || 'N/A'}</span></p>
                                      <p><span className="font-medium text-gray-300">Port Bandwidth:</span> <span className="text-white">{fid.portDetails?.portBandwidth || 'N/A'}</span></p>
                                      <p><span className="font-medium text-gray-300">Bandwidth Type:</span> <span className="text-white">{fid.portDetails?.bandwidthType || 'N/A'}</span></p>
                                      {fid.portDetails?.burstOption && (
                                        <p><span className="font-medium text-gray-300">Burst Option:</span> <span className="text-white">{fid.portDetails.burstOption}</span></p>
                                      )}
                                      <p><span className="font-medium text-gray-300">Port Type:</span> <span className="text-white">{fid.portDetails?.portType || 'N/A'}</span></p>
                                      <p><span className="font-medium text-gray-300">IP Type:</span> <span className="text-white">{fid.portDetails?.ipType || 'N/A'}</span></p>
                                      <p><span className="font-medium text-gray-300">Sify DNS Cache:</span> <span className="text-white">{fid.portDetails?.sifyDnsCache ? 'Yes' : 'No'}</span></p>
                                      <p><span className="font-medium text-gray-300">Port Redundancy:</span> <span className="text-white">{fid.portDetails?.portRedundancy ? 'Yes' : 'No'}</span></p>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <button 
                                className="h-7 w-7 flex items-center justify-center hover:bg-blue-50 transition-colors rounded"
                                onClick={() => {
                                  setEditingPortFID(fid.fid);
                                  setPortDetailsDialogOpen(true);
                                }}
                              >
                                <Pencil className="w-3.5 h-3.5 text-gray-600" />
                              </button>
                            </div>
                          </TableCell>
                        )}
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <button 
                                className="h-7 w-7 flex items-center justify-center hover:bg-blue-50 transition-colors rounded"
                                onClick={() => {
                                  setEditingFID(fid.fid);
                                  setVasEditOpen(true);
                                }}
                              >
                                <Pencil className="w-3.5 h-3.5 text-gray-600" />
                              </button>
                              {fid.vas.length > 0 && (
                                <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                                  {fid.vas.length}
                                </Badge>
                              )}
                            </div>
                            {/* Show "No changes" for MDAC if VAS hasn't changed */}
                            {isServiceChanges && fid.serviceChangeType !== 'Add Secondary/Tertiary Link' && fid.currentVAS && 
                             JSON.stringify(fid.vas.sort()) === JSON.stringify((fid.currentVAS || []).sort()) && (
                              <span className="text-xs text-gray-500 italic">No changes</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => handleDeleteFID(fid.fid)}
                                  className="h-8 w-8 flex items-center justify-center hover:bg-red-50 transition-colors rounded"
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete FID</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Total Pricing Summary */}
            <div className="mt-6 flex justify-end">
              <Card className="w-96 border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <h3 className="text-sm text-gray-700 mb-3">Total Pricing</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total OTC:</span>
                      <div className="flex items-center">
                        <IndianRupee className="w-4 h-4 mr-1 text-gray-700" />
                        <span className="text-gray-900">{totalPricing.totalOtc.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total ARC:</span>
                      <div className="flex items-center">
                        <IndianRupee className="w-4 h-4 mr-1 text-gray-700" />
                        <span className="text-gray-900">{totalPricing.totalArc.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Floating QoS Configuration Button for Distributed Mode */}
        {networkType === 'MPLS' && qosDistributionMode === 'distributed' && selectedRows.length > 0 && (
          <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-4">
            <div className="bg-white rounded-lg shadow-2xl border-2 border-purple-500 p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-900">
                    {selectedRows.length} FID{selectedRows.length > 1 ? 's' : ''} selected
                  </Badge>
                  {distributedQosUnit === 'mbps' && (() => {
                    const selectedFIDs = fidConfigurations.filter(f => selectedRows.includes(f.fid));
                    const bandwidths = [...new Set(selectedFIDs.map(f => f.bandwidth))];
                    if (bandwidths.length > 1) {
                      return (
                        <span className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Mixed bandwidths
                        </span>
                      );
                    }
                    return <span className="text-xs text-gray-600">{bandwidths[0]}</span>;
                  })()}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedRows([])}
                  >
                    Clear Selection
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      // Validate bandwidth in Mbps mode
                      if (distributedQosUnit === 'mbps') {
                        const selectedFIDs = fidConfigurations.filter(f => selectedRows.includes(f.fid));
                        const bandwidths = [...new Set(selectedFIDs.map(f => f.bandwidth))];
                        if (bandwidths.length > 1) {
                          toast.error('In Mbps mode, all selected FIDs must have the same bandwidth');
                          return;
                        }
                      }
                      
                      // Set selected FIDs and open dialog
                      setQosSelectedFIDs(selectedRows);
                      
                      // Pre-populate if editing existing split configuration
                      const firstFid = fidConfigurations.find(f => f.fid === selectedRows[0]);
                      if (firstFid?.qosMode === 'split' && firstFid.qosSplit) {
                        setTempQosSplit(firstFid.qosSplit);
                      } else {
                        // Reset for new configuration
                        setTempQosSplit({ bronze: 0, gold: 0, diamond: 0 });
                      }
                      
                      setQosConfigDialogOpen(true);
                    }}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Configure QoS
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Configuration Modal */}
      <Dialog open={bulkConfigOpen} onOpenChange={setBulkConfigOpen}>
        <DialogContent className="max-w-[1200px] max-h-[90vh] p-0 flex flex-col bg-gray-50">
          <DialogHeader className="bg-white border-b border-gray-200 p-6 shrink-0">
            <DialogTitle className="text-gray-900">Bulk Configuration</DialogTitle>
            <DialogDescription className="text-gray-600 text-sm">
              Apply configuration settings to multiple selected FIDs at once
            </DialogDescription>
          </DialogHeader>

          {/* Content - scrollable */}
          <div className="flex-1 overflow-y-auto px-6 pt-6 space-y-6">
            {/* VAS Selection */}
            <div className="space-y-4">
              <h3 className="text-gray-900">VAS Selection</h3>
              
              {/* Additional IP Card */}
              {networkType === 'DIA' && (
              <Card>
                <CardHeader 
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setIpSectionOpen(!ipSectionOpen)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Additional IP</CardTitle>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${ipSectionOpen ? 'rotate-180' : ''}`} />
                  </div>
                </CardHeader>
                {ipSectionOpen && (
                  <CardContent className="px-6 py-4 pt-0 border-t">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm text-gray-700 mb-2 block">IP Type</Label>
                        <Select value={selectedIP} onValueChange={setSelectedIP}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select IP type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="/24">/24 IP Pool with 256 IPs</SelectItem>
                            <SelectItem value="/25">/25 IP Pool with 128 IPs</SelectItem>
                            <SelectItem value="/26">/26 IP Pool with 64 IPs</SelectItem>
                            <SelectItem value="/27">/27 IP Pool with 32 IPs</SelectItem>
                            <SelectItem value="/28">/28 IP Pool with 16 IPs</SelectItem>
                            <SelectItem value="/29">/29 IP Pool with 8 IPs</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
              )}

              {/* Devices and Managed Services Card */}
              <Card>
                <CardHeader 
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setDevicesSectionOpen(!devicesSectionOpen)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Devices and Managed Services</CardTitle>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${devicesSectionOpen ? 'rotate-180' : ''}`} />
                  </div>
                </CardHeader>
                {devicesSectionOpen && (
                  <CardContent className="p-4 pt-0 border-t space-y-4">
                    <p className="text-sm text-gray-600">
                      Select <span className="text-gray-900">Own Device</span> to add managed services to your existing devices, or <span className="text-gray-900">Buy Device</span> to purchase new devices with optional managed services.
                    </p>

                    {/* Device Selection Cards */}
                    <div className="space-y-3">
                      {/* Own Device Option */}
                      <div 
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          deviceOption === 'own' 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => {
                          if (deviceOption !== 'own') {
                            setSelectedDeviceTypes([]);
                            setDeviceCounts({});
                            setManagedServiceType(null);
                            setServiceVariant(null);
                            setEnableManagedService(false);
                          }
                          setDeviceOption('own');
                        }}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                            deviceOption === 'own' ? 'border-green-600 bg-green-600' : 'border-gray-300'
                          }`}>
                            {deviceOption === 'own' && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-gray-900">Own Device</p>
                              <Badge className="bg-green-100 text-green-700 border-green-200">Managed</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">Add Managed Services</p>
                          </div>
                        </div>
                      </div>

                      {/* Buy Device Option */}
                      <div 
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          deviceOption === 'buy' 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => {
                          if (deviceOption !== 'buy') {
                            setSelectedDeviceTypes([]);
                            setDeviceCounts({});
                            setManagedServiceType(null);
                            setServiceVariant(null);
                            setEnableManagedService(false);
                          }
                          setDeviceOption('buy');
                        }}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                            deviceOption === 'buy' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                          }`}>
                            {deviceOption === 'buy' && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-gray-900">Buy Device</p>
                              <Badge className="bg-blue-100 text-blue-700 border-blue-200">New Purchase</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">Purchase New Equipment</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Own Device Configuration */}
                    {deviceOption === 'own' && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm text-gray-900">Managed Services Configuration</h4>
                          <Badge className="bg-green-600 text-white">Own Device</Badge>
                        </div>

                        <div>
                          <Label className="text-gray-900 mb-3 block">Type of Device</Label>
                          <div className="flex flex-wrap gap-2">
                            {['Firewall', 'Router', 'Switch'].map((device) => (
                              <Button
                                key={device}
                                variant="outline"
                                size="sm"
                                className={selectedDeviceTypes.includes(device) ? 'bg-gray-800 text-white hover:bg-gray-800 hover:text-white' : ''}
                                onClick={() => {
                                  if (selectedDeviceTypes.includes(device)) {
                                    setSelectedDeviceTypes(selectedDeviceTypes.filter(d => d !== device));
                                    const newCounts = {...deviceCounts};
                                    delete newCounts[device];
                                    setDeviceCounts(newCounts);
                                    const newManagement = {...deviceManagement};
                                    delete newManagement[device];
                                    setDeviceManagement(newManagement);
                                  } else {
                                    setSelectedDeviceTypes([...selectedDeviceTypes, device]);
                                    setDeviceCounts({...deviceCounts, [device]: 1});
                                  }
                                }}
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                {device}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {selectedDeviceTypes.length > 0 && (
                          <div>
                            <Label className="text-gray-900 mb-3 block">Selected Devices</Label>
                            <div className="space-y-3">
                              {selectedDeviceTypes.map((device) => (
                                <div key={device} className="p-3 bg-white border border-gray-200 rounded-lg space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <span className="text-sm text-gray-900">{device}</span>
                                      <div className="flex items-center gap-2">
                                        <Label className="text-xs text-gray-600">Count:</Label>
                                        <Input
                                          type="number"
                                          min="1"
                                          value={deviceCounts[device] || 1}
                                          onChange={(e) => setDeviceCounts({...deviceCounts, [device]: parseInt(e.target.value) || 1})}
                                          className="w-16 h-7"
                                        />
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedDeviceTypes(selectedDeviceTypes.filter(d => d !== device));
                                        const newCounts = {...deviceCounts};
                                        delete newCounts[device];
                                        setDeviceCounts(newCounts);
                                        const newManagement = {...deviceManagement};
                                        delete newManagement[device];
                                        setDeviceManagement(newManagement);
                                      }}
                                    >
                                      <Trash2 className="w-4 h-4 text-red-600" />
                                    </Button>
                                  </div>
                                  <div className="pt-2 border-t border-gray-200">
                                    <Label className="text-xs text-gray-700 mb-2 block">Device Management</Label>
                                    <div className="flex flex-wrap gap-3">
                                      <div className="flex items-center space-x-2">
                                        <Checkbox 
                                          id={`bulk-config-${device}`}
                                          checked={deviceManagement[device]?.configuration || false}
                                          onCheckedChange={(checked) => {
                                            setDeviceManagement({
                                              ...deviceManagement,
                                              [device]: {
                                                ...deviceManagement[device],
                                                configuration: checked as boolean
                                              }
                                            });
                                          }}
                                        />
                                        <Label htmlFor={`bulk-config-${device}`} className="text-xs cursor-pointer text-gray-900">
                                          Configuration Management
                                        </Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Checkbox 
                                          id={`bulk-hardware-${device}`}
                                          checked={deviceManagement[device]?.hardware || false}
                                          onCheckedChange={(checked) => {
                                            setDeviceManagement({
                                              ...deviceManagement,
                                              [device]: {
                                                ...deviceManagement[device],
                                                hardware: checked as boolean
                                              }
                                            });
                                          }}
                                        />
                                        <Label htmlFor={`bulk-hardware-${device}`} className="text-xs cursor-pointer text-gray-900">
                                          Hardware Management
                                        </Label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Buy Device Configuration */}
                    {deviceOption === 'buy' && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm text-gray-900">Device Purchase Configuration</h4>
                          <Badge className="bg-blue-600 text-white">Buy New</Badge>
                        </div>

                        <div>
                          <Label className="text-gray-900 mb-3 block">Service Variant</Label>
                          <div className="space-y-2">
                            <div 
                              className={`p-3 border rounded-lg cursor-pointer ${
                                serviceVariant === 'bundled' ? 'border-gray-800 bg-white' : 'border-gray-200'
                              }`}
                              onClick={() => setServiceVariant('bundled')}
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                  serviceVariant === 'bundled' ? 'border-gray-800 bg-gray-800' : 'border-gray-300'
                                }`}>
                                  {serviceVariant === 'bundled' && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                                <span className="text-sm text-gray-900">Bundled Package</span>
                              </div>
                            </div>
                            
                            <div 
                              className={`p-3 border rounded-lg cursor-pointer ${
                                serviceVariant === 'specific' ? 'border-gray-800 bg-white' : 'border-gray-200'
                              }`}
                              onClick={() => setServiceVariant('specific')}
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                  serviceVariant === 'specific' ? 'border-gray-800 bg-gray-800' : 'border-gray-300'
                                }`}>
                                  {serviceVariant === 'specific' && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                                <span className="text-sm text-gray-900">Select Specific Model</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label className="text-gray-900 mb-3 block">Type of Device</Label>
                          <div className="flex flex-wrap gap-2">
                            {['Firewall', 'Router', 'Switch'].map((device) => (
                              <Button
                                key={device}
                                variant="outline"
                                size="sm"
                                className={selectedDeviceTypes.includes(device) ? 'bg-gray-700 text-white hover:bg-gray-700 hover:text-white' : ''}
                                onClick={() => {
                                  if (selectedDeviceTypes.includes(device)) {
                                    setSelectedDeviceTypes(selectedDeviceTypes.filter(d => d !== device));
                                    const newCounts = {...deviceCounts};
                                    delete newCounts[device];
                                    setDeviceCounts(newCounts);
                                    const newModelsByCount = {...deviceModelsByCount};
                                    delete newModelsByCount[device];
                                    setDeviceModelsByCount(newModelsByCount);
                                    const newManagedService = {...deviceManagedService};
                                    delete newManagedService[device];
                                    setDeviceManagedService(newManagedService);
                                  } else {
                                    setSelectedDeviceTypes([...selectedDeviceTypes, device]);
                                    setDeviceCounts({...deviceCounts, [device]: 1});
                                    setDeviceModelsByCount({...deviceModelsByCount, [device]: ['']});
                                  }
                                }}
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                {device}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {selectedDeviceTypes.length > 0 && (
                          <div>
                            <Label className="text-gray-900 mb-3 block">Selected Devices</Label>
                            <div className="space-y-3">
                              {selectedDeviceTypes.map((device) => {
                                const count = deviceCounts[device] || 1;
                                const models = deviceModelsByCount[device] || Array(count).fill('');
                                
                                return (
                                  <div key={device} className="p-3 bg-white border border-gray-200 rounded-lg space-y-3">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-900">{device}</span>
                                        <div className="flex items-center gap-2">
                                          <Label className="text-xs text-gray-600">Count:</Label>
                                          <Input
                                            type="number"
                                            min="1"
                                            value={count}
                                            onChange={(e) => {
                                              const newCount = parseInt(e.target.value) || 1;
                                              setDeviceCounts({...deviceCounts, [device]: newCount});
                                              // Adjust models array based on new count
                                              const currentModels = deviceModelsByCount[device] || [];
                                              const newModels = Array(newCount).fill('').map((_, idx) => currentModels[idx] || '');
                                              setDeviceModelsByCount({...deviceModelsByCount, [device]: newModels});
                                            }}
                                            className="w-16 h-7"
                                          />
                                        </div>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          setSelectedDeviceTypes(selectedDeviceTypes.filter(d => d !== device));
                                          const newCounts = {...deviceCounts};
                                          delete newCounts[device];
                                          setDeviceCounts(newCounts);
                                          const newModelsByCount = {...deviceModelsByCount};
                                          delete newModelsByCount[device];
                                          setDeviceModelsByCount(newModelsByCount);
                                          const newManagedService = {...deviceManagedService};
                                          delete newManagedService[device];
                                          setDeviceManagedService(newManagedService);
                                        }}
                                      >
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                      </Button>
                                    </div>
                                    {serviceVariant === 'specific' && (
                                      <div className="space-y-2">
                                        <Label className="text-xs text-gray-600 block">Models (Select for each device)</Label>
                                        {Array.from({ length: count }).map((_, idx) => (
                                          <div key={idx}>
                                            <Label className="text-xs text-gray-500 mb-1 block">Model {idx + 1}</Label>
                                            <Select
                                              value={models[idx] || ''}
                                              onValueChange={(value) => {
                                                const newModels = [...models];
                                                newModels[idx] = value;
                                                setDeviceModelsByCount({...deviceModelsByCount, [device]: newModels});
                                              }}
                                            >
                                              <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select model" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {deviceModelOptions[device as keyof typeof deviceModelOptions]?.map((model) => (
                                                  <SelectItem key={model.value} value={model.value}>
                                                    {model.label}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                    <div className="pt-2 border-t border-gray-200">
                                      <div className="flex items-center space-x-2">
                                        <Checkbox 
                                          id={`bulk-managed-${device}`}
                                          checked={deviceManagedService[device] || false}
                                          onCheckedChange={(checked) => {
                                            setDeviceManagedService({
                                              ...deviceManagedService,
                                              [device]: checked as boolean
                                            });
                                          }}
                                        />
                                        <Label htmlFor={`bulk-managed-${device}`} className="text-xs cursor-pointer text-gray-900">
                                          Enable Managed Service
                                        </Label>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>

              {/* DDoS Protection Card - Only for DIA */}
              {networkType === 'DIA' && (
              <Card>
                <CardHeader 
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setDdosSectionOpen(!ddosSectionOpen)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">DDoS Protection</CardTitle>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${ddosSectionOpen ? 'rotate-180' : ''}`} />
                  </div>
                </CardHeader>
                {ddosSectionOpen && (
                  <CardContent className="p-4 pt-0 border-t">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm text-gray-700 mb-2 block">Protection Level</Label>
                        <Select value={selectedDDoS} onValueChange={setSelectedDDoS}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select protection level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">Basic Protection - Up to 1 Gbps</SelectItem>
                            <SelectItem value="standard">Standard Protection - Up to 5 Gbps</SelectItem>
                            <SelectItem value="advanced">Advanced Protection - Up to 10 Gbps</SelectItem>
                            <SelectItem value="enterprise">Enterprise Protection - Up to 50 Gbps</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
              )}
            </div>
          </div>

          {/* Footer - fixed */}
          <DialogFooter className="shrink-0 border-t border-gray-200 bg-white p-6 flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={() => {
                setBulkConfigOpen(false);
                setBulkVAS([]);
                // Reset VAS selections
                setSelectedIP('');
                setDeviceOption(null);
                setSelectedDeviceTypes([]);
                setDeviceCounts({});
                setDeviceModels({});
                setEnableManagedService(false);
                setManagedServiceType(null);
                setServiceVariant(null);
                setSelectedDDoS('');
                // Reset QoS selections
                setBulkQosMode('single');
                setBulkQosSingle('');
                setBulkQosSplit({ bronze: 0, gold: 0, diamond: 0 });
                setBulkQosSplitUnit('mbps');
                // Reset collapsible states
                setIpSectionOpen(false);
                setDevicesSectionOpen(false);
                setDdosSectionOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleBulkConfiguration}
              className="bg-[#0e3346] hover:bg-[#0a2533]"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* VAS Edit Modal */}
      <Dialog open={vasEditOpen} onOpenChange={setVasEditOpen}>
        <DialogContent className="max-w-[800px] max-h-[90vh] p-0 flex flex-col bg-white overflow-hidden">
          <DialogHeader className="border-b pb-4 px-6 pt-6 shrink-0">
            <DialogTitle className="text-lg">Add VAS</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Configure value-added services for the selected FID
            </DialogDescription>
          </DialogHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3">
            {(() => {
              const currentEditingFID = fidConfigurations.find(f => f.fid === editingFID);
              const isSSC = currentEditingFID?.isSecureSiteConnect || false;
              
              return (
                <>
            {/* Additional IP Card - Only show for DIA and non-SSC */}
            {networkType === 'DIA' && !isSSC && (
            <Card className="border border-gray-200 shadow-none">
              <CardHeader 
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setIpSectionOpen(!ipSectionOpen)}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Additional IP</CardTitle>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${ipSectionOpen ? 'rotate-180' : ''}`} />
                </div>
              </CardHeader>
              {ipSectionOpen && (
                <CardContent className="px-6 py-4 pt-0 border-t">
                  <div className="space-y-4">
                    {/* LAN IP Section */}
                    <div className="p-4 border border-gray-200 rounded-lg space-y-3">
                      <h4 className="text-sm text-gray-900 font-medium">LAN IP</h4>
                      
                      <div>
                        <Label className="text-sm text-gray-700 mb-2 block">IP Owner</Label>
                        <Select value={lanIpOwner} onValueChange={(value: 'sify' | 'customer') => {
                          setLanIpOwner(value);
                          if (value === 'customer') {
                            setLanIpType('');
                            setLanIpv4Pool('');
                            setLanIpv6Pool('');
                          }
                        }}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select IP owner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sify">Sify</SelectItem>
                            <SelectItem value="customer">Customer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {lanIpOwner === 'sify' && (
                        <>
                          <div>
                            <Label className="text-sm text-gray-700 mb-2 block">IP Type</Label>
                            <Select value={lanIpType} onValueChange={(value: 'ipv4' | 'ipv6' | 'dual') => {
                              setLanIpType(value);
                              setLanIpv4Pool('');
                              setLanIpv6Pool('');
                            }}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select IP type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ipv4">IPv4</SelectItem>
                                <SelectItem value="ipv6">IPv6</SelectItem>
                                <SelectItem value="dual">Dual</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {(lanIpType === 'ipv4' || lanIpType === 'dual') && (
                            <div>
                              <Label className="text-sm text-gray-700 mb-2 block">LAN IPv4 Pool</Label>
                              <Select value={lanIpv4Pool} onValueChange={setLanIpv4Pool}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select IPv4 pool" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="/29">/29 IP Pool with 8 IPs</SelectItem>
                                  <SelectItem value="/28">/28 IP Pool with 16 IPs</SelectItem>
                                  <SelectItem value="/27">/27 IP Pool with 32 IPs</SelectItem>
                                  <SelectItem value="/26">/26 IP Pool with 64 IPs</SelectItem>
                                  <SelectItem value="/25">/25 IP Pool with 128 IPs</SelectItem>
                                  <SelectItem value="/24">/24 IP Pool with 256 IPs</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {(lanIpType === 'ipv6' || lanIpType === 'dual') && (
                            <div>
                              <Label className="text-sm text-gray-700 mb-2 block">LAN IPv6 Pool</Label>
                              <Select value={lanIpv6Pool} onValueChange={setLanIpv6Pool}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select IPv6 pool" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="standard">Standard: /126 IP Pool with 256 IPs</SelectItem>
                                  <SelectItem value="extended">Extended: /125 IP Pool with 256 IPs</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* WAN IP Section */}
                    <div className="p-4 border border-gray-200 rounded-lg space-y-3">
                      <h4 className="text-sm text-gray-900 font-medium">WAN IP</h4>
                      
                      <div>
                        <Label className="text-sm text-gray-700 mb-2 block">IP Owner</Label>
                        <Select value={wanIpOwner} onValueChange={(value: 'sify' | 'customer') => {
                          setWanIpOwner(value);
                          if (value === 'customer') {
                            setWanIpType('');
                            setWanIpv4Pool('');
                            setWanIpv6Pool('');
                          }
                        }}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select IP owner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sify">Sify</SelectItem>
                            <SelectItem value="customer">Customer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {wanIpOwner && (
                        <>
                          <div>
                            <Label className="text-sm text-gray-700 mb-2 block">IP Type</Label>
                            <Select value={wanIpType} onValueChange={(value: 'ipv4' | 'ipv6' | 'dual') => {
                              setWanIpType(value);
                              setWanIpv4Pool('');
                              setWanIpv6Pool('');
                            }}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select IP type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ipv4">IPv4</SelectItem>
                                <SelectItem value="ipv6">IPv6</SelectItem>
                                <SelectItem value="dual">Dual</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {(wanIpType === 'ipv4' || wanIpType === 'dual') && (
                            <div>
                              <Label className="text-sm text-gray-700 mb-2 block">WAN IPv4 Pool</Label>
                              <Select value={wanIpv4Pool} onValueChange={setWanIpv4Pool}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select IPv4 pool" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="standard">Standard</SelectItem>
                                  <SelectItem value="extended">Extended: /29</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {(wanIpType === 'ipv6' || wanIpType === 'dual') && (
                            <div>
                              <Label className="text-sm text-gray-700 mb-2 block">WAN IPv6 Pool</Label>
                              <Select value={wanIpv6Pool} onValueChange={setWanIpv6Pool}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select IPv6 pool" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="standard">Standard: /127</SelectItem>
                                  <SelectItem value="extended">Extended: /126</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
            )}

            {/* Devices and Managed Services Combined Card */}
            <Card className="border border-gray-200 shadow-none">
              <CardHeader 
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setDevicesSectionOpen(!devicesSectionOpen)}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Devices and Managed Services</CardTitle>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${devicesSectionOpen ? 'rotate-180' : ''}`} />
                </div>
              </CardHeader>
              {devicesSectionOpen && (
                <CardContent className="p-4 pt-0 border-t space-y-4">
                  <p className="text-sm text-gray-600">
                    Select <span className="text-gray-900">Own Device</span> to add managed services to your existing devices, or <span className="text-gray-900">Buy Device</span> to purchase new devices with optional managed services.
                  </p>

                  {/* Device Selection Cards */}
                  <div className="space-y-3">
                    {/* Own Device Option */}
                    <div 
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        deviceOption === 'own' 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        if (deviceOption !== 'own') {
                          setSelectedDeviceTypes([]);
                          setDeviceCounts({});
                          setManagedServiceType(null);
                          setServiceVariant(null);
                          setEnableManagedService(false);
                          setDeviceManagedService({});
                          setDeviceManagement({});
                          setDeviceModelsByCount({});
                        }
                        setDeviceOption('own');
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                          deviceOption === 'own' ? 'border-green-600 bg-green-600' : 'border-gray-300'
                        }`}>
                          {deviceOption === 'own' && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-gray-900">Own Device</p>
                            <Badge className="bg-green-100 text-green-700 border-green-200">Managed</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Add Managed Services</p>
                        </div>
                      </div>
                    </div>

                    {/* Buy Device Option */}
                    <div 
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        deviceOption === 'buy' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        if (deviceOption !== 'buy') {
                          setSelectedDeviceTypes([]);
                          setDeviceCounts({});
                          setManagedServiceType(null);
                          setServiceVariant(null);
                          setEnableManagedService(false);
                          setDeviceManagedService({});
                          setDeviceManagement({});
                          setDeviceModelsByCount({});
                        }
                        setDeviceOption('buy');
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                          deviceOption === 'buy' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                        }`}>
                          {deviceOption === 'buy' && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-gray-900">Buy Device</p>
                            <Badge className="bg-blue-100 text-blue-700 border-blue-200">New Purchase</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Purchase New Equipment</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Own Device Configuration */}
                  {deviceOption === 'own' && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm text-gray-900">Managed Services Configuration</h4>
                        <Badge className="bg-green-600 text-white">Own Device</Badge>
                      </div>

                      <div>
                        <Label className="text-gray-900 mb-3 block">Type of Device</Label>
                        <div className="flex flex-wrap gap-2">
                          {['Firewall', 'Router', 'Switch'].map((device) => (
                            <Button
                              key={device}
                              variant="outline"
                              size="sm"
                              className={selectedDeviceTypes.includes(device) ? 'bg-gray-800 text-white hover:bg-gray-800 hover:text-white' : ''}
                              onClick={() => {
                                if (selectedDeviceTypes.includes(device)) {
                                  setSelectedDeviceTypes(selectedDeviceTypes.filter(d => d !== device));
                                  const newCounts = {...deviceCounts};
                                  delete newCounts[device];
                                  setDeviceCounts(newCounts);
                                  const newManagement = {...deviceManagement};
                                  delete newManagement[device];
                                  setDeviceManagement(newManagement);
                                } else {
                                  setSelectedDeviceTypes([...selectedDeviceTypes, device]);
                                  setDeviceCounts({...deviceCounts, [device]: 1});
                                }
                              }}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              {device}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {selectedDeviceTypes.length > 0 && (
                        <div>
                          <Label className="text-gray-900 mb-3 block">Selected Devices</Label>
                          <div className="space-y-3">
                            {selectedDeviceTypes.map((device) => (
                              <div key={device} className="p-3 bg-white border border-gray-200 rounded-lg space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-900">{device}</span>
                                    <div className="flex items-center gap-2">
                                      <Label className="text-xs text-gray-600">Count:</Label>
                                      <Input
                                        type="number"
                                        min="1"
                                        value={deviceCounts[device] || 1}
                                        onChange={(e) => setDeviceCounts({...deviceCounts, [device]: parseInt(e.target.value) || 1})}
                                        className="w-16 h-7"
                                      />
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedDeviceTypes(selectedDeviceTypes.filter(d => d !== device));
                                      const newCounts = {...deviceCounts};
                                      delete newCounts[device];
                                      setDeviceCounts(newCounts);
                                      const newManagement = {...deviceManagement};
                                      delete newManagement[device];
                                      setDeviceManagement(newManagement);
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                  </Button>
                                </div>
                                <div className="pt-2 border-t border-gray-200">
                                  <Label className="text-xs text-gray-700 mb-2 block">Device Management</Label>
                                  <div className="flex flex-wrap gap-3">
                                    <div className="flex items-center space-x-2">
                                      <Checkbox 
                                        id={`sheet-config-${device}`}
                                        checked={deviceManagement[device]?.configuration || false}
                                        onCheckedChange={(checked) => {
                                          setDeviceManagement({
                                            ...deviceManagement,
                                            [device]: {
                                              ...deviceManagement[device],
                                              configuration: checked as boolean
                                            }
                                          });
                                        }}
                                      />
                                      <Label htmlFor={`sheet-config-${device}`} className="text-xs cursor-pointer text-gray-900">
                                        Configuration Management
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox 
                                        id={`sheet-hardware-${device}`}
                                        checked={deviceManagement[device]?.hardware || false}
                                        onCheckedChange={(checked) => {
                                          setDeviceManagement({
                                            ...deviceManagement,
                                            [device]: {
                                              ...deviceManagement[device],
                                              hardware: checked as boolean
                                            }
                                          });
                                        }}
                                      />
                                      <Label htmlFor={`sheet-hardware-${device}`} className="text-xs cursor-pointer text-gray-900">
                                        Hardware Management
                                      </Label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Buy Device Configuration */}
                  {deviceOption === 'buy' && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm text-gray-900">Device Purchase Configuration</h4>
                        <Badge className="bg-blue-600 text-white">Buy New</Badge>
                      </div>

                      <div>
                        <Label className="text-gray-900 mb-3 block">Service Variant</Label>
                        <div className="space-y-2">
                          <div 
                            className={`p-3 border rounded-lg cursor-pointer ${
                              serviceVariant === 'bundled' ? 'border-gray-800 bg-white' : 'border-gray-200'
                            }`}
                            onClick={() => setServiceVariant('bundled')}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                serviceVariant === 'bundled' ? 'border-gray-800 bg-gray-800' : 'border-gray-300'
                              }`}>
                                {serviceVariant === 'bundled' && <div className="w-2 h-2 bg-white rounded-full" />}
                              </div>
                              <span className="text-sm text-gray-900">Bundled Package</span>
                            </div>
                          </div>
                          
                          <div 
                            className={`p-3 border rounded-lg cursor-pointer ${
                              serviceVariant === 'specific' ? 'border-gray-800 bg-white' : 'border-gray-200'
                            }`}
                            onClick={() => setServiceVariant('specific')}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                serviceVariant === 'specific' ? 'border-gray-800 bg-gray-800' : 'border-gray-300'
                              }`}>
                                {serviceVariant === 'specific' && <div className="w-2 h-2 bg-white rounded-full" />}
                              </div>
                              <span className="text-sm text-gray-900">Select Specific Model</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-gray-900 mb-3 block">Type of Device</Label>
                        <div className="flex flex-wrap gap-2">
                          {['Firewall', 'Router', 'Switch'].map((device) => (
                            <Button
                              key={device}
                              variant="outline"
                              size="sm"
                              className={selectedDeviceTypes.includes(device) ? 'bg-gray-700 text-white hover:bg-gray-700 hover:text-white' : ''}
                              onClick={() => {
                                if (selectedDeviceTypes.includes(device)) {
                                  setSelectedDeviceTypes(selectedDeviceTypes.filter(d => d !== device));
                                  const newCounts = {...deviceCounts};
                                  delete newCounts[device];
                                  setDeviceCounts(newCounts);
                                  const newModelsByCount = {...deviceModelsByCount};
                                  delete newModelsByCount[device];
                                  setDeviceModelsByCount(newModelsByCount);
                                  const newManagedService = {...deviceManagedService};
                                  delete newManagedService[device];
                                  setDeviceManagedService(newManagedService);
                                } else {
                                  setSelectedDeviceTypes([...selectedDeviceTypes, device]);
                                  setDeviceCounts({...deviceCounts, [device]: 1});
                                  setDeviceModelsByCount({...deviceModelsByCount, [device]: ['']});
                                }
                              }}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              {device}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {selectedDeviceTypes.length > 0 && (
                        <div>
                          <Label className="text-gray-900 mb-3 block">Selected Devices</Label>
                          <div className="space-y-3">
                            {selectedDeviceTypes.map((device) => {
                              const count = deviceCounts[device] || 1;
                              const models = deviceModelsByCount[device] || Array(count).fill('');
                              
                              return (
                                <div key={device} className="p-3 bg-white border border-gray-200 rounded-lg space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <span className="text-sm text-gray-900">{device}</span>
                                      <div className="flex items-center gap-2">
                                        <Label className="text-xs text-gray-600">Count:</Label>
                                        <Input
                                          type="number"
                                          min="1"
                                          value={count}
                                          onChange={(e) => {
                                            const newCount = parseInt(e.target.value) || 1;
                                            setDeviceCounts({...deviceCounts, [device]: newCount});
                                            // Adjust models array based on new count
                                            const currentModels = deviceModelsByCount[device] || [];
                                            const newModels = Array(newCount).fill('').map((_, idx) => currentModels[idx] || '');
                                            setDeviceModelsByCount({...deviceModelsByCount, [device]: newModels});
                                          }}
                                          className="w-16 h-7"
                                        />
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedDeviceTypes(selectedDeviceTypes.filter(d => d !== device));
                                        const newCounts = {...deviceCounts};
                                        delete newCounts[device];
                                        setDeviceCounts(newCounts);
                                        const newModelsByCount = {...deviceModelsByCount};
                                        delete newModelsByCount[device];
                                        setDeviceModelsByCount(newModelsByCount);
                                        const newManagedService = {...deviceManagedService};
                                        delete newManagedService[device];
                                        setDeviceManagedService(newManagedService);
                                      }}
                                    >
                                      <Trash2 className="w-4 h-4 text-red-600" />
                                    </Button>
                                  </div>
                                  {serviceVariant === 'specific' && (
                                    <div className="space-y-2">
                                      <Label className="text-xs text-gray-600 block">Models (Select for each device)</Label>
                                      {Array.from({ length: count }).map((_, idx) => (
                                        <div key={idx}>
                                          <Label className="text-xs text-gray-500 mb-1 block">Model {idx + 1}</Label>
                                          <Select
                                            value={models[idx] || ''}
                                            onValueChange={(value) => {
                                              const newModels = [...models];
                                              newModels[idx] = value;
                                              setDeviceModelsByCount({...deviceModelsByCount, [device]: newModels});
                                            }}
                                          >
                                            <SelectTrigger className="w-full">
                                              <SelectValue placeholder="Select model" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {deviceModelOptions[device as keyof typeof deviceModelOptions]?.map((model) => (
                                                <SelectItem key={model.value} value={model.value}>
                                                  {model.label}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  <div className="pt-2 border-t border-gray-200">
                                    <div className="flex items-center space-x-2">
                                      <Checkbox 
                                        id={`sheet-managed-${device}`}
                                        checked={deviceManagedService[device] || false}
                                        onCheckedChange={(checked) => {
                                          setDeviceManagedService({
                                            ...deviceManagedService,
                                            [device]: checked as boolean
                                          });
                                        }}
                                      />
                                      <Label htmlFor={`sheet-managed-${device}`} className="text-xs cursor-pointer text-gray-900">
                                        Enable Managed Service
                                      </Label>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>

            {/* DDoS Protection Card - Only show for DIA */}
            {networkType === 'DIA' && (
            <Card className="border border-gray-200 shadow-none">
              <CardHeader 
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setDdosSectionOpen(!ddosSectionOpen)}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">DDoS Protection</CardTitle>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${ddosSectionOpen ? 'rotate-180' : ''}`} />
                </div>
              </CardHeader>
              {ddosSectionOpen && (
                <CardContent className="p-4 pt-0 border-t">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm text-gray-700 mb-2 block">Mitigation Capacity</Label>
                      <Select value={selectedDDoS} onValueChange={setSelectedDDoS}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select mitigation capacity" />
                        </SelectTrigger>
                        <SelectContent>
                          {(() => {
                            const currentFID = fidConfigurations.find(f => f.fid === editingFID);
                            const fidBandwidth = currentFID?.bandwidth || '';
                            
                            // Parse bandwidth to Mbps
                            let bandwidthMbps = 0;
                            const bandwidthMatch = fidBandwidth.match(/(\d+(?:\.\d+)?)\s*(Mbps|Gbps)/i);
                            if (bandwidthMatch) {
                              const value = parseFloat(bandwidthMatch[1]);
                              const unit = bandwidthMatch[2].toLowerCase();
                              bandwidthMbps = unit === 'gbps' ? value * 1000 : value;
                            }
                            
                            // Calculate minimum recommended (2x bandwidth in Gbps)
                            const minRecommendedGbps = (bandwidthMbps * 2) / 1000;
                            
                            const capacityOptions = [
                              0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 
                              20, 30, 40, 50, 60, 70, 80, 90, 100
                            ];
                            
                            return capacityOptions.map(capacity => {
                              const isRecommended = capacity >= minRecommendedGbps && capacity === capacityOptions.find(c => c >= minRecommendedGbps);
                              
                              return (
                                <SelectItem key={capacity} value={`${capacity}`}>
                                  <div className="flex items-center gap-2">
                                    <span>{capacity} Gbps</span>
                                    {isRecommended && (
                                      <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                                        Recommended
                                      </Badge>
                                    )}
                                  </div>
                                </SelectItem>
                              );
                            });
                          })()}
                        </SelectContent>
                      </Select>
                      {(() => {
                        const currentFID = fidConfigurations.find(f => f.fid === editingFID);
                        const fidBandwidth = currentFID?.bandwidth || '';
                        
                        if (fidBandwidth) {
                          let bandwidthMbps = 0;
                          const bandwidthMatch = fidBandwidth.match(/(\d+(?:\.\d+)?)\s*(Mbps|Gbps)/i);
                          if (bandwidthMatch) {
                            const value = parseFloat(bandwidthMatch[1]);
                            const unit = bandwidthMatch[2].toLowerCase();
                            bandwidthMbps = unit === 'gbps' ? value * 1000 : value;
                          }
                          
                          const minRecommendedGbps = (bandwidthMbps * 2) / 1000;
                          
                          return (
                            <p className="text-xs text-gray-600 mt-2">
                              FID Bandwidth: {fidBandwidth} | Minimum recommended: {minRecommendedGbps} Gbps (2x bandwidth)
                            </p>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
            )}
                </>
              );
            })()}
          </div>

          {/* Footer - fixed */}
          <DialogFooter className="shrink-0 border-t border-gray-200 bg-white p-6 flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={() => {
                setVasEditOpen(false);
                // Reset selections
                setSelectedIP('');
                setDeviceOption(null);
                setSelectedDeviceTypes([]);
                setDeviceCounts({});
                setDeviceModels({});
                setDeviceModelsByCount({});
                setEnableManagedService(false);
                setDeviceManagedService({});
                setDeviceManagement({});
                setManagedServiceType(null);
                setServiceVariant(null);
                setSelectedDDoS('');
                // Reset IP states
                setLanIpOwner('');
                setLanIpType('');
                setLanIpv4Pool('');
                setLanIpv6Pool('');
                setWanIpOwner('');
                setWanIpType('');
                setWanIpv4Pool('');
                setWanIpv6Pool('');
                // Reset collapsible states
                setIpSectionOpen(false);
                setDevicesSectionOpen(false);
                setDdosSectionOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                // Collect VAS selections and update FID
                if (editingFID) {
                  const updatedVAS: string[] = [];
                  
                  // Collect LAN IP configuration
                  if (lanIpOwner) {
                    if (lanIpOwner === 'customer') {
                      updatedVAS.push('LAN IP: Customer Owned');
                    } else if (lanIpOwner === 'sify' && lanIpType) {
                      const ipDetails = [];
                      if (lanIpType === 'ipv4' && lanIpv4Pool) {
                        ipDetails.push(`IPv4 ${lanIpv4Pool}`);
                      } else if (lanIpType === 'ipv6' && lanIpv6Pool) {
                        ipDetails.push(`IPv6 ${lanIpv6Pool}`);
                      } else if (lanIpType === 'dual' && (lanIpv4Pool || lanIpv6Pool)) {
                        if (lanIpv4Pool) ipDetails.push(`IPv4 ${lanIpv4Pool}`);
                        if (lanIpv6Pool) ipDetails.push(`IPv6 ${lanIpv6Pool}`);
                      }
                      if (ipDetails.length > 0) {
                        updatedVAS.push(`LAN IP: Sify - ${ipDetails.join(', ')}`);
                      }
                    }
                  }
                  
                  // Collect WAN IP configuration
                  if (wanIpOwner && wanIpType) {
                    const ipDetails = [];
                    if (wanIpType === 'ipv4' && wanIpv4Pool) {
                      ipDetails.push(`IPv4 ${wanIpv4Pool}`);
                    } else if (wanIpType === 'ipv6' && wanIpv6Pool) {
                      ipDetails.push(`IPv6 ${wanIpv6Pool}`);
                    } else if (wanIpType === 'dual' && (wanIpv4Pool || wanIpv6Pool)) {
                      if (wanIpv4Pool) ipDetails.push(`IPv4 ${wanIpv4Pool}`);
                      if (wanIpv6Pool) ipDetails.push(`IPv6 ${wanIpv6Pool}`);
                    }
                    if (ipDetails.length > 0) {
                      const owner = wanIpOwner === 'sify' ? 'Sify' : 'Customer';
                      updatedVAS.push(`WAN IP: ${owner} - ${ipDetails.join(', ')}`);
                    }
                  }
                  
                  if (deviceOption === 'own' && selectedDeviceTypes.length > 0) {
                    selectedDeviceTypes.forEach(device => {
                      const count = deviceCounts[device] || 1;
                      const management = deviceManagement[device];
                      if (management?.configuration || management?.hardware) {
                        const managementTypes = [];
                        if (management.configuration) managementTypes.push('Config');
                        if (management.hardware) managementTypes.push('Hardware');
                        updatedVAS.push(`Managed Services (Own Device) - ${device} (${count}) - ${managementTypes.join(' + ')}`);
                      }
                    });
                  }
                  
                  if (deviceOption === 'buy' && selectedDeviceTypes.length > 0 && serviceVariant) {
                    const deviceDetails = selectedDeviceTypes.map(d => {
                      const count = deviceCounts[d] || 1;
                      const managedSuffix = deviceManagedService[d] ? ' + Managed' : '';
                      if (serviceVariant === 'specific') {
                        const models = deviceModelsByCount[d] || [];
                        const modelStr = models.filter(m => m).length > 0 
                          ? ` [${models.map((m, i) => m || `Model ${i + 1}`).join(', ')}]` 
                          : '';
                        return `${d}${modelStr} (${count})${managedSuffix}`;
                      }
                      return `${d} (${count})${managedSuffix}`;
                    }).join(', ');
                    const variantType = serviceVariant === 'bundled' ? 'Bundled Package' : 'Specific Model';
                    updatedVAS.push(`Device Purchase - ${deviceDetails} - ${variantType}`);
                  }
                  
                  if (selectedDDoS) {
                    updatedVAS.push(`DDoS: ${selectedDDoS} Gbps`);
                  }
                  
                  // Update the FID configuration
                  setFidConfigurations(prev => 
                    prev.map(fid => 
                      fid.fid === editingFID 
                        ? { ...fid, vas: updatedVAS, isConfigured: updatedVAS.length > 0 || fid.plan !== '' }
                        : fid
                    )
                  );
                }
                
                toast.success('VAS configuration saved');
                setVasEditOpen(false);
                
                // Reset selections
                setSelectedIP('');
                setDeviceOption(null);
                setSelectedDeviceTypes([]);
                setDeviceCounts({});
                setDeviceModels({});
                setDeviceModelsByCount({});
                setEnableManagedService(false);
                setDeviceManagedService({});
                setDeviceManagement({});
                setManagedServiceType(null);
                setServiceVariant(null);
                setSelectedDDoS('');
                // Reset IP states
                setLanIpOwner('');
                setLanIpType('');
                setLanIpv4Pool('');
                setLanIpv6Pool('');
                setWanIpOwner('');
                setWanIpType('');
                setWanIpv4Pool('');
                setWanIpv6Pool('');
                // Reset collapsible states
                setIpSectionOpen(false);
                setDevicesSectionOpen(false);
                setDdosSectionOpen(false);
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QoS Configuration Sheet */}
      <Sheet open={qosEditOpen} onOpenChange={setQosEditOpen}>
        <SheetContent className="w-[500px] sm:max-w-[500px]">
          <SheetHeader>
            <SheetTitle>Configure QoS</SheetTitle>
            <SheetDescription>
              {editingQosFID && `Configure Quality of Service for ${editingQosFID}`}
            </SheetDescription>
          </SheetHeader>
          
          {editingQosFID && (() => {
            const currentFID = fidConfigurations.find(f => f.fid === editingQosFID);
            if (!currentFID) return null;
            
            const bandwidthValue = currentFID.currentBandwidthValue;
            const qosMode = currentFID.qosMode || 'single';
            const qosSingle = currentFID.qosSingle || '';
            const qosSplit = currentFID.qosSplit || { bronze: 0, gold: 0, diamond: 0 };
            const qosSplitUnit = currentFID.qosSplitUnit || 'mbps';
            
            const calculateMbps = (percent: number) => Math.round((percent / 100) * bandwidthValue);
            const calculatePercent = (mbps: number) => Math.round((mbps / bandwidthValue) * 100);
            
            // Ensure values are always numbers (never undefined)
            const bronzeMbps = qosSplit.bronze || 0;
            const goldMbps = qosSplit.gold || 0;
            const diamondMbps = qosSplit.diamond || 0;
            
            const bronzeValue = qosSplitUnit === 'mbps' ? bronzeMbps : calculatePercent(bronzeMbps);
            const goldValue = qosSplitUnit === 'mbps' ? goldMbps : calculatePercent(goldMbps);
            const diamondValue = qosSplitUnit === 'mbps' ? diamondMbps : calculatePercent(diamondMbps);
            
            const total = qosSplitUnit === 'mbps' 
              ? bronzeMbps + goldMbps + diamondMbps
              : calculateMbps(bronzeValue) + calculateMbps(goldValue) + calculateMbps(diamondValue);
            
            const isValidSplit = qosSplitUnit === 'mbps' 
              ? total === bandwidthValue
              : (bronzeValue + goldValue + diamondValue) === 100;
            
            return (
              <div className="mt-6 px-6 space-y-6">
                {/* QoS Mode Selection */}
                <div>
                  <Label className="text-sm text-gray-900 mb-3 block">QoS Configuration Mode</Label>
                  <RadioGroup
                    value={qosMode}
                    onValueChange={(value: 'single' | 'split') => {
                      setFidConfigurations(prev =>
                        prev.map(fid =>
                          fid.fid === editingQosFID
                            ? { ...fid, qosMode: value }
                            : fid
                        )
                      );
                    }}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="single" id="qos-single" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="qos-single" className="cursor-pointer">
                            <span className="text-sm font-medium text-gray-900">Uniform QoS</span>
                            <p className="text-xs text-gray-500 mt-1">
                              Apply a single QoS level to the entire bandwidth
                            </p>
                          </Label>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="split" id="qos-split" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="qos-split" className="cursor-pointer">
                            <span className="text-sm font-medium text-gray-900">Distributed QoS</span>
                            <p className="text-xs text-gray-500 mt-1">
                              Distribute bandwidth across multiple QoS tiers
                            </p>
                          </Label>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Single QoS Selection */}
                {qosMode === 'single' && (
                  <div>
                    <Label htmlFor="qos-level" className="text-sm text-gray-900 mb-2 block">
                      QoS Level <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={qosSingle}
                      onValueChange={(value: 'Bronze' | 'Gold' | 'Diamond') => {
                        setFidConfigurations(prev =>
                          prev.map(fid =>
                            fid.fid === editingQosFID
                              ? { ...fid, qosSingle: value }
                              : fid
                          )
                        );
                      }}
                    >
                      <SelectTrigger id="qos-level">
                        <SelectValue placeholder="Select QoS level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bronze">Bronze</SelectItem>
                        <SelectItem value="Gold">Gold</SelectItem>
                        <SelectItem value="Diamond">Diamond</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Split QoS Configuration */}
                {qosMode === 'split' && (
                  <div className="space-y-4">
                    {/* Unit Toggle */}
                    <div>
                      <Label className="text-sm text-gray-900 mb-2 block">Split Unit</Label>
                      <RadioGroup
                        value={qosSplitUnit}
                        onValueChange={(value: 'mbps' | 'percent') => {
                          setFidConfigurations(prev =>
                            prev.map(fid =>
                              fid.fid === editingQosFID
                                ? { ...fid, qosSplitUnit: value }
                                : fid
                            )
                          );
                        }}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mbps" id="unit-mbps" />
                          <Label htmlFor="unit-mbps" className="cursor-pointer text-sm">Mbps</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="percent" id="unit-percent" />
                          <Label htmlFor="unit-percent" className="cursor-pointer text-sm">Percentage (%)</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Bandwidth Info */}
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-900">
                        <span className="font-medium">Total Bandwidth:</span> {bandwidthValue} Mbps
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        Split must equal {qosSplitUnit === 'mbps' ? `${bandwidthValue} Mbps` : '100%'}
                      </p>
                    </div>

                    {/* QoS Inputs */}
                    <div className="space-y-3">
                      {/* Bronze */}
                      <div>
                        <Label htmlFor="bronze-split" className="text-sm text-gray-900 mb-2 block">
                          Bronze {qosSplitUnit === 'percent' 
                            ? `(${calculateMbps(bronzeValue)} Mbps)` 
                            : bronzeMbps > 0 ? `(${calculatePercent(bronzeMbps)}%)` : ''
                          }
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="bronze-split"
                            type="number"
                            min="0"
                            max={qosSplitUnit === 'mbps' ? bandwidthValue : 100}
                            value={bronzeValue}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 0;
                              setFidConfigurations(prev =>
                                prev.map(fid => {
                                  if (fid.fid === editingQosFID) {
                                    const newSplit = { ...(fid.qosSplit || { bronze: 0, gold: 0, diamond: 0 }) };
                                    if (qosSplitUnit === 'mbps') {
                                      newSplit.bronze = value;
                                    } else {
                                      newSplit.bronze = calculateMbps(value);
                                    }
                                    return { ...fid, qosSplit: newSplit };
                                  }
                                  return fid;
                                })
                              );
                            }}
                            className="flex-1"
                          />
                          <span className="flex items-center px-3 border rounded bg-gray-50 text-sm text-gray-600">
                            {qosSplitUnit === 'mbps' ? 'Mbps' : '%'}
                          </span>
                        </div>
                      </div>

                      {/* Gold */}
                      <div>
                        <Label htmlFor="gold-split" className="text-sm text-gray-900 mb-2 block">
                          Gold {qosSplitUnit === 'percent' 
                            ? `(${calculateMbps(goldValue)} Mbps)` 
                            : goldMbps > 0 ? `(${calculatePercent(goldMbps)}%)` : ''
                          }
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="gold-split"
                            type="number"
                            min="0"
                            max={qosSplitUnit === 'mbps' ? bandwidthValue : 100}
                            value={goldValue}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 0;
                              setFidConfigurations(prev =>
                                prev.map(fid => {
                                  if (fid.fid === editingQosFID) {
                                    const newSplit = { ...(fid.qosSplit || { bronze: 0, gold: 0, diamond: 0 }) };
                                    if (qosSplitUnit === 'mbps') {
                                      newSplit.gold = value;
                                    } else {
                                      newSplit.gold = calculateMbps(value);
                                    }
                                    return { ...fid, qosSplit: newSplit };
                                  }
                                  return fid;
                                })
                              );
                            }}
                            className="flex-1"
                          />
                          <span className="flex items-center px-3 border rounded bg-gray-50 text-sm text-gray-600">
                            {qosSplitUnit === 'mbps' ? 'Mbps' : '%'}
                          </span>
                        </div>
                      </div>

                      {/* Diamond */}
                      <div>
                        <Label htmlFor="diamond-split" className="text-sm text-gray-900 mb-2 block">
                          Diamond {qosSplitUnit === 'percent' 
                            ? `(${calculateMbps(diamondValue)} Mbps)` 
                            : diamondMbps > 0 ? `(${calculatePercent(diamondMbps)}%)` : ''
                          }
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="diamond-split"
                            type="number"
                            min="0"
                            max={qosSplitUnit === 'mbps' ? bandwidthValue : 100}
                            value={diamondValue}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 0;
                              setFidConfigurations(prev =>
                                prev.map(fid => {
                                  if (fid.fid === editingQosFID) {
                                    const newSplit = { ...(fid.qosSplit || { bronze: 0, gold: 0, diamond: 0 }) };
                                    if (qosSplitUnit === 'mbps') {
                                      newSplit.diamond = value;
                                    } else {
                                      newSplit.diamond = calculateMbps(value);
                                    }
                                    return { ...fid, qosSplit: newSplit };
                                  }
                                  return fid;
                                })
                              );
                            }}
                            className="flex-1"
                          />
                          <span className="flex items-center px-3 border rounded bg-gray-50 text-sm text-gray-600">
                            {qosSplitUnit === 'mbps' ? 'Mbps' : '%'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Validation */}
                    <div className={`p-3 border rounded-lg ${isValidSplit ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <div className="flex items-start gap-2">
                        {isValidSplit ? (
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className={`text-sm ${isValidSplit ? 'text-green-900' : 'text-red-900'}`}>
                            Total: {qosSplitUnit === 'mbps' 
                              ? `${total} / ${bandwidthValue} Mbps`
                              : `${bronzeValue + goldValue + diamondValue} / 100%`
                            }
                          </p>
                          {!isValidSplit && (
                            <p className="text-xs text-red-700 mt-1">
                              {qosSplitUnit === 'mbps' 
                                ? `Please distribute exactly ${bandwidthValue} Mbps across all QoS levels`
                                : 'Percentages must add up to exactly 100%'
                              }
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="flex justify-end gap-2 pt-4 pb-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setQosEditOpen(false);
                      setEditingQosFID(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      if (qosMode === 'split' && !isValidSplit) {
                        toast.error('Please ensure QoS split totals match the bandwidth');
                        return;
                      }
                      if (qosMode === 'single' && !qosSingle) {
                        toast.error('Please select a QoS level');
                        return;
                      }
                      
                      // Save QoS configuration
                      const currentFID = fidConfigurations.find(f => f.fid === editingQosFID);
                      
                      toast.success('QoS configuration saved');
                      setQosEditOpen(false);
                      setEditingQosFID(null);
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Save QoS
                  </Button>
                </div>
              </div>
            );
          })()}
        </SheetContent>
      </Sheet>

      {/* Mode Change Confirmation Dialog */}
      <AlertDialog open={showModeChangeConfirm} onOpenChange={setShowModeChangeConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Switch QoS Distribution Mode?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingMode === 'uniform' && (
                <>
                  Switching to Uniform mode will clear all individual FID configurations and apply a single QoS level to all FIDs.
                </>
              )}
              {pendingMode === 'distributed' && (
                <>
                  Switching to Distributed mode will clear the uniform QoS and allow you to configure each FID individually or in groups.
                </>
              )}
              <br /><br />
              Do you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setPendingMode(null);
              setShowModeChangeConfirm(false);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingMode) {
                  // Clear all configurations
                  setUniformQoS('');
                  setFidConfigurations(prev =>
                    prev.map(fid => ({
                      ...fid,
                      qosMode: undefined,
                      qosSingle: '',
                      qosSplit: { bronze: 0, gold: 0, diamond: 0 },
                      qosSplitUnit: 'mbps'
                    }))
                  );
                  setQosDistributionMode(pendingMode);
                  toast.success(`Switched to ${pendingMode} mode`);
                }
                setPendingMode(null);
                setShowModeChangeConfirm(false);
              }}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Switch Mode
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* QoS Configuration Dialog for Distributed Mode */}
      <Dialog open={qosConfigDialogOpen} onOpenChange={setQosConfigDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configure QoS for Selected FIDs</DialogTitle>
            <DialogDescription>
              Configure Quality of Service for {qosSelectedFIDs.length} selected FID(s)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Show Selected FIDs */}
            <div className="p-3 bg-gray-50 border rounded-lg">
              <Label className="text-sm text-gray-700 mb-2 block">Selected FIDs:</Label>
              <div className="flex flex-wrap gap-2">
                {qosSelectedFIDs.map(fidId => {
                  const fid = fidConfigurations.find(f => f.fid === fidId);
                  return (
                    <Badge key={fidId} variant="outline" className="text-xs">
                      {fidId} {fid && `(${fid.bandwidth})`}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Split QoS Configuration */}
            {(() => {
              // For split mode, use first selected FID's bandwidth for reference
              const firstFid = fidConfigurations.find(f => f.fid === qosSelectedFIDs[0]);
              if (!firstFid) return null;
              
              const bandwidthValue = firstFid.currentBandwidthValue;
              const splitUnit = distributedQosUnit;
              
              const calculateMbps = (percent: number) => Math.round((percent / 100) * bandwidthValue);
              const calculatePercent = (mbps: number) => Math.round((mbps / bandwidthValue) * 100);
              
              const bronzeMbps = tempQosSplit.bronze || 0;
              const goldMbps = tempQosSplit.gold || 0;
              const diamondMbps = tempQosSplit.diamond || 0;
              
              const bronzeValue = splitUnit === 'mbps' ? bronzeMbps : calculatePercent(bronzeMbps);
              const goldValue = splitUnit === 'mbps' ? goldMbps : calculatePercent(goldMbps);
              const diamondValue = splitUnit === 'mbps' ? diamondMbps : calculatePercent(diamondMbps);
              
              const total = splitUnit === 'mbps' 
                ? bronzeMbps + goldMbps + diamondMbps
                : calculateMbps(bronzeValue) + calculateMbps(goldValue) + calculateMbps(diamondValue);
              
              const isValidSplit = splitUnit === 'mbps' 
                ? total === bandwidthValue
                : (bronzeValue + goldValue + diamondValue) === 100;
              
              return (
                <div className="space-y-4">
                  {/* Bandwidth Info */}
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">
                      {splitUnit === 'mbps' ? (
                        <>
                          <span>Reference Bandwidth:</span> {bandwidthValue} Mbps (from {firstFid.fid})
                        </>
                      ) : (
                        <span>Distribution Mode: Percentage-based (applies to each FID's bandwidth)</span>
                      )}
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      Split must equal {splitUnit === 'mbps' ? `${bandwidthValue} Mbps` : '100%'}
                    </p>
                  </div>

                  {/* QoS Tier Inputs */}
                  <div className="space-y-3">
                    {/* Bronze */}
                    <div>
                      <Label className="text-sm text-gray-900 mb-2 block">
                        Bronze {splitUnit === 'percent' && bronzeValue > 0 ? `(${bronzeValue}%)` : splitUnit === 'mbps' && bronzeMbps > 0 ? `(${calculatePercent(bronzeMbps)}%)` : ''}
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="0"
                          max={splitUnit === 'mbps' ? bandwidthValue : 100}
                          value={bronzeValue}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            const newSplit = { ...tempQosSplit };
                            newSplit.bronze = splitUnit === 'mbps' ? value : calculateMbps(value);
                            setTempQosSplit(newSplit);
                          }}
                          className="flex-1"
                        />
                        <span className="flex items-center px-3 border rounded bg-gray-50 text-sm text-gray-600">
                          {splitUnit === 'mbps' ? 'Mbps' : '%'}
                        </span>
                      </div>
                    </div>

                    {/* Gold */}
                    <div>
                      <Label className="text-sm text-gray-900 mb-2 block">
                        Gold {splitUnit === 'percent' && goldValue > 0 ? `(${goldValue}%)` : splitUnit === 'mbps' && goldMbps > 0 ? `(${calculatePercent(goldMbps)}%)` : ''}
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="0"
                          max={splitUnit === 'mbps' ? bandwidthValue : 100}
                          value={goldValue}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            const newSplit = { ...tempQosSplit };
                            newSplit.gold = splitUnit === 'mbps' ? value : calculateMbps(value);
                            setTempQosSplit(newSplit);
                          }}
                          className="flex-1"
                        />
                        <span className="flex items-center px-3 border rounded bg-gray-50 text-sm text-gray-600">
                          {splitUnit === 'mbps' ? 'Mbps' : '%'}
                        </span>
                      </div>
                    </div>

                    {/* Diamond */}
                    <div>
                      <Label className="text-sm text-gray-900 mb-2 block">
                        Diamond {splitUnit === 'percent' && diamondValue > 0 ? `(${diamondValue}%)` : splitUnit === 'mbps' && diamondMbps > 0 ? `(${calculatePercent(diamondMbps)}%)` : ''}
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="0"
                          max={splitUnit === 'mbps' ? bandwidthValue : 100}
                          value={diamondValue}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            const newSplit = { ...tempQosSplit };
                            newSplit.diamond = splitUnit === 'mbps' ? value : calculateMbps(value);
                            setTempQosSplit(newSplit);
                          }}
                          className="flex-1"
                        />
                        <span className="flex items-center px-3 border rounded bg-gray-50 text-sm text-gray-600">
                          {splitUnit === 'mbps' ? 'Mbps' : '%'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Validation */}
                  <div className={`p-3 border rounded-lg ${isValidSplit ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-start gap-2">
                      {isValidSplit ? (
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className={`text-sm ${isValidSplit ? 'text-green-900' : 'text-red-900'}`}>
                          Total: {splitUnit === 'mbps' 
                            ? `${total} / ${bandwidthValue} Mbps`
                            : `${bronzeValue + goldValue + diamondValue} / 100%`
                          }
                        </p>
                        {!isValidSplit && (
                          <p className="text-xs text-red-700 mt-1">
                            {splitUnit === 'mbps' 
                              ? `Please distribute exactly ${bandwidthValue} Mbps`
                              : 'Percentages must add up to 100%'
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setQosConfigDialogOpen(false);
                setQosSelectedFIDs([]);
                setTempQosSplit({ bronze: 0, gold: 0, diamond: 0 });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Validation for split QoS
                const firstFid = fidConfigurations.find(f => f.fid === qosSelectedFIDs[0]);
                if (firstFid) {
                  const bandwidthValue = firstFid.currentBandwidthValue;
                  const total = tempQosSplit.bronze + tempQosSplit.gold + tempQosSplit.diamond;
                  
                  if (distributedQosUnit === 'mbps') {
                    if (total !== bandwidthValue) {
                      toast.error(`QoS split must equal ${bandwidthValue} Mbps`);
                      return;
                    }
                  } else {
                    const calculatePercent = (mbps: number) => Math.round((mbps / bandwidthValue) * 100);
                    const totalPercent = calculatePercent(tempQosSplit.bronze) + calculatePercent(tempQosSplit.gold) + calculatePercent(tempQosSplit.diamond);
                    if (totalPercent !== 100) {
                      toast.error('QoS split must equal 100%');
                      return;
                    }
                  }
                }
                
                // Apply split configuration to selected FIDs
                setFidConfigurations(prev =>
                  prev.map(fid => {
                    if (qosSelectedFIDs.includes(fid.fid)) {
                      return {
                        ...fid,
                        qosMode: 'split',
                        qosSingle: '',
                        qosSplit: tempQosSplit,
                        qosSplitUnit: distributedQosUnit
                      };
                    }
                    return fid;
                  })
                );
                
                toast.success(`QoS configured for ${qosSelectedFIDs.length} FID(s)`);
                setQosConfigDialogOpen(false);
                setQosSelectedFIDs([]);
                setSelectedRows([]); // Clear table selection
                setTempQosSplit({ bronze: 0, gold: 0, diamond: 0 });
              }}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Apply Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MDAC Port Details Dialog */}
      <Dialog open={portDetailsDialogOpen} onOpenChange={setPortDetailsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Port Details - {editingPortFID}</DialogTitle>
            <DialogDescription>
              Configure port details for this link
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="port-classification" className="text-gray-900 mb-2 block">
                      Port Classification
                    </Label>
                    <Select 
                      value={currentEditingPortDetails.portClassification || 'Primary'}
                      onValueChange={(value) => {
                        const updatedFid = fidConfigurations.find(f => f.fid === editingPortFID);
                        if (updatedFid) {
                          updateFIDField(editingPortFID, 'portDetails', {
                            ...(updatedFid.portDetails || {}),
                            portClassification: value
                          });
                        }
                      }}
                    >
                      <SelectTrigger id="port-classification">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Primary">Primary</SelectItem>
                        <SelectItem value="Secondary">Secondary</SelectItem>
                        <SelectItem value="Tertiary">Tertiary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="handoff-type" className="text-gray-900 mb-2 block">
                      Hand off Type
                    </Label>
                    <Select 
                      value={currentEditingPortDetails.handoffType || 'Electrical Ethernet'}
                      onValueChange={(value) => {
                        const updatedFid = fidConfigurations.find(f => f.fid === editingPortFID);
                        if (updatedFid) {
                          updateFIDField(editingPortFID, 'portDetails', {
                            ...updatedFid.portDetails,
                            handoffType: value
                          });
                        }
                      }}
                    >
                      <SelectTrigger id="handoff-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electrical Ethernet">Electrical Ethernet</SelectItem>
                        <SelectItem value="Optical Ethernet - Single mode">Optical Ethernet - Single mode</SelectItem>
                        <SelectItem value="Optical Ethernet - Multi mode">Optical Ethernet - Multi mode</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="port-bandwidth" className="text-gray-900 mb-2 block">
                      Port Bandwidth <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={currentEditingPortDetails.portBandwidth || '1 Gbps'}
                      onValueChange={(value) => {
                        const updatedFid = fidConfigurations.find(f => f.fid === editingPortFID);
                        if (updatedFid) {
                          updateFIDField(editingPortFID, 'portDetails', {
                            ...updatedFid.portDetails,
                            portBandwidth: value
                          });
                        }
                      }}
                    >
                      <SelectTrigger id="port-bandwidth">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100 Mbps">100 Mbps</SelectItem>
                        <SelectItem value="1 Gbps">1 Gbps</SelectItem>
                        <SelectItem value="10 Gbps">10 Gbps</SelectItem>
                        <SelectItem value="40 Gbps">40 Gbps</SelectItem>
                        <SelectItem value="100 Gbps">100 Gbps</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {networkType === 'DIA' && (() => {
                    const editingFid = fidConfigurations.find(f => f.fid === editingPortFID);
                    const isBurstableEligible = editingFid && (
                      editingFid.location.includes('Sify DC') || 
                      editingFid.location.includes('Connected DC')
                    );
                    
                    return (
                      <div>
                        <Label htmlFor="bandwidth-type" className="text-gray-900 mb-2 block">
                          Bandwidth Type
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-4 h-4 inline-block ml-1 text-gray-500 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>Burstable type is applicable only if the location is Sify DC or Connected DC. For all other locations, only Fixed bandwidth is applicable.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Select 
                          value={currentEditingPortDetails.bandwidthType || 'fixed'}
                          onValueChange={(value: 'fixed' | 'burstable') => {
                            const updatedFid = fidConfigurations.find(f => f.fid === editingPortFID);
                            if (updatedFid) {
                              updateFIDField(editingPortFID, 'portDetails', {
                                ...updatedFid.portDetails,
                                bandwidthType: value
                              });
                            }
                          }}
                        >
                          <SelectTrigger id="bandwidth-type">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fixed">Fixed</SelectItem>
                            {isBurstableEligible && (
                              <SelectItem value="burstable">Burstable</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    );
                  })()}

                  {networkType === 'DIA' && currentEditingPortDetails.bandwidthType === 'burstable' && (
                    <div>
                      <Label htmlFor="burst-option" className="text-gray-900 mb-2 block">
                        Burst Option
                      </Label>
                      <Select 
                        value={currentEditingPortDetails.burstOption || ''}
                        onValueChange={(value) => {
                          const updatedFid = fidConfigurations.find(f => f.fid === editingPortFID);
                          if (updatedFid) {
                            updateFIDField(editingPortFID, 'portDetails', {
                              ...updatedFid.portDetails,
                              burstOption: value
                            });
                          }
                        }}
                      >
                        <SelectTrigger id="burst-option">
                          <SelectValue placeholder="Select burst" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="burst-2x">Burst 2x</SelectItem>
                          <SelectItem value="burst-4x">Burst 4x</SelectItem>
                          <SelectItem value="burst-5x">Burst 5x</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="port-type" className="text-gray-900 mb-2 block">
                      Port Type
                    </Label>
                    <Select 
                      value={currentEditingPortDetails.portType || '1G'}
                      onValueChange={(value) => {
                        const updatedFid = fidConfigurations.find(f => f.fid === editingPortFID);
                        if (updatedFid) {
                          updateFIDField(editingPortFID, 'portDetails', {
                            ...updatedFid.portDetails,
                            portType: value
                          });
                        }
                      }}
                    >
                      <SelectTrigger id="port-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1G">1G</SelectItem>
                        <SelectItem value="10G">10G</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {networkType === 'MPLS' && (
                    <div>
                      <Label htmlFor="ip-type" className="text-gray-900 mb-2 block">
                        IP Type
                      </Label>
                      <Select 
                        value={currentEditingPortDetails.ipType || 'IPv4'}
                        onValueChange={(value) => {
                          const updatedFid = fidConfigurations.find(f => f.fid === editingPortFID);
                          if (updatedFid) {
                            updateFIDField(editingPortFID, 'portDetails', {
                              ...updatedFid.portDetails,
                              ipType: value
                            });
                          }
                        }}
                      >
                        <SelectTrigger id="ip-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IPv4">IPv4</SelectItem>
                          <SelectItem value="IPv6">IPv6</SelectItem>
                          <SelectItem value="Dual">Dual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-8 pt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sify-dns-cache-dialog"
                      checked={currentEditingPortDetails.sifyDnsCache || false}
                      onCheckedChange={(checked) => {
                        const updatedFid = fidConfigurations.find(f => f.fid === editingPortFID);
                        if (updatedFid) {
                          updateFIDField(editingPortFID, 'portDetails', {
                            ...updatedFid.portDetails,
                            sifyDnsCache: checked as boolean
                          });
                        }
                      }}
                    />
                    <Label
                      htmlFor="sify-dns-cache-dialog"
                      className="text-sm text-gray-900 cursor-pointer"
                    >
                      Sify DNS cache services
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="port-redundancy-dialog"
                      checked={currentEditingPortDetails.portRedundancy || false}
                      onCheckedChange={(checked) => {
                        const updatedFid = fidConfigurations.find(f => f.fid === editingPortFID);
                        if (updatedFid) {
                          updateFIDField(editingPortFID, 'portDetails', {
                            ...updatedFid.portDetails,
                            portRedundancy: checked as boolean
                          });
                        }
                      }}
                    />
                    <Label
                      htmlFor="port-redundancy-dialog"
                      className="text-sm text-gray-900 cursor-pointer"
                    >
                      Port Redundancy
                    </Label>
                  </div>
                </div>
              </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setPortDetailsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                toast.success('Port details saved successfully');
                setPortDetailsDialogOpen(false);
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Save Port Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SSC Port Details Dialog */}
      <Dialog open={sscPortDetailsDialogOpen} onOpenChange={setSscPortDetailsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Secure Site Connect Port Details</DialogTitle>
            <DialogDescription>
              Configure port details for {selectedSscFids.length} selected FID(s). These settings will apply to all selected items.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="ssc-port-classification" className="text-gray-900 mb-2 block">
                Port Classification <span className="text-red-500">*</span>
              </Label>
              <Select value={sscPortClassification} onValueChange={setSscPortClassification}>
                <SelectTrigger id="ssc-port-classification">
                  <SelectValue placeholder="Select classification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Primary">Primary</SelectItem>
                  <SelectItem value="Secondary">Secondary</SelectItem>
                  <SelectItem value="Tertiary">Tertiary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="ssc-port-bandwidth" className="text-gray-900 mb-2 block">
                Port Bandwidth (Mbps) <span className="text-red-500">*</span>
              </Label>
              <Select value={sscPortBandwidth} onValueChange={setSscPortBandwidth}>
                <SelectTrigger id="ssc-port-bandwidth">
                  <SelectValue placeholder="Select bandwidth" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Mbps</SelectItem>
                  <SelectItem value="2">2 Mbps</SelectItem>
                  <SelectItem value="3">3 Mbps</SelectItem>
                  <SelectItem value="5">5 Mbps</SelectItem>
                  <SelectItem value="10">10 Mbps</SelectItem>
                  <SelectItem value="20">20 Mbps</SelectItem>
                  <SelectItem value="50">50 Mbps</SelectItem>
                  <SelectItem value="100">100 Mbps</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSscPortDetailsDialogOpen(false);
                setSelectedSscFids([]);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSscPortDetailsSubmit}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add FIDs
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
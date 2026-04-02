import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { LinkInventoryPage } from './LinkInventoryPage';
import { LMTypeSelector } from './LMTypeSelector';
import { Step2AddressFields } from './Step2AddressFields';
import { MDACAddressFields } from './MDACAddressFields';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import { Checkbox } from './ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ArrowRight,
  Building,
  Building2,
  User,
  MapPin,
  FileText,
  Network,
  CheckCircle,
  Trash2,
  Edit,
  Plus,
  Upload,
  Search,
  X,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info,
  Download,
  Cloud,
  Check,
  RotateCcw
} from 'lucide-react';
import { INDIAN_STATES, INDIAN_CITIES } from '../constants/indiaLocations';
import { SIFY_DATA_CENTERS, CONNECTED_DATA_CENTERS, CONNECTED_BUILDINGS } from '../constants/datacenters';
import { MOCK_CUSTOMER, MOCK_OPPORTUNITIES_DATA, generateMockOpportunity } from '../constants/mockData';
import { DEVICE_MODEL_OPTIONS } from '../constants/deviceModels';
import { getSampleConnectionData, getSampleMDACServices } from '../utils/sampleData';
import { OpportunitySearch } from './ServiceRequest/OpportunitySearch';

interface ConnectionTypeItem {
  type: 'Fiber' | 'Wireless' | 'Broadband' | 'Leased Line - Fiber' | 'Leased Line - Wireless' | 'BSO - Fiber' | 'BSO - Wireless' | '3G/4G' | 'VSAT' | 'Leased Line';
  isPrimary: boolean;
  serviceProviders?: string[]; // List of providers (included or excluded based on providerPreference)
  primaryProvider?: string; // Primary provider within Leased Line
  providerPreference?: 'include' | 'exclude' | 'no-preference'; // How to interpret serviceProviders list
  broadbandIPType?: 'With Static IP' | 'Without Static IP'; // For Broadband
  sim3G4GType?: 'Single Sim' | 'Dual Sim'; // For 3G/4G
}

interface Connection {
  id: string;
  endType?: 'A End' | 'B End'; // For P2P pairing
  pairId?: string; // To identify pairs
  numberOfLinks?: 'Single' | 'Dual' | 'Dual link with single cloud' | 'Dual link with dual cloud'; // Updated
  cloudProvider?: 'Sify' | 'Other ISP'; // New
  link2CloudProvider?: 'Sify' | 'Other ISP'; // New for dual cloud
  locationCategoryType?: 'DC' | 'Custom' | 'Cloud Provider'; // Top level category for P2P
  locationCategory?: 'Sify DC' | 'Customer on-prem DC' | '3rd Party DC' | 'Customer site' | 'Cloud (Hyperscaler)' | 'Sify CI Cloud' | 'Govt. office building' | 'Internet Exchange'; // Location category
  addressType?: 'Sify DC' | 'Connected DC' | 'Connected Building' | 'Custom Location'; // For DIA/MPLS address type
  connectedDCName?: string; // For Connected DC
  buildingName?: string; // For Connected Building
  branchCode?: string; // Branch code for Connected Building and Custom Location
  isDataCenter?: boolean; // For Custom Location - whether it's a data center
  rackDetails?: string; // Rack details for DC locations
  floorDetails?: string; // Floor details for DC locations
  blockTowerDetails?: string; // Block or Tower details for DC locations
  buildingHeight?: string; // Building height for Custom Location
  terraceType?: string; // Terrace type for Custom Location
  address?: string; // Computed address display string
  addressLine1: string;
  addressLine2: string;
  state: string;
  city: string;
  pinCode: string;
  latitude?: string;
  longitude?: string;
  crossConnectResponsibility?: 'Sify' | 'Customer'; // Cross Connect Responsibility
  crossConnectType?: 'Copper' | 'Fiber'; // Cross Connect Type (shown when Sify is selected)
  link2CrossConnectResponsibility?: 'Sify' | 'Customer'; // Secondary 2 cross connect
  link2CrossConnectType?: 'Copper' | 'Fiber'; // Secondary 2 cross connect type
  bandwidthValue: string;
  connectionTypes: ConnectionTypeItem[];
  vas: VASItem[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  isHub?: boolean;
  // DC Selection fields
  dcName?: string;
  // LM Category
  lmCategory?: 'Access Type' | 'Cloud Provider';
  // Cloud Provider fields
  cloudServiceProvider?: string;
  cloudServiceType?: string;
  connectingNodes?: string;
  transportType?: string;
  // Port Details - Primary 1
  linkType?: string;
  portType?: string;
  portBandwidth?: string;
  // DIA-specific port details
  bandwidthType?: 'fixed' | 'burstable';
  burstOption?: string;
  portTypeSize?: string;
  sifyDnsCache?: boolean;
  portRedundancy?: boolean;
  // MPLS-specific port details
  ipType?: string;
  // Port Details - Secondary 2 (for Dual links)
  link2LinkType?: string;
  link2PortType?: string;
  link2PortBandwidth?: string;
  link2BandwidthType?: 'fixed' | 'burstable';
  link2BurstOption?: string;
  link2PortTypeSize?: string;
  link2SifyDnsCache?: boolean;
  link2PortRedundancy?: boolean;
  link2IpType?: string;
  link2BandwidthValue?: string; // Bandwidth for Seconadry 2
  link2ConnectionTypes?: ConnectionTypeItem[]; // Connection types for Seconadry 2
  // Remarks
  remarks?: string; // Notes or description for the feasibility
  // MDAC fields
  modificationInfo?: any; // Stores modification details for MDAC flow
  isModifyFlow?: boolean; // Flag to indicate if this is a modification
  linkId?: string; // Link ID for display
}

interface VASItem {
  id: string;
  type: 'ip' | 'managed' | 'device' | 'ddos';
  isPrimary?: boolean;
  ipType?: string;
  service?: string;
  description?: string;
  switchModel?: string;
  mitigationCapacity?: string;
  name?: string;
  details?: string;
}

export function NewDIAServiceRequest() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0); // 0 = Search Screen, 1-3 = Stepper
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [connectionToDelete, setConnectionToDelete] = useState<Connection | null>(null);

  // Product Category Selection (Step 2)
  const [selectedProductCategory, setSelectedProductCategory] = useState<'datacenter' | 'cloud' | 'network'>('cloud');

  // Pre-Stepper: Search & Selection
  const [searchBy, setSearchBy] = useState<'opportunity' | 'customer'>('opportunity');
  const [searchValue, setSearchValue] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerOpportunities, setCustomerOpportunities] = useState<any[]>([]);
  const [showOpportunityList, setShowOpportunityList] = useState(false);

  // Step 1: Customer & Requirement Details
  const [customerType, setCustomerType] = useState<'existing' | 'prospect' | 'new'>('existing');

  const [newProspectData, setNewProspectData] = useState({
    panNumber: '',
    gstNumber: '',
    companyName: '',
    businessType: '',
    addressLine1: '',
    addressLine2: '',
    state: '',
    city: '',
    pinCode: '',
    contactPerson: '',
    contactEmail: ''
  });

  const [opportunityId, setOpportunityId] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    companyName: '',
    customerId: '',
    businessType: '',
    address: '',
    panNumber: '',
    gstNumber: '',
    primaryContactName: '',
    primaryContactEmail: '',
    leadBUType: '',
    opportunityStatus: '',
    salesStage: ''
  });

  const [requirementInfo, setRequirementInfo] = useState({
    requirementName: '',
    location: '',
    product: '', // Product field
    subProduct: '', // Sub Product field
    orderType: '', // Order Type field
    networkType: 'DIA', // Default network type
    mplsType: '',
    priority: '',
    contractTerm: '',
    expectedTimeline: '',
    budgetRange: '',
    billingPreference: '',
    projectObjectives: [] as string[],
    consultantName: '',
    consultantEmail: '',
    consultantPhone: '',
    requirementDescription: ''
  });

  const [infrastructureInfo, setInfrastructureInfo] = useState({
    infrastructureLandscape: '',
    currentDCHQLocation: '',
    existingProvider: '',
    existingProviderName: '',
    currentHostingModel: '',
    keyChallenges: ''
  });

  // Step 2: Product Selection
  const [totalConnections, setTotalConnections] = useState(1);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedConnectionIndex, setSelectedConnectionIndex] = useState<number>(0);
  const [currentConnection, setCurrentConnection] = useState<Partial<Connection>>({
    numberOfLinks: 'Single',
    locationCategory: undefined,
    addressLine1: '',
    addressLine2: '',
    state: '',
    city: '',
    pinCode: '',
    latitude: '',
    longitude: '',
    bandwidthValue: '',
    connectionTypes: [],
    vas: [],
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    linkType: '',
    portType: '',
    portBandwidth: '',
    lmCategory: 'Access Type',
    cloudServiceProvider: '',
    cloudServiceType: '',
    connectingNodes: '',
    transportType: '',
    rackDetails: '',
    floorDetails: '',
    blockTowerDetails: ''
  });
  const [originalConnection, setOriginalConnection] = useState<Partial<Connection> | null>(null);
  const [useSameVASForAll, setUseSameVASForAll] = useState(false);
  const [commonVAS, setCommonVAS] = useState<VASItem[]>([]);
  const [selectedVASConnections, setSelectedVASConnections] = useState<string[]>([]);
  const [showVASConnectionSelector, setShowVASConnectionSelector] = useState(false);
  const [useSameContactForAll, setUseSameContactForAll] = useState(false);
  const [commonContact, setCommonContact] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [selectedContactConnections, setSelectedContactConnections] = useState<string[]>([]);
  const [showContactConnectionSelector, setShowContactConnectionSelector] = useState(false);
  const [isCommonSettingsOpen, setIsCommonSettingsOpen] = useState(true);
  const [applyContactToAll, setApplyContactToAll] = useState(false);
  const [applyBandwidthToAll, setApplyBandwidthToAll] = useState(false);
  const [applyVASToAll, setApplyVASToAll] = useState(false);
  const [addMoreCount, setAddMoreCount] = useState(1);
  const [showAddMoreAlert, setShowAddMoreAlert] = useState(false);

  // Bulk upload states
  const [uploadMethod, setUploadMethod] = useState<'manual' | 'bulk'>('manual');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [bulkUploadData, setBulkUploadData] = useState<Connection[]>([]);
  const [showBulkSummary, setShowBulkSummary] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Map<string, string[]>>(new Map());

  // DIA/MPLS entry method
  const [diaEntryMethod, setDiaEntryMethod] = useState<'manual' | 'bulk'>('manual');

  // Sample data states
  const [sampleDataLoaded, setSampleDataLoaded] = useState(false);
  const [bulkStep, setBulkStep] = useState<2 | 3 | 4>(2); // Step 2: Upload, Step 3: Services Validation, Step 4: Final Review
  const [uploadedServices, setUploadedServices] = useState<any[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // VAS Dialog
  const [showVASDialog, setShowVASDialog] = useState(false);
  const [vasDialogContext, setVasDialogContext] = useState<'bulk' | 'individual'>('bulk'); // Track where VAS dialog was opened from
  // Separate states for each VAS type to allow multiple selections
  const [selectedIP, setSelectedIP] = useState<string>('');
  const [selectedManagedServices, setSelectedManagedServices] = useState<string[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [selectedDDoS, setSelectedDDoS] = useState<string>('');

  // VAS Sheet states
  const [showVASSheet, setShowVASSheet] = useState(false);
  const [deviceOption, setDeviceOption] = useState<'own' | 'buy' | null>(null);
  const [selectedDeviceTypes, setSelectedDeviceTypes] = useState<string[]>([]);
  const [deviceCounts, setDeviceCounts] = useState<{ [key: string]: number }>({});
  const [deviceModels, setDeviceModels] = useState<{ [key: string]: string }>({});
  const [deviceModelsByCount, setDeviceModelsByCount] = useState<{ [key: string]: string[] }>({});
  const [deviceManagement, setDeviceManagement] = useState<{ [key: string]: { configuration: boolean, hardware: boolean } }>({});
  const [enableManagedService, setEnableManagedService] = useState(false);
  const [deviceManagedService, setDeviceManagedService] = useState<{ [key: string]: boolean }>({});
  const [managedServiceType, setManagedServiceType] = useState<'configuration' | 'configuration_hardware' | null>(null);
  const [serviceVariant, setServiceVariant] = useState<'bundled' | 'specific' | null>(null);

  // VAS Collapsible sections states
  const [ipSectionOpen, setIpSectionOpen] = useState(false);
  const [devicesSectionOpen, setDevicesSectionOpen] = useState(false);
  const [ddosSectionOpen, setDdosSectionOpen] = useState(false);

  // Address Search & Map
  const [addressMode, setAddressMode] = useState<'manual' | 'search'>('manual');
  const [addressSearchQuery, setAddressSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [mapPosition, setMapPosition] = useState({ lat: 19.0760, lng: 72.8777 }); // Default to Mumbai

  // Port Details state (for Step 3)
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

  // Connected Building Detection
  const [showConnectedBuildingDialog, setShowConnectedBuildingDialog] = useState(false);
  const [detectedBuilding, setDetectedBuilding] = useState<{ name: string; city: string; pinCode: string; latitude: string; longitude: string } | null>(null);

  // Modify Flow States
  const [modificationTypes, setModificationTypes] = useState<{
    bandwidth: boolean;
    address: boolean;
    lm: boolean;
    addSecondaryTertiary: boolean; // New option
  }>({
    bandwidth: false,
    address: false,
    lm: false,
    addSecondaryTertiary: false
  });
  // New state to track if modifications are common or individual
  const [modificationApplyType, setModificationApplyType] = useState<'common' | 'individual' | null>(null);
  // State to track individual link modifications
  const [individualLinkModifications, setIndividualLinkModifications] = useState<{
    [linkId: string]: {
      bandwidth: boolean;
      address: boolean;
      lm: boolean;
      addSecondaryTertiary: boolean;
    };
  }>({});
  const [linkCount, setLinkCount] = useState(1);
  const [showInventoryPage, setShowInventoryPage] = useState(false);
  const [selectedLinks, setSelectedLinks] = useState<any[]>([]);
  const [isAddingMoreLinks, setIsAddingMoreLinks] = useState(false); // Track if we're adding more links
  const [selectedLinkIndex, setSelectedLinkIndex] = useState<number>(0);
  const [currentModifyLink, setCurrentModifyLink] = useState<any>(null);
  const [linkModifications, setLinkModifications] = useState<{ [key: string]: any }>({});
  const [selectedNewBandwidth, setSelectedNewBandwidth] = useState<string>('');
  const [modifyAddressType, setModifyAddressType] = useState<string>('');
  const [modifyDCName, setModifyDCName] = useState<string>('');
  const [modifyConnectedDCName, setModifyConnectedDCName] = useState<string>('');
  const [modifyBuildingName, setModifyBuildingName] = useState<string>('');
  const [modifyRackDetails, setModifyRackDetails] = useState<string>('');
  const [modifyFloorDetails, setModifyFloorDetails] = useState<string>('');
  const [modifyBlockTowerDetails, setModifyBlockTowerDetails] = useState<string>('');
  const [modifyAddressLine1, setModifyAddressLine1] = useState<string>('');
  const [modifyAddressLine2, setModifyAddressLine2] = useState<string>('');
  const [modifyCity, setModifyCity] = useState<string>('');
  const [modifyState, setModifyState] = useState<string>('');
  const [modifyPinCode, setModifyPinCode] = useState<string>('');
  const [modifyLatitude, setModifyLatitude] = useState<string>('');
  const [modifyLongitude, setModifyLongitude] = useState<string>('');
  const [modifyConnectionTypes, setModifyConnectionTypes] = useState<ConnectionTypeItem[]>([]);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<any>(null);

  // Bandwidth-LM compatibility validation
  const [showLMChangeMandatoryDialog, setShowLMChangeMandatoryDialog] = useState(false);
  const [showLMChangeSuggestionDialog, setShowLMChangeSuggestionDialog] = useState(false);
  const [lmChangeReason, setLMChangeReason] = useState<string>('');
  const [disableWirelessInLM, setDisableWirelessInLM] = useState(false);

  // Get link status counts
  const getLinkStatusCounts = () => {
    const saved = selectedLinks.filter(link => linkModifications[link.id]?.status === 'completed').length;
    const inProgress = selectedLinks.filter(link => linkModifications[link.id]?.status === 'in-progress').length;
    const pending = selectedLinks.filter(link => !linkModifications[link.id]?.status || linkModifications[link.id]?.status === 'pending').length;
    return { saved, inProgress, pending };
  };

  // Helper to get modification types for a specific link
  const getLinkModificationTypes = (linkId: string) => {
    if (modificationApplyType === 'individual') {
      return individualLinkModifications[linkId] || {
        bandwidth: false,
        address: false,
        lm: false,
        addSecondaryTertiary: false
      };
    }
    return modificationTypes;
  };

  // Get modification status for a link
  // Helper function to calculate status from a modifications object directly
  const calculateModificationStatus = (modifications: any, linkId: string): 'completed' | 'in-progress' | 'pending' => {
    if (!modifications) return 'pending';

    // Get the modification types for this link (either common or individual)
    const linkModTypes = modificationApplyType === 'individual'
      ? individualLinkModifications[linkId]
      : modificationTypes;

    if (!linkModTypes) return 'pending';

    let filledFields = 0;
    let totalRequiredFields = 0;

    if (linkModTypes.bandwidth) {
      totalRequiredFields++;
      if (modifications.newBandwidth && modifications.newBandwidth.trim() !== '') {
        filledFields++;
      }
    }

    if (linkModTypes.address) {
      totalRequiredFields++;
      // Check if address is properly filled based on address type
      const hasAddressInfo = (() => {
        if (!modifications.newAddressType) return false;

        if (modifications.newAddressType === 'Sify DC') {
          // For Sify DC, we need dcName, state, city, rack, floor, block/tower (mandatory)
          return !!(modifications.newDCName?.trim() && modifications.newState?.trim() && modifications.newCity?.trim() &&
            modifications.newRackDetails?.trim() && modifications.newFloorDetails?.trim() && modifications.newBlockTowerDetails?.trim());
        } else if (modifications.newAddressType === 'Connected DC') {
          // For Connected DC, we need connectedDCName, state, city, rack, floor, block/tower (mandatory)
          return !!(modifications.newConnectedDCName?.trim() && modifications.newState?.trim() && modifications.newCity?.trim() &&
            modifications.newRackDetails?.trim() && modifications.newFloorDetails?.trim() && modifications.newBlockTowerDetails?.trim());
        } else if (modifications.newAddressType === 'Connected Building') {
          // For Connected Building, we need buildingName, state, city (rack, floor, block/tower are optional)
          return !!(modifications.newBuildingName?.trim() && modifications.newState?.trim() && modifications.newCity?.trim());
        } else if (modifications.newAddressType === 'Custom Location') {
          // For Custom Location, we need full address
          return !!(modifications.newAddressLine1?.trim() && modifications.newState?.trim() && modifications.newCity?.trim() && modifications.newPinCode?.trim());
        }
        return false;
      })();

      if (hasAddressInfo) filledFields++;
    }

    if (linkModTypes.lm) {
      totalRequiredFields++;

      // Check if LM type is filled
      const hasLMType = modifications.newLMType && Array.isArray(modifications.newLMType) && modifications.newLMType.length > 0;

      // For DC/Connected buildings, Fiber is auto-set, so consider it filled even if not explicitly saved
      // Get the link to check its address type
      const link = selectedLinks.find(l => l.id === linkId);
      const isFiberOnly = link && (
        link.addressType === 'Sify DC' ||
        link.addressType === 'Connected DC' ||
        link.addressType === 'Connected Building'
      );

      // If address modification is also selected and it's a DC type, auto-consider Fiber as set
      const isAddressModifiedToDC = linkModTypes.address && modifications.newAddressType && (
        modifications.newAddressType === 'Sify DC' ||
        modifications.newAddressType === 'Connected DC' ||
        modifications.newAddressType === 'Connected Building'
      );

      if (hasLMType || isFiberOnly || isAddressModifiedToDC) {
        filledFields++;
      }
    }

    if (linkModTypes.addSecondaryTertiary) {
      totalRequiredFields++;
      // For secondary/tertiary link, check if newBandwidth and newLMType are filled
      const hasBandwidth = modifications.newBandwidth && modifications.newBandwidth.trim() !== '';
      const hasLMType = modifications.newLMType && Array.isArray(modifications.newLMType) && modifications.newLMType.length > 0;

      // For DC/Connected buildings, Fiber is auto-set for new links too
      const link = selectedLinks.find(l => l.id === linkId);
      const isFiberOnly = link && (
        link.addressType === 'Sify DC' ||
        link.addressType === 'Connected DC' ||
        link.addressType === 'Connected Building'
      );

      // Consider secondary/tertiary link complete if bandwidth is set AND (LM type is set OR auto-fiber applies)
      const hasSecondaryInfo = hasBandwidth && (hasLMType || isFiberOnly);

      if (hasSecondaryInfo) filledFields++;
    }

    // If no modification types are selected, return pending
    if (totalRequiredFields === 0) return 'pending';

    if (filledFields === 0) return 'pending';
    if (filledFields < totalRequiredFields) return 'in-progress';
    return 'completed';
  };

  const getLinkModificationStatus = (linkId: string): 'completed' | 'in-progress' | 'pending' => {
    const modifications = linkModifications[linkId];
    return calculateModificationStatus(modifications, linkId);
  };

  // Save modifications for current link
  const saveCurrentLinkModifications = () => {
    if (!currentModifyLink) return;

    // Auto-populate Fiber for DC/Connected buildings if LM type is being modified but not explicitly set
    const linkModTypes = getLinkModificationTypes(currentModifyLink.id);
    let lmTypeToSave = modifyConnectionTypes;

    // Check if we need to auto-populate Fiber (for both LM modification and Add secondary/tertiary)
    if ((linkModTypes.lm || linkModTypes.addSecondaryTertiary) && (!lmTypeToSave || lmTypeToSave.length === 0)) {
      // Check if this is a fiber-only building type
      const isFiberOnly = currentModifyLink.addressType === 'Sify DC' ||
        currentModifyLink.addressType === 'Connected DC' ||
        currentModifyLink.addressType === 'Connected Building';

      // Also check if address is being changed TO a DC type
      const isChangingToDC = modifyAddressType && (
        modifyAddressType === 'Sify DC' ||
        modifyAddressType === 'Connected DC' ||
        modifyAddressType === 'Connected Building'
      );

      if (isFiberOnly || isChangingToDC) {
        lmTypeToSave = [{ type: 'Fiber', isPrimary: true }];
      }
    }

    const modifications = {
      ...linkModifications[currentModifyLink.id],
      newBandwidth: selectedNewBandwidth,
      newAddressType: modifyAddressType,
      newDCName: modifyDCName,
      newConnectedDCName: modifyConnectedDCName,
      newBuildingName: modifyBuildingName,
      newRackDetails: modifyRackDetails,
      newFloorDetails: modifyFloorDetails,
      newBlockTowerDetails: modifyBlockTowerDetails,
      newAddressLine1: modifyAddressLine1,
      newAddressLine2: modifyAddressLine2,
      newCity: modifyCity,
      newState: modifyState,
      newPinCode: modifyPinCode,
      newLatitude: modifyLatitude,
      newLongitude: modifyLongitude,
      newLMType: lmTypeToSave,
      contactName: currentModifyLink.contactName,
      contactEmail: currentModifyLink.contactEmail,
      contactPhone: currentModifyLink.contactPhone
    };

    // Calculate the status based on the NEW modifications object
    const status = calculateModificationStatus(modifications, currentModifyLink.id);
    modifications.status = status;

    const updatedModifications = {
      ...linkModifications,
      [currentModifyLink.id]: modifications
    };

    setLinkModifications(updatedModifications);

    if (status === 'completed') {
      toast.success(`Link ${currentModifyLink.linkId} modifications saved!`);
    } else {
      toast.info(`Link ${currentModifyLink.linkId} saved as in-progress`);
    }
  };

  // Delete link from modify list
  const deleteModifyLink = (linkId: string) => {
    const linkData = selectedLinks.find(link => link.id === linkId);
    if (!linkData) return;

    // Open confirmation dialog
    setLinkToDelete(linkData);
    setShowDeleteConfirmDialog(true);
  };

  // Confirm delete link
  const confirmDeleteLink = () => {
    if (!linkToDelete) return;

    const updatedLinks = selectedLinks.filter(link => link.id !== linkToDelete.id);
    setSelectedLinks(updatedLinks);

    // Remove modifications for this link
    const updatedModifications = { ...linkModifications };
    delete updatedModifications[linkToDelete.id];
    setLinkModifications(updatedModifications);

    // Update selected index if needed
    if (selectedLinkIndex >= updatedLinks.length) {
      setSelectedLinkIndex(Math.max(0, updatedLinks.length - 1));
    }

    // Update current link
    if (updatedLinks.length > 0) {
      setCurrentModifyLink(updatedLinks[selectedLinkIndex] || updatedLinks[0]);
    } else {
      setCurrentModifyLink(null);
    }

    toast.success(`${linkToDelete.linkId} removed from modification list`);

    // Close dialog
    setShowDeleteConfirmDialog(false);
    setLinkToDelete(null);
  };

  // Add more links - go back to inventory
  const addMoreLinks = () => {
    const remainingSlots = 10 - selectedLinks.length;
    if (remainingSlots <= 0) {
      toast.error('Maximum 10 links can be selected for modification');
      return;
    }
    setIsAddingMoreLinks(true); // Set flag to indicate we're adding more
    setShowInventoryPage(true);
  };

  // Apply contact to all links
  const handleApplyContactToAll = (checked: boolean) => {
    setApplyContactToAll(checked);

    if (checked && currentModifyLink) {
      // Apply current link's contact to all other links
      const updatedLinks = selectedLinks.map(link => ({
        ...link,
        contactName: currentModifyLink.contactName,
        contactEmail: currentModifyLink.contactEmail,
        contactPhone: currentModifyLink.contactPhone
      }));
      setSelectedLinks(updatedLinks);
      toast.success('Contact details applied to all links');
    }
  };

  // Apply bandwidth to all links
  const handleApplyBandwidthToAll = (checked: boolean) => {
    setApplyBandwidthToAll(checked);

    if (checked && currentModifyLink && selectedNewBandwidth) {
      // Apply current link's bandwidth to all other links in linkModifications
      const updatedModifications = { ...linkModifications };

      // For individual mode, also update individualLinkModifications to enable bandwidth checkbox
      const updatedIndividualModifications = { ...individualLinkModifications };

      selectedLinks.forEach(link => {
        if (link.id !== currentModifyLink.id) {
          updatedModifications[link.id] = {
            ...updatedModifications[link.id],
            newBandwidth: selectedNewBandwidth
          };

          // Auto-enable bandwidth modification checkbox for this link in individual mode
          if (modificationApplyType === 'individual') {
            updatedIndividualModifications[link.id] = {
              ...updatedIndividualModifications[link.id],
              bandwidth: true, // Enable bandwidth modification
              address: updatedIndividualModifications[link.id]?.address || false,
              lm: updatedIndividualModifications[link.id]?.lm || false,
              addSecondaryTertiary: updatedIndividualModifications[link.id]?.addSecondaryTertiary || false
            };
          }
        }
      });

      setLinkModifications(updatedModifications);
      if (modificationApplyType === 'individual') {
        setIndividualLinkModifications(updatedIndividualModifications);
      }
      toast.success(`Bandwidth ${selectedNewBandwidth} Mbps applied to all links`);
    }
  };

  // Helper function to check if connections have both Fiber and Wireless LM types
  const hasMixedLMTypes = (): boolean => {
    const hasFiber = connections.some(conn =>
      conn.connectionTypes?.some(ct =>
        ct.type === 'Fiber' ||
        ct.type === 'Leased Line - Fiber'
      )
    );
    const hasWireless = connections.some(conn =>
      conn.connectionTypes?.some(ct =>
        ct.type === 'Wireless' ||
        ct.type === 'Leased Line - Wireless'
      )
    );
    return hasFiber && hasWireless;
  };

  // Helper function to check if connections have only Fiber
  const hasOnlyFiber = (): boolean => {
    const hasFiber = connections.some(conn =>
      conn.connectionTypes?.some(ct =>
        ct.type === 'Fiber' ||
        ct.type === 'Leased Line - Fiber'
      )
    );
    const hasWireless = connections.some(conn =>
      conn.connectionTypes?.some(ct =>
        ct.type === 'Wireless' ||
        ct.type === 'Leased Line - Wireless'
      )
    );
    return hasFiber && !hasWireless;
  };

  // Helper function to check if connections have only Wireless
  const hasOnlyWireless = (): boolean => {
    const hasFiber = connections.some(conn =>
      conn.connectionTypes?.some(ct =>
        ct.type === 'Fiber' ||
        ct.type === 'Leased Line - Fiber'
      )
    );
    const hasWireless = connections.some(conn =>
      conn.connectionTypes?.some(ct =>
        ct.type === 'Wireless' ||
        ct.type === 'Leased Line - Wireless'
      )
    );
    return hasWireless && !hasFiber;
  };

  const handleCustomerSearch = () => {
    // Simulate search from OSC
    setSelectedCustomer(MOCK_CUSTOMER);
  };

  const handleOpportunitySearch = () => {
    if (!searchValue || searchValue.trim() === '') {
      toast.error('Please enter a search value');
      return;
    }

    if (searchBy === 'opportunity') {
      // Search by Opportunity ID - Allow any value
      // First check if it exists in mock data
      const fetchedData = MOCK_OPPORTUNITIES_DATA[searchValue.toUpperCase()];

      if (fetchedData) {
        setSelectedCustomer(fetchedData);
        setShowOpportunityList(false);
        toast.success('Opportunity details fetched successfully from OSC');
      } else {
        // For any other value, create a mock response
        const mockResponse = generateMockOpportunity(searchValue);
        setSelectedCustomer(mockResponse);
        setShowOpportunityList(false);
        toast.success('Opportunity details fetched successfully from OSC');
      }
    } else {
      // Search by Customer Name
      const opportunities = Object.values(MOCK_OPPORTUNITIES_DATA).filter((opp: any) =>
        opp.name.toLowerCase().includes(searchValue.toLowerCase())
      );

      if (opportunities.length > 0) {
        // Sort by created date (most recent first)
        opportunities.sort((a: any, b: any) =>
          new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime()
        );
        setCustomerOpportunities(opportunities);
        setShowOpportunityList(true);
        toast.success(`Found ${opportunities.length} opportunities for this customer`);
      } else {
        toast.error('No opportunities found for this customer');
      }
    }
  };

  const handleOpportunitySelect = (opportunity: any) => {
    setSelectedCustomer(opportunity);
    setShowOpportunityList(false);
  };

  const handleConfirmAndProceed = () => {
    // Populate customer info from selected opportunity
    if (selectedCustomer) {
      setOpportunityId(selectedCustomer.opportunityId);
      setCustomerInfo({
        companyName: selectedCustomer.name,
        customerId: selectedCustomer.customerId,
        businessType: selectedCustomer.businessType,
        address: selectedCustomer.address,
        panNumber: selectedCustomer.panNumber,
        gstNumber: selectedCustomer.gstNumber,
        primaryContactName: selectedCustomer.contactPersonName,
        primaryContactEmail: selectedCustomer.contactEmail,
        leadBUType: selectedCustomer.leadBUType,
        opportunityStatus: selectedCustomer.opportunityStatus,
        salesStage: selectedCustomer.salesStage
      });
    }
    setCurrentStep(1); // Move to stepper
  };

  const handleAddressSearch = () => {
    // Mock address search results (simulating geocoding API)
    const mockResults = [
      {
        id: 1,
        address: `${addressSearchQuery}, Mumbai, Maharashtra 400001`,
        lat: 19.0760,
        lng: 72.8777
      },
      {
        id: 2,
        address: `${addressSearchQuery}, Navi Mumbai, Maharashtra 400706`,
        lat: 19.0330,
        lng: 73.0297
      },
      {
        id: 3,
        address: `${addressSearchQuery}, Thane, Maharashtra 400601`,
        lat: 19.2183,
        lng: 72.9781
      }
    ];
    setSearchResults(mockResults);
  };

  const handleSelectSearchResult = (result: any) => {
    // Parse the address to extract components
    // Example: "Building Name, Mumbai, Maharashtra 400001"
    const addressParts = result.address.split(',').map((part: string) => part.trim());

    let addressLine1 = '';
    let city = '';
    let state = '';
    let pinCode = '';

    if (addressParts.length >= 3) {
      addressLine1 = addressParts[0];
      city = addressParts[1];
      // Extract state and pincode from last part
      const lastPart = addressParts[2];
      const pincodeMatch = lastPart.match(/\d{6}/);
      if (pincodeMatch) {
        pinCode = pincodeMatch[0];
        state = lastPart.replace(pincodeMatch[0], '').trim();
      } else {
        state = lastPart;
      }
    }

    setCurrentConnection({
      ...currentConnection,
      addressLine1: addressLine1,
      city: city,
      state: state,
      pinCode: pinCode,
      latitude: result.lat.toString(),
      longitude: result.lng.toString()
    });
    setMapPosition({ lat: result.lat, lng: result.lng });
    setShowMap(true);
    setSearchResults([]);
  };

  const handleMapClick = (lat: number, lng: number) => {
    setMapPosition({ lat, lng });

    // Simulate reverse geocoding based on coordinates
    const mockAddress = `Building near ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    const mockCity = Math.abs(lat - 19.0760) < 0.5 ? 'Mumbai' : 'Pune';
    const mockState = 'Maharashtra';
    const mockPinCode = '400001';

    setCurrentConnection({
      ...currentConnection,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
      addressLine1: mockAddress,
      city: mockCity,
      state: mockState,
      pinCode: mockPinCode
    });
  };

  // Mock geocoding function to generate lat/long from address
  const geocodeAddress = (city: string, state: string, pinCode: string) => {
    const cityCoordinates: { [key: string]: { lat: number; lng: number } } = {
      'Mumbai': { lat: 19.0760, lng: 72.8777 },
      'Delhi': { lat: 28.7041, lng: 77.1025 },
      'Bangalore': { lat: 12.9716, lng: 77.5946 },
      'Hyderabad': { lat: 17.3850, lng: 78.4867 },
      'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
      'Chennai': { lat: 13.0827, lng: 80.2707 },
      'Kolkata': { lat: 22.5726, lng: 88.3639 },
      'Pune': { lat: 18.5204, lng: 73.8567 },
      'Jaipur': { lat: 26.9124, lng: 75.7873 },
      'Noida': { lat: 28.5355, lng: 77.3910 },
      'Chandigarh': { lat: 30.7333, lng: 76.7794 },
      'Guwahati': { lat: 26.1445, lng: 91.7362 }
    };

    let coords = cityCoordinates[city] || { lat: 20.5937, lng: 78.9629 };

    if (pinCode && pinCode.length === 6) {
      const pincodeNum = parseInt(pinCode);
      const latOffset = ((pincodeNum % 100) - 50) * 0.001;
      const lngOffset = ((pincodeNum % 73) - 36) * 0.001;
      coords = {
        lat: coords.lat + latOffset,
        lng: coords.lng + lngOffset
      };
    }

    return coords;
  };

  // Auto-populate lat/long when address fields are filled
  React.useEffect(() => {
    if (currentConnection.city && currentConnection.state && currentConnection.pinCode &&
      currentConnection.pinCode.length === 6 &&
      (!currentConnection.latitude || !currentConnection.longitude)) {

      const coords = geocodeAddress(currentConnection.city, currentConnection.state, currentConnection.pinCode);

      setCurrentConnection(prev => ({
        ...prev,
        latitude: coords.lat.toFixed(6),
        longitude: coords.lng.toFixed(6)
      }));

      setMapPosition(coords);
    }
  }, [currentConnection.city, currentConnection.state, currentConnection.pinCode]);

  // Detect if entered address matches a connected building
  React.useEffect(() => {
    if (currentConnection.addressType === 'Custom Location' && currentConnection.addressLine1) {
      const addressInput = currentConnection.addressLine1.toLowerCase().trim();

      // Search through all connected buildings
      for (const cityGroup of CONNECTED_BUILDINGS) {
        for (const building of cityGroup.buildings) {
          if (addressInput.includes(building.name.toLowerCase())) {
            // Found a match!
            setDetectedBuilding({
              name: building.name,
              city: cityGroup.city,
              pinCode: building.pinCode,
              latitude: building.latitude,
              longitude: building.longitude
            });
            setShowConnectedBuildingDialog(true);
            return;
          }
        }
      }
    }
  }, [currentConnection.addressLine1, currentConnection.addressType]);

  // Helper function to filter port bandwidth options based on bandwidth value
  const getFilteredPortBandwidthOptions = (bandwidthValue: string): { value: string; label: string }[] => {
    const portOptions = [
      { value: "100 Mbps", label: "100 Mbps", numericValue: 100 },
      { value: "1 Gbps", label: "1 Gbps", numericValue: 1000 },
      { value: "10 Gbps", label: "10 Gbps", numericValue: 10000 },
      { value: "40 Gbps", label: "40 Gbps", numericValue: 40000 },
      { value: "100 Gbps", label: "100 Gbps", numericValue: 100000 }
    ];

    if (!bandwidthValue) return portOptions;

    // Extract numeric value from bandwidth
    const bandwidthMatch = bandwidthValue.match(/(\d+(?:\.\d+)?)\s*(Mbps|Gbps)/i);
    if (!bandwidthMatch) return portOptions;

    const value = parseFloat(bandwidthMatch[1]);
    const unit = bandwidthMatch[2].toLowerCase();
    
    // Convert to Mbps for consistent comparison
    const bandwidthInMbps = unit === 'gbps' ? value * 1000 : value;

    // Return only options that are lower than the bandwidth value
    return portOptions.filter(option => option.numericValue < bandwidthInMbps);
  };

  const handleLoadSampleData = () => {
    console.log('🚀 Loading sample data. requirementInfo.orderType:', requirementInfo.orderType);

    // Sample data with valid and invalid entries
    const sampleServices = getSampleMDACServices(); /*[
      {
        id: '1',
        address: '123 Tech Park\nBuilding A\nMumbai, Maharashtra, 400001',
        addressLine1: '123 Tech Park',
        addressLine2: 'Building A',
        city: 'Mumbai',
        state: 'Maharashtra',
        pinCode: '400001',
        bandwidth: '500 Mbps',
        currentBandwidth: '100 Mbps',
        connectionType: ['Fiber'],
        currentConnectionType: ['Fiber'],
        linkId: 'LINK-001',
        changeType: 'Bandwidth',
        serviceChanges: ['Bandwidth'],
        contactName: 'John Doe',
        contactEmail: 'john.doe@example.com',
        contactPhone: '9876543210',
        status: 'valid' as const
      },
      {
        id: '2',
        address: '456 Business Center\nDelhi, Delhi, 110001',
        addressLine1: '456 Business Center',
        addressLine2: '',
        city: 'Delhi',
        state: 'Delhi',
        pinCode: '110001',
        bandwidth: '200 Mbps',
        currentBandwidth: '200 Mbps',
        connectionType: ['Fiber'],
        currentConnectionType: ['Wireless'],
        linkId: 'LINK-002',
        changeType: 'LM Type',
        serviceChanges: ['LM Type'],
        contactName: 'Jane Smith',
        contactEmail: 'jane.smith@example.com',
        contactPhone: '9876543211',
        status: 'valid' as const
      },
      {
        id: '3',
        address: '789 Corporate Plaza\nFloor 5\nBangalore, Karnataka, INVALID',
        addressLine1: '789 Corporate Plaza',
        addressLine2: 'Floor 5',
        city: 'Bangalore',
        state: 'Karnataka',
        pinCode: 'INVALID',
        bandwidth: '500 Mbps',
        currentBandwidth: '500 Mbps',
        connectionType: ['Fiber'],
        currentConnectionType: ['Fiber'],
        linkId: 'LINK-003',
        changeType: 'Address',
        serviceChanges: ['Address'],
        contactName: 'Bob Johnson',
        contactEmail: 'invalid-email',
        contactPhone: '123',
        status: 'invalid' as const,
        errors: ['Invalid Pin Code', 'Invalid Contact Email', 'Connection Type is required']
      },
      {
        id: '4',
        address: '-\nTamil Nadu, 600001',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: 'Tamil Nadu',
        pinCode: '600001',
        bandwidth: '1 Gbps',
        currentBandwidth: '1 Gbps',
        connectionType: ['Wireless'],
        currentConnectionType: ['Fiber'],
        linkId: 'LINK-004',
        changeType: 'Add Secondary Link',
        serviceChanges: ['Add Link'],
        contactName: '',
        contactEmail: 'test@example.com',
        contactPhone: '9876543213',
        status: 'invalid' as const,
        errors: ['Address Line 1 is required', 'City is required', 'Bandwidth is required', 'Contact Name is required']
      },
      {
        id: '5',
        address: '321 Innovation Hub\nTower B\nHyderabad, Telangana, 500001',
        addressLine1: '321 Innovation Hub',
        addressLine2: 'Tower B',
        city: 'Hyderabad',
        state: 'Telangana',
        pinCode: '500001',
        bandwidth: '1 Gbps',
        currentBandwidth: '100 Mbps',
        connectionType: ['Fiber'],
        currentConnectionType: ['Wireless'],
        linkId: 'LINK-005',
        changeType: 'Bandwidth,LM Type',
        serviceChanges: ['Bandwidth', 'LM Type'],
        contactName: 'Alice Williams',
        contactEmail: 'alice.williams@example.com',
        contactPhone: '9876543214',
        status: 'valid' as const
      }
    ];*/

    // For MDAC flow, automatically calculate serviceChanges array based on differences
    // ONLY if serviceChanges is not already set
    const processedServices = requirementInfo.orderType === 'MDAC'
      ? sampleServices.map(service => {
        console.log('🔄 Processing service:', service.id, 'existing serviceChanges:', service.serviceChanges);

        // If serviceChanges is already explicitly set, use it
        if (service.serviceChanges && service.serviceChanges.length > 0) {
          console.log('✅ Service has explicit serviceChanges:', service.id, service.serviceChanges);
          return { ...service }; // Return a new object to ensure React detects the change
        }

        const changes: string[] = [];

        // Check bandwidth change
        if (service.currentBandwidth && service.bandwidth && service.currentBandwidth !== service.bandwidth) {
          changes.push('Bandwidth');
        }

        // Check LM Type change
        const currentLM = JSON.stringify(service.currentConnectionType || []);
        const newLM = JSON.stringify(service.connectionType || []);
        if (currentLM !== newLM) {
          changes.push('LM Type');
        }

        // Check if it's Add Secondary/Tertiary Link
        if (service.changeType?.includes('Add Secondary') || service.changeType?.includes('Add Tertiary')) {
          changes.push('Add Link');
        }

        // Check address change (basic check - could be more sophisticated)
        if (service.changeType?.includes('Address')) {
          changes.push('Address');
        }

        console.log('📊 Calculated serviceChanges for', service.id, ':', changes);

        return {
          ...service,
          serviceChanges: changes.length > 0 ? changes : []
        };
      })
      : sampleServices;

    console.log('🔍 Final processed services:', processedServices.map(s => ({ id: s.id, linkId: s.linkId, serviceChanges: s.serviceChanges })));

    setUploadedServices(processedServices);
    setSampleDataLoaded(true);
    setUploadedFile(new File([], 'sample_data.csv'));
    toast.success('Sample data loaded successfully');
  };

  const handlePANChange = (pan: string) => {
    setNewProspectData({ ...newProspectData, panNumber: pan });

    // Simulate auto-populate from PAN
    if (pan.length === 10) {
      setNewProspectData({
        ...newProspectData,
        panNumber: pan,
        companyName: 'Auto-populated from PAN',
        businessType: 'Auto-populated from PAN'
      });
    }
  };

  const handleAddVAS = () => {
    // Collect all selected VAS items
    const newVASItems: VASItem[] = [];

    // Add IP if selected
    if (selectedIP) {
      newVASItems.push({
        id: Date.now().toString() + '-ip',
        type: 'ip',
        ipType: selectedIP
      });
    }

    // Add Managed Services if selected
    selectedManagedServices.forEach((service, idx) => {
      const description = service === 'Managed Router'
        ? '24/7 monitoring and configuration management'
        : 'Enterprise-grade security with 24/7 monitoring';
      newVASItems.push({
        id: Date.now().toString() + '-managed-' + idx,
        type: 'managed',
        service: service,
        description: description
      });
    });

    // Add Devices if selected
    selectedDevices.forEach((device, index) => {
      newVASItems.push({
        id: Date.now().toString() + '-device-' + index,
        type: 'device',
        switchModel: device
      });
    });

    // Add DDoS if selected
    if (selectedDDoS) {
      newVASItems.push({
        id: Date.now().toString() + '-ddos',
        type: 'ddos',
        mitigationCapacity: selectedDDoS
      });
    }

    // Validation - at least one VAS must be selected
    if (newVASItems.length === 0) {
      toast.error('Please select at least one VAS option');
      return;
    }

    // Add to bulk VAS or individual connection based on context
    if (vasDialogContext === 'bulk') {
      // Adding from bulk VAS section
      const updatedVAS = [...commonVAS, ...newVASItems];
      setCommonVAS(updatedVAS);
      toast.success(`${newVASItems.length} VAS item(s) added to common services`);
    } else {
      // Adding from individual connection section
      if (applyVASToAll && selectedConnectionIndex === 0) {
        // Apply VAS to all connections
        const updatedConnections = connections.map((conn, idx) => {
          const existingVAS = conn.vas || [];
          const newVASList = [...existingVAS, ...newVASItems];
          return {
            ...conn,
            vas: newVASList
          };
        });
        setConnections(updatedConnections);
        // Also update currentConnection
        const updatedCurrentVAS = [...(currentConnection.vas || []), ...newVASItems];
        setCurrentConnection({
          ...currentConnection,
          vas: updatedCurrentVAS
        });
        toast.success(`${newVASItems.length} VAS item(s) added to all Services`);
        setApplyVASToAll(false);
      } else {
        // Add to individual connection only
        const updatedVAS = [...(currentConnection.vas || []), ...newVASItems];
        setCurrentConnection({
          ...currentConnection,
          vas: updatedVAS
        });
        toast.success(`${newVASItems.length} VAS item(s) added to this Service`);
      }
    }

    // Reset selections and close dialog
    setShowVASDialog(false);
    setSelectedIP('');
    setSelectedManagedServices([]);
    setSelectedDevices([]);
    setSelectedDDoS('');
  };

  const handleRemoveVAS = (vasId: string) => {
    if (currentConnection.vas) {
      const remainingVAS = currentConnection.vas.filter(v => v.id !== vasId);

      setCurrentConnection({
        ...currentConnection,
        vas: remainingVAS
      });
    }
  };

  const handleDownloadTemplate = () => {
    // Define CSV headers based on order type
    const headers = requirementInfo.orderType === 'MDAC'
      ? [
        'Link ID',
        'Change Type',
        'Address Line 1',
        'Address Line 2',
        'City',
        'State',
        'Pin Code',
        'Current Bandwidth',
        'New Bandwidth',
        'Current Connection Type',
        'New Connection Type (comma-separated)',
        'Contact Name',
        'Contact Email',
        'Contact Phone'
      ]
      : [
        'Address Line 1',
        'Address Line 2',
        'City',
        'State',
        'Pin Code',
        'Bandwidth',
        'Connection Type (comma-separated)',
        'Contact Name',
        'Contact Email',
        'Contact Phone'
      ];

    // Sample data rows based on order type
    const sampleRows = requirementInfo.orderType === 'MDAC'
      ? [
        [
          'LINK-001',
          'Bandwidth',
          'Tech Park Building A, Floor 3',
          'Sector 15, Whitefield',
          'Bangalore',
          'Karnataka',
          '560066',
          '100 Mbps',
          '500 Mbps',
          'Fiber',
          'Fiber',
          'John Doe',
          'john.doe@example.com',
          '9876543210'
        ],
        [
          'LINK-002',
          'LM Type',
          'Corporate Office, Tower B',
          'Bandra Kurla Complex',
          'Mumbai',
          'Maharashtra',
          '400051',
          '200 Mbps',
          '200 Mbps',
          'Wireless',
          'Fiber',
          'Jane Smith',
          'jane.smith@example.com',
          '9876543211'
        ],
        [
          'LINK-003',
          'Address',
          'New Business Hub, Phase 2',
          'IT Corridor',
          'Hyderabad',
          'Telangana',
          '500081',
          '500 Mbps',
          '500 Mbps',
          'Fiber',
          'Fiber',
          'Robert Johnson',
          'robert.j@example.com',
          '9876543212'
        ],
        [
          'LINK-004',
          'Add Secondary Link',
          'IT Center, Phase 2',
          'Cyber City, DLF',
          'Gurgaon',
          'Haryana',
          '122002',
          '1 Gbps',
          '1 Gbps',
          'Fiber',
          'Wireless',
          'Alice Williams',
          'alice.w@example.com',
          '9876543213'
        ]
      ]
      : [
        [
          'Tech Park Building A, Floor 3',
          'Sector 15, Whitefield',
          'Bangalore',
          'Karnataka',
          '560066',
          '100 Mbps',
          'Fiber, Wireless',
          'John Doe',
          'john.doe@example.com',
          '9876543210'
        ],
        [
          'Corporate Office, Tower B',
          'Bandra Kurla Complex',
          'Mumbai',
          'Maharashtra',
          '400051',
          '200 Mbps',
          'Fiber',
          'Jane Smith',
          'jane.smith@example.com',
          '9876543211'
        ],
        [
          'IT Center, Phase 2',
          'Cyber City, DLF',
          'Gurgaon',
          'Haryana',
          '122002',
          '500 Mbps',
          'Fiber, Broadband',
          'Robert Johnson',
          'robert.j@example.com',
          '9876543212'
        ]
      ];

    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    sampleRows.forEach(row => {
      // Escape commas in fields by wrapping in quotes
      const escapedRow = row.map(field => {
        if (field.includes(',')) {
          return `"${field}"`;
        }
        return field;
      });
      csvContent += escapedRow.join(',') + '\n';
    });

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${requirementInfo.product}_${requirementInfo.orderType === 'MDAC' ? 'MDAC' : 'Bulk_Upload'}_Template.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Template downloaded successfully');
  };

  const handleSaveConnection = () => {
    const currentConnectionId = connections[selectedConnectionIndex]?.id || Date.now().toString();
    const isFirstConnection = selectedConnectionIndex === 0;

    // Determine VAS for this connection
    let connectionVAS: VASItem[] = [];
    if (useSameVASForAll) {
      // If selected connections specified, only apply to those; otherwise apply to all
      if (selectedVASConnections.length > 0) {
        connectionVAS = selectedVASConnections.includes(currentConnectionId) ? commonVAS : (currentConnection.vas || []);
      } else {
        connectionVAS = commonVAS;
      }
    } else {
      connectionVAS = currentConnection.vas || [];
    }

    // Determine contact for this connection
    let contactName = currentConnection.contactName || '';
    let contactEmail = currentConnection.contactEmail || '';
    let contactPhone = currentConnection.contactPhone || '';

    if (useSameContactForAll) {
      // If selected connections specified, only apply to those; otherwise apply to all
      if (selectedContactConnections.length > 0) {
        if (selectedContactConnections.includes(currentConnectionId)) {
          contactName = commonContact.name;
          contactEmail = commonContact.email;
          contactPhone = commonContact.phone;
        }
      } else {
        contactName = commonContact.name;
        contactEmail = commonContact.email;
        contactPhone = commonContact.phone;
      }
    }

    // Compute address display for saved connection
    const computedAddress = getLocationDisplay(currentConnection);

    const connectionData: Connection = {
      id: currentConnectionId,
      endType: currentConnection.endType, // Preserve pairing info
      pairId: currentConnection.pairId, // Preserve pairing info
      numberOfLinks: currentConnection.numberOfLinks, // Save number of links
      locationCategoryType: currentConnection.locationCategoryType,
      locationCategory: currentConnection.locationCategory,
      addressType: currentConnection.addressType, // Save addressType for DIA/MPLS
      connectedDCName: currentConnection.connectedDCName || '', // For Connected DC
      buildingName: currentConnection.buildingName || '', // For Connected Building
      branchCode: currentConnection.branchCode || '', // For Connected Building and Custom Location
      rackDetails: currentConnection.rackDetails || '', // For DC locations
      floorDetails: currentConnection.floorDetails || '', // For DC locations
      blockTowerDetails: currentConnection.blockTowerDetails || '', // For DC locations
      buildingHeight: currentConnection.buildingHeight || '', // For Custom Location
      terraceType: currentConnection.terraceType || '', // For Custom Location
      crossConnectResponsibility: currentConnection.crossConnectResponsibility, // Cross Connect
      crossConnectType: currentConnection.crossConnectType, // Cross Connect Type
      address: computedAddress, // Computed address for display
      addressLine1: currentConnection.addressLine1 || '',
      addressLine2: currentConnection.addressLine2 || '',
      state: currentConnection.state || '',
      city: currentConnection.city || '',
      pinCode: currentConnection.pinCode || '',
      latitude: currentConnection.latitude || '',
      longitude: currentConnection.longitude || '',
      bandwidthValue: currentConnection.bandwidthValue || '',
      connectionTypes: currentConnection.connectionTypes || [],
      vas: connectionVAS,
      contactName: contactName,
      contactEmail: contactEmail,
      contactPhone: contactPhone,
      isHub: currentConnection.isHub || false,
      linkType: currentConnection.linkType || '',
      portType: currentConnection.portType || '',
      portBandwidth: currentConnection.portBandwidth || '',
      dcName: currentConnection.dcName || '',
      lmCategory: currentConnection.lmCategory || 'Access Type',
      cloudServiceProvider: currentConnection.cloudServiceProvider || '',
      cloudServiceType: currentConnection.cloudServiceType || '',
      connectingNodes: currentConnection.connectingNodes || '',
      transportType: currentConnection.transportType || '',
      // Port Details - Primary 1 (DIA-specific)
      portTypeSize: currentConnection.portTypeSize || '',
      bandwidthType: currentConnection.bandwidthType,
      burstOption: currentConnection.burstOption || '',
      sifyDnsCache: currentConnection.sifyDnsCache || false,
      portRedundancy: currentConnection.portRedundancy || false,
      // Port Details - Primary 1 (MPLS/P2P-specific)
      ipType: currentConnection.ipType || '',
      // Port Details - Secondary 2 (DIA-specific)
      link2PortTypeSize: currentConnection.link2PortTypeSize || '',
      link2BandwidthType: currentConnection.link2BandwidthType,
      link2BurstOption: currentConnection.link2BurstOption || '',
      link2SifyDnsCache: currentConnection.link2SifyDnsCache || false,
      link2PortRedundancy: currentConnection.link2PortRedundancy || false,
      // Port Details - Secondary 2 (MPLS/P2P-specific)
      link2LinkType: currentConnection.link2LinkType || '',
      link2PortType: currentConnection.link2PortType || '',
      link2PortBandwidth: currentConnection.link2PortBandwidth || '',
      link2IpType: currentConnection.link2IpType || '',
      // Bandwidth and LM Types for Secondary 2
      link2BandwidthValue: currentConnection.link2BandwidthValue || '',
      link2ConnectionTypes: currentConnection.link2ConnectionTypes || [],
      // Remarks
      remarks: currentConnection.remarks || '',
      // MDAC fields
      modificationInfo: currentConnection.modificationInfo,
      isModifyFlow: currentConnection.isModifyFlow,
      isDataCenter: currentConnection.isDataCenter
    };

    const updatedConnections = [...connections];
    const previousStatus = getConnectionStatus(connections[selectedConnectionIndex]);
    updatedConnections[selectedConnectionIndex] = connectionData;
    const newStatus = getConnectionStatus(connectionData);

    // Apply to all connections if checkbox is checked on first connection
    if (isFirstConnection) {
      if (applyContactToAll) {
        // Apply contact to all other connections
        for (let i = 1; i < updatedConnections.length; i++) {
          updatedConnections[i] = {
            ...updatedConnections[i],
            contactName: contactName,
            contactEmail: contactEmail,
            contactPhone: contactPhone
          };
        }
      }
      if (applyVASToAll && connectionVAS.length > 0) {
        // Apply VAS to all other connections
        for (let i = 1; i < updatedConnections.length; i++) {
          updatedConnections[i] = {
            ...updatedConnections[i],
            vas: [...connectionVAS]
          };
        }
      }
    }

    setConnections(updatedConnections);
    setCurrentConnection(connectionData); // Sync currentConnection with saved data
    setOriginalConnection(JSON.parse(JSON.stringify(connectionData))); // Update original to match saved state

    // Show toast notification based on status change
    const itemType = 'Service';
    if (newStatus === 'completed' && previousStatus !== 'completed') {
      toast.success(`${itemType} ${selectedConnectionIndex + 1} saved!`, {
        description: 'All required fields have been filled.'
      });
    } else if (newStatus === 'in-progress' && previousStatus === 'pending') {
      toast.info(`${itemType} ${selectedConnectionIndex + 1} in progress`, {
        description: 'Some fields still need to be completed.'
      });
    } else {
      toast.success(`${itemType} ${selectedConnectionIndex + 1} saved`, {
        description: `Status: ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1).replace('-', ' ')}`
      });
    }
  };

  const initializeConnections = (count: number) => {
    // Validate minimum count for MPLS
    if (requirementInfo.networkType === 'MPLS' && count < 2) {
      toast.error('MPLS requires at least 2 Services');
      return;
    }

    // For P2P, create pairs with A End and B End
    const isP2P = requirementInfo.product === 'P2P';

    const newConnections: Connection[] = Array.from({ length: count }, (_, i) => {
      let endType: 'A End' | 'B End' | undefined = undefined;
      let pairId: string | undefined = undefined;

      if (isP2P) {
        // Determine if this is A End (even index) or B End (odd index)
        endType = i % 2 === 0 ? 'A End' : 'B End';
        // Pair ID is the same for consecutive pairs
        pairId = `pair-${Math.floor(i / 2) + 1}`;
      }

      return {
        id: `conn-${Date.now()}-${i}`,
        endType,
        pairId,
        numberOfLinks: 'Single',
        locationCategoryType: undefined,
        locationCategory: undefined,
        addressLine1: '',
        addressLine2: '',
        state: '',
        city: '',
        pinCode: '',
        latitude: '',
        longitude: '',
        bandwidthValue: '',
        connectionTypes: [],
        vas: [],
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        isHub: false,
        linkType: '',
        portType: '',
        portBandwidth: '',
        lmCategory: 'Access Type',
        cloudServiceProvider: '',
        cloudServiceType: '',
        connectingNodes: '',
        transportType: ''
      };
    });

    setConnections(newConnections);
    setSelectedConnectionIndex(0);
    if (newConnections.length > 0) {
      setCurrentConnection(newConnections[0]);
      setOriginalConnection(JSON.parse(JSON.stringify(newConnections[0]))); // Deep copy to track original
    }
  };

  const addMoreConnections = (count: number) => {
    if (count < 1) {
      toast.error('Please specify at least 1 Service to add');
      return;
    }

    const currentCount = connections.length;
    const isP2P = requirementInfo.product === 'P2P';

    const additionalConnections: Connection[] = Array.from({ length: count }, (_, i) => {
      let endType: 'A End' | 'B End' | undefined = undefined;
      let pairId: string | undefined = undefined;

      if (isP2P) {
        // Determine if this is A End or B End based on total count
        endType = (currentCount + i) % 2 === 0 ? 'A End' : 'B End';
        // Pair ID continues from existing pairs
        pairId = `pair-${Math.floor((currentCount + i) / 2) + 1}`;
      }

      return {
        id: `conn-${Date.now()}-${currentCount + i}`,
        endType,
        pairId,
        numberOfLinks: 'Single',
        locationCategoryType: undefined,
        locationCategory: undefined,
        addressLine1: '',
        addressLine2: '',
        state: '',
        city: '',
        pinCode: '',
        latitude: '',
        longitude: '',
        bandwidthValue: '',
        connectionTypes: [],
        vas: [],
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        isHub: false,
        linkType: '',
        portType: '',
        portBandwidth: '',
        lmCategory: 'Access Type',
        cloudServiceProvider: '',
        cloudServiceType: '',
        connectingNodes: '',
        transportType: ''
      };
    });

    setConnections([...connections, ...additionalConnections]);
    toast.success(`${count} Service(s) added successfully`);
    setAddMoreCount(1); // Reset the counter
  };

  const handleEditConnection = (index: number) => {
    setSelectedConnectionIndex(index);
    const connData = connections[index];
    setCurrentConnection(connData);
    setOriginalConnection(JSON.parse(JSON.stringify(connData))); // Deep copy to track original
    setCurrentStep(2);
    const itemType = 'Service';
    toast.info(`Editing ${itemType} ${index + 1}`);
  };

  const handleDeleteConnection = (connOrIndex: Connection | number) => {
    const conn = typeof connOrIndex === 'number' ? connections[connOrIndex] : connOrIndex;
    setConnectionToDelete(conn);
    setShowDeleteDialog(true);
  };

  const confirmDeleteConnection = () => {
    if (connectionToDelete) {
      let updatedConnections: Connection[];
      let deleteMessage = 'Service';

      // If this is a paired connection, delete both A and B End
      if (connectionToDelete.pairId) {
        updatedConnections = connections.filter(c => c.pairId !== connectionToDelete.pairId);
        deleteMessage = 'Pair';
      } else {
        updatedConnections = connections.filter(c => c.id !== connectionToDelete.id);
      }

      // Check minimum Services for MPLS
      if (requirementInfo.networkType === 'MPLS' && updatedConnections.length < 2) {
        toast.error('MPLS requires at least 2 Services. Cannot delete this Service.');
        setShowDeleteDialog(false);
        setConnectionToDelete(null);
        return;
      }

      setConnections(updatedConnections);
      setTotalConnections(updatedConnections.length);
      if (selectedConnectionIndex >= updatedConnections.length) {
        setSelectedConnectionIndex(Math.max(0, updatedConnections.length - 1));
      }
      setShowDeleteDialog(false);
      setConnectionToDelete(null);

      toast.success(`${deleteMessage} deleted successfully`);
    }
  };

  const getConnectionStatus = (conn: Connection): 'completed' | 'in-progress' | 'pending' => {
    // Check if location/address is properly filled based on location category OR address type
    const hasLocationInfo = (() => {
      // For DIA/MPLS with addressType
      if (conn.addressType) {
        if (conn.addressType === 'Sify DC') {
          // For Sify DC, we need dcName, state, city, rack, floor (block/tower is optional)
          return conn.dcName && conn.state && conn.city && conn.rackDetails && conn.floorDetails;
        } else if (conn.addressType === 'Connected DC') {
          // For Connected DC, we need connectedDCName, buildingName, state, city, rack, floor (block/tower is optional)
          return conn.connectedDCName && conn.buildingName && conn.state && conn.city && conn.rackDetails && conn.floorDetails;
        } else if (conn.addressType === 'Connected Building') {
          // For Connected Building, we need buildingName, state, city (rack, floor, block/tower are optional)
          return conn.buildingName && conn.state && conn.city;
        } else if (conn.addressType === 'Custom Location') {
          // For Custom Location, we need full address
          return conn.addressLine1 && conn.state && conn.city && conn.pinCode;
        }
      }

      // For P2P with locationCategory
      if (conn.locationCategory === 'Sify DC' || conn.locationCategory === 'Customer on-prem DC' || conn.locationCategory === '3rd Party DC') {
        // For DC types, we need dcName, city, and state
        return conn.dcName && conn.city && conn.state;
      } else if (conn.locationCategory) {
        // For other location types, we need full address
        return conn.addressLine1 && conn.state && conn.city && conn.pinCode;
      }

      return false;
    })();

    // Check LM Type based on category
    const hasLMType = (() => {
      const lmCategory = conn.lmCategory || 'Access Type';
      if (lmCategory === 'Access Type') {
        return conn.connectionTypes && conn.connectionTypes.length > 0;
      } else {
        // Cloud Provider
        return conn.cloudServiceProvider && conn.cloudServiceType && conn.connectingNodes && conn.transportType;
      }
    })();

    // For Dual links, check both primary and secondary bandwidth/LM types
    const hasBandwidth = conn.bandwidthValue && (
      !conn.numberOfLinks?.startsWith('Dual') || conn.link2BandwidthValue
    );
    const hasLMTypeComplete = hasLMType && (
      !conn.numberOfLinks?.startsWith('Dual') || (conn.link2ConnectionTypes && conn.link2ConnectionTypes.length > 0)
    );

    // Required fields for completion
    // Link Type is only required for P2P products
    const requiresLinkType = requirementInfo.product === 'P2P';
    const hasAllRequired = hasLocationInfo &&
      hasBandwidth &&
      hasLMTypeComplete &&
      (!requiresLinkType || conn.linkType);

    // At least one field filled
    const hasAnyField = conn.locationCategory || conn.addressType || conn.dcName || conn.connectedDCName || conn.buildingName ||
      conn.addressLine1 || conn.addressLine2 ||
      conn.state || conn.city || conn.pinCode ||
      conn.bandwidthValue || (conn.connectionTypes && conn.connectionTypes.length > 0) ||
      conn.latitude || conn.longitude || conn.linkType ||
      conn.cloudServiceProvider || conn.cloudServiceType || conn.connectingNodes || conn.transportType;

    if (hasAllRequired) {
      return 'completed';
    } else if (hasAnyField) {
      return 'in-progress';
    } else {
      return 'pending';
    }
  };

  const getStatusTooltip = (conn: Connection, status: string) => {
    if (status === 'completed') {
      const details = [];

      // Location/Address info
      if (conn.locationCategory === 'Sify DC' || conn.locationCategory === 'Customer on-prem DC' || conn.locationCategory === '3rd Party DC') {
        details.push(`✓ Location: ${conn.dcName || 'DC'} (${conn.city}, ${conn.state})`);
      } else {
        const addressParts = [conn.addressLine1, conn.city, conn.state, conn.pinCode].filter(Boolean);
        details.push(`✓ Address: ${addressParts.join(', ')}`);
      }

      // Bandwidth - show both links for Dual
      if (conn.numberOfLinks?.startsWith('Dual')) {
        details.push(`✓ Bandwidth (Primary): ${conn.bandwidthValue}`);
        details.push(`✓ Bandwidth (Secondary): ${conn.link2BandwidthValue || '-'}`);
      } else {
        details.push(`✓ Bandwidth: ${conn.bandwidthValue}`);
      }

      // Last Mile Type - check category
      const lmCategory = conn.lmCategory || 'Access Type';
      if (lmCategory === 'Access Type') {
        if (conn.numberOfLinks?.startsWith('Dual')) {
          // Show both primary and secondary LM types
          if (conn.connectionTypes && conn.connectionTypes.length > 0) {
            const types = conn.connectionTypes.map(ct => ct.type).join(', ');
            details.push(`✓ LM Type (Primary): ${types}`);
          }
          if (conn.link2ConnectionTypes && conn.link2ConnectionTypes.length > 0) {
            const types = conn.link2ConnectionTypes.map(ct => ct.type).join(', ');
            details.push(`✓ LM Type (Secondary): ${types}`);
          }
        } else {
          if (conn.connectionTypes && conn.connectionTypes.length > 0) {
            const types = conn.connectionTypes.map(ct => ct.type).join(', ');
            details.push(`✓ Last Mile Type: ${types}`);
          }
        }
      } else {
        details.push(`✓ Cloud Provider: ${conn.cloudServiceProvider}`);
        details.push(`✓ Service Type: ${conn.cloudServiceType}`);
        details.push(`✓ Connecting Node: ${conn.connectingNodes}`);
        details.push(`✓ Transport Type: ${conn.transportType}`);
      }

      if (requirementInfo.product === 'P2P' && conn.linkType) {
        details.push(`✓ Link: ${conn.linkType}`);
      }
      if (conn.vas?.length > 0) details.push(`✓ VAS: ${conn.vas.length} service(s)`);
      if (conn.contactName) details.push(`✓ Contact: ${conn.contactName}`);
      return details.join('\n');
    } else if (status === 'in-progress') {
      const missing = [];

      // Check location based on category
      const hasLocation = (() => {
        if (conn.locationCategory === 'Sify DC' || conn.locationCategory === 'Customer on-prem DC' || conn.locationCategory === '3rd Party DC') {
          return conn.dcName && conn.city && conn.state;
        } else {
          return conn.addressLine1 && conn.state && conn.city && conn.pinCode;
        }
      })();

      if (!hasLocation) missing.push('Location/Address');

      // Check Bandwidth for both links if Dual
      if (!conn.bandwidthValue) missing.push('Bandwidth (Primary)');
      if (conn.numberOfLinks?.startsWith('Dual') && !conn.link2BandwidthValue) missing.push('Bandwidth (Secondary)');

      // Check LM Type based on category
      const lmCategory = conn.lmCategory || 'Access Type';
      if (lmCategory === 'Access Type') {
        if (!conn.connectionTypes || conn.connectionTypes.length === 0) {
          missing.push(conn.numberOfLinks?.startsWith('Dual') ? 'LM Type (Primary)' : 'Last Mile Type');
        }
        if (conn.numberOfLinks?.startsWith('Dual') && (!conn.link2ConnectionTypes || conn.link2ConnectionTypes.length === 0)) {
          missing.push('LM Type (Secondary)');
        }
      } else {
        if (!conn.cloudServiceProvider || !conn.cloudServiceType || !conn.connectingNodes || !conn.transportType) {
          missing.push('Cloud Provider Details');
        }
      }

      if (requirementInfo.product === 'P2P' && !conn.linkType) missing.push('Link Type');

      const filled = [];
      if (hasLocation) filled.push('Location/Address');
      if (conn.bandwidthValue) filled.push('Bandwidth');

      if (lmCategory === 'Access Type') {
        if (conn.connectionTypes && conn.connectionTypes.length > 0) filled.push('Last Mile Type');
      } else {
        if (conn.cloudServiceProvider && conn.cloudServiceType && conn.connectingNodes && conn.transportType) {
          filled.push('Cloud Provider Details');
        }
      }

      if (requirementInfo.product === 'P2P' && conn.linkType) filled.push('Link Type');

      return `Filled: ${filled.join(', ') || 'None'}\nMissing: ${missing.join(', ')}`;
    } else {
      return 'No information entered yet.\nRequired: Location/Address, Bandwidth, Last Mile Type, Link Type';
    }
  };

  const isConnectionConfigured = (conn: Connection) => {
    return getConnectionStatus(conn) === 'completed';
  };

  const getFullAddress = (conn: Partial<Connection>) => {
    const addressParts = [
      conn.addressLine1,
      conn.addressLine2,
      conn.city,
      conn.state,
      conn.pinCode
    ].filter(Boolean);
    return addressParts.join(', ') || 'No address selected';
  };

  const getLocationDisplay = (conn: Partial<Connection>) => {
    // For DIA/MPLS: Check addressType
    if (conn.addressType) {
      if (conn.addressType === 'Sify DC') {
        const locationParts = [conn.dcName, conn.city, conn.state].filter(Boolean);
        return locationParts.length > 0
          ? `Sify DC - ${locationParts.join(', ')}`
          : 'Sify DC';
      } else if (conn.addressType === 'Connected DC') {
        const locationParts = [conn.connectedDCName, conn.city, conn.state].filter(Boolean);
        return locationParts.length > 0
          ? `Connected DC - ${locationParts.join(', ')}`
          : 'Connected DC';
      } else if (conn.addressType === 'Connected Building') {
        const locationParts = [conn.buildingName, conn.city, conn.state].filter(Boolean);
        return locationParts.length > 0
          ? `Connected Building - ${locationParts.join(', ')}`
          : 'Connected Building';
      } else if (conn.addressType === 'Custom Location') {
        const addressParts = [conn.addressLine1, conn.addressLine2, conn.city, conn.state, conn.pinCode].filter(Boolean);
        return addressParts.length > 0
          ? addressParts.join(', ')
          : 'Custom Location';
      }
    }

    // For P2P: Check location category
    if (conn.locationCategory) {
      // For DC types, show DC name with city and state
      if (conn.locationCategory === 'Sify DC' || conn.locationCategory === 'Customer on-prem DC' || conn.locationCategory === '3rd Party DC') {
        const locationParts = [conn.dcName, conn.city, conn.state].filter(Boolean);
        return locationParts.length > 0
          ? `${conn.locationCategory} - ${locationParts.join(', ')}`
          : conn.locationCategory;
      } else {
        // For other location types, show address
        const addressParts = [conn.addressLine1, conn.addressLine2, conn.city, conn.state, conn.pinCode].filter(Boolean);
        return addressParts.length > 0
          ? `${conn.locationCategory} - ${addressParts.join(', ')}`
          : conn.locationCategory;
      }
    }

    // Fallback: Just show the address if available
    const addressParts = [conn.addressLine1, conn.addressLine2, conn.city, conn.state, conn.pinCode].filter(Boolean);
    return addressParts.length > 0
      ? addressParts.join(', ')
      : 'No location specified';
  };

  const getBuildingType = (conn: Partial<Connection>) => {
    // For DIA/MPLS: Return addressType
    if (conn.addressType) {
      return conn.addressType;
    }

    // For P2P: Return locationCategory
    if (conn.locationCategory) {
      return conn.locationCategory;
    }

    return 'Custom Location';
  };

  const getLocationAddress = (conn: Partial<Connection>) => {
    // For DIA/MPLS: Check addressType
    if (conn.addressType) {
      if (conn.addressType === 'Sify DC') {
        const locationParts = [conn.dcName, conn.city, conn.state].filter(Boolean);
        return locationParts.length > 0 ? locationParts.join(', ') : '-';
      } else if (conn.addressType === 'Connected DC') {
        const locationParts = [conn.connectedDCName, conn.city, conn.state].filter(Boolean);
        return locationParts.length > 0 ? locationParts.join(', ') : '-';
      } else if (conn.addressType === 'Connected Building') {
        const locationParts = [conn.buildingName, conn.city, conn.state].filter(Boolean);
        return locationParts.length > 0 ? locationParts.join(', ') : '-';
      } else if (conn.addressType === 'Custom Location') {
        const addressParts = [conn.addressLine1, conn.addressLine2, conn.city, conn.state, conn.pinCode].filter(Boolean);
        return addressParts.length > 0 ? addressParts.join(', ') : '-';
      }
    }

    // For P2P: Check location category
    if (conn.locationCategory) {
      // For DC types, show DC name with city and state
      if (conn.locationCategory === 'Sify DC' || conn.locationCategory === 'Customer on-prem DC' || conn.locationCategory === '3rd Party DC') {
        const locationParts = [conn.dcName, conn.city, conn.state].filter(Boolean);
        return locationParts.length > 0 ? locationParts.join(', ') : '-';
      } else {
        // For other location types, show address
        const addressParts = [conn.addressLine1, conn.addressLine2, conn.city, conn.state, conn.pinCode].filter(Boolean);
        return addressParts.length > 0 ? addressParts.join(', ') : '-';
      }
    }

    // Fallback: Just show the address if available
    const addressParts = [conn.addressLine1, conn.addressLine2, conn.city, conn.state, conn.pinCode].filter(Boolean);
    return addressParts.length > 0 ? addressParts.join(', ') : '-';
  };

  // Helper function to format Cross Connect for display
  const formatCrossConnect = (conn: Partial<Connection>) => {
    if (!conn.crossConnectResponsibility) return '-';

    if (conn.crossConnectResponsibility === 'Customer') {
      return 'Customer';
    } else {
      // Sify
      return conn.crossConnectType
        ? `Sify - ${conn.crossConnectType}`
        : 'Sify';
    }
  };

  // Helper function to format Port Details compactly for display
  const formatPortDetails = (conn: Partial<Connection>, linkNumber: 1 | 2) => {
    const parts: string[] = [];

    if (requirementInfo.product === 'DIA') {
      // For DIA: portTypeSize, bandwidthType, burstOption, sifyDnsCache, portRedundancy
      if (linkNumber === 1) {
        if (conn.portTypeSize) parts.push(conn.portTypeSize);
        if (conn.bandwidthType) parts.push(conn.bandwidthType === 'burstable' ? 'Burstable' : 'Fixed');
        if (conn.burstOption && conn.bandwidthType === 'burstable') parts.push(conn.burstOption);
        const extras: string[] = [];
        if (conn.sifyDnsCache) extras.push('DNS Cache');
        if (conn.portRedundancy) extras.push('Port Redundancy');
        if (extras.length > 0) parts.push(`(${extras.join(', ')})`);
      } else {
        // Secondary 2
        if (conn.link2PortTypeSize) parts.push(conn.link2PortTypeSize);
        if (conn.link2BandwidthType) parts.push(conn.link2BandwidthType === 'burstable' ? 'Burstable' : 'Fixed');
        if (conn.link2BurstOption && conn.link2BandwidthType === 'burstable') parts.push(conn.link2BurstOption);
        const extras: string[] = [];
        if (conn.link2SifyDnsCache) extras.push('DNS Cache');
        if (conn.link2PortRedundancy) extras.push('Port Redundancy');
        if (extras.length > 0) parts.push(`(${extras.join(', ')})`);
      }
    } else {
      // For MPLS/P2P: linkType (classification), portType (handoff), portBandwidth, ipType
      if (linkNumber === 1) {
        if (conn.linkType) parts.push(conn.linkType);
        if (conn.portType) parts.push(conn.portType);
        if (conn.portBandwidth) parts.push(conn.portBandwidth);
        if (conn.ipType) parts.push(`IP: ${conn.ipType}`);
      } else {
        // Secondary 2
        if (conn.link2LinkType) parts.push(conn.link2LinkType);
        if (conn.link2PortType) parts.push(conn.link2PortType);
        if (conn.link2PortBandwidth) parts.push(conn.link2PortBandwidth);
        if (conn.link2IpType) parts.push(`IP: ${conn.link2IpType}`);
      }
    }

    return parts.length > 0 ? (
      <div className="flex flex-col gap-0.5 max-w-[180px]">
        {parts.map((part, idx) => (
          <span key={idx} className="text-xs text-gray-900">{part}</span>
        ))}
      </div>
    ) : <span className="text-xs text-gray-500">-</span>;
  };

  // Modify Flow Validation Functions
  const getBandwidthChangeType = (currentBw: string, newBw: string): 'upgrade' | 'downgrade' | 'same' => {
    const extractNumber = (bw: string) => {
      const match = bw.match(/(\d+)/);
      return match ? parseInt(match[1]) : 0;
    };

    const current = extractNumber(currentBw);
    const newVal = extractNumber(newBw);

    if (current === newVal) return 'same';
    return newVal > current ? 'upgrade' : 'downgrade';
  };

  const getAvailableLMTypes = (link: any, newBandwidth?: string): string[] => {
    const bandwidth = newBandwidth || link.bandwidth;
    const addressType = link.addressType;

    // Extract numeric value from bandwidth string (e.g., "100 Mbps" -> 100)
    const bwValue = parseInt(bandwidth.match(/(\d+)/)?.[1] || '0');

    // If bandwidth > 100 Mbps, only Fiber is allowed
    if (bwValue > 100) {
      return ['Fiber'];
    }

    // If address type is DC or Connected Building, only Fiber is allowed
    if (addressType === 'Sify DC' || addressType === 'Connected DC' || addressType === 'Connected Building') {
      return ['Fiber'];
    }

    // Otherwise, all LM types are available
    return ['Fiber', 'Wireless', 'Broadband', 'BSO', '3G/4G'];
  };

  const isLMTypeValid = (link: any, newLMType: string, newBandwidth?: string): boolean => {
    const availableTypes = getAvailableLMTypes(link, newBandwidth);
    return availableTypes.includes(newLMType);
  };

  const hasConnectionChanges = () => {
    if (!originalConnection) return true; // If no original, allow save (new connection)

    // Compare all relevant fields
    return (
      currentConnection.addressLine1 !== originalConnection.addressLine1 ||
      currentConnection.addressLine2 !== originalConnection.addressLine2 ||
      currentConnection.state !== originalConnection.state ||
      currentConnection.city !== originalConnection.city ||
      currentConnection.pinCode !== originalConnection.pinCode ||
      currentConnection.latitude !== originalConnection.latitude ||
      currentConnection.longitude !== originalConnection.longitude ||
      currentConnection.bandwidthValue !== originalConnection.bandwidthValue ||
      currentConnection.contactName !== originalConnection.contactName ||
      currentConnection.contactEmail !== originalConnection.contactEmail ||
      currentConnection.contactPhone !== originalConnection.contactPhone ||
      currentConnection.isHub !== originalConnection.isHub ||
      JSON.stringify(currentConnection.connectionTypes) !== JSON.stringify(originalConnection.connectionTypes) ||
      JSON.stringify(currentConnection.vas) !== JSON.stringify(originalConnection.vas)
    );
  };

  const handleSubmit = () => {
    setShowSuccessDialog(true);
  };

  const getVASDisplay = (vas: VASItem, showDetails: boolean = false) => {
    switch (vas.type) {
      case 'ip':
        return `Additional IP (${vas.ipType || 'Not specified'})`;
      case 'managed':
        if (showDetails && vas.description) {
          return `${vas.service || 'Managed Services'} - ${vas.description}`;
        }
        return `Managed Services - ${vas.service || 'Not specified'}`;
      case 'device':
        return `Device - ${vas.switchModel || 'Not specified'}`;
      case 'ddos':
        return `DDOS Protection (${vas.mitigationCapacity || 'Not specified'})`;
      default:
        return 'VAS';
    }
  };

  // Bulk Upload Functions
  const downloadTemplate = () => {
    const headers = ['Address Line 1*', 'Address Line 2', 'City*', 'State*', 'Pin Code*', 'Bandwidth (Mbps)*', 'Last Mile Type*', 'Service Provider', 'Contact Name*', 'Contact Email*', 'Contact Phone*'];
    const sampleRow = ['123 Business Park', 'Tower A', 'Mumbai', 'Maharashtra', '400001', '100', 'Wireless', 'Airtel', 'John Doe', 'john@example.com', '9876543210'];
    const instructionRow1 = ['', '', '', '', '', '', 'Valid: Wireless, Fiber', 'Airtel, TCL, Vodafone, BSNL', '', '', ''];
    const csvContent = headers.join(',') + '\n' + sampleRow.join(',') + '\n' + instructionRow1.join(',') + '\n';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'service_request_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Template downloaded successfully');
  };

  const validateConnection = (conn: Partial<Connection>, index: number): string[] => {
    const errors: string[] = [];

    if (!conn.addressLine1?.trim()) errors.push('Address Line 1 is required');
    if (!conn.city?.trim()) errors.push('City is required');
    if (!conn.state?.trim()) errors.push('State is required');
    if (!conn.pinCode?.trim()) errors.push('Pin Code is required');
    else if (!/^\d{6}$/.test(conn.pinCode)) errors.push('Invalid Pin Code format');

    // Bandwidth validation - check both links for Dual
    if (!conn.bandwidthValue?.trim()) errors.push('Bandwidth is required for primary link');
    if (conn.numberOfLinks?.startsWith('Dual') && !conn.link2BandwidthValue?.trim()) {
      errors.push('Bandwidth is required for secondary link');
    }

    // LM Type validation - check both links for Dual
    if (!conn.connectionTypes || conn.connectionTypes.length === 0) errors.push('Last Mile Type is required for primary link');
    if (conn.numberOfLinks?.startsWith('Dual') && (!conn.link2ConnectionTypes || conn.link2ConnectionTypes.length === 0)) {
      errors.push('Last Mile Type is required for secondary link');
    }

    if (!conn.contactName?.trim()) errors.push('Contact Name is required');
    if (!conn.contactEmail?.trim()) errors.push('Contact Email is required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(conn.contactEmail)) errors.push('Invalid email format');
    if (!conn.contactPhone?.trim()) errors.push('Contact Phone is required');
    else if (!/^\d{10}$/.test(conn.contactPhone.replace(/[-\s]/g, ''))) errors.push('Invalid phone format');

    return errors;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());

      if (lines.length < 2) {
        toast.error('File is empty or invalid');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/\*/g, ''));
      const dataLines = lines.slice(1);

      const parsedConnections: Connection[] = [];
      const errors = new Map<string, string[]>();

      dataLines.forEach((line, index) => {
        const values = line.split(',').map(v => v.trim());

        // Parse connection type
        const connectionTypeStr = values[6] || '';
        const serviceProvider = values[7] || '';
        const connectionTypes: ConnectionTypeItem[] = [];

        if (connectionTypeStr) {
          const connType = connectionTypeStr.toLowerCase();
          if (connType === 'wireless') {
            connectionTypes.push({
              type: 'Wireless',
              isPrimary: true
            });
          } else if (connType === 'fiber') {
            connectionTypes.push({
              type: 'Fiber',
              isPrimary: true
            });
          }

          // Add service provider if provided
          if (serviceProvider && ['airtel', 'tcl', 'vodafone', 'bsnl'].includes(serviceProvider.toLowerCase())) {
            connectionTypes.push({
              type: 'Leased Line',
              isPrimary: false,
              serviceProviders: [serviceProvider],
              primaryProvider: serviceProvider
            });
          }
        }

        const conn: Partial<Connection> = {
          id: `bulk-${index + 1}`,
          numberOfLinks: 'Single',
          locationCategory: undefined,
          addressLine1: values[0] || '',
          addressLine2: values[1] || '',
          city: values[2] || '',
          state: values[3] || '',
          pinCode: values[4] || '',
          latitude: '',
          longitude: '',
          bandwidthValue: values[5] || '',
          connectionTypes: connectionTypes,
          contactName: values[8] || '',
          contactEmail: values[9] || '',
          contactPhone: values[10] || '',
          vas: [],
          isHub: false,
          linkType: '',
          portType: '',
          portBandwidth: ''
        };

        const validationErrors = validateConnection(conn, index);
        if (validationErrors.length > 0) {
          errors.set(conn.id!, validationErrors);
        }

        parsedConnections.push(conn as Connection);
      });

      setBulkUploadData(parsedConnections);
      setValidationErrors(errors);
      setShowBulkSummary(true);
      toast.success(`${parsedConnections.length} services uploaded. ${errors.size} invalid entries found.`);
    };

    reader.readAsText(file);
  };

  const downloadInvalidEntries = () => {
    const invalidEntries = bulkUploadData.filter(conn => validationErrors.has(conn.id));
    const headers = ['Address Line 1', 'Address Line 2', 'City', 'State', 'Pin Code', 'Bandwidth (Mbps)', 'Last Mile Type', 'Service Provider', 'Contact Name', 'Contact Email', 'Contact Phone', 'Remarks'];

    const csvRows = [headers.join(',')];
    invalidEntries.forEach(conn => {
      const errors = validationErrors.get(conn.id) || [];

      // Format connection type
      const primaryConn = conn.connectionTypes.find(ct => ct.type === 'Wireless' || ct.type === 'Fiber');
      const ispConn = conn.connectionTypes.find(ct => ct.type === 'Leased Line');
      const connectionTypeStr = primaryConn?.type || '';
      const serviceProviderStr = ispConn?.primaryProvider || '';

      const row = [
        conn.addressLine1,
        conn.addressLine2 || '',
        conn.city,
        conn.state,
        conn.pinCode,
        conn.bandwidthValue,
        connectionTypeStr,
        serviceProviderStr,
        conn.contactName,
        conn.contactEmail,
        conn.contactPhone,
        errors.join('; ')
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'invalid_entries_with_remarks.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Invalid entries downloaded');
  };

  const handleDeleteBulkService = (id: string) => {
    const updated = bulkUploadData.filter(conn => conn.id !== id);
    setBulkUploadData(updated);

    const newErrors = new Map(validationErrors);
    newErrors.delete(id);
    setValidationErrors(newErrors);

    toast.success('Service removed');
  };

  const handleConfirmBulkUpload = () => {
    if (validationErrors.size > 0) {
      toast.error('Please remove or fix all invalid entries before proceeding');
      return;
    }

    setConnections(bulkUploadData);
    setTotalConnections(bulkUploadData.length);
    setShowBulkSummary(false);
    setCurrentStep(3); // Move to step 3
    toast.success(`${bulkUploadData.length} services configured successfully`);
  };

  const loadSampleData = () => {
    const sampleData: Connection[] = getSampleConnectionData() as Connection[];

    // Validate the sample data
    const errors = new Map<string, string[]>();
    sampleData.forEach((conn, index) => {
      const validationErrors = validateConnection(conn, index);
      if (validationErrors.length > 0) {
        errors.set(conn.id, validationErrors);
      }
    });

    // Create a mock file object for sample data
    const mockFile = new File([''], 'sample_data.csv', { type: 'text/csv' });
    setUploadedFile(mockFile);

    setBulkUploadData(sampleData);
    setValidationErrors(errors);
    toast.success(`Sample data loaded: ${sampleData.length} services (${errors.size} invalid)`);
  };

  // Show Inventory Page if in modify flow
  if (showInventoryPage && requirementInfo.orderType === 'MDAC') {
    return (
      <LinkInventoryPage
        maxSelection={isAddingMoreLinks ? (10 - selectedLinks.length) : 10}
        productType={requirementInfo.product}
        onBack={() => {
          setShowInventoryPage(false);
          setIsAddingMoreLinks(false); // Reset flag on back
        }}
        onProceed={(links) => {
          // Convert lmType to connectionTypes format
          const linksWithConnectionTypes = links.map(link => ({
            ...link,
            connectionTypes: link.connectionTypes || (link.lmType ? [{
              type: link.lmType as any,
              isPrimary: true
            }] : [])
          }));

          // If adding more links, merge with existing (excluding duplicates); otherwise replace
          let finalLinks: any[];
          let newLinksCount = linksWithConnectionTypes.length;

          if (isAddingMoreLinks) {
            // Filter out links that are already selected to prevent duplicates
            const newLinks = linksWithConnectionTypes.filter(newLink =>
              !selectedLinks.some(existingLink => existingLink.id === newLink.id)
            );
            finalLinks = [...selectedLinks, ...newLinks];
            newLinksCount = newLinks.length;

            // Show warning if some links were already selected
            if (newLinks.length < linksWithConnectionTypes.length) {
              toast.warning(`${linksWithConnectionTypes.length - newLinks.length} link(s) already selected and skipped`);
            }
          } else {
            finalLinks = linksWithConnectionTypes;
          }

          setSelectedLinks(finalLinks);
          setShowInventoryPage(false);
          setIsAddingMoreLinks(false); // Reset flag

          // Automatically select and display the first link (either existing or new)
          if (finalLinks.length > 0) {
            // If adding more links, keep current selection; otherwise select first
            if (isAddingMoreLinks && currentModifyLink) {
              // Keep the current link selected
              const currentIndex = finalLinks.findIndex(l => l.id === currentModifyLink.id);
              if (currentIndex !== -1) {
                setSelectedLinkIndex(currentIndex);
              }
            } else {
              setSelectedLinkIndex(0);
              setCurrentModifyLink(finalLinks[0]);
              // Reset modification fields for the first link
              setSelectedNewBandwidth('');
              setModifyAddressType('');
              setModifyDCName('');
              setModifyConnectedDCName('');
              setModifyBuildingName('');
              setModifyRackDetails('');
              setModifyFloorDetails('');
              setModifyBlockTowerDetails('');
              setModifyAddressLine1('');
              setModifyAddressLine2('');
              setModifyCity('');
              setModifyState('');
              setModifyPinCode('');
              setModifyLatitude('');
              setModifyLongitude('');
              setModifyConnectionTypes([]);
            }

            // If individual mode, initialize empty modification types for new links
            if (modificationApplyType === 'individual') {
              const initialModifications: { [key: string]: { bandwidth: boolean; address: boolean; lm: boolean; addSecondaryTertiary: boolean } } =
                isAddingMoreLinks ? { ...individualLinkModifications } : {};

              finalLinks.forEach(link => {
                // Only initialize for new links that don't have modifications set
                if (!initialModifications[link.id]) {
                  initialModifications[link.id] = {
                    bandwidth: false,
                    address: false,
                    lm: false,
                    addSecondaryTertiary: false
                  };
                }
              });
              setIndividualLinkModifications(initialModifications);
            }
          }

          toast.success(
            isAddingMoreLinks
              ? `${newLinksCount} additional link${newLinksCount > 1 ? 's' : ''} added (Total: ${finalLinks.length})`
              : `${finalLinks.length} link${finalLinks.length > 1 ? 's' : ''} selected for MDAC`
          );
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-gray-900">New Service Request</h1>
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Network
            </Badge>
          </div>
        </div>
      </div>

      {/* Progress Steps - Only show when in stepper flow (currentStep > 0) */}
      {currentStep > 0 && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center">
              {[
                { num: 1, title: 'Customer & Requirements' },
                { num: 2, title: 'Raise Feasibility Request' },
                { num: 3, title: 'Review & Submit' }
              ].map((step, idx) => (
                <div key={step.num} className="flex items-center flex-1 last:flex-initial">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep > step.num
                        ? 'bg-green-500 text-white'
                        : currentStep === step.num
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                      {currentStep > step.num ? <CheckCircle className="w-5 h-5" /> : step.num}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${currentStep === step.num ? 'text-gray-900' : 'text-gray-500'}`}>
                        Step {step.num}
                      </p>
                      <p className={`text-xs ${currentStep === step.num ? 'text-gray-700' : 'text-gray-400'}`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                  {idx < 2 && (
                    <div className={`flex-1 h-1 mx-4 ${currentStep > step.num ? 'bg-green-500' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Step 0: Search & Selection Screen */}
        {currentStep === 0 && (
          <OpportunitySearch
            searchBy={searchBy}
            setSearchBy={setSearchBy}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            selectedCustomer={selectedCustomer}
            setSelectedCustomer={setSelectedCustomer}
            customerOpportunities={customerOpportunities}
            showOpportunityList={showOpportunityList}
            setShowOpportunityList={setShowOpportunityList}
            handleOpportunitySearch={handleOpportunitySearch}
            handleOpportunitySelect={handleOpportunitySelect}
            handleConfirmAndProceed={handleConfirmAndProceed}
          />
        )}

        {/* Step 1: Customer & Requirement Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            {/* Customer Information - Read-only view */}
            <Card>
              <Accordion type="single" collapsible defaultValue="">
                <AccordionItem value="customer-details" className="border-none">
                  <AccordionTrigger className="px-6 pt-6 pb-4 hover:no-underline">
                    <div className="flex flex-col items-start text-left">
                      <div className="flex items-center text-gray-900">
                        <Building className="w-5 h-5 mr-2" />
                        <span>Opportunity & Customer Details</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Selected opportunity and customer information (read-only)</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    {selectedCustomer && (
                      <div className="p-5 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm text-gray-900">Opportunity & Customer Details</h4>
                          <Badge className="bg-green-100 text-green-700">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Fetched from OSC
                          </Badge>
                        </div>

                        {/* Opportunity Details Section */}
                        <div className="mb-4 pb-4 border-b border-blue-200">
                          <p className="text-xs text-gray-500 mb-3">Opportunity Details</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-3">
                            <div>
                              <p className="text-xs text-gray-600">Opportunity ID</p>
                              <p className="text-sm text-gray-900">{selectedCustomer.opportunityId}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Opportunity Status</p>
                              <p className="text-sm text-gray-900">{selectedCustomer.opportunityStatus}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Sales Stage</p>
                              <p className="text-sm text-gray-900">{selectedCustomer.salesStage}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Lead BU Type</p>
                              <p className="text-sm text-gray-900">{selectedCustomer.leadBUType}</p>
                            </div>
                          </div>
                        </div>

                        {/* Customer Details Section */}
                        <div>
                          <p className="text-xs text-gray-500 mb-3">Customer Details</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-3">
                            <div>
                              <p className="text-xs text-gray-600">Company Name</p>
                              <p className="text-sm text-gray-900">{selectedCustomer.name}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Customer ID</p>
                              <p className="text-sm text-gray-900">{selectedCustomer.customerId}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Business Type</p>
                              <p className="text-sm text-gray-900">{selectedCustomer.businessType}</p>
                            </div>
                            <div className="md:col-span-2">
                              <p className="text-xs text-gray-600">Address</p>
                              <p className="text-sm text-gray-900">{selectedCustomer.address}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">PAN Number</p>
                              <p className="text-sm text-gray-900">{selectedCustomer.panNumber}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">GST Number</p>
                              <p className="text-sm text-gray-900">{selectedCustomer.gstNumber}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Primary Contact Name</p>
                              <p className="text-sm text-gray-900">{selectedCustomer.contactPersonName}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Primary Contact Email</p>
                              <p className="text-sm text-gray-900">{selectedCustomer.contactEmail}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>

            {/* Requirement Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <FileText className="w-5 h-5 mr-2" />
                  Requirement Information
                </CardTitle>
                <CardDescription>Specify the service requirements and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Requirement fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Requirement Name *</Label>
                    <Input
                      placeholder="Enter requirement name"
                      value={requirementInfo.requirementName}
                      onChange={(e) => setRequirementInfo({ ...requirementInfo, requirementName: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label>Priority *</Label>
                    <Select value={requirementInfo.priority} onValueChange={(val: string) => setRequirementInfo({ ...requirementInfo, priority: val })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Contract Term *</Label>
                    <Select value={requirementInfo.contractTerm} onValueChange={(val: string) => setRequirementInfo({ ...requirementInfo, contractTerm: val })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select term" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1 Year">1 Year</SelectItem>
                        <SelectItem value="2 Years">2 Years</SelectItem>
                        <SelectItem value="3 Years">3 Years</SelectItem>
                        <SelectItem value="4 Years">4 Years</SelectItem>
                        <SelectItem value="5 Years">5 Years</SelectItem>
                        <SelectItem value="Custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Expected Timeline</Label>
                    <Input
                      type="date"
                      value={requirementInfo.expectedTimeline}
                      onChange={(e) => setRequirementInfo({ ...requirementInfo, expectedTimeline: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Budget Range *</Label>
                    <Select value={requirementInfo.budgetRange} onValueChange={(val: string) => setRequirementInfo({ ...requirementInfo, budgetRange: val })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="₹10 L - ₹50 L">₹10 L - ₹50 L</SelectItem>
                        <SelectItem value="₹50 L - ₹1 Cr">₹50 L - ₹1 Cr</SelectItem>
                        <SelectItem value="₹1 Cr - ₹5 Cr">₹1 Cr - ₹5 Cr</SelectItem>
                        <SelectItem value="₹5 Cr - ₹10 Cr">₹5 Cr - ₹10 Cr</SelectItem>
                        <SelectItem value="₹10 Cr - ₹25 Cr">₹10 Cr - ₹25 Cr</SelectItem>
                        <SelectItem value="₹25 Cr+">₹25 Cr+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Billing Preference</Label>
                    <Select value={requirementInfo.billingPreference} onValueChange={(val: string) => setRequirementInfo({ ...requirementInfo, billingPreference: val })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select billing preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Monthly in advance">Monthly in advance</SelectItem>
                        <SelectItem value="Quarterly in advance">Quarterly in advance</SelectItem>
                        <SelectItem value="Monthly in arrears">Monthly in arrears</SelectItem>
                        <SelectItem value="Quarterly in arrears">Quarterly in arrears</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Project Objectives</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {[
                      'Business Expansion',
                      'On-Premise Migration',
                      'Cost Optimization',
                      'Regulatory / Compliance',
                      'Improved Performance / Uptime',
                      'Disaster Recovery'
                    ].map((objective) => (
                      <label key={objective} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={requirementInfo.projectObjectives.includes(objective)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setRequirementInfo({
                                ...requirementInfo,
                                projectObjectives: [...requirementInfo.projectObjectives, objective]
                              });
                            } else {
                              setRequirementInfo({
                                ...requirementInfo,
                                projectObjectives: requirementInfo.projectObjectives.filter(o => o !== objective)
                              });
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">{objective}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Requirement Description</Label>
                  <Textarea
                    placeholder="Describe the requirement in detail..."
                    rows={4}
                    value={requirementInfo.requirementDescription}
                    onChange={(e) => setRequirementInfo({ ...requirementInfo, requirementDescription: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Upload Related Document</Label>
                  <div className="mt-2 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 cursor-pointer">
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PDF, DOC, DOCX (Max 10MB)</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-2">
                  <h4 className="text-gray-900">Involved Consultant</h4>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add if any third party Consultant involved</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      placeholder="Consultant name"
                      value={requirementInfo.consultantName}
                      onChange={(e) => setRequirementInfo({ ...requirementInfo, consultantName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="consultant@email.com"
                      value={requirementInfo.consultantEmail}
                      onChange={(e) => setRequirementInfo({ ...requirementInfo, consultantEmail: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      placeholder="+91 XXXXX XXXXX"
                      value={requirementInfo.consultantPhone}
                      onChange={(e) => setRequirementInfo({ ...requirementInfo, consultantPhone: e.target.value })}
                    />
                  </div>
                </div>

                <Separator />

                {/* Current Infrastructure Landscape */}
                <div>
                  <h4 className="text-gray-900 mb-4">Current Infrastructure Landscape</h4>
                  <div className="space-y-4">
                    <div>
                      <Label>Infrastructure Landscape</Label>
                      <Textarea
                        placeholder="Describe the current infrastructure landscape..."
                        rows={3}
                        value={infrastructureInfo.infrastructureLandscape}
                        onChange={(e) => setInfrastructureInfo({ ...infrastructureInfo, infrastructureLandscape: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Current DC/HQ Location</Label>
                        <Input
                          placeholder="Enter location"
                          value={infrastructureInfo.currentDCHQLocation}
                          onChange={(e) => setInfrastructureInfo({ ...infrastructureInfo, currentDCHQLocation: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label>Current Hosting Model</Label>
                        <Select
                          value={infrastructureInfo.currentHostingModel}
                          onValueChange={(val: string) => setInfrastructureInfo({ ...infrastructureInfo, currentHostingModel: val })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select hosting model" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="On-Premise">On-Premise</SelectItem>
                            <SelectItem value="Cloud">Cloud</SelectItem>
                            <SelectItem value="Hybrid">Hybrid</SelectItem>
                            <SelectItem value="Colocation">Colocation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Existing Provider</Label>
                        <RadioGroup
                          value={infrastructureInfo.existingProvider}
                          onValueChange={(val: string) => setInfrastructureInfo({ ...infrastructureInfo, existingProvider: val, existingProviderName: val === 'No' ? '' : infrastructureInfo.existingProviderName })}
                        >
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Yes" id="existing-provider-yes" />
                              <Label htmlFor="existing-provider-yes" className="cursor-pointer font-normal">
                                Yes
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="No" id="existing-provider-no" />
                              <Label htmlFor="existing-provider-no" className="cursor-pointer font-normal">
                                No
                              </Label>
                            </div>
                          </div>
                        </RadioGroup>
                      </div>

                      {infrastructureInfo.existingProvider === 'Yes' && (
                        <div>
                          <Label>Existing Provider Name</Label>
                          <Input
                            placeholder="Enter provider name"
                            value={infrastructureInfo.existingProviderName}
                            onChange={(e) => setInfrastructureInfo({ ...infrastructureInfo, existingProviderName: e.target.value })}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <Label>Key Challenges</Label>
                      <Input
                        placeholder="Enter key challenges"
                        value={infrastructureInfo.keyChallenges}
                        onChange={(e) => setInfrastructureInfo({ ...infrastructureInfo, keyChallenges: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={() => setCurrentStep(2)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Continue to Product Selection
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Product Selection */}
        {currentStep === 2 && (
          <div className="space-y-6">
            {/* Product Selection Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg text-gray-900">Product Selection</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Select the product category for your service request</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Network Solutions Card - DC Colo (Enabled but not selectable) */}
                <div className="relative">
                  <Card className="border-2 border-gray-200 bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <Network className="w-6 h-6 text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-gray-900 mb-2">DC Colo</h4>
                          <p className="text-sm text-gray-600 mb-1">DC Colo products and services</p>
                          <p className="text-xs text-blue-600">Store: SIFY_DC_COLO</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Data Center Card - Sify Core Cloud (Enabled but not selectable) */}
                <div className="relative">
                  <Card className="border-2 border-gray-200 bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <Building className="w-6 h-6 text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-gray-900 mb-2">Sify Core Cloud</h4>
                          <p className="text-sm text-gray-600 mb-1">Sify Core Cloud products and services</p>
                          <p className="text-xs text-blue-600">Store: SIFY_CORE_CLOUD</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Cloud Services Card - SIFY NETWORK (Selected by default) */}
                <div className="relative transform scale-[1.02]">
                  <Card className="border-2 border-purple-500 bg-purple-50/30 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <Cloud className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-purple-900">SIFY NETWORK</h4>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                              Primary
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">SIFY NETWORK products and services</p>
                          <p className="text-xs text-blue-600">Store: SIFY_NETWORK_BU</p>
                        </div>
                      </div>
                      <div className="absolute top-3 right-3">
                        <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Business Development Assignment Section - Only show when SIFY NETWORK is selected */}
            {selectedProductCategory === 'cloud' && (
              <Card>
                <Accordion type="single" collapsible defaultValue="">
                  <AccordionItem value="bd-assignment" className="border-none">
                    <AccordionTrigger className="px-6 pt-6 pb-4 hover:no-underline">
                      <div className="flex flex-col items-start text-left">
                        <div className="flex items-center text-gray-900">
                          <User className="w-5 h-5 mr-2" />
                          <span>Business Development Assignment</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Select team member responsible for this request</p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Assigned To *</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select team member" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="john-doe">John Doe - Senior BD Manager</SelectItem>
                              <SelectItem value="jane-smith">Jane Smith - BD Manager</SelectItem>
                              <SelectItem value="robert-johnson">Robert Johnson - Account Manager</SelectItem>
                              <SelectItem value="emily-davis">Emily Davis - Solution Architect</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Assignment Date</Label>
                          <Input type="date" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Label>Notes (Optional)</Label>
                        <Textarea
                          placeholder="Add any special instructions or notes for the assigned team member..."
                          rows={3}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>
            )}

            {/* Network Solutions Content - Only show when SIFY NETWORK is selected */}
            {selectedProductCategory === 'cloud' && (
              <div className="border border-gray-200 rounded-lg bg-white">
                <div className="border-b border-gray-200 bg-gradient-to-b from-gray-50/50 to-white pt-[28px] pr-[28px] pb-[28px] pl-[28px]">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-gray-900 text-xl mb-2">Raise Feasibility Request</h2>
                      </div>
                      {(connections.length > 0 || showBulkSummary || bulkStep === 3) && (
                        <div className="text-right">
                          <span className="text-xs text-gray-600 mb-1 block">Created by</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {diaEntryMethod === 'bulk' ? 'Bulk Upload' : uploadMethod === 'manual' ? 'Manual Entry' : 'Bulk Upload'}
                            </Badge>
                            {uploadedFile && (diaEntryMethod === 'bulk' || uploadMethod === 'bulk') && (
                              <span className="text-sm text-gray-700">({uploadedFile.name})</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Selection - First item in Raise Feasibility Request */}
                  <div className="mt-6 mb-6 grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-900 mb-2 block">Product Type *</Label>
                      <Select
                        value={
                          requirementInfo.product === 'P2P' && requirementInfo.subProduct
                            ? `P2P - ${requirementInfo.subProduct}`
                            : requirementInfo.product
                        }
                        onValueChange={(val) => {
                          // Parse the selected value
                          if (val === 'DIA' || val === 'MPLS') {
                            setRequirementInfo({
                              ...requirementInfo,
                              product: val,
                              subProduct: ''
                            });
                          } else if (val.startsWith('P2P - ')) {
                            const subProduct = val.replace('P2P - ', '');
                            setRequirementInfo({
                              ...requirementInfo,
                              product: 'P2P',
                              subProduct: subProduct
                            });
                            // Set default feasibility count to 2 for P2P (1 pair)
                            setTotalConnections(2);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select product type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DIA">DIA</SelectItem>
                          <SelectItem value="MPLS">MPLS</SelectItem>
                          <SelectItem value="P2P - EPL">P2P - EPL</SelectItem>
                          <SelectItem value="P2P - DEPL">P2P - DEPL</SelectItem>
                          <SelectItem value="P2P - EVPL">P2P - EVPL</SelectItem>
                          <SelectItem value="P2P - GCC">P2P - GCC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-900 mb-2 block">Order Type *</Label>
                      <Select value={requirementInfo.orderType} onValueChange={(val: string) => setRequirementInfo({ ...requirementInfo, orderType: val })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select order type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="MDAC">MDAC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Entry Method Selection for DIA/MPLS */}
                {(requirementInfo.product === 'DIA' || requirementInfo.product === 'MPLS') && !showBulkSummary && (
                  <div className="px-[28px] pt-6 pb-[28px] border-t border-gray-200">
                    <Label className="text-gray-900 mb-3 block">Method of Submission *</Label>
                    {selectedLinks.length > 0 && requirementInfo.orderType === 'MDAC' ? (
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {diaEntryMethod === 'manual' ? 'Manually Enter' : 'Bulk Upload'}
                        </Badge>
                      </div>
                    ) : (
                      <RadioGroup
                        value={diaEntryMethod}
                        onValueChange={(val: 'manual' | 'bulk') => setDiaEntryMethod(val)}
                        className="flex items-center space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="manual" id="manual-entry" />
                          <Label htmlFor="manual-entry" className="cursor-pointer">Manually Enter</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="bulk" id="bulk-upload" />
                          <Label htmlFor="bulk-upload" className="cursor-pointer">Bulk Upload</Label>
                        </div>
                      </RadioGroup>
                    )}
                  </div>
                )}

                {/* MDAC Selection Summary - Show when links are selected */}
                {selectedLinks.length > 0 && requirementInfo.orderType === 'MDAC' && diaEntryMethod === 'manual' && (
                  <div className="px-[28px] py-6 bg-blue-50 border-t border-b border-blue-200">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-gray-900 mb-2 block">Selected Links</Label>
                        <div className="bg-white p-4 rounded-lg border border-blue-200">
                          <p className="text-xs text-gray-600 mb-1">Number of Links</p>
                          <p className="text-sm font-medium text-gray-900">{selectedLinks.length} link{selectedLinks.length > 1 ? 's' : ''} selected for MDAC</p>
                          <p className="text-xs text-gray-600 mt-2">Configure MDAC individually for each link below</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setShowInventoryPage(true);
                            setIsAddingMoreLinks(true);
                          }}
                          disabled={selectedLinks.length >= 10}
                          className="text-blue-600 border-blue-300 hover:bg-blue-50"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add More Links {selectedLinks.length >= 10 ? '(Max reached)' : `(${10 - selectedLinks.length} remaining)`}
                        </Button>
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => {
                            // Reset the flow
                            setSelectedLinks([]);
                            setLinkModifications({});
                            setModificationApplyType(null);
                            setModificationTypes({
                              bandwidth: false,
                              address: false,
                              lm: false,
                              addSecondaryTertiary: false
                            });
                            setIndividualLinkModifications({});
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Reset Selection
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Modify Flow - Direct Link Selection */}
                {(requirementInfo.product === 'DIA' || requirementInfo.product === 'MPLS') &&
                  requirementInfo.orderType === 'MDAC' &&
                  diaEntryMethod === 'manual' &&
                  selectedLinks.length === 0 && (
                    <div className="px-[28px] pt-6 pb-[28px] space-y-6">
                      <div>
                        <Label className="text-gray-900 mb-3 block">Select Links for MDAC</Label>
                        <p className="text-sm text-gray-600 mb-4">Select links from your inventory and configure MDAC individually for each link</p>

                        {/* Proceed to Inventory Button */}
                        <Button
                          onClick={() => {
                            // Auto-set to individual mode
                            setModificationApplyType('individual');
                            setShowInventoryPage(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Select Links from Inventory
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  )}

                {/* Bulk Upload Section for DIA/MPLS */}
                {(requirementInfo.product === 'DIA' || requirementInfo.product === 'MPLS') && diaEntryMethod === 'bulk' && !showBulkSummary && bulkStep === 2 && (
                  <div className="grid grid-cols-2 gap-6 px-[28px] pb-[28px]">
                    {/* Left Card: Bulk upload instructions */}
                    <Card className="border-gray-200">
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-gray-900 mb-2">1 Bulk upload upto Max 5000</h3>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-4">
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• Click "Download Template" to get the pre-formatted file.</li>
                          <li>• Fill in all mandatory fields for a successful upload - Address, Bandwidth and contact details.</li>
                          <li>• Ensure column headers remain unchanged.</li>
                        </ul>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleDownloadTemplate}>
                          <Download className="w-4 h-4 mr-2" />
                          Download Template
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Right Card: Upload file */}
                    <Card className="border-gray-200">
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-gray-900 mb-2">2 Upload Your File</h3>
                          </div>
                          <Button
                            variant="link"
                            className="text-green-600 hover:text-green-700 p-0 h-auto"
                            onClick={handleLoadSampleData}
                          >
                            Load Sample Data
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-4">
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• Save the file as a xlsx, xls or csv format.</li>
                          <li>• Upload it using the designated box below (Max size: 5MB).</li>
                          <li>• Click "Next" to view the summary list of submitted data along with remarks for review and proceed to submit for feasibility.</li>
                        </ul>

                        {!sampleDataLoaded ? (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                            <input
                              type="file"
                              accept=".xlsx,.xls,.csv"
                              className="hidden"
                              id="bulk-upload-input"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setUploadedFile(e.target.files[0]);
                                  toast.success('File uploaded successfully');
                                }
                              }}
                            />
                            <label htmlFor="bulk-upload-input" className="cursor-pointer">
                              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                              <p className="text-xs text-gray-500 mt-1">XLSX, XLS or CSV (Max 5MB)</p>
                            </label>
                          </div>
                        ) : (
                          <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                  <FileText className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                  <p className="text-sm text-gray-900">{uploadedFile?.name || 'sample_data.csv'}</p>
                                  <p className="text-xs text-gray-600">{uploadedServices.length} services loaded</p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSampleDataLoaded(false);
                                  setUploadedServices([]);
                                  setUploadedFile(null);
                                }}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}

                        {sampleDataLoaded && (
                          <Button
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            onClick={() => setBulkStep(3)}
                          >
                            Next
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Step 3: Services Validation */}
                {(requirementInfo.product === 'DIA' || requirementInfo.product === 'MPLS') && diaEntryMethod === 'bulk' && bulkStep === 3 && (
                  <div className="px-[28px] pt-6 pb-[28px]">
                    {/* Services Preview Table Card */}
                    <Card className="border-gray-200">
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-gray-900 mb-2">Services Preview</h3>
                            <p className="text-sm text-gray-600">Review and validate all uploaded services</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Draft ID</p>
                            <p className="text-sm text-gray-900">D23001</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Request Type</p>
                            <p className="text-sm text-gray-900">{requirementInfo.orderType || 'New'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Total Services</p>
                            <p className="text-sm text-gray-900">{uploadedServices.length}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Feasibility Items</p>
                            <p className="text-sm text-gray-900">{uploadedServices.filter(s => s.status === 'valid').length + uploadedServices.filter(s => s.status === 'invalid').length}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Invalid Entries</p>
                            <p className="text-sm text-red-600">{uploadedServices.filter(s => s.status === 'invalid').length}</p>
                          </div>
                        </div>

                        {/* Services Table */}
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm text-gray-900">Services List</h4>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download with Remarks
                          </Button>
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-gray-50">
                                <TableHead className="w-12">#</TableHead>
                                {requirementInfo.orderType === 'MDAC' && <TableHead>Link ID</TableHead>}
                                <TableHead>Address</TableHead>
                                <TableHead>Bandwidth</TableHead>
                                <TableHead>Last Mile Type</TableHead>
                                {requirementInfo.orderType === 'New' && <TableHead>Cross Connect</TableHead>}
                                {requirementInfo.orderType === 'New' && <TableHead>Port Details 1</TableHead>}
                                {requirementInfo.orderType === 'New' && <TableHead>Port Details 2</TableHead>}
                                {requirementInfo.orderType === 'MDAC' && <TableHead className="w-[140px]">MDAC</TableHead>}
                                <TableHead>Contact Details</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-20">Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {uploadedServices.map((service, index) => (
                                <TableRow key={service.id} className={service.status === 'invalid' ? 'bg-red-50/30' : ''}>
                                  <TableCell>{index + 1}</TableCell>
                                  {requirementInfo.orderType === 'MDAC' && (
                                    <TableCell>
                                      <Badge variant="outline" className="bg-gray-50 text-gray-700 font-mono text-xs">
                                        {service.linkId || `LINK-${String(index + 1).padStart(3, '0')}`}
                                      </Badge>
                                    </TableCell>
                                  )}
                                  <TableCell>
                                    <div className="text-sm">
                                      <p className="text-gray-900">{service.addressLine1 || '-'}</p>
                                      {service.addressLine2 && <p className="text-gray-600">{service.addressLine2}</p>}
                                      <p className="text-gray-600">
                                        {[service.city, service.state, service.pinCode].filter(Boolean).join(', ') || '-'}
                                      </p>
                                    </div>
                                  </TableCell>
                                  <TableCell>{service.bandwidth || '-'}</TableCell>
                                  <TableCell>
                                    {service.connectionType && service.connectionType.length > 0 ? (
                                      <div className="flex flex-wrap gap-1">
                                        {service.connectionType.map((type: string, idx: number) => {
                                          // Normalize to only show the 4 defined LM types
                                          const normalizedType =
                                            type === 'Fiber' ? 'Fiber' :
                                              type === 'Wireless' ? 'Wireless' :
                                                type === 'Broadband' ? 'Broadband' :
                                                  type === 'BSO' ? 'BSO' :
                                                    type === '3G/4G' ? '3G/4G' :
                                                      'Leased Line';

                                          return (
                                            <Badge
                                              key={idx}
                                              variant="outline"
                                              className={
                                                normalizedType === 'Fiber' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                  normalizedType === 'Wireless' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    normalizedType === 'Broadband' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                                      normalizedType === 'BSO' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                        normalizedType === '3G/4G' ? 'bg-pink-50 text-pink-700 border-pink-200' :
                                                          'bg-purple-50 text-purple-700 border-purple-200'
                                              }
                                            >
                                              {normalizedType}
                                            </Badge>
                                          );
                                        })}
                                      </div>
                                    ) : '-'}
                                  </TableCell>
                                  {requirementInfo.orderType === 'New' && (
                                    <TableCell>
                                      <p className="text-xs text-gray-900">{formatCrossConnect(service)}</p>
                                    </TableCell>
                                  )}
                                  {requirementInfo.orderType === 'New' && (
                                    <TableCell>
                                      {formatPortDetails(service, 1)}
                                    </TableCell>
                                  )}
                                  {requirementInfo.orderType === 'New' && (
                                    <TableCell>
                                      {formatPortDetails(service, 2)}
                                    </TableCell>
                                  )}
                                  {requirementInfo.orderType === 'MDAC' && (
                                    <TableCell className="w-[140px]">
                                      {(() => {
                                        console.log('🔎 Rendering service:', service.id, 'linkId:', service.linkId, 'serviceChanges:', service.serviceChanges, 'type:', typeof service.serviceChanges, 'isArray:', Array.isArray(service.serviceChanges));
                                        console.log('🔎 Full service object:', JSON.stringify(service, null, 2));

                                        // TEMPORARY TEST: Force display for debugging
                                        const testChanges = service.linkId === 'LINK-001' ? ['Bandwidth'] :
                                          service.linkId === 'LINK-002' ? ['LM Type'] :
                                            service.linkId === 'LINK-003' ? ['Address'] :
                                              service.linkId === 'LINK-004' ? ['Add Link'] :
                                                service.linkId === 'LINK-005' ? ['Bandwidth', 'LM Type'] : [];

                                        console.log('🧪 TEST serviceChanges for', service.linkId, ':', testChanges);

                                        // Use explicit serviceChanges if available, otherwise calculate on the fly
                                        let changes = service.serviceChanges || testChanges;

                                        // Fallback: if serviceChanges is empty, calculate it here
                                        if ((!changes || changes.length === 0) && service.changeType) {
                                          const calculated: string[] = [];

                                          if (service.currentBandwidth && service.bandwidth && service.currentBandwidth !== service.bandwidth) {
                                            calculated.push('Bandwidth');
                                          }

                                          const currentLM = JSON.stringify(service.currentConnectionType || []);
                                          const newLM = JSON.stringify(service.connectionType || []);
                                          if (currentLM !== newLM) {
                                            calculated.push('LM Type');
                                          }

                                          if (service.changeType.includes('Add Secondary') || service.changeType.includes('Add Tertiary')) {
                                            calculated.push('Add Link');
                                          }

                                          if (service.changeType.includes('Address')) {
                                            calculated.push('Address');
                                          }

                                          changes = calculated;
                                          console.log('📊 Calculated on render:', service.id, calculated);
                                        }

                                        return changes && changes.length > 0 ? (
                                          <div className="flex flex-wrap gap-1">
                                            {changes.map((change: string, idx: number) => (
                                              <Badge
                                                key={idx}
                                                variant="outline"
                                                className="bg-orange-50 text-orange-700 border-orange-200"
                                              >
                                                {change}
                                              </Badge>
                                            ))}
                                          </div>
                                        ) : (
                                          <span className="text-xs text-gray-500">No changes</span>
                                        );
                                      })()}
                                    </TableCell>
                                  )}
                                  <TableCell>
                                    <div className="text-sm">
                                      <p className="text-gray-900">{service.contactName || '-'}</p>
                                      <p className="text-gray-600">{service.contactEmail || '-'}</p>
                                      <p className="text-gray-600">{service.contactPhone || '-'}</p>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {service.status === 'valid' ? (
                                      <Badge className="bg-green-100 text-green-700 border-green-200">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Valid
                                      </Badge>
                                    ) : (
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger>
                                            <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                                              <AlertCircle className="w-3 h-3 mr-1" />
                                              Invalid
                                            </Badge>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <div className="text-xs">
                                              {service.errors?.map((err: string, idx: number) => (
                                                <p key={idx}>• {err}</p>
                                              ))}
                                            </div>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const updatedServices = uploadedServices.filter(s => s.id !== service.id);
                                        setUploadedServices(updatedServices);
                                        toast.success('Service removed');
                                      }}
                                    >
                                      <Trash2 className="w-4 h-4 text-red-600" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>

                        {/* Invalid Entries Warning */}
                        {uploadedServices.filter(s => s.status === 'invalid').length > 0 && (
                          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm text-red-900">
                                <span className="font-medium">{uploadedServices.filter(s => s.status === 'invalid').length} invalid entries found.</span>
                                {' '}Please remove invalid entries to continue, or download the invalid entries with remarks to correct and re-upload.
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              onClick={() => setCurrentStep(1)}
                            >
                              <ArrowLeft className="w-4 h-4 mr-2" />
                              Back to Basic Info
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setBulkStep(2);
                              }}
                            >
                              <ArrowLeft className="w-4 h-4 mr-2" />
                              Back to Upload
                            </Button>
                            <div className="relative">
                              <input
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                className="hidden"
                                id="services-list-reupload"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    setUploadedFile(e.target.files[0]);
                                    const newSampleData = [
                                      {
                                        id: '1',
                                        address: '123 Tech Park\nBuilding A\nMumbai, Maharashtra, 400001',
                                        addressLine1: '123 Tech Park',
                                        addressLine2: 'Building A',
                                        city: 'Mumbai',
                                        state: 'Maharashtra',
                                        pinCode: '400001',
                                        bandwidth: '100 Mbps',
                                        connectionType: ['Wireless'],
                                        contactName: 'John Doe',
                                        contactEmail: 'john.doe@example.com',
                                        contactPhone: '9876543210',
                                        status: 'valid' as const
                                      },
                                      {
                                        id: '2',
                                        address: '456 Business Center\nDelhi, Delhi, 110001',
                                        addressLine1: '456 Business Center',
                                        addressLine2: '',
                                        city: 'Delhi',
                                        state: 'Delhi',
                                        pinCode: '110001',
                                        bandwidth: '200 Mbps',
                                        connectionType: ['Fiber', 'Airtel'],
                                        contactName: 'Jane Smith',
                                        contactEmail: 'jane.smith@example.com',
                                        contactPhone: '9876543211',
                                        status: 'valid' as const
                                      }
                                    ];
                                    setUploadedServices(newSampleData);
                                    toast.success('File re-uploaded successfully with corrected entries');
                                  }
                                }}
                              />
                              <Button
                                variant="outline"
                                onClick={() => document.getElementById('services-list-reupload')?.click()}
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                Re-upload
                              </Button>
                            </div>
                          </div>
                          <Button
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={uploadedServices.filter(s => s.status === 'invalid').length > 0}
                            onClick={() => {
                              // Convert uploaded services to connections format
                              const convertedConnections = uploadedServices.map((service, index) => ({
                                id: `bulk-${index + 1}`,
                                numberOfLinks: 'Single',
                                addressLine1: service.addressLine1,
                                addressLine2: service.addressLine2,
                                city: service.city,
                                state: service.state,
                                pinCode: service.pinCode,
                                bandwidthValue: service.bandwidth,
                                connectionTypes: service.connectionType?.map((type: string) => ({
                                  type: type === 'Fiber' || type === 'Wireless' || type === 'Broadband' || type === 'BSO' || type === '3G/4G' ? type : 'Leased Line',
                                  isPrimary: false
                                })) || [],
                                contactName: service.contactName,
                                contactEmail: service.contactEmail,
                                contactPhone: service.contactPhone,
                                addressType: 'Custom Location' as const,
                              }));
                              setConnections(convertedConnections);
                              setCurrentStep(3);
                            }}
                          >
                            Continue to Review & Submit
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}



                {/* Initialize Section */}
                {(requirementInfo.product === 'DIA' || requirementInfo.product === 'MPLS') && connections.length === 0 && !showBulkSummary && diaEntryMethod === 'manual' && requirementInfo.orderType !== 'MDAC' && (
                  <div className="flex items-center justify-between px-[28px] pt-6 pb-[28px]">
                    <div className="flex items-center space-x-4">
                      <Label className="text-gray-900">Feasibility Count:</Label>
                      {false ? ( // P2P feature not yet available for product type 'DIA' | 'MPLS'
                        <div className="contents">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setTotalConnections(Math.max(2, totalConnections - 2))}
                              className="h-9 w-9 p-0"
                            >
                              -
                            </Button>
                            <div className="w-24 h-9 border border-gray-300 rounded-md flex items-center justify-center bg-white">
                              <span className="text-sm font-medium">{totalConnections}</span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setTotalConnections(Math.min(50, totalConnections + 2))}
                              className="h-9 w-9 p-0"
                            >
                              +
                            </Button>
                          </div>
                          <span className="text-xs text-gray-500">({totalConnections / 2} pair{totalConnections > 2 ? 's' : ''})</span>
                        </div>
                      ) : (
                        <Input
                          type="number"
                          min={requirementInfo.networkType === 'MPLS' ? "2" : "1"}
                          max="50"
                          value={totalConnections}
                          onChange={(e) => {
                            const minCount = requirementInfo.networkType === 'MPLS' ? 2 : 1;
                            const count = Math.max(parseInt(e.target.value) || minCount, minCount);
                            setTotalConnections(count);
                          }}
                          className="w-24 text-center"
                        />
                      )}
                    </div>
                    <Button
                      onClick={() => initializeConnections(totalConnections)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Network className="w-4 h-4 mr-2" />
                      Submit
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Bulk Upload Summary */}
            {showBulkSummary && bulkUploadData.length > 0 && (
              <div className="space-y-4">
                {/* Basic Details Card */}
                <Card>
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-200">
                    <CardTitle className="text-gray-900">Upload Summary</CardTitle>
                    <CardDescription>Review and validate uploaded services</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-5 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-gray-600">Draft ID</p>
                        <p className="text-gray-900">D23001</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-600">Request Type</p>
                        <p className="text-gray-900">New</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-600">Total Services</p>
                        <p className="text-gray-900">{bulkUploadData.length}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-600">Feasibility Items</p>
                        <p className="text-gray-900">{bulkUploadData.reduce((total, conn) => total + (conn.connectionTypes?.length || 0), 0)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-600">Invalid Entries</p>
                        <p className="text-red-600">{validationErrors.size}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Services List */}
                <Card>
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-gray-900">Services List</CardTitle>
                        <CardDescription>Review all uploaded services</CardDescription>
                      </div>
                      {validationErrors.size > 0 && (
                        <Button
                          variant="outline"
                          onClick={downloadInvalidEntries}
                          className="border-gray-900 text-gray-900 hover:bg-gray-50"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download with Remarks
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">#</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Bandwidth</TableHead>
                            <TableHead>Last Mile Type</TableHead>
                            <TableHead>Contact Details</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-20">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bulkUploadData.map((conn, index) => {
                            const errors = validationErrors.get(conn.id);
                            const isInvalid = errors && errors.length > 0;

                            return (
                              <TableRow key={conn.id} className={isInvalid ? 'bg-red-50' : ''}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                  <div className="space-y-1">
                                    <p className="text-sm text-gray-900">{conn.addressLine1 || '-'}</p>
                                    {conn.addressLine2 && (
                                      <p className="text-xs text-gray-600">{conn.addressLine2}</p>
                                    )}
                                    <p className="text-xs text-gray-600">
                                      {[conn.city, conn.state, conn.pinCode].filter(Boolean).join(', ') || '-'}
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell>{conn.bandwidthValue ? `${conn.bandwidthValue} Mbps` : '-'}</TableCell>
                                <TableCell>
                                  {conn.connectionTypes && conn.connectionTypes.length > 0 ? (
                                    <div className="space-y-1">
                                      {conn.connectionTypes.map((ct, idx) => {
                                        if (ct.type === 'Leased Line' && ct.primaryProvider) {
                                          return (
                                            <div key={idx} className="text-xs">
                                              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                                {ct.primaryProvider}
                                              </Badge>
                                            </div>
                                          );
                                        }
                                        return (
                                          <div key={idx} className="text-xs">
                                            <Badge variant="outline" className={
                                              ct.type === 'Fiber' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                ct.type === 'Wireless' ? 'bg-green-50 text-green-700 border-green-200' :
                                                  'bg-gray-50 text-gray-700 border-gray-200'
                                            }>
                                              {ct.type}
                                            </Badge>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ) : '-'}
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-1">
                                    <p className="text-sm text-gray-900">{conn.contactName || '-'}</p>
                                    <p className="text-xs text-gray-600">{conn.contactEmail || '-'}</p>
                                    <p className="text-xs text-gray-600">{conn.contactPhone || '-'}</p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {isInvalid ? (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="flex items-center space-x-1 text-red-600 cursor-help">
                                          <AlertCircle className="w-4 h-4" />
                                          <span className="text-xs">Invalid</span>
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent className="max-w-xs">
                                        <div className="space-y-1">
                                          {errors.map((error, idx) => (
                                            <p key={idx} className="text-xs">• {error}</p>
                                          ))}
                                        </div>
                                      </TooltipContent>
                                    </Tooltip>
                                  ) : (
                                    <div className="flex items-center space-x-1 text-green-600">
                                      <CheckCircle2 className="w-4 h-4" />
                                      <span className="text-xs">Valid</span>
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteBulkService(conn.id)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>

                    {validationErrors.size > 0 && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                          <div className="flex-1 text-sm text-red-900">
                            <p>
                              <strong>{validationErrors.size} invalid entries found.</strong> Please remove invalid entries to continue, or download the invalid entries with remarks to correct and re-upload.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowBulkSummary(false);
                          setBulkUploadData([]);
                          setValidationErrors(new Map());
                          setUploadedFile(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleConfirmBulkUpload}
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={validationErrors.size > 0}
                      >
                        Confirm & Continue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Two-Panel Layout for Modify Flow */}
            {selectedLinks.length > 0 && requirementInfo.orderType === 'MDAC' && diaEntryMethod === 'manual' && (
              <div className="grid grid-cols-12 gap-6">
                {/* Left Panel - Selected Links List */}
                <div className="col-span-4">
                  <Card className="border-2 border-gray-200 shadow-md">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                      <CardTitle className="text-gray-900 flex items-center">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                          <Network className="w-4 h-4 text-white" />
                        </div>
                        Links to Modify
                      </CardTitle>
                      <CardDescription className="ml-11">
                        <span className="block mt-2 text-gray-600">
                          Configure MDAC individually for each link
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      {/* Status Summary */}
                      <div className="mb-4 p-4 bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium text-gray-700">Saved</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">In Progress</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-5 h-5 rounded-full bg-gray-300" />
                            <span className="text-sm font-medium text-gray-700">Pending</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-2xl font-bold text-gray-900">{getLinkStatusCounts().saved}</span>
                          <span className="text-2xl font-bold text-gray-900">{getLinkStatusCounts().inProgress}</span>
                          <span className="text-2xl font-bold text-gray-900">{getLinkStatusCounts().pending}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {selectedLinks.map((link, idx) => {
                          const linkStatus = getLinkModificationStatus(link.id);
                          return (
                            <div
                              key={link.id}
                              onClick={() => {
                                setSelectedLinkIndex(idx);
                                setCurrentModifyLink(link);
                                // Load saved modifications for this link if they exist
                                if (linkModifications[link.id]) {
                                  setSelectedNewBandwidth(linkModifications[link.id].newBandwidth || '');
                                  setModifyAddressType(linkModifications[link.id].newAddressType || '');
                                  setModifyDCName(linkModifications[link.id].newDCName || '');
                                  setModifyConnectedDCName(linkModifications[link.id].newConnectedDCName || '');
                                  setModifyBuildingName(linkModifications[link.id].newBuildingName || '');
                                  setModifyAddressLine1(linkModifications[link.id].newAddressLine1 || '');
                                  setModifyAddressLine2(linkModifications[link.id].newAddressLine2 || '');
                                  setModifyCity(linkModifications[link.id].newCity || '');
                                  setModifyState(linkModifications[link.id].newState || '');
                                  setModifyPinCode(linkModifications[link.id].newPinCode || '');
                                  setModifyLatitude(linkModifications[link.id].newLatitude || '');
                                  setModifyLongitude(linkModifications[link.id].newLongitude || '');
                                  const savedLMType = linkModifications[link.id].newLMType || [];

                                  // Auto-populate Fiber if LM modification is checked, building is fiber-only, and no LM type saved
                                  const linkModTypes = modificationApplyType === 'individual'
                                    ? individualLinkModifications[link.id]
                                    : modificationTypes;
                                  const isFiberOnly = link.addressType === 'Sify DC' || link.addressType === 'Connected DC' || link.addressType === 'Connected Building';

                                  if (linkModTypes?.lm && isFiberOnly && savedLMType.length === 0) {
                                    setModifyConnectionTypes([{ type: 'Fiber', isPrimary: true }]);
                                  } else {
                                    setModifyConnectionTypes(savedLMType);
                                  }
                                } else {
                                  // Reset fields if no saved modifications
                                  setSelectedNewBandwidth('');
                                  setModifyAddressType('');
                                  setModifyDCName('');
                                  setModifyConnectedDCName('');
                                  setModifyBuildingName('');
                                  setModifyAddressLine1('');
                                  setModifyAddressLine2('');
                                  setModifyCity('');
                                  setModifyState('');
                                  setModifyPinCode('');
                                  setModifyLatitude('');
                                  setModifyLongitude('');

                                  // Auto-populate Fiber if LM modification is checked and building is fiber-only
                                  const linkModTypes = modificationApplyType === 'individual'
                                    ? individualLinkModifications[link.id]
                                    : modificationTypes;
                                  const isFiberOnly = link.addressType === 'Sify DC' || link.addressType === 'Connected DC' || link.addressType === 'Connected Building';

                                  if (linkModTypes?.lm && isFiberOnly) {
                                    setModifyConnectionTypes([{ type: 'Fiber', isPrimary: true }]);
                                  } else {
                                    setModifyConnectionTypes([]);
                                  }
                                }
                              }}
                              className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${selectedLinkIndex === idx
                                  ? 'border-blue-500 bg-blue-50 shadow-md'
                                  : 'border-gray-200 bg-white hover:border-blue-300'
                                }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-900 font-medium">{link.linkId}</span>
                                  {linkStatus === 'completed' && (
                                    <>
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                      <span className="text-xs font-medium text-green-600">Saved</span>
                                    </>
                                  )}
                                  {linkStatus === 'in-progress' && (
                                    <>
                                      <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                      </div>
                                      <span className="text-xs font-medium text-orange-600">In Progress</span>
                                    </>
                                  )}
                                  {linkStatus === 'pending' && (
                                    <div className="w-4 h-4 rounded-full bg-gray-300" />
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 hover:bg-red-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteModifyLink(link.id);
                                  }}
                                >
                                  <Trash2 className="w-3 h-3 text-red-600" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Add Link Button */}
                      {selectedLinks.length < 10 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={addMoreLinks}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add More Links ({10 - selectedLinks.length} remaining)
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Right Panel - Link Modification Form */}
                <div className="col-span-8">
                  {currentModifyLink ? (
                    <Card className="border-2 border-gray-200 shadow-md">
                      <CardHeader className="bg-gradient-to-r from-purple-50 to-white border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-gray-900">Modify Link: {currentModifyLink.linkId}</CardTitle>
                            <CardDescription>Update link configuration details</CardDescription>
                          </div>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {currentModifyLink.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-6">
                        {/* Current Details Section */}
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center mb-3">
                            <Info className="w-4 h-4 text-blue-600 mr-2" />
                            <h4 className="text-sm text-blue-900">Current Link Details</h4>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-gray-600">Bandwidth:</p>
                              <p className="text-gray-900 font-medium">{currentModifyLink.bandwidth}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">LM Type:</p>
                              <p className="text-gray-900 font-medium">{currentModifyLink.lmType}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-gray-600">Address:</p>
                              <p className="text-gray-900 font-medium">{currentModifyLink.address}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Building Type:</p>
                              <p className="text-gray-900 font-medium">{currentModifyLink.addressType}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Port Type:</p>
                              <p className="text-gray-900 font-medium">{currentModifyLink.portType}</p>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Individual Mode - MDAC Selector for this link */}
                        {modificationApplyType === 'individual' && currentModifyLink && (
                          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div>
                              <Label className="text-gray-900 mb-3 block">MDAC required for {currentModifyLink.linkId} *</Label>
                              <p className="text-sm text-gray-600 mb-3">Select the MDAC for this specific link</p>
                              <div className="space-y-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`individual-bandwidth-${currentModifyLink.id}`}
                                          checked={individualLinkModifications[currentModifyLink.id]?.bandwidth || false}
                                          disabled={individualLinkModifications[currentModifyLink.id]?.addSecondaryTertiary || false}
                                          onCheckedChange={(checked: boolean) => {
                                            setIndividualLinkModifications({
                                              ...individualLinkModifications,
                                              [currentModifyLink.id]: {
                                                ...individualLinkModifications[currentModifyLink.id],
                                                bandwidth: checked as boolean
                                              }
                                            });
                                          }}
                                        />
                                        <Label htmlFor={`individual-bandwidth-${currentModifyLink.id}`} className="cursor-pointer text-sm">
                                          Bandwidth Modification
                                        </Label>
                                      </div>
                                    </TooltipTrigger>
                                    {individualLinkModifications[currentModifyLink.id]?.addSecondaryTertiary && (
                                      <TooltipContent side="top" sideOffset={4}>
                                        <p>Cannot select other options when "Add secondary/tertiary link" is selected</p>
                                      </TooltipContent>
                                    )}
                                  </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`individual-address-${currentModifyLink.id}`}
                                          checked={individualLinkModifications[currentModifyLink.id]?.address || false}
                                          disabled={individualLinkModifications[currentModifyLink.id]?.addSecondaryTertiary || false}
                                          onCheckedChange={(checked: boolean) => {
                                            setIndividualLinkModifications({
                                              ...individualLinkModifications,
                                              [currentModifyLink.id]: {
                                                ...individualLinkModifications[currentModifyLink.id],
                                                address: checked as boolean
                                              }
                                            });
                                          }}
                                        />
                                        <Label htmlFor={`individual-address-${currentModifyLink.id}`} className="cursor-pointer text-sm">
                                          Address Change
                                        </Label>
                                      </div>
                                    </TooltipTrigger>
                                    {individualLinkModifications[currentModifyLink.id]?.addSecondaryTertiary && (
                                      <TooltipContent side="top" sideOffset={4}>
                                        <p>Cannot select other options when "Add secondary/tertiary link" is selected</p>
                                      </TooltipContent>
                                    )}
                                  </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`individual-lm-${currentModifyLink.id}`}
                                          checked={individualLinkModifications[currentModifyLink.id]?.lm || false}
                                          disabled={individualLinkModifications[currentModifyLink.id]?.addSecondaryTertiary || false}
                                          onCheckedChange={(checked: boolean) => {
                                            setIndividualLinkModifications({
                                              ...individualLinkModifications,
                                              [currentModifyLink.id]: {
                                                ...individualLinkModifications[currentModifyLink.id],
                                                lm: checked as boolean
                                              }
                                            });

                                            // Auto-populate Fiber if checking LM and current link is fiber-only building
                                            if (checked && currentModifyLink) {
                                              const isFiberOnly =
                                                currentModifyLink.addressType === 'Sify DC' ||
                                                currentModifyLink.addressType === 'Connected DC' ||
                                                currentModifyLink.addressType === 'Connected Building';

                                              if (isFiberOnly && modifyConnectionTypes.length === 0) {
                                                setModifyConnectionTypes([{ type: 'Fiber', isPrimary: true }]);
                                              }
                                            }
                                          }}
                                        />
                                        <Label htmlFor={`individual-lm-${currentModifyLink.id}`} className="cursor-pointer text-sm">
                                          Last Mile (LM) Type Change
                                        </Label>
                                      </div>
                                    </TooltipTrigger>
                                    {individualLinkModifications[currentModifyLink.id]?.addSecondaryTertiary && (
                                      <TooltipContent side="top" sideOffset={4}>
                                        <p>Cannot select other options when "Add secondary/tertiary link" is selected</p>
                                      </TooltipContent>
                                    )}
                                  </Tooltip>
                                </TooltipProvider>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`individual-secondary-${currentModifyLink.id}`}
                                    checked={individualLinkModifications[currentModifyLink.id]?.addSecondaryTertiary || false}
                                    onCheckedChange={(checked: boolean) => {
                                      setIndividualLinkModifications({
                                        ...individualLinkModifications,
                                        [currentModifyLink.id]: {
                                          ...individualLinkModifications[currentModifyLink.id],
                                          addSecondaryTertiary: checked as boolean,
                                          // Disable other options if this is selected
                                          bandwidth: checked ? false : individualLinkModifications[currentModifyLink.id]?.bandwidth,
                                          address: checked ? false : individualLinkModifications[currentModifyLink.id]?.address,
                                          lm: checked ? false : individualLinkModifications[currentModifyLink.id]?.lm
                                        }
                                      });
                                    }}
                                  />
                                  <Label htmlFor={`individual-secondary-${currentModifyLink.id}`} className="cursor-pointer text-sm">
                                    Add secondary/tertiary link
                                  </Label>
                                </div>
                              </div>
                              {individualLinkModifications[currentModifyLink.id]?.addSecondaryTertiary && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                  <div className="flex items-start space-x-2">
                                    <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-blue-900">
                                      Adding a secondary/tertiary link will create a new link at the same location. The address will be pre-populated and non-editable.
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Modification Fields */}
                        <div className="space-y-6">
                          <h4 className="text-gray-900">
                            {currentModifyLink && getLinkModificationTypes(currentModifyLink.id).addSecondaryTertiary
                              ? 'New Secondary/Tertiary Link Details'
                              : 'Modification Details'}
                          </h4>

                          {/* Special: Add Secondary/Tertiary Link Flow */}
                          {currentModifyLink && getLinkModificationTypes(currentModifyLink.id).addSecondaryTertiary && (
                            <>
                              {/* Pre-populated Address (Non-editable) */}
                              <div className="space-y-3">
                                <Label className="text-gray-900">Address (Same as Primary Link)</Label>
                                <div className="p-4 bg-gray-100 rounded-lg border border-gray-300">
                                  <div className="space-y-2 text-sm">
                                    <div>
                                      <span className="text-gray-600">Address: </span>
                                      <span className="text-gray-900 font-medium">{currentModifyLink.address}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Building Type: </span>
                                      <span className="text-gray-900 font-medium">{currentModifyLink.addressType}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 flex items-start">
                                      <Info className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                                      The secondary/tertiary link will be created at the same location as this link. Address cannot be changed.
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Bandwidth for New Link */}
                              <div className="space-y-3">
                                <Label className="text-gray-900">Bandwidth for New Link *</Label>
                                <Select
                                  value={selectedNewBandwidth}
                                  onValueChange={setSelectedNewBandwidth}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select bandwidth" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="10 Mbps">10 Mbps</SelectItem>
                                    <SelectItem value="20 Mbps">20 Mbps</SelectItem>
                                    <SelectItem value="50 Mbps">50 Mbps</SelectItem>
                                    <SelectItem value="100 Mbps">100 Mbps</SelectItem>
                                    <SelectItem value="200 Mbps">200 Mbps</SelectItem>
                                    <SelectItem value="500 Mbps">500 Mbps</SelectItem>
                                    <SelectItem value="1 Gbps">1 Gbps</SelectItem>
                                    <SelectItem value="10 Gbps">10 Gbps</SelectItem>
                                    <SelectItem value="100 Gbps">100 Gbps</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* LM Type for New Link */}
                              <LMTypeSelector
                                connectionTypes={modifyConnectionTypes}
                                onConnectionTypesChange={setModifyConnectionTypes}
                                idPrefix="secondary"
                                showCompletionIndicator={true}
                                fiberOnly={currentModifyLink.addressType === 'Sify DC' || currentModifyLink.addressType === 'Connected DC' || currentModifyLink.addressType === 'Connected Building'}
                                disableWireless={(selectedNewBandwidth && parseInt(selectedNewBandwidth) > 50) || false}
                              />

                              {/* Remarks */}
                              <div>
                                <Label className="text-gray-900 mb-2 block">
                                  Remarks <span className="text-gray-500 text-xs font-normal">(Optional)</span>
                                </Label>
                                <Textarea
                                  placeholder="Add any additional notes or requirements for the new link..."
                                  rows={3}
                                />
                              </div>

                              {/* Contact Person */}
                              <div className="space-y-3">
                                <Label className="text-gray-900">Contact Person for New Link</Label>
                                <div className="grid grid-cols-3 gap-4">
                                  <div>
                                    <Label className="text-sm text-gray-700">Name</Label>
                                    <Input
                                      value={currentModifyLink.contactName}
                                      onChange={(e) => {
                                        setCurrentModifyLink({
                                          ...currentModifyLink,
                                          contactName: e.target.value
                                        });
                                      }}
                                      placeholder="Contact name"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-sm text-gray-700">Email</Label>
                                    <Input
                                      value={currentModifyLink.contactEmail}
                                      onChange={(e) => {
                                        setCurrentModifyLink({
                                          ...currentModifyLink,
                                          contactEmail: e.target.value
                                        });
                                      }}
                                      placeholder="Contact email"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-sm text-gray-700">Phone</Label>
                                    <Input
                                      value={currentModifyLink.contactPhone}
                                      onChange={(e) => {
                                        setCurrentModifyLink({
                                          ...currentModifyLink,
                                          contactPhone: e.target.value
                                        });
                                      }}
                                      placeholder="Contact phone"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Save Button */}
                              <div className="flex justify-end pt-4">
                                <Button
                                  className="bg-blue-600 hover:bg-blue-700"
                                  onClick={saveCurrentLinkModifications}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Save New Link Details
                                </Button>
                              </div>
                            </>
                          )}

                          {/* Regular Modification Fields (Not for Add Secondary/Tertiary) */}
                          {currentModifyLink && !getLinkModificationTypes(currentModifyLink.id).addSecondaryTertiary && (
                            <>
                              {/* Bandwidth Modification */}
                              {currentModifyLink && getLinkModificationTypes(currentModifyLink.id).bandwidth && (
                                <div className="space-y-3">
                                  <div className="flex items-center space-x-2">
                                    <Label className="text-gray-900">New Bandwidth *</Label>
                                    {selectedNewBandwidth && selectedNewBandwidth.trim() !== '' && (
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                    )}
                                  </div>
                                  <div className="space-y-2">
                                    <Select
                                      value={selectedNewBandwidth}
                                      onValueChange={(value) => {
                                        setSelectedNewBandwidth(value);
                                        // Auto-uncheck "Apply to all" when bandwidth changes
                                        if (applyBandwidthToAll) {
                                          setApplyBandwidthToAll(false);
                                        }

                                        // Bandwidth-LM compatibility validation
                                        if (currentModifyLink) {
                                          const newBw = parseInt(value);
                                          const currentLMType = currentModifyLink.lmType;
                                          const currentBwMatch = currentModifyLink.bandwidth?.match(/(\d+)/);
                                          const currentBw = currentBwMatch ? parseInt(currentBwMatch[1]) : 0;

                                          // Case 1: MANDATORY - Wireless to higher bandwidth (>= 100 Mbps)
                                          if (currentLMType === 'Wireless' && currentBw <= 50 && newBw >= 100) {
                                            setLMChangeReason(`The new bandwidth (${value} Mbps) cannot be accommodated with the current Wireless LM type. Wireless supports maximum 50 Mbps. LM type change is required.`);
                                            setShowLMChangeMandatoryDialog(true);
                                            setDisableWirelessInLM(true);
                                          }
                                          // Case 2: SUGGESTION - High bandwidth to low (<= 50 Mbps) - Wireless recommended
                                          else if (currentLMType !== 'Wireless' && currentBw > 50 && newBw <= 50) {
                                            setLMChangeReason(`The new bandwidth (${value} Mbps) can be supported by Wireless LM type, which may be more cost-effective. Would you like to change the LM type?`);
                                            setShowLMChangeSuggestionDialog(true);
                                            setDisableWirelessInLM(false);
                                          } else {
                                            setDisableWirelessInLM(newBw > 50);
                                          }
                                        }
                                      }}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select new bandwidth" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="10">10 Mbps</SelectItem>
                                        <SelectItem value="25">25 Mbps</SelectItem>
                                        <SelectItem value="50">50 Mbps</SelectItem>
                                        <SelectItem value="100">100 Mbps</SelectItem>
                                        <SelectItem value="150">150 Mbps</SelectItem>
                                        <SelectItem value="200">200 Mbps</SelectItem>
                                        <SelectItem value="250">250 Mbps</SelectItem>
                                        <SelectItem value="300">300 Mbps</SelectItem>
                                        <SelectItem value="500">500 Mbps</SelectItem>
                                        <SelectItem value="750">750 Mbps</SelectItem>
                                        <SelectItem value="1000">1 Gbps</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    {selectedNewBandwidth && (() => {
                                      const currentBwMatch = currentModifyLink.bandwidth?.match(/(\d+)/);
                                      const currentBw = currentBwMatch ? parseInt(currentBwMatch[1]) : 0;
                                      const newBw = parseInt(selectedNewBandwidth);
                                      const changeType = newBw > currentBw ? 'upgrade' : newBw < currentBw ? 'downgrade' : 'same';

                                      return (
                                        <div className="flex items-center space-x-2 text-sm">
                                          {changeType === 'upgrade' && (
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                              ⬆️ Upgrade
                                            </Badge>
                                          )}
                                          {changeType === 'downgrade' && (
                                            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                              ⬇️ Downgrade
                                            </Badge>
                                          )}
                                          {changeType === 'same' && (
                                            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                              Same Bandwidth
                                            </Badge>
                                          )}
                                          <span className="text-gray-600">Current: {currentModifyLink.bandwidth}</span>
                                        </div>
                                      );
                                    })()}

                                    {/* Apply bandwidth to all links checkbox - only show for first link when multiple links exist */}
                                    {selectedLinkIndex === 0 && selectedLinks.length > 1 && selectedNewBandwidth && (
                                      <div className="flex items-center space-x-2 mt-3">
                                        <Checkbox
                                          id="apply-bandwidth-to-all"
                                          checked={applyBandwidthToAll}
                                          onCheckedChange={handleApplyBandwidthToAll}
                                        />
                                        <Label
                                          htmlFor="apply-bandwidth-to-all"
                                          className="text-sm text-gray-700 cursor-pointer font-normal"
                                        >
                                          Apply this bandwidth to all links
                                        </Label>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Address Modification */}
                              {currentModifyLink && getLinkModificationTypes(currentModifyLink.id).address && (
                                <div className="space-y-3">
                                  <div className="flex items-center space-x-2">
                                    <Label className="text-gray-900">New Address *</Label>
                                    {(() => {
                                      // Check if address is complete based on address type
                                      if (!modifyAddressType) return null;

                                      let isComplete = false;
                                      if (modifyAddressType === 'Sify DC') {
                                        isComplete = !!(modifyDCName?.trim() && modifyState?.trim() && modifyCity?.trim());
                                      } else if (modifyAddressType === 'Connected DC') {
                                        isComplete = !!(modifyConnectedDCName?.trim() && modifyState?.trim() && modifyCity?.trim());
                                      } else if (modifyAddressType === 'Connected Building') {
                                        isComplete = !!(modifyBuildingName?.trim() && modifyState?.trim() && modifyCity?.trim());
                                      } else if (modifyAddressType === 'Custom Location') {
                                        isComplete = !!(modifyAddressLine1?.trim() && modifyCity?.trim() && modifyState?.trim() && modifyPinCode?.trim());
                                      }

                                      return isComplete ? <CheckCircle className="w-4 h-4 text-green-600" /> : null;
                                    })()}
                                  </div>

                                  {/* Address Type Selection */}
                                  <div>
                                    <Label className="text-sm text-gray-700 mb-2 block">Building Type</Label>
                                    <Select
                                      value={modifyAddressType}
                                      onValueChange={(value) => {
                                        setModifyAddressType(value);
                                        // Reset all address fields when type changes
                                        setModifyDCName('');
                                        setModifyConnectedDCName('');
                                        setModifyBuildingName('');
                                        setModifyRackDetails('');
                                        setModifyFloorDetails('');
                                        setModifyBlockTowerDetails('');
                                        setModifyAddressLine1('');
                                        setModifyAddressLine2('');
                                        setModifyCity('');
                                        setModifyState('');
                                        setModifyPinCode('');
                                        setModifyLatitude('');
                                        setModifyLongitude('');
                                      }}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select building type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Sify DC">Sify DC</SelectItem>
                                        <SelectItem value="Connected DC">Connected DC</SelectItem>
                                        <SelectItem value="Connected Building">Connected Building</SelectItem>
                                        <SelectItem value="Custom Location">Custom Location</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  {/* Address Fields Component */}
                                  <MDACAddressFields
                                    modifyAddressType={modifyAddressType}
                                    modifyState={modifyState}
                                    modifyCity={modifyCity}
                                    modifyDCName={modifyDCName}
                                    modifyConnectedDCName={modifyConnectedDCName}
                                    modifyBuildingName={modifyBuildingName}
                                    modifyRackDetails={modifyRackDetails}
                                    modifyFloorDetails={modifyFloorDetails}
                                    modifyBlockTowerDetails={modifyBlockTowerDetails}
                                    modifyPinCode={modifyPinCode}
                                    modifyLatitude={modifyLatitude}
                                    modifyLongitude={modifyLongitude}
                                    setModifyState={setModifyState}
                                    setModifyCity={setModifyCity}
                                    setModifyDCName={setModifyDCName}
                                    setModifyConnectedDCName={setModifyConnectedDCName}
                                    setModifyBuildingName={setModifyBuildingName}
                                    setModifyRackDetails={setModifyRackDetails}
                                    setModifyFloorDetails={setModifyFloorDetails}
                                    setModifyBlockTowerDetails={setModifyBlockTowerDetails}
                                    setModifyPinCode={setModifyPinCode}
                                    setModifyLatitude={setModifyLatitude}
                                    setModifyLongitude={setModifyLongitude}
                                    modifyAddressLine1={modifyAddressLine1}
                                    modifyAddressLine2={modifyAddressLine2}
                                    setModifyAddressLine1={setModifyAddressLine1}
                                    setModifyAddressLine2={setModifyAddressLine2}
                                    showMap={showMap}
                                    setShowMap={setShowMap}
                                    geocodeAddress={geocodeAddress}
                                  />

                                  {/* Old fields hidden */}
                                  {false && modifyAddressType === 'Sify DC' && (
                                    <div className="space-y-3">
                                      <div>
                                        <Label className="text-sm text-gray-700">State *</Label>
                                        <Select
                                          value={modifyState}
                                          onValueChange={(value) => {
                                            setModifyState(value);
                                            // Reset city and DC when state changes
                                            setModifyCity('');
                                            setModifyDCName('');
                                          }}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select state" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {INDIAN_STATES.map((state) => (
                                              <SelectItem key={state} value={state}>{state}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <Label className="text-sm text-gray-700">City *</Label>
                                        <Select
                                          value={modifyCity}
                                          onValueChange={(value) => {
                                            setModifyCity(value);
                                            // Reset DC when city changes
                                            setModifyDCName('');
                                          }}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select city" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {INDIAN_CITIES.map((city) => (
                                              <SelectItem key={city} value={city}>{city}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <Label className="text-sm text-gray-700">Data Centre *</Label>
                                        <Select value={modifyDCName} onValueChange={(value: string) => {
                                          setModifyDCName(value);
                                          // Auto-fill pincode, latitude, longitude from DC data
                                          const dc = SIFY_DATA_CENTERS.find(d => d.name === value);
                                          if (dc) {
                                            setModifyPinCode(dc.pinCode);
                                            setModifyLatitude(dc.latitude);
                                            setModifyLongitude(dc.longitude);
                                          }
                                        }}>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select data center" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {SIFY_DATA_CENTERS.map((dc) => (
                                              <SelectItem key={dc.name} value={dc.name}>
                                                {dc.name}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      {/* Rack, Floor, Block/Tower Details for Sify DC */}
                                      <div className="grid grid-cols-3 gap-4">
                                        <div>
                                          <Label className="text-sm text-gray-700">Rack Details *</Label>
                                          <Input
                                            placeholder="e.g., Rack 12"
                                            value={modifyRackDetails}
                                            onChange={(e) => setModifyRackDetails(e.target.value)}
                                          />
                                        </div>
                                        <div>
                                          <Label className="text-sm text-gray-700">Floor Details *</Label>
                                          <Input
                                            placeholder="e.g., Floor 3"
                                            value={modifyFloorDetails}
                                            onChange={(e) => setModifyFloorDetails(e.target.value)}
                                          />
                                        </div>
                                        <div>
                                          <Label className="text-sm text-gray-700">Block/Tower Details *</Label>
                                          <Input
                                            placeholder="e.g., Block A"
                                            value={modifyBlockTowerDetails}
                                            onChange={(e) => setModifyBlockTowerDetails(e.target.value)}
                                          />
                                        </div>
                                      </div>
                                      {modifyDCName && (
                                        <div className="grid grid-cols-3 gap-4">
                                          <div>
                                            <Label className="text-xs text-gray-600">Pin Code</Label>
                                            <Input
                                              placeholder="Pin Code"
                                              value={modifyPinCode}
                                              onChange={(e) => setModifyPinCode(e.target.value)}
                                              className="mt-1"
                                            />
                                          </div>
                                          <div>
                                            <Label className="text-xs text-gray-600">Latitude</Label>
                                            <Input
                                              placeholder="e.g., 19.0760"
                                              value={modifyLatitude}
                                              onChange={(e) => setModifyLatitude(e.target.value)}
                                              className="mt-1"
                                            />
                                          </div>
                                          <div>
                                            <Label className="text-xs text-gray-600">Longitude</Label>
                                            <Input
                                              placeholder="e.g., 72.8777"
                                              value={modifyLongitude}
                                              onChange={(e) => setModifyLongitude(e.target.value)}
                                              className="mt-1"
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Connected DC Fields */}
                                  {false && modifyAddressType === 'Connected DC' && (
                                    <div className="space-y-3">
                                      <div>
                                        <Label className="text-sm text-gray-700">State *</Label>
                                        <Select
                                          value={modifyState}
                                          onValueChange={(value) => {
                                            setModifyState(value);
                                            // Reset city and DC when state changes
                                            setModifyCity('');
                                            setModifyConnectedDCName('');
                                          }}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select state" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {INDIAN_STATES.map((state) => (
                                              <SelectItem key={state} value={state}>{state}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <Label className="text-sm text-gray-700">City *</Label>
                                        <Select
                                          value={modifyCity}
                                          onValueChange={(value) => {
                                            setModifyCity(value);
                                            // Reset DC when city changes
                                            setModifyConnectedDCName('');
                                          }}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select city" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {INDIAN_CITIES.map((city) => (
                                              <SelectItem key={city} value={city}>{city}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <Label className="text-sm text-gray-700">Connected DC Name *</Label>
                                        <Select value={modifyConnectedDCName} onValueChange={(value: string) => {
                                          setModifyConnectedDCName(value);
                                          // Auto-fill pincode, latitude, longitude from connected DC data
                                          const dc = CONNECTED_DATA_CENTERS.find(d => d.name === value);
                                          if (dc) {
                                            setModifyPinCode(dc.pinCode);
                                            setModifyLatitude(dc.latitude);
                                            setModifyLongitude(dc.longitude);
                                          }
                                        }}>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select connected data center" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {CONNECTED_DATA_CENTERS.map((dc) => (
                                              <SelectItem key={dc.name} value={dc.name}>
                                                {dc.name}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      {/* Rack, Floor, Block/Tower Details for Connected DC */}
                                      <div className="grid grid-cols-3 gap-4">
                                        <div>
                                          <Label className="text-sm text-gray-700">Rack Details *</Label>
                                          <Input
                                            placeholder="e.g., Rack 12"
                                            value={modifyRackDetails}
                                            onChange={(e) => setModifyRackDetails(e.target.value)}
                                          />
                                        </div>
                                        <div>
                                          <Label className="text-sm text-gray-700">Floor Details *</Label>
                                          <Input
                                            placeholder="e.g., Floor 3"
                                            value={modifyFloorDetails}
                                            onChange={(e) => setModifyFloorDetails(e.target.value)}
                                          />
                                        </div>
                                        <div>
                                          <Label className="text-sm text-gray-700">Block/Tower Details *</Label>
                                          <Input
                                            placeholder="e.g., Block A"
                                            value={modifyBlockTowerDetails}
                                            onChange={(e) => setModifyBlockTowerDetails(e.target.value)}
                                          />
                                        </div>
                                      </div>
                                      {modifyConnectedDCName && (
                                        <div className="grid grid-cols-3 gap-4">
                                          <div>
                                            <Label className="text-xs text-gray-600">Pin Code</Label>
                                            <Input
                                              placeholder="Pin Code"
                                              value={modifyPinCode}
                                              onChange={(e) => setModifyPinCode(e.target.value)}
                                              className="mt-1"
                                            />
                                          </div>
                                          <div>
                                            <Label className="text-xs text-gray-600">Latitude</Label>
                                            <Input
                                              placeholder="e.g., 19.0760"
                                              value={modifyLatitude}
                                              onChange={(e) => setModifyLatitude(e.target.value)}
                                              className="mt-1"
                                            />
                                          </div>
                                          <div>
                                            <Label className="text-xs text-gray-600">Longitude</Label>
                                            <Input
                                              placeholder="e.g., 72.8777"
                                              value={modifyLongitude}
                                              onChange={(e) => setModifyLongitude(e.target.value)}
                                              className="mt-1"
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Connected Building Fields */}
                                  {false && modifyAddressType === 'Connected Building' && (
                                    <div className="space-y-3">
                                      <div>
                                        <Label className="text-sm text-gray-700">State *</Label>
                                        <Select
                                          value={modifyState}
                                          onValueChange={(value) => {
                                            setModifyState(value);
                                            // Reset city and building when state changes
                                            setModifyCity('');
                                            setModifyBuildingName('');
                                          }}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select state" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {INDIAN_STATES.map((state) => (
                                              <SelectItem key={state} value={state}>{state}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <Label className="text-sm text-gray-700">City *</Label>
                                        <Select
                                          value={modifyCity}
                                          onValueChange={(value) => {
                                            setModifyCity(value);
                                            // Reset building when city changes
                                            setModifyBuildingName('');
                                          }}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select city" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {CONNECTED_BUILDINGS.map((item) => (
                                              <SelectItem key={item.city} value={item.city}>{item.city}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      {modifyCity && (
                                        <div>
                                          <Label className="text-sm text-gray-700">Building *</Label>
                                          <Select value={modifyBuildingName} onValueChange={(value) => {
                                            setModifyBuildingName(value);
                                            // Auto-fill pincode, latitude, longitude from connected building data
                                            const cityData = CONNECTED_BUILDINGS.find(item => item.city === modifyCity);
                                            const selectedBuilding = cityData?.buildings.find(b => b.name === value);
                                            if (selectedBuilding) {
                                              setModifyPinCode(selectedBuilding.pinCode);
                                              setModifyLatitude(selectedBuilding.latitude);
                                              setModifyLongitude(selectedBuilding.longitude);
                                            }
                                          }}>
                                            <SelectTrigger>
                                              <SelectValue placeholder="Select building" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {CONNECTED_BUILDINGS.find(item => item.city === modifyCity)?.buildings.map((building) => (
                                                <SelectItem key={building.name} value={building.name}>
                                                  {building.name}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      )}
                                      {/* Rack, Floor, Block/Tower Details for Connected Building (Optional) */}
                                      <div className="grid grid-cols-3 gap-4">
                                        <div>
                                          <Label className="text-sm text-gray-700">Rack Details <span className="text-xs text-gray-500">(Optional)</span></Label>
                                          <Input
                                            placeholder="e.g., Rack 12"
                                            value={modifyRackDetails}
                                            onChange={(e) => setModifyRackDetails(e.target.value)}
                                          />
                                        </div>
                                        <div>
                                          <Label className="text-sm text-gray-700">Floor Details <span className="text-xs text-gray-500">(Optional)</span></Label>
                                          <Input
                                            placeholder="e.g., Floor 3"
                                            value={modifyFloorDetails}
                                            onChange={(e) => setModifyFloorDetails(e.target.value)}
                                          />
                                        </div>
                                        <div>
                                          <Label className="text-sm text-gray-700">Block/Tower Details <span className="text-xs text-gray-500">(Optional)</span></Label>
                                          <Input
                                            placeholder="e.g., Block A"
                                            value={modifyBlockTowerDetails}
                                            onChange={(e) => setModifyBlockTowerDetails(e.target.value)}
                                          />
                                        </div>
                                      </div>
                                      {modifyBuildingName && (
                                        <div className="grid grid-cols-3 gap-4">
                                          <div>
                                            <Label className="text-xs text-gray-600">Pin Code</Label>
                                            <Input
                                              placeholder="Pin Code"
                                              value={modifyPinCode}
                                              onChange={(e) => setModifyPinCode(e.target.value)}
                                              className="mt-1"
                                            />
                                          </div>
                                          <div>
                                            <Label className="text-xs text-gray-600">Latitude</Label>
                                            <Input
                                              placeholder="e.g., 19.0760"
                                              value={modifyLatitude}
                                              onChange={(e) => setModifyLatitude(e.target.value)}
                                              className="mt-1"
                                            />
                                          </div>
                                          <div>
                                            <Label className="text-xs text-gray-600">Longitude</Label>
                                            <Input
                                              placeholder="e.g., 72.8777"
                                              value={modifyLongitude}
                                              onChange={(e) => setModifyLongitude(e.target.value)}
                                              className="mt-1"
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Custom Location Fields */}
                                  {false && modifyAddressType === 'Custom Location' && (
                                    <div className="space-y-3">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label className="text-sm text-gray-700">Address Line 1 *</Label>
                                          <Input
                                            value={modifyAddressLine1}
                                            onChange={(e) => {
                                              setModifyAddressLine1(e.target.value);
                                              // Trigger geocoding when all required fields are filled
                                              if (e.target.value && modifyCity && modifyState && modifyPinCode.length === 6) {
                                                const coords = geocodeAddress(modifyCity, modifyState, modifyPinCode);
                                                setModifyLatitude(coords.lat.toFixed(6));
                                                setModifyLongitude(coords.lng.toFixed(6));
                                              }
                                            }}
                                            placeholder="Enter address"
                                          />
                                        </div>
                                        <div>
                                          <Label className="text-sm text-gray-700">Address Line 2</Label>
                                          <Input
                                            value={modifyAddressLine2}
                                            onChange={(e) => setModifyAddressLine2(e.target.value)}
                                            placeholder="Enter address"
                                          />
                                        </div>
                                        <div>
                                          <Label className="text-sm text-gray-700">State *</Label>
                                          <Select
                                            value={modifyState}
                                            onValueChange={(value) => {
                                              setModifyState(value);
                                              // Trigger geocoding when all required fields are filled
                                              if (modifyAddressLine1 && modifyCity && value && modifyPinCode.length === 6) {
                                                const coords = geocodeAddress(modifyCity, value, modifyPinCode);
                                                setModifyLatitude(coords.lat.toFixed(6));
                                                setModifyLongitude(coords.lng.toFixed(6));
                                              }
                                            }}
                                          >
                                            <SelectTrigger>
                                              <SelectValue placeholder="Select state" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {INDIAN_STATES.map(state => (
                                                <SelectItem key={state} value={state}>{state}</SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div>
                                          <Label className="text-sm text-gray-700">City *</Label>
                                          <Select
                                            value={modifyCity}
                                            onValueChange={(value) => {
                                              setModifyCity(value);
                                              // Trigger geocoding when all required fields are filled
                                              if (modifyAddressLine1 && value && modifyState && modifyPinCode.length === 6) {
                                                const coords = geocodeAddress(value, modifyState, modifyPinCode);
                                                setModifyLatitude(coords.lat.toFixed(6));
                                                setModifyLongitude(coords.lng.toFixed(6));
                                              }
                                            }}
                                          >
                                            <SelectTrigger>
                                              <SelectValue placeholder="Select city" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {INDIAN_CITIES.map(city => (
                                                <SelectItem key={city} value={city}>{city}</SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>

                                      {/* Pin Code, Latitude, Longitude in one row */}
                                      <div className="grid grid-cols-3 gap-4">
                                        <div>
                                          <Label className="text-sm text-gray-700">Pin Code *</Label>
                                          <Input
                                            value={modifyPinCode}
                                            onChange={(e) => {
                                              setModifyPinCode(e.target.value);
                                              // Trigger geocoding when all required fields are filled
                                              if (modifyAddressLine1 && modifyCity && modifyState && e.target.value.length === 6) {
                                                const coords = geocodeAddress(modifyCity, modifyState, e.target.value);
                                                setModifyLatitude(coords.lat.toFixed(6));
                                                setModifyLongitude(coords.lng.toFixed(6));
                                              }
                                            }}
                                            placeholder="Enter pin code"
                                          />
                                        </div>
                                        <div>
                                          <Label className="text-xs text-gray-600">Latitude</Label>
                                          <Input
                                            placeholder="e.g., 19.0760"
                                            value={modifyLatitude}
                                            onChange={(e) => setModifyLatitude(e.target.value)}
                                          />
                                        </div>
                                        <div>
                                          <Label className="text-xs text-gray-600">Longitude</Label>
                                          <Input
                                            placeholder="e.g., 72.8877"
                                            value={modifyLongitude}
                                            onChange={(e) => setModifyLongitude(e.target.value)}
                                          />
                                        </div>
                                      </div>

                                      {/* Show Map Button */}
                                      {(modifyAddressLine1 || modifyLatitude) && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => setShowMap(!showMap)}
                                          className="mt-2 w-full"
                                        >
                                          <MapPin className="w-4 h-4 mr-2" />
                                          {showMap ? 'Hide Map' : 'Show Map & Refine Location'}
                                        </Button>
                                      )}

                                      {/* Map Display */}
                                      {showMap && (modifyAddressLine1 || modifyLatitude) && (
                                        <div className="border border-gray-300 rounded-lg overflow-hidden">
                                          <div className="bg-gray-100 p-2 border-b border-gray-300">
                                            <p className="text-xs text-gray-700">
                                              📍 Refine pin location on map (Click to update address)
                                            </p>
                                          </div>
                                          <div className="relative">
                                            <div
                                              className="h-64 bg-gradient-to-br from-blue-100 via-green-100 to-yellow-100 relative cursor-crosshair"
                                              onClick={(e) => {
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                const x = e.clientX - rect.left;
                                                const y = e.clientY - rect.top;

                                                // Convert click position to lat/lng (simplified)
                                                const lat = (19.0760 + (y / rect.height - 0.5) * 0.1).toFixed(6);
                                                const lng = (72.8777 + (x / rect.width - 0.5) * 0.1).toFixed(6);

                                                setModifyLatitude(lat);
                                                setModifyLongitude(lng);
                                                toast.success('Location updated on map');
                                              }}
                                            >
                                              {/* Grid overlay */}
                                              <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
                                                {Array.from({ length: 64 }).map((_, i) => (
                                                  <div key={i} className="border border-white/20" />
                                                ))}
                                              </div>

                                              {/* Location Pin */}
                                              {modifyLatitude && modifyLongitude && (
                                                <div
                                                  className="absolute transform -translate-x-1/2 -translate-y-full"
                                                  style={{
                                                    left: '50%',
                                                    top: '50%'
                                                  }}
                                                >
                                                  <div className="w-8 h-8 bg-red-500 rounded-full animate-pulse flex items-center justify-center shadow-lg">
                                                    <div className="w-4 h-4 bg-white rounded-full" />
                                                  </div>
                                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap">
                                                    {modifyLatitude}, {modifyLongitude}
                                                  </div>
                                                </div>
                                              )}

                                              <div className="absolute bottom-2 left-2 bg-white p-2 rounded shadow text-xs">
                                                <p className="text-gray-700">🗺️ Interactive Map</p>
                                                <p className="text-gray-500">Click to set pin</p>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="bg-gray-50 p-2 text-xs text-gray-600 text-center">
                                            Click anywhere on the map to update address
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* LM Type Modification */}
                              {currentModifyLink && getLinkModificationTypes(currentModifyLink.id).lm && (
                                <LMTypeSelector
                                  connectionTypes={modifyConnectionTypes}
                                  onConnectionTypesChange={setModifyConnectionTypes}
                                  idPrefix="modify"
                                  showCompletionIndicator={true}
                                  fiberOnly={
                                    // If address is also being changed, use the new address type; otherwise use current address type
                                    (getLinkModificationTypes(currentModifyLink.id).address && modifyAddressType
                                      ? (modifyAddressType === 'Sify DC' || modifyAddressType === 'Connected DC' || modifyAddressType === 'Connected Building')
                                      : (currentModifyLink.addressType === 'Sify DC' || currentModifyLink.addressType === 'Connected DC' || currentModifyLink.addressType === 'Connected Building'))
                                  }
                                  disableWireless={disableWirelessInLM}
                                />
                              )}

                              <Separator />

                              {/* Remarks */}
                              <div>
                                <Label className="text-gray-900 mb-2 block">
                                  Remarks <span className="text-gray-500 text-xs font-normal">(Optional)</span>
                                </Label>
                                <Textarea
                                  placeholder="Add any additional notes or requirements for this modification..."
                                  rows={3}
                                />
                              </div>

                              {/* Contact Person */}
                              <div className="space-y-3">
                                <Label className="text-gray-900">Contact Person for this Link</Label>
                                <div className="grid grid-cols-3 gap-4">
                                  <div>
                                    <Label className="text-sm text-gray-700">Name</Label>
                                    <Input
                                      value={currentModifyLink.contactName}
                                      onChange={(e) => {
                                        setCurrentModifyLink({
                                          ...currentModifyLink,
                                          contactName: e.target.value
                                        });
                                      }}
                                      placeholder="Contact name"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-sm text-gray-700">Email</Label>
                                    <Input
                                      value={currentModifyLink.contactEmail}
                                      onChange={(e) => {
                                        setCurrentModifyLink({
                                          ...currentModifyLink,
                                          contactEmail: e.target.value
                                        });
                                      }}
                                      placeholder="Contact email"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-sm text-gray-700">Phone</Label>
                                    <Input
                                      value={currentModifyLink.contactPhone}
                                      onChange={(e) => {
                                        setCurrentModifyLink({
                                          ...currentModifyLink,
                                          contactPhone: e.target.value
                                        });
                                      }}
                                      placeholder="Contact phone"
                                    />
                                  </div>
                                </div>
                                {selectedLinkIndex === 0 && selectedLinks.length > 1 && (
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="apply-contact-to-all"
                                      checked={applyContactToAll}
                                      onCheckedChange={handleApplyContactToAll}
                                    />
                                    <Label
                                      htmlFor="apply-contact-to-all"
                                      className="text-sm text-gray-700 cursor-pointer font-normal"
                                    >
                                      Apply this contact to all links
                                    </Label>
                                  </div>
                                )}
                              </div>

                              {/* Save Button */}
                              <div className="flex justify-end pt-4">
                                <Button
                                  className="bg-purple-600 hover:bg-purple-700"
                                  onClick={saveCurrentLinkModifications}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Save Modifications
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="border-2 border-dashed border-gray-300">
                      <CardContent className="p-12 text-center">
                        <Network className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Select a link from the left panel to modify</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {/* Two-Panel Layout - Only show for manual entry */}
            {connections.length > 0 && !showBulkSummary && diaEntryMethod === 'manual' && requirementInfo.orderType !== 'MDAC' && (
              <div className="grid grid-cols-12 gap-6">
                {/* Left Panel - Connection List */}
                <div className="col-span-4">
                  <Card className="h-full border-2 border-gray-200 shadow-md">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                      <CardTitle className="text-gray-900 flex items-center">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                          <Network className="w-4 h-4 text-white" />
                        </div>
                        Feasibilities
                      </CardTitle>
                      <CardDescription className="ml-11">Select a Feasibility</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      {/* Status Summary */}
                      <div className="mb-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200 shadow-sm">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <div className="flex items-center justify-center space-x-1 mb-1">
                              <CheckCircle className="w-3 h-3 text-green-600" />
                              <span className="text-xs text-gray-600">Saved</span>
                            </div>
                            <div className="text-sm text-gray-900 text-center">
                              {connections.filter(c => getConnectionStatus(c) === 'completed').length}
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-center space-x-1 mb-1">
                              <div className="w-3 h-3 rounded-full border-2 border-orange-500 bg-orange-100 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                              </div>
                              <span className="text-xs text-gray-600">In Progress</span>
                            </div>
                            <div className="text-sm text-gray-900 text-center">
                              {connections.filter(c => getConnectionStatus(c) === 'in-progress').length}
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-center space-x-1 mb-1">
                              <div className="w-3 h-3 rounded-full border-2 border-gray-300" />
                              <span className="text-xs text-gray-600">Pending</span>
                            </div>
                            <div className="text-sm text-gray-900 text-center">
                              {connections.filter(c => getConnectionStatus(c) === 'pending').length}
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator className="mb-4" />
                      <TooltipProvider>
                        <div className="space-y-2">
                          {connections.map((conn, idx) => {
                            const status = getConnectionStatus(conn);
                            const tooltipText = getStatusTooltip(conn, status);

                            // Check if this is an A End to show pair header
                            const isPairStart = conn.pairId && conn.endType === 'A End';
                            const pairNumber = conn.pairId ? conn.pairId.split('-')[1] : '';

                            return (
                              <div key={conn.id}>
                                {/* Pair Header - only show before A End */}
                                {isPairStart && (
                                  <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg border border-gray-300 shadow-sm">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm text-gray-900">Pair {pairNumber}</span>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setConnectionToDelete(conn);
                                        setShowDeleteDialog(true);
                                      }}
                                      className="h-7 px-2"
                                    >
                                      <Trash2 className="w-3.5 h-3.5 text-red-600 mr-1" />
                                      <span className="text-xs text-red-600">Delete Pair</span>
                                    </Button>
                                  </div>
                                )}

                                <div
                                  onClick={() => {
                                    setSelectedConnectionIndex(idx);
                                    setCurrentConnection(conn);
                                    setOriginalConnection(JSON.parse(JSON.stringify(conn))); // Deep copy to track original
                                  }}
                                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all shadow-sm hover:shadow-md ${selectedConnectionIndex === idx
                                      ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md'
                                      : 'border-gray-200 hover:border-blue-300 bg-white'
                                    } ${conn.pairId ? (conn.endType === 'A End' ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-purple-500') : ''}`}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                      {/* Pairing indicator inline */}
                                      {conn.pairId && (
                                        <div className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold shadow-sm ${conn.endType === 'A End'
                                            ? 'bg-gradient-to-br from-green-400 to-green-600 text-white'
                                            : 'bg-gradient-to-br from-purple-400 to-purple-600 text-white'
                                          }`}>
                                          {conn.endType === 'A End' ? 'A' : 'B'}
                                        </div>
                                      )}
                                      <span className="text-sm text-gray-900">
                                        Feasibility {idx + 1}
                                      </span>

                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <div className="flex items-center">
                                            {status === 'completed' && (
                                              <div className="flex items-center space-x-1">
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                                <span className="text-xs text-green-600">Saved</span>
                                              </div>
                                            )}
                                            {status === 'in-progress' && (
                                              <div className="flex items-center space-x-1">
                                                <div className="w-4 h-4 rounded-full border-2 border-orange-500 bg-orange-100 flex items-center justify-center">
                                                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                                                </div>
                                                <span className="text-xs text-orange-600">In Progress</span>
                                              </div>
                                            )}
                                            {status === 'pending' && (
                                              <div className="flex items-center space-x-1">
                                                <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                                                <span className="text-xs text-gray-500">Pending</span>
                                              </div>
                                            )}
                                          </div>
                                        </TooltipTrigger>
                                        <TooltipContent side="right" className="max-w-xs">
                                          <div className="text-xs whitespace-pre-line">
                                            {tooltipText}
                                          </div>
                                        </TooltipContent>
                                      </Tooltip>
                                    </div>

                                    {/* Delete button for non-paired connections */}
                                    {!conn.pairId && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteConnection(idx);
                                        }}
                                        className="h-6 w-6 p-0"
                                      >
                                        <Trash2 className="w-3 h-3 text-red-600" />
                                      </Button>
                                    )}
                                  </div>

                                  {/* Connection Summary */}
                                  <div className="space-y-1 mt-2">
                                    {conn.address && (
                                      <div className="text-xs text-gray-600 truncate">📍 {conn.address}</div>
                                    )}
                                    {conn.bandwidthValue && (
                                      <div className="text-xs text-gray-600">
                                        ⚡ {conn.numberOfLinks?.startsWith('Dual') ? `P: ${conn.bandwidthValue} | S: ${conn.link2BandwidthValue || '-'}` : conn.bandwidthValue}
                                      </div>
                                    )}
                                    {/* Display LM Types - handle both singular and plural */}
                                    {conn.connectionTypes && conn.connectionTypes.length > 0 && (
                                      <div className="text-xs text-gray-600">
                                        🔗 {conn.connectionTypes.map(ct => ct.type).join(', ')}
                                        {conn.numberOfLinks?.startsWith('Dual') && conn.link2ConnectionTypes && conn.link2ConnectionTypes.length > 0 && (
                                          <> | {conn.link2ConnectionTypes.map(ct => ct.type).join(', ')}</>
                                        )}
                                      </div>
                                    )}
                                    {!conn.connectionTypes?.length && false && ( // connectionType property does not exist
                                      <div className="text-xs text-gray-600">🔗 Legacy connection</div>
                                    )}
                                    {/* Display Cross Connect if present */}
                                    {conn.crossConnectResponsibility && (
                                      <div className="text-xs text-gray-600">
                                        🔌 Cross Connect: {conn.crossConnectResponsibility}
                                        {conn.crossConnectType && ` (${conn.crossConnectType})`}
                                      </div>
                                    )}
                                    {requirementInfo.networkType === 'MPLS' && requirementInfo.mplsType === 'Hub and Spoke' && conn.isHub && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                                      >
                                        🔵 Hub Feasibility
                                      </Badge>
                                    )}
                                    {conn.linkType && (
                                      <Badge
                                        variant="outline"
                                        className={`text-xs ${conn.linkType === 'Primary'
                                            ? 'bg-green-50 text-green-700 border-green-200'
                                            : 'bg-orange-50 text-orange-700 border-orange-200'
                                          }`}
                                      >
                                        {conn.linkType}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                {/* Separator after B End of each pair */}
                                {conn.pairId && conn.endType === 'B End' && idx < connections.length - 1 && (
                                  <div className="my-3 border-t-2 border-gray-300" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </TooltipProvider>

                      {/* Add More Section */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="space-y-3">
                          <Label className="text-sm text-gray-700">Add More Feasibilities</Label>
                          {requirementInfo.product === 'P2P' ? (
                            <Button
                              onClick={() => addMoreConnections(2)}
                              className="w-full bg-green-600 hover:bg-green-700"
                              size="sm"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Pair (2 Feasibilities)
                            </Button>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <Input
                                type="number"
                                min="1"
                                max="50"
                                value={addMoreCount}
                                onChange={(e) => {
                                  const count = Math.max(parseInt(e.target.value) || 1, 1);
                                  setAddMoreCount(count);
                                }}
                                className="w-20 text-center"
                                placeholder="Count"
                              />
                              <Button
                                onClick={() => addMoreConnections(addMoreCount)}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                                size="sm"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Panel - Connection Configuration */}
                <div className="col-span-8">
                  <Card className="h-full border-2 border-gray-200 shadow-md">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md mr-3">
                            <span className="text-white text-sm">{selectedConnectionIndex + 1}</span>
                          </div>
                          <div>
                            <CardTitle className="text-gray-900">
                              Feasibility {selectedConnectionIndex + 1}
                            </CardTitle>
                            <CardDescription>Enter Feasibility details and specifications</CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Location Category - Only for P2P */}
                      {requirementInfo.product === 'P2P' && (
                        <div className="space-y-4">
                          <div>
                            <Label className="mb-3 block">Location Category Type *</Label>
                            <RadioGroup
                              value={currentConnection.locationCategoryType}
                              onValueChange={(val: 'DC' | 'Custom' | 'Cloud Provider') => {
                                setCurrentConnection({
                                  ...currentConnection,
                                  locationCategoryType: val,
                                  locationCategory: undefined,
                                  lmCategory: val === 'Cloud Provider' ? 'Cloud Provider' : 'Access Type',
                                  addressLine1: '',
                                  addressLine2: '',
                                  city: '',
                                  state: '',
                                  pinCode: '',
                                  latitude: '',
                                  longitude: '',
                                  dcName: '',
                                  cloudServiceProvider: '',
                                  cloudServiceType: '',
                                  connectingNodes: '',
                                  transportType: ''
                                });
                              }}
                              className="flex flex-col space-y-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="DC" id="dc" />
                                <Label htmlFor="dc" className="cursor-pointer">DC</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Custom" id="custom" />
                                <Label htmlFor="custom" className="cursor-pointer">Custom</Label>
                              </div>
                              {requirementInfo.subProduct === 'GCC' && (
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="Cloud Provider" id="cloud-provider" />
                                  <Label htmlFor="cloud-provider" className="cursor-pointer">Cloud Provider</Label>
                                </div>
                              )}
                            </RadioGroup>
                          </div>

                          {/* DC Sub-options */}
                          {currentConnection.locationCategoryType === 'DC' && (
                            <div>
                              <Label>Select DC Type *</Label>
                              <Select
                                value={currentConnection.locationCategory}
                                onValueChange={(val: 'Sify DC' | 'Customer on-prem DC' | '3rd Party DC') => {
                                  setCurrentConnection({
                                    ...currentConnection,
                                    locationCategory: val
                                  });
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select DC type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Sify DC">Sify DC</SelectItem>
                                  <SelectItem value="Customer on-prem DC">Customer on-prem DC</SelectItem>
                                  <SelectItem value="3rd Party DC">3rd Party DC</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {/* Custom Sub-options */}
                          {currentConnection.locationCategoryType === 'Custom' && (
                            <div>
                              <Label>Select Location Type *</Label>
                              <Select
                                value={currentConnection.locationCategory}
                                onValueChange={(val: 'Customer site' | 'Cloud (Hyperscaler)' | 'Sify CI Cloud' | 'Govt. office building' | 'Internet Exchange') => {
                                  setCurrentConnection({
                                    ...currentConnection,
                                    locationCategory: val
                                  });
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select location type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Customer site">Customer site</SelectItem>
                                  <SelectItem value="Cloud (Hyperscaler)">Cloud (Hyperscaler)</SelectItem>
                                  <SelectItem value="Sify CI Cloud">Sify CI Cloud</SelectItem>
                                  <SelectItem value="Govt. office building">Govt. office building</SelectItem>
                                  <SelectItem value="Internet Exchange">Internet Exchange</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Show different details based on Location Category Type */}
                      {currentConnection.locationCategoryType && (
                        <div>
                          {/* DC Details for DC category type */}
                          {currentConnection.locationCategoryType === 'DC' ? (
                            <div>
                              <h4 className="text-sm text-gray-900 mb-4">DC Details</h4>
                              <div className="space-y-3">
                                <div>
                                  <Label>City *</Label>
                                  <Select
                                    value={currentConnection.city}
                                    onValueChange={(val) => setCurrentConnection({ ...currentConnection, city: val })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select city" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {INDIAN_CITIES.map((city) => (
                                        <SelectItem key={city} value={city}>{city}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>State *</Label>
                                  <Select
                                    value={currentConnection.state}
                                    onValueChange={(val) => setCurrentConnection({ ...currentConnection, state: val })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select state" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {INDIAN_STATES.map((state) => (
                                        <SelectItem key={state} value={state}>{state}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Data Centre *</Label>
                                  <Select
                                    value={currentConnection.dcName}
                                    onValueChange={(val: string) => setCurrentConnection({ ...currentConnection, dcName: val })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select data centre" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="DC Mumbai 1">DC Mumbai 1</SelectItem>
                                      <SelectItem value="DC Mumbai 2">DC Mumbai 2</SelectItem>
                                      <SelectItem value="DC Bangalore 1">DC Bangalore 1</SelectItem>
                                      <SelectItem value="DC Bangalore 2">DC Bangalore 2</SelectItem>
                                      <SelectItem value="DC Delhi NCR 1">DC Delhi NCR 1</SelectItem>
                                      <SelectItem value="DC Chennai 1">DC Chennai 1</SelectItem>
                                      <SelectItem value="DC Hyderabad 1">DC Hyderabad 1</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          ) : currentConnection.locationCategoryType === 'Cloud Provider' ? (
                            <div>
                              {/* Service Provider Details for Cloud Provider */}
                              <h4 className="text-sm text-gray-900 mb-4">Service Provider Details</h4>
                              <div className="space-y-3">
                                <div>
                                  <Label>Cloud Service Provider *</Label>
                                  <Select
                                    value={currentConnection.cloudServiceProvider}
                                    onValueChange={(val) => {
                                      setCurrentConnection({
                                        ...currentConnection,
                                        cloudServiceProvider: val,
                                        connectingNodes: '' // Reset nodes when provider changes
                                      });
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select cloud provider" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="AWS">AWS</SelectItem>
                                      <SelectItem value="Azure">Azure</SelectItem>
                                      <SelectItem value="GCP">GCP</SelectItem>
                                      <SelectItem value="OCI">OCI</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label>Service Type *</Label>
                                  <Select
                                    value={currentConnection.cloudServiceType}
                                    onValueChange={(val) => setCurrentConnection({ ...currentConnection, cloudServiceType: val })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select service type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Private">Private</SelectItem>
                                      <SelectItem value="Public">Public</SelectItem>
                                      <SelectItem value="O365">O365</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label>Connecting Nodes *</Label>
                                  <Select
                                    value={currentConnection.connectingNodes}
                                    onValueChange={(val) => setCurrentConnection({ ...currentConnection, connectingNodes: val })}
                                    disabled={!currentConnection.cloudServiceProvider}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select connecting node" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {currentConnection.cloudServiceProvider === 'AWS' && (
                                        <div className="contents">
                                          <SelectItem value="Mumbai">Mumbai</SelectItem>
                                          <SelectItem value="Bangalore">Bangalore</SelectItem>
                                          <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                                          <SelectItem value="Chennai">Chennai</SelectItem>
                                        </div>
                                      )}
                                      {currentConnection.cloudServiceProvider === 'Azure' && (
                                        <div className="contents">
                                          <SelectItem value="Mumbai">Mumbai</SelectItem>
                                          <SelectItem value="Chennai">Chennai</SelectItem>
                                          <SelectItem value="Pune">Pune</SelectItem>
                                        </div>
                                      )}
                                      {currentConnection.cloudServiceProvider === 'GCP' && (
                                        <div className="contents">
                                          <SelectItem value="Mumbai">Mumbai</SelectItem>
                                          <SelectItem value="Delhi">Delhi</SelectItem>
                                        </div>
                                      )}
                                      {currentConnection.cloudServiceProvider === 'OCI' && (
                                        <div className="contents">
                                          <SelectItem value="Mumbai">Mumbai</SelectItem>
                                          <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                                        </div>
                                      )}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label>Transport Type *</Label>
                                  <Select
                                    value={currentConnection.transportType}
                                    onValueChange={(val) => setCurrentConnection({ ...currentConnection, transportType: val })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select transport type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Layer 2 - Ethernet Virtual Private Line">Layer 2 - Ethernet Virtual Private Line</SelectItem>
                                      <SelectItem value="Layer 3 - Multi protocol label switching">Layer 3 - Multi protocol label switching</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="mb-4">
                                <h4 className="text-sm text-gray-900">Address Details</h4>
                              </div>

                              <div className="space-y-3">
                                <div>
                                  <Label>Address Line 1 *</Label>
                                  <Input
                                    placeholder="Building name, floor, office number"
                                    value={currentConnection.addressLine1}
                                    onChange={(e) => setCurrentConnection({ ...currentConnection, addressLine1: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label>Address Line 2</Label>
                                  <Input
                                    placeholder="Street, area, locality"
                                    value={currentConnection.addressLine2}
                                    onChange={(e) => setCurrentConnection({ ...currentConnection, addressLine2: e.target.value })}
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <Label>State *</Label>
                                    <Select
                                      value={currentConnection.state}
                                      onValueChange={(val) => setCurrentConnection({ ...currentConnection, state: val })}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select state" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {INDIAN_STATES.map((state) => (
                                          <SelectItem key={state} value={state}>{state}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label>City *</Label>
                                    <Select
                                      value={currentConnection.city}
                                      onValueChange={(val) => setCurrentConnection({ ...currentConnection, city: val })}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select city" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {INDIAN_CITIES.map((city) => (
                                          <SelectItem key={city} value={city}>{city}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                  <div>
                                    <Label>Pin Code *</Label>
                                    <Input
                                      placeholder="000000"
                                      maxLength={6}
                                      value={currentConnection.pinCode}
                                      onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        setCurrentConnection({ ...currentConnection, pinCode: value });
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs text-gray-600">Latitude</Label>
                                    <Input
                                      placeholder="e.g., 19.0760"
                                      value={currentConnection.latitude}
                                      onChange={(e) => setCurrentConnection({ ...currentConnection, latitude: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs text-gray-600">Longitude</Label>
                                    <Input
                                      placeholder="e.g., 72.8777"
                                      value={currentConnection.longitude}
                                      onChange={(e) => setCurrentConnection({ ...currentConnection, longitude: e.target.value })}
                                    />
                                  </div>
                                </div>

                                {/* Show Map Button */}
                                {(currentConnection.addressLine1 || currentConnection.latitude) && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowMap(!showMap)}
                                    className="mt-2 w-full"
                                  >
                                    <MapPin className="w-4 h-4 mr-2" />
                                    {showMap ? 'Hide Map' : 'Show Map & Refine Location'}
                                  </Button>
                                )}

                                {/* Map Display */}
                                {showMap && (currentConnection.addressLine1 || currentConnection.latitude) && (
                                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                                    <div className="bg-gray-100 p-2 border-b border-gray-300">
                                      <p className="text-xs text-gray-700">
                                        📍 Refine pin location on map (Click to update address)
                                      </p>
                                    </div>
                                    <div
                                      className="relative h-64 bg-gray-200 flex items-center justify-center cursor-crosshair"
                                      onClick={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        const x = e.clientX - rect.left;
                                        const y = e.clientY - rect.top;
                                        const latChange = ((y - rect.height / 2) / rect.height) * -0.01;
                                        const lngChange = ((x - rect.width / 2) / rect.width) * 0.01;
                                        const newLat = parseFloat(currentConnection.latitude || '19.0760') + latChange;
                                        const newLng = parseFloat(currentConnection.longitude || '72.8777') + lngChange;
                                        handleMapClick(newLat, newLng);
                                      }}
                                    >
                                      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-100 to-yellow-100">
                                        <div className="absolute inset-0" style={{
                                          backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)',
                                          backgroundSize: '20px 20px'
                                        }} />

                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                          <div className="relative">
                                            <div className="w-8 h-8 bg-red-500 rounded-full animate-pulse flex items-center justify-center shadow-lg">
                                              <div className="w-4 h-4 bg-white rounded-full" />
                                            </div>
                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap">
                                              {currentConnection.latitude}, {currentConnection.longitude}
                                            </div>
                                          </div>
                                        </div>

                                        <div className="absolute bottom-2 left-2 bg-white p-2 rounded shadow text-xs">
                                          <p className="text-gray-700">🗺️ Interactive Map</p>
                                          <p className="text-gray-500">Click to set pin</p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="bg-gray-50 p-2 text-xs text-gray-600 text-center">
                                      Click anywhere on the map to update address
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Hub Selection for MPLS Hub and Spoke */}
                      {currentConnection.locationCategoryType && requirementInfo.networkType === 'MPLS' && requirementInfo.mplsType === 'Hub and Spoke' && (() => {
                        const existingHubIndex = connections.findIndex((conn, idx) => idx !== selectedConnectionIndex && conn.isHub);
                        const isAnotherHubSet = existingHubIndex !== -1;

                        return (
                          <div>
                            <div className={`p-4 bg-blue-50 border-2 border-blue-200 rounded-xl ${isAnotherHubSet ? 'opacity-50 pointer-events-none' : ''}`}>
                              <div className="flex items-start space-x-3">
                                <input
                                  type="checkbox"
                                  checked={currentConnection.isHub || false}
                                  onChange={(e) => {
                                    // Ensure only one hub is selected
                                    if (e.target.checked) {
                                      // Check if another Service is already marked as hub in saved connections
                                      const existingHubIndex = connections.findIndex((conn, idx) => idx !== selectedConnectionIndex && conn.isHub);
                                      if (existingHubIndex !== -1) {
                                        toast.error(`Only one Service can be marked as hub. Service ${existingHubIndex + 1} is already set as hub. Please unmark it first.`);
                                        return;
                                      }
                                    }
                                    setCurrentConnection({ ...currentConnection, isHub: e.target.checked });
                                  }}
                                  className="mt-0.5 w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                                  disabled={isAnotherHubSet}
                                />
                                <div className="flex-1">
                                  <Label className="text-gray-900 cursor-pointer">Mark this as the hub of my network</Label>
                                  <p className="text-xs text-gray-600 mt-1">
                                    Only one location can be designated as the network hub
                                  </p>
                                </div>
                              </div>
                            </div>
                            {isAnotherHubSet && (
                              <p className="text-xs text-orange-600 mt-2 flex items-center">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Location {existingHubIndex + 1} is currently set as hub
                              </p>
                            )}
                          </div>
                        );
                      })()}

                      {/* Value Added Services - For P2P */}
                      {requirementInfo.product === 'P2P' && (
                        <div>
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-sm text-gray-900">Value Added Services (VAS)</h4>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowVASSheet(true)}
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add VAS
                              </Button>
                            </div>

                            {/* Display added VAS */}
                            {currentConnection.vas && currentConnection.vas.length > 0 && (
                              <div className="space-y-2">
                                {currentConnection.vas.map((vasItem, index) => (
                                  <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
                                    <div>
                                      <p className="text-sm text-gray-900">{vasItem.name}</p>
                                      {vasItem.details && <p className="text-xs text-gray-600">{vasItem.details}</p>}
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const updatedVAS = (currentConnection.vas || []).filter((_, i) => i !== index);
                                        setCurrentConnection({ ...currentConnection, vas: updatedVAS });
                                      }}
                                    >
                                      <X className="w-4 h-4 text-red-600" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <Separator />
                        </div>
                      )}

                      {/* Address Details for DIA/MPLS */}
                      {(requirementInfo.product === 'DIA' || requirementInfo.product === 'MPLS') && (
                        <div>
                          <div>
                            <h4 className="text-sm text-gray-900 mb-4">Address Details</h4>

                            {/* Building Type Selection */}
                            <div className="space-y-4">
                              <div>
                                <Label>Building Type *</Label>
                                <Select
                                  value={currentConnection.addressType}
                                  onValueChange={(val: 'Sify DC' | 'Connected DC' | 'Connected Building' | 'Custom Location') => {
                                    setCurrentConnection({
                                      ...currentConnection,
                                      addressType: val,
                                      // Reset address fields when type changes
                                      addressLine1: '',
                                      addressLine2: '',
                                      city: '',
                                      state: '',
                                      pinCode: '',
                                      latitude: '',
                                      longitude: '',
                                      dcName: '',
                                      connectedDCName: '',
                                      buildingName: '',
                                      // Reset connection types based on address type
                                      connectionTypes: val === 'Custom Location' ? [] : [{
                                        type: 'Fiber',
                                        isPrimary: true
                                      }]
                                    });
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select building type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Sify DC">Sify DC</SelectItem>
                                    <SelectItem value="Connected DC">Connected DC</SelectItem>
                                    <SelectItem value="Connected Building">Connected Building</SelectItem>
                                    <SelectItem value="Custom Location">Custom Location</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Conditional Address Fields based on Building Type */}
                              {currentConnection.addressType && (
                                <div className="space-y-3 pt-4">
                                  <Step2AddressFields
                                    currentConnection={currentConnection}
                                    setCurrentConnection={setCurrentConnection}
                                    showMap={showMap}
                                    setShowMap={setShowMap}
                                    handleMapClick={handleMapClick}
                                  />

                                  {/* Data Center Question - Only for Custom Location */}
                                  {currentConnection.addressType === 'Custom Location' && (
                                    <div className="pt-4 pb-2">
                                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <Label className="mb-3 block text-sm text-gray-900">Is this address a data center?</Label>
                                        <RadioGroup
                                          value={currentConnection.isDataCenter === true ? 'yes' : currentConnection.isDataCenter === false ? 'no' : ''}
                                          onValueChange={(value) => setCurrentConnection({
                                            ...currentConnection,
                                            isDataCenter: value === 'yes',
                                            // Reset cross connect fields if changing from yes to no
                                            crossConnectResponsibility: value === 'no' ? undefined : currentConnection.crossConnectResponsibility,
                                            crossConnectType: value === 'no' ? undefined : currentConnection.crossConnectType
                                          })}
                                          className="flex gap-6"
                                        >
                                          <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="yes" id={`is-datacenter-yes-${selectedConnectionIndex}`} />
                                            <Label htmlFor={`is-datacenter-yes-${selectedConnectionIndex}`} className="cursor-pointer font-normal">
                                              Yes
                                            </Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="no" id={`is-datacenter-no-${selectedConnectionIndex}`} />
                                            <Label htmlFor={`is-datacenter-no-${selectedConnectionIndex}`} className="cursor-pointer font-normal">
                                              No
                                            </Label>
                                          </div>
                                        </RadioGroup>
                                        <p className="text-xs text-gray-600 mt-2">
                                          Cross connect details will be required only if this is a data center
                                        </p>
                                      </div>
                                    </div>
                                  )}

                                  {/* Custom Location has special map functionality so keeping it inline */}
                                  {false && currentConnection.addressType === 'Sify DC' && (
                                    <div>
                                      <div>
                                        <Label>State *</Label>
                                        <Select
                                          value={currentConnection.state}
                                          onValueChange={(val) => setCurrentConnection({ ...currentConnection, state: val })}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select state" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {INDIAN_STATES.map((state) => (
                                              <SelectItem key={state} value={state}>{state}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <Label>City *</Label>
                                        <Select
                                          value={currentConnection.city}
                                          onValueChange={(val) => setCurrentConnection({ ...currentConnection, city: val })}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select city" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {INDIAN_CITIES.map((city) => (
                                              <SelectItem key={city} value={city}>{city}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <Label>Data Centre *</Label>
                                        <Select
                                          value={currentConnection.dcName}
                                          onValueChange={(val) => {
                                            const selectedDC = SIFY_DATA_CENTERS.find(dc => dc.name === val);
                                            setCurrentConnection({
                                              ...currentConnection,
                                              dcName: val,
                                              pinCode: selectedDC?.pinCode || '',
                                              latitude: selectedDC?.latitude || '',
                                              longitude: selectedDC?.longitude || ''
                                            });
                                          }}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select data centre" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {SIFY_DATA_CENTERS.map((dc) => (
                                              <SelectItem key={dc.name} value={dc.name}>{dc.name}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      {/* Rack, Floor, Block/Tower Details for Sify DC */}
                                      <div className="grid grid-cols-3 gap-4">
                                        <div>
                                          <Label>Rack Details *</Label>
                                          <Input
                                            placeholder="e.g., Rack 12"
                                            value={currentConnection.rackDetails || ''}
                                            onChange={(e) => setCurrentConnection({ ...currentConnection, rackDetails: e.target.value })}
                                          />
                                        </div>
                                        <div>
                                          <Label>Floor Details *</Label>
                                          <Input
                                            placeholder="e.g., Floor 3"
                                            value={currentConnection.floorDetails || ''}
                                            onChange={(e) => setCurrentConnection({ ...currentConnection, floorDetails: e.target.value })}
                                          />
                                        </div>
                                        <div>
                                          <Label>Block/Tower Details *</Label>
                                          <Input
                                            placeholder="e.g., Block A"
                                            value={currentConnection.blockTowerDetails || ''}
                                            onChange={(e) => setCurrentConnection({ ...currentConnection, blockTowerDetails: e.target.value })}
                                          />
                                        </div>
                                      </div>
                                      {currentConnection.dcName && (
                                        <div className="grid grid-cols-3 gap-4">
                                          <div>
                                            <Label className="text-xs text-gray-600">Pin Code</Label>
                                            <Input
                                              placeholder="Pin Code"
                                              value={currentConnection.pinCode}
                                              onChange={(e) => setCurrentConnection({ ...currentConnection, pinCode: e.target.value })}
                                              className="mt-1"
                                            />
                                          </div>
                                          <div>
                                            <Label className="text-xs text-gray-600">Latitude</Label>
                                            <Input
                                              placeholder="e.g., 19.0760"
                                              value={currentConnection.latitude}
                                              onChange={(e) => setCurrentConnection({ ...currentConnection, latitude: e.target.value })}
                                              className="mt-1"
                                            />
                                          </div>
                                          <div>
                                            <Label className="text-xs text-gray-600">Longitude</Label>
                                            <Input
                                              placeholder="e.g., 72.8777"
                                              value={currentConnection.longitude}
                                              onChange={(e) => setCurrentConnection({ ...currentConnection, longitude: e.target.value })}
                                              className="mt-1"
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Connected DC Address Fields */}
                                  {false && currentConnection.addressType === 'Connected DC' && (
                                    <div>
                                      <div>
                                        <Label>State *</Label>
                                        <Select
                                          value={currentConnection.state}
                                          onValueChange={(val) => setCurrentConnection({ ...currentConnection, state: val })}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select state" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {INDIAN_STATES.map((state) => (
                                              <SelectItem key={state} value={state}>{state}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <Label>City *</Label>
                                        <Select
                                          value={currentConnection.city}
                                          onValueChange={(val) => setCurrentConnection({ ...currentConnection, city: val })}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select city" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {INDIAN_CITIES.map((city) => (
                                              <SelectItem key={city} value={city}>{city}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <Label>Connected DC Name *</Label>
                                        <Select
                                          value={currentConnection.connectedDCName}
                                          onValueChange={(val) => {
                                            const selectedDC = CONNECTED_DATA_CENTERS.find(dc => dc.name === val);
                                            setCurrentConnection({
                                              ...currentConnection,
                                              connectedDCName: val,
                                              pinCode: selectedDC?.pinCode || '',
                                              latitude: selectedDC?.latitude || '',
                                              longitude: selectedDC?.longitude || ''
                                            });
                                          }}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select connected DC" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {CONNECTED_DATA_CENTERS.map((dc) => (
                                              <SelectItem key={dc.name} value={dc.name}>{dc.name}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      {/* Rack, Floor, Block/Tower Details for Connected DC */}
                                      <div className="grid grid-cols-3 gap-4">
                                        <div>
                                          <Label>Rack Details *</Label>
                                          <Input
                                            placeholder="e.g., Rack 12"
                                            value={currentConnection.rackDetails || ''}
                                            onChange={(e) => setCurrentConnection({ ...currentConnection, rackDetails: e.target.value })}
                                          />
                                        </div>
                                        <div>
                                          <Label>Floor Details *</Label>
                                          <Input
                                            placeholder="e.g., Floor 3"
                                            value={currentConnection.floorDetails || ''}
                                            onChange={(e) => setCurrentConnection({ ...currentConnection, floorDetails: e.target.value })}
                                          />
                                        </div>
                                        <div>
                                          <Label>Block/Tower Details *</Label>
                                          <Input
                                            placeholder="e.g., Block A"
                                            value={currentConnection.blockTowerDetails || ''}
                                            onChange={(e) => setCurrentConnection({ ...currentConnection, blockTowerDetails: e.target.value })}
                                          />
                                        </div>
                                      </div>
                                      {currentConnection.connectedDCName && (
                                        <div className="grid grid-cols-3 gap-4">
                                          <div>
                                            <Label className="text-xs text-gray-600">Pin Code</Label>
                                            <Input
                                              placeholder="Pin Code"
                                              value={currentConnection.pinCode}
                                              onChange={(e) => setCurrentConnection({ ...currentConnection, pinCode: e.target.value })}
                                              className="mt-1"
                                            />
                                          </div>
                                          <div>
                                            <Label className="text-xs text-gray-600">Latitude</Label>
                                            <Input
                                              placeholder="e.g., 19.0760"
                                              value={currentConnection.latitude}
                                              onChange={(e) => setCurrentConnection({ ...currentConnection, latitude: e.target.value })}
                                              className="mt-1"
                                            />
                                          </div>
                                          <div>
                                            <Label className="text-xs text-gray-600">Longitude</Label>
                                            <Input
                                              placeholder="e.g., 72.8777"
                                              value={currentConnection.longitude}
                                              onChange={(e) => setCurrentConnection({ ...currentConnection, longitude: e.target.value })}
                                              className="mt-1"
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Connected Building Address Fields */}
                                  {false && currentConnection.addressType === 'Connected Building' && (
                                    <div>
                                      <div>
                                        <Label>State *</Label>
                                        <Select
                                          value={currentConnection.state}
                                          onValueChange={(val) => setCurrentConnection({ ...currentConnection, state: val })}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select state" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {INDIAN_STATES.map((state) => (
                                              <SelectItem key={state} value={state}>{state}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <Label>City *</Label>
                                        <Select
                                          value={currentConnection.city}
                                          onValueChange={(val) => setCurrentConnection({ ...currentConnection, city: val, buildingName: '' })}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select city" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {CONNECTED_BUILDINGS.map((item) => (
                                              <SelectItem key={item.city} value={item.city}>{item.city}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      {currentConnection.city && (
                                        <div>
                                          <Label>Building *</Label>
                                          <Select
                                            value={currentConnection.buildingName}
                                            onValueChange={(val) => {
                                              const cityData = CONNECTED_BUILDINGS.find(item => item.city === currentConnection.city);
                                              const selectedBuilding = cityData?.buildings.find(b => b.name === val);
                                              setCurrentConnection({
                                                ...currentConnection,
                                                buildingName: val,
                                                pinCode: selectedBuilding?.pinCode || '',
                                                latitude: selectedBuilding?.latitude || '',
                                                longitude: selectedBuilding?.longitude || ''
                                              });
                                            }}
                                          >
                                            <SelectTrigger>
                                              <SelectValue placeholder="Search and select building" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {CONNECTED_BUILDINGS.find(item => item.city === currentConnection.city)?.buildings.map((building) => (
                                                <SelectItem key={building.name} value={building.name}>{building.name}</SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      )}
                                      {/* Rack, Floor, Block/Tower Details for Connected Building (Optional) */}
                                      <div className="grid grid-cols-3 gap-4">
                                        <div>
                                          <Label>Rack Details <span className="text-xs text-gray-500">(Optional)</span></Label>
                                          <Input
                                            placeholder="e.g., Rack 12"
                                            value={currentConnection.rackDetails || ''}
                                            onChange={(e) => setCurrentConnection({ ...currentConnection, rackDetails: e.target.value })}
                                          />
                                        </div>
                                        <div>
                                          <Label>Floor Details <span className="text-xs text-gray-500">(Optional)</span></Label>
                                          <Input
                                            placeholder="e.g., Floor 3"
                                            value={currentConnection.floorDetails || ''}
                                            onChange={(e) => setCurrentConnection({ ...currentConnection, floorDetails: e.target.value })}
                                          />
                                        </div>
                                        <div>
                                          <Label>Block/Tower Details <span className="text-xs text-gray-500">(Optional)</span></Label>
                                          <Input
                                            placeholder="e.g., Block A"
                                            value={currentConnection.blockTowerDetails || ''}
                                            onChange={(e) => setCurrentConnection({ ...currentConnection, blockTowerDetails: e.target.value })}
                                          />
                                        </div>
                                      </div>
                                      {currentConnection.buildingName && (
                                        <div className="grid grid-cols-3 gap-4">
                                          <div>
                                            <Label className="text-xs text-gray-600">Pin Code</Label>
                                            <Input
                                              placeholder="Pin Code"
                                              value={currentConnection.pinCode}
                                              onChange={(e) => setCurrentConnection({ ...currentConnection, pinCode: e.target.value })}
                                              className="mt-1"
                                            />
                                          </div>
                                          <div>
                                            <Label className="text-xs text-gray-600">Latitude</Label>
                                            <Input
                                              placeholder="e.g., 19.0760"
                                              value={currentConnection.latitude}
                                              onChange={(e) => setCurrentConnection({ ...currentConnection, latitude: e.target.value })}
                                              className="mt-1"
                                            />
                                          </div>
                                          <div>
                                            <Label className="text-xs text-gray-600">Longitude</Label>
                                            <Input
                                              placeholder="e.g., 72.8777"
                                              value={currentConnection.longitude}
                                              onChange={(e) => setCurrentConnection({ ...currentConnection, longitude: e.target.value })}
                                              className="mt-1"
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Custom Location Address Fields */}
                                  {false && currentConnection.addressType === 'Custom Location' && (
                                    <div>
                                      <div className="mb-2">
                                        <Label className="text-sm text-gray-700">Address Entry</Label>
                                      </div>

                                      <div className="space-y-3">
                                        <div>
                                          <Label>Address Line 1 *</Label>
                                          <Input
                                            placeholder="Building name, floor, office number"
                                            value={currentConnection.addressLine1}
                                            onChange={(e) => setCurrentConnection({ ...currentConnection, addressLine1: e.target.value })}
                                          />
                                        </div>
                                        <div>
                                          <Label>Address Line 2</Label>
                                          <Input
                                            placeholder="Street, area, locality"
                                            value={currentConnection.addressLine2}
                                            onChange={(e) => setCurrentConnection({ ...currentConnection, addressLine2: e.target.value })}
                                          />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                          <div>
                                            <Label>State *</Label>
                                            <Select
                                              value={currentConnection.state}
                                              onValueChange={(val) => setCurrentConnection({ ...currentConnection, state: val })}
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Select state" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {INDIAN_STATES.map((state) => (
                                                  <SelectItem key={state} value={state}>{state}</SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <div>
                                            <Label>City *</Label>
                                            <Select
                                              value={currentConnection.city}
                                              onValueChange={(val) => setCurrentConnection({ ...currentConnection, city: val })}
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Select city" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {INDIAN_CITIES.map((city) => (
                                                  <SelectItem key={city} value={city}>{city}</SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                          <div>
                                            <Label>Pin Code *</Label>
                                            <Input
                                              placeholder="000000"
                                              maxLength={6}
                                              value={currentConnection.pinCode}
                                              onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '');
                                                setCurrentConnection({ ...currentConnection, pinCode: value });
                                              }}
                                            />
                                          </div>
                                          <div>
                                            <Label className="text-xs text-gray-600">Latitude</Label>
                                            <Input
                                              placeholder="e.g., 19.0760"
                                              value={currentConnection.latitude}
                                              onChange={(e) => setCurrentConnection({ ...currentConnection, latitude: e.target.value })}
                                            />
                                          </div>
                                          <div>
                                            <Label className="text-xs text-gray-600">Longitude</Label>
                                            <Input
                                              placeholder="e.g., 72.8777"
                                              value={currentConnection.longitude}
                                              onChange={(e) => setCurrentConnection({ ...currentConnection, longitude: e.target.value })}
                                            />
                                          </div>
                                        </div>

                                        {/* Show Map Button */}
                                        {(currentConnection.addressLine1 || currentConnection.latitude) && (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowMap(!showMap)}
                                            className="mt-2 w-full"
                                          >
                                            <MapPin className="w-4 h-4 mr-2" />
                                            {showMap ? 'Hide Map' : 'Show Map & Refine Location'}
                                          </Button>
                                        )}

                                        {/* Map Display */}
                                        {showMap && (currentConnection.addressLine1 || currentConnection.latitude) && (
                                          <div className="border border-gray-300 rounded-lg overflow-hidden">
                                            <div className="bg-gray-100 p-2 border-b border-gray-300">
                                              <p className="text-xs text-gray-700">
                                                📍 Refine pin location on map (Click to update address)
                                              </p>
                                            </div>
                                            <div
                                              className="relative h-64 bg-gray-200 flex items-center justify-center cursor-crosshair"
                                              onClick={(e) => {
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                const x = e.clientX - rect.left;
                                                const y = e.clientY - rect.top;
                                                const latChange = ((y - rect.height / 2) / rect.height) * -0.01;
                                                const lngChange = ((x - rect.width / 2) / rect.width) * 0.01;
                                                const newLat = parseFloat(currentConnection.latitude || '19.0760') + latChange;
                                                const newLng = parseFloat(currentConnection.longitude || '72.8777') + lngChange;
                                                handleMapClick(newLat, newLng);
                                              }}
                                            >
                                              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-100 to-yellow-100">
                                                <div className="absolute inset-0" style={{
                                                  backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)',
                                                  backgroundSize: '20px 20px'
                                                }} />

                                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                  <div className="relative">
                                                    <div className="w-8 h-8 bg-red-500 rounded-full animate-pulse flex items-center justify-center shadow-lg">
                                                      <div className="w-4 h-4 bg-white rounded-full" />
                                                    </div>
                                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap">
                                                      {currentConnection.latitude}, {currentConnection.longitude}
                                                    </div>
                                                  </div>
                                                </div>

                                                <div className="absolute bottom-2 left-2 bg-white p-2 rounded shadow text-xs">
                                                  <p className="text-gray-700">🗺️ Interactive Map</p>
                                                  <p className="text-gray-500">Click to set pin</p>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="bg-gray-50 p-2 text-xs text-gray-600 text-center">
                                              Click anywhere on the map to update address
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <Separator />
                        </div>
                      )}



                      {/* No of Links - Shown after address details */}
                      {(requirementInfo.product === 'DIA' || requirementInfo.product === 'MPLS') && (
                        <div>
                          <h4 className="text-sm text-gray-900 mb-3">Link Configuration</h4>
                          <div>
                            <Label>Link Type *</Label>
                            <Select
                              value={currentConnection.numberOfLinks || 'Single'}
                              onValueChange={(val: 'Single' | 'Dual link with single cloud' | 'Dual link with dual cloud') => {
                                // Reset Secondary 2 fields if switching from dual to single
                                if (val === 'Single') {
                                  setCurrentConnection({
                                    ...currentConnection,
                                    numberOfLinks: val,
                                    link2BandwidthValue: undefined,
                                    link2ConnectionTypes: undefined,
                                    link2CloudProvider: undefined
                                  });
                                } else {
                                  setCurrentConnection({ ...currentConnection, numberOfLinks: val });
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select number of links" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Single">Single Link</SelectItem>
                                <SelectItem value="Dual link with single cloud">Dual link with single cloud</SelectItem>
                                <SelectItem value="Dual link with dual cloud">Dual link with dual cloud</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Cross Connect Responsibility - Moved here */}
                          {requirementInfo.orderType === 'New' && currentConnection.numberOfLinks === 'Single' && currentConnection.addressType &&
                            (currentConnection.addressType !== 'Custom Location' || currentConnection.isDataCenter === true) && (
                              <div className="mt-6">
                                <h4 className="text-sm text-gray-900 mb-3">Cross Connect Responsibility</h4>
                                <div>
                                  <Label className="mb-2 block">Who will handle the cross connect? *</Label>
                                  <RadioGroup
                                    value={currentConnection.crossConnectResponsibility || ''}
                                    onValueChange={(value: 'Sify' | 'Customer') => setCurrentConnection({
                                      ...currentConnection,
                                      crossConnectResponsibility: value,
                                      crossConnectType: value === 'Sify' ? currentConnection.crossConnectType : undefined
                                    })}
                                  >
                                    <div className="flex gap-6">
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Sify" id={`cross-connect-sify-${selectedConnectionIndex}`} />
                                        <Label htmlFor={`cross-connect-sify-${selectedConnectionIndex}`} className="cursor-pointer font-normal">
                                          Sify
                                        </Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Customer" id={`cross-connect-customer-${selectedConnectionIndex}`} />
                                        <Label htmlFor={`cross-connect-customer-${selectedConnectionIndex}`} className="cursor-pointer font-normal">
                                          Customer
                                        </Label>
                                      </div>
                                    </div>
                                  </RadioGroup>
                                </div>

                                {currentConnection.crossConnectResponsibility === 'Sify' && (
                                  <div className="mt-4 max-w-xs">
                                    <Label>Cross Connect Type *</Label>
                                    <Select
                                      value={currentConnection.crossConnectType || ''}
                                      onValueChange={(value: 'Copper' | 'Fiber') => setCurrentConnection({ ...currentConnection, crossConnectType: value })}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Copper">Copper</SelectItem>
                                        <SelectItem value="Fiber">Fiber</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}
                              </div>
                            )}
                          {/* Cloud/Network Provider for Dual link with single cloud - Removed as each link now has its own */}

                          <Separator className="mt-6" />
                        </div>
                      )}


                      {/* Link Configuration - Each link has its own Port + Bandwidth + LM */}
                      {currentConnection.numberOfLinks === 'Single' ? (
                        /* ===== SINGLE LINK ===== */
                        <div className="space-y-6">

                          {/* Cloud/Network Provider for Single Link */}
                          <div className="max-w-xs">
                            <Label>Cloud/Network Provider *</Label>
                            <Select
                              value={currentConnection.cloudProvider || ''}
                              onValueChange={(val: 'Sify' | 'Other ISP') => setCurrentConnection({
                                ...currentConnection,
                                cloudProvider: val,
                                connectionTypes: [] // Reset
                              })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select provider" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Sify">Sify</SelectItem>
                                <SelectItem value="Other ISP">Other ISP</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Port Details */}
                          <div>
                            <h4 className="text-sm text-gray-900 mb-3">Port Details</h4>
                            {requirementInfo.product === 'DIA' ? (
                              <div>
                                <div className="flex items-start gap-6 flex-wrap">
                                  <div className="max-w-xs">
                                    <Label htmlFor={`port-classification-${selectedConnectionIndex}`} className="text-gray-900 mb-2 block">
                                      Port Classification {requirementInfo.orderType !== 'MDAC' && <span className="text-red-500">*</span>}
                                    </Label>
                                    <Select
                                      value={currentConnection.linkType || ''}
                                      onValueChange={(val: string) => setCurrentConnection({ ...currentConnection, linkType: val })}
                                    >
                                      <SelectTrigger id={`port-classification-${selectedConnectionIndex}`}>
                                        <SelectValue placeholder="Select" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Primary">Primary</SelectItem>
                                        <SelectItem value="Secondary">Secondary</SelectItem>
                                        <SelectItem value="Tertiary">Tertiary</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="max-w-xs">
                                    <Label htmlFor={`handoff-type-${selectedConnectionIndex}`} className="text-gray-900 mb-2 block">
                                      Hand off Type {requirementInfo.orderType !== 'MDAC' && <span className="text-red-500">*</span>}
                                    </Label>
                                    <Select
                                      value={currentConnection.portType || ''}
                                      onValueChange={(val) => setCurrentConnection({ ...currentConnection, portType: val })}
                                    >
                                      <SelectTrigger id={`handoff-type-${selectedConnectionIndex}`}>
                                        <SelectValue placeholder="Select" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Electrical Ethernet">Electrical Ethernet</SelectItem>
                                        <SelectItem value="Optical Ethernet - Single mode">Optical Ethernet - Single mode</SelectItem>
                                        <SelectItem value="Optical Ethernet - Multi mode">Optical Ethernet - Multi mode</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="max-w-xs">
                                    <Label htmlFor={`port-bandwidth-${selectedConnectionIndex}`} className="text-gray-900 mb-2 block">
                                      Port Bandwidth {requirementInfo.orderType !== 'MDAC' && <span className="text-red-500">*</span>}
                                    </Label>
                                    <Select
                                      value={currentConnection.portBandwidth || ''}
                                      onValueChange={(val) => setCurrentConnection({ ...currentConnection, portBandwidth: val })}
                                    >
                                      <SelectTrigger id={`port-bandwidth-${selectedConnectionIndex}`}>
                                        <SelectValue placeholder="Select" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {getFilteredPortBandwidthOptions(currentConnection.bandwidthValue || '').map((option) => (
                                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="max-w-xs">
                                    <Label htmlFor={`bandwidth-type-${selectedConnectionIndex}`} className="text-gray-900 mb-2 block">
                                      Bandwidth Type {requirementInfo.orderType !== 'MDAC' && <span className="text-red-500">*</span>}
                                    </Label>
                                    <Select
                                      value={currentConnection.bandwidthType || ''}
                                      onValueChange={(value: 'fixed' | 'burstable') => {
                                        setCurrentConnection({
                                          ...currentConnection,
                                          bandwidthType: value,
                                          burstOption: value === 'fixed' ? '' : currentConnection.burstOption
                                        });
                                      }}
                                    >
                                      <SelectTrigger id={`bandwidth-type-${selectedConnectionIndex}`}>
                                        <SelectValue placeholder="Select" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="fixed">Fixed</SelectItem>
                                        <SelectItem value="burstable">Burstable</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  {currentConnection.bandwidthType === 'burstable' && (
                                    <div className="max-w-xs">
                                      <Label htmlFor={`burst-option-${selectedConnectionIndex}`} className="text-gray-900 mb-2 block">
                                        Burst Option {requirementInfo.orderType !== 'MDAC' && <span className="text-red-500">*</span>}
                                      </Label>
                                      <Select
                                        value={currentConnection.burstOption || ''}
                                        onValueChange={(val) => setCurrentConnection({ ...currentConnection, burstOption: val })}
                                      >
                                        <SelectTrigger id={`burst-option-${selectedConnectionIndex}`}>
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
                                    <Label htmlFor={`port-type-size-${selectedConnectionIndex}`} className="text-gray-900 mb-2 block">
                                      Port Type {requirementInfo.orderType !== 'MDAC' && <span className="text-red-500">*</span>}
                                    </Label>
                                    <Select
                                      value={currentConnection.portTypeSize || ''}
                                      onValueChange={(val) => setCurrentConnection({ ...currentConnection, portTypeSize: val })}
                                    >
                                      <SelectTrigger id={`port-type-size-${selectedConnectionIndex}`}>
                                        <SelectValue placeholder="Select" />
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
                                      id={`sify-dns-cache-${selectedConnectionIndex}`}
                                      checked={currentConnection.sifyDnsCache || false}
                                      onCheckedChange={(checked) => setCurrentConnection({ ...currentConnection, sifyDnsCache: checked as boolean })}
                                    />
                                    <Label
                                      htmlFor={`sify-dns-cache-${selectedConnectionIndex}`}
                                      className="text-sm text-gray-900 cursor-pointer"
                                    >
                                      Sify DNS cache services
                                    </Label>
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`port-redundancy-${selectedConnectionIndex}`}
                                      checked={currentConnection.portRedundancy || false}
                                      onCheckedChange={(checked) => setCurrentConnection({ ...currentConnection, portRedundancy: checked as boolean })}
                                    />
                                    <Label
                                      htmlFor={`port-redundancy-${selectedConnectionIndex}`}
                                      className="text-sm text-gray-900 cursor-pointer"
                                    >
                                      Port redundancy required
                                    </Label>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-start gap-6 flex-wrap">
                                <div className="max-w-xs">
                                  <Label htmlFor={`port-classification-mpls-${selectedConnectionIndex}`} className="text-gray-900 mb-2 block">
                                    Port Classification {requirementInfo.orderType !== 'MDAC' && <span className="text-red-500">*</span>}
                                  </Label>
                                  <Select
                                    value={currentConnection.linkType || ''}
                                    onValueChange={(val) => setCurrentConnection({ ...currentConnection, linkType: val })}
                                  >
                                    <SelectTrigger id={`port-classification-mpls-${selectedConnectionIndex}`}>
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Primary">Primary</SelectItem>
                                      <SelectItem value="Secondary">Secondary</SelectItem>
                                      <SelectItem value="Tertiary">Tertiary</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="max-w-xs">
                                  <Label htmlFor={`handoff-type-mpls-${selectedConnectionIndex}`} className="text-gray-900 mb-2 block">
                                    Hand off Type {requirementInfo.orderType !== 'MDAC' && <span className="text-red-500">*</span>}
                                  </Label>
                                  <Select
                                    value={currentConnection.portType || ''}
                                    onValueChange={(val) => setCurrentConnection({ ...currentConnection, portType: val })}
                                  >
                                    <SelectTrigger id={`handoff-type-mpls-${selectedConnectionIndex}`}>
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Electrical Ethernet">Electrical Ethernet</SelectItem>
                                      <SelectItem value="Optical Ethernet - Single mode">Optical Ethernet - Single mode</SelectItem>
                                      <SelectItem value="Optical Ethernet - Multi mode">Optical Ethernet - Multi mode</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="max-w-xs">
                                  <Label htmlFor={`port-bandwidth-mpls-${selectedConnectionIndex}`} className="text-gray-900 mb-2 block">
                                    Port Bandwidth {requirementInfo.orderType !== 'MDAC' && <span className="text-red-500">*</span>}
                                  </Label>
                                  <Select
                                    value={currentConnection.portBandwidth || ''}
                                    onValueChange={(val) => setCurrentConnection({ ...currentConnection, portBandwidth: val })}
                                  >
                                    <SelectTrigger id={`port-bandwidth-mpls-${selectedConnectionIndex}`}>
                                      <SelectValue placeholder="Select" />
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
                                  <Label htmlFor={`port-type-size-mpls-${selectedConnectionIndex}`} className="text-gray-900 mb-2 block">
                                    Port Type {requirementInfo.orderType !== 'MDAC' && <span className="text-red-500">*</span>}
                                  </Label>
                                  <Select
                                    value={currentConnection.portTypeSize || ''}
                                    onValueChange={(val) => setCurrentConnection({ ...currentConnection, portTypeSize: val })}
                                  >
                                    <SelectTrigger id={`port-type-size-mpls-${selectedConnectionIndex}`}>
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="1G">1G</SelectItem>
                                      <SelectItem value="10G">10G</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            )}
                          </div>

                          <Separator />

                          {/* Bandwidth for Single Link */}
                          <div>
                            <h4 className="text-sm text-gray-900 mb-3">Bandwidth</h4>
                            <div className="max-w-xs">
                              <Label>Bandwidth *</Label>
                              <div className="flex gap-2">
                                <Input
                                  type="text"
                                  placeholder="Enter value"
                                  value={(() => {
                                    const match = currentConnection.bandwidthValue?.match(/^([\d.]+)/);
                                    return match ? match[1] : '';
                                  })()}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/[^\d.]/g, '');
                                    const unit = currentConnection.bandwidthValue?.includes('Gbps') ? 'Gbps' : 'Mbps';
                                    setCurrentConnection({
                                      ...currentConnection,
                                      bandwidthValue: value ? `${value} ${unit}` : ''
                                    });
                                  }}
                                  className="flex-1"
                                />
                                <Select
                                  value={currentConnection.bandwidthValue?.includes('Gbps') ? 'Gbps' : 'Mbps'}
                                  onValueChange={(unit: 'Mbps' | 'Gbps') => {
                                    const match = currentConnection.bandwidthValue?.match(/^([\d.]+)/);
                                    const numericValue = match ? match[1] : '';
                                    setCurrentConnection({
                                      ...currentConnection,
                                      bandwidthValue: numericValue ? `${numericValue} ${unit}` : ''
                                    });
                                  }}
                                >
                                  <SelectTrigger className="w-28">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Mbps">Mbps</SelectItem>
                                    <SelectItem value="Gbps">Gbps</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          {/* Last Mile Type for Single Link */}
                          <div>
                            <LMTypeSelector
                              connectionTypes={currentConnection.connectionTypes || []}
                              onConnectionTypesChange={(types: ConnectionTypeItem[]) => {
                                setCurrentConnection({
                                  ...currentConnection,
                                  connectionTypes: types
                                });
                              }}
                              idPrefix="single-link"
                              cloudProvider={currentConnection.cloudProvider}
                              dcLocation={
                                currentConnection.addressType === 'Sify DC' ||
                                currentConnection.addressType === 'Connected DC'
                              }
                            />
                          </div>

                        </div>
                      ) : (currentConnection.numberOfLinks === 'Dual link with single cloud' || currentConnection.numberOfLinks === 'Dual link with dual cloud') ? (
                        /* ===== DUAL LINK ===== */
                        <div className="space-y-8">

                          {/* ========== PRIMARY LINK ========== */}
                          <div className="border-2 border-blue-300 rounded-lg p-6 bg-blue-50/30">
                            <div className="flex items-center gap-2 mb-6">
                              <div className="bg-blue-600 text-white px-3 py-1.5 rounded-md font-semibold text-sm">
                                Primary 1
                              </div>
                            </div>

                            {/* Cloud/Network Provider for Dual links - Primary 1 */}
                            {(currentConnection.numberOfLinks === 'Dual link with single cloud' || currentConnection.numberOfLinks === 'Dual link with dual cloud') && (
                              <div className="mb-6 max-w-xs">
                                <Label>Cloud/Network Provider *</Label>
                                <Select
                                  value={currentConnection.cloudProvider || ''}
                                  onValueChange={(val: 'Sify' | 'Other ISP') => setCurrentConnection({
                                    ...currentConnection,
                                    cloudProvider: val,
                                    link2CloudProvider: val === 'Sify' ? 'Other ISP' : 'Sify',
                                    connectionTypes: [],
                                    link2ConnectionTypes: []
                                  })}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select provider" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Sify">Sify</SelectItem>
                                    <SelectItem value="Other ISP">Other ISP</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}

                            {/* Primary 1 Cross Connect Responsibility */}
                            {requirementInfo.orderType === 'New' && currentConnection.addressType &&
                              (currentConnection.addressType !== 'Custom Location' || currentConnection.isDataCenter === true) && (
                                <div className="mb-6">
                                  <h4 className="text-sm text-gray-900 mb-3">Cross Connect Responsibility</h4>
                                  <div>
                                    <Label className="mb-2 block">Who will handle the cross connect? *</Label>
                                    <RadioGroup
                                      value={currentConnection.crossConnectResponsibility || ''}
                                      onValueChange={(value: 'Sify' | 'Customer') => setCurrentConnection({
                                        ...currentConnection,
                                        crossConnectResponsibility: value,
                                        crossConnectType: value === 'Sify' ? currentConnection.crossConnectType : undefined
                                      })}
                                    >
                                      <div className="flex gap-6">
                                        <div className="flex items-center space-x-2">
                                          <RadioGroupItem value="Sify" id={`cross-connect-sify-l1-${selectedConnectionIndex}`} />
                                          <Label htmlFor={`cross-connect-sify-l1-${selectedConnectionIndex}`} className="cursor-pointer font-normal">
                                            Sify
                                          </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <RadioGroupItem value="Customer" id={`cross-connect-customer-l1-${selectedConnectionIndex}`} />
                                          <Label htmlFor={`cross-connect-customer-l1-${selectedConnectionIndex}`} className="cursor-pointer font-normal">
                                            Customer
                                          </Label>
                                        </div>
                                      </div>
                                    </RadioGroup>
                                  </div>

                                  {currentConnection.crossConnectResponsibility === 'Sify' && (
                                    <div className="mt-4 max-w-xs">
                                      <Label>Cross Connect Type *</Label>
                                      <Select
                                        value={currentConnection.crossConnectType || ''}
                                        onValueChange={(value: 'Copper' | 'Fiber') => setCurrentConnection({ ...currentConnection, crossConnectType: value })}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Copper">Copper</SelectItem>
                                          <SelectItem value="Fiber">Fiber</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  )}
                                </div>
                              )}

                            {/* Port Details for Primary Link */}
                            <div className="mb-6">
                              <h4 className="text-sm text-gray-900 mb-3 font-medium">Port Details</h4>
                              {requirementInfo.product === 'DIA' ? (
                                <div>
                                  <div className="flex items-start gap-6 flex-wrap">
                                    <div className="max-w-xs">
                                      <Label htmlFor={`handoff-type-primary-${selectedConnectionIndex}`} className="text-gray-900 mb-2 block">
                                        Hand off Type {requirementInfo.orderType !== 'MDAC' && <span className="text-red-500">*</span>}
                                      </Label>
                                      <Select
                                        value={currentConnection.portType || ''}
                                        onValueChange={(val) => setCurrentConnection({ ...currentConnection, portType: val })}
                                      >
                                        <SelectTrigger id={`handoff-type-primary-${selectedConnectionIndex}`}>
                                          <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Electrical Ethernet">Electrical Ethernet</SelectItem>
                                          <SelectItem value="Optical Ethernet - Single mode">Optical Ethernet - Single mode</SelectItem>
                                          <SelectItem value="Optical Ethernet - Multi mode">Optical Ethernet - Multi mode</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="max-w-xs">
                                      <Label htmlFor={`port-bandwidth-primary-${selectedConnectionIndex}`} className="text-gray-900 mb-2 block">
                                        Port Bandwidth {requirementInfo.orderType !== 'MDAC' && <span className="text-red-500">*</span>}
                                      </Label>
                                      <Select
                                        value={currentConnection.portBandwidth || ''}
                                        onValueChange={(val) => setCurrentConnection({ ...currentConnection, portBandwidth: val })}
                                      >
                                        <SelectTrigger id={`port-bandwidth-primary-${selectedConnectionIndex}`}>
                                          <SelectValue placeholder="Select" />
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
                                      <Label htmlFor={`bandwidth-type-primary-${selectedConnectionIndex}`} className="text-gray-900 mb-2 block">
                                        Bandwidth Type {requirementInfo.orderType !== 'MDAC' && <span className="text-red-500">*</span>}
                                      </Label>
                                      <Select
                                        value={currentConnection.bandwidthType || ''}
                                        onValueChange={(value: 'fixed' | 'burstable') => {
                                          setCurrentConnection({
                                            ...currentConnection,
                                            bandwidthType: value,
                                            burstOption: value === 'fixed' ? '' : currentConnection.burstOption
                                          });
                                        }}
                                      >
                                        <SelectTrigger id={`bandwidth-type-primary-${selectedConnectionIndex}`}>
                                          <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="fixed">Fixed</SelectItem>
                                          <SelectItem value="burstable">Burstable</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    {currentConnection.bandwidthType === 'burstable' && (
                                      <div className="max-w-xs">
                                        <Label htmlFor={`burst-option-primary-${selectedConnectionIndex}`} className="text-gray-900 mb-2 block">
                                          Burst Option {requirementInfo.orderType !== 'MDAC' && <span className="text-red-500">*</span>}
                                        </Label>
                                        <Select
                                          value={currentConnection.burstOption || ''}
                                          onValueChange={(val) => setCurrentConnection({ ...currentConnection, burstOption: val })}
                                        >
                                          <SelectTrigger id={`burst-option-primary-${selectedConnectionIndex}`}>
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
                                      <Label htmlFor={`port-type-size-primary-${selectedConnectionIndex}`} className="text-gray-900 mb-2 block">
                                        Port Type {requirementInfo.orderType !== 'MDAC' && <span className="text-red-500">*</span>}
                                      </Label>
                                      <Select
                                        value={currentConnection.portTypeSize || ''}
                                        onValueChange={(val) => setCurrentConnection({ ...currentConnection, portTypeSize: val })}
                                      >
                                        <SelectTrigger id={`port-type-size-primary-${selectedConnectionIndex}`}>
                                          <SelectValue placeholder="Select" />
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
                                        id={`sify-dns-cache-primary-${selectedConnectionIndex}`}
                                        checked={currentConnection.sifyDnsCache || false}
                                        onCheckedChange={(checked) => setCurrentConnection({ ...currentConnection, sifyDnsCache: checked as boolean })}
                                      />
                                      <Label
                                        htmlFor={`sify-dns-cache-primary-${selectedConnectionIndex}`}
                                        className="text-sm text-gray-900 cursor-pointer"
                                      >
                                        Sify DNS cache services
                                      </Label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`port-redundancy-primary-${selectedConnectionIndex}`}
                                        checked={currentConnection.portRedundancy || false}
                                        onCheckedChange={(checked) => setCurrentConnection({ ...currentConnection, portRedundancy: checked as boolean })}
                                      />
                                      <Label
                                        htmlFor={`port-redundancy-primary-${selectedConnectionIndex}`}
                                        className="text-sm text-gray-900 cursor-pointer"
                                      >
                                        Port redundancy required
                                      </Label>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-start gap-6 flex-wrap">
                                  <div className="max-w-xs">
                                    <Label htmlFor={`handoff-type-mpls-primary-${selectedConnectionIndex}`} className="text-gray-900 mb-2 block">
                                      Hand off Type {requirementInfo.orderType !== 'MDAC' && <span className="text-red-500">*</span>}
                                    </Label>
                                    <Select
                                      value={currentConnection.portType || ''}
                                      onValueChange={(val) => setCurrentConnection({ ...currentConnection, portType: val })}
                                    >
                                      <SelectTrigger id={`handoff-type-mpls-primary-${selectedConnectionIndex}`}>
                                        <SelectValue placeholder="Select" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Electrical Ethernet">Electrical Ethernet</SelectItem>
                                        <SelectItem value="Optical Ethernet - Single mode">Optical Ethernet - Single mode</SelectItem>
                                        <SelectItem value="Optical Ethernet - Multi mode">Optical Ethernet - Multi mode</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="max-w-xs">
                                    <Label htmlFor={`port-bandwidth-mpls-primary-${selectedConnectionIndex}`} className="text-gray-900 mb-2 block">
                                      Port Bandwidth {requirementInfo.orderType !== 'MDAC' && <span className="text-red-500">*</span>}
                                    </Label>
                                    <Select
                                      value={currentConnection.portBandwidth || ''}
                                      onValueChange={(val) => setCurrentConnection({ ...currentConnection, portBandwidth: val })}
                                    >
                                      <SelectTrigger id={`port-bandwidth-mpls-primary-${selectedConnectionIndex}`}>
                                        <SelectValue placeholder="Select" />
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
                                    <Label htmlFor={`port-type-size-mpls-primary-${selectedConnectionIndex}`} className="text-gray-900 mb-2 block">
                                      Port Type {requirementInfo.orderType !== 'MDAC' && <span className="text-red-500">*</span>}
                                    </Label>
                                    <Select
                                      value={currentConnection.portTypeSize || ''}
                                      onValueChange={(val) => setCurrentConnection({ ...currentConnection, portTypeSize: val })}
                                    >
                                      <SelectTrigger id={`port-type-size-mpls-primary-${selectedConnectionIndex}`}>
                                        <SelectValue placeholder="Select" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="1G">1G</SelectItem>
                                        <SelectItem value="10G">10G</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              )}
                            </div>

                            <Separator className="my-6" />

                            {/* Bandwidth for Primary Link */}
                            <div className="mb-6">
                              <h4 className="text-sm text-gray-900 mb-3 font-medium">Bandwidth</h4>
                              <div className="max-w-xs">
                                <Label>Bandwidth *</Label>
                                <div className="flex gap-2">
                                  <Input
                                    type="text"
                                    placeholder="Enter value"
                                    value={(() => {
                                      const match = currentConnection.bandwidthValue?.match(/^([\d.]+)/);
                                      return match ? match[1] : '';
                                    })()}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/[^\d.]/g, '');
                                      const unit = currentConnection.bandwidthValue?.includes('Gbps') ? 'Gbps' : 'Mbps';
                                      setCurrentConnection({
                                        ...currentConnection,
                                        bandwidthValue: value ? `${value} ${unit}` : ''
                                      });
                                    }}
                                    className="flex-1"
                                  />
                                  <Select
                                    value={currentConnection.bandwidthValue?.includes('Gbps') ? 'Gbps' : 'Mbps'}
                                    onValueChange={(unit: 'Mbps' | 'Gbps') => {
                                      const match = currentConnection.bandwidthValue?.match(/^([\d.]+)/);
                                      const numericValue = match ? match[1] : '';
                                      setCurrentConnection({
                                        ...currentConnection,
                                        bandwidthValue: numericValue ? `${numericValue} ${unit}` : ''
                                      });
                                    }}
                                  >
                                    <SelectTrigger className="w-28">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Mbps">Mbps</SelectItem>
                                      <SelectItem value="Gbps">Gbps</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>

                            <Separator className="my-6" />

                            {/* Last Mile Type for Primary Link */}
                            <div>
                              <LMTypeSelector
                                connectionTypes={currentConnection.connectionTypes || []}
                                onConnectionTypesChange={(types: ConnectionTypeItem[]) => {
                                  setCurrentConnection({
                                    ...currentConnection,
                                    connectionTypes: types
                                  });
                                }}
                                idPrefix="primary-link"
                                cloudProvider={currentConnection.cloudProvider}
                                dcLocation={
                                  currentConnection.addressType === 'Sify DC' ||
                                  currentConnection.addressType === 'Connected DC'
                                }
                              />
                            </div>
                          </div>

                          {/* ========== SECONDARY LINK ========== */}
                          <div className="border-2 border-gray-300 rounded-lg p-6 bg-gray-50/30">
                            <div className="flex items-center gap-2 mb-6">
                              <div className="bg-gray-600 text-white px-3 py-1.5 rounded-md font-semibold text-sm">
                                Secondary 2
                              </div>
                            </div>

                            {/* Cloud/Network Provider for Dual links - Secondary 2 */}
                            {(currentConnection.numberOfLinks === 'Dual link with single cloud' || currentConnection.numberOfLinks === 'Dual link with dual cloud') && (
                              <div className="mb-6 max-w-xs">
                                <Label>Cloud/Network Provider *</Label>
                                <Select
                                  value={currentConnection.link2CloudProvider || ''}
                                  onValueChange={(val: 'Sify' | 'Other ISP') => setCurrentConnection({
                                    ...currentConnection,
                                    link2CloudProvider: val,
                                    cloudProvider: val === 'Sify' ? 'Other ISP' : 'Sify',
                                    connectionTypes: [],
                                    link2ConnectionTypes: []
                                  })}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select provider" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Sify">Sify</SelectItem>
                                    <SelectItem value="Other ISP">Other ISP</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}

                            {/* Secondary 2 Cross Connect Responsibility */}
                            {requirementInfo.orderType === 'New' && currentConnection.addressType &&
                              (currentConnection.addressType !== 'Custom Location' || currentConnection.isDataCenter === true) && (
                                <div className="mb-6">
                                  <h4 className="text-sm text-gray-900 mb-3">Cross Connect Responsibility</h4>
                                  <div>
                                    <Label className="mb-2 block">Who will handle the cross connect? *</Label>
                                    <RadioGroup
                                      value={currentConnection.link2CrossConnectResponsibility || ''}
                                      onValueChange={(value: 'Sify' | 'Customer') => setCurrentConnection({
                                        ...currentConnection,
                                        link2CrossConnectResponsibility: value,
                                        link2CrossConnectType: value === 'Sify' ? currentConnection.link2CrossConnectType : undefined
                                      })}
                                    >
                                      <div className="flex gap-6">
                                        <div className="flex items-center space-x-2">
                                          <RadioGroupItem value="Sify" id={`cross-connect-sify-l2-${selectedConnectionIndex}`} />
                                          <Label htmlFor={`cross-connect-sify-l2-${selectedConnectionIndex}`} className="cursor-pointer font-normal">
                                            Sify
                                          </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <RadioGroupItem value="Customer" id={`cross-connect-customer-l2-${selectedConnectionIndex}`} />
                                          <Label htmlFor={`cross-connect-customer-l2-${selectedConnectionIndex}`} className="cursor-pointer font-normal">
                                            Customer
                                          </Label>
                                        </div>
                                      </div>
                                    </RadioGroup>
                                  </div>

                                  {currentConnection.link2CrossConnectResponsibility === 'Sify' && (
                                    <div className="mt-4 max-w-xs">
                                      <Label>Cross Connect Type *</Label>
                                      <Select
                                        value={currentConnection.link2CrossConnectType || ''}
                                        onValueChange={(value: 'Copper' | 'Fiber') => setCurrentConnection({ ...currentConnection, link2CrossConnectType: value })}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Copper">Copper</SelectItem>
                                          <SelectItem value="Fiber">Fiber</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  )}
                                </div>
                              )}

                            {/* Port Details for Secondary Link */}
                            <div className="mb-6">
                              <h4 className="text-sm text-gray-900 mb-3 font-medium">Port Details</h4>
                              {requirementInfo.product === 'DIA' ? (
                                <div>
                                  <div className="flex items-start gap-6 flex-wrap">
                                    <div className="max-w-xs">
                                      <Label htmlFor={`handoff-type-secondary-${selectedConnectionIndex}`} className="text-gray-900 mb-2 block">
                                        Hand off Type {requirementInfo.orderType !== 'MDAC' && <span className="text-red-500">*</span>}
                                      </Label>
                                      <Select
                                        value={currentConnection.link2PortType || ''}
                                        onValueChange={(val) => setCurrentConnection({ ...currentConnection, link2PortType: val })}
                                      >
                                        <SelectTrigger id={`handoff-type-secondary-${selectedConnectionIndex}`}>
                                          <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Electrical Ethernet">Electrical Ethernet</SelectItem>
                                          <SelectItem value="Optical Ethernet - Single mode">Optical Ethernet - Single mode</SelectItem>
                                          <SelectItem value="Optical Ethernet - Multi mode">Optical Ethernet - Multi mode</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="max-w-xs">
                                      <Label htmlFor={`port-bandwidth-secondary-${selectedConnectionIndex}`} className="text-gray-900 mb-2 block">
                                        Port Bandwidth {requirementInfo.orderType !== 'MDAC' && <span className="text-red-500">*</span>}
                                      </Label>
                                      <Select
                                        value={currentConnection.link2PortBandwidth || ''}
                                        onValueChange={(val) => setCurrentConnection({ ...currentConnection, link2PortBandwidth: val })}
                                      >
                                        <SelectTrigger id={`port-bandwidth-secondary-${selectedConnectionIndex}`}>
                                          <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {getFilteredPortBandwidthOptions(currentConnection.link2BandwidthValue || '').map((option) => (
                                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="max-w-xs">
                                      <Label htmlFor={`bandwidth-type-secondary-${selectedConnectionIndex}`} className="text-gray-900 mb-2 block">
                                        Bandwidth Type {requirementInfo.orderType !== 'MDAC' && <span className="text-red-500">*</span>}
                                      </Label>
                                      <Select
                                        value={currentConnection.link2BandwidthType || ''}
                                        onValueChange={(value: 'fixed' | 'burstable') => {
                                          setCurrentConnection({
                                            ...currentConnection,
                                            link2BandwidthType: value,
                                            link2BurstOption: value === 'fixed' ? '' : currentConnection.link2BurstOption
                                          });
                                        }}
                                      >
                                        <SelectTrigger id={`bandwidth-type-secondary-${selectedConnectionIndex}`}>
                                          <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="fixed">Fixed</SelectItem>
                                          <SelectItem value="burstable">Burstable</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    {currentConnection.link2BandwidthType === 'burstable' && (
                                      <div className="max-w-xs">
                                        <Label htmlFor={`burst-option-secondary-${selectedConnectionIndex}`} className="text-gray-900 mb-2 block">
                                          Burst Option {requirementInfo.orderType !== 'MDAC' && <span className="text-red-500">*</span>}
                                        </Label>
                                        <Select
                                          value={currentConnection.link2BurstOption || ''}
                                          onValueChange={(val) => setCurrentConnection({ ...currentConnection, link2BurstOption: val })}
                                        >
                                          <SelectTrigger id={`burst-option-secondary-${selectedConnectionIndex}`}>
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
                                      <Label htmlFor={`port-type-size-secondary-${selectedConnectionIndex}`} className="text-gray-900 mb-2 block">
                                        Port Type {requirementInfo.orderType !== 'MDAC' && <span className="text-red-500">*</span>}
                                      </Label>
                                      <Select
                                        value={currentConnection.link2PortTypeSize || ''}
                                        onValueChange={(val) => setCurrentConnection({ ...currentConnection, link2PortTypeSize: val })}
                                      >
                                        <SelectTrigger id={`port-type-size-secondary-${selectedConnectionIndex}`}>
                                          <SelectValue placeholder="Select" />
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
                                        id={`sify-dns-cache-secondary-${selectedConnectionIndex}`}
                                        checked={currentConnection.link2SifyDnsCache || false}
                                        onCheckedChange={(checked) => setCurrentConnection({ ...currentConnection, link2SifyDnsCache: checked as boolean })}
                                      />
                                      <Label
                                        htmlFor={`sify-dns-cache-secondary-${selectedConnectionIndex}`}
                                        className="text-sm text-gray-900 cursor-pointer"
                                      >
                                        Sify DNS cache services
                                      </Label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`port-redundancy-secondary-${selectedConnectionIndex}`}
                                        checked={currentConnection.link2PortRedundancy || false}
                                        onCheckedChange={(checked) => setCurrentConnection({ ...currentConnection, link2PortRedundancy: checked as boolean })}
                                      />
                                      <Label
                                        htmlFor={`port-redundancy-secondary-${selectedConnectionIndex}`}
                                        className="text-sm text-gray-900 cursor-pointer"
                                      >
                                        Port redundancy required
                                      </Label>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-start gap-6 flex-wrap">
                                  <div className="max-w-xs">
                                    <Label htmlFor={`handoff-type-mpls-secondary-${selectedConnectionIndex}`} className="text-gray-900 mb-2 block">
                                      Hand off Type {requirementInfo.orderType !== 'MDAC' && <span className="text-red-500">*</span>}
                                    </Label>
                                    <Select
                                      value={currentConnection.link2PortType || ''}
                                      onValueChange={(val) => setCurrentConnection({ ...currentConnection, link2PortType: val })}
                                    >
                                      <SelectTrigger id={`handoff-type-mpls-secondary-${selectedConnectionIndex}`}>
                                        <SelectValue placeholder="Select" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Electrical Ethernet">Electrical Ethernet</SelectItem>
                                        <SelectItem value="Optical Ethernet - Single mode">Optical Ethernet - Single mode</SelectItem>
                                        <SelectItem value="Optical Ethernet - Multi mode">Optical Ethernet - Multi mode</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="max-w-xs">
                                    <Label htmlFor={`port-bandwidth-mpls-secondary-${selectedConnectionIndex}`} className="text-gray-900 mb-2 block">
                                      Port Bandwidth {requirementInfo.orderType !== 'MDAC' && <span className="text-red-500">*</span>}
                                    </Label>
                                    <Select
                                      value={currentConnection.link2PortBandwidth || ''}
                                      onValueChange={(val) => setCurrentConnection({ ...currentConnection, link2PortBandwidth: val })}
                                    >
                                      <SelectTrigger id={`port-bandwidth-mpls-secondary-${selectedConnectionIndex}`}>
                                        <SelectValue placeholder="Select" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {getFilteredPortBandwidthOptions(currentConnection.link2BandwidthValue || '').map((option) => (
                                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="max-w-xs">
                                    <Label htmlFor={`port-type-size-mpls-secondary-${selectedConnectionIndex}`} className="text-gray-900 mb-2 block">
                                      Port Type {requirementInfo.orderType !== 'MDAC' && <span className="text-red-500">*</span>}
                                    </Label>
                                    <Select
                                      value={currentConnection.link2PortTypeSize || ''}
                                      onValueChange={(val) => setCurrentConnection({ ...currentConnection, link2PortTypeSize: val })}
                                    >
                                      <SelectTrigger id={`port-type-size-mpls-secondary-${selectedConnectionIndex}`}>
                                        <SelectValue placeholder="Select" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="1G">1G</SelectItem>
                                        <SelectItem value="10G">10G</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              )}
                            </div>

                            <Separator className="my-6" />

                            {/* Bandwidth for Secondary Link */}
                            <div className="mb-6">
                              <h4 className="text-sm text-gray-900 mb-3 font-medium">Bandwidth</h4>
                              <div className="max-w-xs">
                                <Label>Bandwidth *</Label>
                                <div className="flex gap-2">
                                  <Input
                                    type="text"
                                    placeholder="Enter value"
                                    value={(() => {
                                      const match = currentConnection.link2BandwidthValue?.match(/^([\d.]+)/);
                                      return match ? match[1] : '';
                                    })()}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/[^\d.]/g, '');
                                      const unit = currentConnection.link2BandwidthValue?.includes('Gbps') ? 'Gbps' : 'Mbps';
                                      setCurrentConnection({
                                        ...currentConnection,
                                        link2BandwidthValue: value ? `${value} ${unit}` : ''
                                      });
                                    }}
                                    className="flex-1"
                                  />
                                  <Select
                                    value={currentConnection.link2BandwidthValue?.includes('Gbps') ? 'Gbps' : 'Mbps'}
                                    onValueChange={(unit: 'Mbps' | 'Gbps') => {
                                      const match = currentConnection.link2BandwidthValue?.match(/^([\d.]+)/);
                                      const numericValue = match ? match[1] : '';
                                      setCurrentConnection({
                                        ...currentConnection,
                                        link2BandwidthValue: numericValue ? `${numericValue} ${unit}` : ''
                                      });
                                    }}
                                  >
                                    <SelectTrigger className="w-28">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Mbps">Mbps</SelectItem>
                                      <SelectItem value="Gbps">Gbps</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>

                            <Separator className="my-6" />

                            {/* Last Mile Type for Secondary Link */}
                            <div>
                              <LMTypeSelector
                                connectionTypes={currentConnection.link2ConnectionTypes || []}
                                onConnectionTypesChange={(types: ConnectionTypeItem[]) => {
                                  setCurrentConnection({
                                    ...currentConnection,
                                    link2ConnectionTypes: types
                                  });
                                }}
                                idPrefix="secondary-link"
                                cloudProvider={currentConnection.link2CloudProvider}
                                dcLocation={
                                  currentConnection.addressType === 'Sify DC' ||
                                  currentConnection.addressType === 'Connected DC'
                                }
                              />
                            </div>
                          </div>

                        </div>
                      ) : null}


                      <Separator />

                      {/* Remarks Section */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <h4 className="text-sm text-gray-900">Remarks</h4>
                          <Badge variant="outline" className="text-xs text-gray-600">Optional</Badge>
                        </div>
                        <Textarea
                          placeholder="Add any notes, special instructions, or additional details for this feasibility..."
                          rows={3}
                          value={currentConnection.remarks || ''}
                          onChange={(e) => setCurrentConnection({ ...currentConnection, remarks: e.target.value })}
                          className="resize-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          This information will be attached to the feasibility request for reference
                        </p>
                      </div>

                      <Separator />

                      {/* Contact Person */}
                      {!useSameContactForAll && (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm text-gray-900">Contact Person</h4>
                            {applyContactToAll && selectedConnectionIndex === 0 && connections.length > 1 && (
                              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                                <Info className="w-3 h-3 mr-1" />
                                Applying to all
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label>Name *</Label>
                              <Input
                                placeholder="Contact name"
                                value={currentConnection.contactName}
                                onChange={(e) => {
                                  setCurrentConnection({ ...currentConnection, contactName: e.target.value });
                                  // If "Apply to All" is checked and this is the first connection, update all
                                  if (applyContactToAll && selectedConnectionIndex === 0) {
                                    const updatedConnections = connections.map(conn => ({
                                      ...conn,
                                      contactName: e.target.value
                                    }));
                                    setConnections(updatedConnections);
                                  }
                                }}
                              />
                            </div>
                            <div>
                              <Label>Email *</Label>
                              <Input
                                type="email"
                                placeholder="contact@email.com"
                                value={currentConnection.contactEmail}
                                onChange={(e) => {
                                  setCurrentConnection({ ...currentConnection, contactEmail: e.target.value });
                                  // If "Apply to All" is checked and this is the first connection, update all
                                  if (applyContactToAll && selectedConnectionIndex === 0) {
                                    const updatedConnections = connections.map(conn => ({
                                      ...conn,
                                      contactEmail: e.target.value
                                    }));
                                    setConnections(updatedConnections);
                                  }
                                }}
                              />
                            </div>
                            <div>
                              <Label>Phone *</Label>
                              <Input
                                placeholder="+91 XXXXX XXXXX"
                                value={currentConnection.contactPhone}
                                onChange={(e) => {
                                  setCurrentConnection({ ...currentConnection, contactPhone: e.target.value });
                                  // If "Apply to All" is checked and this is the first connection, update all
                                  if (applyContactToAll && selectedConnectionIndex === 0) {
                                    const updatedConnections = connections.map(conn => ({
                                      ...conn,
                                      contactPhone: e.target.value
                                    }));
                                    setConnections(updatedConnections);
                                  }
                                }}
                              />
                            </div>
                          </div>

                          {/* Apply to All Checkbox - Show only in Feasibility 1 when there are multiple feasibilities */}
                          {selectedConnectionIndex === 0 && connections.length > 1 && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <label className="flex items-start space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={applyContactToAll}
                                  onChange={(e) => {
                                    setApplyContactToAll(e.target.checked);
                                    if (e.target.checked && currentConnection.contactName && currentConnection.contactEmail && currentConnection.contactPhone) {
                                      // Apply contact to all connections immediately
                                      const updatedConnections = connections.map(conn => ({
                                        ...conn,
                                        contactName: currentConnection.contactName,
                                        contactEmail: currentConnection.contactEmail,
                                        contactPhone: currentConnection.contactPhone
                                      }));
                                      setConnections(updatedConnections);
                                      toast.success(`Contact information applied to all ${connections.length} feasibilities`);
                                    }
                                  }}
                                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                                />
                                <div>
                                  <span className="text-sm text-gray-900">
                                    Apply this contact to all
                                  </span>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {applyContactToAll
                                      ? 'Any changes to contact information will automatically apply to all feasibilities'
                                      : 'Enable to use the same contact person for all feasibilities'}
                                  </p>
                                </div>
                              </label>
                            </div>
                          )}
                        </div>
                      )}

                      {useSameContactForAll && (
                        <div>
                          <h4 className="text-sm text-gray-700 mb-2">Contact Person</h4>

                          {/* Show common contact if connection is selected OR if "Apply to All" is active */}
                          {(selectedContactConnections.length === 0 || selectedContactConnections.includes(connections[selectedConnectionIndex]?.id)) ? (
                            <div>
                              {selectedContactConnections.length > 0 ? (
                                <p className="text-xs text-gray-500 mb-3">Using common contact for selected connections</p>
                              ) : (
                                <p className="text-xs text-gray-500 mb-3">Using common contact for all connections</p>
                              )}
                              {commonContact.name && (
                                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                                  <p>{commonContact.name}</p>
                                  <p className="text-gray-600">{commonContact.email}</p>
                                  <p className="text-gray-600">{commonContact.phone}</p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div>
                              {/* Connection not selected for bulk contact - allow individual configuration */}
                              <div className="mb-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                <p className="text-xs text-orange-700 flex items-center">
                                  <AlertCircle className="w-3 h-3 mr-1.5" />
                                  This {requirementInfo.networkType === 'MPLS' ? 'location' : 'connection'} is not selected for common contact. Configure individual contact below.
                                </p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <Label>Name *</Label>
                                  <Input
                                    placeholder="Contact name"
                                    value={currentConnection.contactName}
                                    onChange={(e) => setCurrentConnection({ ...currentConnection, contactName: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label>Email *</Label>
                                  <Input
                                    type="email"
                                    placeholder="contact@email.com"
                                    value={currentConnection.contactEmail}
                                    onChange={(e) => setCurrentConnection({ ...currentConnection, contactEmail: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label>Phone *</Label>
                                  <Input
                                    placeholder="+91 XXXXX XXXXX"
                                    value={currentConnection.contactPhone}
                                    onChange={(e) => setCurrentConnection({ ...currentConnection, contactPhone: e.target.value })}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Save Button */}
                      {(requirementInfo.product === 'DIA' || requirementInfo.product === 'MPLS' || currentConnection.locationCategoryType) && (
                        <div className="flex justify-end pt-4">
                          <Button
                            onClick={handleSaveConnection}
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={!hasConnectionChanges()}
                          >
                            Save
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Navigation Buttons for Modify Flow */}
            {selectedLinks.length > 0 && requirementInfo.orderType === 'MDAC' && diaEntryMethod === 'manual' && (
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="border-2 hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Basic Info
                </Button>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    <span>{selectedLinks.length} links selected for modification</span>
                  </div>
                  <Button
                    onClick={() => {
                      // Convert selectedLinks to connections format for Step 3 display
                      const convertedConnections = selectedLinks.map((link, index) => {
                        // Check if building type requires Fiber by default
                        const isFiberOnly = link.addressType === 'Sify DC' ||
                          link.addressType === 'Connected DC' ||
                          link.addressType === 'Connected Building';

                        // Get the modifications for this link
                        const modifications = linkModifications[link.id];
                        const linkModTypes = getLinkModificationTypes(link.id);

                        // Determine what was modified
                        const isBandwidthModified = !!(linkModTypes && linkModTypes.bandwidth);
                        const isAddressChanged = !!(linkModTypes && linkModTypes.address);
                        const isLMModified = !!(linkModTypes && linkModTypes.lm);
                        const isAddingSecondaryTertiary = !!(linkModTypes && linkModTypes.addSecondaryTertiary);

                        // Get connection types to display
                        let connectionTypes = link.connectionTypes || [];

                        // If LM was modified or adding secondary/tertiary, use the new LM type
                        if ((isLMModified || isAddingSecondaryTertiary) && modifications?.newLMType) {
                          connectionTypes = modifications.newLMType;
                        } else if (isFiberOnly && connectionTypes.length === 0) {
                          // Default to Fiber for DC buildings if not explicitly set
                          connectionTypes = [{ type: 'Fiber', isPrimary: true }];
                        }

                        // Get bandwidth to display
                        let bandwidthValue = link.bandwidthValue || link.bandwidth || '';
                        if ((isBandwidthModified || isAddingSecondaryTertiary) && modifications?.newBandwidth) {
                          bandwidthValue = modifications.newBandwidth;
                        }

                        // Get address details to display (use new address if modified)
                        let addressLine1 = link.addressLine1 || '';
                        let addressLine2 = link.addressLine2 || '';
                        let city = link.city || '';
                        let state = link.state || '';
                        let pinCode = link.pinCode || '';
                        let addressType = link.addressType || 'Custom Location';
                        let dcName = link.dcName || '';
                        let connectedDCName = link.connectedDCName || '';
                        let buildingName = link.buildingName || '';

                        if (isAddressChanged && modifications) {
                          addressType = modifications.newAddressType || addressType;
                          city = modifications.newCity || city;
                          state = modifications.newState || state;
                          pinCode = modifications.newPinCode || pinCode;

                          if (modifications.newAddressType === 'Sify DC') {
                            dcName = modifications.newDCName || dcName;
                          } else if (modifications.newAddressType === 'Connected DC') {
                            connectedDCName = modifications.newConnectedDCName || connectedDCName;
                          } else if (modifications.newAddressType === 'Connected Building') {
                            buildingName = modifications.newBuildingName || buildingName;
                          } else if (modifications.newAddressType === 'Custom Location') {
                            addressLine1 = modifications.newAddressLine1 || addressLine1;
                            addressLine2 = modifications.newAddressLine2 || addressLine2;
                          }
                        }

                        return {
                          id: link.id || `modify-${index + 1}`,
                          linkId: link.linkId || `LINK-${String(index + 1).padStart(3, '0')}`,
                          addressLine1: addressLine1,
                          addressLine2: addressLine2,
                          city: city,
                          state: state,
                          pinCode: pinCode,
                          latitude: link.latitude || '',
                          longitude: link.longitude || '',
                          bandwidthValue: bandwidthValue,
                          connectionTypes: connectionTypes,
                          contactName: link.contactName || '',
                          contactEmail: link.contactEmail || '',
                          contactPhone: link.contactPhone || '',
                          addressType: addressType,
                          connectedDCName: connectedDCName,
                          buildingName: buildingName,
                          dcName: dcName,
                          vas: link.vas || [],
                          // Store modification info with proper flags for display
                          modificationInfo: {
                            ...modifications,
                            isBandwidthModified,
                            isAddressChanged,
                            isLMModified,
                            isAddingSecondaryTertiary
                          },
                          isModifyFlow: true
                        };
                      });
                      setConnections(convertedConnections);
                      setCurrentStep(3);
                    }}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-md"
                  >
                    Continue to Review
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Navigation Buttons - Only show for manual entry */}
            {connections.length > 0 && diaEntryMethod === 'manual' && requirementInfo.orderType !== 'MDAC' && (
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="border-2 hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Basic Info
                </Button>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    <span className="">
                      {connections.filter(c => isConnectionConfigured(c)).length} of {connections.length}
                    </span>
                  </div>
                  <Button
                    onClick={() => setCurrentStep(3)}
                    disabled={connections.filter(c => isConnectionConfigured(c)).length === 0}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md disabled:opacity-50"
                  >
                    Continue to Review & Submit
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Back Button - Always visible in Step 2 */}
            {!connections.length && (
              <div className="flex justify-start mt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="border-2 hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Step 1
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-900">Review & Submit</CardTitle>
                    <CardDescription>Review all service details before submitting</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="text-blue-600 hover:text-blue-700 underline flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add More
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>

                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-gray-900 mb-2">Summary of {requirementInfo.networkType === 'MPLS' ? 'Locations' : 'Services'}</h4>
                    <p className="text-sm text-gray-600">{connections.length} {requirementInfo.networkType === 'MPLS' ? 'locations' : 'services'} configured</p>
                  </div>
                  {/* Entry Method Badge */}
                  <div className="text-right">
                    <span className="text-xs text-gray-500 mb-1 block">Entry Method</span>
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">
                      {diaEntryMethod === 'bulk' ? 'Bulk Upload' : 'Manual Entry'}
                    </Badge>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Count</TableHead>
                        {requirementInfo.orderType === 'MDAC' && <TableHead>Link ID</TableHead>}
                        <TableHead>{requirementInfo.orderType === 'MDAC' ? 'Updated Address' : 'Location'}</TableHead>
                        <TableHead>Link Type</TableHead>
                        <TableHead>{requirementInfo.orderType === 'MDAC' ? 'Updated BW' : 'Bandwidth'}</TableHead>
                        <TableHead>{requirementInfo.orderType === 'MDAC' ? 'Updated LM' : 'LM Types'}</TableHead>
                        {requirementInfo.orderType === 'New' && <TableHead>Port Details</TableHead>}
                        {requirementInfo.orderType === 'New' && <TableHead>Cross Connect</TableHead>}
                        {requirementInfo.orderType === 'MDAC' && <TableHead className="w-[140px]">MDAC</TableHead>}
                        <TableHead>Contact Details</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {connections.map((conn, idx) => (
                        <TableRow key={conn.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                #{idx + 1}
                              </Badge>
                              {conn.endType && (
                                <Badge
                                  variant="outline"
                                  className={conn.endType === 'A End'
                                    ? 'bg-green-50 text-green-700 border-green-200'
                                    : 'bg-purple-50 text-purple-700 border-purple-200'
                                  }
                                >
                                  {conn.endType}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          {requirementInfo.orderType === 'MDAC' && (
                            <TableCell>
                              <Badge variant="outline" className="bg-gray-50 text-gray-700 font-mono text-xs">
                                {conn?.linkId || `LINK-${String(idx + 1).padStart(3, '0')}`}
                              </Badge>
                            </TableCell>
                          )}
                          <TableCell>
                            <div className="max-w-[300px]">
                              {/* Building Type Badge */}
                              <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 mb-2">
                                {getBuildingType(conn)}
                              </Badge>

                              {/* Location Details */}
                              {conn.addressType === 'Sify DC' && conn.dcName && (
                                <div className="space-y-1">
                                  <p className="text-sm font-medium text-gray-900">{conn.dcName}</p>
                                  <p className="text-xs text-gray-600">Sify Data Center</p>
                                  <p className="text-xs text-gray-500">{conn.city}, {conn.state}</p>
                                  {conn.pinCode && <p className="text-xs text-gray-500">PIN: {conn.pinCode}</p>}
                                </div>
                              )}
                              {conn.addressType === 'Connected DC' && conn.connectedDCName && (
                                <div className="space-y-1">
                                  <p className="text-sm font-medium text-gray-900">{conn.connectedDCName}</p>
                                  <p className="text-xs text-gray-600">Connected Data Center</p>
                                  <p className="text-xs text-gray-500">{conn.city}, {conn.state}</p>
                                  {conn.pinCode && <p className="text-xs text-gray-500">PIN: {conn.pinCode}</p>}
                                </div>
                              )}
                              {conn.addressType === 'Connected Building' && conn.buildingName && (
                                <div className="space-y-1">
                                  <p className="text-sm font-medium text-gray-900">{conn.buildingName}</p>
                                  <p className="text-xs text-gray-600">Connected Building</p>
                                  <p className="text-xs text-gray-500">{conn.city}, {conn.state}</p>
                                  {conn.pinCode && <p className="text-xs text-gray-500">PIN: {conn.pinCode}</p>}
                                </div>
                              )}
                              {conn.addressType === 'Custom Location' && (
                                <div className="space-y-1">
                                  {conn.addressLine1 && <p className="text-sm text-gray-900">{conn.addressLine1}</p>}
                                  {conn.addressLine2 && <p className="text-xs text-gray-600">{conn.addressLine2}</p>}
                                  <p className="text-xs text-gray-500">{conn.city}, {conn.state}</p>
                                  {conn.pinCode && <p className="text-xs text-gray-500">PIN: {conn.pinCode}</p>}
                                </div>
                              )}
                              {(!conn.addressType || conn.addressType === 'Custom Location') && !conn.addressLine1 && (
                                <p className="text-sm text-gray-900">{getLocationAddress(conn)}</p>
                              )}
                              {conn.latitude && conn.longitude && (
                                <p className="text-xs text-gray-400 mt-1">
                                  Lat: {conn.latitude}, Long: {conn.longitude}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {conn.numberOfLinks?.startsWith('Dual') ? (
                              // Dual Link - Show Primary and Secondary
                              <div className="divide-y divide-gray-200">
                                <div className="pb-2">
                                  <p className="text-sm text-gray-900">Primary</p>
                                </div>
                                <div className="pt-2">
                                  <p className="text-sm text-gray-900">Secondary</p>
                                </div>
                              </div>
                            ) : (
                              // Single Link
                              <p className="text-sm text-gray-900">Primary</p>
                            )}
                          </TableCell>
                          <TableCell>
                            {conn.numberOfLinks?.startsWith('Dual') ? (
                              // Dual Link - Show both Primary and Secondary bandwidth with divider
                              <div className="divide-y divide-gray-200">
                                <div className="pb-2">
                                  <p className="text-sm text-gray-900">{conn.bandwidthValue || '-'}</p>
                                </div>
                                <div className="pt-2">
                                  <p className="text-sm text-gray-900">{conn.link2BandwidthValue || '-'}</p>
                                </div>
                              </div>
                            ) : (
                              // Single Link
                              <p className="text-sm text-gray-900">{conn.bandwidthValue}</p>
                            )}
                          </TableCell>
                          <TableCell>
                            {conn.lmCategory === 'Cloud Provider' && conn.cloudServiceProvider ? (
                              <div className="space-y-1">
                                <Badge
                                  variant="outline"
                                  className="bg-purple-50 text-purple-700 border-purple-200"
                                >
                                  Cloud Provider
                                </Badge>
                                <div className="text-xs space-y-0.5 mt-1">
                                  <p className="text-gray-900 font-medium">{conn.cloudServiceProvider}</p>
                                  <p className="text-gray-600">Service: {conn.cloudServiceType}</p>
                                  <p className="text-gray-600">Node: {conn.connectingNodes}</p>
                                  <p className="text-gray-600">{conn.transportType}</p>
                                </div>
                              </div>
                            ) : conn.numberOfLinks?.startsWith('Dual') ? (
                              // Dual Link - Show both Primary and Secondary LM Types with divider
                              <div className="divide-y divide-gray-200">
                                {/* Primary Link */}
                                <div className="pb-2">
                                  {conn.connectionTypes && conn.connectionTypes.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                      {conn.connectionTypes.map((ct, ctIdx) => (
                                        <Badge
                                          key={ctIdx}
                                          variant="outline"
                                          className="bg-blue-50 text-blue-700 border-blue-200"
                                        >
                                          {ct.type}
                                        </Badge>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-sm text-gray-400">Not set</span>
                                  )}
                                </div>
                                {/* Secondary Link */}
                                <div className="pt-2">
                                  {conn.link2ConnectionTypes && conn.link2ConnectionTypes.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                      {conn.link2ConnectionTypes.map((ct, ctIdx) => (
                                        <Badge
                                          key={ctIdx}
                                          variant="outline"
                                          className="bg-blue-50 text-blue-700 border-blue-200"
                                        >
                                          {ct.type}
                                        </Badge>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-sm text-gray-400">Not set</span>
                                  )}
                                </div>
                              </div>
                            ) : conn.connectionTypes && conn.connectionTypes.length > 0 ? (
                              // Single Link
                              <div className="flex flex-wrap gap-1">
                                {conn.connectionTypes.map((ct, ctIdx) => (
                                  <Badge
                                    key={ctIdx}
                                    variant="outline"
                                    className="bg-blue-50 text-blue-700 border-blue-200"
                                  >
                                    {ct.type}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">Not set</span>
                            )}
                          </TableCell>
                          {requirementInfo.orderType === 'New' && (
                            <TableCell>
                              {conn.numberOfLinks?.startsWith('Dual') ? (
                                // Dual Link - Show both Primary and Secondary port details with divider
                                <div className="divide-y divide-gray-200">
                                  <div className="pb-2">
                                    {formatPortDetails(conn, 1)}
                                  </div>
                                  <div className="pt-2">
                                    {formatPortDetails(conn, 2)}
                                  </div>
                                </div>
                              ) : (
                                // Single Link
                                formatPortDetails(conn, 1)
                              )}
                            </TableCell>
                          )}
                          {requirementInfo.orderType === 'New' && (
                            <TableCell>
                              <p className="text-xs text-gray-900">{formatCrossConnect(conn)}</p>
                            </TableCell>
                          )}
                          {requirementInfo.orderType === 'MDAC' && (
                            <TableCell className="w-[140px]">
                              {conn.modificationInfo && (
                                <div className="space-y-1">
                                  {conn.modificationInfo.isBandwidthModified && (
                                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 mr-1 mb-1">
                                      Bandwidth
                                    </Badge>
                                  )}
                                  {conn.modificationInfo.isAddressChanged && (
                                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 mr-1 mb-1">
                                      Address
                                    </Badge>
                                  )}
                                  {conn.modificationInfo.isLMModified && (
                                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 mr-1 mb-1">
                                      LM Type
                                    </Badge>
                                  )}
                                  {conn.modificationInfo.isAddingSecondaryTertiary && (
                                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 mr-1 mb-1">
                                      Add Link
                                    </Badge>
                                  )}
                                  {!conn.modificationInfo.isBandwidthModified &&
                                    !conn.modificationInfo.isAddressChanged &&
                                    !conn.modificationInfo.isLMModified &&
                                    !conn.modificationInfo.isAddingSecondaryTertiary && (
                                      <span className="text-xs text-gray-500">No changes</span>
                                    )}
                                </div>
                              )}
                              {!conn.modificationInfo && (
                                <span className="text-xs text-gray-500">No changes</span>
                              )}
                            </TableCell>
                          )}
                          <TableCell>
                            <p className="text-sm text-gray-900">{conn.contactName}</p>
                            <p className="text-xs text-gray-500">{conn.contactEmail}</p>
                            <p className="text-xs text-gray-500">{conn.contactPhone}</p>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditConnection(idx)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteConnection(conn)}
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
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

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  // If bulk uploaded, go back to bulk validation screen
                  if (diaEntryMethod === 'bulk') {
                    setBulkStep(3);
                    // Re-populate uploadedServices from connections
                    const services = connections.map((conn, index) => ({
                      id: conn.id || `${index + 1}`,
                      address: `${conn.addressLine1 || ''}\n${conn.addressLine2 || ''}\n${conn.city || ''}, ${conn.state || ''}, ${conn.pinCode || ''}`,
                      addressLine1: conn.addressLine1 || '',
                      addressLine2: conn.addressLine2 || '',
                      city: conn.city || '',
                      state: conn.state || '',
                      pinCode: conn.pinCode || '',
                      bandwidth: conn.bandwidthValue || '',
                      connectionType: conn.connectionTypes?.map(ct => ct.type) || [],
                      contactName: conn.contactName || '',
                      contactEmail: conn.contactEmail || '',
                      contactPhone: conn.contactPhone || '',
                      status: 'valid' as const
                    }));
                    setUploadedServices(services);
                  }
                  setCurrentStep(2);
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Submit for Feasibility
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {requirementInfo.networkType === 'MPLS' ? 'Location' : 'Service'}?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {requirementInfo.networkType === 'MPLS' ? 'location' : 'service'}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {connectionToDelete && (
            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <p className="text-sm text-gray-900"><strong>Address:</strong> {connectionToDelete.address}</p>
              <p className="text-sm text-gray-900"><strong>Bandwidth:</strong> {connectionToDelete.bandwidthValue}</p>
              <p className="text-sm text-gray-900"><strong>Type:</strong> {connectionToDelete!.connectionType}</p>
              <p className="text-sm text-gray-900"><strong>Link:</strong> {connectionToDelete.linkType}</p>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteConnection} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl">Submission Successful!</DialogTitle>
            <DialogDescription className="text-center">
              <strong>{connections.length} Feasibility IDs (FID)</strong> have been generated for {connections.length} {requirementInfo.networkType === 'MPLS' ? 'locations' : 'connections'}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700 mb-2">
                Each FID can now be tracked and managed in the <strong>Feasibility Pool</strong>.
              </p>
              <p className="text-sm text-gray-600">
                A feasibility evaluation might take up to <strong>7 working days</strong> to complete.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setShowSuccessDialog(false);
                navigate('/dashboard');
              }}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Return to Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Connected Building Detection Dialog */}
      <Dialog open={showConnectedBuildingDialog} onOpenChange={setShowConnectedBuildingDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Building2 className="w-7 h-7 text-blue-600" />
              </div>
            </div>
            <DialogTitle className="text-center">Connected Building Detected</DialogTitle>
            <DialogDescription className="text-center pt-2">
              The address you entered matches one of our connected buildings
            </DialogDescription>
          </DialogHeader>
          {detectedBuilding && (
            <div className="py-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-2">
                <p className="text-sm font-medium text-gray-900">{detectedBuilding.name}</p>
                <p className="text-sm text-gray-600">{detectedBuilding.city}</p>
                <p className="text-xs text-gray-500">Pin Code: {detectedBuilding.pinCode}</p>
              </div>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-900">
                  <strong>Benefit:</strong> Connected buildings have better pricing, faster deployment, and guaranteed connectivity.
                </p>
              </div>
              <p className="mt-4 text-sm text-gray-700 text-center">
                Is this the address you're looking for?
              </p>
            </div>
          )}
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                // Keep as Custom Location
                setShowConnectedBuildingDialog(false);
                setDetectedBuilding(null);
              }}
              className="flex-1"
            >
              No, Keep Custom
            </Button>
            <Button
              onClick={() => {
                // Convert to Connected Building
                if (detectedBuilding) {
                  setCurrentConnection({
                    ...currentConnection,
                    addressType: 'Connected Building',
                    buildingName: detectedBuilding.name,
                    city: detectedBuilding.city,
                    pinCode: detectedBuilding.pinCode,
                    latitude: detectedBuilding.latitude,
                    longitude: detectedBuilding.longitude,
                    connectionTypes: [{ type: 'Fiber', isPrimary: true }] // Connected buildings default to Fiber
                  });
                  toast.success('Switched to Connected Building', {
                    description: `${detectedBuilding.name} has been set as a Connected Building`
                  });
                }
                setShowConnectedBuildingDialog(false);
                setDetectedBuilding(null);
              }}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Yes, Use Connected Building
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Connection Selector Dialog */}
      <Dialog open={showContactConnectionSelector} onOpenChange={setShowContactConnectionSelector}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select {requirementInfo.networkType === 'MPLS' ? 'Locations' : 'Connections'} for Contact</DialogTitle>
            <DialogDescription>
              Choose which {requirementInfo.networkType === 'MPLS' ? 'locations' : 'connections'} should have the common contact applied
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {connections.map((conn, idx) => (
                <label
                  key={conn.id}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-green-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedContactConnections.includes(conn.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedContactConnections([...selectedContactConnections, conn.id]);
                      } else {
                        setSelectedContactConnections(selectedContactConnections.filter(id => id !== conn.id));
                      }
                    }}
                    className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{requirementInfo.networkType === 'MPLS' ? 'Location' : 'Connection'} {idx + 1}</p>
                    <p className="text-xs text-gray-500 truncate">{conn.address || 'No address set'}</p>
                  </div>
                  {getConnectionStatus(conn) === 'completed' && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                </label>
              ))}
            </div>
            {selectedContactConnections.length > 0 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  {selectedContactConnections.length} {requirementInfo.networkType === 'MPLS' ? 'location(s)' : 'connection(s)'} selected
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedContactConnections([]);
                setShowContactConnectionSelector(false);
              }}
            >
              Clear Selection
            </Button>
            <Button
              onClick={() => {
                if (selectedContactConnections.length === 0) {
                  toast.error(`Please select at least one ${requirementInfo.networkType === 'MPLS' ? 'location' : 'connection'}`);
                  return;
                }
                setShowContactConnectionSelector(false);
                toast.success(`Contact will be applied to ${selectedContactConnections.length} ${requirementInfo.networkType === 'MPLS' ? 'location(s)' : 'connection(s)'}`);
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              Apply to Selected
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add More Service Alert Dialog */}
      <AlertDialog open={showAddMoreAlert} onOpenChange={setShowAddMoreAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Redirecting to Step 2</AlertDialogTitle>
            <AlertDialogDescription>
              Add and save a new service, It will added to in the list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowAddMoreAlert(false);
                setCurrentStep(2);
                toast.info('Add your new service in Step 2');
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Modal for Bulk Upload Submission */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="sr-only">Submission Successful</DialogTitle>
            <DialogDescription className="sr-only">
              Your bulk upload has been submitted successfully and feasibility IDs have been generated.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center text-center py-6">
            {/* Success Icon */}
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            {/* Title */}
            <h2 className="text-2xl text-gray-900 mb-3">Submission Successful!</h2>

            {/* Description */}
            <p className="text-gray-600 mb-6">
              <span className="text-gray-900">{uploadedServices.length} Feasibility IDs (FID)</span> have been generated for {uploadedServices.length} connections.
            </p>

            {/* Info Box */}
            <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-gray-700 mb-2">
                Each FID can now be tracked and managed in the <span className="font-medium">Feasibility Pool</span>.
              </p>
              <p className="text-sm text-gray-700">
                A feasibility evaluation might take up to <span className="font-medium">7 working days</span> to complete.
              </p>
            </div>

            {/* Button */}
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/account-manager-dashboard');
              }}
            >
              Return to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* VAS Configuration Sheet */}
      <Sheet open={showVASSheet} onOpenChange={setShowVASSheet}>
        <SheetContent className="w-[450px] sm:max-w-[450px] overflow-y-auto">
          <SheetHeader className="border-b pb-4">
            <SheetTitle className="text-lg">Add VAS</SheetTitle>
            <SheetDescription className="sr-only">
              Configure value-added services for this connection
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-3 px-[10px]">
            {/* Additional IP Card */}
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
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${deviceOption === 'own'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                      onClick={() => {
                        // Reset selections when switching to own device
                        if (deviceOption !== 'own') {
                          setSelectedDeviceTypes([]);
                          setDeviceCounts({});
                          setManagedServiceType(null);
                          setServiceVariant(null);
                          setEnableManagedService(false);
                          setDeviceManagedService({});
                        }
                        setDeviceOption('own');
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${deviceOption === 'own' ? 'border-green-600 bg-green-600' : 'border-gray-300'
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
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${deviceOption === 'buy'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                      onClick={() => {
                        // Reset selections when switching to buy device
                        if (deviceOption !== 'buy') {
                          setSelectedDeviceTypes([]);
                          setDeviceCounts({});
                          setManagedServiceType(null);
                          setServiceVariant(null);
                          setEnableManagedService(false);
                          setDeviceManagedService({});
                        }
                        setDeviceOption('buy');
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${deviceOption === 'buy' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
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
                          {['Router', 'Switch', 'Firewall'].map((device) => (
                            <Button
                              key={device}
                              variant="outline"
                              size="sm"
                              className={selectedDeviceTypes.includes(device) ? 'bg-gray-800 text-white hover:bg-gray-800 hover:text-white' : ''}
                              onClick={() => {
                                if (selectedDeviceTypes.includes(device)) {
                                  setSelectedDeviceTypes(selectedDeviceTypes.filter(d => d !== device));
                                  const newCounts = { ...deviceCounts };
                                  delete newCounts[device];
                                  setDeviceCounts(newCounts);
                                } else {
                                  setSelectedDeviceTypes([...selectedDeviceTypes, device]);
                                  setDeviceCounts({ ...deviceCounts, [device]: 1 });
                                }
                              }}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              {device}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Selected Devices with Count */}
                      {selectedDeviceTypes.length > 0 && (
                        <div>
                          <Label className="text-gray-900 mb-3 block">Selected Devices</Label>
                          <div className="space-y-3">
                            {selectedDeviceTypes.map((device) => (
                              <div key={device} className="p-3 bg-white border border-gray-200 rounded-lg space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-gray-900">{device}</span>
                                    <div className="flex items-center gap-2">
                                      <Label className="text-xs text-gray-600">Count:</Label>
                                      <Input
                                        type="number"
                                        min="1"
                                        value={deviceCounts[device] || 1}
                                        onChange={(e) => setDeviceCounts({ ...deviceCounts, [device]: parseInt(e.target.value) || 1 })}
                                        className="w-16 h-7"
                                      />
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedDeviceTypes(selectedDeviceTypes.filter(d => d !== device));
                                      const newCounts = { ...deviceCounts };
                                      delete newCounts[device];
                                      setDeviceCounts(newCounts);
                                      const newManagement = { ...deviceManagement };
                                      delete newManagement[device];
                                      setDeviceManagement(newManagement);
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                  </Button>
                                </div>
                                <div>
                                  <Label className="text-xs text-gray-600 mb-2 block">Device Management</Label>
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`sheet-${device}-config`}
                                        checked={deviceManagement[device]?.configuration || false}
                                        onCheckedChange={(checked: any) => {
                                          setDeviceManagement({
                                            ...deviceManagement,
                                            [device]: {
                                              ...deviceManagement[device],
                                              configuration: checked as boolean
                                            }
                                          });
                                        }}
                                      />
                                      <Label htmlFor={`sheet-${device}-config`} className="text-xs cursor-pointer">
                                        Configuration Management
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`sheet-${device}-hardware`}
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
                                      <Label htmlFor={`sheet-${device}-hardware`} className="text-xs cursor-pointer">
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
                            className={`p-3 border rounded-lg cursor-pointer ${serviceVariant === 'bundled' ? 'border-gray-800 bg-white' : 'border-gray-200'
                              }`}
                            onClick={() => setServiceVariant('bundled')}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${serviceVariant === 'bundled' ? 'border-gray-800 bg-gray-800' : 'border-gray-300'
                                }`}>
                                {serviceVariant === 'bundled' && <div className="w-2 h-2 bg-white rounded-full" />}
                              </div>
                              <span className="text-sm text-gray-900">Bundled Package</span>
                            </div>
                          </div>

                          <div
                            className={`p-3 border rounded-lg cursor-pointer ${serviceVariant === 'specific' ? 'border-gray-800 bg-white' : 'border-gray-200'
                              }`}
                            onClick={() => setServiceVariant('specific')}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${serviceVariant === 'specific' ? 'border-gray-800 bg-gray-800' : 'border-gray-300'
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
                          {['Router', 'Switch', 'Firewall'].map((device) => (
                            <Button
                              key={device}
                              variant="outline"
                              size="sm"
                              className={selectedDeviceTypes.includes(device) ? 'bg-gray-700 text-white hover:bg-gray-700 hover:text-white' : ''}
                              onClick={() => {
                                if (selectedDeviceTypes.includes(device)) {
                                  setSelectedDeviceTypes(selectedDeviceTypes.filter(d => d !== device));
                                  const newCounts = { ...deviceCounts };
                                  delete newCounts[device];
                                  setDeviceCounts(newCounts);
                                  const newModelsByCount = { ...deviceModelsByCount };
                                  delete newModelsByCount[device];
                                  setDeviceModelsByCount(newModelsByCount);
                                  const newManagedService = { ...deviceManagedService };
                                  delete newManagedService[device];
                                  setDeviceManagedService(newManagedService);
                                } else {
                                  setSelectedDeviceTypes([...selectedDeviceTypes, device]);
                                  setDeviceCounts({ ...deviceCounts, [device]: 1 });
                                  setDeviceModelsByCount({ ...deviceModelsByCount, [device]: [''] });
                                }
                              }}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              {device}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Selected Devices */}
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
                                      <span className="text-sm font-medium text-gray-900">{device}</span>
                                      <div className="flex items-center gap-2">
                                        <Label className="text-xs text-gray-600">Count:</Label>
                                        <Input
                                          type="number"
                                          min="1"
                                          value={count}
                                          onChange={(e) => {
                                            const newCount = parseInt(e.target.value) || 1;
                                            setDeviceCounts({ ...deviceCounts, [device]: newCount });
                                            // Adjust models array based on new count
                                            const currentModels = deviceModelsByCount[device] || [];
                                            const newModels = Array(newCount).fill('').map((_, idx) => currentModels[idx] || '');
                                            setDeviceModelsByCount({ ...deviceModelsByCount, [device]: newModels });
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
                                        const newCounts = { ...deviceCounts };
                                        delete newCounts[device];
                                        setDeviceCounts(newCounts);
                                        const newModelsByCount = { ...deviceModelsByCount };
                                        delete newModelsByCount[device];
                                        setDeviceModelsByCount(newModelsByCount);
                                        const newManagedService = { ...deviceManagedService };
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
                                              setDeviceModelsByCount({ ...deviceModelsByCount, [device]: newModels });
                                            }}
                                          >
                                            <SelectTrigger className="w-full">
                                              <SelectValue placeholder="Select model" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {DEVICE_MODEL_OPTIONS[device as keyof typeof DEVICE_MODEL_OPTIONS]?.map((model) => (
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



            {/* DDoS Protection Card */}
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
          </div>

          {/* Sheet Footer with Actions */}
          <div className="mt-8 pt-6 border-t flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setShowVASSheet(false);
                // Reset selections
                setSelectedIP('');
                setDeviceOption(null);
                setSelectedDeviceTypes([]);
                setDeviceCounts({});
                setEnableManagedService(false);
                setDeviceManagedService({});
                setManagedServiceType(null);
                setServiceVariant(null);
                setSelectedDDoS('');
                // Reset collapsible states
                setIpSectionOpen(false);
                setDevicesSectionOpen(false);
                setDdosSectionOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                // Collect all VAS items
                const vasItems: VASItem[] = [];

                if (selectedIP) {
                  vasItems.push({
                    name: 'Additional IP',
                    details: selectedIP.includes('/') ? `${selectedIP} IP Pool` : selectedIP
                  });
                }

                if (deviceOption === 'own' && selectedDeviceTypes.length > 0) {
                  const hasAnyManagement = selectedDeviceTypes.some(d => deviceManagement[d]?.configuration || deviceManagement[d]?.hardware);
                  if (hasAnyManagement) {
                    const deviceDetails = selectedDeviceTypes.map(d => {
                      const mgmt = [];
                      if (deviceManagement[d]?.configuration) mgmt.push('Config');
                      if (deviceManagement[d]?.hardware) mgmt.push('Hardware');
                      const mgmtStr = mgmt.length > 0 ? ` [${mgmt.join('+')}]` : '';
                      return `${d} (${deviceCounts[d] || 1})${mgmtStr}`;
                    }).join(', ');
                    vasItems.push({
                      name: 'Managed Services (Own Device)',
                      details: deviceDetails
                    });
                  }
                }

                if (deviceOption === 'buy' && selectedDeviceTypes.length > 0) {
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
                  vasItems.push({
                    name: 'Device Purchase',
                    details: `${deviceDetails} - ${serviceVariant === 'bundled' ? 'Bundled Package' : 'Specific Model'}`
                  });
                }

                if (selectedDDoS) {
                  vasItems.push({
                    name: 'DDoS Protection',
                    details: selectedDDoS.charAt(0).toUpperCase() + selectedDDoS.slice(1) + ' Level'
                  });
                }

                // Add VAS items to current connection
                setCurrentConnection({
                  ...currentConnection,
                  vas: [...(currentConnection.vas || []), ...vasItems]
                });

                setShowVASSheet(false);
                toast.success(`${vasItems.length} VAS item(s) added successfully`);

                // Reset selections
                setSelectedIP('');
                setDeviceOption(null);
                setSelectedDeviceTypes([]);
                setDeviceCounts({});
                setEnableManagedService(false);
                setDeviceManagedService({});
                setManagedServiceType(null);
                setServiceVariant(null);
                setSelectedDDoS('');
                // Reset collapsible states
                setIpSectionOpen(false);
                setDevicesSectionOpen(false);
                setDdosSectionOpen(false);
              }}
            >
              Save
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Link Confirmation Dialog */}
      <Dialog open={showDeleteConfirmDialog} onOpenChange={setShowDeleteConfirmDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertCircle className="w-5 h-5 mr-2" />
              Confirm Link Removal
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this link from the modification list? All unsaved modifications will be lost.
            </DialogDescription>
          </DialogHeader>

          {linkToDelete && (
            <div className="py-4">
              <Card className="border-2 border-red-100 bg-red-50/30">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Link ID */}
                    <div className="flex items-center justify-between pb-3 border-b border-red-100">
                      <h4 className="text-base font-semibold text-gray-900">{linkToDelete.linkId}</h4>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {linkToDelete.productType}
                      </Badge>
                    </div>

                    {/* Current Link Details */}
                    <div className="space-y-2">
                      <h5 className="text-xs font-medium text-gray-700 uppercase">Current Details</h5>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex items-start">
                          <MapPin className="w-4 h-4 mr-2 text-gray-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{linkToDelete.address}</span>
                        </div>
                        <div className="flex items-center">
                          <Network className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                          <span className="text-gray-700">{linkToDelete.bandwidth}</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle2 className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                          <span className="text-gray-700">{linkToDelete.lmType}</span>
                        </div>
                        <div className="flex items-center">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {linkToDelete.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Modification Details (if any saved) */}
                    {linkModifications[linkToDelete.id] && (
                      <div className="space-y-2 pt-3 border-t border-red-100">
                        <h5 className="text-xs font-medium text-gray-700 uppercase flex items-center">
                          <Info className="w-3 h-3 mr-1" />
                          Saved Modifications
                        </h5>
                        <div className="space-y-1.5 text-sm bg-white/50 p-3 rounded-lg">
                          {linkModifications[linkToDelete.id].newBandwidth && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">New Bandwidth:</span>
                              <span className="font-medium text-gray-900">{linkModifications[linkToDelete.id].newBandwidth}</span>
                            </div>
                          )}
                          {linkModifications[linkToDelete.id].newAddressLine1 && (
                            <div className="flex items-start justify-between">
                              <span className="text-gray-600">New Address:</span>
                              <span className="font-medium text-gray-900 text-right max-w-xs">
                                {linkModifications[linkToDelete.id].newAddressLine1}
                                {linkModifications[linkToDelete.id].newAddressLine2 && `, ${linkModifications[linkToDelete.id].newAddressLine2}`}
                                {linkModifications[linkToDelete.id].newCity && `, ${linkModifications[linkToDelete.id].newCity}`}
                              </span>
                            </div>
                          )}
                          {linkModifications[linkToDelete.id].newLMType && linkModifications[linkToDelete.id].newLMType.length > 0 && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">New LM Type:</span>
                              <span className="font-medium text-gray-900">
                                {linkModifications[linkToDelete.id].newLMType.map((ct: ConnectionTypeItem) => ct.type).join(', ')}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                            <span className="text-gray-600">Status:</span>
                            <Badge
                              variant="outline"
                              className={
                                linkModifications[linkToDelete.id].status === 'completed'
                                  ? 'bg-green-50 text-green-700 border-green-200'
                                  : linkModifications[linkToDelete.id].status === 'in-progress'
                                    ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                    : 'bg-gray-50 text-gray-700 border-gray-200'
                              }
                            >
                              {linkModifications[linkToDelete.id].status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                              {linkModifications[linkToDelete.id].status || 'Pending'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteConfirmDialog(false);
                setLinkToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteLink}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bandwidth-LM Compatibility: Mandatory Change Dialog */}
      <AlertDialog open={showLMChangeMandatoryDialog} onOpenChange={setShowLMChangeMandatoryDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              LM Type Change Required
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-700">
              {lmChangeReason}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                // Auto-check the LM modification checkbox
                if (currentModifyLink) {
                  const linkId = currentModifyLink.id;
                  if (modificationApplyType === 'individual') {
                    setIndividualLinkModifications({
                      ...individualLinkModifications,
                      [linkId]: {
                        ...individualLinkModifications[linkId],
                        lm: true
                      }
                    });
                  } else {
                    setModificationTypes({
                      ...modificationTypes,
                      lm: true
                    });
                  }

                  // Remove Wireless if it was previously selected
                  const filteredTypes = modifyConnectionTypes.filter(ct => ct.type !== 'Wireless');
                  setModifyConnectionTypes(filteredTypes);

                  toast.success('LM Type Change enabled. Please select a new LM type.');
                }
                setShowLMChangeMandatoryDialog(false);
              }}
              className="bg-orange-600 hover:bg-orange-700"
            >
              OK, Enable LM Change
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bandwidth-LM Compatibility: Suggestion Dialog */}
      <AlertDialog open={showLMChangeSuggestionDialog} onOpenChange={setShowLMChangeSuggestionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              LM Type Change Recommendation
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-700">
              {lmChangeReason}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowLMChangeSuggestionDialog(false)}>
              No, Keep Current LM Type
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                // Auto-check the LM modification checkbox
                if (currentModifyLink) {
                  const linkId = currentModifyLink.id;
                  if (modificationApplyType === 'individual') {
                    setIndividualLinkModifications({
                      ...individualLinkModifications,
                      [linkId]: {
                        ...individualLinkModifications[linkId],
                        lm: true
                      }
                    });
                  } else {
                    setModificationTypes({
                      ...modificationTypes,
                      lm: true
                    });
                  }

                  toast.success('LM Type Change enabled. You can now select a new LM type.');
                }
                setShowLMChangeSuggestionDialog(false);
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Yes, Change LM Type
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}


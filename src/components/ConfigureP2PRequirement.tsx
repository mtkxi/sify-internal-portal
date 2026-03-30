import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ArrowLeft, Plus, MapPin, Link2, AlertCircle, Check, X, ArrowRight, Settings, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { VASConfigSheet, VASConfig } from './VASConfigSheet';
import { BulkVASConfigSheet } from './BulkVASConfigSheet';

interface FeasibilityItem {
  id: string;
  fid: string;
  opportunityId: string;
  type: string;
  product: string;
  location: string;
  locationCategory?: string;
  fullAddress: string;
  company: string;
  connectionType: string;
  bandwidth: string;
  feasibilityStatus: string;
  orderStatus: string;
  expiresOn: string;
  linkType?: string;
  portType?: string;
  portBandwidth?: string;
}

interface FIDPair {
  id: string;
  pairNumber: number;
  fid1: string;
  fid2: string;
  color: string;
}

interface DeviceConfig {
  type: string; // 'firewall' | 'router' | 'switch'
  count: number;
  productCode?: string;
}

interface VASConfig {
  fid: string;
  deviceOwnership: 'own' | 'buy' | '';
  // For Buy Device
  serviceVariant?: 'bundled' | 'select-model';
  devices?: DeviceConfig[];
  managedService?: boolean;
  // For Own Device
  deviceManagement?: 'configuration' | 'configuration-hardware';
}

const PAIR_COLORS = [
  { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-700', ring: 'ring-blue-200' },
  { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-700', ring: 'ring-purple-200' },
  { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-700', ring: 'ring-green-200' },
  { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-700', ring: 'ring-orange-200' },
  { bg: 'bg-pink-100', border: 'border-pink-300', text: 'text-pink-700', ring: 'ring-pink-200' },
  { bg: 'bg-indigo-100', border: 'border-indigo-300', text: 'text-indigo-700', ring: 'ring-indigo-200' },
  { bg: 'bg-teal-100', border: 'border-teal-300', text: 'text-teal-700', ring: 'ring-teal-200' },
  { bg: 'bg-cyan-100', border: 'border-cyan-300', text: 'text-cyan-700', ring: 'ring-cyan-200' },
];

export function ConfigureP2PRequirement() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  
  // Get data from location state
  const { 
    company, 
    proposalId, 
    product = 'P2P',
    subProduct = 'GCC', // GCC, EVPL, EPL, DEPL
    opportunityId,
    selectedFIDsFromPool = [],
    requirement
  } = location.state || {};
  
  // Use requirement data if available, otherwise use defaults
  const requirementData = requirement || {
    company: company || 'TechCorp Solutions',
    customerId: 'CL000001',
    proposalId: proposalId || id || 'NW00035',
    contractTerm: '36 months',
    opportunityId: opportunityId || 'OPP-2025-035',
    location: 'Mumbai - AWS Mumbai',
    status: 'Yet to Configure'
  };
  
  const [selectedFIDs, setSelectedFIDs] = useState<string[]>(selectedFIDsFromPool);
  const [fidPairs, setFidPairs] = useState<FIDPair[]>([]);
  const [pairingMode, setPairingMode] = useState(false);
  const [pairingStep, setPairingStep] = useState<'select-fid1' | 'select-fid2'>('select-fid1');
  const [tempPairFid1, setTempPairFid1] = useState<string | null>(null);
  
  // NID Make and Model state for P2P - EPL
  const [nidMake, setNidMake] = useState<Record<string, string>>({});
  const [nidModel, setNidModel] = useState<Record<string, string>>({});
  
  // VAS Configuration State
  const [vasConfigs, setVasConfigs] = useState<Record<string, VASConfig>>({});
  const [vasSheetOpen, setVasSheetOpen] = useState(false);
  const [currentVASFID, setCurrentVASFID] = useState<string | null>(null);
  const [bulkVASSheetOpen, setBulkVASSheetOpen] = useState(false);
  
  const handleOpenVASSheet = (fid: string) => {
    setCurrentVASFID(fid);
    setVasSheetOpen(true);
  };

  const handleSaveVAS = (config: VASConfig) => {
    setVasConfigs(prev => ({
      ...prev,
      [config.fid]: config
    }));
  };

  const handleBulkSaveVAS = (selectedFIDs: string[], config: VASConfig) => {
    const newConfigs: Record<string, VASConfig> = {};
    selectedFIDs.forEach(fid => {
      newConfigs[fid] = {
        ...config,
        fid
      };
    });
    setVasConfigs(prev => ({
      ...prev,
      ...newConfigs
    }));
  };

  const handleDeleteFID = (fid: string) => {
    // Remove from selected FIDs
    setSelectedFIDs(prev => prev.filter(id => id !== fid));
    
    // Remove from pairs if paired
    const pair = getPairByFID(fid);
    if (pair) {
      setFidPairs(prev => prev.filter(p => p.id !== pair.id));
      toast.success(`Pair removed: ${pair.fid1} ↔ ${pair.fid2}`);
    }
    
    // Remove VAS configuration
    if (vasConfigs[fid]) {
      setVasConfigs(prev => {
        const newConfigs = { ...prev };
        delete newConfigs[fid];
        return newConfigs;
      });
    }
    
    // Remove NID data if EPL
    if (subProduct === 'EPL') {
      setNidMake(prev => {
        const newMake = { ...prev };
        delete newMake[fid];
        return newMake;
      });
      setNidModel(prev => {
        const newModel = { ...prev };
        delete newModel[fid];
        return newModel;
      });
    }
    
    toast.success(`FID ${fid} removed from configuration`);
  };
  
  // Mock feasibility pool data for P2P - filtered by company and product
  const mockFeasibilityPoolRaw: FeasibilityItem[] = [
    // P2P - GCC (Cloud Provider)
    {
      id: '1',
      fid: 'FID-2025-100',
      opportunityId: 'OPP-2025-020',
      type: 'New',
      product: 'P2P - GCC',
      location: 'Mumbai - AWS',
      locationCategory: 'Cloud Provider',
      fullAddress: 'AWS Mumbai Region, Connecting Node: Mumbai',
      company: company || 'TechCorp Solutions',
      connectionType: 'Cloud Provider - AWS',
      bandwidth: '500 Mbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-04-15',
      linkType: 'Primary',
      portType: '1G Ethernet',
      portBandwidth: '1 Gbps'
    },
    {
      id: '2',
      fid: 'FID-2025-101',
      opportunityId: 'OPP-2025-021',
      type: 'New',
      product: 'P2P - GCC',
      location: 'Bangalore - Azure',
      locationCategory: 'Cloud Provider',
      fullAddress: 'Azure Bangalore Region, Connecting Node: Bangalore',
      company: company || 'TechCorp Solutions',
      connectionType: 'Cloud Provider - Azure',
      bandwidth: '1 Gbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-04-20',
      linkType: 'Secondary',
      portType: '10G Ethernet',
      portBandwidth: '10 Gbps'
    },
    {
      id: '3',
      fid: 'FID-2025-102',
      opportunityId: 'OPP-2025-022',
      type: 'New',
      product: 'P2P - GCC',
      location: 'Delhi - GCP',
      locationCategory: 'Cloud Provider',
      fullAddress: 'GCP Delhi Region, Connecting Node: Delhi',
      company: company || 'TechCorp Solutions',
      connectionType: 'Cloud Provider - GCP',
      bandwidth: '750 Mbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-04-18',
      linkType: 'Primary',
      portType: '1G Ethernet',
      portBandwidth: '1 Gbps'
    },
    {
      id: '10',
      fid: 'FID-2025-110',
      opportunityId: 'OPP-2025-023',
      type: 'New',
      product: 'P2P - GCC',
      location: 'Hyderabad - AWS',
      locationCategory: 'Cloud Provider',
      fullAddress: 'AWS Hyderabad Region, Connecting Node: Hyderabad',
      company: company || 'TechCorp Solutions',
      connectionType: 'Cloud Provider - AWS',
      bandwidth: '2 Gbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-04-25',
      linkType: 'Secondary',
      portType: '10G Ethernet',
      portBandwidth: '10 Gbps'
    },
    // P2P - GCC (Non-Cloud Provider Endpoints)
    {
      id: '1a',
      fid: 'FID-2025-116',
      opportunityId: 'OPP-2025-020',
      type: 'New',
      product: 'P2P - GCC',
      location: 'Mumbai Data Center',
      locationCategory: 'Data Center',
      fullAddress: 'Andheri Data Center, Mumbai, Maharashtra 400053',
      company: company || 'TechCorp Solutions',
      connectionType: 'Fiber',
      bandwidth: '500 Mbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-04-15',
      linkType: 'Primary',
      portType: '1G Ethernet',
      portBandwidth: '1 Gbps'
    },
    {
      id: '2a',
      fid: 'FID-2025-117',
      opportunityId: 'OPP-2025-021',
      type: 'New',
      product: 'P2P - GCC',
      location: 'Bangalore Office',
      locationCategory: 'Office Branch',
      fullAddress: 'Electronic City, Bangalore, Karnataka 560100',
      company: company || 'TechCorp Solutions',
      connectionType: 'Wireless',
      bandwidth: '1 Gbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-04-20',
      linkType: 'Secondary',
      portType: '10G Ethernet',
      portBandwidth: '10 Gbps'
    },
    {
      id: '3a',
      fid: 'FID-2025-118',
      opportunityId: 'OPP-2025-022',
      type: 'New',
      product: 'P2P - GCC',
      location: 'Delhi Data Center',
      locationCategory: 'Data Center',
      fullAddress: 'Noida Sector 62 Data Center, Delhi NCR, UP 201309',
      company: company || 'TechCorp Solutions',
      connectionType: 'Broadband',
      bandwidth: '750 Mbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-04-18',
      linkType: 'Primary',
      portType: '1G Ethernet',
      portBandwidth: '1 Gbps'
    },
    {
      id: '10a',
      fid: 'FID-2025-120',
      opportunityId: 'OPP-2025-023',
      type: 'New',
      product: 'P2P - GCC',
      location: 'Hyderabad Office',
      locationCategory: 'Office Branch',
      fullAddress: 'HITEC City, Hyderabad, Telangana 500081',
      company: company || 'TechCorp Solutions',
      connectionType: 'Other ISP',
      bandwidth: '2 Gbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-04-25',
      linkType: 'Secondary',
      portType: '10G Ethernet',
      portBandwidth: '10 Gbps'
    },
    // P2P - GCC - OPP-2025-055 (NW00055 - Multi-Location Cloud Connectivity)
    {
      id: '11a',
      fid: 'FID-2025-150',
      opportunityId: 'OPP-2025-055',
      type: 'New',
      product: 'P2P - GCC',
      location: 'Bangalore Office',
      locationCategory: 'Office Branch',
      fullAddress: 'Electronic City, Bangalore, Karnataka 560100',
      company: company || 'TechCorp Solutions',
      connectionType: 'Fiber',
      bandwidth: '1 Gbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-04-30',
      linkType: 'Primary',
      portType: '1G Ethernet',
      portBandwidth: '1 Gbps'
    },
    {
      id: '11b',
      fid: 'FID-2025-151',
      opportunityId: 'OPP-2025-055',
      type: 'New',
      product: 'P2P - GCC',
      location: 'Chennai - AWS',
      locationCategory: 'Cloud Provider',
      fullAddress: 'AWS Chennai Region, Connecting Node: Chennai',
      company: company || 'TechCorp Solutions',
      connectionType: 'Cloud Provider - AWS',
      bandwidth: '1 Gbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-04-30',
      linkType: 'Primary',
      portType: '1G Ethernet',
      portBandwidth: '1 Gbps'
    },
    {
      id: '11c',
      fid: 'FID-2025-152',
      opportunityId: 'OPP-2025-055',
      type: 'New',
      product: 'P2P - GCC',
      location: 'Hyderabad Data Center',
      locationCategory: 'Data Center',
      fullAddress: 'HITEC City Data Center, Hyderabad, Telangana 500081',
      company: company || 'TechCorp Solutions',
      connectionType: 'Wireless',
      bandwidth: '1 Gbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-04-30',
      linkType: 'Secondary',
      portType: '1G Ethernet',
      portBandwidth: '1 Gbps'
    },
    {
      id: '11d',
      fid: 'FID-2025-153',
      opportunityId: 'OPP-2025-055',
      type: 'New',
      product: 'P2P - GCC',
      location: 'Kochi - Azure',
      locationCategory: 'Cloud Provider',
      fullAddress: 'Azure Kochi Region, Connecting Node: Kochi',
      company: company || 'TechCorp Solutions',
      connectionType: 'Cloud Provider - Azure',
      bandwidth: '500 Mbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-04-30',
      linkType: 'Secondary',
      portType: '1G Ethernet',
      portBandwidth: '1 Gbps'
    },
    // P2P - EVPL
    {
      id: '4',
      fid: 'FID-2025-103',
      opportunityId: 'OPP-2025-025',
      type: 'New',
      product: 'P2P - EVPL',
      location: 'Pune - Chennai',
      locationCategory: 'Office Branch',
      fullAddress: 'Point-to-Point EVPL Connection, Pune IT Park to Chennai DC',
      company: company || 'TechCorp Solutions',
      connectionType: 'Ethernet Virtual Private Line',
      bandwidth: '200 Mbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-03-30',
      linkType: 'Mesh',
      portType: 'Fast Ethernet',
      portBandwidth: '100 Mbps'
    },
    {
      id: '5',
      fid: 'FID-2025-104',
      opportunityId: 'OPP-2025-026',
      type: 'New',
      product: 'P2P - EVPL',
      location: 'Mumbai - Delhi',
      locationCategory: 'Data Center',
      fullAddress: 'Point-to-Point EVPL Connection, Mumbai DC to Delhi DC',
      company: company || 'TechCorp Solutions',
      connectionType: 'Ethernet Virtual Private Line',
      bandwidth: '500 Mbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-04-05',
      linkType: 'Hub & Spoke',
      portType: '1G Ethernet',
      portBandwidth: '1 Gbps'
    },
    {
      id: '11',
      fid: 'FID-2025-111',
      opportunityId: 'OPP-2025-027',
      type: 'New',
      product: 'P2P - EVPL',
      location: 'Kolkata - Guwahati',
      locationCategory: 'Office Branch',
      fullAddress: 'Point-to-Point EVPL Connection, Kolkata to Guwahati',
      company: company || 'TechCorp Solutions',
      connectionType: 'Ethernet Virtual Private Line',
      bandwidth: '300 Mbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-04-12',
      linkType: 'Hub & Spoke',
      portType: '1G Ethernet',
      portBandwidth: '1 Gbps'
    },
    {
      id: '12',
      fid: 'FID-2025-112',
      opportunityId: 'OPP-2025-028',
      type: 'New',
      product: 'P2P - EVPL',
      location: 'Jaipur - Ahmedabad',
      locationCategory: 'Office Branch',
      fullAddress: 'Point-to-Point EVPL Connection, Jaipur to Ahmedabad',
      company: company || 'TechCorp Solutions',
      connectionType: 'Ethernet Virtual Private Line',
      bandwidth: '400 Mbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-04-18',
      linkType: 'Mesh',
      portType: '1G Ethernet',
      portBandwidth: '1 Gbps'
    },
    // P2P - EPL
    {
      id: '6',
      fid: 'FID-2025-106',
      opportunityId: 'OPP-2025-030',
      type: 'New',
      product: 'P2P - EPL',
      location: 'Chennai - Coimbatore',
      locationCategory: 'Office Branch',
      fullAddress: 'Point-to-Point EPL Connection, Chennai DC to Coimbatore Branch',
      company: company || 'TechCorp Solutions',
      connectionType: 'Fiber',
      bandwidth: '100 Mbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-03-28',
      linkType: 'Primary',
      portType: '1G',
      portBandwidth: '1 Gbps'
    },
    {
      id: '7',
      fid: 'FID-2025-107',
      opportunityId: 'OPP-2025-031',
      type: 'New',
      product: 'P2P - EPL',
      location: 'Kolkata - Bhubaneswar',
      locationCategory: 'Office Branch',
      fullAddress: 'Point-to-Point EPL Connection, Kolkata Office to Bhubaneswar Branch',
      company: company || 'TechCorp Solutions',
      connectionType: 'Wireless',
      bandwidth: '200 Mbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-04-08',
      linkType: 'Secondary',
      portType: '10G',
      portBandwidth: '10 Gbps'
    },
    {
      id: '13',
      fid: 'FID-2025-113',
      opportunityId: 'OPP-2025-032',
      type: 'New',
      product: 'P2P - EPL',
      location: 'Mumbai - Navi Mumbai',
      locationCategory: 'Data Center',
      fullAddress: 'Point-to-Point EPL Connection, Mumbai DC to Navi Mumbai Office',
      company: company || 'TechCorp Solutions',
      connectionType: 'Broadband',
      bandwidth: '500 Mbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-04-15',
      linkType: 'Primary',
      portType: '25G',
      portBandwidth: '25 Gbps'
    },
    {
      id: '14',
      fid: 'FID-2025-114',
      opportunityId: 'OPP-2025-033',
      type: 'New',
      product: 'P2P - EPL',
      location: 'Bangalore - Mysore',
      locationCategory: 'Office Branch',
      fullAddress: 'Point-to-Point EPL Connection, Bangalore HQ to Mysore Branch',
      company: company || 'TechCorp Solutions',
      connectionType: 'Other ISP',
      bandwidth: '300 Mbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-04-20',
      linkType: 'Secondary',
      portType: '40G',
      portBandwidth: '40 Gbps'
    },
    {
      id: '15',
      fid: 'FID-2025-115',
      opportunityId: 'OPP-2025-034',
      type: 'New',
      product: 'P2P - EPL',
      location: 'Delhi - Gurgaon',
      locationCategory: 'Data Center',
      fullAddress: 'Point-to-Point EPL Connection, Delhi DC to Gurgaon Office',
      company: company || 'TechCorp Solutions',
      connectionType: 'Fiber',
      bandwidth: '1 Gbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-04-25',
      linkType: 'Primary',
      portType: '100G',
      portBandwidth: '100 Gbps'
    },
    {
      id: '16',
      fid: 'FID-2025-121',
      opportunityId: 'OPP-2025-037',
      type: 'New',
      product: 'P2P - EPL',
      location: 'Pune - Nashik',
      locationCategory: 'Office Branch',
      fullAddress: 'Point-to-Point EPL Connection, Pune Office to Nashik Branch',
      company: company || 'TechCorp Solutions',
      connectionType: 'Wireless',
      bandwidth: '150 Mbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-05-02',
      linkType: 'Primary',
      portType: '10G',
      portBandwidth: '10 Gbps'
    },
    {
      id: '17',
      fid: 'FID-2025-122',
      opportunityId: 'OPP-2025-038',
      type: 'New',
      product: 'P2P - EPL',
      location: 'Ahmedabad - Surat',
      locationCategory: 'Office Branch',
      fullAddress: 'Point-to-Point EPL Connection, Ahmedabad HQ to Surat Branch',
      company: company || 'TechCorp Solutions',
      connectionType: 'Broadband',
      bandwidth: '250 Mbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-05-08',
      linkType: 'Secondary',
      portType: '1G',
      portBandwidth: '1 Gbps'
    },
    // P2P - DEPL
    {
      id: '8',
      fid: 'FID-2025-108',
      opportunityId: 'OPP-2025-035',
      type: 'New',
      product: 'P2P - DEPL',
      location: 'Jaipur - Udaipur',
      locationCategory: 'Office Branch',
      fullAddress: 'Point-to-Point DEPL Connection, Jaipur Office to Udaipur Branch',
      company: company || 'TechCorp Solutions',
      connectionType: 'Dark Fiber Ethernet Private Line',
      bandwidth: '10 Gbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-04-18',
      linkType: 'Mesh',
      portType: '10G Ethernet',
      portBandwidth: '10 Gbps'
    },
    {
      id: '9',
      fid: 'FID-2025-109',
      opportunityId: 'OPP-2025-036',
      type: 'New',
      product: 'P2P - DEPL',
      location: 'Indore - Bhopal',
      locationCategory: 'Data Center',
      fullAddress: 'Point-to-Point DEPL Connection, Indore DC to Bhopal Office',
      company: company || 'TechCorp Solutions',
      connectionType: 'Dark Fiber Ethernet Private Line',
      bandwidth: '10 Gbps',
      feasibilityStatus: 'Feasible',
      orderStatus: '',
      expiresOn: '2025-04-22',
      linkType: 'Mesh',
      portType: '10G Ethernet',
      portBandwidth: '10 Gbps'
    }
  ];

  // Filter to show only Feasible status and matching subProduct
  const mockFeasibilityPool = mockFeasibilityPoolRaw.filter(
    item => item.feasibilityStatus === 'Feasible' && 
            item.product === `P2P - ${subProduct}`
  );

  // Get unpaired FIDs (selected but not yet in a pair)
  const unpairedFIDs = useMemo(() => {
    const pairedFIDsList = fidPairs.flatMap(pair => [pair.fid1, pair.fid2]);
    return selectedFIDs.filter(fid => !pairedFIDsList.includes(fid));
  }, [selectedFIDs, fidPairs]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFIDs(mockFeasibilityPool.map(item => item.fid));
    } else {
      setSelectedFIDs([]);
      // Clear pairs when deselecting all
      setFidPairs([]);
      setTempPairFid1(null);
      setPairingStep('select-fid1');
    }
  };

  const handleSelectFID = (fid: string, checked: boolean) => {
    // Check if FID is in a pair
    const isInPair = fidPairs.some(pair => pair.fid1 === fid || pair.fid2 === fid);
    
    if (isInPair) {
      // Prevent unchecking FIDs that are already paired
      toast.error('Cannot unselect a paired FID. Please remove the pair first.');
      return;
    }
    
    if (checked) {
      setSelectedFIDs([...selectedFIDs, fid]);
    } else {
      // Remove from selection
      setSelectedFIDs(selectedFIDs.filter(id => id !== fid));
      // Clear temp if it contains this FID
      if (tempPairFid1 === fid) {
        setTempPairFid1(null);
        setPairingStep('select-fid1');
      }
    }
  };

  const startPairing = () => {
    setPairingMode(true);
    setTempPairFid1(null);
    setPairingStep('select-fid1');
    if (subProduct === 'GCC') {
      toast.info('Pairing mode activated. Remember: One FID must be Cloud Provider, one must be non-cloud location.');
    } else {
      toast.info('Pairing mode activated. Click any FID to start creating pairs.');
    }
  };

  const handleFIDClickForPairing = (fid: string) => {
    if (!pairingMode) return;

    // Check if FID is already in a pair
    const isAlreadyPaired = fidPairs.some(pair => pair.fid1 === fid || pair.fid2 === fid);
    if (isAlreadyPaired) {
      toast.error('This FID is already paired');
      return;
    }

    // Auto-select FID if not already selected
    if (!selectedFIDs.includes(fid)) {
      setSelectedFIDs([...selectedFIDs, fid]);
    }

    if (pairingStep === 'select-fid1') {
      setTempPairFid1(fid);
      setPairingStep('select-fid2');
      toast.info(`First FID selected: ${fid}. Now select the second FID to complete the pair.`);
    } else if (pairingStep === 'select-fid2') {
      if (fid === tempPairFid1) {
        // Clicking same FID - deselect and go back
        setTempPairFid1(null);
        setPairingStep('select-fid1');
        toast.info('First FID deselected. Select a FID to start a new pair.');
        return;
      }

      // For P2P - GCC: Validate that one end is Cloud Provider and other is not
      if (subProduct === 'GCC') {
        const fid1Data = getFIDData(tempPairFid1!);
        const fid2Data = getFIDData(fid);
        
        const isFirstCloud = fid1Data?.locationCategory === 'Cloud Provider';
        const isSecondCloud = fid2Data?.locationCategory === 'Cloud Provider';
        
        if (isFirstCloud && isSecondCloud) {
          toast.error('❌ Invalid pairing: Both FIDs cannot be Cloud Providers. One must be a Data Center, Office Branch, or other location type.');
          return;
        }
        
        if (!isFirstCloud && !isSecondCloud) {
          toast.error('❌ Invalid pairing: At least one FID must be a Cloud Provider for P2P - GCC connections.');
          return;
        }
      }

      // Create the pair with color and number
      const pairNumber = fidPairs.length + 1;
      const colorIndex = (fidPairs.length) % PAIR_COLORS.length;
      const pairColor = PAIR_COLORS[colorIndex];

      const newPair: FIDPair = {
        id: `pair-${Date.now()}`,
        pairNumber,
        fid1: tempPairFid1!,
        fid2: fid,
        color: JSON.stringify(pairColor)
      };

      // Update pairs first, then reset temp state
      setFidPairs(prevPairs => [...prevPairs, newPair]);
      
      // Use setTimeout to ensure state updates properly
      setTimeout(() => {
        setTempPairFid1(null);
        setPairingStep('select-fid1');
        toast.success(`✓ Pair ${pairNumber} created: ${tempPairFid1} ↔ ${fid}`);
      }, 0);
    }
  };

  const handleRemovePair = (pairId: string) => {
    const removedPair = fidPairs.find(p => p.id === pairId);
    setFidPairs(fidPairs.filter(pair => pair.id !== pairId).map((pair, index) => ({
      ...pair,
      pairNumber: index + 1,
      color: JSON.stringify(PAIR_COLORS[index % PAIR_COLORS.length])
    })));
    
    if (removedPair) {
      toast.success(`Pair ${removedPair.pairNumber} removed`);
    }
  };

  const finishPairing = () => {
    if (unpairedFIDs.length > 0) {
      toast.error(`${unpairedFIDs.length} FID(s) still unpaired. Please pair all selected FIDs.`);
      return;
    }
    setPairingMode(false);
    setTempPairFid1(null);
    setPairingStep('select-fid1');
    toast.success(`✓ All FIDs paired successfully! ${fidPairs.length} pair(s) configured.`);
  };

  const handleContinue = () => {
    if (selectedFIDs.length === 0) {
      toast.error('Please select at least one FID');
      return;
    }
    if (selectedFIDs.length % 2 !== 0) {
      toast.error('P2P products require an even number of FIDs');
      return;
    }
    if (unpairedFIDs.length > 0) {
      toast.error('Please pair all selected FIDs before continuing');
      return;
    }
    
    // Prepare pair data with full details for BOM generation
    const pairsWithDetails = fidPairs.map(pair => {
      const fid1Data = getFIDData(pair.fid1);
      const fid2Data = getFIDData(pair.fid2);
      
      return {
        ...pair,
        fid1Location: fid1Data?.location || '',
        fid2Location: fid2Data?.location || '',
        fid1LocationCategory: fid1Data?.locationCategory,
        fid2LocationCategory: fid2Data?.locationCategory,
        linkType: fid1Data?.linkType || fid2Data?.linkType,
        portType: fid1Data?.portType || fid2Data?.portType,
        portBandwidth: fid1Data?.portBandwidth || fid2Data?.portBandwidth,
        bandwidth: fid1Data?.bandwidth || fid2Data?.bandwidth || '1 Gbps',
        connectionType: fid1Data?.connectionType || fid2Data?.connectionType || 'Fiber Optic',
        otc: 0,
        arc: 0
      };
    });
    
    toast.success(`Configuration saved with ${fidPairs.length} FID pair(s)`);
    
    // Navigate to P2P Proposal Document Generation
    navigate('/p2p-proposal-document-generation', {
      state: {
        proposalId: `PROP-P2P-${Date.now()}`,
        company,
        product: 'P2P',
        subProduct,
        opportunityId,
        fidPairs: pairsWithDetails,
        vasConfigs,
        nidMake,
        nidModel
      }
    });
  };

  const getFIDData = (fid: string) => {
    return mockFeasibilityPool.find(item => item.fid === fid);
  };

  const getPairByFID = (fid: string): FIDPair | undefined => {
    return fidPairs.find(pair => pair.fid1 === fid || pair.fid2 === fid);
  };

  const getPairColor = (pair: FIDPair) => {
    return JSON.parse(pair.color);
  };

  // Get badge color based on sub product
  const getProductBadgeColor = () => {
    switch (subProduct) {
      case 'GCC': return 'bg-green-100 text-green-700';
      case 'EVPL': return 'bg-blue-100 text-blue-700';
      case 'EPL': return 'bg-orange-100 text-orange-700';
      case 'DEPL': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
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
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-gray-900">Configure P2P Requirement</h1>
                <p className="text-sm text-gray-500">
                  {company} • Configure Point-to-Point connectivity
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/add-fids/${requirementData.proposalId}`, {
                  state: { 
                    company: requirementData.company,
                    proposalId: requirementData.proposalId,
                    networkProduct: `P2P - ${subProduct}`,
                    opportunityId: requirementData.opportunityId
                  }
                })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add FIDs
              </Button>
              <Button
                size="sm"
                className="bg-slate-800 hover:bg-slate-900"
                onClick={handleContinue}
                disabled={selectedFIDs.length === 0 || unpairedFIDs.length > 0}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-6 space-y-6">
        {/* Requirement Details */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Requirement Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-4 gap-6">
              <div>
                <label className="text-xs text-gray-500">Customer</label>
                <p className="text-sm text-gray-900 mt-1">{requirementData.company}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Customer ID</label>
                <p className="text-sm text-gray-900 mt-1">{requirementData.customerId}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Type</label>
                <p className="text-sm text-gray-900 mt-1">
                  <Badge variant="outline">New</Badge>
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Product</label>
                <p className="text-sm text-gray-900 mt-1 flex items-center">
                  <Badge className="bg-indigo-100 text-indigo-700">P2P</Badge>
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Sub Product</label>
                <p className="text-sm text-gray-900 mt-1">
                  <Badge className={getProductBadgeColor()}>
                    P2P - {subProduct}
                  </Badge>
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Total P2P Pair</label>
                <p className="text-sm text-gray-900 mt-1">
                  {selectedFIDs.length > 0 ? Math.floor(selectedFIDs.length / 2) : 0} {Math.floor(selectedFIDs.length / 2) === 1 ? 'Pair' : 'Pairs'}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Version</label>
                <p className="text-sm text-gray-900 mt-1">v1.0</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Contract Term</label>
                <p className="text-sm text-gray-900 mt-1">{requirementData.contractTerm}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Generated On</label>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Proposal ID</label>
                <p className="text-sm text-gray-900 mt-1">{requirementData.proposalId}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Opportunity ID</label>
                <p className="text-sm text-gray-900 mt-1">{requirementData.opportunityId}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Status</label>
                <p className="text-sm text-gray-900 mt-1">
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300">
                    {requirementData.status || 'Yet to Configure'}
                  </Badge>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* EPL Configuration Info Alert */}
        {subProduct === 'EPL' && (
          <Alert className="bg-orange-50 border-orange-200">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-sm text-orange-900">
              <strong>P2P - EPL Configuration:</strong> For Ethernet Private Line, please select <strong>NID Make and NID Model</strong> for each FID endpoint. This information is required for accurate proposal generation and device provisioning.
            </AlertDescription>
          </Alert>
        )}

        {/* GCC Pairing Requirement Alert */}
        {subProduct === 'GCC' && (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm text-blue-900">
              <strong>P2P - GCC Pairing Rule:</strong> For Global Cloud Connect, each pair must have <strong>one Cloud Provider endpoint</strong> (AWS/Azure/GCP) and <strong>one non-cloud endpoint</strong> (Data Center, Office Branch, or other location). Both endpoints cannot be Cloud Providers.
            </AlertDescription>
          </Alert>
        )}

        {/* P2P Pairing Info Alert */}
        {selectedFIDs.length > 0 && (
          <Alert className={`${unpairedFIDs.length > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
            <AlertCircle className={`h-4 w-4 ${unpairedFIDs.length > 0 ? 'text-yellow-600' : 'text-green-600'}`} />
            <AlertDescription className={`text-sm ${unpairedFIDs.length > 0 ? 'text-yellow-900' : 'text-green-900'}`}>
              <strong>P2P Configuration:</strong> {selectedFIDs.length} FID(s) selected • {fidPairs.length} pair(s) created • {unpairedFIDs.length} unpaired
              {unpairedFIDs.length > 0 ? (
                <span className="ml-2 font-medium">⚠️ Please pair all FIDs before continuing.</span>
              ) : fidPairs.length > 0 ? (
                <span className="ml-2 font-medium">✓ All FIDs are paired and ready!</span>
              ) : null}
            </AlertDescription>
          </Alert>
        )}

        {/* FID Pairs Display */}
        {fidPairs.length > 0 && (
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>FID Pairs</CardTitle>
                  <CardDescription>{fidPairs.length} pair(s) configured</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {fidPairs.map((pair) => {
                  const fid1Data = getFIDData(pair.fid1);
                  const fid2Data = getFIDData(pair.fid2);
                  const color = getPairColor(pair);
                  
                  return (
                    <div 
                      key={pair.id} 
                      className={`relative p-4 border-2 rounded-lg ${color.border} ${color.bg}`}
                    >
                      {/* Pair Number Badge */}
                      <div className="absolute -top-3 left-4">
                        <Badge className={`${color.bg} ${color.text} border ${color.border} shadow-sm`}>
                          Pair {pair.pairNumber}
                        </Badge>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePair(pair.id)}
                        className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-white border border-gray-300 text-red-600 hover:text-red-700 hover:bg-red-50 shadow-sm"
                      >
                        <X className="w-3 h-3" />
                      </Button>

                      <div className="flex items-center justify-between mt-2">
                        {/* FID 1 */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge variant="outline" className="text-xs bg-white">A</Badge>
                            <span className="text-sm font-medium text-blue-600">{pair.fid1}</span>
                          </div>
                          <p className="text-xs text-gray-600 pl-6">{fid1Data?.location}</p>
                          {subProduct === 'GCC' && fid1Data?.locationCategory && (
                            <Badge 
                              variant="outline" 
                              className={`text-xs ml-6 mt-1 ${
                                fid1Data.locationCategory === 'Cloud Provider' 
                                  ? 'bg-sky-50 text-sky-700 border-sky-300' 
                                  : 'bg-gray-50 text-gray-600 border-gray-300'
                              }`}
                            >
                              {fid1Data.locationCategory}
                            </Badge>
                          )}
                        </div>

                        {/* Arrow */}
                        <div className="px-3">
                          <Link2 className={`w-5 h-5 ${color.text}`} />
                        </div>

                        {/* FID 2 */}
                        <div className="flex-1 text-right">
                          <div className="flex items-center justify-end space-x-2 mb-1">
                            <span className="text-sm font-medium text-blue-600">{pair.fid2}</span>
                            <Badge variant="outline" className="text-xs bg-white">B</Badge>
                          </div>
                          <p className="text-xs text-gray-600 pr-6">{fid2Data?.location}</p>
                          {subProduct === 'GCC' && fid2Data?.locationCategory && (
                            <Badge 
                              variant="outline" 
                              className={`text-xs mr-6 mt-1 ${
                                fid2Data.locationCategory === 'Cloud Provider' 
                                  ? 'bg-sky-50 text-sky-700 border-sky-300' 
                                  : 'bg-gray-50 text-gray-600 border-gray-300'
                              }`}
                            >
                              {fid2Data.locationCategory}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pairing Instructions */}
        {pairingMode && (
          <Alert className="bg-blue-50 border-blue-300">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm text-blue-900">
              <strong>Pairing Mode Active:</strong>{' '}
              {pairingStep === 'select-fid1' ? (
                <span>
                  Click on any unpaired FID in the table to select it as the <strong>first FID</strong> of a new pair.
                  {subProduct === 'GCC' && <span className="ml-1">(Remember: One must be Cloud Provider, one must be non-cloud)</span>}
                </span>
              ) : (
                <span>
                  First FID selected: <strong className="text-blue-700">{tempPairFid1}</strong>
                  {subProduct === 'GCC' && getFIDData(tempPairFid1) && (
                    <span className="ml-1">
                      ({getFIDData(tempPairFid1)?.locationCategory === 'Cloud Provider' ? 'Cloud Provider - select a non-cloud FID' : 'Non-Cloud - select a Cloud Provider FID'})
                    </span>
                  )}. Now click another unpaired FID to complete <strong>Pair {fidPairs.length + 1}</strong>.
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Configure FIDs */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Configure FIDs</CardTitle>
                <CardDescription>
                  {mockFeasibilityPool.length} FID(s) available • {selectedFIDs.length} selected • {fidPairs.length} paired
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                {!pairingMode ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={startPairing}
                    >
                      <Link2 className="w-4 h-4 mr-2" />
                      Create Pairs
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setBulkVASSheetOpen(true)}
                      disabled={selectedFIDs.length === 0}
                      className="border-green-300 text-green-700 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Bulk Configure VAS
                    </Button>
                  </>
                ) : (
                  <>
                    <Badge className="bg-blue-600 text-white px-3 py-1">
                      {pairingStep === 'select-fid1' ? '1️⃣ Select First FID' : `2️⃣ Select Second FID for Pair ${fidPairs.length + 1}`}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={finishPairing}
                      disabled={unpairedFIDs.length > 0}
                      className="bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Finish Pairing
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setPairingMode(false);
                        setTempPairFid1(null);
                        setPairingStep('select-fid1');
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border-t overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedFIDs.length === mockFeasibilityPool.length && mockFeasibilityPool.length > 0}
                        onCheckedChange={handleSelectAll}
                        disabled={pairingMode}
                      />
                    </TableHead>
                    <TableHead>FID</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Port Details</TableHead>
                    <TableHead>LM Type / Bandwidth</TableHead>
                    {subProduct === 'EPL' && (
                      <>
                        <TableHead>NID Make</TableHead>
                        <TableHead>NID Model</TableHead>
                      </>
                    )}
                    <TableHead>Pair Status</TableHead>
                    <TableHead>VAS</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockFeasibilityPool.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={subProduct === 'EPL' ? 9 : 7} className="text-center py-8 text-gray-500">
                        No P2P - {subProduct} FIDs available in feasibility pool for {company}
                      </TableCell>
                    </TableRow>
                  ) : (
                    mockFeasibilityPool.map((item) => {
                      const pair = getPairByFID(item.fid);
                      const isPaired = !!pair;
                      // FID should be checked if it's in selectedFIDs OR if it's paired
                      const isSelected = selectedFIDs.includes(item.fid) || isPaired;
                      const isFirstInTempPair = tempPairFid1 === item.fid;
                      const color = pair ? getPairColor(pair) : null;
                      const isOtherFidInPair = pair ? (pair.fid1 === item.fid ? pair.fid2 : pair.fid1) : null;
                      const isClickableForPairing = pairingMode && !isPaired;
                      
                      return (
                        <TableRow 
                          key={item.id}
                          className={`
                            ${isClickableForPairing ? 'cursor-pointer hover:bg-blue-50 transition-colors' : ''}
                            ${isFirstInTempPair ? 'bg-blue-100 ring-2 ring-blue-400' : ''}
                            ${isPaired && color ? `${color.bg} border-l-4 ${color.border}` : ''}
                            ${pairingMode && !isPaired && !isFirstInTempPair ? 'border-l-2 border-l-transparent hover:border-l-blue-300' : ''}
                          `}
                          onClick={() => {
                            if (isClickableForPairing) {
                              handleFIDClickForPairing(item.fid);
                            }
                          }}
                        >
                          <TableCell>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => handleSelectFID(item.fid, checked as boolean)}
                              disabled={pairingMode || isPaired}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className="text-blue-600 font-medium">{item.fid}</span>
                              {isPaired && pair && color && (
                                <Badge className={`text-xs ${color.bg} ${color.text} border ${color.border}`}>
                                  Pair {pair.pairNumber} • {pair.fid1 === item.fid ? 'A' : 'B'}
                                </Badge>
                              )}
                              {isFirstInTempPair && (
                                <Badge className="text-xs bg-blue-600 text-white">
                                  1st FID Selected
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-start">
                              <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-sm text-gray-900">{item.location}</p>
                                {item.locationCategory && (
                                  <div className="mt-1">
                                    <Badge 
                                      variant="outline" 
                                      className={`text-xs ${
                                        item.locationCategory === 'Cloud Provider' 
                                          ? 'bg-sky-50 text-sky-700 border-sky-300' 
                                          : 'bg-gray-50 text-gray-600 border-gray-300'
                                      }`}
                                    >
                                      {item.locationCategory}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm space-y-1">
                              {item.linkType && (
                                <div className="text-gray-700">
                                  <span className="text-xs text-gray-500">Link: </span>
                                  {item.linkType}
                                </div>
                              )}
                              {item.portType && (
                                <div className="text-gray-700">
                                  <span className="text-xs text-gray-500">Port: </span>
                                  {item.portType}
                                </div>
                              )}
                              {item.portBandwidth && (
                                <div className="text-gray-700">
                                  <span className="text-xs text-gray-500">BW: </span>
                                  {item.portBandwidth}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm text-gray-900">{item.connectionType}</p>
                              <p className="text-xs text-gray-600 mt-0.5">{item.bandwidth}</p>
                            </div>
                          </TableCell>
                          {subProduct === 'EPL' && (
                            <>
                              <TableCell onClick={(e) => e.stopPropagation()}>
                                <Select
                                  value={nidMake[item.fid] || ''}
                                  onValueChange={(value) => setNidMake(prev => ({ ...prev, [item.fid]: value }))}
                                >
                                  <SelectTrigger className="w-[120px] h-8">
                                    <SelectValue placeholder="Select Make" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="ADVA">ADVA</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell onClick={(e) => e.stopPropagation()}>
                                <Select
                                  value={nidModel[item.fid] || ''}
                                  onValueChange={(value) => setNidModel(prev => ({ ...prev, [item.fid]: value }))}
                                  disabled={!nidMake[item.fid]}
                                >
                                  <SelectTrigger className="w-[140px] h-8">
                                    <SelectValue placeholder="Select Model" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="GE114Pro">GE114Pro</SelectItem>
                                    <SelectItem value="XG120 pro">XG120 pro</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                            </>
                          )}
                          <TableCell>
                            {isPaired && pair && color ? (
                              <div className="flex items-center space-x-2">
                                <Badge className={`${color.bg} ${color.text} border ${color.border}`}>
                                  <Link2 className="w-3 h-3 mr-1" />
                                  Paired
                                </Badge>
                                {isOtherFidInPair && (
                                  <ArrowRight className={`w-4 h-4 ${color.text}`} />
                                )}
                              </div>
                            ) : isSelected ? (
                              <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Unpaired
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-gray-500">
                                Available
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <div className="space-y-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleOpenVASSheet(item.fid)}
                              >
                                <Edit className="w-4 h-4 text-gray-600 hover:text-gray-900" />
                              </Button>
                              {vasConfigs[item.fid] && (
                                <div className="text-xs text-gray-600 space-y-0.5">
                                  <div className="capitalize">
                                    {vasConfigs[item.fid].deviceOwnership === 'own' ? (
                                      <span className="text-green-600 font-medium">Own Device (Managed)</span>
                                    ) : (
                                      <span className="text-blue-600 font-medium">Buy Device</span>
                                    )}
                                  </div>
                                  {vasConfigs[item.fid].devices && vasConfigs[item.fid].devices!.length > 0 && (
                                    <div className="text-xs text-gray-500">
                                      {vasConfigs[item.fid].devices!.map(d => `${d.count}x ${d.type}`).join(', ')}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-red-50"
                              onClick={() => handleDeleteFID(item.fid)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* VAS Configuration Sheet */}
      {currentVASFID && (
        <VASConfigSheet
          open={vasSheetOpen}
          onOpenChange={setVasSheetOpen}
          fid={currentVASFID}
          location={getFIDData(currentVASFID)?.location || ''}
          initialConfig={vasConfigs[currentVASFID]}
          onSave={handleSaveVAS}
        />
      )}

      {/* Bulk VAS Configuration Sheet */}
      <BulkVASConfigSheet
        open={bulkVASSheetOpen}
        onOpenChange={setBulkVASSheetOpen}
        selectedFIDs={selectedFIDs.map(fid => {
          const fidData = getFIDData(fid);
          return {
            fid,
            location: fidData?.location || '',
            hasVAS: !!vasConfigs[fid]
          };
        })}
        onSave={handleBulkSaveVAS}
      />
    </div>
  );
}
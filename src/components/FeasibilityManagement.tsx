import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { FIDDetailsModal } from "./FIDDetailsModal";
import { toast } from "sonner@2.0.3";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  MapPin,
  XCircle,
  FileText,
  Filter,
  Building,
  MoreVertical,
  RefreshCw,
  Search,
  Share2,
  Truck,
  Network,
  Cloud,
  CheckCircle2,
  Download,
  Settings,
  X,
  IndianRupee,
  Info,
} from "lucide-react";

// Interfaces
interface DraftItem {
  id: string;
  createdOn: string;
  type: "Quick Request" | "Interactive";
  lastUpdatedOn: string;
  connections: number;
  company: string;
  submissionType: "Manual" | "Bulk Upload";
  service: "MPLS" | "DIA";
  linkType?: "Hub & Spoke" | "Mesh";
}

interface FeasibilityItem {
  id: string;
  fid: string;
  opportunityId: string;
  type: "New" | "MDAC";
  serviceChangeType?: "Address Change" | "LM Change" | "Bandwidth Change" | "Add Secondary/Tertiary Link";
  product: "DIA" | "MPLS" | "P2P - GCC" | "P2P - EVPL" | "P2P - EPL" | "P2P - DEPL";
  location: string;
  fullAddress: string;
  latitude: string;
  longitude: string;
  connectionType: string;
  bandwidth: string;
  feasibilityStatus:
    | "Checking Feasibility"
    | "Feasible"
    | "Not Feasible"
    | "Expired";
  expiresOn?: string;
  orderStatus?:
    | "Proposal Generated"
    | "Order Placed"
    | "Order Completed";
  isSelectable: boolean;
  nearingExpiry?: boolean;
  company: string;
  service: "MPLS" | "DIA";
  linkType?: "Hub & Spoke" | "Mesh";
  locationCategory?: "Cloud Provider" | "Data Center" | "Office Branch" | "Warehouse" | "Retail Store";
  proposalCount: number; // Count of proposals using this FID (0-3)
  usedInProposals: string[]; // Array of Requirement IDs where this FID is used
  // Current link configuration (for MDAC only)
  currentLinkId?: string;
  currentAddress?: string;
  currentBandwidth?: string;
  currentConnectionType?: string;
  currentPlan?: string;
  currentVAS?: string[];
}

interface ProposalItem {
  id: string;
  proposalId: string;
  createdOn: string;
  contractTerm: string;
  fids: string[];
  lastUpdatedOn: string;
  status: 
    | "Draft" 
    | "Proposal Generated" 
    | "Pending Finance Approval" 
    | "Pricing Approved" 
    | "Pricing Rejected" 
    | "Proposal Cancelled" 
    | "Auto-Expired" 
    | "Order Placed";
  orderId?: string;
  company: string;
  service: "MPLS" | "DIA" | "P2P - GCC" | "P2P - EVPL" | "P2P - EPL" | "P2P - DEPL";
  linkType?: "Hub & Spoke" | "Mesh";
  location?: string;
  cancellationReason?: string; // For Proposal Cancelled status
  orderProgress?: "not-started" | "billing-in-progress" | "po-pending" | "ready-to-generate"; // For dynamic CTA
}

interface OrderItem {
  id: string;
  proposalId: string;
  signedOn: string;
  noOfLinks: number;
  fids: string[];
  company: string;
  service: "MPLS" | "DIA" | "P2P - GCC" | "P2P - EVPL" | "P2P - EPL" | "P2P - DEPL";
  linkType?: "Hub & Spoke" | "Mesh";
}

interface InventoryItem {
  id: string;
  linkId: string;
  location: string;
  fullAddress: string;
  latitude: string;
  longitude: string;
  connectionType:
    | "Airtel"
    | "BSNL"
    | "TCL"
    | "Wireless"
    | "Fiber";
  bandwidth: string;
  expiresOn: string;
  company: string;
  linkType?: "Hub & Spoke" | "Mesh";
}

export function FeasibilityManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    (location.state as any)?.defaultTab || "feasibility-pool",
  );
  const [feasibilitySubTab, setFeasibilitySubTab] =
    useState("available");
  const [
    selectedFeasibilityItems,
    setSelectedFeasibilityItems,
  ] = useState<string[]>([]);
  const [fidEndAssignments, setFidEndAssignments] = useState<Record<string, 'A End' | 'B End'>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);
  const [itemToDelete, setItemToDelete] = useState<
    string | null
  >(null);
  
  // FID reuse confirmation dialog
  const [fidReuseDialogOpen, setFidReuseDialogOpen] = useState(false);
  const [reusedFids, setReusedFids] = useState<{fid: string, proposals: string[], count: number}[]>([]);
  const [pendingProposalAction, setPendingProposalAction] = useState<(() => void) | null>(null);

  // Filter and sort states
  const [feasibilityStatusFilter, setFeasibilityStatusFilter] =
    useState<string>("all");
  const [orderStatusFilter, setOrderStatusFilter] =
    useState<string>("all");
  const [linkTypeFilter, setLinkTypeFilter] =
    useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("fid");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    "asc",
  );
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedProductCategory, setSelectedProductCategory] = useState<'network' | 'datacenter' | 'cloud' | null>('cloud');

  // FID Details Modal state
  const [fidDetailsOpen, setFidDetailsOpen] = useState(false);
  const [selectedFidData, setSelectedFidData] =
    useState<FeasibilityItem | null>(null);

  // Re-push Feasibility dialog state
  const [repushDialogOpen, setRepushDialogOpen] = useState(false);
  const [repushAlertOpen, setRepushAlertOpen] = useState(false);
  const [selectedRepushFid, setSelectedRepushFid] = useState<FeasibilityItem | null>(null);

  // Cancel proposal dialog state
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedProposalToCancel, setSelectedProposalToCancel] = useState<ProposalItem | null>(null);

  // Get company from location state or use empty string
  const [selectedCompany, setSelectedCompany] = useState(location.state?.company || "");
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter modal states
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState<'feasibility' | 'requirements' | 'drafts'>('feasibility');
  
  // Feasibility Pool filters
  const [feasibilityFilters, setFeasibilityFilters] = useState({
    products: [] as string[],
    types: [] as string[],
    serviceChangeTypes: [] as string[],
    locations: [] as string[],
    connectionTypes: [] as string[],
    bandwidths: [] as string[],
    feasibilityStatuses: [] as string[],
  });

  // Filter search states
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [bandwidthSearchQuery, setBandwidthSearchQuery] = useState('');
  const [selectedOtherISPProvider, setSelectedOtherISPProvider] = useState<string[]>([]);

  // Requirements filters
  const [requirementsFilters, setRequirementsFilters] = useState({
    services: [] as string[],
    statuses: [] as string[],
    locations: [] as string[],
    contractTerms: [] as string[],
  });

  // Drafts filters
  const [draftsFilters, setDraftsFilters] = useState({
    submissionTypes: [] as string[],
    services: [] as string[],
  });

  // Mock Data
  const mockDrafts: DraftItem[] = [
    {
      id: "DRAFT-001",
      createdOn: "2025-01-15 10:30 AM",
      type: "Interactive",
      lastUpdatedOn: "2025-01-18 03:45 PM",
      connections: 5,
      company: "TechCorp Solutions",
      submissionType: "Manual",
      service: "MPLS",
      linkType: "Hub & Spoke",
    },
    {
      id: "DRAFT-002",
      createdOn: "2025-02-02 11:15 AM",
      type: "Quick Request",
      lastUpdatedOn: "2025-02-02 02:30 PM",
      connections: 2,
      company: "TechCorp Solutions",
      submissionType: "Bulk Upload",
      service: "DIA",
      linkType: "Mesh",
    },
    {
      id: "DRAFT-003",
      createdOn: "2025-01-20 02:15 PM",
      type: "Interactive",
      lastUpdatedOn: "2025-01-22 04:20 PM",
      connections: 3,
      company: "Global Enterprises",
      submissionType: "Manual",
      service: "MPLS",
      linkType: "Hub & Spoke",
    },
    {
      id: "DRAFT-004",
      createdOn: "2025-02-01 09:00 AM",
      type: "Interactive",
      lastUpdatedOn: "2025-02-03 11:20 AM",
      connections: 8,
      company: "CloudNext Pvt Ltd",
      submissionType: "Manual",
      service: "MPLS",
      linkType: "Mesh",
    },
    {
      id: "DRAFT-005",
      createdOn: "2025-01-28 03:45 PM",
      type: "Quick Request",
      lastUpdatedOn: "2025-01-28 04:15 PM",
      connections: 1,
      company: "DataFlow Systems",
      submissionType: "Bulk Upload",
      service: "DIA",
      linkType: "Hub & Spoke",
    },
  ];

  const mockFeasibilityPool: FeasibilityItem[] = [
    // TechCorp Solutions - MPLS - OPP-2025-001 (Multiple FIDs grouped)
    {
      id: "1",
      fid: "FID-2025-001",
      opportunityId: "OPP-2025-001",
      type: "New",
      product: "MPLS",
      location: "Mumbai, Maharashtra",
      fullAddress:
        "Bandra Kurla Complex, Mumbai, Maharashtra 400051",
      latitude: "19.0596",
      longitude: "72.8295",
      connectionType: "Wireless",
      bandwidth: "100 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-03-15",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "MPLS",
      linkType: "Hub & Spoke",
      proposalCount: 1,
      usedInProposals: ["NW000222"],
    },
    {
      id: "2",
      fid: "FID-2025-002",
      opportunityId: "OPP-2025-001",
      type: "New",
      product: "MPLS",
      location: "Pune, Maharashtra",
      fullAddress: "Andheri East, Mumbai, Maharashtra 400069",
      latitude: "19.1136",
      longitude: "72.8697",
      connectionType: "Fiber",
      bandwidth: "200 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-03-15",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "MPLS",
      linkType: "Hub & Spoke",
      proposalCount: 2,
      usedInProposals: ["NW000223", "NW000089"],
    },
    {
      id: "3",
      fid: "FID-2025-003",
      opportunityId: "OPP-2025-001",
      type: "New",
      product: "MPLS",
      location: "Navi Mumbai, Maharashtra",
      fullAddress: "Vashi, Navi Mumbai, Maharashtra 400703",
      latitude: "19.0768",
      longitude: "72.9978",
      connectionType: "Other ISP - Wireless - Airtel",
      bandwidth: "150 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-03-15",
      orderStatus: "Proposal Generated",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "MPLS",
      linkType: "Hub & Spoke",
    },
    // TechCorp Solutions - MPLS - OPP-2025-005 (Checking Feasibility)
    {
      id: "4",
      fid: "FID-2025-010",
      opportunityId: "OPP-2025-005",
      type: "New",
      product: "MPLS",
      location: "Thane, Maharashtra",
      fullAddress: "Ghodbunder Road, Thane, Maharashtra 400607",
      latitude: "19.2183",
      longitude: "72.9781",
      connectionType: "Fiber",
      bandwidth: "500 Mbps",
      feasibilityStatus: "Checking Feasibility",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "MPLS",
      linkType: "Mesh",
    },
    // TechCorp Solutions - DIA - OPP-2025-006 (Not Feasible)
    {
      id: "5",
      fid: "FID-2025-011",
      opportunityId: "OPP-2025-006",
      type: "New",
      product: "DIA",
      location: "Chennai, Tamil Nadu",
      fullAddress:
        "Guindy Industrial Estate, Chennai, Tamil Nadu 600032",
      latitude: "13.0067",
      longitude: "80.2206",
      connectionType: "Other ISP - Fiber - BSNL",
      bandwidth: "50 Mbps",
      feasibilityStatus: "Not Feasible",
      isSelectable: false,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "Hub & Spoke",
    },
    // TechCorp Solutions - DIA - OPP-2024-089 (Expired)
    {
      id: "6",
      fid: "FID-2024-095",
      opportunityId: "OPP-2024-089",
      type: "New",
      product: "DIA",
      location: "Kolkata, West Bengal",
      fullAddress: "Salt Lake, Kolkata, West Bengal 700091",
      latitude: "22.5726",
      longitude: "88.3639",
      connectionType: "Wireless",
      bandwidth: "30 Mbps",
      feasibilityStatus: "Expired",
      expiresOn: "2025-01-25",
      orderStatus: "Order Completed",
      isSelectable: false,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "Mesh",
    },
    // Global Enterprises - OPP-2025-002 (Multiple FIDs grouped)
    {
      id: "7",
      fid: "FID-2025-004",
      opportunityId: "OPP-2025-002",
      type: "New",
      product: "DIA",
      location: "Bangalore, Karnataka",
      fullAddress: "Whitefield, Bangalore, Karnataka 560066",
      latitude: "12.9698",
      longitude: "77.7500",
      connectionType: "Fiber",
      bandwidth: "1 Gbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-04-20",
      orderStatus: "Order Placed",
      isSelectable: true,
      nearingExpiry: false,
      company: "Global Enterprises",
      service: "DIA",
      linkType: "Mesh",
    },
    {
      id: "8",
      fid: "FID-2025-005",
      opportunityId: "OPP-2025-002",
      type: "New",
      product: "DIA",
      location: "Bangalore, Karnataka",
      fullAddress:
        "Electronic City, Bangalore, Karnataka 560100",
      latitude: "12.8456",
      longitude: "77.6603",
      connectionType: "Other ISP - Fiber - Airtel",
      bandwidth: "500 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-02-20",
      orderStatus: "Order Placed",
      isSelectable: true,
      nearingExpiry: true,
      company: "Global Enterprises",
      service: "DIA",
      linkType: "Mesh",
    },
    // Global Enterprises - OPP-2025-007 (Checking Feasibility)
    {
      id: "9",
      fid: "FID-2025-012",
      opportunityId: "OPP-2025-007",
      type: "New",
      product: "MPLS",
      location: "Hyderabad, Telangana",
      fullAddress: "HITEC City, Hyderabad, Telangana 500081",
      latitude: "17.4435",
      longitude: "78.3772",
      connectionType: "Fiber",
      bandwidth: "200 Mbps",
      feasibilityStatus: "Checking Feasibility",
      isSelectable: true,
      nearingExpiry: false,
      company: "Global Enterprises",
      service: "MPLS",
      linkType: "Hub & Spoke",
    },
    // CloudNext Pvt Ltd - OPP-2025-003 (Multiple FIDs grouped)
    {
      id: "10",
      fid: "FID-2025-006",
      opportunityId: "OPP-2025-003",
      type: "New",
      product: "MPLS",
      location: "Delhi, Delhi",
      fullAddress: "Connaught Place, New Delhi, Delhi 110001",
      latitude: "28.6304",
      longitude: "77.2177",
      connectionType: "Wireless",
      bandwidth: "100 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-03-30",
      orderStatus: "Proposal Generated",
      isSelectable: true,
      nearingExpiry: false,
      company: "CloudNext Pvt Ltd",
      service: "MPLS",
      linkType: "Hub & Spoke",
    },
    {
      id: "11",
      fid: "FID-2025-007",
      opportunityId: "OPP-2025-003",
      type: "New",
      product: "MPLS",
      location: "Gurugram, Haryana",
      fullAddress: "Cyber City, Gurugram, Haryana 122002",
      latitude: "28.4595",
      longitude: "77.0266",
      connectionType: "Fiber",
      bandwidth: "300 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-03-30",
      isSelectable: true,
      nearingExpiry: false,
      company: "CloudNext Pvt Ltd",
      service: "MPLS",
      linkType: "Hub & Spoke",
    },
    // TechCorp Solutions - DIA - OPP-2025-009 (Additional entry)
    {
      id: "13",
      fid: "FID-2025-015",
      opportunityId: "OPP-2025-009",
      type: "New",
      product: "DIA",
      location: "Indore, Madhya Pradesh",
      fullAddress: "Vijay Nagar, Indore, Madhya Pradesh 452010",
      latitude: "22.7532",
      longitude: "75.8937",
      connectionType: "Fiber",
      bandwidth: "300 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-04-10",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "Hub & Spoke",
    },
    {
      id: "14",
      fid: "FID-2025-019",
      opportunityId: "OPP-2025-009",
      type: "New",
      product: "DIA",
      location: "Bhopal, Madhya Pradesh",
      fullAddress: "MP Nagar, Bhopal, Madhya Pradesh 462011",
      latitude: "23.2599",
      longitude: "77.4126",
      connectionType: "Other ISP - Wireless - Airtel",
      bandwidth: "250 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-04-10",
      orderStatus: "Proposal Generated",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "Hub & Spoke",
    },
    // TechCorp Solutions - P2P - GCC - OPP-2025-020 (Cloud Provider End)
    {
      id: "100",
      fid: "FID-2025-100",
      opportunityId: "OPP-2025-020",
      type: "New",
      product: "P2P - GCC",
      location: "Mumbai - AWS",
      fullAddress: "AWS Mumbai Region, Connecting Node: Mumbai",
      latitude: "19.0760",
      longitude: "72.8777",
      connectionType: "Cloud Provider - AWS",
      bandwidth: "500 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-04-15",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "Hub & Spoke",
      locationCategory: "Cloud Provider",
    },
    // TechCorp Solutions - P2P - GCC - OPP-2025-020 (Data Center End)
    {
      id: "100a",
      fid: "FID-2025-116",
      opportunityId: "OPP-2025-020",
      type: "New",
      product: "P2P - GCC",
      location: "Mumbai Data Center",
      fullAddress: "Andheri Data Center, Mumbai, Maharashtra 400053",
      latitude: "19.1136",
      longitude: "72.8697",
      connectionType: "Fiber Optic",
      bandwidth: "500 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-04-15",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "Hub & Spoke",
      locationCategory: "Data Center",
    },
    // TechCorp Solutions - P2P - GCC - OPP-2025-021 (Cloud Provider End)
    {
      id: "101",
      fid: "FID-2025-101",
      opportunityId: "OPP-2025-021",
      type: "New",
      product: "P2P - GCC",
      location: "Bangalore - Azure",
      fullAddress: "Azure Bangalore Region, Connecting Node: Bangalore",
      latitude: "12.9716",
      longitude: "77.5946",
      connectionType: "Cloud Provider - Azure",
      bandwidth: "1 Gbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-04-20",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "Mesh",
      locationCategory: "Cloud Provider",
    },
    // TechCorp Solutions - P2P - GCC - OPP-2025-021 (Office Branch End)
    {
      id: "101a",
      fid: "FID-2025-117",
      opportunityId: "OPP-2025-021",
      type: "New",
      product: "P2P - GCC",
      location: "Bangalore Office",
      fullAddress: "Electronic City, Bangalore, Karnataka 560100",
      latitude: "12.8456",
      longitude: "77.6603",
      connectionType: "Fiber Optic",
      bandwidth: "1 Gbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-04-20",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "Mesh",
      locationCategory: "Office Branch",
    },
    // TechCorp Solutions - P2P - GCC - OPP-2025-022 (Cloud Provider End)
    {
      id: "102",
      fid: "FID-2025-102",
      opportunityId: "OPP-2025-022",
      type: "New",
      product: "P2P - GCC",
      location: "Delhi - GCP",
      fullAddress: "GCP Delhi Region, Connecting Node: Delhi",
      latitude: "28.7041",
      longitude: "77.1025",
      connectionType: "Cloud Provider - GCP",
      bandwidth: "750 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-04-25",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "Hub & Spoke",
      locationCategory: "Cloud Provider",
    },
    // TechCorp Solutions - P2P - GCC - OPP-2025-022 (Data Center End)
    {
      id: "102a",
      fid: "FID-2025-118",
      opportunityId: "OPP-2025-022",
      type: "New",
      product: "P2P - GCC",
      location: "Delhi Data Center",
      fullAddress: "Noida Sector 62 Data Center, Delhi NCR, UP 201309",
      latitude: "28.6139",
      longitude: "77.3910",
      connectionType: "Fiber Optic",
      bandwidth: "750 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-04-25",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "Hub & Spoke",
      locationCategory: "Data Center",
    },
    // TechCorp Solutions - P2P - GCC - OPP-2025-037 (Cloud Provider End)
    {
      id: "102b",
      fid: "FID-2025-119",
      opportunityId: "OPP-2025-037",
      type: "New",
      product: "P2P - GCC",
      location: "Hyderabad - AWS",
      fullAddress: "AWS Hyderabad Region, Connecting Node: Hyderabad",
      latitude: "17.3850",
      longitude: "78.4867",
      connectionType: "Cloud Provider - AWS",
      bandwidth: "2 Gbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-04-28",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "Hub & Spoke",
      locationCategory: "Cloud Provider",
    },
    // TechCorp Solutions - P2P - GCC - OPP-2025-037 (Office Branch End)
    {
      id: "102c",
      fid: "FID-2025-120",
      opportunityId: "OPP-2025-037",
      type: "New",
      product: "P2P - GCC",
      location: "Hyderabad Office",
      fullAddress: "HITEC City, Hyderabad, Telangana 500081",
      latitude: "17.4435",
      longitude: "78.3772",
      connectionType: "Fiber Optic",
      bandwidth: "2 Gbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-04-28",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "Hub & Spoke",
      locationCategory: "Office Branch",
    },
    // TechCorp Solutions - P2P - GCC - OPP-2025-055 (NW00055 - Multi-Location Cloud Connectivity)
    // FID 1: Bangalore Office - Non-Cloud
    {
      id: "102d",
      fid: "FID-2025-150",
      opportunityId: "OPP-2025-055",
      type: "New",
      product: "P2P - GCC",
      location: "Bangalore Office",
      fullAddress: "Electronic City, Bangalore, Karnataka 560100",
      latitude: "12.8456",
      longitude: "77.6603",
      connectionType: "Fiber Optic",
      bandwidth: "1 Gbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-04-30",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "Mesh",
      locationCategory: "Office Branch",
    },
    // FID 2: AWS Chennai - Cloud Provider
    {
      id: "102e",
      fid: "FID-2025-151",
      opportunityId: "OPP-2025-055",
      type: "New",
      product: "P2P - GCC",
      location: "Chennai - AWS",
      fullAddress: "AWS Chennai Region, Connecting Node: Chennai",
      latitude: "13.0827",
      longitude: "80.2707",
      connectionType: "Cloud Provider - AWS",
      bandwidth: "1 Gbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-04-30",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "Mesh",
      locationCategory: "Cloud Provider",
    },
    // FID 3: Hyderabad Data Center - Non-Cloud
    {
      id: "102f",
      fid: "FID-2025-152",
      opportunityId: "OPP-2025-055",
      type: "New",
      product: "P2P - GCC",
      location: "Hyderabad Data Center",
      fullAddress: "HITEC City Data Center, Hyderabad, Telangana 500081",
      latitude: "17.4435",
      longitude: "78.3772",
      connectionType: "Fiber Optic",
      bandwidth: "1 Gbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-04-30",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "Mesh",
      locationCategory: "Data Center",
    },
    // FID 4: Azure Kochi - Cloud Provider
    {
      id: "102g",
      fid: "FID-2025-153",
      opportunityId: "OPP-2025-055",
      type: "New",
      product: "P2P - GCC",
      location: "Kochi - Azure",
      fullAddress: "Azure Kochi Region, Connecting Node: Kochi",
      latitude: "9.9312",
      longitude: "76.2673",
      connectionType: "Cloud Provider - Azure",
      bandwidth: "500 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-04-30",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "Hub & Spoke",
      locationCategory: "Cloud Provider",
    },
    // TechCorp Solutions - P2P - EVPL - OPP-2025-025
    {
      id: "103",
      fid: "FID-2025-103",
      opportunityId: "OPP-2025-025",
      type: "New",
      product: "P2P - EVPL",
      location: "Pune - Chennai",
      fullAddress: "Point-to-Point EVPL Connection, Pune IT Park to Chennai DC",
      latitude: "18.5204",
      longitude: "73.8567",
      connectionType: "Ethernet Virtual Private Line",
      bandwidth: "200 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-03-30",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "Mesh",
    },
    // TechCorp Solutions - P2P - EVPL - OPP-2025-026
    {
      id: "104",
      fid: "FID-2025-104",
      opportunityId: "OPP-2025-026",
      type: "New",
      product: "P2P - EVPL",
      location: "Mumbai - Delhi",
      fullAddress: "Point-to-Point EVPL Connection, Mumbai DC to Delhi DC",
      latitude: "19.0760",
      longitude: "72.8777",
      connectionType: "Ethernet Virtual Private Line",
      bandwidth: "500 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-04-05",
      orderStatus: "Proposal Generated",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "Hub & Spoke",
    },
    // TechCorp Solutions - P2P - EVPL - OPP-2025-027
    {
      id: "105",
      fid: "FID-2025-105",
      opportunityId: "OPP-2025-027",
      type: "New",
      product: "P2P - EVPL",
      location: "Bangalore - Hyderabad",
      fullAddress: "Point-to-Point EVPL Connection, Bangalore Tech Park to Hyderabad DC",
      latitude: "12.9716",
      longitude: "77.5946",
      connectionType: "Ethernet Virtual Private Line",
      bandwidth: "1 Gbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-04-12",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "Mesh",
    },
    // TechCorp Solutions - P2P - EPL - OPP-2025-030
    {
      id: "106",
      fid: "FID-2025-106",
      opportunityId: "OPP-2025-030",
      type: "New",
      product: "P2P - EPL",
      location: "Chennai - Coimbatore",
      fullAddress: "Point-to-Point EPL Connection, Chennai DC to Coimbatore Branch",
      latitude: "13.0827",
      longitude: "80.2707",
      connectionType: "Ethernet Private Line",
      bandwidth: "100 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-03-28",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "Hub & Spoke",
    },
    // TechCorp Solutions - P2P - EPL - OPP-2025-031
    {
      id: "107",
      fid: "FID-2025-107",
      opportunityId: "OPP-2025-031",
      type: "New",
      product: "P2P - EPL",
      location: "Kolkata - Guwahati",
      fullAddress: "Point-to-Point EPL Connection, Kolkata Office to Guwahati Branch",
      latitude: "22.5726",
      longitude: "88.3639",
      connectionType: "Ethernet Private Line",
      bandwidth: "200 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-04-08",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "Hub & Spoke",
    },
    // TechCorp Solutions - P2P - EPL - OPP-2025-032
    {
      id: "107a",
      fid: "FID-2025-113",
      opportunityId: "OPP-2025-032",
      type: "New",
      product: "P2P - EPL",
      location: "Bangalore - Mysore",
      fullAddress: "Point-to-Point EPL Connection, Bangalore Office to Mysore Branch",
      latitude: "12.9716",
      longitude: "77.5946",
      connectionType: "Ethernet Private Line",
      bandwidth: "500 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-04-15",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "Hub & Spoke",
    },
    // TechCorp Solutions - P2P - EPL - OPP-2025-033
    {
      id: "107b",
      fid: "FID-2025-114",
      opportunityId: "OPP-2025-033",
      type: "New",
      product: "P2P - EPL",
      location: "Hyderabad - Warangal",
      fullAddress: "Point-to-Point EPL Connection, Hyderabad DC to Warangal Branch",
      latitude: "17.3850",
      longitude: "78.4867",
      connectionType: "Ethernet Private Line",
      bandwidth: "300 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-04-20",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "Mesh",
    },
    // TechCorp Solutions - P2P - EPL - OPP-2025-034
    {
      id: "107c",
      fid: "FID-2025-115",
      opportunityId: "OPP-2025-034",
      type: "New",
      product: "P2P - EPL",
      location: "Ahmedabad - Surat",
      fullAddress: "Point-to-Point EPL Connection, Ahmedabad Office to Surat Branch",
      latitude: "23.0225",
      longitude: "72.5714",
      connectionType: "Ethernet Private Line",
      bandwidth: "250 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-04-10",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "Hub & Spoke",
    },
    // TechCorp Solutions - P2P - DEPL - OPP-2025-035
    {
      id: "108",
      fid: "FID-2025-108",
      opportunityId: "OPP-2025-035",
      type: "New",
      product: "P2P - DEPL",
      location: "Jaipur - Ahmedabad",
      fullAddress: "Point-to-Point DEPL Connection, Jaipur Office to Ahmedabad Branch",
      latitude: "26.9124",
      longitude: "75.7873",
      connectionType: "Dark Fiber Ethernet Private Line",
      bandwidth: "10 Gbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-04-18",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "Mesh",
    },
    // TechCorp Solutions - P2P - DEPL - OPP-2025-036
    {
      id: "109",
      fid: "FID-2025-109",
      opportunityId: "OPP-2025-036",
      type: "New",
      product: "P2P - DEPL",
      location: "Indore - Bhopal",
      fullAddress: "Point-to-Point DEPL Connection, Indore DC to Bhopal Office",
      latitude: "22.7196",
      longitude: "75.8577",
      connectionType: "Dark Fiber Ethernet Private Line",
      bandwidth: "10 Gbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-04-22",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "Mesh",
    },
    // TechCorp Solutions - MDAC FIDs
    {
      id: "SC1",
      fid: "FID-2025-SC001",
      opportunityId: "OPP-2025-001",
      type: "MDAC",
      serviceChangeType: "Address Change",
      product: "DIA",
      location: "Mumbai, Maharashtra",
      fullAddress: "Bandra Kurla Complex, Mumbai, Maharashtra 400051",
      latitude: "19.0596",
      longitude: "72.8295",
      connectionType: "Fiber",
      bandwidth: "500 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-05-10",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "P2P",
      proposalCount: 0,
      usedInProposals: [],
      currentLinkId: "LINK-2024-001",
      currentAddress: "Andheri East, Mumbai, Maharashtra 400069",
      currentBandwidth: "500 Mbps",
      currentConnectionType: "Wireless",
      currentPlan: "Premium",
      currentVAS: ["Static IPv4/29", "DDoS Protection 5 Gbps"],
    },
    {
      id: "SC2",
      fid: "FID-2025-SC002",
      opportunityId: "OPP-2025-002",
      type: "MDAC",
      serviceChangeType: "LM Change",
      product: "DIA",
      location: "Delhi, NCR",
      fullAddress: "Connaught Place, Delhi 110001",
      latitude: "28.6328",
      longitude: "77.2197",
      connectionType: "Wireless",
      bandwidth: "250 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-05-12",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "P2P",
      proposalCount: 0,
      usedInProposals: [],
      currentLinkId: "LINK-2024-002",
      currentAddress: "Karol Bagh, Delhi 110005",
      currentBandwidth: "250 Mbps",
      currentConnectionType: "Wireless",
      currentPlan: "Standard",
      currentVAS: ["Static IPv4/29"],
    },
    {
      id: "SC3",
      fid: "FID-2025-SC003",
      opportunityId: "OPP-2025-003",
      type: "MDAC",
      serviceChangeType: "Bandwidth Change",
      product: "DIA",
      location: "Pune, Maharashtra",
      fullAddress: "Viman Nagar, Pune, Maharashtra 411014",
      latitude: "18.5679",
      longitude: "73.9143",
      connectionType: "Fiber",
      bandwidth: "1 Gbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-05-15",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "P2P",
      proposalCount: 0,
      usedInProposals: [],
      currentLinkId: "LINK-2024-003",
      currentAddress: "Viman Nagar, Pune, Maharashtra 411014",
      currentBandwidth: "1 Gbps",
      currentConnectionType: "Fiber",
      currentPlan: "Premium",
      currentVAS: ["Static IPv4/29", "Catalyst 9300 Series"],
    },
    {
      id: "SC4",
      fid: "FID-2025-SC004",
      opportunityId: "OPP-2025-001",
      type: "MDAC",
      serviceChangeType: "Add Secondary/Tertiary Link",
      product: "DIA",
      location: "Pune, Maharashtra",
      fullAddress: "Baner, Pune, Maharashtra 411045",
      latitude: "18.5590",
      longitude: "73.7784",
      connectionType: "Fiber",
      bandwidth: "500 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-05-18",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "P2P",
      proposalCount: 0,
      usedInProposals: [],
      currentLinkId: "LINK-2024-004",
      currentAddress: "Kothrud, Pune, Maharashtra 411038",
      currentBandwidth: "250 Mbps",
      currentConnectionType: "Wireless",
      currentPlan: "Standard",
      currentVAS: ["Static IPv4/32"],
    },
    {
      id: "SC5",
      fid: "FID-2025-SC005",
      opportunityId: "OPP-2025-005",
      type: "MDAC",
      serviceChangeType: "Address Change",
      product: "MPLS",
      location: "Hyderabad, Telangana",
      fullAddress: "HITEC City, Hyderabad, Telangana 500081",
      latitude: "17.4435",
      longitude: "78.3772",
      connectionType: "Fiber",
      bandwidth: "200 Mbps",
      feasibilityStatus: "Checking Feasibility",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "MPLS",
      linkType: "Hub & Spoke",
      proposalCount: 0,
      usedInProposals: [],
      currentLinkId: "LINK-2024-005",
      currentAddress: "HITEC City, Hyderabad, Telangana 500081",
      currentBandwidth: "200 Mbps",
      currentConnectionType: "Wireless",
      currentPlan: "Standard",
      currentVAS: ["QoS - Bronze"],
    },
    {
      id: "SC6",
      fid: "FID-2025-SC006",
      opportunityId: "OPP-2025-006",
      type: "MDAC",
      serviceChangeType: "LM Change",
      product: "DIA",
      location: "Chennai, Tamil Nadu",
      fullAddress: "OMR Road, Chennai, Tamil Nadu 600096",
      latitude: "12.9141",
      longitude: "80.2265",
      connectionType: "Fiber",
      bandwidth: "750 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-05-20",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "P2P",
      proposalCount: 0,
      usedInProposals: [],
      currentLinkId: "LINK-2024-006",
      currentAddress: "Perungudi, Chennai, Tamil Nadu 600096",
      currentBandwidth: "750 Mbps",
      currentConnectionType: "Wireless",
      currentPlan: "Premium",
      currentVAS: ["Static IPv4/29", "DDoS Protection 10 Gbps"],
    },
    {
      id: "SC7",
      fid: "FID-2025-SC007",
      opportunityId: "OPP-2025-007",
      type: "MDAC",
      serviceChangeType: "Bandwidth Change",
      product: "DIA",
      location: "Bangalore, Karnataka",
      fullAddress: "Electronic City, Bangalore, Karnataka 560100",
      latitude: "12.8456",
      longitude: "77.6603",
      connectionType: "Fiber",
      bandwidth: "2 Gbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-05-22",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "Mesh",
      proposalCount: 0,
      usedInProposals: [],
      currentLinkId: "LINK-2024-007",
      currentAddress: "Electronic City, Bangalore, Karnataka 560100",
      currentBandwidth: "2 Gbps",
      currentConnectionType: "Fiber",
      currentPlan: "Enterprise",
      currentVAS: ["Static IPv4/28", "Catalyst 9400 Series", "DDoS Protection 20 Gbps"],
    },
    {
      id: "SC8",
      fid: "FID-2025-SC008",
      opportunityId: "OPP-2025-008",
      type: "MDAC",
      serviceChangeType: "Add Secondary/Tertiary Link",
      product: "MPLS",
      location: "Kolkata, West Bengal",
      fullAddress: "Salt Lake, Kolkata, West Bengal 700091",
      latitude: "22.5744",
      longitude: "88.4337",
      connectionType: "Fiber",
      bandwidth: "300 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-05-25",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "MPLS",
      linkType: "Mesh",
      proposalCount: 0,
      usedInProposals: [],
      currentLinkId: "LINK-2024-008",
      currentAddress: "Salt Lake, Kolkata, West Bengal 700091",
      currentBandwidth: "150 Mbps",
      currentConnectionType: "Wireless",
      currentPlan: "Standard",
      currentVAS: ["QoS - Gold"],
    },
    // Global Enterprises - OPP-2025-010 (Additional entries)
    {
      id: "15",
      fid: "FID-2025-017",
      opportunityId: "OPP-2025-010",
      type: "New",
      product: "DIA",
      location: "Pune, Maharashtra",
      fullAddress:
        "Hinjewadi IT Park, Pune, Maharashtra 411057",
      latitude: "18.5916",
      longitude: "73.7389",
      connectionType: "Fiber",
      bandwidth: "2 Gbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-03-25",
      isSelectable: true,
      nearingExpiry: false,
      company: "Global Enterprises",
      service: "DIA",
      linkType: "Mesh",
    },
    {
      id: "16",
      fid: "FID-2025-018",
      opportunityId: "OPP-2025-011",
      type: "New",
      product: "MPLS",
      location: "Noida, Uttar Pradesh",
      fullAddress: "Sector 62, Noida, Uttar Pradesh 201301",
      latitude: "28.6260",
      longitude: "77.3700",
      connectionType: "Wireless",
      bandwidth: "100 Mbps",
      feasibilityStatus: "Not Feasible",
      isSelectable: false,
      nearingExpiry: false,
      company: "Global Enterprises",
      service: "MPLS",
      linkType: "Hub & Spoke",
    },
    // Global Enterprises - OPP-2025-016 (More entries)
    {
      id: "23",
      fid: "FID-2025-023",
      opportunityId: "OPP-2025-016",
      type: "New",
      product: "DIA",
      location: "Chennai, Tamil Nadu",
      fullAddress: "OMR Road, Chennai, Tamil Nadu 600096",
      latitude: "12.9141",
      longitude: "80.2274",
      connectionType: "Fiber",
      bandwidth: "750 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-04-05",
      isSelectable: true,
      nearingExpiry: false,
      company: "Global Enterprises",
      service: "DIA",
      linkType: "Mesh",
    },
    {
      id: "24",
      fid: "FID-2025-024",
      opportunityId: "OPP-2025-016",
      type: "New",
      product: "DIA",
      location: "Coimbatore, Tamil Nadu",
      fullAddress:
        "Avinashi Road, Coimbatore, Tamil Nadu 641018",
      latitude: "11.0168",
      longitude: "76.9558",
      connectionType: "Other ISP - Fiber - Airtel",
      bandwidth: "500 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-04-05",
      orderStatus: "Proposal Generated",
      isSelectable: true,
      nearingExpiry: false,
      company: "Global Enterprises",
      service: "DIA",
      linkType: "Mesh",
    },
    {
      id: "25",
      fid: "FID-2025-025",
      opportunityId: "OPP-2025-017",
      type: "New",
      product: "MPLS",
      location: "Mysore, Karnataka",
      fullAddress: "Infosys Campus, Mysore, Karnataka 570008",
      latitude: "12.2958",
      longitude: "76.6394",
      connectionType: "Fiber",
      bandwidth: "1 Gbps",
      feasibilityStatus: "Checking Feasibility",
      isSelectable: true,
      nearingExpiry: false,
      company: "Global Enterprises",
      service: "MPLS",
      linkType: "Hub & Spoke",
    },
    {
      id: "26",
      fid: "FID-2025-026",
      opportunityId: "OPP-2025-018",
      type: "New",
      product: "MPLS",
      location: "Visakhapatnam, Andhra Pradesh",
      fullAddress:
        "IT SEZ, Visakhapatnam, Andhra Pradesh 530045",
      latitude: "17.6868",
      longitude: "83.2185",
      connectionType: "Other ISP - Wireless - BSNL",
      bandwidth: "200 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-03-12",
      isSelectable: true,
      nearingExpiry: false,
      company: "Global Enterprises",
      service: "MPLS",
      linkType: "Hub & Spoke",
    },
    {
      id: "27",
      fid: "FID-2025-027",
      opportunityId: "OPP-2025-019",
      type: "New",
      product: "DIA",
      location: "Kochi, Kerala",
      fullAddress: "SmartCity, Kochi, Kerala 682024",
      latitude: "9.9312",
      longitude: "76.2673",
      connectionType: "Wireless",
      bandwidth: "150 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-02-25",
      orderStatus: "Order Placed",
      isSelectable: true,
      nearingExpiry: true,
      company: "Global Enterprises",
      service: "DIA",
      linkType: "Mesh",
    },
    {
      id: "28",
      fid: "FID-2025-028",
      opportunityId: "OPP-2024-092",
      type: "New",
      product: "MPLS",
      location: "Nagpur, Maharashtra",
      fullAddress: "MIHAN SEZ, Nagpur, Maharashtra 441108",
      latitude: "21.1458",
      longitude: "79.0882",
      connectionType: "Fiber",
      bandwidth: "300 Mbps",
      feasibilityStatus: "Expired",
      expiresOn: "2025-01-30",
      isSelectable: false,
      nearingExpiry: false,
      company: "Global Enterprises",
      service: "MPLS",
      linkType: "Hub & Spoke",
    },
    // CloudNext Pvt Ltd - OPP-2025-012 (Additional entries)
    {
      id: "17",
      fid: "FID-2025-019",
      opportunityId: "OPP-2025-012",
      type: "New",
      product: "MPLS",
      location: "Chandigarh, Punjab",
      fullAddress: "IT Park, Chandigarh, Punjab 160101",
      latitude: "30.7333",
      longitude: "76.7794",
      connectionType: "Other ISP - Wireless - Airtel",
      bandwidth: "500 Mbps",
      feasibilityStatus: "Checking Feasibility",
      isSelectable: true,
      nearingExpiry: false,
      company: "CloudNext Pvt Ltd",
      service: "MPLS",
      linkType: "Mesh",
    },
    {
      id: "18",
      fid: "FID-2025-020",
      opportunityId: "OPP-2025-013",
      type: "New",
      product: "DIA",
      location: "Jaipur, Rajasthan",
      fullAddress: "Malviya Nagar, Jaipur, Rajasthan 302017",
      latitude: "26.8514",
      longitude: "75.8103",
      connectionType: "Fiber",
      bandwidth: "150 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-02-28",
      isSelectable: true,
      nearingExpiry: true,
      company: "CloudNext Pvt Ltd",
      service: "DIA",
      linkType: "Hub & Spoke",
    },
    {
      id: "19",
      fid: "FID-2025-021",
      opportunityId: "OPP-2025-014",
      type: "New",
      product: "MPLS",
      location: "Kochi, Kerala",
      fullAddress: "Infopark, Kochi, Kerala 682030",
      latitude: "10.0266",
      longitude: "76.3153",
      connectionType: "Wireless",
      bandwidth: "200 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-04-15",
      orderStatus: "Proposal Generated",
      isSelectable: true,
      nearingExpiry: false,
      company: "CloudNext Pvt Ltd",
      service: "MPLS",
      linkType: "Mesh",
    },
    // DataFlow Systems - OPP-2025-004 (Expired)
    {
      id: "12",
      fid: "FID-2025-008",
      opportunityId: "OPP-2025-004",
      type: "New",
      product: "DIA",
      location: "Ahmedabad, Gujarat",
      fullAddress: "SG Highway, Ahmedabad, Gujarat 380015",
      latitude: "23.0225",
      longitude: "72.5714",
      connectionType: "Other ISP - Fiber - TCL",
      bandwidth: "250 Mbps",
      feasibilityStatus: "Expired",
      expiresOn: "2025-01-20",
      orderStatus: "Order Completed",
      isSelectable: false,
      nearingExpiry: false,
      company: "DataFlow Systems",
      service: "DIA",
      linkType: "Mesh",
    },
    // DataFlow Systems - OPP-2025-008 (Additional entries)
    {
      id: "20",
      fid: "FID-2025-013",
      opportunityId: "OPP-2025-008",
      type: "New",
      product: "DIA",
      location: "Surat, Gujarat",
      fullAddress: "Adajan, Surat, Gujarat 395009",
      latitude: "21.1959",
      longitude: "72.8302",
      connectionType: "Fiber",
      bandwidth: "500 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-03-18",
      orderStatus: "Order Placed",
      isSelectable: true,
      nearingExpiry: false,
      company: "DataFlow Systems",
      service: "DIA",
      linkType: "Hub & Spoke",
    },
    {
      id: "21",
      fid: "FID-2025-014",
      opportunityId: "OPP-2025-008",
      type: "New",
      product: "DIA",
      location: "Rajkot, Gujarat",
      fullAddress: "Kalawad Road, Rajkot, Gujarat 360005",
      latitude: "22.3039",
      longitude: "70.8022",
      connectionType: "Other ISP - Wireless - BSNL",
      bandwidth: "100 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-03-18",
      isSelectable: true,
      nearingExpiry: false,
      company: "DataFlow Systems",
      service: "DIA",
      linkType: "Hub & Spoke",
    },
    {
      id: "22",
      fid: "FID-2025-022",
      opportunityId: "OPP-2025-015",
      type: "New",
      product: "MPLS",
      location: "Vadodara, Gujarat",
      fullAddress: "Alkapuri, Vadodara, Gujarat 390007",
      latitude: "22.3072",
      longitude: "73.1812",
      connectionType: "Wireless",
      bandwidth: "75 Mbps",
      feasibilityStatus: "Checking Feasibility",
      isSelectable: true,
      nearingExpiry: false,
      company: "DataFlow Systems",
      service: "MPLS",
      linkType: "Mesh",
    },
    // DataFlow Systems - OPP-2025-020 (More entries)
    {
      id: "29",
      fid: "FID-2025-029",
      opportunityId: "OPP-2025-020",
      type: "New",
      product: "DIA",
      location: "Nashik, Maharashtra",
      fullAddress: "Ambad MIDC, Nashik, Maharashtra 422010",
      latitude: "19.9975",
      longitude: "73.7898",
      connectionType: "Fiber",
      bandwidth: "600 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-04-08",
      isSelectable: true,
      nearingExpiry: false,
      company: "DataFlow Systems",
      service: "DIA",
      linkType: "Mesh",
    },
    {
      id: "30",
      fid: "FID-2025-030",
      opportunityId: "OPP-2025-020",
      type: "New",
      product: "MPLS",
      location: "Aurangabad, Maharashtra",
      fullAddress:
        "Chikalthana MIDC, Aurangabad, Maharashtra 431210",
      latitude: "19.8762",
      longitude: "75.3433",
      connectionType: "Other ISP - Fiber - Airtel",
      bandwidth: "300 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-04-08",
      orderStatus: "Proposal Generated",
      isSelectable: true,
      nearingExpiry: false,
      company: "DataFlow Systems",
      service: "MPLS",
      linkType: "Mesh",
    },
    {
      id: "31",
      fid: "FID-2025-031",
      opportunityId: "OPP-2025-021",
      type: "New",
      product: "DIA",
      location: "Lucknow, Uttar Pradesh",
      fullAddress: "Gomti Nagar, Lucknow, Uttar Pradesh 226010",
      latitude: "26.8467",
      longitude: "80.9462",
      connectionType: "Fiber",
      bandwidth: "250 Mbps",
      feasibilityStatus: "Checking Feasibility",
      isSelectable: true,
      nearingExpiry: false,
      company: "DataFlow Systems",
      service: "DIA",
      linkType: "Hub & Spoke",
    },
    {
      id: "32",
      fid: "FID-2025-032",
      opportunityId: "OPP-2025-022",
      type: "New",
      product: "MPLS",
      location: "Kanpur, Uttar Pradesh",
      fullAddress: "Kakadeo, Kanpur, Uttar Pradesh 208025",
      latitude: "26.4499",
      longitude: "80.3319",
      connectionType: "Wireless",
      bandwidth: "150 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-03-02",
      isSelectable: true,
      nearingExpiry: true,
      company: "DataFlow Systems",
      service: "MPLS",
      linkType: "Hub & Spoke",
    },
    {
      id: "33",
      fid: "FID-2025-033",
      opportunityId: "OPP-2025-023",
      type: "New",
      product: "DIA",
      location: "Patna, Bihar",
      fullAddress: "Boring Road, Patna, Bihar 800001",
      latitude: "25.5941",
      longitude: "85.1376",
      connectionType: "Other ISP - Wireless - BSNL",
      bandwidth: "100 Mbps",
      feasibilityStatus: "Not Feasible",
      isSelectable: false,
      nearingExpiry: false,
      company: "DataFlow Systems",
      service: "DIA",
      linkType: "Hub & Spoke",
    },
    {
      id: "34",
      fid: "FID-2025-034",
      opportunityId: "OPP-2025-024",
      type: "New",
      location: "Bhubaneswar, Odisha",
      fullAddress: "Infocity, Bhubaneswar, Odisha 751024",
      latitude: "20.2961",
      longitude: "85.8245",
      connectionType: "Fiber",
      bandwidth: "800 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-04-12",
      orderStatus: "Order Placed",
      isSelectable: true,
      nearingExpiry: false,
      company: "DataFlow Systems",
      service: "DIA",
      linkType: "Mesh",
    },
    {
      id: "35",
      fid: "FID-2024-088",
      opportunityId: "OPP-2024-085",
      type: "New",
      product: "MPLS",
      location: "Raipur, Chhattisgarh",
      fullAddress:
        "Devendra Nagar, Raipur, Chhattisgarh 492001",
      latitude: "21.2514",
      longitude: "81.6296",
      connectionType: "Other ISP - Fiber - TCL",
      bandwidth: "50 Mbps",
      feasibilityStatus: "Expired",
      expiresOn: "2025-01-28",
      orderStatus: "Order Completed",
      isSelectable: false,
      nearingExpiry: false,
      company: "DataFlow Systems",
      service: "MPLS",
      linkType: "Hub & Spoke",
    },
    {
      id: "36",
      fid: "FID-2025-036",
      opportunityId: "OPP-2025-025",
      type: "New",
      product: "DIA",
      location: "Indore, Madhya Pradesh",
      fullAddress: "Vijay Nagar, Indore, Madhya Pradesh 452010",
      latitude: "22.7532",
      longitude: "75.8937",
      connectionType: "Fiber",
      bandwidth: "500 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-04-20",
      orderStatus: "Order Placed",
      isSelectable: true,
      nearingExpiry: false,
      company: "DataFlow Systems",
      service: "DIA",
      linkType: "Hub & Spoke",
    },
    
    // DEMO: Same FID with multiple LM types (New Logic)
    // FID-2025-016 has 3 LM types - TechCorp Solutions
    {
      id: "demo-1",
      fid: "FID-2025-016",
      opportunityId: "OPP-2025-001",
      type: "New",
      product: "DIA",
      location: "Navi Mumbai, Vashi",
      fullAddress: "Vashi Tech Park, Tower B, Floor 5, Navi Mumbai, Maharashtra 400703",
      latitude: "19.0688",
      longitude: "72.9989",
      connectionType: "Fiber",
      bandwidth: "100 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-03-20",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "DIA",
    },
    {
      id: "demo-2",
      fid: "FID-2025-016",
      opportunityId: "OPP-2025-001",
      type: "New",
      product: "DIA",
      location: "Navi Mumbai, Vashi",
      fullAddress: "Vashi Tech Park, Tower B, Floor 5, Navi Mumbai, Maharashtra 400703",
      latitude: "19.0688",
      longitude: "72.9989",
      connectionType: "Wireless",
      bandwidth: "100 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-03-20",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "DIA",
    },
    {
      id: "demo-3",
      fid: "FID-2025-016",
      opportunityId: "OPP-2025-001",
      type: "New",
      product: "DIA",
      location: "Navi Mumbai, Vashi",
      fullAddress: "Vashi Tech Park, Tower B, Floor 5, Navi Mumbai, Maharashtra 400703",
      latitude: "19.0688",
      longitude: "72.9989",
      connectionType: "Other ISP - Wireless - Airtel",
      bandwidth: "100 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-03-20",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "DIA",
      proposalCount: 0,
      usedInProposals: [],
    },
    {
      id: "demo-4",
      fid: "FID-2025-017",
      opportunityId: "OPP-2025-001",
      type: "New",
      product: "MPLS",
      location: "Chennai, OMR",
      fullAddress: "OMR Tech Park, Building A, Floor 3, Chennai, Tamil Nadu 600096",
      latitude: "12.9121",
      longitude: "80.2275",
      connectionType: "Fiber",
      bandwidth: "500 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-03-22",
      orderStatus: "Proposal Generated",
      isSelectable: false,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "MPLS",
      linkType: "Mesh",
      proposalCount: 0,
      usedInProposals: [],
    },
    {
      id: "demo-5",
      fid: "FID-2025-017",
      opportunityId: "OPP-2025-001",
      type: "New",
      product: "MPLS",
      location: "Chennai, OMR",
      fullAddress: "OMR Tech Park, Building A, Floor 3, Chennai, Tamil Nadu 600096",
      latitude: "12.9121",
      longitude: "80.2275",
      connectionType: "Wireless",
      bandwidth: "500 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-03-22",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "MPLS",
      linkType: "Mesh",
      proposalCount: 0,
      usedInProposals: [],
    },
    {
      id: "demo-6",
      fid: "FID-2025-018",
      opportunityId: "OPP-2025-001",
      type: "New",
      product: "DIA",
      location: "Pune, Hinjewadi",
      fullAddress: "Hinjewadi IT Park, Phase 2, Building D, Pune, Maharashtra 411057",
      latitude: "18.5912",
      longitude: "73.7389",
      connectionType: "Fiber",
      bandwidth: "200 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-03-25",
      orderStatus: "Proposal Generated",
      isSelectable: false,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "DIA",
      proposalCount: 0,
      usedInProposals: [],
    },
    {
      id: "demo-7",
      fid: "FID-2025-018",
      opportunityId: "OPP-2025-001",
      type: "New",
      product: "DIA",
      location: "Pune, Hinjewadi",
      fullAddress: "Hinjewadi IT Park, Phase 2, Building D, Pune, Maharashtra 411057",
      latitude: "18.5912",
      longitude: "73.7389",
      connectionType: "Other ISP - Fiber - Jio",
      bandwidth: "200 Mbps",
      feasibilityStatus: "Feasible",
      expiresOn: "2025-03-25",
      isSelectable: true,
      nearingExpiry: false,
      company: "TechCorp Solutions",
      service: "DIA",
      proposalCount: 0,
      usedInProposals: [],
    },
  ].map(item => ({
    ...item,
    proposalCount: item.proposalCount ?? 0,
    usedInProposals: item.usedInProposals ?? []
  }));

  const mockProposals: ProposalItem[] = [
    // TechCorp Solutions - with new statuses
    {
      id: "1",
      proposalId: "NW000222",
      createdOn: "2025-01-10",
      contractTerm: "36 months",
      fids: ["FID-2025-001", "FID-2025-002", "FID-2025-003"],
      lastUpdatedOn: "2025-01-28",
      status: "Order Placed",
      orderId: "ORD-2025-001",
      company: "TechCorp Solutions",
      service: "MPLS",
      linkType: "Hub & Spoke",
      location: "Mumbai, Bangalore, Delhi",
    },
    {
      id: "1a",
      proposalId: "NW000220",
      createdOn: "2025-02-10",
      contractTerm: "24 months",
      fids: ["FID-2025-098"],
      lastUpdatedOn: "2025-02-10",
      status: "Draft",
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "Mesh",
      location: "Hyderabad",
    },
    {
      id: "2",
      proposalId: "NW000223",
      createdOn: "2025-02-01",
      contractTerm: "24 months",
      fids: ["FID-2025-010"],
      lastUpdatedOn: "2025-02-01",
      status: "Proposal Generated",
      orderProgress: "not-started",
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "Mesh",
      location: "Pune",
    },
    {
      id: "2a",
      proposalId: "NW000221",
      createdOn: "2025-01-28",
      contractTerm: "36 months",
      fids: ["FID-2025-097"],
      lastUpdatedOn: "2025-02-12",
      status: "Proposal Generated",
      orderProgress: "billing-in-progress",
      company: "TechCorp Solutions",
      service: "MPLS",
      linkType: "Hub & Spoke",
      location: "Delhi, Noida",
    },
    {
      id: "2b",
      proposalId: "NW000219",
      createdOn: "2025-01-20",
      contractTerm: "24 months",
      fids: ["FID-2025-096"],
      lastUpdatedOn: "2025-02-15",
      status: "Proposal Generated",
      orderProgress: "ready-to-generate",
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "Mesh",
      location: "Bangalore",
    },
    {
      id: "3",
      proposalId: "NW000089",
      createdOn: "2024-12-15",
      contractTerm: "12 months",
      fids: ["FID-2024-095"],
      lastUpdatedOn: "2025-01-05",
      status: "Pricing Rejected",
      company: "TechCorp Solutions",
      service: "MPLS",
      linkType: "Hub & Spoke",
      location: "Chennai",
    },
    // Global Enterprises - with new statuses
    {
      id: "4",
      proposalId: "NW000224",
      createdOn: "2025-01-18",
      contractTerm: "36 months",
      fids: ["FID-2025-004", "FID-2025-005"],
      lastUpdatedOn: "2025-02-02",
      status: "Order Placed",
      orderId: "ORD-2025-002",
      company: "Global Enterprises",
      service: "MPLS",
      linkType: "Mesh",
      location: "Hyderabad, Bangalore",
    },
    {
      id: "5",
      proposalId: "NW000225",
      createdOn: "2025-02-03",
      contractTerm: "24 months",
      fids: ["FID-2025-012"],
      lastUpdatedOn: "2025-02-03",
      status: "Draft",
      company: "Global Enterprises",
      service: "DIA",
      linkType: "Hub & Spoke",
      location: "Kolkata",
    },
    // CloudNext Pvt Ltd - with new statuses
    {
      id: "6",
      proposalId: "NW000226",
      createdOn: "2025-01-25",
      contractTerm: "36 months",
      fids: ["FID-2025-006", "FID-2025-007"],
      lastUpdatedOn: "2025-02-01",
      status: "Pricing Approved",
      company: "CloudNext Pvt Ltd",
      service: "MPLS",
      linkType: "Hub & Spoke",
      location: "Mumbai, Delhi",
    },
    // DataFlow Systems - with new statuses
    {
      id: "7",
      proposalId: "NW000227",
      createdOn: "2025-01-22",
      contractTerm: "36 months",
      fids: ["FID-2025-008"],
      lastUpdatedOn: "2025-02-01",
      status: "Proposal Generated",
      company: "DataFlow Systems",
      service: "DIA",
      linkType: "Mesh",
      location: "Pune",
    },
    // New Requirements with various statuses
    {
      id: "8",
      proposalId: "NW00009",
      createdOn: "2024-11-10",
      contractTerm: "12 months",
      fids: ["FID-2025-009", "FID-2025-010"],
      lastUpdatedOn: "2024-11-10",
      status: "Draft",
      company: "Global Solutions Ltd",
      service: "DIA",
      linkType: "Mesh",
      location: "Jaipur, Udaipur",
    },
    {
      id: "9",
      proposalId: "NW00010",
      createdOn: "2024-11-11",
      contractTerm: "24 months",
      fids: ["FID-2025-011", "FID-2025-012", "FID-2025-013"],
      lastUpdatedOn: "2024-11-11",
      status: "Proposal Generated",
      company: "Enterprise Networks Inc",
      service: "MPLS",
      linkType: "Hub & Spoke",
      location: "Nagpur, Indore, Bhopal",
    },
    {
      id: "10",
      proposalId: "NW00005",
      createdOn: "2024-11-05",
      contractTerm: "24 months",
      fids: ["FID-2025-014", "FID-2025-015", "FID-2025-016", "FID-2025-017", "FID-2025-018"],
      lastUpdatedOn: "2024-11-05",
      status: "Pending Finance Approval",
      company: "Media Streaming Co",
      service: "DIA",
      linkType: "Mesh",
      location: "Mumbai, Pune, Bangalore, Hyderabad, Chennai",
    },
    {
      id: "11",
      proposalId: "NW00006",
      createdOn: "2024-11-06",
      contractTerm: "36 months",
      fids: ["FID-2025-019", "FID-2025-020"],
      lastUpdatedOn: "2024-11-06",
      status: "Pricing Approved",
      company: "FinTech Innovations",
      service: "DIA",
      linkType: "Hub & Spoke",
      location: "Delhi, Gurgaon",
    },
    {
      id: "12",
      proposalId: "NW00007",
      createdOn: "2024-11-07",
      contractTerm: "24 months",
      fids: ["FID-2025-021"],
      lastUpdatedOn: "2024-11-07",
      status: "Pricing Rejected",
      company: "Retail Chain Partners",
      service: "MPLS",
      linkType: "Mesh",
      location: "Kolkata",
    },
    {
      id: "13",
      proposalId: "NW00008",
      createdOn: "2024-11-08",
      contractTerm: "36 months",
      fids: ["FID-2025-022", "FID-2025-023", "FID-2025-024"],
      lastUpdatedOn: "2024-11-08",
      status: "Order Placed",
      orderId: "ORD-2025-003",
      company: "Healthcare Systems Ltd",
      service: "DIA",
      linkType: "Hub & Spoke",
      location: "Chennai, Coimbatore, Madurai",
    },
    // Additional requirements for TechCorp Solutions with various statuses
    {
      id: "14",
      proposalId: "NW00011",
      createdOn: "2024-11-12",
      contractTerm: "24 months",
      fids: ["FID-2025-025", "FID-2025-026"],
      lastUpdatedOn: "2024-11-12",
      status: "Pending Finance Approval",
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "Mesh",
      location: "Ahmedabad, Vadodara",
    },
    {
      id: "15",
      proposalId: "NW00012",
      createdOn: "2024-11-13",
      contractTerm: "36 months",
      fids: ["FID-2025-027", "FID-2025-028", "FID-2025-029"],
      lastUpdatedOn: "2024-11-13",
      status: "Pricing Approved",
      company: "TechCorp Solutions",
      service: "MPLS",
      linkType: "Hub & Spoke",
      location: "Lucknow, Kanpur, Varanasi",
    },
    {
      id: "16",
      proposalId: "NW00014",
      createdOn: "2024-11-14",
      contractTerm: "12 months",
      fids: ["FID-2025-030"],
      lastUpdatedOn: "2024-11-14",
      status: "Proposal Cancelled",
      cancellationReason: "Cancelled by CP - Customer requested to postpone implementation",
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "Mesh",
      location: "Chandigarh",
    },
    {
      id: "16a",
      proposalId: "NW00013",
      createdOn: "2024-10-15",
      contractTerm: "24 months",
      fids: ["FID-2024-089"],
      lastUpdatedOn: "2024-11-15",
      status: "Auto-Expired",
      company: "TechCorp Solutions",
      service: "DIA",
      linkType: "Mesh",
      location: "Jaipur",
    },
    // Additional requirements for Global Enterprises with various statuses
    {
      id: "17",
      proposalId: "NW00014",
      createdOn: "2024-11-15",
      contractTerm: "24 months",
      fids: ["FID-2025-031", "FID-2025-032"],
      lastUpdatedOn: "2024-11-15",
      status: "Proposal Generated",
      company: "Global Enterprises",
      service: "DIA",
      linkType: "Mesh",
    },
    {
      id: "18",
      proposalId: "NW00015",
      createdOn: "2024-11-16",
      contractTerm: "36 months",
      fids: ["FID-2025-033", "FID-2025-034", "FID-2025-035"],
      lastUpdatedOn: "2024-11-16",
      status: "Pricing Approved",
      company: "Global Enterprises",
      service: "MPLS",
      linkType: "Hub & Spoke",
    },
    {
      id: "19",
      proposalId: "NW00016",
      createdOn: "2024-11-17",
      contractTerm: "24 months",
      fids: ["FID-2025-036"],
      lastUpdatedOn: "2024-11-17",
      status: "Order Placed",
      orderId: "ORD-2025-004",
      company: "Global Enterprises",
      service: "DIA",
      linkType: "Mesh",
    },
    // Additional requirements for CloudNext Pvt Ltd with various statuses
    {
      id: "20",
      proposalId: "NW00017",
      createdOn: "2024-11-18",
      contractTerm: "12 months",
      fids: ["FID-2025-037", "FID-2025-038"],
      lastUpdatedOn: "2024-11-18",
      status: "Yet to Configure",
      company: "CloudNext Pvt Ltd",
      service: "DIA",
    },
    {
      id: "21",
      proposalId: "NW00018",
      createdOn: "2024-11-19",
      contractTerm: "24 months",
      fids: ["FID-2025-039", "FID-2025-040"],
      lastUpdatedOn: "2024-11-19",
      status: "Generated",
      company: "CloudNext Pvt Ltd",
      service: "MPLS",
      linkType: "Hub & Spoke",
    },
    {
      id: "22",
      proposalId: "NW00019",
      createdOn: "2024-11-20",
      contractTerm: "36 months",
      fids: ["FID-2025-041", "FID-2025-042", "FID-2025-043"],
      lastUpdatedOn: "2024-11-20",
      status: "Proposal Cancelled",
      cancellationReason: "FID Re-pushed - Updated feasibility requirements received",
      company: "CloudNext Pvt Ltd",
      service: "DIA",
      linkType: "Mesh",
    },
    // Additional requirements for DataFlow Systems with various statuses
    {
      id: "23",
      proposalId: "NW00020",
      createdOn: "2024-11-21",
      contractTerm: "24 months",
      fids: ["FID-2025-044"],
      lastUpdatedOn: "2024-11-21",
      status: "Pending Finance Approval",
      company: "DataFlow Systems",
      service: "DIA",
      linkType: "Hub & Spoke",
    },
    {
      id: "24",
      proposalId: "NW00021",
      createdOn: "2024-11-22",
      contractTerm: "36 months",
      fids: ["FID-2025-045", "FID-2025-046"],
      lastUpdatedOn: "2024-11-22",
      status: "Proposal Rejected",
      company: "DataFlow Systems",
      service: "MPLS",
      linkType: "Mesh",
    },
    {
      id: "25",
      proposalId: "NW00022",
      createdOn: "2024-11-23",
      contractTerm: "12 months",
      fids: ["FID-2025-047", "FID-2025-048"],
      lastUpdatedOn: "2024-11-23",
      status: "Order Placed",
      orderId: "ORD-2025-005",
      company: "DataFlow Systems",
      service: "DIA",
    },
    // Additional requirements for Global Solutions Ltd with various statuses
    {
      id: "26",
      proposalId: "NW00023",
      createdOn: "2024-11-24",
      contractTerm: "24 months",
      fids: ["FID-2025-049", "FID-2025-050"],
      lastUpdatedOn: "2024-11-24",
      status: "Generated",
      company: "Global Solutions Ltd",
      service: "MPLS",
      linkType: "Hub & Spoke",
    },
    {
      id: "27",
      proposalId: "NW00024",
      createdOn: "2024-11-25",
      contractTerm: "36 months",
      fids: ["FID-2025-051"],
      lastUpdatedOn: "2024-11-25",
      status: "Awaiting Customer Acceptance",
      company: "Global Solutions Ltd",
      service: "DIA",
      linkType: "Mesh",
    },
    // Additional requirements for Enterprise Networks Inc with various statuses
    {
      id: "28",
      proposalId: "NW00025",
      createdOn: "2024-11-26",
      contractTerm: "24 months",
      fids: ["FID-2025-052", "FID-2025-053"],
      lastUpdatedOn: "2024-11-26",
      status: "Proposal Accepted",
      company: "Enterprise Networks Inc",
      service: "DIA",
    },
    {
      id: "29",
      proposalId: "NW00026",
      createdOn: "2024-11-27",
      contractTerm: "12 months",
      fids: ["FID-2025-054"],
      lastUpdatedOn: "2024-11-27",
      status: "Yet to Configure",
      company: "Enterprise Networks Inc",
      service: "MPLS",
      linkType: "Mesh",
    },
    // Additional requirements for Media Streaming Co with various statuses
    {
      id: "30",
      proposalId: "NW00027",
      createdOn: "2024-11-28",
      contractTerm: "36 months",
      fids: ["FID-2025-055", "FID-2025-056"],
      lastUpdatedOn: "2024-11-28",
      status: "Generated",
      company: "Media Streaming Co",
      service: "DIA",
      linkType: "Hub & Spoke",
    },
    {
      id: "31",
      proposalId: "NW00028",
      createdOn: "2024-11-29",
      contractTerm: "24 months",
      fids: ["FID-2025-057", "FID-2025-058", "FID-2025-059"],
      lastUpdatedOn: "2024-11-29",
      status: "Proposal Rejected",
      company: "Media Streaming Co",
      service: "MPLS",
      linkType: "Hub & Spoke",
    },
    // Additional requirements for FinTech Innovations with various statuses
    {
      id: "32",
      proposalId: "NW00029",
      createdOn: "2024-11-30",
      contractTerm: "36 months",
      fids: ["FID-2025-060"],
      lastUpdatedOn: "2024-11-30",
      status: "Yet to Configure",
      company: "FinTech Innovations",
      service: "DIA",
      linkType: "Mesh",
    },
    {
      id: "33",
      proposalId: "NW00030",
      createdOn: "2024-12-01",
      contractTerm: "24 months",
      fids: ["FID-2025-061", "FID-2025-062"],
      lastUpdatedOn: "2024-12-01",
      status: "Order Signed",
      orderId: "ORD-2025-006",
      company: "FinTech Innovations",
      service: "MPLS",
      linkType: "Hub & Spoke",
    },
    // Additional requirements for Retail Chain Partners with various statuses
    {
      id: "34",
      proposalId: "NW00031",
      createdOn: "2024-12-02",
      contractTerm: "12 months",
      fids: ["FID-2025-063", "FID-2025-064"],
      lastUpdatedOn: "2024-12-02",
      status: "Awaiting Customer Acceptance",
      company: "Retail Chain Partners",
      service: "DIA",
    },
    {
      id: "35",
      proposalId: "NW00032",
      createdOn: "2024-12-03",
      contractTerm: "36 months",
      fids: ["FID-2025-065"],
      lastUpdatedOn: "2024-12-03",
      status: "Generated",
      company: "Retail Chain Partners",
      service: "MPLS",
      linkType: "Mesh",
    },
    // Additional requirements for Healthcare Systems Ltd with various statuses
    {
      id: "36",
      proposalId: "NW00033",
      createdOn: "2024-12-04",
      contractTerm: "24 months",
      fids: ["FID-2025-066", "FID-2025-067"],
      lastUpdatedOn: "2024-12-04",
      status: "Proposal Accepted",
      company: "Healthcare Systems Ltd",
      service: "DIA",
      linkType: "Hub & Spoke",
    },
    {
      id: "37",
      proposalId: "NW00034",
      createdOn: "2024-12-05",
      contractTerm: "12 months",
      fids: ["FID-2025-068", "FID-2025-069"],
      lastUpdatedOn: "2024-12-05",
      status: "Awaiting Customer Acceptance",
      company: "Healthcare Systems Ltd",
      service: "MPLS",
      linkType: "Mesh",
    },
    // P2P Requirements - Various statuses
    {
      id: "38",
      proposalId: "NW00035",
      createdOn: "2025-02-10",
      contractTerm: "36 months",
      fids: ["FID-2025-070", "FID-2025-071"],
      lastUpdatedOn: "2025-02-10",
      status: "Pricing Approved",
      company: "TechCorp Solutions",
      service: "P2P - GCC",
    },
    {
      id: "39",
      proposalId: "NW00036",
      createdOn: "2025-02-08",
      contractTerm: "24 months",
      fids: ["FID-2025-072", "FID-2025-073", "FID-2025-074", "FID-2025-075"],
      lastUpdatedOn: "2025-02-12",
      status: "Proposal Generated",
      company: "Global Enterprises",
      service: "P2P - EVPL",
    },
    {
      id: "40",
      proposalId: "NW00037",
      createdOn: "2025-02-05",
      contractTerm: "36 months",
      fids: ["FID-2025-076", "FID-2025-077"],
      lastUpdatedOn: "2025-02-14",
      status: "Pending Finance Approval",
      company: "CloudNext Pvt Ltd",
      service: "P2P - EPL",
    },
    {
      id: "41",
      proposalId: "NW00038",
      createdOn: "2025-02-01",
      contractTerm: "12 months",
      fids: ["FID-2025-078", "FID-2025-079"],
      lastUpdatedOn: "2025-02-15",
      status: "Pricing Approved",
      company: "DataFlow Systems",
      service: "P2P - GCC",
    },
    {
      id: "42",
      proposalId: "NW00039",
      createdOn: "2025-01-28",
      contractTerm: "24 months",
      fids: ["FID-2025-080", "FID-2025-081", "FID-2025-082", "FID-2025-083"],
      lastUpdatedOn: "2025-02-16",
      status: "Order Placed",
      orderId: "ORD-2025-007",
      company: "Global Solutions Ltd",
      service: "P2P - DEPL",
    },
    {
      id: "43",
      proposalId: "NW00040",
      createdOn: "2025-01-20",
      contractTerm: "36 months",
      fids: ["FID-2025-084", "FID-2025-085"],
      lastUpdatedOn: "2025-02-10",
      status: "Pricing Rejected",
      company: "Enterprise Networks Inc",
      service: "P2P - EVPL",
    },
    {
      id: "44",
      proposalId: "NW00041",
      createdOn: "2025-02-12",
      contractTerm: "24 months",
      fids: ["FID-2025-086", "FID-2025-087"],
      lastUpdatedOn: "2025-02-12",
      status: "Draft",
      company: "Media Streaming Co",
      service: "P2P - EPL",
    },
    {
      id: "45",
      proposalId: "NW00042",
      createdOn: "2025-02-14",
      contractTerm: "36 months",
      fids: ["FID-2025-088", "FID-2025-089", "FID-2025-090", "FID-2025-091"],
      lastUpdatedOn: "2025-02-14",
      status: "Proposal Generated",
      company: "FinTech Innovations",
      service: "P2P - GCC",
      location: "Mumbai - Pune",
    },
    // Additional P2P Requirements for better coverage
    {
      id: "46",
      proposalId: "NW00043",
      createdOn: "2025-02-11",
      contractTerm: "24 months",
      fids: ["FID-2025-092", "FID-2025-093"],
      lastUpdatedOn: "2025-02-15",
      status: "Pending Finance Approval",
      company: "Retail Chain Partners",
      service: "P2P - GCC",
      location: "Delhi - Noida",
    },
    {
      id: "47",
      proposalId: "NW00044",
      createdOn: "2025-02-09",
      contractTerm: "36 months",
      fids: ["FID-2025-094", "FID-2025-095"],
      lastUpdatedOn: "2025-02-16",
      status: "Order Placed",
      orderId: "ORD-2025-008",
      company: "Healthcare Systems Ltd",
      service: "P2P - EVPL",
      location: "Bangalore - Hyderabad",
    },
    {
      id: "48",
      proposalId: "NW00045",
      createdOn: "2025-02-07",
      contractTerm: "12 months",
      fids: ["FID-2025-096", "FID-2025-097"],
      lastUpdatedOn: "2025-02-10",
      status: "Draft",
      company: "TechCorp Solutions",
      service: "P2P - EPL",
      location: "Kolkata - Guwahati",
    },
    {
      id: "49",
      proposalId: "NW00046",
      createdOn: "2025-02-06",
      contractTerm: "24 months",
      fids: ["FID-2025-098", "FID-2025-099"],
      lastUpdatedOn: "2025-02-12",
      status: "Proposal Generated",
      company: "Global Enterprises",
      service: "P2P - DEPL",
      location: "Chennai - Coimbatore",
    },
    {
      id: "50",
      proposalId: "NW00047",
      createdOn: "2025-02-05",
      contractTerm: "36 months",
      fids: ["FID-2025-100", "FID-2025-101"],
      lastUpdatedOn: "2025-02-14",
      status: "Pricing Approved",
      company: "CloudNext Pvt Ltd",
      service: "P2P - GCC",
      location: "Mumbai - AWS Mumbai",
    },
    {
      id: "51",
      proposalId: "NW00048",
      createdOn: "2025-02-04",
      contractTerm: "24 months",
      fids: ["FID-2025-102", "FID-2025-103"],
      lastUpdatedOn: "2025-02-11",
      status: "Pricing Rejected",
      company: "DataFlow Systems",
      service: "P2P - EVPL",
      location: "Pune - Nashik",
    },
    {
      id: "52",
      proposalId: "NW00049",
      createdOn: "2025-02-03",
      contractTerm: "36 months",
      fids: ["FID-2025-104", "FID-2025-105", "FID-2025-106", "FID-2025-107"],
      lastUpdatedOn: "2025-02-03",
      status: "Draft",
      company: "Global Solutions Ltd",
      service: "P2P - EPL",
      location: "Delhi - Jaipur - Chandigarh - Lucknow",
    },
    {
      id: "53",
      proposalId: "NW00050",
      createdOn: "2025-02-02",
      contractTerm: "12 months",
      fids: ["FID-2025-108", "FID-2025-109"],
      lastUpdatedOn: "2025-02-13",
      status: "Proposal Generated",
      company: "Enterprise Networks Inc",
      service: "P2P - DEPL",
      location: "Bangalore - Google Cloud Bangalore",
    },
    {
      id: "54",
      proposalId: "NW00051",
      createdOn: "2025-01-31",
      contractTerm: "24 months",
      fids: ["FID-2025-110", "FID-2025-111"],
      lastUpdatedOn: "2025-02-15",
      status: "Pending Finance Approval",
      company: "Media Streaming Co",
      service: "P2P - GCC",
      location: "Hyderabad - Azure Hyderabad",
    },
    {
      id: "55",
      proposalId: "NW00052",
      createdOn: "2025-01-30",
      contractTerm: "36 months",
      fids: ["FID-2025-112", "FID-2025-113"],
      lastUpdatedOn: "2025-02-16",
      status: "Order Placed",
      orderId: "ORD-2025-009",
      company: "FinTech Innovations",
      service: "P2P - EVPL",
      location: "Mumbai - Navi Mumbai",
    },
    {
      id: "56",
      proposalId: "NW00053",
      createdOn: "2025-01-29",
      contractTerm: "24 months",
      fids: ["FID-2025-114", "FID-2025-115"],
      lastUpdatedOn: "2025-02-09",
      status: "Pricing Approved",
      company: "Retail Chain Partners",
      service: "P2P - EPL",
      location: "Ahmedabad - Surat",
    },
    {
      id: "57",
      proposalId: "NW00054",
      createdOn: "2025-01-28",
      contractTerm: "12 months",
      fids: ["FID-2025-116", "FID-2025-117"],
      lastUpdatedOn: "2025-02-08",
      status: "Pricing Rejected",
      company: "Healthcare Systems Ltd",
      service: "P2P - DEPL",
      location: "Chennai - Madurai",
    },
    {
      id: "58",
      proposalId: "NW00055",
      createdOn: "2025-01-27",
      contractTerm: "36 months",
      fids: ["FID-2025-150", "FID-2025-151", "FID-2025-152", "FID-2025-153"],
      lastUpdatedOn: "2025-01-27",
      status: "Draft",
      company: "TechCorp Solutions",
      service: "P2P - GCC",
      location: "Bangalore - Chennai - Hyderabad - Kochi",
    },
    {
      id: "59",
      proposalId: "NW00056",
      createdOn: "2025-01-26",
      contractTerm: "24 months",
      fids: ["FID-2025-122", "FID-2025-123"],
      lastUpdatedOn: "2025-02-11",
      status: "Proposal Generated",
      company: "Global Enterprises",
      service: "P2P - EVPL",
      location: "Kolkata - Bhubaneswar",
    },
    {
      id: "60",
      proposalId: "NW00057",
      createdOn: "2025-01-25",
      contractTerm: "36 months",
      fids: ["FID-2025-124", "FID-2025-125"],
      lastUpdatedOn: "2025-02-12",
      status: "Pending Finance Approval",
      company: "CloudNext Pvt Ltd",
      service: "P2P - EPL",
      location: "Delhi - AWS Mumbai",
    },
    {
      id: "61",
      proposalId: "NW00058",
      createdOn: "2025-01-24",
      contractTerm: "12 months",
      fids: ["FID-2025-126", "FID-2025-127"],
      lastUpdatedOn: "2025-02-13",
      status: "Order Placed",
      orderId: "ORD-2025-010",
      company: "DataFlow Systems",
      service: "P2P - DEPL",
      location: "Pune - Mumbai",
    },
    {
      id: "62",
      proposalId: "NW00059",
      createdOn: "2025-01-23",
      contractTerm: "24 months",
      fids: ["FID-2025-128", "FID-2025-129"],
      lastUpdatedOn: "2025-02-10",
      status: "Pricing Approved",
      company: "Global Solutions Ltd",
      service: "P2P - GCC",
      location: "Indore - Bhopal",
    },
    {
      id: "63",
      proposalId: "NW00060",
      createdOn: "2025-01-22",
      contractTerm: "36 months",
      fids: ["FID-2025-130", "FID-2025-131"],
      lastUpdatedOn: "2025-02-09",
      status: "Pricing Rejected",
      company: "Enterprise Networks Inc",
      service: "P2P - EVPL",
      location: "Jaipur - Udaipur",
    },
    {
      id: "64",
      proposalId: "NW00061",
      createdOn: "2025-01-21",
      contractTerm: "24 months",
      fids: ["FID-2025-132", "FID-2025-133"],
      lastUpdatedOn: "2025-01-21",
      status: "Draft",
      company: "Media Streaming Co",
      service: "P2P - EPL",
      location: "Gurgaon - Noida",
    },
    {
      id: "65",
      proposalId: "NW00062",
      createdOn: "2025-01-20",
      contractTerm: "12 months",
      fids: ["FID-2025-134", "FID-2025-135"],
      lastUpdatedOn: "2025-02-14",
      status: "Proposal Generated",
      company: "FinTech Innovations",
      service: "P2P - DEPL",
      location: "Hyderabad - Visakhapatnam",
    },
    {
      id: "66",
      proposalId: "NW00063",
      createdOn: "2025-01-19",
      contractTerm: "36 months",
      fids: ["FID-2025-136", "FID-2025-137"],
      lastUpdatedOn: "2025-02-15",
      status: "Pending Finance Approval",
      company: "Retail Chain Partners",
      service: "P2P - GCC",
      location: "Nagpur - Aurangabad",
    },
    {
      id: "67",
      proposalId: "NW00064",
      createdOn: "2025-01-18",
      contractTerm: "24 months",
      fids: ["FID-2025-138", "FID-2025-139", "FID-2025-140", "FID-2025-141"],
      lastUpdatedOn: "2025-02-16",
      status: "Order Placed",
      orderId: "ORD-2025-011",
      company: "Healthcare Systems Ltd",
      service: "P2P - EVPL",
      location: "Cochin - Trivandrum - Calicut - Thrissur",
    },
    {
      id: "68",
      proposalId: "NW00065",
      createdOn: "2025-01-17",
      contractTerm: "36 months",
      fids: ["FID-2025-142", "FID-2025-143"],
      lastUpdatedOn: "2025-02-08",
      status: "Pending Finance Approval",
      company: "TechCorp Solutions",
      service: "P2P - EPL",
      location: "Chandigarh - Amritsar",
    },
    {
      id: "69",
      proposalId: "NW00066",
      createdOn: "2025-01-16",
      contractTerm: "12 months",
      fids: ["FID-2025-144", "FID-2025-145"],
      lastUpdatedOn: "2025-02-07",
      status: "Pricing Rejected",
      company: "Global Enterprises",
      service: "P2P - DEPL",
      location: "Ranchi - Patna",
    },
    {
      id: "70",
      proposalId: "NW00067",
      createdOn: "2025-01-15",
      contractTerm: "24 months",
      fids: ["FID-2025-146", "FID-2025-147"],
      lastUpdatedOn: "2025-01-15",
      status: "Draft",
      company: "CloudNext Pvt Ltd",
      service: "P2P - GCC",
      location: "Dehradun - Haridwar",
    },
    {
      id: "71",
      proposalId: "NW00068",
      createdOn: "2025-01-14",
      contractTerm: "36 months",
      fids: ["FID-2025-148", "FID-2025-149"],
      lastUpdatedOn: "2025-02-13",
      status: "Proposal Generated",
      company: "DataFlow Systems",
      service: "P2P - EVPL",
      location: "Vadodara - Rajkot",
    },
    {
      id: "72",
      proposalId: "NW00069",
      createdOn: "2025-01-13",
      contractTerm: "24 months",
      fids: ["FID-2025-150", "FID-2025-151"],
      lastUpdatedOn: "2025-02-14",
      status: "Pending Finance Approval",
      company: "Global Solutions Ltd",
      service: "P2P - EPL",
      location: "Ludhiana - Jalandhar",
    },
    {
      id: "73",
      proposalId: "NW00070",
      createdOn: "2025-01-12",
      contractTerm: "12 months",
      fids: ["FID-2025-152", "FID-2025-153"],
      lastUpdatedOn: "2025-02-15",
      status: "Order Placed",
      orderId: "ORD-2025-012",
      company: "Enterprise Networks Inc",
      service: "P2P - DEPL",
      location: "Raipur - Bilaspur",
    },
  ];

  const mockOrders: OrderItem[] = [
    {
      id: "1",
      proposalId: "NW000222",
      signedOn: "2025-01-28",
      noOfLinks: 3,
      fids: ["FID-2025-001", "FID-2025-002", "FID-2025-003"],
      company: "TechCorp Solutions",
      service: "MPLS",
      linkType: "Hub & Spoke",
    },
    {
      id: "2",
      proposalId: "NW000224",
      signedOn: "2025-02-02",
      noOfLinks: 2,
      fids: ["FID-2025-004", "FID-2025-005"],
      company: "Global Enterprises",
      service: "MPLS",
      linkType: "Mesh",
    },
    {
      id: "3",
      proposalId: "NW000078",
      signedOn: "2024-12-30",
      noOfLinks: 3,
      fids: ["FID-2025-006", "FID-2025-007", "FID-2025-008"],
      company: "CloudNext Pvt Ltd",
      service: "DIA",
      linkType: "Hub & Spoke",
    },
    // P2P Orders
    {
      id: "4",
      proposalId: "NW00039",
      signedOn: "2025-02-16",
      noOfLinks: 4,
      fids: ["FID-2025-080", "FID-2025-081", "FID-2025-082", "FID-2025-083"],
      company: "Global Solutions Ltd",
      service: "P2P - DEPL",
    },
  ];

  const mockInventory: InventoryItem[] = [
    // TechCorp Solutions
    {
      id: "1",
      linkId: "LINK-2025-001",
      location: "Mumbai, Maharashtra",
      fullAddress:
        "Bandra Kurla Complex, Mumbai, Maharashtra 400051",
      latitude: "19.0596",
      longitude: "72.8295",
      connectionType: "Airtel",
      bandwidth: "100 Mbps",
      expiresOn: "2026-01-15",
      company: "TechCorp Solutions",
      linkType: "Hub & Spoke",
    },
    {
      id: "2",
      linkId: "LINK-2024-098",
      location: "Chennai, Tamil Nadu",
      fullAddress:
        "Guindy Industrial Estate, Chennai, Tamil Nadu 600032",
      latitude: "13.0067",
      longitude: "80.2206",
      connectionType: "BSNL",
      bandwidth: "75 Mbps",
      expiresOn: "2025-06-30",
      company: "TechCorp Solutions",
      linkType: "Mesh",
    },
    {
      id: "3",
      linkId: "LINK-2024-187",
      location: "Navi Mumbai, Maharashtra",
      fullAddress: "Vashi, Navi Mumbai, Maharashtra 400703",
      latitude: "19.0768",
      longitude: "72.9978",
      connectionType: "Fiber",
      bandwidth: "500 Mbps",
      expiresOn: "2025-11-20",
      company: "TechCorp Solutions",
      linkType: "Hub & Spoke",
    },
    // Global Enterprises
    {
      id: "4",
      linkId: "LINK-2025-002",
      location: "Bangalore, Karnataka",
      fullAddress: "Whitefield, Bangalore, Karnataka 560066",
      latitude: "12.9698",
      longitude: "77.7500",
      connectionType: "Wireless",
      bandwidth: "200 Mbps",
      expiresOn: "2026-04-15",
      company: "Global Enterprises",
      linkType: "Mesh",
    },
    {
      id: "5",
      linkId: "LINK-2024-156",
      location: "Hyderabad, Telangana",
      fullAddress: "HITEC City, Hyderabad, Telangana 500081",
      latitude: "17.4435",
      longitude: "78.3772",
      connectionType: "Fiber",
      bandwidth: "1 Gbps",
      expiresOn: "2025-09-10",
      company: "Global Enterprises",
      linkType: "Mesh",
    },
    // CloudNext Pvt Ltd
    {
      id: "6",
      linkId: "LINK-2024-145",
      location: "Delhi, Delhi",
      fullAddress: "Connaught Place, New Delhi, Delhi 110001",
      latitude: "28.6304",
      longitude: "77.2177",
      connectionType: "Fiber",
      bandwidth: "300 Mbps",
      expiresOn: "2025-08-10",
      company: "CloudNext Pvt Ltd",
      linkType: "Hub & Spoke",
    },
    {
      id: "7",
      linkId: "LINK-2025-018",
      location: "Gurugram, Haryana",
      fullAddress: "Cyber City, Gurugram, Haryana 122002",
      latitude: "28.4595",
      longitude: "77.0266",
      connectionType: "Airtel",
      bandwidth: "500 Mbps",
      expiresOn: "2026-02-28",
      company: "CloudNext Pvt Ltd",
      linkType: "Hub & Spoke",
    },
    // DataFlow Systems
    {
      id: "8",
      linkId: "LINK-2025-012",
      location: "Ahmedabad, Gujarat",
      fullAddress: "SG Highway, Ahmedabad, Gujarat 380015",
      latitude: "23.0225",
      longitude: "72.5714",
      connectionType: "TCL",
      bandwidth: "150 Mbps",
      expiresOn: "2026-03-25",
      company: "DataFlow Systems",
      linkType: "Mesh",
    },
  ];

  // Get unique companies from all data sources
  const allCompanies = useMemo(() => {
    const companiesMap = new Map<string, { name: string; id: string }>();
    
    // Create companies with IDs
    const companyList = [
      { name: "TechCorp Solutions", id: "CL000001" },
      { name: "Global Enterprises", id: "CL000002" },
      { name: "CloudNext Pvt Ltd", id: "CL000003" },
      { name: "DataFlow Systems", id: "CL000004" },
    ];
    
    companyList.forEach(company => {
      companiesMap.set(company.name, company);
    });
    
    return companyList.sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // Filtered companies based on search query
  const filteredCompanies = useMemo(() => {
    if (!customerSearchQuery.trim()) return allCompanies.slice(0, 6); // Show top 6 when empty
    
    // Only filter if 3 or more characters
    if (customerSearchQuery.trim().length < 3) return allCompanies.slice(0, 6);
    
    const query = customerSearchQuery.toLowerCase();
    return allCompanies.filter(company => 
      company.name.toLowerCase().includes(query) || 
      company.id.toLowerCase().includes(query)
    );
  }, [allCompanies, customerSearchQuery]);

  // Filtered data based on selected company
  const filteredDrafts = useMemo(() => {
    if (!selectedCompany) return [];
    let items = mockDrafts.filter(
      (item) => item.company === selectedCompany,
    );

    // Apply drafts filters
    if (draftsFilters.submissionTypes.length > 0) {
      items = items.filter(item => draftsFilters.submissionTypes.includes(item.submissionType));
    }
    if (draftsFilters.services.length > 0) {
      items = items.filter(item => draftsFilters.services.includes(item.service));
    }

    return items;
  }, [selectedCompany, draftsFilters]);

  const filteredFeasibilityPool = useMemo(() => {
    if (!selectedCompany) return [];
    let items = mockFeasibilityPool.filter(
      (item) => item.company === selectedCompany,
    );

    // Apply feasibility filters
    if (feasibilityFilters.products.length > 0) {
      items = items.filter(item => feasibilityFilters.products.includes(item.product));
    }
    if (feasibilityFilters.types.length > 0) {
      items = items.filter(item => feasibilityFilters.types.includes(item.type));
    }
    if (feasibilityFilters.serviceChangeTypes.length > 0) {
      items = items.filter(item => 
        item.type === "MDAC" && 
        item.serviceChangeType && 
        feasibilityFilters.serviceChangeTypes.includes(item.serviceChangeType)
      );
    }
    if (feasibilityFilters.locations.length > 0) {
      items = items.filter(item => feasibilityFilters.locations.includes(item.location));
    }
    if (feasibilityFilters.connectionTypes.length > 0) {
      items = items.filter(item => feasibilityFilters.connectionTypes.includes(item.connectionType));
    }
    if (feasibilityFilters.bandwidths.length > 0) {
      items = items.filter(item => feasibilityFilters.bandwidths.includes(item.bandwidth));
    }
    if (feasibilityFilters.feasibilityStatuses.length > 0) {
      items = items.filter(item => feasibilityFilters.feasibilityStatuses.includes(item.feasibilityStatus));
    }

    return items;
  }, [selectedCompany, feasibilityFilters]);

  // Split feasibility pool into available and not available with filtering and sorting
  const availableFeasibilityItems = useMemo(() => {
    let items = filteredFeasibilityPool.filter((item) => {
      // Available if: (feasibilityStatus = Checking Feasibility OR Feasible) AND (orderStatus != Order Placed AND orderStatus != Order Completed) AND (proposalCount < 3)
      const isFeasibilityAvailable =
        item.feasibilityStatus === "Checking Feasibility" ||
        item.feasibilityStatus === "Feasible";
      const isOrderAvailable =
        item.orderStatus !== "Order Placed" &&
        item.orderStatus !== "Order Completed";
      const isNotMaxedOut = item.proposalCount < 3;
      return isFeasibilityAvailable && isOrderAvailable && isNotMaxedOut;
    });

    // Apply filters
    if (feasibilityStatusFilter !== "all") {
      items = items.filter(
        (item) =>
          item.feasibilityStatus === feasibilityStatusFilter,
      );
    }
    if (orderStatusFilter !== "all") {
      items = items.filter(
        (item) =>
          item.orderStatus === orderStatusFilter ||
          (!item.orderStatus && orderStatusFilter === "none"),
      );
    }
    if (linkTypeFilter !== "all") {
      items = items.filter(
        (item) => item.linkType === linkTypeFilter,
      );
    }

    // Apply sorting with product order priority
    items = [...items].sort((a, b) => {
      // Define product order: DIA, MPLS, then P2P products
      const productOrder: Record<string, number> = {
        'DIA': 0,
        'MPLS': 1,
        'P2P - GCC': 2,
        'P2P - EVPL': 3,
        'P2P - DEPL': 4,
        'P2P - EPL': 5
      };
      
      // First sort by product
      const productA = productOrder[a.product] !== undefined ? productOrder[a.product] : 999;
      const productB = productOrder[b.product] !== undefined ? productOrder[b.product] : 999;
      
      if (productA !== productB) {
        return productA - productB;
      }
      
      // Then sort by selected criteria
      let compareA: any;
      let compareB: any;

      switch (sortBy) {
        case "fid":
          compareA = a.fid;
          compareB = b.fid;
          break;
        case "location":
          compareA = a.location;
          compareB = b.location;
          break;
        case "bandwidth":
          compareA = parseInt(a.bandwidth);
          compareB = parseInt(b.bandwidth);
          break;
        case "expiresOn":
          compareA = a.expiresOn || "";
          compareB = b.expiresOn || "";
          break;
        default:
          compareA = a.fid;
          compareB = b.fid;
      }

      if (compareA < compareB)
        return sortOrder === "asc" ? -1 : 1;
      if (compareA > compareB)
        return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return items;
  }, [
    filteredFeasibilityPool,
    feasibilityStatusFilter,
    orderStatusFilter,
    linkTypeFilter,
    sortBy,
    sortOrder,
  ]);

  const notAvailableFeasibilityItems = useMemo(() => {
    let items = filteredFeasibilityPool.filter((item) => {
      // Not Available if: orderStatus = Order Placed OR Order Completed OR feasibilityStatus = Not Feasible OR Expired OR proposalCount >= 3
      const isOrderNotAvailable =
        item.orderStatus === "Order Placed" ||
        item.orderStatus === "Order Completed";
      const isFeasibilityNotAvailable =
        item.feasibilityStatus === "Not Feasible" ||
        item.feasibilityStatus === "Expired";
      const isMaxedOut = item.proposalCount >= 3;
      return isOrderNotAvailable || isFeasibilityNotAvailable || isMaxedOut;
    });

    // Apply filters
    if (feasibilityStatusFilter !== "all") {
      items = items.filter(
        (item) =>
          item.feasibilityStatus === feasibilityStatusFilter,
      );
    }
    if (orderStatusFilter !== "all") {
      items = items.filter(
        (item) =>
          item.orderStatus === orderStatusFilter ||
          (!item.orderStatus && orderStatusFilter === "none"),
      );
    }
    if (linkTypeFilter !== "all") {
      items = items.filter(
        (item) => item.linkType === linkTypeFilter,
      );
    }

    // Apply sorting with product order priority
    items = [...items].sort((a, b) => {
      // Define product order: DIA, MPLS, then P2P products
      const productOrder: Record<string, number> = {
        'DIA': 0,
        'MPLS': 1,
        'P2P - GCC': 2,
        'P2P - EVPL': 3,
        'P2P - DEPL': 4,
        'P2P - EPL': 5
      };
      
      // First sort by product
      const productA = productOrder[a.product] !== undefined ? productOrder[a.product] : 999;
      const productB = productOrder[b.product] !== undefined ? productOrder[b.product] : 999;
      
      if (productA !== productB) {
        return productA - productB;
      }
      
      // Then sort by selected criteria
      let compareA: any;
      let compareB: any;

      switch (sortBy) {
        case "fid":
          compareA = a.fid;
          compareB = b.fid;
          break;
        case "location":
          compareA = a.location;
          compareB = b.location;
          break;
        case "bandwidth":
          compareA = parseInt(a.bandwidth);
          compareB = parseInt(b.bandwidth);
          break;
        case "expiresOn":
          compareA = a.expiresOn || "";
          compareB = b.expiresOn || "";
          break;
        default:
          compareA = a.fid;
          compareB = b.fid;
      }

      if (compareA < compareB)
        return sortOrder === "asc" ? -1 : 1;
      if (compareA > compareB)
        return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return items;
  }, [
    filteredFeasibilityPool,
    feasibilityStatusFilter,
    orderStatusFilter,
    linkTypeFilter,
    sortBy,
    sortOrder,
  ]);

  // Pagination for available items
  const totalAvailablePages = Math.ceil(availableFeasibilityItems.length / itemsPerPage);
  const paginatedAvailableItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return availableFeasibilityItems.slice(startIndex, endIndex);
  }, [availableFeasibilityItems, currentPage, itemsPerPage]);

  // Pagination for not available items
  const totalNotAvailablePages = Math.ceil(notAvailableFeasibilityItems.length / itemsPerPage);
  const paginatedNotAvailableItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return notAvailableFeasibilityItems.slice(startIndex, endIndex);
  }, [notAvailableFeasibilityItems, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change or tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [feasibilityStatusFilter, orderStatusFilter, linkTypeFilter, sortBy, sortOrder, selectedProduct, feasibilitySubTab, selectedCompany]);

  // Check if checkbox should be enabled
  const isCheckboxEnabled = (item: FeasibilityItem) => {
    // Enable only if: feasibilityStatus = Feasible AND (orderStatus = Proposal Generated OR orderStatus is undefined/null)
    const basicCheck = item.feasibilityStatus === "Feasible" &&
      (item.orderStatus === "Proposal Generated" || !item.orderStatus);
    
    if (!basicCheck) return false;
    
    // If no items selected yet, enable all (that pass basic check)
    if (selectedFeasibilityItems.length === 0) return true;
    
    // Check if order type matches the first selected FID
    const firstSelectedFid = mockFeasibilityPool.find(f => f.fid === selectedFeasibilityItems[0]);
    if (!firstSelectedFid) return true;
    
    // Disable if order types don't match (New vs MDAC)
    return firstSelectedFid.type === item.type;
  };

  const filteredProposals = useMemo(() => {
    if (!selectedCompany) return [];
    let items = mockProposals.filter((item) => item.company === selectedCompany);

    // Apply requirements filters
    if (requirementsFilters.services.length > 0) {
      items = items.filter(item => requirementsFilters.services.includes(item.service));
    }
    if (requirementsFilters.statuses.length > 0) {
      items = items.filter(item => requirementsFilters.statuses.includes(item.status));
    }
    if (requirementsFilters.locations.length > 0) {
      items = items.filter(item => item.location && requirementsFilters.locations.includes(item.location));
    }
    if (requirementsFilters.contractTerms.length > 0) {
      items = items.filter(item => requirementsFilters.contractTerms.includes(item.contractTerm));
    }

    return items.sort((a, b) => {
      // Sort DIA and MPLS to the bottom
      const isDiaOrMplsA = a.service === 'DIA' || a.service === 'MPLS';
      const isDiaOrMplsB = b.service === 'DIA' || b.service === 'MPLS';
      
      if (isDiaOrMplsA && !isDiaOrMplsB) return 1;
      if (!isDiaOrMplsA && isDiaOrMplsB) return -1;
      return 0;
    });
  }, [selectedCompany, requirementsFilters]);

  const filteredOrders = useMemo(() => {
    if (!selectedCompany) return [];
    return mockOrders.filter(
      (item) => item.company === selectedCompany,
    );
  }, [selectedCompany]);

  const filteredInventory = useMemo(() => {
    return mockInventory.filter(
      (item) => item.company === selectedCompany,
    );
  }, [selectedCompany]);

  // Handlers
  const handleFeasibilitySelection = (
    fid: string,
    checked: boolean,
  ) => {
    const fidData = mockFeasibilityPool.find(f => f.fid === fid);
    if (!fidData) return;

    if (checked) {
      // Check if this is the first selection
      if (selectedFeasibilityItems.length === 0) {
        setSelectedProduct(fidData.product || 'DIA');
        setSelectedFeasibilityItems([fid]);
        // Auto-assign as A End for P2P products
        if (fidData.product && fidData.product.startsWith('P2P')) {
          setFidEndAssignments({ [fid]: 'A End' });
        }
      } else if ((fidData.product || 'DIA') === selectedProduct) {
        // Check if order type (New vs MDAC) matches
        const firstSelectedFid = mockFeasibilityPool.find(f => f.fid === selectedFeasibilityItems[0]);
        if (firstSelectedFid && firstSelectedFid.type !== fidData.type) {
          const selectedType = firstSelectedFid.type;
          toast.error(`Cannot mix "${selectedType}" and "${fidData.type}" FIDs in the same proposal. Please select FIDs of the same order type.`);
          return;
        }
        
        setSelectedFeasibilityItems([
          ...selectedFeasibilityItems,
          fid,
        ]);
        // Auto-assign alternating A End and B End for P2P products
        if (fidData.product && fidData.product.startsWith('P2P')) {
          const currentAEndCount = Object.values(fidEndAssignments).filter(v => v === 'A End').length;
          const currentBEndCount = Object.values(fidEndAssignments).filter(v => v === 'B End').length;
          const newEnd = currentAEndCount > currentBEndCount ? 'B End' : 'A End';
          setFidEndAssignments({ ...fidEndAssignments, [fid]: newEnd });
        }
      } else {
        toast.error(`Please select FIDs from the same product type (${selectedProduct})`);
      }
    } else {
      const newSelected = selectedFeasibilityItems.filter((id) => id !== fid);
      setSelectedFeasibilityItems(newSelected);
      // Remove from end assignments
      const newAssignments = { ...fidEndAssignments };
      delete newAssignments[fid];
      setFidEndAssignments(newAssignments);
      // Reset selected product if no items are selected
      if (newSelected.length === 0) {
        setSelectedProduct(null);
      }
    }
  };

  const handleDeleteDraft = (draftId: string) => {
    setItemToDelete(draftId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      toast.success(
        `Draft ${itemToDelete} deleted successfully`,
      );
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleEditDraft = (draftId: string) => {
    toast.info(`Opening draft ${draftId} for editing`);
    navigate("/new-dia-service");
  };

  // Filter handlers
  const handleOpenFilterModal = (tab: 'feasibility' | 'requirements' | 'drafts') => {
    setActiveFilterTab(tab);
    setIsFilterModalOpen(true);
  };

  const handleClearFilters = () => {
    if (activeFilterTab === 'feasibility') {
      setFeasibilityFilters({
        products: [],
        types: [],
        serviceChangeTypes: [],
        locations: [],
        connectionTypes: [],
        bandwidths: [],
        feasibilityStatuses: [],
      });
    } else if (activeFilterTab === 'requirements') {
      setRequirementsFilters({
        services: [],
        statuses: [],
        locations: [],
        contractTerms: [],
      });
    } else if (activeFilterTab === 'drafts') {
      setDraftsFilters({
        submissionTypes: [],
        services: [],
      });
    }
  };

  const handleApplyFilters = () => {
    setIsFilterModalOpen(false);
    toast.success('Filters applied successfully');
  };

  const handleFilterChange = (filterType: string, value: string, checked: boolean) => {
    if (activeFilterTab === 'feasibility') {
      setFeasibilityFilters(prev => ({
        ...prev,
        [filterType]: checked
          ? [...prev[filterType as keyof typeof prev] as string[], value]
          : (prev[filterType as keyof typeof prev] as string[]).filter(v => v !== value)
      }));
    } else if (activeFilterTab === 'requirements') {
      setRequirementsFilters(prev => ({
        ...prev,
        [filterType]: checked
          ? [...prev[filterType as keyof typeof prev] as string[], value]
          : (prev[filterType as keyof typeof prev] as string[]).filter(v => v !== value)
      }));
    } else if (activeFilterTab === 'drafts') {
      setDraftsFilters(prev => ({
        ...prev,
        [filterType]: checked
          ? [...prev[filterType as keyof typeof prev] as string[], value]
          : (prev[filterType as keyof typeof prev] as string[]).filter(v => v !== value)
      }));
    }
  };

  // Get active filter counts
  const feasibilityFilterCount = useMemo(() => {
    return Object.values(feasibilityFilters).reduce((sum, arr) => sum + arr.length, 0);
  }, [feasibilityFilters]);

  const requirementsFilterCount = useMemo(() => {
    return Object.values(requirementsFilters).reduce((sum, arr) => sum + arr.length, 0);
  }, [requirementsFilters]);

  const draftsFilterCount = useMemo(() => {
    return Object.values(draftsFilters).reduce((sum, arr) => sum + arr.length, 0);
  }, [draftsFilters]);

  // Get filter options
  const feasibilityFilterOptions = useMemo(() => {
    const baseData = mockFeasibilityPool.filter(item => item.company === selectedCompany);
    return {
      products: ['DIA', 'MPLS', 'P2P - EPL', 'P2P - EVPL', 'P2P - DEPL', 'P2P - GCC'],
      types: ['New', 'MDAC'],
      serviceChangeTypes: ['Address Change', 'LM Change', 'Bandwidth Change', 'Add Secondary/Tertiary Link'],
      locations: Array.from(new Set(baseData.map(f => f.location))),
      connectionTypes: ['Wireless', 'Fiber', 'Broadband', 'Other ISP'],
      bandwidths: Array.from(new Set(baseData.map(f => f.bandwidth))),
      feasibilityStatuses: ['Checking Feasibility', 'Feasible', 'Not Feasible', 'Expired'],
      serviceProviders: ['Airtel', 'Jio', 'BSNL', 'Vodafone Idea', 'Tata Communications'],
    };
  }, [selectedCompany]);

  const requirementsFilterOptions = useMemo(() => {
    const baseData = mockProposals.filter(item => item.company === selectedCompany);
    return {
      services: Array.from(new Set(baseData.map(p => p.service))),
      statuses: Array.from(new Set(baseData.map(p => p.status))),
      locations: Array.from(new Set(baseData.map(p => p.location).filter(Boolean) as string[])),
      contractTerms: Array.from(new Set(baseData.map(p => p.contractTerm))),
    };
  }, [selectedCompany]);

  const draftsFilterOptions = useMemo(() => {
    const baseData = mockDrafts.filter(item => item.company === selectedCompany);
    return {
      submissionTypes: Array.from(new Set(baseData.map(d => d.submissionType))),
      services: Array.from(new Set(baseData.map(d => d.service))),
    };
  }, [selectedCompany]);

  const handleFidClick = (item: FeasibilityItem) => {
    setSelectedFidData(item);
    setFidDetailsOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { color: string; variant: any }
    > = {
      "Checking Feasibility": {
        color:
          "bg-yellow-100 text-yellow-700 border-yellow-300",
        variant: "outline",
      },
      Feasible: {
        color: "bg-green-100 text-green-700 border-green-300",
        variant: "outline",
      },
      "Not Feasible": {
        color: "bg-red-100 text-red-700 border-red-300",
        variant: "outline",
      },
      Expired: {
        color: "bg-gray-100 text-gray-700 border-gray-300",
        variant: "outline",
      },
      "Proposal Generated": {
        color: "bg-blue-100 text-blue-700 border-blue-300",
        variant: "outline",
      },
      "Order Placed": {
        color:
          "bg-orange-100 text-orange-700 border-orange-300",
        variant: "outline",
      },
      "Order Completed": {
        color: "bg-green-100 text-green-700 border-green-300",
        variant: "outline",
      },
      Active: {
        color: "bg-green-100 text-green-700 border-green-300",
        variant: "outline",
      },
      Draft: {
        color: "bg-gray-100 text-gray-700 border-gray-300",
        variant: "outline",
      },
      Voided: {
        color: "bg-red-100 text-red-700 border-red-300",
        variant: "outline",
      },
      "Pending Finance Approval": {
        color: "bg-yellow-100 text-yellow-700 border-yellow-300",
        variant: "outline",
      },
      "Pricing Approved": {
        color: "bg-green-100 text-green-700 border-green-300",
        variant: "outline",
      },
      "Pricing Rejected": {
        color: "bg-red-100 text-red-700 border-red-300",
        variant: "outline",
      },
      "Proposal Cancelled": {
        color: "bg-gray-100 text-gray-700 border-gray-300",
        variant: "outline",
      },
      "Auto-Expired": {
        color: "bg-gray-100 text-gray-700 border-gray-300",
        variant: "outline",
      },
      // Legacy statuses (keeping for backward compatibility)
      "Yet to Configure": {
        color: "bg-orange-100 text-orange-700 border-orange-300",
        variant: "outline",
      },
      Generated: {
        color: "bg-blue-100 text-blue-700 border-blue-300",
        variant: "outline",
      },
      "Awaiting Customer Acceptance": {
        color: "bg-yellow-100 text-yellow-700 border-yellow-300",
        variant: "outline",
      },
      "Proposal Accepted": {
        color: "bg-green-100 text-green-700 border-green-300",
        variant: "outline",
      },
      "Proposal Rejected": {
        color: "bg-red-100 text-red-700 border-red-300",
        variant: "outline",
      },
      "Order Signed": {
        color: "bg-purple-100 text-purple-700 border-purple-300",
        variant: "outline",
      },
    };

    const config = statusConfig[status] || {
      color: "bg-gray-100 text-gray-700",
      variant: "outline",
    };
    return (
      <Badge variant={config.variant} className={config.color}>
        {status}
      </Badge>
    );
  };

  const getProposalStatusTooltip = (status: string) => {
    const tooltips: Record<string, string> = {
      Draft:
        "No versions created yet; configure a proposal to activate.",
      Active:
        "At least one version exists; view or edit versions.",
      Expired:
        "All versions have expired; proposal cannot be used.",
      Voided: "Proposal manually voided; cannot be used.",
    };
    return tooltips[status] || "";
  };

  const handleRepushFeasibility = (item: FeasibilityItem) => {
    setSelectedRepushFid(item);
    // Check if FID has an order status (part of existing proposal)
    if (item.orderStatus) {
      setRepushAlertOpen(true);
    } else {
      setRepushDialogOpen(true);
    }
  };

  const confirmRepushFeasibility = () => {
    if (selectedRepushFid) {
      toast.success(`Feasibility request sent for FID: ${selectedRepushFid.fid}. You'll be notified once results are updated.`);
      setRepushDialogOpen(false);
      setRepushAlertOpen(false);
      setSelectedRepushFid(null);
    }
  };

  // Handle cancel proposal
  const handleCancelProposal = (item: ProposalItem) => {
    setSelectedProposalToCancel(item);
    setCancelReason("");
    setCancelDialogOpen(true);
  };

  const confirmCancelProposal = () => {
    if (selectedProposalToCancel && cancelReason.trim()) {
      toast.success(`Proposal ${selectedProposalToCancel.proposalId} cancelled successfully`);
      setCancelDialogOpen(false);
      setCancelReason("");
      setSelectedProposalToCancel(null);
      // In real implementation, update the proposal status to "Proposal Cancelled" with reason
    } else if (!cancelReason.trim()) {
      toast.error("Please provide a cancellation reason");
    }
  };

  // Get dynamic CTA for Proposal Generated status
  const getOrderCTA = (item: ProposalItem) => {
    if (item.status !== "Proposal Generated") return null;
    
    const progress = item.orderProgress || "not-started";
    
    switch (progress) {
      case "not-started":
        return { label: "Move to Order", icon: ArrowLeft };
      case "billing-in-progress":
      case "po-pending":
        return { label: "Continue Order Setup", icon: ArrowLeft };
      case "ready-to-generate":
        return { label: "Generate Order", icon: FileText };
      default:
        return { label: "Move to Order", icon: ArrowLeft };
    }
  };

  // Helper function to render feasibility table
  const renderFeasibilityTable = (
    items: FeasibilityItem[],
    showCheckbox: boolean = true,
    showOrderStatus: boolean = true,
  ) => (
    <div className="border rounded-lg overflow-hidden h-full">
      <div className="overflow-auto h-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              {showCheckbox && (
                <TableHead className="w-12">
                  <Checkbox disabled />
                </TableHead>
              )}
              <TableHead>FID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>LM Type / Bandwidth</TableHead>
              <TableHead>Feasibility Status</TableHead>
              <TableHead>Expires On</TableHead>
              <TableHead>Proposals</TableHead>
              {showOrderStatus && <TableHead>Order Status</TableHead>}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={showCheckbox ? (showOrderStatus ? 11 : 10) : (showOrderStatus ? 10 : 9)}
                  className="text-center text-gray-500 py-8"
                >
                  No items found
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => {
                const isEnabled = isCheckboxEnabled(item);
                const isDisabledDueToType = selectedFeasibilityItems.length > 0 && !isEnabled && 
                  item.feasibilityStatus === "Feasible" && 
                  (item.orderStatus === "Proposal Generated" || !item.orderStatus);
                
                return (
                <TableRow 
                  key={item.id}
                  className={isDisabledDueToType ? 'opacity-40' : ''}
                >
                  {showCheckbox && (
                    <TableCell>
                      <Checkbox
                        checked={selectedFeasibilityItems.includes(
                          item.fid,
                        )}
                        onCheckedChange={(checked) =>
                          handleFeasibilitySelection(
                            item.fid,
                            checked as boolean,
                          )
                        }
                        disabled={!isCheckboxEnabled(item)}
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleFidClick(item)}
                        className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                      >
                        {item.fid}
                      </button>
                      {item.nearingExpiry && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle className="w-4 h-4 text-orange-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">
                                Nearing expiry
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      item.product === 'DIA' ? 'bg-orange-100 text-orange-700' :
                      item.product === 'MPLS' ? 'bg-blue-100 text-blue-700' :
                      item.product === 'P2P - GCC' ? 'bg-green-100 text-green-700' :
                      item.product === 'P2P - EVPL' ? 'bg-indigo-100 text-indigo-700' :
                      item.product === 'P2P - EPL' ? 'bg-amber-100 text-amber-700' :
                      item.product === 'P2P - DEPL' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }>
                      {item.product || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant="outline">{item.type}</Badge>
                      {item.type === "MDAC" && item.serviceChangeType && (
                        <Badge variant="secondary" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                          {item.serviceChangeType}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center cursor-pointer">
                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-sm text-gray-900">
                              {item.location}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs">
                            <p>{item.fullAddress}</p>
                            <p className="text-gray-500 mt-1">
                              Lat: {item.latitude}, Long:{" "}
                              {item.longitude}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    {/* A End / B End Badge for P2P products when selected */}
                    {(() => {
                      const isSelected = selectedFeasibilityItems.includes(item.fid);
                      const isP2P = item.product && item.product.startsWith('P2P');
                      const hasAssignment = fidEndAssignments[item.fid];
                      
                      return isSelected && isP2P && hasAssignment && (
                        <div className="mt-1">
                          <button
                          onClick={() => {
                            // Toggle between A End and B End
                            const currentEnd = fidEndAssignments[item.fid];
                            const newEnd = currentEnd === 'A End' ? 'B End' : 'A End';
                            setFidEndAssignments({ ...fidEndAssignments, [item.fid]: newEnd });
                          }}
                          className={`text-xs px-2 py-0.5 rounded cursor-pointer hover:opacity-80 transition-opacity ${
                            fidEndAssignments[item.fid] === 'A End' 
                              ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                              : 'bg-green-100 text-green-700 border border-green-300'
                          }`}
                        >
                          {fidEndAssignments[item.fid]}
                        </button>
                      </div>
                      );
                    })()}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-900">
                      {item.connectionType} - {item.bandwidth}
                    </span>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(item.feasibilityStatus)}
                  </TableCell>
                  <TableCell>
                    {item.expiresOn ? (
                      <span className="text-sm text-gray-900">
                        {item.expiresOn}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">
                        -
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.proposalCount > 0 ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge 
                              variant="outline" 
                              className="bg-blue-50 text-blue-700 border-blue-300 cursor-pointer"
                            >
                              {item.proposalCount}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-1">
                              <p className="text-xs font-medium">Used in:</p>
                              {item.usedInProposals.map((reqId, idx) => (
                                <p key={idx} className="text-xs">{reqId}</p>
                              ))}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </TableCell>
                  {showOrderStatus && (
                    <TableCell>
                      {item.orderStatus ? (
                        getStatusBadge(item.orderStatus)
                      ) : (
                        <span className="text-sm text-gray-400">
                          -
                        </span>
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleFidClick(item)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRepushFeasibility(item)}>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Re-push Feasibility
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-gray-900">
                  Requirements Management
                </h1>
                <p className="text-sm text-gray-500">
                  Manage all feasibility, requirements and orders
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto px-8 py-5 pb-8 space-y-5">
        {/* Customer Search Card */}
        <Card>
          <CardContent className="p-5">
            <div className="w-80 relative">
              <Label className="text-sm text-gray-700 mb-2 block">Search by Customer Name or Customer ID</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <Input
                  placeholder="Type customer name or ID..."
                  value={customerSearchQuery}
                  onChange={(e) => {
                    setCustomerSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  className="bg-white pl-10 pr-10 border-gray-300"
                />
                {selectedCompany && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => {
                      setSelectedCompany("");
                      setCustomerSearchQuery("");
                    }}
                  >
                    <XCircle className="w-4 h-4 text-gray-400" />
                  </Button>
                )}
              </div>
              
              {showDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowDropdown(false)}
                  />
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto">
                    {filteredCompanies.length > 0 ? (
                      <div className="py-1">
                        {filteredCompanies.map((company) => (
                          <button
                            key={company.id}
                            className="w-full px-3 py-2 text-left hover:bg-gray-100 transition-colors focus:bg-gray-100 focus:outline-none"
                            onClick={() => {
                              setSelectedCompany(company.name);
                              setCustomerSearchQuery(`${company.name} (${company.id})`);
                              setShowDropdown(false);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-900">{company.name}</span>
                              <span className="text-xs text-gray-500">{company.id}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="px-3 py-4 text-sm text-gray-500 text-center">
                        {customerSearchQuery.length < 3 && customerSearchQuery.length > 0
                          ? "Type at least 3 characters to search"
                          : "No customers found"}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Product Selection Section */}
        <Card>
          <CardContent className="p-5">
            <div>
              <h3 className="text-gray-900 mb-4">Product Selection</h3>
              
              <div className="grid grid-cols-3 gap-4">
                {/* Network Solutions Card */}
                <div 
                  className={`relative cursor-pointer transition-all ${
                    selectedProductCategory === 'network' 
                      ? 'transform scale-[1.02]' 
                      : 'hover:transform hover:scale-[1.01]'
                  }`}
                  onClick={() => setSelectedProductCategory('network')}
                >
                  <Card className={`border-2 ${
                    selectedProductCategory === 'network'
                      ? 'border-blue-500 bg-blue-50/30 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          selectedProductCategory === 'network'
                            ? 'bg-blue-100'
                            : 'bg-gray-100'
                        }`}>
                          <Network className={`w-6 h-6 ${
                            selectedProductCategory === 'network'
                              ? 'text-blue-600'
                              : 'text-gray-500'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h4 className={`mb-2 ${
                            selectedProductCategory === 'network'
                              ? 'text-blue-900'
                              : 'text-gray-900'
                          }`}>DC Colo</h4>
                          <p className="text-sm text-gray-600 mb-1">DC Colo products and services</p>
                          <p className="text-xs text-blue-600">Store: SBY_DC_COLO</p>
                        </div>
                      </div>
                      {selectedProductCategory === 'network' && (
                        <div className="absolute top-3 right-3">
                          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Data Center Card */}
                <div 
                  className={`relative cursor-pointer transition-all ${
                    selectedProductCategory === 'datacenter' 
                      ? 'transform scale-[1.02]' 
                      : 'hover:transform hover:scale-[1.01]'
                  }`}
                  onClick={() => setSelectedProductCategory('datacenter')}
                >
                  <Card className={`border-2 ${
                    selectedProductCategory === 'datacenter'
                      ? 'border-green-500 bg-green-50/30 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-green-300'
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          selectedProductCategory === 'datacenter'
                            ? 'bg-green-100'
                            : 'bg-gray-100'
                        }`}>
                          <Building className={`w-6 h-6 ${
                            selectedProductCategory === 'datacenter'
                              ? 'text-green-600'
                              : 'text-gray-500'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h4 className={`mb-2 ${
                            selectedProductCategory === 'datacenter'
                              ? 'text-green-900'
                              : 'text-gray-900'
                          }`}>Sify Core Cloud</h4>
                          <p className="text-sm text-gray-600 mb-1">Sify Core Cloud products and services</p>
                          <p className="text-xs text-blue-600">Store: SIFY_CORE_CLOUD</p>
                        </div>
                      </div>
                      {selectedProductCategory === 'datacenter' && (
                        <div className="absolute top-3 right-3">
                          <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Cloud Services Card */}
                <div 
                  className={`relative cursor-pointer transition-all ${
                    selectedProductCategory === 'cloud' 
                      ? 'transform scale-[1.02]' 
                      : 'hover:transform hover:scale-[1.01]'
                  }`}
                  onClick={() => setSelectedProductCategory('cloud')}
                >
                  <Card className={`border-2 ${
                    selectedProductCategory === 'cloud'
                      ? 'border-purple-500 bg-purple-50/30 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-purple-300'
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          selectedProductCategory === 'cloud'
                            ? 'bg-purple-100'
                            : 'bg-gray-100'
                        }`}>
                          <Cloud className={`w-6 h-6 ${
                            selectedProductCategory === 'cloud'
                              ? 'text-purple-600'
                              : 'text-gray-500'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className={`${
                              selectedProductCategory === 'cloud'
                                ? 'text-purple-900'
                                : 'text-gray-900'
                            }`}>SIFY NETWORK</h4>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                              Primary
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">SIFY NETWORK products and services</p>
                          <p className="text-xs text-blue-600">Store: SIFY_NETWORK_BU</p>
                        </div>
                      </div>
                      {selectedProductCategory === 'cloud' && (
                        <div className="absolute top-3 right-3">
                          <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Table Card */}
        <Card className="flex-1 flex flex-col overflow-hidden min-h-[600px]">
          <CardContent className="p-5 flex-1 overflow-hidden flex flex-col">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <TabsList className="grid grid-cols-4 w-full mb-4 flex-shrink-0">
                <TabsTrigger value="feasibility-pool">
                  Feasibility Pool {selectedCompany && `(${filteredFeasibilityPool.length})`}
                </TabsTrigger>
                <TabsTrigger value="proposals">
                  Requirements {selectedCompany && `(${filteredProposals.length})`}
                </TabsTrigger>
                <TabsTrigger value="drafts">
                  Drafts {selectedCompany && `(${filteredDrafts.length})`}
                </TabsTrigger>
              </TabsList>

              {/* Feasibility Pool Tab */}
              <TabsContent
                value="feasibility-pool"
                className="flex-1 overflow-hidden flex flex-col mt-0 space-y-0"
              >
                {!selectedCompany ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center max-w-md">
                      <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-gray-900 mb-2">No Customer Selected</h3>
                      <p className="text-sm text-gray-500">
                        Please select a customer from the dropdown above to view Feasibility Pool.
                      </p>
                    </div>
                  </div>
                ) : (
                <>
                <div className="flex items-start justify-between mb-4 flex-shrink-0">
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-1">
                      Feasibility Pool
                    </h3>
                  </div>

                  <div className="flex items-center space-x-4">
                    {selectedFeasibilityItems.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          {selectedFeasibilityItems.length}{" "}
                          selected
                          {selectedProduct && selectedProduct.startsWith('P2P') && (() => {
                            const aEndCount = Object.values(fidEndAssignments).filter(v => v === 'A End').length;
                            const bEndCount = Object.values(fidEndAssignments).filter(v => v === 'B End').length;
                            const isUnbalanced = aEndCount !== bEndCount;
                            
                            if (selectedFeasibilityItems.length % 2 !== 0 || isUnbalanced) {
                              return (
                                <span className="ml-2 text-yellow-600">
                                  {selectedFeasibilityItems.length % 2 !== 0 
                                    ? `(Need ${selectedFeasibilityItems.length + 1} for even pair)` 
                                    : `(Need equal A End and B End: ${aEndCount} A End, ${bEndCount} B End)`}
                                </span>
                              );
                            }
                            return null;
                          })()}
                        </span>
                        <Button
                          size="sm"
                          disabled={(() => {
                            if (selectedProduct && selectedProduct.startsWith('P2P')) {
                              const aEndCount = Object.values(fidEndAssignments).filter(v => v === 'A End').length;
                              const bEndCount = Object.values(fidEndAssignments).filter(v => v === 'B End').length;
                              return selectedFeasibilityItems.length % 2 !== 0 || aEndCount !== bEndCount;
                            }
                            return false;
                          })()}
                          onClick={() => {
                            // Check if selected product is P2P
                            const isP2P = selectedProduct && selectedProduct.startsWith('P2P');
                            
                            // Validate even number and proper A/B End pairing for P2P
                            if (isP2P) {
                              if (selectedFeasibilityItems.length % 2 !== 0) {
                                toast.error('P2P products require an even number of FIDs. Please select one more FID.');
                                return;
                              }
                              
                              const aEndCount = Object.values(fidEndAssignments).filter(v => v === 'A End').length;
                              const bEndCount = Object.values(fidEndAssignments).filter(v => v === 'B End').length;
                              
                              if (aEndCount !== bEndCount) {
                                toast.error(`P2P products require equal number of A End and B End. Currently: ${aEndCount} A End, ${bEndCount} B End.`);
                                return;
                              }
                            }

                            // Check if any selected FID is already used in proposals
                            const selectedFidsData =
                              filteredFeasibilityPool.filter(
                                (item) =>
                                  selectedFeasibilityItems.includes(
                                    item.fid,
                                  ),
                              );
                            
                            const reusedFidsCheck = selectedFidsData.filter(fid => fid.proposalCount > 0);
                            
                            if (reusedFidsCheck.length > 0) {
                              // Show confirmation dialog
                              setReusedFids(reusedFidsCheck.map(fid => ({
                                fid: fid.fid,
                                proposals: fid.usedInProposals,
                                count: fid.proposalCount
                              })));
                              
                              // Store the action to execute if user confirms
                              setPendingProposalAction(() => () => {
                                // Generate proposal ID
                                const proposalId = `PROP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;
                                const opportunityId = selectedFidsData[0]?.opportunityId || "";
                                
                                if (isP2P) {
                                  const subProduct = selectedProduct.replace('P2P - ', '');
                                  navigate("/configure-p2p-requirement/new", {
                                    state: {
                                      proposalId,
                                      selectedFIDsFromPool: selectedFeasibilityItems,
                                      fidEndAssignments,
                                      company: selectedCompany,
                                      product: "P2P",
                                      subProduct,
                                      opportunityId,
                                    },
                                  });
                                  toast.success(`P2P - ${subProduct} requirement created with ${selectedFeasibilityItems.length} FID(s)`);
                                } else {
                                  // Get full FID data including type and serviceChangeType
                                  const selectedFidsFullData = selectedFidsData.map(fid => ({
                                    fid: fid.fid,
                                    type: fid.type,
                                    serviceChangeType: fid.serviceChangeType,
                                    location: fid.fullAddress || fid.location,
                                    connectionType: fid.connectionType,
                                    bandwidth: fid.bandwidth,
                                    product: fid.product,
                                    currentLinkId: fid.currentLinkId,
                                    currentAddress: fid.currentAddress,
                                    currentBandwidth: fid.currentBandwidth,
                                    currentConnectionType: fid.currentConnectionType,
                                    currentPlan: fid.currentPlan,
                                    currentVAS: fid.currentVAS,
                                  }));
                                  
                                  console.log('=== Creating Proposal (Reused FIDs) ===');
                                  console.log('selectedFidsFullData:', selectedFidsFullData);
                                  
                                  navigate("/configure-proposal", {
                                    state: {
                                      proposalId,
                                      fids: selectedFeasibilityItems,
                                      fidsData: selectedFidsFullData,
                                      company: selectedCompany,
                                      networkProduct: selectedProduct,
                                      lockedProduct: selectedProduct,
                                      isServiceChanges: selectedFidsFullData.some(f => f.type === 'MDAC'),
                                      opportunityId,
                                    },
                                  });
                                  toast.success(`Proposal ${proposalId} created successfully`);
                                }
                              });
                              
                              setFidReuseDialogOpen(true);
                              return;
                            }

                            // Generate proposal ID
                            const proposalId = `PROP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;

                            // Get opportunity ID from first selected FID (reuse selectedFidsData from above)
                            const opportunityId =
                              selectedFidsData[0]
                                ?.opportunityId || "";
                            
                            if (isP2P) {
                              // Extract sub product (GCC, EVPL, EPL, DEPL)
                              const subProduct = selectedProduct.replace('P2P - ', '');
                              
                              // Navigate to P2P Configure Requirement
                              navigate("/configure-p2p-requirement/new", {
                                state: {
                                  proposalId,
                                  selectedFIDsFromPool: selectedFeasibilityItems,
                                  fidEndAssignments,
                                  company: selectedCompany,
                                  product: "P2P",
                                  subProduct,
                                  opportunityId,
                                },
                              });
                              
                              toast.success(
                                `P2P - ${subProduct} requirement created with ${selectedFeasibilityItems.length} FID(s)`,
                              );
                            } else {
                              // Get full FID data including type and serviceChangeType
                              const selectedFidsFullData = selectedFidsData.map(fid => ({
                                fid: fid.fid,
                                type: fid.type,
                                serviceChangeType: fid.serviceChangeType,
                                location: fid.fullAddress || fid.location,
                                connectionType: fid.connectionType,
                                bandwidth: fid.bandwidth,
                                product: fid.product,
                                currentLinkId: fid.currentLinkId,
                                currentAddress: fid.currentAddress,
                                currentBandwidth: fid.currentBandwidth,
                                currentConnectionType: fid.currentConnectionType,
                                currentPlan: fid.currentPlan,
                                currentVAS: fid.currentVAS,
                              }));
                              
                              console.log('=== Creating Proposal ===');
                              console.log('selectedProduct:', selectedProduct);
                              console.log('selectedCompany:', selectedCompany);
                              console.log('selectedFidsFullData:', selectedFidsFullData);
                              console.log('isServiceChanges check:', selectedFidsFullData.some(f => f.type === 'MDAC'));
                              
                              // Debug: Show alert before navigation
                              alert(`About to navigate:\n- selectedProduct: ${selectedProduct}\n- FIDs: ${selectedFidsFullData.length}\n- First FID type: ${selectedFidsFullData[0]?.type}\n- First FID product: ${selectedFidsFullData[0]?.product}`);
                              
                              // Create the state object
                              const navigationState = {
                                proposalId,
                                fids: selectedFeasibilityItems,
                                fidsData: selectedFidsFullData,
                                company: selectedCompany,
                                networkProduct: selectedProduct,
                                lockedProduct: selectedProduct,
                                isServiceChanges: selectedFidsFullData.some(f => f.type === 'MDAC'),
                                opportunityId,
                              };
                              
                              console.log('=== ABOUT TO NAVIGATE ===');
                              console.log('Navigation state object:', navigationState);
                              console.log('Navigation state stringified:', JSON.stringify(navigationState, null, 2));
                              
                              // WORKAROUND: Store in localStorage temporarily
                              localStorage.setItem('proposalNavigationState', JSON.stringify(navigationState));
                              console.log('Stored in localStorage');
                              
                              // Navigate to DIA or MPLS configure proposal
                              navigate("/configure-proposal", {
                                state: navigationState,
                              });

                              toast.success(
                                `Proposal ${proposalId} created successfully`,
                              );
                            }
                          }}
                        >
                          {selectedProduct && selectedProduct.startsWith('P2P') ? 'Configure P2P' : 'Create Proposal'}
                        </Button>
                      </div>
                    )}

                    {/* Sub Tabs moved to top right */}
                    <div className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setFeasibilitySubTab("available")
                        }
                        className={
                          feasibilitySubTab === "available"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "hover:bg-gray-200 hover:text-gray-900"
                        }
                      >
                        Available (
                        {availableFeasibilityItems.length})
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setFeasibilitySubTab("not-available")
                        }
                        className={
                          feasibilitySubTab === "not-available"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "hover:bg-gray-200 hover:text-gray-900"
                        }
                      >
                        Not Available (
                        {notAvailableFeasibilityItems.length})
                      </Button>
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleOpenFilterModal('feasibility')}
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Filters {feasibilityFilterCount > 0 && `(${feasibilityFilterCount})`}
                    </Button>
                  </div>
                </div>

                {/* Table Content based on sub-tab */}
                <div className="flex-1 overflow-auto">
                  {/* Info banner when FIDs are disabled due to type mismatch */}
                  {selectedFeasibilityItems.length > 0 && feasibilitySubTab === "available" && (() => {
                    const firstSelectedFid = mockFeasibilityPool.find(f => f.fid === selectedFeasibilityItems[0]);
                    if (firstSelectedFid) {
                      return (
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-2 mx-4 mt-4">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-blue-700">
                                Only <strong>{firstSelectedFid.type}</strong> FIDs can be selected. Other order types are disabled.
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                  
                  {feasibilitySubTab === "available"
                    ? renderFeasibilityTable(
                        paginatedAvailableItems,
                        true,
                        false, // Don't show Order Status for Available
                      )
                    : renderFeasibilityTable(
                        paginatedNotAvailableItems,
                        false,
                        true, // Show Order Status for Not Available
                      )}
                </div>

                {/* Pagination Controls */}
                {((feasibilitySubTab === "available" && availableFeasibilityItems.length > 0) ||
                  (feasibilitySubTab === "not-available" && notAvailableFeasibilityItems.length > 0)) && (
                  <div className="flex items-center justify-between px-4 py-3 border-t bg-white flex-shrink-0">
                    <div className="text-sm text-gray-700">
                      Showing{' '}
                      <span className="">
                        {feasibilitySubTab === "available" 
                          ? Math.min((currentPage - 1) * itemsPerPage + 1, availableFeasibilityItems.length)
                          : Math.min((currentPage - 1) * itemsPerPage + 1, notAvailableFeasibilityItems.length)}
                      </span>
                      {' '}-{' '}
                      <span className="">
                        {feasibilitySubTab === "available"
                          ? Math.min(currentPage * itemsPerPage, availableFeasibilityItems.length)
                          : Math.min(currentPage * itemsPerPage, notAvailableFeasibilityItems.length)}
                      </span>
                      {' '}of{' '}
                      <span className="">
                        {feasibilitySubTab === "available" 
                          ? availableFeasibilityItems.length 
                          : notAvailableFeasibilityItems.length}
                      </span>
                      {' '}FIDs
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <div className="flex items-center space-x-1">
                        {Array.from(
                          { length: feasibilitySubTab === "available" ? totalAvailablePages : totalNotAvailablePages },
                          (_, i) => i + 1
                        ).map((page) => (
                          <Button
                            key={page}
                            variant={page === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className={page === currentPage ? "bg-slate-800" : ""}
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(
                          feasibilitySubTab === "available" ? totalAvailablePages : totalNotAvailablePages,
                          prev + 1
                        ))}
                        disabled={
                          currentPage === (feasibilitySubTab === "available" ? totalAvailablePages : totalNotAvailablePages)
                        }
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
                </>
                )}
              </TabsContent>

              {/* Proposals Tab */}
              <TabsContent
                value="proposals"
                className="flex-1 overflow-hidden flex flex-col mt-0 space-y-0"
              >
                {!selectedCompany ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center max-w-md">
                      <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-gray-900 mb-2">No Customer Selected</h3>
                      <p className="text-sm text-gray-500">
                        Please select a customer from the dropdown above to view Requirements.
                      </p>
                    </div>
                  </div>
                ) : (
                <>
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                  <div>
                    <h3 className="text-gray-900">
                      Requirements
                    </h3>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleOpenFilterModal('requirements')}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters {requirementsFilterCount > 0 && `(${requirementsFilterCount})`}
                  </Button>
                </div>
                <div className="border rounded-lg overflow-auto flex-1">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Req ID</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Created On</TableHead>
                        <TableHead>Contract Term</TableHead>
                        <TableHead>FIDs</TableHead>
                        <TableHead>Last Updated On</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProposals.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <span className="text-blue-600">
                              {item.proposalId}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                item.service === "MPLS"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : item.service === "DIA"
                                  ? "bg-orange-50 text-orange-700 border-orange-200"
                                  : item.service === "P2P - GCC"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : item.service === "P2P - EVPL"
                                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                  : item.service === "P2P - EPL"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : item.service === "P2P - DEPL"
                                  ? "bg-purple-50 text-purple-700 border-purple-200"
                                  : "bg-gray-50 text-gray-700 border-gray-200"
                              }
                            >
                              {item.service}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {item.location ? (
                              <span className="text-sm text-gray-900">
                                {item.location}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">
                                -
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {item.createdOn}
                          </TableCell>
                          <TableCell>
                            {item.contractTerm === "12 months"
                              ? "1 year"
                              : item.contractTerm ===
                                  "24 months"
                                ? "2 years"
                                : item.contractTerm ===
                                    "36 months"
                                  ? "3 years"
                                  : item.contractTerm}
                          </TableCell>
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge
                                    variant="outline"
                                    className="cursor-pointer"
                                  >
                                    {item.fids.length}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="flex flex-col gap-1">
                                    {item.fids.map(
                                      (fid, idx) => (
                                        <span
                                          key={idx}
                                          className="text-xs"
                                        >
                                          {fid}
                                        </span>
                                      ),
                                    )}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          <TableCell>
                            {item.lastUpdatedOn}
                          </TableCell>
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  {getStatusBadge(item.status)}
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">
                                    {getProposalStatusTooltip(
                                      item.status,
                                    )}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {/* View details - common for all statuses */}
                                <DropdownMenuItem
                                  onClick={() =>
                                    navigate(`/requirement-details/${item.proposalId}`)
                                  }
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </DropdownMenuItem>

                                {/* Status-specific actions */}
                                {item.status === "Draft" && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() =>
                                        navigate(`/requirement-details/${item.proposalId}`, {
                                          state: { openTab: "proposal" }
                                        })
                                      }
                                    >
                                      <Settings className="w-4 h-4 mr-2" />
                                      Configure
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleCancelProposal(item)}
                                    >
                                      <X className="w-4 h-4 mr-2" />
                                      Cancel Proposal
                                    </DropdownMenuItem>
                                  </>
                                )}

                                {item.status === "Proposal Generated" && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => {
                                        navigate(`/add-billing-address`, {
                                          state: {
                                            proposalId: item.proposalId,
                                            company: item.company,
                                            customerId: item.company === "TechCorp Solutions" ? "CL000001" : "CL000002",
                                            opportunityId: `OPP-${item.proposalId.substring(2)}`
                                          }
                                        });
                                      }}
                                    >
                                      {(() => {
                                        const cta = getOrderCTA(item);
                                        const Icon = cta?.icon || ArrowLeft;
                                        const isArrowIcon = Icon === ArrowLeft;
                                        return (
                                          <>
                                            <Icon className={`w-4 h-4 mr-2 ${isArrowIcon ? 'rotate-180' : ''}`} />
                                            {cta?.label || "Move to Order"}
                                          </>
                                        );
                                      })()}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        toast.success('Downloading proposal...');
                                      }}
                                    >
                                      <Download className="w-4 h-4 mr-2" />
                                      Download
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        toast.success('Sharing proposal...');
                                      }}
                                    >
                                      <Share2 className="w-4 h-4 mr-2" />
                                      Share
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        navigate(`/pricing/${item.proposalId}`);
                                      }}
                                    >
                                      <IndianRupee className="w-4 h-4 mr-2" />
                                      Update Price
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleCancelProposal(item)}
                                    >
                                      <X className="w-4 h-4 mr-2" />
                                      Cancel Proposal
                                    </DropdownMenuItem>
                                  </>
                                )}

                                {item.status === "Pending Finance Approval" && (
                                  <>
                                    {/* Only View action - already shown above */}
                                  </>
                                )}

                                {item.status === "Pricing Approved" && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => {
                                        navigate(`/proposal-generation/${item.proposalId}`);
                                      }}
                                    >
                                      <FileText className="w-4 h-4 mr-2" />
                                      Generate Proposal
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleCancelProposal(item)}
                                    >
                                      <X className="w-4 h-4 mr-2" />
                                      Cancel Proposal
                                    </DropdownMenuItem>
                                  </>
                                )}

                                {item.status === "Pricing Rejected" && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => {
                                        navigate(`/pricing-management/${item.proposalId}`);
                                      }}
                                    >
                                      <IndianRupee className="w-4 h-4 mr-2" />
                                      Update Price
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleCancelProposal(item)}
                                    >
                                      <X className="w-4 h-4 mr-2" />
                                      Cancel Proposal
                                    </DropdownMenuItem>
                                  </>
                                )}

                                {item.status === "Proposal Cancelled" && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => {
                                        toast.info(item.cancellationReason || 'Cancellation reason not available');
                                      }}
                                    >
                                      <Info className="w-4 h-4 mr-2" />
                                      View Cancellation Reason
                                    </DropdownMenuItem>
                                  </>
                                )}

                                {item.status === "Auto-Expired" && (
                                  <>
                                    {/* Only View action - already shown above */}
                                  </>
                                )}

                                {item.status === "Order Placed" && (
                                  <>
                                    {/* Only View action - already shown above */}
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
                </>
                )}
              </TabsContent>

              {/* Drafts Tab */}
              <TabsContent
                value="drafts"
                className="flex-1 overflow-hidden flex flex-col mt-0 space-y-0"
              >
                {!selectedCompany ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center max-w-md">
                      <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-gray-900 mb-2">No Customer Selected</h3>
                      <p className="text-sm text-gray-500">
                        Please select a customer from the dropdown above to view Drafts.
                      </p>
                    </div>
                  </div>
                ) : (
                <>
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                  <div>
                    <h3 className="text-gray-900">
                      Draft Service Requests
                    </h3>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleOpenFilterModal('drafts')}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters {draftsFilterCount > 0 && `(${draftsFilterCount})`}
                  </Button>
                </div>
                <div className="border rounded-lg overflow-auto flex-1">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Draft ID</TableHead>
                        <TableHead>Created On</TableHead>
                        <TableHead>Submission Type</TableHead>
                        <TableHead>Last Updated On</TableHead>
                        <TableHead>Count</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDrafts.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <span className="text-blue-600">
                              {item.id}
                            </span>
                          </TableCell>
                          <TableCell>
                            {item.createdOn}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                item.submissionType === "Manual"
                                  ? "bg-gray-50 text-gray-700 border-gray-200"
                                  : "bg-indigo-50 text-indigo-700 border-indigo-200"
                              }
                            >
                              {item.submissionType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {item.lastUpdatedOn}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-900">
                              {item.connections}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleEditDraft(item.id)
                                }
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleDeleteDraft(item.id)
                                }
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
                </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Draft</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this draft? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* FID Reuse Confirmation Dialog */}
      <AlertDialog open={fidReuseDialogOpen} onOpenChange={setFidReuseDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>FID Already Used in Proposal</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  The following FID(s) are already used in other proposals:
                </p>
                <div className="space-y-2">
                  {reusedFids.map((item, idx) => (
                    <div key={idx} className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-sm font-medium text-gray-900">FID: {item.fid}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Used in: {item.proposals.join(', ')}
                      </p>
                      {item.count === 2 && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-red-700">
                            <strong>Warning:</strong> This FID has been used 2 times. If you continue, this will be the 3rd and final usage. After this, the FID will move to "Not Available".
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-sm text-gray-600">
                  Do you want to continue creating a new proposal with {reusedFids.length > 1 ? 'these FIDs' : 'this FID'}?
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setFidReuseDialogOpen(false);
              setPendingProposalAction(null);
              setReusedFids([]);
            }}>
              No, Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingProposalAction) {
                  pendingProposalAction();
                }
                setFidReuseDialogOpen(false);
                setPendingProposalAction(null);
                setReusedFids([]);
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Yes, Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* FID Details Modal */}
      {selectedFidData && (
        <FIDDetailsModal
          open={fidDetailsOpen}
          onOpenChange={setFidDetailsOpen}
          fidData={{
            fid: selectedFidData.fid,
            type: selectedFidData.type,
            product: "DIA",
            requestDate: "2025-09-24",
            feasibilityDate: "2025-10-04",
            expiresOn: selectedFidData.expiresOn,
            linkType: selectedFidData.linkType,
            feasibilityStatus:
              selectedFidData.feasibilityStatus,
            orderStatus: selectedFidData.orderStatus,
            proposalId: selectedFidData.orderStatus
              ? "NW000226"
              : undefined,
            orderId:
              selectedFidData.orderStatus === "Order Placed" ||
              selectedFidData.orderStatus === "Order Completed"
                ? "ORD87934"
                : undefined,
            connectionType: selectedFidData.connectionType,
            bandwidth: selectedFidData.bandwidth,
            location: selectedFidData.location,
            fullAddress: selectedFidData.fullAddress,
            latitude: selectedFidData.latitude,
            longitude: selectedFidData.longitude,
            contactName: "Venkatesh Kumar",
            contactPhone: "+ 91 8898787656",
            contactEmail: "rajesh.kumar@company.com",
          }}
        />
      )}

      {/* Re-push Feasibility Dialog (Simple) */}
      <Dialog open={repushDialogOpen} onOpenChange={setRepushDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Re-push Feasibility</DialogTitle>
            <DialogDescription>
              This FID {selectedRepushFid?.fid} will be sent again for availability and pricing check. You will be notified once the updated response is ready.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRepushDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmRepushFeasibility}>
              Re-push Feasibility
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Re-push Feasibility Alert (With Proposal Warning) */}
      <AlertDialog open={repushAlertOpen} onOpenChange={setRepushAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Re-push Feasibility</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <div className="text-gray-900">
                  This FID {selectedRepushFid?.fid} is already part of an existing proposal{' '}
                  {mockProposals.find(p => p.fids.includes(selectedRepushFid?.fid || ''))?.proposalId}
                </div>
                <div>
                  Proceeding will discard the old proposal with all FIDs associated with it.
                  Are you sure you want to Re-push feasibility for this FID?
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRepushAlertOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmRepushFeasibility}>
              Re-push Feasibility
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Proposal Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Proposal</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel proposal {selectedProposalToCancel?.proposalId}? 
              This action will mark the proposal as cancelled. Please provide a reason below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cancel-reason">Cancellation Reason *</Label>
              <Input
                id="cancel-reason"
                placeholder="Enter reason for cancellation..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                This will be recorded as "Cancelled by CP - [your reason]"
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setCancelDialogOpen(false);
                setCancelReason("");
                setSelectedProposalToCancel(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmCancelProposal}
              variant="destructive"
            >
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filter Modal */}
      <Sheet open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
        <SheetContent side="right" className="w-[400px] sm:w-[500px] overflow-y-auto p-6">
          <SheetHeader className="mb-6">
            <SheetTitle>
              {activeFilterTab === 'feasibility' && 'Filter Feasibility Pool'}
              {activeFilterTab === 'requirements' && 'Filter Requirements'}
              {activeFilterTab === 'drafts' && 'Filter Drafts'}
            </SheetTitle>
            <SheetDescription>
              Apply filters to narrow down the results.
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-4">
            {activeFilterTab === 'feasibility' && (
              <>
                {/* Product Type Filter - Compact 2-column layout */}
                <div className="space-y-2">
                  <Label className="text-sm">Product Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {feasibilityFilterOptions.products.map((product, idx) => (
                      <div key={`product-${idx}-${product}`} className="flex items-center space-x-2">
                        <Checkbox
                          id={`product-${product}`}
                          checked={feasibilityFilters.products.includes(product)}
                          onCheckedChange={(checked) => handleFilterChange('products', product, checked as boolean)}
                        />
                        <label htmlFor={`product-${product}`} className="text-sm cursor-pointer">
                          {product}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Type Filter - Horizontal layout */}
                <div className="space-y-2">
                  <Label className="text-sm">Order Type</Label>
                  <div className="flex items-center gap-4">
                    {feasibilityFilterOptions.types.map((type, idx) => (
                      <div key={`type-${idx}-${type}`} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type}`}
                          checked={feasibilityFilters.types.includes(type)}
                          onCheckedChange={(checked) => handleFilterChange('types', type, checked as boolean)}
                        />
                        <label htmlFor={`type-${type}`} className="text-sm cursor-pointer">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Service Change Type Filter - Show only when MDAC is selected */}
                {feasibilityFilters.types.includes('MDAC') && (
                  <div className="space-y-2 pl-6 border-l-2 border-orange-200">
                    <Label className="text-sm">Change Type</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {feasibilityFilterOptions.serviceChangeTypes.map((changeType, idx) => (
                        <div key={`change-type-${idx}-${changeType}`} className="flex items-center space-x-2">
                          <Checkbox
                            id={`change-type-${changeType}`}
                            checked={feasibilityFilters.serviceChangeTypes.includes(changeType)}
                            onCheckedChange={(checked) => handleFilterChange('serviceChangeTypes', changeType, checked as boolean)}
                          />
                          <label htmlFor={`change-type-${changeType}`} className="text-xs cursor-pointer">
                            {changeType}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location Filter - Search based */}
                <div className="space-y-2">
                  <Label className="text-sm">Location</Label>
                  <Input
                    type="text"
                    placeholder="Search location..."
                    value={locationSearchQuery}
                    onChange={(e) => setLocationSearchQuery(e.target.value)}
                    className="h-9"
                  />
                  {locationSearchQuery && (
                    <div className="max-h-40 overflow-y-auto border rounded-md p-2 space-y-1.5">
                      {feasibilityFilterOptions.locations
                        .filter(loc => loc.toLowerCase().includes(locationSearchQuery.toLowerCase()))
                        .map((location, idx) => (
                          <div key={`location-${idx}-${location}`} className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded">
                            <Checkbox
                              id={`location-${location}`}
                              checked={feasibilityFilters.locations.includes(location)}
                              onCheckedChange={(checked) => handleFilterChange('locations', location, checked as boolean)}
                            />
                            <label htmlFor={`location-${location}`} className="text-sm cursor-pointer flex-1">
                              {location}
                            </label>
                          </div>
                        ))}
                    </div>
                  )}
                  {feasibilityFilters.locations.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {feasibilityFilters.locations.map((loc) => (
                        <Badge key={loc} variant="outline" className="text-xs">
                          {loc}
                          <button
                            onClick={() => handleFilterChange('locations', loc, false)}
                            className="ml-1 hover:text-red-600"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* LM Type Filter - Compact with Other ISP provider selection */}
                <div className="space-y-2">
                  <Label className="text-sm">LM Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {feasibilityFilterOptions.connectionTypes.map((connType, idx) => (
                      <div key={`connType-${idx}-${connType}`} className="flex items-center space-x-2">
                        <Checkbox
                          id={`connType-${connType}`}
                          checked={feasibilityFilters.connectionTypes.includes(connType)}
                          onCheckedChange={(checked) => handleFilterChange('connectionTypes', connType, checked as boolean)}
                        />
                        <label htmlFor={`connType-${connType}`} className="text-sm cursor-pointer">
                          {connType}
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  {/* Service Provider selection for Other ISP */}
                  {feasibilityFilters.connectionTypes.includes('Other ISP') && (
                    <div className="mt-3 pl-6 space-y-2 border-l-2 border-blue-200">
                      <Label className="text-xs text-gray-600">Service Provider</Label>
                      <div className="space-y-1.5">
                        {feasibilityFilterOptions.serviceProviders.map((provider) => (
                          <div key={provider} className="flex items-center space-x-2">
                            <Checkbox
                              id={`provider-${provider}`}
                              checked={selectedOtherISPProvider.includes(provider)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedOtherISPProvider([...selectedOtherISPProvider, provider]);
                                } else {
                                  setSelectedOtherISPProvider(selectedOtherISPProvider.filter(p => p !== provider));
                                }
                              }}
                            />
                            <label htmlFor={`provider-${provider}`} className="text-xs cursor-pointer">
                              {provider}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bandwidth Filter - Search based with multi-select */}
                <div className="space-y-2">
                  <Label className="text-sm">Bandwidth</Label>
                  <Input
                    type="text"
                    placeholder="Search bandwidth..."
                    value={bandwidthSearchQuery}
                    onChange={(e) => setBandwidthSearchQuery(e.target.value)}
                    className="h-9"
                  />
                  {bandwidthSearchQuery && (
                    <div className="max-h-40 overflow-y-auto border rounded-md p-2 space-y-1.5">
                      {feasibilityFilterOptions.bandwidths
                        .filter(bw => bw.toLowerCase().includes(bandwidthSearchQuery.toLowerCase()))
                        .map((bandwidth, idx) => (
                          <div key={`bandwidth-${idx}-${bandwidth}`} className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded">
                            <Checkbox
                              id={`bandwidth-${bandwidth}`}
                              checked={feasibilityFilters.bandwidths.includes(bandwidth)}
                              onCheckedChange={(checked) => handleFilterChange('bandwidths', bandwidth, checked as boolean)}
                            />
                            <label htmlFor={`bandwidth-${bandwidth}`} className="text-sm cursor-pointer flex-1">
                              {bandwidth}
                            </label>
                          </div>
                        ))}
                    </div>
                  )}
                  {feasibilityFilters.bandwidths.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {feasibilityFilters.bandwidths.map((bw) => (
                        <Badge key={bw} variant="outline" className="text-xs">
                          {bw}
                          <button
                            onClick={() => handleFilterChange('bandwidths', bw, false)}
                            className="ml-1 hover:text-red-600"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Feasibility Status Filter - Compact 2-column layout */}
                <div className="space-y-2">
                  <Label className="text-sm">Feasibility Status</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {feasibilityFilterOptions.feasibilityStatuses.map((status, idx) => (
                      <div key={`feas-status-${idx}-${status}`} className="flex items-center space-x-2">
                        <Checkbox
                          id={`status-${status}`}
                          checked={feasibilityFilters.feasibilityStatuses.includes(status)}
                          onCheckedChange={(checked) => handleFilterChange('feasibilityStatuses', status, checked as boolean)}
                        />
                        <label htmlFor={`status-${status}`} className="text-xs cursor-pointer">
                          {status}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeFilterTab === 'requirements' && (
              <>
                {/* Service Filter */}
                <div className="space-y-2">
                  <Label className="text-sm">Service</Label>
                  <div className="space-y-2">
                    {requirementsFilterOptions.services.map((service, idx) => (
                      <div key={`service-${idx}-${service}`} className="flex items-center space-x-2">
                        <Checkbox
                          id={`service-${service}`}
                          checked={requirementsFilters.services.includes(service)}
                          onCheckedChange={(checked) => handleFilterChange('services', service, checked as boolean)}
                        />
                        <label htmlFor={`service-${service}`} className="text-sm cursor-pointer">
                          {service}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <Label className="text-sm">Status</Label>
                  <div className="space-y-2">
                    {requirementsFilterOptions.statuses.map((status, idx) => (
                      <div key={`req-status-${idx}-${status}`} className="flex items-center space-x-2">
                        <Checkbox
                          id={`req-status-${status}`}
                          checked={requirementsFilters.statuses.includes(status)}
                          onCheckedChange={(checked) => handleFilterChange('statuses', status, checked as boolean)}
                        />
                        <label htmlFor={`req-status-${status}`} className="text-sm cursor-pointer">
                          {status}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location Filter */}
                {requirementsFilterOptions.locations.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm">Location</Label>
                    <div className="space-y-2">
                      {requirementsFilterOptions.locations.map((location, idx) => (
                        <div key={`req-location-${idx}-${location}`} className="flex items-center space-x-2">
                          <Checkbox
                            id={`req-location-${location}`}
                            checked={requirementsFilters.locations.includes(location)}
                            onCheckedChange={(checked) => handleFilterChange('locations', location, checked as boolean)}
                          />
                          <label htmlFor={`req-location-${location}`} className="text-sm cursor-pointer">
                            {location}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contract Term Filter */}
                <div className="space-y-2">
                  <Label className="text-sm">Contract Term</Label>
                  <div className="space-y-2">
                    {requirementsFilterOptions.contractTerms.map((term, idx) => (
                      <div key={`term-${idx}-${term}`} className="flex items-center space-x-2">
                        <Checkbox
                          id={`term-${term}`}
                          checked={requirementsFilters.contractTerms.includes(term)}
                          onCheckedChange={(checked) => handleFilterChange('contractTerms', term, checked as boolean)}
                        />
                        <label htmlFor={`term-${term}`} className="text-sm cursor-pointer">
                          {term}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeFilterTab === 'drafts' && (
              <>
                {/* Submission Type Filter */}
                <div className="space-y-2">
                  <Label className="text-sm">Submission Type</Label>
                  <div className="space-y-2">
                    {draftsFilterOptions.submissionTypes.map((type, idx) => (
                      <div key={`submission-${idx}-${type}`} className="flex items-center space-x-2">
                        <Checkbox
                          id={`submission-${type}`}
                          checked={draftsFilters.submissionTypes.includes(type)}
                          onCheckedChange={(checked) => handleFilterChange('submissionTypes', type, checked as boolean)}
                        />
                        <label htmlFor={`submission-${type}`} className="text-sm cursor-pointer">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Service Filter */}
                <div className="space-y-2">
                  <Label className="text-sm">Service</Label>
                  <div className="space-y-2">
                    {draftsFilterOptions.services.map((service, idx) => (
                      <div key={`draft-service-${idx}-${service}`} className="flex items-center space-x-2">
                        <Checkbox
                          id={`draft-service-${service}`}
                          checked={draftsFilters.services.includes(service)}
                          onCheckedChange={(checked) => handleFilterChange('services', service, checked as boolean)}
                        />
                        <label htmlFor={`draft-service-${service}`} className="text-sm cursor-pointer">
                          {service}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="flex-1"
            >
              Clear Filters
            </Button>
            <Button
              className="bg-slate-800 hover:bg-slate-900 flex-1"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
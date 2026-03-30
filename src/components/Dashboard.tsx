import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  Plus, 
  Building, 
  Users, 
  FileText, 
  Calendar,
  TrendingUp,
  IndianRupee,
  Activity,
  Search,
  Eye,
  AlertCircle,
  Clock,
  CheckCircle,
  Target,
  MessageSquare,
  BookOpen,
  Phone,
  Mail,
  BarChart3,
  ChevronRight,
  Zap,
  Bell,
  Star,
  Download,
  Filter,
  ArrowUpRight,
  Server,
  Cloud,
  Network,
  Settings,
  FileCheck,
  CreditCard,
  AlertTriangle,
  Package,
  ShoppingCart,
  Briefcase,
  Globe,
  Shield,
  Database,
  Layers,
  Box,
  Cpu,
  HardDrive,
  Edit,
  MoreVertical,
  FilePlus,
  ArrowRight,
  RefreshCw,
  ChevronDown,
  UserPlus,
  UserMinus,
  Wallet,
  Info,
  Trash2,
  ExternalLink,
  Share2
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

// Mock data
const allRequirementManagementData = [
  {
    id: "NW00009",
    product: "Network - DIA",
    priority: "High",
    name: "DIA 200 Mbps Enterprise Link",
    createdDate: "2024-11-10",
    customerName: "Global Solutions Ltd",
    customerId: "GS009",
    status: "Draft",
    opportunityId: "OPP-NW009",
    opportunityStage: "Discovery",
    version: "v1.0"
  },
  {
    id: "NW00010",
    product: "Network - MPLS",
    priority: "Medium",
    name: "MPLS Hub & Spoke Setup",
    createdDate: "2024-11-11",
    customerName: "Enterprise Networks Inc",
    customerId: "EN010",
    status: "Generated",
    opportunityId: "OPP-NW010",
    opportunityStage: "Proposal",
    version: "v1.1"
  },
  {
    id: "NW00005",
    product: "Network - DIA",
    priority: "High",
    name: "DIA 1 Gbps Primary Link",
    createdDate: "2024-11-05",
    customerName: "Media Streaming Co",
    customerId: "MS005",
    status: "Awaiting Acceptance",
    opportunityId: "OPP-NW005",
    opportunityStage: "Proposal Submitted",
    version: "v1.2"
  },
  {
    id: "NW00006",
    product: "Network - DIA",
    priority: "Critical",
    name: "DIA 500 Mbps Redundant Setup",
    createdDate: "2024-11-06",
    customerName: "FinTech Innovations",
    customerId: "FI006",
    status: "Customer Accepted",
    opportunityId: "OPP-NW006",
    opportunityStage: "Negotiation",
    version: "v2.0"
  },
  {
    id: "NW00007",
    product: "Network - DIA",
    priority: "Low",
    name: "DIA 50 Mbps for Remote Office",
    createdDate: "2024-11-07",
    customerName: "StartupHub Inc",
    customerId: "SH007",
    status: "Customer Rejected",
    opportunityId: "OPP-NW007",
    opportunityStage: "Closed Lost",
    version: "v1.0"
  },
  {
    id: "NW00008",
    product: "Network - DIA",
    priority: "High",
    name: "DIA 1 Gbps for Production",
    createdDate: "2024-11-08",
    customerName: "Manufacturing Pro",
    customerId: "MP008",
    status: "Order Signed",
    opportunityId: "OPP-NW008",
    opportunityStage: "Closed Won",
    version: "v2.1"
  },
  {
    id: "DC000001",
    product: "DC",
    priority: "High",
    name: "High-Density DC Feasibility Study",
    createdDate: "2024-12-10",
    customerName: "NextGen Data Systems",
    customerId: "NG001",
    status: "Feasibility in Progress",
    opportunityId: "OPP-DC001",
    opportunityStage: "Qualification",
    version: "v1.0"
  },
  {
    id: "DC000002",
    product: "DC",
    priority: "Medium",
    name: "Custom Rack Solution Design",
    createdDate: "2024-12-12",
    customerName: "BrightWave Technologies",
    customerId: "BW002",
    status: "Solution in Progress",
    opportunityId: "OPP-DC002",
    opportunityStage: "Captured SOW",
    version: "v1.1"
  },
  {
    id: "DC000003",
    product: "DC",
    priority: "Critical",
    name: "Turnkey DC Solution Proposal",
    createdDate: "2024-12-15",
    customerName: "AlphaEdge Enterprises",
    customerId: "AE003",
    status: "Ready for Customer",
    opportunityId: "OPP-DC003",
    opportunityStage: "Proposal Submitted",
    version: "v1.2"
  },
  {
    id: "DC000004",
    product: "DC",
    priority: "Low",
    name: "Basic DC Requirement Draft",
    createdDate: "2024-12-05",
    customerName: "DataFirst Pvt Ltd",
    customerId: "DF004",
    status: "Draft",
    opportunityId: "OPP-DC004",
    opportunityStage: "Qualification",
    version: "v1.0"
  },
  {
    id: "DC000005",
    product: "DC",
    priority: "Low",
    name: "Unfeasible Power & Cooling Requirement",
    createdDate: "2024-12-18",
    customerName: "Visionary Networks",
    customerId: "VN005",
    status: "Not Feasible",
    opportunityId: "OPP-DC005",
    opportunityStage: "Disqualified",
    version: "v1.0"
  },
  {
    id: "NW00011",
    product: "Network - DIA",
    priority: "Critical",
    name: "DIA 2 Gbps Enterprise Link",
    createdDate: "2024-11-11",
    customerName: "Healthcare Systems",
    customerId: "HS011",
    status: "Customer Accepted",
    opportunityId: "OPP-NW011",
    opportunityStage: "Negotiation",
    version: "v1.3"
  },
  {
    id: "NW00012",
    product: "Network - DIA",
    priority: "Low",
    name: "DIA 100 Mbps Test Environment",
    createdDate: "2024-11-12",
    customerName: "Software Labs",
    customerId: "SL012",
    status: "Awaiting Acceptance",
    opportunityId: "OPP-NW012",
    opportunityStage: "Proposal Submitted",
    version: "v1.0"
  },
  {
    id: "NW00013",
    product: "Network - DIA",
    priority: "Medium",
    name: "DIA 300 Mbps for HQ",
    createdDate: "2024-11-13",
    customerName: "Logistics Solutions",
    customerId: "LS013",
    status: "Order Signed",
    opportunityId: "OPP-NW013",
    opportunityStage: "Closed Won",
    version: "v1.5"
  },
  {
    id: "MPLS00001",
    product: "Network - MPLS",
    priority: "High",
    name: "MPLS 100 Mbps Multi-Site Connectivity",
    createdDate: "2024-11-14",
    customerName: "TechCorp Solutions",
    customerId: "TC001",
    status: "Awaiting Acceptance",
    opportunityId: "OPP-MPLS001",
    opportunityStage: "Proposal Submitted",
    version: "v1.0"
  },
  {
    id: "MPLS00002",
    product: "Network - MPLS",
    priority: "Critical",
    name: "MPLS 500 Mbps Enterprise Network",
    createdDate: "2024-11-15",
    customerName: "Global Enterprises",
    customerId: "GE002",
    status: "Customer Accepted",
    opportunityId: "OPP-MPLS002",
    opportunityStage: "Negotiation",
    version: "v1.1"
  },
  {
    id: "MPLS00003",
    product: "Network - MPLS",
    priority: "Medium",
    name: "MPLS 200 Mbps Branch Network",
    createdDate: "2024-11-16",
    customerName: "SecureBank Ltd",
    customerId: "SB004",
    status: "Order Signed",
    opportunityId: "OPP-MPLS003",
    opportunityStage: "Closed Won",
    version: "v1.2"
  },
  {
    id: "MPLS00004",
    product: "Network - MPLS",
    priority: "High",
    name: "MPLS 1 Gbps Headquarters Link",
    createdDate: "2024-11-17",
    customerName: "FinTech Innovations",
    customerId: "FI006",
    status: "Awaiting Acceptance",
    opportunityId: "OPP-MPLS004",
    opportunityStage: "Proposal Submitted",
    version: "v1.0"
  },
  {
    id: "MPLS00005",
    product: "Network - MPLS",
    priority: "Low",
    name: "MPLS 50 Mbps Regional Office",
    createdDate: "2024-11-18",
    customerName: "Retail Chain Stores",
    customerId: "RC009",
    status: "Customer Rejected",
    opportunityId: "OPP-MPLS005",
    opportunityStage: "Closed Lost",
    version: "v1.0"
  },
  {
    id: "MPLS00006",
    product: "Network - MPLS",
    priority: "Critical",
    name: "MPLS 2 Gbps National Network",
    createdDate: "2024-11-19",
    customerName: "Healthcare Systems",
    customerId: "HS011",
    status: "Customer Accepted",
    opportunityId: "OPP-MPLS006",
    opportunityStage: "Negotiation",
    version: "v1.3"
  },
  {
    id: "MPLS00007",
    product: "Network - MPLS",
    priority: "High",
    name: "MPLS 750 Mbps Data Center Link",
    createdDate: "2024-11-20",
    customerName: "CloudNext Pvt Ltd",
    customerId: "CN003",
    status: "Order Signed",
    opportunityId: "OPP-MPLS007",
    opportunityStage: "Closed Won",
    version: "v2.0"
  }
];

const productCatalogData = {
  cloudInfinite: [
    { 
      name: "Cloud Compute - Basic", 
      sku: "CC-BAS-001", 
      price: "₹12,500/month", 
      category: "Compute",
      version: "v3.2",
      description: "Entry-level cloud compute instance with 2 vCPUs, 4GB RAM, and 50GB SSD storage. Ideal for development and testing environments.",
      manager: { name: "Rajesh Kumar", email: "rajesh.kumar@onesify.com", phone: "+91 98765 43210" },
      stats: { customers: 142, usage: "78%", revenue: "₹17.75L/month" },
      lastUpdated: "2024-10-15"
    },
    { 
      name: "Cloud Compute - Pro", 
      sku: "CC-PRO-001", 
      price: "₹28,500/month", 
      category: "Compute",
      version: "v3.2",
      description: "Professional cloud compute instance with 8 vCPUs, 16GB RAM, and 200GB SSD storage. Perfect for production workloads.",
      manager: { name: "Rajesh Kumar", email: "rajesh.kumar@onesify.com", phone: "+91 98765 43210" },
      stats: { customers: 98, usage: "85%", revenue: "₹27.93L/month" },
      lastUpdated: "2024-10-15"
    },
    { 
      name: "Cloud Storage - 1TB", 
      sku: "CS-1TB-001", 
      price: "₹8,500/month", 
      category: "Storage",
      version: "v2.5",
      description: "High-performance object storage with 1TB capacity, 99.99% uptime SLA, and automated backup capabilities.",
      manager: { name: "Priya Sharma", email: "priya.sharma@onesify.com", phone: "+91 98765 43211" },
      stats: { customers: 215, usage: "92%", revenue: "₹18.28L/month" },
      lastUpdated: "2024-10-20"
    },
    { 
      name: "Cloud Storage - 5TB", 
      sku: "CS-5TB-001", 
      price: "₹38,000/month", 
      category: "Storage",
      version: "v2.5",
      description: "Enterprise-grade object storage with 5TB capacity, multi-region replication, and advanced data lifecycle management.",
      manager: { name: "Priya Sharma", email: "priya.sharma@onesify.com", phone: "+91 98765 43211" },
      stats: { customers: 67, usage: "88%", revenue: "₹25.46L/month" },
      lastUpdated: "2024-10-20"
    }
  ],
  managedServices: [
    { 
      name: "24x7 Monitoring", 
      sku: "MS-MON-001", 
      price: "₹45,000/month", 
      category: "Monitoring",
      version: "v4.1",
      description: "Comprehensive infrastructure monitoring with real-time alerts, custom dashboards, and automated incident response.",
      manager: { name: "Amit Patel", email: "amit.patel@onesify.com", phone: "+91 98765 43212" },
      stats: { customers: 186, usage: "94%", revenue: "₹83.70L/month" },
      lastUpdated: "2024-10-25"
    },
    { 
      name: "Database Management", 
      sku: "MS-DB-001", 
      price: "₹65,000/month", 
      category: "Database",
      version: "v3.8",
      description: "Fully managed database service with automated backups, performance tuning, and 24x7 DBA support.",
      manager: { name: "Amit Patel", email: "amit.patel@onesify.com", phone: "+91 98765 43212" },
      stats: { customers: 124, usage: "91%", revenue: "₹80.60L/month" },
      lastUpdated: "2024-10-22"
    },
    { 
      name: "Security Management", 
      sku: "MS-SEC-001", 
      price: "₹85,000/month", 
      category: "Security",
      version: "v5.0",
      description: "Enterprise security suite with SIEM, threat detection, vulnerability scanning, and compliance management.",
      manager: { name: "Sneha Reddy", email: "sneha.reddy@onesify.com", phone: "+91 98765 43213" },
      stats: { customers: 93, usage: "87%", revenue: "₹79.05L/month" },
      lastUpdated: "2024-10-28"
    },
    { 
      name: "Backup & DR", 
      sku: "MS-BDR-001", 
      price: "₹55,000/month", 
      category: "Backup",
      version: "v3.5",
      description: "Automated backup and disaster recovery solution with RPO < 15 mins, RTO < 4 hours, and geo-redundant storage.",
      manager: { name: "Vikram Singh", email: "vikram.singh@onesify.com", phone: "+91 98765 43214" },
      stats: { customers: 156, usage: "89%", revenue: "₹85.80L/month" },
      lastUpdated: "2024-10-18"
    }
  ],
  dcColocation: [
    { 
      name: "Quarter Rack", 
      sku: "DC-QR-001", 
      price: "₹35,000/month", 
      category: "Rack Space",
      version: "v2.0",
      description: "10U rack space in Tier III data center with 2kW power, redundant cooling, and 24x7 physical security.",
      manager: { name: "Karthik Menon", email: "karthik.menon@onesify.com", phone: "+91 98765 43215" },
      stats: { customers: 234, usage: "96%", revenue: "₹81.90L/month" },
      lastUpdated: "2024-10-12"
    },
    { 
      name: "Half Rack", 
      sku: "DC-HR-001", 
      price: "₹65,000/month", 
      category: "Rack Space",
      version: "v2.0",
      description: "21U rack space in Tier III data center with 4kW power, dual power feeds, and biometric access control.",
      manager: { name: "Karthik Menon", email: "karthik.menon@onesify.com", phone: "+91 98765 43215" },
      stats: { customers: 178, usage: "93%", revenue: "₹1.16Cr/month" },
      lastUpdated: "2024-10-12"
    },
    { 
      name: "Full Rack", 
      sku: "DC-FR-001", 
      price: "₹1,20,000/month", 
      category: "Rack Space",
      version: "v2.0",
      description: "42U rack space in Tier III data center with 8kW power, N+1 cooling redundancy, and dedicated cross-connects.",
      manager: { name: "Deepa Iyer", email: "deepa.iyer@onesify.com", phone: "+91 98765 43216" },
      stats: { customers: 145, usage: "91%", revenue: "₹1.74Cr/month" },
      lastUpdated: "2024-10-12"
    },
    { 
      name: "Power - 5kW", 
      sku: "DC-PWR-5K", 
      price: "₹15,000/month", 
      category: "Power",
      version: "v1.8",
      description: "Additional 5kW power allocation with dual feeds, metered billing, and 99.99% uptime guarantee.",
      manager: { name: "Deepa Iyer", email: "deepa.iyer@onesify.com", phone: "+91 98765 43216" },
      stats: { customers: 312, usage: "88%", revenue: "₹46.80L/month" },
      lastUpdated: "2024-10-05"
    }
  ],
  network: [
    { 
      name: "Internet - 100 Mbps", 
      sku: "NET-INT-100", 
      price: "₹18,000/month", 
      category: "Internet",
      version: "v3.0",
      description: "Dedicated Internet Access with 100 Mbps bandwidth, 1:1 contention ratio, BGP routing, and 99.9% uptime SLA.",
      manager: { name: "Suresh Nair", email: "suresh.nair@onesify.com", phone: "+91 98765 43217" },
      stats: { customers: 267, usage: "95%", revenue: "₹48.06L/month" },
      lastUpdated: "2024-10-30"
    },
    { 
      name: "Internet - 1 Gbps", 
      sku: "NET-INT-1G", 
      price: "₹95,000/month", 
      category: "Internet",
      version: "v3.0",
      description: "Enterprise DIA with 1 Gbps bandwidth, multi-homed BGP, DDoS protection, and 99.95% uptime SLA.",
      manager: { name: "Suresh Nair", email: "suresh.nair@onesify.com", phone: "+91 98765 43217" },
      stats: { customers: 89, usage: "84%", revenue: "₹84.55L/month" },
      lastUpdated: "2024-10-30"
    },
    { 
      name: "MPLS - 10 Mbps", 
      sku: "NET-MPLS-10", 
      price: "₹25,000/month", 
      category: "MPLS",
      version: "v2.7",
      description: "Managed MPLS WAN connectivity with 10 Mbps CIR, QoS support, and full mesh topology for multi-site networks.",
      manager: { name: "Ananya Das", email: "ananya.das@onesify.com", phone: "+91 98765 43218" },
      stats: { customers: 145, usage: "79%", revenue: "₹36.25L/month" },
      lastUpdated: "2024-10-27"
    },
    { 
      name: "Dark Fiber", 
      sku: "NET-DF-001", 
      price: "₹1,50,000/month", 
      category: "Fiber",
      version: "v1.5",
      description: "Dedicated dark fiber infrastructure for unlimited bandwidth scalability with full control and customization.",
      manager: { name: "Ananya Das", email: "ananya.das@onesify.com", phone: "+91 98765 43218" },
      stats: { customers: 34, usage: "68%", revenue: "₹51.00L/month" },
      lastUpdated: "2024-10-10"
    }
  ]
};

const renewalsData = [
  {
    id: "REN-001",
    customerName: "Tech Corp India",
    serviceType: "DC Colocation",
    currentValue: "₹12,50,000",
    renewalDate: "15/12/2025",
    status: "Upcoming",
    probability: "85%"
  },
  {
    id: "REN-002",
    customerName: "Digital Solutions",
    serviceType: "Managed Services",
    currentValue: "₹8,75,000",
    renewalDate: "22/11/2025",
    status: "In Discussion",
    probability: "70%"
  },
  {
    id: "REN-003",
    customerName: "Cloud Innovations",
    serviceType: "Cloud Infinite",
    currentValue: "₹15,20,000",
    renewalDate: "30/01/2026",
    status: "Upcoming",
    probability: "90%"
  }
];

const financeData = [
  {
    id: "INV-2025-001",
    customerName: "Tech Corp India",
    invoiceAmount: "₹8,50,000",
    dueDate: "10/11/2025",
    status: "Paid",
    paymentDate: "08/11/2025"
  },
  {
    id: "INV-2025-002",
    customerName: "Digital Solutions",
    invoiceAmount: "₹6,20,000",
    dueDate: "15/11/2025",
    status: "Pending",
    paymentDate: "-"
  },
  {
    id: "INV-2025-003",
    customerName: "Enterprise Systems",
    invoiceAmount: "₹12,80,000",
    dueDate: "05/11/2025",
    status: "Overdue",
    paymentDate: "-"
  }
];

const recentActivitiesData = [
  {
    id: 1,
    action: "Pricing Updated",
    customer: "Tech Corp India - CL000001",
    description: "Revised compute pricing from ₹45K to ₹42K per month",
    time: "2 hours ago",
    icon: "IndianRupee",
    color: "blue"
  },
  {
    id: 2,
    action: "New Feasibility request submitted",
    customer: "Digital Solutions Ltd - DC000005",
    description: "DC infrastructure sent to operations for feasibility check",
    time: "4 hours ago",
    icon: "FileCheck",
    color: "green"
  },
  {
    id: 3,
    action: "Customer Meeting Scheduled",
    customer: "Cloud Innovations Pvt - Tomorrow 2 PM",
    description: "Technical review and implementation timeline discussion",
    time: "1 day ago",
    icon: "Calendar",
    color: "purple"
  },
  {
    id: 4,
    action: "Finance Approval Received",
    customer: "Global Enterprises Ltd - CL000043",
    description: "Pricing approved for multi-cloud strategy implementation",
    time: "1 day ago",
    icon: "CheckCircle",
    color: "green"
  }
];

const recentlyAddedOpportunitiesData = [
  {
    opportunityId: "OPP-2025-045",
    customerName: "NextGen Solutions Ltd",
    status: "Qualification",
    leadBUType: "Network",
    createdOn: "2025-11-04",
    value: "₹22,00,000"
  },
  {
    opportunityId: "OPP-2025-042",
    customerName: "TechVenture Partners",
    status: "Qualification",
    leadBUType: "Network",
    createdOn: "2025-11-01",
    value: "₹28,00,000"
  },
  {
    opportunityId: "OPP-2025-041",
    customerName: "CloudFirst Technologies",
    status: "Negotiation",
    leadBUType: "Colocation",
    createdOn: "2025-10-31",
    value: "₹42,00,000"
  }
];

const getStatusBadge = (status: string) => {
  const statusConfig = {
    "Pending": { color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    "In Progress": { color: "bg-blue-100 text-blue-700 border-blue-200" },
    "Under Review": { color: "bg-purple-100 text-purple-700 border-purple-200" },
    "Completed": { color: "bg-green-100 text-green-700 border-green-200" },
    "Upcoming": { color: "bg-blue-100 text-blue-700 border-blue-200" },
    "In Discussion": { color: "bg-orange-100 text-orange-700 border-orange-200" },
    "Paid": { color: "bg-green-100 text-green-700 border-green-200" },
    "Overdue": { color: "bg-red-100 text-red-700 border-red-200" }
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["Pending"];
  
  return (
    <Badge variant="outline" className={`${config.color} border`}>
      {status}
    </Badge>
  );
};

const getPriorityBadge = (priority: string) => {
  const priorityConfig = {
    "Low": { color: "bg-gray-100 text-gray-700 border-gray-200" },
    "Medium": { color: "bg-blue-100 text-blue-700 border-blue-200" },
    "High": { color: "bg-orange-100 text-orange-700 border-orange-200" },
    "Critical": { color: "bg-red-100 text-red-700 border-red-200" }
  };
  
  const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig["Medium"];
  
  return (
    <Badge variant="outline" className={`${config.color} border`}>
      {priority}
    </Badge>
  );
};

const getRequirementStatusBadge = (status: string) => {
  const statusConfig = {
    "Draft": { color: "bg-gray-100 text-gray-700 hover:bg-gray-100" },
    "Generated": { color: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
    "Feasibility in Progress": { color: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
    "Feasibility Completed": { color: "bg-green-100 text-green-700 hover:bg-green-100" },
    "Partial Feasible": { color: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" },
    "Awaiting Acceptance": { color: "bg-purple-100 text-purple-700 hover:bg-purple-100" },
    "Customer Accepted": { color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" },
    "Customer Rejected": { color: "bg-red-100 text-red-700 hover:bg-red-100" },
    "Order Signed": { color: "bg-indigo-100 text-indigo-700 hover:bg-indigo-100" },
    "Solution in Progress": { color: "bg-purple-100 text-purple-700 hover:bg-purple-100" },
    "Ready for Customer": { color: "bg-green-100 text-green-700 hover:bg-green-100" },
    "Not Feasible": { color: "bg-red-100 text-red-700 hover:bg-red-100" }
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || { color: "bg-gray-100 text-gray-700 hover:bg-gray-100" };
  
  return (
    <Badge className={config.color}>
      {status}
    </Badge>
  );
};

export function Dashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [productTab, setProductTab] = useState("catalogue");
  const [renewalFinanceTab, setRenewalFinanceTab] = useState("renewals");
  const [insightsTab, setInsightsTab] = useState("overview");
  const [customerRenewalsTab, setCustomerRenewalsTab] = useState("renewals");
  const [showProductTypeModal, setShowProductTypeModal] = useState(false);
  const [modalContext, setModalContext] = useState<'requirement' | 'request'>('requirement');
  
  // Pagination state for Requirement Management
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalItems = allRequirementManagementData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Calculate paginated data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRequirements = allRequirementManagementData.slice(startIndex, endIndex);
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderRequirementActions = (reqId: string, status: string) => {
    switch (status) {
      case "Draft":
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/requirement-details/${reqId}`)}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/requirement-details/${reqId}`, { state: { activeTab: 'proposal-version' } })}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Proposal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      
      case "Generated":
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/requirement-details/${reqId}`)}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      
      case "Feasibility in Progress":
      case "Solution in Progress":
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/requirement-details/${reqId}`)}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      
      case "Feasibility Completed":
      case "Partial Feasible":
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/requirement-details/${reqId}`)}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/proposal-builder`)}>
                <FilePlus className="w-4 h-4 mr-2" />
                Create Proposal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      
      case "Awaiting Acceptance":
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/requirement-details/${reqId}`)}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/requirement-details/${reqId}`, { state: { activeTab: 'proposal-version' } })}>
                <FileText className="w-4 h-4 mr-2" />
                View Proposal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      
      case "Customer Accepted":
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/requirement-details/${reqId}`)}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/requirement-details/${reqId}`, { state: { activeTab: 'proposal-version' } })}>
                <FileText className="w-4 h-4 mr-2" />
                View Proposal
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/add-billing-address`)}>
                <Building className="w-4 h-4 mr-2" />
                Add Address
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/po-details`)}>
                <FileCheck className="w-4 h-4 mr-2" />
                Add PO
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/add-billing-address`)}>
                <ArrowRight className="w-4 h-4 mr-2" />
                Continue Order Setup
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      
      case "Customer Rejected":
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/requirement-details/${reqId}`)}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/requirement-details/${reqId}`, { state: { activeTab: 'proposal-version' } })}>
                <FileText className="w-4 h-4 mr-2" />
                View Proposal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      
      case "Order Signed":
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/requirement-details/${reqId}`)}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      
      default:
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/requirement-details/${reqId}`)}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900 mb-1">Account Manager Dashboard</h1>
              <p className="text-gray-600">
                Comprehensive platform for managing customer relationships, projects, and business operations
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    All Products
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>All Products</DropdownMenuItem>
                  <DropdownMenuItem>Colocation</DropdownMenuItem>
                  <DropdownMenuItem>Network</DropdownMenuItem>
                  <DropdownMenuItem>Cloud</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Top Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Quota</p>
                <div className="w-8 h-8 bg-cyan-50 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-cyan-600" />
                </div>
              </div>
              <p className="text-gray-900 mb-1">₹1,00,00,000</p>
              <p className="text-xs text-gray-500">Annual target</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Opportunity Funnel Value</p>
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <p className="text-gray-900 mb-1">₹2,45,50,000</p>
              <p className="text-xs text-green-600 flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +15% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Forecast</p>
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <p className="text-gray-900 mb-1">₹85,00,000</p>
              <p className="text-xs text-green-600 flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +18% projected
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Order Booking Value</p>
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                  <IndianRupee className="w-4 h-4 text-purple-600" />
                </div>
              </div>
              <p className="text-gray-900 mb-1">₹62,30,000</p>
              <p className="text-xs text-green-600 flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +22% from last quarter
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Active Requests</p>
                <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-orange-600" />
                </div>
              </div>
              <p className="text-gray-900 mb-1">24</p>
              <p className="text-xs text-gray-500">In progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Section */}
        <Card className="bg-white border border-gray-200 mb-6">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-gray-900">Quick Actions</CardTitle>
            </div>
            <CardDescription>Streamlined workflows for common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Interactive Requirements */}
              <button
                onClick={() => {
                  setModalContext('requirement');
                  setShowProductTypeModal(true);
                }}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 mb-1">Interactive Requirements</h4>
                    <p className="text-sm text-gray-600">Start a new requirement flow</p>
                  </div>
                </div>
              </button>

              {/* Quick Request Creation */}
              <button
                onClick={() => {
                  setModalContext('request');
                  setShowProductTypeModal(true);
                }}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 mb-1">Quick Request Creation</h4>
                    <p className="text-sm text-gray-600">Create a request in one step</p>
                  </div>
                </div>
              </button>

              {/* Inventory */}
              <button
                onClick={() => navigate('/inventory')}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 mb-1">Inventory</h4>
                    <p className="text-sm text-gray-600">View customer services & subscriptions</p>
                  </div>
                </div>
              </button>

              {/* My Customers */}
              <button
                onClick={() => {
                  // Navigate to customers page or show customer portfolio
                }}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 mb-1">My Customers</h4>
                    <p className="text-sm text-gray-600">Customer portfolio & subscriptions</p>
                  </div>
                </div>
              </button>

              {/* Feasibility Management */}
              <button
                onClick={() => navigate('/feasibility-management')}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:border-teal-300 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 mb-1">Requirements Management</h4>
                    <p className="text-sm text-gray-600">Manage all feasibility, requirements and orders</p>
                  </div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Product Type Selection Modal */}
        <Dialog open={showProductTypeModal} onOpenChange={setShowProductTypeModal}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Select Product Type</DialogTitle>
              <DialogDescription>
                Choose the product type for your new {modalContext === 'requirement' ? 'requirement' : 'request'} creation
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Data Center (DC) */}
              <button
                onClick={() => {
                  setShowProductTypeModal(false);
                  navigate('/new-project');
                }}
                className="p-6 bg-white border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Server className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-2">Data Center (DC)</h3>
                    <p className="text-sm text-gray-600">Rackspace, power, cooling and physical infrastructure services</p>
                  </div>
                </div>
              </button>

              {/* Cloud Services */}
              <button
                onClick={() => {
                  setShowProductTypeModal(false);
                  // Navigate to cloud services creation
                  navigate('/new-project');
                }}
                className="p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Cloud className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-2">Cloud Services</h3>
                    <p className="text-sm text-gray-600">Virtual machines, storage, and other cloud based solutions</p>
                  </div>
                </div>
              </button>

              {/* Network */}
              <button
                onClick={() => {
                  setShowProductTypeModal(false);
                  // Navigate to network services creation
                  if (modalContext === 'request') {
                    navigate('/new-dia-request');
                  } else {
                    navigate('/new-project');
                  }
                }}
                className="p-6 bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Network className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-2">Network</h3>
                    <p className="text-sm text-gray-600">Connectivity solutions, bandwidth, and network infrastructure</p>
                  </div>
                </div>
              </button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Immediate Actions + Pipeline Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Immediate Actions Required */}
          <Card className="bg-white border border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-gray-900">
                <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                Immediate Actions Required
              </CardTitle>
              <CardDescription>Critical items requiring your attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                      <IndianRupee className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-gray-900">Review Pricing Approvals</p>
                      <p className="text-xs text-gray-500">Today</p>
                    </div>
                  </div>
                  <Badge className="bg-red-600 text-white hover:bg-red-700">3</Badge>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-gray-900">Customer Acceptance Pending</p>
                      <p className="text-xs text-gray-500">2 days</p>
                    </div>
                  </div>
                  <Badge className="bg-gray-900 text-white hover:bg-gray-800">2</Badge>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Settings className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-900">Solutioning Updates</p>
                      <p className="text-xs text-gray-500">This week</p>
                    </div>
                  </div>
                  <Badge className="bg-gray-900 text-white hover:bg-gray-800">5</Badge>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-gray-900">Requests Nearing Expiry</p>
                      <p className="text-xs text-gray-500">Tomorrow</p>
                    </div>
                  </div>
                  <Badge className="bg-gray-900 text-white hover:bg-gray-800">1</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pipeline Overview */}
          <Card className="bg-white border border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-gray-900">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                Pipeline Overview
              </CardTitle>
              <CardDescription>Sales pipeline with monetary values</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-900">Qualification</span>
                  </div>
                  <span className="text-gray-900">₹1,20,00,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">8 Opportunity</span>
                  <span className="text-xs text-gray-500">pipeline value</span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-900">Proposal</span>
                  </div>
                  <span className="text-gray-900">₹2,80,00,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">5 Opportunity</span>
                  <span className="text-xs text-gray-500">pipeline value</span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-900">Negotiation</span>
                  </div>
                  <span className="text-gray-900">₹150,00,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">3 Opportunity</span>
                  <span className="text-xs text-gray-500">pipeline value</span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-900">Contract Finalization</span>
                  </div>
                  <span className="text-gray-900">₹90,00,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">2 Opportunity</span>
                  <span className="text-xs text-gray-500">pipeline value</span>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-900">Total Pipeline</span>
                  <span className="text-gray-900">₹6,40,00,000</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities & Recently Added Opportunities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Recent Activities */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <Activity className="w-5 h-5 mr-2 text-orange-600" />
                Recent Activities
              </CardTitle>
              <CardDescription>Latest updates and actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivitiesData.map((activity) => {
                  const getIconBgColor = (color: string) => {
                    const colors: Record<string, string> = {
                      'blue': 'bg-blue-50',
                      'green': 'bg-green-50',
                      'purple': 'bg-purple-50'
                    };
                    return colors[color] || 'bg-gray-50';
                  };

                  const getIconTextColor = (color: string) => {
                    const colors: Record<string, string> = {
                      'blue': 'text-blue-600',
                      'green': 'text-green-600',
                      'purple': 'text-purple-600'
                    };
                    return colors[color] || 'text-gray-600';
                  };

                  return (
                    <div key={activity.id} className="p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className={`w-10 h-10 ${getIconBgColor(activity.color)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            {activity.icon === 'IndianRupee' && <IndianRupee className={`w-5 h-5 ${getIconTextColor(activity.color)}`} />}
                            {activity.icon === 'FileCheck' && <FileCheck className={`w-5 h-5 ${getIconTextColor(activity.color)}`} />}
                            {activity.icon === 'Calendar' && <Calendar className={`w-5 h-5 ${getIconTextColor(activity.color)}`} />}
                            {activity.icon === 'CheckCircle' && <CheckCircle className={`w-5 h-5 ${getIconTextColor(activity.color)}`} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-gray-900">{activity.action}</p>
                              <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{activity.time}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{activity.customer}</p>
                            <p className="text-sm text-gray-500">{activity.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recently Added Opportunities */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <Target className="w-5 h-5 mr-2 text-blue-600" />
                Recently Added Opportunities
              </CardTitle>
              <CardDescription>Latest opportunities in the pipeline</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentlyAddedOpportunitiesData.map((opp) => {
                  const getStatusColor = (status: string) => {
                    const colors: Record<string, string> = {
                      'Qualification': 'bg-blue-50 text-blue-700 border-blue-200',
                      'Needs Analysis': 'bg-purple-50 text-purple-700 border-purple-200',
                      'Proposal': 'bg-green-50 text-green-700 border-green-200'
                    };
                    return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
                  };

                  const getBUColor = (buType: string) => {
                    const colors: Record<string, string> = {
                      'Network': 'bg-blue-600 text-white',
                      'Colocation': 'bg-purple-600 text-white',
                      'Managed Services': 'bg-green-600 text-white'
                    };
                    return colors[buType] || 'bg-gray-600 text-white';
                  };

                  return (
                    <div key={opp.opportunityId} className="p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600">{opp.opportunityId}</span>
                          <Badge className={getBUColor(opp.leadBUType)}>{opp.leadBUType}</Badge>
                          <Badge variant="outline" className={getStatusColor(opp.status)}>{opp.status}</Badge>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/opportunities')}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Customer</span>
                          <span className="text-sm text-gray-900">{opp.customerName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Value</span>
                          <span className="text-sm text-gray-900">{opp.value}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Created</span>
                          <span className="text-sm text-gray-900">{new Date(opp.createdOn).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Requirement Management */}
        <Card className="bg-white border border-gray-200 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-gray-900">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Requirement Management
                </CardTitle>
                <CardDescription>Comprehensive tracking of customer requirements</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    placeholder="Search" 
                    className="pl-9 w-64"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Req ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Opportunity ID</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRequirements.map((req) => (
                    <TableRow key={req.id} className="hover:bg-gray-50">
                      <TableCell>
                        <p className="text-gray-900">{req.id}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                          {req.product}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getPriorityBadge(req.priority)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-gray-900">{req.name}</p>
                          <p className="text-xs text-gray-500">Created: {req.createdDate}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-gray-900">{req.customerName}</p>
                          <p className="text-xs text-gray-500">{req.customerId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getRequirementStatusBadge(req.status)}
                      </TableCell>
                      <TableCell>
                        {req.product.toLowerCase().includes('network') ? (
                          <p className="text-gray-500">-</p>
                        ) : (
                          <div>
                            <p className="text-gray-900">{req.opportunityId}</p>
                            <p className="text-xs text-gray-500">{req.opportunityStage}</p>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="link" size="sm" className="h-auto p-0 text-blue-600">
                            {req.version}
                          </Button>
                          <Button variant="link" size="sm" className="h-auto p-0 text-gray-600">
                            History
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        {renderRequirementActions(req.id, req.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} entries
              </p>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className={currentPage === page ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-white"}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Management */}
        <Card className="bg-white border border-gray-200 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900">
              <Package className="w-5 h-5 mr-2 text-indigo-600" />
              Product Management
            </CardTitle>
            <CardDescription>Browse and manage product catalog across all service categories</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={productTab} onValueChange={setProductTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="catalogue">Product Catalogue</TabsTrigger>
                <TabsTrigger value="supporting-docs">Supporting Docs</TabsTrigger>
              </TabsList>

              <TabsContent value="catalogue">
                <div className="space-y-4">
                  {/* Cloud Infinite Card */}
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="w-10 h-10 bg-blue-50 rounded flex items-center justify-center flex-shrink-0">
                          <Box className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-gray-900">Cloud Infinite</h4>
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">v3.2.1</Badge>
                            <Download className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                          </div>
                          <p className="text-sm text-gray-600 mb-2">High-performance cloud services</p>
                          <p className="text-xs text-gray-500 mb-1">
                            <span className="text-gray-600">Category:</span> Compute, Network, Storage, PaaS, Backup, Security
                          </p>
                          <p className="text-xs text-gray-500">
                            <span className="text-gray-600">Updated:</span> 2024-12-20
                          </p>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-xs text-gray-500 mb-1">Product Manager</p>
                        <p className="text-gray-900 mb-0.5">Rajesh Kumar</p>
                        <p className="text-xs text-gray-500 mb-0.5">rajesh.k@afycorp</p>
                        <p className="text-xs text-gray-500 mb-2">+91 98765 43210</p>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="text-xs h-7">
                            <Phone className="w-3 h-3 mr-1" />
                            Call
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs h-7">
                            <Mail className="w-3 h-3 mr-1" />
                            Email
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                      <div className="bg-gray-50 p-3 rounded text-center">
                        <p className="text-xs text-gray-600 mb-1">Total Customers</p>
                        <p className="text-gray-900">45</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded text-center">
                        <p className="text-xs text-gray-600 mb-1">Active Usage</p>
                        <p className="text-gray-900">78%</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded text-center">
                        <p className="text-xs text-gray-600 mb-1">Revenue</p>
                        <p className="text-gray-900">₹7.7 Cr <span className="text-green-600 text-xs">+12.5%</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Managed Services Card */}
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="w-10 h-10 bg-blue-50 rounded flex items-center justify-center flex-shrink-0">
                          <Box className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-gray-900">Managed Services</h4>
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">v2.8.0</Badge>
                            <Download className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                          </div>
                          <p className="text-sm text-gray-600 mb-2">Enterprise-grade secure managed services</p>
                          <p className="text-xs text-gray-500 mb-1">
                            <span className="text-gray-600">Category:</span> Infrastructure Management, Platform and Security Services, Monitoring and Support Services
                          </p>
                          <p className="text-xs text-gray-500">
                            <span className="text-gray-600">Updated:</span> 2024-12-18
                          </p>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-xs text-gray-500 mb-1">Product Manager</p>
                        <p className="text-gray-900 mb-0.5">Priya Sharma</p>
                        <p className="text-xs text-gray-500 mb-0.5">priya.s@afycorp</p>
                        <p className="text-xs text-gray-500 mb-2">+91 98765 43211</p>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="text-xs h-7">
                            <Phone className="w-3 h-3 mr-1" />
                            Call
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs h-7">
                            <Mail className="w-3 h-3 mr-1" />
                            Email
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                      <div className="bg-gray-50 p-3 rounded text-center">
                        <p className="text-xs text-gray-600 mb-1">Total Customers</p>
                        <p className="text-gray-900">32</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded text-center">
                        <p className="text-xs text-gray-600 mb-1">Active Usage</p>
                        <p className="text-gray-900">65%</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded text-center">
                        <p className="text-xs text-gray-600 mb-1">Revenue</p>
                        <p className="text-gray-900">₹5.2 Cr <span className="text-green-600 text-xs">+8.3%</span></p>
                      </div>
                    </div>
                  </div>

                  {/* DC Colocation Card */}
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="w-10 h-10 bg-blue-50 rounded flex items-center justify-center flex-shrink-0">
                          <Box className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-gray-900">DC Colocation</h4>
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">v1.8.0</Badge>
                            <Download className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                          </div>
                          <p className="text-sm text-gray-600 mb-2">High performance data center colocation services</p>
                          <p className="text-xs text-gray-500 mb-1">
                            <span className="text-gray-600">Category:</span> DC Infrastructure, Cooling, Power, Security
                          </p>
                          <p className="text-xs text-gray-500">
                            <span className="text-gray-600">Updated:</span> 2025-12-28
                          </p>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-xs text-gray-500 mb-1">Product Manager</p>
                        <p className="text-gray-900 mb-0.5">Senthil Ram</p>
                        <p className="text-xs text-gray-500 mb-0.5">senthil.r@afycorp</p>
                        <p className="text-xs text-gray-500 mb-2">+91 92342 43211</p>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="text-xs h-7">
                            <Phone className="w-3 h-3 mr-1" />
                            Call
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs h-7">
                            <Mail className="w-3 h-3 mr-1" />
                            Email
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                      <div className="bg-gray-50 p-3 rounded text-center">
                        <p className="text-xs text-gray-600 mb-1">Total Customers</p>
                        <p className="text-gray-900">24</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded text-center">
                        <p className="text-xs text-gray-600 mb-1">Active Usage</p>
                        <p className="text-gray-900">94%</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded text-center">
                        <p className="text-xs text-gray-600 mb-1">Revenue</p>
                        <p className="text-gray-900">₹9.2 Cr <span className="text-green-600 text-xs">+4.3%</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Network Card */}
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="w-10 h-10 bg-blue-50 rounded flex items-center justify-center flex-shrink-0">
                          <Box className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-gray-900">Network</h4>
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">v3.0.0</Badge>
                            <Download className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                          </div>
                          <p className="text-sm text-gray-600 mb-2">Enterprise-grade network connectivity solutions</p>
                          <p className="text-xs text-gray-500 mb-1">
                            <span className="text-gray-600">Category:</span> DIA, MPLS, Dark Fiber, SD-WAN, VPN
                          </p>
                          <p className="text-xs text-gray-500">
                            <span className="text-gray-600">Updated:</span> 2024-11-30
                          </p>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-xs text-gray-500 mb-1">Product Manager</p>
                        <p className="text-gray-900 mb-0.5">Suresh Nair</p>
                        <p className="text-xs text-gray-500 mb-0.5">suresh.n@afycorp</p>
                        <p className="text-xs text-gray-500 mb-2">+91 98765 43217</p>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="text-xs h-7">
                            <Phone className="w-3 h-3 mr-1" />
                            Call
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs h-7">
                            <Mail className="w-3 h-3 mr-1" />
                            Email
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                      <div className="bg-gray-50 p-3 rounded text-center">
                        <p className="text-xs text-gray-600 mb-1">Total Customers</p>
                        <p className="text-gray-900">58</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded text-center">
                        <p className="text-xs text-gray-600 mb-1">Active Usage</p>
                        <p className="text-gray-900">82%</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded text-center">
                        <p className="text-xs text-gray-600 mb-1">Revenue</p>
                        <p className="text-gray-900">₹11.4 Cr <span className="text-green-600 text-xs">+15.2%</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="supporting-docs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Technical Specifications */}
                  <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-gray-900">Technical Specifications</h4>
                          <p className="text-sm text-gray-500">45 documents</p>
                        </div>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* User Guides */}
                  <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="text-gray-900">User Guides</h4>
                          <p className="text-sm text-gray-500">32 documents</p>
                        </div>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Documentation */}
                  <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="text-gray-900">Documentation</h4>
                          <p className="text-sm text-gray-500">28 documents</p>
                        </div>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Compliance Documents */}
                  <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                          <Shield className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="text-gray-900">Compliance Documents</h4>
                          <p className="text-sm text-gray-500">15 documents</p>
                        </div>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Customer Insights & Analytics + Customer Renewals & Finance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Customer Insights & Analytics */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                Customer Insights & Analytics
              </CardTitle>
              <CardDescription>Comprehensive customer behavior and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={insightsTab} onValueChange={setInsightsTab}>
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="segmentation">Segmentation</TabsTrigger>
                  <TabsTrigger value="behavior">Behavior</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview">
                  <div className="space-y-4">
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600 mb-2">Total Customers</p>
                        <p className="text-3xl text-gray-900 mb-1">63</p>
                        <p className="text-xs text-blue-600">+8 this quarter</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600 mb-2">Active Customers</p>
                        <p className="text-3xl text-gray-900 mb-1">58</p>
                        <p className="text-xs text-green-600">92% active rate</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600 mb-2">Prospect Conversion</p>
                        <p className="text-3xl text-gray-900 mb-1">7.9%</p>
                        <p className="text-xs text-gray-500">Current quarter</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600 mb-2">Churn Rate</p>
                        <p className="text-3xl text-gray-900 mb-1">4.1%</p>
                        <p className="text-xs text-gray-500">This month</p>
                      </div>
                    </div>

                    {/* Quarterly Business Contribution Chart */}
                    <div className="mt-6">
                      <h4 className="text-gray-900 mb-4">Quarterly Business Contribution</h4>
                      <div className="relative h-48">
                        {/* Chart visualization */}
                        <div className="flex items-end justify-between h-full space-x-4 pb-8">
                          {/* Q1 */}
                          <div className="flex-1 flex flex-col items-center space-y-1">
                            <div className="w-full bg-gray-200 rounded-t" style={{ height: '85%' }}>
                              <div className="w-full bg-blue-500 rounded-t" style={{ height: '20%' }}></div>
                            </div>
                            <p className="text-xs text-gray-600">Q1</p>
                          </div>
                          {/* Q2 */}
                          <div className="flex-1 flex flex-col items-center space-y-1">
                            <div className="w-full bg-gray-200 rounded-t" style={{ height: '75%' }}>
                              <div className="w-full bg-blue-500 rounded-t" style={{ height: '35%' }}></div>
                            </div>
                            <p className="text-xs text-gray-600">Q2</p>
                          </div>
                          {/* Q3 */}
                          <div className="flex-1 flex flex-col items-center space-y-1">
                            <div className="w-full bg-gray-200 rounded-t" style={{ height: '90%' }}>
                              <div className="w-full bg-blue-500 rounded-t" style={{ height: '45%' }}></div>
                            </div>
                            <p className="text-xs text-gray-600">Q3</p>
                          </div>
                          {/* Q4 */}
                          <div className="flex-1 flex flex-col items-center space-y-1">
                            <div className="w-full bg-gray-200 rounded-t" style={{ height: '60%' }}>
                              <div className="w-full bg-blue-500 rounded-t" style={{ height: '10%' }}></div>
                            </div>
                            <p className="text-xs text-gray-600">Q4</p>
                          </div>
                        </div>
                        {/* Legend */}
                        <div className="absolute top-2 right-0 text-xs space-y-1">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded"></div>
                            <span className="text-blue-600">Contributing Customers : 12</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-gray-200 rounded"></div>
                            <span className="text-gray-400">Total Customers : 45</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Current quarter: Only 5 out of 63 customers contributed to business</p>
                    </div>
                  </div>
                </TabsContent>

                {/* Segmentation Tab */}
                <TabsContent value="segmentation">
                  <div className="space-y-4">
                    <h4 className="text-gray-900 mb-4">Customer Segmentation by Product Division</h4>
                    
                    {/* Segmentation List */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <div>
                            <p className="text-gray-900">Cloud Infrastructure</p>
                            <p className="text-xs text-gray-500">28 customers</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-900">₹4.5 Cr</p>
                          <p className="text-xs text-gray-500">revenue</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div>
                            <p className="text-gray-900">DC Infrastructure</p>
                            <p className="text-xs text-gray-500">18 customers</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-900">₹9.3 Cr</p>
                          <p className="text-xs text-gray-500">revenue</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <div>
                            <p className="text-gray-900">Managed Services</p>
                            <p className="text-xs text-gray-500">15 customers</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-900">₹3.2 Cr</p>
                          <p className="text-xs text-gray-500">revenue</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <div>
                            <p className="text-gray-900">Security Solutions</p>
                            <p className="text-xs text-gray-500">12 customers</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-900">₹1.8 Cr</p>
                          <p className="text-xs text-gray-500">revenue</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <div>
                            <p className="text-gray-900">Backup Services</p>
                            <p className="text-xs text-gray-500">8 customers</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-900">₹2.5 Cr</p>
                          <p className="text-xs text-gray-500">revenue</p>
                        </div>
                      </div>
                    </div>

                    {/* Customer Status Distribution */}
                    <div className="mt-6">
                      <h4 className="text-gray-900 mb-4">Customer Status Distribution</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                          <UserPlus className="w-6 h-6 text-green-600 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-1">Active</p>
                          <p className="text-2xl text-gray-900">58</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                          <UserMinus className="w-6 h-6 text-red-600 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-1">Inactive</p>
                          <p className="text-2xl text-gray-900">5</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Behavior Tab */}
                <TabsContent value="behavior">
                  <div className="space-y-4">
                    <h4 className="text-gray-900 mb-4">Customer Churn Analysis</h4>
                    
                    {/* Line Chart Placeholder */}
                    <div className="relative h-48 bg-gray-50 rounded-lg border border-gray-200 p-4">
                      <svg className="w-full h-full" viewBox="0 0 400 150">
                        <polyline
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="2"
                          points="0,120 133,115 266,120 400,100"
                        />
                        <circle cx="0" cy="120" r="4" fill="#ef4444" />
                        <circle cx="133" cy="115" r="4" fill="#ef4444" />
                        <circle cx="266" cy="120" r="4" fill="#ef4444" />
                        <circle cx="400" cy="100" r="4" fill="#ef4444" />
                      </svg>
                      <div className="absolute bottom-2 left-0 right-0 flex justify-between px-4 text-xs text-gray-500">
                        <span>Oct</span>
                        <span>Nov</span>
                        <span>Dec</span>
                      </div>
                      <div className="absolute left-2 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500">
                        <span>8</span>
                        <span>6</span>
                        <span>4</span>
                        <span>2</span>
                        <span>0</span>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="p-4 bg-blue-50 rounded-lg text-center">
                        <UserPlus className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                        <p className="text-xs text-gray-600 mb-1">New This Month</p>
                        <p className="text-2xl text-blue-600">5</p>
                      </div>
                      <div className="p-4 bg-red-50 rounded-lg text-center">
                        <UserMinus className="w-5 h-5 text-red-600 mx-auto mb-2" />
                        <p className="text-xs text-gray-600 mb-1">Lost This Month</p>
                        <p className="text-2xl text-red-600">3</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg text-center">
                        <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-2" />
                        <p className="text-xs text-gray-600 mb-1">Net Growth</p>
                        <p className="text-2xl text-green-600">+3.2%</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Customer Renewals & Finance */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <FileCheck className="w-5 h-5 mr-2 text-blue-600" />
                Customer Renewals & Finance
              </CardTitle>
              <CardDescription>Renewal tracking and financial performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={customerRenewalsTab} onValueChange={setCustomerRenewalsTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="renewals">Renewals</TabsTrigger>
                  <TabsTrigger value="finance">Finance</TabsTrigger>
                </TabsList>

                {/* Renewals Tab */}
                <TabsContent value="renewals">
                  <div className="space-y-4">
                    <h4 className="text-gray-900 mb-4">Upcoming Renewals</h4>
                    
                    {/* Renewals List */}
                    <div className="space-y-3">
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-gray-900">Tech Corp India</p>
                            <p className="text-xs text-gray-500">Due: 2025-01-15</p>
                          </div>
                          <p className="text-gray-900">₹2.5 Cr</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Due Soon</Badge>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Low Risk</Badge>
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-gray-900">Global Enterprises</p>
                            <p className="text-xs text-gray-500">Due: 2025-02-01</p>
                          </div>
                          <p className="text-gray-900">₹1.8 Cr</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Pending</Badge>
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Medium Risk</Badge>
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-gray-900">Innovation Labs</p>
                            <p className="text-xs text-gray-500">Due: 2025-03-10</p>
                          </div>
                          <p className="text-gray-900">₹85.0 L</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">In Progress</Badge>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Low Risk</Badge>
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-gray-900">Digital Solutions</p>
                            <p className="text-xs text-gray-500">Due: 2025-01-28</p>
                          </div>
                          <p className="text-gray-900">₹45.0 L</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">At Risk</Badge>
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">High Risk</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Finance Tab */}
                <TabsContent value="finance">
                  <div className="space-y-4">
                    {/* Payment Status */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                        <Wallet className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                        <p className="text-2xl text-gray-900 mb-1">96%</p>
                        <p className="text-xs text-gray-500">On-time payments</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                        <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-1">Outstanding</p>
                        <p className="text-2xl text-gray-900 mb-1">₹2.3 Cr</p>
                        <p className="text-xs text-gray-500">12 customers</p>
                      </div>
                    </div>

                    {/* SLA & Compliance */}
                    <div className="mt-6">
                      <h4 className="text-gray-900 mb-4">SLA & Compliance</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">SLA Achievement</p>
                          <p className="text-green-600">99.5%</p>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Penalty Triggers</p>
                          <p className="text-red-600">2</p>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Compliance Rate</p>
                          <p className="text-green-600">98%</p>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Service Tax Compliant</p>
                          <p className="text-green-600">100%</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Booking Contribution */}
                    <div className="mt-6">
                      <h4 className="text-gray-900 mb-4">Order Booking Contribution</h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-gray-50 rounded-lg text-center border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">Q1</p>
                          <p className="text-gray-900">₹8.2 Cr</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg text-center border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">Q2</p>
                          <p className="text-gray-900">₹12.4 Cr</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg text-center border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">Q3</p>
                          <p className="text-gray-900">₹9.8 Cr</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Documentation & Knowledge Management */}
        <Card className="bg-white border border-gray-200 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900">
              <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
              Documentation & Knowledge Management
            </CardTitle>
            <CardDescription>Centralized access to all business documents, templates, and knowledge resources</CardDescription>
          </CardHeader>
          <CardContent>
            {/* First Row - 3 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Terms & Conditions */}
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <h4 className="text-gray-900">Terms & Conditions</h4>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">12</Badge>
                </div>
                <p className="text-xs text-gray-500 mb-3">Updated: Dec 20, 2024</p>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">• Cloud Compute Pro T&C v3.1</p>
                  <p className="text-sm text-gray-600">• Data Center Solutions T&C v2.4</p>
                  <p className="text-sm text-gray-600">• Network Services T&C v1.8</p>
                </div>
                <Button variant="outline" size="sm" className="w-full text-xs">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Access Documents
                </Button>
              </div>

              {/* SLA Agreements */}
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-orange-50 rounded flex items-center justify-center">
                      <Shield className="w-4 h-4 text-orange-600" />
                    </div>
                    <h4 className="text-gray-900">SLA Agreements</h4>
                  </div>
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">8</Badge>
                </div>
                <p className="text-xs text-gray-500 mb-3">Updated: Dec 18, 2024</p>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">• PAAS Service Level Agreement</p>
                  <p className="text-sm text-gray-600">• Infrastructure SLA Template</p>
                  <p className="text-sm text-gray-600">• Support Services SLA</p>
                </div>
                <Button variant="outline" size="sm" className="w-full text-xs">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Access Documents
                </Button>
              </div>

              {/* Templates & Frameworks */}
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-purple-50 rounded flex items-center justify-center">
                      <FileText className="w-4 h-4 text-purple-600" />
                    </div>
                    <h4 className="text-gray-900">Templates & Frameworks</h4>
                  </div>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">15</Badge>
                </div>
                <p className="text-xs text-gray-500 mb-3">Updated: Dec 22, 2024</p>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">• Requirement Document Template</p>
                  <p className="text-sm text-gray-600">• Cloud Security Framework</p>
                  <p className="text-sm text-gray-600">• Master Service Agreement Template</p>
                </div>
                <Button variant="outline" size="sm" className="w-full text-xs">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Access Documents
                </Button>
              </div>
            </div>

            {/* Second Row - 3 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Knowledge Base */}
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-50 rounded flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-green-600" />
                    </div>
                    <h4 className="text-gray-900">Knowledge Base</h4>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">45</Badge>
                </div>
                <p className="text-xs text-gray-500 mb-3">Updated: Dec 25, 2024</p>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">• FAQ Database</p>
                  <p className="text-sm text-gray-600">• OEM Documentation</p>
                  <p className="text-sm text-gray-600">• User Guides & Best Practices</p>
                </div>
                <Button variant="outline" size="sm" className="w-full text-xs">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Access Documents
                </Button>
              </div>

              {/* Business Process */}
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-purple-50 rounded flex items-center justify-center">
                      <Zap className="w-4 h-4 text-purple-600" />
                    </div>
                    <h4 className="text-gray-900">Business Process</h4>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Lead to Order</Badge>
                </div>
                <p className="text-xs text-gray-500 mb-3">End-to-end workflow visualization</p>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">• 5 Process Stages</p>
                  <p className="text-sm text-gray-600">• Multiple Stakeholders</p>
                  <p className="text-sm text-gray-600">• 6-14 weeks average duration</p>
                </div>
                <Button variant="outline" size="sm" className="w-full text-xs">
                  <Eye className="w-3 h-3 mr-1" />
                  View Flow
                </Button>
              </div>

              {/* Process Documentation */}
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-purple-50 rounded flex items-center justify-center">
                      <Settings className="w-4 h-4 text-purple-600" />
                    </div>
                    <h4 className="text-gray-900">Process Documentation</h4>
                  </div>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">18</Badge>
                </div>
                <p className="text-xs text-gray-500 mb-3">Updated: Dec 19, 2024</p>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">• Escalation Matrix</p>
                  <p className="text-sm text-gray-600">• Business Process Guidelines</p>
                  <p className="text-sm text-gray-600">• Termination Procedures</p>
                </div>
                <Button variant="outline" size="sm" className="w-full text-xs">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Access Documents
                </Button>
              </div>
            </div>

            {/* Third Row - Featured Items */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* FAQ Database */}
              <div className="p-6 bg-white rounded-lg border border-gray-200 text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Info className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="text-gray-900 mb-2">FAQ Database</h4>
                <p className="text-sm text-gray-600 mb-4">450+ frequently asked questions</p>
                <Button variant="outline" size="sm" className="text-xs">
                  Browse FAQ
                </Button>
              </div>

              {/* Escalation Matrix */}
              <div className="p-6 bg-white rounded-lg border border-gray-200 text-center">
                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="text-gray-900 mb-2">Escalation Matrix</h4>
                <p className="text-sm text-gray-600 mb-4">Issue escalation procedures</p>
                <Button variant="outline" size="sm" className="text-xs">
                  View Matrix
                </Button>
              </div>

              {/* Termination Procedures */}
              <div className="p-6 bg-white rounded-lg border border-gray-200 text-center">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h4 className="text-gray-900 mb-2">Termination Procedures</h4>
                <p className="text-sm text-gray-600 mb-4">Product-wise termination clauses</p>
                <Button variant="outline" size="sm" className="text-xs">
                  View Procedures
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

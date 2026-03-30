import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Checkbox } from './ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner@2.0.3';
import {
  ArrowLeft,
  FileText,
  Clock,
  Users,
  FileCheck,
  Eye,
  Download,
  Edit2,
  MapPin,
  Building,
  FilePlus,
  ArrowRight,
  CheckCircle,
  Circle,
  Network,
  Package,
  ShoppingCart,
  AlertTriangle,
  AlertCircle,
  GitBranch,
  ExternalLink,
  Link2,
  IndianRupee,
  MoreVertical,
  Info,
  Mail,
  Edit,
  XCircle,
  ThumbsDown,
  Settings
} from 'lucide-react';

// Mock data matching the requirements table statuses
const allRequirements = [
  {
    id: "NW00001",
    title: "DIA Service Request - Mumbai Office",
    product: "Network-DIA",
    createdDate: "2024-01-10",
    lastUpdated: "2024-01-15",
    status: "Draft",
    priority: "Medium",
    currentOwner: "DD",
    defaultOwner: "Manager",
    version: "v1.0",
    contractTerm: "1 Year",
    location: "Mumbai DC-1",
    paymentModel: "Monthly",
    drEnabled: "No",
    budgetRange: "₹1-5 Lakhs",
    createdBy: "System",
    addedDate: "2024-01-10",
    requirementDescription: "DIA connectivity requirement for Mumbai office with 100 Mbps bandwidth and 99.9% uptime SLA.",
    opportunityId: "OPP-2024-001",
    opportunityName: "Network Infrastructure Upgrade",
    opportunityStatus: "Qualification",
    probability: "50%",
    requestType: "New Requirement",
    projectDescription: "DIA service setup for primary internet connectivity.",
    company: "Tech Innovations Ltd",
    customerId: "CUST001",
    contactPerson: "Rajesh Kumar",
    industry: "Technology",
    email: "rajesh@techinnovations.com",
    phone: "+91 98765 43210",
    address: "123 Business Park, Andheri East, Mumbai, Maharashtra, 400069",
    teams: [
      { id: "AM", role: "Account Manager", name: "jane.doe@onesify.com", email: "jane.doe@onesify.com", phone: "+91 90001 11111", status: "active", assignedDate: "2024-01-10" },
      { id: "SA", role: "Solution Architect", name: "arun.k@onesify.com", email: "arun.k@onesify.com", phone: "+91 90002 22222", status: "pending", assignedDate: "2024-01-12" },
      { id: "P", role: "Product", name: "mike.ross@onesify.com", email: "mike.ross@onesify.com", phone: "+91 90003 33333", status: "active", assignedDate: "2024-01-13" },
      { id: "F", role: "Finance", name: "rita.patel@onesify.com", email: "rita.patel@onesify.com", phone: "+91 90004 44444", status: "active", assignedDate: "2024-01-13" },
      { id: "O", role: "OPG", name: "sanjay@onesify.com", email: "sanjay@onesify.com", phone: "+91 90005 55555", status: "active", assignedDate: "2024-01-16" },
      { id: "CT", role: "Commercials Team", name: "pradeep@onesify.com", email: "pradeep@onesify.com", phone: "+91 90005 55555", status: "active", assignedDate: "2024-01-16" }
    ],
    documents: [
      { id: 1, name: "Requirement Doc.pdf", size: "1.2 MB", uploadedBy: "Jane Doe", uploadedDate: "2024-01-10" },
      { id: 2, name: "Solutioning Doc.pdf", size: "2.3 MB", uploadedBy: "Mike Ross", uploadedDate: "2024-01-13" }
    ]
  },
  {
    id: "CL000001",
    title: "Enterprise Cloud Migration",
    product: "Cloud",
    createdDate: "2024-01-10",
    lastUpdated: "2024-01-15",
    status: "Feasibility in Progress",
    priority: "Medium",
    currentOwner: "DD",
    defaultOwner: "Manager",
    version: "v1.0",
    contractTerm: "1 Year",
    location: "Mumbai DC-1",
    paymentModel: "Monthly",
    drEnabled: "No",
    budgetRange: "₹1-5 Lakhs",
    createdBy: "System",
    addedDate: "2024-01-10",
    requirementDescription: "Default requirement description for testing.",
    opportunityId: "OPP-2024-000",
    opportunityName: "Default Opportunity",
    opportunityStatus: "Qualification",
    probability: "50%",
    requestType: "New Requirement",
    projectDescription: "Cloud migration and infrastructure setup with scalable compute and storage resources.",
    company: "Test Corp",
    customerId: "TEST000",
    contactPerson: "Test User",
    industry: "Technology",
    email: "test@corp.com",
    phone: "+91 90000 00000",
    address: "123 Test Street, Mumbai, Maharashtra, 400001",
    teams: [
      { id: "AM", role: "Account Manager", name: "jane.doe@onesify.com", email: "jane.doe@onesify.com", phone: "+91 90001 11111", status: "active", assignedDate: "2024-01-10" },
      { id: "SA", role: "Solution Architect", name: "arun.k@onesify.com", email: "arun.k@onesify.com", phone: "+91 90002 22222", status: "pending", assignedDate: "2024-01-12" }
    ],
    documents: [
      { id: 1, name: "Requirement Doc.pdf", size: "1.2 MB", uploadedBy: "Jane Doe", uploadedDate: "2024-01-10" }
    ]
  },
  {
    id: "CL000043",
    title: "Global Enterprises Ltd",
    product: "Cloud",
    createdDate: "2024-01-10",
    lastUpdated: "2024-01-15",
    status: "Customer Accepted",
    priority: "High",
    currentOwner: "DD",
    defaultOwner: "Manager",
    version: "v1.2",
    contractTerm: "3 Years",
    location: "Mumbai DC-1",
    paymentModel: "Annual",
    drEnabled: "Yes",
    budgetRange: "₹50L+",
    createdBy: "John Doe",
    addedDate: "2024-12-12",
    requirementDescription: "Multi-cloud strategy implementation with disaster recovery.",
    opportunityId: "OPP000005",
    opportunityName: "Multi-Cloud Strategy Implementation",
    opportunityStatus: "Proposal Submitted",
    probability: "85%",
    requestType: "Upload Requirement",
    projectDescription: "Comprehensive multi-cloud deployment with high availability and disaster recovery capabilities.",
    company: "Global Enterprises Ltd",
    customerId: "GE005",
    contactPerson: "Amit Sharma",
    industry: "Manufacturing",
    email: "amit@globalent.com",
    phone: "+91 98888 88888",
    address: "456 Industrial Area, Powai, Mumbai, Maharashtra, 400076",
    teams: [
      { id: "AM", role: "Account Manager", name: "jane.doe@onesify.com", email: "jane.doe@onesify.com", phone: "+91 90001 11111", status: "active", assignedDate: "2024-01-10" },
      { id: "SA", role: "Solution Architect", name: "arun.k@onesify.com", email: "arun.k@onesify.com", phone: "+91 90002 22222", status: "active", assignedDate: "2024-01-12" },
      { id: "P", role: "Product", name: "mike.ross@onesify.com", email: "mike.ross@onesify.com", phone: "+91 90003 33333", status: "active", assignedDate: "2024-01-13" },
      { id: "F", role: "Finance", name: "rita.patel@onesify.com", email: "rita.patel@onesify.com", phone: "+91 90004 44444", status: "active", assignedDate: "2024-01-13" }
    ],
    documents: [
      { id: 1, name: "Requirement Doc.pdf", size: "1.2 MB", uploadedBy: "Jane Doe", uploadedDate: "2024-01-10" },
      { id: 2, name: "Proposal.pdf", size: "3.5 MB", uploadedBy: "Arun K", uploadedDate: "2024-01-18" }
    ]
  },
  {
    id: "NW00009",
    title: "DIA 200 Mbps Enterprise Link",
    product: "Network-DIA",
    createdDate: "2024-11-10",
    lastUpdated: "2024-11-10",
    status: "Draft",
    priority: "High",
    currentOwner: "AM",
    defaultOwner: "Manager",
    version: "v1.0",
    contractTerm: "2 Years",
    location: "Bangalore DC-1",
    paymentModel: "Monthly",
    drEnabled: "No",
    budgetRange: "₹10-20 Lakhs",
    createdBy: "System",
    addedDate: "2024-11-10",
    requirementDescription: "Enterprise DIA connectivity requirement for primary office.",
    opportunityId: "OPP-NW009",
    opportunityName: "Enterprise Network Upgrade",
    opportunityStatus: "Discovery",
    probability: "40%",
    requestType: "New Requirement",
    projectDescription: "DIA service setup for enterprise connectivity.",
    company: "Global Solutions Ltd",
    customerId: "GS009",
    contactPerson: "Priya Reddy",
    industry: "Technology",
    email: "priya@globalsolutions.com",
    phone: "+91 98765 12345",
    address: "789 Tech Park, Whitefield, Bangalore, Karnataka, 560066",
    teams: [
      { id: "AM", role: "Account Manager", name: "jane.doe@onesify.com", email: "jane.doe@onesify.com", phone: "+91 90001 11111", status: "active", assignedDate: "2024-11-10" }
    ],
    documents: []
  },
  {
    id: "NW00005",
    title: "DIA 1 Gbps Primary Link",
    product: "Network-DIA",
    createdDate: "2024-11-05",
    lastUpdated: "2024-11-05",
    status: "Awaiting Customer Acceptance",
    priority: "High",
    currentOwner: "AM",
    defaultOwner: "Manager",
    version: "v1.2",
    contractTerm: "2 Years",
    location: "Bangalore DC-1",
    paymentModel: "Monthly",
    drEnabled: "Yes",
    budgetRange: "₹30-40 Lakhs",
    createdBy: "Account Manager",
    addedDate: "2024-11-05",
    requirementDescription: "Primary DIA connectivity for data center operations.",
    opportunityId: "OPP-NW005",
    opportunityName: "Media Infrastructure Upgrade",
    opportunityStatus: "Proposal Submitted",
    probability: "70%",
    requestType: "New Requirement",
    projectDescription: "High-speed DIA service for media streaming infrastructure.",
    company: "Media Streaming Co",
    customerId: "MS005",
    contactPerson: "Vikram Malhotra",
    industry: "Media & Entertainment",
    email: "vikram@mediastream.com",
    phone: "+91 98765 55555",
    address: "789 Media Plaza, HSR Layout, Bangalore, Karnataka, 560102",
    teams: [
      { id: "AM", role: "Account Manager", name: "jane.doe@onesify.com", email: "jane.doe@onesify.com", phone: "+91 90001 11111", status: "active", assignedDate: "2024-11-05" },
      { id: "SA", role: "Solution Architect", name: "arun.k@onesify.com", email: "arun.k@onesify.com", phone: "+91 90002 22222", status: "active", assignedDate: "2024-11-05" },
      { id: "P", role: "Product", name: "mike.ross@onesify.com", email: "mike.ross@onesify.com", phone: "+91 90003 33333", status: "active", assignedDate: "2024-11-05" }
    ],
    documents: [
      { id: 1, name: "Proposal_v1.2.pdf", size: "3.5 MB", uploadedBy: "Arun K", uploadedDate: "2024-11-05" }
    ]
  },
  {
    id: "NW00006",
    title: "DIA 500 Mbps Redundant Setup",
    product: "Network-DIA",
    createdDate: "2024-11-06",
    lastUpdated: "2024-11-06",
    status: "Customer Accepted",
    priority: "Critical",
    currentOwner: "AM",
    defaultOwner: "Manager",
    version: "v2.0",
    contractTerm: "3 Years",
    location: "Mumbai DC-1",
    paymentModel: "Annual",
    drEnabled: "Yes",
    budgetRange: "₹50L+",
    createdBy: "Account Manager",
    addedDate: "2024-11-06",
    requirementDescription: "Redundant DIA setup for mission-critical financial operations.",
    opportunityId: "OPP-NW006",
    opportunityName: "FinTech Infrastructure Expansion",
    opportunityStatus: "Negotiation",
    probability: "85%",
    requestType: "New Requirement",
    projectDescription: "Redundant high-speed DIA connectivity with failover capabilities.",
    company: "FinTech Innovations",
    customerId: "FI006",
    contactPerson: "Priya Sharma",
    industry: "Financial Services",
    email: "priya@fintech.com",
    phone: "+91 98765 66666",
    address: "456 Financial District, BKC, Mumbai, Maharashtra, 400051",
    teams: [
      { id: "AM", role: "Account Manager", name: "jane.doe@onesify.com", email: "jane.doe@onesify.com", phone: "+91 90001 11111", status: "active", assignedDate: "2024-11-06" },
      { id: "SA", role: "Solution Architect", name: "arun.k@onesify.com", email: "arun.k@onesify.com", phone: "+91 90002 22222", status: "active", assignedDate: "2024-11-06" },
      { id: "P", role: "Product", name: "mike.ross@onesify.com", email: "mike.ross@onesify.com", phone: "+91 90003 33333", status: "active", assignedDate: "2024-11-06" },
      { id: "F", role: "Finance", name: "rita.patel@onesify.com", email: "rita.patel@onesify.com", phone: "+91 90004 44444", status: "active", assignedDate: "2024-11-06" }
    ],
    documents: [
      { id: 1, name: "Proposal_Final.pdf", size: "4.2 MB", uploadedBy: "Arun K", uploadedDate: "2024-11-06" },
      { id: 2, name: "Customer_Acceptance.pdf", size: "1.1 MB", uploadedBy: "Customer", uploadedDate: "2024-11-08" }
    ]
  },
  {
    id: "NW00007",
    title: "DIA 50 Mbps for Remote Office",
    product: "Network-DIA",
    createdDate: "2024-11-07",
    lastUpdated: "2024-11-07",
    status: "Customer Rejected",
    priority: "Low",
    currentOwner: "AM",
    defaultOwner: "Manager",
    version: "v1.0",
    contractTerm: "1 Year",
    location: "Pune DC-1",
    paymentModel: "Monthly",
    drEnabled: "No",
    budgetRange: "₹1-5 Lakhs",
    createdBy: "Account Manager",
    addedDate: "2024-11-07",
    requirementDescription: "Basic DIA connectivity for remote office location.",
    opportunityId: "OPP-NW007",
    opportunityName: "Remote Office Network",
    opportunityStatus: "Closed Lost",
    probability: "0%",
    requestType: "New Requirement",
    projectDescription: "Basic internet connectivity for small remote office.",
    company: "StartupHub Inc",
    customerId: "SH007",
    contactPerson: "Rahul Verma",
    industry: "Startup",
    email: "rahul@startuphub.com",
    phone: "+91 98765 77777",
    address: "789 Startup Lane, Hinjewadi, Pune, Maharashtra, 411057",
    teams: [
      { id: "AM", role: "Account Manager", name: "jane.doe@onesify.com", email: "jane.doe@onesify.com", phone: "+91 90001 11111", status: "active", assignedDate: "2024-11-07" }
    ],
    documents: [
      { id: 1, name: "Proposal_v1.0.pdf", size: "2.1 MB", uploadedBy: "Jane Doe", uploadedDate: "2024-11-07" },
      { id: 2, name: "Rejection_Email.pdf", size: "0.3 MB", uploadedBy: "Customer", uploadedDate: "2024-11-09" }
    ]
  },
  {
    id: "NW00008",
    title: "DIA 1 Gbps for Production",
    product: "Network-DIA",
    createdDate: "2024-11-08",
    lastUpdated: "2024-11-08",
    status: "Order Signed",
    priority: "High",
    currentOwner: "OPG",
    defaultOwner: "Manager",
    version: "v2.1",
    contractTerm: "3 Years",
    location: "Delhi DC-1",
    paymentModel: "Annual",
    drEnabled: "Yes",
    budgetRange: "₹50L+",
    createdBy: "Account Manager",
    addedDate: "2024-11-08",
    requirementDescription: "High-speed DIA connectivity for production environment.",
    opportunityId: "OPP-NW008",
    opportunityName: "Production Infrastructure Setup",
    opportunityStatus: "Closed Won",
    probability: "100%",
    requestType: "New Requirement",
    projectDescription: "Enterprise-grade DIA service for manufacturing production systems.",
    company: "Manufacturing Pro",
    customerId: "MP008",
    contactPerson: "Suresh Kumar",
    industry: "Manufacturing",
    email: "suresh@mfgpro.com",
    phone: "+91 98765 88888",
    address: "123 Industrial Estate, Noida, Delhi NCR, 201301",
    teams: [
      { id: "AM", role: "Account Manager", name: "jane.doe@onesify.com", email: "jane.doe@onesify.com", phone: "+91 90001 11111", status: "active", assignedDate: "2024-11-08" },
      { id: "SA", role: "Solution Architect", name: "arun.k@onesify.com", email: "arun.k@onesify.com", phone: "+91 90002 22222", status: "active", assignedDate: "2024-11-08" },
      { id: "P", role: "Product", name: "mike.ross@onesify.com", email: "mike.ross@onesify.com", phone: "+91 90003 33333", status: "active", assignedDate: "2024-11-08" },
      { id: "F", role: "Finance", name: "rita.patel@onesify.com", email: "rita.patel@onesify.com", phone: "+91 90004 44444", status: "active", assignedDate: "2024-11-08" },
      { id: "O", role: "OPG", name: "sanjay@onesify.com", email: "sanjay@onesify.com", phone: "+91 90005 55555", status: "active", assignedDate: "2024-11-10" },
      { id: "CT", role: "Commercials Team", name: "pradeep@onesify.com", email: "pradeep@onesify.com", phone: "+91 90005 55555", status: "active", assignedDate: "2024-11-10" }
    ],
    documents: [
      { id: 1, name: "Proposal_Final.pdf", size: "4.8 MB", uploadedBy: "Arun K", uploadedDate: "2024-11-08" },
      { id: 2, name: "Signed_Order.pdf", size: "2.5 MB", uploadedBy: "Customer", uploadedDate: "2024-11-12" }
    ]
  },
  {
    id: "NW00010",
    title: "MPLS Hub & Spoke Setup",
    product: "Network-MPLS",
    createdDate: "2024-11-11",
    lastUpdated: "2024-11-11",
    status: "Generated",
    priority: "Medium",
    currentOwner: "AM",
    defaultOwner: "Manager",
    version: "v1.1",
    contractTerm: "3 Years",
    location: "Multiple Locations",
    paymentModel: "Annual",
    drEnabled: "Yes",
    budgetRange: "₹50L+",
    createdBy: "System",
    addedDate: "2024-11-11",
    requirementDescription: "MPLS Hub and Spoke network for multi-location connectivity.",
    opportunityId: "OPP-NW010",
    opportunityName: "Multi-Location Network",
    opportunityStatus: "Proposal",
    probability: "60%",
    requestType: "New Requirement",
    projectDescription: "MPLS network setup for enterprise locations.",
    company: "Enterprise Networks Inc",
    customerId: "EN010",
    contactPerson: "Rajiv Kumar",
    industry: "Finance",
    email: "rajiv@enterprise.com",
    phone: "+91 98765 54321",
    address: "123 Business Center, Mumbai, Maharashtra, 400001",
    teams: [
      { id: "AM", role: "Account Manager", name: "jane.doe@onesify.com", email: "jane.doe@onesify.com", phone: "+91 90001 11111", status: "active", assignedDate: "2024-11-11" },
      { id: "SA", role: "Solution Architect", name: "arun.k@onesify.com", email: "arun.k@onesify.com", phone: "+91 90002 22222", status: "active", assignedDate: "2024-11-11" }
    ],
    documents: [
      { id: 1, name: "Proposal_v1.1.pdf", size: "2.8 MB", uploadedBy: "Jane Doe", uploadedDate: "2024-11-11" }
    ]
  },
  {
    id: "NW00011",
    title: "DIA 500 Mbps Backup Link",
    product: "Network-DIA",
    createdDate: "2024-11-12",
    lastUpdated: "2024-11-12",
    status: "Yet to Configure",
    priority: "High",
    currentOwner: "AM",
    defaultOwner: "Manager",
    version: "v1.0",
    contractTerm: "1 Year",
    location: "Delhi DC-1",
    paymentModel: "Quarterly",
    drEnabled: "No",
    budgetRange: "₹15-25 Lakhs",
    createdBy: "System",
    addedDate: "2024-11-12",
    requirementDescription: "Backup DIA link for redundancy.",
    opportunityId: "OPP-NW011",
    opportunityName: "Network Redundancy Setup",
    opportunityStatus: "Qualification",
    probability: "60%",
    requestType: "New Requirement",
    projectDescription: "Secondary DIA service for backup connectivity.",
    company: "TechCorp Solutions",
    customerId: "CL000001",
    contactPerson: "Sarah Johnson",
    industry: "Technology",
    email: "sarah@techcorp.com",
    phone: "+91 98765 00001",
    address: "TechCorp Tower, Bangalore, Karnataka, 560001",
    teams: [
      { id: "AM", role: "Account Manager", name: "jane.doe@onesify.com", email: "jane.doe@onesify.com", phone: "+91 90001 11111", status: "active", assignedDate: "2024-11-12" },
      { id: "SA", role: "Solution Architect", name: "arun.k@onesify.com", email: "arun.k@onesify.com", phone: "+91 90002 22222", status: "active", assignedDate: "2024-11-12" }
    ],
    documents: []
  },
  {
    id: "NW00012",
    title: "MPLS Hub & Spoke Enterprise Network",
    product: "Network-MPLS",
    createdDate: "2024-11-13",
    lastUpdated: "2024-11-13",
    status: "Generated",
    priority: "High",
    currentOwner: "AM",
    defaultOwner: "Manager",
    version: "v1.0",
    contractTerm: "3 Years",
    location: "Multi-location",
    paymentModel: "Annual",
    drEnabled: "Yes",
    budgetRange: "₹25-50 Lakhs",
    createdBy: "System",
    addedDate: "2024-11-13",
    requirementDescription: "MPLS Hub & Spoke network for multi-location connectivity.",
    opportunityId: "OPP-NW012",
    opportunityName: "TechCorp MPLS Expansion",
    opportunityStatus: "Proposal Generated",
    probability: "70%",
    requestType: "New Requirement",
    projectDescription: "Enterprise MPLS network setup.",
    company: "TechCorp Solutions",
    customerId: "CL000001",
    contactPerson: "Sarah Johnson",
    industry: "Technology",
    email: "sarah@techcorp.com",
    phone: "+91 98765 00001",
    address: "TechCorp Tower, Bangalore, Karnataka, 560001",
    teams: [
      { id: "AM", role: "Account Manager", name: "jane.doe@onesify.com", email: "jane.doe@onesify.com", phone: "+91 90001 11111", status: "active", assignedDate: "2024-11-13" },
      { id: "SA", role: "Solution Architect", name: "arun.k@onesify.com", email: "arun.k@onesify.com", phone: "+91 90002 22222", status: "active", assignedDate: "2024-11-13" }
    ],
    documents: [
      { id: 1, name: "Generated_Proposal.pdf", size: "4.2 MB", uploadedBy: "Arun K", uploadedDate: "2024-11-13" }
    ]
  },
  {
    id: "NW00013",
    title: "DIA 1 Gbps Premium Link",
    product: "Network-DIA",
    createdDate: "2024-11-14",
    lastUpdated: "2024-11-14",
    status: "Proposal Rejected",
    priority: "Medium",
    currentOwner: "AM",
    defaultOwner: "Manager",
    version: "v1.0",
    contractTerm: "2 Years",
    location: "Pune DC-1",
    paymentModel: "Quarterly",
    drEnabled: "No",
    budgetRange: "₹25-50 Lakhs",
    createdBy: "System",
    addedDate: "2024-11-14",
    requirementDescription: "Premium high-speed DIA connectivity.",
    opportunityId: "OPP-NW013",
    opportunityName: "TechCorp Premium Link",
    opportunityStatus: "Closed Lost",
    probability: "0%",
    requestType: "New Requirement",
    projectDescription: "Premium enterprise-grade DIA connectivity.",
    company: "TechCorp Solutions",
    customerId: "CL000001",
    contactPerson: "Sarah Johnson",
    industry: "Technology",
    email: "sarah@techcorp.com",
    phone: "+91 98765 00001",
    address: "TechCorp Tower, Bangalore, Karnataka, 560001",
    teams: [
      { id: "AM", role: "Account Manager", name: "jane.doe@onesify.com", email: "jane.doe@onesify.com", phone: "+91 90001 11111", status: "active", assignedDate: "2024-11-14" }
    ],
    documents: []
  },
  // TechCorp Solutions requirements with all 6 statuses
  {
    id: "NW000222",
    title: "MPLS Hub & Spoke Network Solution",
    product: "Network-MPLS",
    createdDate: "2025-01-10",
    lastUpdated: "2025-01-28",
    status: "Order Signed",
    priority: "Critical",
    currentOwner: "OPG",
    defaultOwner: "Manager",
    version: "v2.0",
    contractTerm: "3 Years",
    location: "Multi-location",
    paymentModel: "Annual",
    drEnabled: "Yes",
    budgetRange: "₹50L+",
    createdBy: "System",
    addedDate: "2025-01-10",
    requirementDescription: "Enterprise MPLS network with hub and spoke topology.",
    opportunityId: "OPP-NW222",
    opportunityName: "TechCorp Network Expansion",
    opportunityStatus: "Closed Won",
    probability: "100%",
    requestType: "New Requirement",
    projectDescription: "MPLS connectivity for TechCorp's multi-location network.",
    company: "TechCorp Solutions",
    customerId: "CL000001",
    contactPerson: "Sarah Johnson",
    industry: "Technology",
    email: "sarah@techcorp.com",
    phone: "+91 98765 00001",
    address: "TechCorp Tower, Bangalore, Karnataka, 560001",
    teams: [
      { id: "AM", role: "Account Manager", name: "jane.doe@onesify.com", email: "jane.doe@onesify.com", phone: "+91 90001 11111", status: "active", assignedDate: "2025-01-10" },
      { id: "SA", role: "Solution Architect", name: "arun.k@onesify.com", email: "arun.k@onesify.com", phone: "+91 90002 22222", status: "active", assignedDate: "2025-01-10" },
      { id: "O", role: "OPG", name: "sanjay@onesify.com", email: "sanjay@onesify.com", phone: "+91 90005 55555", status: "active", assignedDate: "2025-01-28" }
    ],
    documents: [
      { id: 1, name: "Signed_Order.pdf", size: "5.2 MB", uploadedBy: "OPG Team", uploadedDate: "2025-01-28" },
      { id: 2, name: "Contract_Agreement.pdf", size: "4.1 MB", uploadedBy: "Legal Team", uploadedDate: "2025-01-28" }
    ]
  },
  {
    id: "NW000223",
    title: "DIA Mesh Network Configuration",
    product: "Network-DIA",
    createdDate: "2025-02-01",
    lastUpdated: "2025-02-01",
    status: "Awaiting Customer Acceptance",
    priority: "High",
    currentOwner: "AM",
    defaultOwner: "Manager",
    version: "v1.0",
    contractTerm: "2 Years",
    location: "Mumbai DC-2",
    paymentModel: "Quarterly",
    drEnabled: "No",
    budgetRange: "₹25-50 Lakhs",
    createdBy: "System",
    addedDate: "2025-02-01",
    requirementDescription: "DIA mesh network for high availability.",
    opportunityId: "OPP-NW223",
    opportunityName: "TechCorp HA Network",
    opportunityStatus: "Proposal Submitted",
    probability: "80%",
    requestType: "New Requirement",
    projectDescription: "High availability DIA mesh topology.",
    company: "TechCorp Solutions",
    customerId: "CL000001",
    contactPerson: "Sarah Johnson",
    industry: "Technology",
    email: "sarah@techcorp.com",
    phone: "+91 98765 00001",
    address: "TechCorp Tower, Bangalore, Karnataka, 560001",
    teams: [
      { id: "AM", role: "Account Manager", name: "jane.doe@onesify.com", email: "jane.doe@onesify.com", phone: "+91 90001 11111", status: "active", assignedDate: "2025-02-01" },
      { id: "SA", role: "Solution Architect", name: "arun.k@onesify.com", email: "arun.k@onesify.com", phone: "+91 90002 22222", status: "active", assignedDate: "2025-02-01" }
    ],
    documents: [
      { id: 1, name: "Proposal_Final.pdf", size: "3.5 MB", uploadedBy: "Arun K", uploadedDate: "2025-02-01" }
    ]
  },
  {
    id: "NW000089",
    title: "MPLS Hub & Spoke Legacy Migration",
    product: "Network-MPLS",
    createdDate: "2024-12-15",
    lastUpdated: "2025-01-05",
    status: "Proposal Rejected",
    priority: "Low",
    currentOwner: "AM",
    defaultOwner: "Manager",
    version: "v1.0",
    contractTerm: "1 Year",
    location: "Delhi DC-1",
    paymentModel: "Monthly",
    drEnabled: "No",
    budgetRange: "₹10-15 Lakhs",
    createdBy: "System",
    addedDate: "2024-12-15",
    requirementDescription: "Legacy MPLS migration project.",
    opportunityId: "OPP-NW089",
    opportunityName: "TechCorp Legacy Migration",
    opportunityStatus: "Closed Lost",
    probability: "0%",
    requestType: "Migration",
    projectDescription: "MPLS migration from legacy provider.",
    company: "TechCorp Solutions",
    customerId: "CL000001",
    contactPerson: "Sarah Johnson",
    industry: "Technology",
    email: "sarah@techcorp.com",
    phone: "+91 98765 00001",
    address: "TechCorp Tower, Bangalore, Karnataka, 560001",
    teams: [
      { id: "AM", role: "Account Manager", name: "jane.doe@onesify.com", email: "jane.doe@onesify.com", phone: "+91 90001 11111", status: "active", assignedDate: "2024-12-15" }
    ],
    documents: []
  },
  {
    id: "NW00014",
    title: "DIA Mesh Premium Enterprise Link",
    product: "Network-DIA",
    createdDate: "2024-11-14",
    lastUpdated: "2024-11-14",
    status: "Proposal Accepted",
    priority: "High",
    currentOwner: "AM",
    defaultOwner: "Manager",
    version: "v1.0",
    contractTerm: "1 Year",
    location: "Pune DC-1",
    paymentModel: "Quarterly",
    drEnabled: "Yes",
    budgetRange: "₹25-50 Lakhs",
    createdBy: "System",
    addedDate: "2024-11-14",
    requirementDescription: "Premium DIA mesh connectivity with DR.",
    opportunityId: "OPP-NW014",
    opportunityName: "TechCorp Premium Network",
    opportunityStatus: "Proposal Accepted",
    probability: "90%",
    requestType: "New Requirement",
    projectDescription: "Premium enterprise-grade DIA mesh setup.",
    company: "TechCorp Solutions",
    customerId: "CL000001",
    contactPerson: "Sarah Johnson",
    industry: "Technology",
    email: "sarah@techcorp.com",
    phone: "+91 98765 00001",
    address: "TechCorp Tower, Bangalore, Karnataka, 560001",
    teams: [
      { id: "AM", role: "Account Manager", name: "jane.doe@onesify.com", email: "jane.doe@onesify.com", phone: "+91 90001 11111", status: "active", assignedDate: "2024-11-14" },
      { id: "SA", role: "Solution Architect", name: "arun.k@onesify.com", email: "arun.k@onesify.com", phone: "+91 90002 22222", status: "active", assignedDate: "2024-11-14" }
    ],
    documents: [
      { id: 1, name: "Accepted_Proposal.pdf", size: "3.8 MB", uploadedBy: "Arun K", uploadedDate: "2024-11-14" }
    ]
  },
  // P2P - GCC Requirements
  {
    id: "NW00035",
    title: "P2P GCC - Mumbai to AWS Cloud",
    product: "Network-P2P-GCC",
    createdDate: "2025-02-10",
    lastUpdated: "2025-02-10",
    status: "Yet to Configure",
    priority: "High",
    currentOwner: "AM",
    defaultOwner: "Manager",
    version: "v1.0",
    contractTerm: "3 Years",
    location: "Mumbai - AWS Mumbai",
    paymentModel: "Monthly",
    drEnabled: "No",
    budgetRange: "₹10-20 Lakhs",
    createdBy: "System",
    addedDate: "2025-02-10",
    requirementDescription: "Point-to-point connectivity from Mumbai DC to AWS Mumbai using GCC (Google Cloud Connect).",
    opportunityId: "OPP-2025-035",
    opportunityName: "Cloud Connectivity Initiative",
    opportunityStatus: "Qualification",
    probability: "60%",
    requestType: "New Requirement",
    projectDescription: "Dedicated P2P GCC link for hybrid cloud architecture.",
    company: "TechCorp Solutions",
    customerId: "CL000001",
    contactPerson: "Sarah Johnson",
    industry: "Technology",
    email: "sarah@techcorp.com",
    phone: "+91 98765 00001",
    address: "TechCorp Tower, Bangalore, Karnataka, 560001",
    teams: [
      { id: "AM", role: "Account Manager", name: "jane.doe@onesify.com", email: "jane.doe@onesify.com", phone: "+91 90001 11111", status: "active", assignedDate: "2025-02-10" },
      { id: "SA", role: "Solution Architect", name: "arun.k@onesify.com", email: "arun.k@onesify.com", phone: "+91 90002 22222", status: "pending", assignedDate: "2025-02-10" }
    ],
    documents: []
  },
  // P2P - EPL Requirements for TechCorp Solutions
  {
    id: "NW00045",
    title: "P2P EPL - Kolkata to Guwahati Link",
    product: "Network-P2P-EPL",
    createdDate: "2025-02-07",
    lastUpdated: "2025-02-10",
    status: "Yet to Configure",
    priority: "High",
    currentOwner: "AM",
    defaultOwner: "Manager",
    version: "v1.0",
    contractTerm: "1 Year",
    location: "Kolkata - Guwahati",
    paymentModel: "Monthly",
    drEnabled: "No",
    budgetRange: "₹10-20 Lakhs",
    createdBy: "System",
    addedDate: "2025-02-07",
    requirementDescription: "Ethernet Private Line connectivity between Kolkata headquarters and Guwahati regional office with dedicated 200 Mbps bandwidth.",
    opportunityId: "OPP-2025-045",
    opportunityName: "Eastern Region Network",
    opportunityStatus: "Qualification",
    probability: "65%",
    requestType: "New Requirement",
    projectDescription: "Dedicated P2P EPL link for inter-office connectivity in eastern region.",
    company: "TechCorp Solutions",
    customerId: "CL000001",
    contactPerson: "Sarah Johnson",
    industry: "Technology",
    email: "sarah@techcorp.com",
    phone: "+91 98765 00001",
    address: "TechCorp Tower, Bangalore, Karnataka, 560001",
    teams: [
      { id: "AM", role: "Account Manager", name: "jane.doe@onesify.com", email: "jane.doe@onesify.com", phone: "+91 90001 11111", status: "active", assignedDate: "2025-02-07" },
      { id: "SA", role: "Solution Architect", name: "arun.k@onesify.com", email: "arun.k@onesify.com", phone: "+91 90002 22222", status: "pending", assignedDate: "2025-02-07" }
    ],
    documents: []
  },
  {
    id: "NW00065",
    title: "P2P EPL - Chandigarh to Amritsar Link",
    product: "Network-P2P-EPL",
    createdDate: "2025-01-17",
    lastUpdated: "2025-02-08",
    status: "Proposal Accepted",
    priority: "Critical",
    currentOwner: "Commercials Team",
    defaultOwner: "Manager",
    version: "v1.2",
    contractTerm: "3 Years",
    location: "Chandigarh - Amritsar",
    paymentModel: "Annual",
    drEnabled: "Yes",
    budgetRange: "₹25-40 Lakhs",
    createdBy: "System",
    addedDate: "2025-01-17",
    requirementDescription: "Dedicated Ethernet Private Line between Chandigarh and Amritsar offices with redundant paths and 500 Mbps bandwidth.",
    opportunityId: "OPP-2025-065",
    opportunityName: "Punjab Network Infrastructure",
    opportunityStatus: "Proposal Accepted",
    probability: "90%",
    requestType: "New Requirement",
    projectDescription: "Resilient P2P EPL link for critical business operations in Punjab region.",
    company: "TechCorp Solutions",
    customerId: "CL000001",
    contactPerson: "Sarah Johnson",
    industry: "Technology",
    email: "sarah@techcorp.com",
    phone: "+91 98765 00001",
    address: "TechCorp Tower, Bangalore, Karnataka, 560001",
    teams: [
      { id: "AM", role: "Account Manager", name: "jane.doe@onesify.com", email: "jane.doe@onesify.com", phone: "+91 90001 11111", status: "active", assignedDate: "2025-01-17" },
      { id: "SA", role: "Solution Architect", name: "arun.k@onesify.com", email: "arun.k@onesify.com", phone: "+91 90002 22222", status: "active", assignedDate: "2025-01-17" },
      { id: "CT", role: "Commercials Team", name: "pradeep@onesify.com", email: "pradeep@onesify.com", phone: "+91 90005 55555", status: "active", assignedDate: "2025-02-08" }
    ],
    documents: [
      { id: 1, name: "Accepted_EPL_Proposal.pdf", size: "4.2 MB", uploadedBy: "Arun K", uploadedDate: "2025-02-08" },
      { id: 2, name: "Technical_Specifications.pdf", size: "1.8 MB", uploadedBy: "Arun K", uploadedDate: "2025-01-20" }
    ]
  },
  {
    id: "NW00055",
    title: "P2P GCC - Multi-Location Cloud Connectivity",
    product: "Network-P2P-GCC",
    createdDate: "2025-01-27",
    lastUpdated: "2025-01-27",
    status: "Yet to Configure",
    priority: "High",
    currentOwner: "AM",
    defaultOwner: "Manager",
    version: "v1.0",
    contractTerm: "3 Years",
    location: "Bangalore - Chennai - Hyderabad - Kochi",
    paymentModel: "Annual",
    drEnabled: "Yes",
    budgetRange: "₹40-80 Lakhs",
    createdBy: "System",
    addedDate: "2025-01-27",
    requirementDescription: "Multi-location Point-to-Point GCC connectivity connecting four major offices to cloud infrastructure with high availability and redundancy.",
    opportunityId: "OPP-2025-055",
    opportunityName: "Southern Region Cloud Integration",
    opportunityStatus: "Qualification",
    probability: "70%",
    requestType: "New Requirement",
    projectDescription: "Comprehensive P2P GCC network for connecting southern region offices to cloud services with guaranteed bandwidth and DR capabilities.",
    company: "TechCorp Solutions",
    customerId: "CL000001",
    contactPerson: "Sarah Johnson",
    industry: "Technology",
    email: "sarah@techcorp.com",
    phone: "+91 98765 00001",
    address: "TechCorp Tower, Bangalore, Karnataka, 560001",
    teams: [
      { id: "AM", role: "Account Manager", name: "jane.doe@onesify.com", email: "jane.doe@onesify.com", phone: "+91 90001 11111", status: "active", assignedDate: "2025-01-27" },
      { id: "SA", role: "Solution Architect", name: "arun.k@onesify.com", email: "arun.k@onesify.com", phone: "+91 90002 22222", status: "pending", assignedDate: "2025-01-27" }
    ],
    documents: []
  },
  // P2P - EVPL Requirements
  {
    id: "NW00036",
    title: "P2P EVPL - Multi-Site Connectivity",
    product: "Network-P2P-EVPL",
    createdDate: "2025-02-08",
    lastUpdated: "2025-02-12",
    status: "Generated",
    priority: "High",
    currentOwner: "AM",
    defaultOwner: "Manager",
    version: "v1.0",
    contractTerm: "2 Years",
    location: "Delhi - Noida - Gurgaon - Faridabad",
    paymentModel: "Quarterly",
    drEnabled: "Yes",
    budgetRange: "₹15-30 Lakhs",
    createdBy: "System",
    addedDate: "2025-02-08",
    requirementDescription: "Ethernet Virtual Private Line for multi-location enterprise connectivity with QoS.",
    opportunityId: "OPP-2025-036",
    opportunityName: "NCR Network Expansion",
    opportunityStatus: "Proposal Preparation",
    probability: "75%",
    requestType: "New Requirement",
    projectDescription: "EVPL mesh network connecting all NCR offices with guaranteed bandwidth.",
    company: "Global Enterprises",
    customerId: "CL000002",
    contactPerson: "Michael Chen",
    industry: "Finance",
    email: "michael@globalent.com",
    phone: "+91 98765 00002",
    address: "Global Tower, Delhi, 110001",
    teams: [
      { id: "AM", role: "Account Manager", name: "jane.doe@onesify.com", email: "jane.doe@onesify.com", phone: "+91 90001 11111", status: "active", assignedDate: "2025-02-08" },
      { id: "SA", role: "Solution Architect", name: "arun.k@onesify.com", email: "arun.k@onesify.com", phone: "+91 90002 22222", status: "active", assignedDate: "2025-02-08" }
    ],
    documents: [
      { id: 1, name: "EVPL_Proposal.pdf", size: "2.5 MB", uploadedBy: "Arun K", uploadedDate: "2025-02-12" }
    ]
  },
  // P2P - EPL Requirements
  {
    id: "NW00037",
    title: "P2P EPL - Dedicated Line Setup",
    product: "Network-P2P-EPL",
    createdDate: "2025-02-05",
    lastUpdated: "2025-02-14",
    status: "Awaiting Customer Acceptance",
    priority: "Critical",
    currentOwner: "AM",
    defaultOwner: "Manager",
    version: "v1.2",
    contractTerm: "3 Years",
    location: "Bangalore - Hyderabad",
    paymentModel: "Annual",
    drEnabled: "Yes",
    budgetRange: "₹20-40 Lakhs",
    createdBy: "System",
    addedDate: "2025-02-05",
    requirementDescription: "Dedicated Ethernet Private Line between two major data centers with 1 Gbps bandwidth.",
    opportunityId: "OPP-2025-037",
    opportunityName: "Data Center Interconnect",
    opportunityStatus: "Proposal Sent",
    probability: "80%",
    requestType: "New Requirement",
    projectDescription: "High-bandwidth EPL for seamless data center replication and DR.",
    company: "CloudNext Pvt Ltd",
    customerId: "CL000003",
    contactPerson: "Priya Sharma",
    industry: "Cloud Services",
    email: "priya@cloudnext.com",
    phone: "+91 98765 00003",
    address: "Cloud Plaza, Mumbai, Maharashtra, 400001",
    teams: [
      { id: "AM", role: "Account Manager", name: "jane.doe@onesify.com", email: "jane.doe@onesify.com", phone: "+91 90001 11111", status: "active", assignedDate: "2025-02-05" },
      { id: "SA", role: "Solution Architect", name: "arun.k@onesify.com", email: "arun.k@onesify.com", phone: "+91 90002 22222", status: "active", assignedDate: "2025-02-05" },
      { id: "F", role: "Finance", name: "rita.patel@onesify.com", email: "rita.patel@onesify.com", phone: "+91 90004 44444", status: "active", assignedDate: "2025-02-06" }
    ],
    documents: [
      { id: 1, name: "EPL_Proposal_v1.2.pdf", size: "4.1 MB", uploadedBy: "Arun K", uploadedDate: "2025-02-14" }
    ]
  },
  // P2P - DEPL Requirements
  {
    id: "NW00039",
    title: "P2P DEPL - Dual Endpoint Link",
    product: "Network-P2P-DEPL",
    createdDate: "2025-01-28",
    lastUpdated: "2025-02-16",
    status: "Order Signed",
    priority: "Critical",
    currentOwner: "OPG",
    defaultOwner: "Manager",
    version: "v1.5",
    contractTerm: "2 Years",
    location: "Chennai - Coimbatore - Madurai - Salem",
    paymentModel: "Monthly",
    drEnabled: "Yes",
    budgetRange: "₹25-50 Lakhs",
    createdBy: "System",
    addedDate: "2025-01-28",
    requirementDescription: "Dual Endpoint Private Line connecting manufacturing facilities across Tamil Nadu.",
    opportunityId: "OPP-2025-039",
    opportunityName: "Manufacturing Network Upgrade",
    opportunityStatus: "Won",
    probability: "100%",
    requestType: "New Requirement",
    projectDescription: "Redundant DEPL setup for mission-critical manufacturing operations.",
    company: "Global Solutions Ltd",
    customerId: "CL000004",
    contactPerson: "Ramesh Kumar",
    industry: "Manufacturing",
    email: "ramesh@globalsol.com",
    phone: "+91 98765 00004",
    address: "Global Building, Pune, Maharashtra, 411001",
    teams: [
      { id: "AM", role: "Account Manager", name: "jane.doe@onesify.com", email: "jane.doe@onesify.com", phone: "+91 90001 11111", status: "active", assignedDate: "2025-01-28" },
      { id: "SA", role: "Solution Architect", name: "arun.k@onesify.com", email: "arun.k@onesify.com", phone: "+91 90002 22222", status: "active", assignedDate: "2025-01-28" },
      { id: "OPG", role: "OPG", name: "sanjay@onesify.com", email: "sanjay@onesify.com", phone: "+91 90005 55555", status: "active", assignedDate: "2025-02-16" }
    ],
    documents: [
      { id: 1, name: "DEPL_Contract.pdf", size: "5.2 MB", uploadedBy: "Jane Doe", uploadedDate: "2025-02-16" },
      { id: 2, name: "Technical_Specs.pdf", size: "3.1 MB", uploadedBy: "Arun K", uploadedDate: "2025-02-15" }
    ]
  }
];

// Timeline stages data based on status
const getTimelineStages = (status: string) => {
  const stages = [
    {
      id: 1,
      name: "Requirement Initiation",
      dateRange: "2024-01-10 - 2024-01-11",
      days: "1 days",
      activities: "2/2 activities",
      progress: 100,
      status: "completed"
    },
    {
      id: 2,
      name: "Feasibility Check",
      dateRange: "2024-01-12 - 2024-01-14",
      days: "2 days",
      activities: "1/3 activities",
      progress: 33,
      status: ["Feasibility in Progress", "Feasibility Completed", "Partial Feasible"].includes(status) ? "in-progress" : "pending"
    },
    {
      id: 3,
      name: "Proposal Creation",
      dateRange: "2024-01-19 - 2024-01-21",
      days: "2 days",
      activities: "0/2 activities",
      progress: 0,
      status: status === "Awaiting Acceptance" ? "in-progress" : "pending"
    },
    {
      id: 4,
      name: "Customer Review",
      dateRange: "2024-01-22 - 2024-01-25",
      days: "3 days",
      activities: "0/3 activities",
      progress: 0,
      status: ["Customer Accepted", "Customer Rejected"].includes(status) ? "completed" : "pending"
    },
    {
      id: 5,
      name: "Order Signed",
      dateRange: "2024-01-25 - 2024-01-25",
      days: "3 days",
      activities: "0/3 activities",
      progress: 0,
      status: status === "Order Signed" ? "completed" : "pending"
    }
  ];

  // Update based on actual status
  if (status === "Draft") {
    stages[0].progress = 100;
    stages[0].status = "completed";
  } else if (status === "Feasibility in Progress") {
    stages[0].progress = 100;
    stages[0].status = "completed";
    stages[1].progress = 50;
    stages[1].status = "in-progress";
  } else if (status === "Feasibility Completed") {
    stages[0].progress = 100;
    stages[0].status = "completed";
    stages[1].progress = 100;
    stages[1].status = "completed";
  } else if (status === "Awaiting Acceptance") {
    stages[0].progress = 100;
    stages[0].status = "completed";
    stages[1].progress = 100;
    stages[1].status = "completed";
    stages[2].progress = 100;
    stages[2].status = "completed";
  } else if (status === "Customer Accepted") {
    stages[0].progress = 100;
    stages[0].status = "completed";
    stages[1].progress = 100;
    stages[1].status = "completed";
    stages[2].progress = 100;
    stages[2].status = "completed";
    stages[3].progress = 100;
    stages[3].status = "completed";
  } else if (status === "Order Signed") {
    stages.forEach(stage => {
      stage.progress = 100;
      stage.status = "completed";
    });
  }

  return stages;
};

// Audit trail data
const getAuditTrail = () => [
  {
    id: 1,
    action: "Status Updated",
    user: "Jane Doe",
    description: "Changed status to In Progress",
    additionalInfo: "Feasibility phase started.",
    timestamp: "2024-01-15 10:00"
  },
  {
    id: 2,
    action: "Comment Added",
    user: "Arun Kumar",
    description: "Added complete review",
    additionalInfo: "VM size confirmed with customer.",
    timestamp: "2024-01-12 14:45"
  },
  {
    id: 3,
    action: "Design Started",
    user: "Mike Ross",
    description: "Solution design draft started.",
    additionalInfo: "Initial design completed.",
    timestamp: "2024-01-11 11:30"
  },
  {
    id: 4,
    action: "Pricing Drafted",
    user: "Rita Patel",
    description: "Pricing document prepared.",
    additionalInfo: "Shared internally for review.",
    timestamp: "2024-01-14 16:25"
  },
  {
    id: 5,
    action: "Execution Planned",
    user: "Sanjay Mehta",
    description: "Created draft execution plan.",
    additionalInfo: "Resource allocation mapped.",
    timestamp: "2024-01-15 09:40"
  }
];

// FIDs data
const getFIDsData = () => [
  {
    id: "FID001",
    location: "Mumbai DC-1",
    locationDetail: "Powai Data Center, Building A, Floor 3, Rack 15\nLat: 19.1176, Long: 72.9060",
    connType: "Wireless",
    bandwidth: "22 Mbps",
    expiresOn: "2024-02-15",
    nearingExpiry: true,
    status: "Configured",
    vas: [
      { category: "Additional IP", value: "Static IPV4/32" },
      { category: "Managed Services", value: "Managed Router" }
    ]
  },
  {
    id: "FID002",
    location: "Mumbai DC-1",
    locationDetail: "Powai Data Center, Building A, Floor 3, Rack 16\nLat: 19.1176, Long: 72.9060",
    connType: "Other ISP - Airtel",
    bandwidth: "55 Mbps",
    expiresOn: "2024-06-20",
    nearingExpiry: false,
    status: "Pending Configuration",
    vas: [
      { category: "Devices", value: "Catalyst 9400 Series" }
    ]
  },
  {
    id: "FID003",
    location: "Bangalore DC-2",
    locationDetail: "Whitefield Data Center, Building B, Floor 2, Rack 8\nLat: 12.9698, Long: 77.7499",
    connType: "Fibre",
    bandwidth: "100 Mbps",
    expiresOn: "2024-03-10",
    nearingExpiry: true,
    status: "Yet to Configure",
    vas: [
      { category: "DDOS", value: "10 Gbps" }
    ]
  }
];

// Proposal versions data
const getProposalVersions = () => [
  {
    id: '0',
    version: 'v1.0',
    createdOn: '2024-11-10',
    totalArc: 45000,
    totalOtc: 90000,
    status: 'Draft' as const
  },
  {
    id: '1',
    version: 'v1.3',
    createdOn: '2025-02-06',
    totalArc: 78000,
    totalOtc: 155000,
    status: 'Customer Accepted' as const
  },
  {
    id: '2',
    version: 'v1.2',
    createdOn: '2025-02-05',
    totalArc: 78000,
    totalOtc: 155000,
    status: 'Awaiting Customer Acceptance' as const
  },
  {
    id: '3',
    version: 'v1.1',
    createdOn: '2025-02-04',
    totalArc: 75000,
    totalOtc: 150000,
    status: 'Generated' as const
  },
  {
    id: '4',
    version: 'v1.0',
    createdOn: '2025-02-03',
    totalArc: 80000,
    totalOtc: 160000,
    status: 'Customer Rejected' as const
  },
  {
    id: '5',
    version: 'v0.9',
    createdOn: '2025-02-01',
    totalArc: 85000,
    totalOtc: 170000,
    status: 'Voided' as const,
    voidedBy: 'John Doe',
    voidedOn: '2025-02-02',
    voidReason: 'Customer requested significant changes to pricing structure'
  }
];

// Order details data
const getOrderDetails = () => ({
  orderId: "OR10234",
  proposalId: "PR7828736",
  orderType: "New",
  product: "DIA",
  contractTerm: "2 years",
  orderGeneratedOn: "Oct 20, 2025",
  signedOn: "Oct 31, 2025",
  fids: 4,
  accountName: "Aditya Birla Fashion and Retails Limited",
  customerId: "C7836488",
  totalOtc: "₹7,12,000",
  totalArc: "₹1,10,000",
  documents: [
    {
      id: 1,
      type: "Order Document",
      fileName: "Name of document.format",
      version: "-",
      generatedOn: "Oct 31, 2025",
      size: "4.2 MB"
    },
    {
      id: 2,
      type: "Proposal Document",
      fileName: "Name of document.format",
      version: "v4",
      generatedOn: "Oct 20, 2025",
      size: "2.4 MB"
    }
  ],
  links: [
    {
      id: 1,
      linkId: "77757",
      linkType: "P",
      fid: "F567-891",
      location: "Chennai",
      connectionType: "Wireless",
      bandwidth: "40 Mbps",
      irDate: "Dec 15, 2025",
      orderStatus: "Order Completed"
    },
    {
      id: 2,
      linkId: "77768",
      linkType: "S",
      fid: "F345-762",
      location: "Mumbai",
      connectionType: "Fiber",
      bandwidth: "200 Mbps",
      irDate: "-",
      orderStatus: "Order Placed"
    },
    {
      id: 3,
      linkId: "77997",
      linkType: "P",
      fid: "F678-234",
      location: "Bengaluru",
      connectionType: "Fiber",
      bandwidth: "400 Mbps",
      irDate: "-",
      orderStatus: "Order Placed"
    },
    {
      id: 4,
      linkId: "77357",
      linkType: "P",
      fid: "F890-456",
      location: "Hyderabad",
      connectionType: "Wireless",
      bandwidth: "50 Mbps",
      irDate: "Nov 21, 2025",
      orderStatus: "Order Completed"
    }
  ]
});

export function RequirementDetailsView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'details');
  const [selectedFIDs, setSelectedFIDs] = useState<string[]>([]);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [selectedVersion, setSelectedVersion] = useState<any>(null);
  
  // Extract product lock information from navigation state (from Feasibility Pool)
  // Persist it in state so it doesn't get lost on re-renders
  const [lockedProduct, setLockedProduct] = useState<string | null>(location.state?.lockedProduct || null);
  const [isServiceChanges, setIsServiceChanges] = useState<boolean>(location.state?.isServiceChanges || false);
  
  // Update state when location.state changes
  React.useEffect(() => {
    if (location.state?.lockedProduct !== undefined) {
      setLockedProduct(location.state.lockedProduct);
      setIsServiceChanges(location.state.isServiceChanges || false);
      console.log('RequirementDetailsView - Updated product lock state:', {
        lockedProduct: location.state.lockedProduct,
        isServiceChanges: location.state.isServiceChanges
      });
    }
  }, [location.state]);
  
  // Find requirement by ID
  const requirement = allRequirements.find(req => req.id === id) || allRequirements[0];
  
  const fidsData = getFIDsData();
  const proposalVersions = getProposalVersions();
  const orderDetails = getOrderDetails();

  const getStatusBadgeColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Draft': 'bg-gray-100 text-gray-700',
      'Feasibility in Progress': 'bg-blue-100 text-blue-700',
      'Feasibility Completed': 'bg-green-100 text-green-700',
      'Partial Feasible': 'bg-yellow-100 text-yellow-700',
      'Awaiting Acceptance': 'bg-orange-100 text-orange-700',
      'Customer Accepted': 'bg-emerald-100 text-emerald-700',
      'Customer Rejected': 'bg-red-100 text-red-700',
      'Order Signed': 'bg-indigo-100 text-indigo-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getPriorityBadgeColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      'Low': 'bg-gray-100 text-gray-700',
      'Medium': 'bg-orange-100 text-orange-700',
      'High': 'bg-red-100 text-red-700',
      'Critical': 'bg-red-200 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-700';
  };

  const handleCancelProposal = (version: any) => {
    setSelectedVersion(version);
    setCancelDialogOpen(true);
  };

  const confirmCancelProposal = () => {
    if (cancelReason.trim()) {
      toast.success(`Proposal ${selectedVersion?.version} has been cancelled`);
      setCancelDialogOpen(false);
      setCancelReason('');
      setSelectedVersion(null);
    } else {
      toast.error('Please provide a reason for cancellation');
    }
  };

  const getProposalStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { variant: 'default' | 'destructive' | 'secondary', className: string } } = {
      'Generated': { variant: 'default', className: 'bg-blue-100 text-blue-700 hover:bg-blue-100' },
      'Awaiting Customer Acceptance': { variant: 'default', className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' },
      'Customer Accepted': { variant: 'default', className: 'bg-green-100 text-green-700 hover:bg-green-100' },
      'Customer Rejected': { variant: 'destructive', className: '' },
      'Voided': { variant: 'secondary', className: 'bg-gray-200 text-gray-700 hover:bg-gray-200' }
    };

    const config = statusConfig[status] || { variant: 'default' as const, className: '' };
    return <Badge variant={config.variant} className={config.className}>{status}</Badge>;
  };

  // Get primary action based on status
  const getPrimaryAction = (status: string) => {
    switch (status) {
      case 'Draft':
        return { label: 'Edit Requirement', icon: Edit2, action: () => navigate('/new-dia-service') };
      default:
        return null; // No button for other statuses
    }
  };

  const primaryAction = getPrimaryAction(requirement.status);

  const timelineStages = getTimelineStages(requirement.status);
  const auditTrail = getAuditTrail();

  // Helper to determine if Order Details tab should be visible
  const shouldShowOrderDetails = (status: string) => {
    return status === 'Order Signed';
  };

  // Helper to determine if Configuration Required card should be shown
  const shouldShowConfigurationRequired = (status: string) => {
    return status === 'Draft' || status === 'Yet to Configure';
  };

  // Filter proposal versions based on status
  const getFilteredProposalVersions = (status: string) => {
    // For "Yet to Configure" status, return empty array
    if (status === 'Yet to Configure') {
      return [];
    }
    
    const statusMap: { [key: string]: string } = {
      'Draft': 'Draft',
      'Generated': 'Generated',
      'Awaiting Customer Acceptance': 'Awaiting Customer Acceptance',
      'Customer Accepted': 'Customer Accepted',
      'Customer Rejected': 'Customer Rejected'
    };
    
    const targetStatus = statusMap[status];
    if (targetStatus) {
      return proposalVersions.filter(v => v.status === targetStatus).slice(0, 1);
    }
    return proposalVersions;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto p-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/feasibility-management', { state: { defaultTab: 'requirements' } })}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Requirements
        </Button>

        {/* Header Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-gray-900 mb-2">{requirement.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{requirement.id}</span>
                  <span>•</span>
                  <span>Created {requirement.createdDate}</span>
                  <span>•</span>
                  <span>Last updated {requirement.lastUpdated}</span>
                  <span>•</span>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                    {requirement.product}
                  </Badge>
                  {lockedProduct && isServiceChanges && (
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                      🔒 Product Locked: {lockedProduct}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-3 mt-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-1" />
                    Current Owner:
                    <span className="ml-2 flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-xs">
                      {requirement.currentOwner}
                    </span>
                    <span className="ml-1">Default Owner</span>
                    <span className="text-gray-400 ml-1">({requirement.defaultOwner})</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Badge className={getStatusBadgeColor(requirement.status)}>
                  {requirement.status}
                </Badge>
                <Badge className={getPriorityBadgeColor(requirement.priority)}>
                  {requirement.priority}
                </Badge>
                {primaryAction && (
                  <Button 
                    size="sm" 
                    className="bg-slate-800 hover:bg-slate-900"
                    onClick={primaryAction.action}
                  >
                    <primaryAction.icon className="w-4 h-4 mr-2" />
                    {primaryAction.label}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-3">
            <Card>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-sm ${
                      activeTab === 'details'
                        ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Requirement Details</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('fids')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-sm ${
                      activeTab === 'fids'
                        ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Network className="w-4 h-4" />
                    <span>FIDs</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('proposal-version')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-sm ${
                      activeTab === 'proposal-version'
                        ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <GitBranch className="w-4 h-4" />
                    <span>Proposal Version</span>
                  </button>
                  
                  {shouldShowOrderDetails(requirement.status) && (
                    <button
                      onClick={() => setActiveTab('order-details')}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-sm ${
                        activeTab === 'order-details'
                          ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Order Details</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => setActiveTab('documents')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-sm ${
                      activeTab === 'documents'
                        ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Documents</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('teams')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-sm ${
                      activeTab === 'teams'
                        ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Teams</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('timeline')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-sm ${
                      activeTab === 'timeline'
                        ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>Timeline</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('audit')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-sm ${
                      activeTab === 'audit'
                        ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Audit Trail</span>
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Right Content Area */}
          <div className="col-span-9 space-y-6">
            {activeTab === 'details' && (
              <>
                {/* Configuration Required Card - For Draft and Yet to Configure status */}
                {shouldShowConfigurationRequired(requirement.status) && (
                  <Card className="border-l-4 border-l-orange-500 bg-orange-50">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                            <Settings className="w-5 h-5 text-orange-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-orange-900 mb-1">Configuration Required</h3>
                          <p className="text-sm text-orange-700 mb-4">
                            Configure pricing and technical details for all FIDs before generating the proposal document.
                          </p>
                          <Button 
                            size="sm" 
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                            onClick={() => {
                              if (requirement.product.includes('P2P')) {
                                // Extract sub-product type (GCC, EPL, EVPL, DEPL)
                                let subProduct = 'GCC';
                                if (requirement.product.includes('EPL') && !requirement.product.includes('DEPL')) {
                                  subProduct = 'EPL';
                                } else if (requirement.product.includes('DEPL')) {
                                  subProduct = 'DEPL';
                                } else if (requirement.product.includes('EVPL')) {
                                  subProduct = 'EVPL';
                                } else if (requirement.product.includes('GCC')) {
                                  subProduct = 'GCC';
                                }
                                
                                navigate(`/configure-p2p-requirement/${requirement.id}`, {
                                  state: {
                                    company: requirement.company,
                                    proposalId: requirement.id,
                                    product: 'P2P',
                                    subProduct: subProduct,
                                    opportunityId: requirement.opportunityId,
                                    requirement: requirement,
                                    lockedProduct: lockedProduct,
                                    isServiceChanges: isServiceChanges
                                  }
                                });
                              } else {
                                navigate(`/configure-proposal/${requirement.id}`, {
                                  state: {
                                    lockedProduct: lockedProduct,
                                    isServiceChanges: isServiceChanges,
                                    requirementId: requirement.id
                                  }
                                });
                              }
                            }}
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Configure Now
                          </Button>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toast.info('Card dismissed')}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Product Lock Alert - For MDAC FIDs */}
                {lockedProduct && isServiceChanges && (
                  <Alert className="border-blue-200 bg-blue-50">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong>Product Restriction Active:</strong> This requirement contains MDAC FIDs for <span className="font-semibold">{lockedProduct}</span>. 
                      The product type cannot be changed during configuration. Only {lockedProduct} FIDs can be added to this requirement.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Requirement Overview */}
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Requirement Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                      <div>
                        <label className="text-xs text-gray-500">Requirement ID</label>
                        <p className="text-sm text-gray-900 mt-1">{requirement.id}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Version</label>
                        <p className="text-sm text-gray-900 mt-1">{requirement.version}</p>
                      </div>
                      
                      <div>
                        <label className="text-xs text-gray-500">Priority</label>
                        <p className="text-sm text-gray-900 mt-1">{requirement.priority}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Contract Term</label>
                        <p className="text-sm text-gray-900 mt-1">{requirement.contractTerm}</p>
                      </div>
                      
                      <div>
                        <label className="text-xs text-gray-500">Location</label>
                        <p className="text-sm text-gray-900 mt-1">{requirement.location}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Budget Range</label>
                        <p className="text-sm text-gray-900 mt-1">{requirement.budgetRange}</p>
                      </div>
                      
                      <div>
                        <label className="text-xs text-gray-500">Created By</label>
                        <p className="text-sm text-gray-900 mt-1">Account Manager</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Added Date</label>
                        <p className="text-sm text-gray-900 mt-1">{requirement.addedDate}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* P2P Technical Details - Only for P2P Products */}
                {requirement.product.includes('P2P') && (
                  <Card>
                    <CardHeader className="border-b">
                      <CardTitle className="flex items-center">
                        <Network className="w-5 h-5 mr-2" />
                        P2P Technical Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                        <div>
                          <label className="text-xs text-gray-500">Product Type</label>
                          <p className="text-sm text-gray-900 mt-1">
                            {requirement.product.includes('GCC') && 'P2P - GCC (Google Cloud Connect)'}
                            {requirement.product.includes('EPL') && !requirement.product.includes('DEPL') && 'P2P - EPL (Ethernet Private Line)'}
                            {requirement.product.includes('DEPL') && 'P2P - DEPL (Dual Endpoint Private Line)'}
                            {requirement.product.includes('EVPL') && 'P2P - EVPL (Ethernet Virtual Private Line)'}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Payment Model</label>
                          <p className="text-sm text-gray-900 mt-1">{requirement.paymentModel}</p>
                        </div>

                        <div>
                          <label className="text-xs text-gray-500">Connection Type</label>
                          <p className="text-sm text-gray-900 mt-1">
                            {requirement.product.includes('GCC') && 'Data Center to Cloud Provider'}
                            {requirement.product.includes('EPL') && !requirement.product.includes('DEPL') && 'Point-to-Point Dedicated Link'}
                            {requirement.product.includes('DEPL') && 'Dual Endpoint Redundant Link'}
                            {requirement.product.includes('EVPL') && 'Multi-Point Virtual Private Line'}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">DR Enabled</label>
                          <p className="text-sm text-gray-900 mt-1">{requirement.drEnabled}</p>
                        </div>

                        <div className="col-span-2">
                          <label className="text-xs text-gray-500">Requirement Description</label>
                          <p className="text-sm text-gray-900 mt-1">{requirement.requirementDescription}</p>
                        </div>

                        <div className="col-span-2">
                          <label className="text-xs text-gray-500">Project Description</label>
                          <p className="text-sm text-gray-900 mt-1">{requirement.projectDescription}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* DIA and MPLS Network Details - Only for DIA or MPLS Products */}
                {(requirement.product.includes('DIA') || requirement.product.includes('MPLS')) && (
                  <Card>
                    <CardHeader className="border-b">
                      <CardTitle className="flex items-center">
                        <Network className="w-5 h-5 mr-2" />
                        Network Service Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                        <div>
                          <label className="text-xs text-gray-500">Service Type</label>
                          <p className="text-sm text-gray-900 mt-1">
                            {requirement.product.includes('DIA') && 'DIA (Direct Internet Access)'}
                            {requirement.product.includes('MPLS') && 'MPLS (Multi-Protocol Label Switching)'}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Payment Model</label>
                          <p className="text-sm text-gray-900 mt-1">{requirement.paymentModel}</p>
                        </div>

                        <div>
                          <label className="text-xs text-gray-500">DR Enabled</label>
                          <p className="text-sm text-gray-900 mt-1">{requirement.drEnabled}</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Request Type</label>
                          <p className="text-sm text-gray-900 mt-1">{requirement.requestType}</p>
                        </div>

                        <div className="col-span-2">
                          <label className="text-xs text-gray-500">Requirement Description</label>
                          <p className="text-sm text-gray-900 mt-1">{requirement.requirementDescription}</p>
                        </div>

                        <div className="col-span-2">
                          <label className="text-xs text-gray-500">Project Description</label>
                          <p className="text-sm text-gray-900 mt-1">{requirement.projectDescription}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Opportunity Details */}
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center">
                      <Package className="w-5 h-5 mr-2" />
                      Opportunity Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                      <div>
                        <label className="text-xs text-gray-500">Opportunity ID</label>
                        <p className="text-sm text-gray-900 mt-1">{requirement.opportunityId}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Opportunity Name</label>
                        <p className="text-sm text-gray-900 mt-1">{requirement.opportunityName}</p>
                      </div>

                      <div>
                        <label className="text-xs text-gray-500">Opportunity Status</label>
                        <p className="text-sm text-gray-900 mt-1">{requirement.opportunityStatus}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Probability</label>
                        <p className="text-sm text-gray-900 mt-1">{requirement.probability}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Details */}
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Customer Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                      <div>
                        <label className="text-xs text-gray-500">Company</label>
                        <p className="text-sm text-gray-900 mt-1">{requirement.company}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Customer ID</label>
                        <p className="text-sm text-gray-900 mt-1">{requirement.customerId}</p>
                      </div>
                      
                      <div>
                        <label className="text-xs text-gray-500">Contact Person</label>
                        <p className="text-sm text-gray-900 mt-1">{requirement.contactPerson}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Industry</label>
                        <p className="text-sm text-gray-900 mt-1">{requirement.industry}</p>
                      </div>
                      
                      <div>
                        <label className="text-xs text-gray-500">Email</label>
                        <p className="text-sm text-gray-900 mt-1">{requirement.email}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Phone</label>
                        <p className="text-sm text-gray-900 mt-1">{requirement.phone}</p>
                      </div>
                      
                      <div className="col-span-2">
                        <label className="text-xs text-gray-500">Address</label>
                        <p className="text-sm text-gray-900 mt-1">{requirement.address}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === 'timeline' && (
              <Card>
                <CardHeader className="border-b">
                  <CardTitle>Timeline</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {timelineStages.map((stage, index) => (
                      <div key={stage.id} className="relative">
                        <div className="flex items-start">
                          {/* Icon */}
                          <div className="flex-shrink-0 mr-4">
                            {stage.status === 'completed' ? (
                              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              </div>
                            ) : stage.status === 'in-progress' ? (
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <Circle className="w-5 h-5 text-blue-600 fill-blue-600" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <Circle className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="text-sm text-gray-900">{stage.name}</h4>
                                <p className="text-xs text-gray-500">{stage.days} | {stage.activities}</p>
                              </div>
                              <span className="text-xs text-gray-500">{stage.dateRange}</span>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div
                                className={`h-2 rounded-full ${
                                  stage.status === 'completed' 
                                    ? 'bg-green-500' 
                                    : stage.status === 'in-progress' 
                                    ? 'bg-blue-500' 
                                    : 'bg-gray-300'
                                }`}
                                style={{ width: `${stage.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Connector Line */}
                        {index < timelineStages.length - 1 && (
                          <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200 -mb-6" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'teams' && (
              <Card>
                <CardHeader className="border-b">
                  <CardTitle>Assigned Teams</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-3 gap-4">
                    {requirement.teams.map((team) => (
                      <Card key={team.id} className="border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                                {team.id}
                              </div>
                              <div>
                                <p className="text-sm text-gray-900">{team.role}</p>
                              </div>
                            </div>
                            <Badge 
                              className={
                                team.status === 'active' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-yellow-100 text-yellow-700'
                              }
                            >
                              {team.status}
                            </Badge>
                          </div>
                          <div className="space-y-2 text-xs text-gray-600">
                            <p>{team.email}</p>
                            <p>{team.phone}</p>
                            <p className="text-gray-400">Assigned: {team.assignedDate}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'documents' && (
              <Card>
                <CardHeader className="border-b">
                  <CardTitle>Project Documents</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {requirement.documents.map((doc) => (
                      <div 
                        key={doc.id} 
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="w-8 h-8 text-blue-600" />
                          <div>
                            <p className="text-sm text-gray-900">{doc.name}</p>
                            <p className="text-xs text-gray-500">
                              {doc.size} • Uploaded by {doc.uploadedBy} on {doc.uploadedDate}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'fids' && (
              <Card>
                <CardHeader className="border-b">
                  <CardTitle>Feasible IDs (FIDs)</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <TooltipProvider>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>FID</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Connection Type / Bandwidth</TableHead>
                          <TableHead>Expires On</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>VAS</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fidsData.map((fid) => (
                          <TableRow key={fid.id}>
                            <TableCell className="font-medium">{fid.id}</TableCell>
                            <TableCell>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="cursor-help underline decoration-dotted">
                                    {fid.location}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="text-xs whitespace-pre-line max-w-xs">
                                    {fid.locationDetail}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <span className="text-gray-900">{fid.connType}</span>
                                <span className="text-gray-500"> | {fid.bandwidth}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {fid.nearingExpiry && (
                                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                                )}
                                <span className={fid.nearingExpiry ? 'text-orange-600' : ''}>
                                  {fid.expiresOn}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="secondary" 
                                className={
                                  fid.status === 'Configured' 
                                    ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                    : fid.status === 'Pending Configuration'
                                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                                }
                              >
                                {fid.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {fid.vas.map((vasItem: any, idx: number) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {vasItem.category}: {vasItem.value}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TooltipProvider>
                </CardContent>
              </Card>
            )}

            {activeTab === 'proposal-version' && (
              <Card>
                <CardHeader>
                  <CardTitle>Proposal Versions</CardTitle>
                </CardHeader>
                <CardContent>
                  {getFilteredProposalVersions(requirement.status).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600 text-sm">
                        No proposal version created yet! Configure all FIDs to create proposal.
                      </p>
                    </div>
                  ) : (
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead>Version</TableHead>
                            <TableHead>Created On</TableHead>
                            <TableHead>Total OTC</TableHead>
                            <TableHead>Total ARC</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getFilteredProposalVersions(requirement.status).map((version) => (
                          <TableRow key={version.id}>
                            <TableCell>
                              <span className="text-blue-600">{version.version}</span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-gray-900">{version.createdOn}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <IndianRupee className="w-3 h-3 mr-1 text-gray-500" />
                                <span className="text-sm text-gray-900">{version.totalOtc.toLocaleString()}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <IndianRupee className="w-3 h-3 mr-1 text-gray-500" />
                                <span className="text-sm text-gray-900">{version.totalArc.toLocaleString()}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {getProposalStatusBadge(version.status)}
                                {version.status === 'Voided' && version.voidedBy && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <Info className="w-4 h-4 text-gray-400" />
                                      </TooltipTrigger>
                                      <TooltipContent className="max-w-xs">
                                        <div className="space-y-1">
                                          <p className="text-xs"><strong>Voided By:</strong> {version.voidedBy}</p>
                                          <p className="text-xs"><strong>When:</strong> {version.voidedOn}</p>
                                          <p className="text-xs"><strong>Reason:</strong> {version.voidReason}</p>
                                        </div>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="sm" variant="ghost">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                  {version.status === 'Generated' && (
                                    <>
                                      <DropdownMenuItem onClick={() => navigate('/add-billing-address')}>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Move to Order
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                    </>
                                  )}
                                  {version.status === 'Awaiting Customer Acceptance' && (
                                    <>
                                      <DropdownMenuItem onClick={() => navigate('/add-billing-address')}>
                                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                                        Move to Order
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => toast.info('Marking as rejected...')}>
                                        <ThumbsDown className="w-4 h-4 mr-2 text-red-600" />
                                        Mark as Rejected
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                    </>
                                  )}
                                  {version.status === 'Customer Accepted' && (
                                    <>
                                      <DropdownMenuItem onClick={() => navigate('/add-billing-address')}>
                                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                                        Move to Order
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => toast.info('Marking as rejected...')}>
                                        <ThumbsDown className="w-4 h-4 mr-2 text-red-600" />
                                        Mark as Rejected
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                    </>
                                  )}
                                  <DropdownMenuItem onClick={() => toast.info('Opening preview...')}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Proposal
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => toast.success('Download started')}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => toast.success('Email sent')}>
                                    <Mail className="w-4 h-4 mr-2" />
                                    Send via Email
                                  </DropdownMenuItem>
                                  {version.status !== 'Voided' && (
                                    <>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem onClick={() => toast.info('Opening editor...')}>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Version
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleCancelProposal(version)}
                                        className="text-red-600 focus:text-red-600"
                                      >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Void Proposal
                                      </DropdownMenuItem>
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
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'order-details' && (
              <div className="space-y-6">
                {/* Order Summary */}
                <Card>
                  <CardHeader className="border-b">
                    <div className="flex items-center space-x-2">
                      <Package className="w-5 h-5 text-gray-500" />
                      <CardTitle>Order Summary</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-4 gap-x-8 gap-y-6 mb-6">
                      {requirement.status !== 'Order Signed' && (
                        <>
                          <div>
                            <label className="text-xs text-gray-500">Order ID</label>
                            <p className="text-sm text-gray-900 mt-1">{orderDetails.orderId}</p>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">Proposal ID</label>
                            <div className="flex items-center space-x-1 mt-1">
                              <span className="text-sm text-blue-600">{orderDetails.proposalId}</span>
                              <ExternalLink className="w-3 h-3 text-blue-600" />
                            </div>
                          </div>
                        </>
                      )}
                      <div>
                        <label className="text-xs text-gray-500">Order Type</label>
                        <p className="text-sm text-gray-900 mt-1">{orderDetails.orderType}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Product</label>
                        <p className="text-sm text-gray-900 mt-1">{orderDetails.product}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Contract Term</label>
                        <p className="text-sm text-gray-900 mt-1">{orderDetails.contractTerm}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Order Generated on</label>
                        <p className="text-sm text-gray-900 mt-1">{orderDetails.orderGeneratedOn}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Signed On</label>
                        <p className="text-sm text-gray-900 mt-1">{orderDetails.signedOn}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">FIDs</label>
                        <p className="text-sm text-gray-900 mt-1">{orderDetails.fids}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Account Name</label>
                        <p className="text-sm text-gray-900 mt-1">{orderDetails.accountName}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Customer ID</label>
                        <p className="text-sm text-gray-900 mt-1">{orderDetails.customerId}</p>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Charges */}
                    <div>
                      <h3 className="text-sm text-gray-900 mb-4">Charges</h3>
                      <div className="grid grid-cols-4 gap-x-8 gap-y-4">
                        <div>
                          <label className="text-xs text-gray-500">Total OTC</label>
                          <p className="text-sm text-gray-900 mt-1">{orderDetails.totalOtc}</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Total ARC</label>
                          <p className="text-sm text-gray-900 mt-1">{orderDetails.totalArc}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Documents */}
                <Card>
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-gray-500" />
                        <CardTitle>Documents</CardTitle>
                      </div>
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        <Download className="w-4 h-4 mr-2" />
                        Download All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="text-xs uppercase">Type</TableHead>
                          <TableHead className="text-xs uppercase">File Name</TableHead>
                          <TableHead className="text-xs uppercase">Version</TableHead>
                          <TableHead className="text-xs uppercase">Generated On</TableHead>
                          <TableHead className="text-xs uppercase">Size</TableHead>
                          <TableHead className="text-xs uppercase">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orderDetails.documents.map((doc) => (
                          <TableRow key={doc.id}>
                            <TableCell className="text-sm">{doc.type}</TableCell>
                            <TableCell className="text-sm">{doc.fileName}</TableCell>
                            <TableCell className="text-sm text-gray-600">{doc.version}</TableCell>
                            <TableCell className="text-sm">{doc.generatedOn}</TableCell>
                            <TableCell className="text-sm">{doc.size}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Eye className="w-4 h-4 text-gray-500" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Download className="w-4 h-4 text-gray-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Links */}
                <Card>
                  <CardHeader className="border-b">
                    <div className="flex items-center space-x-2">
                      <Link2 className="w-5 h-5 text-gray-500" />
                      <CardTitle>Links</CardTitle>
                      <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-700 border-orange-200">
                        {orderDetails.links.length}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="text-xs uppercase">Link ID</TableHead>
                          <TableHead className="text-xs uppercase">FID</TableHead>
                          <TableHead className="text-xs uppercase">Location</TableHead>
                          <TableHead className="text-xs uppercase">Conn. Type/Bandwidth</TableHead>
                          <TableHead className="text-xs uppercase">IR Date</TableHead>
                          <TableHead className="text-xs uppercase">Order Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orderDetails.links.map((link) => (
                          <TableRow key={link.id}>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <span className={`text-xs px-1.5 py-0.5 rounded ${
                                  link.linkType === 'P' 
                                    ? 'bg-blue-100 text-blue-700' 
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {link.linkType}
                                </span>
                                <span className="text-sm">{link.linkId}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">{link.fid}</TableCell>
                            <TableCell className="text-sm">{link.location}</TableCell>
                            <TableCell className="text-sm">
                              <div className="space-y-0.5">
                                <div>{link.connectionType}</div>
                                <div className="text-gray-600">{link.bandwidth}</div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">{link.irDate}</TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={
                                  link.orderStatus === 'Order Completed'
                                    ? 'bg-green-50 text-green-700 border-green-200'
                                    : 'bg-orange-50 text-orange-700 border-orange-200'
                                }
                              >
                                {link.orderStatus}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'audit' && (
              <Card>
                <CardHeader className="border-b">
                  <CardTitle>Audit Trail</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {auditTrail.map((audit) => (
                      <div key={audit.id} className="flex items-start space-x-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="text-sm text-gray-900">
                              <span className="font-medium">{audit.action}</span> by {audit.user}
                            </h4>
                            <span className="text-xs text-gray-500">{audit.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-700">{audit.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{audit.additionalInfo}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Proposal Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Void Proposal {selectedVersion?.version}</DialogTitle>
            <DialogDescription>
              Review the proposal details before voiding. This action will void the proposal.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-600 text-xs">Version</label>
                  <p className="text-gray-900">{selectedVersion?.version}</p>
                </div>
                <div>
                  <label className="text-gray-600 text-xs">Created On</label>
                  <p className="text-gray-900">{selectedVersion?.createdOn}</p>
                </div>
                <div>
                  <label className="text-gray-600 text-xs">Total OTC</label>
                  <div className="flex items-center">
                    <IndianRupee className="w-3 h-3 mr-1 text-gray-500" />
                    <span className="text-gray-900">{selectedVersion?.totalOtc?.toLocaleString()}</span>
                  </div>
                </div>
                <div>
                  <label className="text-gray-600 text-xs">Total ARC</label>
                  <div className="flex items-center">
                    <IndianRupee className="w-3 h-3 mr-1 text-gray-500" />
                    <span className="text-gray-900">{selectedVersion?.totalArc?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="cancel-reason">
                Reason for Voiding <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="cancel-reason"
                placeholder="Please provide a detailed reason for voiding this proposal..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Keep Proposal
            </Button>
            <Button variant="destructive" onClick={confirmCancelProposal}>
              Confirm Void
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

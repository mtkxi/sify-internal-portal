import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import {
  ArrowLeft,
  Building,
  Users,
  Server,
  Network,
  Settings,
  Shield,
  MessageSquare,
  FileText,
  Download,
  Upload,
  Edit,
  Share,
  Archive,
  AlertTriangle,
  User,
  Calendar,
  Eye,
  Power,
  Thermometer,
  Wifi,
  Database,
  Globe,
  ShieldCheck,
  Timer,
  PlayCircle,
  PauseCircle,
  XCircle,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  UserCheck,
  GitBranch,
  History,
  TrendingUp,
  Target,
  Monitor,
  Plus,
  Bell
} from 'lucide-react';

// Mock project detail data
const getProjectDetailById = (projectId: string) => {
  const baseProjectData = {
    // Common project data for all projects
    projectInfo: {
      projectName: "Tech Corp India Expansion",
      location: "Mumbai, Maharashtra",
      priority: "High",
      contractTerm: "3 Years",
      timeline: "Q2 2024",
      budgetRange: "₹25-50L",
      billingPreference: "Quarterly",
      projectObjectives: ["Business Expansion", "Improved Performance/Uptime"],
      consultantDetails: {
        name: "Rajesh Kumar",
        email: "rajesh.kumar@consultant.com",
        phone: "+91 98765 12345"
      },
      businessDevelopment: {
        dc: "Mike Chen",
        network: "Lisa Wang", 
        managedServices: null
      },
      currentInfrastructure: "Hybrid cloud with on-premise data center",
      currentDCLocations: "Pune, Mumbai",
      currentHostingModel: "Hybrid",
      keyChallenges: "Need for redundancy and scalability",
      requirementDescription: "Requires 24/7 monitoring and redundant power supply with N+1 redundancy"
    },
    customerInfo: {
      customerType: "existing_customer",
      customerId: "TC001",
      companyName: "Tech Corp India",
      businessType: "Enterprise",
      panNumber: "AABCU9603R",
      gstNumber: "27AABCU9603R1Z1",
      addressLine1: "Plot No. 123, Tech Park",
      addressLine2: "Sector 15, Vashi",
      city: "Mumbai",
      state: "Maharashtra",
      pinCode: "400703",
      contactPersonName: "Rajesh Sharma",
      contactEmail: "rajesh.sharma@techcorp.in",
      contactPhone: "+91 98765 43210"
    },
    spacePowerCooling: {
      colocationModel: "Dedicated Suite",
      suiteSize: "500 sq ft",
      dcLocation: "Mumbai DC-1, Floor 3, Zone A",
      rackConfiguration: {
        rackGroups: [
          {
            quantity: 12,
            size: "42U",
            type: "Standard",
            dimensions: "600mm x 1200mm"
          },
          {
            quantity: 8,
            size: "42U", 
            type: "Custom",
            dimensions: "800mm x 1200mm"
          }
        ],
        totalRackUnits: 840
      },
      powerModel: "Dedicated Circuit",
      powerCircuit: "Dual Feed",
      powerRequirement: "50 kW",
      powerRedundancy: "N+1",
      pduConfiguration: "Dual PDU per Rack",
      coolingRequirement: "Precision Cooling",
      coolingRedundancy: "N+1",
      scalabilityRequirements: "Room for 50% expansion within 2 years",
      exclusivityRequirements: "Dedicated access control and monitoring"
    },
    crossConnect: {
      connections: [
        {
          connectionType: "Fiber Optic",
          bandwidth: "1 Gbps",
          pointA: "Customer Rack 12-A",
          pointBType: "carrier",
          pointB: "Airtel POP",
          distance: "250 meters",
          carrierName: "Airtel",
          referenceNumber: "ATL-MUM-001-2024",
          serviceOptions: {
            shielding: true,
            conduit: false,
            abRedundancy: true,
            expeditedDelivery: false
          }
        },
        {
          connectionType: "Cat6A Copper",
          bandwidth: "10 Gbps",
          pointA: "Customer Suite",
          pointBType: "facility",
          pointB: "Meet Me Room A",
          distance: "75 meters",
          carrierName: null,
          referenceNumber: null,
          serviceOptions: {
            shielding: false,
            conduit: true,
            abRedundancy: false,
            expeditedDelivery: true
          }
        }
      ]
    },
    officeStorage: {
      sharedSeatingSpace: {
        selected: true,
        basicSeats: 6,
        premiumSeats: 2,
        addOns: {
          dedicatedWifiApiSeats: 2,
          seats32APower: 1
        },
        amenities: ["WiFi", "Power outlets", "AC", "Coffee station"]
      },
      secureOfficeSpace: {
        selected: true,
        workstationCabins: 3,
        additionalWorkstations: 4,
        size: "200 sq ft",
        addOns: {
          network100GBreakout: true,
          telecomPackage: false
        },
        amenities: ["Biometric access", "CCTV", "Meeting room setup", "Printer station"]
      },
      lanCabling: {
        selected: true,
        cableType: "Cat6A",
        distance: "150 meters",
        installationOptions: ["Overhead tray routing", "Patch panel termination", "Cable management"]
      },
      storageSpace: {
        selected: true,
        size: "100 sq ft",
        storageType: "Climate controlled",
        additionalInfo: "Equipment staging area with spare parts inventory management. Temperature and humidity monitoring required."
      }
    },
    valueAddedServices: {
      remoteHands: {
        selected: true,
        quantity: 5
      },
      smartHands: {
        selected: true,
        quantity: 8
      },
      migration: {
        selected: true
      },
      storageTapeServices: {
        tapeRotation: {
          selected: true,
          frequency: "Weekly",
          quantity: 12
        },
        fireVault: {
          selected: true,
          uSize: "2U",
          quantity: 4
        },
        dedicatedStorage: {
          selected: false,
          uSize: "4U",
          quantity: 2
        },
        offsiteTapeStorage: {
          selected: true
        }
      },
      additionalServices: {
        rackingStacking: {
          selected: true
        },
        intelligentPDU: {
          selected: true
        },
        cctv: {
          selected: false
        },
        accessSystem: {
          selected: true,
          accessType: "Biometric + Card"
        }
      },
      additionalRequirements: "24/7 on-site technical support during migration phase. Emergency response within 30 minutes for critical infrastructure issues."
    },
    slaCompliance: {
      slaRequirements: {
        uptime: "99.95%",
        powerSLA: "99.9%",
        coolingSLA: "99.9%", 
        networkSLA: "99.95%"
      },
      complianceRequirements: ["ISO 27001", "SOC 2", "PCI DSS"],
      reportingRequirements: {
        frequency: "Monthly",
        metrics: ["Uptime", "Power consumption", "Temperature logs", "Security incidents"],
        deliveryMethod: "Email + Portal"
      },
      emergencyProcedures: {
        escalationMatrix: "L1 → L2 → L3 → Management",
        responseTime: "15 minutes",
        contactMethod: "Phone + SMS + Email"
      }
    }
  };

  const projects = {
    "PRJ-2024-001": {
      id: "PRJ-2024-001",
      name: "Tech Corp India Expansion",
      status: "Feasibility In Progress",
      currentStage: "feasibility",
      lastCompletedStep: 6,
      progress: 35,
      priority: "High",
      createdDate: "2024-01-10",
      lastUpdated: "2024-01-15",
      currentOwner: { name: "Sarah Johnson", role: "Operations", email: "sarah.johnson@onesify.com" },
      assignedTeams: [
        { 
          name: "Operations", 
          lead: "Sarah Johnson", 
          leadEmail: "sarah.johnson@onesify.com",
          status: "active",
          assignedDate: "2024-01-12",
          responsibilities: ["Technical feasibility assessment", "Infrastructure planning", "Resource allocation"]
        },
        { 
          name: "DC BD", 
          lead: "Mike Chen", 
          leadEmail: "mike.chen@onesify.com",
          status: "active",
          assignedDate: "2024-01-10",
          responsibilities: ["Customer relationship management", "Business requirements analysis", "Pricing coordination"]
        }
      ],
      ...baseProjectData,
      timeline: {
        submitted: "2024-01-10",
        feasibilityStarted: "2024-01-12",
        feasibilityComplete: null,
        preSalesStarted: null,
        preSalesComplete: null,
        customerReady: null
      },
      comments: [
        {
          id: 1,
          author: "Sarah Johnson",
          role: "Operations",
          timestamp: "2024-01-15 14:30",
          content: "Initial feasibility assessment shows positive outlook. Need to confirm power capacity in Mumbai DC-1.",
          type: "update"
        },
        {
          id: 2,
          author: "Mike Chen", 
          role: "DC BD",
          timestamp: "2024-01-15 10:15",
          content: "Customer confirmed budget range and timeline. Ready to proceed with technical feasibility.",
          type: "comment"
        }
      ],
      documents: [
        { name: "Initial Requirements.pdf", type: "pdf", size: "2.3 MB", uploadedBy: "John Doe", uploadedDate: "2024-01-10" },
        { name: "Customer Architecture Diagram.png", type: "image", size: "1.8 MB", uploadedBy: "Mike Chen", uploadedDate: "2024-01-12" },
        { name: "Power Requirements Specification.xlsx", type: "excel", size: "1.2 MB", uploadedBy: "Sarah Johnson", uploadedDate: "2024-01-13" }
      ],
      auditTrail: [
        {
          id: 1,
          timestamp: "2024-01-16 09:15",
          user: "Sarah Johnson",
          userRole: "Operations",
          action: "Status Update",
          description: "Updated project status to 'Feasibility In Progress'",
          details: "Power capacity analysis completed. Moving to cooling assessment phase.",
          category: "status_change"
        },
        {
          id: 2,
          timestamp: "2024-01-15 14:30",
          user: "Sarah Johnson", 
          userRole: "Operations",
          action: "Comment Added",
          description: "Added feasibility assessment comment",
          details: "Initial feasibility assessment shows positive outlook. Need to confirm power capacity in Mumbai DC-1.",
          category: "comment"
        }
      ],
      projectTimeline: {
        currentPhase: "feasibility",
        phases: [
          {
            name: "Project Initiation",
            status: "completed",
            startDate: "2024-01-10",
            endDate: "2024-01-10",
            duration: "1 day",
            activities: ["Project creation", "Initial requirements gathering", "Team notification"],
            completedActivities: 3,
            totalActivities: 3
          },
          {
            name: "Feasibility Assessment",
            status: "in_progress", 
            startDate: "2024-01-12",
            endDate: "2024-01-20",
            duration: "8 days",
            activities: ["Technical assessment", "Resource availability check", "Cost analysis", "Risk evaluation"],
            completedActivities: 2,
            totalActivities: 4
          },
          {
            name: "Solution Design",
            status: "pending",
            startDate: "2024-01-22",
            endDate: "2024-01-30",
            duration: "8 days",
            activities: ["Architecture design", "Component selection", "Integration planning", "Documentation"],
            completedActivities: 0,
            totalActivities: 4
          },
          {
            name: "Proposal Creation",
            status: "pending",
            startDate: "2024-02-01",
            endDate: "2024-02-05",
            duration: "4 days", 
            activities: ["Pricing calculation", "Proposal drafting", "Review and approval", "Customer presentation"],
            completedActivities: 0,
            totalActivities: 4
          },
          {
            name: "Customer Review",
            status: "pending",
            startDate: "2024-02-06",
            endDate: "2024-02-15",
            duration: "9 days",
            activities: ["Customer presentation", "Feedback incorporation", "Contract negotiation", "Final approval"],
            completedActivities: 0,
            totalActivities: 4
          }
        ],
        milestones: [
          { name: "Project Created", date: "2024-01-10", status: "completed" },
          { name: "Feasibility Started", date: "2024-01-12", status: "completed" },
          { name: "Technical Assessment Complete", date: "2024-01-18", status: "upcoming" },
          { name: "Feasibility Report", date: "2024-01-20", status: "upcoming" },
          { name: "Solution Design Complete", date: "2024-01-30", status: "upcoming" },
          { name: "Proposal Ready", date: "2024-02-05", status: "upcoming" },
          { name: "Customer Approval", date: "2024-02-15", status: "upcoming" }
        ]
      }
    },
    "PRJ-2024-002": {
      id: "PRJ-2024-002",
      name: "Digital Solutions Migration",
      status: "Solution in progress",
      currentStage: "pre-sales",
      lastCompletedStep: 6,
      progress: 65,
      priority: "Medium",
      createdDate: "2024-01-05",
      lastUpdated: "2024-01-14",
      currentOwner: { name: "Alex Kumar", role: "Pre-Sales", email: "alex.kumar@onesify.com" },
      assignedTeams: [
        { 
          name: "Pre-Sales", 
          lead: "Alex Kumar", 
          leadEmail: "alex.kumar@onesify.com",
          status: "active",
          assignedDate: "2024-01-08",
          responsibilities: ["Solution design", "Proposal creation", "Technical documentation"]
        },
        { 
          name: "Network BD", 
          lead: "Lisa Wang", 
          leadEmail: "lisa.wang@onesify.com",
          status: "active",
          assignedDate: "2024-01-05",
          responsibilities: ["Network requirements analysis", "Connectivity planning", "Carrier coordination"]
        }
      ],
      ...baseProjectData,
      projectInfo: {
        ...baseProjectData.projectInfo,
        projectName: "Digital Solutions Migration",
        projectObjectives: ["On-Premise Migration", "Cost Optimization"]
      },
      customerInfo: {
        ...baseProjectData.customerInfo,
        companyName: "Digital Solutions Ltd",
        customerId: "CUST-002"
      },
      timeline: {
        submitted: "2024-01-05",
        feasibilityStarted: "2024-01-06",
        feasibilityComplete: "2024-01-08",
        preSalesStarted: "2024-01-08",
        preSalesComplete: null,
        customerReady: null
      },
      comments: [
        {
          id: 1,
          author: "Alex Kumar",
          role: "Pre-Sales",
          timestamp: "2024-01-14 16:20",
          content: "Solution architecture has been finalized. Moving to detailed component selection phase.",
          type: "update"
        },
        {
          id: 2,
          author: "Lisa Wang", 
          role: "Network BD",
          timestamp: "2024-01-13 11:45",
          content: "Network connectivity requirements clarified with customer. Dual carrier redundancy confirmed.",
          type: "comment"
        }
      ],
      documents: [
        { name: "Migration Plan.pdf", type: "pdf", size: "3.1 MB", uploadedBy: "Alex Kumar", uploadedDate: "2024-01-12" },
        { name: "Network Architecture.png", type: "image", size: "2.4 MB", uploadedBy: "Lisa Wang", uploadedDate: "2024-01-10" },
        { name: "Cost Analysis.xlsx", type: "excel", size: "1.7 MB", uploadedBy: "Alex Kumar", uploadedDate: "2024-01-14" }
      ],
      auditTrail: [
        {
          id: 1,
          timestamp: "2024-01-14 16:20",
          user: "Alex Kumar",
          userRole: "Pre-Sales",
          action: "Status Update",
          description: "Updated project status to 'Solution in progress'",
          details: "Solution architecture finalized. Component selection in progress.",
          category: "status_change"
        }
      ],
      projectTimeline: {
        currentPhase: "pre-sales",
        phases: [
          {
            name: "Project Initiation",
            status: "completed",
            startDate: "2024-01-05",
            endDate: "2024-01-05",
            duration: "1 day",
            activities: ["Project creation", "Initial requirements gathering", "Team notification"],
            completedActivities: 3,
            totalActivities: 3
          },
          {
            name: "Feasibility Assessment",
            status: "completed", 
            startDate: "2024-01-06",
            endDate: "2024-01-08",
            duration: "2 days",
            activities: ["Technical assessment", "Resource availability check", "Cost analysis", "Risk evaluation"],
            completedActivities: 4,
            totalActivities: 4
          },
          {
            name: "Solution Design",
            status: "in_progress",
            startDate: "2024-01-08",
            endDate: "2024-01-20",
            duration: "12 days",
            activities: ["Architecture design", "Component selection", "Integration planning", "Documentation"],
            completedActivities: 2,
            totalActivities: 4
          }
        ],
        milestones: [
          { name: "Project Created", date: "2024-01-05", status: "completed" },
          { name: "Feasibility Complete", date: "2024-01-08", status: "completed" },
          { name: "Solution Design Started", date: "2024-01-08", status: "completed" },
          { name: "Solution Design Complete", date: "2024-01-20", status: "upcoming" }
        ]
      }
    },
    "PRJ-2024-003": {
      id: "PRJ-2024-003",
      name: "Cloud Innovations Setup",
      status: "Ready for Customer",
      currentStage: "customer-ready",
      lastCompletedStep: 6,
      progress: 85,
      priority: "Critical",
      createdDate: "2023-12-20",
      lastUpdated: "2024-01-13",
      currentOwner: { name: "Alex Kumar", role: "Pre-Sales", email: "alex.kumar@onesify.com" },
      assignedTeams: [
        { 
          name: "Pre-Sales", 
          lead: "Alex Kumar", 
          leadEmail: "alex.kumar@onesify.com",
          status: "active",
          assignedDate: "2023-12-25",
          responsibilities: ["Solution design", "Proposal creation", "Technical documentation"]
        },
        { 
          name: "Managed Services BD", 
          lead: "David Park", 
          leadEmail: "david.park@onesify.com",
          status: "active",
          assignedDate: "2023-12-20",
          responsibilities: ["Managed services planning", "Service level agreements", "Support structure"]
        }
      ],
      ...baseProjectData,
      projectInfo: {
        ...baseProjectData.projectInfo,
        projectName: "Cloud Innovations Setup",
        projectObjectives: ["Business Expansion", "Regulatory/Compliance"]
      },
      customerInfo: {
        ...baseProjectData.customerInfo,
        companyName: "Cloud Innovations",
        customerId: "CUST-003"
      },
      timeline: {
        submitted: "2023-12-20",
        feasibilityStarted: "2023-12-21",
        feasibilityComplete: "2023-12-25",
        preSalesStarted: "2023-12-25",
        preSalesComplete: "2024-01-10",
        customerReady: "2024-01-10"
      },
      comments: [
        {
          id: 1,
          author: "Alex Kumar",
          role: "Pre-Sales",
          timestamp: "2024-01-13 14:15",
          content: "Final proposal has been prepared and delivered to customer. Awaiting customer feedback and approval.",
          type: "update"
        },
        {
          id: 2,
          author: "David Park", 
          role: "Managed Services BD",
          timestamp: "2024-01-10 09:30",
          content: "SLA agreements finalized. 24/7 managed services package included as per customer requirements.",
          type: "comment"
        }
      ],
      documents: [
        { name: "Final Proposal.pdf", type: "pdf", size: "5.2 MB", uploadedBy: "Alex Kumar", uploadedDate: "2024-01-10" },
        { name: "SLA Agreement.pdf", type: "pdf", size: "2.1 MB", uploadedBy: "David Park", uploadedDate: "2024-01-10" },
        { name: "Technical Specifications.xlsx", type: "excel", size: "3.4 MB", uploadedBy: "Alex Kumar", uploadedDate: "2024-01-08" }
      ],
      auditTrail: [
        {
          id: 1,
          timestamp: "2024-01-10 14:30",
          user: "Alex Kumar",
          userRole: "Pre-Sales",
          action: "Status Update",
          description: "Project status updated to 'Ready for Customer'",
          details: "Final proposal delivered. Awaiting customer approval.",
          category: "status_change"
        }
      ],
      projectTimeline: {
        currentPhase: "customer-ready",
        phases: [
          {
            name: "Project Initiation",
            status: "completed",
            startDate: "2023-12-20",
            endDate: "2023-12-20",
            duration: "1 day",
            activities: ["Project creation", "Initial requirements gathering", "Team notification"],
            completedActivities: 3,
            totalActivities: 3
          },
          {
            name: "Feasibility Assessment",
            status: "completed", 
            startDate: "2023-12-21",
            endDate: "2023-12-25",
            duration: "4 days",
            activities: ["Technical assessment", "Resource availability check", "Cost analysis", "Risk evaluation"],
            completedActivities: 4,
            totalActivities: 4
          },
          {
            name: "Solution Design",
            status: "completed",
            startDate: "2023-12-25",
            endDate: "2024-01-05",
            duration: "11 days",
            activities: ["Architecture design", "Component selection", "Integration planning", "Documentation"],
            completedActivities: 4,
            totalActivities: 4
          },
          {
            name: "Proposal Creation",
            status: "completed",
            startDate: "2024-01-05",
            endDate: "2024-01-10",
            duration: "5 days", 
            activities: ["Pricing calculation", "Proposal drafting", "Review and approval", "Customer presentation"],
            completedActivities: 4,
            totalActivities: 4
          },
          {
            name: "Customer Review",
            status: "in_progress",
            startDate: "2024-01-10",
            endDate: "2024-01-20",
            duration: "10 days",
            activities: ["Customer presentation", "Feedback incorporation", "Contract negotiation", "Final approval"],
            completedActivities: 1,
            totalActivities: 4
          }
        ],
        milestones: [
          { name: "Project Created", date: "2023-12-20", status: "completed" },
          { name: "Feasibility Complete", date: "2023-12-25", status: "completed" },
          { name: "Solution Design Complete", date: "2024-01-05", status: "completed" },
          { name: "Proposal Ready", date: "2024-01-10", status: "completed" },
          { name: "Customer Presentation", date: "2024-01-10", status: "completed" },
          { name: "Customer Approval", date: "2024-01-20", status: "upcoming" }
        ]
      }
    },
    "PRJ-2024-006": {
      id: "PRJ-2024-006",
      name: "Banking Solutions Center",
      status: "Feasibility Pending",
      currentStage: "feasibility-pending",
      lastCompletedStep: 6,
      progress: 10,
      priority: "High",
      createdDate: "2024-01-15",
      lastUpdated: "2024-01-16",
      currentOwner: { name: "John Doe", role: "Account Manager", email: "john.doe@onesify.com" },
      assignedTeams: [
        { 
          name: "Operations", 
          lead: "Sarah Johnson", 
          leadEmail: "sarah.johnson@onesify.com",
          status: "pending",
          assignedDate: "2024-01-16",
          responsibilities: ["Technical feasibility assessment", "Infrastructure planning", "Resource allocation"]
        },
        { 
          name: "DC BD", 
          lead: "Mike Chen", 
          leadEmail: "mike.chen@onesify.com",
          status: "active",
          assignedDate: "2024-01-15",
          responsibilities: ["Customer relationship management", "Business requirements analysis", "Pricing coordination"]
        }
      ],
      ...baseProjectData,
      projectInfo: {
        ...baseProjectData.projectInfo,
        projectName: "Banking Solutions Center",
        projectObjectives: ["Regulatory/Compliance", "Disaster Recovery"]
      },
      customerInfo: {
        ...baseProjectData.customerInfo,
        companyName: "Banking Solutions Inc",
        customerId: "CUST-006"
      },
      timeline: {
        submitted: "2024-01-15",
        feasibilityStarted: null,
        feasibilityComplete: null,
        preSalesStarted: null,
        preSalesComplete: null,
        customerReady: null
      },
      comments: [
        {
          id: 1,
          author: "John Doe",
          role: "Account Manager",
          timestamp: "2024-01-16 10:30",
          content: "Project submitted for feasibility assessment. High priority due to regulatory compliance requirements.",
          type: "update"
        },
        {
          id: 2,
          author: "Mike Chen", 
          role: "DC BD",
          timestamp: "2024-01-15 16:45",
          content: "Customer has stringent security and compliance requirements. Need specialized assessment team.",
          type: "comment"
        }
      ],
      documents: [
        { name: "Banking Requirements.pdf", type: "pdf", size: "4.1 MB", uploadedBy: "John Doe", uploadedDate: "2024-01-15" },
        { name: "Compliance Checklist.xlsx", type: "excel", size: "1.9 MB", uploadedBy: "Mike Chen", uploadedDate: "2024-01-15" }
      ],
      auditTrail: [
        {
          id: 1,
          timestamp: "2024-01-16 10:30",
          user: "System",
          userRole: "System",
          action: "Team Assignment",
          description: "Operations team assigned for feasibility assessment",
          details: "Auto-assigned Sarah Johnson (Operations Lead) for technical feasibility assessment.",
          category: "assignment"
        },
        {
          id: 2,
          timestamp: "2024-01-15 16:45",
          user: "John Doe",
          userRole: "Account Manager",
          action: "Project Created",
          description: "New project created: Banking Solutions Center",
          details: "Project submitted with high priority for regulatory compliance requirements.",
          category: "creation"
        }
      ],
      projectTimeline: {
        currentPhase: "feasibility-pending",
        phases: [
          {
            name: "Project Initiation",
            status: "completed",
            startDate: "2024-01-15",
            endDate: "2024-01-15",
            duration: "1 day",
            activities: ["Project creation", "Initial requirements gathering", "Team notification"],
            completedActivities: 3,
            totalActivities: 3
          },
          {
            name: "Feasibility Assessment",
            status: "pending", 
            startDate: null,
            endDate: null,
            duration: "8 days",
            activities: ["Technical assessment", "Resource availability check", "Cost analysis", "Risk evaluation"],
            completedActivities: 0,
            totalActivities: 4
          }
        ],
        milestones: [
          { name: "Project Created", date: "2024-01-15", status: "completed" },
          { name: "Project Submitted", date: "2024-01-15", status: "completed" },
          { name: "Feasibility Assignment", date: "2024-01-16", status: "completed" },
          { name: "Feasibility Started", date: null, status: "pending" }
        ]
      }
    },
    "PRJ-2024-005": {
      id: "PRJ-2024-005",
      name: "Enterprise Corp Facility",
      status: "Not Feasible",
      currentStage: "not-feasible",
      lastCompletedStep: 6,
      progress: 0,
      priority: "Medium",
      createdDate: "2024-01-02",
      lastUpdated: "2024-01-11",
      currentOwner: { name: "Sarah Johnson", role: "Operations", email: "sarah.johnson@onesify.com" },
      assignedTeams: [
        { 
          name: "Operations", 
          lead: "Sarah Johnson", 
          leadEmail: "sarah.johnson@onesify.com",
          status: "completed",
          assignedDate: "2024-01-03",
          responsibilities: ["Technical feasibility assessment", "Infrastructure analysis", "Final assessment report"]
        }
      ],
      ...baseProjectData,
      projectInfo: {
        ...baseProjectData.projectInfo,
        projectName: "Enterprise Corp Facility",
        projectObjectives: ["Business Expansion", "Improved Performance/Uptime"]
      },
      customerInfo: {
        ...baseProjectData.customerInfo,
        companyName: "Enterprise Corp",
        customerId: "CUST-005"
      },
      timeline: {
        submitted: "2024-01-02",
        feasibilityStarted: "2024-01-03",
        feasibilityComplete: "2024-01-08",
        preSalesStarted: null,
        preSalesComplete: null,
        customerReady: null
      },
      comments: [
        {
          id: 1,
          author: "Sarah Johnson",
          role: "Operations",
          timestamp: "2024-01-11 16:00",
          content: "Final assessment completed. Project deemed not feasible due to power infrastructure limitations and space constraints at requested location.",
          type: "update"
        },
        {
          id: 2,
          author: "Mike Chen", 
          role: "DC BD",
          timestamp: "2024-01-08 14:20",
          content: "Customer requirements exceed current facility capabilities. Alternative solutions discussed but not viable within budget constraints.",
          type: "comment"
        }
      ],
      documents: [
        { name: "Feasibility Assessment Report.pdf", type: "pdf", size: "3.8 MB", uploadedBy: "Sarah Johnson", uploadedDate: "2024-01-08" },
        { name: "Alternative Solutions Analysis.xlsx", type: "excel", size: "2.1 MB", uploadedBy: "Sarah Johnson", uploadedDate: "2024-01-10" },
        { name: "Customer Requirements.pdf", type: "pdf", size: "1.5 MB", uploadedBy: "Mike Chen", uploadedDate: "2024-01-03" }
      ],
      auditTrail: [
        {
          id: 1,
          timestamp: "2024-01-11 16:00",
          user: "Sarah Johnson",
          userRole: "Operations",
          action: "Project Status Update",
          description: "Project status updated to 'Not Feasible'",
          details: "Final feasibility assessment completed. Project requirements cannot be met within current infrastructure constraints.",
          category: "status_change"
        },
        {
          id: 2,
          timestamp: "2024-01-08 14:20",
          user: "Sarah Johnson",
          userRole: "Operations",
          action: "Assessment Complete",
          description: "Feasibility assessment completed",
          details: "Technical assessment shows power and space limitations prevent project viability.",
          category: "assessment"
        }
      ],
      projectTimeline: {
        currentPhase: "not-feasible",
        phases: [
          {
            name: "Project Initiation",
            status: "completed",
            startDate: "2024-01-02",
            endDate: "2024-01-02",
            duration: "1 day",
            activities: ["Project creation", "Initial requirements gathering", "Team notification"],
            completedActivities: 3,
            totalActivities: 3
          },
          {
            name: "Feasibility Assessment",
            status: "completed", 
            startDate: "2024-01-03",
            endDate: "2024-01-08",
            duration: "5 days",
            activities: ["Technical assessment", "Resource availability check", "Cost analysis", "Risk evaluation"],
            completedActivities: 4,
            totalActivities: 4
          }
        ],
        milestones: [
          { name: "Project Created", date: "2024-01-02", status: "completed" },
          { name: "Feasibility Started", date: "2024-01-03", status: "completed" },
          { name: "Technical Assessment Complete", date: "2024-01-06", status: "completed" },
          { name: "Feasibility Assessment Complete", date: "2024-01-08", status: "completed" },
          { name: "Project Marked Not Feasible", date: "2024-01-11", status: "completed" }
        ]
      }
    },
    "PRJ-2024-007": {
      id: "PRJ-2024-007",
      name: "FinTech Startup Infrastructure",
      status: "BD Review Pending",
      currentStage: "bd-review",
      lastCompletedStep: 6,
      progress: 15,
      priority: "Medium",
      createdDate: "2024-01-16",
      lastUpdated: "2024-01-17",
      currentOwner: { name: "Mike Chen", role: "DC BD", email: "mike.chen@onesify.com" },
      assignedTeams: [
        { 
          name: "DC BD", 
          lead: "Mike Chen", 
          leadEmail: "mike.chen@onesify.com",
          status: "active",
          assignedDate: "2024-01-16",
          responsibilities: ["Data center requirements review", "Infrastructure planning assistance", "Technical specification validation"]
        },
        { 
          name: "Network BD", 
          lead: "Lisa Wang", 
          leadEmail: "lisa.wang@onesify.com",
          status: "active",
          assignedDate: "2024-01-16",
          responsibilities: ["Network connectivity assessment", "Bandwidth requirements review", "Carrier selection guidance"]
        }
      ],
      ...baseProjectData,
      projectInfo: {
        ...baseProjectData.projectInfo,
        projectName: "FinTech Startup Infrastructure",
        projectObjectives: ["Business Expansion", "Improved Performance/Uptime"]
      },
      customerInfo: {
        ...baseProjectData.customerInfo,
        companyName: "FinTech Innovations",
        customerId: "CUST-007"
      },
      timeline: {
        submitted: "2024-01-16",
        bdReviewStarted: "2024-01-16",
        bdReviewComplete: null,
        feasibilityStarted: null,
        feasibilityComplete: null,
        preSalesStarted: null,
        preSalesComplete: null,
        customerReady: null
      },
      comments: [
        {
          id: 1,
          author: "Mike Chen",
          role: "DC BD",
          timestamp: "2024-01-17 11:15",
          content: "Reviewing project requirements. Customer needs clarification on power redundancy requirements and rack specifications.",
          type: "update"
        },
        {
          id: 2,
          author: "Lisa Wang", 
          role: "Network BD",
          timestamp: "2024-01-17 09:30",
          content: "Network requirements review in progress. Need to validate bandwidth projections and connectivity options.",
          type: "comment"
        },
        {
          id: 3,
          author: "John Doe",
          role: "Account Manager",
          timestamp: "2024-01-16 16:45",
          content: "Project sent to BD teams for requirements review and validation before proceeding to feasibility assessment.",
          type: "update"
        }
      ],
      documents: [
        { name: "Initial Requirements.pdf", type: "pdf", size: "2.1 MB", uploadedBy: "John Doe", uploadedDate: "2024-01-16" },
        { name: "FinTech Infrastructure Specs.xlsx", type: "excel", size: "1.4 MB", uploadedBy: "Mike Chen", uploadedDate: "2024-01-17" }
      ],
      auditTrail: [
        {
          id: 1,
          timestamp: "2024-01-17 11:15",
          user: "Mike Chen",
          userRole: "DC BD",
          action: "Requirements Review",
          description: "Started DC requirements review",
          details: "Reviewing power, cooling, and space requirements. Customer clarification needed.",
          category: "review"
        },
        {
          id: 2,
          timestamp: "2024-01-16 16:45",
          user: "John Doe",
          userRole: "Account Manager",
          action: "BD Assignment",
          description: "Project assigned to BD teams for review",
          details: "Sent to DC BD and Network BD teams for requirements validation before feasibility assessment.",
          category: "assignment"
        }
      ],
      projectTimeline: {
        currentPhase: "bd-review",
        phases: [
          {
            name: "Project Initiation",
            status: "completed",
            startDate: "2024-01-16",
            endDate: "2024-01-16",
            duration: "1 day",
            activities: ["Project creation", "Initial requirements gathering", "BD team notification"],
            completedActivities: 3,
            totalActivities: 3
          },
          {
            name: "BD Requirements Review",
            status: "in_progress", 
            startDate: "2024-01-16",
            endDate: "2024-01-20",
            duration: "4 days",
            activities: ["DC requirements validation", "Network requirements review", "Technical specifications clarification", "Requirements documentation"],
            completedActivities: 2,
            totalActivities: 4
          },
          {
            name: "Feasibility Assessment",
            status: "pending", 
            startDate: null,
            endDate: null,
            duration: "8 days",
            activities: ["Technical assessment", "Resource availability check", "Cost analysis", "Risk evaluation"],
            completedActivities: 0,
            totalActivities: 4
          }
        ],
        milestones: [
          { name: "Project Created", date: "2024-01-16", status: "completed" },
          { name: "BD Teams Assigned", date: "2024-01-16", status: "completed" },
          { name: "BD Review Started", date: "2024-01-16", status: "completed" },
          { name: "Requirements Clarification", date: "2024-01-18", status: "upcoming" },
          { name: "BD Review Complete", date: "2024-01-20", status: "upcoming" }
        ]
      }
    },
    "PRJ-2024-008": {
      id: "PRJ-2024-008",
      name: "Healthcare Data Center Setup",
      status: "BD Review In Progress",
      currentStage: "bd-review-active",
      lastCompletedStep: 6,
      progress: 25,
      priority: "High",
      createdDate: "2024-01-15",
      lastUpdated: "2024-01-18",
      currentOwner: { name: "David Park", role: "Managed Services BD", email: "david.park@onesify.com" },
      assignedTeams: [
        { 
          name: "DC BD", 
          lead: "Mike Chen", 
          leadEmail: "mike.chen@onesify.com",
          status: "active",
          assignedDate: "2024-01-15",
          responsibilities: ["Data center compliance review", "HIPAA infrastructure requirements", "Security protocol validation"]
        },
        { 
          name: "Managed Services BD", 
          lead: "David Park", 
          leadEmail: "david.park@onesify.com",
          status: "active",
          assignedDate: "2024-01-15",
          responsibilities: ["Healthcare compliance services", "24/7 monitoring requirements", "Backup and recovery planning"]
        }
      ],
      ...baseProjectData,
      projectInfo: {
        ...baseProjectData.projectInfo,
        projectName: "Healthcare Data Center Setup",
        projectObjectives: ["Regulatory/Compliance", "Disaster Recovery"],
        location: "Chennai, Tamil Nadu",
        priority: "High",
        contractTerm: "5 Years",
        timeline: "Q1 2024",
        budgetRange: "₹75-100L",
        currentInfrastructure: "Legacy on-premise with basic backup",
        requirementDescription: "HIPAA compliant infrastructure with 99.99% uptime, encrypted storage, and comprehensive disaster recovery capabilities"
      },
      customerInfo: {
        ...baseProjectData.customerInfo,
        companyName: "Healthcare Systems Inc",
        customerId: "CUST-008",
        businessType: "Healthcare",
        city: "Chennai",
        state: "Tamil Nadu"
      },
      timeline: {
        submitted: "2024-01-15",
        bdReviewStarted: "2024-01-15",
        bdReviewComplete: null,
        feasibilityStarted: null,
        feasibilityComplete: null,
        preSalesStarted: null,
        preSalesComplete: null,
        customerReady: null
      },
      comments: [
        {
          id: 1,
          author: "David Park",
          role: "Managed Services BD",
          timestamp: "2024-01-18 14:20",
          content: "Updated managed services requirements to include HIPAA compliance monitoring. Added 24/7 SOC services and enhanced backup protocols.",
          type: "bd_update"
        },
        {
          id: 2,
          author: "Mike Chen", 
          role: "DC BD",
          timestamp: "2024-01-18 10:30",
          content: "Revised power requirements to N+2 redundancy for healthcare compliance. Updated cooling specifications for sensitive medical equipment.",
          type: "bd_update"
        },
        {
          id: 3,
          author: "John Doe",
          role: "Account Manager",
          timestamp: "2024-01-15 16:00",
          content: "Project submitted for BD review. Customer has strict healthcare compliance requirements.",
          type: "update"
        }
      ],
      documents: [
        { name: "Healthcare Requirements.pdf", type: "pdf", size: "3.2 MB", uploadedBy: "John Doe", uploadedDate: "2024-01-15" },
        { name: "HIPAA Compliance Checklist.xlsx", type: "excel", size: "1.8 MB", uploadedBy: "David Park", uploadedDate: "2024-01-17" },
        { name: "Updated Power Specifications.pdf", type: "pdf", size: "2.1 MB", uploadedBy: "Mike Chen", uploadedDate: "2024-01-18" }
      ],
      auditTrail: [
        {
          id: 1,
          timestamp: "2024-01-18 14:20",
          user: "David Park",
          userRole: "Managed Services BD",
          action: "Field Update",
          description: "Updated managed services requirements",
          details: "Added HIPAA compliance monitoring, 24/7 SOC services, and enhanced backup protocols based on healthcare industry standards.",
          category: "bd_review"
        },
        {
          id: 2,
          timestamp: "2024-01-18 10:30",
          user: "Mike Chen",
          userRole: "DC BD",
          action: "Field Update", 
          description: "Revised power and cooling requirements",
          details: "Changed power redundancy from N+1 to N+2 for healthcare compliance. Updated cooling specifications for medical equipment sensitivity.",
          category: "bd_review"
        },
        {
          id: 3,
          timestamp: "2024-01-15 16:00",
          user: "John Doe",
          userRole: "Account Manager",
          action: "BD Assignment",
          description: "Project assigned to BD teams for healthcare compliance review",
          details: "Sent to DC BD and Managed Services BD teams for specialized healthcare requirements validation.",
          category: "assignment"
        }
      ],
      projectTimeline: {
        currentPhase: "bd-review-active",
        phases: [
          {
            name: "Project Initiation",
            status: "completed",
            startDate: "2024-01-15",
            endDate: "2024-01-15",
            duration: "1 day",
            activities: ["Project creation", "Initial requirements gathering", "BD team notification"],
            completedActivities: 3,
            totalActivities: 3
          },
          {
            name: "BD Requirements Review",
            status: "in_progress", 
            startDate: "2024-01-15",
            endDate: "2024-01-22",
            duration: "7 days",
            activities: ["Healthcare compliance validation", "Power/cooling requirements review", "Managed services specification", "Security protocol validation"],
            completedActivities: 3,
            totalActivities: 4
          },
          {
            name: "Feasibility Assessment",
            status: "pending", 
            startDate: null,
            endDate: null,
            duration: "10 days",
            activities: ["Technical assessment", "Resource availability check", "Compliance verification", "Risk evaluation"],
            completedActivities: 0,
            totalActivities: 4
          }
        ],
        milestones: [
          { name: "Project Created", date: "2024-01-15", status: "completed" },
          { name: "BD Teams Assigned", date: "2024-01-15", status: "completed" },
          { name: "BD Review Started", date: "2024-01-15", status: "completed" },
          { name: "Power Requirements Updated", date: "2024-01-18", status: "completed" },
          { name: "Managed Services Specified", date: "2024-01-18", status: "completed" },
          { name: "BD Review Complete", date: "2024-01-22", status: "upcoming" }
        ]
      },
      bdInputs: {
        fieldsReviewed: [
          {
            fieldName: "Power Redundancy",
            originalValue: "N+1",
            bdUpdatedValue: "N+2",
            bdReason: "Healthcare compliance requires higher redundancy levels for critical medical systems",
            updatedBy: "Mike Chen (DC BD)",
            updatedDate: "2024-01-18",
            status: "updated"
          },
          {
            fieldName: "Cooling Requirements",
            originalValue: "Standard precision cooling",
            bdUpdatedValue: "Enhanced precision cooling with environmental monitoring for medical equipment",
            bdReason: "Medical equipment requires stricter temperature and humidity controls",
            updatedBy: "Mike Chen (DC BD)",
            updatedDate: "2024-01-18",
            status: "updated"
          },
          {
            fieldName: "Managed Services",
            originalValue: "Basic 24/7 monitoring",
            bdUpdatedValue: "HIPAA compliant 24/7 SOC monitoring with incident response",
            bdReason: "Healthcare data requires specialized compliance monitoring and faster incident response",
            updatedBy: "David Park (Managed Services BD)",
            updatedDate: "2024-01-18",
            status: "updated"
          },
          {
            fieldName: "Backup Services",
            originalValue: "Weekly tape rotation",
            bdUpdatedValue: "Daily encrypted backup with secure offsite storage and point-in-time recovery",
            bdReason: "Healthcare data protection regulations require more frequent and secure backup protocols",
            updatedBy: "David Park (Managed Services BD)",
            updatedDate: "2024-01-18",
            status: "updated"
          },
          {
            fieldName: "Access Control",
            originalValue: "Biometric + Card access",
            bdUpdatedValue: "Multi-factor biometric + Card + PIN with audit logging for HIPAA compliance",
            bdReason: "Healthcare compliance requires enhanced access control with comprehensive audit trails",
            updatedBy: "Mike Chen (DC BD)",
            updatedDate: "2024-01-17",
            status: "updated"
          }
        ],
        newFieldsAdded: [
          {
            fieldName: "HIPAA Compliance Monitoring",
            bdAddedValue: "Continuous compliance monitoring with automated reporting and breach detection",
            bdReason: "Healthcare industry requirement for ongoing compliance verification",
            addedBy: "David Park (Managed Services BD)",
            addedDate: "2024-01-17",
            status: "new"
          },
          {
            fieldName: "Medical Equipment Environmental Controls",
            bdAddedValue: "Specialized environmental monitoring for temperature-sensitive medical equipment",
            bdReason: "Medical devices require specific environmental conditions for proper operation",
            addedBy: "Mike Chen (DC BD)",
            addedDate: "2024-01-18",
            status: "new"
          }
        ],
        overallSummary: "BD teams have enhanced the original requirements to meet healthcare industry compliance standards, focusing on HIPAA requirements, enhanced redundancy, and specialized monitoring capabilities."
      }
    },
  };

  return projects[projectId] || projects["PRJ-2024-001"];
};

const getAvailableDataSections = (lastCompletedStep: number, projectId: string) => {
  // For specific project IDs, show all sections regardless of completion status
  const showAllSections = ["PRJ-2024-001", "PRJ-2024-002", "PRJ-2024-003", "PRJ-2024-005", "PRJ-2024-006", "PRJ-2024-007", "PRJ-2024-008"].includes(projectId);
  
  if (showAllSections) {
    return {
      projectInfo: true,
      customerInfo: true,
      spacePowerCooling: true,
      crossConnect: true,
      officeStorage: true,
      valueAddedServices: true,
      slaCompliance: true
    };
  }
  
  const sections = {
    projectInfo: lastCompletedStep >= 1,
    customerInfo: lastCompletedStep >= 2,
    spacePowerCooling: lastCompletedStep >= 5,
    crossConnect: lastCompletedStep >= 3,
    officeStorage: lastCompletedStep >= 4,
    valueAddedServices: lastCompletedStep >= 6,
    slaCompliance: lastCompletedStep >= 6
  };
  return sections;
};

export function ProjectDetailView() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [newComment, setNewComment] = useState("");
  const [activeTab, setActiveTab] = useState("details");

  const handleAddComment = () => {
    if (newComment.trim()) {
      // In a real app, this would make an API call to save the comment
      setNewComment("");
      // You could also update the local state or trigger a refresh
    }
  };

  const project = getProjectDetailById(projectId || "PRJ-2024-001");
  const availableDataSections = getAvailableDataSections(project.lastCompletedStep || 0, project.id);

  const isDraftStatus = project.status === "Draft";

  const handleContinueEditing = () => {
    const lastStep = project.lastCompletedStep || 1;
    if (lastStep === 1) {
      navigate("/new-project");
    } else {
      navigate(`/new-project/step${Math.min(lastStep + 1, 6)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Projects</span>
            </Button>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Share className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              {project.id === "PRJ-2024-005" && (
                <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                  <XCircle className="w-4 h-4 mr-2" />
                  Close Project
                </Button>
              )}
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <div className="flex items-center space-x-4 mb-2">
              <h1 className="text-2xl font-semibold text-gray-900">{project.name}</h1>
              <Badge 
                variant="outline"
                className={`px-3 py-1 border ${
                  project.status === "Draft" ? "bg-gray-100 text-gray-700 border-gray-200" :
                  project.status === "BD Review Pending" ? "bg-orange-100 text-orange-700 border-orange-200" :
                  project.status === "BD Review In Progress" ? "bg-amber-100 text-amber-700 border-amber-200" :
                  project.status === "Feasibility Pending" ? "bg-yellow-100 text-yellow-700 border-yellow-200" :
                  project.status === "Feasibility In Progress" ? "bg-blue-100 text-blue-700 border-blue-200" :
                  project.status === "Feasible" ? "bg-green-100 text-green-700 border-green-200" :
                  project.status === "Partial" ? "bg-orange-100 text-orange-700 border-orange-200" :
                  project.status === "Not Feasible" ? "bg-red-100 text-red-700 border-red-200" :
                  project.status === "Pre-Sales Pending" ? "bg-purple-100 text-purple-700 border-purple-200" :
                  project.status === "Solution in progress" ? "bg-indigo-100 text-indigo-700 border-indigo-200" :
                  project.status === "BOM Created" ? "bg-cyan-100 text-cyan-700 border-cyan-200" :
                  project.status === "Solution Created" ? "bg-teal-100 text-teal-700 border-teal-200" :
                  project.status === "Ready for Customer" ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                  project.status === "Closed" ? "bg-slate-100 text-slate-700 border-slate-200" :
                  "bg-gray-100 text-gray-700 border-gray-200"
                }`}
              >
                {project.status}
              </Badge>
              <Badge 
                variant={
                  project.priority === "Critical" ? "destructive" :
                  project.priority === "High" ? "default" :
                  "outline"
                }
                className="px-2 py-1"
              >
                {project.priority}
              </Badge>
            </div>
            <p className="text-gray-600">{project.id} • Created {project.createdDate} • Last updated {project.lastUpdated}</p>
          </div>
        </div>

        {/* Current Owner Card */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <UserCheck className="w-4 h-4" />
                <span>Current Owner:</span>
              </div>
              <Avatar className="w-7 h-7">
                <AvatarFallback className="text-xs">{project.currentOwner.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <span className="font-medium text-sm">{project.currentOwner.name}</span>
                <span className="text-xs text-gray-500 ml-2">({project.currentOwner.role})</span>
              </div>
            </div>
            
            {isDraftStatus && (
              <Button onClick={handleContinueEditing} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                Continue Editing
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full ${(project.status === "BD Review In Progress" || project.status === "BD Review Pending") ? "grid-cols-7" : "grid-cols-6"}`}>
            <TabsTrigger value="details">Project Details</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
            {(project.status === "BD Review In Progress" || project.status === "BD Review Pending") && (
              <TabsTrigger value="bd-inputs">BD Inputs</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <Accordion type="multiple" defaultValue={["projectInfo", "customerInfo", "spacePowerCooling", "crossConnect", "officeStorage", "valueAddedServices", "slaCompliance"]} className="space-y-4">
              
              {/* Project Information */}
              {availableDataSections.projectInfo && project.projectInfo && (
                <AccordionItem value="projectInfo" className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <AccordionTrigger className="hover:no-underline px-6 py-4 rounded-t-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <Building className="w-5 h-5 text-blue-600" />
                      <span className="text-left">
                        <h3 className="font-medium">Project Information</h3>
                        <p className="text-sm text-gray-500">Basic project details and requirements</p>
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 px-6 pb-6 bg-gray-50 rounded-b-lg border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Project Name</label>
                        <p className="text-gray-900">{project.projectInfo.projectName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Location</label>
                        <p className="text-gray-900">{project.projectInfo.location}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Priority</label>
                        <p className="text-gray-900">{project.projectInfo.priority}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Contract Term</label>
                        <p className="text-gray-900">{project.projectInfo.contractTerm}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Timeline</label>
                        <p className="text-gray-900">{project.projectInfo.timeline}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Budget Range</label>
                        <p className="text-gray-900">{project.projectInfo.budgetRange}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-500">Project Objectives</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.projectInfo.projectObjectives.map((objective) => (
                          <Badge key={objective} variant="outline">{objective}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-500">Current Infrastructure</label>
                      <p className="text-gray-900 mt-1">{project.projectInfo.currentInfrastructure}</p>
                    </div>

                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-500">Requirement Description</label>
                      <p className="text-gray-900 mt-1">{project.projectInfo.requirementDescription}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Customer Information */}
              {availableDataSections.customerInfo && project.customerInfo && (
                <AccordionItem value="customerInfo" className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <AccordionTrigger className="hover:no-underline px-6 py-4 rounded-t-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-green-600" />
                      <span className="text-left">
                        <h3 className="font-medium">Customer Information</h3>
                        <p className="text-sm text-gray-500">Customer details and contact information</p>
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 px-6 pb-6 bg-gray-50 rounded-b-lg border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Company Name</label>
                        <p className="text-gray-900">{project.customerInfo.companyName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Customer ID</label>
                        <p className="text-gray-900">{project.customerInfo.customerId}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Business Type</label>
                        <p className="text-gray-900">{project.customerInfo.businessType}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">PAN Number</label>
                        <p className="text-gray-900">{project.customerInfo.panNumber}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">GST Number</label>
                        <p className="text-gray-900">{project.customerInfo.gstNumber}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Contact Person</label>
                        <p className="text-gray-900">{project.customerInfo.contactPersonName}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-500">Address</label>
                      <p className="text-gray-900 mt-1">
                        {project.customerInfo.addressLine1}, {project.customerInfo.addressLine2}<br />
                        {project.customerInfo.city}, {project.customerInfo.state} - {project.customerInfo.pinCode}
                      </p>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-gray-900">{project.customerInfo.contactEmail}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone</label>
                        <p className="text-gray-900">{project.customerInfo.contactPhone}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Cross Connect */}
              {availableDataSections.crossConnect && project.crossConnect && (
                <AccordionItem value="crossConnect" className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <AccordionTrigger className="hover:no-underline px-6 py-4 rounded-t-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <Network className="w-5 h-5 text-indigo-600" />
                      <span className="text-left">
                        <h3 className="font-medium">Cross Connect</h3>
                        <p className="text-sm text-gray-500">Network connectivity and carrier connections</p>
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 px-6 pb-6 bg-gray-50 rounded-b-lg border-t border-gray-100">
                    <div className="space-y-4">
                      {project.crossConnect.connections.map((connection, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-500">Connection Type</label>
                              <p className="text-gray-900">{connection.connectionType}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Bandwidth</label>
                              <p className="text-gray-900">{connection.bandwidth}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Distance</label>
                              <p className="text-gray-900">{connection.distance}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Point A</label>
                              <p className="text-gray-900">{connection.pointA}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Point B</label>
                              <p className="text-gray-900">{connection.pointB}</p>
                            </div>
                            {connection.carrierName && (
                              <div>
                                <label className="text-sm font-medium text-gray-500">Carrier</label>
                                <p className="text-gray-900">{connection.carrierName}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Office & Storage Space */}
              {availableDataSections.officeStorage && project.officeStorage && (
                <AccordionItem value="officeStorage" className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <AccordionTrigger className="hover:no-underline px-6 py-4 rounded-t-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <Building className="w-5 h-5 text-teal-600" />
                      <span className="text-left">
                        <h3 className="font-medium">Office & Storage Space</h3>
                        <p className="text-sm text-gray-500">Office space and storage requirements</p>
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 px-6 pb-6 bg-gray-50 rounded-b-lg border-t border-gray-100">
                    <div className="space-y-4">
                      {project.officeStorage.sharedSeatingSpace?.selected && (
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h4 className="font-medium text-gray-900 mb-2">Shared Seating Space</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <span className="text-sm text-gray-600">Basic Seats:</span>
                              <p className="text-gray-900">{project.officeStorage.sharedSeatingSpace.basicSeats}</p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">Premium Seats:</span>
                              <p className="text-gray-900">{project.officeStorage.sharedSeatingSpace.premiumSeats}</p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">Amenities:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {project.officeStorage.sharedSeatingSpace.amenities.map((amenity) => (
                                  <Badge key={amenity} variant="outline" className="text-xs">{amenity}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {project.officeStorage.secureOfficeSpace?.selected && (
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h4 className="font-medium text-gray-900 mb-2">Secure Office Space</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <span className="text-sm text-gray-600">Workstation Cabins:</span>
                              <p className="text-gray-900">{project.officeStorage.secureOfficeSpace.workstationCabins}</p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">Additional Workstations:</span>
                              <p className="text-gray-900">{project.officeStorage.secureOfficeSpace.additionalWorkstations}</p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">Size:</span>
                              <p className="text-gray-900">{project.officeStorage.secureOfficeSpace.size}</p>
                            </div>
                          </div>
                          <div className="mt-2">
                            <span className="text-sm text-gray-600">Amenities:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {project.officeStorage.secureOfficeSpace.amenities.map((amenity) => (
                                <Badge key={amenity} variant="outline" className="text-xs">{amenity}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {project.officeStorage.storageSpace?.selected && (
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h4 className="font-medium text-gray-900 mb-2">Storage Space</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <span className="text-sm text-gray-600">Size:</span>
                              <p className="text-gray-900">{project.officeStorage.storageSpace.size}</p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">Type:</span>
                              <p className="text-gray-900">{project.officeStorage.storageSpace.storageType}</p>
                            </div>
                          </div>
                          {project.officeStorage.storageSpace.additionalInfo && (
                            <div className="mt-2">
                              <span className="text-sm text-gray-600">Additional Info:</span>
                              <p className="text-gray-900 text-sm">{project.officeStorage.storageSpace.additionalInfo}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Space, Power & Cooling */}
              {availableDataSections.spacePowerCooling && project.spacePowerCooling && (
                <AccordionItem value="spacePowerCooling" className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <AccordionTrigger className="hover:no-underline px-6 py-4 rounded-t-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <Server className="w-5 h-5 text-orange-600" />
                      <span className="text-left">
                        <h3 className="font-medium">Space, Power & Cooling</h3>
                        <p className="text-sm text-gray-500">Infrastructure and capacity requirements</p>
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 px-6 pb-6 bg-gray-50 rounded-b-lg border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Colocation Model</label>
                        <p className="text-gray-900">{project.spacePowerCooling.colocationModel}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Suite Size</label>
                        <p className="text-gray-900">{project.spacePowerCooling.suiteSize}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">DC Location</label>
                        <p className="text-gray-900">{project.spacePowerCooling.dcLocation}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Power Requirement</label>
                        <p className="text-gray-900">{project.spacePowerCooling.powerRequirement}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Power Redundancy</label>
                        <p className="text-gray-900">{project.spacePowerCooling.powerRedundancy}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Cooling Requirement</label>
                        <p className="text-gray-900">{project.spacePowerCooling.coolingRequirement}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-500">Rack Configuration</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        {project.spacePowerCooling.rackConfiguration.rackGroups.map((rack, index) => (
                          <div key={index} className="bg-white p-3 rounded border">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-gray-600">Quantity:</span>
                                <p className="text-gray-900">{rack.quantity}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Size:</span>
                                <p className="text-gray-900">{rack.size}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Type:</span>
                                <p className="text-gray-900">{rack.type}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Dimensions:</span>
                                <p className="text-gray-900">{rack.dimensions}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Value Added Services */}
              {availableDataSections.valueAddedServices && project.valueAddedServices && (
                <AccordionItem value="valueAddedServices" className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <AccordionTrigger className="hover:no-underline px-6 py-4 rounded-t-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <Settings className="w-5 h-5 text-purple-600" />
                      <span className="text-left">
                        <h3 className="font-medium">Value Added Services</h3>
                        <p className="text-sm text-gray-500">Additional services and support options</p>
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 px-6 pb-6 bg-gray-50 rounded-b-lg border-t border-gray-100">
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-3">Support Services</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {project.valueAddedServices.remoteHands?.selected && (
                            <div>
                              <span className="text-sm text-gray-600">Remote Hands:</span>
                              <p className="text-gray-900">{project.valueAddedServices.remoteHands.quantity} hours/month</p>
                            </div>
                          )}
                          {project.valueAddedServices.smartHands?.selected && (
                            <div>
                              <span className="text-sm text-gray-600">Smart Hands:</span>
                              <p className="text-gray-900">{project.valueAddedServices.smartHands.quantity} hours/month</p>
                            </div>
                          )}
                          {project.valueAddedServices.migration?.selected && (
                            <div>
                              <span className="text-sm text-gray-600">Migration Support:</span>
                              <p className="text-gray-900">Included</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {project.valueAddedServices.storageTapeServices && (
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h4 className="font-medium text-gray-900 mb-3">Storage & Tape Services</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {project.valueAddedServices.storageTapeServices.tapeRotation?.selected && (
                              <div>
                                <span className="text-sm text-gray-600">Tape Rotation:</span>
                                <p className="text-gray-900">{project.valueAddedServices.storageTapeServices.tapeRotation.frequency} - {project.valueAddedServices.storageTapeServices.tapeRotation.quantity} tapes</p>
                              </div>
                            )}
                            {project.valueAddedServices.storageTapeServices.fireVault?.selected && (
                              <div>
                                <span className="text-sm text-gray-600">Fire Vault:</span>
                                <p className="text-gray-900">{project.valueAddedServices.storageTapeServices.fireVault.uSize} - {project.valueAddedServices.storageTapeServices.fireVault.quantity} units</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {project.valueAddedServices.additionalServices && (
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h4 className="font-medium text-gray-900 mb-3">Additional Services</h4>
                          <div className="flex flex-wrap gap-2">
                            {project.valueAddedServices.additionalServices.rackingStacking?.selected && (
                              <Badge variant="secondary">Racking & Stacking</Badge>
                            )}
                            {project.valueAddedServices.additionalServices.intelligentPDU?.selected && (
                              <Badge variant="secondary">Intelligent PDU</Badge>
                            )}
                            {project.valueAddedServices.additionalServices.accessSystem?.selected && (
                              <Badge variant="secondary">Access System: {project.valueAddedServices.additionalServices.accessSystem.accessType}</Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {project.valueAddedServices.additionalRequirements && (
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h4 className="font-medium text-gray-900 mb-2">Additional Requirements</h4>
                          <p className="text-gray-700 text-sm">{project.valueAddedServices.additionalRequirements}</p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* SLA & Compliance */}
              {availableDataSections.slaCompliance && project.slaCompliance && (
                <AccordionItem value="slaCompliance" className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <AccordionTrigger className="hover:no-underline px-6 py-4 rounded-t-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span className="text-left">
                        <h3 className="font-medium">SLA & Compliance</h3>
                        <p className="text-sm text-gray-500">Service level agreements and compliance requirements</p>
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 px-6 pb-6 bg-gray-50 rounded-b-lg border-t border-gray-100">
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-2">SLA Requirements</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <span className="text-sm text-gray-600">Uptime SLA:</span>
                            <p className="text-gray-900 font-medium">{project.slaCompliance.slaRequirements.uptime}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Power SLA:</span>
                            <p className="text-gray-900 font-medium">{project.slaCompliance.slaRequirements.powerSLA}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Cooling SLA:</span>
                            <p className="text-gray-900 font-medium">{project.slaCompliance.slaRequirements.coolingSLA}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Network SLA:</span>
                            <p className="text-gray-900 font-medium">{project.slaCompliance.slaRequirements.networkSLA}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-2">Compliance Requirements</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.slaCompliance.complianceRequirements.map((requirement) => (
                            <Badge key={requirement} variant="secondary">{requirement}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-2">Reporting Requirements</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-gray-600">Frequency:</span>
                            <p className="text-gray-900">{project.slaCompliance.reportingRequirements.frequency}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Delivery Method:</span>
                            <p className="text-gray-900">{project.slaCompliance.reportingRequirements.deliveryMethod}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="text-sm text-gray-600">Metrics:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {project.slaCompliance.reportingRequirements.metrics.map((metric) => (
                              <Badge key={metric} variant="outline" className="text-xs">{metric}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Project Timeline</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {project.projectTimeline.phases.map((phase, index) => (
                    <div key={phase.name} className="relative">
                      <div className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                          phase.status === 'completed' ? 'bg-green-500 border-green-500' :
                          phase.status === 'in_progress' ? 'bg-blue-500 border-blue-500' :
                          'bg-gray-200 border-gray-300'
                        }`}>
                          {phase.status === 'completed' && <span className="text-white text-xs">✓</span>}
                          {phase.status === 'in_progress' && <span className="text-white text-xs">◐</span>}
                          {phase.status === 'pending' && <span className="text-gray-500 text-xs">○</span>}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900">{phase.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span>{phase.startDate} - {phase.endDate || 'TBD'}</span>
                            <span>({phase.duration})</span>
                            <span>{phase.completedActivities}/{phase.totalActivities} activities</span>
                          </div>
                          <div className="mt-2">
                            <div className="bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  phase.status === 'completed' ? 'bg-green-500' :
                                  phase.status === 'in_progress' ? 'bg-blue-500' :
                                  'bg-gray-200'
                                }`}
                                style={{ width: `${(phase.completedActivities / phase.totalActivities) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {index < project.projectTimeline.phases.length - 1 && (
                        <div className="absolute left-4 top-8 w-0.5 h-16 bg-gray-300"></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teams" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Assigned Teams</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {project.assignedTeams.map((team) => (
                    <div key={team.name} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className={`w-3 h-3 rounded-full mt-2 ${team.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <div>
                          <h3 className="font-medium text-gray-900">{team.name}</h3>
                          <p className="text-sm text-gray-600">Lead: {team.lead}</p>
                          <p className="text-sm text-gray-500">{team.leadEmail}</p>
                          <p className="text-xs text-gray-500">Assigned: {team.assignedDate}</p>
                          
                          <div className="mt-2">
                            <p className="text-xs font-medium text-gray-700">Responsibilities:</p>
                            <ul className="text-xs text-gray-600 mt-1 space-y-1">
                              {team.responsibilities.map((resp) => (
                                <li key={resp} className="flex items-start">
                                  <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                  {resp}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <Badge variant={team.status === 'active' ? 'default' : 'secondary'}>
                        {team.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Comments & Updates</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {/* Add Comment Section */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Add Comment</h4>
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Enter your comment or update..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        Commenting as: <span className="font-medium">John Doe (Account Manager)</span>
                      </p>
                      <Button 
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Add Comment
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Recent Comments</h4>
                  {project.comments.map((comment) => (
                    <div key={comment.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                      <Avatar>
                        <AvatarFallback>{comment.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{comment.author}</span>
                            <span className="text-sm text-gray-500">({comment.role})</span>
                          </div>
                          <span className="text-xs text-gray-500">{comment.timestamp}</span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Documents</span>
                  </div>
                  <Button size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {project.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-gray-500" />
                        <div>
                          <h4 className="font-medium text-gray-900">{doc.name}</h4>
                          <p className="text-sm text-gray-500">{doc.size} • Uploaded by {doc.uploadedBy} • {doc.uploadedDate}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <History className="w-5 h-5" />
                  <span>Audit Trail</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {project.auditTrail.map((entry) => (
                    <div key={entry.id} className="flex items-start space-x-4 p-4 border-l-4 border-blue-200 bg-blue-50 rounded-r-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{entry.user}</span>
                            <span className="text-sm text-gray-500">({entry.userRole})</span>
                            <Badge variant="outline" className="text-xs">{entry.action}</Badge>
                          </div>
                          <span className="text-xs text-gray-500">{entry.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-1">{entry.description}</p>
                        <p className="text-xs text-gray-600">{entry.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* BD Inputs Tab - Only show for projects under BD review */}
          {(project.status === "BD Review In Progress" || project.status === "BD Review Pending") && (
            <TabsContent value="bd-inputs" className="space-y-6">
              {project.bdInputs ? (
                <>
                  {/* BD Review Summary */}
                  <Card className="bg-amber-50 border-amber-200">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-amber-800">
                        <AlertTriangle className="w-5 h-5" />
                        <span>BD Team Review Summary</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-amber-800">{project.bdInputs.overallSummary}</p>
                    </CardContent>
                  </Card>

                  {/* Field Updates */}
                  {project.bdInputs.fieldsReviewed && project.bdInputs.fieldsReviewed.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Edit className="w-5 h-5 text-gray-600" />
                      <span>Updated Requirements</span>
                    </CardTitle>
                    <CardDescription>
                      The following fields have been reviewed and updated by BD teams based on industry best practices and compliance requirements.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {project.bdInputs.fieldsReviewed.map((field, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                          {/* Header */}
                          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                            <h4 className="font-medium text-gray-900">{field.fieldName}</h4>
                            <Badge variant="outline" className="text-orange-700 border-orange-300">
                              Updated
                            </Badge>
                          </div>
                          
                          {/* Content */}
                          <div className="p-4 space-y-3">
                            {/* Compact Value Comparison */}
                            <div className="space-y-2">
                              <div className="flex items-center space-x-3">
                                <span className="text-sm text-gray-600 line-through">{field.originalValue}</span>
                                <ArrowRight className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-green-600">{field.bdUpdatedValue}</span>
                              </div>
                              
                              {/* BD Reasoning - Inline */}
                              <p className="text-xs text-gray-600 italic pl-2 border-l-2 border-blue-200">
                                {field.bdReason}
                              </p>
                            </div>
                            
                            {/* Meta Information */}
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>Updated by: <span className="font-medium">{field.updatedBy}</span></span>
                              <span>{field.updatedDate}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* New Fields Added */}
              {project.bdInputs.newFieldsAdded && project.bdInputs.newFieldsAdded.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Plus className="w-5 h-5 text-gray-600" />
                      <span>New Requirements Added</span>
                    </CardTitle>
                    <CardDescription>
                      BD teams have identified additional requirements that are essential for your project's success.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {project.bdInputs.newFieldsAdded.map((field, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                          {/* Header */}
                          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                            <h4 className="font-medium text-gray-900">{field.fieldName}</h4>
                            <Badge variant="outline" className="text-green-700 border-green-300">
                              New
                            </Badge>
                          </div>
                          
                          {/* Content */}
                          <div className="p-4 space-y-4">
                            {/* New Requirement */}
                            <div>
                              <label className="text-sm font-medium text-gray-500 mb-1 block">BD Added Requirement</label>
                              <div className="text-gray-900 p-3 bg-white border-l-4 border-l-blue-500 border-t border-r border-b border-gray-200 rounded text-sm">
                                {field.bdAddedValue}
                              </div>
                            </div>
                            
                            {/* BD Reasoning */}
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Why This is Important</label>
                              <p className="text-gray-700 text-sm p-3 bg-blue-25 border border-blue-200 rounded italic">
                                {field.bdReason}
                              </p>
                            </div>
                            
                            {/* Meta Information */}
                            <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
                              <span>Added by: <span className="font-medium">{field.addedBy}</span></span>
                              <span>{field.addedDate}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Required Notice */}
              <Card className="bg-blue-50 border-blue-200">

              </Card>
                </>
              ) : (
                /* Empty State for BD Review Pending */
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                    <Edit className="w-8 h-8 text-orange-600" />
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-2">BD Review Updates</h3>
                  <p className="text-gray-600 mb-6 max-w-md">
                    Your project has been sent to the BD teams for requirements validation. 
                    Any updates or new inputs from the BD teams will appear here.
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-lg">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-left">
                        <h4 className="font-medium text-blue-900 text-sm mb-1">What happens next?</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• BD teams will review your project requirements</li>
                          <li>• They may suggest improvements or additional requirements</li>
                          <li>• All changes and reasoning will be displayed here</li>
                          <li>• You'll be notified when the review is complete</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex space-x-3">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact BD Team
                    </Button>
                    <Button variant="outline" size="sm">
                      <Bell className="w-4 h-4 mr-2" />
                      Set Notification
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
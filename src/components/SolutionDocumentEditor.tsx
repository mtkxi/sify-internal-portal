import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import {
  ArrowLeft,
  Download,
  Share2,
  FileText,
  ShoppingCart,
  Send,
  Users,
  FileIcon,
  Plus,
  Trash2,
  Edit,
  Eye,
  Clock,
  History,
  Upload,
  ChevronDown,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link,
  Image,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Table,
  MoreHorizontal,
  Search,
  Star,
  X
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

// Mock data for the requirement
const requirementData = {
  id: 'NW000034',
  title: 'Enterprise Data Center Migration',
  created: '2024-01-10',
  updated: '2024-01-15',
  currentOwner: 'Alex Thompson',
  ownerRole: 'Pre sales',
  status: 'Feasible',
  requirement: {
    name: 'Enterprise Data Center Migration',
    id: 'NW000034',
    submitted: '01 Oct 2025',
    updated: '05 Oct 2025',
    location: 'Mumbai Data Center',
    manager: 'Rajesh Kumar',
    description: 'Complete migration of enterprise workloads to a colocation facility with high availability requirements, including dedicated rack space, redundant power, and 24/7 support.',
    team: [
      { initials: 'RK', color: 'bg-blue-500' },
      { initials: 'PS', color: 'bg-green-500' },
      { initials: 'AT', color: 'bg-purple-500' },
      { initials: 'MJ', color: 'bg-orange-500' }
    ]
  },
  customer: {
    companyName: 'Infosys Technologies Ltd',
    id: 'TC00001',
    status: 'Active',
    contactPerson: 'Priya Sharma',
    email: 'priya.sharma@infosys.com',
    address: 'Electronics City, Hosur Road, Bangalore, Karnataka 560100, India'
  },
  documents: [
    { name: 'Requirements_Document.pdf', size: '2.4 MB' },
    { name: 'Technical_Specifications.docx', size: '1.8 MB' },
    { name: 'Business_Case.xlsx', size: '968 KB' }
  ]
};

interface DocumentSection {
  id: number;
  title: string;
  description: string;
  words: number;
}

const initialDocumentSections: DocumentSection[] = [
  {
    id: 1,
    title: 'Executive Summary',
    description: 'This comprehensive cloud solution addresses the technical requirement...',
    words: 47
  },
  {
    id: 2,
    title: 'Proposed Solution Architecture & Key Components',
    description: 'This section outlines the strategic architectural blueprint for delivering...',
    words: 156
  },
  {
    id: 3,
    title: 'Implementation Plan',
    description: 'Phase 1: Infrastructure Setup (Weeks 1-2) Deploy core networking and...',
    words: 82
  },
  {
    id: 4,
    title: 'Proposed Solution on Product Compute',
    description: 'Our compute solution leverages scalable virtual machines and...',
    words: 65
  },
  {
    id: 5,
    title: 'Network Architecture',
    description: 'The network architecture provides secure, high-performance...',
    words: 58
  },
  {
    id: 6,
    title: 'Platform as a Service (PaaS)',
    description: 'Our PaaS offerings provide managed services that reduce operational...',
    words: 73
  },
  {
    id: 7,
    title: 'Security & Compliance',
    description: 'Comprehensive security framework ensuring data protection...',
    words: 91
  },
  {
    id: 8,
    title: 'Cost Analysis & ROI',
    description: 'Detailed breakdown of implementation costs and projected...',
    words: 54
  }
];

const templateData = [
  {
    id: 1,
    name: 'Enterprise Cloud Migration',
    description: 'Comprehensive template for large-scale enterprise cloud migration projects',
    tags: [
      { label: 'standard', color: 'bg-blue-50 text-blue-700 border-blue-200' },
      { label: 'high', color: 'bg-red-50 text-red-700 border-red-200' }
    ],
    sections: 7,
    uses: 45,
    rating: 4.8,
    featured: true
  },
  {
    id: 2,
    name: 'Financial Services Cloud',
    description: 'Specialized template for financial services with compliance focus',
    tags: [
      { label: 'industry', color: 'bg-purple-50 text-purple-700 border-purple-200' },
      { label: 'high', color: 'bg-red-50 text-red-700 border-red-200' }
    ],
    sections: 7,
    uses: 23,
    rating: 4.9,
    featured: true
  },
  {
    id: 3,
    name: 'Startup Cloud Foundation',
    description: 'Quick-start template for small to medium businesses',
    tags: [
      { label: 'standard', color: 'bg-blue-50 text-blue-700 border-blue-200' },
      { label: 'low', color: 'bg-green-50 text-green-700 border-green-200' }
    ],
    sections: 5,
    uses: 78,
    rating: 4.6,
    featured: false
  }
];

export function SolutionDocumentEditor() {
  const navigate = useNavigate();
  const { reqId } = useParams();
  const [activeSection, setActiveSection] = useState(2);
  const [isPreview, setIsPreview] = useState(false);
  const [expandBasicDetails, setExpandBasicDetails] = useState(false);
  const [sections, setSections] = useState<DocumentSection[]>(initialDocumentSections);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showVersionDialog, setShowVersionDialog] = useState(false);
  const [templateSearch, setTemplateSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleAddSection = () => {
    const newSection: DocumentSection = {
      id: sections.length + 1,
      title: 'New Section',
      description: 'Add your content here...',
      words: 0
    };
    setSections([...sections, newSection]);
    setActiveSection(newSection.id);
  };

  const handleDeleteSection = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sections.length > 1) {
      const newSections = sections.filter(s => s.id !== id);
      setSections(newSections);
      if (activeSection === id) {
        setActiveSection(newSections[0].id);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Section - Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/solution-architect')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-xl text-gray-900">{requirementData.title}</h1>
                <p className="text-sm text-gray-500">
                  {requirementData.id} • Created {requirementData.created} • Last updated {requirementData.updated}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/bom-page')}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                View BOM
              </Button>
              <Button 
                size="sm" 
                className="bg-slate-900 hover:bg-slate-800 text-white"
                onClick={() => {
                  toast.success('Solution submitted successfully to Account Manager');
                  setTimeout(() => {
                    navigate('/solution-architect');
                  }, 1000);
                }}
              >
                <Send className="w-4 h-4 mr-2" />
                Submit to Account Manager
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section - Basic Details & Documents */}
      <div className="max-w-[1600px] mx-auto px-6 py-6 pt-[21px] pr-[21px] pb-[4px] pl-[21px]">
        <Card className="border-gray-200 shadow-sm bg-white mb-6">
          <CardHeader className="pb-[8px] border-b border-gray-100 px-[21px] py-[14px] pt-[21px] pr-[21px] pl-[21px] pb-[14px]">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandBasicDetails(!expandBasicDetails)}>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-600" />
                <CardTitle className="text-sm">Basic Details</CardTitle>
                <Badge variant="outline" className="text-xs text-blue-600 border-blue-200 bg-blue-50">
                  AM Input
                </Badge>
              </div>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expandBasicDetails ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </CardHeader>

          {expandBasicDetails && (
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-8">
                {/* Requirement Information */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <FileIcon className="w-4 h-4 text-gray-600" />
                    <h3 className="text-sm text-gray-900">Requirement Information</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Name</label>
                        <p className="text-sm text-gray-900">{requirementData.requirement.name}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">ID</label>
                        <p className="text-sm text-gray-900">{requirementData.requirement.id}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Submitted</label>
                        <p className="text-sm text-gray-900">{requirementData.requirement.submitted}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Updated</label>
                        <p className="text-sm text-gray-900">{requirementData.requirement.updated}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Location</label>
                        <p className="text-sm text-gray-900">{requirementData.requirement.location}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Manager</label>
                        <p className="text-sm text-gray-900">{requirementData.requirement.manager}</p>
                      </div>
                    </div>

                    {/* <div>
                      <label className="text-xs text-gray-500 mb-2 block">Team</label>
                      <div className="flex items-center gap-2">
                        {requirementData.requirement.team.map((member, index) => (
                          <div
                            key={index}
                            className={`w-8 h-8 rounded-full ${member.color} flex items-center justify-center text-white text-xs`}
                          >
                            {member.initials}
                          </div>
                        ))}
                      </div>
                    </div> */}

                    <div>
                      <label className="text-xs text-gray-500 mb-2 block">Requirement Description</label>
                      <p className="text-sm text-gray-900 leading-relaxed">
                        {requirementData.requirement.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-4 h-4 text-gray-600" />
                    <h3 className="text-sm text-gray-900">Customer Information</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Company Name</label>
                        <p className="text-sm text-gray-900">{requirementData.customer.companyName}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">ID</label>
                        <p className="text-sm text-gray-900">{requirementData.customer.id}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Status</label>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {requirementData.customer.status}
                        </Badge>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Contact Person</label>
                        <p className="text-sm text-gray-900">{requirementData.customer.contactPerson}</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Email</label>
                      <p className="text-sm text-gray-900">{requirementData.customer.email}</p>
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Address</label>
                      <p className="text-sm text-gray-900 leading-relaxed">
                        {requirementData.customer.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Access Documents */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <h3 className="text-sm text-gray-900">Quick Access Documents</h3>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  {requirementData.documents.map((doc, index) => (
                    <div key={index} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                      <FileIcon className="w-4 h-4 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.size}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Bottom Section - Solution Document Editor */}
      <div className="max-w-[1600px] mx-auto px-6 pb-6">
        <Card className="border-gray-200 shadow-sm bg-white">
          <CardHeader className="pb-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-base text-gray-900">Solution Document Editor</h2>
                {/* <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">
                  Unassigned
                </Badge> */}
                <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">
                  v1
                </Badge>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>Last saved: 13:37:35</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowTemplateDialog(true)}>
                  <FileText className="w-4 h-4 mr-2" />
                  Templates
                </Button>
                {/* <Button variant="outline" size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  Assign SA
                </Button> */}
                <Button variant="outline" size="sm" onClick={() => setShowVersionDialog(true)}>
                  <History className="w-4 h-4 mr-2" />
                  Version
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="flex min-h-[600px]">
              {/* Left Sidebar - Sections */}
              <div className="w-80 border-r border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm text-gray-900">Sections</h3>
                    <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">
                      {sections.length}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleAddSection}>
                    <Plus className="w-4 h-4 text-gray-600" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {sections.map((section) => (
                    <div
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        activeSection === section.id
                          ? 'bg-slate-900 text-white'
                          : 'bg-white border border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-start gap-2 flex-1">
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded ${
                              activeSection === section.id
                                ? 'bg-slate-700 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {section.id}
                          </span>
                          <div className="flex-1">
                            <p
                              className={`text-sm leading-tight mb-1 ${
                                activeSection === section.id ? 'text-white' : 'text-gray-900'
                              }`}
                            >
                              {section.title}
                            </p>
                            <p
                              className={`text-xs leading-tight line-clamp-2 ${
                                activeSection === section.id ? 'text-gray-300' : 'text-gray-500'
                              }`}
                            >
                              {section.description}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDeleteSection(section.id, e)}
                          className={`h-5 w-5 p-0 ml-2 ${
                            activeSection === section.id
                              ? 'text-white hover:text-white hover:bg-slate-700'
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <p
                        className={`text-xs ${
                          activeSection === section.id ? 'text-gray-300' : 'text-gray-500'
                        }`}
                      >
                        {section.words} words
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Editor Area */}
              <div className="flex-1 flex flex-col">
                {/* Editor Header */}
                <div className="border-b border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg text-gray-900">
                      {sections.find(s => s.id === activeSection)?.title}
                    </h3>
                    <div className="inline-flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                      <button
                        onClick={() => setIsPreview(false)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-all ${
                          !isPreview
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'bg-transparent text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => setIsPreview(true)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-all ${
                          isPreview
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'bg-transparent text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                    </div>
                  </div>

                  {/* Toolbar */}
                  {!isPreview && (
                    <div className="flex items-center gap-1 flex-wrap">
                      <Select defaultValue="arial">
                        <SelectTrigger className="w-32 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="arial">Arial</SelectItem>
                          <SelectItem value="times">Times New Roman</SelectItem>
                          <SelectItem value="courier">Courier</SelectItem>
                        </SelectContent>
                      </Select>

                      <Separator orientation="vertical" className="h-6 mx-1" />

                      <Select defaultValue="14">
                        <SelectTrigger className="w-16 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12">12</SelectItem>
                          <SelectItem value="14">14</SelectItem>
                          <SelectItem value="16">16</SelectItem>
                          <SelectItem value="18">18</SelectItem>
                        </SelectContent>
                      </Select>

                      <Separator orientation="vertical" className="h-6 mx-1" />

                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Bold className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Italic className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Underline className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Strikethrough className="w-4 h-4" />
                      </Button>

                      <Separator orientation="vertical" className="h-6 mx-1" />

                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Link className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Image className="w-4 h-4" />
                      </Button>

                      <Separator orientation="vertical" className="h-6 mx-1" />

                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <List className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ListOrdered className="w-4 h-4" />
                      </Button>

                      <Separator orientation="vertical" className="h-6 mx-1" />

                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <AlignLeft className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <AlignCenter className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <AlignRight className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <AlignJustify className="w-4 h-4" />
                      </Button>

                      <Separator orientation="vertical" className="h-6 mx-1" />

                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Table className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Editor Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                  {!isPreview ? (
                    <div className="prose max-w-none">
                      <p className="text-sm text-gray-900 leading-relaxed">
                        This section outlines the strategic architectural blueprint for delivering a robust, scalable, and secure cloud solution tailored to your organization's evolving requirements. Our proposed architecture leverages industry best practices and leading cloud technologies to ensure optimal performance, cost-efficiency, and future adaptability. At the core of this solution lies a modular design approach, enabling seamless integration with your existing systems while providing the flexibility to incorporate new functionalities as your needs grow. The solution is envisioned as a series of interconnected layers, each responsible for a specific set of services, from data ingestion and processing to application delivery and security. Key Architectural Principles Guiding Our Design: • Scalability & Elasticity: Designed to automatically adjust resources based on demand, ensuring consistent performance during peak loads and cost optimization during quieter periods. • Security & Compliance: Built with a security-first mindset, incorporating robust encryption, access controls, and adherence to relevant industry compliance standards. • High Availability & Disaster Recovery: Engineered for resilience, minimizing downtime and ensuring business continuity through redundant infrastructure and comprehensive disaster recovery protocols.
                      </p>
                    </div>
                  ) : (
                    <div className="prose max-w-none">
                      <p className="text-sm text-gray-900 leading-relaxed">
                        This section outlines the strategic architectural blueprint for delivering a robust, scalable, and secure cloud solution tailored to your organization's evolving requirements. Our proposed architecture leverages industry best practices and leading cloud technologies to ensure optimal performance, cost-efficiency, and future adaptability. At the core of this solution lies a modular design approach, enabling seamless integration with your existing systems while providing the flexibility to incorporate new functionalities as your needs grow. The solution is envisioned as a series of interconnected layers, each responsible for a specific set of services, from data ingestion and processing to application delivery and security. Key Architectural Principles Guiding Our Design: • Scalability & Elasticity: Designed to automatically adjust resources based on demand, ensuring consistent performance during peak loads and cost optimization during quieter periods. • Security & Compliance: Built with a security-first mindset, incorporating robust encryption, access controls, and adherence to relevant industry compliance standards. • High Availability & Disaster Recovery: Engineered for resilience, minimizing downtime and ensuring business continuity through redundant infrastructure and comprehensive disaster recovery protocols.
                      </p>
                    </div>
                  )}
                </div>

                {/* Auto-save indicator */}
                <div className="border-t border-gray-200 px-6 py-2 bg-gray-50">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Auto-save enabled • Last saved 13:37:35</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Templates Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Document Templates</DialogTitle>
            <DialogDescription>
              Choose from predefined templates to jumpstart your solution document
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Search and Filter */}
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search templates..."
                  value={templateSearch}
                  onChange={(e) => setTemplateSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="industry">Industry</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templateData.map((template) => (
                <Card key={template.id} className="border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-base text-gray-900 flex-1">{template.name}</h3>
                      {template.featured && (
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                      {template.description}
                    </p>
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {template.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className={`text-xs ${tag.color}`}>
                          {tag.label}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
                      <span>{template.sections} sections</span>
                      <span>{template.uses} uses</span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        {template.rating}
                      </span>
                    </div>
                    <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Version History Dialog */}
      <Dialog open={showVersionDialog} onOpenChange={setShowVersionDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <History className="w-5 h-5" />
              Version History
            </DialogTitle>
            <DialogDescription>
              Track requirement versions and their associated proposal versions
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-900">
                <span className="font-medium">How it works:</span> Each time you update a requirement, a new requirement version is created. Within each requirement version, you can generate multiple proposal versions as you refine your proposals.
              </p>
            </div>

            {/* Version Timeline */}
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex-shrink-0">
                    <span className="text-sm">v1.0</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-base text-gray-900">Requirement v1.0</h3>
                        <p className="text-sm text-gray-500">Initial requirement</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-1">Draft</Badge>
                        <p className="text-xs text-gray-500">2024-12-15 at 16:45</p>
                        <p className="text-xs text-gray-500">by John Doe</p>
                      </div>
                    </div>

                    {/* Proposal Versions */}
                    <div className="mt-4 pl-4 border-l-2 border-gray-200">
                      <div className="flex items-start gap-2 mb-2">
                        <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">Proposal Versions for v1.0</p>
                          <p className="text-xs text-gray-500">0 versions</p>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">No proposals generated for this requirement version</p>
                        <p className="text-xs text-gray-500 mt-1">Proposals will appear here when created</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
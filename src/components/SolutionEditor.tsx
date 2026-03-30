import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft, ArrowRight, Save, Eye, Download, Users, FileText, Clock, Plus, X, Star, MapPin,
  Bold, Italic, Underline, Strikethrough, Link, Image, AlignLeft, AlignCenter, 
  AlignRight, AlignJustify, List, ListOrdered, Indent, Outdent, Type, Palette,
  Upload, Trash2, Edit, Edit3, ChevronDown, Minus, Activity, Search, Filter, Copy
} from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import exampleImage from 'figma:asset/d5287a712b809502c215ba7d4e96b2f28cc15b7b.png';

interface SolutionSection {
  id: string;
  number: number;
  title: string;
  content: string;
  lastModified: string;
  author: string;
  preview: string;
}

interface SolutionArchitect {
  id: string;
  name: string;
  email: string;
  rating: number;
  expertise: string[];
  location: string;
  experience: string;
  initials: string;
  workload: number;
  availability: 'available' | 'busy' | 'overloaded';
}

interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  type: 'standard' | 'industry';
  complexity: 'low' | 'medium' | 'high';
  sections: number;
  uses: number;
  rating: number;
  tags: string[];
  featured: boolean;
}

const mockTemplates: DocumentTemplate[] = [
  {
    id: '1',
    name: 'Enterprise Cloud Migration',
    description: 'Comprehensive template for large-scale enterprise cloud migration projects',
    category: 'Cloud Infrastructure',
    type: 'standard',
    complexity: 'high',
    sections: 7,
    uses: 45,
    rating: 4.8,
    tags: ['enterprise', 'migration', 'cloud'],
    featured: true
  },
  {
    id: '2',
    name: 'Financial Services Cloud',
    description: 'Specialized template for financial services with compliance focus',
    category: 'Financial Services',
    type: 'industry',
    complexity: 'high',
    sections: 7,
    uses: 23,
    rating: 4.9,
    tags: ['financial', 'compliance', 'security'],
    featured: true
  },
  {
    id: '3',
    name: 'Startup Cloud Foundation',
    description: 'Quick-start template for small to medium businesses',
    category: 'Small Business',
    type: 'standard',
    complexity: 'low',
    sections: 5,
    uses: 78,
    rating: 4.6,
    tags: ['startup', 'foundation', 'basic'],
    featured: false
  },
  {
    id: '4',
    name: 'Healthcare Cloud Solution',
    description: 'HIPAA-compliant cloud solution for healthcare providers',
    category: 'Healthcare',
    type: 'industry',
    complexity: 'medium',
    sections: 6,
    uses: 34,
    rating: 4.7,
    tags: ['healthcare', 'hipaa', 'compliance'],
    featured: false
  },
  {
    id: '5',
    name: 'E-commerce Platform',
    description: 'Scalable e-commerce infrastructure with payment processing',
    category: 'E-commerce',
    type: 'standard',
    complexity: 'medium',
    sections: 6,
    uses: 56,
    rating: 4.5,
    tags: ['e-commerce', 'payment', 'scalable'],
    featured: false
  },
  {
    id: '6',
    name: 'IoT Data Pipeline',
    description: 'Real-time data processing for IoT devices and sensors',
    category: 'IoT & Data',
    type: 'industry',
    complexity: 'high',
    sections: 8,
    uses: 29,
    rating: 4.8,
    tags: ['iot', 'data', 'realtime'],
    featured: true
  }
];

const mockArchitects: SolutionArchitect[] = [
  {
    id: '1',
    name: 'Alex Rodriguez',
    email: 'alex.rodriguez@onesify.com',
    rating: 4.8,
    expertise: ['Cloud Architecture', 'AWS', 'Kubernetes'],
    location: 'Mumbai',
    experience: '8 years',
    initials: 'AR',
    workload: 65,
    availability: 'available'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya.sharma@onesify.com',
    rating: 4.9,
    expertise: ['Azure', 'DevOps', 'Microservices'],
    location: 'Bangalore',
    experience: '6 years',
    initials: 'PS',
    workload: 45,
    availability: 'available'
  },
  {
    id: '3',
    name: 'Raj Patel',
    email: 'raj.patel@onesify.com',
    rating: 4.7,
    expertise: ['GCP', 'Data Engineering', 'ML'],
    location: 'Delhi',
    experience: '7 years',
    initials: 'RP',
    workload: 85,
    availability: 'busy'
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@onesify.com',
    rating: 4.6,
    expertise: ['Multi-cloud', 'Security', 'Compliance'],
    location: 'Mumbai',
    experience: '9 years',
    initials: 'SW',
    workload: 95,
    availability: 'overloaded'
  }
];

const defaultSections: SolutionSection[] = [
  {
    id: '1',
    number: 1,
    title: 'Executive Summary',
    content: 'This comprehensive cloud solution addresses the technical requirements outlined in the customer\'s RFP. Our proposed architecture leverages modern cloud-native technologies to deliver a scalable, secure, and cost-effective infrastructure solution.',
    lastModified: '2024-12-28 10:30',
    author: 'AI System',
    preview: 'Preview of the first few lines of the description will be displayed here for re'
  },
  {
    id: '2',
    number: 2, 
    title: 'Proposed Solution Architecture & Key Components',
    content: 'This section outlines the strategic architectural blueprint for delivering a robust, scalable, and secure cloud solution tailored to your organization\'s evolving requirements. Our proposed architecture leverages industry best practices and leading cloud technologies to ensure optimal performance, cost-efficiency, and future adaptability.\n\nAt the core of this solution lies a modular design approach, enabling seamless integration with your existing systems while providing the flexibility to incorporate new functionalities as your needs grow. The architecture is envisioned as a series of interconnected layers, each responsible for a specific set of services, from data ingestion and processing to application delivery and security.\n\nKey Architectural Principles Guiding Our Design:\n• Scalability & Elasticity: Designed to automatically adjust resources based on demand, ensuring consistent performance during peak loads and cost optimization during quieter periods.\n• Security & Compliance: Built with a security-first mindset, incorporating robust encryption, access controls, and adherence to relevant industry compliance standards.\n• High Availability & Disaster Recovery: Engineered for resilience, minimizing downtime and ensuring business continuity through redundant infrastructure and comprehensive disaster recovery protocols.',
    lastModified: '2024-12-28 10:30',
    author: 'Current User',
        preview: 'This section outlines the strategic architectural blueprint for delivering a robust, scalable...',

  },
  {
    id: '3',
    number: 3,
    title: 'Implementation Plan',
    content: 'Phase 1: Infrastructure Setup (Weeks 1-2)\n- Deploy core networking and security components\n- Set up monitoring and logging infrastructure\n\nPhase 2: Application Deployment (Weeks 3-4)\n- Deploy containerized applications\n- Configure load balancing and auto-scaling\n\nPhase 3: Testing & Go-Live (Weeks 5-6)\n- Performance testing and optimization\n- User acceptance testing\n- Production deployment',
    lastModified: '2024-12-28 10:30',
    author: 'AI System',
    preview: 'Preview of the first few lines of the description will be displayed here for re'
  },
  {
    id: '4',
    number: 4,
    title: 'Proposed Solution on Product Compute',
    content: 'Our compute solution leverages scalable virtual machines and containerized services to provide optimal performance for your workloads. The architecture includes auto-scaling groups, load balancers, and high-performance computing instances tailored to your application requirements.\n\nKey Features:\n• Auto-scaling based on demand\n• Multiple instance types for different workloads\n• Container orchestration with Kubernetes\n• GPU instances for AI/ML workloads',
    lastModified: '2024-12-28 10:30',
    author: 'AI System',
    preview: 'Our compute solution leverages scalable virtual machines and containerized services...',
  },
  {
    id: '5',
    number: 5,
    title: 'Network Architecture',
    content: 'Comprehensive security controls and compliance framework including identity management, data protection, network security, and monitoring capabilities.',
    lastModified: '2024-12-28 10:30',
    author: 'AI System',
    preview: 'Preview of the first few lines of the description will be displayed here for re'
  },
  {
    id: '6',
    number: 6,
    title: 'Platform as a Service (PaaS)',
    content: 'Ongoing support and maintenance procedures including service level agreements, escalation procedures, and regular maintenance schedules.',
    lastModified: '2024-12-28 10:30',
    author: 'AI System',
    preview: 'Preview of the first few lines of the description will be displayed here for re'
  }

];

export function SolutionEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [sections, setSections] = useState<SolutionSection[]>(defaultSections);
  const [activeSection, setActiveSection] = useState('2');
  const [assignSA, setAssignSA] = useState(false);
  const [showAssignmentDialog, setShowAssignmentDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [selectedArchitects, setSelectedArchitects] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState('all');
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [templateSearch, setTemplateSearch] = useState('');
  const [templateCategory, setTemplateCategory] = useState('all');
  const [activeTemplateTab, setActiveTemplateTab] = useState('browse');

  const currentStage = 3; // Document Editor stage

  const stages = [
    // { number: 1, title: 'Customer & Requirement Details', completed: true },
    // { number: 2, title: 'AI Solution Analysis', completed: true },
    { number: 3, title: 'Solution Document Editor', completed: false, active: true },
    { number: 4, title: 'BOM Management', completed: false },
    // { number: 5, title: 'Proposal Generation', completed: false }
  ];

  const getCurrentSection = () => {
    return sections.find(s => s.id === activeSection) || sections[0];
  };

  const updateSection = (sectionId: string, content: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            content, 
            lastModified: new Date().toLocaleString(),
            author: 'Current User',
            preview: content.substring(0, 80) + '...'
          }
        : section
    ));
  };

  const addNewSection = () => {
    const newSection: SolutionSection = {
      id: Date.now().toString(),
      number: sections.length + 1,
      title: `Section ${sections.length + 1}`,
      content: '',
      lastModified: new Date().toLocaleString(),
      author: 'Current User',
      preview: 'Preview of the first few lines of the description will be displayed here for re'
    };
    setSections([...sections, newSection]);
  };

  const deleteSection = (sectionId: string) => {
    if (sections.length <= 1) return; // Don't delete if only one section left
    setSections(sections.filter(s => s.id !== sectionId));
  };

  const toggleArchitect = (architectId: string) => {
    setSelectedArchitects(prev => 
      prev.includes(architectId) 
        ? prev.filter(id => id !== architectId)
        : [...prev, architectId]
    );
  };

  const filteredArchitects = locationFilter === 'all' 
    ? mockArchitects 
    : mockArchitects.filter(architect => architect.location.toLowerCase() === locationFilter);

  const assignArchitects = () => {
    if (selectedArchitects.length === 0) {
      alert('Please select at least one Solution Architect');
      return;
    }
    setAssignSA(true);
    setShowAssignmentDialog(false);
    const assignedNames = selectedArchitects.map(id => {
      const architect = mockArchitects.find(a => a.id === id);
      return architect?.name;
    }).join(', ');
    alert(`Successfully assigned Solution Architect(s): ${assignedNames}`);
  };

  const applyTemplate = (templateId: string) => {
    const template = mockTemplates.find(t => t.id === templateId);
    if (template) {
      alert(`Applied template: ${template.name}`);
      setShowTemplateDialog(false);
      // Here you would typically load the template content into sections
    }
  };

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
                         template.description.toLowerCase().includes(templateSearch.toLowerCase());
    const matchesCategory = templateCategory === 'all' || template.category === templateCategory;
    return matchesSearch && matchesCategory;
  });

  const getWorkloadColor = (workload: number) => {
    if (workload <= 50) return 'text-green-600';
    if (workload <= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getWorkloadBadgeColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'overloaded': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'standard': return 'bg-blue-100 text-blue-800';
      case 'industry': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPreviewContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('•')) {
        return <li key={index} className="ml-4">{line.substring(1).trim()}</li>;
      }
      if (line.startsWith('Phase') || line.startsWith('-')) {
        return <p key={index} className="font-medium">{line}</p>;
      }
      return <p key={index} className="mb-2">{line}</p>;
    });
  };

  const RichTextToolbar = () => (
    <div className="border-b border-gray-200 p-3 bg-white flex items-center gap-3 flex-wrap">
      {/* Font Family */}
      <Select value={fontFamily} onValueChange={setFontFamily}>
        <SelectTrigger className="w-20 h-6 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Arial">Arial</SelectItem>
          <SelectItem value="Georgia">Georgia</SelectItem>
          <SelectItem value="Times">Times</SelectItem>
          <SelectItem value="Courier">Courier</SelectItem>
        </SelectContent>
      </Select>

      {/* Font Size */}
      <div className="flex items-center border rounded h-6">
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setFontSize(Math.max(8, fontSize - 1))}>
          <Minus className="w-3 h-3" />
        </Button>
        <span className="px-2 text-xs min-w-[20px] text-center">{fontSize}</span>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setFontSize(Math.min(72, fontSize + 1))}>
          <Plus className="w-3 h-3" />
        </Button>
      </div>

      <div className="w-px h-5 bg-gray-300" />

      {/* Formatting */}
      <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
        <Bold className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
        <Italic className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
        <Underline className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
        <Strikethrough className="w-4 h-4" />
      </Button>

      <div className="w-px h-5 bg-gray-300" />

      {/* Colors */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded border" />
          </div>
        </Button>
        <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
          <ChevronDown className="w-3 h-3" />
        </Button>
      </div>
      <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
        <Type className="w-4 h-4" />
      </Button>

      <div className="w-px h-5 bg-gray-300" />

      {/* Insert */}
      <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
        <Link className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
        <Image className="w-4 h-4" />
      </Button>

      <div className="w-px h-5 bg-gray-300" />

      {/* Lists */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
          <List className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
          <ChevronDown className="w-3 h-3" />
        </Button>
      </div>

      <div className="w-px h-5 bg-gray-300" />

      {/* Alignment */}
      <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
        <AlignLeft className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
        <AlignCenter className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
        <AlignRight className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
        <AlignJustify className="w-4 h-4" />
      </Button>

      <div className="w-px h-5 bg-gray-300" />

      {/* Indent */}
      <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
        <Outdent className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
        <Indent className="w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1>Solution Document Editor</h1>
            <p className="text-gray-600">Create and edit comprehensive solution documentation</p>
          </div>
        </div>
        
        {/* Template CTA */}
        <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Use Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-xl">Document Templates</DialogTitle>
                  <DialogDescription className="mt-2">
                    Choose from predefined templates to jumpstart your solution document
                  </DialogDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowTemplateDialog(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 bg-gray-50 border-b">
                <div className="flex items-center space-x-3 mb-4">
                  <FileText className="w-6 h-6 text-gray-600" />
                  <div>
                    <h3 className="font-medium">Template Library</h3>
                    <p className="text-sm text-gray-600">
                      Choose from standardized templates or create custom solutions for your project
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <Tabs value={activeTemplateTab} onValueChange={setActiveTemplateTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="browse">Browse Templates</TabsTrigger>
                    <TabsTrigger value="create">Create Custom</TabsTrigger>
                    <TabsTrigger value="my">My Templates</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="browse" className="mt-6">
                    <div className="flex gap-4 mb-6">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input 
                          placeholder="Search templates by name, description..."
                          value={templateSearch}
                          onChange={(e) => setTemplateSearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Select value={templateCategory} onValueChange={setTemplateCategory}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="Cloud Infrastructure">Cloud Infrastructure</SelectItem>
                          <SelectItem value="Financial Services">Financial Services</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Small Business">Small Business</SelectItem>
                          <SelectItem value="E-commerce">E-commerce</SelectItem>
                          <SelectItem value="IoT & Data">IoT &amp; Data</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredTemplates.map(template => (
                        <Card key={template.id} className="relative">
                          {template.featured && (
                            <div className="absolute top-3 right-3">
                              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            </div>
                          )}
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg mb-2">{template.name}</CardTitle>
                                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                                <div className="flex flex-wrap gap-2 mb-3">
                                  <Badge className={`text-xs ${getTypeColor(template.type)}`}>
                                    {template.type}
                                  </Badge>
                                  <Badge className={`text-xs ${getComplexityColor(template.complexity)}`}>
                                    {template.complexity} complexity
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                              <div className="text-center">
                                <div className="font-medium">{template.sections}</div>
                                <div className="text-gray-600">sections</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium">{template.uses}</div>
                                <div className="text-gray-600">uses</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium">{template.rating}/5</div>
                                <div className="text-gray-600">rating</div>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              {template.tags.slice(0, 3).map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {template.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{template.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="flex-1">
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                              </Button>
                              <Button 
                                size="sm" 
                                className="flex-1 bg-gray-800 hover:bg-gray-900"
                                onClick={() => applyTemplate(template.id)}
                              >
                                <Copy className="w-4 h-4 mr-2" />
                                Apply Template
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="create" className="mt-6">
                    <div className="text-center py-12">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Create Custom Template</h3>
                      <p className="text-gray-600 mb-6">
                        Build your own template from scratch or customize existing ones
                      </p>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Start Creating
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="my" className="mt-6">
                    <div className="text-center py-12">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">My Templates</h3>
                      <p className="text-gray-600 mb-6">
                        Your saved and custom templates will appear here
                      </p>
                      <Button variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Template
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Progress Stepper */}
      {/* <div className="mb-8">
        <div className="flex items-center justify-between">
          {stages.map((stage, index) => (
            <div key={stage.number} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                stage.completed ? 'bg-green-500 text-white' : 
                stage.active ? 'bg-blue-500 text-white' : 
                'bg-gray-200 text-gray-600'
              }`}>
                {stage.completed ? '✓' : stage.number}
              </div>
              <div className="ml-2 text-sm">
                <div className={stage.completed || stage.active ? 'font-medium' : 'text-gray-500'}>
                  {stage.title}
                </div>
              </div>
              {index < stages.length - 1 && (
                <div className={`w-12 h-px mx-4 ${stage.completed ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div> */}

      {/* Main Editor Layout */}
      <div className="flex gap-4 h-[600px]">
            {/* Sections Sidebar - Exactly as shown in Figma */}
            <div className="w-72 border border-gray-200 rounded-lg bg-white">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-700">Sections</h3>
                    <span className="text-sm text-gray-500">({sections.length})</span>
                  </div>
                  <Button size="sm" variant="ghost" onClick={addNewSection} className="h-6 w-6 p-0">
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <div className="h-[500px] overflow-y-auto">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    className={`flex items-start p-3 cursor-pointer border-b border-gray-100 hover:bg-gray-50 ${
                      activeSection === section.id ? "bg-gray-900 text-white" : ""
                    }`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium mr-3 ${
                      activeSection === section.id ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-700"
                    }`}>
                      {section.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold text-sm mb-1 ${activeSection === section.id ? "text-white" : "text-gray-900"}`}>
                        {section.title}
                      </div>
                      <div className={`text-xs mb-2 line-clamp-2 ${activeSection === section.id ? "text-gray-300" : "text-gray-600"}`}>
                        {section.preview}
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className={activeSection === section.id ? "text-gray-400" : "text-gray-500"}>
                          {section.wordCount} words
                        </span>
                        {sections.length > 1 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className={`h-4 w-4 p-0 ${activeSection === section.id ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSection(section.id);
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 border border-gray-200 rounded-lg bg-white overflow-hidden">
              {/* Section Title with Preview Toggle */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <Input
                    value={getCurrentSection().title}
                    onChange={(e) => {
                      const currentSection = getCurrentSection();
                      setSections(sections.map(s => 
                        s.id === currentSection.id 
                          ? { ...s, title: e.target.value }
                          : s
                      ));
                    }}
                    className="text-lg font-semibold border-none bg-transparent p-0 h-auto focus:ring-0 focus:outline-none flex-1 mr-4"
                    placeholder="Section Title"
                  />
                  
                  {/* Preview Toggle in Section Title Area */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={!isPreviewMode ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsPreviewMode(false)}
                    >
                      <Edit3 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant={isPreviewMode ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsPreviewMode(true)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                  </div>
                </div>
              </div>

              {/* Rich Text Toolbar - Disabled in Preview Mode */}
              <RichTextToolbar />

              {/* Content Area */}
              <div className="h-[400px] relative">
                {!isPreviewMode ? (
                  <Textarea
                    value={getCurrentSection().content}
                    onChange={(e) => updateSection(getCurrentSection().id, e.target.value)}
                    className="h-full border-none rounded-none resize-none focus:ring-0 p-4"
                    style={{ 
                      fontFamily: fontFamily, 
                      fontSize: `${fontSize}px` 
                    }}
                    placeholder="Editable section of the solution document"
                  />
                ) : (
                  <div className="h-full overflow-y-auto p-4" style={{ fontFamily: fontFamily, fontSize: `${fontSize}px` }}>
                    <div className="prose max-w-none">
                      {getCurrentSection().content.split('\n').map((paragraph, index) => {
                        if (paragraph.startsWith('•')) {
                          return <li key={index} className="ml-4 mb-1">{paragraph.substring(1).trim()}</li>;
                        }
                        if (paragraph.startsWith('Phase') || paragraph.startsWith('-')) {
                          return <p key={index} className="font-medium mb-2">{paragraph}</p>;
                        }
                        return <p key={index} className="mb-3">{paragraph}</p>;
                      })}
                    </div>
                  </div>
                )}
                
                {/* Mode indicator */}
                <div className="absolute bottom-4 right-4 text-xs text-gray-400 bg-white px-2 py-1 rounded shadow">
                  {isPreviewMode ? 'Preview Mode' : 'Edit Mode'}
                </div>
              </div>
            </div>
          </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-6">
        <Button onClick={() => navigate(`/bom/${id}`)}>
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
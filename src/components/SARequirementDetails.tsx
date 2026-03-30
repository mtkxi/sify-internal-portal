import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import {
  ArrowLeft,
  Clock,
  Upload,
  Edit,
  FileText,
  Calendar,
  Users,
  FileIcon,
  History,
  Eye,
  Download,
  CheckCircle,
  Info,
  Building,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';

// Mock data for requirement
const requirementData = {
  id: 'NW000001',
  title: 'Enterprise Cloud Migration',
  created: '2024-01-10',
  updated: '2024-01-15',
  status: 'Draft',
  priority: 'Medium',
  category: 'Cloud',
  currentOwner: {
    name: 'Default Owner',
    role: 'Manager',
    avatar: 'DO'
  },
  // Requirement Overview
  version: 'v1.0',
  contractTerm: '1 Year',
  location: 'Mumbai DC-1',
  paymentModel: 'Monthly',
  drEnabled: 'No',
  budgetRange: '₹1-5 Lakhs',
  createdBy: 'System',
  addedDate: '2024-01-10',
  requirementDescription: 'Default requirement description for testing.',
  productType: 'Network',
  subProduct: 'DIA',
  // Request Details
  opportunityId: 'OPP-2024-000',
  opportunityName: 'Default Opportunity',
  opportunityStatus: 'Qualification',
  probability: '50%',
  requestType: 'New Requirement',
  lastUpdated: '2024-01-15',
  projectDescription: 'Cloud migration and infrastructure setup with scalable compute and storage resources.',
  // Customer Details
  company: 'Test Corp',
  customerId: 'TEST000',
  contactPerson: 'Test User',
  industry: 'Technology',
  email: 'test@corp.com',
  phone: '+91 90000 00000',
  address: '123 Test Street, Mumbai, Maharashtra, 400001'
};

// Mock data for timeline
const timelineData = [
  {
    id: 1,
    stage: 'Requirement Initiation',
    status: 'completed',
    duration: '1 days',
    activities: '2/2 activities',
    startDate: '2024-01-10',
    endDate: '2024-01-11',
    progress: 100,
    icon: 'check'
  },
  {
    id: 2,
    stage: 'Solutioning',
    status: 'in-progress',
    duration: '2 days',
    activities: '1/3 activities',
    startDate: '2024-01-12',
    endDate: '2024-01-14',
    progress: 33,
    icon: 'info'
  },
  {
    id: 3,
    stage: 'Finance Review',
    status: 'pending',
    duration: '3 days',
    activities: '0/2 activities',
    startDate: '2024-01-15',
    endDate: '2024-01-18',
    progress: 0,
    icon: 'pending'
  },
  {
    id: 4,
    stage: 'Proposal Creation',
    status: 'pending',
    duration: '2 days',
    activities: '0/2 activities',
    startDate: '2024-01-19',
    endDate: '2024-01-21',
    progress: 0,
    icon: 'pending'
  },
  {
    id: 5,
    stage: 'Customer review',
    status: 'pending',
    duration: '3 days',
    activities: '0/3 activities',
    startDate: '2024-01-22',
    endDate: '2024-01-25',
    progress: 0,
    icon: 'pending'
  },
  {
    id: 6,
    stage: 'Order Signed',
    status: 'pending',
    duration: '3 days',
    activities: '0/3 activities',
    startDate: '2024-01-22',
    endDate: '2024-01-25',
    progress: 0,
    icon: 'pending'
  }
];

// Mock data for audit trail
const auditTrailData = [
  {
    id: 1,
    type: 'Status Update',
    user: 'Jane Doe',
    title: 'Changed status to In Progress',
    description: 'Feasibility phase started.',
    timestamp: '2024-01-12 10:00'
  },
  {
    id: 2,
    type: 'Comment Added',
    user: 'Arun Kumar',
    title: 'Added compute review',
    description: 'VM size confirmed with customer.',
    timestamp: '2024-01-12 14:45'
  },
  {
    id: 3,
    type: 'Design Started',
    user: 'Mike Ross',
    title: 'Solution design draft started.',
    description: 'Initial design completed.',
    timestamp: '2024-01-13 11:30'
  },
  {
    id: 4,
    type: 'Pricing Drafted',
    user: 'Rita Patel',
    title: 'Pricing document prepared.',
    description: 'Shared internally for review.',
    timestamp: '2024-01-14 15:20'
  },
  {
    id: 5,
    type: 'Execution Planned',
    user: 'Sanjay Mehta',
    title: 'Created draft execution plan.',
    description: 'Resource allocation mapped.',
    timestamp: '2024-01-15 09:40'
  }
];

// Mock data for documents
const documentsData = [
  {
    id: 1,
    name: 'Requirement Doc.pdf',
    size: '1.2 MB',
    uploadedBy: 'Jane Doe',
    uploadedDate: '2024-01-10'
  },
  {
    id: 2,
    name: 'Solutioning Doc.pdf',
    size: '2.5 MB',
    uploadedBy: 'Mike Ross',
    uploadedDate: '2024-01-13'
  }
];

// Mock data for teams
const teamsData = [
  {
    id: 1,
    name: 'Account Manager',
    avatar: 'AM',
    status: 'active',
    email: 'jane.doe@onesify.com',
    phone: '+91 90001 11111',
    assignedDate: '2024-01-10'
  },
  {
    id: 2,
    name: 'Solution Architect',
    avatar: 'SA',
    status: 'pending',
    email: 'arun.k@onesify.com',
    phone: '+91 90002 22222',
    assignedDate: '2024-01-12'
  },
  {
    id: 3,
    name: 'Product',
    avatar: 'P',
    status: 'active',
    email: 'mike.ross@onesify.com',
    phone: '+91 90003 33333',
    assignedDate: '2024-01-14'
  },
  {
    id: 4,
    name: 'Finance',
    avatar: 'F',
    status: 'active',
    email: 'rita.patel@onesify.com',
    phone: '+91 90004 44444',
    assignedDate: '2024-01-15'
  },
  {
    id: 5,
    name: 'OPG',
    avatar: 'O',
    status: 'active',
    email: 'sanjay@onesify.com',
    phone: '+91 90005 55555',
    assignedDate: '2024-01-16'
  },
  {
    id: 6,
    name: 'Commercials Team',
    avatar: 'CT',
    status: 'active',
    email: 'pradeep@onesify.com',
    phone: '+91 90005 55555',
    assignedDate: '2024-01-16'
  }
];

export function SARequirementDetails() {
  const navigate = useNavigate();
  const { reqId } = useParams();
  const [activeTab, setActiveTab] = useState('audit-trail');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div>
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/solution-architect')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            {requirementData.status !== 'Completed' && (
              <Button 
                size="sm" 
                className="bg-slate-900 hover:bg-slate-800 text-white"
                onClick={() => navigate(`/solution-document-editor/${reqId}`)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Requirement
              </Button>
            )}
          </div>

          {/* Title Section Card */}
          <Card className="border-gray-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl text-gray-900">{requirementData.title}</h1>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">
                  {requirementData.status}
                </Badge>
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                  {requirementData.priority}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <span>{requirementData.id}</span>
              <span>•</span>
              <span>Created {requirementData.created}</span>
              <span>•</span>
              <span>Last updated {requirementData.updated}</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 ml-2">
                {requirementData.category}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Current Owner:</span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs">
                  {requirementData.currentOwner.avatar}
                </div>
                <span className="text-gray-900">{requirementData.currentOwner.name}</span>
                <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">
                  ({requirementData.currentOwner.role})
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Left Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <Card className="border-gray-200 shadow-sm bg-white p-2">
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('requirement-details')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    activeTab === 'requirement-details'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Requirement Details
                </button>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    activeTab === 'timeline'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Timeline
                </button>
                <button
                  onClick={() => setActiveTab('teams')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    activeTab === 'teams'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Teams
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    activeTab === 'documents'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FileIcon className="w-4 h-4" />
                  Documents
                </button>
                <button
                  onClick={() => setActiveTab('audit-trail')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    activeTab === 'audit-trail'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <History className="w-4 h-4" />
                  Audit Trail
                </button>
              </div>
            </Card>
          </div>

          {/* Right Content Area */}
          <div className="flex-1">
            {/* Audit Trail Tab */}
            {activeTab === 'audit-trail' && (
              <div>
                <h2 className="text-lg text-gray-900 mb-4">Audit Trail</h2>
                <div className="space-y-4">
                  {auditTrailData.map((item) => (
                    <Card key={item.id} className="border-gray-200 shadow-sm bg-white p-4">
                      <div className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-gray-900">{item.type}</span>
                            <span className="text-sm text-gray-500">by {item.user}</span>
                          </div>
                          <p className="text-sm text-gray-900 mb-1">{item.title}</p>
                          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                          <p className="text-xs text-gray-500">{item.timestamp}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div>
                <h2 className="text-lg text-gray-900 mb-4">Project Documents</h2>
                <div className="space-y-3">
                  {documentsData.map((doc) => (
                    <Card key={doc.id} className="border-gray-200 shadow-sm bg-white p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-900">{doc.name}</p>
                            <p className="text-xs text-gray-500">
                              {doc.size} • Uploaded by {doc.uploadedBy} on {doc.uploadedDate}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Teams Tab */}
            {activeTab === 'teams' && (
              <div>
                <h2 className="text-lg text-gray-900 mb-4">Assigned Teams</h2>
                <div className="grid grid-cols-3 gap-4">
                  {teamsData.map((team) => (
                    <Card key={team.id} className="border-gray-200 shadow-sm bg-white p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm text-slate-700">{team.avatar}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm text-gray-900 truncate">{team.name}</h3>
                            <Badge
                              variant="outline"
                              className={`text-xs flex-shrink-0 ${
                                team.status === 'active'
                                  ? 'bg-green-50 text-green-700 border-green-200'
                                  : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                              }`}
                            >
                              {team.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1 text-xs text-gray-600">
                        <p>{team.email}</p>
                        <p>{team.phone}</p>
                        <p className="text-gray-500">Assigned: {team.assignedDate}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Requirement Details Tab */}
            {activeTab === 'requirement-details' && (
              <div>
                <h2 className="text-lg text-gray-900 mb-4">Requirement Details</h2>
                <div className="space-y-6">                 {/* Requirement Overview */}
                  <Card className="border-gray-200 shadow-sm bg-white p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-5 h-5 text-gray-700" />
                      <h3 className="text-base font-medium text-gray-900">Requirement Overview</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      <div>
                        <label className="text-xs text-gray-500">Requirement ID</label>
                        <p className="text-sm text-gray-900">{requirementData.id}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Version</label>
                        <p className="text-sm text-gray-900">{requirementData.version}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Priority</label>
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
                          {requirementData.priority}
                        </Badge>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Contract Term</label>
                        <p className="text-sm text-gray-900">{requirementData.contractTerm}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Location</label>
                        <p className="text-sm text-gray-900">{requirementData.location}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Payment Model</label>
                        <p className="text-sm text-gray-900">{requirementData.paymentModel}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">DR Enabled</label>
                        <p className="text-sm text-gray-900">{requirementData.drEnabled}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Budget Range</label>
                        <p className="text-sm text-gray-900">{requirementData.budgetRange}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Created By</label>
                        <p className="text-sm text-gray-900">{requirementData.createdBy}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Added Date</label>
                        <p className="text-sm text-gray-900">{requirementData.addedDate}</p>
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs text-gray-500">Requirement Description</label>
                        <p className="text-sm text-gray-900">{requirementData.requirementDescription}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Product Type</label>
                        <p className="text-sm text-gray-900">{requirementData.productType}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Sub Product</label>
                        <p className="text-sm text-gray-900">{requirementData.subProduct}</p>
                      </div>
                    </div>
                  </Card>

                  {/* Request Details */}
                  <Card className="border-gray-200 shadow-sm bg-white p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Building className="w-5 h-5 text-gray-700" />
                      <h3 className="text-base font-medium text-gray-900">Request Details</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      <div>
                        <label className="text-xs text-gray-500">Opportunity ID</label>
                        <p className="text-sm text-gray-900">{requirementData.opportunityId}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Opportunity Name</label>
                        <p className="text-sm text-gray-900">{requirementData.opportunityName}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Opportunity Status</label>
                        <p className="text-sm text-gray-900">{requirementData.opportunityStatus}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Probability</label>
                        <p className="text-sm text-gray-900">{requirementData.probability}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Request Type</label>
                        <p className="text-sm text-gray-900">{requirementData.requestType}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Created Date</label>
                        <p className="text-sm text-gray-900">{requirementData.created}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Last Updated</label>
                        <p className="text-sm text-gray-900">{requirementData.lastUpdated}</p>
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs text-gray-500">Project Description</label>
                        <p className="text-sm text-gray-900">{requirementData.projectDescription}</p>
                      </div>
                    </div>
                  </Card>

                  {/* Customer Details */}
                  <Card className="border-gray-200 shadow-sm bg-white p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-5 h-5 text-gray-700" />
                      <h3 className="text-base font-medium text-gray-900">Customer Details</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      <div>
                        <label className="text-xs text-gray-500">Company</label>
                        <p className="text-sm text-gray-900">{requirementData.company}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Customer ID</label>
                        <p className="text-sm text-gray-900">{requirementData.customerId}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Contact Person</label>
                        <p className="text-sm text-gray-900">{requirementData.contactPerson}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Industry</label>
                        <p className="text-sm text-gray-900">{requirementData.industry}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Email</label>
                        <p className="text-sm text-gray-900">{requirementData.email}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Phone</label>
                        <p className="text-sm text-gray-900">{requirementData.phone}</p>
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs text-gray-500">Address</label>
                        <p className="text-sm text-gray-900">{requirementData.address}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <div>
                <h2 className="text-lg text-gray-900 mb-4">Timeline</h2>
                <Card className="border-gray-200 shadow-sm bg-white p-6">
                  <div className="space-y-4">
                    {timelineData.map((stage) => (
                      <div key={stage.id} className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full ${
                            stage.status === 'completed'
                              ? 'bg-green-500'
                              : stage.status === 'in-progress'
                              ? 'bg-blue-500'
                              : 'bg-gray-300'
                          } flex items-center justify-center text-white`}
                        >
                          {stage.icon === 'check' ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : stage.icon === 'info' ? (
                            <Info className="w-5 h-5" />
                          ) : (
                            <Building className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm text-gray-900">{stage.stage}</h3>
                            <Badge
                              variant="outline"
                              className={`text-xs flex-shrink-0 ${
                                stage.status === 'completed'
                                  ? 'bg-green-50 text-green-700 border-green-200'
                                  : stage.status === 'in-progress'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : 'bg-gray-50 text-gray-700 border-gray-200'
                              }`}
                            >
                              {stage.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {stage.duration} • {stage.activities}
                          </p>
                          <p className="text-xs text-gray-500">
                            {stage.startDate} to {stage.endDate}
                          </p>
                          <Progress value={stage.progress} className="mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
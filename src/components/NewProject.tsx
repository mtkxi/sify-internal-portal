import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import {
  ArrowLeft,
  ArrowRight,
  Building,
  Users,
  Target,
  MapPin,
  Clock,
  IndianRupee,
  CheckSquare,
  Server,
  Cloud,
  Settings,
  AlertTriangle,
  Search,
  Info
} from 'lucide-react';

interface NewProjectData {
  // Project Information & Scope
  projectName: string;
  location: string;
  datacenter: string;
  contractTerm: string;
  priority: string;
  timeline: string;
  budgetRange: string;
  objectives: string[];
  billingPreference: string;
  consultantName: string;
  consultantEmail: string;
  consultantPhone: string;
  requirementDescription: string;
  
  // Customer Information
  customerType: 'existing_customer' | 'new_prospect' | 'existing_prospect';
  searchQuery: string;
  selectedCustomerId: string;
  selectedProspectId: string;
  
  // New Prospect Fields
  panNumber: string;
  gstNumber: string;
  companyName: string;
  businessType: string;
  addressLine1: string;
  addressLine2: string;
  state: string;
  city: string;
  pinCode: string;
  contactPersonName: string;
  contactEmail: string;
  

  
  // Current Landscape
  currentInfrastructure: string;
  currentDCLocations: string;
  currentHostingModel: string;
  keyChallenges: string;
}

const bdManagers = {
  dc: [
    { id: 'bd_dc_1', name: 'Rajesh Kumar', email: 'rajesh.kumar@onesify.com', expertise: 'Data Center Infrastructure' },
    { id: 'bd_dc_2', name: 'Priya Sharma', email: 'priya.sharma@onesify.com', expertise: 'Facility Management' },
    { id: 'bd_dc_3', name: 'Amit Patel', email: 'amit.patel@onesify.com', expertise: 'Power & Cooling' }
  ],
  network: [
    { id: 'bd_net_1', name: 'Suresh Reddy', email: 'suresh.reddy@onesify.com', expertise: 'Network Architecture' },
    { id: 'bd_net_2', name: 'Kavitha Singh', email: 'kavitha.singh@onesify.com', expertise: 'Connectivity Solutions' },
    { id: 'bd_net_3', name: 'Arjun Mehta', email: 'arjun.mehta@onesify.com', expertise: 'SD-WAN & Site Connect' }
  ],
  managedServices: [
    { id: 'bd_ms_1', name: 'Deepak Gupta', email: 'deepak.gupta@onesify.com', expertise: 'Cloud Migration' },
    { id: 'bd_ms_2', name: 'Anita Joshi', email: 'anita.joshi@onesify.com', expertise: 'Managed Operations' },
    { id: 'bd_ms_3', name: 'Vikram Chauhan', email: 'vikram.chauhan@onesify.com', expertise: 'Security Services' }
  ]
};

const projectObjectives = [
  'Business Expansion',
  'On-Premise Migration',
  'Cost Optimization',
  'Regulatory / Compliance',
  'Improved Performance / Uptime',
  'Disaster Recovery'
];

const priorityLevels = ['Low', 'Medium', 'High', 'Critical'];
const contractTerms = ['1 Year', '2 Years', '3 Years', '4 Years', '5 Years', 'Custom'];
const budgetRanges = [
  '₹10L - ₹50L',
  '₹50L - ₹1Cr',
  '₹1Cr - ₹5Cr',
  '₹5Cr - ₹10Cr',
  '₹10Cr - ₹25Cr',
  '₹25Cr+'
];
const hostingModels = ['On-premise', 'Cloud', 'Hybrid'];

// Mock data for existing customers and prospects
const existingCustomers = [
  {
    id: 'TC001',
    companyName: 'Tech Corp India',
    businessType: 'Enterprise',
    address: 'Mumbai, Maharashtra',
    gstNumber: '27AABCU9603R1Z1',
    panNumber: 'AABCU9603R',
    contactPersonName: 'John Smith',
    contactEmail: 'john.smith@techcorpindia.com'
  },
  {
    id: 'DG002',
    companyName: 'Digital Gateway Solutions',
    businessType: 'Technology',
    address: 'Bangalore, Karnataka',
    gstNumber: '29AABCD1234R5Z6',
    panNumber: 'AABCD1234R',
    contactPersonName: 'Priya Sharma',
    contactEmail: 'priya.sharma@digitalgw.com'
  },
  {
    id: 'MS003',
    companyName: 'MegaSoft Systems',
    businessType: 'Software',
    address: 'Pune, Maharashtra',
    gstNumber: '27AABMS5678R3Z4',
    panNumber: 'AABMS5678R',
    contactPersonName: 'Rajesh Kumar',
    contactEmail: 'rajesh.kumar@megasoft.com'
  }
];

const existingProspects = [
  {
    id: 'P005',
    companyName: 'CloudFirst Enterprises',
    businessType: 'Technology',
    address: 'Mumbai, Maharashtra',
    gstNumber: '',
    panNumber: '',
    contactPersonName: 'John Smith',
    contactEmail: 'john.smith@cloudfirstenterprises.com'
  },
  {
    id: 'P012',
    companyName: 'NextGen Analytics',
    businessType: 'Data Analytics',
    address: 'Hyderabad, Telangana',
    gstNumber: '',
    panNumber: '',
    contactPersonName: 'Sarah Johnson',
    contactEmail: 'sarah.johnson@nextgenanalytics.com'
  },
  {
    id: 'P018',
    companyName: 'Quantum Innovations',
    businessType: 'Research',
    address: 'Chennai, Tamil Nadu',
    gstNumber: '',
    panNumber: '',
    contactPersonName: 'Michael Chen',
    contactEmail: 'michael.chen@quantuminnovations.com'
  }
];

// Indian States and Cities
const statesAndCities = {
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
  'West Bengal': ['Kolkata', 'Durgapur', 'Asansol', 'Siliguri'],
  'Delhi': ['New Delhi', 'Delhi'],
  'Uttar Pradesh': ['Noida', 'Ghaziabad', 'Lucknow', 'Kanpur', 'Agra']
};

// Mock PAN to Company mapping for auto-population
const panToCompanyData = {
  'ABCTY1234D': { companyName: 'Tech Solutions India', businessType: 'Technology' },
  'DEFGH5678E': { companyName: 'Manufacturing Corp', businessType: 'Manufacturing' },
  'IJKLM9012F': { companyName: 'Service Excellence Ltd', businessType: 'Services' }
};

export function NewProject() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<NewProjectData>({
    projectName: '',
    location: '',
    datacenter: '',
    contractTerm: '',
    priority: '',
    timeline: '',
    budgetRange: '',
    objectives: [],
    billingPreference: '',
    consultantName: '',
    consultantEmail: '',
    consultantPhone: '',
    requirementDescription: '',
    customerType: 'new_prospect',
    searchQuery: '',
    selectedCustomerId: '',
    selectedProspectId: '',
    panNumber: '',
    gstNumber: '',
    companyName: '',
    businessType: '',
    addressLine1: '',
    addressLine2: '',
    state: '',
    city: '',
    pinCode: '',
    contactPersonName: '',
    contactEmail: '',

    currentInfrastructure: '',
    currentDCLocations: '',
    currentHostingModel: '',
    keyChallenges: ''
  });

  const handleInputChange = (field: keyof NewProjectData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };



  const handleObjectiveToggle = (objective: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.includes(objective)
        ? prev.objectives.filter(obj => obj !== objective)
        : [...prev.objectives, objective]
    }));
  };

  const handleCustomerTypeChange = (type: 'existing_customer' | 'new_prospect' | 'existing_prospect') => {
    setFormData(prev => ({
      ...prev,
      customerType: type,
      searchQuery: '',
      selectedCustomerId: '',
      selectedProspectId: '',
      panNumber: '',
      gstNumber: '',
      companyName: '',
      businessType: '',
      addressLine1: '',
      addressLine2: '',
      state: '',
      city: '',
      pinCode: '',
      contactPersonName: '',
      contactEmail: ''
    }));
  };

  const handlePANChange = (panNumber: string) => {
    setFormData(prev => {
      const companyData = panToCompanyData[panNumber as keyof typeof panToCompanyData];
      return {
        ...prev,
        panNumber,
        companyName: companyData ? companyData.companyName : '',
        businessType: companyData ? companyData.businessType : ''
      };
    });
  };

  const handleStateChange = (state: string) => {
    setFormData(prev => ({
      ...prev,
      state,
      city: '' // Reset city when state changes
    }));
  };

  const handleSearchSelection = (item: any) => {
    if (formData.customerType === 'existing_customer') {
      setFormData(prev => ({
        ...prev,
        selectedCustomerId: item.id,
        searchQuery: item.companyName,
        companyName: item.companyName,
        businessType: item.businessType,
        addressLine1: item.address,
        addressLine2: '',
        state: '',
        city: '',
        pinCode: '',
        gstNumber: item.gstNumber,
        panNumber: item.panNumber,
        contactPersonName: item.contactPersonName,
        contactEmail: item.contactEmail
      }));
    } else if (formData.customerType === 'existing_prospect') {
      setFormData(prev => ({
        ...prev,
        selectedProspectId: item.id,
        searchQuery: item.companyName,
        companyName: item.companyName,
        businessType: item.businessType,
        addressLine1: item.address,
        addressLine2: '',
        state: '',
        city: '',
        pinCode: '',
        gstNumber: item.gstNumber,
        panNumber: item.panNumber,
        contactPersonName: item.contactPersonName,
        contactEmail: item.contactEmail
      }));
    }
  };

  const getFilteredOptions = () => {
    const data = formData.customerType === 'existing_customer' ? existingCustomers : existingProspects;
    return data.filter(item => 
      item.companyName.toLowerCase().includes(formData.searchQuery.toLowerCase())
    );
  };

  const getSelectedItem = () => {
    if (formData.customerType === 'existing_customer' && formData.selectedCustomerId) {
      return existingCustomers.find(c => c.id === formData.selectedCustomerId);
    } else if (formData.customerType === 'existing_prospect' && formData.selectedProspectId) {
      return existingProspects.find(p => p.id === formData.selectedProspectId);
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save the data and proceed to next step
    // Navigate to Step 2
    navigate('/new-project/step2');
  };

  const isFormValid = () => {
    const hasValidCustomer = 
      (formData.customerType === 'existing_customer' && formData.selectedCustomerId) ||
      (formData.customerType === 'existing_prospect' && formData.selectedProspectId) ||
      (formData.customerType === 'new_prospect' && formData.panNumber && formData.gstNumber && 
       formData.companyName && formData.addressLine1 && formData.state && formData.city && 
       formData.pinCode && formData.contactPersonName && formData.contactEmail);
    
    return formData.projectName && 
           hasValidCustomer && 
           formData.location && 
           formData.priority && 
           formData.objectives.length > 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">New Colocation Project</h1>
              <p className="text-gray-600 mt-1">Step 1: Project Information & Requirements</p>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 border-2 border-blue-600 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-white">1</span>
              </div>
              <span className="text-sm font-medium text-blue-600">Project Info</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-200"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-100 border-2 border-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-gray-500">2</span>
              </div>
              <span className="text-sm font-medium text-gray-500">Infrastructure Requirements</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-200"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-100 border-2 border-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-gray-500">3</span>
              </div>
              <span className="text-sm font-medium text-gray-500">Review & Submit</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Information Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Flexible Project Submission</h4>
                <p className="text-sm text-blue-700 mt-1">
                  You can submit this project even if you don't have all the details. At the final step, you'll choose whether to:
                </p>
                <ul className="text-sm text-blue-700 mt-2 ml-4 space-y-1">
                  <li>• Send to Business Development team for assistance in completing missing details</li>
                  <li>• Submit directly for feasibility check (if all required fields are completed)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Customer Information Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-purple-600" />
                <span>Customer Information</span>
              </CardTitle>
              <div className="text-sm text-gray-600 mt-2">
                Select customer type and provide details
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Customer Type Radio Group */}
              <div className="space-y-3">
                <RadioGroup 
                  value={formData.customerType} 
                  onValueChange={handleCustomerTypeChange}
                  className="flex flex-row space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="existing_customer" id="existing_customer" />
                    <Label htmlFor="existing_customer" className="cursor-pointer">Existing Customer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="new_prospect" id="new_prospect" />
                    <Label htmlFor="new_prospect" className="cursor-pointer">New Prospect</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="existing_prospect" id="existing_prospect" />
                    <Label htmlFor="existing_prospect" className="cursor-pointer">Existing Prospect</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Search field for existing customer/prospect OR New Prospect form */}
              {formData.customerType !== 'new_prospect' ? (
                <div className="space-y-2">
                  <Label htmlFor="companySearch">Company Name</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="companySearch"
                      placeholder={`Search ${formData.customerType === 'existing_customer' ? 'customer' : 'prospect'}...`}
                      value={formData.searchQuery}
                      onChange={(e) => handleInputChange('searchQuery', e.target.value)}
                      className="pl-10"
                    />
                    {formData.searchQuery && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                        {getFilteredOptions().map((item) => (
                          <div
                            key={item.id}
                            className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            onClick={() => handleSearchSelection(item)}
                          >
                            <div className="font-medium">{item.companyName}</div>
                            <div className="text-sm text-gray-500">{item.businessType} • {item.address}</div>
                          </div>
                        ))}
                        {getFilteredOptions().length === 0 && (
                          <div className="px-4 py-2 text-gray-500 text-sm">
                            No {formData.customerType === 'existing_customer' ? 'customers' : 'prospects'} found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* New Prospect Form */
                <div className="space-y-6">
                  {/* PAN Number and GST Number */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="panNumber">PAN Number *</Label>
                      <Input
                        id="panNumber"
                        placeholder="ENTER PAN NUMBER (E.G., ABCTY1234D)"
                        value={formData.panNumber}
                        onChange={(e) => handlePANChange(e.target.value.toUpperCase())}
                        className="uppercase"
                        required
                      />
                      <div className="text-xs text-gray-500">Company details will be auto-populated after entering valid PAN</div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gstNumber">GST Number *</Label>
                      <Input
                        id="gstNumber"
                        placeholder="Auto-populated if available"
                        value={formData.gstNumber}
                        onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Company Name and Business Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        placeholder="Auto-populated from PAN"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        disabled={!formData.panNumber}
                        className="disabled:bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessType">Business Type *</Label>
                      <Input
                        id="businessType"
                        placeholder="Auto-populated from PAN"
                        value={formData.businessType}
                        onChange={(e) => handleInputChange('businessType', e.target.value)}
                        disabled={!formData.panNumber}
                        className="disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  {/* Address Line 1 and Address Line 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="addressLine1">Address Line 1 *</Label>
                      <Input
                        id="addressLine1"
                        placeholder="Enter address line 1"
                        value={formData.addressLine1}
                        onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addressLine2">Address Line 2</Label>
                      <Input
                        id="addressLine2"
                        placeholder="Enter address line 2"
                        value={formData.addressLine2}
                        onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* State and City */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Select value={formData.state} onValueChange={handleStateChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(statesAndCities).map((state) => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Select 
                        value={formData.city} 
                        onValueChange={(value: string) => handleInputChange('city', value)}
                        disabled={!formData.state}
                      >
                        <SelectTrigger className="disabled:opacity-50">
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.state && statesAndCities[formData.state as keyof typeof statesAndCities]?.map((city) => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Pin Code */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pinCode">Pin Code *</Label>
                      <Input
                        id="pinCode"
                        placeholder="Enter pin code"
                        value={formData.pinCode}
                        onChange={(e) => handleInputChange('pinCode', e.target.value)}
                        pattern="[0-9]{6}"
                        maxLength={6}
                        required
                      />
                    </div>
                    <div></div>
                  </div>

                  {/* Contact Person and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactPersonName">Contact Person *</Label>
                      <Input
                        id="contactPersonName"
                        placeholder="Primary contact name"
                        value={formData.contactPersonName}
                        onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Contact Email *</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        placeholder="contact@company.com"
                        value={formData.contactEmail}
                        onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Selected Customer/Prospect Details */}
              {getSelectedItem() && (
                <div className={`p-4 rounded-lg border-2 ${
                  formData.customerType === 'existing_customer' 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-center space-x-2 mb-4">
                    <Badge variant="outline" className="text-xs">
                      {formData.customerType === 'existing_customer' ? 'Customer' : 'Existing Prospect'}
                    </Badge>
                    <span className="font-medium">{getSelectedItem()?.companyName}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-600">
                        {formData.customerType === 'existing_customer' ? 'Customer ID' : 'Prospect ID'}
                      </Label>
                      <div className="p-2 bg-white rounded border text-sm">
                        {getSelectedItem()?.id}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-600">Business Type</Label>
                      <div className="p-2 bg-white rounded border text-sm">
                        {getSelectedItem()?.businessType}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-600">Address</Label>
                      <div className="p-2 bg-white rounded border text-sm">
                        {getSelectedItem()?.address}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-600">
                        GST Number {formData.customerType === 'existing_prospect' && '(Optional)'}
                      </Label>
                      <div className="p-2 bg-white rounded border text-sm">
                        {getSelectedItem()?.gstNumber || 'Enter GST No'}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-600">PAN Number</Label>
                      <div className="p-2 bg-white rounded border text-sm">
                        {getSelectedItem()?.panNumber || 'Enter PAN No'}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-600">Contact Person Name</Label>
                      <div className="p-2 bg-white rounded border text-sm">
                        {getSelectedItem()?.contactPersonName}
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-sm text-gray-600">Contact Email</Label>
                      <div className="p-2 bg-white rounded border text-sm">
                        {getSelectedItem()?.contactEmail}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Information & Scope Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-blue-600" />
                <span>Project Information & Scope</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Project Details */}
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name *</Label>
                <Input
                  id="projectName"
                  placeholder="Enter project name"
                  value={formData.projectName}
                  onChange={(e) => handleInputChange('projectName', e.target.value)}
                  required
                />
              </div>

              {/* Project Scope */}
              <div className="space-y-4">
                {/* City and Data Center Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Select
                      value={formData.location || ''}
                      onValueChange={(value: string) => {
                        handleInputChange('location', value);
                        if (formData.datacenter) {
                          handleInputChange('datacenter', ''); // Reset DC when city changes
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mumbai">Mumbai</SelectItem>
                        <SelectItem value="Delhi">Delhi</SelectItem>
                        <SelectItem value="Bangalore">Bangalore</SelectItem>
                        <SelectItem value="Chennai">Chennai</SelectItem>
                        <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                        <SelectItem value="Pune">Pune</SelectItem>
                        <SelectItem value="Kolkata">Kolkata</SelectItem>
                        <SelectItem value="Ahmedabad">Ahmedabad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="datacenter">Data Center *</Label>
                    <div className="relative">
                      <Server className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                      <Select
                        value={formData.datacenter || ''}
                        onValueChange={(value: string) => handleInputChange('datacenter', value)}
                        disabled={!formData.location}
                      >
                        <SelectTrigger className="pl-10">
                          <SelectValue 
                            placeholder={!formData.location ? "Select a city first" : "Select a data center"} 
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.location === 'Mumbai' && (
                            <>
                              <SelectItem value="mumbai-dc1">Mumbai DC1 - Powai</SelectItem>
                              <SelectItem value="mumbai-dc2">Mumbai DC2 - BKC</SelectItem>
                              <SelectItem value="mumbai-dc3">Mumbai DC3 - Andheri</SelectItem>
                            </>
                          )}
                          {formData.location === 'Delhi' && (
                            <>
                              <SelectItem value="delhi-dc1">Delhi DC1 - Gurgaon</SelectItem>
                              <SelectItem value="delhi-dc2">Delhi DC2 - Noida</SelectItem>
                              <SelectItem value="delhi-dc3">Delhi DC3 - Faridabad</SelectItem>
                            </>
                          )}
                          {formData.location === 'Bangalore' && (
                            <>
                              <SelectItem value="bangalore-dc1">Bangalore DC1 - Electronic City</SelectItem>
                              <SelectItem value="bangalore-dc2">Bangalore DC2 - Whitefield</SelectItem>
                              <SelectItem value="bangalore-dc3">Bangalore DC3 - Hebbal</SelectItem>
                            </>
                          )}
                          {formData.location === 'Chennai' && (
                            <>
                              <SelectItem value="chennai-dc1">Chennai DC1 - Siruseri</SelectItem>
                              <SelectItem value="chennai-dc2">Chennai DC2 - Ambattur</SelectItem>
                            </>
                          )}
                          {formData.location === 'Hyderabad' && (
                            <>
                              <SelectItem value="hyderabad-dc1">Hyderabad DC1 - HITEC City</SelectItem>
                              <SelectItem value="hyderabad-dc2">Hyderabad DC2 - Gachibowli</SelectItem>
                            </>
                          )}
                          {formData.location === 'Pune' && (
                            <>
                              <SelectItem value="pune-dc1">Pune DC1 - Hinjewadi</SelectItem>
                              <SelectItem value="pune-dc2">Pune DC2 - Magarpatta</SelectItem>
                            </>
                          )}
                          {formData.location === 'Kolkata' && (
                            <>
                              <SelectItem value="kolkata-dc1">Kolkata DC1 - Salt Lake</SelectItem>
                              <SelectItem value="kolkata-dc2">Kolkata DC2 - New Town</SelectItem>
                            </>
                          )}
                          {formData.location === 'Ahmedabad' && (
                            <>
                              <SelectItem value="ahmedabad-dc1">Ahmedabad DC1 - Bopal</SelectItem>
                              <SelectItem value="ahmedabad-dc2">Ahmedabad DC2 - SG Highway</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Priority, Contract Term, and Timeline Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority *</Label>
                    <Select value={formData.priority} onValueChange={(value: string) => handleInputChange('priority', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorityLevels.map((priority) => (
                          <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contractTerm">Contract Term</Label>
                    <Select value={formData.contractTerm} onValueChange={(value: string) => handleInputChange('contractTerm', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select term" />
                      </SelectTrigger>
                      <SelectContent>
                        {contractTerms.map((term) => (
                          <SelectItem key={term} value={term}>{term}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeline">Expected Timeline</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                      <Input
                        id="timeline"
                        placeholder="e.g., 3-6 months"
                        value={formData.timeline}
                        onChange={(e) => handleInputChange('timeline', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Budget Range and Billing Preference Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budgetRange">Budget Range</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                      <Select value={formData.budgetRange} onValueChange={(value: string) => handleInputChange('budgetRange', value)}>
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          {budgetRanges.map((range) => (
                            <SelectItem key={range} value={range}>{range}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="billingPreference">Billing Preference</Label>
                    <Select value={formData.billingPreference} onValueChange={(value: string) => handleInputChange('billingPreference', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select billing frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Project Objectives */}
              <div className="space-y-3">
                <Label className="flex items-center space-x-2">
                  <CheckSquare className="w-4 h-4" />
                  <span>Project Objectives *</span>
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {projectObjectives.map((objective) => (
                    <div key={objective} className="flex items-center space-x-2">
                      <Checkbox
                        id={objective}
                        checked={formData.objectives.includes(objective)}
                        onCheckedChange={() => handleObjectiveToggle(objective)}
                      />
                      <Label htmlFor={objective} className="text-sm font-normal cursor-pointer">
                        {objective}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.objectives.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.objectives.map((obj) => (
                      <Badge key={obj} variant="secondary" className="text-xs">
                        {obj}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>



              {/* Involved Consultant */}
              <div className="space-y-4">
                <Label className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Involved Consultant</span>
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="consultantName">Name</Label>
                    <Input
                      id="consultantName"
                      placeholder="Consultant name"
                      value={formData.consultantName}
                      onChange={(e) => handleInputChange('consultantName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="consultantEmail">Email</Label>
                    <Input
                      id="consultantEmail"
                      type="email"
                      placeholder="consultant@example.com"
                      value={formData.consultantEmail}
                      onChange={(e) => handleInputChange('consultantEmail', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="consultantPhone">Phone</Label>
                    <Input
                      id="consultantPhone"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={formData.consultantPhone}
                      onChange={(e) => handleInputChange('consultantPhone', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Requirement Description */}
              <div className="space-y-2">
                <Label htmlFor="requirementDescription">Requirement Description</Label>
                <Textarea
                  id="requirementDescription"
                  placeholder="Provide a brief description of the project requirements..."
                  value={formData.requirementDescription}
                  onChange={(e) => handleInputChange('requirementDescription', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>



          {/* Current Landscape Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Server className="w-5 h-5 text-orange-600" />
                <span>Current Infrastructure Landscape</span>
              </CardTitle>
              <div className="text-sm text-gray-600 mt-2">
                Understand the customer's existing infrastructure setup and challenges
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentInfrastructure">Current Infrastructure</Label>
                  <Textarea
                    id="currentInfrastructure"
                    placeholder="Describe current servers, storage, network setup..."
                    value={formData.currentInfrastructure}
                    onChange={(e) => handleInputChange('currentInfrastructure', e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentDCLocations">Current DC Locations</Label>
                  <Textarea
                    id="currentDCLocations"
                    placeholder="List current data center locations..."
                    value={formData.currentDCLocations}
                    onChange={(e) => handleInputChange('currentDCLocations', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentHostingModel">Current Hosting Model</Label>
                <Select value={formData.currentHostingModel} onValueChange={(value: string) => handleInputChange('currentHostingModel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select hosting model" />
                  </SelectTrigger>
                  <SelectContent>
                    {hostingModels.map((model) => (
                      <SelectItem key={model} value={model}>{model}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keyChallenges">Key Challenges</Label>
                <Textarea
                  id="keyChallenges"
                  placeholder="What are the main challenges with current setup? (Performance, cost, scalability, etc.)"
                  value={formData.keyChallenges}
                  onChange={(e) => handleInputChange('keyChallenges', e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-between items-center pt-6">
            <div className="text-sm text-gray-500">
              * Required fields
            </div>
            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Next Step
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
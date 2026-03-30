// Mock customer data for testing
export const MOCK_CUSTOMER = {
  name: 'Tech Corp India',
  customerId: 'TC001',
  businessType: 'Enterprise',
  panNumber: 'AABCU9603R',
  address: 'Mumbai, Maharashtra',
  gstNumber: '27AABCU9603R1Z1',
  contactPersonName: 'John Smith',
  contactEmail: 'john.smith@techcorpindia.com'
};

// Mock opportunity data grouped by opportunity ID
export const MOCK_OPPORTUNITIES_DATA: { [key: string]: any } = {
  'OPP-2024-001': {
    opportunityId: 'OPP-2024-001',
    name: 'Tech Corp India',
    customerId: 'TC001',
    businessType: 'Enterprise',
    address: '123 Business Park, Andheri East, Mumbai, Maharashtra, 400069',
    panNumber: 'AABCU9603R',
    gstNumber: '27AABCU9603R1Z1',
    contactPersonName: 'John Smith',
    contactEmail: 'john.smith@techcorpindia.com',
    leadBUType: 'Network',
    opportunityStatus: 'Qualification',
    salesStage: 'Proposal Development',
    createdOn: '2024-12-15',
    value: '₹15,00,000'
  },
  'OPP-2024-004': {
    opportunityId: 'OPP-2024-004',
    name: 'Tech Corp India',
    customerId: 'TC001',
    businessType: 'Enterprise',
    address: '123 Business Park, Andheri East, Mumbai, Maharashtra, 400069',
    panNumber: 'AABCU9603R',
    gstNumber: '27AABCU9603R1Z1',
    contactPersonName: 'John Smith',
    contactEmail: 'john.smith@techcorpindia.com',
    leadBUType: 'Colocation',
    opportunityStatus: 'Needs Analysis',
    salesStage: 'Discovery',
    createdOn: '2025-01-10',
    value: '₹25,00,000'
  },
  'OPP-2024-007': {
    opportunityId: 'OPP-2024-007',
    name: 'Tech Corp India',
    customerId: 'TC001',
    businessType: 'Enterprise',
    address: '123 Business Park, Andheri East, Mumbai, Maharashtra, 400069',
    panNumber: 'AABCU9603R',
    gstNumber: '27AABCU9603R1Z1',
    contactPersonName: 'John Smith',
    contactEmail: 'john.smith@techcorpindia.com',
    leadBUType: 'Managed Services',
    opportunityStatus: 'Closed Won',
    salesStage: 'Closed',
    createdOn: '2024-10-05',
    value: '₹40,00,000'
  },
  'OPP-2024-002': {
    opportunityId: 'OPP-2024-002',
    name: 'Tech Corp Industries',
    customerId: 'TCI002',
    businessType: 'SME',
    address: '45 Innovation Hub, Hinjewadi, Pune, Maharashtra, 411057',
    panNumber: 'AABCI9604S',
    gstNumber: '27AABCI9604S1Z2',
    contactPersonName: 'Sarah Johnson',
    contactEmail: 'sarah.j@techcorpind.com',
    leadBUType: 'Colocation',
    opportunityStatus: 'Needs Analysis',
    salesStage: 'Discovery',
    createdOn: '2025-01-20',
    value: '₹18,00,000'
  },
  'OPP-2024-003': {
    opportunityId: 'OPP-2024-003',
    name: 'Global Tech Solutions',
    customerId: 'GTS003',
    businessType: 'Enterprise',
    address: '78 Tech Park, Electronic City, Bangalore, Karnataka, 560100',
    panNumber: 'AABGT9605T',
    gstNumber: '29AABGT9605T1Z3',
    contactPersonName: 'Priya Sharma',
    contactEmail: 'priya.sharma@globaltech.com',
    leadBUType: 'Managed Services',
    opportunityStatus: 'Proposal Submitted',
    salesStage: 'Negotiation',
    createdOn: '2025-01-28',
    value: '₹32,00,000'
  }
};

// Helper function to generate mock response for unknown opportunity IDs
export const generateMockOpportunity = (opportunityId: string) => ({
  opportunityId: opportunityId.toUpperCase(),
  name: 'Sample Customer Ltd',
  customerId: 'CUST-' + Math.floor(Math.random() * 10000),
  businessType: 'Enterprise',
  address: '123 Business Street, Mumbai, Maharashtra, 400001',
  panNumber: 'AABCS9876K',
  gstNumber: '27AABCS9876K1Z5',
  contactPersonName: 'John Doe',
  contactEmail: 'john.doe@samplecustomer.com',
  leadBUType: 'Network',
  opportunityStatus: 'Qualification',
  salesStage: 'Needs Analysis',
  createdOn: new Date().toISOString().split('T')[0],
  value: '₹10,00,000'
});

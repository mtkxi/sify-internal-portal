import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { ArrowLeft } from 'lucide-react';

export function ShareOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const { proposalId, company, customerId, opportunityId } = location.state || {};
  const [accordionValue, setAccordionValue] = useState<string[]>([]);

  const handleShareOrder = () => {
    // In a real application, this would send the order via email or trigger download
    alert('Order shared successfully!');
    navigate('/proposal-details', { state: { proposalId } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/po-details', { 
                  state: { proposalId, company, customerId, opportunityId } 
                })}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-gray-900">Share Order</h1>
                <p className="text-sm text-gray-600">Review and share order details with stakeholders</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-6">
        <div className="w-full space-y-6">
          {/* Basic Details Accordion */}
          <Accordion type="multiple" value={accordionValue} onValueChange={setAccordionValue}>
            <AccordionItem value="basic-details" className="border rounded-lg bg-white">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center space-x-2">
                  <span className="text-base">Requirement Details</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <Label className="text-gray-600 text-sm">Req ID</Label>
                    <p className="text-gray-900 mt-1">{proposalId || 'PROP-2025-001'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Product Type</Label>
                    <p className="text-gray-900 mt-1">DIA (Dedicated Internet Access)</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Total FIDs</Label>
                    <p className="text-gray-900 mt-1">3</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Contract Term</Label>
                    <p className="text-gray-900 mt-1">2 year</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Created On</Label>
                    <p className="text-gray-900 mt-1">2025-02-04</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="customer-details" className="border rounded-lg bg-white mt-4">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center space-x-2">
                  <span className="text-base">Customer Details</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <Label className="text-gray-600 text-sm">Company Name</Label>
                    <p className="text-gray-900 mt-1">{company || 'Cloud Innovations Pvt'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Customer ID</Label>
                    <p className="text-gray-900 mt-1">{customerId || 'CL000002'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Business Type</Label>
                    <p className="text-gray-900 mt-1">Private Limited</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">PAN Number</Label>
                    <p className="text-gray-900 mt-1">AAACT1234F</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">GST Number</Label>
                    <p className="text-gray-900 mt-1">27AAACT1234F1Z5</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Primary Contact</Label>
                    <p className="text-gray-900 mt-1">Rajesh Kumar</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="bg-gray-800 rounded-lg overflow-hidden" style={{ height: '600px' }}>
            {/* PDF Viewer Header */}
            <div className="bg-gray-700 px-4 py-2 flex items-center justify-between text-white text-sm">
              <div className="flex items-center space-x-4">
                <button className="hover:bg-gray-600 p-1 rounded">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <span className="text-xs">bef8226a-25fd-4fff-bd2f-a5494f6ddfeb</span>
              </div>
              <div className="flex items-center space-x-4">
                <span>1 / 1</span>
                <button className="hover:bg-gray-600 px-2 py-1 rounded">−</button>
                <span>90%</span>
                <button className="hover:bg-gray-600 px-2 py-1 rounded">+</button>
                <div className="flex space-x-2">
                  <button className="hover:bg-gray-600 p-1 rounded" title="Fit to page">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l5-5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </button>
                  <button className="hover:bg-gray-600 p-1 rounded" title="Rotate">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  <button className="hover:bg-gray-600 p-1 rounded" title="Text selection">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                  <button className="hover:bg-gray-600 p-1 rounded" title="Undo">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </button>
                  <button className="hover:bg-gray-600 p-1 rounded" title="Redo">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                    </svg>
                  </button>
                </div>
                <div className="flex space-x-2">
                  <button className="hover:bg-gray-600 p-1 rounded" title="Download">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                  <button className="hover:bg-gray-600 p-1 rounded" title="Print">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                  </button>
                  <button className="hover:bg-gray-600 p-1 rounded" title="More">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* PDF Content */}
            <div className="bg-white h-full overflow-auto p-8">
              <div className="max-w-4xl mx-auto bg-white shadow-lg p-12">
                {/* OneSify Logo */}
                <div className="mb-8">
                  <div className="flex items-center space-x-2">
                    <div className="text-2xl">
                      <span className="text-gray-800">ONE</span>
                      <span className="text-yellow-400">Sify</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">INFRASTRUCTURE OUTSOURCING</div>
                </div>

                {/* Document Content */}
                <div className="space-y-6 text-sm leading-relaxed text-gray-700">
                  <p className="text-justify">
                    <span className="mr-4">1.</span>
                    The data retrieved from API Experience dedicated internet access (DIA) for all your business 
                    needs with Sify, India's leading network services provider. Sify's connectivity services are depend-
                    able and affordable offering you fast and secure connectivity for critical transactions and increased 
                    business efficiency, to keep your business ahead. Internet Leased lines are more flexible than 
                    broadband connectivity because leased lines provide you the liberty to use the dedicated line for 
                    specific purpose, either to link various branches for dedicated internet access or for both. You can 
                    choose from a variety of speeds and management options based on the needs of your business.
                  </p>
                  
                  <p className="text-justify">
                    <span className="mr-4">2.</span>
                    Sify's leased line connectivity solutions cater to the internet connectivity requirements of enterprise 
                    customers in India. The company offers a comprehensive portfolio of products and services such as 
                    MPLS VPN, Internet Leased Line, Cloud Data centre and Managed Services. The services are deliv-
                    ered over a robust and reliable network infrastructure covering all the major cities in India ensuring 
                    high availability and performance. The solution offering includes services ranging from basic Inter-
                    net Connectivity to Managed Services to hosting applications in a secure cloud environment.
                  </p>

                  <p className="text-justify">
                    <span className="mr-4">3.</span>
                    Sify's Internet Leased Line offers guaranteed bandwidth through dedicated point to point connectiv-
                    ity to the nearest Sify POP (Point of Presence) and provides high speed access to public internet. 
                    Internet Leased Line service provides direct connectivity from Sify's backbone network infrastructure 
                    through a terminating device at the customer premises, ensuring superior service quality, quick fault 
                    resolution and guaranteed minimum bandwidth availability throughout the contract period with com-
                    mitted Service Level Agreement (SLA) uptime of 99.5%.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/po-details', { 
                state: { proposalId, company, customerId, opportunityId } 
              })}
            >
              Back
            </Button>
            <Button onClick={handleShareOrder}>
              Share Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
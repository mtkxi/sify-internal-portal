import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Badge } from '../ui/badge';
import { Search, ArrowRight, X, CheckCircle2 } from 'lucide-react';

interface OpportunitySearchProps {
  searchBy: 'opportunity' | 'customer';
  setSearchBy: (value: 'opportunity' | 'customer') => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  selectedCustomer: any;
  setSelectedCustomer: (value: any) => void;
  customerOpportunities: any[];
  showOpportunityList: boolean;
  setShowOpportunityList: (value: boolean) => void;
  handleOpportunitySearch: () => void;
  handleOpportunitySelect: (opp: any) => void;
  handleConfirmAndProceed: () => void;
}

export function OpportunitySearch({
  searchBy,
  setSearchBy,
  searchValue,
  setSearchValue,
  selectedCustomer,
  setSelectedCustomer,
  customerOpportunities,
  showOpportunityList,
  setShowOpportunityList,
  handleOpportunitySearch,
  handleOpportunitySelect,
  handleConfirmAndProceed
}: OpportunitySearchProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900">
            <Search className="w-5 h-5 mr-2" />
            Search Opportunity
          </CardTitle>
          <CardDescription>Search by Opportunity ID or Customer Name to begin creating a new service request</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Type Selection */}
          <div>
            <Label className="mb-3 block">Search By</Label>
            <RadioGroup value={searchBy} onValueChange={(value: 'opportunity' | 'customer') => {
              setSearchBy(value);
              setSearchValue('');
              setSelectedCustomer(null);
              setShowOpportunityList(false);
            }}>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="opportunity" id="opportunity" />
                  <Label htmlFor="opportunity" className="cursor-pointer">Opportunity ID</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="customer" id="customer" />
                  <Label htmlFor="customer" className="cursor-pointer">Customer Name</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Search Input */}
          <div>
            <Label>{searchBy === 'opportunity' ? 'Opportunity ID' : 'Customer Name'} *</Label>
            <div className="flex gap-2 mt-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={searchBy === 'opportunity' ? 'Enter any Opportunity ID' : 'Enter Customer Name'}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchValue.trim().length > 0) {
                      handleOpportunitySearch();
                    }
                  }}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleOpportunitySearch}>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Opportunity List (when searching by customer) */}
          {showOpportunityList && customerOpportunities.length > 0 && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h4 className="text-sm text-gray-900">Select an Opportunity</h4>
                <p className="text-xs text-gray-500 mt-1">Found {customerOpportunities.length} opportunities (sorted by most recent)</p>
              </div>
              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {customerOpportunities.map((opp) => (
                  <div
                    key={opp.opportunityId}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleOpportunitySelect(opp)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-blue-600">{opp.opportunityId}</span>
                          <Badge className="bg-blue-100 text-blue-700">{opp.leadBUType}</Badge>
                          <Badge variant="outline">{opp.opportunityStatus}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                          <div>
                            <span className="text-gray-500">Sales Stage:</span>
                            <span className="ml-2 text-gray-900">{opp.salesStage}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Value:</span>
                            <span className="ml-2 text-gray-900">{opp.value}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Created On:</span>
                            <span className="ml-2 text-gray-900">{opp.createdOn}</span>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirmation Card (when customer is selected) */}
          {selectedCustomer && (
            <div className="border-2 border-green-200 rounded-lg overflow-hidden bg-green-50/30">
              <div className="bg-green-100 px-4 py-3 border-b border-green-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-700" />
                  <h4 className="text-sm text-green-900">Opportunity & Customer Details Found</h4>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCustomer(null);
                    setSearchValue('');
                  }}
                  className="h-8 w-8 p-0 hover:bg-green-200"
                >
                  <X className="w-4 h-4 text-green-700" />
                </Button>
              </div>
              <div className="p-5 bg-white">
                <div className="space-y-4">
                  {/* Opportunity Details Section */}
                  <div className="pb-4 border-b border-gray-200">
                    <p className="text-xs text-gray-500 mb-3">Opportunity Details</p>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                      <div>
                        <p className="text-xs text-gray-600">Opportunity ID</p>
                        <p className="text-sm text-gray-900">{selectedCustomer.opportunityId}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Opportunity Status</p>
                        <p className="text-sm text-gray-900">{selectedCustomer.opportunityStatus}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Sales Stage</p>
                        <p className="text-sm text-gray-900">{selectedCustomer.salesStage}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Lead BU Type</p>
                        <p className="text-sm text-gray-900">{selectedCustomer.leadBUType}</p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Details Section */}
                  <div>
                    <p className="text-xs text-gray-500 mb-3">Customer Details</p>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                      <div>
                        <p className="text-xs text-gray-600">Company Name</p>
                        <p className="text-sm text-gray-900">{selectedCustomer.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Customer ID</p>
                        <p className="text-sm text-gray-900">{selectedCustomer.customerId}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Business Type</p>
                        <p className="text-sm text-gray-900">{selectedCustomer.businessType}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-gray-600">Address</p>
                        <p className="text-sm text-gray-900">{selectedCustomer.address}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">PAN Number</p>
                        <p className="text-sm text-gray-900">{selectedCustomer.panNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">GST Number</p>
                        <p className="text-sm text-gray-900">{selectedCustomer.gstNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Primary Contact Name</p>
                        <p className="text-sm text-gray-900">{selectedCustomer.contactPersonName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Primary Contact Email</p>
                        <p className="text-sm text-gray-900">{selectedCustomer.contactEmail}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCustomer(null);
                      setSearchValue('');
                    }}
                  >
                    Clear Selection
                  </Button>
                  <Button 
                    onClick={handleConfirmAndProceed} 
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Confirm & Proceed
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, ExternalLink, Phone, Mail } from 'lucide-react';

interface FIDDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fidData: {
    fid: string;
    type: string;
    product: string;
    requestDate: string;
    feasibilityDate: string;
    expiresOn?: string;
    linkType?: string;
    feasibilityStatus: string;
    orderStatus?: string;
    proposalId?: string;
    orderId?: string;
    connectionType: string;
    bandwidth: string;
    location: string;
    fullAddress: string;
    latitude: string;
    longitude: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
  };
}

export function FIDDetailsModal({ open, onOpenChange, fidData }: FIDDetailsModalProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string }> = {
      'Checking Feasibility': { color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
      'Feasible': { color: 'bg-blue-100 text-blue-700 border-blue-300' },
      'Not Feasible': { color: 'bg-red-100 text-red-700 border-red-300' },
      'Expired': { color: 'bg-gray-100 text-gray-700 border-gray-300' },
      'Proposal Generated': { color: 'bg-blue-100 text-blue-700 border-blue-300' },
      'Order Placed': { color: 'bg-purple-100 text-purple-700 border-purple-300' },
      'Order Completed': { color: 'bg-green-100 text-green-700 border-green-300' },
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-700' };
    return <Badge variant="outline" className={`${config.color} rounded-full`}>{status}</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[380px] p-0 gap-0 bg-[#f7f9fa]">
        <DialogTitle className="sr-only">FID Details</DialogTitle>
        <DialogDescription className="sr-only">
          View detailed information about the feasibility ID including overview, order details, bandwidth, location, and contact information.
        </DialogDescription>
        
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-gray-900">FID Details</h2>
        </div>

        {/* Content */}
        <div className="px-5 py-0 overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="space-y-6 py-5">
            {/* Overview Section */}
            <div className="space-y-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-gray-900 text-[15px]">Overview</h3>
                {getStatusBadge(fidData.feasibilityStatus)}
              </div>
              <div className="bg-white rounded-lg p-5">
                <div className="grid grid-cols-3 gap-5">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">FID</p>
                    <p className="text-[13px] text-gray-900">{fidData.fid}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <p className="text-xs text-gray-600">Type</p>
                    <p className="text-[13px] text-gray-900">{fidData.type}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">Request Date</p>
                    <p className="text-[13px] text-gray-900 whitespace-nowrap">{fidData.requestDate}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">Feasibility Date</p>
                    <p className="text-[13px] text-gray-900 whitespace-nowrap">{fidData.feasibilityDate}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">Expires On</p>
                    <p className="text-[13px] text-gray-900">{fidData.expiresOn || '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Details Section */}
            {(fidData.orderStatus || fidData.proposalId || fidData.orderId) && (
              <div className="space-y-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-gray-900 text-[15px]">Order Details</h3>
                  {fidData.orderStatus && (
                    <Badge variant="outline" className="bg-blue-100 text-gray-900 border-blue-300 rounded">
                      {fidData.orderStatus}
                    </Badge>
                  )}
                </div>
                <div className="bg-white rounded-lg p-5">
                  <div className="grid grid-cols-2 gap-5">
                    {fidData.proposalId && (
                      <div className="space-y-1">
                        <p className="text-xs text-gray-600">Req ID</p>
                        <div className="flex items-center gap-1">
                          <p className="text-[13px] text-blue-600">{fidData.proposalId}</p>
                          <ExternalLink className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                    )}
                    {fidData.orderId && (
                      <div className="space-y-1">
                        <p className="text-xs text-gray-600">Order ID</p>
                        <div className="flex items-center gap-1">
                          <p className="text-[13px] text-blue-600">{fidData.orderId}</p>
                          <ExternalLink className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Bandwidth Details Section */}
            <div className="space-y-1">
              <h3 className="text-gray-900 text-[15px] mb-1">Bandwidth Details</h3>
              <div className="bg-white rounded-lg p-5">
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">Conn. Type</p>
                    <p className="text-[13px] text-gray-900">{fidData.connectionType}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">Bandwidth</p>
                    <p className="text-[13px] text-gray-900">{fidData.bandwidth}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="space-y-1">
              <h3 className="text-gray-900 text-[15px] mb-1">Location</h3>
              <div className="bg-white rounded-lg p-5">
                <div className="space-y-2">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">Address</p>
                    <p className="text-[13px] text-gray-900">{fidData.fullAddress}</p>
                  </div>
                  <p className="text-[13px] text-gray-600">
                    {fidData.latitude}, {fidData.longitude}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Details Section */}
            <div className="space-y-1">
              <h3 className="text-gray-900 text-[15px] mb-1">Contact Details</h3>
              <div className="bg-white rounded-lg p-5">
                <div className="space-y-3">
                  <p className="text-[13px] text-gray-900">{fidData.contactName}</p>
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-600" />
                      <p className="text-[13px] text-gray-700">{fidData.contactPhone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-600" />
                      <p className="text-[13px] text-gray-700">{fidData.contactEmail}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex justify-center">
          <Button
            variant="outline"
            className="px-12"
            onClick={() => onOpenChange(false)}
          >
            Ok
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
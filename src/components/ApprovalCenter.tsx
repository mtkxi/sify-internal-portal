import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Textarea } from './ui/textarea';
import { CheckCircle, XCircle, Clock, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface ApprovalItem {
  id: string;
  requestId: string;
  customerName: string;
  assignedBy: string;
  totalOTC: number;
  totalARC: number;
  margin: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  urgency: 'high' | 'medium' | 'low';
}

const mockApprovals: ApprovalItem[] = [
  {
    id: '1',
    requestId: 'CL000001',
    customerName: 'Tech Corp India',
    assignedBy: 'John Doe',
    totalOTC: 120000,
    totalARC: 280000,
    margin: 18.5,
    status: 'pending',
    submittedDate: '2024-12-28',
    urgency: 'high'
  },
  {
    id: '2',
    requestId: 'CL000002',
    customerName: 'Digital Solutions Ltd',
    assignedBy: 'Sarah Wilson',
    totalOTC: 85000,
    totalARC: 195000,
    margin: 22.3,
    status: 'pending',
    submittedDate: '2024-12-27',
    urgency: 'medium'
  },
  {
    id: '3',
    requestId: 'CL000003',
    customerName: 'Cloud Innovations Pvt',
    assignedBy: 'Mike Johnson',
    totalOTC: 45000,
    totalARC: 125000,
    margin: 12.8,
    status: 'pending',
    submittedDate: '2024-12-26',
    urgency: 'high'
  }
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export function ApprovalCenter() {
  const navigate = useNavigate();
  const [approvals, setApprovals] = useState<ApprovalItem[]>(mockApprovals);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const approveRequest = (approvalId: string) => {
    setApprovals(prev => prev.map(item => 
      item.id === approvalId ? { ...item, status: 'approved' as const } : item
    ));
    setSelectedApproval(null);
    alert('Request approved successfully!');
  };

  const rejectRequest = (approvalId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    setApprovals(prev => prev.map(item => 
      item.id === approvalId ? { ...item, status: 'rejected' as const } : item
    ));
    setSelectedApproval(null);
    setRejectionReason('');
    alert('Request rejected with feedback');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getMarginIcon = (margin: number) => {
    if (margin >= 25) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (margin >= 15) return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    return <TrendingDown className="w-4 h-4 text-red-600" />;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1>Approval Center</h1>
          <p className="text-gray-600">Review and approve pricing requests</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Approvals List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Pricing requests requiring your review</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Assigned By</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>Margin</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvals.map(approval => (
                    <TableRow key={approval.id}>
                      <TableCell className="font-medium">{approval.requestId}</TableCell>
                      <TableCell>{approval.customerName}</TableCell>
                      <TableCell>{approval.assignedBy}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>OTC: {formatCurrency(approval.totalOTC)}</div>
                          <div>ARC: {formatCurrency(approval.totalARC)}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getMarginIcon(approval.margin)}
                          <span className="ml-1">{approval.margin}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getStatusIcon(approval.status)}
                          <Badge 
                            variant={approval.status === 'approved' ? 'default' : approval.status === 'rejected' ? 'destructive' : 'secondary'}
                            className="ml-2"
                          >
                            {approval.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {approval.status === 'pending' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedApproval(approval)}
                          >
                            Review
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Review Panel */}
        <div className="lg:col-span-1">
          {selectedApproval ? (
            <Card>
              <CardHeader>
                <CardTitle>Review Request</CardTitle>
                <CardDescription>{selectedApproval.requestId}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Customer:</span>
                    <div>{selectedApproval.customerName}</div>
                  </div>
                  <div>
                    <span className="font-medium">Assigned By:</span>
                    <div>{selectedApproval.assignedBy}</div>
                  </div>
                  <div>
                    <span className="font-medium">OTC:</span>
                    <div>{formatCurrency(selectedApproval.totalOTC)}</div>
                  </div>
                  <div>
                    <span className="font-medium">ARC:</span>
                    <div>{formatCurrency(selectedApproval.totalARC)}</div>
                  </div>
                  <div>
                    <span className="font-medium">Margin:</span>
                    <div className="flex items-center">
                      {getMarginIcon(selectedApproval.margin)}
                      <span className="ml-1">{selectedApproval.margin}%</span>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Urgency:</span>
                    <Badge variant={selectedApproval.urgency === 'high' ? 'destructive' : selectedApproval.urgency === 'medium' ? 'secondary' : 'default'}>
                      {selectedApproval.urgency}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/pricing/${selectedApproval.requestId}`)}
                  >
                    View Full Details
                  </Button>
                </div>

                <div>
                  <label className="text-sm font-medium">Rejection Reason (if applicable)</label>
                  <Textarea 
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Provide reason for rejection..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    onClick={() => approveRequest(selectedApproval.id)}
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => rejectRequest(selectedApproval.id)}
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Select Request</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Select a pending request to review details and make approval decisions.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
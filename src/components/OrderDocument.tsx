import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import {
  ArrowLeft,
  FileText,
  Download,
  Send,
  CheckCircle,
  AlertCircle,
  Building,
  Calendar,
  IndianRupee,
  Mail
} from 'lucide-react';

// Mock requirement and BOM data
const mockRequirement = {
  id: "CL000002",
  customerName: "Cloud Innovations Pvt",
  customerId: "CI003",
  title: "Digital Transformation Suite",
  createdDate: "2024-12-10",
  contractTerm: "5 Years",
  location: "Bangalore",
  priority: "High"
};

const mockBOMItems = [
  {
    id: 1,
    category: "Compute",
    productName: "VPI High Availability",
    sku: "VPI-HA-1vCPU-1GBvRAM",
    specifications: "1 vCPUs, 1 GB RAM",
    quantity: 10,
    otc: 50000,
    arc: 25000
  },
  {
    id: 2,
    category: "Storage",
    productName: "Standard Storage",
    sku: "OBJ-STR-STANDARD-SINGLE-REGION-PER-GB",
    specifications: "50 GB",
    quantity: 1,
    otc: 15000,
    arc: 8000
  },
  {
    id: 3,
    category: "Network",
    productName: "Load Balancer",
    sku: "LB-25MBPS-1VIP",
    specifications: "Layer 7, SSL termination, Health checks",
    quantity: 2,
    otc: 30000,
    arc: 18000
  },
  {
    id: 4,
    category: "Security",
    productName: "GeoTrust",
    sku: "GEOTRUST-SSLCERT-4SAN-1DOMAIN",
    specifications: "DDoS protection",
    quantity: 1,
    otc: 12000,
    arc: 6000
  }
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function OrderDocument() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [shareEmail, setShareEmail] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');

  const requirement = mockRequirement;
  const bomItems = mockBOMItems;

  // Calculate totals
  const totalOTC = bomItems.reduce((sum, item) => sum + (item.otc * item.quantity), 0);
  const totalARC = bomItems.reduce((sum, item) => sum + (item.arc * item.quantity), 0);
  const grandTotal = totalOTC + totalARC;

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (value: string) => {
    setShareEmail(value);
    if (emailError) {
      setEmailError('');
    }
  };

  const handleDownload = () => {
    // Simulate document download
    alert('Order document downloaded successfully!');
  };

  const handleShare = async () => {
    if (!shareEmail) {
      setEmailError('Email address is required');
      return;
    }

    if (!validateEmail(shareEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setIsSharing(true);
    
    // Simulate sharing process
    setTimeout(() => {
      setIsSharing(false);
      setShareSuccess(true);
      
      // Reset after showing success
      setTimeout(() => {
        setShareSuccess(false);
        setShareEmail('');
        navigate('/');
      }, 2000);
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => navigate(`/po-details/${id}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to PO Details
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Order Document
            </h1>
            <p className="text-gray-600 mt-1">
              {requirement.id} • {requirement.customerName} ({requirement.customerId})
            </p>
          </div>
        </div>
        <Button onClick={handleDownload} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Download Document
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Viewer */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Order Document Preview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Document Header */}
              <div className="text-center border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-900">ORDER DOCUMENT</h2>
                <p className="text-gray-600 mt-2">OneSify Cloud Solutions</p>
                <Badge className="mt-2">Document ID: ORD-{requirement.id}-2024</Badge>
              </div>

              {/* Customer & Requirement Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Company:</span> {requirement.customerName}</div>
                    <div><span className="font-medium">Customer ID:</span> {requirement.customerId}</div>
                    <div><span className="font-medium">Location:</span> {requirement.location}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Requirement Details</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Requirement ID:</span> {requirement.id}</div>
                    <div><span className="font-medium">Title:</span> {requirement.title}</div>
                    <div><span className="font-medium">Contract Term:</span> {requirement.contractTerm}</div>
                    <div><span className="font-medium">Priority:</span> 
                      <Badge variant="outline" className="ml-2 text-xs">{requirement.priority}</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* BOM Table */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Bill of Materials</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Specifications</TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead className="text-right">OTC</TableHead>
                      <TableHead className="text-right">ARC</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bomItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.category}</TableCell>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell className="text-xs font-mono">{item.sku}</TableCell>
                        <TableCell className="text-sm">{item.specifications}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.otc)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.arc)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Total Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                      <span>Total OTC:</span>
                      <span className="font-medium">{formatCurrency(totalOTC)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total ARC:</span>
                      <span className="font-medium">{formatCurrency(totalARC)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Grand Total:</span>
                      <span>{formatCurrency(grandTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-sm text-gray-500 border-t pt-4">
                <p>Generated on {new Date().toLocaleDateString('en-IN')} • Valid for 30 days</p>
                <p>OneSify Cloud Solutions - Transforming Digital Infrastructure</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Share Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="w-5 h-5" />
                <span>Share Order Document</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Customer Email Address *</span>
                </Label>
                <Input
                  type="email"
                  value={shareEmail}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="customer@company.com"
                  className={emailError ? 'border-red-500' : ''}
                  disabled={isSharing}
                />
                {emailError && (
                  <p className="text-sm text-red-500 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{emailError}</span>
                  </p>
                )}
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  The order document will be sent to the customer for electronic signature.
                </p>
              </div>

              <Button 
                onClick={handleShare} 
                className="w-full"
                disabled={isSharing || shareSuccess}
              >
                {isSharing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sharing...
                  </>
                ) : shareSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Shared Successfully!
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Share Order Document
                  </>
                )}
              </Button>

              {shareSuccess && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800 flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Order document shared successfully! Redirecting to dashboard...</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Document Info */}
          <Card>
            <CardHeader>
              <CardTitle>Document Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Document Type:</span>
                <span className="font-medium">Order Document</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Generated:</span>
                <span className="font-medium">{new Date().toLocaleDateString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Valid Until:</span>
                <span className="font-medium">
                  {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Value:</span>
                <span className="font-medium">{formatCurrency(grandTotal)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
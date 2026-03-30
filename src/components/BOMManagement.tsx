import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit,
  Calculator,
  FileText,
} from "lucide-react";
import { Textarea } from "./ui/textarea";

interface BOMItem {
  id: string;
  category:
    | "Network"
    | "Compute"
    | "PAAS"
    | "Storage"
    | "Security";
  sku: string;
  name: string;
  specifications: string;
  quantity: number;
  otc: number;
  arc: number;
  billingPattern: string;
  warrantyClause: string;
  noticePeriod: string;
}

const mockBOMItems: BOMItem[] = [
  {
    id: "1",
    category: "Compute",
    sku: "VM-STANDARD-D4",
    name: "Virtual Machine - Standard D4",
    specifications: "4 vCPUs, 16GB RAM, 100GB SSD",
    quantity: 10,
    otc: 5000,
    arc: 12000,
    billingPattern: "Monthly",
    warrantyClause: "99.9% SLA",
    noticePeriod: "30 days",
  },
  {
    id: "2",
    category: "Storage",
    sku: "BLOCK-STORAGE-SSD",
    name: "Block Storage SSD",
    specifications: "1TB SSD, 10000 IOPS",
    quantity: 200,
    otc: 0,
    arc: 400,
    billingPattern: "Monthly",
    warrantyClause: "99.99% availability",
    noticePeriod: "7 days",
  },
  {
    id: "3",
    category: "Network",
    sku: "LOAD-BALANCER-APP",
    name: "Application Load Balancer",
    specifications: "Layer 7, SSL termination, Health checks",
    quantity: 2,
    otc: 2000,
    arc: 8000,
    billingPattern: "Monthly",
    warrantyClause: "99.95% uptime",
    noticePeriod: "30 days",
  },
  {
    id: "4",
    category: "Security",
    sku: "WAF-ENTERPRISE",
    name: "Web Application Firewall",
    specifications:
      "DDoS protection, Custom rules, 24/7 monitoring",
    quantity: 1,
    otc: 5000,
    arc: 25000,
    billingPattern: "Monthly",
    warrantyClause: "Enterprise support",
    noticePeriod: "60 days",
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function BOMManagement() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [bomItems, setBomItems] =
    useState<BOMItem[]>(mockBOMItems);
  const [editingItem, setEditingItem] = useState<string | null>(
    null,
  );
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [billingTerms, setBillingTerms] = useState({
    general: "Standard billing terms apply",
    network: "Network services billed monthly in advance",
    compute: "Compute resources billed monthly in arrears",
    storage: "Storage billed based on actual usage",
    security: "Security services billed quarterly in advance",
  });

  const updateQuantity = (itemId: string, quantity: number) => {
    setBomItems(
      bomItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(0, quantity) }
          : item,
      ),
    );
  };

  const updatePricing = (
    itemId: string,
    field: "otc" | "arc",
    value: number,
  ) => {
    setBomItems(
      bomItems.map((item) =>
        item.id === itemId
          ? { ...item, [field]: Math.max(0, value) }
          : item,
      ),
    );
  };

  const removeItem = (itemId: string) => {
    setBomItems(bomItems.filter((item) => item.id !== itemId));
  };

  const getTotalOTC = () => {
    return bomItems.reduce(
      (total, item) => total + item.otc * item.quantity,
      0,
    );
  };

  const getTotalARC = () => {
    return bomItems.reduce(
      (total, item) => total + item.arc * item.quantity,
      0,
    );
  };

  const getCategoryTotal = (category: string) => {
    const categoryItems = bomItems.filter(
      (item) => item.category === category,
    );
    return {
      otc: categoryItems.reduce(
        (total, item) => total + item.otc * item.quantity,
        0,
      ),
      arc: categoryItems.reduce(
        (total, item) => total + item.arc * item.quantity,
        0,
      ),
    };
  };

  const categories = [
    "Network",
    "Compute",
    "PAAS",
    "Storage",
    "Security",
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate(`/solution-editor/${id}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Solution Editor
          </Button>
          <div>
            <h1>BOM Management</h1>
            <p className="text-gray-600">
              Manage Bill of Materials and configure pricing
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowAddProduct(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product from catalogue
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              Total OTC
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(getTotalOTC())}
            </div>
            <p className="text-sm text-gray-600">
              One-time costs
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              Monthly ARC
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(getTotalARC())}
            </div>
            <p className="text-sm text-gray-600">
              Recurring monthly costs
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              Annual Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                getTotalOTC() + getTotalARC() * 12,
              )}
            </div>
            <p className="text-sm text-gray-600">
              Total cost year 1
            </p>
          </CardContent>
        </Card>
      </div>

      {/* BOM Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Bill of Materials</CardTitle>
          <CardDescription>
            Configure products, quantities, and pricing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Specifications</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>OTC (₹)</TableHead>
                <TableHead>ARC (₹)</TableHead>
                <TableHead>Total (₹)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bomItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Badge variant="outline">
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {item.sku}
                  </TableCell>
                  <TableCell className="font-medium">
                    {item.name}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {item.specifications}
                  </TableCell>
                  <TableCell>
                    {editingItem === item.id ? (
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            item.id,
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="w-20"
                      />
                    ) : (
                      <span>{item.quantity}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingItem === item.id ? (
                      <Input
                        type="number"
                        value={item.otc}
                        onChange={(e) =>
                          updatePricing(
                            item.id,
                            "otc",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="w-24"
                      />
                    ) : (
                      formatCurrency(item.otc)
                    )}
                  </TableCell>
                  <TableCell>
                    {editingItem === item.id ? (
                      <Input
                        type="number"
                        value={item.arc}
                        onChange={(e) =>
                          updatePricing(
                            item.id,
                            "arc",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="w-24"
                      />
                    ) : (
                      formatCurrency(item.arc)
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(
                      (item.otc + item.arc * 12) *
                        item.quantity,
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setEditingItem(
                            editingItem === item.id
                              ? null
                              : item.id,
                          )
                        }
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Category Totals */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Category-wise Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {categories.map((category) => {
              const total = getCategoryTotal(category);
              return (
                <div
                  key={category}
                  className="p-3 border rounded-lg"
                >
                  <div className="font-medium text-sm mb-1">
                    {category}
                  </div>
                  <div className="text-xs text-gray-600">
                    OTC: {formatCurrency(total.otc)}
                  </div>
                  <div className="text-xs text-gray-600">
                    ARC: {formatCurrency(total.arc)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Billing Terms */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Terms & Conditions</CardTitle>
          <CardDescription>
            Configure billing terms by category and organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">
              General Terms
            </label>
            <Textarea
              value={billingTerms.general}
              onChange={(e) =>
                setBillingTerms({
                  ...billingTerms,
                  general: e.target.value,
                })
              }
              className="mt-1"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(billingTerms)
              .filter(([key]) => key !== "general")
              .map(([category, terms]) => (
                <div key={category}>
                  <label className="text-sm font-medium capitalize">
                    {category}
                  </label>
                  <Textarea
                    value={terms}
                    onChange={(e) =>
                      setBillingTerms({
                        ...billingTerms,
                        [category]: e.target.value,
                      })
                    }
                    className="mt-1"
                    rows={2}
                  />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button onClick={() => navigate(`/pricing/${id}`)}>
          Submit to Account Manager
        </Button>
      </div>
    </div>
  );
}
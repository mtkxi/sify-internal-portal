import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Trash2, Settings } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { VASConfig } from './VASConfigSheet';

interface FIDInfo {
  fid: string;
  location: string;
  hasVAS: boolean;
}

interface BulkVASConfigSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFIDs: FIDInfo[];
  onSave: (selectedFIDs: string[], config: VASConfig) => void;
}

const DEVICE_TYPES = [
  { value: 'firewall', label: 'Firewall' },
  { value: 'router', label: 'Router' },
  { value: 'switch', label: 'Switch' }
];

const PRODUCT_CODES = {
  firewall: [
    { value: 'FW-CISCO-ASA5506', label: 'Cisco ASA 5506-X' },
    { value: 'FW-FORTINET-FG60E', label: 'FortiGate 60E' },
    { value: 'FW-PALO-PA220', label: 'Palo Alto PA-220' },
    { value: 'FW-CHECKPOINT-1530', label: 'Check Point 1530' },
    { value: 'FW-SOPHOS-XG125', label: 'Sophos XG 125' }
  ],
  router: [
    { value: 'RT-CISCO-ISR4321', label: 'Cisco ISR 4321' },
    { value: 'RT-JUNIPER-SRX300', label: 'Juniper SRX300' },
    { value: 'RT-MIKROTIK-CCR1036', label: 'MikroTik CCR1036' },
    { value: 'RT-HUAWEI-NE40E', label: 'Huawei NE40E-X3' },
    { value: 'RT-ARISTA-7050', label: 'Arista 7050SX3' }
  ],
  switch: [
    { value: 'SW-CISCO-C9300', label: 'Cisco Catalyst 9300' },
    { value: 'SW-JUNIPER-EX4300', label: 'Juniper EX4300' },
    { value: 'SW-ARUBA-2930F', label: 'Aruba 2930F' },
    { value: 'SW-HP-5130', label: 'HPE FlexFabric 5130' },
    { value: 'SW-DELL-S4148', label: 'Dell EMC S4148' }
  ]
};

// Quick templates
const QUICK_TEMPLATES = [
  {
    id: 'router-managed',
    name: 'Router + Managed Services',
    description: 'Own router with configuration management',
    icon: '🔧',
    config: {
      deviceOwnership: 'own' as const,
      devices: [{ type: 'router', count: 1 }],
      deviceManagement: 'configuration' as const
    }
  },
  {
    id: 'router-buy-managed',
    name: 'Buy Router + Managed',
    description: 'Purchase router with managed services',
    icon: '🛒',
    config: {
      deviceOwnership: 'buy' as const,
      serviceVariant: 'bundled' as const,
      devices: [{ type: 'router', count: 1 }],
      managedService: true
    }
  },
  {
    id: 'firewall-managed',
    name: 'Firewall + Managed Services',
    description: 'Own firewall with full management',
    icon: '🛡️',
    config: {
      deviceOwnership: 'own' as const,
      devices: [{ type: 'firewall', count: 1 }],
      deviceManagement: 'configuration-hardware' as const
    }
  }
];

export function BulkVASConfigSheet({ open, onOpenChange, selectedFIDs, onSave }: BulkVASConfigSheetProps) {
  const [deviceOwnership, setDeviceOwnership] = useState<'own' | 'buy' | ''>('');
  const [serviceVariant, setServiceVariant] = useState<'bundled' | 'select-model'>('bundled');
  const [devices, setDevices] = useState<Array<{ type: string; count: number; productCode?: string }>>([]);
  const [managedService, setManagedService] = useState(false);
  const [deviceManagement, setDeviceManagement] = useState<'configuration' | 'configuration-hardware'>('configuration');

  const handleApplyTemplate = (templateId: string) => {
    const template = QUICK_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    setDeviceOwnership(template.config.deviceOwnership);
    setDevices(template.config.devices || []);
    
    if (template.config.deviceOwnership === 'own') {
      setDeviceManagement(template.config.deviceManagement || 'configuration');
    } else {
      setServiceVariant(template.config.serviceVariant || 'bundled');
      setManagedService(template.config.managedService || false);
    }

    toast.success(`Applied template: ${template.name}`);
  };

  const handleAddDevice = (type: string) => {
    const existing = devices.find(d => d.type === type);
    if (existing) {
      toast.error(`${type.charAt(0).toUpperCase() + type.slice(1)} already added`);
      return;
    }
    setDevices([...devices, { type, count: 1, productCode: '' }]);
  };

  const handleRemoveDevice = (type: string) => {
    setDevices(devices.filter(d => d.type !== type));
  };

  const handleUpdateDeviceCount = (type: string, count: number) => {
    setDevices(devices.map(d => 
      d.type === type ? { ...d, count: Math.max(1, count) } : d
    ));
  };

  const handleUpdateProductCode = (type: string, productCode: string) => {
    setDevices(devices.map(d => 
      d.type === type ? { ...d, productCode } : d
    ));
  };

  const handleSave = () => {
    if (selectedFIDs.length === 0) {
      toast.error('Please select at least one FID');
      return;
    }

    if (!deviceOwnership) {
      toast.error('Please select device ownership');
      return;
    }

    if (devices.length === 0) {
      toast.error('Please add at least one device');
      return;
    }

    // Validate product codes for select-model
    if (deviceOwnership === 'buy' && serviceVariant === 'select-model') {
      const missingCodes = devices.filter(d => !d.productCode || d.productCode.trim() === '');
      if (missingCodes.length > 0) {
        toast.error('Please enter product codes for all devices');
        return;
      }
    }

    const config: VASConfig = {
      fid: '', // Will be set individually for each FID
      deviceOwnership,
      ...(deviceOwnership === 'buy' && {
        serviceVariant,
        devices,
        managedService
      }),
      ...(deviceOwnership === 'own' && {
        devices,
        deviceManagement
      })
    };

    onSave(selectedFIDs.map(f => f.fid), config);
    toast.success(`VAS configuration applied to ${selectedFIDs.length} FID(s)`);
    
    // Reset
    setDeviceOwnership('');
    setDevices([]);
    setManagedService(false);
    setDeviceManagement('configuration');
    
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[700px] sm:max-w-[700px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl">Bulk VAS Configuration</SheetTitle>
          <SheetDescription className="text-sm">
            Configure Value-Added Services for multiple FIDs at once
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-8 px-6">
          {/* Selected FIDs Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-blue-900">Configuring VAS for {selectedFIDs.length} FID{selectedFIDs.length !== 1 ? 's' : ''}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedFIDs.slice(0, 5).map(({ fid, hasVAS }) => (
                    <Badge key={fid} variant="outline" className="bg-white text-blue-700 border-blue-300">
                      {fid}
                      {hasVAS && <span className="ml-1 text-green-600">✓</span>}
                    </Badge>
                  ))}
                  {selectedFIDs.length > 5 && (
                    <Badge variant="outline" className="bg-white text-gray-600 border-gray-300">
                      +{selectedFIDs.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Device Ownership */}
          <div className="space-y-4 px-1">
            <Label className="text-base font-semibold text-gray-900">Device Ownership</Label>
            <RadioGroup value={deviceOwnership} onValueChange={(value: 'own' | 'buy') => {
              setDeviceOwnership(value);
              setDevices([]);
            }}>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <RadioGroupItem value="own" id="bulk-own" className="h-5 w-5" />
                  <Label htmlFor="bulk-own" className="cursor-pointer flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-base font-medium text-gray-900">Own Device</span>
                        <p className="text-sm text-gray-600 mt-0.5">Add Managed Services</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-green-300">Managed</Badge>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <RadioGroupItem value="buy" id="bulk-buy" className="h-5 w-5" />
                  <Label htmlFor="bulk-buy" className="cursor-pointer flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-base font-medium text-gray-900">Buy Device</span>
                        <p className="text-sm text-gray-600 mt-0.5">Purchase New Equipment</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700 border-blue-300">New Purchase</Badge>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Configuration */}
          {deviceOwnership && (
            <>
              {/* Device Selection */}
              <div className="space-y-3 px-1">
                <Label className="text-sm font-medium text-gray-900">Type of Device</Label>
                <div className="flex flex-wrap gap-2">
                  {DEVICE_TYPES.map(({ value, label }) => (
                    <Button
                      key={value}
                      type="button"
                      variant={devices.some(d => d.type === value) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleAddDevice(value)}
                      disabled={devices.some(d => d.type === value)}
                      className="text-sm h-9"
                    >
                      <Plus className="w-4 h-4 mr-1.5" />
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Selected Devices */}
              {devices.length > 0 && (
                <div className="space-y-3 px-1">
                  <Label className="text-sm font-medium text-gray-900">Selected Devices</Label>
                  {devices.map(device => (
                    <div key={device.type} className="p-4 bg-white border-2 rounded-lg shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="capitalize text-sm py-1 px-3">{device.type}</Badge>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveDevice(device.type)}
                          className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Count</Label>
                        <Input
                          type="number"
                          min="1"
                          value={device.count}
                          onChange={(e) => handleUpdateDeviceCount(device.type, parseInt(e.target.value) || 1)}
                          className="h-9 w-20"
                        />
                      </div>

                      {deviceOwnership === 'buy' && serviceVariant === 'select-model' && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">Product Code</Label>
                          <Select
                            value={device.productCode || ''}
                            onValueChange={(value) => handleUpdateProductCode(device.type, value)}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select model" />
                            </SelectTrigger>
                            <SelectContent>
                              {PRODUCT_CODES[device.type as keyof typeof PRODUCT_CODES].map(({ value, label }) => (
                                <SelectItem key={value} value={value}>{label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Additional Options */}
              {deviceOwnership === 'own' && (
                <div className="space-y-3 px-1">
                  <Label className="text-sm font-medium text-gray-900">Device Management</Label>
                  <RadioGroup value={deviceManagement} onValueChange={(value: 'configuration' | 'configuration-hardware') => setDeviceManagement(value)}>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 p-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer">
                        <RadioGroupItem value="configuration" id="bulk-config" className="h-4 w-4" />
                        <Label htmlFor="bulk-config" className="cursor-pointer flex-1 text-sm">Configuration Management</Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer">
                        <RadioGroupItem value="configuration-hardware" id="bulk-config-hw" className="h-4 w-4" />
                        <Label htmlFor="bulk-config-hw" className="cursor-pointer flex-1 text-sm">Configuration & Hardware Management</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {deviceOwnership === 'buy' && (
                <>
                  <div className="space-y-3 px-1">
                    <Label className="text-sm font-medium text-gray-900">Service Variant</Label>
                    <RadioGroup value={serviceVariant} onValueChange={(value: 'bundled' | 'select-model') => setServiceVariant(value)}>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3 p-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer">
                          <RadioGroupItem value="bundled" id="bulk-bundled" className="h-4 w-4" />
                          <Label htmlFor="bulk-bundled" className="cursor-pointer flex-1 text-sm">Bundled Package</Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer">
                          <RadioGroupItem value="select-model" id="bulk-select-model" className="h-4 w-4" />
                          <Label htmlFor="bulk-select-model" className="cursor-pointer flex-1 text-sm">Select Specific Model</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border-2 border-dashed rounded-lg bg-white">
                    <Checkbox
                      id="bulk-managed-service"
                      checked={managedService}
                      onCheckedChange={(checked) => setManagedService(checked as boolean)}
                      className="h-5 w-5"
                    />
                    <Label htmlFor="bulk-managed-service" className="cursor-pointer flex-1">
                      <span className="text-sm font-medium text-gray-900">Enable Managed Service</span>
                      <p className="text-xs text-gray-600 mt-0.5">Include ongoing management and support</p>
                    </Label>
                  </div>
                </>
              )}
            </>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t">
            <p className="text-sm text-gray-600">
              Applying to <strong>{selectedFIDs.length}</strong> FID(s)
            </p>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                className="bg-slate-800 hover:bg-slate-900"
                disabled={selectedFIDs.length === 0 || !deviceOwnership || devices.length === 0}
              >
                Apply to {selectedFIDs.length} FID(s)
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
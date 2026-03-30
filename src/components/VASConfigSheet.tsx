import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { X, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface DeviceConfig {
  type: string;
  count: number;
  productCode?: string;
}

export interface VASConfig {
  fid: string;
  deviceOwnership: 'own' | 'buy' | '';
  serviceVariant?: 'bundled' | 'select-model';
  devices?: DeviceConfig[];
  managedService?: boolean;
  deviceManagement?: 'configuration' | 'configuration-hardware';
}

interface VASConfigSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fid: string;
  location: string;
  initialConfig?: VASConfig;
  onSave: (config: VASConfig) => void;
}

const DEVICE_TYPES = [
  { value: 'firewall', label: 'Firewall' },
  { value: 'router', label: 'Router' },
  { value: 'switch', label: 'Switch' }
];

// Product codes by device type
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

export function VASConfigSheet({ open, onOpenChange, fid, location, initialConfig, onSave }: VASConfigSheetProps) {
  const [deviceOwnership, setDeviceOwnership] = useState<'own' | 'buy' | ''>(initialConfig?.deviceOwnership || '');
  const [serviceVariant, setServiceVariant] = useState<'bundled' | 'select-model'>(initialConfig?.serviceVariant || 'bundled');
  const [devices, setDevices] = useState<DeviceConfig[]>(initialConfig?.devices || []);
  const [managedService, setManagedService] = useState(initialConfig?.managedService || false);
  const [deviceManagement, setDeviceManagement] = useState<'configuration' | 'configuration-hardware'>(
    initialConfig?.deviceManagement || 'configuration'
  );

  // Reset state when FID changes
  useEffect(() => {
    if (initialConfig) {
      setDeviceOwnership(initialConfig.deviceOwnership);
      setServiceVariant(initialConfig.serviceVariant || 'bundled');
      setDevices(initialConfig.devices || []);
      setManagedService(initialConfig.managedService || false);
      setDeviceManagement(initialConfig.deviceManagement || 'configuration');
    } else {
      setDeviceOwnership('');
      setServiceVariant('bundled');
      setDevices([]);
      setManagedService(false);
      setDeviceManagement('configuration');
    }
  }, [fid, initialConfig]);

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
      fid,
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

    onSave(config);
    toast.success('VAS configuration saved successfully');
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[650px] sm:max-w-[650px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl">VAS Configuration</SheetTitle>
          <SheetDescription className="text-sm">
            Configure Value-Added Services for {fid}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-8 px-6">
          {/* FID Info */}
          <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">FID</span>
                <Badge variant="outline" className="text-blue-600 font-medium px-3 py-1">{fid}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Location</span>
                <span className="text-sm text-gray-900 font-medium max-w-[400px] text-right">{location}</span>
              </div>
            </div>
          </div>

          {/* Device Ownership */}
          <div className="space-y-4 px-1">
            <div>
              <Label className="text-base font-semibold text-gray-900">Devices and Managed Services</Label>
              <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">
                Select <strong className="text-gray-900">Own Device</strong> to add managed services to your existing devices, or <strong className="text-gray-900">Buy Device</strong> to purchase new devices with optional managed services.
              </p>
            </div>
            <RadioGroup value={deviceOwnership} onValueChange={(value: 'own' | 'buy') => {
              setDeviceOwnership(value);
              setDevices([]); // Reset devices when changing ownership
            }}>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <RadioGroupItem value="own" id="own" className="h-5 w-5" />
                  <Label htmlFor="own" className="cursor-pointer flex-1">
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
                  <RadioGroupItem value="buy" id="buy" className="h-5 w-5" />
                  <Label htmlFor="buy" className="cursor-pointer flex-1">
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

          {/* Buy Device Options */}
          {deviceOwnership === 'buy' && (
            <div className="space-y-5 p-5 border-2 rounded-lg bg-gradient-to-br from-blue-50/50 to-blue-100/30">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Device Purchase Configuration</h3>
                <Badge className="bg-blue-600 text-white">Buy New</Badge>
              </div>
              
              {/* Service Variant */}
              <div className="space-y-3 px-1">
                <Label className="text-sm font-medium text-gray-900">Service Variant</Label>
                <RadioGroup value={serviceVariant} onValueChange={(value: 'bundled' | 'select-model') => setServiceVariant(value)}>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 p-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer">
                      <RadioGroupItem value="bundled" id="bundled" className="h-4 w-4" />
                      <Label htmlFor="bundled" className="cursor-pointer flex-1 text-sm">Bundled Package</Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer">
                      <RadioGroupItem value="select-model" id="select-model" className="h-4 w-4" />
                      <Label htmlFor="select-model" className="cursor-pointer flex-1 text-sm">Select Specific Model</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

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
                      
                      <div className="grid grid-cols-2 gap-4">
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
                        
                        {serviceVariant === 'select-model' && (
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
                    </div>
                  ))}
                </div>
              )}

              {/* Managed Service */}
              <div className="flex items-center space-x-3 p-4 border-2 border-dashed rounded-lg bg-white">
                <Checkbox
                  id="managed-service"
                  checked={managedService}
                  onCheckedChange={(checked) => setManagedService(checked as boolean)}
                  className="h-5 w-5"
                />
                <Label htmlFor="managed-service" className="cursor-pointer flex-1">
                  <span className="text-sm font-medium text-gray-900">Enable Managed Service</span>
                  <p className="text-xs text-gray-600 mt-0.5">Include ongoing management and support</p>
                </Label>
              </div>
            </div>
          )}

          {/* Own Device Options */}
          {deviceOwnership === 'own' && (
            <div className="space-y-5 p-5 border-2 rounded-lg bg-gradient-to-br from-green-50/50 to-green-100/30">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Managed Services Configuration</h3>
                <Badge className="bg-green-600 text-white">Own Device</Badge>
              </div>
              
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
                    </div>
                  ))}
                </div>
              )}

              {/* Device Management */}
              <div className="space-y-3 px-1">
                <Label className="text-sm font-medium text-gray-900">Device Management</Label>
                <RadioGroup value={deviceManagement} onValueChange={(value: 'configuration' | 'configuration-hardware') => setDeviceManagement(value)}>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 p-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer">
                      <RadioGroupItem value="configuration" id="configuration" className="h-4 w-4" />
                      <Label htmlFor="configuration" className="cursor-pointer flex-1 text-sm">Configuration Management</Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer">
                      <RadioGroupItem value="configuration-hardware" id="configuration-hardware" className="h-4 w-4" />
                      <Label htmlFor="configuration-hardware" className="cursor-pointer flex-1 text-sm">Configuration & Hardware Management</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
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
              disabled={!deviceOwnership || devices.length === 0}
            >
              Save Configuration
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
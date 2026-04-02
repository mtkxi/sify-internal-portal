import React from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { INDIAN_STATES, INDIAN_CITIES } from '../constants/indiaLocations';
import { SIFY_DATA_CENTERS, CONNECTED_DATA_CENTERS, CONNECTED_BUILDINGS } from '../constants/datacenters';
import { CustomLocationFields } from './CustomLocationFields';
import { MapPin } from 'lucide-react';

interface Connection {
  addressType?: 'Sify DC' | 'Connected DC' | 'Connected Building' | 'Custom Location';
  dcName?: string;
  connectedDCName?: string;
  buildingName?: string;
  rackDetails?: string;
  floorDetails?: string;
  blockTowerDetails?: string;
  state: string;
  city: string;
  pinCode: string;
  latitude?: string;
  longitude?: string;
  addressLine1: string;
  addressLine2: string;
  branchCode?: string;
}

interface Step2AddressFieldsProps {
  currentConnection: Partial<Connection>;
  setCurrentConnection: (conn: Partial<Connection>) => void;
  showMap?: boolean;
  setShowMap?: (show: boolean) => void;
  handleMapClick?: (lat: number, lng: number) => void;
}

export function Step2AddressFields({ 
  currentConnection, 
  setCurrentConnection,
  showMap = false,
  setShowMap = () => {},
  handleMapClick = () => {}
}: Step2AddressFieldsProps) {
  return (
    <>
      {/* Sify DC Address Fields */}
      {currentConnection.addressType === 'Sify DC' && (
        <div>
          <div>
            <Label>State *</Label>
            <Select
              value={currentConnection.state}
              onValueChange={(val) => setCurrentConnection({...currentConnection, state: val})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {INDIAN_STATES.map((state) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>City *</Label>
            <Select
              value={currentConnection.city}
              onValueChange={(val) => setCurrentConnection({...currentConnection, city: val})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {INDIAN_CITIES.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Data Centre *</Label>
            <Select
              value={currentConnection.dcName}
              onValueChange={(val) => {
                const selectedDC = SIFY_DATA_CENTERS.find(dc => dc.name === val);
                setCurrentConnection({
                  ...currentConnection,
                  dcName: val,
                  pinCode: selectedDC?.pinCode || '',
                  latitude: selectedDC?.latitude || '',
                  longitude: selectedDC?.longitude || ''
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select data centre" />
              </SelectTrigger>
              <SelectContent>
                {SIFY_DATA_CENTERS.map((dc) => (
                  <SelectItem key={dc.name} value={dc.name}>{dc.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Rack, Floor, Block/Tower Details for Sify DC */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Rack Details</Label>
              <Input
                placeholder="e.g., Rack 12"
                value={currentConnection.rackDetails || ''}
                onChange={(e) => setCurrentConnection({...currentConnection, rackDetails: e.target.value})}
              />
            </div>
            <div>
              <Label>Floor Details</Label>
              <Input
                placeholder="e.g., Floor 3"
                value={currentConnection.floorDetails || ''}
                onChange={(e) => setCurrentConnection({...currentConnection, floorDetails: e.target.value})}
              />
            </div>
            <div>
              <Label>Block/Tower Details</Label>
              <Input
                placeholder="e.g., Block A"
                value={currentConnection.blockTowerDetails || ''}
                onChange={(e) => setCurrentConnection({...currentConnection, blockTowerDetails: e.target.value})}
              />
            </div>
          </div>
          {currentConnection.dcName && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-xs text-gray-600">Pin Code</Label>
                <Input
                  placeholder="Pin Code"
                  value={currentConnection.pinCode}
                  onChange={(e) => setCurrentConnection({...currentConnection, pinCode: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Latitude</Label>
                <Input
                  placeholder="e.g., 19.0760"
                  value={currentConnection.latitude}
                  onChange={(e) => setCurrentConnection({...currentConnection, latitude: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Longitude</Label>
                <Input
                  placeholder="e.g., 72.8777"
                  value={currentConnection.longitude}
                  onChange={(e) => setCurrentConnection({...currentConnection, longitude: e.target.value})}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {/* Address Summary Box - Shows when all fields are filled */}
          {currentConnection.state && 
           currentConnection.city && 
           currentConnection.dcName && 
           currentConnection.rackDetails && 
           currentConnection.floorDetails && 
           currentConnection.pinCode && 
           currentConnection.latitude && 
           currentConnection.longitude && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-2 flex-1">
                  <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Address</div>
                    <div className="text-sm text-gray-900">
                      {currentConnection.rackDetails}, {currentConnection.floorDetails}{currentConnection.blockTowerDetails ? `, ${currentConnection.blockTowerDetails}` : ''}, {currentConnection.dcName}, {currentConnection.city}, {currentConnection.state}, {currentConnection.pinCode}.
                    </div>
                  </div>
                </div>
                <div className="flex gap-6 flex-shrink-0">
                  <div>
                    <div className="text-xs text-blue-600 mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Latitude
                    </div>
                    <div className="text-sm text-gray-900">{currentConnection.latitude}</div>
                  </div>
                  <div>
                    <div className="text-xs text-blue-600 mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Longitude
                    </div>
                    <div className="text-sm text-gray-900">{currentConnection.longitude}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Connected DC Address Fields */}
      {currentConnection.addressType === 'Connected DC' && (
        <div>
          <div>
            <Label>State *</Label>
            <Select
              value={currentConnection.state}
              onValueChange={(val) => setCurrentConnection({...currentConnection, state: val})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {INDIAN_STATES.map((state) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>City *</Label>
            <Select
              value={currentConnection.city}
              onValueChange={(val) => setCurrentConnection({...currentConnection, city: val})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {INDIAN_CITIES.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Connected DC Name and Building Name in one row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Connected DC Name *</Label>
              <Select
                value={currentConnection.connectedDCName}
                onValueChange={(val) => {
                  const selectedDC = CONNECTED_DATA_CENTERS.find(dc => dc.name === val);
                  setCurrentConnection({
                    ...currentConnection,
                    connectedDCName: val,
                    pinCode: selectedDC?.pinCode || '',
                    latitude: selectedDC?.latitude || '',
                    longitude: selectedDC?.longitude || ''
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select connected DC" />
                </SelectTrigger>
                <SelectContent>
                  {CONNECTED_DATA_CENTERS.map((dc) => (
                    <SelectItem key={dc.name} value={dc.name}>{dc.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Building Name *</Label>
              <Input
                placeholder="Enter building name"
                value={currentConnection.buildingName || ''}
                onChange={(e) => setCurrentConnection({...currentConnection, buildingName: e.target.value})}
              />
            </div>
          </div>
          {/* Rack, Floor, Block/Tower Details for Connected DC */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Rack Details</Label>
              <Input
                placeholder="e.g., Rack 12"
                value={currentConnection.rackDetails || ''}
                onChange={(e) => setCurrentConnection({...currentConnection, rackDetails: e.target.value})}
              />
            </div>
            <div>
              <Label>Floor Details</Label>
              <Input
                placeholder="e.g., Floor 3"
                value={currentConnection.floorDetails || ''}
                onChange={(e) => setCurrentConnection({...currentConnection, floorDetails: e.target.value})}
              />
            </div>
            <div>
              <Label>Block/Tower Details</Label>
              <Input
                placeholder="e.g., Block A"
                value={currentConnection.blockTowerDetails || ''}
                onChange={(e) => setCurrentConnection({...currentConnection, blockTowerDetails: e.target.value})}
              />
            </div>
          </div>
          {currentConnection.connectedDCName && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-xs text-gray-600">Pin Code</Label>
                <Input
                  placeholder="Pin Code"
                  value={currentConnection.pinCode}
                  onChange={(e) => setCurrentConnection({...currentConnection, pinCode: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Latitude</Label>
                <Input
                  placeholder="e.g., 19.0760"
                  value={currentConnection.latitude}
                  onChange={(e) => setCurrentConnection({...currentConnection, latitude: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Longitude</Label>
                <Input
                  placeholder="e.g., 72.8777"
                  value={currentConnection.longitude}
                  onChange={(e) => setCurrentConnection({...currentConnection, longitude: e.target.value})}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {/* Address Summary Box - Shows when all fields are filled */}
          {currentConnection.state && 
           currentConnection.city && 
           currentConnection.connectedDCName && 
           currentConnection.buildingName && 
           currentConnection.rackDetails && 
           currentConnection.floorDetails && 
           currentConnection.pinCode && 
           currentConnection.latitude && 
           currentConnection.longitude && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-2 flex-1">
                  <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Address</div>
                    <div className="text-sm text-gray-900">
                      {currentConnection.rackDetails}, {currentConnection.floorDetails}{currentConnection.blockTowerDetails ? `, ${currentConnection.blockTowerDetails}` : ''}, {currentConnection.buildingName}, {currentConnection.connectedDCName}, {currentConnection.city}, {currentConnection.state}, {currentConnection.pinCode}.
                    </div>
                  </div>
                </div>
                <div className="flex gap-6 flex-shrink-0">
                  <div>
                    <div className="text-xs text-blue-600 mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Latitude
                    </div>
                    <div className="text-sm text-gray-900">{currentConnection.latitude}</div>
                  </div>
                  <div>
                    <div className="text-xs text-blue-600 mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Longitude
                    </div>
                    <div className="text-sm text-gray-900">{currentConnection.longitude}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Connected Building Address Fields */}
      {currentConnection.addressType === 'Connected Building' && (
        <div>
          <div>
            <Label>State *</Label>
            <Select
              value={currentConnection.state}
              onValueChange={(val) => setCurrentConnection({...currentConnection, state: val})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {INDIAN_STATES.map((state) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>City *</Label>
            <Select
              value={currentConnection.city}
              onValueChange={(val) => setCurrentConnection({...currentConnection, city: val, buildingName: ''})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {CONNECTED_BUILDINGS.map((item) => (
                  <SelectItem key={item.city} value={item.city}>{item.city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {currentConnection.city && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Building Name *</Label>
                <Select
                  value={currentConnection.buildingName}
                  onValueChange={(val) => {
                    const cityData = CONNECTED_BUILDINGS.find(item => item.city === currentConnection.city);
                    const selectedBuilding = cityData?.buildings.find(b => b.name === val);
                    setCurrentConnection({
                      ...currentConnection,
                      buildingName: val,
                      pinCode: selectedBuilding?.pinCode || '',
                      latitude: selectedBuilding?.latitude || '',
                      longitude: selectedBuilding?.longitude || ''
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Search and select building" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONNECTED_BUILDINGS.find(item => item.city === currentConnection.city)?.buildings.map((building) => (
                      <SelectItem key={building.name} value={building.name}>{building.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Branch Code</Label>
                <Input
                  placeholder="Enter branch code"
                  value={currentConnection.branchCode || ''}
                  onChange={(e) => setCurrentConnection({...currentConnection, branchCode: e.target.value})}
                />
              </div>
            </div>
          )}
          {/* Rack, Floor, Block/Tower Details for Connected Building (Optional) */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Rack Details <span className="text-xs text-gray-500">(Optional)</span></Label>
              <Input
                placeholder="e.g., Rack 12"
                value={currentConnection.rackDetails || ''}
                onChange={(e) => setCurrentConnection({...currentConnection, rackDetails: e.target.value})}
              />
            </div>
            <div>
              <Label>Floor Details <span className="text-xs text-gray-500">(Optional)</span></Label>
              <Input
                placeholder="e.g., Floor 3"
                value={currentConnection.floorDetails || ''}
                onChange={(e) => setCurrentConnection({...currentConnection, floorDetails: e.target.value})}
              />
            </div>
            <div>
              <Label>Block/Tower Details <span className="text-xs text-gray-500">(Optional)</span></Label>
              <Input
                placeholder="e.g., Block A"
                value={currentConnection.blockTowerDetails || ''}
                onChange={(e) => setCurrentConnection({...currentConnection, blockTowerDetails: e.target.value})}
              />
            </div>
          </div>
          {currentConnection.buildingName && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-xs text-gray-600">Pin Code</Label>
                <Input
                  placeholder="Pin Code"
                  value={currentConnection.pinCode}
                  onChange={(e) => setCurrentConnection({...currentConnection, pinCode: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Latitude</Label>
                <Input
                  placeholder="e.g., 19.0760"
                  value={currentConnection.latitude}
                  onChange={(e) => setCurrentConnection({...currentConnection, latitude: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Longitude</Label>
                <Input
                  placeholder="e.g., 72.8777"
                  value={currentConnection.longitude}
                  onChange={(e) => setCurrentConnection({...currentConnection, longitude: e.target.value})}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {/* Address Summary Box - Shows when all required fields are filled */}
          {currentConnection.state && 
           currentConnection.city && 
           currentConnection.buildingName && 
           currentConnection.pinCode && 
           currentConnection.latitude && 
           currentConnection.longitude && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-2 flex-1">
                  <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Address</div>
                    <div className="text-sm text-gray-900">
                      {currentConnection.rackDetails && `${currentConnection.rackDetails}, `}
                      {currentConnection.floorDetails && `${currentConnection.floorDetails}, `}
                      {currentConnection.blockTowerDetails && `${currentConnection.blockTowerDetails}, `}
                      {currentConnection.buildingName}, {currentConnection.city}, {currentConnection.state}, {currentConnection.pinCode}.
                    </div>
                  </div>
                </div>
                <div className="flex gap-6 flex-shrink-0">
                  <div>
                    <div className="text-xs text-blue-600 mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Latitude
                    </div>
                    <div className="text-sm text-gray-900">{currentConnection.latitude}</div>
                  </div>
                  <div>
                    <div className="text-xs text-blue-600 mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Longitude
                    </div>
                    <div className="text-sm text-gray-900">{currentConnection.longitude}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Custom Location Address Fields */}
      {currentConnection.addressType === 'Custom Location' && (
        <CustomLocationFields 
          currentConnection={currentConnection}
          setCurrentConnection={setCurrentConnection}
          showMap={showMap}
          setShowMap={setShowMap}
          handleMapClick={handleMapClick}
        />
      )}
    </>
  );
}
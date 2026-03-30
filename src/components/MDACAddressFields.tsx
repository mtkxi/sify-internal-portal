import React from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { INDIAN_STATES, INDIAN_CITIES } from '../constants/indiaLocations';
import { SIFY_DATA_CENTERS, CONNECTED_DATA_CENTERS, CONNECTED_BUILDINGS } from '../constants/datacenters';
import { MDACCustomLocationFields } from './MDACCustomLocationFields';

interface MDACAddressFieldsProps {
  modifyAddressType: string;
  modifyState: string;
  modifyCity: string;
  modifyDCName: string;
  modifyConnectedDCName: string;
  modifyBuildingName: string;
  modifyRackDetails: string;
  modifyFloorDetails: string;
  modifyBlockTowerDetails: string;
  modifyPinCode: string;
  modifyLatitude: string;
  modifyLongitude: string;
  setModifyState: (value: string) => void;
  setModifyCity: (value: string) => void;
  setModifyDCName: (value: string) => void;
  setModifyConnectedDCName: (value: string) => void;
  setModifyBuildingName: (value: string) => void;
  setModifyRackDetails: (value: string) => void;
  setModifyFloorDetails: (value: string) => void;
  setModifyBlockTowerDetails: (value: string) => void;
  setModifyPinCode: (value: string) => void;
  setModifyLatitude: (value: string) => void;
  setModifyLongitude: (value: string) => void;
  modifyAddressLine1?: string;
  modifyAddressLine2?: string;
  setModifyAddressLine1?: (value: string) => void;
  setModifyAddressLine2?: (value: string) => void;
  showMap?: boolean;
  setShowMap?: (show: boolean) => void;
  geocodeAddress?: (city: string, state: string, pinCode: string) => { lat: number; lng: number };
}

export function MDACAddressFields({
  modifyAddressType,
  modifyState,
  modifyCity,
  modifyDCName,
  modifyConnectedDCName,
  modifyBuildingName,
  modifyRackDetails,
  modifyFloorDetails,
  modifyBlockTowerDetails,
  modifyPinCode,
  modifyLatitude,
  modifyLongitude,
  setModifyState,
  setModifyCity,
  setModifyDCName,
  setModifyConnectedDCName,
  setModifyBuildingName,
  setModifyRackDetails,
  setModifyFloorDetails,
  setModifyBlockTowerDetails,
  setModifyPinCode,
  setModifyLatitude,
  setModifyLongitude,
  modifyAddressLine1 = '',
  modifyAddressLine2 = '',
  setModifyAddressLine1 = () => {},
  setModifyAddressLine2 = () => {},
  showMap = false,
  setShowMap = () => {},
  geocodeAddress = () => ({ lat: 19.0760, lng: 72.8777 })
}: MDACAddressFieldsProps) {
  return (
    <>
      {/* Sify DC Fields */}
      {modifyAddressType === 'Sify DC' && (
        <div className="space-y-3">
          <div>
            <Label className="text-sm text-gray-700">State *</Label>
            <Select 
              value={modifyState} 
              onValueChange={(value) => {
                setModifyState(value);
                // Reset city and DC when state changes
                setModifyCity('');
                setModifyDCName('');
              }}
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
            <Label className="text-sm text-gray-700">City *</Label>
            <Select 
              value={modifyCity} 
              onValueChange={(value) => {
                setModifyCity(value);
                // Reset DC when city changes
                setModifyDCName('');
              }}
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
            <Label className="text-sm text-gray-700">Data Centre *</Label>
            <Select value={modifyDCName} onValueChange={(value) => {
              setModifyDCName(value);
              // Auto-fill pincode, latitude, longitude from DC data
              const dc = SIFY_DATA_CENTERS.find(d => d.name === value);
              if (dc) {
                setModifyPinCode(dc.pinCode);
                setModifyLatitude(dc.latitude);
                setModifyLongitude(dc.longitude);
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select data center" />
              </SelectTrigger>
              <SelectContent>
                {SIFY_DATA_CENTERS.map((dc) => (
                  <SelectItem key={dc.name} value={dc.name}>
                    {dc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Rack, Floor, Block/Tower Details for Sify DC */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-sm text-gray-700">Rack Details *</Label>
              <Input
                placeholder="e.g., Rack 12"
                value={modifyRackDetails}
                onChange={(e) => setModifyRackDetails(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm text-gray-700">Floor Details *</Label>
              <Input
                placeholder="e.g., Floor 3"
                value={modifyFloorDetails}
                onChange={(e) => setModifyFloorDetails(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm text-gray-700">Block/Tower Details *</Label>
              <Input
                placeholder="e.g., Block A"
                value={modifyBlockTowerDetails}
                onChange={(e) => setModifyBlockTowerDetails(e.target.value)}
              />
            </div>
          </div>
          {modifyDCName && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-xs text-gray-600">Pin Code</Label>
                <Input
                  placeholder="Pin Code"
                  value={modifyPinCode}
                  onChange={(e) => setModifyPinCode(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Latitude</Label>
                <Input
                  placeholder="e.g., 19.0760"
                  value={modifyLatitude}
                  onChange={(e) => setModifyLatitude(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Longitude</Label>
                <Input
                  placeholder="e.g., 72.8777"
                  value={modifyLongitude}
                  onChange={(e) => setModifyLongitude(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Connected DC Fields */}
      {modifyAddressType === 'Connected DC' && (
        <div className="space-y-3">
          <div>
            <Label className="text-sm text-gray-700">State *</Label>
            <Select 
              value={modifyState} 
              onValueChange={(value) => {
                setModifyState(value);
                // Reset city and DC when state changes
                setModifyCity('');
                setModifyConnectedDCName('');
              }}
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
            <Label className="text-sm text-gray-700">City *</Label>
            <Select 
              value={modifyCity} 
              onValueChange={(value) => {
                setModifyCity(value);
                // Reset DC when city changes
                setModifyConnectedDCName('');
              }}
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
            <Label className="text-sm text-gray-700">Connected DC Name *</Label>
            <Select value={modifyConnectedDCName} onValueChange={(value) => {
              setModifyConnectedDCName(value);
              // Auto-fill pincode, latitude, longitude from connected DC data
              const dc = CONNECTED_DATA_CENTERS.find(d => d.name === value);
              if (dc) {
                setModifyPinCode(dc.pinCode);
                setModifyLatitude(dc.latitude);
                setModifyLongitude(dc.longitude);
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select connected data center" />
              </SelectTrigger>
              <SelectContent>
                {CONNECTED_DATA_CENTERS.map((dc) => (
                  <SelectItem key={dc.name} value={dc.name}>
                    {dc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Rack, Floor, Block/Tower Details for Connected DC */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-sm text-gray-700">Rack Details *</Label>
              <Input
                placeholder="e.g., Rack 12"
                value={modifyRackDetails}
                onChange={(e) => setModifyRackDetails(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm text-gray-700">Floor Details *</Label>
              <Input
                placeholder="e.g., Floor 3"
                value={modifyFloorDetails}
                onChange={(e) => setModifyFloorDetails(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm text-gray-700">Block/Tower Details *</Label>
              <Input
                placeholder="e.g., Block A"
                value={modifyBlockTowerDetails}
                onChange={(e) => setModifyBlockTowerDetails(e.target.value)}
              />
            </div>
          </div>
          {modifyConnectedDCName && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-xs text-gray-600">Pin Code</Label>
                <Input
                  placeholder="Pin Code"
                  value={modifyPinCode}
                  onChange={(e) => setModifyPinCode(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Latitude</Label>
                <Input
                  placeholder="e.g., 19.0760"
                  value={modifyLatitude}
                  onChange={(e) => setModifyLatitude(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Longitude</Label>
                <Input
                  placeholder="e.g., 72.8777"
                  value={modifyLongitude}
                  onChange={(e) => setModifyLongitude(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Connected Building Fields */}
      {modifyAddressType === 'Connected Building' && (
        <div className="space-y-3">
          <div>
            <Label className="text-sm text-gray-700">State *</Label>
            <Select 
              value={modifyState} 
              onValueChange={(value) => {
                setModifyState(value);
                // Reset city and building when state changes
                setModifyCity('');
                setModifyBuildingName('');
              }}
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
            <Label className="text-sm text-gray-700">City *</Label>
            <Select 
              value={modifyCity} 
              onValueChange={(value) => {
                setModifyCity(value);
                // Reset building when city changes
                setModifyBuildingName('');
              }}
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
          {modifyCity && (
            <div>
              <Label className="text-sm text-gray-700">Building *</Label>
              <Select value={modifyBuildingName} onValueChange={(value) => {
                setModifyBuildingName(value);
                // Auto-fill pincode, latitude, longitude from connected building data
                const cityData = CONNECTED_BUILDINGS.find(item => item.city === modifyCity);
                const selectedBuilding = cityData?.buildings.find(b => b.name === value);
                if (selectedBuilding) {
                  setModifyPinCode(selectedBuilding.pinCode);
                  setModifyLatitude(selectedBuilding.latitude);
                  setModifyLongitude(selectedBuilding.longitude);
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select building" />
                </SelectTrigger>
                <SelectContent>
                  {CONNECTED_BUILDINGS.find(item => item.city === modifyCity)?.buildings.map((building) => (
                    <SelectItem key={building.name} value={building.name}>
                      {building.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {/* Rack, Floor, Block/Tower Details for Connected Building (Optional) */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-sm text-gray-700">Rack Details <span className="text-xs text-gray-500">(Optional)</span></Label>
              <Input
                placeholder="e.g., Rack 12"
                value={modifyRackDetails}
                onChange={(e) => setModifyRackDetails(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm text-gray-700">Floor Details <span className="text-xs text-gray-500">(Optional)</span></Label>
              <Input
                placeholder="e.g., Floor 3"
                value={modifyFloorDetails}
                onChange={(e) => setModifyFloorDetails(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm text-gray-700">Block/Tower Details <span className="text-xs text-gray-500">(Optional)</span></Label>
              <Input
                placeholder="e.g., Block A"
                value={modifyBlockTowerDetails}
                onChange={(e) => setModifyBlockTowerDetails(e.target.value)}
              />
            </div>
          </div>
          {modifyBuildingName && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-xs text-gray-600">Pin Code</Label>
                <Input
                  placeholder="Pin Code"
                  value={modifyPinCode}
                  onChange={(e) => setModifyPinCode(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Latitude</Label>
                <Input
                  placeholder="e.g., 19.0760"
                  value={modifyLatitude}
                  onChange={(e) => setModifyLatitude(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Longitude</Label>
                <Input
                  placeholder="e.g., 72.8777"
                  value={modifyLongitude}
                  onChange={(e) => setModifyLongitude(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Custom Location Fields */}
      {modifyAddressType === 'Custom Location' && (
        <MDACCustomLocationFields
          modifyAddressLine1={modifyAddressLine1}
          modifyAddressLine2={modifyAddressLine2}
          modifyState={modifyState}
          modifyCity={modifyCity}
          modifyPinCode={modifyPinCode}
          modifyLatitude={modifyLatitude}
          modifyLongitude={modifyLongitude}
          modifyFloorDetails={modifyFloorDetails}
          modifyBlockTowerDetails={modifyBlockTowerDetails}
          setModifyAddressLine1={setModifyAddressLine1}
          setModifyAddressLine2={setModifyAddressLine2}
          setModifyState={setModifyState}
          setModifyCity={setModifyCity}
          setModifyPinCode={setModifyPinCode}
          setModifyLatitude={setModifyLatitude}
          setModifyLongitude={setModifyLongitude}
          setModifyFloorDetails={setModifyFloorDetails}
          setModifyBlockTowerDetails={setModifyBlockTowerDetails}
          showMap={showMap}
          setShowMap={setShowMap}
          geocodeAddress={geocodeAddress}
        />
      )}
    </>
  );
}
import React from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { MapPin } from 'lucide-react';
import { INDIAN_STATES, INDIAN_CITIES } from '../constants/indiaLocations';

interface Connection {
  addressLine1: string;
  addressLine2: string;
  state: string;
  city: string;
  pinCode: string;
  latitude?: string;
  longitude?: string;
  floorDetails?: string;
  blockTowerDetails?: string;
  buildingName?: string;
  branchCode?: string;
  buildingHeight?: string;
  terraceType?: string;
}

interface CustomLocationFieldsProps {
  currentConnection: Partial<Connection>;
  setCurrentConnection: (conn: Partial<Connection>) => void;
  showMap: boolean;
  setShowMap: (show: boolean) => void;
  handleMapClick: (lat: number, lng: number) => void;
}

export function CustomLocationFields({ 
  currentConnection, 
  setCurrentConnection, 
  showMap, 
  setShowMap, 
  handleMapClick 
}: CustomLocationFieldsProps) {
  return (
    <div>
      <div className="mb-2">
        <Label className="text-sm text-gray-700">Address Entry</Label>
      </div>

      <div className="space-y-3">
        {/* State and City */}
        <div className="grid grid-cols-2 gap-3">
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
        </div>

        {/* Pin Code */}
        <div>
          <Label>Pin Code *</Label>
          <Input
            placeholder="000000"
            maxLength={6}
            value={currentConnection.pinCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setCurrentConnection({...currentConnection, pinCode: value});
            }}
          />
        </div>

        {/* Address Line 1 */}
        <div>
          <Label>Address Line 1 *</Label>
          <Input
            placeholder="Building name, street address"
            value={currentConnection.addressLine1}
            onChange={(e) => setCurrentConnection({...currentConnection, addressLine1: e.target.value})}
          />
        </div>

        {/* Address Line 2 */}
        <div>
          <Label>Address Line 2</Label>
          <Input
            placeholder="Area, locality, landmark"
            value={currentConnection.addressLine2}
            onChange={(e) => setCurrentConnection({...currentConnection, addressLine2: e.target.value})}
          />
        </div>

        {/* Building Name and Branch Code */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Building Name</Label>
            <Input
              placeholder="e.g., TMZ"
              value={currentConnection.buildingName || ''}
              onChange={(e) => setCurrentConnection({...currentConnection, buildingName: e.target.value})}
            />
          </div>
          <div>
            <Label>Branch Code</Label>
            <Input
              placeholder="e.g., A 433"
              value={currentConnection.branchCode || ''}
              onChange={(e) => setCurrentConnection({...currentConnection, branchCode: e.target.value})}
            />
          </div>
        </div>

        {/* Floor Details and Block/Tower Details (New Optional Fields) */}
        <div className="grid grid-cols-2 gap-3">
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

        {/* Building Height and Terrace Type */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Building Height</Label>
            <Input
              placeholder="e.g., 10m"
              value={currentConnection.buildingHeight || ''}
              onChange={(e) => setCurrentConnection({...currentConnection, buildingHeight: e.target.value})}
            />
          </div>
          <div>
            <Label>Terrace Type</Label>
            <Select
              value={currentConnection.terraceType || ''}
              onValueChange={(val) => setCurrentConnection({...currentConnection, terraceType: val})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select terrace type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Concrete">Concrete</SelectItem>
                <SelectItem value="Tin Sheet">Tin Sheet</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Latitude and Longitude */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-gray-600">Latitude</Label>
            <Input
              placeholder="e.g., 19.0760"
              value={currentConnection.latitude}
              onChange={(e) => setCurrentConnection({...currentConnection, latitude: e.target.value})}
            />
          </div>
          <div>
            <Label className="text-xs text-gray-600">Longitude</Label>
            <Input
              placeholder="e.g., 72.8777"
              value={currentConnection.longitude}
              onChange={(e) => setCurrentConnection({...currentConnection, longitude: e.target.value})}
            />
          </div>
        </div>

        {/* Show Map Button */}
        {(currentConnection.addressLine1 || currentConnection.latitude) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMap(!showMap)}
            className="mt-2 w-full"
          >
            <MapPin className="w-4 h-4 mr-2" />
            {showMap ? 'Hide Map' : 'Show Map & Refine Location'}
          </Button>
        )}

        {/* Map Display */}
        {showMap && (currentConnection.addressLine1 || currentConnection.latitude) && (
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="bg-gray-100 p-2 border-b border-gray-300">
              <p className="text-xs text-gray-700">
                📍 Refine pin location on map (Click to update address)
              </p>
            </div>
            <div 
              className="relative h-64 bg-gray-200 flex items-center justify-center cursor-crosshair"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const latChange = ((y - rect.height / 2) / rect.height) * -0.01;
                const lngChange = ((x - rect.width / 2) / rect.width) * 0.01;
                const newLat = parseFloat(currentConnection.latitude || '19.0760') + latChange;
                const newLng = parseFloat(currentConnection.longitude || '72.8777') + lngChange;
                handleMapClick(newLat, newLng);
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-100 to-yellow-100">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }} />
                
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="w-8 h-8 bg-red-500 rounded-full animate-pulse flex items-center justify-center shadow-lg">
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap">
                      {currentConnection.latitude}, {currentConnection.longitude}
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-2 left-2 bg-white p-2 rounded shadow text-xs">
                  <p className="text-gray-700">🗺️ Interactive Map</p>
                  <p className="text-gray-500">Click to set pin</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-2 text-xs text-gray-600 text-center">
              Click anywhere on the map to update address
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
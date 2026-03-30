import React from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { MapPin } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { INDIAN_STATES, INDIAN_CITIES } from '../constants/indiaLocations';

interface MDACCustomLocationFieldsProps {
  modifyAddressLine1: string;
  modifyAddressLine2: string;
  modifyState: string;
  modifyCity: string;
  modifyPinCode: string;
  modifyLatitude: string;
  modifyLongitude: string;
  modifyFloorDetails?: string;
  modifyBlockTowerDetails?: string;
  setModifyAddressLine1: (value: string) => void;
  setModifyAddressLine2: (value: string) => void;
  setModifyState: (value: string) => void;
  setModifyCity: (value: string) => void;
  setModifyPinCode: (value: string) => void;
  setModifyLatitude: (value: string) => void;
  setModifyLongitude: (value: string) => void;
  setModifyFloorDetails?: (value: string) => void;
  setModifyBlockTowerDetails?: (value: string) => void;
  showMap: boolean;
  setShowMap: (show: boolean) => void;
  geocodeAddress: (city: string, state: string, pinCode: string) => { lat: number; lng: number };
}

export function MDACCustomLocationFields({
  modifyAddressLine1,
  modifyAddressLine2,
  modifyState,
  modifyCity,
  modifyPinCode,
  modifyLatitude,
  modifyLongitude,
  modifyFloorDetails = '',
  modifyBlockTowerDetails = '',
  setModifyAddressLine1,
  setModifyAddressLine2,
  setModifyState,
  setModifyCity,
  setModifyPinCode,
  setModifyLatitude,
  setModifyLongitude,
  setModifyFloorDetails = () => {},
  setModifyBlockTowerDetails = () => {},
  showMap,
  setShowMap,
  geocodeAddress
}: MDACCustomLocationFieldsProps) {
  return (
    <div className="space-y-3">
      {/* State and City */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm text-gray-700">State *</Label>
          <Select 
            value={modifyState} 
            onValueChange={(value) => {
              setModifyState(value);
              // Trigger geocoding when all required fields are filled
              if (modifyAddressLine1 && modifyCity && value && modifyPinCode.length === 6) {
                const coords = geocodeAddress(modifyCity, value, modifyPinCode);
                setModifyLatitude(coords.lat.toFixed(6));
                setModifyLongitude(coords.lng.toFixed(6));
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {INDIAN_STATES.map(state => (
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
              // Trigger geocoding when all required fields are filled
              if (modifyAddressLine1 && value && modifyState && modifyPinCode.length === 6) {
                const coords = geocodeAddress(value, modifyState, modifyPinCode);
                setModifyLatitude(coords.lat.toFixed(6));
                setModifyLongitude(coords.lng.toFixed(6));
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {INDIAN_CITIES.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pin Code */}
      <div>
        <Label className="text-sm text-gray-700">Pin Code *</Label>
        <Input
          value={modifyPinCode}
          onChange={(e) => {
            setModifyPinCode(e.target.value);
            // Trigger geocoding when all required fields are filled
            if (modifyAddressLine1 && modifyCity && modifyState && e.target.value.length === 6) {
              const coords = geocodeAddress(modifyCity, modifyState, e.target.value);
              setModifyLatitude(coords.lat.toFixed(6));
              setModifyLongitude(coords.lng.toFixed(6));
            }
          }}
          placeholder="Enter pin code"
          maxLength={6}
        />
      </div>

      {/* Address Line 1 */}
      <div>
        <Label className="text-sm text-gray-700">Address Line 1 *</Label>
        <Input
          value={modifyAddressLine1}
          onChange={(e) => {
            setModifyAddressLine1(e.target.value);
            // Trigger geocoding when all required fields are filled
            if (e.target.value && modifyCity && modifyState && modifyPinCode.length === 6) {
              const coords = geocodeAddress(modifyCity, modifyState, modifyPinCode);
              setModifyLatitude(coords.lat.toFixed(6));
              setModifyLongitude(coords.lng.toFixed(6));
            }
          }}
          placeholder="Building name, street address"
        />
      </div>

      {/* Address Line 2 */}
      <div>
        <Label className="text-sm text-gray-700">Address Line 2</Label>
        <Input
          value={modifyAddressLine2}
          onChange={(e) => setModifyAddressLine2(e.target.value)}
          placeholder="Area, locality, landmark"
        />
      </div>

      {/* Floor Details and Block/Tower Details (New Optional Fields) */}
      <div className="grid grid-cols-2 gap-4">
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
      
      {/* Latitude and Longitude */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-xs text-gray-600">Latitude</Label>
          <Input
            placeholder="e.g., 19.0760"
            value={modifyLatitude}
            onChange={(e) => setModifyLatitude(e.target.value)}
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Longitude</Label>
          <Input
            placeholder="e.g., 72.8877"
            value={modifyLongitude}
            onChange={(e) => setModifyLongitude(e.target.value)}
          />
        </div>
      </div>

      {/* Show Map Button */}
      {(modifyAddressLine1 || modifyLatitude) && (
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
      {showMap && (modifyAddressLine1 || modifyLatitude) && (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <div className="bg-gray-100 p-2 border-b border-gray-300">
            <p className="text-xs text-gray-700">
              📍 Refine pin location on map (Click to update address)
            </p>
          </div>
          <div className="relative">
            <div 
              className="h-64 bg-gradient-to-br from-blue-100 via-green-100 to-yellow-100 relative cursor-crosshair"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Convert click position to lat/lng (simplified)
                const lat = (19.0760 + (y / rect.height - 0.5) * 0.1).toFixed(6);
                const lng = (72.8777 + (x / rect.width - 0.5) * 0.1).toFixed(6);
                
                setModifyLatitude(lat);
                setModifyLongitude(lng);
                toast.success('Location updated on map');
              }}
            >
              {/* Grid overlay */}
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div key={i} className="border border-white/20" />
                ))}
              </div>

              {/* Location Pin */}
              {modifyLatitude && modifyLongitude && (
                <div 
                  className="absolute transform -translate-x-1/2 -translate-y-full"
                  style={{
                    left: '50%',
                    top: '50%'
                  }}
                >
                  <div className="w-8 h-8 bg-red-500 rounded-full animate-pulse flex items-center justify-center shadow-lg">
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap">
                    {modifyLatitude}, {modifyLongitude}
                  </div>
                </div>
              )}

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
  );
}
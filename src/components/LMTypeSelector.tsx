import React from 'react';
import { Label } from './ui/label';
import { CheckCircle, Info } from 'lucide-react';
import { LM_TYPES, type LMType } from '../constants/lastMileTypes';

// Helper function to normalize link type for business rules
const normalizeLinkType = (linkType: string): 'Single' | 'Dual' => {
  if (linkType === 'Single') {
    return 'Single';
  }
  // All dual configurations ( 'Dual', 'Dual link with single cloud', 'Dual link with dual cloud') are treated as 'Dual'
  if (linkType === 'Dual' || linkType === 'Dual link with single cloud' || linkType === 'Dual link with dual cloud') {
    return 'Dual';
  }
  // Default fallback
  return 'Single';
};

// All LM Types for reference
const ALL_LM_TYPES = [
  LM_TYPES.SIFY_FIBER,
  LM_TYPES.SIFY_WIRELESS,
  LM_TYPES.LEASED_LINE_FIBER,
  LM_TYPES.LEASED_LINE_WIRELESS,
  LM_TYPES.BROADBAND,
  LM_TYPES.THREE_G_FOUR_G,
  LM_TYPES.VSAT
] as LMType[];

// Business Rules: LM Type availability based on Building Type and Link Type
const LM_TYPE_RULES = {
  'Sify DC': {
    'Single': [LM_TYPES.SIFY_FIBER] as LMType[],
    'Dual': [LM_TYPES.SIFY_FIBER, LM_TYPES.LEASED_LINE_FIBER] as LMType[]
  },
  'Connected DC': {
    'Single': [LM_TYPES.SIFY_FIBER] as LMType[],
    'Dual': [LM_TYPES.SIFY_FIBER, LM_TYPES.LEASED_LINE_FIBER] as LMType[]
  },
  'Connected Building': {
    'Single': [LM_TYPES.SIFY_FIBER, LM_TYPES.SIFY_WIRELESS] as LMType[],
    'Dual': ALL_LM_TYPES
  },
  'Custom Location': {
    'Single': ALL_LM_TYPES,
    'Dual': ALL_LM_TYPES
  }
} as const;

// Helper function to get available LM types based on building type and link configuration
const getAvailableLMTypesForBuilding = (buildingType: string, linkType: string): LMType[] => {
  const buildingRules = LM_TYPE_RULES[buildingType as keyof typeof LM_TYPE_RULES];
  if (!buildingRules) {
    return ALL_LM_TYPES; // Fallback to all types
  }
  
  const normalizedLinkType = normalizeLinkType(linkType);
  const linkRules = buildingRules[normalizedLinkType];
  return linkRules || ALL_LM_TYPES; // Fallback to all types
};

export interface ConnectionTypeItem {
  type: LMType;
  serviceProviders?: string[];
  broadbandIPType?: 'With Static IP' | 'Without Static IP';
  sim3G4GType?: 'Single Sim' | 'Dual Sim';
}

interface LMTypeSelectorProps {
  connectionTypes: ConnectionTypeItem[];
  onConnectionTypesChange: (types: ConnectionTypeItem[]) => void;
  idPrefix?: string;
  showCompletionIndicator?: boolean;
  fiberOnly?: boolean;
  disableWireless?: boolean;
  cloudProvider?: string;
  addressType?: string;
  dcLocation?: boolean;
  isDualCloud?: boolean;
  buildingType?: string;
  linkType?: string;
}

export function LMTypeSelector({
  connectionTypes,
  onConnectionTypesChange,
  idPrefix = 'lm',
  showCompletionIndicator = false,
  fiberOnly = false,
  disableWireless = false,
  buildingType = 'Custom Location',
  linkType = 'Single',
}: LMTypeSelectorProps) {
  // Get available LM types based on business rules
  const availableLMTypes = React.useMemo(() => {
    return getAvailableLMTypesForBuilding(buildingType, linkType);
  }, [buildingType, linkType]);

  // Handler for individual LM type change
  const handleTypeChange = (type: LMType, checked: boolean, defaultProps?: Partial<ConnectionTypeItem>) => {
    if (checked) {
      const newType: ConnectionTypeItem = { 
        type, 
        ...defaultProps,
        serviceProviders: defaultProps?.serviceProviders || [] 
      };
      onConnectionTypesChange([...connectionTypes, newType]);
    } else {
      onConnectionTypesChange(connectionTypes.filter(ct => ct.type !== type));
    }
  };

  // Handler for Others checkbox (controls all non-Sify types)
  const handleOthersChange = (checked: boolean) => {
    setHasOthersSelected(checked);
    
    if (checked) {
      // Add all "Others" types that are available based on business rules
      const allOthersTypes: LMType[] = [LM_TYPES.BROADBAND, LM_TYPES.THREE_G_FOUR_G, LM_TYPES.VSAT, LM_TYPES.LEASED_LINE_FIBER, LM_TYPES.LEASED_LINE_WIRELESS];
      const availableOthersTypes = allOthersTypes.filter(type => availableLMTypes.includes(type));
      const newTypes: ConnectionTypeItem[] = [...connectionTypes];
      
      availableOthersTypes.forEach(type => {
        if (!newTypes.some(ct => ct.type === type)) {
          const defaultProps = type === LM_TYPES.BROADBAND ? { broadbandIPType: 'With Static IP' as const } :
                             type === LM_TYPES.THREE_G_FOUR_G ? { sim3G4GType: 'Single Sim' as const } :
                             (type === LM_TYPES.LEASED_LINE_FIBER || type === LM_TYPES.LEASED_LINE_WIRELESS) ? { serviceProviders: [] } : {};
          newTypes.push({ type, ...defaultProps });
        }
      });
      
      onConnectionTypesChange(newTypes);
    } else {
      // Remove all "Others" types
      const othersTypes = [LM_TYPES.BROADBAND, LM_TYPES.THREE_G_FOUR_G, LM_TYPES.VSAT, LM_TYPES.LEASED_LINE_FIBER, LM_TYPES.LEASED_LINE_WIRELESS];
      onConnectionTypesChange(connectionTypes.filter(ct => !othersTypes.includes(ct.type)));
    }
  };

  // Handler for Broadband IP Type preference change
  const handleBroadbandIPTypeChange = (ipType: 'With Static IP' | 'Without Static IP') => {
    const newTypes = connectionTypes.map(ct => {
      if (ct.type === LM_TYPES.BROADBAND) {
        return { 
          ...ct, 
          broadbandIPType: ipType
        };
      }
      return ct;
    });
    onConnectionTypesChange(newTypes);
  };

  // Handler for 4G/5G SIM Type preference change
  const handleSimTypeChange = (simType: 'Single Sim' | 'Dual Sim') => {
    const newTypes = connectionTypes.map(ct => {
      if (ct.type === LM_TYPES.THREE_G_FOUR_G) {
        return { 
          ...ct, 
          sim3G4GType: simType
        };
      }
      return ct;
    });
    onConnectionTypesChange(newTypes);
  };

  // Extract current selections for easier access
  const leasedLineFiber = connectionTypes.find(ct => ct.type === LM_TYPES.LEASED_LINE_FIBER);
  const leasedLineWireless = connectionTypes.find(ct => ct.type === LM_TYPES.LEASED_LINE_WIRELESS);
  const broadband = connectionTypes.find(ct => ct.type === LM_TYPES.BROADBAND);
  const threeGFourG = connectionTypes.find(ct => ct.type === LM_TYPES.THREE_G_FOUR_G);
  const vsat = connectionTypes.find(ct => ct.type === LM_TYPES.VSAT);
  
  // Check if any "Others" options are selected
  const hasOthersSelected = connectionTypes.some(ct => 
    [LM_TYPES.LEASED_LINE_FIBER, LM_TYPES.LEASED_LINE_WIRELESS, LM_TYPES.BROADBAND, LM_TYPES.THREE_G_FOUR_G, LM_TYPES.VSAT].includes(ct.type)
  );
  
  // State to control Others section expansion (independent of selection)
  const [othersExpanded, setOthersExpanded] = React.useState(false);
  
  // Auto-expand Others if any Others types are selected
  React.useEffect(() => {
    if (hasOthersSelected) {
      setOthersExpanded(true);
    }
  }, [hasOthersSelected]);

  // Check if only Leased Line Fiber is available under Others (for UX optimization)
  const availableOthersTypes = [LM_TYPES.BROADBAND, LM_TYPES.THREE_G_FOUR_G, LM_TYPES.VSAT, LM_TYPES.LEASED_LINE_FIBER, LM_TYPES.LEASED_LINE_WIRELESS]
    .filter(type => availableLMTypes.includes(type));
  
  const showLeasedLineFiberDirectly = availableOthersTypes.length === 1 && availableOthersTypes[0] === LM_TYPES.LEASED_LINE_FIBER;
  const shouldShowOthersSection = availableOthersTypes.length > 1 || (availableOthersTypes.length === 1 && !showLeasedLineFiberDirectly);

  // If fiberOnly mode, show locked Sify Fiber
  if (fiberOnly) {
    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Label className="text-gray-900">Last Mile Type *</Label>
          {showCompletionIndicator && connectionTypes.length > 0 && (
            <CheckCircle className="w-4 h-4 text-green-600" />
          )}
        </div>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`${idPrefix}-Fiber-locked`}
                checked={true}
                disabled
                className="w-4 h-4 text-blue-600 rounded border-gray-300 cursor-not-allowed opacity-60"
              />
              <Label htmlFor={`${idPrefix}-Fiber-locked`} className="text-sm text-gray-900 cursor-not-allowed">
                Sify Fiber
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`${idPrefix}-Wireless-locked`}
                checked={false}
                disabled
                className="w-4 h-4 text-gray-400 rounded border-gray-300 cursor-not-allowed opacity-60"
              />
              <Label htmlFor={`${idPrefix}-Wireless-locked`} className="text-sm text-gray-500 cursor-not-allowed">
                Sify Wireless
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`${idPrefix}-Others-locked`}
                checked={false}
                disabled
                className="w-4 h-4 text-gray-400 rounded border-gray-300 cursor-not-allowed opacity-60"
              />
              <Label htmlFor={`${idPrefix}-Others-locked`} className="text-sm text-gray-500 cursor-not-allowed">
                Others
              </Label>
            </div>
          </div>
          <p className="text-xs text-blue-700 mt-3 flex items-start">
            <Info className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
            Sify Fiber is auto-selected for DC and Connected Building locations.
          </p>
        </div>
      </div>
    );
  }

  // Default UI matching the screenshot
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Label className="text-gray-900">Last Mile Type * (Multi-select)</Label>
        {showCompletionIndicator && connectionTypes.length > 0 && (
          <CheckCircle className="w-4 h-4 text-green-600" />
        )}
      </div>
      
      <div className="space-y-3">
        <p className="text-sm text-gray-600">Select one or more Last Mile types.</p>
        
        {/* Sify Fiber */}
        {availableLMTypes.includes(LM_TYPES.SIFY_FIBER) && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`${idPrefix}-sify-fiber`}
              checked={connectionTypes.some(ct => ct.type === LM_TYPES.SIFY_FIBER)}
              onChange={(e) => handleTypeChange(LM_TYPES.SIFY_FIBER, e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              disabled={disableWireless && connectionTypes.some(ct => ct.type === LM_TYPES.SIFY_FIBER)}
            />
            <Label htmlFor={`${idPrefix}-sify-fiber`} className="cursor-pointer text-sm font-medium">
              Sify Fiber
            </Label>
          </div>
        )}

        {/* Sify Wireless */}
        {availableLMTypes.includes(LM_TYPES.SIFY_WIRELESS) && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`${idPrefix}-sify-wireless`}
              checked={connectionTypes.some(ct => ct.type === LM_TYPES.SIFY_WIRELESS)}
              onChange={(e) => handleTypeChange(LM_TYPES.SIFY_WIRELESS, e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              disabled={disableWireless}
            />
            <Label htmlFor={`${idPrefix}-sify-wireless`} className="cursor-pointer text-sm font-medium">
              Sify Wireless
            </Label>
          </div>
        )}

        {/* Leased Line Fiber - Show directly when it's the only Others option */}
        {showLeasedLineFiberDirectly && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`${idPrefix}-leased-line-fiber-direct`}
                checked={!!leasedLineFiber}
                onChange={(e) => handleTypeChange(LM_TYPES.LEASED_LINE_FIBER, e.target.checked, {
                  serviceProviders: []
                })}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <Label htmlFor={`${idPrefix}-leased-line-fiber-direct`} className="cursor-pointer text-sm font-medium">
                Leased Line Fiber
              </Label>
            </div>

            {/* Service Provider Preference for Direct Leased Line Fiber */}
            {leasedLineFiber && (
              <div className="ml-6 pl-3 border-l border-gray-200 space-y-2">
                <Label className="text-xs font-medium">Service Provider Preference</Label>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`${idPrefix}-fiber-direct-no-pref`}
                      name={`${idPrefix}-fiber-direct-pref`}
                      checked={!leasedLineFiber.serviceProviders?.length}
                      onChange={() => handleProviderPreferenceChange(LM_TYPES.LEASED_LINE_FIBER, 'no-preference')}
                      className="w-3 h-3 text-blue-600"
                    />
                    <Label htmlFor={`${idPrefix}-fiber-direct-no-pref`} className="text-xs cursor-pointer">
                      No preference
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`${idPrefix}-fiber-direct-select`}
                      name={`${idPrefix}-fiber-direct-pref`}
                      checked={!!leasedLineFiber.serviceProviders?.length}
                      onChange={() => handleProviderPreferenceChange(LM_TYPES.LEASED_LINE_FIBER, 'include')}
                      className="w-3 h-3 text-blue-600"
                    />
                    <Label htmlFor={`${idPrefix}-fiber-direct-select`} className="text-xs cursor-pointer">
                      Select specific providers
                    </Label>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Others Section - Only show when there are multiple options or non-Leased Line Fiber options */}
        {shouldShowOthersSection && (
          <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`${idPrefix}-others`}
                checked={hasOthersSelected && !showLeasedLineFiberDirectly}
                onChange={(e) => {
                  setOthersExpanded(e.target.checked);
                  handleOthersChange(e.target.checked);
                }}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <Label 
                htmlFor={`${idPrefix}-others`} 
                className="cursor-pointer text-sm font-medium"
                onClick={() => {
                  const newExpanded = !othersExpanded;
                  setOthersExpanded(newExpanded);
                  if (!newExpanded && hasOthersSelected && !showLeasedLineFiberDirectly) {
                    handleOthersChange(false);
                  }
                }}
              >
                Others
              </Label>
          </div>

          {/* Others Sub-options */}
          {othersExpanded && (
            <div className="ml-6 pl-3 border-l-2 border-gray-200 space-y-3">
              
              {/* Broadband */}
              {availableLMTypes.includes(LM_TYPES.BROADBAND) && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${idPrefix}-broadband`}
                      checked={!!broadband}
                      onChange={(e) => handleTypeChange(LM_TYPES.BROADBAND, e.target.checked, {
                        broadbandIPType: 'With Static IP'
                      })}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <Label htmlFor={`${idPrefix}-broadband`} className="cursor-pointer text-sm">
                      Broadband
                    </Label>
                  </div>

                  {/* IP Configuration for Broadband */}
                  {broadband && (
                    <div className="ml-6 pl-3 border-l border-gray-200 space-y-2">
                      <Label className="text-xs font-medium">IP Configuration</Label>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={`${idPrefix}-broadband-static`}
                            name={`${idPrefix}-broadband-ip`}
                            checked={broadband.broadbandIPType === 'With Static IP'}
                            onChange={() => handleBroadbandIPTypeChange('With Static IP')}
                            className="w-3 h-3 text-blue-600"
                          />
                          <Label htmlFor={`${idPrefix}-broadband-static`} className="text-xs cursor-pointer">
                            With Static IP
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={`${idPrefix}-broadband-dynamic`}
                            name={`${idPrefix}-broadband-ip`}
                            checked={broadband.broadbandIPType === 'Without Static IP'}
                            onChange={() => handleBroadbandIPTypeChange('Without Static IP')}
                            className="w-3 h-3 text-blue-600"
                          />
                          <Label htmlFor={`${idPrefix}-broadband-dynamic`} className="text-xs cursor-pointer">
                            Without Static IP
                          </Label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 4G/5G */}
              {availableLMTypes.includes(LM_TYPES.THREE_G_FOUR_G) && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${idPrefix}-4g5g`}
                      checked={!!threeGFourG}
                      onChange={(e) => handleTypeChange(LM_TYPES.THREE_G_FOUR_G, e.target.checked, {
                        sim3G4GType: 'Single Sim'
                      })}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <Label htmlFor={`${idPrefix}-4g5g`} className="cursor-pointer text-sm">
                      4G/5G
                    </Label>
                  </div>

                  {/* SIM Configuration for 4G/5G */}
                  {threeGFourG && (
                    <div className="ml-6 pl-3 border-l border-gray-200 space-y-2">
                      <Label className="text-xs font-medium">SIM Configuration</Label>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={`${idPrefix}-4g5g-single`}
                            name={`${idPrefix}-4g5g-sim`}
                            checked={threeGFourG.sim3G4GType === 'Single Sim'}
                            onChange={() => handleSimTypeChange('Single Sim')}
                            className="w-3 h-3 text-blue-600"
                          />
                          <Label htmlFor={`${idPrefix}-4g5g-single`} className="text-xs cursor-pointer">
                            Single Sim
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={`${idPrefix}-4g5g-dual`}
                            name={`${idPrefix}-4g5g-sim`}
                            checked={threeGFourG.sim3G4GType === 'Dual Sim'}
                            onChange={() => handleSimTypeChange('Dual Sim')}
                            className="w-3 h-3 text-blue-600"
                          />
                          <Label htmlFor={`${idPrefix}-4g5g-dual`} className="text-xs cursor-pointer">
                            Dual Sim
                          </Label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* VSAT */}
              {availableLMTypes.includes(LM_TYPES.VSAT) && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`${idPrefix}-vsat`}
                    checked={!!vsat}
                    onChange={(e) => handleTypeChange(LM_TYPES.VSAT, e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <Label htmlFor={`${idPrefix}-vsat`} className="cursor-pointer text-sm">
                    VSAT
                  </Label>
                </div>
              )}

              {/* Leased Line Fiber - Only show in Others section if not shown directly */}
              {availableLMTypes.includes(LM_TYPES.LEASED_LINE_FIBER) && !showLeasedLineFiberDirectly && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${idPrefix}-leased-line-fiber`}
                      checked={!!leasedLineFiber}
                      onChange={(e) => handleTypeChange(LM_TYPES.LEASED_LINE_FIBER, e.target.checked, {
                        serviceProviders: []
                      })}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <Label htmlFor={`${idPrefix}-leased-line-fiber`} className="cursor-pointer text-sm">
                      Leased Line Fiber
                    </Label>
                  </div>

                  {/* Service Provider Preference for Leased Line Fiber */}
                  {leasedLineFiber && (
                    <div className="ml-6 pl-3 border-l border-gray-200 space-y-2">
                      <Label className="text-xs font-medium">Service Provider Preference</Label>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={`${idPrefix}-fiber-no-pref`}
                            name={`${idPrefix}-fiber-pref`}
                            checked={!leasedLineFiber.serviceProviders?.length}
                            onChange={() => handleProviderPreferenceChange(LM_TYPES.LEASED_LINE_FIBER, 'no-preference')}
                            className="w-3 h-3 text-blue-600"
                          />
                          <Label htmlFor={`${idPrefix}-fiber-no-pref`} className="text-xs cursor-pointer">
                            No preference
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={`${idPrefix}-fiber-select`}
                            name={`${idPrefix}-fiber-pref`}
                            checked={!!leasedLineFiber.serviceProviders?.length}
                            onChange={() => handleProviderPreferenceChange(LM_TYPES.LEASED_LINE_FIBER, 'include')}
                            className="w-3 h-3 text-blue-600"
                          />
                          <Label htmlFor={`${idPrefix}-fiber-select`} className="text-xs cursor-pointer">
                            Select specific providers
                          </Label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Leased Line Wireless */}
              {availableLMTypes.includes(LM_TYPES.LEASED_LINE_WIRELESS) && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${idPrefix}-leased-line-wireless`}
                      checked={!!leasedLineWireless}
                      onChange={(e) => handleTypeChange(LM_TYPES.LEASED_LINE_WIRELESS, e.target.checked, {
                        serviceProviders: []
                      })}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <Label htmlFor={`${idPrefix}-leased-line-wireless`} className="cursor-pointer text-sm">
                      Leased Line Wireless
                    </Label>
                  </div>

                  {/* Service Provider Preference for Leased Line Wireless */}
                  {leasedLineWireless && (
                    <div className="ml-6 pl-3 border-l border-gray-200 space-y-2">
                      <Label className="text-xs font-medium">Service Provider Preference</Label>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={`${idPrefix}-wireless-no-pref`}
                            name={`${idPrefix}-wireless-pref`}
                            checked={!leasedLineWireless.serviceProviders?.length}
                            onChange={() => handleProviderPreferenceChange(LM_TYPES.LEASED_LINE_WIRELESS, 'no-preference')}
                            className="w-3 h-3 text-blue-600"
                          />
                          <Label htmlFor={`${idPrefix}-wireless-no-pref`} className="text-xs cursor-pointer">
                            No preference
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={`${idPrefix}-wireless-select`}
                            name={`${idPrefix}-wireless-pref`}
                            checked={!!leasedLineWireless.serviceProviders?.length}
                            onChange={() => handleProviderPreferenceChange(LM_TYPES.LEASED_LINE_WIRELESS, 'include')}
                            className="w-3 h-3 text-blue-600"
                          />
                          <Label htmlFor={`${idPrefix}-wireless-select`} className="text-xs cursor-pointer">
                            Select specific providers
                          </Label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* Show message if no Others options are available */}
              {!availableLMTypes.some(type => 
                [LM_TYPES.BROADBAND, LM_TYPES.THREE_G_FOUR_G, LM_TYPES.VSAT, 
                 ...(showLeasedLineFiberDirectly ? [] : [LM_TYPES.LEASED_LINE_FIBER]), 
                 LM_TYPES.LEASED_LINE_WIRELESS].includes(type)
              ) && (
                <div className="text-xs text-gray-500 italic">
                  No additional Last Mile types are available for {buildingType} with {linkType} configuration.
                </div>
              )}
            </div>
          )}
          </div>
        )}
      </div>
    </div>
  );
}
import React from 'react';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ConnectionType {
  type: 'Fiber' | 'Wireless' | 'Broadband (With/Without Static IP)' | 'Leased Line Fiber' | 'Leased Line Wireless' | '4G/5G (Single/Dual Sim)' | 'VSAT';
  isPrimary: boolean;
  serviceProviders?: string[];
  providerPreference?: 'include' | 'exclude' | 'no-preference';
  ipType?: 'With Static IP' | 'Without Static IP'; // For Broadband
  simType?: 'Single Sim' | 'Dual Sim'; // For 3G/4G
}

interface LMTypeSelectorProps {
  connectionTypes: ConnectionType[];
  onConnectionTypesChange: (types: ConnectionType[]) => void;
  idPrefix?: string;
  fiberOnly?: boolean; 
  dcLocation?: boolean; 
  showCompletionIndicator?: boolean; 
  disableWireless?: boolean; 
  cloudProvider?: 'Sify' | 'Other ISP'; // New prop
  addressType?: string; // Building/address type for conditional filtering
  isDualCloud?: boolean; // True when link type is 'Dual link with dual cloud'
}

export function LMTypeSelector({ 
  connectionTypes, 
  onConnectionTypesChange,
  idPrefix = 'lm',
  fiberOnly = false,
  dcLocation = false,
  showCompletionIndicator = false,
  disableWireless = false,
  cloudProvider,
  addressType,
  isDualCloud
}: LMTypeSelectorProps) {
  const handleTypeChange = (type: ConnectionType['type'], checked: boolean, additionalData?: Partial<ConnectionType>) => {
    if (checked) {
      const newTypes = [...connectionTypes, {
        type,
        isPrimary: connectionTypes.length === 0,
        ...(additionalData || {})
      }] as ConnectionType[];
      onConnectionTypesChange(newTypes);
    } else {
      const selectedItem = connectionTypes.find(ct => ct.type === type);
      const newTypes = connectionTypes.filter(ct => ct.type !== type);
      if (selectedItem?.isPrimary && newTypes.length > 0) {
        newTypes[0].isPrimary = true;
      }
      onConnectionTypesChange(newTypes);
    }
  };

  const handleProviderPreferenceChange = (
    type: 'Leased Line Fiber' | 'Leased Line - Wireless',
    value: 'include' | 'exclude' | 'no-preference'
  ) => {
    const newTypes = connectionTypes.map(ct => {
      if (ct.type === type) {
        return {
          ...ct,
          providerPreference: value,
          serviceProviders: value === 'no-preference' ? [] : ct.serviceProviders
        };
      }
      return ct;
    });
    onConnectionTypesChange(newTypes);
  };

  const handleProviderSelection = (
    type: 'Leased Line Fiber' | 'Leased Line - Wireless',
    provider: string,
    checked: boolean
  ) => {
    const newTypes = connectionTypes.map(ct => {
      if (ct.type === type) {
        const currentProviders = ct.serviceProviders || [];
        const updatedProviders = checked
          ? [...currentProviders, provider]
          : currentProviders.filter(p => p !== provider);
        return {
          ...ct,
          serviceProviders: updatedProviders
        };
      }
      return ct;
    });
    onConnectionTypesChange(newTypes);
  };

  const handleOthersChange = (checked: boolean) => {
    if (checked) {
      // When checking Others, add Leased Line Fiber by default
      const newTypes = [...connectionTypes, {
        type: 'Leased Line Fiber' as const,
        isPrimary: connectionTypes.length === 0,
        serviceProviders: [],
        providerPreference: 'no-preference' as const
      }];
      onConnectionTypesChange(newTypes);
    } else {
      // Remove all Others types
      const removedTypes = ['Leased Line Fiber', 'Leased Line - Wireless', 'BSO - Fiber', 'BSO - Wireless'];
      const removedPrimary = connectionTypes.find(ct => removedTypes.includes(ct.type))?.isPrimary;
      const newTypes = connectionTypes.filter(ct => !removedTypes.includes(ct.type));
      if (removedPrimary && newTypes.length > 0) {
        newTypes[0].isPrimary = true;
      }
      onConnectionTypesChange(newTypes);
    }
  };

  const handleSifyOthersChange = (checked: boolean) => {
    if (checked) {
      // Add Leased Line Fiber by default for Sify 'Others'
      const newTypes = [...connectionTypes, {
        type: 'Leased Line Fiber' as const,
        isPrimary: connectionTypes.length === 0,
        serviceProviders: [],
        providerPreference: 'no-preference' as const
      }];
      onConnectionTypesChange(newTypes);
    } else {
      // Remove Sify 'Others' (Leased Line Fiber/Wireless, BSO Fiber/Wireless)
      const removedTypes = ['Leased Line Fiber', 'Leased Line - Wireless', 'BSO - Fiber', 'BSO - Wireless'];
      const removedPrimary = connectionTypes.find(ct => removedTypes.includes(ct.type))?.isPrimary;
      const newTypes = connectionTypes.filter(ct => !removedTypes.includes(ct.type));
      if (removedPrimary && newTypes.length > 0) {
        newTypes[0].isPrimary = true;
      }
      onConnectionTypesChange(newTypes);
    }
  };

  const handleBroadbandIpTypeChange = (ipType: 'With Static IP' | 'Without Static IP') => {
    const newTypes = connectionTypes.map(ct => {
      if (ct.type === 'Broadband') {
        return { ...ct, ipType };
      }
      return ct;
    });
    onConnectionTypesChange(newTypes);
  };

  const handleThreeGFourGSimTypeChange = (simType: 'Single Sim' | 'Dual Sim') => {
    const newTypes = connectionTypes.map(ct => {
      if (ct.type === '3G/4G') {
        return { ...ct, simType };
      }
      return ct;
    });
    onConnectionTypesChange(newTypes);
  };

  const leasedLineFiber = connectionTypes.find(ct => ct.type === 'Leased Line Fiber');
  const leasedLineWireless = connectionTypes.find(ct => ct.type === 'Leased Line - Wireless');
  const fiberPreference = leasedLineFiber?.providerPreference || 'no-preference';
  const wirelessPreference = leasedLineWireless?.providerPreference || 'no-preference';

  // If DC location mode, show only Sify Fiber and Leased Line Fiber
  if (dcLocation) {
    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Label className="text-gray-900">Last Mile Type *</Label>
          {showCompletionIndicator && connectionTypes.length > 0 && (
            <CheckCircle className="w-4 h-4 text-green-600" />
          )}
        </div>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
          <p className="text-xs text-blue-700 mb-3 flex items-start">
            <Info className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
            For DC locations, only Sify Fiber and Leased Line Fiber are available
          </p>

          <div className="space-y-3">
            {/* Sify Fiber */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`${idPrefix}-Fiber-dc`}
                checked={connectionTypes.some(ct => ct.type === 'Fiber')}
                onChange={(e) => handleTypeChange('Fiber', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <Label htmlFor={`${idPrefix}-Fiber-dc`} className="cursor-pointer font-medium text-sm">
                Sify Fiber
              </Label>
            </div>

            {/* Leased Line Fiber */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`${idPrefix}-LeasedLine-Fiber-dc`}
                  checked={connectionTypes.some(ct => ct.type === 'Leased Line Fiber')}
                  onChange={(e) => handleTypeChange('Leased Line Fiber', e.target.checked, {
                    serviceProviders: [],
                    providerPreference: 'no-preference'
                  })}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <Label htmlFor={`${idPrefix}-LeasedLine-Fiber-dc`} className="cursor-pointer font-medium text-sm">
                  Leased Line Fiber
                </Label>
              </div>
              
              {/* Service Provider Selection for Leased Line Fiber */}
              {leasedLineFiber && (
                <div className="ml-6 pl-3 border-l border-gray-200 space-y-3">
                  <div>
                    <Label className="text-xs mb-2 block font-medium">Service Provider Preference</Label>
                    <RadioGroup
                      value={fiberPreference}
                      onValueChange={(value: 'include' | 'exclude' | 'no-preference') => {
                        handleProviderPreferenceChange('Leased Line Fiber', value);
                      }}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no-preference" id={`${idPrefix}-fiber-dc-no-pref`} />
                          <Label htmlFor={`${idPrefix}-fiber-dc-no-pref`} className="text-xs cursor-pointer font-normal">
                            No preference
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="include" id={`${idPrefix}-fiber-dc-include`} />
                          <Label htmlFor={`${idPrefix}-fiber-dc-include`} className="text-xs cursor-pointer font-normal">
                            Select specific providers
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="exclude" id={`${idPrefix}-fiber-dc-exclude`} />
                          <Label htmlFor={`${idPrefix}-fiber-dc-exclude`} className="text-xs cursor-pointer font-normal">
                            Exclude specific providers
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {fiberPreference !== 'no-preference' && (
                    <div className="pl-3 border-l-2 border-blue-200">
                      <Label className="text-xs mb-2 block">
                        {fiberPreference === 'include' ? 'Select providers:' : 'Select providers:'}
                      </Label>
                      <div className="space-y-1.5">
                        {['Airtel', 'Jio', 'Tata Communications', 'BSNL', 'Vodafone Idea'].map((provider) => (
                          <div key={provider} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${idPrefix}-provider-fiber-dc-${provider}`}
                              checked={leasedLineFiber.serviceProviders?.includes(provider) || false}
                              onCheckedChange={(checked) => {
                                handleProviderSelection('Leased Line Fiber', provider, checked as boolean);
                              }}
                            />
                            <Label htmlFor={`${idPrefix}-provider-fiber-dc-${provider}`} className="text-xs cursor-pointer">
                              {provider}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If fiberOnly mode, show simplified view
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
          {/* Show all LM types but disabled, with Fiber checked */}
          <div className="space-y-2">
            {/* Sify Fiber - Checked and Disabled */}
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

            {/* Sify Wireless - Unchecked and Disabled */}
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

            {/* Others - Unchecked and Disabled */}
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
            Fiber LM type is auto-selected for Sify DC, Connected DC, and Connected Building locations due to infrastructure requirements and direct connectivity availability.
          </p>
        </div>
      </div>
    );
  }

  if (cloudProvider === 'Sify' || (cloudProvider === 'Other ISP' && !isDualCloud && (addressType === 'Connected Building' || addressType === 'Custom Location'))) {
    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Label className="text-gray-900">Last Mile Type *</Label>
          {showCompletionIndicator && connectionTypes.length > 0 && (
            <CheckCircle className="w-4 h-4 text-green-600" />
          )}
        </div>
        <div className="space-y-3 border border-gray-200 rounded-lg p-4">
          {/* Sify Fiber */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`${idPrefix}-Fiber-sify`}
              checked={connectionTypes.some(ct => ct.type === 'Fiber')}
              onChange={(e) => handleTypeChange('Fiber', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <Label htmlFor={`${idPrefix}-Fiber-sify`} className="cursor-pointer font-medium text-sm">
              Sify Fiber
            </Label>
          </div>

          {/* Sify Wireless */}
          <div className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              id={`${idPrefix}-Wireless-sify`}
              checked={connectionTypes.some(ct => ct.type === 'Wireless')}
              onChange={(e) => handleTypeChange('Wireless', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <Label htmlFor={`${idPrefix}-Wireless-sify`} className="cursor-pointer font-medium text-sm">
              Sify Wireless
            </Label>
          </div>

          {/* Others */}
          <div className="space-y-2 mt-4 pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`${idPrefix}-Others-sify`}
                checked={connectionTypes.some(ct => ct.type === 'Leased Line Fiber' || ct.type === 'Leased Line - Wireless' || ct.type === 'BSO - Fiber' || ct.type === 'BSO - Wireless')}
                onChange={(e) => handleSifyOthersChange(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <Label htmlFor={`${idPrefix}-Others-sify`} className="cursor-pointer font-medium text-sm">
                Others
              </Label>
            </div>

            {/* Sify Others Sub-options */}
            {connectionTypes.some(ct => ct.type === 'Leased Line Fiber' || ct.type === 'Leased Line - Wireless' || ct.type === 'BSO - Fiber' || ct.type === 'BSO - Wireless') && (
              <div className="ml-6 pl-4 border-l-2 border-gray-200 space-y-3 mt-2">
                {/* Other ISP Fiber (Leased Line Fiber) */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${idPrefix}-Sify-OtherISP-Fiber`}
                      checked={connectionTypes.some(ct => ct.type === 'Leased Line Fiber')}
                      onChange={(e) => handleTypeChange('Leased Line Fiber', e.target.checked, {
                        serviceProviders: [],
                        providerPreference: 'no-preference'
                      })}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <Label htmlFor={`${idPrefix}-Sify-OtherISP-Fiber`} className="cursor-pointer text-sm font-medium">
                      Other ISP Fiber
                    </Label>
                  </div>
                  {/* Service Provider Selection for Leased Line Fiber */}
                  {leasedLineFiber && (
                    <div className="ml-6 pl-3 border-l border-gray-200 mt-2">
                      <Label className="text-xs mb-2 block font-medium">Service Provider Preference</Label>
                      <RadioGroup
                        value={leasedLineFiber.providerPreference || 'no-preference'}
                        onValueChange={(value: 'include' | 'exclude' | 'no-preference') => {
                          handleProviderPreferenceChange('Leased Line Fiber', value);
                        }}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no-preference" id={`${idPrefix}-sify-fiber-no-pref`} />
                            <Label htmlFor={`${idPrefix}-sify-fiber-no-pref`} className="text-xs cursor-pointer font-normal">No preference</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="include" id={`${idPrefix}-sify-fiber-include`} />
                            <Label htmlFor={`${idPrefix}-sify-fiber-include`} className="text-xs cursor-pointer font-normal">Select specific providers</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="exclude" id={`${idPrefix}-sify-fiber-exclude`} />
                            <Label htmlFor={`${idPrefix}-sify-fiber-exclude`} className="text-xs cursor-pointer font-normal">Exclude specific providers</Label>
                          </div>
                        </div>
                      </RadioGroup>
                      {leasedLineFiber.providerPreference !== 'no-preference' && (
                        <div className="pl-3 border-l-2 border-blue-200 mt-2">
                          <div className="space-y-1.5">
                            {['Airtel', 'Jio', 'Tata Communications', 'BSNL', 'Vodafone Idea'].map((provider) => (
                              <div key={provider} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${idPrefix}-sify-provider-fiber-${provider}`}
                                  checked={leasedLineFiber?.serviceProviders?.includes(provider) || false}
                                  onCheckedChange={(checked) => handleProviderSelection('Leased Line Fiber', provider, checked as boolean)}
                                />
                                <Label htmlFor={`${idPrefix}-sify-provider-fiber-${provider}`} className="text-xs cursor-pointer">{provider}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Other ISP Wireless (Leased Line - Wireless) */}
                <div className="space-y-2 mt-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${idPrefix}-Sify-OtherISP-Wireless`}
                      checked={connectionTypes.some(ct => ct.type === 'Leased Line - Wireless')}
                      onChange={(e) => handleTypeChange('Leased Line - Wireless', e.target.checked, {
                        serviceProviders: [],
                        providerPreference: 'no-preference'
                      })}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <Label htmlFor={`${idPrefix}-Sify-OtherISP-Wireless`} className="cursor-pointer text-sm font-medium">
                      Other ISP Wireless
                    </Label>
                  </div>
                  {/* Service Provider Selection for Leased Line - Wireless */}
                  {leasedLineWireless && (
                    <div className="ml-6 pl-3 border-l border-gray-200 mt-2">
                      <Label className="text-xs mb-2 block font-medium">Service Provider Preference</Label>
                      <RadioGroup
                        value={leasedLineWireless.providerPreference || 'no-preference'}
                        onValueChange={(value: 'include' | 'exclude' | 'no-preference') => {
                          handleProviderPreferenceChange('Leased Line - Wireless', value);
                        }}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no-preference" id={`${idPrefix}-sify-wireless-no-pref`} />
                            <Label htmlFor={`${idPrefix}-sify-wireless-no-pref`} className="text-xs cursor-pointer font-normal">No preference</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="include" id={`${idPrefix}-sify-wireless-include`} />
                            <Label htmlFor={`${idPrefix}-sify-wireless-include`} className="text-xs cursor-pointer font-normal">Select specific providers</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="exclude" id={`${idPrefix}-sify-wireless-exclude`} />
                            <Label htmlFor={`${idPrefix}-sify-wireless-exclude`} className="text-xs cursor-pointer font-normal">Exclude specific providers</Label>
                          </div>
                        </div>
                      </RadioGroup>
                      {leasedLineWireless.providerPreference !== 'no-preference' && (
                        <div className="pl-3 border-l-2 border-blue-200 mt-2">
                          <div className="space-y-1.5">
                            {['Airtel', 'Jio', 'Tata Communications', 'BSNL', 'Vodafone Idea'].map((provider) => (
                              <div key={provider} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${idPrefix}-sify-provider-wireless-${provider}`}
                                  checked={leasedLineWireless?.serviceProviders?.includes(provider) || false}
                                  onCheckedChange={(checked) => handleProviderSelection('Leased Line - Wireless', provider, checked as boolean)}
                                />
                                <Label htmlFor={`${idPrefix}-sify-provider-wireless-${provider}`} className="text-xs cursor-pointer">{provider}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* BSO - Fiber */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`${idPrefix}-Sify-BSO-Fiber`}
                    checked={connectionTypes.some(ct => ct.type === 'BSO - Fiber')}
                    onChange={(e) => handleTypeChange('BSO - Fiber', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <Label htmlFor={`${idPrefix}-Sify-BSO-Fiber`} className="cursor-pointer text-sm">
                    BSO - Fiber
                  </Label>
                </div>

                {/* BSO - Wireless */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`${idPrefix}-Sify-BSO-Wireless`}
                    checked={connectionTypes.some(ct => ct.type === 'BSO - Wireless')}
                    onChange={(e) => handleTypeChange('BSO - Wireless', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <Label htmlFor={`${idPrefix}-Sify-BSO-Wireless`} className="cursor-pointer text-sm">
                    BSO - Wireless
                  </Label>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (cloudProvider === 'Other ISP') {
    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Label className="text-gray-900">Last Mile Type *</Label>
          {showCompletionIndicator && connectionTypes.length > 0 && (
            <CheckCircle className="w-4 h-4 text-green-600" />
          )}
        </div>
        <div className="space-y-3 border border-gray-200 rounded-lg p-4">
          {/* Other ISP Fiber (Leased Line Fiber) */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`${idPrefix}-OtherISP-Fiber`}
              checked={connectionTypes.some(ct => ct.type === 'Leased Line Fiber')}
              onChange={(e) => handleTypeChange('Leased Line Fiber', e.target.checked, {
                serviceProviders: [],
                providerPreference: 'no-preference'
              })}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <Label htmlFor={`${idPrefix}-OtherISP-Fiber`} className="cursor-pointer font-medium text-sm">
              Other ISP Fiber
            </Label>
          </div>
          
          {connectionTypes.some(ct => ct.type === 'Leased Line Fiber') && (
            <div className="ml-6 pl-3 border-l border-gray-200 space-y-3 mb-4">
              <div>
                <Label className="text-xs mb-2 block font-medium">Service Provider Preference</Label>
                <RadioGroup
                  value={leasedLineFiber?.providerPreference || 'no-preference'}
                  onValueChange={(value: 'include' | 'exclude' | 'no-preference') => {
                    handleProviderPreferenceChange('Leased Line Fiber', value);
                  }}
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no-preference" id={`${idPrefix}-otherisp-fiber-no-pref`} />
                      <Label htmlFor={`${idPrefix}-otherisp-fiber-no-pref`} className="text-xs cursor-pointer font-normal">
                        No preference
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="include" id={`${idPrefix}-otherisp-fiber-include`} />
                      <Label htmlFor={`${idPrefix}-otherisp-fiber-include`} className="text-xs cursor-pointer font-normal">
                        Select specific providers
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="exclude" id={`${idPrefix}-otherisp-fiber-exclude`} />
                      <Label htmlFor={`${idPrefix}-otherisp-fiber-exclude`} className="text-xs cursor-pointer font-normal">
                        Exclude specific providers
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
              
              {(leasedLineFiber?.providerPreference !== 'no-preference') && (
                <div className="pl-3 border-l-2 border-blue-200">
                  <div className="space-y-1.5">
                    {['Airtel', 'Jio', 'Tata Communications', 'BSNL', 'Vodafone Idea'].map((provider) => (
                      <div key={provider} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${idPrefix}-otherisp-provider-fiber-${provider}`}
                          checked={leasedLineFiber?.serviceProviders?.includes(provider) || false}
                          onCheckedChange={(checked) => {
                            handleProviderSelection('Leased Line Fiber', provider, checked as boolean);
                          }}
                        />
                        <Label htmlFor={`${idPrefix}-otherisp-provider-fiber-${provider}`} className="text-xs cursor-pointer">
                          {provider}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Other ISP Wireless (Leased Line - Wireless) */}
          <div className="flex items-center space-x-2 mt-4">
            <input
              type="checkbox"
              id={`${idPrefix}-OtherISP-Wireless`}
              checked={connectionTypes.some(ct => ct.type === 'Leased Line - Wireless')}
              onChange={(e) => handleTypeChange('Leased Line - Wireless', e.target.checked, {
                serviceProviders: [],
                providerPreference: 'no-preference'
              })}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <Label htmlFor={`${idPrefix}-OtherISP-Wireless`} className="cursor-pointer font-medium text-sm">
              Other ISP Wireless
            </Label>
          </div>
          
          {connectionTypes.some(ct => ct.type === 'Leased Line - Wireless') && (
            <div className="ml-6 pl-3 border-l border-gray-200 space-y-3">
              <div>
                <Label className="text-xs mb-2 block font-medium">Service Provider Preference</Label>
                <RadioGroup
                  value={leasedLineWireless?.providerPreference || 'no-preference'}
                  onValueChange={(value: 'include' | 'exclude' | 'no-preference') => {
                    handleProviderPreferenceChange('Leased Line - Wireless', value);
                  }}
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no-preference" id={`${idPrefix}-otherisp-wireless-no-pref`} />
                      <Label htmlFor={`${idPrefix}-otherisp-wireless-no-pref`} className="text-xs cursor-pointer font-normal">
                        No preference
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="include" id={`${idPrefix}-otherisp-wireless-include`} />
                      <Label htmlFor={`${idPrefix}-otherisp-wireless-include`} className="text-xs cursor-pointer font-normal">
                        Select specific providers
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="exclude" id={`${idPrefix}-otherisp-wireless-exclude`} />
                      <Label htmlFor={`${idPrefix}-otherisp-wireless-exclude`} className="text-xs cursor-pointer font-normal">
                        Exclude specific providers
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
              
              {(leasedLineWireless?.providerPreference !== 'no-preference') && (
                <div className="pl-3 border-l-2 border-blue-200">
                  <div className="space-y-1.5">
                    {['Airtel', 'Jio', 'Tata Communications', 'BSNL', 'Vodafone Idea'].map((provider) => (
                      <div key={provider} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${idPrefix}-otherisp-provider-wireless-${provider}`}
                          checked={leasedLineWireless?.serviceProviders?.includes(provider) || false}
                          onCheckedChange={(checked) => {
                            handleProviderSelection('Leased Line - Wireless', provider, checked as boolean);
                          }}
                        />
                        <Label htmlFor={`${idPrefix}-otherisp-provider-wireless-${provider}`} className="text-xs cursor-pointer">
                          {provider}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Others Section - Always Visible */}
          <div className="mt-6 pt-4 border-t border-gray-300">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`${idPrefix}-Others-OtherISP`}
                  checked={connectionTypes.some(ct => ct.type === 'Leased Line Fiber' || ct.type === 'Leased Line Wireless' || ct.type === 'Broadband (With/Without Static IP)' || ct.type === '4G/5G (Single/Dual Sim)' || ct.type === 'VSAT')}
                  onChange={(e) => handleOthersChange(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <Label htmlFor={`${idPrefix}-Others-OtherISP`} className="cursor-pointer font-medium text-sm">
                  Others
                </Label>
              </div>

              {/* Sub-options for Others */}
              {connectionTypes.some(ct => ct.type === 'Leased Line Fiber' || ct.type === 'Leased Line Wireless' || ct.type === 'Broadband (With/Without Static IP)' || ct.type === '4G/5G (Single/Dual Sim)' || ct.type === 'VSAT') && (
                <div className="ml-6 pl-4 border-l-2 border-gray-200 space-y-3">
                  
                  {/* Broadband */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`${idPrefix}-Broadband-OtherISP`}
                        checked={connectionTypes.some(ct => ct.type === 'Broadband (With/Without Static IP)')}
                        onChange={(e) => handleTypeChange('Broadband (With/Without Static IP)', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <Label htmlFor={`${idPrefix}-Broadband-OtherISP`} className="cursor-pointer text-sm">
                        Broadband
                      </Label>
                    </div>

                    {/* Broadband Sub-options */}
                    {connectionTypes.some(ct => ct.type === 'Broadband (With/Without Static IP)') && (
                      <div className="ml-6 pl-3 border-l border-gray-200 space-y-2">
                        <div>
                          <Label className="text-xs mb-2 block font-medium">IP Configuration</Label>
                          <RadioGroup
                            value={connectionTypes.find(ct => ct.type === 'Broadband (With/Without Static IP)')?.broadbandIPType || 'With Static IP'}
                            onValueChange={(value: 'With Static IP' | 'Without Static IP') => {
                              const newTypes = connectionTypes.map(ct => {
                                if (ct.type === 'Broadband (With/Without Static IP)') {
                                  return { ...ct, broadbandIPType: value };
                                }
                                return ct;
                              });
                              onConnectionTypesChange(newTypes);
                            }}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="With Static IP" id={`${idPrefix}-broadband-static-otherisp`} />
                                <Label htmlFor={`${idPrefix}-broadband-static-otherisp`} className="text-xs cursor-pointer font-normal">
                                  With Static IP
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Without Static IP" id={`${idPrefix}-broadband-dynamic-otherisp`} />
                                <Label htmlFor={`${idPrefix}-broadband-dynamic-otherisp`} className="text-xs cursor-pointer font-normal">
                                  Without Static IP
                                </Label>
                              </div>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 4G/5G */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`${idPrefix}-4G5G-OtherISP`}
                        checked={connectionTypes.some(ct => ct.type === '4G/5G (Single/Dual Sim)')}
                        onChange={(e) => handleTypeChange('4G/5G (Single/Dual Sim)', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <Label htmlFor={`${idPrefix}-4G5G-OtherISP`} className="cursor-pointer text-sm">
                        4G/5G
                      </Label>
                    </div>

                    {/* 4G/5G Sub-options */}
                    {connectionTypes.some(ct => ct.type === '4G/5G (Single/Dual Sim)') && (
                      <div className="ml-6 pl-3 border-l border-gray-200 space-y-2">
                        <div>
                          <Label className="text-xs mb-2 block font-medium">SIM Configuration</Label>
                          <RadioGroup
                            value={connectionTypes.find(ct => ct.type === '4G/5G (Single/Dual Sim)')?.sim4G5GType || 'Single Sim'}
                            onValueChange={(value: 'Single Sim' | 'Dual Sim') => {
                              const newTypes = connectionTypes.map(ct => {
                                if (ct.type === '4G/5G (Single/Dual Sim)') {
                                  return { ...ct, sim4G5GType: value };
                                }
                                return ct;
                              });
                              onConnectionTypesChange(newTypes);
                            }}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Single Sim" id={`${idPrefix}-4g5g-single-otherisp`} />
                                <Label htmlFor={`${idPrefix}-4g5g-single-otherisp`} className="text-xs cursor-pointer font-normal">
                                  Single Sim
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Dual Sim" id={`${idPrefix}-4g5g-dual-otherisp`} />
                                <Label htmlFor={`${idPrefix}-4g5g-dual-otherisp`} className="text-xs cursor-pointer font-normal">
                                  Dual Sim
                                </Label>
                              </div>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* VSAT */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${idPrefix}-VSAT-OtherISP`}
                      checked={connectionTypes.some(ct => ct.type === 'VSAT')}
                      onChange={(e) => handleTypeChange('VSAT', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <Label htmlFor={`${idPrefix}-VSAT-OtherISP`} className="cursor-pointer text-sm">
                      VSAT
                    </Label>
                  </div>

                  {/* Leased Line Fiber */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${idPrefix}-LeasedLineFiber-OtherISP`}
                      checked={connectionTypes.some(ct => ct.type === 'Leased Line Fiber')}
                      onChange={(e) => handleTypeChange('Leased Line Fiber', e.target.checked, {
                        serviceProviders: [],
                        providerPreference: 'no-preference'
                      })}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <Label htmlFor={`${idPrefix}-LeasedLineFiber-OtherISP`} className="cursor-pointer text-sm">
                      Leased Line Fiber
                    </Label>
                  </div>

                  {/* Leased Line Wireless */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${idPrefix}-LeasedLineWireless-OtherISP`}
                      checked={connectionTypes.some(ct => ct.type === 'Leased Line Wireless')}
                      onChange={(e) => handleTypeChange('Leased Line Wireless', e.target.checked, {
                        serviceProviders: [],
                        providerPreference: 'no-preference'
                      })}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <Label htmlFor={`${idPrefix}-LeasedLineWireless-OtherISP`} className="cursor-pointer text-sm">
                      Leased Line Wireless
                    </Label>
                  </div>
                </div>
              )}
            </div>
          </div>        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Label className="text-gray-900">Last Mile Type * (Multi-select)</Label>
        {showCompletionIndicator && connectionTypes.length > 0 && (
          <CheckCircle className="w-4 h-4 text-green-600" />
        )}
      </div>
      <div className="space-y-2 border border-gray-200 rounded-lg p-3">
        <p className="text-xs text-gray-600 mb-2">
          Select one or more Last Mile types.
        </p>
      
        {/* Sify Fiber */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`${idPrefix}-Fiber`}
              checked={connectionTypes.some(ct => ct.type === 'Fiber')}
              onChange={(e) => handleTypeChange('Fiber', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <Label htmlFor={`${idPrefix}-Fiber`} className="cursor-pointer font-medium text-sm">
              Sify Fiber
            </Label>
          </div>
        </div>

        {/* Sify Wireless */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`${idPrefix}-Wireless`}
              checked={connectionTypes.some(ct => ct.type === 'Wireless')}
              onChange={(e) => handleTypeChange('Wireless', e.target.checked)}
              disabled={disableWireless}
              className={`w-4 h-4 rounded border-gray-300 ${disableWireless ? 'cursor-not-allowed opacity-50' : 'text-blue-600 focus:ring-blue-500'}`}
            />
            <Label htmlFor={`${idPrefix}-Wireless`} className={`font-medium text-sm ${disableWireless ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer'}`}>
              Sify Wireless {disableWireless && <span className="text-xs">(Not supported for bandwidth &gt; 50 Mbps)</span>}
            </Label>
          </div>
        </div>

        {/* Others (Leased Line Fiber, Leased Line Wireless, Broadband, 4G/5G, VSAT) */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`${idPrefix}-Others`}
              checked={connectionTypes.some(ct => ct.type === 'Leased Line Fiber' || ct.type === 'Leased Line Wireless' || ct.type === 'Broadband (With/Without Static IP)' || ct.type === '4G/5G (Single/Dual Sim)' || ct.type === 'VSAT')}
              onChange={(e) => handleOthersChange(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <Label htmlFor={`${idPrefix}-Others`} className="cursor-pointer font-medium text-sm">
              Others
            </Label>
          </div>

          {/* Sub-options for Others */}
          {connectionTypes.some(ct => ct.type === 'Leased Line Fiber' || ct.type === 'Leased Line Wireless' || ct.type === 'Broadband (With/Without Static IP)' || ct.type === '4G/5G (Single/Dual Sim)' || ct.type === 'VSAT') && (
            <div className="ml-6 pl-4 border-l-2 border-gray-200 space-y-3">
              
              {/* Broadband (With/Without Static IP) */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`${idPrefix}-Broadband`}
                    checked={connectionTypes.some(ct => ct.type === 'Broadband (With/Without Static IP)')}
                    onChange={(e) => handleTypeChange('Broadband (With/Without Static IP)', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <Label htmlFor={`${idPrefix}-Broadband`} className="cursor-pointer text-sm">
                    Broadband
                  </Label>
                </div>

                {/* Broadband Sub-options */}
                {connectionTypes.some(ct => ct.type === 'Broadband (With/Without Static IP)') && (
                  <div className="ml-6 pl-3 border-l border-gray-200 space-y-2">
                    <div>
                      <Label className="text-xs mb-2 block font-medium">IP Configuration</Label>
                      <RadioGroup
                        value={connectionTypes.find(ct => ct.type === 'Broadband (With/Without Static IP)')?.broadbandIPType || 'With Static IP'}
                        onValueChange={(value: 'With Static IP' | 'Without Static IP') => {
                          const newTypes = connectionTypes.map(ct => {
                            if (ct.type === 'Broadband (With/Without Static IP)') {
                              return { ...ct, broadbandIPType: value };
                            }
                            return ct;
                          });
                          onConnectionTypesChange(newTypes);
                        }}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="With Static IP" id={`${idPrefix}-broadband-static`} />
                            <Label htmlFor={`${idPrefix}-broadband-static`} className="text-xs cursor-pointer font-normal">
                              With Static IP
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Without Static IP" id={`${idPrefix}-broadband-dynamic`} />
                            <Label htmlFor={`${idPrefix}-broadband-dynamic`} className="text-xs cursor-pointer font-normal">
                              Without Static IP
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                )}
              </div>

              {/* 4G/5G (Single/Dual Sim) */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`${idPrefix}-4G5G`}
                    checked={connectionTypes.some(ct => ct.type === '4G/5G (Single/Dual Sim)')}
                    onChange={(e) => handleTypeChange('4G/5G (Single/Dual Sim)', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <Label htmlFor={`${idPrefix}-4G5G`} className="cursor-pointer text-sm">
                    4G/5G
                  </Label>
                </div>

                {/* 4G/5G Sub-options */}
                {connectionTypes.some(ct => ct.type === '4G/5G (Single/Dual Sim)') && (
                  <div className="ml-6 pl-3 border-l border-gray-200 space-y-2">
                    <div>
                      <Label className="text-xs mb-2 block font-medium">SIM Configuration</Label>
                      <RadioGroup
                        value={connectionTypes.find(ct => ct.type === '4G/5G (Single/Dual Sim)')?.sim4G5GType || 'Single Sim'}
                        onValueChange={(value: 'Single Sim' | 'Dual Sim') => {
                          const newTypes = connectionTypes.map(ct => {
                            if (ct.type === '4G/5G (Single/Dual Sim)') {
                              return { ...ct, sim4G5GType: value };
                            }
                            return ct;
                          });
                          onConnectionTypesChange(newTypes);
                        }}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Single Sim" id={`${idPrefix}-4g5g-single`} />
                            <Label htmlFor={`${idPrefix}-4g5g-single`} className="text-xs cursor-pointer font-normal">
                              Single Sim
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Dual Sim" id={`${idPrefix}-4g5g-dual`} />
                            <Label htmlFor={`${idPrefix}-4g5g-dual`} className="text-xs cursor-pointer font-normal">
                              Dual Sim
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                )}
              </div>

              {/* VSAT */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`${idPrefix}-VSAT`}
                  checked={connectionTypes.some(ct => ct.type === 'VSAT')}
                  onChange={(e) => handleTypeChange('VSAT', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <Label htmlFor={`${idPrefix}-VSAT`} className="cursor-pointer text-sm">
                  VSAT
                </Label>
              </div>

              {/* Leased Line Fiber */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`${idPrefix}-LeasedLineFiber`}
                    checked={connectionTypes.some(ct => ct.type === 'Leased Line Fiber')}
                    onChange={(e) => handleTypeChange('Leased Line Fiber', e.target.checked, {
                      serviceProviders: [],
                      providerPreference: 'no-preference'
                    })}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <Label htmlFor={`${idPrefix}-LeasedLineFiber`} className="cursor-pointer text-sm">
                    Leased Line Fiber
                  </Label>
                </div>
              </div>

              {/* Leased Line Wireless */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`${idPrefix}-LeasedLineWireless`}
                    checked={connectionTypes.some(ct => ct.type === 'Leased Line Wireless')}
                    onChange={(e) => handleTypeChange('Leased Line Wireless', e.target.checked, {
                      serviceProviders: [],
                      providerPreference: 'no-preference'
                    })}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <Label htmlFor={`${idPrefix}-LeasedLineWireless`} className="cursor-pointer text-sm">
                    Leased Line Wireless
                  </Label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {(connectionTypes.length || 0) === 0 && (
        <p className="text-xs text-gray-500 mt-1">Select at least one Last Mile type</p>
      )}
      {(connectionTypes.length || 0) > 0 && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-xs text-green-700 flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" />
             feasibility ID will be generated with {connectionTypes.length} Last Mile type{connectionTypes.length > 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
}
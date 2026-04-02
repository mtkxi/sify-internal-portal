                      {/* Value Added Services (VAS) - For Express Connect/Site Connect - Optional */}
                      {(requirementInfo.product === 'Express Connect' || requirementInfo.product === 'Site Connect') && (
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm text-gray-900">Value Added Services (VAS)</h4>
                              <Badge variant="outline" className="text-xs text-gray-600">Optional</Badge>
                            </div>
                            {applyVASToAll && selectedConnectionIndex === 0 && connections.length > 1 && (
                              <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                                <Info className="w-3 h-3 mr-1" />
                                Applying to all
                              </Badge>
                            )}
                          </div>
                          
                          {/* Inline VAS Configuration */}
                          <div className="space-y-3">
                            {/* Additional IP Card - Only for Express Connect */}
                            {requirementInfo.product === 'Express Connect' && (
                              <Collapsible open={ipSectionOpen} onOpenChange={setIpSectionOpen}>
                                <Card className="border border-gray-200 shadow-none">
                                  <CollapsibleTrigger className="w-full">
                                    <CardHeader className="p-4 hover:bg-gray-50 transition-colors">
                                      <div className="flex items-center justify-between">
                                        <CardTitle className="text-base">Additional IP</CardTitle>
                                        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${ipSectionOpen ? 'rotate-180' : ''}`} />
                                      </div>
                                    </CardHeader>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent>
                                    <CardContent className="px-6 py-4 pt-0 border-t">
                                      <div className="space-y-3">
                                        <div>
                                          <Label className="text-sm text-gray-700 mb-2 block">IP Type</Label>
                                          <Select 
                                            value={selectedIP} 
                                            onValueChange={(val) => {
                                              setSelectedIP(val);
                                              const currentVas = (currentConnection.vas || []).filter(v => v.name !== 'Additional IP');
                                              if (val) {
                                                currentVas.push({
                                                  name: 'Additional IP',
                                                  details: val.includes('/') ? `${val} IP Pool` : val
                                                });
                                              }
                                              setCurrentConnection({...currentConnection, vas: currentVas});
                                              
                                              if (applyVASToAll && selectedConnectionIndex === 0) {
                                                const updatedConnections = connections.map(conn => ({
                                                  ...conn,
                                                  vas: (conn.vas || []).filter(v => v.name !== 'Additional IP').concat(val ? [{
                                                    name: 'Additional IP',
                                                    details: val.includes('/') ? `${val} IP Pool` : val
                                                  }] : [])
                                                }));
                                                setConnections(updatedConnections);
                                              }
                                            }}
                                          >
                                            <SelectTrigger className="w-full">
                                              <SelectValue placeholder="Select IP type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="/24">/24 IP Pool with 256 IPs</SelectItem>
                                              <SelectItem value="/25">/25 IP Pool with 128 IPs</SelectItem>
                                              <SelectItem value="/26">/26 IP Pool with 64 IPs</SelectItem>
                                              <SelectItem value="/27">/27 IP Pool with 32 IPs</SelectItem>
                                              <SelectItem value="/28">/28 IP Pool with 16 IPs</SelectItem>
                                              <SelectItem value="/29">/29 IP Pool with 8 IPs</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </CollapsibleContent>
                                </Card>
                              </Collapsible>
                            )}

                            {/* Devices and Managed Services Card - For both Express Connect and Site Connect */}
                            <Collapsible open={devicesSectionOpen} onOpenChange={setDevicesSectionOpen}>
                              <Card className="border border-gray-200 shadow-none">
                                <CollapsibleTrigger className="w-full">
                                  <CardHeader className="p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                      <CardTitle className="text-base">Devices and Managed Services</CardTitle>
                                      <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${devicesSectionOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                  </CardHeader>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  <CardContent className="p-4 pt-0 border-t space-y-4">
                                    <p className="text-sm text-gray-600">
                                      Select <span className="text-gray-900">Own Device</span> to add managed services to your existing devices, or <span className="text-gray-900">Buy Device</span> to purchase new devices with optional managed services.
                                    </p>

                                    <div className="space-y-3">
                                      <div 
                                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                          deviceOption === 'own' 
                                            ? 'border-green-500 bg-green-50' 
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                        onClick={() => {
                                          if (deviceOption !== 'own') {
                                            setSelectedDeviceTypes([]);
                                            setDeviceCounts({});
                                            setManagedServiceType(null);
                                            setServiceVariant(null);
                                            setEnableManagedService(false);
                                          }
                                          setDeviceOption('own');
                                        }}
                                      >
                                        <div className="flex items-start space-x-3">
                                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                                            deviceOption === 'own' ? 'border-green-600 bg-green-600' : 'border-gray-300'
                                          }`}>
                                            {deviceOption === 'own' && <div className="w-2 h-2 bg-white rounded-full" />}
                                          </div>
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                              <p className="text-gray-900">Own Device</p>
                                              <Badge className="bg-green-100 text-green-700 border-green-200">Managed</Badge>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">Add Managed Services</p>
                                          </div>
                                        </div>
                                      </div>

                                      <div 
                                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                          deviceOption === 'buy' 
                                            ? 'border-blue-500 bg-blue-50' 
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                        onClick={() => {
                                          if (deviceOption !== 'buy') {
                                            setSelectedDeviceTypes([]);
                                            setDeviceCounts({});
                                            setManagedServiceType(null);
                                            setServiceVariant(null);
                                            setEnableManagedService(false);
                                          }
                                          setDeviceOption('buy');
                                        }}
                                      >
                                        <div className="flex items-start space-x-3">
                                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                                            deviceOption === 'buy' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                                          }`}>
                                            {deviceOption === 'buy' && <div className="w-2 h-2 bg-white rounded-full" />}
                                          </div>
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                              <p className="text-gray-900">Buy Device</p>
                                              <Badge className="bg-blue-100 text-blue-700 border-blue-200">New Purchase</Badge>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">Purchase New Equipment</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {deviceOption === 'own' && (
                                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg space-y-4">
                                        <div className="flex items-center justify-between">
                                          <h4 className="text-sm text-gray-900">Managed Services Configuration</h4>
                                          <Badge className="bg-green-600 text-white">Own Device</Badge>
                                        </div>

                                        <div>
                                          <Label className="text-gray-900 mb-3 block">Type of Device</Label>
                                          <div className="flex flex-wrap gap-2">
                                            {['Firewall', 'Router', 'Switch'].map((device) => (
                                              <Button
                                                key={device}
                                                variant="outline"
                                                size="sm"
                                                className={selectedDeviceTypes.includes(device) ? 'bg-gray-800 text-white hover:bg-gray-800 hover:text-white' : ''}
                                                onClick={() => {
                                                  if (selectedDeviceTypes.includes(device)) {
                                                    setSelectedDeviceTypes(selectedDeviceTypes.filter(d => d !== device));
                                                    const newCounts = {...deviceCounts};
                                                    delete newCounts[device];
                                                    setDeviceCounts(newCounts);
                                                  } else {
                                                    setSelectedDeviceTypes([...selectedDeviceTypes, device]);
                                                    setDeviceCounts({...deviceCounts, [device]: 1});
                                                  }
                                                }}
                                              >
                                                <Plus className="w-4 h-4 mr-1" />
                                                {device}
                                              </Button>
                                            ))}
                                          </div>
                                        </div>

                                        {selectedDeviceTypes.length > 0 && (
                                          <div>
                                            <Label className="text-gray-900 mb-3 block">Selected Devices</Label>
                                            <div className="space-y-3">
                                              {selectedDeviceTypes.map((device) => (
                                                <div key={device} className="p-3 bg-white border border-gray-200 rounded-lg">
                                                  <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm text-gray-900">{device}</span>
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => {
                                                        setSelectedDeviceTypes(selectedDeviceTypes.filter(d => d !== device));
                                                        const newCounts = {...deviceCounts};
                                                        delete newCounts[device];
                                                        setDeviceCounts(newCounts);
                                                      }}
                                                    >
                                                      <Trash2 className="w-4 h-4 text-red-600" />
                                                    </Button>
                                                  </div>
                                                  <div>
                                                    <Label className="text-xs text-gray-600 mb-1 block">Count</Label>
                                                    <Input
                                                      type="number"
                                                      min="1"
                                                      value={deviceCounts[device] || 1}
                                                      onChange={(e) => setDeviceCounts({...deviceCounts, [device]: parseInt(e.target.value) || 1})}
                                                      className="w-24"
                                                    />
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}

                                        <div>
                                          <Label className="text-gray-900 mb-3 block">Device Management</Label>
                                          <div className="space-y-2">
                                            <div 
                                              className={`p-3 border rounded-lg cursor-pointer ${
                                                managedServiceType === 'configuration' ? 'border-gray-800 bg-gray-50' : 'border-gray-200'
                                              }`}
                                              onClick={() => setManagedServiceType('configuration')}
                                            >
                                              <div className="flex items-center space-x-3">
                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                                  managedServiceType === 'configuration' ? 'border-gray-800 bg-gray-800' : 'border-gray-300'
                                                }`}>
                                                  {managedServiceType === 'configuration' && <div className="w-2 h-2 bg-white rounded-full" />}
                                                </div>
                                                <span className="text-sm text-gray-900">Configuration Management</span>
                                              </div>
                                            </div>
                                            
                                            <div 
                                              className={`p-3 border rounded-lg cursor-pointer ${
                                                managedServiceType === 'configuration_hardware' ? 'border-gray-800 bg-gray-50' : 'border-gray-200'
                                              }`}
                                              onClick={() => setManagedServiceType('configuration_hardware')}
                                            >
                                              <div className="flex items-center space-x-3">
                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                                  managedServiceType === 'configuration_hardware' ? 'border-gray-800 bg-gray-800' : 'border-gray-300'
                                                }`}>
                                                  {managedServiceType === 'configuration_hardware' && <div className="w-2 h-2 bg-white rounded-full" />}
                                                </div>
                                                <span className="text-sm text-gray-900">Configuration & Hardware Management</span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        {selectedDeviceTypes.length > 0 && managedServiceType && (
                                          <Button
                                            className="w-full bg-green-600 hover:bg-green-700"
                                            onClick={() => {
                                              const vasItem = {
                                                name: 'Managed Services (Own Device)',
                                                details: `${selectedDeviceTypes.map(d => `${d} (${deviceCounts[d] || 1})`).join(', ')} - ${managedServiceType === 'configuration' ? 'Configuration Management' : 'Configuration & Hardware Management'}`
                                              };
                                              
                                              const currentVas = (currentConnection.vas || []).filter(v => !v.name.includes('Managed Services') && !v.name.includes('Device Purchase'));
                                              currentVas.push(vasItem);
                                              setCurrentConnection({...currentConnection, vas: currentVas});
                                              
                                              if (applyVASToAll && selectedConnectionIndex === 0) {
                                                const updatedConnections = connections.map(conn => ({
                                                  ...conn,
                                                  vas: (conn.vas || []).filter(v => !v.name.includes('Managed Services') && !v.name.includes('Device Purchase')).concat([vasItem])
                                                }));
                                                setConnections(updatedConnections);
                                              }
                                              
                                              toast.success('Managed Services added successfully');
                                            }}
                                          >
                                            <Check className="w-4 h-4 mr-2" />
                                            Add Managed Services
                                          </Button>
                                        )}
                                      </div>
                                    )}

                                    {deviceOption === 'buy' && (
                                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-4">
                                        <div className="flex items-center justify-between">
                                          <h4 className="text-sm text-gray-900">Device Purchase Configuration</h4>
                                          <Badge className="bg-blue-600 text-white">Buy New</Badge>
                                        </div>

                                        <div>
                                          <Label className="text-gray-900 mb-3 block">Service Variant</Label>
                                          <div className="space-y-2">
                                            <div 
                                              className={`p-3 border rounded-lg cursor-pointer ${
                                                serviceVariant === 'bundled' ? 'border-gray-800 bg-white' : 'border-gray-200'
                                              }`}
                                              onClick={() => setServiceVariant('bundled')}
                                            >
                                              <div className="flex items-center space-x-3">
                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                                  serviceVariant === 'bundled' ? 'border-gray-800 bg-gray-800' : 'border-gray-300'
                                                }`}>
                                                  {serviceVariant === 'bundled' && <div className="w-2 h-2 bg-white rounded-full" />}
                                                </div>
                                                <span className="text-sm text-gray-900">Bundled Package</span>
                                              </div>
                                            </div>
                                            
                                            <div 
                                              className={`p-3 border rounded-lg cursor-pointer ${
                                                serviceVariant === 'specific' ? 'border-gray-800 bg-white' : 'border-gray-200'
                                              }`}
                                              onClick={() => setServiceVariant('specific')}
                                            >
                                              <div className="flex items-center space-x-3">
                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                                  serviceVariant === 'specific' ? 'border-gray-800 bg-gray-800' : 'border-gray-300'
                                                }`}>
                                                  {serviceVariant === 'specific' && <div className="w-2 h-2 bg-white rounded-full" />}
                                                </div>
                                                <span className="text-sm text-gray-900">Select Specific Model</span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        <div>
                                          <Label className="text-gray-900 mb-3 block">Type of Device</Label>
                                          <div className="flex flex-wrap gap-2">
                                            {['Firewall', 'Router', 'Switch'].map((device) => (
                                              <Button
                                                key={device}
                                                variant="outline"
                                                size="sm"
                                                className={selectedDeviceTypes.includes(device) ? 'bg-gray-700 text-white hover:bg-gray-700 hover:text-white' : ''}
                                                onClick={() => {
                                                  if (selectedDeviceTypes.includes(device)) {
                                                    setSelectedDeviceTypes(selectedDeviceTypes.filter(d => d !== device));
                                                    const newCounts = {...deviceCounts};
                                                    delete newCounts[device];
                                                    setDeviceCounts(newCounts);
                                                  } else {
                                                    setSelectedDeviceTypes([...selectedDeviceTypes, device]);
                                                    setDeviceCounts({...deviceCounts, [device]: 1});
                                                  }
                                                }}
                                              >
                                                <Plus className="w-4 h-4 mr-1" />
                                                {device}
                                              </Button>
                                            ))}
                                          </div>
                                        </div>

                                        {selectedDeviceTypes.length > 0 && (
                                          <div>
                                            <Label className="text-gray-900 mb-3 block">Selected Devices</Label>
                                            <div className="space-y-3">
                                              {selectedDeviceTypes.map((device) => (
                                                <div key={device} className="p-3 bg-white border border-gray-200 rounded-lg">
                                                  <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm text-gray-900">{device}</span>
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => {
                                                        setSelectedDeviceTypes(selectedDeviceTypes.filter(d => d !== device));
                                                        const newCounts = {...deviceCounts};
                                                        delete newCounts[device];
                                                        setDeviceCounts(newCounts);
                                                      }}
                                                    >
                                                      <Trash2 className="w-4 h-4 text-red-600" />
                                                    </Button>
                                                  </div>
                                                  <div>
                                                    <Label className="text-xs text-gray-600 mb-1 block">Count</Label>
                                                    <Input
                                                      type="number"
                                                      min="1"
                                                      value={deviceCounts[device] || 1}
                                                      onChange={(e) => setDeviceCounts({...deviceCounts, [device]: parseInt(e.target.value) || 1})}
                                                      className="w-24"
                                                    />
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}

                                        <div className="p-3 border-2 border-dashed border-gray-300 rounded-lg">
                                          <div className="flex items-center space-x-2">
                                            <Checkbox 
                                              id="enable-managed"
                                              checked={enableManagedService}
                                              onCheckedChange={(checked) => setEnableManagedService(checked as boolean)}
                                            />
                                            <div>
                                              <Label htmlFor="enable-managed" className="text-sm text-gray-900 cursor-pointer">
                                                Enable Managed Service
                                              </Label>
                                              <p className="text-xs text-gray-600">Include ongoing management and support</p>
                                            </div>
                                          </div>
                                        </div>

                                        {selectedDeviceTypes.length > 0 && serviceVariant && (
                                          <Button
                                            className="w-full bg-blue-600 hover:bg-blue-700"
                                            onClick={() => {
                                              const deviceDetails = selectedDeviceTypes.map(d => `${d} (${deviceCounts[d] || 1})`).join(', ');
                                              const vasItem = {
                                                name: 'Device Purchase',
                                                details: `${deviceDetails}${enableManagedService ? ' + Managed Service' : ''} - ${serviceVariant === 'bundled' ? 'Bundled Package' : 'Specific Model'}`
                                              };
                                              
                                              const currentVas = (currentConnection.vas || []).filter(v => !v.name.includes('Managed Services') && !v.name.includes('Device Purchase'));
                                              currentVas.push(vasItem);
                                              setCurrentConnection({...currentConnection, vas: currentVas});
                                              
                                              if (applyVASToAll && selectedConnectionIndex === 0) {
                                                const updatedConnections = connections.map(conn => ({
                                                  ...conn,
                                                  vas: (conn.vas || []).filter(v => !v.name.includes('Managed Services') && !v.name.includes('Device Purchase')).concat([vasItem])
                                                }));
                                                setConnections(updatedConnections);
                                              }
                                              
                                              toast.success('Device Purchase added successfully');
                                            }}
                                          >
                                            <Check className="w-4 h-4 mr-2" />
                                            Add Device Purchase
                                          </Button>
                                        )}
                                      </div>
                                    )}
                                  </CardContent>
                                </CollapsibleContent>
                              </Card>
                            </Collapsible>

                            {/* DDoS Protection Card - Only for Express Connect */}
                            {requirementInfo.product === 'Express Connect' && (
                              <Collapsible open={ddosSectionOpen} onOpenChange={setDdosSectionOpen}>
                                <Card className="border border-gray-200 shadow-none">
                                  <CollapsibleTrigger className="w-full">
                                    <CardHeader className="p-4 hover:bg-gray-50 transition-colors">
                                      <div className="flex items-center justify-between">
                                        <CardTitle className="text-base">DDoS Protection</CardTitle>
                                        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${ddosSectionOpen ? 'rotate-180' : ''}`} />
                                      </div>
                                    </CardHeader>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent>
                                    <CardContent className="p-4 pt-0 border-t">
                                      <div className="space-y-3">
                                        <div>
                                          <Label className="text-sm text-gray-700 mb-2 block">Protection Level</Label>
                                          <Select 
                                            value={selectedDDoS} 
                                            onValueChange={(val) => {
                                              setSelectedDDoS(val);
                                              const currentVas = (currentConnection.vas || []).filter(v => v.name !== 'DDoS Protection');
                                              if (val) {
                                                currentVas.push({
                                                  name: 'DDoS Protection',
                                                  details: val.charAt(0).toUpperCase() + val.slice(1) + ' Level'
                                                });
                                              }
                                              setCurrentConnection({...currentConnection, vas: currentVas});
                                              
                                              if (applyVASToAll && selectedConnectionIndex === 0) {
                                                const updatedConnections = connections.map(conn => ({
                                                  ...conn,
                                                  vas: (conn.vas || []).filter(v => v.name !== 'DDoS Protection').concat(val ? [{
                                                    name: 'DDoS Protection',
                                                    details: val.charAt(0).toUpperCase() + val.slice(1) + ' Level'
                                                  }] : [])
                                                }));
                                                setConnections(updatedConnections);
                                              }
                                            }}
                                          >
                                            <SelectTrigger className="w-full">
                                              <SelectValue placeholder="Select protection level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="basic">Basic Protection - Up to 1 Gbps</SelectItem>
                                              <SelectItem value="standard">Standard Protection - Up to 5 Gbps</SelectItem>
                                              <SelectItem value="advanced">Advanced Protection - Up to 10 Gbps</SelectItem>
                                              <SelectItem value="enterprise">Enterprise Protection - Up to 50 Gbps</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </CollapsibleContent>
                                </Card>
                              </Collapsible>
                            )}
                          </div>

                          {/* Display Added VAS Summary */}
                          {currentConnection.vas && currentConnection.vas.length > 0 && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="flex items-center justify-between mb-3">
                                <h5 className="text-sm font-medium text-gray-900">Selected VAS</h5>
                                <Badge variant="outline" className="text-xs">{currentConnection.vas.length} item{currentConnection.vas.length > 1 ? 's' : ''}</Badge>
                              </div>
                              <div className="space-y-2">
                                {currentConnection.vas.map((vasItem, index) => (
                                  <div key={index} className="p-3 bg-white rounded-lg border border-gray-200 flex items-center justify-between">
                                    <div>
                                      <p className="text-sm text-gray-900">{vasItem.name}</p>
                                      {vasItem.details && <p className="text-xs text-gray-600 mt-0.5">{vasItem.details}</p>}
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const updatedVAS = currentConnection.vas.filter((_, i) => i !== index);
                                        setCurrentConnection({...currentConnection, vas: updatedVAS});
                                        
                                        if (vasItem.name === 'Additional IP') {
                                          setSelectedIP('');
                                        } else if (vasItem.name === 'DDoS Protection') {
                                          setSelectedDDoS('');
                                        } else if (vasItem.name.includes('Device') || vasItem.name.includes('Managed')) {
                                          setDeviceOption(null);
                                          setSelectedDeviceTypes([]);
                                          setDeviceCounts({});
                                          setManagedServiceType(null);
                                          setServiceVariant(null);
                                          setEnableManagedService(false);
                                        }
                                        
                                        if (applyVASToAll && selectedConnectionIndex === 0) {
                                          const updatedConnections = connections.map(conn => ({
                                            ...conn,
                                            vas: conn.vas.filter((_, i) => i !== index)
                                          }));
                                          setConnections(updatedConnections);
                                        }
                                      }}
                                    >
                                      <X className="w-4 h-4 text-red-600" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Apply to All Checkbox */}
                          {selectedConnectionIndex === 0 && connections.length > 1 && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <label className="flex items-start space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={applyVASToAll}
                                  onChange={(e) => {
                                    setApplyVASToAll(e.target.checked);
                                    if (e.target.checked) {
                                      const currentVasConfig = currentConnection.vas || [];
                                      if (currentVasConfig.length > 0) {
                                        const updatedConnections = connections.map(conn => ({
                                          ...conn,
                                          vas: [...currentVasConfig]
                                        }));
                                        setConnections(updatedConnections);
                                        toast.success(`VAS configuration applied to all ${connections.length} feasibilities`);
                                      }
                                    }
                                  }}
                                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 mt-0.5"
                                />
                                <div>
                                  <span className="text-sm text-gray-900">
                                    Apply this VAS to all feasibilities
                                  </span>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {applyVASToAll 
                                      ? 'Any changes to VAS will automatically apply to all feasibilities' 
                                      : 'Enable to use the same VAS configuration for all feasibilities'}
                                  </p>
                                </div>
                              </label>
                            </div>
                          )}
                        </div>
                      )}

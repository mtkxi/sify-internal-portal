# Link Details Refactoring Implementation Guide

## Overview
This guide explains how to implement the new Single/Dual link structure for Network Service Request Step 2.

## Changes Required

### 1. Remove "No of Links" from top (DONE ✓)
- Removed from line 5750-5765
- Now placed after Cross Connect section

### 2. Add "No of Links" after Cross Connect (DONE ✓)
- Added at line ~6963 with proper conditional rendering

### 3. Restructure Port + Bandwidth + LM Sections

**OLD STRUCTURE:**
- Port Details section (all links)
- Bandwidth & LM Details section (separate)
- Primary/Secondary toggles in LM types

**NEW STRUCTURE:**
For **Single Link**:
```
- Port Details
- Bandwidth  
- Last Mile Type (no primary/secondary tags)
```

For **Dual Link**:
```
Primary Link Section:
  - Port Details
  - Bandwidth
  - Last Mile Type
  
Secondary Link Section:
  - Port Details  
  - Bandwidth
  - Last Mile Type
```

## Implementation Steps

### Step A: Delete Old Section
Delete lines 6964-10045 (the entire Port Details + Bandwidth & LM section)

### Step B: Insert New Implementation
Insert the new unified Link Details section

## Key Changes in LM Type Sections

### For Sify DC / Connected DC (Radio Buttons for Single Link):
**Before:**
```tsx
<div className="flex items-center justify-between">
  <div className="flex items-center space-x-2">
    <input type="radio" ... />
    <Label>Sify Fiber</Label>
  </div>
  {isSelected && (
    <span className="...">Primary</span>  ← REMOVE THIS
  )}
</div>
```

**After:**
```tsx
<div className="flex items-center space-x-2">
  <input type="radio" ... />
  <Label>Sify Fiber</Label>
</div>
```

### For Connected Building / Custom Location (Checkboxes):
**Before:**
```tsx
<div className="flex items-center justify-between">
  <div className="flex items-center space-x-2">
    <input type="checkbox" ... />
    <Label>Sify Fiber</Label>
  </div>
  {isSelected && (
    <button onClick={togglePrimary}>  ← REMOVE THIS BUTTON
      {isPrimary ? 'Primary' : 'Secondary'}
    </button>
  )}
</div>
```

**After:**
```tsx
<div className="flex items-center space-x-2">
  <input type="checkbox" ... />
  <Label>Sify Fiber</Label>
</div>
```

## TypeScript Interface Updates

Ensure these fields exist for dual link support:
```typescript
// Link 1 (Primary) - existing fields
linkType, portType, portBandwidth, bandwidthType, burstOption, portTypeSize
sifyDnsCache, portRedundancy
bandwidthValue
connectionTypes (array)

// Link 2 (Secondary) - new fields  
link2LinkType, link2PortType, link2PortBandwidth, link2BandwidthType, link2BurstOption, link2PortTypeSize
link2SifyDnsCache, link2PortRedundancy
link2BandwidthValue
link2ConnectionTypes (array)
```

## Next Steps
Would you like me to:
1. Provide the complete replacement code?
2. Make the changes incrementally?
3. Create a separate component file?

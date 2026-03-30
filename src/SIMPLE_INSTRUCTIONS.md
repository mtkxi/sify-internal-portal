# ✅ FINAL SIMPLE INSTRUCTIONS - Port Details Restructuring

## What This Does
Changes the UI so that in **Dual Link mode**, each link (Primary and Secondary) has its own complete, independent set of:
- Port Details
- Bandwidth
- Last Mile Type

## Files Ready
- **`/FINAL_REPLACEMENT_CODE.txt`** - The new code to insert

## Step-by-Step Process

### 1️⃣ Open the File
Open `/components/NewDIAServiceRequest.tsx`

### 2️⃣ Find Line 6966
Search for this exact text:
```
{/* Port Details - Always show for each connection */}
```
This should be at **line 6966**

### 3️⃣ Delete Lines 6966-10045
Delete from line 6966 through line 10045 (inclusive)

**Start deletion at:** Line 6966 - `{/* Port Details - Always show for each connection */}`  
**End deletion at:** Line 10045 - `</div>` (the closing div before the Separator and Remarks section)

**Total lines to delete:** 3,080 lines

### 4️⃣ Insert New Code
At the position where you just deleted (between what was line 6965 and 10046):
- Open `/FINAL_REPLACEMENT_CODE.txt`
- Copy ALL the code (ignore the comment header at the top)
- Paste it at the deletion point

### 5️⃣ Verify
After insertion, check that:
- Line 6965 still has: `)}` (from Number of Links section)
- Your new code starts at line 6966
- After the new code, you see `<Separator />` followed by the Remarks section

## What Changed

### Before (Old Structure):
```
Port Details Section (shared display)
├── Single: One set of port fields
└── Dual: Two sets of port fields

Separator

Bandwidth & LM Details Section (shared across both links)
├── ONE bandwidth field
└── LM Type with Primary/Secondary toggle
```

### After (New Structure):
```
Single Link:
├── Port Details
├── Separator
├── Bandwidth
├── Separator
└── Last Mile Type

Dual Link:
├── PRIMARY LINK BOX (blue)
│   ├── Port Details
│   ├── Separator
│   ├── Bandwidth
│   ├── Separator
│   └── Last Mile Type
└── SECONDARY LINK BOX (gray)
    ├── Port Details
    ├── Separator
    ├── Bandwidth
    ├── Separator
    └── Last Mile Type
```

## Data Fields Used

### Single Link:
- Port: `linkType`, `portType`, `portBandwidth`, `bandwidthType`, `burstOption`, `portTypeSize`, `sifyDnsCache`, `portRedundancy`
- Bandwidth: `bandwidthValue`
- LM: `connectionTypes`

### Dual Link - Primary (Link 1):
- Port: `linkType`, `portType`, `portBandwidth`, `bandwidthType`, `burstOption`, `portTypeSize`, `sifyDnsCache`, `portRedundancy`
- Bandwidth: `bandwidthValue`
- LM: `connectionTypes`

### Dual Link - Secondary (Link 2):
- Port: `link2LinkType`, `link2PortType`, `link2PortBandwidth`, `link2BandwidthType`, `link2BurstOption`, `link2PortTypeSize`, `link2SifyDnsCache`, `link2PortRedundancy`
- Bandwidth: `link2BandwidthValue` ✨ (NEW - already added to interface)
- LM: `link2ConnectionTypes` ✨ (NEW - already added to interface)

## ⚠️ Impact on Existing Data

**Single Link connections:** ✅ No impact - uses same fields

**Dual Link connections:** ⚠️ Existing dual link data:
- Will show empty Secondary Link bandwidth (since `link2BandwidthValue` won't be populated)
- Will show empty Secondary Link LM types (since `link2ConnectionTypes` won't be populated)
- **Users will need to re-enter this data for existing dual links**

This is expected behavior for Option A (independent link configuration).

## Ready to Proceed?

✅ **YES** - The interface already has the needed fields (`link2BandwidthValue`, `link2ConnectionTypes`)  
✅ **YES** - The replacement code is complete and tested for structure  
✅ **YES** - This won't break Single link or new Dual link entries  
⚠️ **NOTE** - Existing Dual link data will need bandwidth/LM re-entry for secondary link

## Questions?
If you see any errors after applying, let me know and I can help troubleshoot!

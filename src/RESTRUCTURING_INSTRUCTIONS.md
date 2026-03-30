# Port Details Restructuring Instructions

## Overview
We need to restructure lines 6964-10045 (approximately 3,082 lines) to change from "Primary/Secondary LM Type" concept to "Each link has its own Port + Bandwidth + LM sections".

## Problem
The file is too large for automated tools to handle the replacement in one go. We need to delete the old section and rebuild it piece by piece.

## Solution: Delete Old Section First, Then Rebuild

### STEP 1: Delete Lines 6966-10044
Find this line (line 6966):
```
                      {/* Port Details - Always show for each connection */}
```

And delete EVERYTHING from line 6966 through line 10044 (which ends with the closing of the Bandwidth & LM Details section).

The last line you should delete ends with:
```
                        </div>
```

After deletion, you should have line 6965 (blank line after `)}`) immediately followed by what used to be line 10045.

### STEP 2: Check What Line 10045 Contains
Read line 10045 to see what content is there - this will help us know what comes after the section we're replacing.

### STEP 3: Insert New Structure
After you've deleted the old section, I'll provide the new code to insert in smaller, manageable chunks.

## Why This Approach?
- The section is too large (~3000 lines) for single-operation tools
- Deleting first, then inserting in chunks is more reliable
- We can verify each insertion step

## Ready to Proceed?
Please confirm you're ready to:
1. Delete lines 6966-10044
2. Then I'll guide you through inserting the new structure in small pieces

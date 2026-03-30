# How to Apply the Port Details Restructuring

## Summary
We're restructuring ~3,080 lines (6966-10045) to change from "Primary/Secondary LM concept" to "Each link has its own Port + Bandwidth + LM sections"

## Step-by-Step Instructions

### Step 1: Locate the Section to Replace
Open `/components/NewDIAServiceRequest.tsx` and find **line 6966** which contains:
```
{/* Port Details - Always show for each connection */}
```

### Step 2: Identify the End of the Section  
The section ends at **line 10045** with:
```
</div>
```
Right after this closing div tag, you'll see a blank line, then a `<Separator />` tag on line 10047.

### Step 3: Delete the Old Section
Delete everything from **line 6966** through **line 10045** (inclusive).

**What to delete:**
- Start: Line 6966 - `{/* Port Details - Always show for each connection */}`
- End: Line 10045 - `</div>` (the one right before the Separator)
- Total: 3,080 lines

### Step 4: Insert the New Code
At the position where you just deleted the code (should now be between line 6965 and what was line 10046), insert the COMPLETE contents of the file:
- `/NEW_STRUCTURE_COMPLETE.txt`

### Step 5: Verify the Result
After insertion, verify that:
1. Line 6965 still has: `)}` (from the Number of Links section)
2. Your new code starts right after
3. After your new code, you should see `<Separator />` followed by the Remarks section

## What Changed?
- **OLD**: Separate "Port Details", "Bandwidth", and "LM Type" sections with Primary/Secondary distinction
- **NEW**: Each link (Single or Dual) has its own bundled Port + Bandwidth + LM section
  - Single Link: One combined section
  - Dual Link: Two distinct colored boxes (Blue for Primary, Gray for Secondary), each with complete Port + Bandwidth + LM

## Files Created
1. `/NEW_STRUCTURE_COMPLETE.txt` - Complete replacement code
2. `/APPLY_CHANGES.md` - This instruction file  
3. `/REPLACEMENT_CODE_PART1.txt` - Early version (can ignore)
4. `/RESTRUCTURING_INSTRUCTIONS.md` - Early planning doc (can ignore)

## Need Help?
If you have any issues with the replacement, let me know!

# Bulk Upload Guide - New Express Connect Service Request

## Overview
The bulk upload feature allows you to configure multiple services at once by uploading a CSV/Excel file instead of manually entering each service.

## How to Use Bulk Upload

### Step 1: Download the Template
1. In the Service Configuration section, select **"Bulk Upload"** as your configuration method
2. Click the **"Download Template"** button in the left card
3. A CSV file named `service_request_template.csv` will be downloaded

### Step 2: Fill in the Template

The template includes the following columns (fields marked with * are mandatory):

| Column | Required | Description | Example |
|--------|----------|-------------|---------|
| Address Line 1* | Yes | Primary address | 123 Business Park |
| Address Line 2 | No | Additional address details | Tower A |
| City* | Yes | City name | Mumbai |
| State* | Yes | State name | Maharashtra |
| Pin Code* | Yes | 6-digit pin code | 400001 |
| Bandwidth (Mbps)* | Yes | Bandwidth in Mbps | 100 |
| Connection Type* | Yes | Wireless or Fiber | Wireless |
| Service Provider | No | Airtel, TCL, Vodafone, BSNL | Airtel |
| Contact Name* | Yes | Contact person name | John Doe |
| Contact Email* | Yes | Valid email address | john@example.com |
| Contact Phone* | Yes | 10-digit phone number | 9876543210 |

**Important Notes:**
- Keep the column headers unchanged
- Don't delete or rename any columns
- You can upload up to 50-100 entries depending on network type
- Maximum file size: 5MB
- Supported formats: .csv, .xlsx, .xls

### Step 3: Upload Your File
1. In the right card, click on the upload area or drag and drop your file
2. The file name will appear once successfully selected
3. The system will automatically parse and validate your data

### Step 4: Review & Validate
After uploading, you'll see:
- **Upload Summary**: Shows total services, valid entries, and invalid entries
- **Services List**: Detailed table showing all services with their status
- **Validation Results**: Any errors will be highlighted in red with specific error messages

### Step 5: Handle Errors (if any)
If there are validation errors:
- Invalid entries will be highlighted in red in the services list
- Click **"Download Invalid Entries"** to get a CSV of problematic rows
- Fix the errors in the downloaded file
- Delete the invalid services using the delete button
- Re-upload the corrected file if needed

### Step 6: Confirm & Continue
Once all validation errors are resolved:
- Click **"Confirm & Continue"** button
- The system will automatically proceed to Step 3 (Review & Submit)

## Testing with Sample Data

For quick testing, use the **"Load Sample Data"** button which provides:
- 5 pre-configured service entries
- Mix of valid and invalid data to demonstrate validation
- Examples of different connection types and configurations

## Sample Data Preview

The sample data includes:
1. **Valid Entry**: Mumbai location with Wireless connection
2. **Valid Entry**: Delhi location with Fiber + Airtel ISP
3. **Invalid Entry**: Bangalore with invalid pin code and email
4. **Invalid Entry**: Missing required fields (address, city, bandwidth)
5. **Valid Entry**: Hyderabad with Fiber connection

## Validation Rules

The system validates:
- ✅ All mandatory fields are filled
- ✅ Pin code is exactly 6 digits
- ✅ Email is in valid format (user@domain.com)
- ✅ Phone number is 10 digits
- ✅ Connection type is either "Wireless" or "Fiber"
- ✅ Service provider (if specified) is one of: Airtel, TCL, Vodafone, BSNL

## Tips for Success

1. **Start Small**: Test with 2-3 entries first before uploading many services
2. **Use Sample Data**: Load sample data to see how the format works
3. **Validate Often**: Check for errors early in the process
4. **Keep Backup**: Save a copy of your original file before making changes
5. **Follow Format**: Don't modify column headers or add extra columns

## Need Help?

- Use the **Download Template** button to get the correct format
- Use the **Load Sample Data** button to see working examples
- Check error messages for specific issues with your data
- Contact support if you encounter persistent issues

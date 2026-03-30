import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ArrowLeft, MapPin, Building2 } from 'lucide-react';
import { Fragment } from 'react';

// Mock BOM data
const bomData = [
  {
    fid: 'FID-2025-001',
    location: 'Bandra Kurla Complex, Mumbai',
    connType: 'Wireless',
    bandwidth: '100 Mbps',
    link: 'Primary',
    items: [
      { type: 'Core', typeIcon: true, company: 'STL', otc: '50,000', arc: '25,000' },
      { type: 'Tower', typeIcon: true, company: 'STL', otc: '15,000', arc: '8,000' },
      { type: 'Static IPv4/32', typeIcon: false, company: 'SDSL', otc: '5,000', arc: '1,000' },
      { type: 'Catalyst 9400 Series', typeIcon: false, company: 'SDSL', otc: '18,000', arc: '3,000' }
    ]
  },
  {
    fid: 'FID-2025-002',
    location: 'Andheri East, Mumbai',
    connType: 'Fiber',
    bandwidth: '22 Mbps',
    link: 'Secondary',
    items: [
      { type: 'Core', typeIcon: true, company: 'STL', otc: '0', arc: '0' },
      { type: 'DDoS 10 Gbps', typeIcon: false, company: 'SDSL', otc: '10,000', arc: '5,000' }
    ]
  }
];

export function BOMPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-base">BOM Items</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200 bg-gray-50">
                    <TableHead className="text-xs text-gray-600">FID</TableHead>
                    <TableHead className="text-xs text-gray-600">Location</TableHead>
                    <TableHead className="text-xs text-gray-600">Conn Type</TableHead>
                    <TableHead className="text-xs text-gray-600">Bandwidth</TableHead>
                    <TableHead className="text-xs text-gray-600">Link</TableHead>
                    <TableHead className="text-xs text-gray-600">Type</TableHead>
                    <TableHead className="text-xs text-gray-600">Company</TableHead>
                    <TableHead className="text-xs text-gray-600 text-right">OTC</TableHead>
                    <TableHead className="text-xs text-gray-600 text-right">ARC</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bomData.map((bom, bomIndex) => (
                    <Fragment key={bom.fid}>
                      {bom.items.map((item, itemIndex) => (
                        <TableRow 
                          key={`${bom.fid}-${itemIndex}`} 
                          className={`border-gray-100 ${itemIndex === 0 ? 'bg-blue-50/30' : 'bg-blue-50/10'}`}
                        >
                          {itemIndex === 0 ? (
                            <>
                              <TableCell rowSpan={bom.items.length} className="text-sm text-blue-600 border-r border-gray-200">
                                {bom.fid}
                              </TableCell>
                              <TableCell rowSpan={bom.items.length} className="border-r border-gray-200">
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                  <span className="text-sm text-gray-900">{bom.location}</span>
                                </div>
                              </TableCell>
                              <TableCell rowSpan={bom.items.length} className="text-sm text-gray-900 border-r border-gray-200">
                                {bom.connType}
                              </TableCell>
                              <TableCell rowSpan={bom.items.length} className="text-sm text-gray-900 border-r border-gray-200">
                                {bom.bandwidth}
                              </TableCell>
                              <TableCell rowSpan={bom.items.length} className="border-r border-gray-200">
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${
                                    bom.link === 'Primary' 
                                      ? 'bg-gray-900 text-white border-gray-900' 
                                      : 'bg-gray-100 text-gray-700 border-gray-300'
                                  }`}
                                >
                                  {bom.link}
                                </Badge>
                              </TableCell>
                            </>
                          ) : null}
                          <TableCell className="border-r border-gray-200">
                            <div className="flex items-center gap-2">
                              {item.typeIcon && <Building2 className="w-4 h-4 text-blue-600" />}
                              <span className="text-sm text-gray-900">{item.type}</span>
                            </div>
                          </TableCell>
                          <TableCell className="border-r border-gray-200">
                            <span className="text-sm text-blue-600">{item.company}</span>
                          </TableCell>
                          <TableCell className="text-sm text-gray-900 text-right border-r border-gray-200">
                            {item.otc}
                          </TableCell>
                          <TableCell className="text-sm text-gray-900 text-right">
                            {item.arc}
                          </TableCell>
                        </TableRow>
                      ))}
                      {/* Spacer row between different FIDs */}
                      {bomIndex < bomData.length - 1 && (
                        <TableRow className="h-2">
                          <TableCell colSpan={9} className="p-0 bg-gray-50"></TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
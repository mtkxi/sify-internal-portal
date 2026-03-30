import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { ArrowLeft, FileText, Download, Send, CheckCircle, Eye, Loader2 } from 'lucide-react';

export function ProposalBuilder() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [outputFormat, setOutputFormat] = useState('pdf');
  const [template, setTemplate] = useState('standard');
  const [sections, setSections] = useState({
    executiveSummary: true,
    technicalSpecs: true,
    pricingBreakdown: true,
    implementationTimeline: true,
    supportAgreement: true,
    termsConditions: true
  });
  const [deliveryMethod, setDeliveryMethod] = useState('email');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateProposal = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsGenerating(false);
    alert('Proposal generated successfully!');
  };

  const deliverProposal = () => {
    alert(`Proposal delivered via ${deliveryMethod}`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate(`/pricing/${id}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pricing
          </Button>
          <div>
            <h1>Proposal Builder</h1>
            <p className="text-gray-600">Configure and generate customer proposal</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Output Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Output Format</Label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="word">Word Document</SelectItem>
                    <SelectItem value="html">Interactive Web</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Template</Label>
                <Select value={template} onValueChange={setTemplate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Template</SelectItem>
                    <SelectItem value="enterprise">Enterprise Template</SelectItem>
                    <SelectItem value="technical">Technical Template</SelectItem>
                    <SelectItem value="executive">Executive Summary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Delivery Method</Label>
                <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="email" />
                    <Label htmlFor="email">Email</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="portal" id="portal" />
                    <Label htmlFor="portal">Customer Portal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="presentation" id="presentation" />
                    <Label htmlFor="presentation">Presentation</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Sections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(sections).map(([key, checked]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={checked}
                    onCheckedChange={(checked) => 
                      setSections(prev => ({ ...prev, [key]: checked as boolean }))
                    }
                  />
                  <Label htmlFor={key} className="capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Proposal Preview</CardTitle>
              <CardDescription>Preview of generated proposal content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-gray-50 min-h-64">
                <div className="text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-2" />
                  <p>Proposal preview will appear here</p>
                  <p className="text-sm">Click "Generate Proposal" to create preview</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generation Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full" 
                onClick={generateProposal}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Proposal
                  </>
                )}
              </Button>
              <Button variant="outline" className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button className="w-full" onClick={deliverProposal}>
                <Send className="w-4 h-4 mr-2" />
                Deliver Proposal
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
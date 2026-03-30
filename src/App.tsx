import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router';
import { Sidebar } from './components/ui/sidebar';
import { Button } from './components/ui/button';
import { Avatar, AvatarFallback } from './components/ui/avatar';
import { Card, CardContent } from './components/ui/card';
import { Toaster } from './components/ui/sonner';
import { Bell, Search, LogOut, Users, Building, Cpu } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { NewProject } from './components/NewProject';
import { ProjectStep2 } from './components/ProjectStep2';
import { ProjectStep3 } from './components/ProjectStep3';
import { ProjectDetailView } from './components/ProjectDetailView';
import { NewDIAServiceRequest } from './components/NewDIAServiceRequest';
import { RequirementDetailsView } from './components/RequirementDetailsView';
import { FeasibilityPool } from './components/FeasibilityPool';
import { ConfigureProposal } from './components/ConfigureProposal';
import { FIDPricingManagement } from './components/FIDPricingManagement';
import { ProposalDocumentGeneration } from './components/ProposalDocumentGeneration';
import { FeasibilityManagement } from './components/FeasibilityManagement';
import { FeasibilityLanding } from './components/FeasibilityLanding';
import { ProposalDetails } from './components/ProposalDetails';
import { ConfigureProposalPage } from './components/ConfigureProposalPage';
import { ProposalPricingManagement } from './components/ProposalPricingManagement';
import { AddBillingShippingAddress } from './components/AddBillingShippingAddress';
import { PODetails } from './components/PODetails';
import { ShareOrder } from './components/ShareOrder';
import { AddFIDsFromPool } from './components/AddFIDsFromPool';
import { SolutionArchitectDashboard } from './components/SolutionArchitectDashboard';
import { SolutionDocumentEditor } from './components/SolutionDocumentEditor';
import { SARequirementDetails } from './components/SARequirementDetails';
import { BOMPage } from './components/BOMPage';
import { ConfigureP2PRequirement } from './components/ConfigureP2PRequirement';
import { P2PProposalDocumentGeneration } from './components/P2PProposalDocumentGeneration';
import { DeliverySetup } from './components/DeliverySetup';
import { InventoryPage } from './components/InventoryPage';

export type UserRole = 'account_manager' | 'solution_architect';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@onesify.com',
  role: 'account_manager'
};

function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'account_manager':
        return 'Account Manager';
      case 'solution_architect':
        return 'Solution Architect';
      default:
        return 'User';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div 
              className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate('/')}
            >
              <Building className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-semibold text-gray-900">OneSify</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarFallback>{user?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <div className="font-medium">{user?.name}</div>
                <div className="text-gray-500">{user ? getRoleLabel(user.role) : 'User'}</div>
              </div>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

function LoginPage() {
  const { setUser } = useAuth();

  const handleLogin = (role: UserRole) => {
    const user: User = {
      id: role === 'account_manager' ? '1' : '2',
      name: role === 'account_manager' ? 'John Doe' : 'Sarah Chen',
      email: role === 'account_manager' ? 'john.doe@onesify.com' : 'sarah.chen@onesify.com',
      role: role
    };
    setUser(user);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Building className="w-8 h-8 text-blue-600 mr-3" />
            <span className="text-3xl font-semibold text-gray-900">OneSify Network Services</span>
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">Network Services Platform</h2>
          <p className="text-gray-600">Select Your Role to Continue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Manager Role */}
          <Card className="p-6 hover:shadow-lg transition-shadow border border-gray-200">
            <CardContent className="p-0">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Account Manager</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Manage network service projects, coordinate solutions, generate proposals, and handle client-facing activities.
                </p>
              </div>

              <div className="space-y-2 mb-6">
                <h4 className="text-sm font-medium text-gray-900">Key Capabilities:</h4>
                <ul className="space-y-1">
                  {[
                    'Create and manage network service projects',
                    'Generate proposals and quotations',
                    'Client relationship management',
                    'Project coordination and tracking'
                  ].map((capability, index) => (
                    <li key={index} className="text-xs text-gray-600 flex items-start">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {capability}
                    </li>
                  ))}
                </ul>
              </div>

              <Button 
                onClick={() => handleLogin('account_manager')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Access as Account Manager
              </Button>
            </CardContent>
          </Card>

          {/* Solution Architect Role */}
          <Card className="p-6 hover:shadow-lg transition-shadow border border-gray-200">
            <CardContent className="p-0">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Cpu className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Solution Architect</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Design technical solutions, create architecture specifications, and validate technical feasibility.
                </p>
              </div>

              <div className="space-y-2 mb-6">
                <h4 className="text-sm font-medium text-gray-900">Key Capabilities:</h4>
                <ul className="space-y-1">
                  {[
                    'Technical solution design and planning',
                    'Architecture document creation',
                    'Resource planning and technology selection',
                    'Technical feasibility assessment'
                  ].map((capability, index) => (
                    <li key={index} className="text-xs text-gray-600 flex items-start">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {capability}
                    </li>
                  ))}
                </ul>
              </div>

              <Button 
                onClick={() => handleLogin('solution_architect')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                Access as Solution Architect
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  const logout = () => setUser(null);

  const authValue = {
    user,
    setUser,
    logout
  };

  const RoleDashboard = () => {
    if (!user) return <Navigate to="/" replace />;
    return user.role === 'solution_architect' ? <SolutionArchitectDashboard /> : <Dashboard />;
  };

  return (
    <AuthContext.Provider value={authValue}>
      <Router>
        {!user ? (
          <LoginPage />
        ) : (
          <Layout>
            <Routes>
              <Route path="/" element={<RoleDashboard />} />
              <Route path="/dashboard" element={<RoleDashboard />} />
              <Route path="/new-project" element={<NewProject />} />
              <Route path="/new-project/step2" element={<ProjectStep2 />} />
              <Route path="/new-project/step3" element={<ProjectStep3 />} />
              <Route path="/new-dia-request" element={<NewDIAServiceRequest />} />
              <Route path="/new-dia-service" element={<NewDIAServiceRequest />} />
              <Route path="/project/:projectId" element={<ProjectDetailView />} />
              <Route path="/requirement-details/:id" element={<RequirementDetailsView />} />
              <Route path="/feasibility-pool/:id" element={<FeasibilityPool />} />
              <Route path="/configure-proposal/:id" element={<ConfigureProposal />} />
              <Route path="/pricing-management/:id" element={<FIDPricingManagement />} />
              <Route path="/proposal-generation/:id" element={<ProposalDocumentGeneration />} />
              <Route path="/feasibility-landing" element={<FeasibilityLanding />} />
              <Route path="/feasibility-management" element={<FeasibilityManagement />} />
              <Route path="/proposal-details" element={<ProposalDetails />} />
              <Route path="/configure-proposal" element={<ConfigureProposalPage />} />
              <Route path="/add-fids/:id" element={<AddFIDsFromPool />} />
              <Route path="/pricing-management" element={<ProposalPricingManagement />} />
              <Route path="/proposal-document-generation" element={<ProposalDocumentGeneration />} />
              <Route path="/add-billing-address" element={<AddBillingShippingAddress />} />
              <Route path="/po-details" element={<PODetails />} />
              <Route path="/share-order" element={<ShareOrder />} />
              <Route path="/solution-architect" element={<SolutionArchitectDashboard />} />
              <Route path="/solution-architect-dashboard" element={<SolutionArchitectDashboard />} />
              <Route path="/solution-document-editor/:reqId" element={<SolutionDocumentEditor />} />
              <Route path="/sa-requirement-details/:reqId" element={<SARequirementDetails />} />
              <Route path="/bom-page" element={<BOMPage />} />
              <Route path="/configure-p2p-requirement/:reqId" element={<ConfigureP2PRequirement />} />
              <Route path="/p2p-proposal-document-generation" element={<P2PProposalDocumentGeneration />} />
              <Route path="/delivery-setup" element={<DeliverySetup />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        )}
        <Toaster position="top-right" />
      </Router>
    </AuthContext.Provider>
  );
}
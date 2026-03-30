# OneSify Colocation - Account Manager Documentation

## Table of Contents
1. [Account Manager Role Overview](#account-manager-role-overview)
2. [Roles and Responsibilities](#roles-and-responsibilities)
3. [Key Tasks and Capabilities](#key-tasks-and-capabilities)
4. [Project Creation Flow](#project-creation-flow)
5. [Platform Features and Components](#platform-features-and-components)
6. [Conditional Logic and Business Rules](#conditional-logic-and-business-rules)
7. [User Interface Guide](#user-interface-guide)
8. [Best Practices and Guidelines](#best-practices-and-guidelines)

---

## Account Manager Role Overview

The Account Manager (AM) is the primary user of the OneSify Colocation platform, serving as the central hub for managing customer relationships and business processes in the colocation services domain. The platform has been completely redesigned to focus exclusively on colocation services with a streamlined, AM-only interface.

### Core Purpose
- **Customer Relationship Management**: Serve as the primary point of contact for customers
- **Project Orchestration**: Manage the complete project lifecycle from initiation to implementation
- **Business Development Coordination**: Facilitate collaboration between different BD teams
- **Technical Oversight**: Ensure proper solution architecture and technical guidance

---

## Roles and Responsibilities

### Primary Responsibilities

#### 1. Customer Project Management
- **Project Initiation**: Create new colocation projects based on customer requirements
- **Requirement Gathering**: Capture comprehensive project details and specifications
- **Stakeholder Coordination**: Manage communication between customers, BD teams, and technical teams
- **Progress Tracking**: Monitor project status and ensure timely completion

#### 2. Business Development Team Coordination
- **Team Assignment**: Assign appropriate BD team members across three domains:
  - **Data Center (DC)**: Infrastructure and colocation specialists
  - **Network**: Connectivity and network solutions experts
  - **Managed Services**: Support and managed services professionals
- **Resource Allocation**: Ensure optimal team composition based on project complexity
- **Escalation Management**: Handle complex scenarios requiring BD team intervention

#### 3. Technical Solution Oversight
- **Solution Architect Assignment**: Select and assign technical experts for complex projects
- **Infrastructure Planning**: Configure colocation models, rack configurations, and power requirements
- **Service Selection**: Choose appropriate additional services and support levels

#### 4. Project Submission and Workflow Management
- **Submission Routing**: Decide between BD team assistance or direct feasibility submission
- **Quality Assurance**: Ensure project completeness before submission
- **Timeline Management**: Balance thoroughness with time-to-market requirements

---

## Key Tasks and Capabilities

### Daily Operations
1. **Dashboard Management**
   - Monitor active projects and their status
   - Review pending approvals and actions
   - Track team performance and workload

2. **Customer Interaction**
   - Respond to customer inquiries and requirements
   - Schedule and conduct project discovery sessions
   - Provide status updates and project communications

3. **Project Creation and Management**
   - Initiate new colocation projects
   - Configure technical specifications
   - Assign team members and resources

4. **Administrative Tasks**
   - Update project documentation
   - Manage billing and shipping addresses
   - Handle purchase order details

### Strategic Activities
1. **Solution Design**
   - Collaborate with solution architects on complex designs
   - Review and approve technical configurations
   - Ensure alignment with customer business objectives

2. **Business Development**
   - Coordinate with BD teams for market insights
   - Identify upselling and cross-selling opportunities
   - Manage customer relationship expansion

---

## Project Creation Flow

### Step-by-Step Process

#### Step 1: Project Information
**Location**: `NewProject.tsx`
**Objective**: Capture fundamental project details

**Key Activities**:
1. **Project Identification**
   - Enter project name and description
   - Define project priority level
   - Set expected timeline and milestones

2. **Customer Information**
   - Input customer details and contact information
   - Define primary and secondary contacts
   - Capture business requirements and objectives

3. **Initial Assessment**
   - Determine project complexity level
   - Identify potential challenges or special requirements
   - Set preliminary budget expectations

**Validation Rules**:
- Project name must be unique and descriptive
- Customer information must be complete
- Timeline must be realistic and achievable

---

#### Step 2: Product Selection and Configuration
**Location**: `ProjectStep2.tsx`
**Objective**: Configure technical requirements and assign BD teams

##### 2A. Service Domain Selection
**Available Domains**:
1. **Data Center (DC)** ⚡
   - Colocation rack and power configuration
   - Infrastructure requirements
   - Physical space planning

2. **Cloud** ☁️
   - Cloud integration services
   - Hybrid cloud solutions
   - Migration planning

3. **Network** 🌐
   - Connectivity options
   - WAN services
   - Network security
   - Optimization solutions

**Domain Configuration Process**:
1. Select primary domain (usually DC for colocation)
2. Configure domain-specific requirements
3. Add secondary domains if needed
4. Review and validate configurations

##### 2B. Infrastructure Configuration (DC Domain)
**Colocation Models Available**:
- **Quarter Rack**: 10U space, basic power allocation
- **Half Rack**: 21U space, enhanced power options
- **Full Rack**: 42U space, maximum power and cooling
- **Multi-Rack**: Custom configurations for large deployments
- **Cage/Suite**: Private colocation spaces

**Configuration Options**:
1. **Rack Configuration**
   - Select rack size and quantity
   - Configure custom dimensions if needed
   - Set space utilization requirements

2. **Power Configuration**
   - Choose power models (A, B, C circuits)
   - Define power density requirements
   - Configure redundancy options

3. **Additional Services**
   - **Racking & Stacking**: Professional installation
   - **Intelligent PDU**: Smart power distribution
   - **Dedicated Access**: CCTV and access control

**Power Models**:
- **Model A**: Standard power (2-5 kW per rack)
- **Model B**: Enhanced power (5-10 kW per rack)
- **Model C**: High density power (10+ kW per rack)

##### 2C. Business Development Team Assignment
**Assignment Process**:
1. **Automatic Assignment**: For standard configurations
2. **Manual Assignment**: For complex requirements

**BD Team Categories**:
1. **DC Team**
   - Sarah Johnson (Senior DC Architect)
   - Mike Chen (DC Solutions Engineer)
   - Alex Rodriguez (Infrastructure Specialist)

2. **Network Team**
   - James Liu (Network Solutions Engineer)
   - Lisa Thompson (Connectivity Specialist)

3. **Managed Services Team**
   - Various specialists based on service type

**Assignment Criteria**:
- **Complexity Level**: Simple, moderate, or complex projects
- **Specialization Match**: Technical expertise alignment
- **Workload Balance**: Team availability and capacity
- **Customer Relationship**: Existing relationships and preferences

##### 2D. Visual Status Indicators
**Domain Status Tracking**:
- ✅ **Configured**: Domain setup complete with green checkmark
- ⚠️ **Partial**: Some configuration completed, needs attention
- ❌ **Not Configured**: No configuration set up
- 🔄 **In Progress**: Currently being configured

---

#### Step 3: Project Submission and Solution Architect Assignment
**Location**: `ProjectStep3.tsx`
**Objective**: Finalize project details and determine submission path

##### 3A. Submission Path Selection
**Two Primary Options**:

1. **Send to Business Development Team**
   - **Purpose**: Get assistance with incomplete or complex requirements
   - **Process**: BD team reviews → enhances details → submits for feasibility
   - **Best For**: 
     - Complex projects requiring expert guidance
     - Incomplete requirements needing clarification
     - Non-standard configurations
   - **Timeline**: Additional 2-3 days for BD review

2. **Submit for Feasibility Check**
   - **Purpose**: Direct submission to Operations team
   - **Process**: Immediate feasibility analysis begins
   - **Best For**:
     - Complete requirements and standard configurations
     - Time-sensitive projects
     - Straightforward colocation needs
   - **Timeline**: Immediate processing

##### 3B. Solution Architect Assignment
**Available Solution Architects**:

1. **Alex Chen**
   - Specialization: Data Center Infrastructure
   - Experience: 8+ years in DC design and colocation solutions

2. **Sarah Martinez**
   - Specialization: Cloud & Hybrid Architecture
   - Experience: 10+ years in enterprise cloud solutions

3. **Michael Zhang**
   - Specialization: Network Infrastructure
   - Experience: 7+ years in network design and connectivity

4. **Jennifer Williams**
   - Specialization: Security & Compliance
   - Experience: 9+ years in enterprise security architecture

5. **Robert Kim**
   - Specialization: Power & Cooling Systems
   - Experience: 12+ years in critical infrastructure design

**Assignment Process**:
1. Review project technical requirements
2. Match architect specialization to project needs
3. Check architect availability and workload
4. Assign and provide project context

**Assignment Criteria**:
- **Technical Match**: Architect expertise aligns with project requirements
- **Complexity Level**: Senior architects for complex projects
- **Customer Preference**: Existing relationships or specific requests
- **Availability**: Current workload and schedule capacity

---

## Platform Features and Components

### Core Platform Components

#### 1. Dashboard (`Dashboard.tsx`)
**Functionality**:
- **Project Overview**: Quick view of all active projects
- **Status Tracking**: Real-time project status updates
- **Task Management**: Pending actions and approvals
- **Performance Metrics**: Key performance indicators and reports

**Key Metrics Displayed**:
- Active projects count
- Projects by status (In Progress, Pending Approval, Completed)
- BD team utilization
- Average project completion time

#### 2. Project Management Suite

##### NewProject.tsx
- **Project initiation workflow**
- **Customer information capture**
- **Initial requirement gathering**

##### ProjectStep2.tsx
- **Product selection and configuration**
- **BD team assignment**
- **Technical specification setup**

##### ProjectStep3.tsx
- **Project submission workflow**
- **Solution architect assignment**
- **Final review and validation**

#### 3. Catalog and Configuration

##### ProductCatalog.tsx
- **Service offerings display**
- **Pricing information**
- **Configuration options**

##### SolutionEditor.tsx
- **Custom solution design**
- **Technical specification editing**
- **Configuration validation**

#### 4. Order and Documentation Management

##### PODetails.tsx
- **Purchase order management**
- **Contract details**
- **Financial information**

##### OrderDocument.tsx
- **Document generation**
- **Order tracking**
- **Delivery management**

#### 5. Approval and Workflow

##### ApprovalCenter.tsx
- **Approval workflow management**
- **Stakeholder notifications**
- **Decision tracking**

##### RequirementDetails.tsx
- **Detailed requirement specifications**
- **Change management**
- **Version control**

#### 6. Financial Management

##### PricingManagement.tsx
- **Pricing model configuration**
- **Cost estimation**
- **Financial approvals**

##### BOMManagement.tsx
- **Bill of Materials management**
- **Component tracking**
- **Cost analysis**

---

## Conditional Logic and Business Rules

### Project Creation Logic

#### 1. Domain Configuration Rules
```
IF DC domain selected:
  - Infrastructure tab becomes mandatory
  - BD assignment for DC team required
  - Power configuration must be specified

IF Network domain selected:
  - Connectivity requirements mandatory
  - Network BD team assignment required
  - Integration with DC domain recommended

IF Cloud domain selected:
  - Migration planning required
  - Hybrid configuration options available
  - Security assessment mandatory
```

#### 2. BD Team Assignment Logic
```
Project Complexity Assessment:
  Simple Project:
    - Standard configurations only
    - Automatic BD assignment
    - Single domain focus
  
  Moderate Project:
    - Some customization required
    - Manual BD assignment recommended
    - Multi-domain coordination
  
  Complex Project:
    - Extensive customization
    - Senior BD team members required
    - Solution architect assignment mandatory
    - Multi-domain integration required
```

#### 3. Submission Path Logic
```
Project Readiness Assessment:
  IF all_requirements_complete AND standard_configuration:
    - Recommend direct feasibility submission
    - Fast-track processing available
  
  ELSE IF incomplete_requirements OR complex_configuration:
    - Recommend BD team assistance
    - Additional review cycle required
  
  ELSE IF customer_prefers_review:
    - Allow BD team route regardless of completeness
```

#### 4. Solution Architect Assignment Rules
```
Assignment Triggers:
  - Project complexity score > 7/10
  - Multi-domain integration required
  - Custom power/cooling requirements
  - Security compliance requirements
  - Customer specifically requests

Specialization Matching:
  DC Projects → Alex Chen or Robert Kim
  Network Projects → Michael Zhang
  Cloud Projects → Sarah Martinez
  Security Projects → Jennifer Williams
  Hybrid Projects → Multiple architects may be assigned
```

### Validation Rules

#### 1. Project Information Validation
- **Project Name**: Must be unique, 3-100 characters
- **Customer Information**: All required fields must be completed
- **Timeline**: Must be realistic (minimum 2 weeks for feasibility)
- **Budget**: Must be within reasonable parameters for scope

#### 2. Configuration Validation
- **Rack Configuration**: Cannot exceed datacenter capacity
- **Power Requirements**: Must align with available power infrastructure
- **Network Requirements**: Must be technically feasible
- **Service Combinations**: Some services have compatibility requirements

#### 3. Team Assignment Validation
- **BD Team Availability**: Cannot assign to overloaded team members
- **Skill Matching**: Must match technical requirements
- **Geographic Coverage**: Must cover customer location

---

## User Interface Guide

### Navigation Structure
```
OneSify Colocation Platform
├── Dashboard (Overview and quick actions)
├── Projects
│   ├── New Project (Multi-step creation)
│   ├── Active Projects (Management view)
│   └── Completed Projects (Archive)
├── Catalog (Product and service browser)
├── Approvals (Workflow management)
├── Orders (Order and document management)
└── Settings (Configuration and preferences)
```

### Key UI Patterns

#### 1. Step-by-Step Wizards
- **Progress Indicators**: Visual progress through multi-step processes
- **Validation Feedback**: Real-time validation with clear error messages
- **Save and Resume**: Ability to save progress and return later

#### 2. Configuration Panels
- **Left Panel Navigation**: Domain and category selection
- **Right Content Area**: Detailed configuration options
- **Status Indicators**: Visual feedback on configuration completeness

#### 3. Assignment Interfaces
- **Modal Dialogs**: For team member and architect selection
- **Card-Based Selection**: Visual selection of team members
- **Context Information**: Detailed profiles and specializations

#### 4. Status Tracking
- **Color-Coded Status**: Green (complete), Yellow (in progress), Red (attention needed)
- **Progress Bars**: Visual completion indicators
- **Badge Notifications**: Count of pending actions

---

## Best Practices and Guidelines

### Project Creation Best Practices

#### 1. Requirement Gathering
- **Start with Discovery**: Conduct thorough customer discovery sessions
- **Document Everything**: Capture all requirements, even if they seem minor
- **Validate Understanding**: Confirm requirements with customer before proceeding
- **Consider Future Needs**: Plan for potential expansion or changes

#### 2. Configuration Management
- **Standard First**: Use standard configurations when possible
- **Document Customizations**: Clearly explain any custom requirements
- **Validate Feasibility**: Ensure configurations are technically possible
- **Consider Dependencies**: Understand how different components interact

#### 3. Team Assignment Strategy
- **Match Expertise**: Align team member skills with project requirements
- **Balance Workload**: Consider team capacity and current assignments
- **Plan for Escalation**: Identify senior resources for complex issues
- **Maintain Relationships**: Consider existing customer relationships

#### 4. Communication Management
- **Set Expectations**: Clearly communicate timelines and processes
- **Regular Updates**: Provide consistent project status updates
- **Document Decisions**: Record all major decisions and rationale
- **Escalate Early**: Address potential issues before they become problems

### Common Scenarios and Solutions

#### Scenario 1: Incomplete Customer Requirements
**Situation**: Customer provides partial requirements
**Solution**: 
1. Use BD team assistance pathway
2. Assign experienced BD team member
3. Schedule additional discovery sessions
4. Document assumptions and get customer confirmation

#### Scenario 2: Complex Multi-Domain Project
**Situation**: Project requires DC, Network, and Cloud integration
**Solution**:
1. Configure all relevant domains
2. Assign BD team members from each domain
3. Assign solution architect with integration experience
4. Plan for extended timeline and coordination

#### Scenario 3: Time-Sensitive Project
**Situation**: Customer has tight deadline
**Solution**:
1. Ensure all requirements are complete before starting
2. Use direct feasibility submission
3. Assign senior team members
4. Consider expedited services
5. Communicate timeline risks upfront

#### Scenario 4: Budget-Constrained Project
**Situation**: Customer has strict budget limitations
**Solution**:
1. Start with standard configurations
2. Identify cost optimization opportunities
3. Consider phased implementation approach
4. Assign BD team member with cost optimization expertise

### Troubleshooting Common Issues

#### Configuration Issues
- **Power Calculations Don't Match**: Review power model selection and rack configuration
- **Network Requirements Unclear**: Assign network specialist for clarification
- **Service Conflicts**: Check service compatibility matrix

#### Team Assignment Issues
- **No Available BD Members**: Check workload distribution and consider external resources
- **Skill Mismatch**: Review project requirements and reassign appropriate specialist
- **Geographic Coverage Gaps**: Coordinate with regional teams or remote support

#### Submission Issues
- **Validation Errors**: Review all required fields and configurations
- **Missing Documentation**: Ensure all supporting documents are attached
- **Approval Delays**: Check approval workflow and follow up with stakeholders

---

## System Integration Points

### External Systems
- **CRM Integration**: Customer data synchronization
- **ERP Integration**: Financial and order management
- **ITSM Integration**: Service request and incident management
- **Billing Systems**: Automated invoicing and payment processing

### Internal Workflows
- **Feasibility Analysis**: Automated workflow to operations team
- **Resource Planning**: Integration with capacity management
- **Project Management**: Connection to delivery teams
- **Quality Assurance**: Integration with QA processes

---

## Conclusion

The OneSify Colocation platform provides Account Managers with a comprehensive, streamlined interface for managing the complete colocation project lifecycle. The system's design prioritizes ease of use while maintaining the flexibility needed to handle complex customer requirements.

Key success factors for Account Managers:
1. **Thorough Requirement Gathering**: Invest time upfront to understand customer needs
2. **Appropriate Team Assignment**: Match skills and experience to project requirements
3. **Clear Communication**: Maintain open communication with all stakeholders
4. **Proactive Management**: Identify and address potential issues early
5. **Continuous Learning**: Stay updated on platform features and capabilities

The platform's conditional logic and validation rules help ensure project quality while the flexible workflow options accommodate different project types and customer preferences. By following the documented processes and best practices, Account Managers can effectively serve their customers while maintaining high standards of project delivery.
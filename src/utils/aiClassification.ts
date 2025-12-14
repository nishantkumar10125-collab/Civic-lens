import { IssueCategory, Severity } from '../types';

// Simulated AI classification based on keywords and context
export const classifyIssue = (description: string, images: File[]): { category: IssueCategory; severity: Severity; confidence: number } => {
  const desc = description.toLowerCase();
  
  // Classify based on keywords
  if (desc.includes('pothole') || desc.includes('hole in road') || desc.includes('road damage')) {
    return { category: 'pothole', severity: 'high', confidence: 0.92 };
  }
  
  if (desc.includes('streetlight') || desc.includes('light') || desc.includes('lamp') || desc.includes('dark')) {
    return { category: 'streetlight', severity: 'medium', confidence: 0.88 };
  }
  
  if (desc.includes('trash') || desc.includes('garbage') || desc.includes('litter') || desc.includes('waste')) {
    return { category: 'trash', severity: 'medium', confidence: 0.85 };
  }
  
  if (desc.includes('flood') || desc.includes('water') || desc.includes('drain') || desc.includes('overflow')) {
    return { category: 'flooding', severity: 'high', confidence: 0.90 };
  }
  
  if (desc.includes('graffiti') || desc.includes('vandalism') || desc.includes('spray paint')) {
    return { category: 'graffiti', severity: 'low', confidence: 0.82 };
  }
  
  if (desc.includes('sign') || desc.includes('signage') || desc.includes('traffic sign')) {
    return { category: 'damaged_signage', severity: 'medium', confidence: 0.87 };
  }
  
  if (desc.includes('sidewalk') || desc.includes('walkway') || desc.includes('pavement')) {
    return { category: 'broken_sidewalk', severity: 'medium', confidence: 0.84 };
  }
  
  if (desc.includes('water leak') || desc.includes('pipe') || desc.includes('burst')) {
    return { category: 'water_leak', severity: 'high', confidence: 0.91 };
  }
  
  if (desc.includes('electrical') || desc.includes('power') || desc.includes('wire') || desc.includes('cable')) {
    return { category: 'electrical_hazard', severity: 'critical', confidence: 0.95 };
  }
  
  return { category: 'other', severity: 'medium', confidence: 0.60 };
};

export const generateReport = (description: string, category: IssueCategory, severity: Severity, location: any): string => {
  const severityText = {
    low: 'Low Priority',
    medium: 'Medium Priority', 
    high: 'High Priority',
    critical: 'Critical Priority'
  };
  
  const categoryText = {
    pothole: 'Road Infrastructure Issue',
    streetlight: 'Street Lighting Issue',
    trash: 'Waste Management Issue',
    flooding: 'Drainage and Water Issue',
    graffiti: 'Public Property Vandalism',
    damaged_signage: 'Traffic Signage Issue',
    broken_sidewalk: 'Pedestrian Infrastructure Issue',
    water_leak: 'Water System Issue',
    electrical_hazard: 'Electrical Safety Hazard',
    other: 'General Infrastructure Issue'
  };
  
  return `MUNICIPAL ISSUE REPORT

Category: ${categoryText[category]}
Priority Level: ${severityText[severity]}
Location: ${location?.address || 'Location data unavailable'}
District: ${location?.district || 'Unknown'}

Issue Description:
${description}

Recommended Action:
This ${severity === 'critical' ? 'critical issue requires immediate attention' : 
         severity === 'high' ? 'high priority issue should be addressed within 24-48 hours' :
         severity === 'medium' ? 'issue should be scheduled for resolution within 1 week' :
         'issue should be reviewed and addressed as resources allow'}.

Generated on: ${new Date().toLocaleString()}
Classification Confidence: AI-powered classification system
`;
};

export const getDepartmentFromCategory = (category: IssueCategory): string => {
  const departmentMapping = {
    pothole: 'Department of Public Works',
    streetlight: 'Department of Public Works', 
    trash: 'Sanitation Department',
    flooding: 'Department of Water Management',
    graffiti: 'Parks and Recreation Department',
    damaged_signage: 'Department of Transportation',
    broken_sidewalk: 'Department of Public Works',
    water_leak: 'Department of Water Management',
    electrical_hazard: 'Department of Public Utilities',
    other: 'General Services Department'
  };
  
  return departmentMapping[category];
};
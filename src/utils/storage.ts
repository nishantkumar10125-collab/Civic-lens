import { Issue } from '../types';

const STORAGE_KEY = 'civiclens_issues';

export const saveIssue = (issue: Issue): void => {
  const existingIssues = getIssues();
  const updatedIssues = [...existingIssues, issue];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedIssues));
};

export const getIssues = (): Issue[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  return JSON.parse(stored).map((issue: any) => ({
    ...issue,
    dateReported: new Date(issue.dateReported)
  }));
};

export const updateIssueStatus = (id: string, status: string): void => {
  const issues = getIssues();
  const updatedIssues = issues.map(issue => 
    issue.id === id ? { ...issue, status: status as any } : issue
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedIssues));
};

export const deleteIssue = (id: string): void => {
  const issues = getIssues();
  const updatedIssues = issues.filter(issue => issue.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedIssues));
};
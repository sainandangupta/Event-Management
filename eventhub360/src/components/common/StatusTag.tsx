import React from 'react';
import { Tag } from 'antd';
import { designTokens } from '../../styles/theme';
import type { EventStatus, TaskStatus, PhaseStatus, VendorStatus, Priority } from '../../types/common';

interface StatusTagProps {
  status: EventStatus | TaskStatus | PhaseStatus | VendorStatus | Priority | string;
  dot?: boolean;
}

const statusConfig: Record<string, { bg: string; color: string; dot: string }> = {
  // Common
  'In Progress': { bg: 'rgba(255, 138, 91, 0.15)', color: designTokens.colors.sunsetOrange, dot: designTokens.colors.sunsetOrange },
  'Completed': { bg: 'rgba(76, 175, 141, 0.15)', color: designTokens.colors.emeraldGreen, dot: designTokens.colors.emeraldGreen },
  'Pending': { bg: 'rgba(105, 81, 155, 0.15)', color: designTokens.colors.tertiary, dot: designTokens.colors.tertiary },
  'Draft': { bg: 'rgba(148, 163, 184, 0.15)', color: '#64748b', dot: '#64748b' },
  'Cancelled': { bg: 'rgba(186, 26, 26, 0.15)', color: designTokens.colors.error, dot: designTokens.colors.error },
  
  // Events
  'Planned': { bg: 'rgba(76, 175, 141, 0.15)', color: designTokens.colors.emeraldGreen, dot: designTokens.colors.emeraldGreen },
  'Corporate': { bg: 'rgba(105, 81, 155, 0.15)', color: designTokens.colors.tertiary, dot: designTokens.colors.tertiary },
  'Wedding': { bg: 'rgba(117, 90, 29, 0.15)', color: designTokens.colors.secondary, dot: designTokens.colors.secondary },
  'Gala': { bg: 'rgba(105, 81, 155, 0.15)', color: designTokens.colors.tertiary, dot: designTokens.colors.tertiary },

  // Tasks
  'Review': { bg: 'rgba(76, 175, 141, 0.15)', color: designTokens.colors.emeraldGreen, dot: designTokens.colors.emeraldGreen },
  'Overdue': { bg: 'rgba(186, 26, 26, 0.15)', color: designTokens.colors.error, dot: designTokens.colors.error },
  
  // Priority
  'Low': { bg: 'rgba(148, 163, 184, 0.15)', color: '#64748b', dot: '#64748b' },
  'Medium': { bg: 'rgba(105, 81, 155, 0.15)', color: designTokens.colors.tertiary, dot: designTokens.colors.tertiary },
  'High': { bg: 'rgba(255, 138, 91, 0.15)', color: designTokens.colors.sunsetOrange, dot: designTokens.colors.sunsetOrange },
  'Critical': { bg: 'rgba(186, 26, 26, 0.15)', color: designTokens.colors.error, dot: designTokens.colors.error },

  // Vendor
  'Preferred': { bg: 'rgba(76, 175, 141, 0.15)', color: designTokens.colors.emeraldGreen, dot: designTokens.colors.emeraldGreen },
  'Active': { bg: 'rgba(174, 47, 52, 0.15)', color: designTokens.colors.primary, dot: designTokens.colors.primary },
  'Under Review': { bg: 'rgba(117, 90, 29, 0.15)', color: designTokens.colors.secondary, dot: designTokens.colors.secondary },
  'Waitlisted': { bg: 'rgba(105, 81, 155, 0.15)', color: designTokens.colors.tertiary, dot: designTokens.colors.tertiary },
};

const StatusTag: React.FC<StatusTagProps> = ({ status, dot = false }) => {
  const config = statusConfig[status as string] || {
    bg: 'rgba(148, 163, 184, 0.15)',
    color: '#64748b',
    dot: '#64748b',
  };

  if (dot) {
    return (
      <span style={{ color: config.color, display: 'inline-flex', alignItems: 'center', fontSize: 13, fontWeight: 500 }}>
        <span
          style={{
            display: 'inline-block',
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: config.dot,
            marginRight: 6,
          }}
        />
        {status}
      </span>
    );
  }

  return (
    <Tag
      style={{
        margin: 0,
        backgroundColor: config.bg,
        color: config.color,
        border: 'none',
        padding: '2px 12px',
        fontSize: 13,
        fontWeight: 500,
        borderRadius: designTokens.borderRadius.full,
      }}
    >
      {status}
    </Tag>
  );
};

export default StatusTag;

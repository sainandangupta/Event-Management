import React from 'react';
import { Card, Typography, Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { designTokens } from '../../styles/theme';

const { Text } = Typography;

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  subtitle?: string;
  variant?: 'primary' | 'success' | 'warning' | 'tertiary' | 'secondary' | 'error';
  badge?: string;
  badgeColor?: string;
}

const variantColors: Record<string, { bg: string; color: string }> = {
  primary: { bg: 'rgba(174, 47, 52, 0.1)', color: designTokens.colors.primary },
  success: { bg: 'rgba(76, 175, 141, 0.1)', color: designTokens.colors.emeraldGreen },
  warning: { bg: 'rgba(255, 138, 91, 0.1)', color: designTokens.colors.sunsetOrange },
  tertiary: { bg: 'rgba(105, 81, 155, 0.1)', color: designTokens.colors.tertiary },
  secondary: { bg: 'rgba(117, 90, 29, 0.1)', color: designTokens.colors.secondary },
  error: { bg: 'rgba(186, 26, 26, 0.1)', color: designTokens.colors.error },
};

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  trend,
  subtitle,
  variant = 'primary',
  badge,
  badgeColor,
}) => {
  const colors = variantColors[variant];

  return (
    <Card
      style={{
        borderRadius: designTokens.borderRadius.xl,
        border: `1px solid ${designTokens.colors.borderGray}`,
        boxShadow: designTokens.shadows.level1,
      }}
      bodyStyle={{ padding: '20px 24px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: designTokens.borderRadius.md,
            background: colors.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.color,
            fontSize: 20,
          }}
        >
          {icon}
        </div>

        <Space direction="vertical" align="end" size={0}>
          {trend && (
            <Text
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: trend.direction === 'up'
                  ? designTokens.colors.emeraldGreen
                  : trend.direction === 'down'
                    ? designTokens.colors.error
                    : designTokens.colors.onSurfaceVariant,
              }}
            >
              {trend.direction === 'up' && <ArrowUpOutlined style={{ fontSize: 10, marginRight: 2 }} />}
              {trend.direction === 'down' && <ArrowDownOutlined style={{ fontSize: 10, marginRight: 2 }} />}
              {trend.value}
            </Text>
          )}
          {badge && (
            <Text
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: badgeColor || designTokens.colors.primary,
                background: `${badgeColor || designTokens.colors.primary}15`,
                padding: '2px 8px',
                borderRadius: designTokens.borderRadius.full,
              }}
            >
              {badge}
            </Text>
          )}
        </Space>
      </div>

      <Text
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: designTokens.colors.onSurfaceVariant,
          display: 'block',
          marginTop: 14,
        }}
      >
        {label}
      </Text>

      <Text
        strong
        style={{
          fontSize: 28,
          fontFamily: designTokens.typography.headlineFont,
          color: designTokens.colors.onSurface,
          display: 'block',
          lineHeight: 1.2,
          marginTop: 2,
        }}
      >
        {value}
      </Text>

      {subtitle && (
        <Text
          style={{
            fontSize: 12,
            color: designTokens.colors.onSurfaceVariant,
            marginTop: 4,
            display: 'block',
          }}
        >
          {subtitle}
        </Text>
      )}
    </Card>
  );
};

export default StatCard;

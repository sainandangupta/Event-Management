import React from 'react';
import { Breadcrumb, Typography, Space } from 'antd';
import { Link } from 'react-router-dom';
import { designTokens } from '../../styles/theme';

const { Title, Text } = Typography;

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface PageHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  tag?: React.ReactNode;
  extra?: React.ReactNode;
  titleStyle?: React.CSSProperties;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  breadcrumbs,
  title,
  subtitle,
  action,
  tag,
  extra,
  titleStyle,
}) => {
  return (
    <div style={{ marginBottom: 32 }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb
          items={breadcrumbs.map((item, index) => ({
            title: item.path ? (
              <Link to={item.path} style={{ color: designTokens.colors.onSurfaceVariant }}>
                {item.label}
              </Link>
            ) : (
              <span style={{ color: designTokens.colors.primary, fontWeight: 500 }}>
                {item.label}
              </span>
            ),
          }))}
          style={{ marginBottom: 16, fontSize: 13 }}
          separator="›"
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Space align="center" size={16} style={{ marginBottom: 4 }}>
            {typeof title === 'string' ? (
              <h1
                style={{
                  margin: 0,
                  fontSize: 32,
                  fontFamily: designTokens.typography.headlineFont,
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  color: designTokens.colors.onSurface,
                  ...titleStyle,
                }}
              >
                {title}
              </h1>
            ) : (
              title
            )}
            {tag}
          </Space>
          
          {subtitle && (
            <Text style={{ fontSize: 16, color: designTokens.colors.onSurfaceVariant }}>
              {subtitle}
            </Text>
          )}
          
          {extra && <div style={{ marginTop: 12 }}>{extra}</div>}
        </div>

        {action && <div>{action}</div>}
      </div>
    </div>
  );
};

export default PageHeader;

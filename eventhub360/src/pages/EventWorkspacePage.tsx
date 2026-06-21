import React from 'react';
import { Card, Row, Col, Typography, Space, Button, Avatar } from 'antd';
import { 
  CalendarOutlined, TeamOutlined, ShopOutlined, FileTextOutlined,
  ProjectOutlined, DollarOutlined, PlayCircleOutlined, BarChartOutlined,
  ArrowRightOutlined, ClockCircleOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { designTokens } from '../styles/theme';

const { Title, Text } = Typography;

const modules = [
  {
    id: 'events',
    title: 'Events',
    icon: <CalendarOutlined />,
    path: '/events',
    variant: 'primary',
    tags: ['Active', 'Upcoming', 'Completed'],
    desc: 'Manage Event Lifecycle, Categories, Phases, Teams, Scheduling.',
    lastUpdated: '2m ago',
    actionText: 'Open Events',
  },
  {
    id: 'planning',
    title: 'Planning',
    icon: <ProjectOutlined />,
    path: '/planning',
    variant: 'secondary',
    tags: ['Open Tasks', 'Upcoming Milestones'],
    desc: 'Manage Tasks, Milestones, Checklists, Dependencies, Critical Path, Gantt Planning.',
    lastUpdated: '15m ago',
    actionText: 'Open Planning Workspace',
    actionVariant: 'solid',
  },
  {
    id: 'resources',
    title: 'Resources',
    icon: <TeamOutlined />,
    path: '/resources',
    variant: 'tertiary',
    tags: ['Total Resources', 'Active Allocations'],
    desc: 'Manage Staff/Equipment Allocation, Venue Resources, Availability, Capacity, Conflict Detection.',
    lastUpdated: '1h ago',
    actionText: 'Open Resource Center',
  },
  {
    id: 'budget',
    title: 'Budget',
    icon: <DollarOutlined />,
    path: '/budget',
    variant: 'success',
    tags: ['Planned', 'Actual', 'Variance'],
    desc: 'Manage Event Budgets, Items, Planned/Actual Cost, Variance, Approvals.',
    lastUpdated: '45m ago',
    actionText: 'Open Budget Center',
  },
  {
    id: 'vendors',
    title: 'Vendors',
    icon: <ShopOutlined />,
    path: '/vendors',
    variant: 'warning',
    tags: ['Active Vendors', 'Pending Deliverables'],
    desc: 'Manage Vendor Directory, Assignments, Deliverables, Performance.',
    lastUpdated: '3h ago',
    actionText: 'Open Vendor Center',
  },
  {
    id: 'execution',
    title: 'Execution',
    icon: <PlayCircleOutlined />,
    path: '/execution',
    variant: 'error',
    tags: ['Live Events', 'Open Incidents'],
    desc: 'Manage Live Operations, Incident Management, Activity Logs, On-Site Checklists, Status Updates.',
    lastUpdated: 'Updated Now',
    actionText: 'Launch Execution Center',
    actionVariant: 'solid',
    bgDark: true,
  },
  {
    id: 'documents',
    title: 'Documents',
    icon: <FileTextOutlined />,
    path: '/documents',
    variant: 'primary', // Mockup uses blue-ish but we map to primary system
    tags: ['Total Files', 'Recent Uploads'],
    desc: 'Manage Event Documents, Uploads, Version History, Contracts, Event Files.',
    lastUpdated: '2h ago',
    actionText: 'Open Document Center',
  },
  {
    id: 'reporting',
    title: 'Reporting',
    icon: <BarChartOutlined />,
    path: '/reporting',
    variant: 'tertiary',
    tags: ['Reports Generated', 'Avg Profit Margin'],
    desc: 'Manage Profitability Reports, Revenue vs Cost, Resource Utilization, Event Performance.',
    lastUpdated: '1d ago',
    actionText: 'Open Reporting Center',
    actionVariant: 'solid',
  },
];

const recentActivity = [
  { icon: <CalendarOutlined />, title: 'Recent Event Created', desc: 'Gala Dinner 2024 - Phase 1', time: '2m ago', color: 'primary' },
  { icon: <CheckCircleOutlined />, title: 'Recent Budget Approved', desc: 'Corporate Retreat Q3', time: '15m ago', color: 'success' },
  { icon: <TeamOutlined />, title: 'Recent Resource Allocation', desc: 'AV Team assigned to Tech Summit', time: '1h ago', color: 'tertiary' },
  { icon: <ShopOutlined />, title: 'Recent Vendor Assignment', desc: 'Catering Co. for Wedding Expo', time: '3h ago', color: 'warning' },
];

const EventWorkspacePage: React.FC = () => {
  const navigate = useNavigate();

  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case 'primary': return { bg: 'rgba(174, 47, 52, 0.1)', color: designTokens.colors.primary, tagBg: 'rgba(174, 47, 52, 0.05)' };
      case 'secondary': return { bg: 'rgba(117, 90, 29, 0.1)', color: designTokens.colors.secondary, tagBg: 'rgba(117, 90, 29, 0.05)' };
      case 'tertiary': return { bg: 'rgba(105, 81, 155, 0.1)', color: designTokens.colors.tertiary, tagBg: 'rgba(105, 81, 155, 0.05)' };
      case 'success': return { bg: 'rgba(76, 175, 141, 0.1)', color: designTokens.colors.emeraldGreen, tagBg: 'rgba(76, 175, 141, 0.05)' };
      case 'warning': return { bg: 'rgba(255, 138, 91, 0.1)', color: designTokens.colors.sunsetOrange, tagBg: 'rgba(255, 138, 91, 0.05)' };
      case 'error': return { bg: 'rgba(186, 26, 26, 0.1)', color: designTokens.colors.error, tagBg: 'rgba(186, 26, 26, 0.15)' };
      default: return { bg: 'rgba(174, 47, 52, 0.1)', color: designTokens.colors.primary, tagBg: 'rgba(174, 47, 52, 0.05)' };
    }
  };

  return (
    <div>
      <PageHeader 
        title="Event Management Workspace" 
        subtitle="Select a submodule to manage your event operations."
      />

      {/* Top Stats Row */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        {[
          { icon: <CalendarOutlined />, label: 'ACTIVE EVENTS', value: '42', variant: 'primary' },
          { icon: <TeamOutlined />, label: 'TOTAL RESOURCES', value: '87', variant: 'tertiary' },
          { icon: <ShopOutlined />, label: 'TOTAL VENDORS', value: '128', variant: 'secondary' },
          { icon: <FileTextOutlined />, label: 'TOTAL DOCUMENTS', value: '342', variant: 'primary' },
        ].map((stat, i) => {
          const styles = getVariantStyles(stat.variant);
          return (
            <Col span={6} key={i}>
              <Card className="card-level1" bodyStyle={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ 
                  width: 48, height: 48, borderRadius: designTokens.borderRadius.md, 
                  background: styles.bg, color: styles.color, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 
                }}>
                  {stat.icon}
                </div>
                <div>
                  <Text style={{ fontSize: 11, fontWeight: 600, color: designTokens.colors.onSurfaceVariant, letterSpacing: '0.05em' }}>
                    {stat.label}
                  </Text>
                  <Title level={3} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont }}>{stat.value}</Title>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Modules Grid */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        {modules.map(mod => {
          const styles = getVariantStyles(mod.variant);
          const isDark = mod.bgDark;
          
          return (
            <Col span={8} key={mod.id}>
              <Card 
                className="card-level1" 
                style={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  background: isDark ? designTokens.colors.inverseSurface : designTokens.colors.surface,
                  borderColor: isDark ? designTokens.colors.inverseSurface : designTokens.colors.borderGray
                }}
                bodyStyle={{ padding: '32px 24px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                  <div style={{ 
                    width: 48, height: 48, borderRadius: designTokens.borderRadius.full, 
                    background: styles.bg, color: styles.color, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 
                  }}>
                    {mod.icon}
                  </div>
                  <div style={{ flex: 1, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {mod.tags.map((tag, i) => (
                      <span key={i} style={{ 
                        fontSize: 12, fontWeight: 500, 
                        color: isDark ? '#fff' : styles.color, 
                        background: isDark ? 'rgba(255,255,255,0.1)' : styles.tagBg, 
                        padding: '2px 10px', borderRadius: designTokens.borderRadius.full 
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <Title level={4} style={{ 
                  margin: '0 0 12px 0', 
                  fontFamily: designTokens.typography.headlineFont,
                  color: isDark ? '#fff' : designTokens.colors.onSurface
                }}>
                  {mod.title}
                </Title>
                
                <Text style={{ 
                  fontSize: 14, 
                  color: isDark ? 'rgba(255,255,255,0.7)' : designTokens.colors.onSurfaceVariant, 
                  lineHeight: 1.6, 
                  marginBottom: 32,
                  flex: 1
                }}>
                  {mod.desc}
                </Text>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <ClockCircleOutlined style={{ color: isDark ? 'rgba(255,255,255,0.5)' : designTokens.colors.onSurfaceVariant, fontSize: 12 }} />
                  <Text style={{ fontSize: 12, color: isDark ? 'rgba(255,255,255,0.5)' : designTokens.colors.onSurfaceVariant }}>
                    Last updated {mod.lastUpdated}
                  </Text>
                </div>

                <Button 
                  block 
                  size="large"
                  type={mod.actionVariant === 'solid' ? 'primary' : 'default'}
                  onClick={() => navigate(mod.path)}
                  style={{ 
                    fontWeight: 600,
                    ...(mod.actionVariant === 'solid' 
                      ? { background: isDark ? designTokens.colors.sunsetOrange : styles.color, border: 'none' }
                      : { color: styles.color, borderColor: styles.color, background: 'transparent' }
                    )
                  }}
                  icon={!mod.actionVariant ? <ArrowRightOutlined /> : undefined}
                  iconPosition="end"
                >
                  {mod.actionText}
                </Button>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Recent Activity */}
      <Card className="card-level1" title={
        <Title level={5} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont }}>Recent Activity</Title>
      }>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {recentActivity.map((activity, i) => {
            const styles = getVariantStyles(activity.color);
            const isLast = i === recentActivity.length - 1;
            return (
              <div key={i} style={{ 
                display: 'flex', alignItems: 'center', padding: '16px 0', 
                borderBottom: isLast ? 'none' : `1px solid ${designTokens.colors.borderGray}` 
              }}>
                <div style={{ 
                  width: 40, height: 40, borderRadius: designTokens.borderRadius.full, 
                  background: styles.bg, color: styles.color, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                  marginRight: 16
                }}>
                  {activity.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <Text strong style={{ display: 'block', fontSize: 14 }}>{activity.title}</Text>
                  <Text style={{ fontSize: 13, color: designTokens.colors.onSurfaceVariant }}>{activity.desc}</Text>
                </div>
                <Text style={{ fontSize: 13, color: designTokens.colors.onSurfaceVariant }}>{activity.time}</Text>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default EventWorkspacePage;

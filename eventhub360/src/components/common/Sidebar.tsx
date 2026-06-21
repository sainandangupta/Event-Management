import React from 'react';
import { Layout, Menu, Button, Typography } from 'antd';
import {
  AppstoreOutlined,
  CalendarOutlined,
  ProjectOutlined,
  TeamOutlined,
  DollarOutlined,
  ShopOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
  BarChartOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { designTokens } from '../../styles/theme';

const { Sider } = Layout;
const { Text } = Typography;

const navItems = [
  { key: '/workspace', icon: <AppstoreOutlined />, label: 'Event Workspace' },
  { key: '/events', icon: <CalendarOutlined />, label: 'Events' },
  { key: '/planning', icon: <ProjectOutlined />, label: 'Planning' },
  { key: '/resources', icon: <TeamOutlined />, label: 'Resources' },
  { key: '/budget', icon: <DollarOutlined />, label: 'Budget' },
  { key: '/vendors', icon: <ShopOutlined />, label: 'Vendors' },
  { key: '/execution', icon: <PlayCircleOutlined />, label: 'Execution' },
  { key: '/documents', icon: <FileTextOutlined />, label: 'Documents' },
  { key: '/reporting', icon: <BarChartOutlined />, label: 'Reporting' },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getSelectedKey = (): string => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return '/dashboard';
    const match = navItems.find((item) => path.startsWith(item.key));
    return match ? match.key : '/dashboard';
  };

  return (
    <Sider
      width={210}
      style={{
        background: designTokens.colors.surface,
        borderRight: `1px solid ${designTokens.colors.borderGray}`,
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
      }}
    >
      <div style={{ padding: '20px 20px 16px', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
        <Text
          strong
          style={{
            fontSize: 20,
            color: designTokens.colors.primary,
            fontFamily: designTokens.typography.headlineFont,
            display: 'block',
            fontWeight: 700,
          }}
        >
          EventHub360
        </Text>
        <Text
          style={{
            fontSize: 11,
            color: designTokens.colors.onSurfaceVariant,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}
        >
          Concierge Suite
        </Text>
      </div>

      <Menu
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        className="sidebar-nav"
        style={{
          border: 'none',
          flex: 1,
          paddingTop: 4,
        }}
        items={[
          {
            key: '/dashboard',
            icon: <AppstoreOutlined />,
            label: 'Dashboard',
            onClick: () => navigate('/dashboard'),
          },
          ...navItems.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
            onClick: () => navigate(item.key),
          })),
        ]}
      />

      <div style={{ padding: '12px 16px 20px' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          block
          size="large"
          className="btn-primary-gradient"
          style={{
            height: 44,
            fontWeight: 600,
            marginBottom: 16,
          }}
          onClick={() => navigate('/events/new')}
        >
          Create Event
        </Button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Button
            type="text"
            icon={<QuestionCircleOutlined />}
            style={{
              justifyContent: 'flex-start',
              color: designTokens.colors.onSurfaceVariant,
              padding: '4px 8px',
            }}
          >
            Help Center
          </Button>
          <Button
            type="text"
            icon={<SettingOutlined />}
            style={{
              justifyContent: 'flex-start',
              color: designTokens.colors.onSurfaceVariant,
              padding: '4px 8px',
            }}
          >
            Settings
          </Button>
          <Button
            type="text"
            icon={<LogoutOutlined />}
            style={{
              justifyContent: 'flex-start',
              color: designTokens.colors.onSurfaceVariant,
              padding: '4px 8px',
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </Sider>
  );
};

export default Sidebar;

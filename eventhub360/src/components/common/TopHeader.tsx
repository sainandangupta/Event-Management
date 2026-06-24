import React from 'react';
import { Input, Badge, Avatar, Typography, Space, Dropdown } from 'antd';
import { SearchOutlined, BellOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { designTokens } from '../../styles/theme';

const { Text } = Typography;

interface TopHeaderProps {
  tabs?: { key: string; label: string; path: string }[];
  activeTab?: string;
  searchPlaceholder?: string;
}

const TopHeader: React.FC<TopHeaderProps> = ({
  tabs = [],
  activeTab,
  searchPlaceholder = 'Search events, clients, or hotels...',
}) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 32px',
        background: designTokens.colors.surface,
        borderBottom: `1px solid ${designTokens.colors.borderGray}`,
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Search */}
      <Input
        prefix={<SearchOutlined style={{ color: designTokens.colors.onSurfaceVariant }} />}
        placeholder={searchPlaceholder}
        style={{
          maxWidth: 380,
          borderRadius: designTokens.borderRadius.full,
          background: designTokens.colors.backgroundAlt,
          border: 'none',
        }}
        size="large"
      />

      {/* Tabs */}
      {tabs.length > 0 && (
        <Space size={24} style={{ marginLeft: 24 }}>
          {tabs.map((tab) => (
            <Text
              key={tab.key}
              onClick={() => navigate(tab.path)}
              style={{
                cursor: 'pointer',
                color: activeTab === tab.key
                  ? designTokens.colors.primary
                  : designTokens.colors.onSurfaceVariant,
                fontWeight: activeTab === tab.key ? 600 : 400,
                fontSize: 14,
                borderBottom: activeTab === tab.key
                  ? `2px solid ${designTokens.colors.primary}`
                  : '2px solid transparent',
                paddingBottom: 4,
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </Text>
          ))}
        </Space>
      )}

      {/* Right side */}
      <Space size={16} align="center">
        <Badge count={3} size="small">
          <BellOutlined
            style={{
              fontSize: 20,
              color: designTokens.colors.onSurfaceVariant,
              cursor: 'pointer',
            }}
          />
        </Badge>
        <SettingOutlined
          style={{
            fontSize: 18,
            color: designTokens.colors.onSurfaceVariant,
            cursor: 'pointer',
          }}
        />

        <Dropdown
          menu={{
            items: [
              { key: 'profile', label: 'My Profile' },
              { key: 'settings', label: 'Settings' },
              { type: 'divider' },
              { key: 'logout', label: 'Logout' },
            ],
          }}
          trigger={['click']}
        >
          <Space style={{ cursor: 'pointer', marginLeft: 8 }}>
            <Avatar
              size={36}
              style={{
                background: designTokens.colors.inverseSurface,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              AW
            </Avatar>
            <div style={{ lineHeight: 1.3 }}>
              <Text strong style={{ fontSize: 13, display: 'block' }}>
                Alexander West
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  color: designTokens.colors.onSurfaceVariant,
                  display: 'block',
                }}
              >
                Chief Event Architect
              </Text>
            </div>
          </Space>
        </Dropdown>
      </Space>
    </div>
  );
};

export default TopHeader;

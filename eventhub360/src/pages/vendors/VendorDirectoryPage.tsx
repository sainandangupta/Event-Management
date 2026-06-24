import React, { useState } from 'react';
import { Card, Table, Typography, Space, Button, Input, Select, Avatar, Dropdown, Row, Col, Tag } from 'antd';
import type { MenuProps } from 'antd';
import { 
  SearchOutlined, PlusOutlined, EllipsisOutlined, FilterOutlined,
  StarFilled, ShopOutlined, CheckCircleOutlined, SyncOutlined
} from '@ant-design/icons';
import PageHeader from '../../components/common/PageHeader';
import StatusTag from '../../components/common/StatusTag';
import StatCard from '../../components/common/StatCard';
import { designTokens } from '../../styles/theme';

const { Title, Text } = Typography;
const { Option } = Select;

const vendorsData = [
  { 
    id: 'V-001', 
    name: 'Elite Catering Co', 
    category: 'Catering',
    status: 'Preferred', 
    activeProjects: 3, 
    email: 'contact@elitecatering.com',
    initials: 'EC',
    rating: 4.9
  },
  { 
    id: 'V-002', 
    name: 'VisualTech AV Solutions', 
    category: 'AV & Tech',
    status: 'Active', 
    activeProjects: 1, 
    email: 'bookings@visualtech.net',
    initials: 'VT',
    rating: 4.7
  },
  { 
    id: 'V-003', 
    name: 'Moscone Venues', 
    category: 'Venue',
    status: 'Preferred', 
    activeProjects: 2, 
    email: 'events@moscone.com',
    initials: 'MV',
    rating: 4.8
  },
  { 
    id: 'V-004', 
    name: 'Floral Designs by Sarah', 
    category: 'Decor',
    status: 'Under Review', 
    activeProjects: 0, 
    email: 'sarah@floraldesigns.com',
    initials: 'FD',
    rating: 0
  },
  { 
    id: 'V-005', 
    name: 'SecureCore Guards', 
    category: 'Security',
    status: 'Active', 
    activeProjects: 4, 
    email: 'ops@securecore.com',
    initials: 'SC',
    rating: 4.5
  },
];

const VendorDirectoryPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');

  const actionMenu: MenuProps = {
    items: [
      { key: 'view', label: 'View Profile' },
      { key: 'assign', label: 'Assign to Event' },
      { key: 'message', label: 'Send Message' },
      { type: 'divider' },
      { key: 'status', label: 'Change Status' },
    ],
  };

  const columns = [
    {
      title: 'Vendor Name',
      key: 'name',
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar size={40} style={{ backgroundColor: designTokens.colors.surfaceContainerHigh, color: designTokens.colors.primary, fontWeight: 600 }}>
            {record.initials}
          </Avatar>
          <div>
            <Text strong style={{ display: 'block', fontSize: 14 }}>{record.name}</Text>
            <Text style={{ fontSize: 12, color: designTokens.colors.onSurfaceVariant }}>{record.email}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag style={{ borderRadius: designTokens.borderRadius.full, border: `1px solid ${designTokens.colors.borderGray}`, background: designTokens.colors.offWhite }}>{category}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status} />,
    },
    {
      title: 'Rating',
      key: 'rating',
      render: (_: any, record: any) => (
        record.rating > 0 ? (
          <Space size={4}>
            <StarFilled style={{ color: designTokens.colors.secondaryContainer }} />
            <Text strong>{record.rating}</Text>
          </Space>
        ) : (
          <Text style={{ color: designTokens.colors.onSurfaceVariant, fontSize: 12 }}>New</Text>
        )
      ),
    },
    {
      title: 'Active Projects',
      dataIndex: 'activeProjects',
      key: 'activeProjects',
      align: 'center' as const,
      render: (val: number) => (
        val > 0 ? (
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(174, 47, 52, 0.1)', color: designTokens.colors.primary, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
            {val}
          </div>
        ) : (
          <Text style={{ color: designTokens.colors.onSurfaceVariant }}>-</Text>
        )
      ),
    },
    {
      title: '',
      key: 'actions',
      align: 'center' as const,
      width: 60,
      render: () => (
        <Dropdown menu={actionMenu} trigger={['click']}>
          <Button type="text" icon={<EllipsisOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      <PageHeader 
        title="Vendor Directory" 
        subtitle="Manage your vendor relationships, contracts, and performance ratings."
        action={
          <Button 
            type="primary" 
            size="large" 
            icon={<PlusOutlined />} 
            className="btn-primary-gradient"
          >
            Add Vendor
          </Button>
        }
      />

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <StatCard icon={<ShopOutlined />} label="Total Vendors" value="128" variant="tertiary" />
        </Col>
        <Col span={6}>
          <StatCard icon={<CheckCircleOutlined />} label="Preferred Partners" value="45" badge="Top Tier" badgeColor={designTokens.colors.emeraldGreen} variant="success" />
        </Col>
        <Col span={6}>
          <StatCard icon={<SyncOutlined />} label="Under Review" value="12" variant="warning" />
        </Col>
        <Col span={6}>
           <div className="ai-insight-card" style={{ height: '100%', padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
             <Space align="center" style={{ marginBottom: 8 }}>
               <StarFilled style={{ fontSize: 16 }} />
               <Title level={5} style={{ margin: 0, color: 'white', fontFamily: designTokens.typography.headlineFont }}>Featured Partner</Title>
             </Space>
             <Text strong style={{ color: 'white', fontSize: 18, display: 'block', marginBottom: 4 }}>Elite Catering Co</Text>
             <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>Consistent 4.9 rating across 15+ events.</Text>
           </div>
        </Col>
      </Row>

      <Card className="card-level1" bodyStyle={{ padding: 0 }}>
        {/* Toolbar */}
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${designTokens.colors.borderGray}`, display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <Input 
              prefix={<SearchOutlined style={{ color: designTokens.colors.onSurfaceVariant }} />} 
              placeholder="Search vendors..." 
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 320, borderRadius: designTokens.borderRadius.full }}
            />
            <Select defaultValue="all_categories" style={{ width: 160 }}>
              <Option value="all_categories">All Categories</Option>
              <Option value="catering">Catering</Option>
              <Option value="av">AV & Tech</Option>
              <Option value="venue">Venue</Option>
            </Select>
            <Select defaultValue="all_status" style={{ width: 140 }}>
              <Option value="all_status">All Status</Option>
              <Option value="preferred">Preferred</Option>
              <Option value="active">Active</Option>
            </Select>
          </div>
          <Button icon={<FilterOutlined />}>Filters</Button>
        </div>

        {/* Table */}
        <Table 
          columns={columns} 
          dataSource={vendorsData} 
          pagination={{ 
            total: vendorsData.length, 
            pageSize: 10, 
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} vendors`
          }}
        />
      </Card>
    </div>
  );
};

export default VendorDirectoryPage;

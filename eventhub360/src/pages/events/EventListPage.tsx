import React, { useState } from 'react';
import { Card, Table, Typography, Space, Button, Input, Select, Avatar, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { 
  PlusOutlined, SearchOutlined, FilterOutlined,
  CalendarOutlined, EllipsisOutlined, AppstoreOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import StatusTag from '../../components/common/StatusTag';
import { designTokens } from '../../styles/theme';

const { Title, Text } = Typography;
const { Option } = Select;

// Mock Data
const eventsData = [
  { 
    id: '1', 
    name: 'TechCorp Global Summit 2025', 
    category: 'Corporate', 
    venue: 'Moscone Center, SF',
    startDate: 'Nov 12, 2024',
    endDate: 'Nov 15, 2024',
    status: 'In Progress',
    revenue: '$85,000',
    progress: 65,
    team: ['AW', 'JD', 'ER']
  },
  { 
    id: '2', 
    name: 'Sofia & James Wedding', 
    category: 'Wedding', 
    venue: 'Fairmont Estates, Napa',
    startDate: 'Dec 05, 2024',
    endDate: 'Dec 06, 2024',
    status: 'Planned',
    revenue: '$125,000',
    progress: 30,
    team: ['AW', 'JD']
  },
  { 
    id: '3', 
    name: 'Winter Wonderland Gala', 
    category: 'Gala', 
    venue: 'The Ritz-Carlton',
    startDate: 'Dec 18, 2024',
    endDate: 'Dec 18, 2024',
    status: 'Planned',
    revenue: '$45,000',
    progress: 15,
    team: ['ER', 'KL']
  },
  { 
    id: '4', 
    name: 'Q3 Executive Retreat', 
    category: 'Corporate', 
    venue: 'Meadowood Resort',
    startDate: 'Oct 15, 2024',
    endDate: 'Oct 18, 2024',
    status: 'Completed',
    revenue: '$62,000',
    progress: 100,
    team: ['AW', 'JD', 'ER', 'KL']
  },
  { 
    id: '5', 
    name: 'Healthcare Innovation Expo', 
    category: 'Expo', 
    venue: 'Javits Center, NY',
    startDate: 'Jan 22, 2025',
    endDate: 'Jan 25, 2025',
    status: 'Draft',
    revenue: '$110,000',
    progress: 5,
    team: ['AW']
  },
];

const EventListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');

  const actionMenu: MenuProps = {
    items: [
      { key: 'view', label: 'View Details' },
      { key: 'edit', label: 'Edit Event' },
      { key: 'duplicate', label: 'Duplicate' },
      { type: 'divider' },
      { key: 'archive', label: 'Archive', danger: true },
    ],
  };

  const columns = [
    {
      title: 'Event Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => navigate(`/events/${record.id}`)}>
          <div style={{ 
            width: 40, height: 40, borderRadius: designTokens.borderRadius.md, 
            background: 'rgba(174, 47, 52, 0.1)', color: designTokens.colors.primary, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 
          }}>
            {record.category === 'Wedding' ? <AppstoreOutlined /> : <CalendarOutlined />}
          </div>
          <div>
            <Text strong style={{ display: 'block', fontSize: 14 }}>{text}</Text>
            <Space size={4} style={{ color: designTokens.colors.onSurfaceVariant, fontSize: 12 }}>
              <EnvironmentOutlined />
              <Text style={{ fontSize: 12, color: designTokens.colors.onSurfaceVariant }}>{record.venue}</Text>
            </Space>
          </div>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <StatusTag status={category} />,
    },
    {
      title: 'Dates',
      key: 'dates',
      render: (_: any, record: any) => (
        <div>
          <Text style={{ display: 'block', fontSize: 13 }}>{record.startDate}</Text>
          {record.startDate !== record.endDate && (
            <Text style={{ fontSize: 12, color: designTokens.colors.onSurfaceVariant }}>to {record.endDate}</Text>
          )}
        </div>
      ),
    },
    {
      title: 'Est. Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      align: 'right' as const,
      render: (revenue: string) => <Text strong>{revenue}</Text>,
    },
    {
      title: 'Team',
      key: 'team',
      render: (_: any, record: any) => (
        <Avatar.Group maxCount={3} size="small" maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
          {record.team.map((initials: string, index: number) => (
            <Avatar key={index} style={{ backgroundColor: designTokens.colors.primary }}>{initials}</Avatar>
          ))}
        </Avatar.Group>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'right' as const,
      render: (status: string) => <StatusTag status={status} dot />,
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
        title="All Events" 
        subtitle="Manage your complete portfolio of active and planned events."
        breadcrumbs={[
          { label: 'Event Workspace', path: '/workspace' },
          { label: 'Events' }
        ]}
        action={
          <Button 
            type="primary" 
            size="large" 
            icon={<PlusOutlined />} 
            className="btn-primary-gradient"
            onClick={() => navigate('/events/new')}
          >
            Create Event
          </Button>
        }
      />

      <Card className="card-level1" bodyStyle={{ padding: 0 }}>
        {/* Toolbar */}
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${designTokens.colors.borderGray}`, display: 'flex', gap: 16 }}>
          <Input 
            prefix={<SearchOutlined style={{ color: designTokens.colors.onSurfaceVariant }} />} 
            placeholder="Search events by name, client, or venue..." 
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 320, borderRadius: designTokens.borderRadius.full }}
          />
          <Select defaultValue="all_status" style={{ width: 140 }}>
            <Option value="all_status">All Statuses</Option>
            <Option value="in_progress">In Progress</Option>
            <Option value="planned">Planned</Option>
            <Option value="draft">Draft</Option>
          </Select>
          <Select defaultValue="all_categories" style={{ width: 140 }}>
            <Option value="all_categories">All Categories</Option>
            <Option value="corporate">Corporate</Option>
            <Option value="wedding">Wedding</Option>
            <Option value="gala">Gala</Option>
          </Select>
          <Select defaultValue="all_time" style={{ width: 140 }}>
            <Option value="all_time">All Time</Option>
            <Option value="this_month">This Month</Option>
            <Option value="next_month">Next Month</Option>
            <Option value="this_year">This Year</Option>
          </Select>
          <Button icon={<FilterOutlined />}>More Filters</Button>
        </div>

        {/* Table */}
        <Table 
          columns={columns} 
          dataSource={eventsData} 
          pagination={{ 
            total: eventsData.length, 
            pageSize: 10, 
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} events`
          }}
          rowClassName={() => 'cursor-pointer'}
          onRow={(record) => {
            return {
              onClick: () => navigate(`/events/${record.id}`), // Click row to go to details
            };
          }}
        />
      </Card>
    </div>
  );
};

export default EventListPage;

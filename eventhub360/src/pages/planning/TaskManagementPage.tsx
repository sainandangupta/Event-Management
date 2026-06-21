import React, { useState } from 'react';
import { Card, Table, Typography, Space, Button, Input, Select, Avatar, Dropdown, Tag } from 'antd';
import type { MenuProps } from 'antd';
import { 
  SearchOutlined, FilterOutlined, PlusOutlined, 
  EllipsisOutlined, ClockCircleOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import PageHeader from '../../components/common/PageHeader';
import StatusTag from '../../components/common/StatusTag';
import { designTokens } from '../../styles/theme';

const { Title, Text } = Typography;
const { Option } = Select;

const tasksData = [
  { 
    id: 'T-1042', 
    title: 'Finalize Catering Menu', 
    event: 'Global Summit 2025',
    status: 'In Progress', 
    priority: 'High', 
    dueDate: 'Oct 15, 2024',
    isOverdue: false,
    assignee: { name: 'Sarah J.', initials: 'SJ', color: designTokens.colors.primary }
  },
  { 
    id: 'T-1043', 
    title: 'Sign Venue Contract', 
    event: 'Sofia Wedding',
    status: 'Pending', 
    priority: 'Critical', 
    dueDate: 'Oct 12, 2024',
    isOverdue: true,
    assignee: { name: 'Alex W.', initials: 'AW', color: designTokens.colors.tertiary }
  },
  { 
    id: 'T-1044', 
    title: 'AV Equipment Sourcing', 
    event: 'Global Summit 2025',
    status: 'Review', 
    priority: 'Medium', 
    dueDate: 'Oct 18, 2024',
    isOverdue: false,
    assignee: { name: 'Marcus W.', initials: 'MW', color: designTokens.colors.secondary }
  },
  { 
    id: 'T-1045', 
    title: 'Send Save the Dates', 
    event: 'Winter Gala',
    status: 'Completed', 
    priority: 'High', 
    dueDate: 'Oct 01, 2024',
    isOverdue: false,
    assignee: { name: 'Elena R.', initials: 'ER', color: designTokens.colors.emeraldGreen }
  },
  { 
    id: 'T-1046', 
    title: 'Book Photographer', 
    event: 'Sofia Wedding',
    status: 'In Progress', 
    priority: 'Medium', 
    dueDate: 'Oct 20, 2024',
    isOverdue: false,
    assignee: { name: 'Alex W.', initials: 'AW', color: designTokens.colors.tertiary }
  },
];

const TaskManagementPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');

  const actionMenu: MenuProps = {
    items: [
      { key: 'edit', label: 'Edit Task' },
      { key: 'reassign', label: 'Reassign' },
      { key: 'complete', label: 'Mark as Complete' },
      { type: 'divider' },
      { key: 'delete', label: 'Delete', danger: true },
    ],
  };

  const columns = [
    {
      title: 'Task Title',
      key: 'title',
      width: '35%',
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          {record.status === 'Completed' ? (
            <CheckCircleOutlined style={{ color: designTokens.colors.emeraldGreen, marginTop: 4, fontSize: 16 }} />
          ) : (
            <div style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${designTokens.colors.borderGray}`, marginTop: 2 }} />
          )}
          <div>
            <Text strong style={{ 
              display: 'block', fontSize: 14, 
              textDecoration: record.status === 'Completed' ? 'line-through' : 'none',
              color: record.status === 'Completed' ? designTokens.colors.onSurfaceVariant : designTokens.colors.onSurface
            }}>
              {record.title}
            </Text>
            <Text style={{ fontSize: 12, color: designTokens.colors.onSurfaceVariant }}>{record.event} • {record.id}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status} />,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => <StatusTag status={priority} />,
    },
    {
      title: 'Assignee',
      key: 'assignee',
      render: (_: any, record: any) => (
        <Space>
          <Avatar size={24} style={{ backgroundColor: record.assignee.color, fontSize: 10 }}>{record.assignee.initials}</Avatar>
          <Text style={{ fontSize: 13 }}>{record.assignee.name}</Text>
        </Space>
      ),
    },
    {
      title: 'Due Date',
      key: 'dueDate',
      render: (_: any, record: any) => (
        <Space size={6} style={{ color: record.isOverdue ? designTokens.colors.error : designTokens.colors.onSurfaceVariant }}>
          <ClockCircleOutlined />
          <Text strong={record.isOverdue} style={{ color: 'inherit', fontSize: 13 }}>{record.dueDate}</Text>
          {record.isOverdue && <Tag color="error" style={{ margin: 0, marginLeft: 4, borderRadius: designTokens.borderRadius.full, border: 'none' }}>Overdue</Tag>}
        </Space>
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
        title="Task Management" 
        subtitle="Manage and track all operational tasks across your events."
        breadcrumbs={[
          { label: 'Planning', path: '/planning' },
          { label: 'Tasks' }
        ]}
        action={
          <Button 
            type="primary" 
            size="large" 
            icon={<PlusOutlined />} 
            className="btn-primary-gradient"
          >
            New Task
          </Button>
        }
      />

      <Card className="card-level1" bodyStyle={{ padding: 0 }}>
        {/* Toolbar */}
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${designTokens.colors.borderGray}`, display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <Input 
              prefix={<SearchOutlined style={{ color: designTokens.colors.onSurfaceVariant }} />} 
              placeholder="Search tasks..." 
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 280, borderRadius: designTokens.borderRadius.full }}
            />
            <Select defaultValue="my_tasks" style={{ width: 140 }}>
              <Option value="all_tasks">All Tasks</Option>
              <Option value="my_tasks">My Tasks</Option>
              <Option value="unassigned">Unassigned</Option>
            </Select>
            <Select defaultValue="all_events" style={{ width: 180 }}>
              <Option value="all_events">All Events</Option>
              <Option value="global_summit">Global Summit 2025</Option>
              <Option value="sofia_wedding">Sofia Wedding</Option>
            </Select>
          </div>
          <Space>
            <Button icon={<FilterOutlined />}>Filter</Button>
            <Button>Sort</Button>
          </Space>
        </div>

        {/* Table */}
        <Table 
          columns={columns} 
          dataSource={tasksData} 
          pagination={{ 
            total: tasksData.length, 
            pageSize: 10, 
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} tasks`
          }}
        />
      </Card>
    </div>
  );
};

export default TaskManagementPage;

import React from 'react';
import { Card, Typography, Space, Button, Tabs, Row, Col, Input, Avatar, Tag } from 'antd';
import { 
  ArrowLeftOutlined, EnvironmentOutlined, CalendarOutlined, ClockCircleOutlined,
  SearchOutlined, MailOutlined, PhoneOutlined, MessageOutlined, PlusOutlined,
  TeamOutlined, UsergroupAddOutlined, SolutionOutlined, MessageFilled
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import StatusTag from '../../components/common/StatusTag';
import StatCard from '../../components/common/StatCard';
import { designTokens } from '../../styles/theme';

const { Title, Text } = Typography;

const teamMembers = [
  { id: '1', name: 'Alexander West', role: 'Chief Event Architect', email: 'alex@eventhub.com', phone: '+1 (555) 0123', status: 'Available', isLead: true, initials: 'AW' },
  { id: '2', name: 'Sarah Jenkins', role: 'Logistics Coordinator', email: 'sarah@eventhub.com', phone: '+1 (555) 0124', status: 'Busy', isLead: false, initials: 'SJ' },
  { id: '3', name: 'Marcus Wright', role: 'Technical Director', email: 'marcus@eventhub.com', phone: '+1 (555) 0125', status: 'On-site specialized', isLead: false, initials: 'MW' },
  { id: '4', name: 'Elena Rodriguez', role: 'Client Relations Manager', email: 'elena@eventhub.com', phone: '+1 (555) 0126', status: 'Available', isLead: false, initials: 'ER' },
  { id: '5', name: 'David Chen', role: 'Creative Director', email: 'david@eventhub.com', phone: '+1 (555) 0127', status: 'Overloaded', isLead: false, initials: 'DC' },
];

const EventTeamPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleTabChange = (key: string) => {
    if (key === 'overview') navigate(`/events/${id}`);
    if (key === 'phases') navigate(`/events/${id}/phases`);
  };

  return (
    <div>
      <Button 
        type="text" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/events')}
        style={{ marginBottom: 16, paddingLeft: 0, color: designTokens.colors.onSurfaceVariant }}
      >
        Back to Events
      </Button>

      <PageHeader 
        title="TechCorp Global Summit 2025" 
        subtitle={
          <Space size={16} style={{ marginTop: 8 }}>
            <Space><EnvironmentOutlined /> Moscone Center, SF</Space>
            <Space><CalendarOutlined /> Nov 12 - Nov 15, 2024</Space>
            <Space><ClockCircleOutlined /> 45 Days Away</Space>
          </Space>
        }
      />

      <Tabs 
        activeKey="team" 
        onChange={handleTabChange}
        items={[
          { key: 'overview', label: 'Overview' },
          { key: 'phases', label: 'Phases' },
          { key: 'team', label: 'Team' },
          { key: 'timeline', label: 'Timeline' },
          { key: 'planning', label: 'Planning' },
          { key: 'resources', label: 'Resources' },
          { key: 'budget', label: 'Budget' },
          { key: 'vendors', label: 'Vendors' },
          { key: 'documents', label: 'Documents' },
        ]}
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col span={6}>
          <StatCard icon={<TeamOutlined />} label="Total Staff" value="12" variant="primary" />
        </Col>
        <Col span={6}>
          <StatCard icon={<UsergroupAddOutlined />} label="Leads Assigned" value="4" variant="secondary" />
        </Col>
        <Col span={6}>
          <StatCard icon={<SolutionOutlined />} label="Tasks Active" value="38" variant="tertiary" />
        </Col>
        <Col span={6}>
          <StatCard icon={<MessageFilled />} label="Open Channels" value="6" variant="success" />
        </Col>
      </Row>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <Input 
          prefix={<SearchOutlined style={{ color: designTokens.colors.onSurfaceVariant }} />} 
          placeholder="Search team members by name or role..." 
          style={{ width: 320, borderRadius: designTokens.borderRadius.full }}
          size="large"
        />
        <Button type="primary" className="btn-primary-gradient" size="large" icon={<PlusOutlined />}>Assign Member</Button>
      </div>

      <Row gutter={[24, 24]}>
        {teamMembers.map(member => (
          <Col span={8} key={member.id}>
            <Card className="card-level1" bodyStyle={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 16 }}>
                  <Avatar size={48} style={{ backgroundColor: member.isLead ? designTokens.colors.primary : designTokens.colors.tertiary }}>
                    {member.initials}
                  </Avatar>
                  <div>
                    <Title level={5} style={{ margin: '0 0 4px', fontFamily: designTokens.typography.headlineFont }}>{member.name}</Title>
                    <Text style={{ color: designTokens.colors.onSurfaceVariant, fontSize: 13, display: 'block' }}>{member.role}</Text>
                    {member.isLead && <Tag color="error" style={{ marginTop: 4, borderRadius: designTokens.borderRadius.full, border: 'none', background: 'rgba(174, 47, 52, 0.1)', color: designTokens.colors.primary }}>Lead</Tag>}
                  </div>
                </div>
              </div>
              
              <div style={{ background: designTokens.colors.backgroundAlt, padding: 12, borderRadius: designTokens.borderRadius.default, marginBottom: 16 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                   <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: member.status === 'Available' ? designTokens.colors.emeraldGreen : member.status === 'Busy' ? designTokens.colors.sunsetOrange : designTokens.colors.tertiary }} />
                   <Text strong style={{ fontSize: 12 }}>Status: {member.status}</Text>
                 </div>
                 <Space direction="vertical" size={4} style={{ width: '100%' }}>
                   <Text style={{ fontSize: 13, color: designTokens.colors.onSurfaceVariant }}><MailOutlined /> {member.email}</Text>
                   <Text style={{ fontSize: 13, color: designTokens.colors.onSurfaceVariant }}><PhoneOutlined /> {member.phone}</Text>
                 </Space>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <Button style={{ flex: 1 }} icon={<MessageOutlined />}>Message</Button>
                <Button style={{ flex: 1 }}>View Tasks</Button>
              </div>
            </Card>
          </Col>
        ))}
        
        <Col span={8}>
          <div className="add-card-dashed" style={{ height: '100%', minHeight: 250, borderRadius: designTokens.borderRadius.xl, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: designTokens.colors.onSurfaceVariant }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 16 }}>
              <PlusOutlined />
            </div>
            <Text strong>Add Specialist</Text>
            <Text style={{ fontSize: 13 }}>Invite external or internal staff</Text>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default EventTeamPage;

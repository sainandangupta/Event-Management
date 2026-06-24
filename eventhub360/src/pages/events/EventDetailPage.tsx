import React from 'react';
import { Card, Typography, Space, Button, Tabs, Row, Col, Progress, Avatar, Divider, Tag } from 'antd';
import { 
  ArrowLeftOutlined, CalendarOutlined, EnvironmentOutlined, 
  VideoCameraOutlined, UserOutlined, ClockCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import StatusTag from '../../components/common/StatusTag';
import { designTokens } from '../../styles/theme';

const { Title, Text } = Typography;

const EventDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleTabChange = (key: string) => {
    if (key === 'phases') navigate(`/events/${id}/phases`);
    if (key === 'team') navigate(`/events/${id}/team`);
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
        action={
          <Space size={12}>
            <Button size="large">Export Report</Button>
            <Button size="large" type="primary" className="btn-primary-gradient">Edit Details</Button>
          </Space>
        }
      />

      <Tabs 
        defaultActiveKey="overview" 
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

      <Row gutter={[24, 24]}>
        <Col span={16}>
          <Card className="card-level1" title={<Title level={5} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont }}>Project Summary</Title>} style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 16, lineHeight: 1.6, color: designTokens.colors.onSurfaceVariant }}>
              The annual global summit for TechCorp executives, partners, and top tier clients. 
              This year's focus is on AI integration and sustainable tech solutions. 
              Includes main keynote stages, 15 breakout rooms, and an evening gala on day 2.
            </Text>
          </Card>

          <Card className="card-level1" title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={5} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont }}>Upcoming Milestones</Title>
              <Button type="link" style={{ padding: 0 }}>View All Timeline</Button>
            </div>
          }>
             <Space direction="vertical" size={20} style={{ width: '100%' }}>
               <div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                   <Text strong>Catering Menu Finalization</Text>
                   <Text style={{ color: designTokens.colors.onSurfaceVariant }}>Due in 2 days</Text>
                 </div>
                 <Progress percent={85} strokeColor={designTokens.colors.primary} />
               </div>
               <div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                   <Text strong>AV Equipment Load-in Schedule</Text>
                   <Text style={{ color: designTokens.colors.onSurfaceVariant }}>Due in 5 days</Text>
                 </div>
                 <Progress percent={40} strokeColor={designTokens.colors.secondaryContainer} />
               </div>
             </Space>
          </Card>
        </Col>

        <Col span={8}>
          <Card className="card-level1" style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 11, fontWeight: 600, color: designTokens.colors.onSurfaceVariant, textTransform: 'uppercase' }}>Lead Manager</Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 16 }}>
              <Avatar size={48} style={{ backgroundColor: designTokens.colors.primary }}>AW</Avatar>
              <div>
                <Text strong style={{ fontSize: 16, display: 'block' }}>Alexander West</Text>
                <Text style={{ color: designTokens.colors.onSurfaceVariant }}>Chief Event Architect</Text>
              </div>
            </div>
            <Button block style={{ marginTop: 16 }}>Message</Button>
          </Card>

          <Card className="card-level1" title={<Title level={5} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont }}>Budget Health</Title>}>
             <div style={{ textAlign: 'center', marginBottom: 16 }}>
               <Title level={2} style={{ margin: 0, color: designTokens.colors.emeraldGreen }}>$85,000</Title>
               <Text style={{ color: designTokens.colors.onSurfaceVariant }}>of $120,000 budget used</Text>
             </div>
             <Progress percent={71} strokeColor={designTokens.colors.emeraldGreen} showInfo={false} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col span={24}>
           <Card className="card-level1" title={<Title level={5} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont }}>Visual Concept Board</Title>}>
             <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16 }}>
               {[1, 2, 3, 4].map(i => (
                 <div key={i} style={{ 
                   minWidth: 200, height: 140, 
                   borderRadius: designTokens.borderRadius.md,
                   backgroundColor: designTokens.colors.borderGray,
                   backgroundImage: `url(https://images.unsplash.com/photo-${1500000000000 + i}?auto=format&fit=crop&q=80&w=400&h=300)`,
                   backgroundSize: 'cover',
                   backgroundPosition: 'center'
                 }} />
               ))}
             </div>
           </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EventDetailPage;

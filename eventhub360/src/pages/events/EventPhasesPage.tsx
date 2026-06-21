import React from 'react';
import { Card, Typography, Space, Button, Tabs, Row, Col, Progress, Steps, Avatar, Tag } from 'antd';
import { 
  ArrowLeftOutlined, EnvironmentOutlined, CalendarOutlined, ClockCircleOutlined,
  CheckCircleOutlined, SafetyCertificateOutlined, SettingOutlined, UserOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import StatusTag from '../../components/common/StatusTag';
import { designTokens } from '../../styles/theme';

const { Title, Text } = Typography;

const EventPhasesPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleTabChange = (key: string) => {
    if (key === 'overview') navigate(`/events/${id}`);
    if (key === 'team') navigate(`/events/${id}/team`);
  };

  const phases = [
    {
      title: 'Inception & Discovery',
      status: 'Complete',
      date: 'Oct 01 - Oct 15',
      lead: 'Alexander West',
      tasks: [
        { name: 'Initial Client Briefing', done: true },
        { name: 'Budget Approval', done: true },
        { name: 'Concept Finalization', done: true }
      ]
    },
    {
      title: 'Strategic Planning',
      status: 'Complete',
      date: 'Oct 16 - Nov 01',
      lead: 'Sarah Jenkins',
      tasks: [
        { name: 'Venue Selection', done: true },
        { name: 'Vendor Sourcing', done: true },
        { name: 'Marketing Plan', done: true }
      ]
    },
    {
      title: 'Technical Logistics',
      status: 'Active Phase',
      date: 'Nov 02 - Nov 10',
      lead: 'Marcus Wright',
      tasks: [
        { name: 'AV Equipment Setup', done: true },
        { name: 'Network Infrastructure', done: false },
        { name: 'Stage Rigging', done: false }
      ]
    },
    {
      title: 'Event Execution',
      status: 'Locked',
      date: 'Nov 12 - Nov 15',
      lead: 'Alexander West',
      tasks: [
        { name: 'Staff Briefing', done: false },
        { name: 'Live Stream Check', done: false },
        { name: 'VIP Handling', done: false }
      ]
    }
  ];

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
        activeKey="phases" 
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
        <Col span={8}>
          <Card className="card-level1" bodyStyle={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
             <div style={{ width: 48, height: 48, borderRadius: designTokens.borderRadius.md, background: 'rgba(105, 81, 155, 0.1)', color: designTokens.colors.tertiary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
               <SettingOutlined />
             </div>
             <div>
               <Text style={{ fontSize: 11, fontWeight: 600, color: designTokens.colors.onSurfaceVariant, textTransform: 'uppercase' }}>Current Progress</Text>
               <Title level={3} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont }}>Phase 3 of 5</Title>
             </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card className="card-level1" bodyStyle={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
             <div style={{ width: 48, height: 48, borderRadius: designTokens.borderRadius.md, background: 'rgba(76, 175, 141, 0.1)', color: designTokens.colors.emeraldGreen, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
               <CheckCircleOutlined />
             </div>
             <div>
               <Text style={{ fontSize: 11, fontWeight: 600, color: designTokens.colors.onSurfaceVariant, textTransform: 'uppercase' }}>Completed</Text>
               <Title level={3} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont }}>2 Phases</Title>
             </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card className="card-level1" bodyStyle={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
             <div style={{ width: 48, height: 48, borderRadius: designTokens.borderRadius.md, background: 'rgba(255, 138, 91, 0.1)', color: designTokens.colors.sunsetOrange, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
               <ClockCircleOutlined />
             </div>
             <div>
               <Text style={{ fontSize: 11, fontWeight: 600, color: designTokens.colors.onSurfaceVariant, textTransform: 'uppercase' }}>Time Remaining</Text>
               <Title level={3} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont }}>14 Days Left</Title>
             </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[32, 24]}>
        <Col span={8}>
          <div style={{ padding: '0 12px' }}>
            <Steps
              direction="vertical"
              current={2}
              items={phases.map(p => ({
                title: <Text strong style={{ fontSize: 16 }}>{p.title}</Text>,
                description: <Text style={{ color: designTokens.colors.onSurfaceVariant }}>{p.date}</Text>
              }))}
            />
          </div>
        </Col>
        
        <Col span={16}>
          <Space direction="vertical" size={24} style={{ width: '100%' }}>
            {phases.map((phase, index) => {
              const isLocked = phase.status === 'Locked';
              const isActive = phase.status === 'Active Phase';
              
              return (
                <Card 
                  key={index} 
                  className={isActive ? 'card-level1' : ''}
                  style={{ 
                    border: `1px solid ${isActive ? designTokens.colors.primary : designTokens.colors.borderGray}`,
                    opacity: isLocked ? 0.6 : 1,
                    background: isLocked ? designTokens.colors.offWhite : designTokens.colors.surface
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <Title level={4} style={{ margin: '0 0 8px 0', fontFamily: designTokens.typography.headlineFont }}>
                        {phase.title}
                      </Title>
                      <Space size={16}>
                        <Text style={{ color: designTokens.colors.onSurfaceVariant }}><CalendarOutlined /> {phase.date}</Text>
                        <Text style={{ color: designTokens.colors.onSurfaceVariant }}><UserOutlined /> Lead: {phase.lead}</Text>
                      </Space>
                    </div>
                    {isActive ? (
                      <Tag color="processing" style={{ borderRadius: designTokens.borderRadius.full }}>{phase.status}</Tag>
                    ) : (
                      <Text strong style={{ color: phase.status === 'Complete' ? designTokens.colors.emeraldGreen : designTokens.colors.onSurfaceVariant }}>
                        {phase.status}
                      </Text>
                    )}
                  </div>
                  
                  <div style={{ background: designTokens.colors.backgroundAlt, padding: 16, borderRadius: designTokens.borderRadius.default }}>
                    <Text strong style={{ display: 'block', marginBottom: 12 }}>Key Tasks</Text>
                    {phase.tasks.map((task, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        {task.done ? (
                          <CheckCircleOutlined style={{ color: designTokens.colors.emeraldGreen }} />
                        ) : (
                          <div style={{ width: 14, height: 14, border: `1px solid ${designTokens.colors.onSurfaceVariant}`, borderRadius: '50%' }} />
                        )}
                        <Text style={{ textDecoration: task.done ? 'line-through' : 'none', color: task.done ? designTokens.colors.onSurfaceVariant : designTokens.colors.onSurface }}>
                          {task.name}
                        </Text>
                      </div>
                    ))}
                  </div>
                  
                  {isActive && (
                    <Button type="primary" className="btn-primary-gradient" style={{ marginTop: 16 }}>View Full Phase Details</Button>
                  )}
                </Card>
              );
            })}
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default EventPhasesPage;

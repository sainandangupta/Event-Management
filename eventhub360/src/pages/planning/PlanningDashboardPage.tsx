import React from 'react';
import { Card, Row, Col, Typography, Space, Button, Progress, Avatar, Divider } from 'antd';
import { 
  ProjectOutlined, CheckCircleOutlined, CalendarOutlined, ThunderboltOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip 
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import { designTokens } from '../../styles/theme';

const { Title, Text } = Typography;

const taskData = [
  { name: 'Completed', value: 145, color: designTokens.colors.emeraldGreen },
  { name: 'In Progress', value: 42, color: designTokens.colors.primary },
  { name: 'Review', value: 18, color: designTokens.colors.secondaryContainer },
  { name: 'Overdue', value: 5, color: designTokens.colors.error },
];

const upcomingMilestones = [
  { id: '1', date: 'Oct 15', title: 'Venue Contract Signing', event: 'Global Summit', status: 'On Track', color: 'success' },
  { id: '2', date: 'Oct 18', title: 'Catering Menu Lock', event: 'Sofia Wedding', status: 'At Risk', color: 'warning' },
  { id: '3', date: 'Oct 22', title: 'AV Specs Finalized', event: 'Global Summit', status: 'Pending', color: 'default' },
];

const activeTimelines = [
  { id: '1', name: 'TechCorp Global Summit 2025', progress: 68, status: 'On Track', color: designTokens.colors.emeraldGreen },
  { id: '2', name: 'Sofia & James Wedding', progress: 34, status: 'Delayed', color: designTokens.colors.sunsetOrange },
  { id: '3', name: 'Winter Wonderland Gala', progress: 12, status: 'Just Started', color: designTokens.colors.primary },
];

const PlanningDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader 
        title="Planning & Logistics Workspace" 
        subtitle="Track tasks, milestones, and timelines across all active events."
        action={
          <Space size={16}>
            <Button size="large" onClick={() => navigate('/planning/calendar')}>Master Calendar</Button>
            <Button size="large" type="primary" className="btn-primary-gradient" onClick={() => navigate('/planning/tasks')}>Task Management</Button>
          </Space>
        }
      />

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col span={16}>
          <Card className="card-level1" style={{ height: '100%' }}>
             <Row gutter={48}>
               <Col span={12}>
                 <Text style={{ fontSize: 11, fontWeight: 600, color: designTokens.colors.onSurfaceVariant, textTransform: 'uppercase' }}>Overall Planning Progress</Text>
                 <div style={{ marginTop: 24, marginBottom: 32 }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                     <Title level={1} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont, fontSize: 48 }}>68%</Title>
                     <Text strong style={{ color: designTokens.colors.emeraldGreen }}>+5% this week</Text>
                   </div>
                   <Progress percent={68} strokeColor={designTokens.colors.primary} showInfo={false} size="default" />
                 </div>
                 <Space size={32}>
                   <div>
                     <Text style={{ color: designTokens.colors.onSurfaceVariant, fontSize: 13, display: 'block' }}>Tasks Completed</Text>
                     <Text strong style={{ fontSize: 20 }}>145 / 210</Text>
                   </div>
                   <div>
                     <Text style={{ color: designTokens.colors.onSurfaceVariant, fontSize: 13, display: 'block' }}>Milestones Met</Text>
                     <Text strong style={{ fontSize: 20 }}>12 / 18</Text>
                   </div>
                 </Space>
               </Col>
               
               <Col span={12} style={{ borderLeft: `1px solid ${designTokens.colors.borderGray}` }}>
                 <Title level={5} style={{ margin: '0 0 16px', fontFamily: designTokens.typography.headlineFont }}>Task Status</Title>
                 <div style={{ display: 'flex', alignItems: 'center', height: 180 }}>
                   <div style={{ width: 160, height: 160 }}>
                     <ResponsiveContainer>
                       <PieChart>
                         <Pie
                           data={taskData}
                           cx="50%" cy="50%"
                           innerRadius={50} outerRadius={70}
                           paddingAngle={5}
                           dataKey="value"
                           stroke="none"
                         >
                           {taskData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                         </Pie>
                         <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: designTokens.shadows.level1 }} />
                       </PieChart>
                     </ResponsiveContainer>
                   </div>
                   <div style={{ flex: 1, paddingLeft: 16 }}>
                     {taskData.map((item, i) => (
                       <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                         <Space size={8}>
                           <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: item.color }} />
                           <Text style={{ fontSize: 13 }}>{item.name}</Text>
                         </Space>
                         <Text strong style={{ fontSize: 13 }}>{item.value}</Text>
                       </div>
                     ))}
                   </div>
                 </div>
               </Col>
             </Row>
          </Card>
        </Col>

        <Col span={8}>
          <Card className="card-level1" style={{ height: '100%', background: `linear-gradient(135deg, ${designTokens.colors.surface} 0%, ${designTokens.colors.offWhite} 100%)` }}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Title level={5} style={{ margin: '0 0 24px', fontFamily: designTokens.typography.headlineFont }}>Planning Metrics</Title>
              
              <div style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 12, color: designTokens.colors.onSurfaceVariant, display: 'block', marginBottom: 4 }}>Confirmed Vendors</Text>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Title level={3} style={{ margin: 0 }}>45 / 62</Title>
                  <Progress type="circle" percent={72} size={40} strokeColor={designTokens.colors.secondaryContainer} />
                </div>
              </div>
              
              <div style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 12, color: designTokens.colors.onSurfaceVariant, display: 'block', marginBottom: 4 }}>Total Attendees Managed</Text>
                <Title level={3} style={{ margin: 0 }}>1,240</Title>
              </div>

              <div style={{ marginTop: 'auto' }}>
                <Text style={{ fontSize: 12, color: designTokens.colors.onSurfaceVariant, display: 'block', marginBottom: 4 }}>Budget Burn Rate</Text>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Title level={3} style={{ margin: 0, color: designTokens.colors.primary }}>$142k</Title>
                  <Text strong style={{ color: designTokens.colors.error }}>High</Text>
                </div>
                <Progress percent={65} strokeColor={designTokens.colors.primary} showInfo={false} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Card className="card-level1" title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={5} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont }}>Upcoming Milestones</Title>
              <Button type="link" style={{ padding: 0 }}>View All</Button>
            </div>
          }>
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              {upcomingMilestones.map(m => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0', borderBottom: `1px solid ${designTokens.colors.borderGray}` }}>
                  <div style={{ 
                    minWidth: 56, height: 56, borderRadius: designTokens.borderRadius.md, 
                    background: designTokens.colors.offWhite, border: `1px solid ${designTokens.colors.borderGray}`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' 
                  }}>
                    <Text style={{ fontSize: 11, fontWeight: 600, color: designTokens.colors.onSurfaceVariant, textTransform: 'uppercase' }}>{m.date.split(' ')[0]}</Text>
                    <Text strong style={{ fontSize: 16, color: designTokens.colors.primary }}>{m.date.split(' ')[1]}</Text>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text strong style={{ display: 'block', fontSize: 15 }}>{m.title}</Text>
                    <Text style={{ color: designTokens.colors.onSurfaceVariant, fontSize: 13 }}>{m.event}</Text>
                  </div>
                  <div>
                    <Text strong style={{ 
                      fontSize: 12, 
                      color: m.color === 'success' ? designTokens.colors.emeraldGreen : m.color === 'warning' ? designTokens.colors.sunsetOrange : designTokens.colors.onSurfaceVariant,
                      background: m.color === 'success' ? 'rgba(76, 175, 141, 0.1)' : m.color === 'warning' ? 'rgba(255, 138, 91, 0.1)' : 'rgba(0,0,0,0.05)',
                      padding: '4px 12px',
                      borderRadius: designTokens.borderRadius.full
                    }}>
                      {m.status}
                    </Text>
                  </div>
                </div>
              ))}
            </Space>
          </Card>
        </Col>

        <Col span={12}>
          <div className="ai-insight-card" style={{ marginBottom: 24 }}>
             <Space align="center" style={{ marginBottom: 12 }}>
               <ThunderboltOutlined style={{ fontSize: 20 }} />
               <Title level={5} style={{ margin: 0, color: 'white', fontFamily: designTokens.typography.headlineFont }}>AI-Assisted Scheduling</Title>
             </Space>
             <p style={{ fontSize: 14, margin: '0 0 16px', color: 'rgba(255,255,255,0.9)' }}>
               Based on historical data for Gala events, your catering timeline is currently 5 days behind optimal schedule. Would you like me to adjust dependent tasks?
             </p>
             <Button style={{ background: 'white', color: designTokens.colors.primary, border: 'none', fontWeight: 600 }}>Auto-Adjust Timeline</Button>
          </div>

          <Card className="card-level1" title={
            <Title level={5} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont }}>Active Timelines Summary</Title>
          }>
            <Space direction="vertical" size={24} style={{ width: '100%' }}>
              {activeTimelines.map(t => (
                <div key={t.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text strong>{t.name}</Text>
                    <Text strong style={{ color: t.color }}>{t.status}</Text>
                  </div>
                  <Progress percent={t.progress} strokeColor={t.color} trailColor={designTokens.colors.borderGray} />
                </div>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PlanningDashboardPage;

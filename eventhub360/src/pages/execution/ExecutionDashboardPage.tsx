import React from 'react';
import { Card, Row, Col, Typography, Space, Button, Tabs, Avatar } from 'antd';
import { 
  ApiOutlined, TeamOutlined, WarningOutlined, WifiOutlined,
  EnvironmentOutlined, CheckCircleOutlined, ExclamationCircleOutlined, ClockCircleOutlined
} from '@ant-design/icons';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import { designTokens } from '../../styles/theme';

const { Title, Text } = Typography;

const activityStream = [
  { id: '1', type: 'critical', title: 'Incident Logged:', desc: 'Medical Assist in Zone C.', time: '2 mins ago', loc: 'Venue A1', icon: <ExclamationCircleOutlined /> },
  { id: '2', type: 'success', title: 'Checklist Complete:', desc: 'VIP Greenroom Prep.', time: '12 mins ago', loc: 'Sarah J.', icon: <CheckCircleOutlined /> },
  { id: '3', type: 'info', title: 'Staff Relocation:', desc: '4 stewards moved to Entrance B.', time: '25 mins ago', loc: 'Ops Control', icon: <EnvironmentOutlined /> },
  { id: '4', type: 'info', title: 'Data Sync:', desc: 'Vendor inventory updated.', time: '1 hour ago', loc: 'System', icon: <ClockCircleOutlined /> },
];

const ExecutionDashboardPage: React.FC = () => {
  return (
    <div>
      <PageHeader 
        title="Command Center" 
        subtitle="Live Operations Dashboard for TechCorp Global Summit 2025"
        action={
          <Space size={16}>
            <Button size="large" icon={<CheckCircleOutlined />}>Launch Checklist</Button>
            <Button size="large" type="primary" danger icon={<WarningOutlined />}>Report Incident</Button>
          </Space>
        }
      />

      <Tabs 
        defaultActiveKey="command" 
        items={[
          { key: 'command', label: 'Command Center' },
          { key: 'incident', label: 'Incident Management' },
          { key: 'logs', label: 'Activity Logs' },
          { key: 'checklists', label: 'Checklists' },
        ]}
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <StatCard icon={<ApiOutlined />} label="Live Events" value="12" trend={{ value: '+2 Active', direction: 'up' }} variant="primary" />
        </Col>
        <Col span={6}>
          <StatCard icon={<TeamOutlined />} label="Active Staff" value="142" badge="84% Shift Fill" badgeColor={designTokens.colors.secondary} variant="secondary" />
        </Col>
        <Col span={6}>
          <StatCard icon={<WarningOutlined />} label="Open Incidents" value="03" badge="Needs Action" badgeColor={designTokens.colors.error} variant="error" />
        </Col>
        <Col span={6}>
          <StatCard icon={<WifiOutlined />} label="Network Pulse" value="99.8% Up" badge="All Clear" badgeColor={designTokens.colors.emeraldGreen} variant="success" />
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col span={16}>
           <Card className="card-level1" title={
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div>
                 <Title level={5} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont }}>Live Pulse Visualization</Title>
                 <Text style={{ color: designTokens.colors.onSurfaceVariant, fontSize: 14 }}>Real-time attendance and task throughput across all venues</Text>
               </div>
               <Space>
                 <Button type="primary" ghost size="small" style={{ borderRadius: 16 }}>Map View</Button>
                 <Button type="text" size="small" style={{ borderRadius: 16 }}>Timeline View</Button>
               </Space>
             </div>
           } style={{ height: '100%' }} bodyStyle={{ padding: 0 }}>
             <div style={{ 
               height: 500, width: '100%', 
               backgroundColor: '#8da0ac', 
               backgroundImage: `url(https://images.unsplash.com/photo-1576085898323-218337e3e43c?auto=format&fit=crop&q=80&w=1200&h=800)`,
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               position: 'relative'
             }}>
               {/* Map Overlays */}
               <div style={{ position: 'absolute', top: 40, left: 40, width: 320 }}>
                 <Card bodyStyle={{ padding: 16 }} className="glass-overlay">
                   <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                     <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: designTokens.colors.emeraldGreen }} />
                     <Text strong>Main Ballroom B</Text>
                   </div>
                   <Text style={{ fontSize: 13, color: designTokens.colors.onSurface, display: 'block' }}>
                     Gala Dinner in progress. Service staff optimized.
                   </Text>
                   <Text style={{ fontSize: 12, color: designTokens.colors.onSurfaceVariant, display: 'block', marginTop: 4 }}>
                     420/500 seated.
                   </Text>
                 </Card>
               </div>
               
               <div style={{ position: 'absolute', top: 160, left: 40, width: 320 }}>
                 <Card bodyStyle={{ padding: 16 }} className="glass-overlay">
                   <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                     <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: designTokens.colors.sunsetOrange }} />
                     <Text strong>Tech Pavilion</Text>
                   </div>
                   <Text style={{ fontSize: 13, color: designTokens.colors.onSurface, display: 'block' }}>
                     High traffic at Registration West. Redirecting flow to East entrance.
                   </Text>
                 </Card>
               </div>
             </div>
           </Card>
        </Col>

        <Col span={8}>
          <Card className="card-level1" title={
            <Title level={5} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont }}>Activity Stream</Title>
          } style={{ height: '100%' }}>
            
            <Space size={8} style={{ marginBottom: 24, flexWrap: 'wrap' }}>
              <Button size="small" type="primary" danger style={{ borderRadius: 16, fontSize: 11 }}>CRITICAL</Button>
              <Button size="small" style={{ borderRadius: 16, fontSize: 11, background: designTokens.colors.borderGray, border: 'none' }}>UPDATES</Button>
              <Button size="small" style={{ borderRadius: 16, fontSize: 11, background: designTokens.colors.borderGray, border: 'none' }}>STAFF</Button>
            </Space>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {activityStream.map(activity => (
                <div key={activity.id} style={{ display: 'flex', gap: 16 }}>
                   <div style={{ 
                     width: 32, height: 32, borderRadius: '50%', 
                     display: 'flex', alignItems: 'center', justifyContent: 'center',
                     background: activity.type === 'critical' ? 'rgba(186, 26, 26, 0.1)' : activity.type === 'success' ? 'rgba(76, 175, 141, 0.1)' : 'rgba(105, 81, 155, 0.1)',
                     color: activity.type === 'critical' ? designTokens.colors.error : activity.type === 'success' ? designTokens.colors.emeraldGreen : designTokens.colors.tertiary
                   }}>
                     {activity.icon}
                   </div>
                   <div style={{ flex: 1 }}>
                     <Text strong style={{ fontSize: 14 }}>{activity.title}</Text>
                     <Text style={{ fontSize: 14, display: 'block', marginBottom: 4 }}>{activity.desc}</Text>
                     <Text style={{ fontSize: 12, color: designTokens.colors.onSurfaceVariant }}>{activity.time} • {activity.loc}</Text>
                   </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ExecutionDashboardPage;

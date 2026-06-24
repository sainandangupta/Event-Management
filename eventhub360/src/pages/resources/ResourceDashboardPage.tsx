import React from 'react';
import { Card, Row, Col, Typography, Space, Button, Progress, Select, Tag } from 'antd';
import { 
  TeamOutlined, WarningOutlined, ClockCircleOutlined, SettingOutlined,
  ThunderboltOutlined, CarOutlined, BankOutlined, ToolOutlined
} from '@ant-design/icons';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import { designTokens } from '../../styles/theme';

const { Title, Text } = Typography;

const utilizationData = [
  { name: 'W1', value: 40 },
  { name: 'W2', value: 45 },
  { name: 'W3', value: 55 },
  { name: 'W4', value: 75 },
  { name: 'W5', value: 85 },
  { name: 'W6', value: 92 }, // Peak
  { name: 'W7', value: 60 },
  { name: 'W8', value: 45 },
];

const distributionData = [
  { name: 'Staff', value: 45, color: designTokens.colors.primary, icon: <TeamOutlined /> },
  { name: 'Equipment', value: 30, color: designTokens.colors.tertiary, icon: <ToolOutlined /> },
  { name: 'Vehicles', value: 15, color: designTokens.colors.secondaryContainer, icon: <CarOutlined /> },
  { name: 'Venues', value: 10, color: designTokens.colors.emeraldGreen, icon: <BankOutlined /> },
];

const upcomingShifts = [
  { id: '1', date: 'Oct 12', month: 'OCT', project: 'Global Summit 2025', team: 'AV Setup Crew', count: 12 },
  { id: '2', date: 'Oct 15', month: 'OCT', project: 'Sofia Wedding', team: 'Catering Staff', count: 24 },
  { id: '3', date: 'Oct 18', month: 'OCT', project: 'Global Summit 2025', team: 'Security Team', count: 8 },
];

const ResourceDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader 
        title="Resource Management" 
        subtitle="Track staff, equipment, and venue utilization across all events."
        action={
          <Space size={16}>
            <Button size="large">Directory</Button>
            <Button size="large" type="primary" className="btn-primary-gradient">Allocate Resource</Button>
          </Space>
        }
      />

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <StatCard icon={<TeamOutlined />} label="Total Resources" value="458" variant="primary" />
        </Col>
        <Col span={6}>
          <StatCard icon={<SettingOutlined />} label="Active Allocations" value="184" trend={{ value: '+12', direction: 'up' }} variant="tertiary" />
        </Col>
        <Col span={6}>
          <StatCard 
            icon={<WarningOutlined />} 
            label="Resource Conflicts" 
            value="3" 
            badge="Needs Action" 
            badgeColor={designTokens.colors.error}
            variant="error" 
          />
        </Col>
        <Col span={6}>
          <StatCard 
            icon={<ClockCircleOutlined />} 
            label="Utilization Rate" 
            value="76%" 
            trend={{ value: '+5.2%', direction: 'up' }} 
            variant="success" 
          />
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col span={16}>
          <Card className="card-level1" title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Title level={5} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont }}>Utilization Trends</Title>
                <Text style={{ color: designTokens.colors.onSurfaceVariant, fontSize: 14 }}>Last 8 weeks capacity vs allocation</Text>
              </div>
              <Select defaultValue="all" style={{ width: 140 }}>
                <Select.Option value="all">All Resources</Select.Option>
                <Select.Option value="staff">Staff Only</Select.Option>
                <Select.Option value="equipment">Equipment</Select.Option>
              </Select>
            </div>
          }>
            <div style={{ height: 300, width: '100%', marginTop: 24 }}>
              <ResponsiveContainer>
                <AreaChart data={utilizationData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUtilization" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={designTokens.colors.tertiary} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={designTokens.colors.tertiary} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={designTokens.colors.borderGray} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: designTokens.colors.onSurfaceVariant, fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: designTokens.colors.onSurfaceVariant, fontSize: 12 }} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: designTokens.shadows.level1 }}
                    itemStyle={{ color: designTokens.colors.tertiary, fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="value" stroke={designTokens.colors.tertiary} strokeWidth={3} fillOpacity={1} fill="url(#colorUtilization)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col span={8}>
          <Card className="card-level1" title={
            <Title level={5} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont }}>Resource Distribution</Title>
          } style={{ height: '100%' }}>
             <Space direction="vertical" size={24} style={{ width: '100%', marginTop: 8 }}>
               {distributionData.map(item => (
                 <div key={item.name}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                     <Space>
                       <span style={{ color: item.color }}>{item.icon}</span>
                       <Text strong>{item.name}</Text>
                     </Space>
                     <Text strong>{item.value}%</Text>
                   </div>
                   <Progress percent={item.value} strokeColor={item.color} showInfo={false} />
                 </div>
               ))}
             </Space>
             
             <div style={{ marginTop: 40, padding: 20, background: designTokens.colors.backgroundAlt, borderRadius: designTokens.borderRadius.lg, textAlign: 'center' }}>
               <Title level={3} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont, color: designTokens.colors.primary }}>458</Title>
               <Text style={{ fontSize: 13, color: designTokens.colors.onSurfaceVariant }}>Total Tracked Assets</Text>
             </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Card className="card-level1" title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={5} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont, color: designTokens.colors.error }}>Critical Conflicts</Title>
              <Tag color="error" style={{ borderRadius: designTokens.borderRadius.full }}>3 Active</Tag>
            </div>
          }>
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <div style={{ padding: 16, border: `1px solid ${designTokens.colors.borderGray}`, borderRadius: designTokens.borderRadius.md, borderLeft: `4px solid ${designTokens.colors.error}` }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                   <Text strong style={{ fontSize: 15 }}>Sarah Jenkins (Lead Planner)</Text>
                   <Tag color="error" style={{ margin: 0, border: 'none' }}>Double Booked</Tag>
                 </div>
                 <Text style={{ color: designTokens.colors.onSurfaceVariant, fontSize: 13, display: 'block', marginBottom: 12 }}>
                   Scheduled for Global Summit 2025 and TechExpo Prep simultaneously on Oct 15th.
                 </Text>
                 <Space>
                   <Button size="small">Reassign Summit</Button>
                   <Button size="small">Reassign Expo</Button>
                 </Space>
              </div>

              <div style={{ padding: 16, border: `1px solid ${designTokens.colors.borderGray}`, borderRadius: designTokens.borderRadius.md, borderLeft: `4px solid ${designTokens.colors.sunsetOrange}` }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                   <Text strong style={{ fontSize: 15 }}>Main Stage LED Wall (15x5m)</Text>
                   <Tag color="warning" style={{ margin: 0, border: 'none' }}>Maintenance Overlap</Tag>
                 </div>
                 <Text style={{ color: designTokens.colors.onSurfaceVariant, fontSize: 13, display: 'block', marginBottom: 12 }}>
                   Scheduled for routine maintenance during setup period of Gala Dinner.
                 </Text>
                 <Button size="small">Reschedule Maintenance</Button>
              </div>
            </Space>
          </Card>
        </Col>

        <Col span={12}>
           <Card className="card-level1" title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={5} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont }}>Upcoming Shifts</Title>
              <Button type="link" style={{ padding: 0 }}>View Calendar</Button>
            </div>
          }>
             <Space direction="vertical" size={16} style={{ width: '100%' }}>
              {upcomingShifts.map(shift => (
                <div key={shift.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0', borderBottom: `1px solid ${designTokens.colors.borderGray}` }}>
                  <div style={{ 
                    minWidth: 56, height: 56, borderRadius: designTokens.borderRadius.md, 
                    background: 'rgba(105, 81, 155, 0.1)', color: designTokens.colors.tertiary,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' 
                  }}>
                    <Text style={{ fontSize: 11, fontWeight: 600, color: 'inherit', textTransform: 'uppercase' }}>{shift.month}</Text>
                    <Text strong style={{ fontSize: 16, color: 'inherit' }}>{shift.date.split(' ')[1]}</Text>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text strong style={{ display: 'block', fontSize: 15 }}>{shift.team}</Text>
                    <Text style={{ color: designTokens.colors.onSurfaceVariant, fontSize: 13 }}>{shift.project}</Text>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Text strong style={{ fontSize: 16, display: 'block' }}>{shift.count}</Text>
                    <Text style={{ color: designTokens.colors.onSurfaceVariant, fontSize: 12 }}>Assets</Text>
                  </div>
                </div>
              ))}
            </Space>
           </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ResourceDashboardPage;

import React from 'react';
import { Card, Row, Col, Typography, Button, Space, Table, Avatar, Progress } from 'antd';
import { 
  DollarOutlined, 
  CalendarOutlined, 
  HeartOutlined, 
  BankOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import StatusTag from '../components/common/StatusTag';
import { designTokens } from '../styles/theme';

const { Title, Text } = Typography;

// Mock Data
const revenueData = [
  { name: 'Jan', value: 2000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2800 },
  { name: 'Apr', value: 1500 },
  { name: 'May', value: 1200 },
  { name: 'Jun', value: 1800 },
  { name: 'Jul', value: 3500 },
  { name: 'Aug', value: 5000 },
  { name: 'Sep', value: 6500 },
  { name: 'Oct', value: 7200 },
  { name: 'Nov', value: 6800 },
  { name: 'Dec', value: 6500 },
];

const mixData = [
  { name: 'Weddings', value: 45, color: designTokens.colors.secondaryContainer },
  { name: 'Corporate', value: 35, color: designTokens.colors.tertiaryContainer },
  { name: 'Hotels', value: 20, color: designTokens.colors.emeraldGreen },
];

const recentBookings = [
  { key: '1', client: 'TechCorp Global', event: 'Summit 2025', value: '$85,000', status: 'Confirmed' },
  { key: '2', client: 'Sofia Ricci', event: 'Milestone 40th', value: '$12,400', status: 'Pending' },
];

const upcomingPremium = [
  { 
    id: '1', 
    date: 'Nov 12, 2024', 
    title: 'The Diamond Gala', 
    venue: 'Ritz-Carlton',
    room: 'Ballroom',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=200&h=200' 
  },
  { 
    id: '2', 
    date: 'Dec 05, 2024', 
    title: 'Aria & Julian Wedding', 
    venue: 'Fairmont Estates',
    room: '',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=200&h=200' 
  },
];

const DashboardPage: React.FC = () => {
  return (
    <div>
      <PageHeader 
        title="Executive Overview" 
        subtitle="Welcome back, Alexander. Here's what's happening today."
        action={
          <Space size={16}>
            <Button size="large" style={{ fontWeight: 600 }}>Generate Report</Button>
            <Button size="large" type="primary" className="btn-primary-gradient">New Booking</Button>
          </Space>
        }
      />

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <StatCard
            icon={<DollarOutlined />}
            label="Total Revenue"
            value="$12.4M"
            trend={{ value: '+12.5%', direction: 'up' }}
            variant="primary"
          />
        </Col>
        <Col span={6}>
          <StatCard
            icon={<CalendarOutlined />}
            label="Active Events"
            value="48"
            trend={{ value: '+4', direction: 'up' }}
            variant="secondary"
          />
        </Col>
        <Col span={6}>
          <StatCard
            icon={<HeartOutlined />}
            label="Upcoming Weddings"
            value="12"
            badge="High Priority"
            variant="tertiary"
          />
        </Col>
        <Col span={6}>
          <StatCard
            icon={<BankOutlined />}
            label="Hotel Occupancy"
            value="92%"
            badge="Peak Season"
            badgeColor={designTokens.colors.emeraldGreen}
            variant="success"
          />
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card className="card-level1" bodyStyle={{ padding: '20px 24px' }}>
            <Text style={{ fontSize: 11, fontWeight: 600, color: designTokens.colors.onSurfaceVariant, textTransform: 'uppercase' }}>Leads Pipeline</Text>
            <Title level={2} style={{ margin: '4px 0 16px', fontFamily: designTokens.typography.headlineFont }}>156</Title>
            <Progress percent={45} showInfo={false} className="progress-primary" />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="card-level1" bodyStyle={{ padding: '20px 24px' }}>
            <Text style={{ fontSize: 11, fontWeight: 600, color: designTokens.colors.onSurfaceVariant, textTransform: 'uppercase' }}>Vendor Utilization</Text>
            <Title level={2} style={{ margin: '4px 0 16px', fontFamily: designTokens.typography.headlineFont }}>78%</Title>
            <Progress percent={78} showInfo={false} className="progress-secondary" />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="card-level1" bodyStyle={{ padding: '20px 24px' }}>
            <Text style={{ fontSize: 11, fontWeight: 600, color: designTokens.colors.onSurfaceVariant, textTransform: 'uppercase' }}>Outstanding Payments</Text>
            <Title level={2} style={{ margin: '4px 0 4px', fontFamily: designTokens.typography.headlineFont }}>$45k</Title>
            <Text style={{ fontSize: 12, fontWeight: 600, color: designTokens.colors.error }}>12 Overdue</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="card-level1" bodyStyle={{ padding: '20px 24px' }}>
            <Text style={{ fontSize: 11, fontWeight: 600, color: designTokens.colors.onSurfaceVariant, textTransform: 'uppercase' }}>Profit Margin</Text>
            <Title level={2} style={{ margin: '4px 0 4px', fontFamily: designTokens.typography.headlineFont }}>24%</Title>
            <Text style={{ fontSize: 12, fontWeight: 600, color: designTokens.colors.emeraldGreen }}>+2.4% vs LY</Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col span={16}>
          <Card className="card-level1" title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Title level={5} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont }}>Revenue Growth</Title>
                <Text style={{ color: designTokens.colors.onSurfaceVariant, fontSize: 14 }}>Annualized projected revenue trend</Text>
              </div>
              <Space>
                <Button size="small" type="primary" ghost style={{ borderRadius: 16 }}>Yearly</Button>
                <Button size="small" type="text" style={{ borderRadius: 16 }}>Monthly</Button>
              </Space>
            </div>
          }>
            <div style={{ height: 300, width: '100%', marginTop: 24 }}>
              <ResponsiveContainer>
                <AreaChart data={revenueData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={designTokens.colors.primary} stopOpacity={0.1}/>
                      <stop offset="95%" stopColor={designTokens.colors.primary} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: designTokens.colors.onSurfaceVariant, fontSize: 12 }} dy={10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: designTokens.shadows.level1 }}
                    itemStyle={{ color: designTokens.colors.primary, fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="value" stroke={designTokens.colors.primary} strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card className="card-level1" title={
            <div>
              <Title level={5} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont }}>Booking Mix</Title>
              <Text style={{ color: designTokens.colors.onSurfaceVariant, fontSize: 14 }}>Revenue share by event category</Text>
            </div>
          } style={{ height: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <div style={{ height: 200, width: '100%', position: 'relative' }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={mixData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {mixData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: designTokens.shadows.level1 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <Title level={3} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont }}>100%</Title>
                  <Text style={{ fontSize: 12, color: designTokens.colors.onSurfaceVariant }}>Capacity</Text>
                </div>
              </div>
              
              <div style={{ width: '100%', padding: '0 24px', marginTop: 16 }}>
                {mixData.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <Space>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: item.color }} />
                      <Text strong>{item.name}</Text>
                    </Space>
                    <Text strong>{item.value}%</Text>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col span={8}>
          <Card className="card-level1" title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={5} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont }}>Upcoming Premium</Title>
              <Button type="link" style={{ color: designTokens.colors.primary, padding: 0 }}>View All</Button>
            </div>
          }>
            <Space direction="vertical" size={24} style={{ width: '100%', marginTop: 8 }}>
              {upcomingPremium.map(event => (
                <div key={event.id} style={{ display: 'flex', gap: 16 }}>
                  <Avatar shape="square" size={64} src={event.image} style={{ borderRadius: designTokens.borderRadius.md }} />
                  <div>
                    <Text style={{ color: designTokens.colors.primary, fontSize: 12, fontWeight: 600 }}>{event.date}</Text>
                    <Title level={5} style={{ margin: '2px 0', fontSize: 16, fontFamily: designTokens.typography.headlineFont }}>{event.title}</Title>
                    <Text style={{ color: designTokens.colors.onSurfaceVariant, fontSize: 13, display: 'block' }}>{event.venue}</Text>
                    {event.room && <Text style={{ color: designTokens.colors.onSurfaceVariant, fontSize: 13 }}>{event.room}</Text>}
                  </div>
                </div>
              ))}
            </Space>
          </Card>
        </Col>
        
        <Col span={8}>
          <Card className="card-level1" title={
            <Title level={5} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont }}>Recent Bookings</Title>
          }>
            <Table 
              dataSource={recentBookings} 
              pagination={false}
              showHeader={true}
              size="small"
              columns={[
                { title: 'Client', dataIndex: 'client', key: 'client', render: (text, record) => (
                  <div>
                    <Text strong style={{ display: 'block' }}>{text}</Text>
                    <Text style={{ fontSize: 12, color: designTokens.colors.onSurfaceVariant }}>{record.event}</Text>
                  </div>
                )},
                { title: 'Value', dataIndex: 'value', key: 'value', align: 'right', render: text => <Text strong>{text}</Text> },
                { title: 'Status', dataIndex: 'status', key: 'status', align: 'right', render: status => <StatusTag status={status} /> }
              ]}
            />
          </Card>
        </Col>

        <Col span={8}>
          <div className="ai-insight-card" style={{ marginBottom: 24 }}>
            <Space align="center" style={{ marginBottom: 16 }}>
              <ThunderboltOutlined style={{ fontSize: 24 }} />
              <Title level={5} style={{ margin: 0, color: 'white', fontFamily: designTokens.typography.headlineFont }}>AI Insights</Title>
            </Space>
            <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 24, color: 'rgba(255,255,255,0.9)' }}>
              Based on current hotel occupancy (92%), you could increase profit margin by 3.2% by bundle-pricing the upcoming Corporate Summit with hotel suites.
            </p>
            <Button block size="large" style={{ color: designTokens.colors.primary, fontWeight: 600 }}>Apply Strategy</Button>
          </div>

          <Card className="card-level1" title={
            <Title level={5} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont }}>Today's Priorities</Title>
          }>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text strong style={{ fontSize: 13 }}>Vendor Contract Review</Text>
                <Text strong style={{ fontSize: 13 }}>85%</Text>
              </div>
              <Progress percent={85} showInfo={false} strokeColor={designTokens.colors.secondaryContainer} />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text strong style={{ fontSize: 13 }}>Venue Walkthrough (Aria)</Text>
                <Text strong style={{ fontSize: 13 }}>20%</Text>
              </div>
              <Progress percent={20} showInfo={false} strokeColor={designTokens.colors.primaryContainer} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;

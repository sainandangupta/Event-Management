import React from 'react';
import { Card, Row, Col, Typography, Space, Button, Tabs, Progress } from 'antd';
import { 
  DollarOutlined, PercentageOutlined, CheckCircleOutlined,
  ArrowRightOutlined, InfoCircleOutlined, LayoutOutlined
} from '@ant-design/icons';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import { designTokens } from '../../styles/theme';

const { Title, Text } = Typography;

const performanceData = [
  { name: 'JAN', revenue: 450, costs: 280 },
  { name: 'FEB', revenue: 520, costs: 310 },
  { name: 'MAR', revenue: 680, costs: 390 },
  { name: 'APR', revenue: 610, costs: 350 },
  { name: 'MAY', revenue: 850, costs: 420 },
  { name: 'JUN', revenue: 980, costs: 480 },
];

const ReportingDashboardPage: React.FC = () => {
  return (
    <div>
      <PageHeader 
        title={
          <Space size={24} align="baseline">
            <Title level={2} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont }}>Reporting & Analytics</Title>
            <Tabs defaultActiveKey="profitability" items={[
              { key: 'profitability', label: 'Profitability' },
              { key: 'resource', label: 'Resource Analytics' },
              { key: 'reports', label: 'Event Reports' },
            ]} style={{ marginBottom: -16 }} />
          </Space>
        }
        action={
          <Space size={16}>
            <Button size="large">Generate Custom Report</Button>
          </Space>
        }
      />

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <StatCard icon={<DollarOutlined />} label="Total Revenue" value="$2.48M" trend={{ value: '+12.5%', direction: 'up' }} variant="primary" />
        </Col>
        <Col span={6}>
          <StatCard icon={<PercentageOutlined />} label="Profit Margin" value="24%" subtitle="vs Last Q: +2.1%" variant="secondary" />
        </Col>
        <Col span={6}>
          <StatCard icon={<LayoutOutlined />} label="Resource Efficiency" value="88%" badge="Top 10%" badgeColor={designTokens.colors.tertiary} variant="tertiary" />
        </Col>
        <Col span={6}>
          <StatCard icon={<CheckCircleOutlined />} label="Success Rate" value="96%" badge="Client Satisfaction" badgeColor={designTokens.colors.emeraldGreen} variant="success" />
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col span={24}>
           <Card className="card-level1" title={
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div>
                 <Title level={5} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont }}>Enterprise Performance Trends</Title>
                 <Text style={{ color: designTokens.colors.onSurfaceVariant, fontSize: 14 }}>Quarterly comparison of gross revenue versus operational costs.</Text>
               </div>
               <Space>
                 <Button style={{ borderRadius: 16 }}>Revenue</Button>
                 <Button style={{ borderRadius: 16, border: 'none', background: designTokens.colors.borderGray }}>Operating Costs</Button>
               </Space>
             </div>
           }>
             <div style={{ height: 400, width: '100%', marginTop: 24 }}>
               <ResponsiveContainer>
                 <BarChart data={performanceData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={designTokens.colors.borderGray} />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: designTokens.colors.onSurfaceVariant, fontSize: 12, fontWeight: 500 }} dy={10} />
                   <YAxis axisLine={false} tickLine={false} tick={{ fill: designTokens.colors.onSurfaceVariant, fontSize: 12 }} tickFormatter={(val) => `$${val}k`} />
                   <Tooltip 
                     formatter={(value: any) => [`$${value}k`, '']}
                     contentStyle={{ borderRadius: 8, border: 'none', boxShadow: designTokens.shadows.level1 }}
                     cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                   />
                   <Bar dataKey="costs" name="Operating Costs" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={40} />
                   <Bar dataKey="revenue" name="Revenue" fill={designTokens.colors.primary} radius={[4, 4, 0, 0]} barSize={40} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
           </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col span={8}>
          <Card className="card-level1" title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={5} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont }}>Top Categories</Title>
              <Button type="link" style={{ padding: 0, color: designTokens.colors.primary }}>View All</Button>
            </div>
          }>
            <Space direction="vertical" size={24} style={{ width: '100%' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text strong>Luxury Weddings</Text>
                  <Text strong style={{ color: designTokens.colors.primary }}>42%</Text>
                </div>
                <Progress percent={42} showInfo={false} strokeColor={designTokens.colors.primary} />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text strong>Corporate Summits</Text>
                  <Text strong style={{ color: designTokens.colors.sunsetOrange }}>28%</Text>
                </div>
                <Progress percent={28} showInfo={false} strokeColor={designTokens.colors.sunsetOrange} />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text strong>Tech Expos</Text>
                  <Text strong style={{ color: designTokens.colors.tertiary }}>15%</Text>
                </div>
                <Progress percent={15} showInfo={false} strokeColor={designTokens.colors.tertiary} />
              </div>
            </Space>
          </Card>
        </Col>
        
        <Col span={8}>
          <Card className="card-level1" title={<Title level={5} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont }}>Resource Heatmap</Title>}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
              {Array.from({ length: 20 }).map((_, i) => {
                // Generate random opacity for heatmap effect
                const opacity = Math.max(0.1, Math.random());
                return (
                  <div key={i} style={{ 
                    aspectRatio: '1/1', 
                    backgroundColor: designTokens.colors.primary, 
                    opacity,
                    borderRadius: designTokens.borderRadius.sm
                  }} />
                );
              })}
            </div>
          </Card>
        </Col>

        <Col span={8}>
          <Card className="card-level1" title={<Title level={5} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont }}>Pending Reports</Title>}>
             <Space direction="vertical" size={16} style={{ width: '100%' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <Space>
                   <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: designTokens.colors.primary }} />
                   <Text strong>Q3 Revenue Forecast</Text>
                 </Space>
                 <ArrowRightOutlined style={{ color: designTokens.colors.onSurfaceVariant }} />
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <Space>
                   <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: designTokens.colors.secondary }} />
                   <Text strong>Logistics Efficiency Hub</Text>
                 </Space>
                 <ArrowRightOutlined style={{ color: designTokens.colors.onSurfaceVariant }} />
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <Space>
                   <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: designTokens.colors.emeraldGreen }} />
                   <Text strong>Vendor Payout Reconciliation</Text>
                 </Space>
                 <ArrowRightOutlined style={{ color: designTokens.colors.onSurfaceVariant }} />
               </div>
             </Space>
             <Button block style={{ marginTop: 24 }}>Process All Tasks</Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ReportingDashboardPage;

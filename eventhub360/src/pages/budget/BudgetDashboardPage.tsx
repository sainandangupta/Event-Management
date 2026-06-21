import React from 'react';
import { Card, Row, Col, Typography, Space, Button, Table, Avatar, Progress, Select } from 'antd';
import { 
  DollarOutlined, StockOutlined, WalletOutlined, PercentageOutlined,
  CheckOutlined, CloseOutlined, EllipsisOutlined
} from '@ant-design/icons';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import StatusTag from '../../components/common/StatusTag';
import { designTokens } from '../../styles/theme';

const { Title, Text } = Typography;

const budgetData = [
  { name: 'Venue', actual: 45000, planned: 50000 },
  { name: 'Catering', actual: 32000, planned: 30000 }, // Over
  { name: 'AV & Tech', actual: 28000, planned: 35000 },
  { name: 'Marketing', actual: 12000, planned: 15000 },
  { name: 'Staffing', actual: 18000, planned: 18000 },
];

const statusData = [
  { name: 'Spent', value: 69, color: designTokens.colors.primary },
  { name: 'Remaining', value: 31, color: designTokens.colors.borderGray },
];

const recentExpenses = [
  { key: '1', desc: 'Deposit: Moscone Center', vendor: 'Moscone Venues', category: 'Venue', amount: '$25,000', date: 'Oct 02, 2024' },
  { key: '2', desc: 'Catering 50% Upfront', vendor: 'Elite Catering Co', category: 'Catering', amount: '$16,000', date: 'Oct 05, 2024' },
  { key: '3', desc: 'LED Wall Rental', vendor: 'VisualTech', category: 'AV & Tech', amount: '$8,500', date: 'Oct 08, 2024' },
  { key: '4', desc: 'Facebook Ads (Q3)', vendor: 'Meta Platforms', category: 'Marketing', amount: '$4,200', date: 'Oct 10, 2024' },
];

const pendingApprovals = [
  { id: '1', title: 'Additional Floral Arrangements', amount: '$3,500', event: 'Sofia Wedding', requestor: 'Elena R.' },
  { id: '2', title: 'Last-minute Security Detail', amount: '$1,800', event: 'Global Summit 2025', requestor: 'Marcus W.' },
];

const BudgetDashboardPage: React.FC = () => {
  return (
    <div>
      <PageHeader 
        title="Financial & Budget Center" 
        subtitle="Monitor event budgets, process approvals, and track expenditures."
        action={
          <Space size={16}>
            <Button size="large">Export CSV</Button>
            <Button size="large" type="primary" className="btn-primary-gradient">Record Expense</Button>
          </Space>
        }
      />

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <StatCard icon={<WalletOutlined />} label="Planned (YTD)" value="$2.4M" variant="primary" />
        </Col>
        <Col span={6}>
          <StatCard icon={<DollarOutlined />} label="Actual Spend" value="$1.65M" variant="secondary" />
        </Col>
        <Col span={6}>
          <StatCard icon={<StockOutlined />} label="Total Variance" value="+$85k" badge="Under Budget" badgeColor={designTokens.colors.emeraldGreen} variant="success" />
        </Col>
        <Col span={6}>
          <StatCard icon={<PercentageOutlined />} label="Avg. Margin" value="24.5%" trend={{ value: '+1.2%', direction: 'up' }} variant="tertiary" />
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col span={8}>
           <Card className="card-level1" title={<Title level={5} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont }}>Budget Status</Title>} style={{ height: '100%' }}>
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', paddingBottom: 24 }}>
                <div style={{ height: 220, width: '100%', position: 'relative' }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%" cy="50%"
                        innerRadius={70} outerRadius={90}
                        startAngle={90} endAngle={-270}
                        dataKey="value" stroke="none"
                      >
                        {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                    <Title level={2} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont, color: designTokens.colors.primary }}>69%</Title>
                    <Text style={{ fontSize: 13, color: designTokens.colors.onSurfaceVariant }}>Spent</Text>
                  </div>
                </div>
                
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around', marginTop: 16 }}>
                   <div style={{ textAlign: 'center' }}>
                     <Text style={{ fontSize: 12, color: designTokens.colors.onSurfaceVariant, display: 'block' }}>Spent</Text>
                     <Text strong style={{ fontSize: 16 }}>$1.65M</Text>
                   </div>
                   <div style={{ width: 1, backgroundColor: designTokens.colors.borderGray }} />
                   <div style={{ textAlign: 'center' }}>
                     <Text style={{ fontSize: 12, color: designTokens.colors.onSurfaceVariant, display: 'block' }}>Remaining</Text>
                     <Text strong style={{ fontSize: 16 }}>$750k</Text>
                   </div>
                </div>
             </div>
           </Card>
        </Col>

        <Col span={16}>
          <Card className="card-level1" title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={5} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont }}>Budget vs. Actual by Category</Title>
              <Select defaultValue="all" style={{ width: 140 }}>
                <Select.Option value="all">All Events</Select.Option>
                <Select.Option value="summit">Global Summit</Select.Option>
              </Select>
            </div>
          } style={{ height: '100%' }}>
            <div style={{ height: 300, width: '100%', marginTop: 16 }}>
              <ResponsiveContainer>
                <BarChart data={budgetData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }} barGap={0}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={designTokens.colors.borderGray} />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: designTokens.colors.onSurfaceVariant, fontSize: 12 }} tickFormatter={(val) => `$${val/1000}k`} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: designTokens.colors.onSurface, fontSize: 13, fontWeight: 500 }} width={80} />
                  <Tooltip 
                    formatter={(value: any) => [`$${value.toLocaleString()}`, '']}
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: designTokens.shadows.level1 }}
                    cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  />
                  <Bar dataKey="planned" name="Planned" fill={designTokens.colors.borderGray} radius={[0, 4, 4, 0]} barSize={12} />
                  <Bar dataKey="actual" name="Actual Spend" radius={[0, 4, 4, 0]} barSize={12}>
                    {budgetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.actual > entry.planned ? designTokens.colors.sunsetOrange : designTokens.colors.primary} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col span={16}>
           <Card className="card-level1" title={<Title level={5} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont }}>Recent Expenses</Title>} bodyStyle={{ padding: 0 }}>
             <Table 
              dataSource={recentExpenses} 
              pagination={false}
              columns={[
                { title: 'Description', dataIndex: 'desc', key: 'desc', render: text => <Text strong>{text}</Text> },
                { title: 'Vendor', dataIndex: 'vendor', key: 'vendor' },
                { title: 'Category', dataIndex: 'category', key: 'category' },
                { title: 'Date', dataIndex: 'date', key: 'date', render: text => <Text style={{ color: designTokens.colors.onSurfaceVariant }}>{text}</Text> },
                { title: 'Amount', dataIndex: 'amount', key: 'amount', align: 'right', render: text => <Text strong>{text}</Text> },
                { title: '', key: 'action', width: 50, render: () => <Button type="text" icon={<EllipsisOutlined />} /> }
              ]}
            />
           </Card>
        </Col>

        <Col span={8}>
          <Card className="card-level1" title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={5} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont }}>Pending Approvals</Title>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: designTokens.colors.error, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>2</div>
            </div>
          }>
             <Space direction="vertical" size={16} style={{ width: '100%' }}>
               {pendingApprovals.map(approval => (
                 <div key={approval.id} style={{ padding: 16, border: `1px solid ${designTokens.colors.borderGray}`, borderRadius: designTokens.borderRadius.md, background: designTokens.colors.offWhite }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                     <Text strong style={{ fontSize: 15 }}>{approval.amount}</Text>
                     <Text style={{ fontSize: 12, color: designTokens.colors.onSurfaceVariant }}>{approval.requestor}</Text>
                   </div>
                   <Text style={{ display: 'block', marginBottom: 4 }}>{approval.title}</Text>
                   <Text style={{ fontSize: 12, color: designTokens.colors.onSurfaceVariant, display: 'block', marginBottom: 16 }}>{approval.event}</Text>
                   
                   <div style={{ display: 'flex', gap: 8 }}>
                     <Button type="primary" className="btn-primary-gradient" style={{ flex: 1 }} size="small" icon={<CheckOutlined />}>Approve</Button>
                     <Button style={{ flex: 1 }} size="small" icon={<CloseOutlined />}>Decline</Button>
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

export default BudgetDashboardPage;

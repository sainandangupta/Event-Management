import React from 'react';
import { Card, Typography, Space, Button, Form, Input, Select, DatePicker, Row, Col, Switch, Divider, Avatar } from 'antd';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import { designTokens } from '../../styles/theme';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

const templates = [
  { id: '1', name: 'Premium Gala', desc: 'Standard phases, full AV, standard catering', color: designTokens.colors.tertiary },
  { id: '2', name: 'Executive Summit', desc: 'Breakouts, high security, premium F&B', color: designTokens.colors.primary },
];

const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Success:', values);
    navigate('/events');
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Button 
        type="text" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/events')}
        style={{ marginBottom: 16, paddingLeft: 0, color: designTokens.colors.onSurfaceVariant }}
      >
        Back to Events
      </Button>
      
      <PageHeader 
        title="Create New Event" 
        subtitle="Set up the foundational details for your new event project."
      />

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Space direction="vertical" size={24} style={{ width: '100%', marginBottom: 32 }}>
          
          {/* General Information */}
          <Card className="card-level1" title={<Title level={5} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont }}>General Information</Title>}>
            <Row gutter={24}>
              <Col span={16}>
                <Form.Item name="name" label={<Text strong>Event Name</Text>} rules={[{ required: true }]}>
                  <Input size="large" placeholder="e.g. TechCorp Annual Summit" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="category" label={<Text strong>Category</Text>} rules={[{ required: true }]}>
                  <Select size="large" placeholder="Select category">
                    <Option value="Corporate">Corporate</Option>
                    <Option value="Wedding">Wedding</Option>
                    <Option value="Gala">Gala</Option>
                    <Option value="Expo">Expo</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="description" label={<Text strong>Description (Optional)</Text>}>
              <TextArea rows={4} placeholder="Brief description of the event purpose and scope..." />
            </Form.Item>

            <Form.Item name="initialStatus" label={<Text strong>Initial Status</Text>} initialValue="Draft">
              <Select size="large" style={{ width: 200 }}>
                <Option value="Draft">Draft</Option>
                <Option value="Planned">Planned</Option>
                <Option value="In Progress">In Progress</Option>
              </Select>
            </Form.Item>
          </Card>

          {/* Logistics & Revenue */}
          <Card className="card-level1" title={<Title level={5} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont }}>Logistics & Revenue</Title>}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="dates" label={<Text strong>Event Dates</Text>} rules={[{ required: true }]}>
                  <RangePicker size="large" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="revenue" label={<Text strong>Estimated Revenue</Text>}>
                  <Input size="large" prefix="$" placeholder="0.00" type="number" />
                </Form.Item>
              </Col>
            </Row>

            <Divider style={{ margin: '12px 0 24px' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text strong style={{ display: 'block', fontSize: 16 }}>Planning Handoff</Text>
                <Text style={{ color: designTokens.colors.onSurfaceVariant }}>Automatically generate tasks and timelines from template</Text>
              </div>
              <Form.Item name="planningHandoff" valuePropName="checked" style={{ margin: 0 }}>
                <Switch defaultChecked />
              </Form.Item>
            </div>
            
            <div style={{ marginTop: 24, display: 'flex', gap: 16 }}>
              {templates.map(t => (
                <div key={t.id} style={{ 
                  flex: 1, 
                  border: `1px solid ${designTokens.colors.borderGray}`, 
                  borderRadius: designTokens.borderRadius.md,
                  padding: 16,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: t.color, marginBottom: 12 }} />
                  <Text strong style={{ display: 'block' }}>{t.name}</Text>
                  <Text style={{ fontSize: 12, color: designTokens.colors.onSurfaceVariant }}>{t.desc}</Text>
                </div>
              ))}
            </div>
          </Card>

          {/* Assign Team */}
          <Card className="card-level1" title={<Title level={5} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont }}>Assign Team</Title>}>
            <div style={{ display: 'flex', gap: 16 }}>
               <Button type="dashed" className="add-card-dashed" style={{ height: 60, display: 'flex', alignItems: 'center', gap: 8 }}>
                 <PlusOutlined /> Add Member
               </Button>
               <div style={{ display: 'flex', alignItems: 'center', gap: 12, border: `1px solid ${designTokens.colors.borderGray}`, padding: '8px 16px', borderRadius: designTokens.borderRadius.full }}>
                 <Avatar style={{ backgroundColor: designTokens.colors.primary }}>AW</Avatar>
                 <Text strong>Alexander West (Lead)</Text>
               </div>
            </div>
          </Card>

        </Space>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, padding: '24px 0 48px' }}>
          <Button size="large" onClick={() => navigate('/events')}>Cancel</Button>
          <Button size="large" type="primary" htmlType="submit" className="btn-primary-gradient">Create Event</Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateEventPage;

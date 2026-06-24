import React from 'react';
import { Card, Typography, Space, Button, Tabs, Input, Row, Col, Avatar, Tag } from 'antd';
import { 
  SearchOutlined, FilePdfOutlined, FileWordOutlined, FileExcelOutlined,
  FileImageOutlined, AppstoreOutlined, BarsOutlined, MoreOutlined,
  FolderOpenOutlined, SafetyCertificateOutlined, UploadOutlined, ClockCircleOutlined
} from '@ant-design/icons';
import PageHeader from '../../components/common/PageHeader';
import { designTokens } from '../../styles/theme';

const { Title, Text } = Typography;

const documents = [
  { id: '1', name: 'Wedding_Vendor_C...', ext: 'pdf', event: 'Gala Dinner 2024', time: '2h ago', size: '2.4 MB', icon: <FilePdfOutlined /> },
  { id: '2', name: 'Logistics_Plan_Final', ext: 'word', event: 'Tech Summit Expo', time: 'Oct 12, 2023', size: '842 KB', icon: <FileWordOutlined /> },
  { id: '3', name: 'Stage_Creative_M...', ext: 'img', event: 'Corporate Retreat', time: 'Yesterday', size: '12.5 MB', icon: <FileImageOutlined />, img: 'https://images.unsplash.com/photo-1549451371-64aa98a6f660?auto=format&fit=crop&q=80&w=300&h=150' },
  { id: '4', name: 'Catering_Budget_A...', ext: 'excel', event: 'Summer Festival', time: 'Oct 08, 2023', size: '1.1 MB', icon: <FileExcelOutlined /> },
  { id: '5', name: 'Legal_Waiver_Rele...', ext: 'pdf', event: 'Gala Dinner 2024', time: 'Oct 05', size: '1.4 MB', icon: <FilePdfOutlined /> },
  { id: '6', name: 'Keynote_Speaker_...', ext: 'word', event: 'Tech Summit Expo', time: 'Oct 01', size: '340 KB', icon: <FileWordOutlined /> },
];

const DocumentLibraryPage: React.FC = () => {
  return (
    <div>
      <PageHeader 
        title={
          <Space size={24} align="baseline">
            <Title level={2} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont }}>Documents</Title>
            <Tabs defaultActiveKey="recent" items={[
              { key: 'recent', label: 'Recent' },
              { key: 'starred', label: 'Starred' },
              { key: 'shared', label: 'Shared' },
              { key: 'archive', label: 'Archive' },
            ]} style={{ marginBottom: -16 }} />
          </Space>
        }
        action={
          <Space size={16}>
            <Input 
              prefix={<SearchOutlined style={{ color: designTokens.colors.onSurfaceVariant }} />} 
              placeholder="Search by name, category, or event..." 
              style={{ width: 320, borderRadius: designTokens.borderRadius.full }}
            />
            <Button size="large" type="primary" className="btn-primary-gradient" icon={<UploadOutlined />}>Upload</Button>
          </Space>
        }
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Space size={8}>
          <Button type="primary" style={{ borderRadius: 16, background: designTokens.colors.primary, border: 'none' }}>All</Button>
          <Button style={{ borderRadius: 16 }}>Contracts</Button>
          <Button style={{ borderRadius: 16 }}>Proposals</Button>
          <Button style={{ borderRadius: 16 }}>Logistics</Button>
          <Button style={{ borderRadius: 16 }}>Creative</Button>
          <Button style={{ borderRadius: 16 }}>Legal</Button>
        </Space>
        
        <Space>
          <Button type="text" icon={<AppstoreOutlined style={{ color: designTokens.colors.primary }} />} />
          <Button type="text" icon={<BarsOutlined />} />
        </Space>
      </div>

      <Row gutter={[24, 24]} style={{ marginBottom: 40 }}>
        {documents.map(doc => (
          <Col span={6} key={doc.id}>
            <Card className="card-level1" bodyStyle={{ padding: 0 }} hoverable>
              {doc.img ? (
                <div style={{ 
                  height: 120, width: '100%', 
                  backgroundImage: `url(${doc.img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderTopLeftRadius: designTokens.borderRadius.xl,
                  borderTopRightRadius: designTokens.borderRadius.xl,
                  position: 'relative'
                }}>
                  <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.6)', color: 'white', padding: '2px 8px', borderRadius: 4, fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FileImageOutlined /> stage_moodboard.jpg
                  </div>
                </div>
              ) : (
                <div style={{ padding: '24px 24px 0', display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ 
                    width: 40, height: 40, borderRadius: '50%', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                    background: doc.ext === 'pdf' ? 'rgba(186, 26, 26, 0.1)' : doc.ext === 'word' ? 'rgba(76, 175, 141, 0.1)' : 'rgba(105, 81, 155, 0.1)',
                    color: doc.ext === 'pdf' ? designTokens.colors.error : doc.ext === 'word' ? designTokens.colors.emeraldGreen : designTokens.colors.tertiary
                  }}>
                    {doc.icon}
                  </div>
                  <Button type="text" icon={<MoreOutlined style={{ fontSize: 20 }} />} style={{ padding: 0 }} />
                </div>
              )}
              
              <div style={{ padding: '16px 24px 24px' }}>
                 {!doc.img && (
                   <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -40, marginBottom: 16 }}>
                     <Button type="text" icon={<MoreOutlined style={{ fontSize: 20 }} />} style={{ padding: 0 }} />
                   </div>
                 )}
                 <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 4 }}>{doc.name}</Text>
                 <Text style={{ fontSize: 13, color: designTokens.colors.onSurfaceVariant, display: 'block', marginBottom: 24 }}>{doc.event}</Text>
                 
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <Text style={{ fontSize: 12, color: designTokens.colors.onSurfaceVariant }}><ClockCircleOutlined /> {doc.time}</Text>
                   <Text style={{ fontSize: 12, color: designTokens.colors.onSurfaceVariant }}>{doc.size}</Text>
                 </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0, fontFamily: designTokens.typography.headlineFont }}>Priority Assets</Title>
        <Button type="link" style={{ color: designTokens.colors.primary }}>View All Starred</Button>
      </div>

      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Card className="card-level1" bodyStyle={{ padding: 24 }} style={{ borderLeft: `4px solid ${designTokens.colors.primary}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(174, 47, 52, 0.1)', color: designTokens.colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                  <FolderOpenOutlined />
                </div>
                <div>
                  <Text strong style={{ fontSize: 16, display: 'block' }}>2024_Master_Contract_Library</Text>
                  <Text style={{ fontSize: 13, color: designTokens.colors.onSurfaceVariant }}>Internal Shared Asset • 45 Documents</Text>
                  <div style={{ marginTop: 8 }}>
                    <Avatar.Group size="small" maxCount={3}>
                      <Avatar src="https://i.pravatar.cc/150?u=1" />
                      <Avatar src="https://i.pravatar.cc/150?u=2" />
                      <Avatar style={{ backgroundColor: '#f56a00' }}>+8</Avatar>
                    </Avatar.Group>
                  </div>
                </div>
              </div>
              <Button>Open Folder</Button>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card className="card-level1" bodyStyle={{ padding: 24 }} style={{ borderLeft: `4px solid ${designTokens.colors.emeraldGreen}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(76, 175, 141, 0.1)', color: designTokens.colors.emeraldGreen, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                  <SafetyCertificateOutlined />
                </div>
                <div>
                  <Text strong style={{ fontSize: 16, display: 'block' }}>Security_Protocols_TechSummit</Text>
                  <Text style={{ fontSize: 13, color: designTokens.colors.onSurfaceVariant }}>Private Access • Updated 10m ago</Text>
                  <div style={{ marginTop: 8 }}>
                    <Tag color="success" style={{ borderRadius: designTokens.borderRadius.full, border: 'none', background: 'rgba(76, 175, 141, 0.1)', color: designTokens.colors.emeraldGreen }}>Confidential</Tag>
                  </div>
                </div>
              </div>
              <Button>Request Edit</Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DocumentLibraryPage;

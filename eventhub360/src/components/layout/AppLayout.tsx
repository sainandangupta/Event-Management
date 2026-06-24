import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import TopHeader from '../common/TopHeader';

const { Content } = Layout;

interface AppLayoutProps {
  tabs?: { key: string; label: string; path: string }[];
  activeTab?: string;
  searchPlaceholder?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ tabs, activeTab, searchPlaceholder }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout style={{ marginLeft: 210 }}>
        <TopHeader tabs={tabs} activeTab={activeTab} searchPlaceholder={searchPlaceholder} />
        <Content className="page-content" style={{ padding: '32px 32px 64px' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;

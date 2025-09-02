import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import AdminPanel from './components/AdminPanel';
import MediaPlayer from './components/MediaPlayer';
import { Button, Layout, Menu, Typography } from 'antd';
import { Header } from 'antd/es/layout/layout';

const { Title } = Typography;

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('admin');

  const renderContent = () => {
    switch (currentView) {
      case 'admin':
        return <AdminPanel />;
      case 'player':
        return <MediaPlayer />;
      default:
        return null;
    }
  };

  return (
    <AuthProvider>
      <Layout className="min-h-screen">
        <Header className="flex items-center justify-between bg-white px-8 shadow-sm">
          <div className="flex items-center">
            <Title level={2} className="m-0">App de Mídia</Title>
          </div>
          <Menu
            mode="horizontal"
            selectedKeys={[currentView]}
            onClick={(e) => setCurrentView(e.key as 'admin' | 'player')}
            className="flex-grow justify-center"
          >
            <Menu.Item key="admin">Painel de Administrador</Menu.Item>
            <Menu.Item key="player">Media Player</Menu.Item>
          </Menu>
          <div className="w-24"></div> {/* Placeholder para manter o layout */}
        </Header>
        {renderContent()}
      </Layout>
    </AuthProvider>
  );
};

export default App;

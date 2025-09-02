import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Input, Modal, message, Layout, Menu, Typography, Card, Space, Select, Popconfirm } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import axios from 'axios';
import { useAuth } from './Context/AuthContext'

const { Title, Text } = Typography;
const { Option } = Select;

const API_BASE_URL = "http://localhost:5000/api";

const LoginPage: React.FC = () => {
  const { setToken } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, values);
      const { token } = response.data;
      localStorage.setItem('jwtToken', token);
      setToken(token);
      message.success('Login bem-sucedido!');
    } catch (error) {
      message.error('Falha no login. Verifique suas credenciais.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md p-6 shadow-lg rounded-lg">
        <Title level={2} className="text-center">Painel de Administração</Title>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="Nome de usuário"
            name="username"
            rules={[{ required: true, message: 'Por favor, insira o nome de usuário!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Senha"
            name="password"
            rules={[{ required: true, message: 'Por favor, insira a senha!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} className="w-full">
              Entrar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  );
};

interface Media {
  id: number;
  name: string;
  description: string;
  url: string;
  type: string;
}

const MediaManager: React.FC = () => {
  const { token } = useAuth();
  const [medias, setMedias] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMedia, setEditingMedia] = useState<Media | null>(null);
  const [form] = Form.useForm();

  const fetchMedias = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Media[]>(`${API_BASE_URL}/media`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMedias(response.data);
    } catch (error) {
      message.error('Falha ao carregar mídias.');
      console.error('Fetch medias error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedias();
  }, [token]);

  const handleCreate = () => {
    setEditingMedia(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Media) => {
    setEditingMedia(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/media/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Mídia excluída com sucesso.');
      fetchMedias();
    } catch (error) {
      message.error('Falha ao excluir mídia.');
      console.error('Delete media error:', error);
    }
  };

  const handleSave = async (values: Media) => {
    try {
      if (editingMedia) {
        await axios.put(`${API_BASE_URL}/media/${editingMedia.id}`, values, {
          headers: { Authorization: `Bearer ${token}` }
        });
        message.success('Mídia atualizada com sucesso.');
      } else {
        await axios.post(`${API_BASE_URL}/media`, values, {
          headers: { Authorization: `Bearer ${token}` }
        });
        message.success('Mídia criada com sucesso.');
      }
      setIsModalVisible(false);
      fetchMedias();
    } catch (error) {
      message.error('Falha ao salvar mídia.');
      console.error('Save media error:', error);
    }
  };

  const columns = [
    { title: 'Nome', dataIndex: 'name', key: 'name' },
    { title: 'URL', dataIndex: 'url', key: 'url' },
    { title: 'Tipo', dataIndex: 'type', key: 'type' },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: Media) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(record)}>Editar</Button>
          <Popconfirm
            title="Tem certeza que deseja excluir esta mídia?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button danger>Excluir</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>Gerenciar Mídias</Title>
        <Button type="primary" onClick={handleCreate}>
          Adicionar Mídia
        </Button>
      </div>
      <Table dataSource={medias} columns={columns} loading={loading} rowKey="id" />
      <Modal
        title={editingMedia ? 'Editar Mídia' : 'Criar Mídia'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="name" label="Nome" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Descrição">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="url" label="URL" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Tipo" rules={[{ required: true }]}>
            <Select>
              <Option value="image">Imagem</Option>
              <Option value="video">Vídeo</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

interface Playlist {
  id: number;
  name: string;
  mediaIds: number[];
}

const PlaylistManager: React.FC = () => {
  const { token } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [medias, setMedias] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMediaModalVisible, setIsMediaModalVisible] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [mediaModalForm] = Form.useForm();

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Playlist[]>(`${API_BASE_URL}/playlists`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlaylists(response.data);
    } catch (error) {
      message.error('Falha ao carregar playlists.');
      console.error('Fetch playlists error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMedias = async () => {
    try {
      const response = await axios.get<Media[]>(`${API_BASE_URL}/media`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMedias(response.data);
    } catch (error) {
      message.error('Falha ao carregar mídias.');
      console.error('Fetch medias error:', error);
    }
  };

  useEffect(() => {
    fetchPlaylists();
    fetchMedias();
  }, [token]);

  const handleCreatePlaylist = () => {
    setEditingPlaylist(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleSavePlaylist = async (values: Playlist) => {
    try {
      if (editingPlaylist) {
        await axios.put(`${API_BASE_URL}/playlists/${editingPlaylist.id}`, values, {
          headers: { Authorization: `Bearer ${token}` }
        });
        message.success('Playlist atualizada com sucesso.');
      } else {
        await axios.post(`${API_BASE_URL}/playlists`, values, {
          headers: { Authorization: `Bearer ${token}` }
        });
        message.success('Playlist criada com sucesso.');
      }
      setIsModalVisible(false);
      fetchPlaylists();
    } catch (error) {
      message.error('Falha ao salvar playlist.');
      console.error('Save playlist error:', error);
    }
  };

  const handleDeletePlaylist = async (id: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/playlists/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Playlist excluída com sucesso.');
      fetchPlaylists();
    } catch (error) {
      message.error('Falha ao excluir playlist.');
      console.error('Delete playlist error:', error);
    }
  };

  const handleOpenAddMedia = (playlistId: number) => {
    setSelectedPlaylistId(playlistId);
    mediaModalForm.setFieldsValue({ mediaId: undefined });
    setIsMediaModalVisible(true);
  };

  const handleAddMedia = async (values: { mediaId: number }) => {
    try {
      await axios.post(`${API_BASE_URL}/playlists/${selectedPlaylistId}/addMedia`, values.mediaId, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Mídia adicionada à playlist.');
      setIsMediaModalVisible(false);
      fetchPlaylists();
    } catch (error) {
      message.error('Falha ao adicionar mídia.');
      console.error('Add media to playlist error:', error);
    }
  };

  const handleRemoveMedia = async (playlistId: number, mediaId: number) => {
    try {
      await axios.post(`${API_BASE_URL}/playlists/${playlistId}/removeMedia`, mediaId, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Mídia removida da playlist.');
      fetchPlaylists();
    } catch (error) {
      message.error('Falha ao remover mídia.');
      console.error('Remove media from playlist error:', error);
    }
  };

  const columns = [
    { title: 'Nome', dataIndex: 'name', key: 'name' },
    {
      title: 'Mídias',
      key: 'media',
      render: (_: any, record: Playlist) => {
        const playlistMedias = medias.filter(m => record.mediaIds.includes(m.id));
        return (
          <div className="space-y-2">
            {playlistMedias.map(media => (
              <div key={media.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <Text>{media.name}</Text>
                <Button danger onClick={() => handleRemoveMedia(record.id, media.id)}>Remover</Button>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: Playlist) => (
        <Space size="middle">
          <Button onClick={() => handleOpenAddMedia(record.id)}>Adicionar Mídia</Button>
          <Popconfirm
            title="Tem certeza que deseja excluir esta playlist?"
            onConfirm={() => handleDeletePlaylist(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button danger>Excluir</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Header className="flex items-center justify-between bg-white px-8 shadow-sm">
        <div className="flex items-center">
          <Title level={2} className="m-0">Painel de Mídias</Title>
        </div>
        <Menu
          mode="horizontal"
          selectedKeys={['admin']} // Corrigido para uma chave fixa, pois este componente é o AdminPanel
          className="flex-grow justify-center"
        >
          <Menu.Item key="admin">Gerenciar Mídias e Playlists</Menu.Item>
        </Menu>
        {/* O botão de Sair será gerenciado pelo componente App.tsx agora */}
      </Header>
      <Content className="p-8">
        <MediaManager />
        <PlaylistManager />
      </Content>
    </Layout>
  );
};

export default AdminPanel;

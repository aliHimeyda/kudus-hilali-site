import React, { Component } from 'react';
import axios from 'axios';
import {
  Container,
  Navbar,
  Nav,
  Button,
  Spinner,
  Table,
  Row,
  Col,
  Card,
  Modal,
  Form,
  Image,
  Badge,
} from 'react-bootstrap';

export default class NewsTab extends Component {
  // Base URL for relative image paths
  IMAGE_BASE = 'http://localhost:8888/kudus/backend/news/';

  state = {
    newsList: [],
    isLoading: false,
    viewType: 'list', // 'list' or 'kanban'
    showAddModal: false,
    showUpdateModal: false,
    newNews: {
      title: '',
      content: '',
      category: '',
      admin_name: '',
      admin_image: '',
      image_url: '',
      publish_date: '',
    },
    selectedNews: null,
  };

  apiUrl = 'http://localhost:8888/kudus/backend/news/news_CRUD.php';

  componentDidMount() {
    this.fetchNews();
  }

  fetchNews = () => {
    this.setState({ isLoading: true });
    axios
      .get(this.apiUrl)
      .then((res) => {
        if (res.data.status === 'success') {
          this.setState({ newsList: res.data.data, isLoading: false });
        } else {
          this.setState({ isLoading: false });
        }
      })
      .catch(() => this.setState({ isLoading: false }));
  };

  switchView = (viewType) => this.setState({ viewType });

  handleAddOpen = () =>
    this.setState({
      showAddModal: true,
      newNews: {
        title: '',
        content: '',
        category: '',
        admin_name: '',
        admin_image: '',
        image_url: '',
        publish_date: '',
      },
    });

  handleAddSave = () => {
    this.setState({ isLoading: true });
    axios
      .post(this.apiUrl, this.state.newNews, { headers: { 'Content-Type': 'application/json' } })
      .then((res) => {
        if (res.data.status === 'success') {
          this.setState({ showAddModal: false });
          this.fetchNews();
        } else {
          this.setState({ isLoading: false });
        }
      })
      .catch(() => this.setState({ isLoading: false }));
  };

  handleUpdateOpen = (item) =>
    this.setState({ showUpdateModal: true, selectedNews: { ...item } });

  handleUpdateSave = () => {
    const { selectedNews } = this.state;
    this.setState({ isLoading: true });
    axios
      .put(
        `${this.apiUrl}?id=${selectedNews.id}`,
        selectedNews,
        { headers: { 'Content-Type': 'application/json' } }
      )
      .then((res) => {
        if (res.data.status === 'success') {
          this.setState({ showUpdateModal: false, selectedNews: null });
          this.fetchNews();
        } else {
          this.setState({ isLoading: false });
        }
      })
      .catch(() => this.setState({ isLoading: false }));
  };

  handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this news item?')) return;
    this.setState({ isLoading: true });
    axios
      .delete(this.apiUrl, { params: { id, soft: 1 } })
      .then((res) => {
        if (res.data.status === 'success') {
          this.fetchNews();
        } else {
          this.setState({ isLoading: false });
        }
      })
      .catch(() => this.setState({ isLoading: false }));
  };

  handleChange = ({ target: { name, value } }, update = false) => {
    const key = update ? 'selectedNews' : 'newNews';
    this.setState((prev) => ({ [key]: { ...prev[key], [name]: value } }));
  };

  render() {
    const {
      newsList,
      isLoading,
      viewType,
      showAddModal,
      showUpdateModal,
      newNews,
      selectedNews,
    } = this.state;

    return (
      <Container fluid className="p-3">
        <Navbar bg="light" expand="md" className="mb-3">
          <Navbar.Brand>News & Articles</Navbar.Brand>
          <Navbar.Toggle aria-controls="news-nav" />
          <Navbar.Collapse id="news-nav">
            <Nav activeKey={viewType} onSelect={this.switchView} className="me-auto">
              <Nav.Link eventKey="list">List</Nav.Link>
              <Nav.Link eventKey="kanban">Kanban</Nav.Link>
            </Nav>
            <Button variant="success" onClick={this.handleAddOpen} className="mt-2 mt-md-0">
              + Add News
            </Button>
          </Navbar.Collapse>
        </Navbar>

        {isLoading ? (
          <div className="text-center my-5">
            <Spinner animation="border" />
          </div>
        ) : viewType === 'list' ? (
          this.renderList(newsList)
        ) : (
          this.renderKanban(newsList)
        )}

        {/* Add Modal */}
        <Modal
          show={showAddModal}
          onHide={() => this.setState({ showAddModal: false })}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Add News</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.renderForm(newNews)}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.setState({ showAddModal: false })}>
              Cancel
            </Button>
            <Button variant="success" onClick={this.handleAddSave}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Update Modal */}
        <Modal
          show={showUpdateModal}
          onHide={() => this.setState({ showUpdateModal: false })}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Update News</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedNews && this.renderForm(selectedNews, true)}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.setState({ showUpdateModal: false })}>
              Cancel
            </Button>
            <Button variant="primary" onClick={this.handleUpdateSave}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }

  renderList = (list) => (
    <Table responsive bordered hover>
      <thead className="table-light">
        <tr>
          <th>Image</th>
          <th>Title</th>
          <th>Category</th>
          <th>Author</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {list
          .filter((n) => n.isDeleted !== '1')
          .map((n) => {
            const imgPath = n.image || n.image_url;
            const src = imgPath
              ? imgPath.startsWith('http')
                ? imgPath
                : this.IMAGE_BASE + imgPath
              : '';
            return (
              <tr key={n.id}>
                <td>
                  <Image src={src} thumbnail width={60} height={60} alt={n.title} />
                </td>
                <td>{n.title}</td>
                <td>{n.category}</td>
                <td>{n.admin_name}</td>
                <td>{new Date(n.publish_date).toLocaleDateString()}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => this.handleUpdateOpen(n)}
                  >
                    Update
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => this.handleDelete(n.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            );
          })}
      </tbody>
    </Table>
  );

  renderKanban = (list) => (
    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
      {list
        .filter((n) => n.isDeleted !== '1')
        .map((n) => {
          const imgPath = n.image || n.image_url;
          const src = imgPath
            ? imgPath.startsWith('http')
              ? imgPath
              : this.IMAGE_BASE + imgPath
            : '';
          return (
            <Col key={n.id}>
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={src}
                  alt={n.title}
                  style={{ height: 180, objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title className="fs-5">{n.title}</Card.Title>
                  <Card.Text className="mb-1">Category: {n.category}</Card.Text>
                  <Card.Text className="mb-1">Author: {n.admin_name}</Card.Text>
                  <Card.Text className="mb-0">Date: {new Date(n.publish_date).toLocaleDateString()}</Card.Text>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-between align-items-center">
                  <div>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-1"
                      onClick={() => this.handleUpdateOpen(n)}
                    >
                      Update
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => this.handleDelete(n.id)}>
                      Delete
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          );
        })}
    </Row>
  );

  renderForm = (data, update = false) => (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={data.title}
          onChange={(e) => this.handleChange(e, update)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Content</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="content"
          value={data.content}
          onChange={(e) => this.handleChange(e, update)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Category</Form.Label>
        <Form.Control
          type="text"
          name="category"
          value={data.category}
          onChange={(e) => this.handleChange(e, update)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Author Name</Form.Label>
        <Form.Control
          type="text"
          name="admin_name"
          value={data.admin_name}
          onChange={(e) => this.handleChange(e, update)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Author Image URL</Form.Label>
        <Form.Control
          type="text"
          name="admin_image\"
          value={data.admin_image}
          onChange={(e) => this.handleChange(e, update)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Image URL</Form.Label>
        <Form.Control
          type="text"
          name="image_url"
          value={data.image_url}
          onChange={(e) => this.handleChange(e, update)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Publish Date</Form.Label>
        <Form.Control
          type="date"
          name="publish_date"
          value={data.publish_date?.split('T')[0] || ''}
          onChange={(e) => this.handleChange(e, update)}
        />
      </Form.Group>
    </Form>
  );
}

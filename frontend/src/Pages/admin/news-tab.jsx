import React, { Component, useEffect, useRef } from 'react';
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

/* =========================
   ContentEditor (FIXED TOOLBAR)
   ========================= */
const ContentEditor = ({ value, onChange }) => {
  const editableRef = useRef(null);

  // value -> editable sync
  useEffect(() => {
    const el = editableRef.current;
    if (!el) return;
    if (typeof value === 'string' && value !== el.innerHTML) {
      el.innerHTML = value || '';
    }
  }, [value]);

  // emit changes
  useEffect(() => {
    const el = editableRef.current;
    if (!el) return;
    const handler = () => onChange?.(el.innerHTML);
    el.addEventListener('input', handler);
    return () => el.removeEventListener('input', handler);
  }, [onChange]);

  const exec = (cmd, val = null) => {
    editableRef.current?.focus();
    try {
      document.execCommand('styleWithCSS', false, true);
    } catch {}
    document.execCommand(cmd, false, val);
    onChange?.(editableRef.current?.innerHTML || '');
  };

  return (
    <div>
      {/* FIXED TOOLBAR */}
      <div
        className="mb-2 p-2 border rounded bg-light d-flex flex-wrap gap-2"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <Button size="sm" variant="light" onClick={() => exec('bold')} title="Bold">B</Button>
        <Button size="sm" variant="light" onClick={() => exec('italic')} title="Italic">I</Button>

        <Form.Select
          size="sm"
          style={{ width: 120 }}
          defaultValue=""
          onChange={(e) => exec('fontName', e.target.value)}
          title="Font"
        >
          <option value="" disabled>Font</option>
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
          <option value='"Times New Roman", Times, serif'>Times</option>
          <option value='"Courier New", Courier, monospace'>Courier</option>
        </Form.Select>

        {/* execCommand('fontSize') accepts 1..7 */}
        <Form.Select
          size="sm"
          style={{ width: 90 }}
          defaultValue=""
          onChange={(e) => exec('fontSize', e.target.value)}
          title="Size"
        >
          <option value="" disabled>Size</option>
          <option value="2">12</option>
          <option value="3">14</option>
          <option value="4">16</option>
          <option value="5">18</option>
          <option value="6">20</option>
          <option value="7">24</option>
        </Form.Select>

        <Form.Control
          type="color"
          size="sm"
          title="Color"
          onChange={(e) => exec('foreColor', e.target.value)}
          style={{ width: 42, padding: 2 }}
        />

        <Button size="sm" variant="light" onClick={() => exec('insertUnorderedList')} title="Bullet list">•</Button>
        <Button size="sm" variant="light" onClick={() => exec('insertOrderedList')} title="Numbered list">1.</Button>

        <Button size="sm" variant="light" onClick={() => exec('justifyLeft')} title="Align left">⬅︎</Button>
        <Button size="sm" variant="light" onClick={() => exec('justifyCenter')} title="Align center">⬌</Button>
        <Button size="sm" variant="light" onClick={() => exec('justifyRight')} title="Align right">➡︎</Button>
        <Button size="sm" variant="light" onClick={() => exec('justifyFull')} title="Justify">☰</Button>
      </div>

      {/* EDITOR AREA */}
      <div
        ref={editableRef}
        contentEditable
        suppressContentEditableWarning
        className="form-control"
        style={{ minHeight: 140, overflow: 'auto' }}
        onBlur={() => onChange?.(editableRef.current?.innerHTML || '')}
      />
    </div>
  );
};

/* =========================
   NewsTab
   ========================= */
export default class NewsTab extends Component {
  // Base for relative images
  IMAGE_BASE = 'http://kudushilali.org/backend/news/';

  state = {
    newsList: [],
    isLoading: false,
    viewType: 'list', // 'list' | 'kanban'
    showAddModal: false,
    showUpdateModal: false,

    newNews: {
      title: '',
      content: '',
      category: '',
      admin_name: '',
      admin_image: '',
      // Cover image (used in listing/cards)
      image_url: '',
      // NEW: Detail image for the article page
      detail_image_url: '',
      publish_date: '',
    },
    selectedNews: null,
  };

  apiUrl = 'http://kudushilali.org/backend/news/news_CRUD.php';

  componentDidMount() {
    this.fetchNews();
  }

  /* -------- API -------- */
  fetchNews = () => {
    this.setState({ isLoading: true });
    axios
      .get(this.apiUrl)
      .then((res) => {
        if (res.data?.status === 'success') {
          this.setState({ newsList: res.data.data || [], isLoading: false });
        } else {
          const payload = Array.isArray(res.data) ? res.data : [];
          this.setState({ newsList: payload, isLoading: false });
        }
      })
      .catch(() => this.setState({ isLoading: false }));
  };

  handleAddOpen = () =>
    this.setState({
      showAddModal: true,
      newNews: {
        title: '',
        content: '',
        category: '',
        admin_name: '',
        admin_image: '',
        image_url: '',         // cover
        detail_image_url: '',  // detail
        publish_date: '',
      },
    });

  handleAddSave = () => {
    this.setState({ isLoading: true });
    axios
      .post(this.apiUrl, this.state.newNews, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => {
        if (res.data?.status === 'success') {
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
    if (!selectedNews?.id) return;
    this.setState({ isLoading: true });
    axios
      .put(`${this.apiUrl}?id=${selectedNews.id}`, selectedNews, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => {
        if (res.data?.status === 'success') {
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
        if (res.data?.status === 'success') {
          this.fetchNews();
        } else {
          this.setState({ isLoading: false });
        }
      })
      .catch(() => this.setState({ isLoading: false }));
  };

  /* -------- UI helpers -------- */
  switchView = (viewType) => this.setState({ viewType });

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
          <Modal.Body>{selectedNews && this.renderForm(selectedNews, true)}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.setState({ showUpdateModal: false })}>
              Cancel
            </Button>
            <Button variant="primary" onClick={this.handleUpdateSave} disabled={!selectedNews}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }

  /* -------- render helpers -------- */
  renderList = (list) => (
    <Table responsive bordered hover>
      <thead className="table-light">
        <tr>
          <th>Cover</th>
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
            // Prefer cover (image_url), fallback to image or detail_image_url
            const imgPath = n.image_url || n.image || n.detail_image_url;
            const src = imgPath
              ? imgPath.startsWith('http')
                ? imgPath
                : this.IMAGE_BASE + imgPath
              : '';
            return (
              <tr key={n.id}>
                <td>
                  {src ? (
                    <Image src={src} thumbnail width={60} height={60} alt={n.title} />
                  ) : (
                    <Badge bg="light" text="dark">No image</Badge>
                  )}
                </td>
                <td>{n.title}</td>
                <td>{n.category}</td>
                <td>{n.admin_name}</td>
                <td>{n.publish_date ? new Date(n.publish_date).toLocaleDateString() : '-'}</td>
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
          const imgPath = n.image_url || n.image || n.detail_image_url;
          const src = imgPath
            ? imgPath.startsWith('http')
              ? imgPath
              : this.IMAGE_BASE + imgPath
            : '';
          return (
            <Col key={n.id}>
              <Card className="h-100 shadow-sm">
                {src ? (
                  <Card.Img
                    variant="top"
                    src={src}
                    alt={n.title}
                    style={{ height: 180, objectFit: 'cover' }}
                  />
                ) : null}
                <Card.Body>
                  <Card.Title className="fs-5">{n.title}</Card.Title>
                  <Card.Text className="mb-1">Category: {n.category}</Card.Text>
                  <Card.Text className="mb-1">Author: {n.admin_name}</Card.Text>
                  <Card.Text className="mb-0">
                    Date: {n.publish_date ? new Date(n.publish_date).toLocaleDateString() : '-'}
                  </Card.Text>
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

  renderForm = (data, update = false) => {
    const CATEGORY_OPTIONS = [
      'Projects & Initiatives',
      'Impact Stories',
      'Events & Campaigns',
      'Research & Insights',
      'Organizational Updates',
    ];

    return (
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
          <ContentEditor
            value={data.content}
            onChange={(html) =>
              this.handleChange({ target: { name: 'content', value: html } }, update)
            }
          />
        </Form.Group>

        {/* CATEGORY SELECT */}
        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Select
            name="category"
            value={data.category}
            onChange={(e) => this.handleChange(e, update)}
          >
            <option value="">Select a category</option>
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </Form.Select>
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
            name="admin_image"
            value={data.admin_image}
            onChange={(e) => this.handleChange(e, update)}
          />
        </Form.Group>

        {/* COVER & DETAIL IMAGES */}
        <Form.Group className="mb-3">
          <Form.Label>Cover Image URL</Form.Label>
          <Form.Control
            type="text"
            name="image_url"
            value={data.image_url}
            onChange={(e) => this.handleChange(e, update)}
            placeholder="Main image shown on lists/cards and detail header"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Detail Image URL</Form.Label>
          <Form.Control
            type="text"
            name="detail_image_url"
            value={data.detail_image_url || ''}
            onChange={(e) => this.handleChange(e, update)}
            placeholder="Secondary image for article content sections"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Publish Date</Form.Label>
          <Form.Control
            type="date"
            name="publish_date"
            value={data.publish_date?.toString().split('T')[0] || ''}
            onChange={(e) => this.handleChange(e, update)}
          />
        </Form.Group>
      </Form>
    );
  };
}

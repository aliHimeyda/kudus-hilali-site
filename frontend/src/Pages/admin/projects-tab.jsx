import React, { Component } from 'react';
import axios from 'axios';
import {
  Container,
  Navbar,
  Nav,
  Button,
  Modal,
  Form,
  Spinner,
  Table,
  Row,
  Col,
  Card,
  Badge,
  Image,
} from 'react-bootstrap';

const CATEGORY_OPTIONS = [
  'Education',
  'Health',
  'Medical',
  'Homeless',
  'Relief Food',
  'Kids World',
];

export default class ProjectsTab extends Component {
  state = {
    projects: [],
    viewType: 'list',
    showModal: false,
    addModal: false,
    selectedProject: null,
    newProject: {
      title: '',
      raised: 0,
      goal: 0,
      category: '',
      image: '',
      explanation: '',
      mission: '',
      objective: '',
      status: 'active',
    },
    isLoading: false,
  };

  apiUrl = 'http://mediumslateblue-pony-639793.hostingersite.com/backend/projects/projects_CRUD.php';

  componentDidMount() {
    this.fetchProjects();
  }

  fetchProjects = () => {
    this.setState({ isLoading: true });
    axios
      .get(this.apiUrl)
      .then((res) => {
        if (res.data.status === 'success') {
          this.setState({ projects: res.data.data, isLoading: false });
        } else {
          this.setState({ isLoading: false });
        }
      })
      .catch(() => this.setState({ isLoading: false }));
  };

  handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      this.setState({ isLoading: true });
      axios
        .delete(this.apiUrl, { params: { id, soft: 1 } })
        .then((res) => {
          if (res.data.status === 'success') this.fetchProjects();
          else this.setState({ isLoading: false });
        })
        .catch(() => this.setState({ isLoading: false }));
    }
  };

  handleUpdateOpen = (project) =>
    this.setState({ showModal: true, selectedProject: { ...project } });

  handleUpdateSave = () => {
    const { selectedProject } = this.state;
    this.setState({ isLoading: true });
    axios
      .put(
        `${this.apiUrl}?id=${selectedProject.id}`,
        selectedProject,
        { headers: { 'Content-Type': 'application/json' } }
      )
      .then((res) => {
        if (res.data.status === 'success') {
          this.setState({ showModal: false, selectedProject: null });
          this.fetchProjects();
        } else this.setState({ isLoading: false });
      })
      .catch(() => this.setState({ isLoading: false }));
  };

  handleAddOpen = () =>
    this.setState({ addModal: true, newProject: { ...this.state.newProject } });

  handleAddSave = () => {
    this.setState({ isLoading: true });
    axios
      .post(this.apiUrl, this.state.newProject, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => {
        if (res.data.status === 'success') {
          this.setState({ addModal: false });
          this.fetchProjects();
        } else this.setState({ isLoading: false });
      })
      .catch(() => this.setState({ isLoading: false }));
  };

  handleChange = ({ target: { name, value } }) => {
    const key = this.state.showModal ? 'selectedProject' : 'newProject';
    this.setState((prev) => ({
      [key]: { ...prev[key], [name]: value },
    }));
  };

  switchView = (viewType) => this.setState({ viewType });

  render() {
    const {
      projects,
      viewType,
      showModal,
      addModal,
      selectedProject,
      newProject,
      isLoading,
    } = this.state;

    return (
      <Container fluid className="p-3">
        <Navbar bg="light" expand="md" className="mb-4">
          <Navbar.Brand>Projects</Navbar.Brand>
          <Navbar.Toggle aria-controls="projects-nav" />
          <Navbar.Collapse id="projects-nav">
            <Nav activeKey={viewType} onSelect={this.switchView} className="me-auto">
              <Nav.Link eventKey="list">List</Nav.Link>
              <Nav.Link eventKey="kanban">Kanban</Nav.Link>
            </Nav>
            <Button variant="success" onClick={this.handleAddOpen} className="mt-2 mt-md-0">
              + Add Project
            </Button>
          </Navbar.Collapse>
        </Navbar>

        {isLoading ? (
          <div className="text-center my-5">
            <Spinner animation="border" />
          </div>
        ) : viewType === 'list' ? (
          this.renderList(projects)
        ) : (
          this.renderKanban(projects)
        )}

        <Modal show={showModal} onHide={() => this.setState({ showModal: false })} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Update Project</Modal.Title>
          </Modal.Header>
          <Modal.Body>{selectedProject && this.renderForm(selectedProject)}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.setState({ showModal: false })}>
              Cancel
            </Button>
            <Button variant="primary" onClick={this.handleUpdateSave}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={addModal} onHide={() => this.setState({ addModal: false })} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Add New Project</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.renderForm(newProject)}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.setState({ addModal: false })}>
              Cancel
            </Button>
            <Button variant="success" onClick={this.handleAddSave}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }

  renderList = (projects) => (
    <Table striped bordered hover responsive className="shadow-sm bg-white">
      <thead className="table-light">
        <tr>
          <th>Photo</th>
          <th>Title</th>
          <th>Category</th>
          <th>Raised / Goal</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {projects
          .filter((p) => p.isDeleted !== '1')
          .map((p) => (
            <tr key={p.id}>
              <td>
                <Image src={p.image} rounded width={50} height={50} alt={p.title} />
              </td>
              <td>{p.title}</td>
              <td>{p.category}</td>
              <td>${p.raised} / ${p.goal}</td>
              <td>
                <Badge bg={p.status === 'active' ? 'success' : 'secondary'}>
                  {p.status}
                </Badge>
              </td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2 mb-1"
                  onClick={() => this.handleUpdateOpen(p)}
                >
                  Update
                </Button>
                <Button variant="danger" size="sm" onClick={() => this.handleDelete(p.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  );

  renderKanban = (projects) => (
    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
      {projects
        .filter((p) => p.isDeleted !== '1')
        .map((p) => (
          <Col key={p.id}>
            <Card className="h-100 shadow-sm">
              <div className="ratio ratio-16x9">
                <Card.Img
                  src={p.image}
                  alt={p.title}
                  className="card-img-top"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <Card.Body>
                <Card.Title className="fs-5">{p.title}</Card.Title>
                <Card.Text className="mb-1">Category: {p.category}</Card.Text>
                <Card.Text className="mb-0">Raised: ${p.raised} / ${p.goal}</Card.Text>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-between align-items-center">
                <Badge bg={p.status === 'active' ? 'success' : 'secondary'}>
                  {p.status}
                </Badge>
                <div>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-1 mb-1"
                    onClick={() => this.handleUpdateOpen(p)}
                  >
                    Update
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => this.handleDelete(p.id)}>
                    Delete
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        ))}
    </Row>
  );

  renderForm = (project) => (
    <Form>
      <Row>
        <Col xs={12} md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" name="title" value={project.title} onChange={this.handleChange} />
          </Form.Group>
        </Col>
        <Col xs={6} md={3}>
          <Form.Group className="mb-3">
            <Form.Label>Raised ($)</Form.Label>
            <Form.Control type="number" name="raised" value={project.raised} onChange={this.handleChange} />
          </Form.Group>
        </Col>
        <Col xs={6} md={3}>
          <Form.Group className="mb-3">
            <Form.Label>Goal ($)</Form.Label>
            <Form.Control type="number" name="goal" value={project.goal} onChange={this.handleChange} />
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-3">
        <Form.Label>Category</Form.Label>
        <Form.Select name="category" value={project.category} onChange={this.handleChange}>
          <option value="">Select category</option>
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Image URL</Form.Label>
        <Form.Control type="text" name="image" value={project.image} onChange={this.handleChange} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Explanation</Form.Label>
        <Form.Control as="textarea" rows={2} name="explanation" value={project.explanation} onChange={this.handleChange} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Mission</Form.Label>
        <Form.Control as="textarea" rows={1} name="mission" value={project.mission} onChange={this.handleChange} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Objective</Form.Label>
        <Form.Control as="textarea" rows={1} name="objective" value={project.objective} onChange={this.handleChange} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Status</Form.Label>
        <Form.Select name="status" value={project.status} onChange={this.handleChange}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Form.Select>
      </Form.Group>
    </Form>
  );
}

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
  Image,
} from 'react-bootstrap';

export default class OurTeamsTab extends Component {
  state = {
    teams: [],
    viewType: 'list', // 'list' or 'kanban'
    showModal: false,
    addModal: false,
    selectedTeam: null,
    newTeam: {
      name: '',
      role: '',
      image: '',
      address: '',
      phone: '',
      email: '',
      bio: '',
      experience: '',
      facebook: '',
      linkedin: '',
      twitter: '',
      instagram: '',
    },
    isLoading: false,
  };

  apiUrl = 'http://mediumslateblue-pony-639793.hostingersite.com/backend/teams/teams_CRUD.php';

  componentDidMount() {
    this.fetchTeams();
  }

  fetchTeams = () => {
    this.setState({ isLoading: true });
    axios
      .get(this.apiUrl)
      .then((res) => {
        if (res.data.status === 'success') {
          this.setState({ teams: res.data.data, isLoading: false });
        } else {
          this.setState({ isLoading: false });
        }
      })
      .catch(() => this.setState({ isLoading: false }));
  };

  handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      this.setState({ isLoading: true });
      axios
        .delete(this.apiUrl, { params: { id, soft: 1 } })
        .then((res) => {
          if (res.data.status === 'success') this.fetchTeams();
          else this.setState({ isLoading: false });
        })
        .catch(() => this.setState({ isLoading: false }));
    }
  };

  handleUpdateOpen = (team) =>
    this.setState({ showModal: true, selectedTeam: { ...team } });

  handleUpdateSave = () => {
    const { selectedTeam } = this.state;
    this.setState({ isLoading: true });
    axios
      .put(
        `${this.apiUrl}?id=${selectedTeam.id}`,
        selectedTeam,
        { headers: { 'Content-Type': 'application/json' } }
      )
      .then((res) => {
        if (res.data.status === 'success') {
          this.setState({ showModal: false, selectedTeam: null });
          this.fetchTeams();
        } else this.setState({ isLoading: false });
      })
      .catch(() => this.setState({ isLoading: false }));
  };

  handleAddOpen = () =>
    this.setState({ addModal: true, newTeam: { ...this.state.newTeam } });

  handleAddSave = () => {
    this.setState({ isLoading: true });
    axios
      .post(this.apiUrl, this.state.newTeam, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => {
        if (res.data.status === 'success') {
          this.setState({ addModal: false });
          this.fetchTeams();
        } else this.setState({ isLoading: false });
      })
      .catch(() => this.setState({ isLoading: false }));
  };

  handleChange = ({ target: { name, value } }) => {
    const key = this.state.showModal ? 'selectedTeam' : 'newTeam';
    this.setState((prev) => ({ [key]: { ...prev[key], [name]: value } }));
  };

  switchView = (viewType) => this.setState({ viewType });

  render() {
    const {
      teams,
      viewType,
      showModal,
      addModal,
      selectedTeam,
      newTeam,
      isLoading,
    } = this.state;

    return (
      <Container fluid className="p-3">
        <Navbar bg="light" expand="md" className="mb-4">
          <Navbar.Brand>Our Teams</Navbar.Brand>
          <Navbar.Toggle aria-controls="teams-nav" />
          <Navbar.Collapse id="teams-nav">
            <Nav activeKey={viewType} onSelect={this.switchView} className="me-auto">
              <Nav.Link eventKey="list">List</Nav.Link>
              <Nav.Link eventKey="kanban">Kanban</Nav.Link>
            </Nav>
            <Button variant="success" onClick={this.handleAddOpen} className="mt-2 mt-md-0">
              + Add Member
            </Button>
          </Navbar.Collapse>
        </Navbar>

        {isLoading ? (
          <div className="text-center my-5">
            <Spinner animation="border" />
          </div>
        ) : viewType === 'list' ? (
          this.renderList(teams)
        ) : (
          this.renderKanban(teams)
        )}

        <Modal show={showModal} onHide={() => this.setState({ showModal: false })} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Update Member</Modal.Title>
          </Modal.Header>
          <Modal.Body>{selectedTeam && this.renderForm(selectedTeam)}</Modal.Body>
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
            <Modal.Title>Add New Member</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.renderForm(newTeam)}</Modal.Body>
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

  renderList = (teams) => (
    <Table striped bordered hover responsive className="shadow-sm bg-white">
      <thead className="table-light">
        <tr>
          <th>Photo</th>
          <th>Name</th>
          <th>Role</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {teams.filter((t) => t.isDeleted !== '1').map((t) => (
          <tr key={t.id}>
            <td><Image src={t.image} rounded width={50} height={50} alt={t.name} /></td>
            <td>{t.name}</td>
            <td>{t.role}</td>
            <td>{t.email}</td>
            <td>{t.phone}</td>
            <td>
              <Button variant="warning" size="sm" className="me-2 mb-1" onClick={() => this.handleUpdateOpen(t)}>Update</Button>
              <Button variant="danger" size="sm" onClick={() => this.handleDelete(t.id)}>Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  renderKanban = (teams) => (
    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
      {teams.filter((t) => t.isDeleted !== '1').map((t) => (
        <Col key={t.id}>
          <Card className="h-100 shadow-sm">
            <div className="ratio ratio-16x9">
              <Card.Img src={t.image} alt={t.name} className="card-img-top" style={{ objectFit: 'cover' }} />
            </div>
            <Card.Body>
              <Card.Title className="fs-5">{t.name}</Card.Title>
              <Card.Text className="mb-1">Role: {t.role}</Card.Text>
              <Card.Text className="mb-0">Email: {t.email}</Card.Text>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-between align-items-center">
              <div>
                <Button variant="warning" size="sm" className="me-1 mb-1" onClick={() => this.handleUpdateOpen(t)}>Update</Button>
                <Button variant="danger" size="sm" onClick={() => this.handleDelete(t.id)}>Delete</Button>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      ))}
    </Row>
  );

  renderForm = (team) => (
    <Form>
      <Row>
        <Col xs={12} md={6}><Form.Group className="mb-3"><Form.Label>Name</Form.Label><Form.Control type="text" name="name" value={team.name} onChange={this.handleChange} /></Form.Group></Col>
        <Col xs={12} md={6}><Form.Group className="mb-3"><Form.Label>Role</Form.Label><Form.Control type="text" name="role" value={team.role} onChange={this.handleChange} /></Form.Group></Col>
      </Row>
      <Form.Group className="mb-3"><Form.Label>Photo URL</Form.Label><Form.Control type="text" name="image" value={team.image} onChange={this.handleChange} /></Form.Group>
      <Row>
        <Col xs={12} md={6}><Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control type="email" name="email" value={team.email} onChange={this.handleChange} /></Form.Group></Col>
        <Col xs={12} md={6}><Form.Group className="mb-3"><Form.Label>Phone</Form.Label><Form.Control type="text" name="phone" value={team.phone} onChange={this.handleChange} /></Form.Group></Col>
      </Row>
      <Form.Group className="mb-3"><Form.Label>Address</Form.Label><Form.Control type="text" name="address" value={team.address} onChange={this.handleChange} /></Form.Group>
      <Form.Group className="mb-3"><Form.Label>Bio</Form.Label><Form.Control as="textarea" rows={2} name="bio" value={team.bio} onChange={this.handleChange} /></Form.Group>
      <Form.Group className="mb-3"><Form.Label>Experience</Form.Label><Form.Control as="textarea" rows={2} name="experience" value={team.experience} onChange={this.handleChange} /></Form.Group>
      <Row>
        <Col xs={12} md={6}><Form.Group className="mb-3"><Form.Label>Facebook</Form.Label><Form.Control type="text" name="facebook" value={team.facebook} onChange={this.handleChange} /></Form.Group></Col>
        <Col xs={12} md={6}><Form.Group className="mb-3"><Form.Label>LinkedIn</Form.Label><Form.Control type="text" name="linkedin" value={team.linkedin} onChange={this.handleChange} /></Form.Group></Col>
      </Row>
      <Row>
        <Col xs={12} md={6}><Form.Group className="mb-3"><Form.Label>Twitter</Form.Label><Form.Control type="text" name="twitter" value={team.twitter} onChange={this.handleChange} /></Form.Group></Col>
        <Col xs={12} md={6}><Form.Group className="mb-3"><Form.Label>Instagram</Form.Label><Form.Control type="text" name="instagram" value={team.instagram} onChange={this.handleChange} /></Form.Group></Col>
      </Row>
    </Form>
  );
}

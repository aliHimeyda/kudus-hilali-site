import React, { Component } from 'react';
import axios from 'axios';
import {
  Container,
  Navbar,
  Button,
  Spinner,
  Table,
  Modal,
  Form,
  Row,
  Col,
} from 'react-bootstrap';

export default class DonationsTab extends Component {
  state = {
    donations: [],
    projects: [],
    loading: false,
    showAdd: false,
    showEdit: false,
    selected: null,
    form: {
      project_id: '',
      donor_name: '',
      donor_email: '',
      phone: '',
      city: '',
      honor_name: '',
      amount: '',
      donation_date: '',
    },
  };

  donationsUrl = 'https://kudushilali.org/backend/donations/donations_CRUD.php';
  projectsUrl = 'https://kudushilali.org/backend/projects/projects_CRUD.php';

  componentDidMount() {
    this.loadProjects();
    this.loadDonations();
  }

  loadProjects = async () => {
    const res = await axios.get(this.projectsUrl);
    if (res.data.status === 'success') {
      this.setState({ projects: res.data.data });
    }
  };

  loadDonations = async () => {
    this.setState({ loading: true });
    const res = await axios.get(this.donationsUrl);
    if (res.data.status === 'success') {
      this.setState({ donations: res.data.data });
    }
    this.setState({ loading: false });
  };

  openAdd = () => {
    this.setState({
      showAdd: true,
      form: {
        project_id: '',
        donor_name: '',
        donor_email: '',
        phone: '',
        city: '',
        honor_name: '',
        amount: '',
        donation_date: '',
      },
    });
  };

  saveAdd = async () => {
    this.setState({ loading: true });
    await axios.post(this.donationsUrl, this.state.form, {
      headers: { 'Content-Type': 'application/json' },
    });
    this.setState({ showAdd: false });
    await this.loadDonations();
  };

  openEdit = (donation) => {
    this.setState({ showEdit: true, selected: donation, form: { ...donation } });
  };

  saveEdit = async () => {
    const { selected, form } = this.state;
    this.setState({ loading: true });
    await axios.put(`${this.donationsUrl}?id=${selected.id}`, form, {
      headers: { 'Content-Type': 'application/json' },
    });
    this.setState({ showEdit: false, selected: null });
    await this.loadDonations();
  };

  deleteDonation = async (id) => {
    if (!window.confirm('Are you sure you want to delete this donation?')) return;
    this.setState({ loading: true });
    await axios.delete(this.donationsUrl, { params: { id, soft: 1 } });
    await this.loadDonations();
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((prev) => ({ form: { ...prev.form, [name]: value } }));
  };

  render() {
    const { donations, projects, loading, showAdd, showEdit, form } = this.state;

    return (
      <Container fluid className="p-3">
        <Navbar bg="light" expand="md" className="mb-3">
          <Navbar.Brand>Donations</Navbar.Brand>
          <Button variant="success" className="ms-auto" onClick={this.openAdd}>
            + Add Donation
          </Button>
        </Navbar>

        {loading ? (
          <Spinner animation="border" />
        ) : (
          <Table responsive bordered hover>
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Project</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City</th>
                <th>Honor</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {donations
                .filter((d) => d.isDeleted !== '1')
                .map((d) => (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>
                      {projects.find((p) => p.id === d.project_id)?.title || '—'}
                    </td>
                    <td>{d.donor_name}</td>
                    <td>{d.donor_email}</td>
                    <td>{d.phone}</td>
                    <td>{d.city}</td>
                    <td>{d.honor_name}</td>
                    <td>${d.amount}</td>
                    <td>{new Date(d.donation_date).toLocaleDateString()}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="warning"
                        className="me-2"
                        onClick={() => this.openEdit(d)}
                      >
                        Update
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => this.deleteDonation(d.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        )}

        <Modal show={showAdd} onHide={() => this.setState({ showAdd: false })} centered>
          <Modal.Header closeButton>
            <Modal.Title>Add Donation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>Project</Form.Label>
                    <Form.Select name="project_id" value={form.project_id} onChange={this.handleChange}>
                      <option value="">Select project</option>
                      {projects
                        .filter((p) => p.isDeleted !== '1')
                        .map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.title}
                          </option>
                        ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Donor Name</Form.Label>
                    <Form.Control
                      name="donor_name"
                      value={form.donor_name}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="donor_email"
                      value={form.donor_email}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      name="phone"
                      value={form.phone}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      name="city"
                      value={form.city}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Honor Name</Form.Label>
                    <Form.Control
                      name="honor_name"
                      value={form.honor_name}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                      type="number"
                      name="amount"
                      value={form.amount}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="donation_date"
                      value={form.donation_date}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.setState({ showAdd: false })}>
              Cancel
            </Button>
            <Button variant="success" onClick={this.saveAdd}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>


        <Modal show={showEdit} onHide={() => this.setState({ showEdit: false })} centered>
          <Modal.Header closeButton>
            <Modal.Title>Update Donation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>Project</Form.Label>
                    <Form.Select name="project_id" value={form.project_id} onChange={this.handleChange}>
                      <option value="">Select project</option>
                      {projects
                        .filter((p) => p.isDeleted !== '1')
                        .map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.title}
                          </option>
                        ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Donor Name</Form.Label>
                    <Form.Control
                      name="donor_name"
                      value={form.donor_name}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Form.Group><Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="donor_email"
                      value={form.donor_email}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      name="phone"
                      value={form.phone}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      name="city"
                      value={form.city}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Honor Name</Form.Label>
                    <Form.Control
                      name="honor_name"
                      value={form.honor_name}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                      type="number"
                      name="amount"
                      value={form.amount}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="donation_date"
                      value={form.donation_date}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.setState({ showEdit: false })}>
              Cancel
            </Button>
            <Button variant="primary" onClick={this.saveEdit}>
              Update
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }
}
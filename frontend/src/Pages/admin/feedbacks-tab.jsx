import React, { Component } from 'react';
import axios from 'axios';
import {
  Container,
  Spinner,
  Table,
  Image,
  Button,
  Badge,
  Modal,
  Form,
} from 'react-bootstrap';

export default class FeedbacksTab extends Component {
  state = {
    feedbacks: [],
    isLoading: false,
    showAddModal: false,
    showUpdateModal: false,
    selectedFeedback: null,
    newFeedback: {
      donor_name: '',
      feedback: '',
      stars: 0,
      image_url: '',
    },
  };

  apiUrl = 'http://mediumslateblue-pony-639793.hostingersite.com/backend/donors_feedbacks/donors_feedbacks_CRUD.php';

  componentDidMount() {
    this.fetchFeedbacks();
  }

  fetchFeedbacks = () => {
    this.setState({ isLoading: true });
    axios
      .get(this.apiUrl)
      .then((res) => {
        if (res.data.status === 'success') {
          this.setState({ feedbacks: res.data.data, isLoading: false });
        } else {
          this.setState({ isLoading: false });
        }
      })
      .catch(() => this.setState({ isLoading: false }));
  };

  handleAddOpen = () =>
    this.setState({ showAddModal: true, newFeedback: { donor_name: '', feedback: '', stars: 0, image_url: '' } });

  handleAddSave = () => {
    this.setState({ isLoading: true });
    axios
      .post(this.apiUrl, this.state.newFeedback, { headers: { 'Content-Type': 'application/json' } })
      .then((res) => {
        if (res.data.status === 'success') {
          this.setState({ showAddModal: false });
          this.fetchFeedbacks();
        } else this.setState({ isLoading: false });
      })
      .catch(() => this.setState({ isLoading: false }));
  };

  handleUpdateOpen = (fb) =>
    this.setState({ showUpdateModal: true, selectedFeedback: { ...fb } });

  handleUpdateSave = () => {
    const { selectedFeedback } = this.state;
    this.setState({ isLoading: true });
    axios
      .put(
        `${this.apiUrl}?id=${selectedFeedback.id}`,
        selectedFeedback,
        { headers: { 'Content-Type': 'application/json' } }
      )
      .then((res) => {
        if (res.data.status === 'success') {
          this.setState({ showUpdateModal: false, selectedFeedback: null });
          this.fetchFeedbacks();
        } else this.setState({ isLoading: false });
      })
      .catch(() => this.setState({ isLoading: false }));
  };

  handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      this.setState({ isLoading: true });
      axios
        .delete(this.apiUrl, { params: { id, soft: 1 } })
        .then((res) => {
          if (res.data.status === 'success') this.fetchFeedbacks();
          else this.setState({ isLoading: false });
        })
        .catch(() => this.setState({ isLoading: false }));
    }
  };

  handleChange = ({ target: { name, value } }, update = false) => {
    const key = update ? 'selectedFeedback' : 'newFeedback';
    this.setState((prev) => ({ [key]: { ...prev[key], [name]: value } }));
  };

  render() {
    const {
      feedbacks,
      isLoading,
      showAddModal,
      showUpdateModal,
      selectedFeedback,
      newFeedback,
    } = this.state;

    return (
      <Container fluid className="p-3">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4>Donors Feedbacks</h4>
          <Button variant="success" onClick={this.handleAddOpen}>
            + Add Feedback
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center my-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <Table responsive bordered hover>
            <thead className="table-light">
              <tr>
                <th>Photo</th>
                <th>Donor Name</th>
                <th>Feedback</th>
                <th>Stars</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.filter((f) => f.isDeleted !== '1').map((f) => (
                <tr key={f.id}>
                  <td>
                    <Image src={f.image_url} roundedCircle width={50} height={50} alt={f.donor_name} />
                  </td>
                  <td>{f.donor_name}</td>
                  <td>{f.feedback}</td>
                  <td><Badge bg="warning" text="dark">{f.stars} ★</Badge></td>
                  <td>{new Date(f.created_at).toLocaleDateString()}</td>
                  <td>
                    <Button variant="warning" size="sm" className="me-2" onClick={() => this.handleUpdateOpen(f)}>
                      Update
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => this.handleDelete(f.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {/* Add Modal */}
        <Modal show={showAddModal} onHide={() => this.setState({ showAddModal: false })} centered>
          <Modal.Header closeButton><Modal.Title>Add Feedback</Modal.Title></Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Donor Name</Form.Label>
                <Form.Control type="text" name="donor_name" value={newFeedback.donor_name} onChange={(e) => this.handleChange(e)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Feedback</Form.Label>
                <Form.Control as="textarea" rows={3} name="feedback" value={newFeedback.feedback} onChange={(e) => this.handleChange(e)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Stars</Form.Label>
                <Form.Control type="number" name="stars" min={1} max={5} value={newFeedback.stars} onChange={(e) => this.handleChange(e)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Photo URL</Form.Label>
                <Form.Control type="text" name="image_url" value={newFeedback.image_url} onChange={(e) => this.handleChange(e)} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.setState({ showAddModal: false })}>Cancel</Button>
            <Button variant="success" onClick={this.handleAddSave}>Add</Button>
          </Modal.Footer>
        </Modal>

        {/* Update Modal */}
        <Modal show={showUpdateModal} onHide={() => this.setState({ showUpdateModal: false })} centered>
          <Modal.Header closeButton><Modal.Title>Update Feedback</Modal.Title></Modal.Header>
          <Modal.Body>
            {selectedFeedback && (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Donor Name</Form.Label>
                  <Form.Control type="text" name="donor_name" value={selectedFeedback.donor_name} onChange={(e) => this.handleChange(e, true)} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Feedback</Form.Label>
                  <Form.Control as="textarea" rows={3} name="feedback" value={selectedFeedback.feedback} onChange={(e) => this.handleChange(e, true)} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Stars</Form.Label>
                  <Form.Control type="number" name="stars" min={1} max={5} value={selectedFeedback.stars} onChange={(e) => this.handleChange(e, true)} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Photo URL</Form.Label>
                  <Form.Control type="text" name="image_url" value={selectedFeedback.image_url} onChange={(e) => this.handleChange(e, true)} />
                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.setState({ showUpdateModal: false })}>Cancel</Button>
            <Button variant="primary" onClick={this.handleUpdateSave}>Save</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }
}

import React, { Component } from 'react';
import axios from 'axios';
import { Container, Navbar, Nav, Button, Spinner, Table, Modal } from 'react-bootstrap';

const RESOURCES = {
  projects: { label: 'Projects', columns: ['id', 'title', 'category'] },
  news: { label: 'News & Articles', columns: ['id', 'title', 'category'] },
  donations: { label: 'Donations', columns: ['id', 'donor_name', 'amount'] },
  teams: { label: 'Our Teams', columns: ['id', 'name', 'role'] },
  feedbacks: { label: 'Donors Feedbacks', columns: ['id', 'donor_name', 'stars'] },
};

export default class RecycleTab extends Component {
  state = {
    active: 'projects',
    items: [],
    loading: false,
    showModal: false,
    modalType: '', // 'delete' or 'empty'
    deleteId: null,
  };

  baseUrl = 'http://localhost:8888/kudus/backend/recycle/recycle_CRUD.php';

  componentDidMount() { this.loadItems(); }

  loadItems = async () => {
    const { active } = this.state;
    this.setState({ loading: true });
    const res = await axios.get(`${this.baseUrl}?resource=${active}`);
    if (res.data.status === 'success') this.setState({ items: res.data.data });
    this.setState({ loading: false });
  };

  switchTab = (tab) => { this.setState({ active: tab, items: [] }, this.loadItems); };

  askDelete = (id) => this.setState({ showModal: true, modalType: 'delete', deleteId: id });
  askEmptyTrash = () => this.setState({ showModal: true, modalType: 'empty', deleteId: null });

  handleModalClose = () => this.setState({ showModal: false, modalType: '', deleteId: null });

  confirmDelete = async () => {
    const { deleteId, active } = this.state;
    await axios.delete(`${this.baseUrl}?resource=${active}&id=${deleteId}`);
    this.handleModalClose();
    this.loadItems();
  };

  confirmEmptyTrash = async () => {
    const { active } = this.state;
    await axios.delete(`${this.baseUrl}?resource=${active}&all=1`);
    this.handleModalClose();
    this.loadItems();
  };

  restoreItem = async (id) => {
    await axios.put(`${this.baseUrl}?resource=${this.state.active}&id=${id}`);
    this.loadItems();
  };

  render() {
    const { active, items, loading, showModal, modalType } = this.state;
    const { label, columns } = RESOURCES[active];
    return (
      <Container fluid className="p-3">
        <Navbar bg="light" className="mb-3">
          <Navbar.Brand>Recycle Bin</Navbar.Brand>
          <Nav activeKey={active} onSelect={this.switchTab} className="me-auto">
            {Object.entries(RESOURCES).map(([key, { label }]) => (
              <Nav.Link key={key} eventKey={key}>{label}</Nav.Link>
            ))}
          </Nav>
          <Button variant="danger" onClick={this.askEmptyTrash}>Empty Trash</Button>
        </Navbar>
        {loading ? <Spinner animation="border" /> : (
          <Table responsive bordered hover>
            <thead><tr>
              {columns.map(col => <th key={col}>{col.replace(/_/g, ' ')}</th>)}
              <th>Actions</th>
            </tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  {columns.map(col => <td key={col}>{item[col]}</td>)}
                  <td>
                    <Button
                      size="sm"
                      variant="success"
                      className="me-2"
                      onClick={() => this.restoreItem(item.id)}
                    >
                      Restore
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => this.askDelete(item.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <Modal show={showModal} onHide={this.handleModalClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {modalType === 'delete' ? 'Confirm Permanent Deletion' : 'Empty Trash?'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalType === 'delete'
              ? 'Are you sure you want to permanently delete this record? This cannot be undone.'
              : 'Are you sure you want to permanently delete ALL deleted items in this section? This cannot be undone!'}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleModalClose}>Cancel</Button>
            {modalType === 'delete'
              ? <Button variant="danger" onClick={this.confirmDelete}>Delete</Button>
              : <Button variant="danger" onClick={this.confirmEmptyTrash}>Empty Trash</Button>}
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }
}

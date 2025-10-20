import React, { Component } from "react";
import axios from "axios";
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
} from "react-bootstrap";

const LANGS = ["en", "tr", "ar"];

export default class OurTeamsTab extends Component {
  state = {
    teams: [],
    viewType: "list",
    viewLang: "en", // list/kanban görüntüleme dili
    editLang: "en", // kaydetme dili (params: { lang })
    showModal: false,
    addModal: false,
    selectedTeam: null,
    newTeam: {
      // Çok dilli alanlar
      en_name: "",
      tr_name: "",
      ar_name: "",
      en_role: "",
      tr_role: "",
      ar_role: "",
      en_address: "",
      tr_address: "",
      ar_address: "",
      en_bio: "",
      tr_bio: "",
      ar_bio: "",
      en_experience: "",
      tr_experience: "",
      ar_experience: "",

      // Ortak alanlar
      image_url: "",
      phone: "",
      email: "",
      facebook: "",
      linkedin: "",
      twitter: "",
      instagram: "",
      isDeleted: "0",
    },
    isLoading: false,
  };

  apiUrl = "http://kudushilali.org/backend/teams/teams_CRUD.php";

  componentDidMount() {
    this.fetchTeams();
  }

  fetchTeams = () => {
    this.setState({ isLoading: true });
    axios
      .get(this.apiUrl)
      .then((res) => {
        if (res.data?.status === "success") {
          this.setState({ teams: res.data.data ?? [], isLoading: false });
        } else {
          this.setState({ isLoading: false });
        }
      })
      .catch(() => this.setState({ isLoading: false }));
  };

  // --- Helpers ---
  getShown = (t, lang, key) => t?.[`${lang}_${key}`] ?? "";
  getImg = (t) => t?.image_url ?? t?.image ?? "";

  // Backend tekil alanlar bekliyor -> seçilen dile göre map et
  buildPayload = (team, lang) => ({
    name: team?.[`${lang}_name`] ?? "",
    role: team?.[`${lang}_role`] ?? "",
    address: team?.[`${lang}_address`] ?? "",
    bio: team?.[`${lang}_bio`] ?? "",
    experience: team?.[`${lang}_experience`] ?? "",
    image_url: team?.image_url ?? team?.image ?? "",
    phone: team?.phone ?? "",
    email: team?.email ?? "",
    facebook: team?.facebook ?? "",
    linkedin: team?.linkedin ?? "",
    twitter: team?.twitter ?? "",
    instagram: team?.instagram ?? "",
  });

  handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      this.setState({ isLoading: true });
      axios
        .delete(this.apiUrl, { params: { id, soft: 1 } })
        .then((res) => {
          if (res.data?.status === "success") this.fetchTeams();
          else this.setState({ isLoading: false });
        })
        .catch(() => this.setState({ isLoading: false }));
    }
  };

  handleUpdateOpen = (team) => {
    // Tekil alanlarla gelmişse EN'e mapleyip formu doldur
    const normalized = {
      ...team,
      en_name: team.en_name ?? team.name ?? "",
      en_role: team.en_role ?? team.role ?? "",
      en_address: team.en_address ?? team.address ?? "",
      en_bio: team.en_bio ?? team.bio ?? "",
      en_experience: team.en_experience ?? team.experience ?? "",
      image_url: team.image_url ?? team.image ?? "",
    };
    this.setState({ showModal: true, selectedTeam: normalized });
  };

  handleUpdateSave = async (saveAll = false) => {
    const { selectedTeam, editLang } = this.state;
    this.setState({ isLoading: true });
    const langsToSend = saveAll ? LANGS : [editLang];

    try {
      for (const lang of langsToSend) {
        const payload = { ...this.buildPayload(selectedTeam, lang), lang };
        await axios.put(`${this.apiUrl}?id=${selectedTeam.id}`, payload, {
          headers: { "Content-Type": "application/json" },
        });
      }
      this.setState({ showModal: false, selectedTeam: null });
      this.fetchTeams();
    } catch {
      this.setState({ isLoading: false });
    }
  };

  handleAddOpen = () => this.setState({ addModal: true });

  // Tüm diller için payload üret
  handleAddSave = async () => {
    const { newTeam } = this.state;
    this.setState({ isLoading: true });
    try {
      // İsteğe bağlı: sadece lazım alanları seç
      const payload = {
        // çok dilli alanlar
        en_name: newTeam.en_name,
        tr_name: newTeam.tr_name,
        ar_name: newTeam.ar_name,
        en_role: newTeam.en_role,
        tr_role: newTeam.tr_role,
        ar_role: newTeam.ar_role,
        en_address: newTeam.en_address,
        tr_address: newTeam.tr_address,
        ar_address: newTeam.ar_address,
        en_bio: newTeam.en_bio,
        tr_bio: newTeam.tr_bio,
        ar_bio: newTeam.ar_bio,
        en_experience: newTeam.en_experience,
        tr_experience: newTeam.tr_experience,
        ar_experience: newTeam.ar_experience,
        // ortak alanlar
        image_url: newTeam.image_url,
        phone: newTeam.phone,
        email: newTeam.email,
        facebook: newTeam.facebook,
        linkedin: newTeam.linkedin,
        twitter: newTeam.twitter,
        instagram: newTeam.instagram,
        isDeleted: "0",
      };

      await axios.post(this.apiUrl, payload, {
        headers: { "Content-Type": "application/json" },
      });

      this.setState({ addModal: false });
      this.fetchTeams();
    } catch (e) {
      console.error(e);
      this.setState({ isLoading: false });
    }
  };

  handleChange = ({ target: { name, value } }) => {
    const key = this.state.showModal ? "selectedTeam" : "newTeam";
    this.setState((prev) => ({ [key]: { ...prev[key], [name]: value } }));
  };

  switchView = (viewType) => this.setState({ viewType });

  render() {
    const {
      teams,
      viewType,
      viewLang,
      editLang,
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
            <Nav
              activeKey={viewType}
              onSelect={this.switchView}
              className="me-auto"
            >
              <Nav.Link eventKey="list">List</Nav.Link>
              <Nav.Link eventKey="kanban">Kanban</Nav.Link>
            </Nav>

            {/* Görüntüleme dili */}
            <Form.Select
              value={viewLang}
              onChange={(e) => this.setState({ viewLang: e.target.value })}
              className="w-auto me-2"
              aria-label="View language"
            >
              <option value="en">View: EN</option>
              <option value="tr">View: TR</option>
              <option value="ar">View: AR</option>
            </Form.Select>

            {/* Kaydetme dili */}
            <Form.Select
              value={editLang}
              onChange={(e) => this.setState({ editLang: e.target.value })}
              className="w-auto me-3"
              aria-label="Edit language"
            >
              <option value="en">Save Lang: EN</option>
              <option value="tr">Save Lang: TR</option>
              <option value="ar">Save Lang: AR</option>
            </Form.Select>

            <Button
              variant="success"
              onClick={this.handleAddOpen}
              className="mt-2 mt-md-0"
            >
              + Add Member
            </Button>
          </Navbar.Collapse>
        </Navbar>

        {isLoading ? (
          <div className="text-center my-5">
            <Spinner animation="border" />
          </div>
        ) : viewType === "list" ? (
          this.renderList(teams, viewLang)
        ) : (
          this.renderKanban(teams, viewLang)
        )}

        <Modal
          show={showModal}
          onHide={() => this.setState({ showModal: false })}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Update Member</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedTeam && this.renderForm(selectedTeam)}
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-between">
            <div>
              <Button
                variant="primary"
                onClick={() => this.handleUpdateSave(true)}
              >
                Save All
              </Button>
            </div>
            <Button
              variant="secondary"
              onClick={() => this.setState({ showModal: false })}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={addModal}
          onHide={() => this.setState({ addModal: false })}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Add New Member</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.renderForm(newTeam)}</Modal.Body>
          <Modal.Footer className="d-flex justify-content-between">
            <div>
              <Button variant="success" onClick={() => this.handleAddSave()}>
                Add
              </Button>
            </div>
            <Button
              variant="secondary"
              onClick={() => this.setState({ addModal: false })}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }

  renderList = (teams, viewLang) => (
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
        {teams
          .filter((t) => t.isDeleted !== "1")
          .map((t) => (
            <tr key={t.id}>
              <td>
                <Image
                  src={this.getImg(t)}
                  rounded
                  width={50}
                  height={50}
                  alt={this.getShown(t, viewLang, "name")}
                />
              </td>
              <td>{this.getShown(t, viewLang, "name")}</td>
              <td>{this.getShown(t, viewLang, "role")}</td>
              <td>{t.email}</td>
              <td>{t.phone}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2 mb-1"
                  onClick={() => this.handleUpdateOpen(t)}
                >
                  Update
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => this.handleDelete(t.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  );

  renderKanban = (teams, viewLang) => (
    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
      {teams
        .filter((t) => t.isDeleted !== "1")
        .map((t) => (
          <Col key={t.id}>
            <Card className="h-100 shadow-sm">
              <div className="ratio ratio-16x9">
                <Card.Img
                  src={this.getImg(t)}
                  alt={this.getShown(t, viewLang, "name")}
                  className="card-img-top"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <Card.Body>
                <Card.Title className="fs-5">
                  {this.getShown(t, viewLang, "name")}
                </Card.Title>
                <Card.Text className="mb-1">
                  Role: {this.getShown(t, viewLang, "role")}
                </Card.Text>
                <Card.Text className="mb-0">Email: {t.email}</Card.Text>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-between align-items-center">
                <div>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-1 mb-1"
                    onClick={() => this.handleUpdateOpen(t)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => this.handleDelete(t.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        ))}
    </Row>
  );

  renderForm = (t) => (
    <Form>
      {/* Ortak alanlar */}
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Photo URL</Form.Label>
            <Form.Control
              type="text"
              name="image_url"
              value={t.image_url ?? t.image ?? ""}
              onChange={this.handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Row>
            <Col xs={12}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={t.email ?? ""}
                  onChange={this.handleChange}
                />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={t.phone ?? ""}
                  onChange={this.handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* EN */}
      <h6 className="mt-2">English</h6>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>EN Name</Form.Label>
            <Form.Control
              type="text"
              name="en_name"
              value={t.en_name ?? ""}
              onChange={this.handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>EN Role</Form.Label>
            <Form.Control
              type="text"
              name="en_role"
              value={t.en_role ?? ""}
              onChange={this.handleChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-3">
        <Form.Label>EN Address</Form.Label>
        <Form.Control
          type="text"
          name="en_address"
          value={t.en_address ?? ""}
          onChange={this.handleChange}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>EN Bio</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          name="en_bio"
          value={t.en_bio ?? ""}
          onChange={this.handleChange}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>EN Experience</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          name="en_experience"
          value={t.en_experience ?? ""}
          onChange={this.handleChange}
        />
      </Form.Group>

      {/* TR */}
      <h6 className="mt-3">Türkçe</h6>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>TR Name</Form.Label>
            <Form.Control
              type="text"
              name="tr_name"
              value={t.tr_name ?? ""}
              onChange={this.handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>TR Role</Form.Label>
            <Form.Control
              type="text"
              name="tr_role"
              value={t.tr_role ?? ""}
              onChange={this.handleChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-3">
        <Form.Label>TR Address</Form.Label>
        <Form.Control
          type="text"
          name="tr_address"
          value={t.tr_address ?? ""}
          onChange={this.handleChange}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>TR Bio</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          name="tr_bio"
          value={t.tr_bio ?? ""}
          onChange={this.handleChange}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>TR Experience</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          name="tr_experience"
          value={t.tr_experience ?? ""}
          onChange={this.handleChange}
        />
      </Form.Group>

      {/* AR */}
      <h6 className="mt-3">العربية</h6>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>AR Name</Form.Label>
            <Form.Control
              type="text"
              name="ar_name"
              value={t.ar_name ?? ""}
              onChange={this.handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>AR Role</Form.Label>
            <Form.Control
              type="text"
              name="ar_role"
              value={t.ar_role ?? ""}
              onChange={this.handleChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-3">
        <Form.Label>AR Address</Form.Label>
        <Form.Control
          type="text"
          name="ar_address"
          value={t.ar_address ?? ""}
          onChange={this.handleChange}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>AR Bio</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          name="ar_bio"
          value={t.ar_bio ?? ""}
          onChange={this.handleChange}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>AR Experience</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          name="ar_experience"
          value={t.ar_experience ?? ""}
          onChange={this.handleChange}
        />
      </Form.Group>

      {/* Sosyal linkler */}
      <Row className="mt-2">
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Facebook</Form.Label>
            <Form.Control
              type="text"
              name="facebook"
              value={t.facebook ?? ""}
              onChange={this.handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>LinkedIn</Form.Label>
            <Form.Control
              type="text"
              name="linkedin"
              value={t.linkedin ?? ""}
              onChange={this.handleChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Twitter</Form.Label>
            <Form.Control
              type="text"
              name="twitter"
              value={t.twitter ?? ""}
              onChange={this.handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Instagram</Form.Label>
            <Form.Control
              type="text"
              name="instagram"
              value={t.instagram ?? ""}
              onChange={this.handleChange}
            />
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
}

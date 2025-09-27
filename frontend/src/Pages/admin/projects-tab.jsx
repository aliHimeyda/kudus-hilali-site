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
  Badge,
  Image,
} from "react-bootstrap";

const CATEGORY_OPTIONS_en = [
  "Relief & Food Aid",
  "Health & Medical Support",
  "Shelter & Emergency Response",
  "Education & Community Development",
  "Economic & Social Support",
];
const CATEGORY_OPTIONS_ar = [
  "الإغاثة والمساعدات الغذائية",
  "الصحة والدعم الطبي",
  "المأوى والاستجابة الطارئة",
  "التعليم والتنمية المجتمعية",
  "الدعم الاقتصادي والاجتماعي",
];
const CATEGORY_OPTIONS_tr = [
  "Yardım & Gıda Desteği",
  "Sağlık & Tıbbi Destek",
  "Barınma & Acil Müdahale",
  "Eğitim & Toplumsal Gelişim",
  "Ekonomik & Sosyal Destek",
];

const LANGS = ["en", "tr", "ar"];

export default class ProjectsTab extends Component {
  state = {
    projects: [],
    viewType: "list",
    viewLang: "en", // list/kanban'da hangi dil gösterilecek
    editLang: "en", // form kaydında hangi dil gönderilecek
    showModal: false,
    addModal: false,
    selectedProject: null,
    newProject: {
      // Çok dilli alanlar
      en_title: "",
      tr_title: "",
      ar_title: "",
      en_explanation: "",
      tr_explanation: "",
      ar_explanation: "",
      en_mission: "",
      tr_mission: "",
      ar_mission: "",
      en_objective: "",
      tr_objective: "",
      ar_objective: "",
      en_category: "",
      tr_category: "",
      ar_category: "",
      // Ortak alanlar
      image: "",
      raised_amount: 0,
      goal_amount: 0,
      status: "active",
    },
    isLoading: false,
  };

  apiUrl = "http://kudushilali.org/backend/projects/projects_CRUD.php";

  componentDidMount() {
    this.fetchProjects();
  }

  fetchProjects = () => {
    this.setState({ isLoading: true });
    axios
      .get(this.apiUrl)
      .then((res) => {
        if (res.data?.status === "success") {
          this.setState({ projects: res.data.data ?? [], isLoading: false });
        } else {
          this.setState({ isLoading: false });
        }
      })
      .catch(() => this.setState({ isLoading: false }));
  };

  // Yardımcılar
  getShown = (p, viewLang, key) => p?.[`${viewLang}_${key}`] ?? "";
  getRaised = (p) => p?.raised_amount ?? p?.raised ?? 0;
  getGoal = (p) => p?.goal_amount ?? p?.goal ?? 0;

  // Backend'in beklediği gövdeyi seçili dile göre kur
  buildPayload = (project, lang) => ({
    title: project?.[`${lang}_title`] ?? "",
    explanation: project?.[`${lang}_explanation`] ?? "",
    mission: project?.[`${lang}_mission`] ?? "",
    objective: project?.[`${lang}_objective`] ?? "",
    category: project?.[`${lang}_category`] ?? "",
    image: project?.image ?? "",
    // iki isim de desteklensin
    raised: project?.raised_amount ?? project?.raised ?? 0,
    goal: project?.goal_amount ?? project?.goal ?? 0,
    status: project?.status ?? "active",
  });

  handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      this.setState({ isLoading: true });
      axios
        .delete(this.apiUrl, { params: { id, soft: 1 } })
        .then((res) => {
          if (res.data?.status === "success") this.fetchProjects();
          else this.setState({ isLoading: false });
        })
        .catch(() => this.setState({ isLoading: false }));
    }
  };

  handleUpdateOpen = (project) => {
    // Sunucudan gelen isimler newProject şemasına uysun diye normalize et
    const normalized = {
      ...project,
      // title vb. tekil gelmişse en_*'e koy
      en_title: project.en_title ?? project.title ?? "",
      en_explanation: project.en_explanation ?? project.explanation ?? "",
      en_mission: project.en_mission ?? project.mission ?? "",
      en_objective: project.en_objective ?? project.objective ?? "",
      en_category: project.en_category ?? project.category ?? "",
      raised_amount: this.getRaised(project),
      goal_amount: this.getGoal(project),
    };
    this.setState({ showModal: true, selectedProject: normalized });
  };

  handleUpdateSave = async (saveAll = false) => {
    const { selectedProject, editLang } = this.state;
    this.setState({ isLoading: true });

    const langsToSend = saveAll ? LANGS : [editLang];

    try {
      for (const lang of langsToSend) {
        const payload = this.buildPayload(selectedProject, lang);
        // PUT + lang paramı
        // Not: backend id'yi query'den alıyor
        await axios.put(`${this.apiUrl}?id=${selectedProject.id}`, payload, {
          headers: { "Content-Type": "application/json" },
          params: { lang },
        });
      }
      this.setState({ showModal: false, selectedProject: null });
      this.fetchProjects();
    } catch {
      this.setState({ isLoading: false });
    }
  };

  handleAddOpen = () => this.setState({ addModal: true });
  handleAddSave = async () => {
    const { newProject } = this.state; // düz flat state
    this.setState({ isLoading: true });
    try {
      await axios.post(this.apiUrl, newProject, {
        headers: { "Content-Type": "application/json" },
      });
      this.setState({ addModal: false });
      this.fetchProjects();
    } catch (e) {
      console.error(e);
      this.setState({ isLoading: false });
    }
  };

  handleChange = ({ target: { name, value } }) => {
    const key = this.state.showModal ? "selectedProject" : "newProject";
    this.setState((prev) => ({
      [key]: { ...prev[key], [name]: value },
    }));
  };

  switchView = (viewType) => this.setState({ viewType });

  render() {
    const {
      projects,
      viewType,
      viewLang,
      editLang,
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
              + Add Project
            </Button>
          </Navbar.Collapse>
        </Navbar>

        {isLoading ? (
          <div className="text-center my-5">
            <Spinner animation="border" />
          </div>
        ) : viewType === "list" ? (
          this.renderList(projects, viewLang)
        ) : (
          this.renderKanban(projects, viewLang)
        )}

        <Modal
          show={showModal}
          onHide={() => this.setState({ showModal: false })}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Update Project</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedProject && this.renderForm(selectedProject)}
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-between">
            <div>
              <Button
                variant="outline-primary"
                onClick={() => this.handleUpdateSave(false)}
                className="me-2"
              >
                Save (Current Lang)
              </Button>
              <Button
                variant="primary"
                onClick={() => this.handleUpdateSave(true)}
              >
                Save All Languages
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
            <Modal.Title>Add New Project</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.renderForm(newProject)}</Modal.Body>
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

  renderList = (projects, viewLang) => (
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
          .filter((p) => p.isDeleted !== "1")
          .map((p) => (
            <tr key={p.id}>
              <td>
                <Image
                  src={p.image}
                  rounded
                  width={50}
                  height={50}
                  alt={this.getShown(p, viewLang, "title")}
                />
              </td>
              <td>{this.getShown(p, viewLang, "title")}</td>
              <td>{this.getShown(p, viewLang, "category")}</td>
              <td>
                ${this.getRaised(p)} / ${this.getGoal(p)}
              </td>
              <td>
                <Badge bg={p.status === "active" ? "success" : "secondary"}>
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
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => this.handleDelete(p.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  );

  renderKanban = (projects, viewLang) => (
    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
      {projects
        .filter((p) => p.isDeleted !== "1")
        .map((p) => (
          <Col key={p.id}>
            <Card className="h-100 shadow-sm">
              <div className="ratio ratio-16x9">
                <Card.Img
                  src={p.image}
                  alt={this.getShown(p, viewLang, "title")}
                  className="card-img-top"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <Card.Body>
                <Card.Title className="fs-5">
                  {this.getShown(p, viewLang, "title")}
                </Card.Title>
                <Card.Text className="mb-1">
                  Category: {this.getShown(p, viewLang, "category")}
                </Card.Text>
                <Card.Text className="mb-0">
                  Raised: ${this.getRaised(p)} / ${this.getGoal(p)}
                </Card.Text>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-between align-items-center">
                <Badge bg={p.status === "active" ? "success" : "secondary"}>
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
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => this.handleDelete(p.id)}
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

  renderForm = (project) => (
    <Form>
      <Row>
        <Col xs={6} md={3}>
          <Form.Group className="mb-3">
            <Form.Label>Raised ($)</Form.Label>
            <Form.Control
              type="number"
              name={
                project.raised_amount !== undefined
                  ? "raised_amount"
                  : "raised_amount"
              }
              value={project.raised_amount ?? project.raised ?? 0}
              onChange={this.handleChange}
            />
          </Form.Group>
        </Col>
        <Col xs={6} md={3}>
          <Form.Group className="mb-3">
            <Form.Label>Goal ($)</Form.Label>
            <Form.Control
              type="number"
              name={
                project.goal_amount !== undefined
                  ? "goal_amount"
                  : "goal_amount"
              }
              value={project.goal_amount ?? project.goal ?? 0}
              onChange={this.handleChange}
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="text"
              name="image"
              value={project.image ?? ""}
              onChange={this.handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* EN */}
      <h6 className="mt-2">English</h6>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>EN Title</Form.Label>
            <Form.Control
              type="text"
              name="en_title"
              value={project.en_title ?? ""}
              onChange={this.handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>EN Category</Form.Label>
            <Form.Select
              name="en_category"
              value={project.en_category ?? ""}
              onChange={this.handleChange}
            >
              <option value="">Select category</option>
              {CATEGORY_OPTIONS_en.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-3">
        <Form.Label>EN Explanation</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          name="en_explanation"
          value={project.en_explanation ?? ""}
          onChange={this.handleChange}
        />
      </Form.Group>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>EN Mission</Form.Label>
            <Form.Control
              as="textarea"
              rows={1}
              name="en_mission"
              value={project.en_mission ?? ""}
              onChange={this.handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>EN Objective</Form.Label>
            <Form.Control
              as="textarea"
              rows={1}
              name="en_objective"
              value={project.en_objective ?? ""}
              onChange={this.handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* TR */}
      <h6 className="mt-3">Türkçe</h6>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>TR Title</Form.Label>
            <Form.Control
              type="text"
              name="tr_title"
              value={project.tr_title ?? ""}
              onChange={this.handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>TR Category</Form.Label>
            <Form.Select
              name="tr_category"
              value={project.tr_category ?? ""}
              onChange={this.handleChange}
            >
              <option value="">Kategori sec</option>
              {CATEGORY_OPTIONS_tr.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-3">
        <Form.Label>TR Explanation</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          name="tr_explanation"
          value={project.tr_explanation ?? ""}
          onChange={this.handleChange}
        />
      </Form.Group>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>TR Mission</Form.Label>
            <Form.Control
              as="textarea"
              rows={1}
              name="tr_mission"
              value={project.tr_mission ?? ""}
              onChange={this.handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>TR Objective</Form.Label>
            <Form.Control
              as="textarea"
              rows={1}
              name="tr_objective"
              value={project.tr_objective ?? ""}
              onChange={this.handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* AR */}
      <h6 className="mt-3">العربية</h6>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>AR Title</Form.Label>
            <Form.Control
              type="text"
              name="ar_title"
              value={project.ar_title ?? ""}
              onChange={this.handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>AR Category</Form.Label>
            <Form.Select
              name="ar_category"
              value={project.ar_category ?? ""}
              onChange={this.handleChange}
            >
              <option value="">اختر فئة</option>
              {CATEGORY_OPTIONS_ar.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-3">
        <Form.Label>AR Explanation</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          name="ar_explanation"
          value={project.ar_explanation ?? ""}
          onChange={this.handleChange}
        />
      </Form.Group>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>AR Mission</Form.Label>
            <Form.Control
              as="textarea"
              rows={1}
              name="ar_mission"
              value={project.ar_mission ?? ""}
              onChange={this.handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>AR Objective</Form.Label>
            <Form.Control
              as="textarea"
              rows={1}
              name="ar_objective"
              value={project.ar_objective ?? ""}
              onChange={this.handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Status</Form.Label>
        <Form.Select
          name="status"
          value={project.status ?? "active"}
          onChange={this.handleChange}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Form.Select>
      </Form.Group>
    </Form>
  );
}

import React, { Component, useEffect, useRef } from "react";
import axios from "axios";
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
} from "react-bootstrap";

/* ---------- Simple contenteditable editor ---------- */
const ContentEditor = ({ value, onChange }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (
      ref.current &&
      typeof value === "string" &&
      value !== ref.current.innerHTML
    ) {
      ref.current.innerHTML = value || "";
    }
  }, [value]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const h = () => onChange?.(el.innerHTML);
    el.addEventListener("input", h);
    return () => el.removeEventListener("input", h);
  }, [onChange]);
  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      className="form-control"
      style={{ minHeight: 140, overflow: "auto" }}
      onBlur={() => onChange?.(ref.current?.innerHTML || "")}
    />
  );
};

const LANGS = ["en", "tr", "ar"];

export default class NewsTab extends Component {
  IMAGE_BASE = "http://kudushilali.org/backend/news/";
  apiUrl = "http://kudushilali.org/backend/news/news_CRUD.php";

  state = {
    newsList: [],
    isLoading: false,
    viewType: "list",
    viewLang: "en", // list/kanban'da gösterilecek dil
    editLang: "en", // kaydederken kullanılacak dil (params: { lang })
    showAddModal: false,
    showUpdateModal: false,
    newNews: this.emptyNews(),
    selectedNews: null,
  };

  emptyNews() {
    return {
      // Çok dilli alanlar
      en_title: "",
      tr_title: "",
      ar_title: "",
      en_content: "",
      tr_content: "",
      ar_content: "",
      en_category: "",
      tr_category: "",
      ar_category: "",
      en_admin_name: "",
      ar_admin_name: "",
      // Ortak alanlar
      admin_image: "",
      image_url: "",
      publish_date: "",
    };
  }

  componentDidMount() {
    this.fetchNews();
  }

  /* -------- API -------- */
  fetchNews = () => {
    this.setState({ isLoading: true });
    axios
      .get(this.apiUrl)
      .then((res) => {
        if (res.data?.status === "success") {
          this.setState({ newsList: res.data.data || [], isLoading: false });
        } else {
          this.setState({
            newsList: Array.isArray(res.data) ? res.data : [],
            isLoading: false,
          });
        }
      })
      .catch(() => this.setState({ isLoading: false }));
  };

  // Tekil gövdeyi seçili dile göre kur
  buildPayload = (item, lang) => ({
    title: item?.[`${lang}_title`] ?? "",
    content: item?.[`${lang}_content`] ?? "",
    category: item?.[`${lang}_category`] ?? "",
    admin_name: item?.[`${lang}_admin_name`] ?? "",
    admin_image: item?.admin_image ?? "",
    image_url: item?.image_url ?? "",
    publish_date: item?.publish_date ?? "",
  });

  handleAddOpen = () =>
    this.setState({ showAddModal: true, newNews: this.emptyNews() });

  handleAddSave = async () => {
    const { newNews } = this.state;
    this.setState({ isLoading: true });
    try {
      const payload = {
        // çok dilli alanlar
        en_title: newNews.en_title,
        tr_title: newNews.tr_title,
        ar_title: newNews.ar_title,
        en_content: newNews.en_content,
        tr_content: newNews.tr_content,
        ar_content: newNews.ar_content,
        en_category: newNews.en_category,
        tr_category: newNews.tr_category,
        ar_category: newNews.ar_category,
        en_admin_name: newNews.en_admin_name, // şemada tr_admin_name yok
        ar_admin_name: newNews.ar_admin_name,

        // ortak alanlar
        admin_image: newNews.admin_image,
        image_url: newNews.image_url,
        publish_date: newNews.publish_date, // 'YYYY-MM-DD' veya ISO
        isDeleted: "0",
      };

      await axios.post(this.apiUrl, payload, {
        headers: { "Content-Type": "application/json" },
      });

      this.setState({ showAddModal: false });
      this.fetchNews();
    } catch (e) {
      console.error(e);
      this.setState({ isLoading: false });
    }
  };

  handleUpdateOpen = (n) => {
    // Tekil alanlarla gelmişse EN'e yazıp formu dolduralım (gerisi varsa kullanılır)
    const normalized = {
      ...n,
      en_title: n.en_title ?? n.title ?? "",
      en_content: n.en_content ?? n.content ?? "",
      en_category: n.en_category ?? n.category ?? "",
      en_admin_name: n.en_admin_name ?? n.admin_name ?? "",
    };
    this.setState({ showUpdateModal: true, selectedNews: normalized });
  };

  handleUpdateSave = async (all = false) => {
    const { selectedNews, editLang } = this.state;
    if (!selectedNews?.id) return;
    this.setState({ isLoading: true });
    const langs = all ? LANGS : [editLang];
    try {
      for (const lang of langs) {
        const payload = this.buildPayload(selectedNews, lang);
        await axios.put(`${this.apiUrl}?id=${selectedNews.id}`, payload, {
          headers: { "Content-Type": "application/json" },
          params: { lang },
        });
      }
      this.setState({ showUpdateModal: false, selectedNews: null });
      this.fetchNews();
    } catch {
      this.setState({ isLoading: false });
    }
  };

  handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this news item?"))
      return;
    this.setState({ isLoading: true });
    axios
      .delete(this.apiUrl, { params: { id, soft: 1 } })
      .then((res) => {
        if (res.data?.status === "success") this.fetchNews();
        else this.setState({ isLoading: false });
      })
      .catch(() => this.setState({ isLoading: false }));
  };

  /* -------- UI helpers -------- */
  switchView = (viewType) => this.setState({ viewType });
  handleChange = ({ target: { name, value } }, update = false) => {
    const key = update ? "selectedNews" : "newNews";
    this.setState((prev) => ({ [key]: { ...prev[key], [name]: value } }));
  };
  shown = (n, lang, key) => n?.[`${lang}_${key}`] ?? "";

  render() {
    const {
      newsList,
      isLoading,
      viewType,
      viewLang,
      editLang,
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
              + Add News
            </Button>
          </Navbar.Collapse>
        </Navbar>

        {isLoading ? (
          <div className="text-center my-5">
            <Spinner animation="border" />
          </div>
        ) : viewType === "list" ? (
          this.renderList(newsList, viewLang)
        ) : (
          this.renderKanban(newsList, viewLang)
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
          <Modal.Footer className="d-flex justify-content-between">
            <div>
              <Button
                variant="success"
                onClick={() => this.handleAddSave(true)}
              >
                Add
              </Button>
            </div>
            <Button
              variant="secondary"
              onClick={() => this.setState({ showAddModal: false })}
            >
              Cancel
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
              onClick={() => this.setState({ showUpdateModal: false })}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }

  /* -------- render helpers -------- */
  renderList = (list, viewLang) => (
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
          .filter((n) => n.isDeleted !== "1")
          .map((n) => {
            const imgPath = n.image_url;
            const src = imgPath
              ? imgPath.startsWith("http")
                ? imgPath
                : this.IMAGE_BASE + imgPath
              : "";
            return (
              <tr key={n.id}>
                <td>
                  {src ? (
                    <Image
                      src={src}
                      thumbnail
                      width={60}
                      height={60}
                      alt={this.shown(n, viewLang, "title")}
                    />
                  ) : (
                    <Badge bg="light" text="dark">
                      No image
                    </Badge>
                  )}
                </td>
                <td>{this.shown(n, viewLang, "title")}</td>
                <td>{this.shown(n, viewLang, "category")}</td>
                <td>{this.shown(n, viewLang, "admin_name")}</td>
                <td>
                  {n.publish_date
                    ? new Date(n.publish_date).toLocaleDateString()
                    : "-"}
                </td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => this.handleUpdateOpen(n)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => this.handleDelete(n.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            );
          })}
      </tbody>
    </Table>
  );

  renderKanban = (list, viewLang) => (
    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
      {list
        .filter((n) => n.isDeleted !== "1")
        .map((n) => {
          const imgPath = n.image_url;
          const src = imgPath
            ? imgPath.startsWith("http")
              ? imgPath
              : this.IMAGE_BASE + imgPath
            : "";
          return (
            <Col key={n.id}>
              <Card className="h-100 shadow-sm">
                {src ? (
                  <Card.Img
                    variant="top"
                    src={src}
                    alt={this.shown(n, viewLang, "title")}
                    style={{ height: 180, objectFit: "cover" }}
                  />
                ) : null}
                <Card.Body>
                  <Card.Title className="fs-5">
                    {this.shown(n, viewLang, "title")}
                  </Card.Title>
                  <Card.Text className="mb-1">
                    Category: {this.shown(n, viewLang, "category")}
                  </Card.Text>
                  <Card.Text className="mb-1">
                    Author: {this.shown(n, viewLang, "admin_name")}
                  </Card.Text>
                  <Card.Text className="mb-0">
                    Date:{" "}
                    {n.publish_date
                      ? new Date(n.publish_date).toLocaleDateString()
                      : "-"}
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
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => this.handleDelete(n.id)}
                    >
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

  renderForm = (d, update = false) => {
    const CATEGORY_OPTIONS_EN = [
      "Projects & Initiatives",
      "Impact Stories",
      "Events & Campaigns",
      "Research & Insights",
      "Organizational Updates",
    ];
    const CATEGORY_OPTIONS_ar = [
      "المشاريع والمبادرات",
      "قصص الأثر",
      "الفعاليات والحملات",
      "الأبحاث والرؤى",
      "تحديثات المؤسسة",
    ];
    const CATEGORY_OPTIONS_tr = [
      "Projeler & Girişimler",
      "Etkileyici Hikayeler",
      "Etkinlikler & Kampanyalar",
      "Araştırmalar & Analizler",
      "Kurumsal Güncellemeler",
    ];

    return (
      <Form>
        {/* Ortak alanlar */}
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Cover Image URL</Form.Label>
              <Form.Control
                type="text"
                name="image_url"
                value={d.image_url || ""}
                onChange={(e) => this.handleChange(e, update)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Author Image URL</Form.Label>
              <Form.Control
                type="text"
                name="admin_image"
                value={d.admin_image || ""}
                onChange={(e) => this.handleChange(e, update)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Publish Date</Form.Label>
          <Form.Control
            type="date"
            name="publish_date"
            value={d.publish_date?.toString().split("T")[0] || ""}
            onChange={(e) => this.handleChange(e, update)}
          />
        </Form.Group>

        {/* EN */}
        <h6 className="mt-2">English</h6>
        <Form.Group className="mb-3">
          <Form.Label>EN Title</Form.Label>
          <Form.Control
            type="text"
            name="en_title"
            value={d.en_title || ""}
            onChange={(e) => this.handleChange(e, update)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>EN Content</Form.Label>
          <ContentEditor
            value={d.en_content || ""}
            onChange={(html) =>
              this.handleChange(
                { target: { name: "en_content", value: html } },
                update
              )
            }
          />
        </Form.Group>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>EN Category</Form.Label>
              <Form.Select
                name="en_category"
                value={d.en_category || ""}
                onChange={(e) => this.handleChange(e, update)}
              >
                <option value="">Select a category</option>
                {CATEGORY_OPTIONS_EN.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>EN Author Name</Form.Label>
              <Form.Control
                type="text"
                name="en_admin_name"
                value={d.en_admin_name || ""}
                onChange={(e) => this.handleChange(e, update)}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* TR */}
        <h6 className="mt-3">Türkçe</h6>
        <Form.Group className="mb-3">
          <Form.Label>TR Title</Form.Label>
          <Form.Control
            type="text"
            name="tr_title"
            value={d.tr_title || ""}
            onChange={(e) => this.handleChange(e, update)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>TR Content</Form.Label>
          <ContentEditor
            value={d.tr_content || ""}
            onChange={(html) =>
              this.handleChange(
                { target: { name: "tr_content", value: html } },
                update
              )
            }
          />
        </Form.Group>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>TR Category</Form.Label>
              <Form.Select
                name="tr_category"
                value={d.tr_category || ""}
                onChange={(e) => this.handleChange(e, update)}
              >
                <option value="">Kategori seçin</option>
                {CATEGORY_OPTIONS_tr.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>TR Author Name</Form.Label>
              <Form.Control
                type="text"
                name="tr_admin_name"
                value={d.tr_admin_name || ""}
                onChange={(e) => this.handleChange(e, update)}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* AR */}
        <h6 className="mt-3">العربية</h6>
        <Form.Group className="mb-3">
          <Form.Label>AR Title</Form.Label>
          <Form.Control
            type="text"
            name="ar_title"
            value={d.ar_title || ""}
            onChange={(e) => this.handleChange(e, update)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>AR Content</Form.Label>
          <ContentEditor
            value={d.ar_content || ""}
            onChange={(html) =>
              this.handleChange(
                { target: { name: "ar_content", value: html } },
                update
              )
            }
          />
        </Form.Group>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>AR Category</Form.Label>
              <Form.Select
                name="ar_category"
                value={d.ar_category || ""}
                onChange={(e) => this.handleChange(e, update)}
                dir="rtl"
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
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>AR Author Name</Form.Label>
              <Form.Control
                type="text"
                name="ar_admin_name"
                value={d.ar_admin_name || ""}
                onChange={(e) => this.handleChange(e, update)}
                dir="rtl"
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
    );
  };
}

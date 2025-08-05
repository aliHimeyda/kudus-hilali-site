import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './admin.css';
import ProjectsTab from './projects-tab';
import OurTeamsTab from './our-teams-tab';
import NewsTab from './news-tab';
import DonationsTab from './donations-tab';
import FeedbacksTab from './feedbacks-tab';
import RecycleTab from './recycle-tab';

export default class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = { activeTab: 'projects' };
  }

  handleTabChange = (tab) => {
    this.setState({ activeTab: tab });
  };

  renderContent() {
    const { activeTab } = this.state;
    switch (activeTab) {
      case 'projects':
        return <ProjectsTab />;
      case 'teams':
        return <OurTeamsTab />;
      case 'news':
        return <NewsTab />;
      case 'donations':
        return <DonationsTab />;
      case 'feedbacks':
        return <FeedbacksTab />;
      case 'recycle':
        return <RecycleTab />;
      default:
        return <div className="card p-4">Welcome to Admin Panel</div>;
    }
  }

  render() {
    const { activeTab } = this.state;
    return (
      <div className="admin-container d-flex flex-row">
        <div className="sidebar bg-light p-3" style={{ minWidth: '200px' }}>
          <h4 className="fw-bold mb-4">Admin Panel</h4>
          <ul className="nav flex-column">
            <li className={`nav-item mb-2 ${activeTab === 'projects' ? 'active' : ''}`}>
              <button
                className="nav-link btn text-start"
                onClick={() => this.handleTabChange('projects')}
              >
                <i className="bi bi-kanban me-2"></i>Projects
              </button>
            </li>
            <li className={`nav-item mb-2 ${activeTab === 'teams' ? 'active' : ''}`}>
              <button
                className="nav-link btn text-start"
                onClick={() => this.handleTabChange('teams')}
              >
                <i className="bi bi-people me-2"></i>Our Teams
              </button>
            </li>
            <li className={`nav-item mb-2 ${activeTab === 'news' ? 'active' : ''}`}>
              <button
                className="nav-link btn text-start"
                onClick={() => this.handleTabChange('news')}
              >
                <i className="bi bi-newspaper me-2"></i>News & Articles
              </button>
            </li>
            <li className={`nav-item mb-2 ${activeTab === 'donations' ? 'active' : ''}`}>
              <button
                className="nav-link btn text-start"
                onClick={() => this.handleTabChange('donations')}
              >
                <i className="bi bi-cash-stack me-2"></i>Donations
              </button>
            </li>
            <li className={`nav-item mb-2 ${activeTab === 'feedbacks' ? 'active' : ''}`}>
              <button
                className="nav-link btn text-start"
                onClick={() => this.handleTabChange('feedbacks')}
              >
                <i className="bi bi-chat-dots me-2"></i>Donors Feedbacks
              </button>
            </li>
            <li className={`nav-item ${activeTab === 'recycle' ? 'active' : ''}`}>
              <button
                className="nav-link btn text-start"
                onClick={() => this.handleTabChange('recycle')}
              >
                <i className="bi bi-trash me-2"></i>Recycle Bin
              </button>
            </li>
          </ul>
        </div>

        <div className="content flex-fill p-3">
          {this.renderContent()}
        </div>
      </div>
    );
  }
}

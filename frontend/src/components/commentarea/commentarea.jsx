import React, { useState } from 'react';
import './commentarea.css'; // External CSS file
import { useTranslation } from 'react-i18next';

const defaultComments = [
  {
    name: 'Joe Doe',
    date: 'February 16, 2024 at 6:53 am',
    text: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`
  },
  {
    name: 'Jane Cooper',
    date: 'February 16, 2024 at 6:53 am',
    text: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`
  },
  {
    name: 'Annette Black',
    date: 'February 16, 2024 at 6:53 am',
    text: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`
  }
];

const Comments = () => {
  const { t } = useTranslation();
  const [comments, setComments] = useState(defaultComments);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    // Burada veritabanina veri gonderme islemleri yapilacak
    console.log({ name, email, message });
    // Yorum temizle
    setName('');
    setEmail('');
    setMessage('');
  };

 return (
  <div className="comments-wrapper">
    <h2 className="comments-title">
      ({comments.length}) {t("comments_title")}
    </h2>
    {comments.map((comment, index) => (
      <div className="comment-box" key={index}>
        <div className="avatar" />
        <div className="comment-content">
          <span className="comment-name">{comment.name}</span>
          <span className="comment-date">{comment.date}</span>
          <p className="comment-text">{comment.text}</p>
        </div>
      </div>
    ))}

    <div className="post-comment-wrapper">
      <h3 className="post-comment-title">{t("post_comment_title")}</h3>
      <div className="input-row">
        <input
          type="text"
          placeholder={t("input_name")}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder={t("input_email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <textarea
        placeholder={t("input_message")}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>
      <button className="submit-btn" onClick={handleSubmit}>
        {t("submit_button")}
      </button>
    </div>
  </div>
);

};

export default Comments;

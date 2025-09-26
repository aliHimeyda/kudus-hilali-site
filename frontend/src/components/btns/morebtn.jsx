
import { useTranslation } from 'react-i18next';
import   './morebtn.css';
import { useNavigate } from "react-router-dom";

const Morebtn=({title,path})=>{
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path);
  };
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  return (
    <button
      className="btn btn-danger custom-red-btn d-inline-flex align-items-center gap-2 px-4 py-2 mt-4"
      onClick={handleClick}
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      {isAr ? (
        <>
          <span className="arrow">←</span>
          {title}
        </>
      ) : (
        <>
          {title}
          <span className="arrow">→</span>
        </>
      )}
    </button>
  );

}

export default Morebtn;

import react from "react";
import   './morebtn.css';
import { useNavigate } from "react-router-dom";

const Morebtn=({title,path})=>{
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path);
  };
return(
    <button className="btn btn-danger custom-red-btn d-inline-flex align-items-center gap-2 px-4 py-2 mt-4" onClick={handleClick}>
     {title}
      <span className="arrow">→</span>
    </button>
);

}

export default Morebtn;

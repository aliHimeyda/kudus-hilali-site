import react from "react";
import './allsbtn.css'
import { useNavigate } from "react-router-dom";

const Allsbtn = ({title,path})=>{
    const navigate = useNavigate();

  const handleClick = () => {
    navigate(path);
  };
return (
   <div className="d-flex justify-content-center">
   <button className="allteambtn mt-4" onClick={handleClick}>
       {title}
      </button>
      </div>
);
}

export default Allsbtn
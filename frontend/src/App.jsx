import { useEffect,  useState } from "react";
import "./App.css";
import MyRouter from "./router/router";
import CustomCursor from "./components/mousesicon/mousesicon";

function App() {


  return (
    <div>
     <CustomCursor />
      <MyRouter />
    </div>
  );
}

export default App;

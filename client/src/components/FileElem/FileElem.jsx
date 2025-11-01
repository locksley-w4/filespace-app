import React, { useEffect, useState } from "react";
import "./FileElem.css";
import MyButton from "../ui/Button/MyButton";

export default function FileElem(props) {
  const [file, setFile] = useState({});

  useEffect(() => {
    setFile(props.data);
  }, [props.data]);

  
  async function handleClick (e) {
    
  }
  
  if (!file) {
    return (
      <li>Data is loading...</li>
    );
  }

  return (
    <li key={file.fileID} className="FileElem" {...props}>
      <h3>{file.name}</h3>
      <span>{file.size} {file.sizeMetric}</span>
      <MyButton onClick={handleClick}>View</MyButton>
    </li>
  );
}

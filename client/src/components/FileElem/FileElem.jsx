import React, { useEffect, useState } from "react";
import "./FileElem.css";
import MyButton from "../ui/Button/MyButton";

export default function FileElem(props) {
  const [file, setFile] = useState({});

  useEffect(() => {
    setFile(props.data);
  }, [props.data]);

  if (!file) {
    return (
      <li>Data is loading...</li>
    );
  }

  return (
    <li key={file.fileID} className="FileElem" {...props}>
      <h3 className="file_name">{file.name}</h3>
      <MyButton>View</MyButton>
    </li>
  );
}

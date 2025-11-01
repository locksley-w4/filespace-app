import React, { useEffect, useState } from "react";
import "./FileElem.css";
import MyButton from "../ui/Button/MyButton";
import { api } from "../../api/api";

export default function FileElem({ handleViewDetails, ...props }) {
  const [file, setFile] = useState({});

  useEffect(() => {
    setFile(props.data);
  }, [props.data]);

  async function handleClick(e) {
    try {
      const { data } = await api.get(`/file/contents/${file.fileID}`);
      file.content = data.content ?? "File is empty.";
      handleViewDetails(e, file);
    } catch (error) {
      alert(error.status === 404 ? "File does not exist on the server" : error.message)
      console.error(error);
    }
  }

  if (!file) {
    return <li>Data is loading...</li>;
  }

  return (
    <li key={file.fileID} className="FileElem" {...props}>
      <h4>{file.originalName}</h4>
      <span>
        {file.size} {file.sizeMetric}
      </span>
      <MyButton onClick={handleClick}>View</MyButton>
    </li>
  );
}

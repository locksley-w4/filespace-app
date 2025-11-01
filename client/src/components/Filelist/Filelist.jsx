import React, { useActionState, useContext, useEffect, useState } from "react";
import FileElem from "../FileElem/FileElem";
import MyButton from "../ui/Button/MyButton";
import "./Filelist.css";
import { FileContext } from "../../context/FileContext/FileContextProvider";
import Modal from "../ui/Modal/Modal";
import FileUploadModal from "../FileUploadModal/FileUploadModal";
import FileDetailsModal from "../FileManageModal/FileDetailsModal";

function Filelist(props) {
  const { fileList, loadError } = useContext(FileContext);
  const [isUploadVisible, setIsUploadVisible] = useState(false);
  const [isFiledataVisible, setIsFiledataVisible] = useState(false);
  const [activeFile, setActiveFile] = useState(null);
  // const

  // useEffect(() => {
  //   fetchFiles?.()
  // }, [])

  function handleUploadClick(e) {
    setIsUploadVisible((prev) => !prev);
  }

  function handleViewDetails(e, _activeFile) {
    setIsFiledataVisible((prev) => !prev);
    if (_activeFile) setActiveFile(_activeFile);
  }

  return (
    <div className="fileList">
      <MyButton id="createFileBtn" onClick={handleUploadClick}>
        Upload new file
      </MyButton>
      <ul className="fileList" {...props}>
        {loadError ? <p className="errorMessage">{loadError.message}</p> : ""}
        {!fileList?.length ? (
          <h3>No files.</h3>
        ) : (
          fileList.map((el) => (
            <FileElem
              handleViewDetails={handleViewDetails}
              data={el}
              key={el.fileID}
            />
          ))
        )}
      </ul>
      <FileUploadModal
        isVisible={isUploadVisible}
        setIsVisible={setIsUploadVisible}
      />
      <FileDetailsModal
        file={activeFile}
        isVisible={isFiledataVisible}
        setIsVisible={setIsFiledataVisible}
      />
    </div>
  );
}

export default Filelist;

import React, { useContext, useEffect, useState } from "react";
import FileElem from "../FileElem/FileElem";
import MyButton from "../ui/Button/MyButton";
import "./Filelist.css";
import { FileContext } from "../../context/FileContext/FileContextProvider";
import Modal from "../ui/Modal/Modal";
import FileUploadModal from "../FileUploadModal/FileUploadModal";

function Filelist(props) {
  const { fileList, loadError } = useContext(FileContext);
  const [isUploadVisible, setIsUploadVisible] = useState(false);
  const [isFiledataVisible, setIsFiledataVisible] = useState(false);
  // const

  // useEffect(() => {
  //   fetchFiles?.()
  // }, [])

  function handleClick(e) {
    setIsUploadVisible((prev) => !prev);
  }

  return (
    <div className="fileList">
      <ul className="fileList" {...props}>
        {loadError ? <p className="errorMessage">{loadError.message}</p> : ""}
        {!fileList?.length ? (
          <h3>No files.</h3>
        ) : (
          fileList.map((el) => <FileElem data={el} key={el.fileID} />)
        )}
      </ul>
      <MyButton id="createFileBtn" onClick={handleClick}>
        Upload new file
      </MyButton>
      <FileUploadModal
        isVisible={isUploadVisible}
        setIsVisible={setIsUploadVisible}
      ></FileUploadModal>
      <Modal isVisible={isFiledataVisible} setIsVisible={setIsFiledataVisible}>
        456
      </Modal>
    </div>
  );
}

export default Filelist;

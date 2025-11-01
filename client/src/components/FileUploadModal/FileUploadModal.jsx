import React, { useContext, useEffect, useRef, useState } from "react";
import "./FileUploadModal.css";
import Modal from "../ui/Modal/Modal";
import MyButton from "../ui/Button/MyButton";
import { FileContext } from "../../context/FileContext/FileContextProvider";
import LoadingScreen from "../ui/LoadingScreen";

export default function FileUploadModal({ isVisible, setIsVisible, ...props }) {
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);
  const { handleFileSubmit, uploadError, isUploadLoading } =
    useContext(FileContext);

  function handleChange(e) {
    const val = e.target.files?.[0];
    setFile(val);
  }

  async function handleSubmit(e) {
    const success = await handleFileSubmit(e, file);
    if (success) {
      alert("File was uploaded successfully.");
      setIsVisible(false);
    }
  }

  useEffect(() => {
    if (inputRef.current) {
    }
  }, []);

  return (
    <Modal
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      modalHeader="Upload new file"
      className="fileUploadModal"
    >
      {isUploadLoading && <LoadingScreen />}
      <div className="fileUploadBox">
        <label className="fileInputLabel" htmlFor="userfile-upload">
          <input
            onChange={handleChange}
            ref={inputRef}
            type="file"
            name=" file"
            id="userfile-upload"
          />
        </label>
      </div>
      {uploadError ? <p className="errorMessage">{uploadError}</p> : ""}
      <MyButton id="uploadFileBtn" type="submit" onClick={handleSubmit}>
        Upload
      </MyButton>
    </Modal>
  );
}

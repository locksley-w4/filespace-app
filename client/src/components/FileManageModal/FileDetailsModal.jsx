import React, { useContext } from "react";
import Modal from "../ui/Modal/Modal";
import "./FileDetailsModal.css";
import MyButton from "../ui/Button/MyButton";
import { FileContext } from "../../context/FileContext/FileContextProvider";
import LoadingScreen from "../ui/LoadingScreen";

export default function FileDetailsModal({
  isVisible,
  setIsVisible,
  file,
  ...props
}) {
  const {
    isDeleteLoading,
    deleteError,
    handleDeleteFile,
    fetchFiles,
    handleDownload,
  } = useContext(FileContext);

  async function handleDelete(e) {
    const success = await handleDeleteFile(e, file.fileID);
    if (success) {
      alert("File was deleted successfully.");
      setIsVisible(false);
      fetchFiles();
    }
  }

  if (!file) {
    return (
      <Modal
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        modalHeader={"No file selected."}
      >
        <p>No file data to display</p>
      </Modal>
    );
  }

  return (
    <Modal
      isExtended={true}
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      modalHeader={file.originalName}
      className="fileDetailsModal"
    >
      {deleteError ? <p className="errorMessage">{deleteError}</p> : ""}
      {isDeleteLoading && <LoadingScreen />}
      <MyButton onClick={handleDelete} className="red">
        Delete
      </MyButton>
      <MyButton
        onClick={(e) => {
          handleDownload(e, file.fileID);
        }}
      >
        Download
      </MyButton>
      <textarea name="fileContents" id="fileContents" value={file.content} />
    </Modal>
  );
}

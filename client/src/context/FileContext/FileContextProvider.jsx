import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api } from "../../api/api";
import { AuthContext } from "../AuthContext/AuthContextProvider";
import fileDownload from 'js-file-download'

export const FileContext = createContext({ fileList: [] });

export default function FileContextProvider(props) {
  const [fileList, setFileList] = useState([]);
  const { isAuth, setIsAuth } = useContext(AuthContext);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [downloadError, setDownloadError] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const fetchFiles = async () => {
    setLoadError(null);
    try {
      const response = await api.get("/file/myfiles");
      const { data: responseData } = response;
      if (response.status === 200) {
        setFileList(responseData.data);
      }
    } catch (er) {
      if (er.status === 401) {
        setIsAuth(false);
      }
      setLoadError(er);
      console.error(er);
    }
  };

  async function handleFileSubmit(e, file) {
    if (!file) return alert("Please upload the file");

    try {
      setUploadError(null);
      const formData = new FormData();
      formData.append("file", file);
      setIsUploadLoading(true);
      const { error, ...response } = await api.post("/file/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setIsUploadLoading(false);

      if (error) {
        setUploadError(response.data.message);
        return false;
      }
      if (response.status.toString().startsWith("2")) {
        fetchFiles();
        return true;
      }
    } catch (err) {
      setIsUploadLoading(false);
      setUploadError(err?.response?.data?.message ?? "Server error");
    }
  }

  async function handleDeleteFile(e, fileID) {
    if (!fileID) {
      setDeleteError("No fileID was provided");
      setIsDeleteLoading(false);
      return false;
    }
    try {
      setDeleteError(null);
      setIsDeleteLoading(true);
      const { message, error } = await api.delete(
        `/file/myfiles?fileID=${fileID}`
      );
      setIsDeleteLoading(false);
      return true;
    } catch (error) {
      setIsDeleteLoading(false);
      setDeleteError(error?.response?.data?.message ?? "Server error");
      console.error(error);
      return false;
    }
  }

  async function handleDownload(e, fileID) {
    if (!fileID) {
      setDownloadError("No fileID was provided");
      return false;
    }
    try {
      setDownloadError(null);
      const { data, ...response } = await api.get(
        `/file/myfiles/download?fileID=${fileID}`,
        { responseType: "blob" }
      );
      console.log(response, data);
      
      fileDownload(data, "test.html")
      return true;
    } catch (error) {
      setDownloadError(error?.response?.data?.message ?? "Server error");
      console.error(error);
      return false;
    }
  }

  useEffect(() => {
    if (isAuth) {
      fetchFiles();
    }
  }, [isAuth]);

  return (
    <FileContext.Provider
      value={{
        fileList,
        fetchFiles,
        handleFileSubmit,
        isUploadLoading,
        uploadError,
        loadError,
        handleDeleteFile,
        isDeleteLoading,
        deleteError,
        handleDownload
      }}
    >
      {props.children}
    </FileContext.Provider>
  );
}

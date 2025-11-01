import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api } from "../../api/api";
import { AuthContext } from "../AuthContext/AuthContextProvider";

export const FileContext = createContext({ fileList: [] });

export default function FileContextProvider(props) {
  const [fileList, setFileList] = useState([]);
  const { isAuth, setIsAuth } = useContext(AuthContext);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
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
      setLoadError(er)
      console.error(er);
    }
  };

  async function handleFileSubmit(e, file) {
    if (!file) return alert("Please upload the file");
    console.log(file);
    
    try {
      setUploadError(null);
      const formData = new FormData();
      formData.append("file", file);
      setIsUploadLoading(true);
      const {error, ...response } = await api.post(
        "/file/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setIsUploadLoading(false);
      console.log(response);
      
      if (error) {
        setUploadError(error);
        return false
      }
      if (response.status.toString().startsWith("2")) {
        fetchFiles();
        return true
      }
    } catch (err) {
      console.error(err);
      setIsUploadLoading(false)
      setUploadError(err);
    }
  }

  useEffect(() => {
    if (isAuth) {
      fetchFiles();
    }
  }, [isAuth]);

  return (
    <FileContext.Provider
      value={{ fileList, fetchFiles, handleFileSubmit, isUploadLoading, uploadError, loadError }}
    >
      {props.children}
    </FileContext.Provider>
  );
}

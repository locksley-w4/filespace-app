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
  const { isAuth } = useContext(AuthContext);

  const fetchFiles = async () => {
    try {
      const response = await api.get("/file/myfiles");
      const { data: responseData } = response;
      if (response.status === 200) {
        setFileList(responseData.data);
      }
    } catch (er) {
      console.error(er);
    }
  };

  useEffect(() => {
    if (isAuth) {
      fetchFiles();
    }
  }, [isAuth]);

  return (
    <FileContext.Provider value={{ fileList, fetchFiles }}>
      {props.children}
    </FileContext.Provider>
  );
}

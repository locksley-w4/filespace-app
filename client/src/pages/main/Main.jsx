import React, { useContext } from "react";
import Filelist from "../../components/Filelist/Filelist";
import "./Main.css";
import MyButton from "../../components/ui/Button/MyButton";
import Container from "../../components/Container/Container";
import Heading from "../../components/ui/Heading/Heading";
import { AuthContext } from "../../context/AuthContext/AuthContextProvider";

export default function Main() {
  const { handleLogout } = useContext(AuthContext);

  return (
    <div className="main">
      <MyButton id="logout" onClick={handleLogout}>
        Logout
      </MyButton>

      <Container>
        <Heading>
          Your private FileSpace🚀
        </Heading>
        <Filelist/>
      </Container>
    </div>
  );
}

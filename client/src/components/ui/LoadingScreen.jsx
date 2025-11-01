import React from "react";
import cls from "./LoadingScreen.module.css";

export default function LoadingScreen() {
  return (
    <div className={cls.loadingScreen}>
      <div className={cls.circle}></div>
      <div className={cls.circle}></div>
      <div className={cls.circle}></div>
      <h3>Loading</h3>
    </div>
  );
}

import React, { useState } from "react";
import cls from "./Modal.module.css";

export default function Modal({
  isVisible = false,
  setIsVisible,
  modalHeader,
  ...props
}) {
  function handleModalClose(e) {
    if (setIsVisible) {
      setIsVisible(false);
    }
  }

  return (
    <div
      {...props}
      className={`${cls.modalWrapper} ${isVisible ? cls.active : ""}`}
      onClick={handleModalClose}
    >
      <div
        className={cls.modalContainer}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={cls.modalHeader}>
          <h2>{modalHeader}</h2>
          <button onClick={handleModalClose} className={cls.closeBtn}>
            <span className={cls.closeIcon}>
              <span />
              <span />
            </span>
          </button>
        </div>
        <div className={`${cls.modalBody} ${props.className}`}>{props.children}</div>
      </div>
    </div>
  );
}

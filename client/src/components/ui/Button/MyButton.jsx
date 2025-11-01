import React from "react";
import styles from './MyButton.module.css'

export default function MyButton({className, ...props}) {
  return <button className={`${styles.MyButton} ${styles[className] ?? ""}`}  {...props} >{props.children}</button>;
}

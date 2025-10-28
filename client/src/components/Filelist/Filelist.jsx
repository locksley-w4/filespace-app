import React, { useContext, useEffect, useState } from 'react'
import FileElem from '../FileElem/FileElem';
import "./Filelist.css"
import { FileContext } from '../../context/FileContext/FileContextProvider';

function Filelist(props) {
    const {fileList} = useContext(FileContext);

    // useEffect(() => {
    //   fetchFiles?.()
    // }, [])
    

  return (
    <ul className='fileList' {...props}>
        {!fileList?.length ?
        <h3>No files.</h3>
        : fileList.map(el => (
            <FileElem data={el} key={el.fileID}/>
        ))}
    </ul>
  )
}

export default Filelist

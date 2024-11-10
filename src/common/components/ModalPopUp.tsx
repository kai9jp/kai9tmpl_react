import { faFileImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import Modal from 'react-modal';
import './ModalPopUp.css';

type LogModalProps = {
    title: string;
    log: string;
    isOpen: boolean;
    onClose: any;
    onOngDownload?: () => void;
};

const LogModal: React.FC<LogModalProps> = ({ title,log, isOpen, onClose,onOngDownload }) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollPosition(e.currentTarget.scrollTop);
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="center-modal">
      <div className="modal-content" style={{ maxHeight: '80vh', overflowY: 'scroll' }} onScroll={handleScroll}>
        <div className="modal-header">
          <h2>{title}</h2>
          {/* スクリーンショットを開くボタン */}
          {onOngDownload? <button className="ReactModal__DownloadBtn" onClick={onOngDownload}><FontAwesomeIcon icon={faFileImage} /></button>:null}
          {/* 閉じるボタン */}
          <button className="ReactModal__CloseBtn" onClick={onClose}><FontAwesomeIcon icon={faTimes} /></button>
        </div>
        <pre style={{ whiteSpace: 'pre-wrap', height: '100%', overflowY: 'auto' }}>{log}</pre>
      </div>
    </Modal>  );
};

export default LogModal;

import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Modal from 'react-modal';
import ExcelDropzone from './ExcelDropzone';
import './Upload.css';

type UploadModalProps = {
  title: string;
  msg?: string;
  isOpen: boolean;
  onClose: () => void;
  handleExcelDrop: (blob: Blob, filename: string) => void;
};

const UploadModal: React.FC<UploadModalProps> = ({ title, msg, isOpen, onClose, handleExcelDrop }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="center-modal">
      <div className="modal-content" style={{ maxHeight: '50vh', overflowY: 'scroll' }}>
        <div className="modal-header2">
          <h2>{title}</h2>
          <button className="ReactModal__CloseBtn" title="閉じる" onClick={onClose}>
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>
        <ExcelDropzone onDrop={handleExcelDrop} label={''} id={'s_excel'} />
        <pre style={{ whiteSpace: 'pre-wrap', height: '50%', overflowY: 'auto', fontSize: '14pt' }}>
          {msg}
        </pre>
      </div>
    </Modal>
  );
};

export default UploadModal;

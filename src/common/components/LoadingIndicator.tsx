import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { Line } from 'rc-progress';
import 'react-circular-progressbar/dist/styles.css';
import styles from './LoadingIndicator.module.css';
import logo from './react.png'; // ロゴ画像のパス
import Swal from 'sweetalert2';

interface LoadingIndicatorProps {
  progress1?: number; // 上段の進行状況のパーセンテージ
  progress2?: number; // 下段の進行状況のパーセンテージ
  setProgress_status_stop?:any;
}

/* ローディングインジケータコンポーネントの定義 */
const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ progress1, progress2,setProgress_status_stop }) => {
  const [loading, setLoading] = useState(true); // ローディング状態の管理

  /* コンポーネントがマウントされた後に一度だけ実行 */
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 4000); // 4秒後にローディング状態をfalseに
    return () => clearTimeout(timer); // コンポーネントアンマウント時にタイマー解除
  }, []);

  /* 中止ボタンがクリックされた時のハンドラー */
  const handleCancel = () => {
    Swal.fire({
      title: '本当に中止しますか？',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'はい',
      cancelButtonText: 'いいえ',
      //全面に表示
      willOpen: () => {
        const swalContainer = document.querySelector('.swal2-container') as HTMLElement;
        if (swalContainer) {
          swalContainer.style.zIndex = '10000'; 
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setProgress_status_stop();
      }
    });
  };

  /* JSXでのUI定義 */
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="React logo" className={styles.reactLogo} />
      </div>

      {progress1 !== undefined &&  progress1 != -1 &&(
        <div className={styles.lineProgressContainer}>
          <Line percent={progress1} strokeWidth={4} strokeColor="#61dafb" />
        </div>
      )}

      {progress2 !== undefined && progress2 != -1 &&(
        <div className={styles.progressContainer}>
          <CircularProgressbar
            value={progress2}
            text={`${progress2}%`}
            styles={buildStyles({
              textColor: '#61dafb',
              pathColor: '#61dafb',
              trailColor: 'rgba(255, 255, 255, 0.2)',
            })}
          />
        </div>
      )}

      <div className={styles.loadingText}>loading...</div>
      
      {/* 中止ボタンの追加 */}
      <button className={styles.cancelButton} onClick={handleCancel}>
        中止
      </button>
    </div>
  );
};

export default LoadingIndicator; /* コンポーネントのエクスポート */
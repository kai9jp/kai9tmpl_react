import React from 'react';
import './BlinkingRow.css';

/**
 * BlinkingRowは、追加された行を点滅表示させるコンポーネントです。
 * shouldBlinkがtrueに設定されている場合、行は点滅します。
 */
const BlinkingRow = ({ children, shouldBlink, className, onClick }: {
    children: React.ReactNode;
    shouldBlink?: boolean;
    className?: string;
    onClick?: () => void;
  }) => {

  return (
    <tr className={`${shouldBlink ? 'blinking' : ''} ${className}`} onClick={onClick}>
      {children}
    </tr>
  );
};

export default BlinkingRow;

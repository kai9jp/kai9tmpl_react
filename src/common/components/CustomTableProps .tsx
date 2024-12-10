import Pagination from 'components/Pagination/Pagination';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import "./CustomTableProps.css";
import "react-resizable/css/styles.css"; // リサイズハンドルのスタイルをインポート
import { Rnd } from 'react-rnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompressArrowsAlt, faExpandArrowsAlt, faMinus, faSquare, faTimes } from '@fortawesome/free-solid-svg-icons';

// Props の型定義
interface CustomTableProps {
    title: React.ReactNode;//タイトル
    headerButtons: React.ReactNode; // ヘッダーボタン
    searchBar?: React.ReactNode; // サーチバー
    tableContent: React.ReactNode; // 表示するテーブル
    setTableHeight : any;//テーブルの高さ(state)
    setCardFooterBottom? : any;//cardのbottom座標(state)
    ParentRef: any;//親のref
    positionY?:number;
    positionX?:number;
    onCloseClick?:any;//閉じるボタン
    delDataShowCkeckboxContent?: React.ReactNode;//削除表示用
    ComponentPositionsID:string;//ローカルストレージに保存する際のコンポーネントID(一意な物なら何でもOK)を指定
    //ページネーション用
    dataCounts?: any; 
    numberOfDisplaysPerpage?: any;
    currentPage?: any;
    SetCurrentPage?: any;
    setnumberOfDisplaysPerpage?: any;
    //グリッドシステム
    titleCol?:string;
    searchBarCol?:string;
    headerButtonsCol?:string;
    //常に最大化制御
    alwaysMaximized ?:boolean;
    //最大化、最小化ボタンの非表示
    hideWinButtons ?:boolean;
}

const CustomTable: React.FC<CustomTableProps> = (props:CustomTableProps) => {

    const [isMaximized, setisMaximized] = useState(false);
    const [isMinimized, setisMinimized] = useState(false);
    const [prevSize, setPrevSizePos] = useState({zIndex:'0', x: 0, y: 0, width: 0, height: 0 });
    //コンポーネントのサイズと位置を保存
    const { posWidth, posHeight, posX, posY, setPosition } = useComponentPositions(props.ComponentPositionsID!);

    // ウィンドウサイズのセット
    const setWindowSize = (width:number,height:number,IsResize:boolean) => {
        if (IsResize == false){
            //rndのリサイズ:リサイズ時にﾄﾞﾗｯｸﾞする枠(リサイザー)の変更
            if (rndRef.current){
                rndRef.current.updateSize({ width: width, height: height });
            }
        }
        //カードヘッダーの高さ
        let nowCardHeaderHeight = 90;//90は適当な値
        if (cardHeaderRef.current){
            nowCardHeaderHeight = cardHeaderRef.current.clientHeight;
        }
        //フッター座標
        let nowCardFooterHeight = 90;//90は適当な値
        if (cardfooterRef.current){
            nowCardFooterHeight = cardfooterRef.current.clientHeight;
        }

        //カードボディの高さ
        const h = nowCardHeaderHeight + nowCardFooterHeight;
        //カードボディの高さを計算(リサイズ枠からヘッダーとフッターの高さを引く)
        const newHeight = height - h;
        setCardBodyHeight(`${newHeight}px`);
        //テーブルの高さ
        props.setTableHeight(`${newHeight - 30}px`);

        calcCardFooterBottom(isMinimized);//フッター座標を計算しpropsへ反映
    }

    // ウィンドウ最小化
    const　handleMinimizeClick = () => {
        //最大化中の場合は戻す
        if (isMaximized) handleRestoreClick();
        //最小化
        setisMinimized(true);
    }

    // ウィンドウ最大化
    const　handleMaximizeClick = () => {
        setisMinimized(false);
        if (rndRef.current){
            //変更前のサイズを記憶(元に戻す際に用いるので)
            if (rndRef.current.resizableElement.current && CustomTableContainerRef.current){
                setPrevSizePos({zIndex:CustomTableContainerRef.current.style.zIndex, x: posX,y: posY,width: rndRef.current.resizableElement.current.offsetWidth, height: rndRef.current.resizableElement.current.offsetHeight });
                //最前面に表示
                CustomTableContainerRef.current.style.zIndex = '999';
            }
            // ウィンドウを画面全体のサイズに設定
            const screenWidth = props.ParentRef.current.clientWidth;
            const screenHeight = props.ParentRef.current.clientHeight;

            const newWidth = screenWidth - 10;
            const newHeight = screenHeight - 20;
            setWindowSize(newWidth,newHeight,false);

            if (rndRef.current){
                rndRef.current.updatePosition({ x: 5,y: 5});
            }
        }
        setisMaximized(true);
    }

    // ウィンドウを元のサイズに戻す
    const handleRestoreClick = () => {
        if (rndRef.current){
            if (isMaximized){
                setWindowSize(prevSize.width,prevSize.height,false);
                rndRef.current.updatePosition({ x: prevSize.x,y: prevSize.y});
                if (CustomTableContainerRef.current){
                    CustomTableContainerRef.current.style.zIndex = prevSize.zIndex;
                }
            }
        }
        setisMaximized(false);
        setisMinimized(false);
    }

    const windowButtons = (
      // ウィンドウ制御用ボタンを含む要素
      <div className="window-controls">
        {/* 最小化または元に戻すボタンボタン */}
        {isMinimized ? (
          // 元に戻すボタン
          <button onClick={handleRestoreClick}>
            <FontAwesomeIcon icon={faExpandArrowsAlt} title="戻す" id="min_restore_button" />
          </button>
        ) : (
            // 最小化ボタン
            <button onClick={handleMinimizeClick}>
                <FontAwesomeIcon icon={faMinus}  title="最小化" id="min_button"/>
            </button>
        )}

        {/* 最大化または元に戻すボタン */}
        {isMaximized ? (
          // 元に戻すボタン
          <button onClick={handleRestoreClick}>
            <FontAwesomeIcon icon={faCompressArrowsAlt}  title="戻す"  id="max_restore_button"/>
          </button>
        ) : (
          // 最大化ボタン
          <button onClick={handleMaximizeClick}>
            <FontAwesomeIcon icon={faSquare}  title="最大化" id="max_button"/>
          </button>
        )}

        {/* 閉じるボタン */}
        {props.onCloseClick?
            <button onClick={props.onCloseClick}>
                <FontAwesomeIcon icon={faTimes}  title="閉じる"   id="close_button"/>
            </button>
        :  
            null
        }

      </div>    
    )

    //-------------------------------------------------------------
    //setCardFooterBottomの計算
    // このカードの下側に、縦に並べて表示する際、その高さを記憶させる
    //-------------------------------------------------------------

    const calcCardFooterBottom = (pisMinimized:boolean) =>{
        let newBottom = 0;        
        if (pisMinimized){
            //最小化されている場合、ヘッダーのbottomを返す
            if (cardHeaderRef.current) {
                newBottom = cardHeaderRef.current.getBoundingClientRect().bottom;
            }
        }else{
            //フッターのbottomを返す
            if (cardfooterRef.current) {
                newBottom = cardfooterRef.current.getBoundingClientRect().bottom;
            }
        }
        //親refの指定がある場合、親を起点にした座標で計算する
        if (props.ParentRef){
            newBottom = newBottom - props.ParentRef.current.getBoundingClientRect().top;
        }
        props.setCardFooterBottom(newBottom);
    }

    //-------------------------------------------------------------
    //コンポーネントのサイズと位置　の制御
    //-------------------------------------------------------------

    // コンポーネントのサイズと位置を保存するキー
    const KEY = 'componentPositions_'+props.ComponentPositionsID;

    // コンポーネントのサイズと位置を保存する型
    interface ComponentPositions {
        [key: string]: {
        posWidth: number;
        posHeight: number;
        posX: number;
        posY: number;
        };
    }

    // コンポーネントのサイズと位置を保存する関数
    const saveComponentPositions = (positions: ComponentPositions) => {
        localStorage.setItem(KEY, JSON.stringify(positions));
    };
  
    // コンポーネントのサイズと位置を復元する関数
    const restoreComponentPositions = () => {
        const savedPositions = localStorage.getItem(KEY);
        if (savedPositions) {
            return JSON.parse(savedPositions) as ComponentPositions;
        }
        return null;
    };

    // サイズと位置を保存するためのカスタムフック
    function useComponentPositions(id: string) {        
        const [posWidth, setposWidth] = useState(0);
        const [posHeight, setposHeight] = useState(0);
        const [posX ,setposX] = useState(0);
        const [posY, setposY] = useState(0);
    
        // デフォルト値設定
        function SetDefValuePositions(){
            let numericWidth = 800;
            let numericHeight = 600;
            if (props.ParentRef){
                //親要素に対して、横100%、縦70%、左右余白分を各々-5
                if (props.ParentRef.current.clientWidth != 0){
                    numericWidth = props.ParentRef.current.clientWidth -5-5;
                }
                if (props.ParentRef.current.clientHeight != 0){
                    numericHeight = (props.ParentRef.current.clientHeight *0.7) -5-5;
                }
            }
            setposWidth(numericWidth);
            setposHeight(numericHeight);
            const x = props.positionX?props.positionX:5;
            const y = props.positionY?props.positionY:5;
            setposX(x);
            setposY(y);
            //setWindowSizeでサイズをセッティングする
            setWindowSize(numericWidth,numericHeight,false);
            //updatePositionで座標をセッティングする
            if (rndRef.current){
                rndRef.current.updatePosition({ x: x, y: y });
            }
        }
    
        // コンポーネントがマウントされた時に保存されたサイズと位置を復元する
        useEffect(() => {

            const positions = restoreComponentPositions();
            if (positions && positions[id]) {
                const { posWidth, posHeight, posX, posY } = positions[id];
                if (posWidth+posHeight+posX+posY == 0){
                    // ストレージに無ければ、デフォルト値を入れる
                    SetDefValuePositions();
                    return;
                }
                setposWidth(posWidth);
                setposHeight(posHeight);
                setposX(posX);
                setposY(posY);
                //setWindowSizeでサイズをセッティングする
                setWindowSize(posWidth,posHeight,false);
                //updatePositionで座標をセッティングする
                if (rndRef.current){
                    rndRef.current.updatePosition({ x: posX, y: posY });
                }
    
            }else{
                // ストレージに無ければ、デフォルト値を入れる
                SetDefValuePositions();
            }
        }, [id]);
    
        // サイズと位置が変更されたらローカルストレージに保存する
        useEffect(() => {
            let positions = restoreComponentPositions();
            if (posWidth+posHeight+posX+posY==0) return;//デフォルト値(初期化直後)の場合は抜ける
            if (!positions) {
                positions = {};
            }
            positions[id] = { posWidth, posHeight, posX, posY };
            saveComponentPositions(positions);
        }, [id, posWidth, posHeight, posX, posY]);
    
        // サイズと位置を設定する関数
        const setPosition = (posWidth: number, posHeight: number, posX: number, posY: number) => {
            setposWidth(posWidth);
            setposHeight(posHeight);
            setposX(posX);
            setposY(posY);
        };
    
        return { posWidth, posHeight, posX, posY, setPosition };
    };
    

    //-------------------------------------------------------------
    //レンダリング
    //-------------------------------------------------------------
    //ヘッダー、フッターの幅を取得するためのrefとstate
    const CustomTableContainerRef = useRef<HTMLDivElement>(null);
    const cardHeaderRef = useRef<HTMLDivElement>(null);
    const cardfooterRef = useRef<HTMLDivElement>(null);
    const [cardBodyHeight, setCardBodyHeight] = useState('auto');
    const tableContainerRef = useRef<HTMLDivElement>(null);
    const rndRef = useRef<Rnd>(null);

    //初回レンダリング時、最大化、最小化時、テーブル、フッターの高さ変更後に、calcCardFooterBottomを計算させる
    useEffect(() => {
        // propのstateにフッダーのbottomを反映
        calcCardFooterBottom(isMinimized);

        //最大化、最小化時を覗きsetWindowSize(ウィンドウサイズのセット)
        if (posWidth+posHeight != 0 && !isMaximized && !isMinimized){
            setWindowSize(posWidth,posHeight,false);
        }

    }, [isMaximized,isMinimized,tableContainerRef.current?.clientHeight,cardfooterRef.current?.clientHeight]);

    //リサイズイベント
    const onResize = () => {
        if (rndRef.current && rndRef.current.resizableElement.current) {
            const domNode = rndRef.current.resizableElement.current;
            setWindowSize(domNode.clientWidth,domNode.clientHeight,true);

            //座標を記憶
            if (props.ComponentPositionsID){
                setPosition(domNode.clientWidth, domNode.clientHeight, posX, posY);
            }

        }
    };

    // ドラッグ開始時に初期位置を設定する変数
    let initialX = 0;
    let initialY = 0;    
    let isDragging = false; // ドラッグ中かどうかのフラグ
    // ドラッグ開始時のイベントハンドラ
    const onDragStart = (e: any, d: any) => {
        // ドラッグ開始時の初期位置を保存
        initialX = d.x;
        initialY = d.y;
        isDragging = false;
    };


    // ドラッグイベント
    const onDrag = (e: any, d: any) => {
        // 初期位置との差が1ピクセル以下なら移動を無視
        if (!isDragging && (Math.abs(d.x - initialX) > 1 || Math.abs(d.y - initialY) > 1)) {
            isDragging = true;
        }
        // ドラッグ中でない場合は何もしない
        if (!isDragging) {
            return;
        }

        // 通常のドラッグ動作
        calcCardFooterBottom(isMinimized);
        if (props.ComponentPositionsID) {
            const { x, y } = d;
            setPosition(d.node.clientWidth, d.node.clientHeight, x, y);
        }
    };


    
    //-------------------------------------------------------------
    //ページング要素　の ローカルストレージ 制御
    //-------------------------------------------------------------
    // コンポーネントのサイズと位置を保存するキー
    const KEY_Pagination = 'Pagination_'+props.ComponentPositionsID;
    // コンポーネントのサイズと位置を保存する型
    interface ComponentPagination {
        [KEY_Pagination: string]: {
            currentPage: number;
            numberOfDisplaysPerpage: number;
        };
    }
    
    useEffect(() => {
        //既に初期値(0)以外が入っている場合は何もしない
        if (props.currentPage+props.numberOfDisplaysPerpage != 0) return;

        // ローカルストレージからの読み込み
        const savedData = localStorage.getItem(KEY_Pagination);
        if (savedData) {
            const parseData = JSON.parse(savedData) as ComponentPagination;
            props.setnumberOfDisplaysPerpage(parseData.numberOfDisplaysPerpage);
        }else{
            //ストレージに無い場合は初期値をセット
            props.setnumberOfDisplaysPerpage(100);
        }
        // currentPage の初期値 1 をセット
        props.SetCurrentPage(1);

    }, []);

    function MySetCurrentPage(CurrentPage:number){
        //親のsetstate
        props.SetCurrentPage(CurrentPage);
    }

    function MySetnumberOfDisplaysPerpage(numberOfDisplaysPerpage:number){
        // ローカルストレージへの保存
        const data = { currentPage: props.currentPage, numberOfDisplaysPerpage: numberOfDisplaysPerpage };
        localStorage.setItem(KEY_Pagination, JSON.stringify(data));
        //親のsetstate
        props.setnumberOfDisplaysPerpage(numberOfDisplaysPerpage);
    }
    //-------------------------------------------------------------
    //(ここまで)    ページング要素　の ローカルストレージ 制御
    //-------------------------------------------------------------

    useEffect(() => {
        // 位置をチェックして5未満の場合に修正
        const checkPosition = () => {
            if (rndRef.current && props.ParentRef.current) {
                const element = rndRef.current.getSelfElement();
                const parentElement = props.ParentRef.current;
                if (element && parentElement) {
                    const elementRect = element.getBoundingClientRect();
                    const parentRect = parentElement.getBoundingClientRect();
                    const relativeX = elementRect.left - parentRect.left;
                    const relativeY = elementRect.top - parentRect.top;
    
                    const newX = relativeX < 5 ? 5 : relativeX;
                    const newY = relativeY < 5 ? 5 : relativeY;
    
                    if (relativeX < 5 || relativeY < 5) {
                        rndRef.current.updatePosition({ x: newX, y: newY });
                        setPosition(posWidth, posHeight, newX, newY);
                    }
                }
            }
        };
    
        // 初回チェック
        checkPosition();
    
        // 位置が変わるたびにチェック
        const intervalId = setInterval(checkPosition, 100);
    
        return () => clearInterval(intervalId);
    }, [posX, posY, posWidth, posHeight]);
    
    const onDragStop = (e: any, d: any) => {
        //ドラッグ中と判定された状態ではない(クリックしただけ等)場合、何もしない
        if (!isDragging) return;
        if (rndRef.current && props.ParentRef.current) {
            const elementRect = d.node.getBoundingClientRect();
            const parentRect = props.ParentRef.current.getBoundingClientRect();
    
            const newX = elementRect.left < parentRect.left + 5 ? 5 : elementRect.left - parentRect.left;
            const newY = elementRect.top < parentRect.top + 5 ? 5 : elementRect.top - parentRect.top;
    
            rndRef.current.updatePosition({ x: newX, y: newY });
            calcCardFooterBottom(isMinimized);
    
            // 座標を記憶
            if (props.ComponentPositionsID) {
                setPosition(posWidth, posHeight, newX, newY);
            }
        }
    };

    // 画面リサイズイベントを取得し常に最大化を制御
    useEffect(() => {
        //初回レンダリング時用
        if (props.alwaysMaximized){
            // 常に最大化
            setisMaximized(true);
            handleMaximizeClick();
        }

        const handleResize = () => {
            if (props.alwaysMaximized){
                // 常に最大化
                setisMaximized(true);
                handleMaximizeClick();
              }
        };
        window.addEventListener("resize", handleResize);
        return () => {
          window.removeEventListener("resize", handleResize);
        };        
    }, []);


            
    return (
        <Fragment>

        {/* デバッグ用  */}
        {/* posX:{posX} posY:{posY} posWidth:{posWidth} posHeight:{posHeight}   */}
        
        {/* コンポーネント全体を横幅一杯に収める */}
        {/* rndのdefaultでwidthに対しcalcが通用せず、仕方なく、上位エレメントで覆っている */}
        <div className="CustomTableContainer" ref={CustomTableContainerRef} style={{width: "calc(100% - 10px)",height: "calc(100% - 10px)",position: "relative"}}>

        {/* Rndを用いドラッグや、リサイズを可能にする */}
        <Rnd
            default={{
                x: posX!=0?posX:props.positionX?props.positionX:5,
                y: posY!=0?posY:props.positionY?props.positionY:5,
                width: posWidth!=0?posWidth:'100%',
                height: posHeight!=0?posHeight:'auto',
            }}        
            //カードヘッダーをドラッグした時だけコンポーネントを移動モードにする
            dragHandleClassName="card-header-draggable"
            //サイズ計算と制御
            ref={rndRef}
            onResize={onResize}
            onDragStart={onDragStart}
            onDrag={onDrag}
            onDragStop={onDragStop}
        >

            {/* カードコンテンツ */}
            <div className="card shadow" >

                {/* カードヘッダー */}
                <div className="card-header card-header-draggable" id="M_keyword1s_header" ref={cardHeaderRef} >

                    {/* タイトル、ボタン群 */}
                    <div className="row" >
                        <div className={props.titleCol ? props.titleCol:"col-md-3"}>
                            {props.title}
                        </div>

                        {/* 検索ボックス(有れば表示) */}
                        {props.searchBar? 
                            <div className={props.searchBarCol ? props.searchBarCol:"col-md-5"}>
                                {props.searchBar}
                            </div>
                        :
                            null
                        }

                        <div className={props.headerButtonsCol ? props.headerButtonsCol:"col-md-3"}>
                            {props.headerButtons}
                        </div>
                        <div className="col-md-1">
                          {!props.alwaysMaximized && !props.hideWinButtons ? windowButtons : null}
                        </div>
                    </div>
                </div>

                {/* カードボディ */}
                <div className={`card-body${isMinimized ? ' d-none' : ''}` } style={{ height: cardBodyHeight }}>
                {/* <div className={`card-body${isCollapsed ? ' d-none' : ''}` } ref={cardBodyRef}> */}
                    {/* テーブルコンテンツ */}
                    <div className="table-container" ref={tableContainerRef}>
                        {props.tableContent}
                    </div>
                </div>

                {/* カードフッター */}
                <div className={`card-footer pt-3${isMinimized ? ' d-none' : ''}`} ref={cardfooterRef}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        {/* 削除表示(有れば表示) */}
                        <div style={{ flex: "0 0 auto", minWidth: 0, marginRight: "4rem" }}>
                            {props.delDataShowCkeckboxContent ? props.delDataShowCkeckboxContent : null}
                        </div>

                        {/* ページネーション(有れば表示) */}
                        <div style={{ flex: "1 1 auto", minWidth: 0, textAlign: "right" }}>
                            {props.dataCounts && props.numberOfDisplaysPerpage && props.currentPage && props.SetCurrentPage ? (
                            <Pagination
                                SetCurrentPage={MySetCurrentPage}
                                numberOfDisplaysPerpage={props.numberOfDisplaysPerpage} //1ページの表示件数
                                dataCounts={props.dataCounts} //総件数
                                currentPage={props.currentPage} //現在の表示ページ
                                SetnumberOfDisplaysPerpage={MySetnumberOfDisplaysPerpage}
                            />
                            ) : null}
                        </div>
                    </div>
                </div>

            </div>
        </Rnd>
        </div>

        </Fragment >
    );
};

export default CustomTable;

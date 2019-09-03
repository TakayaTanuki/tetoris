//canvas要素の大きさを取得(画面サイズがリサイズした場合大きさ変わる？？？)
const nextFallingCanvasWidth = document.querySelector('#nextFallingCanvas').offsetWidth;
const nextFallingCanvasHeight = document.querySelector('#nextFallingCanvas').offsetHeight;

const fallingBlockCanvasWidth = document.querySelector('#fallingBlockCanvas').offsetWidth;
const fallingBlockCanvasHeight = document.querySelector('#fallingBlockCanvas').offsetHeight;

console.log(`${nextFallingCanvasWidth},${nextFallingCanvasHeight}`);

//canvas要素を取得
const nextFallingCanvas = document.querySelector('#nextFallingCanvas');
const fallingBlockCanvas = document.querySelector('#fallingBlockCanvas');

//canvas要素のコンテキストオブジェクトを取得(getcontextのCを大文字にしないとエラー発生)
const nextFallingContext = nextFallingCanvas.getContext('2d');
const fallingBlockContext = fallingBlockCanvas.getContext('2d');

//context.fillStyleで色を指定
nextFallingContext.fillStyle = 'blue';
fallingBlockContext.fillStyle = 'blue';

//context.lineWidthで線の幅を取得(1以上にすると線の幅も幅の計算に入る)
nextFallingContext.linewidth = 0;
fallingBlockContext.linewidth = 0;

nextFallingContext.strokeRect(0, 0, nextFallingCanvasWidth, nextFallingCanvasHeight);
fallingBlockContext.strokeRect(0, 0, fallingBlockCanvasWidth, fallingBlockCanvasHeight);

const fallingBlockSplittedTen = fallingBlockCanvasWidth / 10;
const fallingBlockSplittedTwenty = fallingBlockCanvasHeight / 20;

//横幅の色を塗る
for (let i = 0; i < 10; i++) {
    fallingBlockContext.strokeRect(i * fallingBlockSplittedTen, 0, fallingBlockCanvasWidth, fallingBlockCanvasHeight);
}
//縦幅の色を塗る
for (let l = 0; l < 20; l++) {
    fallingBlockContext.strokeRect(0, l * fallingBlockSplittedTwenty, fallingBlockCanvasWidth, fallingBlockCanvasHeight);
}
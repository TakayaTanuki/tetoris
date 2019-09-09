/*今回のテトリスはワールドルールで実装
I:水色
O:黄色
S:黄緑
Z:赤
J:青
L:オレンジ
T:紫
*/

class Tetoris {
    constructor() {

        //canvas要素の大きさを取得(画面サイズがリサイズした場合大きさ変わる？？？)
        this.nextFallingCanvasWidth = document.querySelector('#nextFallingCanvas').offsetWidth;
        this.nextFallingCanvasLength = document.querySelector('#nextFallingCanvas').offsetHeight;
        //横
        this.fallingBlockCanvasWidth = document.querySelector('#fallingBlockCanvas').offsetWidth;
        //縦
        this.fallingBlockCanvasLength = document.querySelector('#fallingBlockCanvas').offsetHeight;

        //英語では短い幅をwidth、長い幅をlengthのため、今回は、横幅をwidth,縦幅をlengthとする。
        //横幅は10,縦幅を20に設定
        this.stateWidth = 10;
        this.stateLength = 20;
        //横1幅
        this.rectangleWidth = this.fallingBlockCanvasWidth / 10;
        //縦1幅
        this.rectangleLength = this.fallingBlockCanvasLength / 20;

        //canvas要素を取得
        this.nextFallingCanvas = document.querySelector('#nextFallingCanvas');
        this.fallingBlockCanvas = document.querySelector('#fallingBlockCanvas');

        //canvas要素のコンテキストオブジェクトを取得(getcontextのCを大文字にしないとエラー発生)
        this.nextFallingContext = nextFallingCanvas.getContext('2d');
        this.fallingBlockContext = fallingBlockCanvas.getContext('2d');

        this.loopTime;
        this.movingBlock = [[0, 0], [0, 0], [0, 0], [0, 0]];
        this.blocks = this.CreateBlocks();

    }

    set loopTimeField(value) {
        this.loopTime = value;
    }

    get loopTimeField() {
        return this.loopTime;
    }

    set movingBlockField(value) {
        this.movingBlock[value[1]] = value[0];
    }

    get movingBlockField() {
        return this.movingBlock;
    }

    PaintFallingCanvas() {
        this.fallingBlockContext.fillStyle = 'black';
        //横幅の色を塗る
        for (let i = 0; i < this.stateWidth; i++) {
            this.fallingBlockContext.strokeRect(i * this.rectangleWidth, 0, this.fallingBlockCanvasWidth, this.fallingBlockCanvasLength);
        }
        //縦幅の色を塗る
        for (let l = 0; l < this.stateLength; l++) {
            this.fallingBlockContext.strokeRect(0, l * this.rectangleLength, this.fallingBlockCanvasWidth, this.fallingBlockCanvasLength);
        }
    }

    MoveRight() {
        this.fallingBlockContext.clearRect(0, 0, this.fallingBlockCanvasWidth, this.fallingBlockCanvasLength);
        //左上の色を塗る
        this.fallingBlockContext.fillStyle = this.blocks[0].color;

        for (let k = 0; k < this.movingBlock.length; k++) {
            this.fallingBlockContext.fillRect(this.movingBlock[k][0] + this.rectangleWidth, this.movingBlock[k][1], this.rectangleWidth, this.rectangleLength);
            console.log(this.movingBlock[k][0] + this.rectangleWidth, this.movingBlock[k][1], this.rectangleWidth, this.rectangleLength);
            this.movingBlockField = [[this.movingBlock[k][0] + this.rectangleWidth, this.movingBlock[k][1], this.rectangleWidth, this.rectangleLength], k];
        }
        console.log(this.movingBlock);
        /*----------枠を描画する----------*/
        this.PaintFallingCanvas();
        /*--------------------------------*/

    }

    CreateBlocks() {
        // 元の配列の複製を作成
        let sourceArr = [
            {/*横長棒を作成
                    □□□□
                */
                shape: [[0, 0], [1, 0], [2, 0], [3, 0]],
                color: 'aqua'
            },
            {/*L字を作成
                      □
                    □□□
                */
                shape: [[2, 0], [0, 1], [1, 1], [2, 1]],
                color: '#FF6600'
            },
            {/*逆L字(J)を作成
                    □  
                    □□□
                */
                shape: [[0, 0], [0, 1], [1, 1], [2, 1]],
                color: 'blue'
            },
            {/*Z字を作成
                   □□
                    □□
                */
                shape: [[0, 0], [0, 1], [1, 1], [2, 1]],
                color: 'red'
            },
            {/*逆Z字(S字)を作成
                     □□
                    □□
                */
                shape: [[1, 0], [2, 0], [0, 1], [1, 1]],
                color: 'green'
            },
            {/*四角を作成
                   □□
                　 □□
                */
                shape: [[0, 0], [0, 1], [1, 0], [1, 1]],
                color: 'yellow'
            },
            {/*T字を作成
                    □
                   □□□
                */
                shape: [[0, 1], [1, 0], [1, 1], [2, 1]],
                color: '#FF66FF'
            }
        ];
        const array = sourceArr.concat();
        // Fisher–Yatesのアルゴリズム
        const arrayLength = array.length;
        for (let i = arrayLength - 1; i >= 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
        }
        return array;

    }
};

const createCanvasOutline = () => {

    const tetoris = new Tetoris();

    //context.lineWidthで線の幅を取得(1以上にすると線の幅も幅の計算に入る)
    tetoris.nextFallingContext.linewidth = 0;
    tetoris.fallingBlockContext.linewidth = 0;

    tetoris.nextFallingContext.strokeRect(0, 0, tetoris.nextFallingCanvasWidth, tetoris.nextFallingCanvasLength);

    /*----------枠を描画する----------*/
    tetoris.PaintFallingCanvas();
    /*--------------------------------*/

    tetoris.loopTimeField = 0;
    const intervalId = setInterval(() => {
        tetoris.fallingBlockContext.clearRect(0, 0, tetoris.fallingBlockCanvasWidth, tetoris.fallingBlockCanvasLength);

        //Blockを選択する(後々ここの0を変数に)
        for (let i = 0; i < tetoris.blocks[0].shape.length; i++) {
            tetoris.movingBlockField = [[tetoris.blocks[0].shape[i][0], tetoris.blocks[0].shape[i][1]], i];
        }

        //左上の色を塗る
        tetoris.fallingBlockContext.fillStyle = tetoris.blocks[0].color;

        for (let k = 0; k < tetoris.movingBlock.length; k++) {
            tetoris.fallingBlockContext.fillRect(tetoris.rectangleWidth * tetoris.movingBlock[k][0],
                tetoris.rectangleLength * tetoris.movingBlock[k][1] + tetoris.rectangleLength * tetoris.loopTime,
                tetoris.rectangleWidth, tetoris.rectangleLength);
            tetoris.movingBlockField = [[tetoris.rectangleWidth * tetoris.movingBlock[k][0], tetoris.rectangleLength * tetoris.movingBlock[k][1] + tetoris.rectangleLength * tetoris.loopTime], k];
        }
        if (tetoris.loopTime != 19) {
            tetoris.loopTimeField = tetoris.loopTime + 1;
        }

        window.onkeydown = (event) => {
            if (event.keyCode === 39) {
                console.log('右');
                tetoris.MoveRight(tetoris);
            }
            //左
            if (event.keyCode === 37) {
                console.log('左');
            }
            //上
            // if (event.keyCode === 38) {
            //     console.log('上');
            // }
            //下
            if (event.keyCode === 40) {
                console.log('下');
            }
        }


        //moveBlock();


        /*----------枠を描画する----------*/
        tetoris.PaintFallingCanvas();
        /*--------------------------------*/

        if (tetoris.loopTime === 1) {
            clearInterval(intervalId);
        }
        console.log(tetoris.loopTime);
    }, 1000);


    //右に90度回転する場合


    // //右下
    // fallingBlockContext.fillStyle = 'blue';
    // fallingBlockContext.fillRect(fallingBlockCanvasWidth - (fallingBlockCanvasWidth / 10), fallingBlockCanvasLength - (fallingBlockCanvasLength / 20), fallingBlockCanvasWidth / 10, fallingBlockCanvasLength / 20);
    // //右上
    // fallingBlockContext.fillStyle = 'green';
    // fallingBlockContext.fillRect((fallingBlockCanvasWidth / 10) * 9, (fallingBlockCanvasLength / 20) * 0, fallingBlockCanvasWidth / 10, fallingBlockCanvasLength / 20);
    // fallingBlockContext.fillRect((fallingBlockCanvasWidth / 10) * 9, (fallingBlockCanvasLength / 20) * 1, fallingBlockCanvasWidth / 10, fallingBlockCanvasLength / 20);
    // fallingBlockContext.fillRect((fallingBlockCanvasWidth / 10) * 9, (fallingBlockCanvasLength / 20) * 2, fallingBlockCanvasWidth / 10, fallingBlockCanvasLength / 20);
    // fallingBlockContext.fillRect((fallingBlockCanvasWidth / 10) * 9, (fallingBlockCanvasLength / 20) * 3, fallingBlockCanvasWidth / 10, fallingBlockCanvasLength / 20);
    // console.log('a');
    // //左下
    // fallingBlockContext.fillStyle = 'yellow';
    // fallingBlockContext.fillRect(0, fallingBlockCanvasLength - (fallingBlockCanvasLength / 20), fallingBlockCanvasWidth / 10, fallingBlockCanvasLength / 20);
    // fallingBlockContext.fillRect((fallingBlockCanvasWidth / 10) * 1, (fallingBlockCanvasLength / 20) * 18, fallingBlockCanvasWidth / 10, fallingBlockCanvasLength / 20);
    // fallingBlockContext.fillRect((fallingBlockCanvasWidth / 10) * 1, (fallingBlockCanvasLength / 20) * 19, fallingBlockCanvasWidth / 10, fallingBlockCanvasLength / 20);
    // fallingBlockContext.fillRect((fallingBlockCanvasWidth / 10) * 2, (fallingBlockCanvasLength / 20) * 18, fallingBlockCanvasWidth / 10, fallingBlockCanvasLength / 20);
    // console.log('b');

}

createCanvasOutline();

//console.log(blocks[0].shape[3][0]);
//上記の場合、block[blockの中の配列番号].shape[0~3つの配列の中から1つ][0,1のどちらか]

/*Todo
・ブロックの回転＋回転ボタンの実装
・次に落ちるブロックを表示し、そのブロックを落とす枠に表示
・どうやって落ちたブロックを残す？？
・1行揃ったら行消す
*/

//9/9動かす
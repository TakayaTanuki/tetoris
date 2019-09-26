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

        this.loopCount = 0;
        this.rorateCount = 0;
        this.movingBlock = [[0, 0], [0, 0], [0, 0], [0, 0]];
        this.nextBlock = [[0, 0], [0, 0], [0, 0], [0, 0]];
        this.allBlocksList = [];

        this.blocks = this.CreateBlocks();
        this.movingBlockColor = this.blocks[this.loopCount].color;
        this.nextBlockColor = this.blocks[this.loopCount + 1].color;

        window.onkeydown = (event) => {
            //右
            if (event.keyCode === 39) {
                console.log('右');
                this.MoveRight();
            }
            //左
            if (event.keyCode === 37) {
                console.log('左');
                this.MoveLeft();
            }
            //上
            if (event.keyCode === 38) {
                this.Rotate();
            }
            //下
            if (event.keyCode === 40) {
                console.log('下');
                this.MoveDown();
            }
            // if (event.keyCode === 13) {
            //     console.log('Enter');
            // }
        }

        document.querySelector('.rotateButton').addEventListener('click', event => {
            this.Rotate();
        });

        document.querySelector('.moveLeftButton').addEventListener('mousedown', event => {
            this.MoveLeft();
        });
        document.querySelector('.moveDownButton').addEventListener('mousedown', event => {
            this.MoveDown();
        });
        document.querySelector('.moveRightButton').addEventListener('mousedown', event => {
            this.MoveRight();
        });


    }

    set movingBlockField(value) {
        this.movingBlock[value[1]] = value[0];
    }

    get movingBlockField() {
        return this.movingBlock;
    }

    set nextBlockField(value) {
        this.nextBlock[value[1]] = value[0];
    }

    get nextBlockField() {
        return this.nextBlock;
    }

    set rorateCountField(value) {
        if (this.rorateCount === 3) {
            this.rorateCount = 0;
        } else {
            this.rorateCount = value;
        }
    }

    get rorateCountField() {
        return this.rorateCount;
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
        //一旦描画したものを初期化する必要がある
        this.fallingBlockContext.clearRect(0, 0, this.fallingBlockCanvasWidth, this.fallingBlockCanvasLength);
        this.fallingBlockContext.fillStyle = this.blocks[this.loopCount].color;

        //移動する前のブロックを保持(let cloneBlock = this.movingBlockだと参照先が渡されるので、配列の値をコピーして代入する必要有
        let cloneBlock = this.movingBlock.concat();

        //一旦movingBlockに加算
        for (let i = 0; i < this.movingBlock.length; i++) {
            this.movingBlockField = [[this.movingBlock[i][0] + this.rectangleWidth, this.movingBlock[i][1], this.rectangleWidth, this.rectangleLength], i];
        }
        //加算した結果、canvasの範囲を超える場合は、cloneBlockを代入する
        if (this.CheckMoveAndRotate(this.movingBlock) === false) {
            this.movingBlock = cloneBlock;
        }
        //movingBlockを描画
        for (let i = 0; i < this.movingBlock.length; i++) {
            this.fallingBlockContext.fillRect(this.movingBlock[i][0], this.movingBlock[i][1], this.rectangleWidth, this.rectangleLength);
        }
        /*----------存在する全てのブロックを表示する----------*/
        this.DisplayAllBlocks();
        /*-------------------------------------------------*/

    }

    MoveLeft() {
        this.fallingBlockContext.clearRect(0, 0, this.fallingBlockCanvasWidth, this.fallingBlockCanvasLength);
        this.fallingBlockContext.fillStyle = this.blocks[this.loopCount].color;

        let cloneBlock = this.movingBlock.concat();

        for (let i = 0; i < this.movingBlock.length; i++) {
            this.movingBlockField = [[this.movingBlock[i][0] - this.rectangleWidth, this.movingBlock[i][1], this.rectangleWidth, this.rectangleLength], i];
        }
        if (this.CheckMoveAndRotate(this.movingBlock) === false) {
            this.movingBlock = cloneBlock;
        }
        //movingBlockを描画
        for (let i = 0; i < this.movingBlock.length; i++) {
            this.fallingBlockContext.fillRect(this.movingBlock[i][0], this.movingBlock[i][1], this.rectangleWidth, this.rectangleLength);
        }

        /*----------存在する全てのブロックを表示する----------*/
        this.DisplayAllBlocks();
        /*-------------------------------------------------*/


    }

    MoveDown() {

        if (this.CheckMoveDown(this.movingBlock)) {
            this.fallingBlockContext.clearRect(0, 0, this.fallingBlockCanvasWidth, this.fallingBlockCanvasLength);
            this.fallingBlockContext.fillStyle = this.blocks[this.loopCount].color;

            for (let i = 0; i < this.movingBlock.length; i++) {
                this.fallingBlockContext.fillRect(this.movingBlock[i][0], this.movingBlock[i][1] + this.rectangleLength, this.rectangleWidth, this.rectangleLength);
                this.movingBlockField = [[this.movingBlock[i][0], this.movingBlock[i][1] + this.rectangleLength, this.rectangleWidth, this.rectangleLength], i];
            }
            /*----------存在する全てのブロックを表示する----------*/
            this.DisplayAllBlocks();
            /*-------------------------------------------------*/

        }
    }

    //右回転
    Rotate() {
        this.fallingBlockContext.clearRect(0, 0, this.fallingBlockCanvasWidth, this.fallingBlockCanvasLength);
        this.fallingBlockContext.fillStyle = this.blocks[this.loopCount].color;
        let cloneBlock;
        //Blockの中を入れ替える
        if (this.movingBlockColor === 'yellow') {
            //四角用
            cloneBlock = this.movingBlock;
            this.movingBlock = [this.movingBlock[2], this.movingBlock[0], this.movingBlock[3], this.movingBlock[1]];
            if (this.CheckMoveAndRotate(this.movingBlock) === false) {
                this.movingBlock = cloneBlock;
            } else {
                this.rorateCountField = this.rorateCount + 1;
            }
        } else if (this.movingBlockColor === '#FF66FF') {
            //T字用
            cloneBlock = this.movingBlock;
            this.movingBlock = [this.movingBlock[1], this.movingBlock[3], this.movingBlock[2], this.InvertCenter(this.movingBlock[3])];
            if (this.CheckMoveAndRotate(this.movingBlock) === false) {
                this.movingBlock = cloneBlock;
            } else {
                this.rorateCountField = this.rorateCount + 1;
            }
        } else if (this.movingBlockColor === 'green') {
            //S字用
            cloneBlock = this.movingBlock;
            this.movingBlock = [this.movingBlock[3], this.InvertEdge(this.movingBlock[1]), this.movingBlock[2], this.InvertCenterForS(this.movingBlock[3])];
            if (this.CheckMoveAndRotate(this.movingBlock) === false) {
                this.movingBlock = cloneBlock;
            } else {
                this.rorateCountField = this.rorateCount + 1;
            }
        } else if (this.movingBlockColor === 'red') {
            //Z字用
            cloneBlock = this.movingBlock;
            this.movingBlock = [this.InvertEdgeForZ(this.movingBlock[0]), this.movingBlock[3], this.movingBlock[2], this.InvertCenter(this.movingBlock[3])];
            if (this.CheckMoveAndRotate(this.movingBlock) === false) {
                this.movingBlock = cloneBlock;
            } else {
                this.rorateCountField = this.rorateCount + 1;
            }
        } else if (this.movingBlockColor === 'blue') {
            //J字用
            cloneBlock = this.movingBlock;
            this.movingBlock = [this.InvertEdgeForZ(this.movingBlock[0]), this.InvertCenterForJ(this.movingBlock[1]), this.movingBlock[2], this.InvertCenter(this.movingBlock[3])];
            if (this.CheckMoveAndRotate(this.movingBlock) === false) {
                this.movingBlock = cloneBlock;
            } else {
                this.rorateCountField = this.rorateCount + 1;
            }
        } else if (this.movingBlockColor === '#FF6600') {
            //L字用
            cloneBlock = this.movingBlock;
            this.movingBlock = [this.InvertEdge(this.movingBlock[0]), this.InvertCenterForJ(this.movingBlock[1]), this.movingBlock[2], this.InvertCenter(this.movingBlock[3])];
            if (this.CheckMoveAndRotate(this.movingBlock) === false) {
                this.movingBlock = cloneBlock;
            } else {
                this.rorateCountField = this.rorateCount + 1;
            }
        } else if (this.movingBlockColor === 'aqua') {
            //横棒用
            cloneBlock = this.movingBlock;
            this.movingBlock = [this.InvertCenterForJ(this.movingBlock[0]), this.movingBlock[1], this.InvertCenter(this.movingBlock[2]), this.InvertCenterForBar(this.movingBlock[3])];
            if (this.CheckMoveAndRotate(this.movingBlock) === false) {
                this.movingBlock = cloneBlock;
            } else {
                this.rorateCountField = this.rorateCount + 1;
            }
        }

        for (let i = 0; i < this.movingBlock.length; i++) {
            this.fallingBlockContext.fillRect(this.movingBlock[i][0], this.movingBlock[i][1], this.rectangleWidth, this.rectangleLength);
        }
        /*----------存在する全てのブロックを表示する----------*/
        this.DisplayAllBlocks();
        /*-------------------------------------------------*/

    }

    InvertCenter(targetBlock) {
        let invertedBlock;
        if (this.rorateCount === 0) {
            invertedBlock = [targetBlock[0] - this.rectangleWidth, targetBlock[1] + this.rectangleLength];
        } else if (this.rorateCount === 1) {
            invertedBlock = [targetBlock[0] - this.rectangleWidth, targetBlock[1] - this.rectangleLength];
        } else if (this.rorateCount === 2) {
            invertedBlock = [targetBlock[0] + this.rectangleWidth, targetBlock[1] - this.rectangleLength];
        } else if (this.rorateCount === 3) {
            invertedBlock = [targetBlock[0] + this.rectangleWidth, targetBlock[1] + this.rectangleLength];
        }
        return invertedBlock;
    }

    InvertCenterForS(targetBlock) {
        let invertedBlock;
        if (this.rorateCount === 1) {
            invertedBlock = [targetBlock[0] - this.rectangleWidth, targetBlock[1] + this.rectangleLength];
        } else if (this.rorateCount === 2) {
            invertedBlock = [targetBlock[0] - this.rectangleWidth, targetBlock[1] - this.rectangleLength];
        } else if (this.rorateCount === 3) {
            invertedBlock = [targetBlock[0] + this.rectangleWidth, targetBlock[1] - this.rectangleLength];
        } else if (this.rorateCount === 0) {
            invertedBlock = [targetBlock[0] + this.rectangleWidth, targetBlock[1] + this.rectangleLength];
        }
        return invertedBlock;
    }

    InvertCenterForJ(targetBlock) {
        let invertedBlock;
        if (this.rorateCount === 2) {
            invertedBlock = [targetBlock[0] - this.rectangleWidth, targetBlock[1] + this.rectangleLength];
        } else if (this.rorateCount === 3) {
            invertedBlock = [targetBlock[0] - this.rectangleWidth, targetBlock[1] - this.rectangleLength];
        } else if (this.rorateCount === 0) {
            invertedBlock = [targetBlock[0] + this.rectangleWidth, targetBlock[1] - this.rectangleLength];
        } else if (this.rorateCount === 1) {
            invertedBlock = [targetBlock[0] + this.rectangleWidth, targetBlock[1] + this.rectangleLength];
        }
        return invertedBlock;
    }

    InvertEdge(targetBlock) {
        let invertedBlock;
        if (this.rorateCount === 0) {
            invertedBlock = [targetBlock[0], targetBlock[1] + 2 * this.rectangleLength];
        } else if (this.rorateCount === 1) {
            invertedBlock = [targetBlock[0] - 2 * this.rectangleWidth, targetBlock[1]];
        } else if (this.rorateCount === 2) {
            invertedBlock = [targetBlock[0], targetBlock[1] - 2 * this.rectangleLength];
        } else if (this.rorateCount === 3) {
            invertedBlock = [targetBlock[0] + 2 * this.rectangleWidth, targetBlock[1]];
        }
        return invertedBlock;
    }

    InvertEdgeForZ(targetBlock) {
        let invertedBlock;
        if (this.rorateCount === 1) {
            invertedBlock = [targetBlock[0], targetBlock[1] + 2 * this.rectangleLength];
        } else if (this.rorateCount === 2) {
            invertedBlock = [targetBlock[0] - 2 * this.rectangleWidth, targetBlock[1]];
        } else if (this.rorateCount === 3) {
            invertedBlock = [targetBlock[0], targetBlock[1] - 2 * this.rectangleLength];
        } else if (this.rorateCount === 0) {
            invertedBlock = [targetBlock[0] + 2 * this.rectangleWidth, targetBlock[1]];
        }
        return invertedBlock;
    }

    InvertCenterForBar(targetBlock) {
        let invertedBlock;
        if (this.rorateCount === 0) {
            invertedBlock = [targetBlock[0] - 2 * this.rectangleWidth, targetBlock[1] + 2 * this.rectangleLength];
        } else if (this.rorateCount === 1) {
            invertedBlock = [targetBlock[0] - 2 * this.rectangleWidth, targetBlock[1] - 2 * this.rectangleLength];
        } else if (this.rorateCount === 2) {
            invertedBlock = [targetBlock[0] + 2 * this.rectangleWidth, targetBlock[1] - 2 * this.rectangleLength];
        } else if (this.rorateCount === 3) {
            invertedBlock = [targetBlock[0] + 2 * this.rectangleWidth, targetBlock[1] + 2 * this.rectangleLength];
        }
        return invertedBlock;
    }

    CheckMoveAndRotate(targetBlock) {
        let flgMoveAndRorate = true;
        for (let i = 0; i < targetBlock.length; i++) {
            if (targetBlock[i][0] >= this.fallingBlockCanvasWidth || targetBlock[i][0] < 0) {
                flgMoveAndRorate = false;
            }
        }
        return flgMoveAndRorate;
    }

    //下に移動できるかどうかチェック
    CheckMoveDown(targetBlock) {
        let flgMoveDown = true;
        for (let i = 0; i < targetBlock.length; i++) {
            //落下中のブロックが底からはみ出してしまうかチェック
            if (targetBlock[i][1] + this.rectangleLength >= this.fallingBlockCanvasLength/* || targetBlock[i][1] < 0*/) {
                flgMoveDown = false;
            }
            //表示されている全ブロックと比較し、ブロックが重なってしまうかチェック
            this.allBlocksList.forEach((value) => {
                for (let l = 0; l < value.shape.length; l++) {
                    if (targetBlock[i][1] + this.rectangleLength === value.shape[l][1] && targetBlock[i][0] === value.shape[l][0]) {
                        flgMoveDown = false;
                        break;
                    }
                }
            });
        }
        return flgMoveDown;
    }

    CreateBlocks() {
        // 元の配列の複製を作成
        let sourceArr = [
            {/*T字を作成
                    □
                   □□□
                */
                shape: [[0, 1], [1, 0], [1, 1], [2, 1]],
                color: '#FF66FF'
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
                shape: [[0, 0], [1, 0], [1, 1], [2, 1]],
                color: 'red'
            },
            {/*逆Z字(S字)を作成
                     □□
                    □□
                */
                shape: [[0, 1], [2, 0], [1, 1], [1, 0]],
                color: 'green'
            },
            {/*四角を作成
                   □□
                　 □□
                */
                shape: [[0, 0], [0, 1], [1, 0], [1, 1]],
                color: 'yellow'
            },

            {/*横長棒を作成
                □□□□
            */
                shape: [[0, 0], [1, 0], [2, 0], [3, 0]],
                color: 'aqua'
            },


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

    DisplayNextBlock() {
        this.nextFallingContext.clearRect(0, 0, this.nextFallingCanvasWidth, this.nextFallingCanvasLength);

        this.nextFallingContext.fillStyle = this.nextBlockColor;
        for (let i = 0; i < this.blocks[this.loopCount + 1].shape.length; i++) {
            this.nextFallingContext.fillRect(this.nextBlock[i][0], this.nextBlock[i][1] + this.rectangleLength,
                this.rectangleWidth, this.rectangleLength);
        }

        //横幅の色を塗る
        for (let i = 0; i < this.stateWidth; i++) {
            this.nextFallingContext.strokeRect(i * this.rectangleWidth, 0, this.fallingBlockCanvasWidth, this.fallingBlockCanvasLength);
        }
        //縦幅の色を塗る
        for (let l = 0; l < 5; l++) {
            this.nextFallingContext.strokeRect(0, l * this.rectangleLength, this.fallingBlockCanvasWidth, this.fallingBlockCanvasLength);
        }

    }

    DisplayAllBlocks() {
        //Listの中身を全表示することで、全てのブロックを表示する
        this.allBlocksList.forEach((value) => {
            this.fallingBlockContext.fillStyle = value.color;
            for (let i = 0; i < value.shape.length; i++) {
                this.fallingBlockContext.fillRect(value.shape[i][0], value.shape[i][1], this.rectangleWidth, this.rectangleLength);
            }
        });
        //枠線の描画
        this.PaintFallingCanvas();
    }

    //Canvas内に揃った行があるかどうか調べる
    CheckRowComplete() {
        //1行を大きなループとする
        for (let i = 0; i < this.stateLength; i++) {
            //1列毎にブロックが存在するかチェック
            for (let l = 0; l < this.stateWidth; l++) {
                let existBlockFlag = null;
                for (let k = 0; k < 4; k++) {
                    existBlockFlag = this.allBlocksList.some(block => block.shape[k][0] === l * this.rectangleWidth
                        && block.shape[k][1] === (this.stateLength - (i + 1)) * this.rectangleLength);
                    if (existBlockFlag) {
                        break;
                    }
                }
                if (!existBlockFlag) {
                    break;
                }
                if (l === 9 && existBlockFlag) {
                    //配列の要素を消去
                    console.log(`${this.stateLength - (i + 1)}の行が1列揃いました！`);
                }
            }
        }

    }


};

const createCanvasOutline = (tetoris) => {

    //context.lineWidthで線の幅を取得(1以上にすると線の幅も幅の計算に入る)
    tetoris.nextFallingContext.linewidth = 0;
    tetoris.fallingBlockContext.linewidth = 0;

    tetoris.nextFallingContext.strokeRect(0, 0, tetoris.nextFallingCanvasWidth, tetoris.nextFallingCanvasLength);

    /*----------枠を描画する----------*/
    tetoris.PaintFallingCanvas();
    /*--------------------------------*/
    //Blockを選択する
    for (let i = 0; i < tetoris.blocks[tetoris.loopCount].shape.length; i++) {
        tetoris.movingBlockField = [[tetoris.rectangleWidth * tetoris.blocks[tetoris.loopCount].shape[i][0]
            + 3 * tetoris.rectangleWidth, tetoris.rectangleLength * tetoris.blocks[tetoris.loopCount].shape[i][1] - tetoris.rectangleLength], i];
    }

    //次に落ちるBlockを選択する
    for (let i = 0; i < tetoris.blocks[tetoris.loopCount + 1].shape.length; i++) {
        tetoris.nextBlockField = [[tetoris.rectangleWidth * tetoris.blocks[tetoris.loopCount + 1].shape[i][0]
            + 3 * tetoris.rectangleWidth, tetoris.rectangleLength * tetoris.blocks[tetoris.loopCount + 1].shape[i][1]], i];
    }

    tetoris.DisplayNextBlock();
    tetoris.rorateCount = 0;

    const intervalId = setInterval(() => {

        //左上の色を塗る
        tetoris.fallingBlockContext.fillStyle = tetoris.blocks[tetoris.loopCount].color;

        const loopFlag = tetoris.CheckMoveDown(tetoris.movingBlock);
        if (loopFlag) {
            tetoris.fallingBlockContext.clearRect(0, 0, tetoris.fallingBlockCanvasWidth, tetoris.fallingBlockCanvasLength);

            for (let i = 0; i < tetoris.movingBlock.length; i++) {
                tetoris.fallingBlockContext.fillRect(tetoris.movingBlock[i][0], tetoris.movingBlock[i][1] + tetoris.rectangleLength,
                    tetoris.rectangleWidth, tetoris.rectangleLength);
                tetoris.movingBlockField = [[tetoris.movingBlock[i][0], tetoris.movingBlock[i][1] + tetoris.rectangleLength], i];
            }
            tetoris.DisplayAllBlocks();
        } else {
            clearInterval(intervalId);
            tetoris.allBlocksList.push(
                {
                    shape: tetoris.movingBlock.concat(),
                    color: tetoris.movingBlockColor
                });
            tetoris.CheckRowComplete();
            //ループが終了し、次に落ちるブロックを落下中のブロックとし、次に落ちるブロックに新たなブロックを追加
            // if (tetoris.loopCount !== 6) {
            //     tetoris.loopCount++;
            // } else {
            //     tetoris.loopCount = 0;
            // }

            createCanvasOutline(tetoris);
        }

    }, 1000);
    console.log(5);
}
const tetoris = new Tetoris();
createCanvasOutline(tetoris);

//console.log(blocks[0].shape[3][0]);
//上記の場合、block[blockの中の配列番号].shape[0~3つの配列の中から1つ][0,1のどちらか]

/*Todo
・1行揃ったら行消す
・ループが終了し、次に落ちるブロックを落下中のブロックとし、次に落ちるブロックに新たなブロックを追加
*/

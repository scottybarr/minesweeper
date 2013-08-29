(function() {
    "use strict";
    var MineSweeper, __bind, __indexOf;

    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
    __indexOf = function(value, arr) { var i; for (i = 0; i < arr.length; i++) { if (arr[i] === value) { return i; } } return -1; };

    new (MineSweeper = (function() {
        var cells, gameOver, minePositions, mines, revealedCells, selectorCache;

        cells = 8;
        mines = 10;
        selectorCache = {};
        minePositions = [];
        gameOver = false;
        revealedCells = 0;

        function MineSweeper() {
            this.createBoard();
            this.initEvents();
            this.generateMines();
            this.generateValues();
        }

        MineSweeper.prototype.createBoard = function() {
            var div, elem, i, input, j;
            elem = this.getId("board");
            for (i = 1; i <= cells; i++) {
                div = document.createElement('div');
                for (j = 1; j <= cells; j++) {
                    input = document.createElement('input');
                    input.className = "cell";
                    input.id = this.idForPosition({'row': i, 'cell': j});
                    input.setAttribute('data-row', i);
                    input.setAttribute('data-cell', j);
                    div.appendChild(input);
                }
                elem.appendChild(div);
            }
        };

        MineSweeper.prototype.gameOver = function() {
            if (!gameOver) {
                this.getId('result').innerHTML = "GAME OVER! ☹";
                this.revealMines();
            }
        };

        MineSweeper.prototype.initEvents = function() {
            var cellArr, i;
            this.onCellClick = __bind(this.onCellClick, this);
            cellArr = this.getClass('cell');
            for (i = 0; i < cellArr.length; i++) {
                cellArr[i].addEventListener('click', this.onCellClick);
            }
        };

        MineSweeper.prototype.onCellClick = function(e) {
            e.srcElement.blur();
            this.revealCell(e.srcElement);
        };

        MineSweeper.prototype.revealCell = function(elem) {
            var pos, value;
            if (elem.value === "" && elem.getAttribute('disabled') !== "disabled") {
                revealedCells++;
                value = elem.getAttribute('data-value');
                if (value === 'M') {
                    elem.value = '*';
                    return this.gameOver();
                } else if (value === '0') {
                    elem.setAttribute('disabled', 'disabled');
                    elem.className += " deadcell";
                    pos = {
                        'row': parseInt(elem.getAttribute('data-row'), 10),
                        'cell': parseInt(elem.getAttribute('data-cell'), 10)
                    };
                    this.revealSafePositions(pos);
                } else {
                    elem.className += " val" + value;
                    elem.value = value;
                }
            }
            this.checkGame();
            return false;
        };

        MineSweeper.prototype.getElement = function(func, elemName) {
            if (selectorCache[elemName] !== undefined && selectorCache[elemName] !== null) {
                return selectorCache[elemName];
            }
            selectorCache[elemName] = document[func](elemName);
            return selectorCache[elemName];
        };

        MineSweeper.prototype.getId = function(id) {
            return this.getElement('getElementById', id);
        };

        MineSweeper.prototype.getClass = function(className) {
            return this.getElement('getElementsByClassName', className);
        };

        MineSweeper.prototype.generateMines = function() {
            var id;
            while (minePositions.length < mines) {
                id = this.idForPosition(this.generatePosition());
                if (__indexOf(id, minePositions) === -1) {
                    minePositions.push(id);
                    this.setDataValue(id, 'M');
                }
            }
        };

        MineSweeper.prototype.randomNumber = function() {
            var min = 1;
            return Math.floor(Math.random() * (cells - min + 1) + min);
        };

        MineSweeper.prototype.generatePosition = function() {
            return {
                'row': this.randomNumber(),
                'cell': this.randomNumber()
            };
        };

        MineSweeper.prototype.idForPosition = function(pos) {
            return ['row', pos.row, 'cell', pos.cell].join('');
        };

        MineSweeper.prototype.setDataValue = function(id, value) {
            return this.getId(id).setAttribute('data-value', value);
        };

        MineSweeper.prototype.getDataValue = function(id) {
            var elem;
            elem = this.getId(id);
            if (elem !== undefined && elem !== null) {
                return elem.getAttribute('data-value');
            }
            return 0;
        };

        MineSweeper.prototype.getSurroundingCells = function(pos) {
            return {
                'tl': this.idForPosition({'row': pos.row - 1, 'cell': pos.cell - 1}),
                't': this.idForPosition({'row': pos.row - 1, 'cell': pos.cell}),
                'tr': this.idForPosition({'row': pos.row - 1, 'cell': pos.cell + 1}),
                'l': this.idForPosition({'row': pos.row, 'cell': pos.cell - 1}),
                'r': this.idForPosition({'row': pos.row, 'cell': pos.cell + 1}),
                'bl': this.idForPosition({'row': pos.row + 1, 'cell': pos.cell - 1}),
                'b': this.idForPosition({'row': pos.row + 1, 'cell': pos.cell}),
                'br': this.idForPosition({'row': pos.row + 1, 'cell': pos.cell + 1})
            };
        };

        MineSweeper.prototype.revealSafePositions = function(pos) {
            var elem, k, surroundingCells, v;
            surroundingCells = this.getSurroundingCells(pos);
            for (k in surroundingCells) {
                if (surroundingCells.hasOwnProperty(k)) {
                    v = this.getDataValue(surroundingCells[k]);
                    if (v === '0') {
                        elem = this.getId(surroundingCells[k]);
                        this.revealCell(elem);
                    }
                }
            }
        };

        MineSweeper.prototype.getSurroundingMines = function(pos) {
            var k, surroundingCells, surroundingMines, v;
            surroundingMines = 0;
            surroundingCells = this.getSurroundingCells(pos);
            for (k in surroundingCells) {
                if (surroundingCells.hasOwnProperty(k)) {
                    v = this.getDataValue(surroundingCells[k]);
                    if (v === 'M') {
                        surroundingMines++;
                    }
                }
            }
            return surroundingMines;
        };

        MineSweeper.prototype.generateValues = function() {
            var i, id, j, pos;
            for (i = 1; i <= cells; i++) {
                for (j = 1; j <= cells; j++) {
                    pos = {'row': i, 'cell': j};
                    id = this.idForPosition(pos);
                    if (this.getDataValue(id) !== 'M') {
                        this.setDataValue(id, this.getSurroundingMines(pos));
                    }
                }
            }
        };

        MineSweeper.prototype.revealMines = function() {
            var elem, i;
            gameOver = true;
            for (i = 0; i < minePositions.length; i++) {
                elem = this.getId(minePositions[i]);
                this.revealCell(elem);
            }
        };

        MineSweeper.prototype.checkGame = function() {
            var totalCells;
            totalCells = cells * cells;
            if (totalCells - revealedCells === mines && !gameOver) {
                this.getId('result').innerHTML = "YOU WIN! ☺";
            }
        };

      return MineSweeper;

    }).call(this));
})();
export class Grid {
    size: number;
    cells: number[][];

    constructor(size = 4) {
        this.size = size;
        this.cells = Array.from({ length: size }, () => Array(size).fill(0));
    }

    addRandomTile() {
        const empty = this.getEmptyCells();
        if (empty.length === 0) return;
        const [x, y] = empty[Math.floor(Math.random() * empty.length)];
        const rand = Math.random();
        if (rand < 0.9) {
            this.cells[x][y] = 2;
        } else if (rand < 0.995) {
            this.cells[x][y] = 4;
        } else {
            console.log("Easter Egg! You got an 8 tile!");
            this.cells[x][y] = 8;
        }
    }

    getEmptyCells(): [number, number][] {
        const empty: [number, number][] = [];
        for (let i = 0; i < this.size; i++)
            for (let j = 0; j < this.size; j++)
                if (this.cells[i][j] === 0)
                    empty.push([i, j]);
        return empty;
    }

    isGameOver(): boolean {
        if (this.getEmptyCells().length > 0)
            return false;

        for (let i = 0; i < this.size; i++)
            for (let j = 0; j < this.size; j++) {
                // checks neighbours of current cell to see if there are any possible merges
                // when the board is full

                //check top
                if (i > 0 && this.cells[i][j] == this.cells[i - 1][j])
                    return false;

                //check bottom
                if (i < this.size - 1 && this.cells[i][j] == this.cells[i + 1][j])
                    return false;

                //check left
                if (j > 0 && this.cells[i][j] == this.cells[i][j - 1])
                    return false;

                //check right
                if (j < this.size - 1 && this.cells[i][j] == this.cells[i][j + 1])
                    return false;
            }

        return true; // no moves left
    }

    private compressArray(array: number[]): { newArray: number[], points: number } {
        let points = 0;
        let filtered = array.filter(v => v !== 0);

        for (let i = 0; i < filtered.length - 1; i++) {
            if (filtered[i] === filtered[i + 1]) {
                filtered[i] *= 2;
                points += filtered[i];       // add merged value to points
                filtered[i + 1] = 0;
            }
        }

        filtered = filtered.filter(v => v !== 0);

        while (filtered.length < this.size) {
            filtered.push(0);
        }

        return { newArray: filtered, points };
    }


    private arraysEqual(a: number[], b: number[]): boolean {
        return a.length === b.length && a.every((val, idx) => val === b[idx]);
    }

    moveLeft(): { moved: boolean; score: number } {
        let moved = false;
        let score = 0;

        for (let i = 0; i < this.size; i++) {
            const row = this.cells[i];
            const { newArray, points } = this.compressArray(row);
            if (!this.arraysEqual(row, newArray)) {
                this.cells[i] = newArray;
                moved = true;
                score += points;
            }
        }

        return { moved, score };
    }

    moveRight(): { moved: boolean; score: number } {
        let moved = false;
        let score = 0;

        for (let i = 0; i < this.size; i++) {
            const row = this.cells[i];
            const { newArray, points } = this.compressArray([...row].reverse());
            const finalRow = newArray.reverse();

            if (!this.arraysEqual(row, finalRow)) {
                this.cells[i] = finalRow;
                moved = true;
                score += points;
            }
        }

        return { moved, score };
    }

    moveUp(): { moved: boolean; score: number } {
        let moved = false;
        let score = 0;

        for (let j = 0; j < this.size; j++) {
            const col: number[] = [];
            for (let i = 0; i < this.size; i++) col.push(this.cells[i][j]);

            const { newArray, points } = this.compressArray(col);

            if (!this.arraysEqual(col, newArray)) {
                for (let i = 0; i < this.size; i++) this.cells[i][j] = newArray[i];
                moved = true;
                score += points;
            }
        }

        return { moved, score };
    }

    moveDown(): { moved: boolean; score: number } {
        let moved = false;
        let score = 0;

        for (let j = 0; j < this.size; j++) {
            const col: number[] = [];
            for (let i = 0; i < this.size; i++) col.push(this.cells[i][j]);

            const { newArray, points } = this.compressArray([...col].reverse());
            const finalCol = newArray.reverse();

            if (!this.arraysEqual(col, finalCol)) {
                for (let i = 0; i < this.size; i++) this.cells[i][j] = finalCol[i];
                moved = true;
                score += points;
            }
        }

        return { moved, score };
    }
}
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
        this.cells[x][y] = Math.random() < 0.9 ? 2 : 4;
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

    private compressArray(array: number[]): number[] {
        let filtered = array.filter(v => v !== 0);

        for (let i = 0; i < filtered.length - 1; i++) {
            if (filtered[i] === filtered[i + 1]) {
                filtered[i] *= 2;
                filtered[i + 1] = 0; // mark merged tile
            }
        }

        filtered = filtered.filter(v => v !== 0);

        while (filtered.length < this.size) {
            filtered.push(0);
        }

        return filtered;
    }

    private arraysEqual(a: number[], b: number[]): boolean {
        return a.length === b.length && a.every((val, idx) => val === b[idx]);
    }

    moveRight(): boolean {
        let moved = false;

        for (let i = 0; i < this.size; i++) {
            const row = this.cells[i];
            const newRow = this.compressArray(row.reverse()).reverse();

            if (!this.arraysEqual(row, newRow)) {
                this.cells[i] = newRow;
                moved = true;
            }
        }

        return moved;
    }

    moveLeft(): boolean {
        let moved = false;

        for (let i = 0; i < this.size; i++) {
            const row = this.cells[i];
            const newRow = this.compressArray(row);

            if (!this.arraysEqual(row, newRow)) {
                this.cells[i] = newRow;
                moved = true;
            }
        }

        return moved;
    }

    moveDown(): boolean {
        let moved = false;
        for (let j = 0; j < this.size; j++) {
            let col = [];
            for (let i = 0; i < this.size; i++)
                col.push(this.cells[i][j]);

            const newCol = this.compressArray(col.reverse()).reverse();

            if (!this.arraysEqual(col, newCol)) {
                for (let i = 0; i < this.size; i++)
                    this.cells[i][j] = newCol[i]
                moved = true;
            }
        }

        return moved;
    }
    moveUp(): boolean {
        let moved = false;
        for (let j = 0; j < this.size; j++) {
            let col = [];
            for (let i = 0; i < this.size; i++)
                col.push(this.cells[i][j]);

            const newCol = this.compressArray(col);

            if (!this.arraysEqual(col, newCol)) {
                for (let i = 0; i < this.size; i++)
                    this.cells[i][j] = newCol[i]
                moved = true;
            }
        }

        return moved;
    }
}
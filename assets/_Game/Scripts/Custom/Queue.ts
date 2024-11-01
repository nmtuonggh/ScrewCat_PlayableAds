
export class Queue<T> {
    private items: T[] = [];

    // Thêm phần tử vào hàng đợi
    enqueue(item: T): void {
        this.items.push(item);
    }

    // Loại bỏ phần tử khỏi hàng đợi
    dequeue(): T | undefined {
        return this.items.shift();
    }

    // Kiểm tra xem hàng đợi có rỗng không
    isEmpty(): boolean {
        return this.items.length === 0;
    }

    // Lấy phần tử đầu tiên trong hàng đợi mà không loại bỏ nó
    peek(): T | undefined {
        return this.items[0];
    }

    // Lấy kích thước của hàng đợi
    size(): number {
        return this.items.length;
    }

    toArray(): T[] {
        return this.items;
    }
}



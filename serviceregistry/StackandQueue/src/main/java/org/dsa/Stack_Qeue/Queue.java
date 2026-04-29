package org.dsa.Stack_Qeue;

public class Queue {
    int[] queue;
    int front;
    int rear;
    int size;
    public Queue(int size){
        this.size=size;
        queue = new int[size];
        front = -1;
        rear = -1;
    }
    public boolean isEmpty(){
        return front == -1 || front>rear;
    }
    public boolean isFull(){
        return rear==size-1;
    }
    public int size(){
        return rear-front+1;
    }
    public void enqueue(int value){
        if(isFull()){
            System.out.println("Queue is full");
        }
        if(front == -1){
            front = 0;
        }
        rear++;
        queue[rear] = value;

    }
    public int dequeue(){
        if(isEmpty()){
            System.out.println("Queue is empty");
        }
        int value = queue[front];
        queue[front++] = 0;
        return value;
    }
    public int peek(){
        if(isEmpty()){
            System.out.println("Queue is empty");
        }
        return queue[front];
    }
    public void printQueue(){
        if(isEmpty()){
            System.out.println("Queue is empty");
        }
        for(int i = front; i <= rear; i++){
            System.out.print(queue[i] + " ");
        }
    }

    static void main() {
        Queue q = new Queue(10);
        q.enqueue(1);
        q.enqueue(2);
        q.enqueue(3);
        q.enqueue(4);
        q.enqueue(5);
        q.printQueue();
        System.out.println();
        System.out.println(q.dequeue());
        q.printQueue();
        System.out.println();
        System.out.println(q.peek());
        q.printQueue();
    }
}

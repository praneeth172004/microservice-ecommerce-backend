package org.dsa.Stack_Qeue;

import java.util.Stack;

public class QueueImpl {
    Stack<Integer> output;
    Stack<Integer> input;
    public QueueImpl() {
        output = new Stack<>();
        input = new Stack<>();
    }
    public void push(int x) {
        input.push(x);
    }
    public int pop() {
        if(output.empty()){
            while(!input.empty()){
                output.push(input.pop());
            }
        }
        if (output.isEmpty()) {
            System.out.println("Queue is empty, cannot pop.");
            return -1;
        }
        return output.pop();
    }
    public int peek() {
        if(output.empty()){
            while(!input.empty()){
                output.push(input.peek());
            }
        }
        if (output.isEmpty()) {
            System.out.println("Queue is empty, cannot peek.");
            return -1;
        }
        return output.peek();
    }
    public boolean empty() {
        return output.empty() && input.empty();
    }
    static void main() {
        QueueImpl q = new QueueImpl();
        q.push(1);
        q.push(2);
        q.push(3);
        q.push(4);
        System.out.println(q.input);

        q.pop();
        System.out.println(q.output);
        System.out.println(q.input);

        System.out.println(q.peek());
        System.out.println(q.pop());
        System.out.println(q.output);


    }
}

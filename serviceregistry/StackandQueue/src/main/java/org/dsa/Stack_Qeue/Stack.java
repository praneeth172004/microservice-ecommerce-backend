package org.dsa.Stack_Qeue;

public class Stack {
    int[] stack;
    int top = -1;

    public Stack(){
        stack = new int[10];
    }

    public void push(int value){
        if(isFull()){
            return;
        }
        stack[++top] = value;
    }

    public int pop(){
        if(isEmpty()){
            return -1;
        }
        return stack[top--];
    }

    public int peek(){
        if(isEmpty()){
            return -1;
        }
        return stack[top];
    }

    public boolean isEmpty(){
        return top == -1;
    }

    public boolean isFull(){
        return top == stack.length - 1;
    }

    public void printStack(){
        for(int i = 0; i <= top; i++){
            System.out.print(stack[i] + " ");
        }
    }

    public static void main(String[] args) {
        Stack stack = new Stack();

        stack.push(1);
        stack.push(2);
        stack.push(3);
        stack.push(4);
        stack.push(5);

        stack.printStack();
        System.out.println();

        System.out.println(stack.pop());

        stack.printStack();
        System.out.println();

        System.out.println(stack.peek());
        stack.printStack();
    }
}
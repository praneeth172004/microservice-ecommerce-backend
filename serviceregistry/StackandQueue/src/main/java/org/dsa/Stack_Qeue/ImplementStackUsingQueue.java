package org.dsa.Stack_Qeue;

import java.util.LinkedList;
import java.util.Queue;
class StackImpl{
    Queue<Integer> q;
    public StackImpl(){
        q = new LinkedList<>();
    }
    public void push(int x) {
        q.add(x);
        for(int i=q.size()-1;i>=0;i--){
            q.add(q.poll());
        }
    }
    public int pop() {
        if(q.isEmpty()){
            return -1;
        }
        return q.poll();
    }
    public int top() {
        if(q.isEmpty()){
            return -1;
        }
        return q.peek();
    }
    public boolean empty() {
        return q.isEmpty();
    }

}

public class ImplementStackUsingQueue {
    public static void main(String[] args) {
        StackImpl stack = new StackImpl();
        stack.push(1);
        stack.push(2);
        stack.push(3);
        stack.push(4);
        System.out.println(stack.q);
        stack.top();
        System.out.println(stack.q);
        System.out.println(stack.empty());
        stack.pop();
        System.out.println(stack.q);

    }
}

package org.dsa.Stack_Qeue;

import java.util.Stack;

public class postfix_infix_prefix {
    public String postfix_prefix(String ex){
        Stack<String> stack = new Stack<>();
        for(int i=0;i<ex.length();i++){
            char ch=ex.charAt(i);
            if(Character.isLetterOrDigit(ch)){
                stack.push(String.valueOf(ch));
            }else{
                String op1 = stack.pop();
                String op2 = stack.pop();
                stack.push(ch+op2+op1);
            }
        }
        return stack.peek();
    }
    public  String postfix_infix(String ex){
        Stack<String> stack = new Stack<>();
        for(int i=0;i<ex.length();i++){
            char ch=ex.charAt(i);
            if(Character.isLetterOrDigit(ch)){
                stack.push(String.valueOf(ch));
            }else{
                String op1 = stack.pop();
                String op2 = stack.pop();
                stack.push("("+op2+ch+op1+")");
            }
        }
        return stack.peek();
    }
    public static void main(String[] args) {
        postfix_infix_prefix p = new postfix_infix_prefix();
        System.out.println(p.postfix_prefix("abc*+d-"));
        System.out.println(p.postfix_infix("abc*+d-"));
    }
}

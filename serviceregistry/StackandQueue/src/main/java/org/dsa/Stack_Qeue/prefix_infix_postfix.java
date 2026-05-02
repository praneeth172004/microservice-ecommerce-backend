package org.dsa.Stack_Qeue;

import java.util.Stack;

public class prefix_infix_postfix {
    public String prefix_infix(String expression){
        Stack<String> stack = new Stack<>();
        for(int i=expression.length()-1;i>=0;i--){
            char ch=expression.charAt(i);
            if(Character.isLetterOrDigit(ch)) {
                stack.push(String.valueOf(ch));
            }else{
                String op1=stack.pop();
                String op2=stack.pop();
                stack.push("("+op1+ch+op2+")");
            }
        }
        return stack.peek();
    }
    public String prefix_postfix(String expression){
        Stack<String> stack = new Stack<>();
        for(int i=expression.length()-1;i>=0;i--){
            char ch=expression.charAt(i);
            if(Character.isLetterOrDigit(ch)) {
                stack.push(String.valueOf(ch));
            }else{
                String op1=stack.pop();
                String op2=stack.pop();
                stack.push(op1+op2+ch);
            }
        }
        return stack.peek();
    }
    public static void main(String[] args) {
        String st="*+ab-cd";
        prefix_infix_postfix p=new prefix_infix_postfix();

        System.out.println(p.prefix_infix(st));
        System.out.println(p.prefix_postfix(st));
    }
}

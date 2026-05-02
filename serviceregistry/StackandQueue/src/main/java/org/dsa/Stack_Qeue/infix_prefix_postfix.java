package org.dsa.Stack_Qeue;

import java.util.Stack;

public class infix_prefix_postfix {

    // Function to return precedence
    public int getPriority(char ch) {
        if (ch == '^') return 3;
        else if (ch == '*' || ch == '/') return 2;
        else if (ch == '+' || ch == '-') return 1;
        return 0;
    }

    // ✅ Infix to Postfix
    public String infix_postfix(String expression) {
        StringBuilder sb = new StringBuilder();
        Stack<Character> stack = new Stack<>();

        for (int i = 0; i < expression.length(); i++) {
            char ch = expression.charAt(i);

            // Operand
            if (Character.isLetterOrDigit(ch)) {
                sb.append(ch);
            }
            // Opening bracket
            else if (ch == '(') {
                stack.push(ch);
            }
            // Closing bracket
            else if (ch == ')') {
                while (!stack.isEmpty() && stack.peek() != '(') {
                    sb.append(stack.pop());
                }
                stack.pop(); // remove '('
            }
            // Operator
            else {
                while (!stack.isEmpty() && getPriority(ch) <= getPriority(stack.peek())) {
                    sb.append(stack.pop());
                }
                stack.push(ch);
            }
        }

        // Remaining operators
        while (!stack.isEmpty()) {
            sb.append(stack.pop());
        }

        return sb.toString();
    }

    // ✅ Infix to Prefix
    public String infix_prefix(String expression) {

        // Step 1: Reverse expression
        StringBuilder sb = new StringBuilder(expression);
        sb.reverse();

        // Step 2: Swap brackets
        for (int i = 0; i < sb.length(); i++) {
            if (sb.charAt(i) == '(') {
                sb.setCharAt(i, ')');
            } else if (sb.charAt(i) == ')') {
                sb.setCharAt(i, '(');
            }
        }

        // Step 3: Convert to postfix
        String postfix = infix_postfix(sb.toString());

        // Step 4: Reverse postfix to get prefix
        return new StringBuilder(postfix).reverse().toString();
    }

    // ✅ Main Method
    public static void main(String[] args) {
        infix_prefix_postfix obj = new infix_prefix_postfix();

        String infix = "(p+q)*(m-n)";

        String postfix = obj.infix_postfix(infix);
        String prefix = obj.infix_prefix(infix);

        System.out.println("Infix   : " + infix);
        System.out.println("Postfix : " + postfix);
        System.out.println("Prefix  : " + prefix);
    }
}
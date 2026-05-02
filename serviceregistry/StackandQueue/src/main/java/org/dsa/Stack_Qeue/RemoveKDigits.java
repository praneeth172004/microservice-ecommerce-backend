package org.dsa.Stack_Qeue;

import java.util.Stack;

public class RemoveKDigits {
    public String removeKdigits(String str, int k) {
        if (str == null || str.length() == 0)
            return str;
        Stack<Integer> st = new Stack<>();
        for(int i = 0; i < str.length(); i++) {
            int ch=str.charAt(i)-'0';
            while(!st.isEmpty() && st.peek() > ch && k>0) {
                st.pop();
                k--;
            }
            st.push(ch);
        }
        StringBuilder sb = new StringBuilder();
        while (!st.isEmpty()) {
            sb.append(st.pop());
        }
        sb.reverse();
        int i=0;
        while(i<sb.length() && sb.charAt(i)==0 ){
            i++;
        }
        return sb.substring(i).toString();

    }
    public static void main(String[] args) {
        String st="1432219";
        int k=3;
        RemoveKDigits r=new RemoveKDigits();
        System.out.println(r.removeKdigits(st,k));
    }
}

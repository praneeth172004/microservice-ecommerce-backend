package org.dsa.Stack_Qeue;

import java.util.Arrays;
import java.util.Stack;

public class TwoNextGreater {
    public int[]  nextGreater(int[] nums,Stack<Integer> st) {
        int n=nums.length;
        int[] res=new int[n];
        for(int i=n-1;i>=0;i--){
            while(!st.isEmpty() && st.peek()<nums[i]){
                st.pop();
            }
            if(st.isEmpty()){
                res[i]=-1;
            }else{
                res[i]=st.peek();
            }
            st.push(nums[i]);
        }
        return res;
    }
    public int[] nextGreaterII(int[] nums,Stack<Integer> st) {
        int n=nums.length;
        int[] res=new int[n];
        for(int i=2*n-1;i>=0;i--){
            while(!st.isEmpty() && st.peek()<nums[i%nums.length]){
                st.pop();
            }
            if(i<n) {
                if (st.isEmpty()) {
                    res[i] = -1;
                } else {
                    res[i] = st.peek();
                }
            }
            st.push(nums[i%nums.length]);
        }
        return res;
    }
    static void main() {
        Stack<Integer> st=new Stack<>();
        TwoNextGreater n=new TwoNextGreater();
        int[] nums={4, 5, 2, 10};
        int[] res=n.nextGreater(nums,st);
        Stack<Integer> st1=new Stack<>();
        int[] res1=n.nextGreaterII(nums,st1);


        System.out.println(Arrays.toString(res));
        System.out.println(Arrays.toString(res1));
    }
}

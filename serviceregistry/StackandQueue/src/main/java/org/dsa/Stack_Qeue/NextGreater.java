package org.dsa.Stack_Qeue;

import java.util.Arrays;
import java.util.Stack;

public class NextGreater {
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
    static void main() {
        Stack<Integer> st=new Stack<>();
        NextGreater n=new NextGreater();
        int[] nums={4, 5, 2, 10};
        int[] res=n.nextGreater(nums,st);

        System.out.println(Arrays.toString(res));
    }
}

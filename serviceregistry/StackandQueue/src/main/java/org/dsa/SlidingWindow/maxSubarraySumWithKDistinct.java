package org.dsa.SlidingWindow;

import java.util.HashMap;

public class maxSubarraySumWithKDistinct {
    public static int maxSubarraySumWithK(int[] nums, int k ) {
        int n=nums.length;
        if(n==0) return 0;
        if(k==1) return nums[0];
        if(k==2) return Math.max(nums[0],nums[1]);

        int i=0;
        int max=Integer.MIN_VALUE;
        int sum=0;
        HashMap<Integer,Integer> map=new HashMap<>();
        for(int j=0;j<n;j++){
            sum+=nums[j];
            map.put(nums[j],map.getOrDefault(nums[j],0)+1);
            if(j-i+1>k){
                map.put(nums[i],map.get(nums[i])-1);
                if(map.get(nums[i])==0){
                    map.remove(nums[i]);
                }
                sum-=nums[i];
                i++;
            }
            if(map.size()==k  && j-i+1==k){
                max=Math.max(max,sum);
            }
        }
        return max;
    }
    static void main() {
        int[] a={1,2,5,3,5,2,5,7,8,2};
        int k=3;
        System.out.println(maxSubarraySumWithK(a,k));

    }
}

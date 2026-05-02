import java.util.*;



class Node {
    int val;
    Node left, right;

    Node(int val) {
        this.val = val;
    }
}

public class TreeImpl {
    static  int diameter=0;
    static  int MaxPathSum=Integer.MIN_VALUE;

    static Scanner sc = new Scanner(System.in);

    // Binary Tree (Preorder input)
    public static Node buildTree() {
        int val = sc.nextInt();

        if (val == -1) {
            return null;
        }

        Node root = new Node(val);

        root.left = buildTree();
        root.right = buildTree();

        return root;
    }

    // BST Creation
    public static Node BSTCreation(Node root, int val) {
        if (root == null) {
            return new Node(val);
        }

        if (val < root.val) {
            root.left = BSTCreation(root.left, val);
        } else {
            root.right = BSTCreation(root.right, val);
        }

        return root;
    }
    public static  ArrayList<Integer> preOrder(Node root,ArrayList<Integer> list) {

        if (root == null) {
            return list;
        }
        list.add(root.val);
        if(root.left!=null){
            preOrder(root.left,list);
        }
        if(root.right!=null){
            preOrder(root.right,list);
        }
        return list;
    }
    public static ArrayList<Integer> inOrder(Node root,ArrayList<Integer> list) {
        if (root == null) {
            return list;
        }
        inOrder(root.left,list);
        list.add(root.val);
        inOrder(root.right,list);
        return list;
    }
    public static ArrayList<Integer> postOrder(Node root,ArrayList<Integer> list) {
        if (root == null) {
            return list;
        }
        postOrder(root.left,list);
        postOrder(root.right,list);
        list.add(root.val);
        return list;
    }

    public static ArrayList<ArrayList<Integer>> levelOrder(Node root) {
        ArrayList<ArrayList<Integer>> list = new ArrayList<>();
        if (root == null) {
            return list;
        }
        Queue<Node> queue = new LinkedList<>();
        queue.add(root);
        while (!queue.isEmpty()) {
            int size = queue.size();
            ArrayList<Integer> temp = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                Node node = queue.poll();
                temp.add(node.val);
                if(node.left!=null){
                    queue.add(node.left);
                }
                if(node.right!=null){
                    queue.add(node.right);
                }

            }
            list.add(temp);
        }
        return list;
    }
    public static int Diameter(Node root) {
        height(root);
        return diameter;
    }
    public static int height(Node root) {
        if (root == null) {
            return 0;
        }
        int left = height(root.left);
        int right = height(root.right);
        diameter=Math.max(diameter,left+right);
        return Math.max(left, right) + 1;
    }
    public static int MaxDepth(Node root){
        if (root == null) {
            return 0;
        }

        return Math.max(MaxDepth(root.left) , MaxDepth(root.right)) + 1;
    }
    public static int MathSumPath(Node root) {
        getMaxPathSum(root);
        return MaxPathSum;
    }
    public static int getMaxPathSum(Node root) {
        if (root == null) {
            return 0;
        }
        int left=Math.max(0,getMaxPathSum(root.left));
        int right=Math.max(0,getMaxPathSum(root.right));
        MaxPathSum=Math.max(MaxPathSum,left+right+root.val);
        return Math.max(left, right)+root.val;
    }
    public static boolean isIdentical(Node root1, Node root2) {
        if (root1 == null && root2 == null) {
            return true;
        }
        if(root1 == null || root2 == null) {
            return false;
        }
        if (root1.val != root2.val) {
            return false;
        }
        return isIdentical(root1.left, root2.left) && isIdentical(root1.right, root2.right);
    }
    public static boolean isBalanced(Node root) {
        return checkHeight(root)!=-1;
    }
    public static int checkHeight(Node root) {
        if (root == null) {
            return 0;
        }
        int left=checkHeight(root.left);
        if(left==-1) {
            return -1;
        }
        int right=checkHeight(root.right);
        if(right==-1) {
            return -1;
        }
        if(Math.abs(left-right)>1) {
            return -1;
        }
        return Math.max(left,right)+1;
    }

    public static void main(String[] args) {

        // 🔹 Binary Tree Input
        System.out.println("Enter Binary Tree nodes (-1 for NULL):");
        Node root = buildTree();

        // 🔹 BST Input
//        Node rootBinary = null;
//
//        System.out.println("Enter number of BST nodes:");
//        int noof = sc.nextInt();
//
//        System.out.println("Enter BST values:");
//        while (noof > 0) {
//            int val = sc.nextInt();
//            rootBinary = BSTCreation(rootBinary, val); // ✅ FIXED
//            noof--;
//        }
        ArrayList<Integer> list = new ArrayList<>();

//        System.out.println("Binary Tree Created");
//        System.out.println("Preorder traversal of Binary Tree:"+preOrder(root,list));
//        list.clear();
//        System.out.println("Inorder traversal of Binary Tree:"+inOrder(root,list));
//        list.clear();
//        System.out.println("Postorder traversal of Binary Tree:"+postOrder(root,list));
//        list.clear();;
//        System.out.println("Level order traversal of Binary Tree:"+levelOrder(root));
//        System.out.println("BST Created");
//        System.out.println("Preorder traversal of BST:"+preOrder(rootBinary,list));
//        list.clear();
//        System.out.println("Inorder traversal of BST:"+inOrder(rootBinary,list));
//        list.clear();
//        System.out.println("Postorder traversal of BST:"+postOrder(rootBinary,list));
//        list.clear();
        System.out.println("Level order traversal of BST:"+levelOrder(root));
        System.out.println("Max Depth traversal of BST:"+MaxDepth(root));
    }
}
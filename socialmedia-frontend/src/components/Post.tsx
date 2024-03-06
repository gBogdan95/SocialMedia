export interface PostType {
  id: string;
  user: any;
  text: string;
  likes: number;
}

interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
  return (
    <div>
      <p>{post.user.username}</p>
      <p>{post.text}</p>
      <p>Likes: {post.likes}</p>
    </div>
  );
};

export default Post;

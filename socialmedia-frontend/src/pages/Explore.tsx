import React, { useState, useEffect } from "react";
import Post, { PostType } from "../components/Post";
import { postService } from "../services/postService";

const ExplorePage = () => {
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    const fetchAndSetPosts = async () => {
      try {
        const data = await postService.fetchPosts();
        setPosts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAndSetPosts();
  }, []);

  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post) => <Post key={post.id} post={post} />)
      ) : (
        <p>No posts to display</p>
      )}
    </div>
  );
};

export default ExplorePage;

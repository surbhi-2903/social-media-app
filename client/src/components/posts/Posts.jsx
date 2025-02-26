import { useQuery } from "@tanstack/react-query";
import Post from "../post/Post";
import "./posts.scss";
import { makeRequest } from "../../axios";

const Posts = ({userId}) => {
  const { isPending, error, data } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await makeRequest.get("/posts?userId="+userId);
      return res.data;
    },  
  });
  // console.log(data);

  return (
    <div className="posts">
      {isPending ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Something went wrong: {error.message}</p>
      ) : data == "No posts found" ? (
        data
      ) : (
        data.map((post) => <Post post={post} key={post.id} />)
      )}
    </div>
  );
};

export default Posts;
 
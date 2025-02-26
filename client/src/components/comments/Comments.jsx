import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";
const Comments = ({ post }) => {
  const { currentUser } = useContext(AuthContext);
  const [writtencomment, setWrittencomment] = useState("");
  const queryClient = useQueryClient();
  const postId = post?.id;
  const { isPending, error, data } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async ({ queryKey }) => {
      const [, postId] = queryKey;
      const response = await makeRequest.get(`/comments?postId=${postId}`);
      return response.data;
    },
  });
  const mutation = useMutation({
    mutationFn: (newComment) => {
      return makeRequest.post("/comments", newComment);
    },
    onSuccess: () => {
      //invalidate and fetch
      //invalidates query to trigger refetch
      //other than invalidateQueries queryClient has other methods like
      //queryClient.fetchQuery() which will manually fetch a query.
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["countcomment", postId] });
    },
  });
  const handleClick = async (e) => {
    e.preventDefault();
    if (!writtencomment.trim()) return;
    mutation.mutate({ desc: writtencomment, postId });
    setWrittencomment("");
  };
  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePic} alt="" />
        <input
          type="text"
          placeholder="Write a comment"
          value={writtencomment}
          onChange={(e) => {
            setWrittencomment(e.target.value);
          }}
        />
        <button onClick={handleClick}>Send</button>
      </div>

      {isPending ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Something went wrong</p>
      ) : data !== "No comments" ? (
        data.map((comment) => (
          <div className="comment" key={comment.id}>
            <img src={comment.profilePic} alt="" />
            <div className="info">
              <span>{comment.name}</span>
              <p>{comment.desc}</p>
            </div>
            <span className="date">{moment(comment.createdAt).fromNow()}</span>
          </div>
        ))
      ) : (
        <p>No comments</p>
      )}
    </div>
  );
};

export default Comments;

{
  /* {data.map((comment) => (
  <div className="comment" key={comment.id}>
  <img src={comment.profilePicture} alt="" />
  <div className="info">
      <span>{comment.name}</span>
      <p>{comment.desc}</p>
    </div>
    <span className="date">1 hour ago</span>
    </div>
    ))} */
}

//TEMPORARY
// const comments = [
//   {
//     id: 1,
//     desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odit cumque aspernatur est asperiores, facere possimus. Aliquid cupiditate aperiam aspernatur delectus.",
//     name: "Jam Doe",
//     userId: 1,
//     profilePicture:
//       "https://images.pexels.com/photos/3229334/pexels-photo-3229334.jpeg?auto=compress&cs=tinysrgb&w=600",
//   },
//   {
//     id: 2,
//     desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odit cumque aspernatur est asperiores, facere possimus. Aliquid cupiditate aperiam aspernatur delectus.",
//     name: "Jam Doe",
//     userId: 2,
//     profilePicture:
//       "https://images.pexels.com/photos/3229334/pexels-photo-3229334.jpeg?auto=compress&cs=tinysrgb&w=600",
//   },
// ];

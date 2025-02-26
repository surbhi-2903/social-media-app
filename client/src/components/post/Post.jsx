import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios.js";
import { AuthContext } from "../../context/authContext.jsx";
import moment from "moment";
const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const queryClient = useQueryClient();
  const postId = post?.id;
  const { currentUser } = useContext(AuthContext);
  const {
    isPending: isLoadingComments,
    error: errorComments,
    data: comments,
  } = useQuery({
    queryKey: ["countcomment", postId],
    queryFn: async ({ queryKey }) => {
      const [, postId] = queryKey;
      const response = await makeRequest.get(
        `/comments/getcomments?postId=${postId}`
      );
      return response.data;
    },
  });
  const {
    isPending: isLoadingLikes,
    error: likesError,
    data: likes,
  } = useQuery({
    queryKey: ["likesHandling", postId],
    queryFn: async ({ queryKey }) => {
      const [, postId] = queryKey;
      const response = await makeRequest.get(`/likes?postId=${postId}`);
      // const nooflikes = response.data.map((users) => users.UserId);
      return response.data;
    },
  });
  // console.log(likes, currentUser.id);
  // console.log(likes.includes(currentUser.id));

  const mutation = useMutation({
    mutationFn: async (liked) => {
      if (liked) return await makeRequest.delete("/likes?postId=" + postId); // Send postId in the request query for deleting function.
      return await makeRequest.post("/likes", { postId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likesHandling", postId] });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: async (postId) => {
      return makeRequest.delete("/posts/" + postId);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["posts"]);
    },
  });
  const handleDelete = () => {
    deleteMutation.mutate(postId);
  };

  const handleLikeClick = () => {
    mutation.mutate(likes.includes(currentUser.id));
  };

  // useEffect(() => {
  //   if (likes) {
  //     setLiked(likes.includes(currentUser.id));
  //   }
  // }, [likes, currentUser.id]);
  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={"/uploads/" + post.profilePic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizOutlinedIcon onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && post.userId === currentUser.id && (
            <button onClick={handleDelete}>delete</button>
          )}
        </div>
        <div className="content">
          <p>{post.desc}</p>
          <img src={"./uploads/" + post.image} alt="" />
        </div>
        <div className="info">
          <div className="item">
            {(likes || []).includes(currentUser.id) ? (
              <FavoriteOutlinedIcon
                style={{ color: "red" }}
                onClick={handleLikeClick}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLikeClick} />
            )}
            {likes?.length || 0} likes
          </div>
          <div
            className="item"
            onClick={() => {
              setCommentOpen(!commentOpen);
            }}
          >
            <TextsmsOutlinedIcon />
            {isLoadingComments ? (
              <span>...</span>
            ) : errorComments ? (
              <span>..</span>
            ) : comments ? (
              <span>{comments[0].count}</span>
            ) : (
              <span>0</span>
            )}
            Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            12 Shares
          </div>
        </div>
        {commentOpen && <Comments post={post} key={post.id} />}
      </div>
    </div>
  );
};

export default Post;

import React from "./userprofile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import XIcon from "@mui/icons-material/X";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import Posts from "../../components/posts/Posts";
import { useLocation } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import Updates from "../../components/updates/Updates";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const userId = parseInt(useLocation().pathname.split("/")[2]);
  const queryClient = useQueryClient();
  const { isPending, error, data } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async ({ queryKey }) => {
      const response = await makeRequest.get("/users/find/" + userId);
      return response.data;
    },
  });

  const { data: relationshipData } = useQuery({
    queryKey: ["relationships", userId],
    queryFn: async (queryKey) => {
      const response = await makeRequest.get(
        "/relationships/?followeduserId=" + userId
      );
      return response.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (following) => {
      if (following)
        return await makeRequest.delete("/relationships/?userId=" + userId);
      return await makeRequest.post("/relationships/", { userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["relationships", userId] });
    },
  });
  const handleFollow = () => {
    mutation.mutate(relationshipData?.includes(currentUser.id));
  };
  return (
    <div className="userprofile">
      <div className="images">
        <img src={"/uploads/" + data?.coverPic} alt="" className="cover" />
        <img
          src={"/uploads/" + data?.profilePic}
          alt=""
          className="profilePic"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com">
              <FacebookTwoToneIcon fontSize="medium" />
            </a>
            <a href="http://instagram.com">
              <InstagramIcon fontSize="medium" />
            </a>
            <a href="http://x.com">
              <XIcon fontSize="medium" />
            </a>
            <a href="http://linkedin.com">
              <LinkedInIcon fontSize="medium" />
            </a>
            <a href="http://pinterest.com">
              <PinterestIcon fontSize="medium" />
            </a>
          </div>

          <div className="center">
            <span>{data?.username}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>{data?.city}</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>{data?.website}</span>
              </div>
            </div>
            {userId === currentUser.id ? (
              <button onClick={() => setOpenUpdate(true)}>Update</button>
            ) : (
              <button onClick={handleFollow}>
                {relationshipData?.includes(currentUser.id)
                  ? "Unfollow"
                  : "Follow"}
              </button>
            )}
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertOutlinedIcon />
          </div>
        </div>
        <Posts userId={userId} />
      </div>
      {openUpdate && <Updates setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default Profile;

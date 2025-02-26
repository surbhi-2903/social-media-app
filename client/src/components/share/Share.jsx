import { useContext, useState } from "react";
import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Share = () => {
  const { currentUser } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const queryClient = useQueryClient();

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  // Mutations

  const mutation = useMutation({
    mutationFn: async (newPost) => {
      return await makeRequest.post("/posts", newPost);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) imgUrl = await upload();
    mutation.mutate({ desc, img: imgUrl });
    setFile(null);
    setDesc("");
    console.log(desc);
  };

  return (
    <div className="share">
      <div className="userinput">
        <div className="left">
          <img src={currentUser.profilePic} alt="" />
          <input
            type="text"
            placeholder={`What's on your mind ${currentUser.name}?`}
            onChange={(e) => setDesc(e.target.value)}
            value={desc}
          />
        </div>
        <div className="right">
          {file && (
            <img className="file" src={URL.createObjectURL(file)} alt="" />
          )}
        </div>
      </div>
      <div className="actions">
        <div className="additems">
          <div className="add image">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="add image">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
          </div>
          <div className="add place">
            <img src={Map} alt="" />
            <span>Add Place</span>
          </div>
          <div className="add tagfrnds">
            <img src={Friend} alt="" />
            <span>Tag Friends</span>
          </div>
        </div>
        <button onClick={handleClick}>Share</button>
      </div>
    </div>
  );
};

export default Share;

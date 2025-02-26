import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import "./stories.scss";

const Stories = () => {
  const { currentUser } = useContext(AuthContext);
  //TEMPORARY
  const stories = [
    {
      id: 1,
      name: "Jam Doe",
      image:
        "https://images.pexels.com/photos/17243661/pexels-photo-17243661/free-photo-of-a-woman-in-a-plaid-skirt-and-white-t-shirt.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      id: 2,
      name: "Jam Doe",
      image:
        "https://images.pexels.com/photos/17243661/pexels-photo-17243661/free-photo-of-a-woman-in-a-plaid-skirt-and-white-t-shirt.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      id: 3,
      name: "Jam Doe",
      image:
        "https://images.pexels.com/photos/17243661/pexels-photo-17243661/free-photo-of-a-woman-in-a-plaid-skirt-and-white-t-shirt.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      id: 4,
      name: "Jam Doe",
      image:
        "https://images.pexels.com/photos/17243661/pexels-photo-17243661/free-photo-of-a-woman-in-a-plaid-skirt-and-white-t-shirt.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
  ];

  return (
    <div className="stories">
      <div className="story">
        <img src={currentUser.profilePic} alt="" />
        <span>{currentUser.name}</span>
        <button>+</button>
      </div>
      {stories.map((story) => {
        return (
          <div className="story" key={story.id}>
            <img src={story.image} alt="" />
            <span>{story.name}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Stories;

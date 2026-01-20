import React from "react";
import { useSelector } from "react-redux";

const About = () => {
  const post = useSelector((state) => state.post.value);

  return (
    <div>
      <h1>Post Authors</h1>
      {post.map((post) => (
        <p key={post.id}>{post.name}</p>
      ))}
    </div>
  );
};

export default About;

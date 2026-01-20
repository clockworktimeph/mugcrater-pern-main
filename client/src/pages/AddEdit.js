import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "../css/AddEdit.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialState = {
  name: "",
  description: "",
};

const AddEdit = () => {
  const [state, setState] = useState(initialState);
  const { name, description } = state;
  const { id } = useParams();
  const navigate = useNavigate();

  const addPost = async (data) => {
    try {
      const res = await axios.post("http://localhost:3000/post", data);
      if (res.status === 200) {
        toast.success("Post added");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const updatePost = async (data, id) => {
    try {
      const res = await axios.put(`http://localhost:3000/post/${id}`, data);
      if (res.status === 200) {
        toast.success("Post updated");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !description) {
      toast.error("Fill in all fields");
    } else {
      if (!id) {
        addPost(state);
      } else {
        updatePost(state, id);
      }
      setTimeout(() => navigate("/"), 500);
    }
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  return (
    <div>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Name"
          maxLength="30"
          onChange={handleInputChange}
          className="inputs"
          value={name}
        />
        <textarea
          type="text"
          id="description"
          name="description"
          placeholder="Message.."
          maxLength="255"
          onChange={handleInputChange}
          className="inputs"
          value={description}
        />

        <input type="submit" value={id ? "Update" : "Add"} />
      </form>
    </div>
  );
};

export default AddEdit;

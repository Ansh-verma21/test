import React, { useEffect, useState } from "react";
import axios from "axios";
import { set } from "mongoose";

function Delete(props) {
  const [formdata, setformdata] = useState({
    mac: "",
    client: "",
    city: "",
    district: "",
    location: "",
    addressNumber: "",
  });
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [done, setdone] = useState(-1);
  const handleChange = (event) => {
    setShowForm(false);
    setMessage("");
    const { id, value } = event.target;
    setformdata((prev) => ({ ...prev, [id]: value }));

    if (id === "district") {
      fetchDistricts(value);
    } else if (id === "client") {
      fetchClients(value);
    } else if (id === "location") {
      fetchLocations(value);
    } else if (id === "city") {
      fetchCities(value);
    }
  };
  const handleSearch = () => {
    if (!formdata.mac) {
      setMessage("Please enter a MAC address.");
      setShowForm(false);
      return;
    }

    axios
      .post("https://test-gjac.onrender.com/devicecheck", {
        id: formdata.mac,
      })
      .then((res) => {
        if (res.data != "Ok") {
          setMessage("Device found. Are you sure you want to delete this?");
          setShowForm(true);
        } else {
          setMessage("Device not found.");
          setShowForm(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setMessage("An error occurred while searching for the device.");
        setShowForm(false);
      });
  };
  function deleteit() {
    axios
      .post("https://test-gjac.onrender.com/delete-device", {
        id: formdata.mac,
      })
      .then((res) => {
        setdone(1);
      })
      .catch((err) => {
        setdone(0);
        console.log(err);
      });
  }
  useEffect(() => {
    if (done != -1) {
      if (done == 1) {
        setMessage("Device Deleted Successfully");
        setShowForm(false);
      } else {
        setMessage("Some Error Occurred. Please try again");
      }
    }
    setdone(-1);
  }, [done]);
  return (
    <div
      id="slider"
      style={props.slide === 1 ? { right: "0px" } : { right: "-360px" }}
    >
      <div id="header">
        <h2 onClick={props.here}>
          <i
            id="Cross"
            style={{ marginLeft: "-300px", cursor: "pointer" }}
            className="fas fa-times"
          ></i>
        </h2>
        <h2 style={{ marginTop: "-43px" }}>Delete a Device</h2>
        <p>Enter the MAC address to find the device you want to delete.</p>
        <div className="custom-select-container">
          <input
            type="text"
            id="mac"
            placeholder="Enter Mac-address"
            value={formdata.mac}
            onChange={handleChange}
            autoComplete="off"
            style={{
              color: "black",
              paddingRight: "100px",
              paddingTop: "5px",
              marginBottom: "10px",
            }}
            required
          />
          <button
            style={{ marginTop: "20px" }}
            type="button"
            className="btn btn-primary mt-2"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
        {message && (
          <p
            style={{
              color: message.includes("not found") ? "red" : "green",
              paddingTop: "10px",
            }}
          >
            {message}
          </p>
        )}
        {showForm && (
          <button
            type="button"
            className="btn btn-danger mt-2"
            onClick={deleteit}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default Delete;

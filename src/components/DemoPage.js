import React, { useState } from "react";
import axios from "axios";

const DemoPage = () => {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [custID, setCustID] = useState("");
  const [phoneSuggestions, setPhoneSuggestions] = useState([]); // List of phone suggestions
  const [showSuggestions, setShowSuggestions] = useState(false); // Show/hide dropdown

  const styles = {
    container: {
      maxWidth: "600px",
      margin: "20px auto",
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
      fontFamily: "Arial, sans-serif",
    },
    header: {
      textAlign: "center",
      color: "#333",
      marginBottom: "20px",
    },
    label: {
      display: "block",
      margin: "10px 0 5px",
      fontWeight: "bold",
    },
    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "5px",
      border: "1px solid #ccc",
      borderRadius: "4px",
    },
    suggestionsList: {
      listStyleType: "none",
      padding: "0",
      margin: "0",
      border: "1px solid #ccc",
      borderRadius: "4px",
      backgroundColor: "#fff",
      maxHeight: "150px",
      overflowY: "auto",
      position: "absolute",
      zIndex: 1000,
      width: "calc(100% - 22px)", // Match input width
    },
    suggestionItem: {
      padding: "10px",
      cursor: "pointer",
    },
    suggestionItemHover: {
      backgroundColor: "#f0f0f0",
    },
    button: {
      padding: "10px 20px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontWeight: "bold",
      marginTop: "10px",
    },
    custID: {
      marginTop: "15px",
      fontWeight: "bold",
      textAlign: "center",
    },
  };

  const handlePhoneChange = async (e) => {
    const phoneNumber = e.target.value;
    setPhone(phoneNumber);
  
    // Clear name and address when the phone number changes
    setName("");
    setAddress("");
    setCustID("");
  
    if (phoneNumber.length >= 3) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/demo/search?phone=${phoneNumber}`
        );
  
        setPhoneSuggestions(response.data); // Update suggestions
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching phone suggestions:", error);
        setPhoneSuggestions([]); // Clear suggestions on error
        setShowSuggestions(false);
      }
    } else {
      setPhoneSuggestions([]);
      setShowSuggestions(false);
    }
  };
  
  

  const handleSuggestionClick = (suggestion) => {
    setPhone(suggestion.phonenumber);
    setName(suggestion.name);
    setAddress(suggestion.address);
    setCustID(suggestion.customerid);
    setShowSuggestions(false); // Hide suggestions when selected
  };

  const handleSubmit = async () => {
    if (!phone || !name || !address) {
      alert("Please fill out all fields.");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:5000/api/demo/submit", {
        phone,
        name,
        address,
      });
      setCustID(response.data.customerid);
      alert("Customer submitted successfully!");
    } catch (error) {
      console.error("Error submitting customer:", error);
      alert("Failed to submit customer.");
    }
  };
  

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Demo Page</h2>
      <label style={styles.label}>Phone Number</label>
      <div style={{ position: "relative" }}>
        <input
          style={styles.input}
          type="text"
          value={phone}
          onChange={handlePhoneChange}
          placeholder="Enter Phone Number"
          onFocus={() => setShowSuggestions(true)} // Show suggestions on focus
        />
        {showSuggestions && phoneSuggestions.length > 0 && (
          <ul style={styles.suggestionsList}>
            {phoneSuggestions.map((suggestion) => (
              <li
                key={suggestion.customerid}
                style={styles.suggestionItem}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = styles.suggestionItemHover.backgroundColor)
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = "#fff")
                }
              >
                {suggestion.phonenumber} - {suggestion.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <label style={styles.label}>Name</label>
      <input
        style={styles.input}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter Name"
      />
      <label style={styles.label}>Address</label>
      <input
        style={styles.input}
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter Address"
      />
      <button style={styles.button} onClick={handleSubmit}>
        Submit
      </button>
      <div style={styles.custID}>
        {custID && <p>Customer ID: {custID}</p>}
      </div>
    </div>
  );
};

export default DemoPage;

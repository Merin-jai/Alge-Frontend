import React, { useState, useEffect } from "react";
import axios from "axios";


const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    contactNo: "",
    roleID: "",
    password: "",
  });

  const styles = {
    container: {
      maxWidth: "900px",
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
    form: {
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
      marginBottom: "15px",
      border: "1px solid #ccc",
      borderRadius: "4px",
    },
    button: {
      margin: "5px",
      padding: "10px 20px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontWeight: "bold",
    },
    disableButton: {
      backgroundColor: "#dc3545",
    },
    enableButton: {
      backgroundColor: "#28a745",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px",
    },
    tableHeader: {
      backgroundColor: "#007bff",
      color: "#fff",
      fontWeight: "bold",
    },
    tableRow: {
      textAlign: "center",
    },
    tableCell: {
      border: "1px solid #ddd",
      padding: "10px",
    },
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch all roles
  const fetchRoles = async () => {
    try {
        const response = await axios.get("http://localhost:5000/api/roles");
        if (response.data && Array.isArray(response.data)) {
            setRoles(response.data);
        } else {
            console.error("Unexpected roles response:", response.data);
        }
    } catch (error) {
        console.error("Error fetching roles:", error);
    }
};


  // Add a new user
  const handleAddUser = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/users", newUser);
      setUsers((prev) => [...prev, response.data]);
      setNewUser({ name: "", contactNo: "", roleID: "", password: "" });
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // Toggle user status (Enable/Disable)
  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === "Enable" ? "Disable" : "Enable";
      await axios.put(`http://localhost:5000/api/users/${userId}/status`, {
        status: newStatus,
      });
      fetchUsers();
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  // Reset user password
  const handleResetPassword = async (userId) => {
    try {
      const newPassword = prompt("Enter a new password:");
      if (newPassword) {
        await axios.put(`http://localhost:5000/api/users/${userId}/reset-password`, {
          password: newPassword,
        });
        alert("Password reset successfully!");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  // Change user role
  const handleChangeRole = async (userId, newRoleID) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${userId}/role`, {
        roleID: newRoleID,
      });
      fetchUsers();
    } catch (error) {
      console.error("Error changing role:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>User Management</h2>

      {/* Add New User Form */}
      <div style={styles.form}>
        <h3>Add New User</h3>
        <label style={styles.label}>Name</label>
        <input
          style={styles.input}
          type="text"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <label style={styles.label}>Contact No</label>
        <input
          style={styles.input}
          type="text"
          value={newUser.contactNo}
          onChange={(e) => setNewUser({ ...newUser, contactNo: e.target.value })}
        />
        <label style={styles.label}>Role</label>
        <select
            style={styles.input}
            value={newUser.roleID}
            onChange={(e) => setNewUser({ ...newUser, roleID: e.target.value })}
        >
            <option value="">Select Role</option>
            {roles.map((role) => (
                <option key={role.roleid} value={role.roleid}>
                    {role.rolename}
                </option>
            ))}
        </select>

        <label style={styles.label}>Password</label>
        <input
          style={styles.input}
          type="password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />
        <button style={styles.button} onClick={handleAddUser}>
          Add User
        </button>
      </div>

      {/* User List */}
      <h3>User List</h3>
      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeader}>
            <th style={styles.tableCell}>Name</th>
            <th style={styles.tableCell}>Contact No</th>
            <th style={styles.tableCell}>Role</th>
            <th style={styles.tableCell}>Status</th>
            <th style={styles.tableCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
    {users.map((user) => (
        <tr key={user.userid}>
            <td style={styles.tableCell}>{user.name}</td>
            <td style={styles.tableCell}>{user.contactno}</td> {/* Ensure contactno is rendered here */}
            <td style={styles.tableCell}>
                <select
                    style={styles.input}
                    value={user.roleid}
                    onChange={(e) => handleChangeRole(user.userid, e.target.value)}
                >
                    {roles.map((role) => (
                        <option key={role.roleid} value={role.roleid}>
                            {role.rolename}
                        </option>
                    ))}
                </select>
            </td>
            <td style={styles.tableCell}>{user.status}</td>
            <td style={styles.tableCell}>
                <button
                    style={{
                        ...styles.button,
                        ...(user.status === "Enable"
                            ? styles.disableButton
                            : styles.enableButton),
                    }}
                    onClick={() => handleToggleStatus(user.userid, user.status)}
                >
                    {user.status === "Enable" ? "Disable" : "Enable"}
                </button>
                <button
                    style={styles.button}
                    onClick={() => handleResetPassword(user.userid)}
                >
                    Reset Password
                </button>
            </td>
        </tr>
    ))}
</tbody>

      </table>
    </div>
  );
};

export default UserManagement;

import React, { useState, useEffect } from "react";
import axios from "axios";

const MaterialManagement = () => {
    const [materials, setMaterials] = useState([]);
    const [newMaterial, setNewMaterial] = useState({
        materialName: "",
        ratePerSqFt: "",
    });
    const [editingMaterial, setEditingMaterial] = useState(null);

    const styles = {
        container: {
            maxWidth: "800px",
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
        },
        editButton: {
            backgroundColor: "#ffc107",
        },
        deleteButton: {
            backgroundColor: "#dc3545",
        },
        table: {
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
        },
        tableHeader: {
            backgroundColor: "#007bff",
            color: "#fff",
        },
        tableCell: {
            border: "1px solid #ddd",
            padding: "10px",
            textAlign: "center",
        },
    };

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        try {
            const response = await axios.get("https://algebra1.ddns.net/api/materials");
            setMaterials(response.data);
        } catch (error) {
            console.error("Error fetching materials:", error);
        }
    };

    const handleAddMaterial = async () => {
        if (!newMaterial.materialName || !newMaterial.ratePerSqFt) {
            alert("Please fill out all fields.");
            return;
        }
        try {
            const response = await axios.post("https://algebra1.ddns.net/api/materials", newMaterial);
            setMaterials([...materials, response.data]);
            setNewMaterial({ materialName: "", ratePerSqFt: "" });
        } catch (error) {
            console.error("Error adding material:", error);
        }
    };

    const handleEditMaterial = (material) => {
        setEditingMaterial(material);
        setNewMaterial({
            materialName: material.materialname,
            ratePerSqFt: material.ratepersqft,
        });
    };

    const handleUpdateMaterial = async () => {
        if (!newMaterial.materialName || !newMaterial.ratePerSqFt) {
            alert("Please fill out all fields.");
            return;
        }
        try {
            const response = await axios.put(
                `https://algebra1.ddns.net/api/materials/${editingMaterial.materialid}`,
                newMaterial
            );
            setMaterials(
                materials.map((material) =>
                    material.materialid === editingMaterial.materialid
                        ? response.data
                        : material
                )
            );
            setNewMaterial({ materialName: "", ratePerSqFt: "" });
            setEditingMaterial(null);
        } catch (error) {
            console.error("Error updating material:", error);
        }
    };

    const handleDeleteMaterial = async (materialId) => {
        if (!window.confirm("Are you sure you want to delete this material?")) return;
        try {
            await axios.delete(`https://algebra1.ddns.net/api/materials/${materialId}`);
            setMaterials(materials.filter((material) => material.materialid !== materialId));
        } catch (error) {
            console.error("Error deleting material:", error);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Material Management</h2>

            <div>
                <h3>{editingMaterial ? "Edit Material" : "Add New Material"}</h3>
                <input
                    style={styles.input}
                    type="text"
                    placeholder="Material Name"
                    value={newMaterial.materialName}
                    onChange={(e) =>
                        setNewMaterial({ ...newMaterial, materialName: e.target.value })
                    }
                />
                <input
                    style={styles.input}
                    type="number"
                    placeholder="Rate per Sq Ft"
                    value={newMaterial.ratePerSqFt}
                    onChange={(e) =>
                        setNewMaterial({ ...newMaterial, ratePerSqFt: e.target.value })
                    }
                />
                <button
                    style={styles.button}
                    onClick={editingMaterial ? handleUpdateMaterial : handleAddMaterial}
                >
                    {editingMaterial ? "Update Material" : "Add Material"}
                </button>
                {editingMaterial && (
                    <button
                        style={styles.button}
                        onClick={() => {
                            setEditingMaterial(null);
                            setNewMaterial({ materialName: "", ratePerSqFt: "" });
                        }}
                    >
                        Cancel
                    </button>
                )}
            </div>

            <h3>Material List</h3>
            <table style={styles.table}>
                <thead>
                    <tr style={styles.tableHeader}>
                        <th style={styles.tableCell}>Material Name</th>
                        <th style={styles.tableCell}>Rate per Sq Ft</th>
                        <th style={styles.tableCell}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {materials.map((material) => (
                        <tr key={material.materialid}>
                            <td style={styles.tableCell}>{material.materialname}</td>
                            <td style={styles.tableCell}>{material.ratepersqft}</td>
                            <td style={styles.tableCell}>
                                <button
                                    style={{ ...styles.button, ...styles.editButton }}
                                    onClick={() => handleEditMaterial(material)}
                                >
                                    Edit
                                </button>
                                <button
                                    style={{ ...styles.button, ...styles.deleteButton }}
                                    onClick={() => handleDeleteMaterial(material.materialid)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MaterialManagement;

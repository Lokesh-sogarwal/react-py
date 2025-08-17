import React, { useState, useEffect } from "react";
import "./userdetails.css";
import { ToastContainer, toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import Modal from "react-modal";
import { jwtDecode } from "jwt-decode";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css";

Modal.setAppElement("#root");

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        transform: "translate(-50%, -50%)",
        padding: "20px",
        borderRadius: "10px",
    },
};

const UserDetails = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [activeUserId, setActiveUserId] = useState(null);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        fathername: "",
        mothername: "",
        dob: ""
    });

    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [creating, setCreating] = useState(false);

    const token = localStorage.getItem("token");

    const isTokenExpired = (token) => {
        try {
            const decoded = jwtDecode(token);
            const now = Date.now() / 1000;
            return decoded.exp < now;
        } catch {
            return true;
        }
    };

    const logoutUser = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    useEffect(() => {
        if (!token || isTokenExpired(token)) {
            toast.error("Session expired. Please log in again.");
            setTimeout(() => logoutUser(), 3000);
            return;
        }

        const fetchUsers = async () => {
            setLoading(true);
            try {
                const res = await fetch("http://localhost:5000/auth/user_details", {
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": "Bearer " + token,
                    }
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to fetch users");
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setTimeout(() => setLoading(false), 1000);
            }
        };
        fetchUsers();
    }, []);

    const deleteUser = async (user_uuid) => {
        if (!token || isTokenExpired(token)) {
            logoutUser();
            return;
        }
        setDeleting(true);
        try {
            const res = await fetch("http://localhost:5000/auth/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({ user_uuid }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to delete user");

            toast.success("User deleted");
            setUsers(users.filter(u => u.user_uuid !== user_uuid));
        } catch (err) {
            toast.error(err.message || "Failed to delete user");
        } finally {
            setDeleting(false);
        }
    };

    const updatedetails = async () => {
        if (!token || isTokenExpired(token)) {
            logoutUser();
            return;
        }
        setUpdating(true);
        try {
            const res = await fetch("http://localhost:5000/auth/edit_user_details", {
                method: 'POST',
                headers: {
                    "Content-type": 'application/json',
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    user_uuid: selectedUser.user_uuid,
                    fullname: formData.fullname,
                    email: formData.email,
                    dob: formData.dob,
                    fathername: formData.fathername,
                    mothername: formData.mothername
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to update user");

            toast.success("User updated");
            setUsers(users.map(u => u.user_uuid === selectedUser.user_uuid ? { ...u, ...formData } : u));
            setEditModalOpen(false);
        } catch (err) {
            toast.error(err.message || "Failed to update user");
        } finally {
            setUpdating(false);
        }
    };

    const confirmDelete = (user_uuid) => {
        confirmAlert({
            title: "Confirm delete",
            message: "Are you sure you want to delete this user?",
            buttons: [
                { label: "Yes", onClick: () => deleteUser(user_uuid) },
                { label: "No" }
            ]
        });
    };

    const toggleActionMenu = (user_uuid) => {
        setActiveUserId(activeUserId === user_uuid ? null : user_uuid);
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setFormData({
            fullname: user.fullname || "",
            email: user.email || "",
            fathername: user.fathername || "",
            mothername: user.mothername || "",
            dob: user.dob || ""
        });
        setEditModalOpen(true);
    };

    const openCreateModal = () => {
        setFormData({ fullname: "", email: "", fathername: "", mothername: "", dob: "" });
        setCreateModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    function calculateAge(dobString) {
        if (!dobString) return "-";
        let today = new Date();
        let dob = new Date(dobString);
        let age = today.getFullYear() - dob.getFullYear();
        let monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age;
    }

    const create_user = async () => {
        const { fullname, email } = formData;
        const password = fullname + "123";
        const is_password_change = false;
        

        if (fullname && email) {
            setCreating(true);
            try {
                const res = await fetch("http://localhost:5000/auth/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify({
                        fullname,
                        email,
                        password,is_password_change,
                    })
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Error creating user");

                toast.success("User created successfully");
                setUsers(prev => [...prev, data]);
                setCreateModalOpen(false);
            } catch (err) {
                toast.error(err.message);
            } finally {
                setCreating(false);
            }
        } else {
            toast.error("Full name and email are required");
        }
    };

    return (
        <div>
            <h2>User Details</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}



            {loading ? (
                <p style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <FontAwesomeIcon icon={faSpinner} spin size="2x" color="#007bff" />
                </p>
            ) : (
                <>
                    <button onClick={openCreateModal}>Create User</button>
                    <table>
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>DOB</th>
                                <th>Father's Name</th>
                                <th>Mother's Name</th>
                                <th>Age</th>
                                <th>Phone</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.map((user, index) => (
                                    <tr key={user.user_uuid || index}>
                                        <td>{index + 1}</td>
                                        <td>{user.fullname}</td>
                                        <td>{user.email}</td>
                                        <td>{user.dob || "-"}</td>
                                        <td>{user.fathername || "-"}</td>
                                        <td>{user.mothername || "-"}</td>
                                        <td>{calculateAge(user.dob)}</td>
                                        <td>{user.phone_no || "-"}</td>
                                        <td>
                                            <button onClick={() => toggleActionMenu(user.user_uuid)}>⋮</button>
                                            {activeUserId === user.user_uuid && (
                                                <div className="action-menu">
                                                    <button onClick={() => openEditModal(user)}>Edit</button>
                                                    <button onClick={() => confirmDelete(user.user_uuid)} disabled={deleting}>
                                                        {deleting ? "Deleting..." : "Delete"}
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9">No users found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </>

            )}

            {/* Edit Modal */}
            <Modal isOpen={editModalOpen} onRequestClose={() => setEditModalOpen(false)} style={customStyles} contentLabel="Edit User">
                <h2>Edit User</h2>
                {selectedUser && (
                    <form>
                        <label>Full Name:</label>
                        <input name="fullname" value={formData.fullname} onChange={handleInputChange} />
                        <label>Email:</label>
                        <input name="email" value={formData.email} onChange={handleInputChange} />
                        <label>Father Name:</label>
                        <input name="fathername" value={formData.fathername} onChange={handleInputChange} />
                        <label>Mother Name:</label>
                        <input name="mothername" value={formData.mothername} onChange={handleInputChange} />
                        <label>Date of Birth:</label>
                        <input name="dob" type="date" value={formData.dob} onChange={handleInputChange} />
                        <br />
                        <button type="button" onClick={updatedetails} disabled={updating}>
                            {updating ? "Saving..." : "Save"}
                        </button>
                        <button onClick={() => setEditModalOpen(false)}>Close</button>
                    </form>
                )}
            </Modal>

            {/* Create Modal */}
            <Modal isOpen={createModalOpen} onRequestClose={() => setCreateModalOpen(false)} style={customStyles} contentLabel="Create User">
                <h2>Create User</h2>
                <form>
                    <label>Full Name:</label>
                    <input name="fullname" value={formData.fullname} onChange={handleInputChange} />
                    <label>Email:</label>
                    <input name="email" value={formData.email} onChange={handleInputChange} />
                    <br />
                    <button type="button" onClick={create_user} disabled={creating}>
                        {creating ? "Creating..." : "Create"}
                    </button>
                    <button onClick={() => setCreateModalOpen(false)}>Close</button>
                </form>
            </Modal>

            <ToastContainer />
        </div>
    );
};

export default UserDetails;

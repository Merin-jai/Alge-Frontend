import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/Login.css"; // Import the CSS file

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const vertices = [
      [-2.0, -2.0, -2.0],
      [2.0, -2.0, -2.0],
      [2.0, 2.0, -2.0],
      [-2.0, 2.0, -2.0],
      [-2.0, -2.0, 2.0],
      [2.0, -2.0, 2.0],
      [2.0, 2.0, 2.0],
      [-2.0, 2.0, 2.0],
    ];

    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];

    let angleX = 0;
    let angleY = 0;
    let targetAngleX = 0;
    let targetAngleY = 0;
    let isMouseMoving = false;
    let mouseIdleTimeout;

    const project = ([x, y, z]) => {
      const scale = Math.min(window.innerWidth, window.innerHeight) / 4;
      const distance = 4;
      const projection = scale / (z + distance);
      return [
        x * projection + canvas.width / 2,
        y * projection + canvas.height / 2,
      ];
    };

    function drawCube() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const projectedPoints = vertices.map(([x, y, z]) => {
        const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
        const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
        let newY = y * cosX - z * sinX;
        let newZ = y * sinX + z * cosX;
        let newX = x * cosY + newZ * sinY;
        newZ = -x * sinY + newZ * cosY;
        return project([newX, newY, newZ]);
      });

      edges.forEach(([start, end]) => {
        ctx.beginPath();
        ctx.moveTo(...projectedPoints[start]);
        ctx.lineTo(...projectedPoints[end]);
        ctx.strokeStyle = "#60a5fa";
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      if (!isMouseMoving) {
        targetAngleX += 0.005;
        targetAngleY += 0.005;
      }

      angleX += (targetAngleX - angleX) * 0.1;
      angleY += (targetAngleY - angleY) * 0.1;

      requestAnimationFrame(drawCube);
    }

    function handleMouseMove(event) {
      isMouseMoving = true;
      const { clientX, clientY } = event;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      targetAngleX = ((clientY - centerY) / centerY) * Math.PI * 0.25;
      targetAngleY = ((clientX - centerX) / centerX) * Math.PI * 0.25;

      clearTimeout(mouseIdleTimeout);
      mouseIdleTimeout = setTimeout(() => {
        isMouseMoving = false;
      }, 3000);
    }

    window.addEventListener("mousemove", handleMouseMove);
    drawCube();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(mouseIdleTimeout);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Both fields are required.");
      return;
    }

    try {
      const response = await axios.post("https://algebra1.ddns.net/api/login", { username, password });
      const { token, userId, role, status } = response.data;

      if (status === "Disable") {
        setError("Unauthorized access. Your account is disabled.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);

      switch (role) {
        case "Designer":
          navigate("/DesignerDashboard");
          break;
        case "Billing":
          navigate("/PendingOrdersDashboard");
          break;
        case "Manager":
          navigate("/ManagerDashboard");
          break;
        case "Admin":
          navigate("/AdminDashboard");
          break;
        default:
          navigate("/PrintingDashboard");
          break;
      }
    } catch (error) {
      setMessage("Invalid username or password. Please try again.");
    }
  };

  return (
    <div className="login-page-container">
      <canvas id="canvas"></canvas>
      <div className="login-form-wrapper">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div>
            <label>
              <input
                type="checkbox"
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              Show Password
            </label>
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit">Login</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default LoginPage;

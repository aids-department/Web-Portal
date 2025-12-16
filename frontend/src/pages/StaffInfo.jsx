import React from "react";

// Import images properly
import kanagarajImg from "../assets/staff/kanagaraj.jpg";
import shaliniImg from "../assets/staff/shalini.jpg";

export default function StaffInfo() {
  const staffData = [
    {
      name: "Mr. R. Kanagaraj",
      role: "Instructor",
      img: kanagarajImg,
    },
    {
      name: "Ms. K. Shalini",
      role: "Junior Assistant",
      img: shaliniImg,
    },
  ];

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#F5F6FA",
        padding: "40px 16px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "center",
          marginTop: "40px",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            fontWeight: "800",
            color: "#1A237E",
            marginBottom: "48px",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          Staff Information
        </h1>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "40px",
            justifyContent: "center",
          }}
        >
          {staffData.map((staff, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "#ffffff",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
                borderRadius: "16px",
                padding: "32px",
                width: "260px",
                textAlign: "center",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                border: "1px solid #e5e7eb",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px) scale(1.02)";
                e.currentTarget.style.boxShadow =
                  "0 20px 40px rgba(0, 0, 0, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 10px 30px rgba(0, 0, 0, 0.15)";
              }}
            >
              <div
                style={{
                  width: "160px",
                  height: "192px",
                  margin: "0 auto 24px",
                  overflow: "hidden",
                  borderRadius: "12px",
                  border: "2px solid #e5e7eb",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <img
                  src={staff.img}
                  alt={staff.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/160x192/4A5568/ffffff?text=No+Image";
                  }}
                />
              </div>

              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#1A237E",
                  marginBottom: "8px",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                {staff.name}
              </h2>

              <p
                style={{
                  fontSize: "16px",
                  color: "#6B7280",
                  margin: 0,
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                {staff.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

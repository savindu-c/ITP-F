import React, { useState } from "react";
import PageIntroduction from "../../components/PageIntroduction/PageIntroduction";
import "../../styles/pages/InventoryDashboard.css";
import AnalysisSection from "./AnalysisSection";
import EmployeeTable from "./EmployeeTable";
import AttendenceTable from "./AttendenceTable";
import axios from "axios";
import AddEmployeeForm from "./AddEmployee";
import AddGroup from "./AddGroup"; // Import AddGroup component
<<<<<<< HEAD
import { QrReader } from 'react-qr-reader';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../assets/logo.png";
=======
import { QrReader } from "react-qr-reader";
>>>>>>> 3d6573bb9d369238a35536264f4ca2021f7cce33
import GroupTable from "./GroupTable";

function EmployeeContent() {
  const [selectedTable, setSelectedTable] = useState("employees");
  const [showForm, setShowForm] = useState(false);
  const [showAddGroup, setShowAddGroup] = useState(false); // State to control Add Group component visibility

  const handleTableChange = (tableName) => {
    setSelectedTable(tableName);
  };

  const displayForm = () => {
    setShowForm(!showForm);
  };

  const toggleAddGroup = () => {
    setShowAddGroup(!showAddGroup); // Toggle the state to show/hide Add Group component
  };

  const handleScan = async (data) => {
    if (data) {
      setScannedData(data); // Set scanned data to state
      try {
        // Send scanned data to backend endpoint
        await axios.post("/api/employee/attendance", { scannedData: data });
      } catch (error) {
        console.error("Error sending scanned data to backend:", error);
      }
    }
  };

<<<<<<< HEAD
  const getpdf = () => {
    const table = document.querySelector("table"); // Assuming your table has 'table' tag
    const doc = new jsPDF("p", "pt", "a4");
  
    // Hide action column before taking the screenshot
    const actionColumn = table.querySelector(".actions");
    if (actionColumn) {
      actionColumn.style.display = "none";
    }
  
    // Add logo
    const img = new Image();
    img.src = logo; // Assuming 'logo' is imported as an image
    img.onload = () => {
      doc.addImage(img, "PNG", 40, 10, 120, 50); // Adjust the position and size as needed
      // Add table styling
      const columns = ["First Name", "Last Name", "Age", " Position", "Email"];
      const rows = table.querySelectorAll("tbody tr");
      const tableData = [];
      rows.forEach((row) => {
        const rowData = [];
        row.querySelectorAll("td").forEach((cell) => {
          rowData.push(cell.textContent.trim());
        });
        tableData.push(rowData);
      });
  
      doc.autoTable({
        head: [columns],
        body: tableData,
        startY: 120,
        theme: "grid",
        styles: {
          overflow: "linebreak",
          columnWidth: "wrap",
          font: "Arial",
          fontSize: 10,
          halign: "center",
          valign: "middle",
        },
      });
  
      // Show action column again
      if (actionColumn) {
        actionColumn.style.display = "table-cell";
      }
  
      // Save the PDF
      doc.save("emp_report.pdf");
    };
  };



=======
>>>>>>> 3d6573bb9d369238a35536264f4ca2021f7cce33
  return (
    <div className="dashboard">
      <PageIntroduction
        heading={selectedTable === "employees" ? "Employees" : "Attendance"}
        btname="Add Employee"
        handleClick={displayForm}
      />
      <AnalysisSection />
      <div className="navbar">
        <button
          type="button"
          className="button"
          onClick={() => handleTableChange("employees")}
        >
          Employees
        </button>
        <button
          type="button"
          className="button"
          onClick={() => {getpdf()}}
        >
          Report
        </button>
        <button
          type="button"
          className="button"
          onClick={() => handleTableChange("attendance")}
        >
          Attendance
        </button>
        <button type="button" className="button" onClick={() => handleScan()}>
          ScanQr
        </button>

        <button type="button" className="button" onClick={toggleAddGroup}>
          {" "}
          {/* Add onClick handler for Add Group button */}
          Add Group
        </button>

<<<<<<< HEAD
        <button type="button" className="button"  onClick={() => handleTableChange("group")}> 
          Groups       
=======
        <button
          type="button"
          className="button"
          onClick={() => handleTableChange("group")}
        >
          {" "}
          {/* Add onClick handler for Add Group button */}
          Groups{" "}
>>>>>>> 3d6573bb9d369238a35536264f4ca2021f7cce33
        </button>
        {/*<QrReader
          onScan={handleScan}
          onResult={(result, error) => {
            if (!!result) {
              setData(result?.text);
            }
  
            if (!!error) {
              console.info(error);
            }
          }}
          style={{ width: '100%' }}
        />*/}
      </div>
      {selectedTable === "employees" && <EmployeeTable />}
      {selectedTable === "attendance" && <AttendenceTable />}
      {selectedTable === "group" && <GroupTable />}
<<<<<<< HEAD

=======
>>>>>>> 3d6573bb9d369238a35536264f4ca2021f7cce33
      {showForm && (
        <div className="formcontainer ">
          <AddEmployeeForm closeForm={displayForm} />
        </div>
      )}
      {showAddGroup && (
        <AddGroup
          close={() => {
            toggleAddGroup();
          }}
        />
      )}{" "}
      {/* Render AddGroup component if showAddGroup state is true */}
    </div>
  );
}

export default EmployeeContent;

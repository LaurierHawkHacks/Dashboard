import React, { useEffect, useState } from "react";
import { wrapper } from "@/styles/spacing";
import { hackerApplications } from "@/interfaces/fb-int";
import { Timestamp } from "firebase/firestore";

const Home = () => {
    const [tableData, setTableData] = useState<Map<String, hackerApplications>>(
        new Map()
    );

    const hacker1: hackerApplications = {
        applicantId: "IDK MAN?",
        applicationDate: Timestamp.now(),
        hackathonTerm: "F23",
        notifyByEmail: true,
        notifyBySMS: false,
        inAcceptedList: true,
        finalDecision: "accepted",
        type: "hacker",
    };
    const hacker2: hackerApplications = {
        applicantId: "IDK MAN123?",
        applicationDate: Timestamp.now(),
        hackathonTerm: "W23",
        notifyByEmail: true,
        notifyBySMS: false,
        inAcceptedList: true,
        finalDecision: "rejected",
        type: "hacker",
    };

    useEffect(() => {
        const map: Map<String, hackerApplications> = new Map();
        map.set(hacker1.applicantId, hacker1);
        map.set(hacker2.applicantId, hacker2);
        setTableData(map);
        console.log(map);
    }, []);

    // Styles
    const tableBorder: React.CSSProperties = {
        border: "1px solid black",
    };

    const tableColumns: React.CSSProperties = {
        backgroundColor: "aqua",
        paddingLeft: "20px",
        paddingRight: "20px",
        border: "1px solid black",
    };

    const tableHeaderColumns: React.CSSProperties = {
        backgroundColor: "royalblue",
        paddingLeft: "20px",
        paddingRight: "20px",
        border: "1px solid black",
    };

    // Map through tableData - making a row per entry
    const tableRows: JSX.Element[] = tableData
        ? Array.from(tableData).map(([key, hacker], index) => (
              <tr key={index}>
                  <td style={tableColumns}>
                      <input type="checkbox" />
                  </td>
                  <td style={tableColumns}>{hacker.applicantId}</td>
                  <td style={tableColumns}>
                      {hacker.applicationDate.toDate().toString()}
                  </td>
                  <td style={tableColumns}>{hacker.hackathonTerm}</td>
                  <td style={tableColumns}>
                      {hacker.notifyByEmail ? "True" : "False"}
                  </td>
                  <td style={tableColumns}>
                      {hacker.notifyBySMS ? "True" : "False"}
                  </td>
                  <td style={tableColumns}>
                      {hacker.inAcceptedList ? "True" : "False"}
                  </td>
                  <td style={tableColumns}>{hacker.finalDecision}</td>
                  <td style={tableColumns}>{hacker.type}</td>
              </tr>
          ))
        : [];

    //     ((hacker, index) => {
    //       return (
    //   <tr key={index}>
    //       <td style={tableColumns}>
    //           <input type="checkbox" />
    //       </td>
    //       <td style={tableColumns}>{hacker.applicantId}</td>
    //       <td style={tableColumns}>
    //           {hacker.applicationDate + ""}
    //       </td>
    //       <td style={tableColumns}>{hacker.hackathonTerm}</td>
    //       <td style={tableColumns}>
    //           {hacker.notifyByEmail ? "True" : "False"}
    //       </td>
    //       <td style={tableColumns}>
    //           {hacker.notifyBySMS ? "True" : "False"}
    //       </td>
    //       <td style={tableColumns}>
    //           {hacker.inAcceptedList ? "True" : "False"}
    //       </td>
    //       <td style={tableColumns}>{hacker.finalDecision}</td>
    //       <td style={tableColumns}>{hacker.type}</td>
    //   </tr>
    //       );
    //   })

    return (
        <div style={wrapper}>
            <div>
                <h1>Table stuff</h1>
                <table style={tableBorder}>
                    <tr>
                        <th style={tableHeaderColumns}>Select/De-Select</th>
                        <th style={tableHeaderColumns}>Applicant ID</th>
                        <th style={tableHeaderColumns}>Application Date</th>
                        <th style={tableHeaderColumns}>Hackathon Term</th>
                        <th style={tableHeaderColumns}>Notify By Email</th>
                        <th style={tableHeaderColumns}>Notify By SMS</th>
                        <th style={tableHeaderColumns}>Accepted?</th>
                        <th style={tableHeaderColumns}>Final Decision</th>
                        <th style={tableHeaderColumns}>Type</th>
                    </tr>
                    {tableRows}
                </table>
            </div>
        </div>
    );
};
export default Home;

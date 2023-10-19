import React, { useState, useEffect } from "react";
import { fetchData } from "../api/api";
import Card from "./Card";

function KanbanBoard() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupingOption, setGroupingOption] = useState(localStorage.getItem("groupingOption") || "user");
  const [sortingOption, setSortingOption] = useState(localStorage.getItem("sortingOption") || "priority");

  const priority = ["Urgent", "High", "Medium", "Low", "No priority"];
  let available = false;

  useEffect(() => {
    fetchData().then((data) => {
      setTickets(data.tickets);
      setUsers(data.users);
    });
  }, []);

  const groupAndSortTickets = (tickets, groupingOption, sortingOption) => {

    // Saving state on referesh
    localStorage.setItem("groupingOption", groupingOption);
    localStorage.setItem("sortingOption", sortingOption);

    // Grouping logic
    const groupedTickets = {};
    tickets.forEach((ticket) => {
      const groupKey =
        groupingOption === "status"
          ? ticket.status
          : groupingOption === "user"
            ? (ticket.userId
              ? users.find((user) => {
                return user.id === ticket.userId;
              })
              : ""
            ).name
            : groupingOption === "priority"
              ? ticket.priority
              : "Other";

      if (!groupedTickets[groupKey]) {
        groupedTickets[groupKey] = [];
      }
      groupedTickets[groupKey].push(ticket);
    });

    // Sorting logic
    Object.keys(groupedTickets).forEach((groupKey) => {
      groupedTickets[groupKey].sort((a, b) => {
        if (sortingOption === "priority") {
          return b.priority - a.priority;
        } else if (sortingOption === "title") {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
    });

    return groupedTickets;
  };

  const groupedAndSortedTickets = groupAndSortTickets(
    tickets,
    groupingOption,
    sortingOption
  );
    console.log(groupedAndSortedTickets);
  const getStatusImgPath = (status) => {
    status = status.toLowerCase().replace(/\s+/g, '-')
    return `./images/logos/status/${status}.png`;
  }

  const getImagePath = (userName) => {
    const user = users.find((user) => {
      return user.name === userName;
    })
    console.log(user);
    available = user.available;

    return `./images/users/${user.id}.jpg`
  }

  const getPriorityImgPath = (priority) => {
    return `./images/logos/priorities/${priority}.png`;
  }

  return (
    <div className="kanban-board">

      {/* NAVBAR SECTION  */}
      <nav className="navbar navbar-expand-lg bg-light mb-3">
        <div className="container-fluid">
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item dropdown">
                <span
                  className="dropdown-toggle btn btn-light"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fa fa-sliders pe-1"></i>
                  Display
                </span>
                <ul className="dropdown-menu w-200">
                  <li>
                    <div className="d-flex justify-content-between">
                      <p className="dropdown-item align-self-center" href="#">
                        Grouping
                      </p>
                      <select
                        value={groupingOption}
                        onChange={(e) => setGroupingOption(e.target.value)}
                        className="form-select m-2"
                      >
                        <option value="status">Status</option>
                        <option value="user">User</option>
                        <option value="priority">Priority</option>
                      </select>
                    </div>
                  </li>
                  <li>
                    <div className="d-flex justify-content-between">
                      <p className="dropdown-item align-self-center" href="#">
                        Ordering
                      </p>
                      <select
                        value={sortingOption}
                        onChange={(e) => setSortingOption(e.target.value)}
                        className="form-select m-2"
                      >
                        <option value="priority">Priority</option>
                        <option value="title">Title</option>
                      </select>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* MAIN SECTION */}
      <div className="d-flex justify-content-evenly">
        {groupedAndSortedTickets &&
          Object.keys(groupedAndSortedTickets).map((group) => (
            <div key={group} className="group col-sm-2">
              {/* GROUP HEADER SECTION*/}
              <div className="group-header mb-3 d-flex justify-content-between">
                <div className="group-title d-flex">
                  {groupingOption === "status" && (
                    <div className="d-flex ps-1">
                      <img src={getStatusImgPath(group)} alt="" className="me-2" width="36px" />
                      <h6 className="pe-2 mt-2">{group}</h6>
                    </div>
                  )}
                  {groupingOption === "user" && (
                    <div className="d-flex ps-1">
                      <div className="img-section me-2">
                        <div className="user-img">
                          <img src={getImagePath(group)} alt="" width="36px" className='rounded-circle' />
                          {available ?
                            <div className="available-status">
                              {/* <img src={img} alt="" /> */}
                              <i className="fa fa-circle text-success" aria-hidden="true"></i>
                            </div>
                            :
                            <div className="available-status">
                              {/* <img src={img} alt="" /> */}
                              <i className="fa fa-circle text-secondary" aria-hidden="true"></i>
                            </div>}
                        </div>
                      </div>
                      <h6 className="mt-2" >{group}</h6>
                    </div>
                  )}
                  {groupingOption === "priority" && (
                    <div className="d-flex ps-1">
                      <img src={getPriorityImgPath(group)} alt="" className="me-2" width="36px" />
                      <h6 className="pe-2 mt-2" >{priority[group]}</h6>
                    </div>
                  )}
                  <span className="ps-2 pb-1 mt-1 align-self-center text-muted">{groupedAndSortedTickets[group].length}</span>
                </div>
                <div className="header-options me-1 d-flex">
                  <i className="fa fa-plus pe-3 text-secondary align-self-center"></i>
                  <i className="fa fa-list pe-2 text-secondary align-self-center"></i>
                </div>
              </div>
              {/* CARDS SECTION */}
              <div className="cards">
                {groupedAndSortedTickets[group].map((ticket) => (
                  <Card
                    key={ticket.id}
                    ticket={ticket}
                    users={users}
                    groupingOption={groupingOption}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default KanbanBoard;

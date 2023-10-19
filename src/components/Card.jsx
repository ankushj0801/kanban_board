import React from "react";

function Card({ ticket, users, groupingOption }) {
  let available = false;
  const getStatusImgPath = (status) => {
    status = status.toLowerCase().replace(/\s+/g, '-')
    return `./images/logos/status/${status}.png`;
  }
  const getPriorityImgPath = (priority) => {
    return `./images/logos/priorities/${priority}.png`;
  }
  const getImagePath = (userID) => {
    const user = users.find((user) => {
      return user.id === userID;
    });
    console.log(user);
    available = user.available;

    return `./images/users/${userID}.jpg`;
  };

  return (
    <div className="card mb-3 shadow p-3 mb-5 bg-white rounded">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-centre mb-2">
          <div className="id align-self-center">
            <span>{ticket.id}</span>
          </div>
          {groupingOption !== "user" && (
            <div className="img-section">
              <div className="user-img">
                <img
                  src={getImagePath(ticket.userId)}
                  alt=""
                  width="36px"
                  className="rounded-circle"
                />
                {available ? (
                  <div className="available-status">
                    <i className="fa fa-circle text-success" aria-hidden="true"></i>
                  </div>
                ) : (
                  <div className="available-status">
                    <i className="fa fa-circle text-secondary" aria-hidden="true"></i>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="title-section d-flex">
          {groupingOption !=="status" && (
            <div className="pe-1">
              <img src={getStatusImgPath(ticket.status)} alt="" width="20px" />
            </div>
          )}
          <p className="fw-bold">{ticket.title}</p>
        </div>
        <div className="feature-request d-flex align-items-center p-1">
          {groupingOption !=="priority" && (
              <div className="pe-2">
                <img src={getPriorityImgPath(ticket.priority)} alt="" width="16px" />
              </div>
          )}
          <i className="fa fa-circle pe-2 text-secondary" aria-hidden="true"></i>
          <p className="m-0">{ticket.tag}</p>
        </div>
      </div>
    </div>
  );
}

export default Card;

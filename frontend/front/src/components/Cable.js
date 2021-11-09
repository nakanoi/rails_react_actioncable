import React, { useEffect } from "react";


const Cable = (props) => {
  useEffect(() => {
    const token = window.location.href.split('/').slice(-1)[0];
    props.getCurrentRoom();
    props.Cable.room = props.Cable.cable.subscriptions.create(
      {
        channel: 'RoomsChannel',
        token: token,
      },
      {
        received: (updateRoom) => {
          props.setCurrentRoom(updateRoom);
        }
      }
    )
  }, []);

  return <React.Fragment></React.Fragment>
};

export default Cable;

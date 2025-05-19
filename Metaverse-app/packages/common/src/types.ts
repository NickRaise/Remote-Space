// User responses

export interface IUserSpaceJoinRequestPayload {
  spaceId: string;
  token: string;
}

export interface IUserMoveRequestPayload {
  x: number;
  y: number;
}

// WS server responses

export interface ISpaceJoinedResponse {
  type: "space-join";
  payload: {
    spaceId: string;
    userId: string;
    spawn: {
      x: number;
      y: number;
    };
    users: { id: string }[];
  };
}

export interface IUserMovementRejected {
  payload: {
    x: number;
    y: number;
  };
}

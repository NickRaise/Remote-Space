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
  type: "space-joined";
  payload: {
    spaceId: string;
    userId: string;
    spawn: {
      x: number;
      y: number;
    };
    users: {
      id: string;
      position: {
        x: number;
        y: number;
      };
    }[];
  };
}

export interface IUserMoveResponse {
  type: "movement";
  payload: {
    x: number;
    y: number;
    userId: string;
  };
}

export interface IUserMovementRejected {
  type: "movement-rejected";
  payload: {
    x: number;
    y: number;
  };
}

export interface IUserLeftResponse {
  type: "user-left";
  payload: {
    userId: string;
  };
}

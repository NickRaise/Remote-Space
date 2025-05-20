import { RoomManager } from "../RoomManager";
import {
  ISpaceJoinedResponse,
  IUserLeftResponse,
  IUserMovementRejected,
  IUserMoveRequestPayload,
  IUserMoveResponse,
  IUserSpaceJoinRequestPayload,
} from "@repo/common/ws-types";

import type { User } from "../User";
import Prisma from "@repo/db/client";
import { verifyUser } from "../utils";

const roomManager = RoomManager.getInstance();

export const userJoinEvent = async (
  payload: IUserSpaceJoinRequestPayload,
  user: User
) => {
  const userMetadata = verifyUser(payload.token);

  if (!userMetadata) {
    user.send({
      type: "error",
      payload: {
        reason: "Invalid token",
      },
    });
    user.ws.close();
    return;
  }

  user.userId = userMetadata?.userId;

  const spaceId = payload.spaceId;

  const space = await Prisma.space.findUnique({
    where: {
      id: spaceId,
    },
  });

  if (!space) {
    user.send({
      type: "error",
      payload: {
        reason: "Space not found",
      },
    });
    user.ws.close();
    return;
  }

  user.spaceId = space.id;

  user.x = Math.floor(Math.random() * space.width);
  user.y = Math.floor(Math.random() * space.height);

  roomManager.addUser(spaceId, user);

  const spaceJoinedResponse: ISpaceJoinedResponse = {
    type: "space-joined",
    payload: {
      spaceId: spaceId,
      userId: user.id,
      spawn: {
        x: user.x,
        y: user.y,
      },
      users:
        RoomManager.getInstance()
          .rooms.get(spaceId)
          ?.filter((u) => u.id !== user.id)
          .map((u) => ({ id: u.id })) ?? [],
    },
  };

  user.send(spaceJoinedResponse);

  const broadcastMessage = {
    type: "user-joined",
    payload: {
      userId: user.userId,
      x: user.x,
      y: user.y,
    },
  };

  roomManager.broadcast(broadcastMessage, user, user.spaceId);
};

export const userMoveEvent = async (
  payload: IUserMoveRequestPayload,
  user: User
) => {
  if (!user.userId || !user.spaceId) {
    user.send({
      type: "error",
      payload: {
        reason: "Invalid token or space",
      },
    });
    user.ws.close();
    return;
  }

  const moveX = payload.x;
  const moveY = payload.y;

  const xDisplacement = Math.abs(user.x! - moveX);
  const yDisplacement = Math.abs(user.y! - moveY);

  // Do not allow the user to move diagonally
  if (
    (xDisplacement == 1 && yDisplacement == 0) ||
    (yDisplacement == 1 && xDisplacement == 0)
  ) {
    (user.x = moveX), (user.y = moveY);

    const movementSuccessMessage: IUserMoveResponse = {
      type: "movement",
      payload: {
        x: user.x,
        y: user.y,
        userId: user.id,
      },
    };

    RoomManager.getInstance().broadcast(
      movementSuccessMessage,
      user,
      user.spaceId
    );
  } else {
    const movementRejectedMessage: IUserMovementRejected = {
      type: "movement-rejected",
      payload: {
        x: user.x!,
        y: user.y!,
      },
    };

    user.send(movementRejectedMessage);
  }
};

export const removeUser = (user: User) => {
  if (!user.spaceId || !user.userId) return;

  const broadcastMessage: IUserLeftResponse = {
    type: "user-left",
    payload: {
      userId: user.userId,
    },
  };

  roomManager.broadcast(broadcastMessage, user, user.spaceId);
  roomManager.removeUser(user, user.spaceId);
};

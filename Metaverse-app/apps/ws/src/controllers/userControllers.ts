import { RoomManager } from "../RoomManager";
import {
  ISpaceJoinedResponse,
  IUserMoveRequestPayload,
  IUserSpaceJoinRequestPayload,
} from "../types";
import type { User } from "../User";
import Prisma from "@repo/db/client";

export const userJoinEvent = async (
  payload: IUserSpaceJoinRequestPayload,
  user: User
) => {
  const spaceId = payload.spaceId;

  const space = await Prisma.space.findUnique({
    where: {
      id: spaceId,
    },
  });

  if (!space) {
    user.ws.close();
    return;
  }

  user.spaceId = space.id;

  user.x = Math.floor(Math.random() * space.width);
  user.y = Math.floor(Math.random() * space.height);

  RoomManager.getInstance().addUser(spaceId, user);

  const spaceJoinedResponse: ISpaceJoinedResponse = {
    type: "space-join",
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
          ?.map((u) => ({ id: u.id })) ?? [],
    },
  };

  user.send(spaceJoinedResponse);

  const broadcastMessage = {
    type: "user-join",
    payload: {
      userId: user.id,
      x: user.x,
      y: user.y,
    },
  };

  RoomManager.getInstance().broadcast(broadcastMessage, user, user.spaceId);
};

export const userMoveEvent = async (
  payload: IUserMoveRequestPayload,
  user: User
) => {
  const moveX = payload.x;
  const moveY = payload.y;

  const xDisplacement = Math.abs(user.x! - moveX);
  const yDisplacement = Math.abs(user.y! - moveY);

  // Do not allow the user to move diagonally
  if (
    (xDisplacement > 1 && yDisplacement == 0) ||
    (yDisplacement > 1 && xDisplacement == 0)
  ) {
    (user.x = moveX), (user.y = moveY);

    const movementSuccessMessage = {
      type: "move",
      payload: {
        x: user.x,
        y: user.y,
      },
    };

    RoomManager.getInstance().broadcast(
      movementSuccessMessage,
      user,
      user.spaceId!
    );
  } else {
    const movementRejectedMessage = {
      type: "movement-rejected",
      payload: {
        x: user.x,
        y: user.y,
      },
    };

    RoomManager.getInstance().broadcast(
      movementRejectedMessage,
      user,
      user.spaceId!
    );
  }
};

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

  user.userId = userMetadata.userId;

  const spaceId = payload.spaceId;

  const space = await Prisma.space.findUnique({
    where: {
      id: spaceId,
    },
    include: {
      spaceElements: {
        include: {
          element: true,
        },
      },
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

  // Verification so user don't spawn on objects
  // Step 1: Store all blocked tiles
  const blockedTiles = new Set<string>();
  space.spaceElements.forEach((e) => {
    if (e.element.static) {
      const startX = e.x;
      const endX = e.x + e.element.width;
      const startY = e.y;
      const endY = e.y + e.element.height;

      for (let x = startX; x < endX; x++) {
        for (let y = startY; y < endY; y++) {
          blockedTiles.add(`${x},${y}`);
        }
      }
    }
  });

  // Step 2: Find unblocked tiles
  const validPositions: { x: number; y: number }[] = [];
  for (let x = 0; x < space.width; x++) {
    for (let y = 0; y < space.height; y++) {
      if (!blockedTiles.has(`${x},${y}`)) {
        validPositions.push({ x, y });
      }
    }
  }

  // CLose connection if no valid block
  if (validPositions.length === 0) {
    user.send({
      type: "error",
      payload: {
        reason: "No available spawn positions",
      },
    });
    user.ws.close();
    return;
  }

  // Step 3: Pick a random spawn one
  const spawn =
    validPositions[Math.floor(Math.random() * validPositions.length)]!;
  user.x = spawn.x;
  user.y = spawn.y;

  roomManager.addUser(spaceId, user);

  const spaceJoinedResponse: ISpaceJoinedResponse = {
    type: "space-joined",
    payload: {
      spaceId: spaceId,
      userId: user.userId,
      spawn: {
        x: user.x,
        y: user.y,
      },
      users:
        RoomManager.getInstance()
          .rooms.get(spaceId)
          ?.filter((u) => u.id !== user.id)
          .map((u) => ({ id: u.userId!, position: { x: u.x!, y: u.y! } })) ??
        [],
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

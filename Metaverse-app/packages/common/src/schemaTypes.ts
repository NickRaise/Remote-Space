export type Element = {
  imageUrl: string;
  width: number;
  height: number;
  static: boolean;
  id: string;
};

export type Avatar = {
  name: string | null;
  id: string;
  imageUrlId: string;
};

export type AvatarImage = {
  id: string;
  standingDown: string;
  walkingDown1: string;
  walkingDown2: string;
  standingLeft: string;
  walkingLeft1: string;
  walkingLeft2: string;
  standingRight: string;
  walkingRight1: string;
  walkingRight2: string;
  standingUp: string;
  walkingUp1: string;
  walkingUp2: string;
};

export type Map = {
  width: number;
  height: number;
  name: string;
  id: string;
  thumbnail: string;
};

export type Space = {
  id: string;
  name: string;
  dimensions: string;
  thumbnail?: string;
  creatorId: string;
  spaceElements: SpaceElement[];
};

export type SpaceElement = {
  id: string;
  elementId: string;
  element: Element;
  spaceId: string;
  x: number;
  y: number;
};

export interface NOTE {
  _id?: string;
  text?: string;
  _author?: {
    firstName?: string;
    lastName?: string;
    _id?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

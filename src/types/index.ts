interface User {
  username: string;
  fid: number;
  count: number;
  address: string;
  price: number;
}

export interface Profile {
  user: User;
}

export interface UserData {
  username: string;
  name: string;
  bio: string;
  followers: number;
  image: string;
  count: number;
}

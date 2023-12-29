import { BaseStorage, createStorage, StorageType } from '@src/shared/storages/base';

interface User {
  access_token?: string;
  user?: {
    login: string;
    expires_in: number;
    user_id: string;
    color?: string;
  };
}

type UserStorage = BaseStorage<User> & {
  signOut: () => void;
};

const storage = createStorage<User>(
  'user',
  {},
  {
    storageType: StorageType.Local,
    liveUpdate: true,
  },
);

const userStorage: UserStorage = {
  ...storage,
  signOut: async () => {
    await storage.set({
      access_token: undefined,
      user: undefined,
    });
  },
};

export default userStorage;

import * as bcrypt from 'bcrypt';

const hashPassword = async (password: string) => {
  return bcrypt.hash(password, await bcrypt.genSalt(10));
};

const comparePassword = (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

const omit = <T extends object, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, K> => {
  const o = { ...obj };

  [...new Set(keys)].forEach((key) => delete o[key]);

  return o as Omit<T, K>;
};

export { hashPassword, comparePassword, omit };
